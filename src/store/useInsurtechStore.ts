import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  UserProfile,
  Advisor,
  Policy,
  Claim,
  ClaimTimelineEvent,
  InformativeOffer,
  ContractPipelineItem,
  PrefilledQuoteTransfer,
  GdprRequestRecord,
  InsuranceProductType,
  AutoQuoteParams,
  PropertyQuoteParams,
  OcrPrometnaResult,
  CalculatedQuoteEstimate,
} from '../types/insurance';
import { firestoreService, portalSyncService } from '../api/firestoreService';

export interface InsurtechStoreState {
  // 1. User, Advisor & Active Agent Profile Switcher
  user: UserProfile;
  advisor: Advisor;
  activeAgentId: 'diana' | 'hrvoje' | 'laura';
  setUser: (user: Partial<UserProfile>) => void;
  setActiveAgentId: (agentId: 'diana' | 'hrvoje' | 'laura') => void;

  // 2. Active Quote Funnel state ("Maya Engine" & Pre-filled Quote Transfer)
  activeProduct: InsuranceProductType;
  funnelStep: number;
  autoParams: AutoQuoteParams;
  propertyParams: PropertyQuoteParams;
  ocrPrometna: OcrPrometnaResult | null;
  quoteEstimate: CalculatedQuoteEstimate;
  prefilledQuoteTransfer: PrefilledQuoteTransfer | null;
  setActiveProduct: (product: InsuranceProductType) => void;
  setFunnelStep: (step: number) => void;
  nextFunnelStep: () => void;
  prevFunnelStep: () => void;
  updateAutoParams: (params: Partial<AutoQuoteParams>) => void;
  updatePropertyParams: (params: Partial<PropertyQuoteParams>) => void;
  applyOcrResult: (result: OcrPrometnaResult) => void;
  recalculateActiveQuote: () => void;
  resetQuoteFunnel: () => void;
  setPrefilledQuoteTransfer: (transfer: PrefilledQuoteTransfer | null) => void;

  // 3. Digital Policy Wallet & Master Skadencar Ledger (Bidirectional)
  policies: Policy[];
  acceptPolicyRenewal: (policyId: string) => void;
  addPolicy: (policy: Policy) => void;
  removePolicy: (policyId: string) => void;
  updatePolicyProvisionStatus: (
    policyId: string,
    provisionStatus: 'paid_provision' | 'pending_provision' | 'archived'
  ) => void;

  // 4. Claims & 5-Phase FNOL Center (Bidirectional)
  claims: Claim[];
  submitNewClaim: (claimInput: {
    policyId: string;
    policyNumber?: string;
    clientName?: string;
    clientOib?: string;
    carrierName?: string;
    incidentDate: string;
    location: string;
    category: string;
    description: string;
    mediaUrls: string[];
    iban: string;
    claimAmountRequested?: number;
    damagedZones?: string[];
    culpability?: string;
    policeReportFiled?: boolean;
    documentChecklist?: string[];
  }) => Claim;
  appendClaimMessage: (claimId: string, note: string) => void;
  updateClaimPhase: (claimId: string, phase: 1 | 2 | 3 | 4 | 5, agentNotes?: string) => void;
  removeClaim: (claimId: string) => void;

  // 5. Informative Offers (Bidirectional: Zatraži ponudu <-> Korisnički <-> Zastupnički)
  informativeOffers: InformativeOffer[];
  createInformativeOffer: (offerInput: Partial<InformativeOffer>) => InformativeOffer;
  acceptInformativeOffer: (offerId: string) => Policy | null;
  removeInformativeOffer: (offerId: string) => void;
  updateInformativeOffer: (offerId: string, updates: Partial<InformativeOffer>) => void;

  // 6. Multi-Phase Contracting Pipeline
  contractPipeline: ContractPipelineItem[];
  addContractPipelineItem: (item: Partial<ContractPipelineItem>) => ContractPipelineItem;
  updateContractPipelineStage: (id: string, stage: 1 | 2 | 3 | 4 | 5, notes?: string) => void;
  removeContractPipelineItem: (id: string) => void;

  // 7. GDPR Account Management & Deletion Requests
  gdprRequests: GdprRequestRecord[];
  submitGdprRequest: (requestType: 'data_export' | 'account_deletion', reason?: string) => GdprRequestRecord;
}

const daysFromNowIso = (days: number): string => {
  const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return d.toISOString().split('T')[0];
};

// Dedicated Assigned Agent for Agencija Život
export const DEFAULT_ADVISOR: Advisor = {
  id: 'adv-diana-zivot',
  name: 'Diana (Agencija Život)',
  title: 'Ovlaštena zastupnica u osiguranju — Generali & Toyota Partner',
  phone: '+385 91 450 1458',
  email: 'agencija.zivot@generali.com',
  whatsappNumber: '385914501458',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  licenseNumber: 'HANFA ZO-01918940',
  schedulingUrl: 'https://cal.com/agencija-zivot/konzultacije-15min',
};

// Initial User Profile (Valid ISO 7064 OIB: 24918274015)
export const DEFAULT_USER: UserProfile = {
  uid: 'usr-zagreb-001',
  email: 'marko.horvatic@gmail.com',
  displayName: 'Marko Horvatić',
  phone: '+385 91 555 4321',
  oib: '24918274015',
  iban: 'HR1223600003219847561',
  address: 'Palmotićeva ulica 42',
  city: 'Zagreb',
  postalCode: '10000',
  assignedAdvisorId: 'adv-diana-zivot',
  createdAt: '2024-03-15T09:00:00Z',
  communicationPreferences: {
    emailNotifications: true,
    smsExpiryAlerts: true,
    whatsappClaimsUpdates: true,
    marketingOffers: true,
  },
  gdprDeletionRequestedAt: null,
};

