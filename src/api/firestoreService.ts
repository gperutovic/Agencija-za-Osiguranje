import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db, dualStore } from './firebase';
import { 
  UserProfile, 
  Policy as ConsumerPolicy, 
  Claim as ConsumerClaim, 
  QuoteRequest, 
  Appointment,
  CoiCertificate,
  EndorsementRequest,
  LeadRecord,
  NeedsAssessmentRecord
} from '../types/database';

export interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string;
}

export const firestoreService = {
  // ==========================================
  // 1. QUOTES & COMPARATIVE ENGINES
  // ==========================================
  async getQuotes(): Promise<QuoteRequest[]> {
    try {
      const q = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as QuoteRequest));
      }
    } catch {
      // Offline fallback
    }
    return dualStore.getQuotes();
  },

  async createQuote(quote: Omit<QuoteRequest, 'id' | 'createdAt'> | any): Promise<QuoteRequest> {
    const id = quote.id || `quote-${Date.now()}`;
    const newQuote: QuoteRequest = {
      ...quote,
      id,
      createdAt: quote.createdAt || new Date().toISOString(),
    };
    dualStore.saveQuote(newQuote);

    try {
      await setDoc(doc(db, 'quotes', id), {
        ...newQuote,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Firestore createQuote offline fallback:', e);
    }
    return newQuote;
  },

  async updateQuoteStatus(id: string, status: QuoteRequest['status']): Promise<void> {
    const quotes = dualStore.getQuotes();
    const existing = quotes.find((q) => q.id === id);
    if (existing) {
      existing.status = status;
      dualStore.saveQuote(existing);
    }
    try {
      await updateDoc(doc(db, 'quotes', id), { 
        status,
        updatedAt: serverTimestamp() 
      });
    } catch {
      // Fallback
    }
  },

  subscribeQuotes(callback: (quotes: QuoteRequest[]) => void): Unsubscribe {
    const q = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as QuoteRequest));
          callback(data);
        }
      },
      (err) => {
        console.warn('Firestore subscribeQuotes error:', err);
      }
    );
  },

  // ==========================================
  // 2. POLICIES IN-FORCE & COMMERCIAL CONTRACTS
  // ==========================================
  async getPolicies(userId?: string): Promise<any[]> {
    try {
      const colRef = collection(db, 'policies');
      const q = userId ? query(colRef, where('userId', '==', userId)) : colRef;
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
    } catch {
      // Fallback
    }
    return dualStore.getPolicies(userId);
  },

  async createPolicy(policyData: any): Promise<any> {
    const id = policyData.id || `pol-${Date.now()}`;
    const newPolicy = {
      ...policyData,
      id,
      created_at: policyData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'policies', id), newPolicy);
    } catch (e) {
      console.warn('Firestore createPolicy fallback:', e);
    }
    return newPolicy;
  },

  async updatePolicy(id: string, updates: Record<string, any>): Promise<void> {
    try {
      await updateDoc(doc(db, 'policies', id), {
        ...updates,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore updatePolicy fallback:', e);
    }
  },

  async renewPolicyRequest(policyId: string): Promise<void> {
    const policies = dualStore.getPolicies();
    const target = policies.find((p) => p.id === policyId);
    if (target) {
      const curEnd = new Date(target.endDate);
      curEnd.setFullYear(curEnd.getFullYear() + 1);
      target.endDate = curEnd.toISOString();
      target.status = 'active';
      dualStore.savePolicy(target);
    }
    try {
      await updateDoc(doc(db, 'policies', policyId), {
        status: 'active',
        updated_at: new Date().toISOString(),
      });
    } catch {
      // Fallback
    }
  },

  subscribePolicies(callback: (policies: any[]) => void, userId?: string): Unsubscribe {
    const colRef = collection(db, 'policies');
    const q = userId ? query(colRef, where('userId', '==', userId)) : colRef;
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          callback(data);
        }
      },
      (err) => {
        console.warn('Firestore subscribePolicies error:', err);
      }
    );
  },

  // ==========================================
  // 3. CLAIMS & AUTONOMOUS FNOL TRIAGE
  // ==========================================
  async getClaims(userId?: string): Promise<any[]> {
    try {
      const colRef = collection(db, 'claims');
      const q = userId ? query(colRef, where('userId', '==', userId)) : colRef;
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
    } catch {
      // Fallback
    }
    return dualStore.getClaims(userId);
  },

  async createClaim(claimData: any): Promise<any> {
    const id = claimData.id || `clm-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const newClaim = {
      ...claimData,
      id,
      createdAt: claimData.createdAt || now,
      reported_date: claimData.reported_date || now,
      updatedAt: now,
    };

    try {
      await setDoc(doc(db, 'claims', id), {
        ...newClaim,
        serverTimestamp: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Firestore createClaim fallback:', e);
    }
    return newClaim;
  },

  async updateClaimStatus(
    id: string,
    status: string,
    brokerNotes?: string
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'claims', id), {
        status,
        ...(brokerNotes !== undefined ? { brokerNotes } : {}),
        updatedAt: new Date().toISOString(),
      });
    } catch {
      // Fallback
    }
  },

  subscribeClaims(callback: (claims: any[]) => void, userId?: string): Unsubscribe {
    const colRef = collection(db, 'claims');
    const q = userId ? query(colRef, where('userId', '==', userId)) : colRef;
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          callback(data);
        }
      },
      (err) => {
        console.warn('Firestore subscribeClaims error:', err);
      }
    );
  },

  // ==========================================
  // 4. CERTIFICATES & DIGITAL CARDS (ACORD 25)
  // ==========================================
  async getDigitalCards(): Promise<CoiCertificate[]> {
    try {
      const snap = await getDocs(collection(db, 'digital_cards'));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CoiCertificate));
      }
    } catch {
      // Fallback
    }
    return [];
  },

  async createDigitalCard(cardData: CoiCertificate): Promise<CoiCertificate> {
    const id = cardData.id || `coi-${Math.floor(10000 + Math.random() * 90000)}`;
    const newCard: CoiCertificate = {
      ...cardData,
      id,
      issued_at: cardData.issued_at || new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'digital_cards', id), newCard);
    } catch (e) {
      console.warn('Firestore createDigitalCard fallback:', e);
    }
    return newCard;
  },

  subscribeDigitalCards(callback: (cards: CoiCertificate[]) => void): Unsubscribe {
    return onSnapshot(
      collection(db, 'digital_cards'),
      (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CoiCertificate));
          callback(data);
        }
      },
      (err) => {
        console.warn('Firestore subscribeDigitalCards error:', err);
      }
    );
  },

  // ==========================================
  // 5. POLICY ENDORSEMENT REQUESTS
  // ==========================================
  async getEndorsements(): Promise<EndorsementRequest[]> {
    try {
      const snap = await getDocs(collection(db, 'endorsements'));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as EndorsementRequest));
      }
    } catch {
      // Fallback
    }
    return [];
  },

  async createEndorsement(req: Omit<EndorsementRequest, 'id' | 'requestedAt' | 'status'> | EndorsementRequest): Promise<EndorsementRequest> {
    const id = (req as EndorsementRequest).id || `end-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newEndorsement: EndorsementRequest = {
      ...req,
      id,
      requestedAt: (req as EndorsementRequest).requestedAt || new Date().toISOString(),
      status: (req as EndorsementRequest).status || 'pending_review',
    };
    try {
      await setDoc(doc(db, 'endorsements', id), newEndorsement);
    } catch (e) {
      console.warn('Firestore createEndorsement fallback:', e);
    }
    return newEndorsement;
  },

  async updateEndorsementStatus(id: string, status: EndorsementRequest['status']): Promise<void> {
    try {
      await updateDoc(doc(db, 'endorsements', id), {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      // Fallback
    }
  },

  subscribeEndorsements(callback: (endorsements: EndorsementRequest[]) => void): Unsubscribe {
    return onSnapshot(
      collection(db, 'endorsements'),
      (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as EndorsementRequest));
          callback(data);
        }
      },
      (err) => {
        console.warn('Firestore subscribeEndorsements error:', err);
      }
    );
  },

  // ==========================================
  // 6. CERTIFIED BROKER APPOINTMENTS
  // ==========================================
  async getAppointments(): Promise<Appointment[]> {
    try {
      const snap = await getDocs(collection(db, 'appointments'));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Appointment));
      }
    } catch {
      // Fallback
    }
    return dualStore.getAppointments();
  },

  async createAppointment(apt: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> {
    const id = `apt-${Date.now()}`;
    const newApt: Appointment = {
      ...apt,
      id,
      createdAt: new Date().toISOString(),
    };
    dualStore.saveAppointment(newApt);

    try {
      await setDoc(doc(db, 'appointments', id), {
        ...newApt,
        createdAt: serverTimestamp(),
      });
    } catch {
      // Fallback
    }
    return newApt;
  },

  subscribeAppointments(callback: (apts: Appointment[]) => void): Unsubscribe {
    return onSnapshot(
      collection(db, 'appointments'),
      (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Appointment));
          callback(data);
        }
      },
      (err) => {
        console.warn('Firestore subscribeAppointments error:', err);
      }
    );
  },

  // ==========================================
  // 7. USER PROFILES & INSTITUTIONAL ACCOUNTS
  // ==========================================
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
    } catch {
      // Fallback
    }
    return dualStore.getUsers().find((u) => u.uid === uid) || null;
  },

  async saveUserProfile(user: UserProfile): Promise<void> {
    dualStore.saveUser(user);
    try {
      await setDoc(doc(db, 'users', user.uid), user, { merge: true });
    } catch {
      // Fallback
    }
  },

  // ==========================================
  // 8. CONTACT INQUIRIES & LEAD CAPTURE
  // ==========================================
  async submitInquiry(inquiry: Omit<InquiryRecord, 'id' | 'status' | 'createdAt'>): Promise<InquiryRecord> {
    const id = `inq-${Date.now()}`;
    const record: InquiryRecord = {
      ...inquiry,
      id,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'inquiries', id), record);
    } catch (e) {
      console.warn('Firestore submitInquiry fallback:', e);
    }
    return record;
  },

  async getInquiries(): Promise<InquiryRecord[]> {
    try {
      const snap = await getDocs(collection(db, 'inquiries'));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as InquiryRecord));
      }
    } catch {
      // Fallback
    }
    return [];
  },

  // ==========================================
  // 9. AUTOMATIC CLOUD DATABASE SEEDER
  // ==========================================
  async seedFirestoreIfEmpty(seedData: {
    policies: ConsumerPolicy[];
    claims: ConsumerClaim[];
    cois?: CoiCertificate[];
    endorsements?: EndorsementRequest[];
    account?: any;
    users?: UserProfile[];
  }): Promise<void> {
    try {
      const snap = await getDocs(collection(db, 'policies'));
      if (snap.empty) {
        console.log('Seeding Cloud Firestore with institutional insurance records...');
        // Seed Policies
        for (const policy of seedData.policies) {
          await setDoc(doc(db, 'policies', policy.id), policy);
        }
        // Seed Claims
        if (seedData.claims) {
          for (const claim of seedData.claims) {
            await setDoc(doc(db, 'claims', claim.id), claim);
          }
        }
        // Seed Certificates (COIs)
        if (seedData.cois) {
          for (const coi of seedData.cois) {
            await setDoc(doc(db, 'digital_cards', coi.id), coi);
          }
        }
        // Seed Endorsements
        if (seedData.endorsements) {
          for (const endorsement of seedData.endorsements) {
            await setDoc(doc(db, 'endorsements', endorsement.id), endorsement);
          }
        }
        // Seed Account
        if (seedData.account) {
          await setDoc(doc(db, 'users', seedData.account.id), seedData.account);
        }
        // Seed Users
        if (seedData.users) {
          for (const user of seedData.users) {
            await setDoc(doc(db, 'users', user.uid), user);
          }
        }
        console.log('Cloud Firestore successfully seeded!');
      }
    } catch (err) {
      console.warn('Firestore seeding check skipped or offline:', err);
    }
  },
};

