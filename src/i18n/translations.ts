import { Language, ProductLine } from '../types/domain';

export interface ProductMeta {
  id: ProductLine;
  nameHr: string;
  nameEn: string;
  shortDescHr: string;
  shortDescEn: string;
  startingMonthlyEur: number;
  startingAnnualEur: number;
  badgeHr?: string;
  badgeEn?: string;
}

export const PRODUCT_CATALOG: ProductMeta[] = [
  {
    id: 'auto',
    nameHr: 'Auto osiguranje',
    nameEn: 'Car Insurance',
    shortDescHr: 'Obvezni AO, mini i puni kasko uz prijenos do 50% bonusa.',
    shortDescEn: 'Mandatory liability and comprehensive cover with up to 50% bonus.',
    startingMonthlyEur: 19,
    startingAnnualEur: 215,
    badgeHr: 'Najtraženije',
    badgeEn: 'Most popular',
  },
  {
    id: 'imovina',
    nameHr: 'Dom i imovina',
    nameEn: 'Home & Property',
    shortDescHr: 'Stan, kuća, stvari kućanstva i zaštita od potresa.',
    shortDescEn: 'Apartments, houses, contents, and earthquake protection.',
    startingMonthlyEur: 11,
    startingAnnualEur: 124,
    badgeHr: 'Potres uključen',
    badgeEn: 'Earthquake option',
  },
  {
    id: 'zdravstveno',
    nameHr: 'Zdravstveno',
    nameEn: 'Health',
    shortDescHr: 'Dopunsko bez participacija i specijalistički pregledi bez čekanja.',
    shortDescEn: 'Supplemental copay coverage and private specialist access.',
    startingMonthlyEur: 9.5,
    startingAnnualEur: 108,
  },
  {
    id: 'zivotno',
    nameHr: 'Životno',
    nameEn: 'Term Life',
    shortDescHr: 'Financijska sigurnost obitelji i vinkulacija stambenog kredita.',
    shortDescEn: 'Family financial protection and mortgage assignment policies.',
    startingMonthlyEur: 14,
    startingAnnualEur: 158,
  },
  {
    id: 'putno',
    nameHr: 'Putno',
    nameEn: 'Travel',
    shortDescHr: 'Zdravstvena asistencija u inozemstvu, prtljaga i otkaz putovanja.',
    shortDescEn: 'Emergency medical abroad, baggage, and trip cancellation.',
    startingMonthlyEur: 8,
    startingAnnualEur: 49,
  },
  {
    id: 'ljubimci',
    nameHr: 'Ljubimci',
    nameEn: 'Pet',
    shortDescHr: 'Veterinarski troškovi liječenja i odgovornost vlasnika psa ili mačke.',
    shortDescEn: 'Veterinary bills and third-party liability for dogs and cats.',
    startingMonthlyEur: 12,
    startingAnnualEur: 135,
  },
  {
    id: 'poslovno',
    nameHr: 'Poslovno (SME)',
    nameEn: 'Business (SME)',
    shortDescHr: 'Profesionalna odgovornost, uredska imovina i cyber zaštita.',
    shortDescEn: 'Professional indemnity, office property, and cyber cover.',
    startingMonthlyEur: 29,
    startingAnnualEur: 330,
  },
];

export const PRODUCT_MAP: Record<ProductLine, ProductMeta> = PRODUCT_CATALOG.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<ProductLine, ProductMeta>
);

export const UI_COPY: Record<
  Language,
  {
    nav: {
      insurances: string;
      switchPolicy: string;
      claims: string;
      aiAdvisor: string;
      about: string;
      getQuote: string;
      myProfile: string;
      adminOps: string;
    };
    hero: {
      headline: string;
      subheadline: string;
      cta: string;
      switchCta: string;
      trustHanfa: string;
      trustFee: string;
      trustRating: string;
    };
    bundle: {
      title: string;
      subtitle: string;
      fromMonth: string;
      perYear: string;
      discountActive: string;
      selectPrompt: string;
      ctaSelected: string;
      ctaDefault: string;
    };
    howItWorks: {
      eyebrow: string;
      title: string;
      subtitle: string;
      steps: Array<{ number: string; title: string; body: string }>;
    };
    switchSection: {
      eyebrow: string;
      title: string;
      body: string;
      cta: string;
    };
    footer: {
      products: string;
      tools: string;
      agency: string;
      compliance: string;
      disclosure: string;
    };
  }
