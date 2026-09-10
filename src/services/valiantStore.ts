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

// Initial default account
export const INITIAL_ACCOUNT: CommercialAccount = {
  id: 'acc-nexus-01',
  company_name: 'Nexus Quantum Dynamics Inc.',
  tax_id_ein: '12-3456789',
  naics_code: '541512',
  industry_category: 'Computer Systems Design Services & SaaS Platforms',
  annual_revenue: 18500000,
  full_time_employees: 84,
  created_at: '2025-01-15T09:00:00Z',
};

// Initial default policies
export const INITIAL_POLICIES: Policy[] = [
  {
    id: 'pol-01',
    account_id: 'acc-nexus-01',
    policy_number: 'VGR-GL-2026-8801',
    carrier_name: 'Chubb Global Risk Syndicate 1882',
    line_of_business: 'General Liability',
    aggregate_limit: 2000000,
    occurrence_limit: 1000000,
    deductible: 5000,
    effective_date: '2026-01-01',
    expiration_date: '2027-01-01',
    status: 'active',
    annual_premium: 14850,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'pol-02',
    account_id: 'acc-nexus-01',
    policy_number: 'VGR-CY-2026-9412',
    carrier_name: "Lloyd's of London Specialty Syndicate 2003",
    line_of_business: 'Cyber Extortion & Tech E&O',
    aggregate_limit: 5000000,
    occurrence_limit: 5000000,
    deductible: 25000,
    effective_date: '2026-03-01',
    expiration_date: '2027-03-01',
    status: 'active',
    annual_premium: 28400,
    created_at: '2026-03-01T00:00:00Z',
  },
  {
    id: 'pol-03',
    account_id: 'acc-nexus-01',
    policy_number: 'VGR-CP-2025-4421',
    carrier_name: 'AIG Commercial Risk Solutions',
    line_of_business: 'Commercial Property',
    aggregate_limit: 10000000,
    occurrence_limit: 10000000,
    deductible: 10000,
    effective_date: '2025-10-15',
    expiration_date: '2026-10-15',
    status: 'pending_renewal',
    annual_premium: 46200,
    created_at: '2025-10-15T00:00:00Z',
  },
];

// Initial issued COIs
export const INITIAL_COIS: CoiCertificate[] = [
  {
    id: 'coi-01',
    policy_id: 'pol-01',
    holder_name: 'Metropolitan Enterprise Hub LLC',
    holder_address: '100 Wall Street, Suite 2400, New York, NY 10005',
    additional_insured: true,
    waiver_subrogation: true,
    special_conditions: 'Certificate Holder is included as Additional Insured with respects to primary commercial operations.',
    issued_at: '2026-02-10T14:30:00Z',
    verification_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    policy_number: 'VGR-GL-2026-8801',
    carrier_name: 'Chubb Global Risk Syndicate 1882',
    insured_name: 'Nexus Quantum Dynamics Inc.',
  },
  {
    id: 'coi-02',
    policy_id: 'pol-02',
    holder_name: 'Apex Global Financial Network',
    holder_address: '200 Bishopsgate, London EC2M 4NR, United Kingdom',
    additional_insured: false,
    waiver_subrogation: true,
    special_conditions: 'Tech E&O and Cyber security verification schedule attached.',
    issued_at: '2026-03-04T11:15:00Z',
    verification_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    policy_number: 'VGR-CY-2026-9412',
    carrier_name: "Lloyd's of London Specialty Syndicate 2003",
    insured_name: 'Nexus Quantum Dynamics Inc.',
  },
];

// Initial FNOL claims
export const INITIAL_CLAIMS: ClaimFnol[] = [
  {
    id: 'clm-01',
    policy_id: 'pol-01',
    policy_number: 'VGR-GL-2026-8801',
    incident_date: '2026-02-14T10:30:00Z',
    reported_date: '2026-02-14T14:15:00Z',
    incident_type: 'Third-Party Liability',
    description: 'Subcontractor equipment fell and damaged warehouse dock floor during server rack staging.',
    injuries_reported: false,
    police_report_filed: false,
    estimated_loss: 8500,
    status: 'adjuster_assigned',
    assigned_adjuster: 'Marcus Vance',
    adjuster_email: 'm.vance@valiantglobalrisk.com',
    adjuster_phone: '+1 (800) 492-8812 ext. 402',
    document_urls: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a'],
  },
];