// Initial Sample Policies (Includes policies expiring within <30 days for live SLA & Renewal alerts)
export const INITIAL_POLICIES: Policy[] = [
  {
    id: 'pol-toyota-rav4-2026',
    userId: 'usr-zagreb-001',
    policyNumber: 'HR-GEN-882914-AO',
    type: 'kasko',
    carrier: 'Toyota Osiguranje (Generali osiguranje d.d.)',
    startDate: daysFromNowIso(-345),
    endDate: daysFromNowIso(20), // Expires in 20 days (<30 days!)
    status: 'expiring_soon',
    premiumAnnual: 684.50,
    paymentFrequency: 'monthly',
    assetName: 'Toyota RAV4 2.5 Hybrid AWD (ZG-4821-HP)',
    clientName: 'Marko Horvatić',
    clientOib: '24918274015',
    assignedAgentId: 'hrvoje',
    provisionStatus: 'paid_provision',
    renewalOffer: {
      newPremiumAnnual: 636.60,
      validUntil: daysFromNowIso(20),
      accepted: false,
      carrierDiscountPercentage: 7,
    },
    coverageDetails: {
      limitEur: 42000,
      deductibleEur: 150,
      riders: [
        'Obvezno AO + Puni Kasko (Toyota OEM dijelovi)',
        'Zaštita visokonaponske Hybrid baterije',
        'Pomoć na cesti 24/7 (HR + EU)',
        'Lom stakla bez franšize u Toyota Centru Zagreb',
        'Zaštita bonusa 50% (B10)',
      ],
    },
    documents: [
      {
        title: 'Polica obveznog i Toyota Kasko osiguranja (HR-GEN-882914-AO)',
        type: 'policy_pdf',
        downloadUrl: '/documents/polica-toyota-rav4.pdf',
        fileSizeBytes: 342000,
      },
      {
        title: 'Međunarodna karta osiguranja (Zelena karta)',
        type: 'green_card',
        downloadUrl: '/documents/zelena-karta-toyota.pdf',
        fileSizeBytes: 184000,
      },
      {
        title: 'HUB 3A SEPA Nalog za plaćanje rate (57,04 €)',
        type: 'payment_slip',
        downloadUrl: '/documents/sepa-toyota-rata.pdf',
        fileSizeBytes: 98000,
      },
    ],
  },
  {
    id: 'pol-stan-zagreb-centar',
    userId: 'usr-zagreb-001',
    policyNumber: 'HR-GEN-410294-DOM',
    type: 'property',
    carrier: 'Generali osiguranje d.d.',
    startDate: daysFromNowIso(-354),
    endDate: daysFromNowIso(11), // Expires in 11 days (<30 days!)
    status: 'expiring_soon',
    premiumAnnual: 245.00,
    paymentFrequency: 'annual',
    assetName: 'Stan Zagreb — Donji grad (Ilica, 84 m²)',
    clientName: 'Marko Horvatić',
    clientOib: '24918274015',
    assignedAgentId: 'diana',
    provisionStatus: 'paid_provision',
    coverageDetails: {
      limitEur: 168000,
      deductibleEur: 0,
      riders: [
        'Požar, oluja, tuča i udar groma',
        'Potres na novu građevinsku vrijednost',
        'Izljev vode iz vodovodnih i toplovodnih cijevi',
        'Odgovornost vlasnika nekretnine prema trećima (50.000 €)',
      ],
    },
    renewalOffer: {
      newPremiumAnnual: 228.00,
      validUntil: daysFromNowIso(11),
      accepted: false,
      carrierDiscountPercentage: 7,
    },
    documents: [
      {
        title: 'Ugovor o osiguranju imovine i kućanstva (HR-GEN-410294-DOM)',
        type: 'policy_pdf',
        downloadUrl: '/documents/polica-imovina-zagreb.pdf',
        fileSizeBytes: 412000,
      },
      {
        title: 'Godišnja SEPA uplatnica za obnovu (228,00 €)',
        type: 'payment_slip',
        downloadUrl: '/documents/sepa-obnova-imovina.pdf',
        fileSizeBytes: 104000,
      },
    ],
  },
  {
    id: 'pol-zivot-exclusiv-2026',
    userId: 'usr-zagreb-001',
    policyNumber: 'HR-GEN-771029-ZIV',
    type: 'life',
    carrier: 'Generali osiguranje d.d.',
    startDate: daysFromNowIso(-120),
    endDate: daysFromNowIso(245),
    status: 'active',
    premiumAnnual: 480.00,
    paymentFrequency: 'monthly',
    assetName: 'Generali Životni Kasko & Zaštita obitelji (50.000 €)',
    clientName: 'Marko Horvatić',
    clientOib: '24918274015',
    assignedAgentId: 'diana',
    provisionStatus: 'paid_provision',
    coverageDetails: {
      limitEur: 50000,
      deductibleEur: 0,
      riders: [
        'Smrt uslijed bolesti ili nezgode (50.000 €)',
        'Trajni invaliditet uslijed nezgode (do 100.000 €)',
        'Teške bolesti (25 dijagnoza — 15.000 €)',
      ],
    },
    documents: [
      {
        title: 'Polica životnog osiguranja (HR-GEN-771029-ZIV)',
        type: 'policy_pdf',
        downloadUrl: '/documents/polica-zivot-generali.pdf',
        fileSizeBytes: 388000,
      },
    ],
  },
  {
    id: 'pol-toyota-yaris-ana',
    userId: 'usr-zagreb-002',
    policyNumber: 'HR-TCZ-559102-KASKO',
    type: 'auto',
    carrier: 'Toyota Osiguranje (Generali × TCZ)',
    startDate: daysFromNowIso(-340),
    endDate: daysFromNowIso(25), // Expires in 25 days (<30 days!)
    status: 'expiring_soon',
    premiumAnnual: 512.00,
    paymentFrequency: 'semi-annual',
    assetName: 'Toyota Yaris Cross 1.5 Hybrid (ZG-1192-AK)',
    clientName: 'Ana Kovačić',
    clientOib: '58192047127',
    assignedAgentId: 'laura',
    provisionStatus: 'pending_provision',
    coverageDetails: {
      limitEur: 28500,
      deductibleEur: 150,
      riders: ['Obvezno AO + Toyota Kasko', 'Zaštita hibridnog sklopa', 'Zamjensko vozilo u TCZ'],
    },
    documents: [
      {
        title: 'Polica Toyota Yaris Cross (HR-TCZ-559102-KASKO)',
        type: 'policy_pdf',
        downloadUrl: '/documents/polica-yaris-cross.pdf',
        fileSizeBytes: 310000,
      },
    ],
  },
];

