import {
  AutoQuoteParams,
  PropertyQuoteParams,
  LifeQuoteParams,
  HealthQuoteParams,
  CalculatedQuoteEstimate,
} from '../types/insurance';

/**
 * Actuarial Engine for Auto Insurance (Obvezno AO + Kasko)
 */
export function calculateAutoPremium(params: AutoQuoteParams): CalculatedQuoteEstimate {
  const {
    kwPower,
    vehicleAge,
    bonusPercentage,
    usageType,
    includeKasko,
    includeAssistance,
    includeGlass,
    includeBonusProtection,
  } = params;

  // Base compulsory rate scaled by engine power (kW)
  let baseCompulsory = 180;
  if (kwPower < 33) baseCompulsory = 120;
  else if (kwPower <= 44) baseCompulsory = 150;
  else if (kwPower <= 55) baseCompulsory = 185;
  else if (kwPower <= 66) baseCompulsory = 220;
  else if (kwPower <= 84) baseCompulsory = 265;
  else if (kwPower <= 110) baseCompulsory = 320;
  else baseCompulsory = 410;

  // Bonus-malus discount (e.g. 50% discount reduces compulsory to half)
  const discountMultiplier = Math.max(0.5, Math.min(1.0, 1 - bonusPercentage / 100));
  let aoPremium = baseCompulsory * discountMultiplier;

  // Usage multiplier
  if (usageType === 'commercial') {
    aoPremium *= 1.25;
  }

  const breakdown: Array<{ title: string; amount: number }> = [
    { title: 'Osnovna autoodgovornost (AO)', amount: Math.round(aoPremium * 100) / 100 },
  ];

  let addonsTotal = 0;

  // Kasko calculation (based on vehicle power, age, and valuation factor)
  if (includeKasko) {
    const ageFactor = Math.max(0.6, 1 - vehicleAge * 0.04);
    const kaskoAmount = Math.max(160, kwPower * 3.8 * ageFactor);
    addonsTotal += kaskoAmount;
    breakdown.push({ title: 'Puni kasko paket', amount: Math.round(kaskoAmount * 100) / 100 });
  }

  // 24/7 Roadside Assistance
  if (includeAssistance) {
    const assistanceFee = 28;
    addonsTotal += assistanceFee;
    breakdown.push({ title: 'Asistencija na cesti 24/7 (RH i EU)', amount: assistanceFee });
  }

  // Glass breakage rider
  if (includeGlass) {
    const glassFee = 35;
    addonsTotal += glassFee;
    breakdown.push({ title: 'Zaštita stakala bez franšize', amount: glassFee });
  }

  // Bonus protection
  if (includeBonusProtection) {
    const bonusProtFee = 22;
    addonsTotal += bonusProtFee;
    breakdown.push({ title: 'Zaštita stečenog bonusa', amount: bonusProtFee });
  }

  const annualPremium = Math.round((aoPremium + addonsTotal) * 100) / 100;
  const monthlyPremium = Math.round((annualPremium / 12) * 100) / 100;
  const quarterlyPremium = Math.round((annualPremium / 4) * 100) / 100;

  return {
    annualPremium,
    monthlyPremium,
    quarterlyPremium,
    currency: 'EUR',
    baseRate: baseCompulsory,
    discountsTotal: Math.round((baseCompulsory - aoPremium) * 100) / 100,
    addonsTotal: Math.round(addonsTotal * 100) / 100,
    coverageLimit: 6450000, // Croatian legal statutory AO limit for personal damage
    itemizedBreakdown: breakdown,
  };
}

/**
 * Actuarial Engine for Property & Household (Imovina i dom)
 */
export function calculatePropertyPremium(params: PropertyQuoteParams): CalculatedQuoteEstimate {
  const {
    areaM2,
    propertyType,
    constructionYear,
    includeContents,
    includeEarthquake,
    includeFlood,
    deductibleTier = 0,
  } = params;

  // Base rate €1.10/m² annually
  const baseRatePerM2 = 1.1;
  let baseProperty = areaM2 * baseRatePerM2;

  // Property type coefficient
  let typeMultiplier = 1.0;
  if (propertyType === 'house') typeMultiplier = 1.2;
  if (propertyType === 'holiday') typeMultiplier = 1.35;
  baseProperty *= typeMultiplier;

  // Age/construction year risk factor
  let ageRiskFactor = 1.0;
  if (constructionYear < 1964) ageRiskFactor = 1.45;
  else if (constructionYear < 1990) ageRiskFactor = 1.25;
  else if (constructionYear < 2010) ageRiskFactor = 1.1;
  else ageRiskFactor = 0.95;

  baseProperty *= ageRiskFactor;

  const breakdown: Array<{ title: string; amount: number }> = [
    { title: `Građevinsko osiguranje (${areaM2} m²)`, amount: Math.round(baseProperty * 100) / 100 },
  ];

  let addonsTotal = 0;

  // Contents insurance (€0.50/m²)
  if (includeContents) {
    const contentsAmount = areaM2 * 0.5;
    addonsTotal += contentsAmount;
    breakdown.push({ title: 'Osiguranje stvari kućanstva', amount: Math.round(contentsAmount * 100) / 100 });
  }

  // Earthquake rider (scaled by age risk factor)
  if (includeEarthquake) {
    const eqAmount = (areaM2 * 0.75) * (constructionYear < 1964 ? 1.6 : 1.15);
    addonsTotal += eqAmount;
    breakdown.push({ title: 'Rizik potresa (seizmički rider)', amount: Math.round(eqAmount * 100) / 100 });
  }

  // Flood rider
  if (includeFlood) {
    const floodAmount = areaM2 * 0.35;
    addonsTotal += floodAmount;
    breakdown.push({ title: 'Rizik bujica i poplave', amount: Math.round(floodAmount * 100) / 100 });
  }

  // Deductible discount
  let deductibleDiscount = 0;
  if (deductibleTier === 250) deductibleDiscount = 20;
  else if (deductibleTier === 500) deductibleDiscount = 45;

  const annualPremium = Math.max(60, Math.round((baseProperty + addonsTotal - deductibleDiscount) * 100) / 100);
  const monthlyPremium = Math.round((annualPremium / 12) * 100) / 100;
  const quarterlyPremium = Math.round((annualPremium / 4) * 100) / 100;

  return {
    annualPremium,
    monthlyPremium,
    quarterlyPremium,
    currency: 'EUR',
    baseRate: Math.round(areaM2 * baseRatePerM2 * 100) / 100,
    discountsTotal: deductibleDiscount,
    addonsTotal: Math.round(addonsTotal * 100) / 100,
    deductible: deductibleTier,
    coverageLimit: Math.round(areaM2 * 1400), // Replacement building value ~€1,400/m²
    itemizedBreakdown: breakdown,
  };
}

