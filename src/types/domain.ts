export type Language = 'hr' | 'en';

export type ProductLine =
  | 'auto'
  | 'imovina'
  | 'zdravstveno'
  | 'zivotno'
  | 'putno'
  | 'ljubimci'
  | 'poslovno';

export type UserRole = 'client' | 'agent' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone: string;
  oib?: string;
  city?: string;
  postalCode?: string;
  createdAt: string;
}

export interface ConsentRecord {
  ipidAcknowledged: boolean;
  gdprEssential: boolean;
  gdprMarketing: boolean;
  timestamp: string;
  policyVersion: string;
}

export interface AutoQuoteInput {
  productLine: 'auto';
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  kw: number;
  bonusPercent: number; // 0 to 50
  youngDriver: boolean;
  annualMileage: 'under_10k' | '10k_20k' | 'over_20k';
  kaskoTier: 'ao_only' | 'mini_kasko' | 'full_kasko';
}

export interface PropertyQuoteInput {
  productLine: 'imovina';
  city: string;
  postalCode: string;
  propertyType: 'stan' | 'kuca';
  areaSqm: number;
  coverageScope: 'building' | 'contents' | 'both';
  includeEarthquake: boolean;
  includeFlood: boolean;
  includeBurglary: boolean;
}

export interface HealthQuoteInput {
  productLine: 'zdravstveno';
  age: number;
  planTier: 'dopunsko' | 'dodatno' | 'kombinirano';
  includeBListDrugs: boolean;
  includeDiagnostics: boolean;
  familyMembers: number;
}

export interface LifeQuoteInput {
  productLine: 'zivotno';
  age: number;
  smoker: boolean;
  sumInsured: number;
  termYears: number;
  includeCriticalIllness: boolean;
}

export interface TravelQuoteInput {
  productLine: 'putno';
  destination: 'eu' | 'world_excl_us' | 'world_incl_us';
  days: number;
  travelers: number;
  includeWinterSports: boolean;
  includeCancellation: boolean;
}

export interface PetQuoteInput {
  productLine: 'ljubimci';
  petType: 'dog' | 'cat';
  petAgeYears: number;
  breedSize: 'small' | 'medium' | 'large';
  includeLiability: boolean;
}

export interface BusinessQuoteInput {
  productLine: 'poslovno';
  companyType: 'obrt' | 'doo' | 'slobodna_djelatnost';
  employees: number;
  annualRevenueBand: 'under_100k' | '100k_500k' | 'over_500k';
  includeProfessionalLiability: boolean;
  includeCyber: boolean;
}

export type ProductQuoteInput =
  | AutoQuoteInput
  | PropertyQuoteInput
  | HealthQuoteInput
  | LifeQuoteInput
  | TravelQuoteInput
  | PetQuoteInput
  | BusinessQuoteInput;

export interface CoverageCustomization {
  deductible: 0 | 150 | 300 | 500;
  coverageMultiplier: 0.85 | 1 | 1.25 | 1.5;
  billingCycle: 'monthly' | 'annual';
  addons: {
    glass: boolean;
    hail: boolean;
    animals: boolean;
    roadside: boolean;
    earthquake: boolean;
  };
}

export interface CarrierOffer {
  carrierId: string;
  carrierName: string;
  carrierShortName: string;
  rating: string;
  tierLabel: string;
  monthlyPrice: number;
  annualPrice: number;
  baseAnnualBeforeBundle: number;
  bundleDiscountPercent: number;
  deductible: number;
  coverageLimit: number;
  coveredItems: string[];
  excludedItems: string[];
  ipidCode: string;
  highlightBadge?: string;
}

export interface QuoteCustomer {
  fullName: string;
  oib: string;
  email: string;
  phone: string;
  iban?: string;
}

export type QuotePipelineStatus = 'new' | 'quoted' | 'bound' | 'lost';