export const INITIAL_ENDORSEMENTS: EndorsementRequest[] = [
  {
    id: 'end-01',
    policyId: 'pol-01',
    requestType: 'add_location',
    details: 'Add secondary disaster recovery site: 450 Technology Parkway, Atlanta, GA 30092',
    effectiveDate: '2026-04-01',
    status: 'pending_review',
    requestedAt: '2026-03-08T16:00:00Z',
  },
];

const INITIAL_QUOTE_FORM: QuoteFormData = {
  companyName: 'Nexus Quantum Dynamics Inc.',
  jurisdiction: 'Delaware, USA',
  taxIdEin: '12-3456789',
  naicsCode: '541512',
  industryTitle: 'Computer Systems Design Services & SaaS Platforms',
  contactName: 'Elena Rostova',
  contactEmail: 'e.rostova@nexusquantum.io',
  contactPhone: '+1 (212) 555-0198',
  annualRevenue: 18500000,
  grossPayroll: 7200000,
  fullTimeEmployees: 84,
  premisesSquareFootage: 24000,
  hasInternationalExposure: true,
  internationalCountries: 'UK, Germany, Singapore',
  priorLosses3Years: 0,
  lineOfBusiness: 'General Liability',
  aggregateLimit: 2000000,
  occurrenceLimit: 1000000,
  deductible: 5000,
  includeCyberEndorsement: true,
  includeHiredAuto: false,
  includeEpliRider: true,
  selectedCarrierId: 'chubb-syndicate-1882',
};

interface ValiantState {
  // Navigation / Funnel State
  currentQuoteStage: number;
  quoteFormData: QuoteFormData;
  carrierQuotes: CarrierQuote[];
  isCalculatingQuotes: boolean;

  // Persistence State
  account: CommercialAccount;
  policies: Policy[];
  cois: CoiCertificate[];
  claims: ClaimFnol[];
  endorsements: EndorsementRequest[];

  // Actions
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

  setQuoteStage: (stage) => set({ currentQuoteStage: stage }),

  updateQuoteFormData: (data) =>
    set((state) => ({
      quoteFormData: { ...state.quoteFormData, ...data },
    })),