// Initial Sample Claims with 5-phase progress
export const INITIAL_CLAIMS: Claim[] = [
  {
    id: 'clm-2026-0841',
    claimNumber: 'ŠT-2026-0841',
    policyId: 'pol-toyota-rav4-2026',
    policyNumber: 'HR-GEN-882914-AO',
    userId: 'usr-zagreb-001',
    clientName: 'Marko Horvatić',
    clientOib: '24918274015',
    carrierName: 'Toyota Osiguranje (Generali osiguranje d.d.)',
    incidentDate: daysFromNowIso(-6),
    location: 'Autocesta A1 (smjer Zagreb - Karlovac, km 24)',
    category: 'Prometna nesreća - AO/Kasko',
    description:
      'Tijekom vožnje iza teretnog vozila odletio je kamenčić i prouzročio pukotinu na prednjem vjetrobranskom staklu dužine cca 15 cm. Potrebna je zamjena originalnog OEM stakla s kalibracijom Toyota Safety Sense kamere u Toyota Centru Zagreb.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80',
    ],
    status: 'assessor_assigned',
    phase: 4,
    damagedZones: ['Prednje vjetrobransko staklo', 'Kamera sustava asistencije (ADAS)'],
    culpability: 'Nema krivnje osiguranika (udar kamena na cesti)',
    policeReportFiled: false,
    documentChecklist: ['Fotografije oštećenja', 'Prometna dozvola', 'Broj police HR-GEN-882914-AO'],
    agentNotes:
      'Izdan izravni nalog za zamjenu originalnog OEM stakla i kalibraciju radara u Toyota Centru Zagreb bez učešća u šteti (0 € franšiza).',
    claimAmountRequested: 650.00,
    claimAmountApproved: 650.00,
    iban: 'HR1223600003219847561',
    assessorName: 'Hrvoje — Toyota Centar Zagreb / Generali likvidacija',
    assessorPhone: '+385 91 450 1458',
    createdAt: daysFromNowIso(-6),
    timeline: [
      {
        title: '1. Zaprimljeno (FNOL prijava)',
        description: 'Klijent je poslao digitalnu prijavu štete i fotografije oštećenja.',
        timestamp: daysFromNowIso(-6),
        author: 'Sustav Agencija Život',
        statusTag: 'submitted',
      },
      {
        title: '2. Provjera dokumentacije',
        description: 'Potvrđeno aktivno Toyota Kasko pokriće i dopunski rizik loma stakla bez franšize.',
        timestamp: daysFromNowIso(-5),
        author: 'Diana (Agencija Život)',
        statusTag: 'under_review',
      },
      {
        title: '3. Predano osiguratelju (Generali d.d.)',
        description: 'Odštetni spis urudžbiran u sustav likvidacije Generali osiguranja d.d.',
        timestamp: daysFromNowIso(-4),
        author: 'Hrvoje (osiguranje@tcz.hr)',
        statusTag: 'sent_to_insurer',
      },
      {
        title: '4. Procjena štete u Toyota Centru Zagreb',
        description: 'Odobrena zamjena OEM vjetrobranskog stakla s kalibracijom senzora (650,00 €).',
        timestamp: daysFromNowIso(-2),
        author: 'Procjenitelj Generali d.d.',
        statusTag: 'assessor_assigned',
      },
    ],
  },
];

// Initial Informative Offers (Synchronized between Korisnički & Zastupnički portal)
export const INITIAL_OFFERS: InformativeOffer[] = [
  {
    id: 'off-2026-9012',
    offerNumber: 'PON-2026-9012',
    clientName: 'Marko Horvatić',
    clientOib: '24918274015',
    clientEmail: 'marko.horvatic@gmail.com',
    clientPhone: '+385 91 555 4321',
    productType: 'kasko',
    productTitle: 'Toyota Osiguranje — Ekskluziv AO + Full Kasko (C-HR Hybrid)',
    carrier: 'Toyota Osiguranje (Generali osiguranje d.d.)',
    assetDescription: 'Toyota C-HR 2.0 Hybrid GR Sport (145 kW, 2026.)',
    annualPremium: 742.00,
    paymentDynamics: 'Mjesečno (12 rata)',
    deductibleEur: 0,
    coverageLimitEur: 39500,
    riders: [
      'Obvezno AO (50% bonus B10)',
      'Puni Kasko bez franšize (0 €)',
      'Zaštita visokonaponske Hybrid baterije i invertera',
      'Popravak isključivo u Toyota Centru Zagreb s OEM dijelovima',
      'Pomoć na cesti 24/7 HR + EU i zamjensko vozilo',
    ],
    status: 'ponuda_spremna',
    assignedAgentId: 'hrvoje',
    createdAt: daysFromNowIso(-2),
    validUntil: daysFromNowIso(28),
    pdfCalculationAttached: true,
    iddNeedsVerified: true,
    notes: 'Službena ponuda s uključenim popustom za postojećeg Toyota klijenta (-15% paketni popust).',
  },
  {
    id: 'off-2026-9045',
    offerNumber: 'PON-2026-9045',
    clientName: 'Marko Horvatić',
    clientOib: '24918274015',
    clientEmail: 'marko.horvatic@gmail.com',
    clientPhone: '+385 91 555 4321',
    productType: 'health',
    productTitle: 'Generali Dobrovoljno Zdravstveno — Paket Komfort Specijalist',
    carrier: 'Generali osiguranje d.d.',
    assetDescription: 'Specijalistički pregledi + Sistematski pregled + B-lista lijekova',
    annualPremium: 318.00,
    paymentDynamics: 'Mjesečno (12 rata)',
    deductibleEur: 0,
    coverageLimitEur: 3000,
    riders: [
      'Godišnji sistematski pregled u privatnoj poliklinici',
      'Specijalistički pregledi i dijagnostika bez listi čekanja (do 3.000 €)',
      'Dopunsko zdravstveno pokriće A + B liste lijekova',
      '24/7 Telemedicina i drugo liječničko mišljenje',
    ],
    status: 'ponuda_spremna',
    assignedAgentId: 'diana',
    createdAt: daysFromNowIso(-1),
    validUntil: daysFromNowIso(29),
    pdfCalculationAttached: true,
    iddNeedsVerified: true,
    notes: 'Preporučena ponuda uz obiteljski popust Program vjernosti Gold.',
  },
];

