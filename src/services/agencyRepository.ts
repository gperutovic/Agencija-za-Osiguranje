import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storageKey } from '../config/brand';
import {
  AdvisorThreadMessage,
  AiEscalationRecord,
  ClaimAttachment,
  ClaimRecord,
  ClaimStage,
  ComplaintRecord,
  PolicyEndorsement,
  PolicyRecord,
  QuotePipelineStatus,
  QuoteSubmission,
  SwitchAnalysisRecord,
  TrackedClaimPublic,
  UserProfile,
} from '../types/domain';
import { addDaysIso } from '../utils/formatters';
import {
  firebaseAuth,
  firebaseStorage,
  firestoreDb,
  getOptionalAppCheckToken,
  IS_DEMO_MODE,
  sanitizeForFirestore,
  USE_FIREBASE_EMULATORS,
} from './firebase';
import {
  SEED_CLAIMS,
  SEED_COMPLAINTS,
  SEED_ESCALATIONS,
  SEED_MESSAGES,
  SEED_POLICIES,
  SEED_QUOTES,
  SEED_SWITCH_ANALYSES,
  SEED_USERS,
} from './seedData';

const API_BASE = ((import.meta.env.VITE_API_BASE_URL as string | undefined) || '').replace(/\/$/, '');

const USE_LOCAL_DEMO_STORE = IS_DEMO_MODE && !USE_FIREBASE_EMULATORS;

const DEMO_KEYS = {
  quotes: storageKey('demo_quotes_v2'),
  switches: storageKey('demo_switches_v2'),
  policies: storageKey('demo_policies_v2'),
  claims: storageKey('demo_claims_v2'),
  escalations: storageKey('demo_escalations_v2'),
  messages: storageKey('demo_messages_v2'),
  complaints: storageKey('demo_complaints_v2'),
  users: storageKey('demo_users_v2'),
} as const;

export class RepositoryError extends Error {
  readonly code: string;
  constructor(message: string, code = 'repository/unknown') {
    super(message);
    this.name = 'RepositoryError';
    this.code = code;
  }
}

function mapFirestoreError(err: unknown, fallbackHr: string): RepositoryError {
  const code =
    typeof err === 'object' && err !== null && 'code' in err
      ? String((err as { code?: unknown }).code)
      : 'unknown';
  if (code === 'permission-denied') {
    return new RepositoryError(
      'Nemate ovlasti za ovu radnju ili podaci ne zadovoljavaju sigurnosna pravila. Provjerite prijavu i pokušajte ponovno.',
      code
    );
  }
  if (code === 'unavailable' || code === 'network-request-failed') {
    return new RepositoryError(
      'Veza sa poslužiteljem je privremeno nedostupna. Provjerite internetsku vezu i pokušajte ponovno.',
      code
    );
  }
  if (code === 'failed-precondition') {
    return new RepositoryError(
      'Sustav priprema indeks baze podataka. Pokušajte ponovno za nekoliko trenutaka.',
      code
    );
  }
  return new RepositoryError(fallbackHr, code);
}

function readDemoStore<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return [...fallback];
    }
    return JSON.parse(raw) as T[];
  } catch {
    return [...fallback];
  }
}

function writeDemoStore<T>(key: string, items: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // ignore private-mode quota error in dev demo store
  }
}