  generateCarrierQuotes: () => {
    set({ isCalculatingQuotes: true });
    const { quoteFormData } = get();

    // Actuarial Rating Logic
    const naics = getNaicsByCode(quoteFormData.naicsCode);
    const hazardMultiplier = naics ? naics.baseRateMultiplier : 1.2;
    const revenueFactor = Math.log10(Math.max(quoteFormData.annualRevenue, 1000000)) * 0.45;
    const employeeFactor = 1 + (quoteFormData.fullTimeEmployees / 100) * 0.15;

    // Limit multiplier
    let limitMultiplier = 1.0;
    if (quoteFormData.aggregateLimit === 2000000) limitMultiplier = 1.22;
    else if (quoteFormData.aggregateLimit === 5000000) limitMultiplier = 1.78;
    else if (quoteFormData.aggregateLimit === 10000000) limitMultiplier = 2.55;

    // Deductible discount
    let deductibleDiscount = 1.0;
    if (quoteFormData.deductible === 1000) deductibleDiscount = 1.12;
    else if (quoteFormData.deductible === 5000) deductibleDiscount = 0.93;
    else if (quoteFormData.deductible === 10000) deductibleDiscount = 0.82;
    else if (quoteFormData.deductible === 25000) deductibleDiscount = 0.70;

    // Riders cost
    let ridersTotal = 0;
    if (quoteFormData.includeCyberEndorsement) ridersTotal += 2400;
    if (quoteFormData.includeHiredAuto) ridersTotal += 850;
    if (quoteFormData.includeEpliRider) ridersTotal += 3100;

    const baseChubb = Math.round((7800 * hazardMultiplier * revenueFactor * employeeFactor * limitMultiplier * deductibleDiscount) + ridersTotal);
    const baseAig = Math.round((7400 * hazardMultiplier * revenueFactor * employeeFactor * limitMultiplier * (deductibleDiscount * 0.98)) + (ridersTotal * 0.95));
    const baseLloyds = Math.round((8200 * hazardMultiplier * revenueFactor * employeeFactor * limitMultiplier * (deductibleDiscount * 0.94)) + (ridersTotal * 1.05));

    const quotes: CarrierQuote[] = [
      {
        carrierId: 'chubb-syndicate-1882',
        carrierName: 'Chubb Global Risk Syndicate',
        syndicateName: 'Chubb European Group SE / Syndicate 1882',
        amBestRating: 'A++ (Superior)',
        spRating: 'AA (Very Strong)',
        annualPremium: baseChubb,
        monthlyPremium: Math.round(baseChubb / 12),
        deductible: quoteFormData.deductible,
        aggregateLimit: quoteFormData.aggregateLimit,
        occurrenceLimit: quoteFormData.occurrenceLimit,
        underwritingConfidenceScore: 98,
        quoteId: `QTE-CHUBB-${Math.floor(100000 + Math.random() * 900000)}`,
        keyFeatures: [
          'Automatic Worldwide Territory for Claims Brought in USA/UK/EU',
          'Blanket Additional Insured & Primary/Non-Contributory Endorsement',
          'Full Cyber Extortion & Ransomware Negotiation Coverage Included',
          'Zero deductible on defense costs (First-Dollar Defense)',
        ],
        keyExclusions: [
          'War & Military Action Exclusion',
          'Sanction Limitation & Exclusion Clause LMA3100',
        ],
      },
      {
        carrierId: 'aig-commercial-solutions',
        carrierName: 'AIG Commercial Risk Solutions',
        syndicateName: 'American International Group Underwriters',
        amBestRating: 'A (Excellent)',
        spRating: 'A+ (Strong)',
        annualPremium: baseAig,
        monthlyPremium: Math.round(baseAig / 12),
        deductible: quoteFormData.deductible,
        aggregateLimit: quoteFormData.aggregateLimit,
        occurrenceLimit: quoteFormData.occurrenceLimit,
        underwritingConfidenceScore: 94,
        quoteId: `QTE-AIG-${Math.floor(100000 + Math.random() * 900000)}`,
        keyFeatures: [
          'High Aggregate Sub-limits for Reputational Crisis Management',
          'Automatic 60-Day Extended Reporting Period on E&O Claims',
          'Expedited 24-Hour Forensic Response Retainer',
        ],
        keyExclusions: [
          'Bodily Injury Arising from Asbestos or Lead Contamination',
          'Unsolicited Telecommunications Violation Exclusion',
        ],
      },
      {
        carrierId: 'lloyds-syndicate-2003',
        carrierName: "Lloyd's Specialty Syndicate",
        syndicateName: "Lloyd's of London Underwriting Syndicate 2003",
        amBestRating: 'A+ (Superior)',
        spRating: 'AA- (Very Strong)',
        annualPremium: baseLloyds,
        monthlyPremium: Math.round(baseLloyds / 12),
        deductible: quoteFormData.deductible,
        aggregateLimit: quoteFormData.aggregateLimit,
        occurrenceLimit: quoteFormData.occurrenceLimit,
        underwritingConfidenceScore: 96,
        quoteId: `QTE-LLOYDS-${Math.floor(100000 + Math.random() * 900000)}`,
        keyFeatures: [
          'London Market Specialty Syndicate Bespoke Manuscript Wording',
          'High Excess Capacity Layering up to $50,000,000',
          'Comprehensive Intellectual Property & Patent Infringement Rider',
        ],
        keyExclusions: [
          'Prior Known Acts or Circumstances prior to retroactive date',
          'Nuclear Contamination Exclusion Clause',
        ],
      },
    ];

    setTimeout(() => {
      set({
        carrierQuotes: quotes,
        isCalculatingQuotes: false,
        currentQuoteStage: 4,
      });
    }, 600);
  },

