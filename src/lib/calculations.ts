import {
  TransferCalculationResult,
  PropertyCalculationParams,
  AutoCalculationParams,
  HealthCalculationParams,
  HealthCalculationResult,
  TravelCalculationParams,
  TravelCalculationResult,
} from './types';

export {
  type TransferCalculationResult,
  type PropertyCalculationParams,
  type AutoCalculationParams,
};

/**
 * Format currency to Croatian standard Euro representation (€ 0,00)
 */
export function formatEuro(amount?: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0,00 €';
  }
  return new Intl.NumberFormat('hr-HR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// 1. Vehicle Transfer Administrative Fee (NN 92/21 statutory tariff)
export function calculateVehicleTransferCost(
  kw: number,
  ageYears: number,
  retainPlates: boolean
): TransferCalculationResult {
  let ratePerKw = 0;
  if (ageYears <= 1) ratePerKw = 6.64;
  else if (ageYears === 2) ratePerKw = 5.97;
  else if (ageYears === 3) ratePerKw = 5.31;
  else if (ageYears === 4) ratePerKw = 4.65;
  else if (ageYears === 5) ratePerKw = 3.98;
  else if (ageYears === 6) ratePerKw = 3.32;
  else if (ageYears === 7) ratePerKw = 2.65;
  else if (ageYears >= 8 && ageYears <= 10) ratePerKw = 1.99;
  else if (ageYears >= 11 && ageYears <= 14) ratePerKw = 1.33;
  else if (ageYears >= 15 && ageYears <= 18) ratePerKw = 0.66;
  else if (ageYears >= 19 && ageYears <= 20) ratePerKw = 0.40;
  else ratePerKw = 0.13; // 21 to 30 years

  const administrativeFee = parseFloat((kw * ratePerKw).toFixed(2));
  const permitFee = 4.65; // Fixed cost for new prometna dozvola
  const plateFee = retainPlates ? 0.0 : 8.63; // Standard new registration plates cost
  const totalCost = parseFloat((administrativeFee + permitFee + plateFee).toFixed(2));

  return { administrativeFee, permitFee, plateFee, totalCost, ratePerKw };
}

// 2. Property & Household Insurance Calculation
export function calculatePropertyPremium(params: PropertyCalculationParams): {
  monthlyPremium: number;
  annualPremium: number;
} {
  const baseRatePerMeter = params.propertyType === 'stan' ? 0.42 : 0.56;
  let annual = params.squareMeters * baseRatePerMeter;

  if (params.includeContents) {
    annual += params.squareMeters * 0.28;
  }
  if (params.includeEarthquake) {
    annual += annual * 0.25;
  }
  if (params.includeWaterLeak) {
    annual += 24.0;
  }

  const annualPremium = parseFloat(Math.max(annual, 48.0).toFixed(2));
  const monthlyPremium = parseFloat((annualPremium / 12).toFixed(2));

  return { monthlyPremium, annualPremium };
}

// 3. Auto Liability (AO) and Comprehensive Kasko
export function calculateAutoPremium(params: AutoCalculationParams): {
  aoAnnual: number;
  kaskoAnnual: number;
  addonsAnnual: number;
  totalAnnual: number;
  monthlyInstallment: number;
} {
  let baseAO = 185;
  if (params.kw < 50) baseAO = 155;
  else if (params.kw <= 70) baseAO = 180;
  else if (params.kw <= 90) baseAO = 210;
  else if (params.kw <= 110) baseAO = 245;
  else baseAO = 295;

  let ageFactor = 1.0;
  if (params.driverAge < 25) ageFactor = 1.45;
  else if (params.driverAge > 60) ageFactor = 0.95;

  const bonusDiscount = (100 - params.bonusPercent) / 100;
  const aoAnnual =
    params.coverageType === 'kasko_only'
      ? 0
      : parseFloat((baseAO * ageFactor * bonusDiscount).toFixed(2));

  let kaskoAnnual = 0;
  if (params.coverageType === 'ao_kasko' || params.coverageType === 'kasko_only') {
    let kaskoBase = baseAO * 1.85;
    if (params.franchiseAmount === 150) kaskoBase *= 0.85;
    if (params.franchiseAmount === 300) kaskoBase *= 0.72;
    kaskoAnnual = parseFloat(kaskoBase.toFixed(2));
  }

  let addonsAnnual = 0;
  if (params.addons.glassBreakage) addonsAnnual += 45;
  if (params.addons.roadAssistance) addonsAnnual += 25;
  if (params.addons.bonusProtection) addonsAnnual += 18;

  const totalAnnual = parseFloat((aoAnnual + kaskoAnnual + addonsAnnual).toFixed(2));
  const monthlyInstallment = parseFloat((totalAnnual / 12).toFixed(2));

  return { aoAnnual, kaskoAnnual, addonsAnnual, totalAnnual, monthlyInstallment };
}

// 4. Health Insurance (Dopunsko & Dodatno)
export function calculateHealthPremium(params: HealthCalculationParams): HealthCalculationResult {
  let monthly = 10.0;
  const features: string[] = [];

  if (params.planType === 'dopunsko') {
    monthly = 9.5;
    features.push('Neograničeno pokriće participacija u HZZO sustavu');
    if (params.includeBListDrugs) {
      monthly += 2.5;
      features.push('Pokriće dopunske liste lijekova (B-lista)');
    }
  } else if (params.planType === 'dodatno') {
    if (params.diagnosticTier === 'basic') {
      monthly = 16.0;
      features.push('Godišnji sistematski pregled', 'Specijalistički pregledi do 250 €');
    } else if (params.diagnosticTier === 'optimal') {
      monthly = 24.5;
      features.push('Prošireni sistematski pregled', 'Laboratorij i ultrazvuk', 'MR i CT dijagnostika u 48h');
    } else {
      monthly = 38.0;
      features.push('VIP sistematski pregled', 'Neograničeni specijalisti', 'MR/CT bez čekanja', 'Fizikalna terapija');
    }
  } else {
    // Kombinirano
    monthly = 22.0;
    if (params.includeBListDrugs) monthly += 2.0;
    if (params.diagnosticTier === 'optimal') monthly += 8.0;
    else if (params.diagnosticTier === 'premium') monthly += 18.0;
    features.push('Puno dopunsko pokriće + privatne poliklinike');
  }

  if (params.age > 50) monthly *= 1.15;
  if (params.age > 65) monthly *= 1.30;

  const monthlyPremium = parseFloat(monthly.toFixed(2));
  const annualPremium = parseFloat((monthlyPremium * 12).toFixed(2));
  const planName =
    params.planType === 'dopunsko'
      ? 'Dopunsko Zdravstveno Osiguranje'
      : params.planType === 'dodatno'
      ? `Dodatno Zdravstveno (${params.diagnosticTier.toUpperCase()})`
      : 'Kombinirani Paket Zdravlja (Dopunsko + Dodatno)';

  return { monthlyPremium, annualPremium, planName, features };
}

// 5. Travel Insurance
export function calculateTravelPremium(params: TravelCalculationParams): TravelCalculationResult {
  let dailyRate = 1.6;
  let medicalLimit = 30000;

  if (params.destination === 'world') {
    dailyRate = 2.4;
    medicalLimit = 50000;
  } else if (params.destination === 'usa_canada') {
    dailyRate = 3.8;
    medicalLimit = 100000;
  }

  if (params.includeSports) dailyRate *= 1.5;
  if (params.includeBaggage) dailyRate += 0.45;
  if (params.includeCancellation) dailyRate += 0.65;

  const total = dailyRate * params.days * params.numberOfPersons;
  const totalPremium = parseFloat(Math.max(total, 8.0).toFixed(2));
  const perPersonCost = parseFloat((totalPremium / params.numberOfPersons).toFixed(2));

  return { totalPremium, perPersonCost, medicalLimit };
}
