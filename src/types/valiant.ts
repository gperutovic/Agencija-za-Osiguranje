export type PolicyStatus = 'active' | 'pending_renewal' | 'lapsed' | 'cancelled';
export type ClaimStatus = 'triaged' | 'adjuster_assigned' | 'under_investigation' | 'settled' | 'rejected';
export type IncidentType = 'Commercial Property Damage' | 'Bodily Injury & Premises' | 'Technology E&O / Data Breach' | 'Third-Party Liability' | 'Transit & Cargo Loss';
export type LineOfBusiness = 
  | 'Commercial General Liability' 
  | 'Commercial Property & Business Interruption' 
  | 'Technology E&O & Cyber Risk' 
  | 'Directors & Officers (D&O)' 
  | 'Commercial Auto Fleet' 
  | 'Workers Compensation & Employers Liability';

export interface CommercialAccount {
  id: string;
  company_name: string;
  dba?: string;
  tax_id_ein: string;
  naics_code: string;
  industry_category: string;
  headquarters_address: string;
  annual_revenue: number;
  full_time_employees: number;
  annual_payroll: number;
  created_at: string;
}

export interface Policy {
  id: string;
  account_id: string;
  policy_number: string;
  carrier_name: string;
  naic_number?: string;
  iso_form_code?: string;
  line_of_business: LineOfBusiness | string;
  aggregate_limit: number;
  occurrence_limit: number;
  deductible: number;
  effective_date: string;
  expiration_date: string;
  status: PolicyStatus;
  annual_premium: number;
  insured_name?: string;
  created_at: string;
}

export interface CoiCertificate {
  id: string;
  policy_id: string;
  holder_name: string;
  holder_address: string;
  additional_insured: boolean;
  waiver_subrogation: boolean;
  primary_noncontributory?: boolean;
  special_conditions?: string;
  issued_at: string;
  verification_hash: string;
  policy_number?: string;
  carrier_name?: string;
  naic_number?: string;
  insured_name?: string;
}

export interface ClaimFnol {
  id: string;
  policy_id: string;
  policy_number?: string;
  incident_date: string;
  reported_date: string;
  incident_type: IncidentType | string;
  description: string;
  location: string;
  injuries_reported: boolean;
  police_report_filed: boolean;
  police_report_number?: string;
  estimated_loss?: number;
  status: ClaimStatus;
  assigned_adjuster?: string;
  adjuster_email?: string;
  adjuster_phone?: string;
  reserve_amount?: number;
  document_urls: string[];
}

export interface NaicsCode {
  code: string;
  title: string;
  hazardClass: 'Low' | 'Moderate' | 'High' | 'Severe';
  baseRateMultiplier: number;
  description: string;
}

export interface CarrierQuote {
  carrierId: string;
  carrierName: string;
  naicNumber?: string;
  syndicateName: string;
  amBestRating: string;
  spRating: string;
  annualPremium: number;
  monthlyPremium: number;
  deductible: number;
  aggregateLimit: number;
  occurrenceLimit: number;
  keyFeatures: string[];
  keyExclusions: string[];
  underwritingConfidenceScore: number;
  quoteId: string;
  admittedPaper?: boolean;
}

export interface QuoteFormData {
  // Stage 1: Corporate Entity Profile
  companyName: string;
  jurisdiction: string;
  taxIdEin: string;
  naicsCode: string;
  industryTitle: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;

  // Stage 2: Operational Exposures & Loss History
  annualRevenue: number;
  grossPayroll: number;
  fullTimeEmployees: number;
  premisesSquareFootage: number;
  fleetVehicleCount: number;
  hasSprinklers: boolean;
  hasInternationalExposure: boolean;
  internationalCountries?: string;
  priorLosses3Years: number;
  priorLossDetails?: string;

  // Stage 3: Coverage Customizer
  lineOfBusiness: LineOfBusiness | string;
  aggregateLimit: number;
  occurrenceLimit: number;
  deductible: number;
  includeCyberEndorsement: boolean;
  includeHiredAuto: boolean;
  includeEpliRider: boolean;

  // Stage 4: Selection
  selectedCarrierId?: string;

  // Stage 5: Bind Execution
  signatureName?: string;
  signatureDataUrl?: string;
  paymentMethod?: 'ach' | 'credit_card';
  accountRoutingNumber?: string;
  bankAccountNumber?: string;
  billingAddress?: string;
  binderNumber?: string;
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

export interface AppetiteSector {
  sector: string;
  naicsPrefix: string;
  chubbAppetite: 'Aggressive' | 'Selective' | 'Restricted' | 'Prohibited';
  travelersAppetite?: 'Aggressive' | 'Selective' | 'Restricted' | 'Prohibited';
  aigAppetite: 'Aggressive' | 'Selective' | 'Restricted' | 'Prohibited';
  lloydsAppetite: 'Aggressive' | 'Selective' | 'Restricted' | 'Prohibited';
  maxCapacity: string;
  targetRisks: string[];
}
