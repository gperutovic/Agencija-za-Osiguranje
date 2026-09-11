import { create } from 'zustand';
import { 
  QuoteFormData, 
  CarrierQuote, 
  Policy, 
  CoiCertificate, 
  ClaimFnol, 
  CommercialAccount,
  EndorsementRequest 
} from '../types/valiant';
import { getNaicsByCode } from './naicsData';

// Realistic Institutional Commercial Account
export const INITIAL_ACCOUNT: CommercialAccount = {
  id: 'acc-vanguard-01',
  company_name: 'Vanguard Logistics & Cold-Chain Solutions LLC',
  dba: 'Vanguard Cold-Chain',
  tax_id_ein: '36-9812450',
  naics_code: '493120',
  industry_category: 'Refrigerated Warehousing, Cold-Chain & Temperature-Controlled Logistics',
  headquarters_address: '1400 S. Desplaines St., Chicago, IL 60607',
  annual_revenue: 28500000,
  full_time_employees: 142,
  annual_payroll: 9800000,
  created_at: '2025-01-10T08:30:00Z',
};

// Institutional Policies In-Force (Croatian & European Admitted Paper)
export const INITIAL_POLICIES: Policy[] = [
  {
    id: 'pol-ao-01',
    account_id: 'acc-vanguard-01',
    policy_number: 'HR-AO-2026-88192',
    carrier_name: 'Croatia Osiguranje d.d.',
    naic_number: 'HR-CO-1884',
    iso_form_code: 'AO-KASKO-2026',
    line_of_business: 'Auto Odgovornost (AO) & Puni Kasko',
    aggregate_limit: 6450000,
    occurrence_limit: 6450000,
    deductible: 150,
    effective_date: '2026-01-01',
    expiration_date: '2027-01-01',
    status: 'active',
    annual_premium: 480,
    insured_name: 'Ana Horvat (Vanguard Adria d.o.o.)',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pol-dom-02',
    account_id: 'acc-vanguard-01',
    policy_number: 'HR-DOM-2025-4421',
    carrier_name: 'Generali Osiguranje d.d.',
    naic_number: 'HR-GEN-01',
    iso_form_code: 'DOM-POTRES-2025',
    line_of_business: 'Osiguranje Doma & Stvari od Potresa',
    aggregate_limit: 250000,
    occurrence_limit: 250000,
    deductible: 0,
    effective_date: '2025-10-15',
    expiration_date: '2026-10-15',
    status: 'pending_renewal',
    annual_premium: 236,
    insured_name: 'Ana Horvat (Vlaška 42, Zagreb)',
    created_at: '2025-10-15T00:00:00Z',
  },
  {
    id: 'pol-cgl-01',
    account_id: 'acc-vanguard-01',
    policy_number: 'VGR-CGL-2026-8801',
    carrier_name: 'Allianz Hrvatska d.d. / Chubb',
    naic_number: '22667',
    iso_form_code: 'CG 00 01 04 13',
    line_of_business: 'Commercial General Liability & Odgovornost',
    aggregate_limit: 2000000,
    occurrence_limit: 1000000,
    deductible: 5000,
    effective_date: '2026-01-01',
    expiration_date: '2027-01-01',
    status: 'active',
    annual_premium: 18650,
    insured_name: 'Vanguard Adria & Cold-Chain Logistics d.o.o.',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pol-cpp-02',
    account_id: 'acc-vanguard-01',
    policy_number: 'VGR-CPP-2025-4421',
    carrier_name: 'Wiener Städtische VIG',
    naic_number: 'HR-WIG-02',
    iso_form_code: 'CP 00 10 10 12',
    line_of_business: 'Commercial Property & Skladišni Rizici',
    aggregate_limit: 12000000,
    occurrence_limit: 12000000,
    deductible: 25000,
    effective_date: '2025-10-15',
    expiration_date: '2026-10-15',
    status: 'pending_renewal',
    annual_premium: 44200,
    insured_name: 'Vanguard Adria d.o.o.',
    created_at: '2025-10-15T00:00:00Z',
  },
  {
    id: 'pol-cyb-03',
    account_id: 'acc-vanguard-01',
    policy_number: 'VGR-CYB-2026-9412',
    carrier_name: "Lloyd's of London Specialty Syndicate 2003",
    naic_number: 'AA-1120000',
    iso_form_code: 'PR-CY-2026',
    line_of_business: 'Technology E&O & Cyber Risk',
    aggregate_limit: 5000000,
    occurrence_limit: 5000000,
    deductible: 25000,
    effective_date: '2026-03-01',
    expiration_date: '2027-03-01',
    status: 'active',
    annual_premium: 26800,
    insured_name: 'Vanguard Adria d.o.o.',
    created_at: '2026-03-01T00:00:00Z',
  },
];

