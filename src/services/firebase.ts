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
import { app, auth, db, storage, INITIAL_USERS } from '../api/firebase';
import { firestoreService } from '../api/firestoreService';
import { LeadRecord, NeedsAssessmentRecord, Policy, Claim } from '../types/database';

export { app, auth, db, storage, INITIAL_USERS, firestoreService };

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

// ====================================================
// Renewal Alert Calculation Helper
// ====================================================

export interface RenewalAlertPolicy {
  policy: Policy;
  daysRemaining: number;
  urgency: 'critical' | 'warning' | 'notice';
}

export function calculateExpiringPolicies(policies: Policy[]): RenewalAlertPolicy[] {
  const now = new Date();
  const alerts: RenewalAlertPolicy[] = [];

  for (const policy of policies) {
    const expiry = new Date(policy.endDate || policy.expiration_date || '');
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
