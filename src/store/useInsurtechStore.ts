import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  UserProfile,
  Advisor,
  Policy,
  Claim,
  ClaimTimelineEvent,
  InsuranceProductType,
  AutoQuoteParams,
  PropertyQuoteParams,
  OcrPrometnaResult,
  CalculatedQuoteEstimate,
} from '../types/insurance';

export interface InsurtechStoreState {
  // 1. User & Advisor state
  user: UserProfile;
  advisor: Advisor;
  setUser: (user: Partial<UserProfile>) => void;

  // 2. Active Quote Funnel state ("Maya Engine")
  activeProduct: InsuranceProductType;
  funnelStep: number;
  autoParams: AutoQuoteParams;
  propertyParams: PropertyQuoteParams;
  ocrPrometna: OcrPrometnaResult | null;
  quoteEstimate: CalculatedQuoteEstimate;
  setActiveProduct: (product: InsuranceProductType) => void;
  setFunnelStep: (step: number) => void;
  nextFunnelStep: () => void;
  prevFunnelStep: () => void;
  updateAutoParams: (params: Partial<AutoQuoteParams>) => void;
  updatePropertyParams: (params: Partial<PropertyQuoteParams>) => void;
  applyOcrResult: (result: OcrPrometnaResult) => void;
  recalculateActiveQuote: () => void;
  resetQuoteFunnel: () => void;

  // 3. Digital Policy Wallet
  policies: Policy[];
  acceptPolicyRenewal: (policyId: string) => void;
  addPolicy: (policy: Policy) => void;

  // 4. Claims & FNOL
  claims: Claim[];
  submitNewClaim: (claimInput: {
    policyId: string;
    incidentDate: string;
    location: string;
    category: string;
    description: string;
    mediaUrls: string[];
    iban: string;
    claimAmountRequested?: number;
  }) => Claim;
  appendClaimMessage: (claimId: string, note: string) => void;
}

// Dedicated Assigned Broker for Agencija Život
export const DEFAULT_ADVISOR: Advisor = {
  id: 'adv-goran-horvat',
  name: 'Goran Horvat',
  title: 'Ovlašteni broker osiguranja & Voditelj klijenata',
  phone: '+385 1 4800 120',
  email: 'goran.horvat@agencija-zivot.hr',
  whatsappNumber: '385984800120',
  avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
  licenseNumber: 'HANFA ZO-88912/2021',
  schedulingUrl: 'https://cal.com/agencija-zivot/konzultacije-15min',
};

// Initial User Profile
export const DEFAULT_USER: UserProfile = {
  uid: 'usr-zagreb-001',
  email: 'klijent.zagreb@gmail.com',
  displayName: 'Marko Horvatić',
  phone: '+385 91 555 4321',
  oib: '24918274019',
  assignedAdvisorId: 'adv-goran-horvat',
  createdAt: '2024-03-15T09:00:00Z',
};