/**
 * Actuarial Engine for Life & Risk (Životno osiguranje)
 */
export function calculateLifePremium(params: LifeQuoteParams): CalculatedQuoteEstimate {
  const { age, durationYears, sumInsured, isSmoker, includeCriticalIllness } = params;

  // Base annual rate per €1,000 of sum insured based on age
  // Mortality risk rises exponentially with age
  const baseRatePerThousand = 4.2 * Math.pow(1.045, Math.max(0, age - 18));
  let annualBase = (sumInsured / 1000) * baseRatePerThousand;

  // Smoker surcharge 40%
  let smokerSurcharge = 0;
  if (isSmoker) {
    smokerSurcharge = annualBase * 0.4;
  }

  const breakdown: Array<{ title: string; amount: number }> = [
    { title: `Zajamčeno životno pokriće (€${sumInsured.toLocaleString('hr-HR')})`, amount: Math.round(annualBase * 100) / 100 },
  ];

  if (isSmoker) {
    breakdown.push({ title: 'Doplata za rizik pušenja', amount: Math.round(smokerSurcharge * 100) / 100 });
  }

  let addonsTotal = smokerSurcharge;

  // Critical Illness add-on (25 conditions)
  if (includeCriticalIllness) {
    const ciAmount = (sumInsured / 1000) * 3.6;
    addonsTotal += ciAmount;
    breakdown.push({ title: 'Dopunsko pokriće 25 teških bolesti', amount: Math.round(ciAmount * 100) / 100 });
  }

  // Duration smoothing factor (longer commitments get 5% loyalty discount)
  let durationDiscount = 0;
  if (durationYears >= 20) {
    durationDiscount = (annualBase + addonsTotal) * 0.08;
  } else if (durationYears >= 15) {
    durationDiscount = (annualBase + addonsTotal) * 0.05;
  }

  const annualPremium = Math.round((annualBase + addonsTotal - durationDiscount) * 100) / 100;
  const monthlyPremium = Math.round((annualPremium / 12) * 100) / 100;
  const quarterlyPremium = Math.round((annualPremium / 4) * 100) / 100;

  return {
    annualPremium,
    monthlyPremium,
    quarterlyPremium,
    currency: 'EUR',
    baseRate: Math.round(annualBase * 100) / 100,
    discountsTotal: Math.round(durationDiscount * 100) / 100,
    addonsTotal: Math.round(addonsTotal * 100) / 100,
    coverageLimit: sumInsured,
    itemizedBreakdown: breakdown,
  };
}

/**
 * Actuarial Engine for Health Insurance (Dopunsko i dodatno)
 */
export function calculateHealthPremium(params: HealthQuoteParams): CalculatedQuoteEstimate {
  const { packageType, includePreventiveCheckup, includeBListDrugs } = params;

  let baseRate = packageType === 'basic' ? 140 : 280; // Annual base
  const breakdown: Array<{ title: string; amount: number }> = [
    {
      title: packageType === 'basic' ? 'Osnovni dopunski paket' : 'Plus zdravstveni paket (specijalisti)',
      amount: baseRate,
    },
  ];

  let addonsTotal = 0;

  if (includePreventiveCheckup && packageType === 'basic') {
    const checkupFee = 85;
    addonsTotal += checkupFee;
    breakdown.push({ title: 'Godišnji sistematski pregled', amount: checkupFee });
  }

  if (includeBListDrugs) {
    const bListFee = 36;
    addonsTotal += bListFee;
    breakdown.push({ title: 'Pokriće doplata za B-listu lijekova', amount: bListFee });
  }

  const annualPremium = baseRate + addonsTotal;
  const monthlyPremium = Math.round((annualPremium / 12) * 100) / 100;
  const quarterlyPremium = Math.round((annualPremium / 4) * 100) / 100;

  return {
    annualPremium,
    monthlyPremium,
    quarterlyPremium,
    currency: 'EUR',
    baseRate,
    discountsTotal: 0,
    addonsTotal,
    coverageLimit: packageType === 'basic' ? 25000 : 75000,
    itemizedBreakdown: breakdown,
  };
}
