export type InsuranceProductType = 'auto' | 'kasko' | 'property' | 'life' | 'health' | 'travel';

// ==========================================
// 1. CANONICAL INSURTECH MODELS (FIRESTORE)
// ==========================================

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone: string;
  oib?: string;
  assignedAdvisorId: string;
  createdAt: string;
}

export interface Advisor {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  avatarUrl: string;
  licenseNumber: string;
  schedulingUrl: string;
}

export interface PolicyDocument {
  title: string;
  type: 'policy_pdf' | 'green_card' | 'payment_slip' | 'ipid';
  downloadUrl: string;
  generatedDate?: string;
  fileSizeBytes?: number;
}

export interface Policy {
  id: string;
  userId: string;
  policyNumber: string;
  type: 'auto' | 'kasko' | 'property' | 'life' | 'travel';
  carrier: string; // e.g. "Generali osiguranje d.d."
  startDate: string;
  endDate: string;
  status: 'active' | 'expiring_soon' | 'expired' | 'renewal_pending';
  premiumAnnual: number;
  paymentFrequency: 'annual' | 'semi-annual' | 'monthly';
  assetName: string; // e.g. "Toyota RAV4 (ZG-1234-AB)"
  documents: PolicyDocument[];
  renewalOffer?: {
    newPremiumAnnual: number;
    validUntil: string;
    accepted: boolean;
    carrierDiscountPercentage?: number;
  };
  coverageDetails?: {
    limitEur: number;
    deductibleEur: number;
    riders: string[];
  };
}

export interface ClaimTimelineEvent {
  title: string;
  description: string;
  timestamp: string;
  author?: string;
  statusTag?: 'submitted' | 'under_review' | 'assessor_assigned' | 'approved' | 'paid' | 'rejected';
}

export interface Claim {
  id: string;
  policyId: string;
  userId: string;
  incidentDate: string;
  location: string;
  category: string; // e.g., "collision", "water_damage", "storm_hail", "theft", "liability"
  description: string;
  mediaUrls: string[];
  status: 'submitted' | 'under_review' | 'assessor_assigned' | 'approved' | 'paid' | 'rejected';
  claimAmountRequested?: number;
  claimAmountApproved?: number;
  iban: string;
  timeline: ClaimTimelineEvent[];
  createdAt: string;
  claimNumber?: string;
  assessorName?: string;
  assessorPhone?: string;
}

// ==========================================
// 2. OCR EXTRACTION & QUOTE FUNNEL MODELS
// ==========================================

export interface OcrPrometnaResult {
  registrationPlate?: string; // Field (A)
  firstRegistrationDate?: string; // Field (B)
  vehicleMake?: string; // Field (D.1)
  vehicleModel?: string; // Field (D.3)
  vin: string; // Field (E) - 17 chars
  powerKw: number; // Field (P.2)
  displacementCc?: number; // Field (P.1)
  fuelType?: string; // Field (P.3)
  ownerName?: string; // Field (C.1.1 / C.1.2)
  ownerAddress?: string; // Field (C.1.3)
  confidence: number; // 0 to 1
  rawExtractedLines?: string[];
}

export interface OcrPropertyDeedResult {
  cadastralMunicipality?: string; // Katastarska općina
  landRegistryNumber?: string; // Broj ZK uloška
  cadastralParcel?: string; // Katastarska čestica
  surfaceAreaM2: number;
  yearBuilt?: number;
  ownerName?: string;
  confidence: number;
}

// ==========================================
// 3. ACTUARIAL CALCULATOR PARAMS (LEGACY & EXTENDED)
// ==========================================

export interface AutoQuoteParams {
  kwPower: number;
  vehicleAge: number;
  bonusPercentage: number; // 0 to 50
  usageType: 'private' | 'commercial';
  includeKasko: boolean;
  includeAssistance: boolean;
  includeGlass: boolean;
  includeBonusProtection: boolean;
  includeHailStorm?: boolean;
  includeTheft?: boolean;
  deductibleTier?: number; // 0, 150, 300, 500 EUR
  vin?: string;
  registrationPlate?: string;
  vehicleMakeModel?: string;
}

export interface PropertyQuoteParams {
  areaM2: number;
  propertyType: 'apartment' | 'house' | 'holiday';
  constructionYear: number;
  includeContents: boolean;
  includeEarthquake: boolean;
  includeFlood: boolean;
  includeWaterPipeBreak?: boolean;
  includeTheftBurglary?: boolean;
  includeThirdPartyLiability?: boolean;
  deductibleTier?: number; // 0, 150, 300 EUR
  cadastralNumber?: string;
}

export interface LifeQuoteParams {
  age: number;
  durationYears: number;
  sumInsured: number;
  isSmoker: boolean;
  includeCriticalIllness: boolean;
  includeAccidentDisability?: boolean;
}

export interface HealthQuoteParams {
  packageType: 'basic' | 'plus';
  includePreventiveCheckup: boolean;
  includeBListDrugs: boolean;
  currentHzzoSubscriber?: boolean;
}

export interface TravelQuoteParams {
  destination: 'europe' | 'world' | 'region';
  durationDays: number;
  insuredCount: number;
  includeLuggage: boolean;
  includeSportRisk: boolean;
  cancellationProtection: boolean;
}

export interface CalculatedQuoteEstimate {
  annualPremium: number;
  monthlyPremium: number;
  quarterlyPremium?: number;
  currency: 'EUR';
  baseRate: number;
  discountsTotal: number;
  addonsTotal: number;
  deductible?: number;
  coverageLimit?: number;
  itemizedBreakdown: Array<{
    title: string;
    amount: number;
  }>;
}

export interface InsuranceServiceDetail {
  id: InsuranceProductType;
  slug: string;
  title: string;
  heroTagline: string;
  shortDescription: string;
  fullOverview: string;
  baseRateNotice: string;
  keyBenefits: string[];
  coverageHighlights: Array<{
    title: string;
    description: string;
  }>;
  regulatoryNotice: string;
}
