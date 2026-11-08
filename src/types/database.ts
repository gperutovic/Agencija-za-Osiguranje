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
  policyNumber?: string;
  userId: string;
  clientName?: string;
  clientOib?: string;
  incidentDate: string;
  incidentLocation?: string;
  description: string;
  estimatedDamage?: number;
  claimAmountRequested?: number;
  currency?: 'EUR';
  evidenceUrls?: string[];
  photos?: string[];
  damagedZones?: string[];
  phase?: 1 | 2 | 3 | 4 | 5;
  status:
    | 'received'
    | 'documents_verified'
    | 'forwarded_to_carrier'
    | 'assessor_assigned'
    | 'submitted'
    | 'under_review'
    | 'in_review'
    | 'assessing'
    | 'approved'
    | 'rejected'
    | 'resolved'
    | 'paid'
    | 'withdrawn';
  brokerNotes?: string;
  agentNotes?: string;
  createdAt: string;
  updatedAt: string;
  iban?: string;
  payoutIban?: string;
  policeInvolved?: boolean;
  claimantName?: string;
  claimantPhone?: string;
  claimantEmail?: string;
  timeline?: Array<{
    title: string;
    description: string;
    timestamp: string;
    author: string;
    statusTag?: string;
  }>;
}

export interface InformativeOfferRecord {
  id: string;
  offerNumber: string;
  clientName: string;
  clientOib: string;
  clientEmail: string;
  clientPhone: string;
  productType: 'auto' | 'kasko' | 'property' | 'life' | 'health' | 'travel' | 'business' | 'cyber' | 'liability';
  productTitle: string;
  carrier: string;
  assetDescription: string;
  annualPremium: number;
  annualPremiumEur?: number;
  monthlyInstallmentEur: number;
  packageTier?: 'Osnovni' | 'Komfort' | 'Ekskluziv';
  paymentDynamics: 'Godišnje' | 'Polugodišnje' | 'Kvartalno' | 'Mjesečno (12 rata)';
  deductibleEur: number;
  coverageLimitEur: number;
  riders: string[];
  coverageHighlights?: string[];
  status: 'u_obradi' | 'ponuda_spremna' | 'prihvacena' | 'odbijena';
  assignedAgentId: 'diana' | 'hrvoje' | 'laura';
  createdAt: string;
  validUntil: string;
  pdfCalculationAttached: boolean;
  iddNeedsVerified: boolean;
  iddVerified?: boolean;
  notes?: string;
  details?: Record<string, string | number | boolean>;
  updatedAt?: string;
}

export interface ContractPipelineRecord {
  id: string;
  offerId?: string;
  referenceCode?: string;
  clientName: string;
  clientOib: string;
  clientEmail?: string;
  clientPhone?: string;
  productTitle: string;
  carrier: string;
  annualPremiumEur: number;
  stage: 1 | 2 | 3 | 4 | 5;
  assignedAgentId: 'diana' | 'hrvoje' | 'laura';
  updatedAt: string;
  notes: string;
  status?: 'active' | 'archived';
}

export interface GdprRequestRecord {
  id: string;
  userId: string;
  clientName: string;
  clientOib: string;
  clientEmail: string;
  requestType: 'data_export' | 'account_deletion' | 'marketing_opt_out';
  reason: string;
  status: 'zaprimljeno' | 'u_izvrsavanju' | 'izvrseno';
  createdAt: string;
  updatedAt?: string;
}

export interface MarketingCampaignRecord {
  id: string;
  title?: string;
  targetSegment?: string;
  channel?: string;
  message?: string;
  sentAt: string;
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

export type EndorsementType = 
  | 'add_vehicle' 
  | 'add_location' 
  | 'equipment_schedule' 
  | 'change_limits' 
  | 'change_entity' 
  | 'limit_increase';

export interface EndorsementRequest {
  id: string;
  policyId: string;
  requestType: EndorsementType;
  details: string;
  effectiveDate: string;
  status: 'pending_review' | 'approved' | 'bound';
  requestedAt: string;
}

export interface CoiCertificate {
  id: string;
  policy_id: string;
  holder_name: string;
  holder_address: string;
  special_provisions?: string;
  issued_at: string;
  certificate_number: string;
}

export interface ComplaintRecord {
  id: string; // Official protocol ID, e.g. PRIG-2026-XXXX
  protocolNumber: string;
  fullName: string;
  oib: string;
  email: string;
  phone: string;
  address: string;
  policyNumber?: string;
  claimNumber?: string;
  subject: string;
  description: string;
  desiredResolution?: string;
  status: 'received' | 'in_review' | 'resolved';
  statutoryDeadline: string; // 15 days from submission
  responseNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpiryReminderRecord {
  id: string;
  identifier: string; // License plate or OIB
  category: 'auto' | 'dopunsko' | 'imovina' | 'kasko' | 'ostalo';
  expiryDate: string;
  phone: string;
  fullName?: string;
  email?: string;
  status: 'pending' | 'reminded_30d' | 'quoted' | 'renewed';
  estimatedSavingsEur?: number;
  createdAt: string;
}