function makeRef(prefix: string): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${new Date().getFullYear()}-${num}`;
}

function sanitizeFileName(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100);
}

/**
 * Generates a small (< 45 KB) JPEG preview thumbnail in-browser so Firestore documents
 * NEVER store multi-megabyte base64 blobs while full media lives in Cloud Storage.
 */
async function createTinyThumbnailDataUrl(file: File): Promise<string | undefined> {
  if (!file.type.startsWith('image/') || typeof document === 'undefined') {
    return undefined;
  }
  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('read error'));
      reader.readAsDataURL(file);
    });
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('image decode error'));
      el.src = dataUrl;
    });

    const maxDim = 280;
    const scale = Math.min(1, maxDim / Math.max(img.width || 1, img.height || 1));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const thumb = canvas.toDataURL('image/jpeg', 0.62);
    return thumb.length <= 60_000 ? thumb : undefined;
  } catch {
    return undefined;
  }
}

async function buildAuthApiHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  try {
    const idToken = await firebaseAuth.currentUser?.getIdToken();
    if (idToken) headers.Authorization = `Bearer ${idToken}`;
  } catch {
    // ignore
  }
  const appCheckToken = await getOptionalAppCheckToken();
  if (appCheckToken) headers['X-Firebase-AppCheck'] = appCheckToken;
  return headers;
}

export const ALLOWED_NEXT_CLAIM_STAGE: Record<ClaimStage, ClaimStage | null> = {
  received: 'insurer_review',
  insurer_review: 'assessment',
  assessment: 'paid',
  paid: null,
};

export interface AdminQueuesSnapshot {
  quotes: QuoteSubmission[];
  switches: SwitchAnalysisRecord[];
  escalations: AiEscalationRecord[];
  policies: PolicyRecord[];
  claims: ClaimRecord[];
  complaints: ComplaintRecord[];
  messages: AdvisorThreadMessage[];
  users: UserProfile[];
}

export interface ClientWorkspaceSnapshot {
  policies: PolicyRecord[];
  claims: ClaimRecord[];
  quotes: QuoteSubmission[];
  messages: AdvisorThreadMessage[];
}

export const agencyRepository = {
  // --- USERS ---
  async getUsers(): Promise<UserProfile[]> {
    if (USE_LOCAL_DEMO_STORE) {
      return readDemoStore<UserProfile>(DEMO_KEYS.users, SEED_USERS);
    }
    try {
      const snap = await getDocs(query(collection(firestoreDb, 'users'), limit(200)));
      return snap.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<UserProfile, 'uid'>) }));
    } catch (err) {
      throw mapFirestoreError(err, 'Nije moguće učitati popis korisnika.');
    }
  },

  async updateUserProfile(
    uid: string,
    patch: Partial<Pick<UserProfile, 'fullName' | 'phone' | 'oib' | 'address' | 'city' | 'postalCode'>>
  ): Promise<void> {
    const updatedAt = new Date().toISOString();
    const cleaned = sanitizeForFirestore({ ...patch, updatedAt });
    if (USE_LOCAL_DEMO_STORE) {
      const users = readDemoStore<UserProfile>(DEMO_KEYS.users, SEED_USERS);
      writeDemoStore(
        DEMO_KEYS.users,
        users.map((u) => (u.uid === uid ? { ...u, ...cleaned } : u))
      );
      return;
    }
    try {
      await updateDoc(doc(firestoreDb, 'users', uid), cleaned);
    } catch (err) {
      throw mapFirestoreError(err, 'Spremanje korisničkog profila nije uspjelo.');
    }
  },

  // --- QUOTES ---
  async getQuotes(userId?: string): Promise<QuoteSubmission[]> {
    if (USE_LOCAL_DEMO_STORE) {
      const all = readDemoStore<QuoteSubmission>(DEMO_KEYS.quotes, SEED_QUOTES);
      return userId ? all.filter((q) => q.userId === userId) : all;
    }
    try {
      const colRef = collection(firestoreDb, 'quotes');
      const qRef = userId
        ? query(colRef, where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(100))
        : query(colRef, orderBy('createdAt', 'desc'), limit(200));
      const snap = await getDocs(qRef);
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<QuoteSubmission, 'id'>) }));
    } catch (err) {
      throw mapFirestoreError(err, 'Nije moguće učitati upite za ponude.');
    }
  },

  async createQuote(
    input: Omit<QuoteSubmission, 'id' | 'referenceNumber' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<QuoteSubmission> {
    const now = new Date().toISOString();
    const record: QuoteSubmission = sanitizeForFirestore({
      ...input,
      userId: firebaseAuth.currentUser?.uid ?? (USE_LOCAL_DEMO_STORE ? input.userId : undefined),
      id: `quote-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      referenceNumber: makeRef('PON'),
      status: 'new',
      createdAt: now,
      updatedAt: now,
    });

    if (USE_LOCAL_DEMO_STORE) {
      const existing = readDemoStore<QuoteSubmission>(DEMO_KEYS.quotes, SEED_QUOTES);
      writeDemoStore(DEMO_KEYS.quotes, [record, ...existing]);
      return record;
    }

    try {
      await setDoc(doc(firestoreDb, 'quotes', record.id), record);
      return record;
    } catch (err) {
      throw mapFirestoreError(err, 'Slanje zahtjeva za ponudu nije uspjelo. Pokušajte ponovno.');
    }
  },

  async updateQuotePipeline(
    quoteId: string,
    patch: { status?: QuotePipelineStatus; assignedAgent?: string; notes?: string; policyId?: string }
  ): Promise<void> {
    const now = new Date().toISOString();
    const cleaned = sanitizeForFirestore({ ...patch, updatedAt: now });
    if (USE_LOCAL_DEMO_STORE) {
      const items = readDemoStore<QuoteSubmission>(DEMO_KEYS.quotes, SEED_QUOTES);
      writeDemoStore(
        DEMO_KEYS.quotes,
        items.map((q) => (q.id === quoteId ? { ...q, ...cleaned } : q))
      );
      return;
    }
    try {
      await updateDoc(doc(firestoreDb, 'quotes', quoteId), cleaned);
    } catch (err) {
      throw mapFirestoreError(err, 'Ažuriranje statusa ponude nije uspjelo.');
    }
  },

  // --- SWITCH & SAVE ANALYSES ---
  async getSwitchAnalyses(userId?: string): Promise<SwitchAnalysisRecord[]> {
    if (USE_LOCAL_DEMO_STORE) {
      const all = readDemoStore<SwitchAnalysisRecord>(DEMO_KEYS.switches, SEED_SWITCH_ANALYSES);
      return userId ? all.filter((s) => s.userId === userId) : all;
    }
    try {
      const colRef = collection(firestoreDb, 'switch_analyses');
      const qRef = userId
        ? query(colRef, where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(100))
        : query(colRef, orderBy('createdAt', 'desc'), limit(200));
      const snap = await getDocs(qRef);
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SwitchAnalysisRecord, 'id'>) }));
    } catch (err) {
      throw mapFirestoreError(err, 'Nije moguće učitati Switch & Save analize.');
    }
  },

  async saveSwitchAnalysis(
    input: Omit<SwitchAnalysisRecord, 'id' | 'referenceNumber' | 'createdAt' | 'status'>
  ): Promise<SwitchAnalysisRecord> {
    const now = new Date().toISOString();
    const record: SwitchAnalysisRecord = sanitizeForFirestore({
      ...input,
      userId: firebaseAuth.currentUser?.uid ?? (USE_LOCAL_DEMO_STORE ? input.userId : undefined),
      id: `sw-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      referenceNumber: makeRef('USP'),
      status: 'new',
      createdAt: now,
      updatedAt: now,
    });

    if (USE_LOCAL_DEMO_STORE) {
      const existing = readDemoStore<SwitchAnalysisRecord>(DEMO_KEYS.switches, SEED_SWITCH_ANALYSES);
      writeDemoStore(DEMO_KEYS.switches, [record, ...existing]);
      return record;
    }

    try {
      await setDoc(doc(firestoreDb, 'switch_analyses', record.id), record);
      return record;
    } catch (err) {
      throw mapFirestoreError(err, 'Spremanje analize police nije uspjelo. Pokušajte ponovno.');
    }
  },

  async updateSwitchStatus(
    analysisId: string,
    patch: { status?: QuotePipelineStatus; assignedAgent?: string; notes?: string }
  ): Promise<void> {
    const cleaned = sanitizeForFirestore({ ...patch, updatedAt: new Date().toISOString() });
    if (USE_LOCAL_DEMO_STORE) {
      const items = readDemoStore<SwitchAnalysisRecord>(DEMO_KEYS.switches, SEED_SWITCH_ANALYSES);
      writeDemoStore(
        DEMO_KEYS.switches,
        items.map((item) => (item.id === analysisId ? { ...item, ...cleaned } : item))
      );
      return;
    }
    try {
      await updateDoc(doc(firestoreDb, 'switch_analyses', analysisId), cleaned);
    } catch (err) {
      throw mapFirestoreError(err, 'Ažuriranje Switch & Save predmeta nije uspjelo.');
    }
  },

  // --- POLICIES ---
  async getPolicies(userId?: string): Promise<PolicyRecord[]> {
    if (USE_LOCAL_DEMO_STORE) {
      const all = readDemoStore<PolicyRecord>(DEMO_KEYS.policies, SEED_POLICIES);
      return userId ? all.filter((p) => p.userId === userId) : all;
    }
    try {
      const colRef = collection(firestoreDb, 'policies');
      const qRef = userId
        ? query(colRef, where('userId', '==', userId), orderBy('expiryDate', 'asc'), limit(100))
        : query(colRef, orderBy('expiryDate', 'asc'), limit(250));
      const snap = await getDocs(qRef);
      return snap.docs.map((d) => {
        const data = d.data() as Omit<PolicyRecord, 'id'>;
        return {
          ...data,
          id: d.id,
          endorsements: data.endorsements ?? [],
        };
      });
    } catch (err) {
      throw mapFirestoreError(err, 'Nije moguće učitati police osiguranja.');
    }
  },

  async uploadPolicyFile(policyId: string, ownerUid: string, file: File): Promise<{ storagePath: string; storageUrl: string }> {
    const safeName = sanitizeFileName(file.name);
    const storagePath = `policies/${policyId}/${Date.now()}-${safeName}`;
    if (USE_LOCAL_DEMO_STORE) {
      return { storagePath, storageUrl: URL.createObjectURL(file) };
    }
    try {
      const fileRef = ref(firebaseStorage, storagePath);
      await uploadBytes(fileRef, file, {
        contentType: file.type || 'application/pdf',
        customMetadata: { ownerUid },
      });
      const storageUrl = await getDownloadURL(fileRef);
      return { storagePath, storageUrl };
    } catch (err) {
      throw mapFirestoreError(err, 'Prijenos PDF dokumenta police u Cloud Storage nije uspio.');
    }
  },

  async resolveOrInviteClientForPolicy(params: {
    existingUserId?: string;
    email: string;
    fullName: string;
    oib: string;
    phone?: string;
  }): Promise<{ uid: string; invitedNewAccount: boolean }> {
    if (params.existingUserId) {
      return { uid: params.existingUserId, invitedNewAccount: false };
    }
    if (USE_LOCAL_DEMO_STORE) {
      const users = readDemoStore<UserProfile>(DEMO_KEYS.users, SEED_USERS);
      const found = users.find(
        (u) => u.email.toLowerCase() === params.email.trim().toLowerCase() || u.oib === params.oib
      );
      if (found) return { uid: found.uid, invitedNewAccount: false };
      const createdUid = `client-${Date.now()}`;
      writeDemoStore(DEMO_KEYS.users, [
        {
          uid: createdUid,
          email: params.email.trim().toLowerCase(),
          fullName: params.fullName,
          role: 'client',
          phone: params.phone ?? '',
          oib: params.oib,
          createdAt: new Date().toISOString(),
        },
        ...users,
      ]);
      return { uid: createdUid, invitedNewAccount: true };
    }

    // Try finding an existing /users doc by email or OIB first
    const byEmail = await getDocs(
      query(
        collection(firestoreDb, 'users'),
        where('email', '==', params.email.trim().toLowerCase()),
        limit(1)
      )
    );
    if (!byEmail.empty) {
      return { uid: byEmail.docs[0]!.id, invitedNewAccount: false };
    }

    // Otherwise call Admin Cloud Function to invite/create a real Firebase Auth client account
    try {
      const headers = await buildAuthApiHeaders();
      const res = await fetch(`${API_BASE}/api/admin/resolve-client`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email: params.email,
          fullName: params.fullName,
          oib: params.oib,
          phone: params.phone,
        }),
      });
      if (res.ok) {
        return (await res.json()) as { uid: string; invitedNewAccount: boolean };
      }
    } catch {
      // Fall through cleanly below
    }

    // Deterministic provisional client UID linked by OIB until client registers
    return { uid: `pending-${params.oib}`, invitedNewAccount: false };
  },

  async createPolicy(
    input: Omit<PolicyRecord, 'id' | 'endorsements' | 'createdAt' | 'updatedAt'>
  ): Promise<PolicyRecord> {
    const now = new Date().toISOString();
    const record: PolicyRecord = sanitizeForFirestore({
      ...input,
      id: `pol-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      endorsements: [],
      createdAt: now,
      updatedAt: now,
    });

    if (USE_LOCAL_DEMO_STORE) {
      const existing = readDemoStore<PolicyRecord>(DEMO_KEYS.policies, SEED_POLICIES);
      writeDemoStore(DEMO_KEYS.policies, [record, ...existing]);
      return record;
    }

    try {
      await setDoc(doc(firestoreDb, 'policies', record.id), record);
      return record;
    } catch (err) {
      throw mapFirestoreError(err, 'Izdavanje police u novčanik klijenta nije uspjelo.');
    }
  },

  async requestPolicyEndorsement(
    policyId: string,
    type: PolicyEndorsement['type'],
    summary: string
  ): Promise<PolicyRecord> {
    const now = new Date().toISOString();
    const endorsement: PolicyEndorsement = {
      id: `end-${Date.now()}`,
      type,
      summary: summary.trim(),
      status: 'requested',
      createdAt: now,
    };

    if (USE_LOCAL_DEMO_STORE) {
      const items = readDemoStore<PolicyRecord>(DEMO_KEYS.policies, SEED_POLICIES);
      let updated: PolicyRecord | null = null;
      const next = items.map((p) => {
        if (p.id !== policyId) return p;
        updated = {
          ...p,
          status: type === 'renewal_request' ? 'pending_renewal' : p.status,
          endorsements: [endorsement, ...p.endorsements],
          updatedAt: now,
        };
        return updated;
      });
      if (!updated) throw new RepositoryError('Polica nije pronađena.', 'not-found');
      writeDemoStore(DEMO_KEYS.policies, next);
      return updated;
    }

    try {
      const policyRef = doc(firestoreDb, 'policies', policyId);
      const snap = await getDoc(policyRef);
      if (!snap.exists()) {
        throw new RepositoryError('Polica nije pronađena.', 'not-found');
      }
      const existing = snap.data() as PolicyRecord;
      const nextStatus =
        type === 'renewal_request' &&
        (existing.status === 'active' || existing.status === 'expiring_soon')
          ? 'pending_renewal'
          : existing.status;
      const nextEndorsements = [endorsement, ...(existing.endorsements ?? [])];
      await updateDoc(policyRef, {
        status: nextStatus,
        endorsements: nextEndorsements,
        updatedAt: now,
      });
      return { ...existing, id: policyId, status: nextStatus, endorsements: nextEndorsements, updatedAt: now };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw mapFirestoreError(err, 'Slanje zahtjeva za izmjenu police nije uspjelo.');
    }
  },

  async completePolicyEndorsement(
    policyId: string,
    endorsementId: string,
    agentNote: string,
    agentName: string
  ): Promise<void> {
    const now = new Date().toISOString();
    if (USE_LOCAL_DEMO_STORE) {
      const items = readDemoStore<PolicyRecord>(DEMO_KEYS.policies, SEED_POLICIES);
      const next = items.map((p) => {
        if (p.id !== policyId) return p;
        const endorsements = p.endorsements.map((e) =>
          e.id === endorsementId
            ? {
                ...e,
                status: 'completed' as const,
                agentNote: agentNote.trim() || undefined,
                resolvedAt: now,
                resolvedBy: agentName,
              }
            : e
        );
        const hasPendingRenewal = endorsements.some(
          (e) => e.type === 'renewal_request' && e.status === 'requested'
        );
        return {
          ...p,
          status: p.status === 'pending_renewal' && !hasPendingRenewal ? ('active' as const) : p.status,
          endorsements,
          updatedAt: now,
        };
      });
      writeDemoStore(DEMO_KEYS.policies, next);
      return;
    }

    try {
      const policyRef = doc(firestoreDb, 'policies', policyId);
      const snap = await getDoc(policyRef);
      if (!snap.exists()) throw new RepositoryError('Polica nije pronađena.', 'not-found');
      const existing = snap.data() as PolicyRecord;
      const endorsements = (existing.endorsements ?? []).map((e) =>
        e.id === endorsementId
          ? sanitizeForFirestore({
              ...e,
              status: 'completed' as const,
              agentNote: agentNote.trim() || undefined,
              resolvedAt: now,
              resolvedBy: agentName,
            })
          : e
      );
      const hasPendingRenewal = endorsements.some(
        (e) => e.type === 'renewal_request' && e.status === 'requested'
      );
      const nextStatus =
        existing.status === 'pending_renewal' && !hasPendingRenewal ? 'active' : existing.status;

      await updateDoc(policyRef, {
        status: nextStatus,
        endorsements,
        updatedAt: now,
      });
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw mapFirestoreError(err, 'Zaključivanje zahtjeva za izmjenu nije uspjelo.');
    }
  },

  async markRenewalReminderSent(policyId: string): Promise<void> {
    const sentAt = new Date().toISOString();
    if (USE_LOCAL_DEMO_STORE) {
      const items = readDemoStore<PolicyRecord>(DEMO_KEYS.policies, SEED_POLICIES);
      writeDemoStore(
        DEMO_KEYS.policies,
        items.map((p) => (p.id === policyId ? { ...p, renewalReminderSentAt: sentAt, updatedAt: sentAt } : p))
      );
      return;
    }
    try {
      await updateDoc(doc(firestoreDb, 'policies', policyId), {
        renewalReminderSentAt: sentAt,
        updatedAt: sentAt,
      });
    } catch (err) {
      throw mapFirestoreError(err, 'Slanje podsjetnika za obnovu nije uspjelo.');
    }
  },

  // --- CLAIMS (FNOL) ---
  async getClaims(userId?: string): Promise<ClaimRecord[]> {
    if (USE_LOCAL_DEMO_STORE) {
      const all = readDemoStore<ClaimRecord>(DEMO_KEYS.claims, SEED_CLAIMS);
      return userId ? all.filter((c) => c.userId === userId) : all;
    }
    try {
      const colRef = collection(firestoreDb, 'claims');
      const qRef = userId
        ? query(colRef, where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(100))
        : query(colRef, orderBy('createdAt', 'desc'), limit(200));
      const snap = await getDocs(qRef);
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ClaimRecord, 'id'>) }));
    } catch (err) {
      throw mapFirestoreError(err, 'Nije moguće učitati prijave šteta.');
    }
  },

  /**
   * Secure Public FNOL Claim Status Tracker (`POST /api/claims/track`):
   * Verifies `referenceNumber` + second factor (last 4 digits of OIB or claimant email)
   * without opening public reads on `/claims` or exposing PII.
   */
  async trackClaimSecure(
    referenceNumber: string,
    verificationFactor: string
  ): Promise<TrackedClaimPublic | null> {
    const cleanedRef = referenceNumber.trim().toUpperCase();
    const cleanedFactor = verificationFactor.trim().toLowerCase();

    if (USE_LOCAL_DEMO_STORE) {
      const all = readDemoStore<ClaimRecord>(DEMO_KEYS.claims, SEED_CLAIMS);
      const match = all.find((c) => c.referenceNumber.toUpperCase() === cleanedRef);
      if (!match) return null;
      const oibMatch = /^\d{4}$/.test(cleanedFactor) && match.claimantOib.slice(-4) === cleanedFactor;
      const emailMatch = match.claimantEmail.trim().toLowerCase() === cleanedFactor;
      if (!oibMatch && !emailMatch) return null;
      return {
        referenceNumber: match.referenceNumber,
        policyNumberMasked: `${match.policyNumber.slice(0, 4)}••••${match.policyNumber.slice(-3)}`,
        productLine: match.productLine,
        carrierName: match.carrierName,
        stage: match.stage,
        stageHistory: match.stageHistory,
        updatedAt: match.updatedAt,
      };
    }

    try {
      const headers = await buildAuthApiHeaders();
      const res = await fetch(`${API_BASE}/api/claims/track`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          referenceNumber: cleanedRef,
          verificationFactor: cleanedFactor,
        }),
      });
      if (res.status === 404) return null;
      if (res.ok && (res.headers.get('content-type') || '').includes('application/json')) {
        return (await res.json()) as TrackedClaimPublic;
      }
    } catch {
      // If signed in as owner/agent and API not deployed yet, check own authorized claims
    }

    if (firebaseAuth.currentUser) {
      const ownClaims = await this.getClaims(firebaseAuth.currentUser.uid);
      const match = ownClaims.find((c) => c.referenceNumber.toUpperCase() === cleanedRef);
      if (match) {
        const oibMatch = /^\d{4}$/.test(cleanedFactor) && match.claimantOib.slice(-4) === cleanedFactor;
        const emailMatch = match.claimantEmail.trim().toLowerCase() === cleanedFactor;
        if (oibMatch || emailMatch) {
          return {
            referenceNumber: match.referenceNumber,
            policyNumberMasked: `${match.policyNumber.slice(0, 4)}••••${match.policyNumber.slice(-3)}`,
            productLine: match.productLine,
            carrierName: match.carrierName,
            stage: match.stage,
            stageHistory: match.stageHistory,
            updatedAt: match.updatedAt,
          };
        }
      }
    }

    return null;
  },

  async uploadClaimAttachment(claimId: string, file: File): Promise<ClaimAttachment> {
    const previewDataUrl = await createTinyThumbnailDataUrl(file);
    const safeName = sanitizeFileName(file.name);
    const uid = firebaseAuth.currentUser?.uid;
    const storagePath = uid
      ? `users/${uid}/claims/${Date.now()}-${safeName}`
      : `claims/${claimId}/${Date.now()}-${safeName}`;

    let storageUrl: string | undefined;
    let persistedPath: string | undefined;

    if (!USE_LOCAL_DEMO_STORE) {
      try {
        const fileRef = ref(firebaseStorage, storagePath);
        await uploadBytes(fileRef, file, {
          contentType: file.type || 'application/octet-stream',
          customMetadata: uid ? { ownerUid: uid } : {},
        });
        persistedPath = storagePath;
        if (uid) {
          storageUrl = await getDownloadURL(fileRef);
        }
      } catch {
        // Fallback: request a short-lived signed upload URL from backend API for guests
        try {
          const headers = await buildAuthApiHeaders();
          const res = await fetch(`${API_BASE}/api/storage/signed-upload`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              folder: 'claims',
              entityId: claimId,
              fileName: safeName,
              mimeType: file.type || 'image/jpeg',
              sizeBytes: file.size,
            }),
          });
          if (res.ok) {
            const signed = (await res.json()) as { storagePath: string; uploadUrl: string };
            const putRes = await fetch(signed.uploadUrl, {
              method: 'PUT',
              headers: { 'Content-Type': file.type || 'image/jpeg' },
              body: file,
            });
            if (putRes.ok) {
              persistedPath = signed.storagePath;
            }
          }
        } catch {
          // Keep tiny thumbnail if Cloud Storage bucket is not provisioned yet
        }
      }
    }

    return sanitizeForFirestore({
      id: `att-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: file.name,
      mimeType: file.type || 'application/octet-stream',
      sizeBytes: file.size,
      previewDataUrl,
      storageUrl,
      storagePath: persistedPath,
      uploadedAt: new Date().toISOString(),
    });
  },

  async resolveAttachmentDownloadUrl(att: ClaimAttachment): Promise<string | null> {
    if (att.storageUrl) return att.storageUrl;
    if (att.storagePath && !USE_LOCAL_DEMO_STORE) {
      try {
        return await getDownloadURL(ref(firebaseStorage, att.storagePath));
      } catch {
        return att.previewDataUrl ?? null;
      }
    }
    return att.previewDataUrl ?? null;
  },

  async submitClaim(
    input: Omit<ClaimRecord, 'id' | 'referenceNumber' | 'stage' | 'stageHistory' | 'createdAt' | 'updatedAt'>
  ): Promise<ClaimRecord> {
    const now = new Date().toISOString();
    const record: ClaimRecord = sanitizeForFirestore({
      ...input,
      userId: firebaseAuth.currentUser?.uid ?? (USE_LOCAL_DEMO_STORE ? input.userId : undefined),
      id: `claim-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      referenceNumber: makeRef('STETA'),
      stage: 'received',
      stageHistory: [
        {
          stage: 'received',
          note: 'Prijava štete zaprimljena putem digitalnog FNOL sustava.',
          timestamp: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    });

    if (USE_LOCAL_DEMO_STORE) {
      const existing = readDemoStore<ClaimRecord>(DEMO_KEYS.claims, SEED_CLAIMS);
      writeDemoStore(DEMO_KEYS.claims, [record, ...existing]);
      return record;
    }

    try {
      await setDoc(doc(firestoreDb, 'claims', record.id), record);
      return record;
    } catch (err) {
      throw mapFirestoreError(err, 'Slanje prijave štete nije uspjelo. Pokušajte ponovno.');
    }
  },

  async appendClaimAttachment(claimId: string, attachment: ClaimAttachment): Promise<void> {
    const now = new Date().toISOString();
    if (USE_LOCAL_DEMO_STORE) {
      const items = readDemoStore<ClaimRecord>(DEMO_KEYS.claims, SEED_CLAIMS);
      writeDemoStore(
        DEMO_KEYS.claims,
        items.map((c) =>
          c.id === claimId ? { ...c, attachments: [...c.attachments, attachment], updatedAt: now } : c
        )
      );
      return;
    }

    try {
      const claimRef = doc(firestoreDb, 'claims', claimId);
      const snap = await getDoc(claimRef);
      if (!snap.exists()) throw new RepositoryError('Prijava štete nije pronađena.', 'not-found');
      const existing = snap.data() as ClaimRecord;
      await updateDoc(claimRef, {
        attachments: [...(existing.attachments ?? []), sanitizeForFirestore(attachment)],
        updatedAt: now,
      });
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw mapFirestoreError(err, 'Dodavanje dokumenta u prijavu štete nije uspjelo.');
    }
  },

  async updateClaimTriage(
    claimId: string,
    params: {
      stage: ClaimStage;
      note: string;
      estimatedAmount?: number;
      actor?: string;
    }
  ): Promise<void> {
    const now = new Date().toISOString();
    const historyItem = sanitizeForFirestore({
      stage: params.stage,
      note: params.note.trim(),
      timestamp: now,
      actor: params.actor,
    });

    if (USE_LOCAL_DEMO_STORE) {
      const items = readDemoStore<ClaimRecord>(DEMO_KEYS.claims, SEED_CLAIMS);
      writeDemoStore(
        DEMO_KEYS.claims,
        items.map((c) => {
          if (c.id !== claimId) return c;
          return {
            ...c,
            stage: params.stage,
            estimatedAmount: params.estimatedAmount ?? c.estimatedAmount,
            stageHistory: [...c.stageHistory, historyItem],
            updatedAt: now,
          };
        })
      );
      return;
    }

    try {
      const claimRef = doc(firestoreDb, 'claims', claimId);
      const snap = await getDoc(claimRef);
      if (!snap.exists()) throw new RepositoryError('Prijava štete nije pronađena.', 'not-found');
      const existing = snap.data() as ClaimRecord;

      // Enforce sequential stage transition matching firestore.rules
      const allowedNext = ALLOWED_NEXT_CLAIM_STAGE[existing.stage];
      if (params.stage !== existing.stage && params.stage !== allowedNext) {
        throw new RepositoryError(
          'Faze štete moraju se mijenjati redoslijedom bez preskakanja.',
          'invalid-stage-transition'
        );
      }

      const patch = sanitizeForFirestore({
        stage: params.stage,
        stageHistory: [...(existing.stageHistory ?? []), historyItem],
        estimatedAmount:
          typeof params.estimatedAmount === 'number' && params.estimatedAmount >= 0
            ? params.estimatedAmount
            : existing.estimatedAmount,
        updatedAt: now,
      });
      await updateDoc(claimRef, patch);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      throw mapFirestoreError(err, 'Ažuriranje faze štete nije uspjelo.');
    }
  },

  // --- AI ESCALATIONS ---
  async getEscalations(): Promise<AiEscalationRecord[]> {
    if (USE_LOCAL_DEMO_STORE) {
      return readDemoStore<AiEscalationRecord>(DEMO_KEYS.escalations, SEED_ESCALATIONS);
    }
    try {
      const snap = await getDocs(
        query(collection(firestoreDb, 'escalations'), orderBy('createdAt', 'desc'), limit(200))
      );
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AiEscalationRecord, 'id'>) }));
    } catch (err) {
      throw mapFirestoreError(err, 'Nije moguće učitati AI eskalacije.');
    }
  },

  async createEscalation(
    input: Omit<AiEscalationRecord, 'id' | 'referenceNumber' | 'status' | 'createdAt'>
  ): Promise<AiEscalationRecord> {
    const now = new Date().toISOString();
    const record: AiEscalationRecord = sanitizeForFirestore({
      ...input,
      userId: firebaseAuth.currentUser?.uid ?? (USE_LOCAL_DEMO_STORE ? input.userId : undefined),
      id: `esc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      referenceNumber: makeRef('SAV'),
      status: 'new',
      createdAt: now,
      updatedAt: now,
    });

    if (USE_LOCAL_DEMO_STORE) {
      const existing = readDemoStore<AiEscalationRecord>(DEMO_KEYS.escalations, SEED_ESCALATIONS);
      writeDemoStore(DEMO_KEYS.escalations, [record, ...existing]);
      return record;
    }

    try {
      await setDoc(doc(firestoreDb, 'escalations', record.id), record);
      return record;
    } catch (err) {
      throw mapFirestoreError(err, 'Prebacivanje razgovora zastupniku nije uspjelo.');
    }
  },

  async updateEscalationStatus(
    escalationId: string,
    patch: { status?: QuotePipelineStatus; assignedAgent?: string; notes?: string }
  ): Promise<void> {
    const cleaned = sanitizeForFirestore({ ...patch, updatedAt: new Date().toISOString() });
    if (USE_LOCAL_DEMO_STORE) {
      const items = readDemoStore<AiEscalationRecord>(DEMO_KEYS.escalations, SEED_ESCALATIONS);
      writeDemoStore(
        DEMO_KEYS.escalations,
        items.map((e) => (e.id === escalationId ? { ...e, ...cleaned } : e))
      );
      return;
    }
    try {
      await updateDoc(doc(firestoreDb, 'escalations', escalationId), cleaned);
    } catch (err) {
      throw mapFirestoreError(err, 'Ažuriranje AI eskalacije nije uspjelo.');
    }
  },

  // --- CLIENT-ADVISOR MESSAGES ---
  async getMessages(threadUserId: string): Promise<AdvisorThreadMessage[]> {
    if (USE_LOCAL_DEMO_STORE) {
      const all = readDemoStore<AdvisorThreadMessage>(DEMO_KEYS.messages, SEED_MESSAGES);
      return all.filter((m) => m.threadUserId === threadUserId);
    }
    try {
      const snap = await getDocs(
        query(
          collection(firestoreDb, 'messages'),
          where('threadUserId', '==', threadUserId),
          orderBy('createdAt', 'asc'),
          limit(200)
        )
      );
      return snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<AdvisorThreadMessage, 'id'>),
      }));
    } catch (err) {
      throw mapFirestoreError(err, 'Nije moguće učitati poruke.');
    }
  },

  async getAllMessages(): Promise<AdvisorThreadMessage[]> {
    if (USE_LOCAL_DEMO_STORE) {
      return readDemoStore<AdvisorThreadMessage>(DEMO_KEYS.messages, SEED_MESSAGES);
    }
    try {
      const snap = await getDocs(
        query(collection(firestoreDb, 'messages'), orderBy('createdAt', 'asc'), limit(500))
      );
      return snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<AdvisorThreadMessage, 'id'>),
      }));
    } catch (err) {
      throw mapFirestoreError(err, 'Nije moguće učitati klijentski sandučić poruka.');
    }
  },

  async sendMessage(
    input: Omit<AdvisorThreadMessage, 'id' | 'createdAt'>
  ): Promise<AdvisorThreadMessage> {
    const record: AdvisorThreadMessage = sanitizeForFirestore({
      ...input,
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    });

    if (USE_LOCAL_DEMO_STORE) {
      const existing = readDemoStore<AdvisorThreadMessage>(DEMO_KEYS.messages, SEED_MESSAGES);
      writeDemoStore(DEMO_KEYS.messages, [...existing, record]);
      return record;
    }

    try {
      await setDoc(doc(firestoreDb, 'messages', record.id), record);
      return record;
    } catch (err) {
      throw mapFirestoreError(err, 'Slanje poruke nije uspjelo.');
    }
  },

  // --- STATUTORY COMPLAINTS (Art. 401 Insurance Act) ---
  async getComplaints(): Promise<ComplaintRecord[]> {
    if (USE_LOCAL_DEMO_STORE) {
      return readDemoStore<ComplaintRecord>(DEMO_KEYS.complaints, SEED_COMPLAINTS);
    }
    try {
      const snap = await getDocs(
        query(collection(firestoreDb, 'complaints'), orderBy('createdAt', 'desc'), limit(200))
      );
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ComplaintRecord, 'id'>) }));
    } catch (err) {
      throw mapFirestoreError(err, 'Nije moguće učitati registar prigovora.');
    }
  },

  async submitComplaint(
    input: Omit<ComplaintRecord, 'id' | 'protocolNumber' | 'status' | 'statutoryDeadlineDate' | 'createdAt'>
  ): Promise<ComplaintRecord> {
    const now = new Date().toISOString();
    const record: ComplaintRecord = sanitizeForFirestore({
      ...input,
      id: `comp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      protocolNumber: makeRef('PRIG'),
      status: 'received',
      statutoryDeadlineDate: addDaysIso(now.slice(0, 10), 15),
      createdAt: now,
      updatedAt: now,
    });

    if (USE_LOCAL_DEMO_STORE) {
      const existing = readDemoStore<ComplaintRecord>(DEMO_KEYS.complaints, SEED_COMPLAINTS);
      writeDemoStore(DEMO_KEYS.complaints, [record, ...existing]);
      return record;
    }

    try {
      await setDoc(doc(firestoreDb, 'complaints', record.id), record);
      return record;
    } catch (err) {
      throw mapFirestoreError(err, 'Urudžbiranje prigovora nije uspjelo. Pokušajte ponovno.');
    }
  },

  async updateComplaint(
    complaintId: string,
    patch: {
      status: ComplaintRecord['status'];
      assignedAgent?: string;
      resolutionNotes?: string;
    }
  ): Promise<void> {
    const now = new Date().toISOString();
    const cleaned = sanitizeForFirestore({
      status: patch.status,
      assignedAgent: patch.assignedAgent?.trim() || undefined,
      resolutionNotes: patch.resolutionNotes?.trim() || undefined,
      updatedAt: now,
    });

    if (USE_LOCAL_DEMO_STORE) {
      const items = readDemoStore<ComplaintRecord>(DEMO_KEYS.complaints, SEED_COMPLAINTS);
      writeDemoStore(
        DEMO_KEYS.complaints,
        items.map((c) => (c.id === complaintId ? { ...c, ...cleaned } : c))
      );
      return;
    }

    try {
      await updateDoc(doc(firestoreDb, 'complaints', complaintId), cleaned);
    } catch (err) {
      throw mapFirestoreError(err, 'Ažuriranje prigovora nije uspjelo.');
    }
  },

  // --- REAL-TIME FIRESTORE SUBSCRIPTIONS ---
  subscribeClientWorkspace(
    userId: string,
    onData: (partial: Partial<ClientWorkspaceSnapshot>) => void,
    onError: (err: RepositoryError) => void
  ): Unsubscribe {
    if (USE_LOCAL_DEMO_STORE) {
      onData({
        policies: readDemoStore<PolicyRecord>(DEMO_KEYS.policies, SEED_POLICIES).filter(
          (p) => p.userId === userId
        ),
        claims: readDemoStore<ClaimRecord>(DEMO_KEYS.claims, SEED_CLAIMS).filter(
          (c) => c.userId === userId
        ),
        quotes: readDemoStore<QuoteSubmission>(DEMO_KEYS.quotes, SEED_QUOTES).filter(
          (q) => q.userId === userId
        ),
        messages: readDemoStore<AdvisorThreadMessage>(DEMO_KEYS.messages, SEED_MESSAGES).filter(
          (m) => m.threadUserId === userId
        ),
      });
      return () => {};
    }

    const unsubs: Unsubscribe[] = [
      onSnapshot(
        query(collection(firestoreDb, 'policies'), where('userId', '==', userId), orderBy('expiryDate', 'asc')),
        (snap) =>
          onData({
            policies: snap.docs.map((d) => {
              const data = d.data() as Omit<PolicyRecord, 'id'>;
              return {
                ...data,
                id: d.id,
                endorsements: data.endorsements ?? [],
              };
            }),
          }),
        (err) => onError(mapFirestoreError(err, 'Greška sinkronizacije polica.'))
      ),
      onSnapshot(
        query(collection(firestoreDb, 'claims'), where('userId', '==', userId), orderBy('createdAt', 'desc')),
        (snap) =>
          onData({
            claims: snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ClaimRecord, 'id'>) })),
          }),
        (err) => onError(mapFirestoreError(err, 'Greška sinkronizacije šteta.'))
      ),
      onSnapshot(
        query(collection(firestoreDb, 'quotes'), where('userId', '==', userId), orderBy('createdAt', 'desc')),
        (snap) =>
          onData({
            quotes: snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<QuoteSubmission, 'id'>) })),
          }),
        (err) => onError(mapFirestoreError(err, 'Greška sinkronizacije ponuda.'))
      ),
      onSnapshot(
        query(
          collection(firestoreDb, 'messages'),
          where('threadUserId', '==', userId),
          orderBy('createdAt', 'asc')
        ),
        (snap) =>
          onData({
            messages: snap.docs.map((d) => ({
              id: d.id,
              ...(d.data() as Omit<AdvisorThreadMessage, 'id'>),
            })),
          }),
        (err) => onError(mapFirestoreError(err, 'Greška sinkronizacije poruka.'))
      ),
    ];

    return () => {
      unsubs.forEach((fn) => fn());
    };
  },

  subscribeAdminQueues(
    onData: (partial: Partial<AdminQueuesSnapshot>) => void,
    onError: (err: RepositoryError) => void
  ): Unsubscribe {
    if (USE_LOCAL_DEMO_STORE) {
      onData({
        quotes: readDemoStore<QuoteSubmission>(DEMO_KEYS.quotes, SEED_QUOTES),
        switches: readDemoStore<SwitchAnalysisRecord>(DEMO_KEYS.switches, SEED_SWITCH_ANALYSES),
        escalations: readDemoStore<AiEscalationRecord>(DEMO_KEYS.escalations, SEED_ESCALATIONS),
        policies: readDemoStore<PolicyRecord>(DEMO_KEYS.policies, SEED_POLICIES),
        claims: readDemoStore<ClaimRecord>(DEMO_KEYS.claims, SEED_CLAIMS),
        complaints: readDemoStore<ComplaintRecord>(DEMO_KEYS.complaints, SEED_COMPLAINTS),
        messages: readDemoStore<AdvisorThreadMessage>(DEMO_KEYS.messages, SEED_MESSAGES),
        users: readDemoStore<UserProfile>(DEMO_KEYS.users, SEED_USERS),
      });
      return () => {};
    }

    const unsubs: Unsubscribe[] = [
      onSnapshot(
        query(collection(firestoreDb, 'quotes'), orderBy('createdAt', 'desc'), limit(200)),
        (snap) =>
          onData({
            quotes: snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<QuoteSubmission, 'id'>) })),
          }),
        (err) => onError(mapFirestoreError(err, 'Greška učitavanja ponuda.'))
      ),
      onSnapshot(
        query(collection(firestoreDb, 'switch_analyses'), orderBy('createdAt', 'desc'), limit(200)),
        (snap) =>
          onData({
            switches: snap.docs.map((d) => ({
              id: d.id,
              ...(d.data() as Omit<SwitchAnalysisRecord, 'id'>),
            })),
          }),
        (err) => onError(mapFirestoreError(err, 'Greška učitavanja Switch & Save analiza.'))
      ),
      onSnapshot(
        query(collection(firestoreDb, 'escalations'), orderBy('createdAt', 'desc'), limit(200)),
        (snap) =>
          onData({
            escalations: snap.docs.map((d) => ({
              id: d.id,
              ...(d.data() as Omit<AiEscalationRecord, 'id'>),
            })),
          }),
        (err) => onError(mapFirestoreError(err, 'Greška učitavanja AI eskalacija.'))
      ),
      onSnapshot(
        query(collection(firestoreDb, 'policies'), orderBy('expiryDate', 'asc'), limit(250)),
        (snap) =>
          onData({
            policies: snap.docs.map((d) => {
              const data = d.data() as Omit<PolicyRecord, 'id'>;
              return {
                ...data,
                id: d.id,
                endorsements: data.endorsements ?? [],
              };
            }),
          }),
        (err) => onError(mapFirestoreError(err, 'Greška učitavanja polica.'))
      ),
      onSnapshot(
        query(collection(firestoreDb, 'claims'), orderBy('createdAt', 'desc'), limit(200)),
        (snap) =>
          onData({
            claims: snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ClaimRecord, 'id'>) })),
          }),
        (err) => onError(mapFirestoreError(err, 'Greška učitavanja šteta.'))
      ),
      onSnapshot(
        query(collection(firestoreDb, 'complaints'), orderBy('createdAt', 'desc'), limit(200)),
        (snap) =>
          onData({
            complaints: snap.docs.map((d) => ({
              id: d.id,
              ...(d.data() as Omit<ComplaintRecord, 'id'>),
            })),
          }),
        (err) => onError(mapFirestoreError(err, 'Greška učitavanja prigovora.'))
      ),
      onSnapshot(
        query(collection(firestoreDb, 'messages'), orderBy('createdAt', 'asc'), limit(500)),
        (snap) =>
          onData({
            messages: snap.docs.map((d) => ({
              id: d.id,
              ...(d.data() as Omit<AdvisorThreadMessage, 'id'>),
            })),
          }),
        (err) => onError(mapFirestoreError(err, 'Greška učitavanja poruka.'))
      ),
      onSnapshot(
        query(collection(firestoreDb, 'users'), limit(200)),
        (snap) =>
          onData({
            users: snap.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<UserProfile, 'uid'>) })),
          }),
        (err) => onError(mapFirestoreError(err, 'Greška učitavanja korisnika.'))
      ),
    ];

    return () => {
      unsubs.forEach((fn) => fn());
    };
  },
};
