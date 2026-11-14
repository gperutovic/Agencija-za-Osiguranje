import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { UserProfile, Policy, Claim, QuoteRequest, Appointment } from '../types/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBM2g2zVhRbEkxTsFnKL-NpgT4XBDsDBks',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'agencija-za-osiguranje.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'agencija-za-osiguranje',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'agencija-za-osiguranje.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '175340495427',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:175340495427:web:dcaeb89300970b547b2af6',
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Seed Data for Instant Enterprise Operation
export const INITIAL_USERS: UserProfile[] = [
  {
    uid: 'user-policyholder-1',
    email: 'ana.horvat@email.hr',
    displayName: 'Ana Horvat',
    role: 'policyholder',
    phone: '+385 91 234 5678',
    oib: '26182105153',
    address: {
      street: 'Vlaška 42',
      city: 'Zagreb',
      postalCode: '10000',
      country: 'Hrvatska',
    },
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    uid: 'user-broker-1',
    email: 'marija.saric@agencija-zivot.hr',
    displayName: 'Marija Šarić',
    role: 'broker',
    phone: '+385 98 765 4321',
    oib: '79213456782',
    licenseNumber: 'HANFA-ZAS-2024-991',
    address: {
      street: 'Palmotićeva 76',
      city: 'Zagreb',
      postalCode: '10000',
      country: 'Hrvatska',
    },
    createdAt: '2023-06-01T08:00:00Z',
  },
  {
    uid: 'user-admin-1',
    email: 'ivan.radic@agencija-zivot.hr',
    displayName: 'Ivan Radić',
    role: 'admin',
    phone: '+385 1 4800 120',
    oib: '14329077049',
    address: {
      street: 'Palmotićeva 76',
      city: 'Zagreb',
      postalCode: '10000',
      country: 'Hrvatska',
    },
    createdAt: '2023-01-01T08:00:00Z',
  },
];

const now = new Date();
const inTwentyDays = new Date(now.getTime() + 20 * 86400000).toISOString();
const inElevenMonths = new Date(now.getTime() + 330 * 86400000).toISOString();
const inTwoYears = new Date(now.getTime() + 730 * 86400000).toISOString();

export const INITIAL_POLICIES: Policy[] = [
  {
    id: 'pol-dom-01',
    policyNumber: 'GEN-DOM-2024-118',
    userId: 'user-policyholder-1',
    insuredName: 'Ana Horvat',
    type: 'property',
    insurer: 'Generali osiguranje d.d.',
    startDate: '2024-04-01T00:00:00Z',
    endDate: inTwentyDays, // Expiring soon (< 30 days)
    premiumAmount: 236.4,
    currency: 'EUR',
    paymentFrequency: 'annually',
    status: 'expiring_soon',
    documents: [
      {
        title: 'Polica osiguranja doma i potresa (Generali Dom Sigurnost)',
        url: 'https://example.com/polica-dom.pdf',
        uploadedAt: '2024-04-01T10:00:00Z',
      },
      {
        title: 'Predugovorni informativni dokument (IPID)',
        url: 'https://example.com/ipid-dom.pdf',
        uploadedAt: '2024-04-01T10:00:00Z',
      },
    ],
  },
  {
    id: 'pol-auto-02',
    policyNumber: 'GEN-AO-2025-912',
    userId: 'user-policyholder-1',
    insuredName: 'Ana Horvat',
    type: 'auto',
    insurer: 'Generali osiguranje d.d.',
    startDate: '2025-01-10T00:00:00Z',
    endDate: inElevenMonths,
    premiumAmount: 480.0,
    currency: 'EUR',
    paymentFrequency: 'monthly',
    status: 'active',
    documents: [
      {
        title: 'Polica autoodgovornosti i punog kaska s 50% bonusa',
        url: 'https://example.com/polica-auto.pdf',
        uploadedAt: '2025-01-10T09:30:00Z',
      },
      {
        title: 'Potvrda o asistenciji na cesti 24/7 (RH i Europa)',
        url: 'https://example.com/asistencija.pdf',
        uploadedAt: '2025-01-10T09:30:00Z',
      },
    ],
  },
  {
    id: 'pol-ziv-03',
    policyNumber: 'GEN-ZIV-2023-455',
    userId: 'user-policyholder-1',
    insuredName: 'Ana Horvat',
    type: 'life',
    insurer: 'Generali osiguranje d.d.',
    startDate: '2023-11-01T00:00:00Z',
    endDate: inTwoYears,
    premiumAmount: 600.0,
    currency: 'EUR',
    paymentFrequency: 'quarterly',
    status: 'active',
    documents: [
      {
        title: 'Ugovor o životnom osiguranju ŽIVOT+ s doživljenjem',
        url: 'https://example.com/polica-zivot.pdf',
        uploadedAt: '2023-11-01T11:00:00Z',
      },
    ],
  },
];

