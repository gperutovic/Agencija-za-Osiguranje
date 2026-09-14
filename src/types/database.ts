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

export interface LeadRecord {
  id: string;
  oib: string;
  name: string;
  fullName?: string;
  email: string;
  phone: string;
  productType: 'auto' | 'property' | 'health' | 'life' | 'business';
  data: Record<string, any>;
  status: 'new' | 'contacted' | 'quoted' | 'bound' | 'lost';
  agentAssigned?: string;
  notes?: string;
  selectedInsurer?: string;
  annualPremium?: number;
  createdAt: string;
  updatedAt: string;
}

export interface NeedsAssessmentRecord {
  id: string;
  clientOib: string;
  clientEmail: string;
  riskProfile: 'conservative' | 'balanced' | 'comprehensive';
  answers: Record<string, any>;
  recommendedProducts: string[];
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
  type: 'auto' | 'property' | 'life' | 'health' | 'business';
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
  userId: string;
  clientName?: string;
  oib?: string;
  policyNumber: string;
  insuredName: string;
  productType?: 'auto' | 'property' | 'life' | 'health' | 'business';
  type: 'auto' | 'property' | 'life' | 'health' | 'business';
  insurer: string; // e.g., "Croatia osiguranje d.d."
  insurerName?: string;
  startDate: string;
  endDate: string;
  premiumAmount: number;
  premiumEur?: number;
  currency: 'EUR';
  paymentFrequency: 'monthly' | 'quarterly' | 'annually';
  status: 'active' | 'expiring_soon' | 'expired' | 'cancelled';
  documents: Array<{ title?: string; name?: string; url: string; uploadedAt?: string }>;
  // Optional commercial fields for legacy compatibility
  account_id?: string;
  policy_number?: string;
  carrier_name?: string;
  line_of_business?: string;
  aggregate_limit?: number;
  occurrence_limit?: number;
  deductible?: number;
  annual_premium?: number;
  effective_date?: string;
  expiration_date?: string;
  created_at?: string;
}

export interface Claim {
  id: string;
  claimNumber?: string;
  policyId: string;
  userId: string;
  incidentDate: string;
  incidentLocation?: string;
  description: string;
  estimatedDamage?: number;
  currency?: 'EUR';
  evidenceUrls?: string[];
  photos?: string[];
  status: 'submitted' | 'under_review' | 'in_review' | 'assessing' | 'approved' | 'rejected' | 'resolved' | 'paid';
  brokerNotes?: string;
  createdAt: string;
  updatedAt: string;
  iban?: string;
  policeInvolved?: boolean;
  claimantName?: string;
  claimantPhone?: string;
  claimantEmail?: string;
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
