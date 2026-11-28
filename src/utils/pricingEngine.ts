import { BRAND_CONFIG } from '../config/brand';
import {
  AutoQuoteInput,
  BusinessQuoteInput,
  CarrierOffer,
  CoverageCustomization,
  ExtractedPolicyFields,
  HealthQuoteInput,
  Language,
  LifeQuoteInput,
  PetQuoteInput,
  ProductLine,
  ProductQuoteInput,
  PropertyQuoteInput,
  TravelQuoteInput,
} from '../types/domain';
import { extractPlateCityCode } from './croatianValidators';

export const DEFAULT_CUSTOMIZATION: CoverageCustomization = {
  deductible: 150,
  coverageMultiplier: 1,
  billingCycle: 'monthly',
  addons: {
    glass: true,
    hail: false,
    animals: false,
    roadside: true,
    earthquake: true,
  },
};

export function getDefaultCustomizationForLine(line: ProductLine): CoverageCustomization {
  switch (line) {
    case 'auto':
      return {
        deductible: 150,
        coverageMultiplier: 1,
        billingCycle: 'monthly',
        addons: { glass: true, hail: false, animals: false, roadside: true, earthquake: false },
      };
    case 'imovina':
      return {
        deductible: 150,
        coverageMultiplier: 1,
        billingCycle: 'monthly',
        addons: { glass: false, hail: false, animals: false, roadside: false, earthquake: true },
      };
    case 'putno':
      return {
        deductible: 0,
        coverageMultiplier: 1,
        billingCycle: 'annual',
        addons: { glass: false, hail: false, animals: false, roadside: false, earthquake: false },
      };
    case 'zdravstveno':
    case 'zivotno':
      return {
        deductible: 0,
        coverageMultiplier: 1,
        billingCycle: 'monthly',
        addons: { glass: false, hail: false, animals: false, roadside: false, earthquake: false },
      };
    case 'ljubimci':
    case 'poslovno':
      return {
        deductible: 150,
        coverageMultiplier: 1,
        billingCycle: 'monthly',
        addons: { glass: false, hail: false, animals: false, roadside: false, earthquake: false },
      };
  }
}

export function isDeductibleApplicable(input: ProductQuoteInput): boolean {
  switch (input.productLine) {
    case 'auto':
      return input.kaskoTier !== 'ao_only';
    case 'imovina':
    case 'ljubimci':
    case 'poslovno':
      return true;
    case 'zdravstveno':
    case 'zivotno':
    case 'putno':
      return false;
  }
}

