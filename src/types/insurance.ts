export type InsuranceProductType = 'auto' | 'kasko' | 'property' | 'life' | 'health' | 'travel' | 'business';

// ==========================================
// 1. CANONICAL INSURTECH MODELS (FIRESTORE & PORTALS)
// ==========================================

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone: string;
  oib?: string;
  iban?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  assignedAdvisorId: string;
  createdAt: string;
  communicationPreferences?: {
    emailNotifications: boolean;
    smsExpiryAlerts: boolean;
    whatsappClaimsUpdates: boolean;
    marketingOffers: boolean;
  };
  gdprDeletionRequestedAt?: string | null;
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
  type: InsuranceProductType;
  carrier: string; // e.g. "Generali osiguranje d.d." or "Toyota Osiguranje"
  startDate: string;
  endDate: string;
  status: 'active' | 'expiring_soon' | 'expired' | 'renewal_pending';
  premiumAnnual: number;
  paymentFrequency: 'annual' | 'semi-annual' | 'quarterly' | 'monthly';
  assetName: string; // e.g. "Toyota RAV4 2.5 Hybrid (ZG-4821-HP)"
  clientName?: string;
  clientOib?: string;
  assignedAgentId?: 'diana' | 'hrvoje' | 'laura';
  provisionStatus?: 'paid_provision' | 'pending_provision' | 'archived';
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
  statusTag?: 'submitted' | 'under_review' | 'sent_to_insurer' | 'assessor_assigned' | 'approved' | 'paid' | 'rejected';
}

export interface Claim {
  id: string;
  policyId: string;
  policyNumber?: string;
  userId: string;
  clientName?: string;
  clientOib?: string;
  carrierName?: string;
  incidentDate: string;
  location: string;
  category: string; // e.g., "collision", "water_damage", "storm_hail", "theft", "liability", "health"
  description: string;
  mediaUrls: string[];
  status: 'submitted' | 'under_review' | 'sent_to_insurer' | 'assessor_assigned' | 'approved' | 'paid' | 'rejected';
  /**
   * 5-Phase visual progress:
   * 1: Zaprimljeno
   * 2: Provjera dokumentacije
   * 3: Predano osiguratelju
   * 4: Procjena štete
   * 5: Isplata / Riješeno
   */
  phase?: 1 | 2 | 3 | 4 | 5;
  damagedZones?: string[];
  culpability?: string;
  policeReportFiled?: boolean;
  documentChecklist?: string[];
  agentNotes?: string;
  claimAmountRequested?: number;
  claimAmountApproved?: number;
  iban: string;
  timeline: ClaimTimelineEvent[];
  createdAt: string;
  claimNumber?: string;
  assessorName?: string;
  assessorPhone?: string;
}

export interface InformativeOffer {
  id: string;
  offerNumber: string;
  clientName: string;
  clientOib: string;
  clientEmail: string;
  clientPhone: string;
  productType: InsuranceProductType;
  productTitle: string;
  carrier: string;
  assetDescription: string;
  annualPremium: number;
  annualPremiumEur?: number;
  monthlyInstallmentEur?: number;
  packageTier?: string;
  paymentDynamics: 'Godišnje' | 'Polugodišnje' | 'Kvartalno' | 'Mjesečno (12 rata)';
  deductibleEur: number;
  coverageLimitEur: number;
  riders: string[];
  coverageHighlights?: string[];
  status: 'u_obradi' | 'ponuda_spremna' | 'poslana_klijentu' | 'prihvacena' | 'odbijena';
  assignedAgentId: 'diana' | 'hrvoje' | 'laura';
  createdAt: string;
  validUntil: string;
  pdfCalculationAttached: boolean;
  iddNeedsVerified: boolean;
  iddVerified?: boolean;
  notes?: string;
  details?: Record<string, any>;
}

export interface ContractPipelineItem {
  id: string;
  offerId?: string;
  referenceCode: string;
  clientName: string;
  clientOib: string;
  clientEmail: string;
  clientPhone: string;
  productTitle: string;
  carrier: string;
  annualPremiumEur: number;
  /**
   * 1: Upit i IDD analiza
   * 2: Obrada i procjena rizika
   * 3: Ponuda poslana klijentu
   * 4: Potpis i uplata premije
   * 5: Polica izdana i arhivirana
   */
  stage: 1 | 2 | 3 | 4 | 5;
  assignedAgentId: 'diana' | 'hrvoje' | 'laura';
  updatedAt: string;
  notes?: string;
}

export interface PrefilledQuoteTransfer {
  productType: InsuranceProductType;
  tierName: string;
  estimatedAnnualEur: number;
  deductibleEur: number;
  coverageLimitEur: number;
  riders: string[];
  vehicleModel?: string;
  kwPower?: number;
  areaM2?: number;
}

export interface GdprRequestRecord {
  id: string;
  userId: string;
  clientName: string;
  clientOib: string;
  clientEmail: string;
  requestType: 'data_export' | 'account_deletion';
  reason?: string;
  status: 'zaprimljeno' | 'izvrseno';
  createdAt: string;
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