> = {
  hr: {
    nav: {
      insurances: 'Osiguranja',
      switchPolicy: 'Usporedi policu',
      claims: 'Prijava štete',
      aiAdvisor: 'AI Savjetnik',
      about: 'O nama',
      getQuote: 'Izračunaj cijenu',
      myProfile: 'Moj Profil',
      adminOps: 'Operativa',
    },
    hero: {
      headline: 'Osiguranje bez sitnih slova. Ugovoreno za 90 sekundi.',
      subheadline:
        'Usporedite ponude 7 vodećih osiguratelja u Hrvatskoj na jednom mjestu. Transparentna pokrića, 0 € agencijske naknade i ljudska podrška kad je najvažnije.',
      cta: 'Izračunaj cijenu',
      switchCta: 'Već imaš policu? Usporedi je',
      trustHanfa: 'HANFA licencirani zastupnik',
      trustFee: '0 € naknade za klijente',
      trustRating: 'ocjena klijenata',
    },
    bundle: {
      title: 'Jasne cijene. Mjesečno ili godišnje. Popust na pakete.',
      subtitle: 'Odaberi jednu ili više vrsta osiguranja — spoji Auto + Dom i uštedi do 15%.',
      fromMonth: 'od',
      perYear: 'godišnje',
      discountActive: 'Aktivan paketni popust:',
      selectPrompt: 'Odaberi 2 ili više polica za automatski paketni popust do 15%.',
      ctaSelected: 'Izračunaj cijenu paketa',
      ctaDefault: 'Izračunaj cijenu',
    },
    howItWorks: {
      eyebrow: 'Kako funkcionira digitalna agencija',
      title: 'Sve što trebaš znati, bez papirologije i čekanja.',
      subtitle: 'Kombiniramo brzinu digitalnog izračuna i stvarno zastupanje pri prijavi štete.',
      steps: [
        {
          number: '01',
          title: 'Unesi osnovne podatke u 90 sekundi',
          body: 'Jedno jasno pitanje po koraku. Kontakt i OIB tražimo tek kada želiš obvezujuću ponudu.',
        },
        {
          number: '02',
          title: 'Usporedi pokrića i prilagodi franšizu uživo',
          body: 'Pomiči klizače pokrića i franšize te odmah vidi što jest, a što nije pokriveno na jednostavnom hrvatskom.',
        },
        {
          number: '03',
          title: 'Polica u digitalnom novčaniku + 24/7 podrška kod štete',
          body: 'Polica, Zelena karta i IPID uvijek su dostupni u Moj Profil pretincu, a kod štete vodimo proces s osigurateljem.',
        },
      ],
    },
    switchSection: {
      eyebrow: 'Usporedi i uštedi',
      title: 'Već imaš policu? Pošalji nam je i pronaći ćemo bolju ponudu.',
      body: 'Učitaj PDF ili fotografiju postojeće police. Naš AI sustav analizira pokrića, računa moguću uštedu i postavlja automatski podsjetnik prije isteka.',
      cta: 'Učitaj postojeću policu',
    },
    footer: {
      products: 'Osiguranja',
      tools: 'Digitalni alati',
      agency: 'Agencija',
      compliance: 'Regulativa i prava',
      disclosure:
        'Društvo za zastupanje u osiguranju posluje pod nadzorom Hrvatske agencije za nadzor financijskih usluga (HANFA). Zastupnik prima proviziju isključivo od osiguravajućih društava te za ugovaratelja osiguranja nema nikakvih dodatnih troškova u odnosu na izravno ugovaranje.',
    },
  },
  en: {
    nav: {
      insurances: 'Insurance',
      switchPolicy: 'Switch & Save',
      claims: 'Claims',
      aiAdvisor: 'AI Advisor',
      about: 'About',
      getQuote: 'Check prices',
      myProfile: 'My Profile',
      adminOps: 'Ops Portal',
    },
    hero: {
      headline: 'Insurance without the fine print. Bound in 90 seconds.',
      subheadline:
        'Compare policies from 7 top Croatian insurers side-by-side. Plain-language terms, €0 agency fees, and dedicated human claims advocacy.',
      cta: 'Check prices',
      switchCta: 'Already insured? Compare your policy',
      trustHanfa: 'HANFA-licensed agency',
      trustFee: '€0 fee for clients',
      trustRating: 'verified client rating',
    },
    bundle: {
      title: 'Clear prices. Monthly or annual. Bundle discounts.',
      subtitle: 'Pick one or more lines — bundle Car + Home and save up to 15%.',
      fromMonth: 'from',
      perYear: 'per year',
      discountActive: 'Bundle discount unlocked:',
      selectPrompt: 'Select 2 or more policies to unlock up to 15% multi-policy savings.',
      ctaSelected: 'Check bundle price',
      ctaDefault: 'Check prices',
    },
    howItWorks: {
      eyebrow: 'How our digital agency works',
      title: 'Everything clear, zero paperwork.',
      subtitle: 'Instant multi-carrier comparisons paired with real licensed advisors whenever you file a claim.',
      steps: [
        {
          number: '01',
          title: 'Answer simple risk questions in 90 seconds',
          body: 'One focused question per screen. We only ask for contact details and OIB when you unlock binding offers.',
        },
        {
          number: '02',
          title: 'Compare carriers & customize deductible live',
          body: 'Adjust deductibles and add-ons in real time with plain-language Covered vs. Excluded breakdowns.',
        },
        {
          number: '03',
          title: 'Instant digital wallet + 24/7 claims triage',
          body: 'Access your policy PDF, Green Card, and IPID anytime in My Profile, with guided FNOL claims support.',
        },
      ],
    },
    switchSection: {
      eyebrow: 'Switch & Save',
      title: 'Already insured? Upload your policy and we will beat it.',
      body: 'Drop a PDF or photo of your existing policy. We extract key coverage terms, estimate savings, and set a renewal reminder before expiry.',
      cta: 'Upload current policy',
    },
    footer: {
      products: 'Products',
      tools: 'Digital Tools',
      agency: 'Company',
      compliance: 'Regulatory & Legal',
      disclosure:
        'Authorized Croatian insurance agency supervised by HANFA. The agency is compensated solely via insurer commission at zero additional cost to policyholders.',
    },
  },
};