const CITY_RISK_FACTORS: Record<string, number> = {
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

export function computeBundleDiscountPercent(bundleProducts: ProductLine[]): number {
  const unique = new Set(bundleProducts);
  if (unique.size >= 3) return 15;
  if (unique.size === 2) return 12;
  return 0;
}

function roundTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

function computeAutoBase(
  input: AutoQuoteInput,
  customization: CoverageCustomization,
  language: Language
): { annual: number; limit: number; covered: string[]; excluded: string[] } {
  const plateCode = extractPlateCityCode(input.plateNumber) ?? 'ZG';
  const cityFactor = CITY_RISK_FACTORS[plateCode] ?? 1.02;

  const kwRate = 185 + Math.max(0, input.kw - 45) * 2.15;
  const bonusFactor = 1 - Math.min(50, Math.max(0, input.bonusPercent)) / 100;
  const youngDriverFactor = input.youngDriver ? 1.24 : 1.0;
  const mileageFactor =
    input.annualMileage === 'over_20k'
      ? 1.12
      : input.annualMileage === '10k_20k'
        ? 1.03
        : 0.96;

  const aoAnnual =
    kwRate * cityFactor * (0.55 + bonusFactor * 0.7) * youngDriverFactor * mileageFactor;

  const currentYear = new Date().getFullYear();
  const vehicleAge = Math.max(0, currentYear - input.year);
  const ageDecay = Math.max(0.45, 1 - vehicleAge * 0.045);

  let kaskoAnnual = 0;
  if (input.kaskoTier === 'mini_kasko') {
    kaskoAnnual = (190 + input.kw * 1.4) * ageDecay;
  } else if (input.kaskoTier === 'full_kasko') {
    kaskoAnnual = (340 + input.kw * 2.65) * ageDecay;
  }

  const deductibleFactor =
    customization.deductible === 0
      ? 1.18
      : customization.deductible === 150
        ? 1.0
        : customization.deductible === 300
          ? 0.91
          : 0.84;

  const adjustedKasko =
    input.kaskoTier === 'ao_only'
      ? 0
      : kaskoAnnual * deductibleFactor * customization.coverageMultiplier;

  const aoMultiplier = input.kaskoTier === 'ao_only' ? customization.coverageMultiplier : 1;

  let addonsTotal = 0;
  if (customization.addons.glass) addonsTotal += 38;
  if (customization.addons.hail) addonsTotal += 52;
  if (customization.addons.animals) addonsTotal += 26;
  if (customization.addons.roadside) addonsTotal += 29;

  const isEn = language === 'en';
  const covered: string[] = isEn
    ? [
        'Mandatory Motor Liability (AO) up to €6,450,000 for bodily injury',
        'Third-party property damage up to €1,300,000 per incident',
        'Digital Green Card for travel across the EU and region',
      ]
    : [
        'Obvezna automobilska odgovornost (AO) do 6.450.000 € za štete na osobama',
        'Štete na imovini trećih osoba do 1.300.000 € po štetnom događaju',
        'Digitalna Zelena karta za putovanja u EU i regiji',
      ];

  if (input.kaskoTier === 'full_kasko') {
    covered.push(
      isEn
        ? 'Full Comprehensive (Kasko): collision, rollover, theft, fire & vandalism'
        : 'Puni kasko: sudar, prevrnuće, krađa vozila, požar i vandalizam'
    );
  } else if (input.kaskoTier === 'mini_kasko') {
    covered.push(
      isEn
        ? 'Mini Comprehensive (Kasko): theft, fire, hail & storm'
        : 'Mini kasko: krađa vozila, požar, tuča i oluja'
    );
  }
  if (customization.addons.glass) {
    covered.push(
      isEn
        ? 'All vehicle glass breakage without losing bonus class'
        : 'Lom svih stakala bez gubitka bonusa'
    );
  }
  if (customization.addons.hail) {
    covered.push(
      isEn
        ? 'Hail, storm, and natural hazard damage'
        : 'Štete od tuče, oluje i prirodnih nepogoda'
    );
  }
  if (customization.addons.animals) {
    covered.push(
      isEn
        ? 'Collision with wildlife and domestic animals'
        : 'Nalet na divljač i domaće životinje'
    );
  }
  if (customization.addons.roadside) {
    covered.push(
      isEn
        ? '24/7 roadside assistance (towing & replacement car in HR and EU)'
        : 'Asistencija na cesti 24/7 (vuča i zamjensko vozilo u RH i EU)'
    );
  }

  const excluded: string[] = isEn
    ? [
        'Driving under the influence of alcohol (> 0.5 ‰) or narcotics',
        'Intentional damage or unauthorized street racing',
        'Mechanical wear & tear (tires, brakes, clutch)',
      ]
    : [
        'Vožnja pod utjecajem alkohola (> 0,5 ‰) ili opojnih sredstava',
        'Namjerno izazvana šteta ili sudjelovanje u neovlaštenim utrkama',
        'Mehanički kvarovi i redovno trošenje dijelova (gume, kočnice, spojka)',
      ];
  if (input.kaskoTier === 'ao_only') {
    excluded.push(
      isEn
        ? 'Damage to your own vehicle when at fault (Comprehensive Kasko not selected)'
        : 'Štete na vlastitom vozilu nastale vlastitom krivnjom (nije ugovoren Kasko)'
    );
  }
  if (!customization.addons.glass && input.kaskoTier !== 'full_kasko') {
    excluded.push(
      isEn
        ? 'Standalone windshield breakage without Glass add-on'
        : 'Samostalni lom vjetrobranskog stakla bez doplate za stakla'
    );
  }

  return {
    annual: aoAnnual * aoMultiplier + adjustedKasko + addonsTotal,
    limit: Math.round(6_450_000 * customization.coverageMultiplier),
    covered,
    excluded,
  };
}

function computePropertyBase(
  input: PropertyQuoteInput,
  customization: CoverageCustomization,
  language: Language
): { annual: number; limit: number; covered: string[]; excluded: string[] } {
  const typeFactor = input.propertyType === 'kuca' ? 1.18 : 1.0;
  const scopeFactor =
    input.coverageScope === 'both' ? 1.38 : input.coverageScope === 'building' ? 1.0 : 0.72;
  const baseAnnual = Math.max(78, input.areaSqm * 1.48 * typeFactor * scopeFactor);

  // Single canonical source of truth for earthquake cover: input.includeEarthquake
  const seismicPostalPrefix = input.postalCode.startsWith('10') || input.postalCode.startsWith('20');
  const eqActive = input.includeEarthquake;
  const eqCost = eqActive ? input.areaSqm * (seismicPostalPrefix ? 1.15 : 0.72) : 0;
  const floodCost = input.includeFlood ? 28 : 0;
  const burglaryCost = input.includeBurglary ? 24 : 0;

  const deductibleFactor =
    customization.deductible === 0
      ? 1.15
      : customization.deductible === 150
        ? 1.0
        : customization.deductible === 300
          ? 0.92
          : 0.85;

  const reconstructionValue = Math.round(input.areaSqm * 1850 * customization.coverageMultiplier);
  const isEn = language === 'en';

  const covered: string[] = isEn
    ? [
        'Fire, lightning, explosion, storm & hail at full replacement value',
        'Water pipe burst & leakage including leak detection costs',
        'Private liability toward neighbors from property ownership (up to €50,000)',
      ]
    : [
        'Požar, udar groma, eksplozija, oluja i tuča na novonabavnu vrijednost',
        'Izljev vode iz vodovodnih, odvodnih i instalacija grijanja (uključujući traženje kvara)',
        'Privatna odgovornost iz posjeda nekretnine prema susjedima (do 50.000 €)',
      ];
  if (eqActive) {
    covered.push(
      isEn
        ? 'Earthquake coverage at full reconstruction value without underinsurance'
        : 'Osiguranje od potresa na punu građevinsku vrijednost bez podosiguranja'
    );
  }
  if (input.includeFlood) {
    covered.push(
      isEn
        ? 'Flood, flash floods, and rising groundwater'
        : 'Poplava, bujica i visoke podzemne vode'
    );
  }
  if (input.includeBurglary) {
    covered.push(
      isEn
        ? 'Burglary, robbery, and forced-entry door/lock damage'
        : 'Provalna krađa, razbojništvo i oštećenje ulaznih vrata'
    );
  }

  const excluded: string[] = isEn
    ? [
        'Gradual dampness, condensation, mold, and roof neglect',
        'Unpermitted structures or buildings under rough construction',
        'Cash and securities exceeding contracted safe limits',
      ]
    : [
        'Postupno vlaženje, kondenzacija, plijesan i neodržavanje krovišta',
        'Štete na objektima bez uporabne dozvole ili u fazi grube gradnje',
        'Gotovina i vrijednosni papiri iznad ugovorenog limita za sef',
      ];
  if (!eqActive) {
    excluded.push(
      isEn
        ? 'Earthquake damage (enable the Earthquake add-on to cover)'
        : 'Štete uzrokovane potresom (uključite dodatak Potres za pokriće)'
    );
  }

  return {
    annual:
      (baseAnnual + eqCost + floodCost + burglaryCost) *
      deductibleFactor *
      customization.coverageMultiplier,
    limit: reconstructionValue,
    covered,
    excluded,
  };
}

function computeHealthBase(
  input: HealthQuoteInput,
  customization: CoverageCustomization,
  language: Language
): { annual: number; limit: number; covered: string[]; excluded: string[] } {
  const ageFactor = input.age < 35 ? 0.92 : input.age <= 55 ? 1.06 : 1.38;
  const planBase =
    input.planTier === 'dopunsko' ? 114 : input.planTier === 'dodatno' ? 276 : 365;
  const bListCost = input.includeBListDrugs ? 26 : 0;
  const diagCost = input.includeDiagnostics ? 64 : 0;
  const familyDiscount = input.familyMembers >= 3 ? 0.9 : input.familyMembers === 2 ? 0.95 : 1.0;

  const annual =
    (planBase * ageFactor + bListCost + diagCost) *
    input.familyMembers *
    familyDiscount *
    customization.coverageMultiplier;

  const isEn = language === 'en';
  const covered: string[] = isEn
    ? [
        '100% coverage of HZZO hospital and outpatient copayments in Croatia',
        'Unlimited prescriptions on the HZZO A-list of essential medicines',
      ]
    : [
        '100% pokriće HZZO bolničkih i ambulantnih participacija u RH',
        'Bez ograničenja broja recepata za lijekove s A-liste HZZO-a',
      ];
  if (input.includeBListDrugs) {
    covered.push(
      isEn
        ? 'Coverage of surcharges for HZZO supplemental B-list medicines'
        : 'Pokriće doplata za lijekove s dopunske B-liste HZZO-a'
    );
  }
  if (input.planTier !== 'dopunsko' || input.includeDiagnostics) {
    covered.push(
      isEn
        ? 'Specialist consultations & MRI/CT/Ultrasound in private clinics without referral'
        : 'Specijalistički pregledi i MR/CT/UZV dijagnostika u privatnim poliklinikama bez uputnice'
    );
    covered.push(
      isEn
        ? 'Annual preventive check-up with comprehensive lab panels'
        : 'Godišnji sistematski pregled s laboratorijskim nalazima'
    );
  }

  const excluded: string[] = isEn
    ? [
        'Cosmetic procedures without medical indication',
        '15-day statutory waiting period for new supplemental health policies',
        'Non-emergency medical treatment abroad',
      ]
    : [
        'Estetski zahvati bez medicinske indikacije',
        'Karenca od 15 dana za nove police dopunskog zdravstvenog osiguranja',
        'Liječenje u inozemstvu izvan ugovorenih hitnih stanja',
      ];

  return {
    annual,
    limit: Math.round(
      (input.planTier === 'dopunsko' ? 3000 : 12000) * customization.coverageMultiplier
    ),
    covered,
    excluded,
  };
}

function computeLifeBase(
  input: LifeQuoteInput,
  customization: CoverageCustomization,
  language: Language
): { annual: number; limit: number; covered: string[]; excluded: string[] } {
  const ageFactor = 0.72 + Math.max(0, input.age - 25) * 0.032;
  const smokerFactor = input.smoker ? 1.48 : 1.0;
  const termFactor = 0.9 + (input.termYears / 25) * 0.28;
  const sumUnit = (input.sumInsured / 10000) * 34;
  const ciCost = input.includeCriticalIllness ? sumUnit * 0.35 : 0;

  const annual = Math.max(
    144,
    (sumUnit * ageFactor * smokerFactor * termFactor + ciCost) * customization.coverageMultiplier
  );
  const sumFormatted = Math.round(
    input.sumInsured * customization.coverageMultiplier
  ).toLocaleString(language === 'en' ? 'en-IE' : 'hr-HR');
  const isEn = language === 'en';

  const covered: string[] = isEn
    ? [
        `Tax-free lump sum payout (€${sumFormatted}) to designated beneficiaries`,
        'Free mortgage policy assignment (vinkulacija) for Croatian banks',
        'Double indemnity in case of accidental death in traffic',
      ]
    : [
        `Isplata osigurane svote (${sumFormatted} €) korisnicima bez poreza na nasljedstvo`,
        'Besplatna vinkulacija police u korist banke za stambeni kredit',
        'Dvostruka isplata u slučaju smrti uslijed prometne nezgode',
      ];
  if (input.includeCriticalIllness) {
    covered.push(
      isEn
        ? 'Lump-sum payout upon diagnosis of 20+ critical illnesses'
        : 'Jednokratna isplata pri dijagnozi 20+ teških bolesti'
    );
  }

  const excluded: string[] = isEn
    ? [
        'Undisclosed pre-existing serious medical conditions on health questionnaire',
        'Professional extreme sports without rider endorsement',
        'Suicide within the first 2 policy years (statutory exclusion)',
      ]
    : [
        'Prešućena postojeća teška oboljenja kod ispunjavanja zdravstvenog upitnika',
        'Profesionalno bavljenje ekstremnim sportovima bez doplate',
        'Samoubojstvo unutar prve 2 godine trajanja ugovora (zakonska karenca)',
      ];

  return {
    annual,
    limit: Math.round(input.sumInsured * customization.coverageMultiplier),
    covered,
    excluded,
  };
}

function computeTravelBase(
  input: TravelQuoteInput,
  customization: CoverageCustomization,
  language: Language
): { annual: number; limit: number; covered: string[]; excluded: string[] } {
  const destRate =
    input.destination === 'eu' ? 2.1 : input.destination === 'world_excl_us' ? 3.4 : 4.8;
  const baseTrip = Math.max(14, input.days * destRate * input.travelers);
  const sportsCost = input.includeWinterSports ? baseTrip * 0.45 : 0;
  const cancelCost = input.includeCancellation ? 18 * input.travelers : 0;

  const totalTrip = (baseTrip + sportsCost + cancelCost) * customization.coverageMultiplier;
  const isEn = language === 'en';

  const covered: string[] = isEn
    ? [
        'Emergency medical treatment, hospitalization & repatriation abroad',
        '24/7 assistance desk in Croatian/English with cashless hospital settlement',
        'Delayed and lost checked baggage protection',
      ]
    : [
        'Hitna medicinska pomoć, hospitalizacija i repatrijacija u inozemstvu',
        '24/7 asistencijski centar na hrvatskom jeziku bez plaćanja iz vlastitog džepa',
        'Kašnjenje i gubitak predane prtljage',
      ];
  if (input.includeWinterSports) {
    covered.push(
      isEn
        ? 'Skiing, snowboarding, and recreational winter sports rescue'
        : 'Skijanje, snowboarding i rekreativni zimski sportovi'
    );
  }
  if (input.includeCancellation) {
    covered.push(
      isEn
        ? 'Trip cancellation due to sudden illness or accident'
        : 'Otkaz putovanja u slučaju iznenadne bolesti ili nezgode'
    );
  }

  const excluded: string[] = isEn
    ? [
        'Trips undertaken specifically for planned medical procedures abroad',
        'Worsening of chronic conditions unstable in the prior 6 months',
        'Baggage loss without an official carrier PIR report',
      ]
    : [
        'Putovanja u svrhu planiranog medicinskog zahvata u inozemstvu',
        'Pogoršanje kroničnih bolesti koje nisu bile stabilne zadnjih 6 mjeseci',
        'Gubitak prtljage bez službenog PIR zapisnika prijevoznika',
      ];

  return {
    annual: totalTrip,
    limit: Math.round(
      (input.destination === 'eu' ? 50000 : 100000) * customization.coverageMultiplier
    ),
    covered,
    excluded,
  };
}

function computePetBase(
  input: PetQuoteInput,
  customization: CoverageCustomization,
  language: Language
): { annual: number; limit: number; covered: string[]; excluded: string[] } {
  const speciesBase = input.petType === 'dog' ? 168 : 122;
  const sizeFactor =
    input.breedSize === 'large' ? 1.28 : input.breedSize === 'medium' ? 1.1 : 1.0;
  const ageFactor = input.petAgeYears > 7 ? 1.35 : input.petAgeYears > 4 ? 1.12 : 1.0;
  const liabilityCost = input.includeLiability ? 28 : 0;
  const deductibleFactor =
    customization.deductible === 0
      ? 1.18
      : customization.deductible >= 500
        ? 0.82
        : customization.deductible >= 300
          ? 0.88
          : 1.0;

  const annual =
    (speciesBase * sizeFactor * ageFactor + liabilityCost) *
    deductibleFactor *
    customization.coverageMultiplier;

  const isEn = language === 'en';
  const covered: string[] = isEn
    ? [
        'Veterinary expenses for accidents, surgeries, and diagnostics (X-ray, ultrasound)',
        'In-clinic hospitalization and prescribed veterinary medications',
      ]
    : [
        'Veterinarski troškovi liječenja nezgoda, operacija i dijagnostike (RTG, UZV)',
        'Bolničko liječenje i propisani veterinarski lijekovi',
      ];
  if (input.includeLiability) {
    covered.push(
      isEn
        ? 'Owner third-party liability for damages caused by your pet (up to €30,000)'
        : 'Odgovornost vlasnika za štetu koju ljubimac nanese trećim osobama (do 30.000 €)'
    );
  }

  const excluded: string[] = isEn
    ? [
        'Routine annual vaccinations, microchipping, and preventive treatments',
        'Hereditary or pre-existing conditions diagnosed prior to policy start',
        'Cosmetic procedures and breeding expenses',
      ]
    : [
        'Redovna godišnja cijepljenja, mikročipiranje i preventivni tretmani',
        'Nasljedne i postojeće bolesti dijagnosticirane prije sklapanja police',
        'Estetski zahvati i troškovi uzgoja',
      ];

  return {
    annual,
    limit: Math.round(3500 * customization.coverageMultiplier),
    covered,
    excluded,
  };
}

function computeBusinessBase(
  input: BusinessQuoteInput,
  customization: CoverageCustomization,
  language: Language
): { annual: number; limit: number; covered: string[]; excluded: string[] } {
  const entityBase =
    input.companyType === 'doo' ? 420 : input.companyType === 'obrt' ? 280 : 250;
  const revenueFactor =
    input.annualRevenueBand === 'over_500k'
      ? 1.65
      : input.annualRevenueBand === '100k_500k'
        ? 1.25
        : 1.0;
  const employeeCost = Math.max(0, input.employees - 1) * 32;
  const profCost = input.includeProfessionalLiability ? 165 : 0;
  const cyberCost = input.includeCyber ? 140 : 0;
  const deductibleFactor =
    customization.deductible === 0
      ? 1.16
      : customization.deductible >= 500
        ? 0.84
        : customization.deductible >= 300
          ? 0.9
          : 1.0;

  const annual =
    (entityBase * revenueFactor + employeeCost + profCost + cyberCost) *
    deductibleFactor *
    customization.coverageMultiplier;

  const isEn = language === 'en';
  const covered: string[] = isEn
    ? [
        'General public liability from business operations & office premises',
        'Office equipment, IT hardware, and inventory against fire, water & burglary',
      ]
    : [
        'Opća odgovornost iz djelatnosti i posjeda poslovnog prostora',
        'Osiguranje poslovne opreme, računala i zaliha od požara, vode i provale',
      ];
  if (input.includeProfessionalLiability) {
    covered.push(
      isEn
        ? 'Professional indemnity for financial errors & omissions in client services'
        : 'Profesionalna odgovornost za financijske pogreške i propuste u pružanju usluga'
    );
  }
  if (input.includeCyber) {
    covered.push(
      isEn
        ? 'Cyber protection: data recovery, ransomware response & GDPR breach liability'
        : 'Cyber zaštita: oporavak podataka, ransomware incidenti i odgovornost za povredu GDPR-a'
    );
  }

  const excluded: string[] = isEn
    ? [
        'Contractual penalties, fines, and intentional statutory violations',
        'Bankruptcy, insolvency, and pure trading losses',
        'Data loss without baseline regular backups',
      ]
    : [
        'Ugovorne kazne, penali i namjerno kršenje zakonskih obveza',
        'Stečaj, nelikvidnost i čisti tržišni gubici poslovanja',
        'Gubitak podataka bez osnovne sigurnosne kopije (backup)',
      ];

  return {
    annual,
    limit: Math.round(250_000 * customization.coverageMultiplier),
    covered,
    excluded,
  };
}

export function generateCarrierOffers(
  input: ProductQuoteInput,
  customization: CoverageCustomization,
  bundleProducts: ProductLine[] = [],
  language: Language = 'hr'
): CarrierOffer[] {
  let computed: { annual: number; limit: number; covered: string[]; excluded: string[] };

  switch (input.productLine) {
    case 'auto':
      computed = computeAutoBase(input, customization, language);
      break;
    case 'imovina':
      computed = computePropertyBase(input, customization, language);
      break;
    case 'zdravstveno':
      computed = computeHealthBase(input, customization, language);
      break;
    case 'zivotno':
      computed = computeLifeBase(input, customization, language);
      break;
    case 'putno':
      computed = computeTravelBase(input, customization, language);
      break;
    case 'ljubimci':
      computed = computePetBase(input, customization, language);
      break;
    case 'poslovno':
      computed = computeBusinessBase(input, customization, language);
      break;
  }

  const bundleDiscountPercent = computeBundleDiscountPercent(
    Array.from(new Set([input.productLine, ...bundleProducts]))
  );
  const bundleMultiplier = 1 - bundleDiscountPercent / 100;
  const effectiveDeductible = isDeductibleApplicable(input) ? customization.deductible : 0;
  const isTravel = input.productLine === 'putno';
  const isEn = language === 'en';

  const offers: CarrierOffer[] = BRAND_CONFIG.partnerInsurers.map((partner, idx) => {
    const lineJitter = 1 + (((idx * 7 + input.productLine.length * 3) % 9) - 4) * 0.012;
    const rawAnnual = computed.annual * partner.baseFactor * lineJitter;
    const discountedAnnual = roundTwo(rawAnnual * bundleMultiplier);
    // Travel is a single-trip upfront policy, NOT a 12-month installment plan
    const monthly = isTravel ? discountedAnnual : roundTwo((discountedAnnual / 12) * 1.03);

    let highlightBadge: string | undefined;
    if (partner.id === 'generali') {
      highlightBadge = isEn ? 'Best price-to-coverage' : 'Najbolji omjer cijene i pokrića';
    } else if (partner.id === 'croatia') {
      highlightBadge = isEn ? 'Largest HR claims network' : 'Najveća mreža procjenitelja u RH';
    }

    const tierLabel =
      customization.coverageMultiplier >= 1.25
        ? isEn
          ? 'Extended Cover Plus'
          : 'Prošireno pokriće Plus'
        : customization.coverageMultiplier <= 0.85
          ? isEn
            ? 'Essential Plan'
            : 'Osnovni paket'
          : isEn
            ? 'Optimal Plan'
            : 'Optimalni paket';

    return {
      carrierId: partner.id,
      carrierName: partner.name,
      carrierShortName: partner.shortName,
      rating: partner.rating,
      tierLabel,
      monthlyPrice: monthly,
      annualPrice: discountedAnnual,
      baseAnnualBeforeBundle: roundTwo(rawAnnual),
      bundleDiscountPercent,
      deductible: effectiveDeductible,
      coverageLimit: computed.limit,
      coveredItems: computed.covered,
      excludedItems: computed.excluded,
      ipidCode: `${partner.ipidPrefix}-${input.productLine.toUpperCase()}-2026`,
      highlightBadge,
    };
  });

  offers.sort((a, b) => a.annualPrice - b.annualPrice);
  const cheapest = offers[0];
  if (cheapest && !cheapest.highlightBadge) {
    cheapest.highlightBadge = isEn ? 'Lowest premium' : 'Najniža premija';
  }

  return offers;
}

/**
 * Feeds extracted policy risk attributes into the real multi-carrier pricing engine
 * to generate realistic competing offers (filtering out current insurer where possible)
 * and honest annual savings.
 */
export function buildCompetingOffersFromExtracted(
  extracted: ExtractedPolicyFields,
  language: Language = 'hr'
): {
  competingOffers: CarrierOffer[];
  bestOffer: CarrierOffer;
  estimatedNewAnnualPremium: number;
  estimatedAnnualSavings: number;
} {
  const rawDed = extracted.deductible ?? 150;
  const snappedDeductible: CoverageCustomization['deductible'] =
    rawDed <= 50 ? 0 : rawDed <= 225 ? 150 : rawDed <= 400 ? 300 : 500;

  const baseCustomization = {
    ...getDefaultCustomizationForLine(extracted.productLine),
    deductible: snappedDeductible,
  };

  let quoteInput: ProductQuoteInput;
  switch (extracted.productLine) {
    case 'auto':
      quoteInput = {
        productLine: 'auto',
        plateNumber: extracted.vehiclePlate || 'ZG-1000-AA',
        make: 'Vozilo',
        model: 'Standard',
        year: new Date().getFullYear() - 4,
        kw: extracted.currentAnnualPremium > 480 ? 105 : 75,
        bonusPercent:
          typeof extracted.bonusPercent === 'number'
            ? Math.min(50, Math.max(0, extracted.bonusPercent))
            : 50,
        youngDriver: false,
        annualMileage: '10k_20k',
        kaskoTier:
          extracted.currentAnnualPremium >= 420
            ? 'full_kasko'
            : extracted.currentAnnualPremium >= 280
              ? 'mini_kasko'
              : 'ao_only',
      };
      break;
    case 'imovina':
      quoteInput = {
        productLine: 'imovina',
        city: 'Zagreb',
        postalCode: '10000',
        propertyType: 'stan',
        areaSqm: extracted.areaSqm && extracted.areaSqm >= 20 ? extracted.areaSqm : 70,
        coverageScope: 'both',
        includeEarthquake: extracted.currentAnnualPremium >= 170,
        includeFlood: false,
        includeBurglary: true,
      };
      break;
    case 'zdravstveno':
      quoteInput = {
        productLine: 'zdravstveno',
        age: 38,
        planTier: extracted.currentAnnualPremium >= 240 ? 'kombinirano' : 'dopunsko',
        includeBListDrugs: true,
        includeDiagnostics: extracted.currentAnnualPremium >= 240,
        familyMembers: 1,
      };
      break;
    case 'zivotno':
      quoteInput = {
        productLine: 'zivotno',
        age: 38,
        smoker: false,
        sumInsured: 80000,
        termYears: 20,
        includeCriticalIllness: extracted.currentAnnualPremium >= 320,
      };
      break;
    case 'putno':
      quoteInput = {
        productLine: 'putno',
        destination: 'eu',
        days: 10,
        travelers: 2,
        includeWinterSports: false,
        includeCancellation: true,
      };
      break;
    case 'ljubimci':
      quoteInput = {
        productLine: 'ljubimci',
        petType: 'dog',
        petAgeYears: 3,
        breedSize: 'medium',
        includeLiability: true,
      };
      break;
    case 'poslovno':
      quoteInput = {
        productLine: 'poslovno',
        companyType: 'doo',
        employees: 5,
        annualRevenueBand: '100k_500k',
        includeProfessionalLiability: true,
        includeCyber: extracted.currentAnnualPremium >= 550,
      };
      break;
  }

  const allOffers = generateCarrierOffers(quoteInput, baseCustomization, [], language);
  const currentLower = extracted.insurer.toLowerCase();
  const competing = allOffers.filter(
    (o) =>
      !o.carrierName.toLowerCase().includes(currentLower) &&
      !currentLower.includes(o.carrierShortName.toLowerCase())
  );
  const pool = competing.length > 0 ? competing : allOffers;
  const bestOffer = pool[0]!;
  const estimatedNewAnnualPremium = bestOffer.annualPrice;
  const estimatedAnnualSavings = roundTwo(
    Math.max(0, extracted.currentAnnualPremium - estimatedNewAnnualPremium)
  );

  return {
    competingOffers: pool.slice(0, 4),
    bestOffer,
    estimatedNewAnnualPremium,
    estimatedAnnualSavings,
  };
}