// Initial Sample Policies
export const INITIAL_POLICIES: Policy[] = [
  {
    id: 'pol-toyota-rav4-2026',
    userId: 'usr-zagreb-001',
    policyNumber: 'HR-GEN-882914-AO',
    type: 'kasko',
    carrier: 'Generali osiguranje d.d.',
    startDate: '2025-10-15',
    endDate: '2026-10-15',
    status: 'active',
    premiumAnnual: 684.50,
    paymentFrequency: 'monthly',
    assetName: 'Toyota RAV4 2.5 Hybrid (ZG-4821-HP)',
    coverageDetails: {
      limitEur: 42000,
      deductibleEur: 150,
      riders: ['Puni Kasko', 'Asistencija na cesti 24/7 (Europa)', 'Lom stakla bez franšize', 'Zaštita bonusa 50%'],
    },
    documents: [
      {
        title: 'Polica obveznog i Kasko osiguranja (HR-GEN-882914)',
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
    policyNumber: 'HR-CO-410294-DOM',
    type: 'property',
    carrier: 'Croatia osiguranje d.d.',
    startDate: '2025-04-10',
    endDate: '2026-04-10',
    status: 'expiring_soon',
    premiumAnnual: 245.00,
    paymentFrequency: 'annual',
    assetName: 'Stan - Primarno prebivalište (Zagreb, Ilica 84 m²)',
    coverageDetails: {
      limitEur: 168000,
      deductibleEur: 0,
      riders: ['Požar i oluja', 'Potres na novu građevinsku vrijednost', 'Izljev vode iz instalacija', 'Odgovornost prema trećima 50.000 €'],
    },
    renewalOffer: {
      newPremiumAnnual: 228.00, // 7% loyalty discount
      validUntil: '2026-04-20',
      accepted: false,
      carrierDiscountPercentage: 7,
    },
    documents: [
      {
        title: 'Ugovor o osiguranju imovine i kućanstva',
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
    id: 'pol-kuca-krk',
    userId: 'usr-zagreb-001',
    policyNumber: 'HR-ALZ-993182-VIL',
    type: 'property',
    carrier: 'Allianz Hrvatska d.d.',
    startDate: '2025-05-01',
    endDate: '2026-05-01',
    status: 'renewal_pending',
    premiumAnnual: 340.00,
    paymentFrequency: 'annual',
    assetName: 'Kuća za odmor - Krk (Malinska, 110 m²)',
    coverageDetails: {
      limitEur: 220000,
      deductibleEur: 150,
      riders: ['Požar, oluja i tuča', 'Poplava i bujica', 'Provalna krađa i vandalizam'],
    },
    renewalOffer: {
      newPremiumAnnual: 319.60,
      validUntil: '2026-05-15',
      accepted: false,
      carrierDiscountPercentage: 6,
    },
    documents: [
      {
        title: 'Polica osiguranja objekta za odmor (HR-ALZ-993182)',
        type: 'policy_pdf',
        downloadUrl: '/documents/polica-kuca-krk.pdf',
        fileSizeBytes: 388000,
      },
    ],
  },
];

// Initial Sample Claim
export const INITIAL_CLAIMS: Claim[] = [
  {
    id: 'clm-2026-0841',
    claimNumber: 'ŠT-2026-0841',
    policyId: 'pol-toyota-rav4-2026',
    userId: 'usr-zagreb-001',
    incidentDate: '2026-02-18T14:30:00Z',
    location: 'Autocesta A1 (smjer Zagreb - Karlovac, km 24)',
    category: 'glass_breakage',
    description: 'Tijekom vožnje iza teretnog vozila odletio je kamenčić i prouzročio pukotinu na prednjem vjetrobranskom staklu dužine cca 15 cm. Potrebna je zamjena originalnog stakla s kalibracijom radarskih senzora.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80',
    ],
    status: 'assessor_assigned',
    claimAmountRequested: 650.00,
    claimAmountApproved: 650.00,
    iban: 'HR1224020061234567890',
    assessorName: 'Ivan Radić (Procjenitelj Generali d.d.)',
    assessorPhone: '+385 1 4800 134',
    createdAt: '2026-02-18T16:15:00Z',
    timeline: [
      {
        title: 'Digitalna prijava štete zaprimljena (FNOL)',
        description: 'Klijent je poslao foto-dokumentaciju oštećenja i popunio elektroničku prijavu štete.',
        timestamp: '2026-02-18T16:15:00Z',
        author: 'Sustav Agencija Život',
        statusTag: 'submitted',
      },
      {
        title: 'Likvidator zaprimio spis na verifikaciju pokrića',
        description: 'Potvrđeno aktivno Kasko pokriće i dopunski rizik loma stakla bez franšize i gubitka bonusa.',
        timestamp: '2026-02-19T08:45:00Z',
        author: 'Mirela Babić (Likvidator šteta)',
        statusTag: 'under_review',
      },
      {
        title: 'Dodijeljen mobilni procjenitelj i izdan nalog za staklo',
        description: 'Uputa za popravak proslijeđena u ovlašteni Toyota servis (Toyota Centar Zagreb). Termin zamjene stakla i kalibracije senzora zakazan.',
        timestamp: '2026-02-20T10:00:00Z',
        author: 'Ivan Radić (Procjenitelj)',
        statusTag: 'assessor_assigned',
      },
    ],
  },
];

// Helper Actuarial Function for Quote recalculation
export function calculateDynamicQuote(
  product: InsuranceProductType,
  auto: AutoQuoteParams,
  prop: PropertyQuoteParams
): CalculatedQuoteEstimate {
  if (product === 'auto' || product === 'kasko') {
    // Base AO from kW power
    const kw = auto.kwPower || 85;
    let baseAo = 135;
    if (kw > 65) baseAo = 165;
    if (kw > 84) baseAo = 195;
    if (kw > 110) baseAo = 245;
    if (kw > 130) baseAo = 310;

    // Bonus discount (0-50%)
    const bonus = auto.bonusPercentage ?? 50;
    const bonusDiscount = baseAo * (bonus / 100);
    let totalAo = baseAo - bonusDiscount;

    let kaskoAddon = 0;
    if (auto.includeKasko) {
      kaskoAddon = kw * 3.8 + 140;
      // Deductible discount
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
        ...(auto.includeKasko ? [{ title: `Puni Kasko paket (franšiza ${auto.deductibleTier || 0} €)`, amount: Math.round(kaskoAddon * 100) / 100 }] : []),
        ...(auto.includeAssistance ? [{ title: 'Asistencija na cesti 24/7 (Hrvatska i Europa)', amount: 29 }] : []),
        ...(auto.includeGlass ? [{ title: 'Lom stakala bez franšize i gubitka bonusa', amount: 38 }] : []),
        ...(auto.includeBonusProtection ? [{ title: 'Zaštita stečenog bonusa 50%', amount: 24 }] : []),
        ...(auto.includeHailStorm ? [{ title: 'Zaštita od tuče, oluje i elementarnih nepogoda', amount: 42 }] : []),
        ...(auto.includeTheft ? [{ title: 'Zaštita od krađe i provale', amount: 55 }] : []),
      ],
    };
  }

  // Property calculation
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
      ...(prop.includeEarthquake ? [{ title: 'Potres na novu građevinsku vrijednost', amount: Math.round(m2 * 0.95 * 100) / 100 }] : []),
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

export const useInsurtechStore = create<InsurtechStoreState>()(
  persist(
    (set, get) => ({
      user: DEFAULT_USER,
      advisor: DEFAULT_ADVISOR,
      setUser: (userUpdate) => set((state) => ({ user: { ...state.user, ...userUpdate } })),

      activeProduct: 'auto',
      funnelStep: 1,
      autoParams: DEFAULT_AUTO_PARAMS,
      propertyParams: DEFAULT_PROPERTY_PARAMS,
      ocrPrometna: null,
      quoteEstimate: calculateDynamicQuote('auto', DEFAULT_AUTO_PARAMS, DEFAULT_PROPERTY_PARAMS),

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

      policies: INITIAL_POLICIES,

      acceptPolicyRenewal: (policyId: string) => {
        set((state) => ({
          policies: state.policies.map((p) => {
            if (p.id === policyId && p.renewalOffer) {
              const currentEnd = new Date(p.endDate);
              const nextEnd = new Date(currentEnd);
              nextEnd.setFullYear(nextEnd.getFullYear() + 1);

              return {
                ...p,
                status: 'active' as const,
                premiumAnnual: p.renewalOffer.newPremiumAnnual,
                startDate: p.endDate,
                endDate: nextEnd.toISOString().split('T')[0],
                renewalOffer: {
                  ...p.renewalOffer,
                  accepted: true,
                },
              };
            }
            return p;
          }),
        }));
      },

      addPolicy: (newPolicy: Policy) => {
        set((state) => ({
          policies: [newPolicy, ...state.policies],
        }));
      },

      claims: INITIAL_CLAIMS,

      submitNewClaim: (claimInput) => {
        const claimId = `clm-${Date.now().toString().slice(-6)}`;
        const claimNumber = `ŠT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const now = new Date().toISOString();

        const initialEvent: ClaimTimelineEvent = {
          title: 'Digitalna prijava štete zaprimljena (FNOL)',
          description: 'Elektronička prijava štete uspješno zaprimljena. Generiran službeni broj spisa.',
          timestamp: now,
          author: 'Sustav Agencija Život',
          statusTag: 'submitted',
        };

        const newClaim: Claim = {
          id: claimId,
          claimNumber,
          policyId: claimInput.policyId,
          userId: get().user.uid,
          incidentDate: claimInput.incidentDate,
          location: claimInput.location,
          category: claimInput.category,
          description: claimInput.description,
          mediaUrls: claimInput.mediaUrls,
          iban: claimInput.iban,
          status: 'submitted',
          claimAmountRequested: claimInput.claimAmountRequested,
          timeline: [initialEvent],
          createdAt: now,
        };

        set((state) => ({
          claims: [newClaim, ...state.claims],
        }));

        return newClaim;
      },

      appendClaimMessage: (claimId: string, note: string) => {
        const newEvent: ClaimTimelineEvent = {
          title: 'Poruka osiguranika dodana u spis',
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
    }),
    {
      name: 'agencija-zivot-insurtech-store',
      partialize: (state) => ({
        policies: state.policies,
        claims: state.claims,
        user: state.user,
      }),
    }
  )
);