// Institutional Issued ACORD 25 Certificates
export const INITIAL_COIS: CoiCertificate[] = [
  {
    id: 'coi-78901',
    policy_id: 'pol-cgl-01',
    holder_name: 'Prologis Logistics Hub Midwest LLC',
    holder_address: '180 N. LaSalle Street, Suite 3200, Chicago, IL 60601',
    additional_insured: true,
    waiver_subrogation: true,
    primary_noncontributory: true,
    special_conditions: 'Certificate Holder is included as Additional Insured on a primary and non-contributory basis with respects to commercial warehousing operations per attached CG 20 10 04 13 endorsement.',
    issued_at: '2026-02-10T14:30:00Z',
    verification_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    policy_number: 'VGR-CGL-2026-8801',
    carrier_name: 'Chubb Federal Insurance Company',
    naic_number: '22667',
    insured_name: 'Vanguard Logistics & Cold-Chain Solutions LLC',
  },
  {
    id: 'coi-78902',
    policy_id: 'pol-cpp-02',
    holder_name: 'JPMorgan Chase Bank, N.A. (Commercial Lending)',
    holder_address: '270 Park Avenue, 14th Floor, New York, NY 10017',
    additional_insured: false,
    waiver_subrogation: true,
    primary_noncontributory: false,
    special_conditions: 'Lender Loss Payee and Mortgagee clause CP 12 18 attached in favor of Certificate Holder regarding industrial real property at 1400 S. Desplaines St.',
    issued_at: '2026-03-04T11:15:00Z',
    verification_hash: '3e41b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    policy_number: 'VGR-CPP-2025-4421',
    carrier_name: 'Travelers Property Casualty Co. of America',
    naic_number: '25674',
    insured_name: 'Vanguard Logistics & Cold-Chain Solutions LLC',
  },
];

// Commercial First Notice of Loss Claims
export const INITIAL_CLAIMS: ClaimFnol[] = [
  {
    id: 'clm-2026-4401',
    policy_id: 'pol-cgl-01',
    policy_number: 'VGR-CGL-2026-8801',
    incident_date: '2026-02-14T09:15:00Z',
    reported_date: '2026-02-14T11:30:00Z',
    incident_type: 'Commercial Property Damage',
    description: 'Third-party refrigerated carrier forklift struck distribution bay door #4 header during pallet staging, causing track distortion and structural sensor misalignment.',
    location: '1400 S. Desplaines St., Chicago, IL (Loading Bay 4)',
    injuries_reported: false,
    police_report_filed: false,
    estimated_loss: 14500,
    reserve_amount: 15000,
    status: 'adjuster_assigned',
    assigned_adjuster: 'David Sterling, CPCU, Senior Commercial Adjuster',
    adjuster_email: 'd.sterling@valiantglobalrisk.com',
    adjuster_phone: '+1 (800) 492-8812 ext. 402',
    document_urls: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d'],
  },
];

// In-Force Endorsement Amendments
export const INITIAL_ENDORSEMENTS: EndorsementRequest[] = [
  {
    id: 'end-2026-101',
    policyId: 'pol-cgl-01',
    requestType: 'add_location',
    details: 'Add secondary cross-dock facility: 3200 Logistics Center Drive, Joliet, IL 60436. Warehouse footprint: 45,000 sq ft, 100% wet sprinkler system.',
    effectiveDate: '2026-04-01',
    status: 'pending_review',
    requestedAt: '2026-03-08T16:00:00Z',
  },
];