export interface QuoteSubmission {
  id: string;
  referenceNumber: string;
  userId?: string;
  productLine: ProductLine;
  bundleProducts: ProductLine[];
  inputs: ProductQuoteInput;
  customization: CoverageCustomization;
  selectedOffer: CarrierOffer;
  customer: QuoteCustomer;
  consents: ConsentRecord;
  status: QuotePipelineStatus;
  assignedAgent?: string;
  source: 'quote_engine' | 'switch_save' | 'ai_escalation';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExtractedPolicyFields {
  insurer: string;
  productLine: ProductLine;
  policyNumber: string;
  expiryDate: string; // YYYY-MM-DD
  currentAnnualPremium: number;
  bonusPercent?: number;
  deductible?: number;
}

export interface SwitchAnalysisRecord {
  id: string;
  referenceNumber: string;
  userId?: string;
  fileName: string;
  fileSizeBytes: number;
  parsedVia: 'gemini_ai' | 'local_analyzer';
  extractedPolicy: ExtractedPolicyFields;
  estimatedNewAnnualPremium: number;
  estimatedAnnualSavings: number;
  reminderScheduledFor: string; // YYYY-MM-DD (30 days before expiry)
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  status: QuotePipelineStatus;
  assignedAgent?: string;
  createdAt: string;
}

export interface PolicyEndorsement {
  id: string;
  type: 'add_driver' | 'change_address' | 'add_coverage' | 'renewal_request';
  summary: string;
  status: 'requested' | 'completed';
  createdAt: string;
}

export interface PolicyRecord {
  id: string;
  policyNumber: string;
  userId: string;
  clientName: string;
  clientOib: string;
  productLine: ProductLine;
  carrierName: string;
  status: 'active' | 'expiring_soon' | 'expired' | 'pending_renewal';
  startDate: string;
  expiryDate: string;
  annualPremium: number;
  monthlyPremium: number;
  deductible: number;
  coverageLimit: number;
  assetSummary: string;
  vehiclePlate?: string;
  greenCardNumber?: string;
  ipidCode: string;
  renewalReminderSentAt?: string;
  endorsements: PolicyEndorsement[];
}

export type ClaimStage = 'received' | 'insurer_review' | 'assessment' | 'paid';

export interface ClaimAttachment {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  previewDataUrl?: string;
  storageUrl?: string;
  uploadedAt: string;
}

export interface ClaimStageHistoryItem {
  stage: ClaimStage;
  note: string;
  timestamp: string;
}

export interface ClaimRecord {
  id: string;
  referenceNumber: string;
  userId?: string;
  policyNumber: string;
  productLine: ProductLine;
  carrierName: string;
  claimantName: string;
  claimantOib: string;
  claimantEmail: string;
  claimantPhone: string;
  incidentDate: string;
  incidentTime: string;
  incidentLocation: string;
  description: string;
  policeReportFiled: boolean;
  attachments: ClaimAttachment[];
  stage: ClaimStage;
  stageHistory: ClaimStageHistoryItem[];
  consents: ConsentRecord;
  estimatedAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdvisorChatCard {
  type: 'coverage_comparison' | 'quote_cta';
  title: string;
  subtitle: string;
  productLine?: ProductLine;
  bullets?: string[];
  priceHint?: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  card?: AdvisorChatCard;
}

export interface AiEscalationRecord {
  id: string;
  referenceNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  topic: string;
  transcript: AiChatMessage[];
  status: QuotePipelineStatus;
  assignedAgent?: string;
  createdAt: string;
}

export interface AdvisorThreadMessage {
  id: string;
  threadUserId: string;
  senderRole: 'client' | 'agent';
  senderName: string;
  text: string;
  createdAt: string;
}

export interface ComplaintRecord {
  id: string;
  protocolNumber: string;
  fullName: string;
  oib: string;
  email: string;
  phone: string;
  address: string;
  policyNumber?: string;
  subject: string;
  description: string;
  status: 'received' | 'in_review' | 'resolved';
  statutoryDeadlineDate: string;
  createdAt: string;
}