  selectCarrier: (carrierId) =>
    set((state) => ({
      quoteFormData: { ...state.quoteFormData, selectedCarrierId: carrierId },
      currentQuoteStage: 5,
    })),

  bindPolicyAndExecute: (signatureName, signatureDataUrl) => {
    const { quoteFormData, carrierQuotes, policies } = get();
    const selectedQuote = carrierQuotes.find((q) => q.carrierId === quoteFormData.selectedCarrierId) || carrierQuotes[0];

    const newPolicyNumber = `VGR-${quoteFormData.lineOfBusiness.substring(0, 2).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(now.getFullYear() + 1);

    const newPolicy: Policy = {
      id: `pol-${Date.now()}`,
      account_id: 'acc-nexus-01',
      policy_number: newPolicyNumber,
      carrier_name: selectedQuote ? selectedQuote.carrierName : 'Chubb Global Risk Syndicate',
      line_of_business: quoteFormData.lineOfBusiness,
      aggregate_limit: quoteFormData.aggregateLimit,
      occurrence_limit: quoteFormData.occurrenceLimit,
      deductible: quoteFormData.deductible,
      effective_date: now.toISOString().split('T')[0],
      expiration_date: nextYear.toISOString().split('T')[0],
      status: 'active',
      annual_premium: selectedQuote ? selectedQuote.annualPremium : 15000,
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

    return newPolicy;
  },

  issueCoi: (holderName, holderAddress, additionalInsured, waiverSubrogation, specialConditions, policyId) => {
    const { policies, cois } = get();
    const targetPolicy = policyId ? policies.find((p) => p.id === policyId) || policies[0] : policies[0];

    // SHA-256 simulation
    const rawData = `${holderName}-${holderAddress}-${targetPolicy.policy_number}-${Date.now()}`;
    let hash = '';
    for (let i = 0; i < 64; i++) {
      hash += '0123456789abcdef'[(Math.floor(Math.random() * 16))];
    }

    const newCoi: CoiCertificate = {
      id: `coi-${Date.now()}`,
      policy_id: targetPolicy.id,
      holder_name: holderName,
      holder_address: holderAddress,
      additional_insured: additionalInsured,
      waiver_subrogation: waiverSubrogation,
      special_conditions: specialConditions || 'Certificate Holder is granted Additional Insured status subject to terms, exclusions and limits of the specified policy.',
      issued_at: new Date().toISOString(),
      verification_hash: hash,
      policy_number: targetPolicy.policy_number,
      carrier_name: targetPolicy.carrier_name,
      insured_name: 'Nexus Quantum Dynamics Inc.',
    };

    set({ cois: [newCoi, ...cois] });
    return newCoi;
  },

  submitClaimFnol: (claimData) => {
    const { claims } = get();
    const newClaimId = `CLM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newClaim: ClaimFnol = {
      ...claimData,
      id: `clm-${Date.now()}`,
      reported_date: new Date().toISOString(),
      status: 'triaged',
      assigned_adjuster: 'Marcus Vance',
      adjuster_email: 'm.vance@valiantglobalrisk.com',
      adjuster_phone: '+1 (800) 492-8812 ext. 402',
    };

    set({ claims: [newClaim, ...claims] });
    return newClaim;
  },

  submitEndorsement: (req) => {
    const { endorsements } = get();
    const newReq: EndorsementRequest = {
      ...req,
      id: `end-${Date.now()}`,
      requestedAt: new Date().toISOString(),
      status: 'pending_review',
    };

    set({ endorsements: [newReq, ...endorsements] });
    return newReq;
  },
}));

