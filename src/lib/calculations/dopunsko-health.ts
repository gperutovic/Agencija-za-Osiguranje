/**
 * Aktuarski izračun dopunskog zdravstvenog osiguranja za hrvatsko tržište.
 * Usklađeno sa zakonskim poskupljenjem HZZO police na 15,00 €/mj. (180,00 €/god.)
 * od 1. veljače 2026. i ponudama privatnih osiguratelja (Allianz, Generali, Croatia osiguranje).
 */

export interface DopunskoPlanResult {
  age: number;
  hzzoMonthly: number;
  hzzoAnnual: number;
  privateMonthly: number;
  privateAnnual: number;
  monthlySavings: number;
  annualSavings: number;
  isHzzoOptimal: boolean;
  recommendationText: string;
  carrierOptions: {
    carrierName: string;
    logo?: string;
    monthlyPrice: number;
    annualPrice: number;
    bListCoverageEuro: number;
    hasTelemedicine: boolean;
    waitingPeriodDays: number;
  }[];
  bundledPerks: string[];
}

export interface DopunskoCalculationOptions {
  age: number;
  includeBList?: boolean;
  preferTelemedicine?: boolean;
}

export const HZZO_STATUTORY_MONTHLY_2026 = 15.0;
export const HZZO_STATUTORY_ANNUAL_2026 = 180.0;

/**
 * Glavni izračun i usporedba HZZO vs. Privatna dopunska polica
 */
export function calculateDopunskoHealth(options: DopunskoCalculationOptions): DopunskoPlanResult {
  const age = Math.max(18, Math.min(100, Math.round(options.age || 30)));
  const includeBList = options.includeBList ?? true;

  let basePrivateMonthly = 6.5;
  let isHzzoOptimal = false;
  let recommendationText = '';

  if (age <= 30) {
    basePrivateMonthly = 6.5;
    recommendationText =
      'Privatno osiguranje je drastično povoljnije od HZZO-a uz uštedu od 102,00 € godišnje i uključenu B-listu lijekova.';
  } else if (age <= 40) {
    basePrivateMonthly = 7.5;
    recommendationText =
      'Ušteda od 90,00 € godišnje u odnosu na HZZO policu, uz m-Doktor telemedicinsko savjetovanje bez čekanja.';
  } else if (age <= 50) {
    basePrivateMonthly = 9.5;
    recommendationText =
      'Ušteda od 66,00 € godišnje u odnosu na HZZO policu uz neograničeno pokriće participacija u svim javnim bolnicama.';
  } else if (age <= 60) {
    basePrivateMonthly = 13.5;
    recommendationText =
      'Privatna polica nudi uštedu od 18,00 € godišnje i brže izdavanje police bez administrativnih barijera.';
  } else {
    // 61+ godina
    basePrivateMonthly = 22.0;
    isHzzoOptimal = true;
    recommendationText =
      'Financijska preporuka: Zbog solidarnog modela, HZZO polica (15,00 €/mj.) je financijski optimalan izbor za osnovne participacije. Privatna polica (od 22,00 €/mj.) preporučuje se isključivo za pokriće B-liste lijekova i pristup privatnim klinikama.';
  }

  const privateMonthly = parseFloat((basePrivateMonthly + (includeBList && age > 60 ? 3.0 : 0.0)).toFixed(2));
  const privateAnnual = parseFloat((privateMonthly * 12).toFixed(2));

  const monthlySavings = parseFloat((HZZO_STATUTORY_MONTHLY_2026 - privateMonthly).toFixed(2));
  const annualSavings = parseFloat((HZZO_STATUTORY_ANNUAL_2026 - privateAnnual).toFixed(2));

  const bundledPerks = [
    '100% pokriće participacija u svim bolnicama i domovima zdravlja u RH',
    'Bez limita za bolničko liječenje i operativne zahvate',
    includeBList ? 'Dopunska B-lista lijekova (do 200 € godišnje)' : 'Osnovno pokriće participacija',
    'm-Doktor: Besplatno video savjetovanje s liječnikom 24/7',
    'Preuzimanje digitalne iskaznice u mobilni novčanik u roku od 15 minuta',
  ];

  const carrierOptions = [
    {
      carrierName: 'Generali Osiguranje',
      monthlyPrice: privateMonthly,
      annualPrice: privateAnnual,
      bListCoverageEuro: 150,
      hasTelemedicine: true,
      waitingPeriodDays: 0,
    },
    {
      carrierName: 'Allianz Hrvatska',
      monthlyPrice: parseFloat((privateMonthly + 0.5).toFixed(2)),
      annualPrice: parseFloat(((privateMonthly + 0.5) * 12).toFixed(2)),
      bListCoverageEuro: 200,
      hasTelemedicine: true,
      waitingPeriodDays: 0,
    },
    {
      carrierName: 'Croatia Osiguranje',
      monthlyPrice: parseFloat((privateMonthly + 0.8).toFixed(2)),
      annualPrice: parseFloat(((privateMonthly + 0.8) * 12).toFixed(2)),
      bListCoverageEuro: 140,
      hasTelemedicine: false,
      waitingPeriodDays: 15,
    },
  ];

  return {
    age,
    hzzoMonthly: HZZO_STATUTORY_MONTHLY_2026,
    hzzoAnnual: HZZO_STATUTORY_ANNUAL_2026,
    privateMonthly,
    privateAnnual,
    monthlySavings,
    annualSavings,
    isHzzoOptimal,
    recommendationText,
    carrierOptions,
    bundledPerks,
  };
}