// ====================================================
// Agency CRM & Lead Pipeline Services
// ====================================================

export const leadService = {
  async saveLead(leadData: Omit<LeadRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<LeadRecord> {
    const id = `lead-${Date.now()}`;
    const now = new Date().toISOString();
    const newLead: LeadRecord = {
      ...leadData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await setDoc(doc(db, 'leads', id), {
        ...newLead,
        serverTimestamp: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Firestore saveLead fallback:', e);
    }
    return newLead;
  },

  async getLeads(): Promise<LeadRecord[]> {
    try {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as LeadRecord));
      }
    } catch (e) {
      console.warn('Firestore getLeads error:', e);
    }
    return [];
  },

  async updateLeadStatus(id: string, status: LeadRecord['status'], notes?: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'leads', id), {
        status,
        ...(notes !== undefined ? { notes } : {}),
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore updateLeadStatus error:', e);
    }
  },

  subscribeLeads(callback: (leads: LeadRecord[]) => void): Unsubscribe {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as LeadRecord));
          callback(data);
        } else {
          callback([]);
        }
      },
      (err) => {
        console.warn('Firestore subscribeLeads error:', err);
      }
    );
  },

  subscribeToLeads(callback: (leads: LeadRecord[]) => void): Unsubscribe {
    return this.subscribeLeads(callback);
  },
};