// Initial Multi-Phase Contracting Pipeline
export const INITIAL_PIPELINE: ContractPipelineItem[] = [
  {
    id: 'pipe-9012',
    offerId: 'off-2026-9012',
    referenceCode: 'UG-2026-9012',
    clientName: 'Marko Horvatić',
    clientOib: '24918274015',
    clientEmail: 'marko.horvatic@gmail.com',
    clientPhone: '+385 91 555 4321',
    productTitle: 'Toyota Osiguranje — Ekskluziv AO + Full Kasko (C-HR Hybrid)',
    carrier: 'Toyota Osiguranje (Generali osiguranje d.d.)',
    annualPremiumEur: 742.00,
    stage: 3,
    assignedAgentId: 'hrvoje',
    updatedAt: daysFromNowIso(-1),
    notes: 'Informativni izračun poslan u Korisnički portal. Čeka se klik klijenta "Prihvati ponudu".',
  },
  {
    id: 'pipe-9045',
    offerId: 'off-2026-9045',
    referenceCode: 'UG-2026-9045',
    clientName: 'Marko Horvatić',
    clientOib: '24918274015',
    clientEmail: 'marko.horvatic@gmail.com',
    clientPhone: '+385 91 555 4321',
    productTitle: 'Generali Dobrovoljno Zdravstveno — Paket Komfort Specijalist',
    carrier: 'Generali osiguranje d.d.',
    annualPremiumEur: 318.00,
    stage: 3,
    assignedAgentId: 'diana',
    updatedAt: daysFromNowIso(-1),
    notes: 'Proveden HANFA IDD test zahtjeva i potreba. Ponuda spremna za prihvat.',
  },
  {
    id: 'pipe-9088',
    referenceCode: 'UG-2026-9088',
    clientName: 'Ana Kovačić',
    clientOib: '58192047127',
    clientEmail: 'ana.kovacic@zagreb.hr',
    clientPhone: '+385 98 712 4410',
    productTitle: 'Osiguranje imovine — Paket Ekskluziv + Potres (Stan 92 m²)',
    carrier: 'Generali osiguranje d.d.',
    annualPremiumEur: 312.50,
    stage: 2,
    assignedAgentId: 'diana',
    updatedAt: daysFromNowIso(0),
    notes: 'Provjera godine gradnje (2018.) i izračun građevinske vrijednosti.',
  },
  {
    id: 'pipe-9104',
    referenceCode: 'UG-2026-9104',
    clientName: 'Ivan Babić',
    clientOib: '73019482611',
    clientEmail: 'ivan.babic@tvrtka.hr',
    clientPhone: '+385 91 332 1090',
    productTitle: 'Toyota Hilux 2.8 D-4D — Flotni AO + Kasko leasing',
    carrier: 'Toyota Osiguranje (Generali × TCZ)',
    annualPremiumEur: 1120.00,
    stage: 4,
    assignedAgentId: 'laura',
    updatedAt: daysFromNowIso(0),
    notes: 'Potpisana ponuda od strane leasing kuće, čeka se provjera SEPA uplate.',
  },
];

