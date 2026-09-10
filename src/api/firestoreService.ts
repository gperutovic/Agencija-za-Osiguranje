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
  serverTimestamp,
} from 'firebase/firestore';
import { db, dualStore } from './firebase';
import { UserProfile, Policy, Claim, QuoteRequest, Appointment } from '../types/database';

export const firestoreService = {
  // Quotes
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

  async createQuote(quote: Omit<QuoteRequest, 'id' | 'createdAt'>): Promise<QuoteRequest> {
    const id = `quote-${Date.now()}`;
    const newQuote: QuoteRequest = {
      ...quote,
      id,
      createdAt: new Date().toISOString(),
    };
    dualStore.saveQuote(newQuote);

    try {
      await setDoc(doc(db, 'quotes', id), {
        ...newQuote,
        createdAt: serverTimestamp(),
      });
    } catch {
      // Local fallback saved
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
      await updateDoc(doc(db, 'quotes', id), { status });
    } catch {
      // Fallback
    }
  },

  // Policies
  async getPolicies(userId?: string): Promise<Policy[]> {
    try {
      const colRef = collection(db, 'policies');
      const q = userId ? query(colRef, where('userId', '==', userId)) : colRef;
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Policy));
      }
    } catch {
      // Fallback
    }
    return dualStore.getPolicies(userId);
  },

  async renewPolicyRequest(policyId: string): Promise<void> {
    const policies = dualStore.getPolicies();
    const target = policies.find((p) => p.id === policyId);
    if (target) {
      // Extend end date by 1 year and mark active
      const curEnd = new Date(target.endDate);
      curEnd.setFullYear(curEnd.getFullYear() + 1);
      target.endDate = curEnd.toISOString();
      target.status = 'active';
      dualStore.savePolicy(target);
    }
    try {
      await updateDoc(doc(db, 'policies', policyId), {
        status: 'active',
      });
    } catch {
      // Fallback
    }
  },

  // Claims
  async getClaims(userId?: string): Promise<Claim[]> {
    try {
      const colRef = collection(db, 'claims');
      const q = userId ? query(colRef, where('userId', '==', userId)) : colRef;
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Claim));
      }
    } catch {
      // Fallback
    }
    return dualStore.getClaims(userId);
  },

  async createClaim(claimData: Omit<Claim, 'id' | 'createdAt' | 'updatedAt'>): Promise<Claim> {
    const id = `claim-${Date.now()}`;
    const now = new Date().toISOString();
    const newClaim: Claim = {
      ...claimData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    dualStore.saveClaim(newClaim);

    try {
      await setDoc(doc(db, 'claims', id), {
        ...newClaim,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch {
      // Fallback
    }
    return newClaim;
  },

  async updateClaimStatus(
    id: string,
    status: Claim['status'],
    brokerNotes?: string
  ): Promise<void> {
    const claims = dualStore.getClaims();
    const existing = claims.find((c) => c.id === id);
    if (existing) {
      existing.status = status;
      if (brokerNotes !== undefined) existing.brokerNotes = brokerNotes;
      existing.updatedAt = new Date().toISOString();
      dualStore.saveClaim(existing);
    }
    try {
      await updateDoc(doc(db, 'claims', id), {
        status,
        ...(brokerNotes !== undefined ? { brokerNotes } : {}),
        updatedAt: serverTimestamp(),
      });
    } catch {
      // Fallback
    }
  },

  // Appointments
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

  async createAppointment(
    apt: Omit<Appointment, 'id' | 'createdAt'>
  ): Promise<Appointment> {
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

  // Users
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const user = dualStore.getUsers().find((u) => u.uid === uid);
    if (user) return user;
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  async saveUserProfile(user: UserProfile): Promise<void> {
    dualStore.saveUser(user);
    try {
      await setDoc(doc(db, 'users', user.uid), user, { merge: true });
    } catch {
      // Fallback
    }
  },
};