export const INITIAL_CLAIMS: Claim[] = [
  {
    id: 'claim-001',
    claimNumber: 'ST-2026-0814',
    policyId: 'pol-auto-02',
    userId: 'user-policyholder-1',
    incidentDate: '2026-02-14T15:30:00Z',
    incidentLocation: 'Ilica 242, Zagreb',
    description: 'Oštećenje prednjeg branika i desnog blatobrana uslijed kontakta na parkiralištu.',
    estimatedDamage: 850.0,
    currency: 'EUR',
    evidenceUrls: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
    ],
    status: 'assessing',
    brokerNotes: 'Izvid štete zakazan s ovlaštenim procjeniteljem Generali osiguranja.',
    createdAt: '2026-02-15T09:00:00Z',
    updatedAt: '2026-02-16T11:00:00Z',
  },
  {
    id: 'claim-002',
    claimNumber: 'ST-2025-7721',
    policyId: 'pol-dom-01',
    userId: 'user-policyholder-1',
    incidentDate: '2025-08-20T18:00:00Z',
    incidentLocation: 'Vlaška 42, Zagreb',
    description: 'Puknuće dovodne vodovodne cijevi u kupaonici s oštećenjem parketa.',
    estimatedDamage: 1400.0,
    currency: 'EUR',
    evidenceUrls: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
    ],
    status: 'paid',
    brokerNotes: 'Isplaćena puna nesporna odšteta od 1.400,00 € na IBAN ugovaratelja.',
    createdAt: '2025-08-21T08:30:00Z',
    updatedAt: '2025-08-29T14:00:00Z',
  },
];

export const INITIAL_QUOTES: QuoteRequest[] = [
  {
    id: 'quote-101',
    userId: 'user-policyholder-1',
    customer: {
      fullName: 'Ana Horvat',
      email: 'ana.horvat@email.hr',
      phone: '+385 91 234 5678',
      oib: '26182105153',
    },
    type: 'auto',
    inputs: { kwPower: 85, vehicleAge: 3, bonusPercentage: 50, includeKasko: true },
    calculatedEstimate: {
      annualPremium: 480.0,
      monthlyPremium: 40.0,
      currency: 'EUR',
      coverageLimit: 6450000,
    },
    status: 'quoted',
    assignedBrokerId: 'user-broker-1',
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'quote-102',
    customer: {
      fullName: 'Marko Babić',
      email: 'marko.babic@t-com.hr',
      phone: '+385 98 111 2222',
    },
    type: 'property',
    inputs: { areaM2: 95, propertyType: 'apartment', includeEarthquake: true },
    calculatedEstimate: {
      annualPremium: 220.0,
      monthlyPremium: 18.33,
      currency: 'EUR',
      coverageLimit: 133000,
    },
    status: 'new',
    createdAt: '2026-03-08T14:15:00Z',
  },
  {
    id: 'quote-103',
    customer: {
      fullName: 'Ivana Kovač',
      email: 'ivana.kovac@gmail.com',
      phone: '+385 99 333 4444',
    },
    type: 'life',
    inputs: { age: 35, durationYears: 20, sumInsured: 50000, isSmoker: false },
    calculatedEstimate: {
      annualPremium: 490.0,
      monthlyPremium: 40.83,
      currency: 'EUR',
      coverageLimit: 50000,
    },
    status: 'contacted',
    assignedBrokerId: 'user-broker-1',
    createdAt: '2026-03-05T09:00:00Z',
  },
  {
    id: 'quote-104',
    customer: {
      fullName: 'Petar Novak',
      email: 'petar.novak@adria.hr',
      phone: '+385 95 888 9999',
    },
    type: 'health',
    inputs: { packageType: 'plus', includeBListDrugs: true },
    calculatedEstimate: {
      annualPremium: 316.0,
      monthlyPremium: 26.33,
      currency: 'EUR',
      coverageLimit: 75000,
    },
    status: 'bound',
    assignedBrokerId: 'user-broker-1',
    createdAt: '2026-02-28T16:00:00Z',
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    customerName: 'Ana Horvat',
    customerEmail: 'ana.horvat@email.hr',
    customerPhone: '+385 91 234 5678',
    type: 'video',
    dateTime: '2026-03-15T10:00:00',
    topic: 'Obnova police imovine i povećanje pokrića od potresa',
    status: 'scheduled',
    createdAt: '2026-03-09T12:00:00Z',
  },
  {
    id: 'apt-002',
    customerName: 'Davor Jurić',
    customerEmail: 'davor.juric@firma.hr',
    customerPhone: '+385 91 555 6677',
    type: 'in_person',
    dateTime: '2026-03-16T14:30:00',
    topic: 'Poslovno osiguranje voznog parka i imovine',
    status: 'scheduled',
    createdAt: '2026-03-08T11:00:00Z',
  },
];

