import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
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
} from '../types/domain';
import { addDaysIso } from '../utils/formatters';
import { firebaseAuth, firebaseStorage, firestoreDb, sanitizeForFirestore } from './firebase';
import {
  SEED_CLAIMS,
  SEED_COMPLAINTS,
  SEED_ESCALATIONS,
  SEED_MESSAGES,
  SEED_POLICIES,
  SEED_QUOTES,
  SEED_SWITCH_ANALYSES,
} from './seedData';

const STORAGE_KEYS = {
  quotes: 'jasno_quotes_v1',
  switches: 'jasno_switches_v1',
  policies: 'jasno_policies_v1',
  claims: 'jasno_claims_v1',
  escalations: 'jasno_escalations_v1',
  messages: 'jasno_messages_v1',
  complaints: 'jasno_complaints_v1',
} as const;

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '');

function readStore<T>(key: string, fallback: T[]): T[] {
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

function writeStore<T>(key: string, items: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // ignore quota errors in private mode
  }
}

async function tryRestPost<T>(endpoint: string, payload: unknown): Promise<T | null> {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function isLocalUnauthenticatedPreview(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return (host === '127.0.0.1' || host === 'localhost') && !firebaseAuth.currentUser;
}

async function tryFirestoreSet(collectionName: string, docId: string, data: unknown): Promise<void> {
  if (isLocalUnauthenticatedPreview()) {
    return;
  }
  // Only push remote writes if Firebase SDK has an active auth session or public-create collection
  const publicCollections = new Set([
    'quotes',
    'switch_analyses',
    'claims',
    'escalations',
    'complaints',
  ]);
  if (!firebaseAuth.currentUser && !publicCollections.has(collectionName)) {
    return;
  }
  // Non-blocking background sync so UI responds instantaneously
  void setDoc(doc(firestoreDb, collectionName, docId), sanitizeForFirestore(data)).catch(() => {
    // Graceful fallback to local persistence when offline or running in demo auth mode
  });
}

async function tryFirestoreUpdate(
  collectionName: string,
  docId: string,
  patch: Record<string, unknown>
): Promise<void> {
  if (!firebaseAuth.currentUser) return;
  void updateDoc(doc(firestoreDb, collectionName, docId), sanitizeForFirestore(patch)).catch(() => {
    // Graceful fallback
  });
}

function makeRef(prefix: string): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${new Date().getFullYear()}-${num}`;
}

export const agencyRepository = {
  // --- QUOTES ---
  async getQuotes(): Promise<QuoteSubmission[]> {
    return readStore<QuoteSubmission>(STORAGE_KEYS.quotes, SEED_QUOTES);
  },

  async createQuote(
    input: Omit<QuoteSubmission, 'id' | 'referenceNumber' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<QuoteSubmission> {
    const now = new Date().toISOString();
    const record: QuoteSubmission = sanitizeForFirestore({
      ...input,
      id: `quote-${Date.now()}`,
      referenceNumber: makeRef('PON'),
      status: 'new',
      createdAt: now,
      updatedAt: now,
    });

    const existing = readStore<QuoteSubmission>(STORAGE_KEYS.quotes, SEED_QUOTES);
    writeStore(STORAGE_KEYS.quotes, [record, ...existing]);

    await tryRestPost('/api/quotes', record);
    await tryFirestoreSet('quotes', record.id, record);
    return record;
  },

  async updateQuotePipeline(
    quoteId: string,
    patch: { status?: QuotePipelineStatus; assignedAgent?: string; notes?: string }
  ): Promise<QuoteSubmission | null> {
    const items = readStore<QuoteSubmission>(STORAGE_KEYS.quotes, SEED_QUOTES);
    let updated: QuoteSubmission | null = null;
    const next = items.map((q) => {
      if (q.id !== quoteId) return q;
      updated = { ...q, ...patch, updatedAt: new Date().toISOString() };
      return updated;
    });
    writeStore(STORAGE_KEYS.quotes, next);
    if (updated) {
      await tryFirestoreUpdate('quotes', quoteId, { ...patch, updatedAt: new Date().toISOString() });
    }
    return updated;
  },

  // --- SWITCH & SAVE ANALYSES ---
  async getSwitchAnalyses(): Promise<SwitchAnalysisRecord[]> {
    return readStore<SwitchAnalysisRecord>(STORAGE_KEYS.switches, SEED_SWITCH_ANALYSES);
  },

  async saveSwitchAnalysis(
    input: Omit<SwitchAnalysisRecord, 'id' | 'referenceNumber' | 'createdAt' | 'status'>
  ): Promise<SwitchAnalysisRecord> {
    const record: SwitchAnalysisRecord = sanitizeForFirestore({
      ...input,
      id: `sw-${Date.now()}`,
      referenceNumber: makeRef('USP'),
      status: 'new',
      createdAt: new Date().toISOString(),
    });
    const existing = readStore<SwitchAnalysisRecord>(STORAGE_KEYS.switches, SEED_SWITCH_ANALYSES);
    writeStore(STORAGE_KEYS.switches, [record, ...existing]);
    await tryRestPost('/api/quotes', { type: 'switch_save', ...record });
    await tryFirestoreSet('switch_analyses', record.id, record);
    return record;
  },

  async updateSwitchStatus(
    analysisId: string,
    patch: { status?: QuotePipelineStatus; assignedAgent?: string }
  ): Promise<void> {
    const items = readStore<SwitchAnalysisRecord>(STORAGE_KEYS.switches, SEED_SWITCH_ANALYSES);
    writeStore(
      STORAGE_KEYS.switches,
      items.map((item) => (item.id === analysisId ? { ...item, ...patch } : item))
    );
    await tryFirestoreUpdate('switch_analyses', analysisId, patch);
  },

  // --- POLICIES ---
  async getPolicies(userId?: string): Promise<PolicyRecord[]> {
    const all = readStore<PolicyRecord>(STORAGE_KEYS.policies, SEED_POLICIES);
    if (!userId) return all;
    return all.filter((p) => p.userId === userId);
  },

  async requestPolicyEndorsement(
    policyId: string,
    type: PolicyEndorsement['type'],
    summary: string
  ): Promise<PolicyRecord | null> {
    const items = readStore<PolicyRecord>(STORAGE_KEYS.policies, SEED_POLICIES);
    const endorsement: PolicyEndorsement = {
      id: `end-${Date.now()}`,
      type,
      summary,
      status: 'requested',
      createdAt: new Date().toISOString(),
    };
    let updated: PolicyRecord | null = null;
    const next = items.map((p) => {
      if (p.id !== policyId) return p;
      updated = {
        ...p,
        status: type === 'renewal_request' ? 'pending_renewal' : p.status,
        endorsements: [endorsement, ...p.endorsements],
      };
      return updated;
    });
    writeStore(STORAGE_KEYS.policies, next);
    if (updated) {
      await tryRestPost('/api/policies', { policyId, endorsement });
      await tryFirestoreUpdate('policies', policyId, {
        status: (updated as PolicyRecord).status,
        endorsements: (updated as PolicyRecord).endorsements,
      });
    }
    return updated;
  },

  async markRenewalReminderSent(policyId: string): Promise<void> {
    const sentAt = new Date().toISOString();
    const items = readStore<PolicyRecord>(STORAGE_KEYS.policies, SEED_POLICIES);
    writeStore(
      STORAGE_KEYS.policies,
      items.map((p) => (p.id === policyId ? { ...p, renewalReminderSentAt: sentAt } : p))
    );
    await tryFirestoreUpdate('policies', policyId, { renewalReminderSentAt: sentAt });
  },

  // --- CLAIMS (FNOL) ---
  async getClaims(userId?: string): Promise<ClaimRecord[]> {
    const all = readStore<ClaimRecord>(STORAGE_KEYS.claims, SEED_CLAIMS);
    if (!userId) return all;
    return all.filter((c) => c.userId === userId);
  },

  async findClaimByReference(referenceNumber: string): Promise<ClaimRecord | null> {
    const cleaned = referenceNumber.trim().toUpperCase();
    const all = readStore<ClaimRecord>(STORAGE_KEYS.claims, SEED_CLAIMS);
    return (
      all.find(
        (c) =>
          c.referenceNumber.toUpperCase() === cleaned ||
          c.policyNumber.toUpperCase() === cleaned
      ) ?? null
    );
  },

  async uploadClaimAttachment(claimId: string, file: File): Promise<ClaimAttachment> {
    let previewDataUrl: string | undefined;
    if (file.type.startsWith('image/') && file.size < 2 * 1024 * 1024) {
      previewDataUrl = await new Promise<string | undefined>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : undefined);
        reader.onerror = () => resolve(undefined);
        reader.readAsDataURL(file);
      });
    }

    let storageUrl: string | undefined;
    try {
      if (firebaseAuth.currentUser) {
        const fileRef = ref(firebaseStorage, `claims/${claimId}/${Date.now()}-${file.name}`);
        await uploadBytes(fileRef, file);
        storageUrl = await getDownloadURL(fileRef);
      }
    } catch {
      // Keep local preview fallback seamlessly
    }

    return sanitizeForFirestore({
      id: `att-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: file.name,
      mimeType: file.type || 'application/octet-stream',
      sizeBytes: file.size,
      previewDataUrl,
      storageUrl,
      uploadedAt: new Date().toISOString(),
    });
  },

  async submitClaim(
    input: Omit<ClaimRecord, 'id' | 'referenceNumber' | 'stage' | 'stageHistory' | 'createdAt' | 'updatedAt'>
  ): Promise<ClaimRecord> {
    const now = new Date().toISOString();
    const record: ClaimRecord = sanitizeForFirestore({
      ...input,
      id: `claim-${Date.now()}`,
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

    const existing = readStore<ClaimRecord>(STORAGE_KEYS.claims, SEED_CLAIMS);
    writeStore(STORAGE_KEYS.claims, [record, ...existing]);

    await tryRestPost('/api/claims', record);
    await tryFirestoreSet('claims', record.id, record);
    return record;
  },

  async appendClaimAttachment(claimId: string, attachment: ClaimAttachment): Promise<ClaimRecord | null> {
    const items = readStore<ClaimRecord>(STORAGE_KEYS.claims, SEED_CLAIMS);
    let updated: ClaimRecord | null = null;
    const next = items.map((c) => {
      if (c.id !== claimId) return c;
      updated = {
        ...c,
        attachments: [...c.attachments, attachment],
        updatedAt: new Date().toISOString(),
      };
      return updated;
    });
    writeStore(STORAGE_KEYS.claims, next);
    if (updated) {
      await tryFirestoreUpdate('claims', claimId, {
        attachments: (updated as ClaimRecord).attachments,
        updatedAt: (updated as ClaimRecord).updatedAt,
      });
    }
    return updated;
  },

  async updateClaimStage(claimId: string, stage: ClaimStage, note: string): Promise<ClaimRecord | null> {
    const now = new Date().toISOString();
    const items = readStore<ClaimRecord>(STORAGE_KEYS.claims, SEED_CLAIMS);
    let updated: ClaimRecord | null = null;
    const next = items.map((c) => {
      if (c.id !== claimId) return c;
      updated = {
        ...c,
        stage,
        stageHistory: [...c.stageHistory, { stage, note, timestamp: now }],
        updatedAt: now,
      };
      return updated;
    });
    writeStore(STORAGE_KEYS.claims, next);
    if (updated) {
      await tryFirestoreUpdate('claims', claimId, {
        stage,
        stageHistory: (updated as ClaimRecord).stageHistory,
        updatedAt: now,
      });
    }
    return updated;
  },

  // --- AI ESCALATIONS ---
  async getEscalations(): Promise<AiEscalationRecord[]> {
    return readStore<AiEscalationRecord>(STORAGE_KEYS.escalations, SEED_ESCALATIONS);
  },

  async createEscalation(
    input: Omit<AiEscalationRecord, 'id' | 'referenceNumber' | 'status' | 'createdAt'>
  ): Promise<AiEscalationRecord> {
    const record: AiEscalationRecord = sanitizeForFirestore({
      ...input,
      id: `esc-${Date.now()}`,
      referenceNumber: makeRef('SAV'),
      status: 'new',
      createdAt: new Date().toISOString(),
    });
    const existing = readStore<AiEscalationRecord>(STORAGE_KEYS.escalations, SEED_ESCALATIONS);
    writeStore(STORAGE_KEYS.escalations, [record, ...existing]);
    await tryRestPost('/api/ai', { type: 'escalation', ...record });
    await tryFirestoreSet('escalations', record.id, record);
    return record;
  },

  async updateEscalationStatus(
    escalationId: string,
    patch: { status?: QuotePipelineStatus; assignedAgent?: string }
  ): Promise<void> {
    const items = readStore<AiEscalationRecord>(STORAGE_KEYS.escalations, SEED_ESCALATIONS);
    writeStore(
      STORAGE_KEYS.escalations,
      items.map((e) => (e.id === escalationId ? { ...e, ...patch } : e))
    );
    await tryFirestoreUpdate('escalations', escalationId, patch);
  },

  // --- CLIENT-ADVISOR MESSAGES ---
  async getMessages(threadUserId: string): Promise<AdvisorThreadMessage[]> {
    const all = readStore<AdvisorThreadMessage>(STORAGE_KEYS.messages, SEED_MESSAGES);
    return all.filter((m) => m.threadUserId === threadUserId);
  },

  async sendMessage(
    input: Omit<AdvisorThreadMessage, 'id' | 'createdAt'>
  ): Promise<AdvisorThreadMessage> {
    const record: AdvisorThreadMessage = {
      ...input,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const existing = readStore<AdvisorThreadMessage>(STORAGE_KEYS.messages, SEED_MESSAGES);
    writeStore(STORAGE_KEYS.messages, [...existing, record]);
    await tryFirestoreSet('messages', record.id, record);
    return record;
  },

  // --- STATUTORY COMPLAINTS (Art. 401 Insurance Act) ---
  async getComplaints(): Promise<ComplaintRecord[]> {
    return readStore<ComplaintRecord>(STORAGE_KEYS.complaints, SEED_COMPLAINTS);
  },

  async submitComplaint(
    input: Omit<ComplaintRecord, 'id' | 'protocolNumber' | 'status' | 'statutoryDeadlineDate' | 'createdAt'>
  ): Promise<ComplaintRecord> {
    const now = new Date().toISOString();
    const record: ComplaintRecord = sanitizeForFirestore({
      ...input,
      id: `comp-${Date.now()}`,
      protocolNumber: makeRef('PRIG'),
      status: 'received',
      statutoryDeadlineDate: addDaysIso(now.slice(0, 10), 15),
      createdAt: now,
    });
    const existing = readStore<ComplaintRecord>(STORAGE_KEYS.complaints, SEED_COMPLAINTS);
    writeStore(STORAGE_KEYS.complaints, [record, ...existing]);
    await tryFirestoreSet('complaints', record.id, record);
    return record;
  },
};