const INITIAL_QUOTE_FORM: QuoteFormData = {
  companyName: 'Vanguard Logistics & Cold-Chain Solutions LLC',
  jurisdiction: 'Illinois, USA',
  taxIdEin: '36-9812450',
  naicsCode: '493120',
  industryTitle: 'Refrigerated Warehousing & Storage Facilities',
  contactName: 'Robert Vance, VP of Finance & Risk',
  contactEmail: 'r.vance@vanguardlogistics.com',
  contactPhone: '+1 (312) 555-0188',
  annualRevenue: 28500000,
  grossPayroll: 9800000,
  fullTimeEmployees: 142,
  premisesSquareFootage: 120000,
  fleetVehicleCount: 18,
  hasSprinklers: true,
  hasInternationalExposure: false,
  priorLosses3Years: 1,
  priorLossDetails: 'Single dock equipment collision claim resolved below deductible',
  lineOfBusiness: 'Commercial General Liability',
  aggregateLimit: 2000000,
  occurrenceLimit: 1000000,
  deductible: 5000,
  includeCyberEndorsement: true,
  includeHiredAuto: true,
  includeEpliRider: true,
  selectedCarrierId: 'chubb-cgl-admitted',
};

interface ValiantState {
  currentQuoteStage: number;
  quoteFormData: QuoteFormData;
  carrierQuotes: CarrierQuote[];
  isCalculatingQuotes: boolean;

  account: CommercialAccount;
  policies: Policy[];
  cois: CoiCertificate[];
  claims: ClaimFnol[];
  endorsements: EndorsementRequest[];

  setQuoteStage: (stage: number) => void;
  updateQuoteFormData: (data: Partial<QuoteFormData>) => void;
  generateCarrierQuotes: () => void;
  selectCarrier: (carrierId: string) => void;
  bindPolicyAndExecute: (signatureName: string, signatureDataUrl: string) => Policy;
  issueCoi: (holderName: string, holderAddress: string, additionalInsured: boolean, waiverSubrogation: boolean, specialConditions?: string, policyId?: string) => CoiCertificate;
  submitClaimFnol: (claim: Omit<ClaimFnol, 'id' | 'reported_date' | 'status' | 'assigned_adjuster' | 'adjuster_email' | 'adjuster_phone'>) => ClaimFnol;
  submitEndorsement: (req: Omit<EndorsementRequest, 'id' | 'requestedAt' | 'status'>) => EndorsementRequest;
}

