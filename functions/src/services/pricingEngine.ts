export type ProductLine =
  | 'auto'
  | 'imovina'
  | 'zdravstveno'
  | 'zivotno'
  | 'putno'
  | 'ljubimci'
  | 'poslovno';

export interface ExtractedPolicyInput {
  insurer: string;
  productLine: ProductLine;
  policyNumber: string;
  expiryDate: string;
  currentAnnualPremium: number;
  bonusPercent?: number;
  deductible?: number;
  vehiclePlate?: string;
  areaSqm?: number;
}

export interface CompetingCarrierOffer {
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

const PARTNER_INSURERS = [
  { id: 'allianz', name: 'Allianz Hrvatska d.d.', shortName: 'Allianz', rating: 'AA (S&P)', baseFactor: 1.04, ipidPrefix: 'IPID-ALZ' },
  { id: 'croatia', name: 'Croatia osiguranje d.d.', shortName: 'Croatia osiguranje', rating: 'A- (AM Best)', baseFactor: 1.06, ipidPrefix: 'IPID-CRO' },
  { id: 'generali', name: 'Generali osiguranje d.d.', shortName: 'Generali', rating: 'A+ (Fitch)', baseFactor: 0.98, ipidPrefix: 'IPID-GEN' },
  { id: 'wiener', name: 'Wiener osiguranje VIG d.d.', shortName: 'Wiener VIG', rating: 'A+ (S&P)', baseFactor: 0.96, ipidPrefix: 'IPID-WIE' },
  { id: 'triglav', name: 'Triglav osiguranje d.d.', shortName: 'Triglav', rating: 'A (S&P)', baseFactor: 0.94, ipidPrefix: 'IPID-TRG' },
  { id: 'sava', name: 'Sava osiguranje d.d.', shortName: 'Sava', rating: 'A (S&P)', baseFactor: 0.92, ipidPrefix: 'IPID-SAV' },
  { id: 'groupama', name: 'Groupama osiguranje d.d.', shortName: 'Groupama', rating: 'A (Fitch)', baseFactor: 0.95, ipidPrefix: 'IPID-GRP' },
];

const CITY_RISK: Record<string, number> = {
  ZG: 1.16,
  ST: 1.12,
  RI: 1.07,
  ZD: 1.05,
  DU: 1.08,
  OS: 1.0,
  PU: 1.02,
  VŽ: 0.96,
  ČK: 0.94,
  BJ: 0.93,
};

function roundTwo(v: number): number {
  return Math.round(v * 100) / 100;
}

/**
 * Computes realistic competing carrier offers from extracted Switch & Save policy risk fields
 * using the same Croatian actuarial pricing model as the frontend Quote Engine.
 */
export function computeCompetingOffersForSwitch(
  extracted: ExtractedPolicyInput,
  language: 'hr' | 'en' = 'hr'
): {
  competingOffers: CompetingCarrierOffer[];
  estimatedNewAnnualPremium: number;
  estimatedAnnualSavings: number;
} {
  const deductible = extracted.deductible ?? 150;
  const dedFactor =
    deductible <= 50 ? 1.16 : deductible <= 225 ? 1.0 : deductible <= 400 ? 0.91 : 0.84;

  let baseAnnual = 250;
  let coverageLimit = 50_000;
  const isEn = language === 'en';
  let coveredItems: string[] = [];
  let excludedItems: string[] = [];

  switch (extracted.productLine) {
    case 'auto': {
      const prefix = (extracted.vehiclePlate || 'ZG').slice(0, 2).toUpperCase();
      const cityFactor = CITY_RISK[prefix] ?? 1.03;
      const bonus = Math.min(50, Math.max(0, extracted.bonusPercent ?? 50));
      const bonusFactor = 1 - bonus / 100;
      const kw = extracted.currentAnnualPremium > 500 ? 105 : 80;
      const aoAnnual = (185 + Math.max(0, kw - 45) * 2.15) * cityFactor * (0.55 + bonusFactor * 0.7);
      const hasFullKasko = extracted.currentAnnualPremium >= 420;
      const hasMiniKasko = !hasFullKasko && extracted.currentAnnualPremium >= 280;
      const kaskoAnnual = hasFullKasko
        ? (340 + kw * 2.65) * 0.82 * dedFactor
        : hasMiniKasko
          ? (190 + kw * 1.4) * 0.82 * dedFactor
          : 0;
      baseAnnual = aoAnnual + kaskoAnnual + 67;
      coverageLimit = 6_450_000;
      coveredItems = isEn
        ? ['Mandatory Liability (AO) up to €6.45M', 'Up to 50% bonus transfer', '24/7 EU roadside assistance']
        : ['Obvezni AO do 6.450.000 €', 'Prijenos stečenog bonusa do 50%', 'Asistencija 24/7 u RH i EU'];
      excludedItems = isEn
        ? ['Driving under alcohol (> 0.5‰)', 'Mechanical wear and tear']
        : ['Vožnja pod utjecajem alkohola (> 0,5 ‰)', 'Redovno trošenje i mehanički kvarovi'];
      break;
    }
    case 'imovina': {
      const sqm = extracted.areaSqm && extracted.areaSqm >= 20 ? extracted.areaSqm : 70;
      const hasEq = extracted.currentAnnualPremium >= 170;
      baseAnnual = (Math.max(78, sqm * 1.48 * 1.38) + (hasEq ? sqm * 0.95 : 0) + 24) * dedFactor;
      coverageLimit = Math.round(sqm * 1850);
      coveredItems = isEn
        ? ['Fire, storm & water pipe burst', 'Replacement value cover', 'Neighbor liability up to €50,000']
        : ['Požar, oluja i izljev vode', 'Novonabavna građevinska vrijednost', 'Odgovornost prema susjedima do 50.000 €'];
      excludedItems = isEn
        ? ['Gradual mold and condensation', 'Unpermitted structures']
        : ['Kondenzacija i plijesan', 'Objekti bez uporabne dozvole'];
      break;
    }
    case 'zdravstveno': {
      baseAnnual = extracted.currentAnnualPremium >= 240 ? 390 : 128;
      coverageLimit = extracted.currentAnnualPremium >= 240 ? 12_000 : 3_000;
      coveredItems = isEn
        ? ['100% HZZO copayments', 'B-list prescription drugs', 'Private specialist network']
        : ['100% pokriće HZZO participacija', 'Dopunska B-lista lijekova', 'Privatne poliklinike bez uputnice'];
      excludedItems = isEn
        ? ['Cosmetic procedures', '15-day waiting period']
        : ['Estetski zahvati', 'Zakonska karenca od 15 dana'];
      break;
    }
    case 'zivotno': {
      baseAnnual = 290;
      coverageLimit = 80_000;
      coveredItems = isEn
        ? ['Tax-free beneficiary payout', 'Free mortgage assignment (vinkulacija)']
        : ['Isplata bez poreza na nasljedstvo', 'Besplatna vinkulacija kredita'];
      excludedItems = isEn ? ['Undisclosed pre-existing illness'] : ['Prešućena postojeća teška oboljenja'];
      break;
    }
    case 'putno': {
      baseAnnual = 52;
      coverageLimit = 50_000;
      coveredItems = isEn
        ? ['Emergency medical abroad', '24/7 assistance desk', 'Baggage protection']
        : ['Hitna medicinska pomoć u inozemstvu', '24/7 asistencija', 'Zaštita prtljage'];
      excludedItems = isEn ? ['Planned medical travel'] : ['Planirani medicinski zahvati'];
      break;
    }
    case 'ljubimci': {
      baseAnnual = 205 * dedFactor;
      coverageLimit = 3_500;
      coveredItems = isEn
        ? ['Veterinary surgery & diagnostics', 'Owner liability up to €30,000']
        : ['Veterinarske operacije i dijagnostika', 'Odgovornost vlasnika do 30.000 €'];
      excludedItems = isEn ? ['Routine vaccinations'] : ['Redovna cijepljenja'];
      break;
    }
    case 'poslovno': {
      baseAnnual = 690 * dedFactor;
      coverageLimit = 250_000;
      coveredItems = isEn
        ? ['General business liability', 'Professional indemnity & cyber option']
        : ['Opća odgovornost poslovanja', 'Profesionalna odgovornost i cyber zaštita'];
      excludedItems = isEn ? ['Contractual penalties'] : ['Ugovorne kazne i penali'];
      break;
    }
  }

  const allOffers: CompetingCarrierOffer[] = PARTNER_INSURERS.map((partner, idx) => {
    const jitter = 1 + (((idx * 7 + extracted.productLine.length * 3) % 9) - 4) * 0.012;
    const annual = roundTwo(baseAnnual * partner.baseFactor * jitter);
    const monthly = extracted.productLine === 'putno' ? annual : roundTwo((annual / 12) * 1.03);
    return {
      carrierId: partner.id,
      carrierName: partner.name,
      carrierShortName: partner.shortName,
      rating: partner.rating,
      tierLabel: isEn ? 'Optimal Plan' : 'Optimalni paket',
      monthlyPrice: monthly,
      annualPrice: annual,
      baseAnnualBeforeBundle: annual,
      bundleDiscountPercent: 0,
      deductible: extracted.productLine === 'zdravstveno' || extracted.productLine === 'zivotno' || extracted.productLine === 'putno' ? 0 : deductible,
      coverageLimit,
      coveredItems,
      excludedItems,
      ipidCode: `${partner.ipidPrefix}-${extracted.productLine.toUpperCase()}-2026`,
    };
  });

  allOffers.sort((a, b) => a.annualPrice - b.annualPrice);
  const currentLower = extracted.insurer.toLowerCase();
  const competing = allOffers.filter(
    (o) =>
      !o.carrierName.toLowerCase().includes(currentLower) &&
      !currentLower.includes(o.carrierShortName.toLowerCase())
  );
  const pool = competing.length > 0 ? competing : allOffers;
  const best = pool[0]!;
  if (!best.highlightBadge) {
    best.highlightBadge = isEn ? 'Best competing offer' : 'Najpovoljnija zamjenska ponuda';
  }

  const estimatedNewAnnualPremium = best.annualPrice;
  const estimatedAnnualSavings = roundTwo(
    Math.max(0, extracted.currentAnnualPremium - estimatedNewAnnualPremium)
  );

  return {
    competingOffers: pool.slice(0, 4),
    estimatedNewAnnualPremium,
    estimatedAnnualSavings,
  };
}
