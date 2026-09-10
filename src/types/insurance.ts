export type InsuranceProductType = 'auto' | 'property' | 'life' | 'health';

export interface AutoQuoteParams {
  kwPower: number;
  vehicleAge: number;
  bonusPercentage: number; // 0 to 50
  usageType: 'private' | 'commercial';
  includeKasko: boolean;
  includeAssistance: boolean;
  includeGlass: boolean;
  includeBonusProtection: boolean;
}

export interface PropertyQuoteParams {
  areaM2: number;
  propertyType: 'apartment' | 'house' | 'holiday';
  constructionYear: number;
  includeContents: boolean;
  includeEarthquake: boolean;
  includeFlood: boolean;
  deductibleTier?: number;
}

export interface LifeQuoteParams {
  age: number;
  durationYears: number;
  sumInsured: number;
  isSmoker: boolean;
  includeCriticalIllness: boolean;
}

export interface HealthQuoteParams {
  packageType: 'basic' | 'plus';
  includePreventiveCheckup: boolean;
  includeBListDrugs: boolean;
}

export interface CalculatedQuoteEstimate {
  annualPremium: number;
  monthlyPremium: number;
  quarterlyPremium: number;
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
