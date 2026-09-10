export interface UserProfile {
  uid: string;
  email: string;
  role: 'policyholder' | 'broker' | 'admin';
  displayName: string;
  phone: string;
  oib?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  licenseNumber?: string;
  createdAt: string;
}

export interface QuoteRequest {
  id: string;
  userId?: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    oib?: string;
  };
  type: 'auto' | 'property' | 'life' | 'health';
  inputs: Record<string, any>;
  calculatedEstimate: {
    annualPremium: number;
    monthlyPremium: number;
    currency: 'EUR';
    deductible?: number;
    coverageLimit?: number;
  };
  status: 'new' | 'contacted' | 'quoted' | 'bound' | 'lost';
  assignedBrokerId?: string;
  createdAt: string;
}

export interface Policy {
  id: string;
  policyNumber: string;
  userId: string;
  insuredName: string;
  type: 'auto' | 'property' | 'life' | 'health';
  insurer: string; // e.g., "Generali osiguranje d.d."
  startDate: string;
  endDate: string;
  premiumAmount: number;
  currency: 'EUR';
  paymentFrequency: 'monthly' | 'quarterly' | 'annually';
  status: 'active' | 'expiring_soon' | 'expired' | 'cancelled';
  documents: Array<{ title: string; url: string; uploadedAt: string }>;
}

export interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  userId: string;
  incidentDate: string;
  incidentLocation: string;
  description: string;
  estimatedDamage?: number;
  currency: 'EUR';
  evidenceUrls: string[];
  status: 'submitted' | 'under_review' | 'assessing' | 'approved' | 'rejected' | 'paid';
  brokerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  type: 'phone' | 'video' | 'in_person';
  dateTime: string;
  topic: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}
