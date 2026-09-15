// Domain types for Croatian InsurTech Platform

export type InsuranceCategory = 'auto' | 'property' | 'health' | 'travel' | 'business';

export interface CarrierPartner {
  id: string;
  name: string;
  shortName: string;
  marketShare: string;
  rating: number;
  reviewCount: number;
  brandColor: string;
  logoSvg?: string;
  badge?: string;
  features: string[];
}

// 1. Vehicle Transfer Administrative Fee
export interface TransferCalculationResult {
  administrativeFee: number;
  permitFee: number;
  plateFee: number;
  totalCost: number;
  ratePerKw: number;
}

export interface VehicleTransferParams {
  kw: number;
  ageYears: number;
  retainPlates: boolean;
  registrationArea: string;
}

// 2. Property & Household Insurance Calculation
export interface PropertyCalculationParams {
  propertyType: 'stan' | 'kuca' | 'vikendica';
  squareMeters: number;
  includeEarthquake: boolean;
  includeWaterLeak: boolean;
  includeContents: boolean;
  constructionYear?: number;
  deductible?: number;
}

export interface PropertyCalculationResult {
  monthlyPremium: number;
  annualPremium: number;
  baseRate: number;
  addonsCost: number;
  itemizedBreakdown: Array<{ label: string; amount: number }>;
}

// 3. Auto Liability (AO) and Comprehensive Kasko
export interface AutoCalculationParams {
  kw: number;
  driverAge: number;
  bonusPercent: number; // 0 to 50
  coverageType: 'ao_only' | 'ao_kasko' | 'kasko_only';
  franchiseAmount: number; // 0, 150, 300
  registrationZone?: string;
  addons: {
    glassBreakage: boolean;
    roadAssistance: boolean;
    bonusProtection: boolean;
  };
}

export interface AutoCalculationResult {
  aoAnnual: number;
  kaskoAnnual: number;
  addonsAnnual: number;
  totalAnnual: number;
  monthlyInstallment: number;
  breakdown: Array<{ label: string; amount: number }>;
}

// 4. Supplementary Health (Dopunsko & Dodatno)
export interface HealthCalculationParams {
  planType: 'dopunsko' | 'dodatno' | 'kombinirano';
  age: number;
  includeBListDrugs: boolean;
  diagnosticTier: 'basic' | 'optimal' | 'premium';
}

export interface HealthCalculationResult {
  monthlyPremium: number;
  annualPremium: number;
  planName: string;
  features: string[];
}

// 5. Travel Insurance
export interface TravelCalculationParams {
  destination: 'europe' | 'world' | 'usa_canada';
  days: number;
  numberOfPersons: number;
  includeSports: boolean;
  includeBaggage: boolean;
  includeCancellation: boolean;
}

export interface TravelCalculationResult {
  totalPremium: number;
  perPersonCost: number;
  medicalLimit: number;
}

// Claims Intake Domain
export interface ClaimSubmission {
  id?: string;
  trackingCode?: string;
  category: 'collision' | 'property' | 'health' | 'travel';
  policyNumber: string;
  carrierName: string;
  claimantOib: string;
  claimantName: string;
  claimantPhone: string;
  claimantEmail: string;
  incidentDate: string;
  incidentLocation: string;
  description: string;
  policeReportFiled: boolean;
  policeStation?: string;
  estimatedDamage?: number;
  iban: string;
  photoFiles?: File[];
  photoUrls?: string[];
  status: 'submitted' | 'under_review' | 'assessing' | 'approved' | 'paid' | 'rejected';
  createdAt?: string;
}

// Multi-Tier Side-by-Side Coverage Comparison
export interface CoverageComparisonTier {
  id: 'osnovni' | 'plus' | 'premium';
  name: string;
  tagline: string;
  highlightBadge?: string;
  monthlyPriceStarting: number;
  annualPriceStarting: number;
  includedFeatures: string[];
  excludedFeatures: string[];
  recommendedFor: string;
}

// Educational Concept Definition
export interface InsuranceGlossaryTerm {
  term: string;
  slug: string;
  simpleExplanation: string;
  practicalExample: string;
  legalBasis?: string;
}

// Speed Camera Record for SEO
export interface SpeedCameraLocation {
  id: string;
  city: string;
  county: string;
  street: string;
  speedLimit: number;
  direction: string;
}