// Dual-Mode Persistence Store with LocalStorage Synchronization
class DualModeInsuranceStore {
  private usersKey = 'zivot_store_users_v3';
  private policiesKey = 'zivot_store_policies_v3';
  private claimsKey = 'zivot_store_claims_v3';
  private quotesKey = 'zivot_store_quotes_v3';
  private appointmentsKey = 'zivot_store_appointments_v3';

  private load<T>(key: string, fallback: T[]): T[] {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  private save<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getUsers(): UserProfile[] {
    return this.load<UserProfile>(this.usersKey, INITIAL_USERS);
  }

  saveUser(user: UserProfile): void {
    const list = this.getUsers();
    const idx = list.findIndex((u) => u.uid === user.uid || u.email === user.email);
    if (idx >= 0) list[idx] = user;
    else list.push(user);
    this.save(this.usersKey, list);
  }

  getPolicies(userId?: string): Policy[] {
    const all = this.load<Policy>(this.policiesKey, INITIAL_POLICIES);
    return userId ? all.filter((p) => p.userId === userId) : all;
  }

  savePolicy(policy: Policy): void {
    const list = this.getPolicies();
    const idx = list.findIndex((p) => p.id === policy.id);
    if (idx >= 0) list[idx] = policy;
    else list.unshift(policy);
    this.save(this.policiesKey, list);
  }

  getClaims(userId?: string): Claim[] {
    const all = this.load<Claim>(this.claimsKey, INITIAL_CLAIMS);
    return userId ? all.filter((c) => c.userId === userId) : all;
  }

  saveClaim(claim: Claim): void {
    const list = this.getClaims();
    const idx = list.findIndex((c) => c.id === claim.id);
    if (idx >= 0) list[idx] = claim;
    else list.unshift(claim);
    this.save(this.claimsKey, list);
  }

  getQuotes(): QuoteRequest[] {
    return this.load<QuoteRequest>(this.quotesKey, INITIAL_QUOTES);
  }

  saveQuote(quote: QuoteRequest): void {
    const list = this.getQuotes();
    const idx = list.findIndex((q) => q.id === quote.id);
    if (idx >= 0) list[idx] = quote;
    else list.unshift(quote);
    this.save(this.quotesKey, list);
  }

  getAppointments(): Appointment[] {
    return this.load<Appointment>(this.appointmentsKey, INITIAL_APPOINTMENTS);
  }

  saveAppointment(appointment: Appointment): void {
    const list = this.getAppointments();
    const idx = list.findIndex((a) => a.id === appointment.id);
    if (idx >= 0) list[idx] = appointment;
    else list.unshift(appointment);
    this.save(this.appointmentsKey, list);
  }
}

export const dualStore = new DualModeInsuranceStore();

/**
 * Automatically seeds live Cloud Firestore collections on project launch if empty
 */
export async function seedCloudFirestoreDatabaseIfEmpty(): Promise<void> {
  try {
    const { getDocs, setDoc, doc, collection } = await import('firebase/firestore');

    // Check policies collection
    const policiesSnap = await getDocs(collection(db, 'policies'));
    if (policiesSnap.empty) {
      for (const policy of INITIAL_POLICIES) {
        await setDoc(doc(db, 'policies', policy.id), policy);
      }
    }

    // Check quotes collection
    const quotesSnap = await getDocs(collection(db, 'quotes'));
    if (quotesSnap.empty) {
      for (const quote of INITIAL_QUOTES) {
        await setDoc(doc(db, 'quotes', quote.id), quote);
      }
    }

    // Check claims collection
    const claimsSnap = await getDocs(collection(db, 'claims'));
    if (claimsSnap.empty) {
      for (const claim of INITIAL_CLAIMS) {
        await setDoc(doc(db, 'claims', claim.id), claim);
      }
    }

    // Check users collection
    const usersSnap = await getDocs(collection(db, 'users'));
    if (usersSnap.empty) {
      for (const user of INITIAL_USERS) {
        await setDoc(doc(db, 'users', user.uid), user);
      }
    }

    // Check appointments collection
    const apptsSnap = await getDocs(collection(db, 'appointments'));
    if (apptsSnap.empty) {
      for (const appt of INITIAL_APPOINTMENTS) {
        await setDoc(doc(db, 'appointments', appt.id), appt);
      }
    }
  } catch (error) {
    console.info('Cloud Firestore seeding fallback active:', error);
  }
}

// Automatically trigger seeding in background
seedCloudFirestoreDatabaseIfEmpty().catch(() => {});