// ====================================================
// Demand & Needs Assessment (IDD Compliance)
// ====================================================

export const needsAssessmentService = {
  async saveAssessment(
    assessment: Omit<NeedsAssessmentRecord, 'id' | 'createdAt'>
  ): Promise<NeedsAssessmentRecord> {
    const id = `na-${Date.now()}`;
    const newRecord: NeedsAssessmentRecord = {
      ...assessment,
      id,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'needs_assessments', id), newRecord);
    } catch (e) {
      console.warn('Firestore saveAssessment error:', e);
    }
    return newRecord;
  },

  async getAssessments(): Promise<NeedsAssessmentRecord[]> {
    try {
      const snap = await getDocs(collection(db, 'needs_assessments'));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as NeedsAssessmentRecord));
      }
    } catch (e) {
      console.warn('Firestore getAssessments error:', e);
    }
    return [];
  },
};

export interface RenewalAlertPolicy {
  policy: ConsumerPolicy;
  daysRemaining: number;
  urgency: 'critical' | 'warning' | 'notice';
}

export function calculateExpiringPolicies(policies: ConsumerPolicy[]): RenewalAlertPolicy[] {
  const now = new Date();
  const alerts: RenewalAlertPolicy[] = [];

  for (const policy of policies) {
    const expiry = new Date(policy.endDate || (policy as any).expiration_date || '');
    if (isNaN(expiry.getTime())) continue;

    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 30 && diffDays >= 0) {
      let urgency: 'critical' | 'warning' | 'notice' = 'notice';
      if (diffDays <= 7) urgency = 'critical';
      else if (diffDays <= 15) urgency = 'warning';

      alerts.push({ policy, daysRemaining: diffDays, urgency });
    }
  }

  return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
}