export const useValiantStore = create<ValiantState>((set, get) => ({
  currentQuoteStage: 1,
  quoteFormData: INITIAL_QUOTE_FORM,
  carrierQuotes: [],
  isCalculatingQuotes: false,

  account: INITIAL_ACCOUNT,
  policies: INITIAL_POLICIES,
  cois: INITIAL_COIS,
  claims: INITIAL_CLAIMS,
  endorsements: INITIAL_ENDORSEMENTS,

  setQuoteStage: (stage: number) => set({ currentQuoteStage: stage }),

  updateQuoteFormData: (data: Partial<QuoteFormData>) =>
    set((state) => ({
      quoteFormData: { ...state.quoteFormData, ...data },
    })),

  generateCarrierQuotes: () => {
    set({ isCalculatingQuotes: true });

    setTimeout(() => {
      const { quoteFormData } = get();
      const naics = getNaicsByCode(quoteFormData.naicsCode);
      const hazardMultiplier = naics ? naics.baseRateMultiplier : 1.25;

      const revenueBase = quoteFormData.annualRevenue / 1000000;
      const basePremium = Math.max(12000, revenueBase * 680 * hazardMultiplier);

      const quotes: CarrierQuote[] = [
        {
          carrierId: 'chubb-cgl-admitted',
          carrierName: 'Chubb Federal Insurance Company',
          naicNumber: '22667',
          syndicateName: 'Chubb Global Risk (Admitted Paper)',
          amBestRating: 'A++ (Superior) FSC XV',
          spRating: 'AA Standard & Poor’s',
          annualPremium: Math.round(basePremium * 1.05),
          monthlyPremium: Math.round((basePremium * 1.05) / 12),
          deductible: quoteFormData.deductible,
          aggregateLimit: quoteFormData.aggregateLimit,
          occurrenceLimit: quoteFormData.occurrenceLimit,
          keyFeatures: [
            'ISO CG 00 01 04 13 Unamended Form',
            'Primary and Non-Contributory Endorsement included',
            'Automatic Additional Insured for Managers of Leased Premises (CG 20 11)',
            'Broad Form Named Insured coverage territory',
          ],
          keyExclusions: [
            'Expected or Intended Injury',
            'Contractual Liability beyond insured contracts',
            'Pollution per CG 21 49 exclusion endorsement',
          ],
          underwritingConfidenceScore: 98,
          quoteId: `QTE-CHUBB-${Math.floor(100000 + Math.random() * 900000)}`,
          admittedPaper: true,
        },
        {
          carrierId: 'travelers-commercial',
          carrierName: 'Travelers Property Casualty Co.',
          naicNumber: '25674',
          syndicateName: 'Travelers Commercial Underwriting Group',
          amBestRating: 'A++ (Superior) FSC XV',
          spRating: 'AA Standard & Poor’s',
          annualPremium: Math.round(basePremium * 0.94),
          monthlyPremium: Math.round((basePremium * 0.94) / 12),
          deductible: quoteFormData.deductible,
          aggregateLimit: quoteFormData.aggregateLimit,
          occurrenceLimit: quoteFormData.occurrenceLimit,
          keyFeatures: [
            'Travelers Premier Commercial General Liability Form',
            'Waiver of Transfer of Rights of Recovery (CG 24 04)',
            'Medical Payments limit increased to $10,000 per person',
            'Worldwide Products & Completed Operations liability',
          ],
          keyExclusions: [
            'Damage to Impaired Property or Property Not Physically Injured',
            'War and Military Action Exclusion',
          ],
          underwritingConfidenceScore: 95,
          quoteId: `QTE-TRV-${Math.floor(100000 + Math.random() * 900000)}`,
          admittedPaper: true,
        },
        {
          carrierId: 'lloyds-syndicate-2003',
          carrierName: "Lloyd's of London Specialty Syndicate 2003",
          naicNumber: 'AA-1120000',
          syndicateName: "Lloyd's Coverholder Slip (Non-Admitted / Surplus Lines)",
          amBestRating: 'A (Excellent) FSC XV',
          spRating: 'AA- Standard & Poor’s',
          annualPremium: Math.round(basePremium * 1.14),
          monthlyPremium: Math.round((basePremium * 1.14) / 12),
          deductible: quoteFormData.deductible * 1.5,
          aggregateLimit: quoteFormData.aggregateLimit,
          occurrenceLimit: quoteFormData.occurrenceLimit,
          keyFeatures: [
            'Specialty Surplus Lines manuscript wording',
            'Enhanced Cyber Extortion & Systems Restoration sublimit',
            'Contingent Business Interruption coverage included',
            'Dedicated London Market Claims Syndicate lead',
          ],
          keyExclusions: [
            'Asbestos and silica claims exclusion',
            'Cross-suits exclusion between named insured entities',
          ],
          underwritingConfidenceScore: 92,
          quoteId: `QTE-LLOYDS-${Math.floor(100000 + Math.random() * 900000)}`,
          admittedPaper: false,
        },
      ];

      set({
        carrierQuotes: quotes,
        isCalculatingQuotes: false,
        currentQuoteStage: 4,
      });
    }, 700);
  },

  selectCarrier: (carrierId: string) => {
    set((state) => ({
      quoteFormData: { ...state.quoteFormData, selectedCarrierId: carrierId },
    }));
  },

  bindPolicyAndExecute: (signatureName: string, signatureDataUrl: string) => {
    const { quoteFormData, carrierQuotes } = get();
    const selectedQuote = carrierQuotes.find(
      (q) => q.carrierId === quoteFormData.selectedCarrierId
    ) || carrierQuotes[0];

    const now = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(now.getFullYear() + 1);

    const newPolicyNumber = `VGR-${quoteFormData.lineOfBusiness.includes('Cyber') ? 'CYB' : quoteFormData.lineOfBusiness.includes('Property') ? 'CPP' : 'CGL'}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPolicy: Policy = {
      id: `pol-${Date.now()}`,
      account_id: 'acc-vanguard-01',
      policy_number: newPolicyNumber,
      carrier_name: selectedQuote ? selectedQuote.carrierName : 'Chubb Federal Insurance Company',
      naic_number: selectedQuote?.naicNumber || '22667',
      iso_form_code: 'CG 00 01 04 13',
      line_of_business: quoteFormData.lineOfBusiness,
      aggregate_limit: quoteFormData.aggregateLimit,
      occurrence_limit: quoteFormData.occurrenceLimit,
      deductible: quoteFormData.deductible,
      effective_date: now.toISOString().split('T')[0],
      expiration_date: nextYear.toISOString().split('T')[0],
      status: 'active',
      annual_premium: selectedQuote ? selectedQuote.annualPremium : 18650,
      created_at: now.toISOString(),
    };

    set((state) => ({
      policies: [newPolicy, ...state.policies],
      quoteFormData: {
        ...state.quoteFormData,
        signatureName,
        signatureDataUrl,
        binderNumber: `BND-VGR-${Math.floor(100000 + Math.random() * 900000)}`,
      },
    }));

    // Async sync to Cloud Firestore
    import('firebase/firestore').then(({ doc, setDoc }) => {
      import('../api/firebase').then(({ db }) => {
        setDoc(doc(db, 'policies', newPolicy.id), newPolicy).catch(() => {});
      });
    }).catch(() => {});

    return newPolicy;
  },

  issueCoi: (holderName, holderAddress, additionalInsured, waiverSubrogation, specialConditions, policyId) => {
    const { policies, cois, account } = get();
    const targetPolicy = policyId ? policies.find((p) => p.id === policyId) || policies[0] : policies[0];

    // SHA-256 simulation stamp
    let hash = '';
    for (let i = 0; i < 64; i++) {
      hash += '0123456789abcdef'[(Math.floor(Math.random() * 16))];
    }

    const newCoi: CoiCertificate = {
      id: `coi-${Math.floor(10000 + Math.random() * 90000)}`,
      policy_id: targetPolicy.id,
      holder_name: holderName,
      holder_address: holderAddress,
      additional_insured: additionalInsured,
      waiver_subrogation: waiverSubrogation,
      primary_noncontributory: true,
      special_conditions: specialConditions || 'Certificate Holder is granted Additional Insured status subject to the terms, exclusions, and limits of the referenced commercial general liability policy.',
      issued_at: new Date().toISOString(),
      verification_hash: hash,
      policy_number: targetPolicy.policy_number,
      carrier_name: targetPolicy.carrier_name,
      naic_number: targetPolicy.naic_number || '22667',
      insured_name: account.company_name,
    };

    set({ cois: [newCoi, ...cois] });

    // Async sync to Cloud Firestore digital_cards collection
    import('firebase/firestore').then(({ doc, setDoc }) => {
      import('../api/firebase').then(({ db }) => {
        setDoc(doc(db, 'digital_cards', newCoi.id), newCoi).catch(() => {});
      });
    }).catch(() => {});

    return newCoi;
  },

  submitClaimFnol: (claimData) => {
    const { claims } = get();
    const claimNum = `CLM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newClaim: ClaimFnol = {
      ...claimData,
      id: claimNum.toLowerCase(),
      reported_date: new Date().toISOString(),
      status: 'triaged',
      assigned_adjuster: 'David Sterling, CPCU, Senior Commercial Adjuster',
      adjuster_email: 'd.sterling@valiantglobalrisk.com',
      adjuster_phone: '+1 (800) 492-8812 ext. 402',
      reserve_amount: claimData.estimated_loss ? Math.round(claimData.estimated_loss * 1.1) : 10000,
    };

    set({ claims: [newClaim, ...claims] });

    // Async sync to Cloud Firestore claims collection
    import('firebase/firestore').then(({ doc, setDoc }) => {
      import('../api/firebase').then(({ db }) => {
        setDoc(doc(db, 'claims', newClaim.id), newClaim).catch(() => {});
      });
    }).catch(() => {});

    return newClaim;
  },

  submitEndorsement: (req) => {
    const { endorsements } = get();
    const newReq: EndorsementRequest = {
      ...req,
      id: `end-2026-${Math.floor(100 + Math.random() * 900)}`,
      requestedAt: new Date().toISOString(),
      status: 'pending_review',
    };

    set({ endorsements: [newReq, ...endorsements] });

    // Async sync to Cloud Firestore endorsements
    import('firebase/firestore').then(({ doc, setDoc }) => {
      import('../api/firebase').then(({ db }) => {
        setDoc(doc(db, 'endorsements', newReq.id), newReq).catch(() => {});
      });
    }).catch(() => {});

    return newReq;
  },
}));