// Helper Actuarial Function for Quote recalculation
export function calculateDynamicQuote(
  product: InsuranceProductType,
  auto: AutoQuoteParams,
  prop: PropertyQuoteParams
): CalculatedQuoteEstimate {
  if (product === 'auto' || product === 'kasko') {
    const kw = auto.kwPower || 85;
    let baseAo = 135;
    if (kw > 65) baseAo = 165;
    if (kw > 84) baseAo = 195;
    if (kw > 110) baseAo = 245;
    if (kw > 130) baseAo = 310;

    const bonus = auto.bonusPercentage ?? 50;
    const bonusDiscount = baseAo * (bonus / 100);
    const totalAo = baseAo - bonusDiscount;

    let kaskoAddon = 0;
    if (auto.includeKasko) {
      kaskoAddon = kw * 3.8 + 140;
      if (auto.deductibleTier === 150) kaskoAddon *= 0.88;
      if (auto.deductibleTier === 300) kaskoAddon *= 0.76;
      if (auto.deductibleTier === 500) kaskoAddon *= 0.65;
    }

    let ridersTotal = 0;
    if (auto.includeAssistance) ridersTotal += 29;
    if (auto.includeGlass) ridersTotal += 38;
    if (auto.includeBonusProtection) ridersTotal += 24;
    if (auto.includeHailStorm) ridersTotal += 42;
    if (auto.includeTheft) ridersTotal += 55;

    const annual = Math.round((totalAo + kaskoAddon + ridersTotal) * 100) / 100;
    const monthly = Math.round((annual / 12) * 100) / 100;

    return {
      annualPremium: annual,
      monthlyPremium: monthly,
      quarterlyPremium: Math.round((annual / 4) * 100) / 100,
      currency: 'EUR',
      baseRate: baseAo,
      discountsTotal: Math.round(bonusDiscount * 100) / 100,
      addonsTotal: Math.round((kaskoAddon + ridersTotal) * 100) / 100,
      deductible: auto.deductibleTier || 0,
      coverageLimit: auto.includeKasko ? 35000 : 6450000,
      itemizedBreakdown: [
        { title: `Obvezno auto osiguranje (${kw} kW, zona Zagreb)`, amount: Math.round(totalAo * 100) / 100 },
        ...(auto.includeKasko
          ? [{ title: `Puni Kasko paket (franšiza ${auto.deductibleTier || 0} €)`, amount: Math.round(kaskoAddon * 100) / 100 }]
          : []),
        ...(auto.includeAssistance ? [{ title: 'Asistencija na cesti 24/7 (Hrvatska i Europa)', amount: 29 }] : []),
        ...(auto.includeGlass ? [{ title: 'Lom stakala bez franšize i gubitka bonusa', amount: 38 }] : []),
        ...(auto.includeBonusProtection ? [{ title: 'Zaštita stečenog bonusa 50%', amount: 24 }] : []),
        ...(auto.includeHailStorm ? [{ title: 'Zaštita od tuče, oluje i elementarnih nepogoda', amount: 42 }] : []),
        ...(auto.includeTheft ? [{ title: 'Zaštita od krađe i provale', amount: 55 }] : []),
      ],
    };
  }

  const m2 = prop.areaM2 || 75;
  const baseRate = m2 * 1.65;
  let addons = 0;
  if (prop.includeEarthquake) addons += m2 * 0.95;
  if (prop.includeContents) addons += 45;
  if (prop.includeWaterPipeBreak) addons += 32;
  if (prop.includeTheftBurglary) addons += 28;
  if (prop.includeThirdPartyLiability) addons += 22;

  let deductibleDiscount = 0;
  if (prop.deductibleTier === 150) deductibleDiscount = (baseRate + addons) * 0.10;
  if (prop.deductibleTier === 300) deductibleDiscount = (baseRate + addons) * 0.18;

  const annual = Math.round((baseRate + addons - deductibleDiscount) * 100) / 100;
  const monthly = Math.round((annual / 12) * 100) / 100;

  return {
    annualPremium: annual,
    monthlyPremium: monthly,
    currency: 'EUR',
    baseRate: Math.round(baseRate * 100) / 100,
    discountsTotal: Math.round(deductibleDiscount * 100) / 100,
    addonsTotal: Math.round(addons * 100) / 100,
    deductible: prop.deductibleTier || 0,
    coverageLimit: m2 * 1800,
    itemizedBreakdown: [
      { title: `Građevinska vrijednost nekretnine (${m2} m²)`, amount: Math.round(baseRate * 100) / 100 },
      ...(prop.includeEarthquake
        ? [{ title: 'Potres na novu građevinsku vrijednost', amount: Math.round(m2 * 0.95 * 100) / 100 }]
        : []),
      ...(prop.includeContents ? [{ title: 'Osiguranje kućanstva i pokretnina', amount: 45 }] : []),
      ...(prop.includeWaterPipeBreak ? [{ title: 'Izljev vode iz vodovodnih i kanalizacijskih cijevi', amount: 32 }] : []),
      ...(prop.includeTheftBurglary ? [{ title: 'Provalna krađa, razbojništvo i vandalizam', amount: 28 }] : []),
      ...(prop.includeThirdPartyLiability ? [{ title: 'Odgovornost vlasnika prema trećima (50.000 €)', amount: 22 }] : []),
    ],
  };
}

const DEFAULT_AUTO_PARAMS: AutoQuoteParams = {
  kwPower: 85,
  vehicleAge: 4,
  bonusPercentage: 50,
  usageType: 'private',
  includeKasko: true,
  includeAssistance: true,
  includeGlass: true,
  includeBonusProtection: true,
  includeHailStorm: true,
  includeTheft: false,
  deductibleTier: 150,
};

const DEFAULT_PROPERTY_PARAMS: PropertyQuoteParams = {
  areaM2: 75,
  propertyType: 'apartment',
  constructionYear: 2012,
  includeContents: true,
  includeEarthquake: true,
  includeFlood: false,
  includeWaterPipeBreak: true,
  includeTheftBurglary: true,
  includeThirdPartyLiability: true,
  deductibleTier: 0,
};

const PHASE_TITLES: Record<1 | 2 | 3 | 4 | 5, { title: string; status: Claim['status'] }> = {
  1: { title: '1. Zaprimljeno', status: 'submitted' },
  2: { title: '2. Provjera dokumentacije', status: 'under_review' },
  3: { title: '3. Predano osiguratelju', status: 'sent_to_insurer' },
  4: { title: '4. Procjena štete', status: 'assessor_assigned' },
  5: { title: '5. Isplata / Riješeno', status: 'paid' },
};

export const useInsurtechStore = create<InsurtechStoreState>()(
  persist(
    (set, get) => ({
      user: DEFAULT_USER,
      advisor: DEFAULT_ADVISOR,
      activeAgentId: 'diana',

      setUser: (userUpdate) =>
        set((state) => {
          const updated = { ...state.user, ...userUpdate };
          firestoreService.saveUserProfile(updated as any).catch(() => {});
          return { user: updated };
        }),

      setActiveAgentId: (agentId) => set({ activeAgentId: agentId }),

      activeProduct: 'auto',
      funnelStep: 1,
      autoParams: DEFAULT_AUTO_PARAMS,
      propertyParams: DEFAULT_PROPERTY_PARAMS,
      ocrPrometna: null,
      quoteEstimate: calculateDynamicQuote('auto', DEFAULT_AUTO_PARAMS, DEFAULT_PROPERTY_PARAMS),
      prefilledQuoteTransfer: null,

      setActiveProduct: (product) => {
        set({ activeProduct: product, funnelStep: 1 });
        get().recalculateActiveQuote();
      },

      setFunnelStep: (step) => set({ funnelStep: step }),
      nextFunnelStep: () => set((state) => ({ funnelStep: state.funnelStep + 1 })),
      prevFunnelStep: () => set((state) => ({ funnelStep: Math.max(1, state.funnelStep - 1) })),

      updateAutoParams: (partial) => {
        set((state) => ({ autoParams: { ...state.autoParams, ...partial } }));
        get().recalculateActiveQuote();
      },

      updatePropertyParams: (partial) => {
        set((state) => ({ propertyParams: { ...state.propertyParams, ...partial } }));
        get().recalculateActiveQuote();
      },

      applyOcrResult: (ocr) => {
        set((state) => ({
          ocrPrometna: ocr,
          autoParams: {
            ...state.autoParams,
            kwPower: ocr.powerKw || state.autoParams.kwPower,
            vin: ocr.vin,
            registrationPlate: ocr.registrationPlate,
            vehicleMakeModel: `${ocr.vehicleMake || ''} ${ocr.vehicleModel || ''}`.trim(),
          },
        }));
        get().recalculateActiveQuote();
      },

      recalculateActiveQuote: () => {
        const { activeProduct, autoParams, propertyParams } = get();
        const estimate = calculateDynamicQuote(activeProduct, autoParams, propertyParams);
        set({ quoteEstimate: estimate });
      },

      resetQuoteFunnel: () => {
        set({
          funnelStep: 1,
          autoParams: DEFAULT_AUTO_PARAMS,
          propertyParams: DEFAULT_PROPERTY_PARAMS,
          ocrPrometna: null,
          quoteEstimate: calculateDynamicQuote('auto', DEFAULT_AUTO_PARAMS, DEFAULT_PROPERTY_PARAMS),
        });
      },

      setPrefilledQuoteTransfer: (transfer) => set({ prefilledQuoteTransfer: transfer }),

      policies: INITIAL_POLICIES,

      acceptPolicyRenewal: (policyId: string) => {
        set((state) => ({
          policies: state.policies.map((p) => {
            if (p.id === policyId) {
              const currentEnd = new Date(p.endDate);
              const nextEnd = new Date(currentEnd);
              nextEnd.setFullYear(nextEnd.getFullYear() + 1);
              const newAnnual = p.renewalOffer?.newPremiumAnnual ?? Math.round(p.premiumAnnual * 0.95 * 100) / 100;
              const updatedPolicy: Policy = {
                ...p,
                status: 'active',
                premiumAnnual: newAnnual,
                startDate: p.endDate,
                endDate: nextEnd.toISOString().split('T')[0],
                renewalOffer: {
                  newPremiumAnnual: newAnnual,
                  validUntil: nextEnd.toISOString().split('T')[0],
                  accepted: true,
                  carrierDiscountPercentage: p.renewalOffer?.carrierDiscountPercentage ?? 5,
                },
              };
              firestoreService.updatePolicy(policyId, updatedPolicy).catch(() => {});
              return updatedPolicy;
            }
            return p;
          }),
        }));
      },

      addPolicy: (newPolicy: Policy) => {
        firestoreService.createPolicy(newPolicy).catch(() => {});
        set((state) => ({
          policies: [newPolicy, ...state.policies],
        }));
      },

      removePolicy: (policyId: string) => {
        firestoreService.updatePolicy(policyId, { status: 'archived' }).catch(() => {});
        set((state) => ({
          policies: state.policies.filter((p) => p.id !== policyId),
        }));
      },

      updatePolicyProvisionStatus: (policyId, provisionStatus) => {
        firestoreService.updatePolicy(policyId, { provisionStatus }).catch(() => {});
        set((state) => ({
          policies: state.policies.map((p) => (p.id === policyId ? { ...p, provisionStatus } : p)),
        }));
      },

      claims: INITIAL_CLAIMS,

      submitNewClaim: (claimInput) => {
        const claimId = `clm-${Date.now().toString().slice(-6)}`;
        const claimNumber = `ŠT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const now = new Date().toISOString();

        const initialEvent: ClaimTimelineEvent = {
          title: '1. Zaprimljeno (Digitalna FNOL prijava)',
          description: 'Elektronička prijava štete uspješno zaprimljena. Generiran službeni broj spisa.',
          timestamp: now,
          author: claimInput.clientName || get().user.displayName || 'Sustav Agencija Život',
          statusTag: 'submitted',
        };

        const newClaim: Claim = {
          id: claimId,
          claimNumber,
          policyId: claimInput.policyId,
          policyNumber: claimInput.policyNumber || claimInput.policyId,
          userId: get().user.uid,
          clientName: claimInput.clientName || get().user.displayName,
          clientOib: claimInput.clientOib || get().user.oib || '24918274015',
          carrierName: claimInput.carrierName || 'Generali osiguranje d.d.',
          incidentDate: claimInput.incidentDate,
          location: claimInput.location,
          category: claimInput.category,
          description: claimInput.description,
          mediaUrls: claimInput.mediaUrls,
          iban: claimInput.iban,
          status: 'submitted',
          phase: 1,
          damagedZones: claimInput.damagedZones || [],
          culpability: claimInput.culpability || 'U utvrđivanju',
          policeReportFiled: claimInput.policeReportFiled ?? false,
          documentChecklist: claimInput.documentChecklist || ['Europsko izvješće / opis', 'Fotografije štete'],
          agentNotes: 'Prijava zaprimljena u sustav. Slijedi verifikacija police i dokumentacije.',
          claimAmountRequested: claimInput.claimAmountRequested,
          timeline: [initialEvent],
          createdAt: now,
        };

        firestoreService.createClaim(newClaim).catch(() => {});

        set((state) => ({
          claims: [newClaim, ...state.claims],
        }));

        return newClaim;
      },

      appendClaimMessage: (claimId: string, note: string) => {
        const newEvent: ClaimTimelineEvent = {
          title: 'Poruka / bilješka u spisu',
          description: note,
          timestamp: new Date().toISOString(),
          author: get().user.displayName,
        };

        set((state) => ({
          claims: state.claims.map((c) =>
            c.id === claimId ? { ...c, timeline: [...c.timeline, newEvent] } : c
          ),
        }));
      },

      updateClaimPhase: (claimId, phase, agentNotes) => {
        const meta = PHASE_TITLES[phase];
        const now = new Date().toISOString();
        set((state) => ({
          claims: state.claims.map((c) => {
            if (c.id !== claimId) return c;
            const newEvent: ClaimTimelineEvent = {
              title: meta.title,
              description:
                agentNotes ||
                `Status predmeta ažuriran u fazu "${meta.title}" od strane zastupnika (${state.activeAgentId.toUpperCase()}).`,
              timestamp: now,
              author: `Zastupnik (${state.activeAgentId.toUpperCase()})`,
              statusTag: meta.status,
            };
            const updated: Claim = {
              ...c,
              phase,
              status: meta.status,
              agentNotes: agentNotes !== undefined ? agentNotes : c.agentNotes,
              timeline: [...c.timeline, newEvent],
            };
            firestoreService.updateClaimStatus(claimId, meta.status, updated.agentNotes).catch(() => {});
            return updated;
          }),
        }));
      },

      removeClaim: (claimId) => {
        firestoreService.updateClaimStatus(claimId, 'withdrawn', 'Povučeno / obrisano').catch(() => {});
        set((state) => ({
          claims: state.claims.filter((c) => c.id !== claimId),
        }));
      },

      informativeOffers: INITIAL_OFFERS,

      createInformativeOffer: (offerInput) => {
        const now = new Date().toISOString();
        const suffix = Math.floor(1000 + Math.random() * 9000);
        const offerId = offerInput.id || `off-2026-${suffix}`;
        const offerNumber = offerInput.offerNumber || `PON-2026-${suffix}`;
        const user = get().user;

        const resolvedPremium = offerInput.annualPremium ?? offerInput.annualPremiumEur ?? 385.00;
        const resolvedRiders =
          offerInput.riders ||
          offerInput.coverageHighlights || [
            'Osnovno pokriće',
            'Asistencija 24/7',
            'Zaštita bonusa',
          ];

        const newOffer: InformativeOffer = {
          id: offerId,
          offerNumber,
          clientName: offerInput.clientName || user.displayName || 'Marko Horvatić',
          clientOib: offerInput.clientOib || user.oib || '24918274015',
          clientEmail: offerInput.clientEmail || user.email || 'marko.horvatic@gmail.com',
          clientPhone: offerInput.clientPhone || user.phone || '+385 91 555 4321',
          productType: offerInput.productType || 'auto',
          productTitle: offerInput.productTitle || 'Generali Osiguranje — Paket Komfort',
          carrier: offerInput.carrier || 'Generali osiguranje d.d.',
          assetDescription: offerInput.assetDescription || 'Osobno vozilo / Imovina',
          annualPremium: resolvedPremium,
          annualPremiumEur: resolvedPremium,
          monthlyInstallmentEur: Math.round((resolvedPremium / 12) * 100) / 100,
          packageTier: offerInput.packageTier || 'Ekskluziv',
          paymentDynamics: offerInput.paymentDynamics || 'Mjesečno (12 rata)',
          deductibleEur: offerInput.deductibleEur ?? 150,
          coverageLimitEur: offerInput.coverageLimitEur ?? 35000,
          riders: resolvedRiders,
          coverageHighlights: resolvedRiders,
          status: offerInput.status || 'ponuda_spremna',
          assignedAgentId: offerInput.assignedAgentId || get().activeAgentId || 'diana',
          createdAt: now.split('T')[0],
          validUntil: daysFromNowIso(30),
          pdfCalculationAttached: offerInput.pdfCalculationAttached ?? true,
          iddNeedsVerified: offerInput.iddNeedsVerified ?? offerInput.iddVerified ?? true,
          iddVerified: offerInput.iddVerified ?? offerInput.iddNeedsVerified ?? true,
          notes: offerInput.notes || 'Informativna ponuda kreirana kroz digitalni sustav Agencije Život.',
          details: offerInput.details || {},
        };

        const pipelineItem: ContractPipelineItem = {
          id: `pipe-${suffix}`,
          offerId: newOffer.id,
          referenceCode: `UG-2026-${suffix}`,
          clientName: newOffer.clientName,
          clientOib: newOffer.clientOib,
          clientEmail: newOffer.clientEmail,
          clientPhone: newOffer.clientPhone,
          productTitle: newOffer.productTitle,
          carrier: newOffer.carrier,
          annualPremiumEur: newOffer.annualPremium,
          stage: newOffer.status === 'ponuda_spremna' ? 3 : 1,
          assignedAgentId: newOffer.assignedAgentId,
          updatedAt: now.split('T')[0],
          notes: newOffer.notes,
        };

        portalSyncService.syncOffer(newOffer).catch(() => {});
        portalSyncService.syncPipelineItem(pipelineItem).catch(() => {});

        set((state) => ({
          informativeOffers: [newOffer, ...state.informativeOffers],
          contractPipeline: [pipelineItem, ...state.contractPipeline],
        }));

        return newOffer;
      },

      acceptInformativeOffer: (offerId) => {
        const state = get();
        const offer = state.informativeOffers.find((o) => o.id === offerId);
        if (!offer) return null;

        const suffix = Math.floor(100000 + Math.random() * 900000);
        const startDate = new Date().toISOString().split('T')[0];
        const endDate = daysFromNowIso(365);

        const boundPolicy: Policy = {
          id: `pol-bound-${suffix}`,
          userId: state.user.uid,
          policyNumber: `HR-GEN-${suffix}`,
          type: offer.productType,
          carrier: offer.carrier,
          startDate,
          endDate,
          status: 'active',
          premiumAnnual: offer.annualPremium,
          paymentFrequency:
            offer.paymentDynamics === 'Godišnje'
              ? 'annual'
              : offer.paymentDynamics === 'Polugodišnje'
              ? 'semi-annual'
              : offer.paymentDynamics === 'Kvartalno'
              ? 'quarterly'
              : 'monthly',
          assetName: `${offer.productTitle} — ${offer.assetDescription}`,
          clientName: offer.clientName,
          clientOib: offer.clientOib,
          assignedAgentId: offer.assignedAgentId,
          provisionStatus: 'paid_provision',
          coverageDetails: {
            limitEur: offer.coverageLimitEur,
            deductibleEur: offer.deductibleEur,
            riders: offer.riders,
          },
          documents: [
            {
              title: `Polica osiguranja (HR-GEN-${suffix})`,
              type: 'policy_pdf',
              downloadUrl: `/documents/polica-${suffix}.pdf`,
              fileSizeBytes: 356000,
            },
            {
              title: `IPID Dokument o proizvodu osiguranja (${offer.carrier})`,
              type: 'ipid',
              downloadUrl: `/documents/ipid-${suffix}.pdf`,
              fileSizeBytes: 180000,
            },
            {
              title: `HUB 3A SEPA Nalog za plaćanje premije`,
              type: 'payment_slip',
              downloadUrl: `/documents/sepa-${suffix}.pdf`,
              fileSizeBytes: 96000,
            },
          ],
        };

        const updatedOffer: InformativeOffer = { ...offer, status: 'prihvacena' };
        firestoreService.createPolicy(boundPolicy).catch(() => {});
        portalSyncService.syncOffer(updatedOffer).catch(() => {});

        set((cur) => ({
          policies: [boundPolicy, ...cur.policies],
          informativeOffers: cur.informativeOffers.map((o) => (o.id === offerId ? updatedOffer : o)),
          contractPipeline: cur.contractPipeline.map((p) =>
            p.offerId === offerId
              ? {
                  ...p,
                  stage: 5,
                  updatedAt: startDate,
                  notes: `Klijent prihvatio ponudu! Izdan broj police ${boundPolicy.policyNumber}.`,
                }
              : p
          ),
        }));

        return boundPolicy;
      },

      removeInformativeOffer: (offerId) => {
        set((state) => ({
          informativeOffers: state.informativeOffers.filter((o) => o.id !== offerId),
          contractPipeline: state.contractPipeline.filter((p) => p.offerId !== offerId),
        }));
      },

      updateInformativeOffer: (offerId, updates) => {
        set((state) => ({
          informativeOffers: state.informativeOffers.map((o) => {
            if (o.id !== offerId) return o;
            const updated = { ...o, ...updates };
            portalSyncService.syncOffer(updated).catch(() => {});
            return updated;
          }),
        }));
      },

      contractPipeline: INITIAL_PIPELINE,

      addContractPipelineItem: (item) => {
        const suffix = Math.floor(1000 + Math.random() * 9000);
        const now = new Date().toISOString().split('T')[0];
        const newItem: ContractPipelineItem = {
          id: item.id || `pipe-${suffix}`,
          offerId: item.offerId,
          referenceCode: item.referenceCode || `UG-2026-${suffix}`,
          clientName: item.clientName || 'Novi klijent',
          clientOib: item.clientOib || '24918274015',
          clientEmail: item.clientEmail || 'klijent@email.hr',
          clientPhone: item.clientPhone || '+385 91 450 1458',
          productTitle: item.productTitle || 'Generali Osiguranje — Ponuda',
          carrier: item.carrier || 'Generali osiguranje d.d.',
          annualPremiumEur: item.annualPremiumEur ?? 420.00,
          stage: item.stage || 1,
          assignedAgentId: item.assignedAgentId || get().activeAgentId || 'diana',
          updatedAt: now,
          notes: item.notes || 'Ručno unesen ugovor u fazi obrade.',
        };
        portalSyncService.syncPipelineItem(newItem).catch(() => {});
        set((state) => ({
          contractPipeline: [newItem, ...state.contractPipeline],
        }));
        return newItem;
      },

      updateContractPipelineStage: (id, stage, notes) => {
        const now = new Date().toISOString().split('T')[0];
        set((state) => ({
          contractPipeline: state.contractPipeline.map((item) => {
            if (item.id !== id) return item;
            const updated: ContractPipelineItem = {
              ...item,
              stage,
              updatedAt: now,
              notes: notes !== undefined ? notes : item.notes,
            };
            portalSyncService.syncPipelineItem(updated).catch(() => {});
            return updated;
          }),
        }));
      },

      removeContractPipelineItem: (id) => {
        set((state) => ({
          contractPipeline: state.contractPipeline.filter((item) => item.id !== id),
        }));
      },

      gdprRequests: [],

      submitGdprRequest: (requestType, reason) => {
        const user = get().user;
        const now = new Date().toISOString();
        const record: GdprRequestRecord = {
          id: `gdpr-${Date.now().toString().slice(-6)}`,
          userId: user.uid,
          clientName: user.displayName,
          clientOib: user.oib || '24918274015',
          clientEmail: user.email,
          requestType,
          reason: reason || 'Zahtjev podnesen putem Korisničkog portala (GDPR Članak 17. / Članak 20.)',
          status: 'zaprimljeno',
          createdAt: now,
        };
        portalSyncService.syncGdprRequest(record).catch(() => {});
        set((state) => ({
          gdprRequests: [record, ...state.gdprRequests],
          user:
            requestType === 'account_deletion'
              ? { ...state.user, gdprDeletionRequestedAt: now }
              : state.user,
        }));
        return record;
      },
    }),
    {
      name: 'agencija-zivot-insurtech-store-v2',
      partialize: (state) => ({
        policies: state.policies,
        claims: state.claims,
        informativeOffers: state.informativeOffers,
        contractPipeline: state.contractPipeline,
        gdprRequests: state.gdprRequests,
        user: state.user,
        activeAgentId: state.activeAgentId,
      }),
    }
  )
);
