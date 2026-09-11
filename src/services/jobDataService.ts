import {
  Company,
  Review,
  Interview,
  SalaryReport,
  CompanyBenefit,
  Job,
  DiscussionPost,
  CandidateProfile,
  CandidateApplication
} from '../types/jobPlatform';

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-infobip',
    name: 'Infobip',
    slug: 'infobip',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
    industry: 'Cloud Communications & CPaaS',
    headquarters: 'Vodnjan / Zagreb, Croatia',
    employeeCount: '3,500+ zaposlenika',
    foundedYear: 2006,
    website: 'https://infobip.com',
    rating: 4.6,
    reviewCount: 342,
    ceo: {
      name: 'Silvio Kutić',
      title: 'Co-founder & CEO',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
      approvalRate: 94,
      totalRatings: 289,
    },
    recommendToFriendRate: 91,
    businessOutlookRate: 88,
    cultureScores: {
      cultureAndValues: 4.7,
      workLifeBalance: 4.3,
      seniorLeadership: 4.6,
      compAndBenefits: 4.5,
      careerOpportunities: 4.7,
      diversityInclusion: 4.8,
    },
    techStack: ['Java', 'Spring Boot', 'Kotlin', 'React', 'TypeScript', 'Kafka', 'Kubernetes', 'PostgreSQL', 'Redis'],
    perks: ['Neograničeni godišnji odmor', 'Privatno zdravstveno', 'Edukacijski budžet 2000 €', 'Dionice (ESOP)', 'Moderni kampusi', 'Hibridni / Remote rad'],
    verified: true,
    about: 'Infobip je globalni lider u cloud komunikacijama i omnichannel rješenjima, povezujući preko 7 milijardi ljudi i uređaja diljem svijeta. Naša platforma obrađuje desetke milijardi transakcija mjesečno za vodeće svjetske tehnološke i financijske divove.',
    officeLocations: ['Zagreb', 'Vodnjan', 'Split', 'Rijeka', 'London', 'San Francisco'],
    openRolesCount: 14,
  },
  {
    id: 'comp-rimac',
    name: 'Rimac Technology',
    slug: 'rimac-technology',
    logoUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=160&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80',
    industry: 'Automotive & EV High-Performance Engineering',
    headquarters: 'Sveta Nedelja, Zagreb, Croatia',
    employeeCount: '2,000+ inženjera i stručnjaka',
    foundedYear: 2009,
    website: 'https://rimac-technology.com',
    rating: 4.5,
    reviewCount: 278,
    ceo: {
      name: 'Mate Rimac',
      title: 'Founder & CEO',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
      approvalRate: 92,
      totalRatings: 254,
    },
    recommendToFriendRate: 89,
    businessOutlookRate: 94,
    cultureScores: {
      cultureAndValues: 4.8,
      workLifeBalance: 3.9,
      seniorLeadership: 4.5,
      compAndBenefits: 4.4,
      careerOpportunities: 4.8,
      diversityInclusion: 4.6,
    },
    techStack: ['C++', 'Embedded Linux', 'AUTOSAR', 'MATLAB/Simulink', 'Python', 'React', 'Rust', 'CAN / Ethernet'],
    perks: ['Rad na hiperautomobilima i baterijama', 'Novi Rimac Kampus', 'Subvencionirani obroci kuhara', 'Multisport', 'ESOP program', 'Fleksibilno radno vrijeme'],
    verified: true,
    about: 'Rimac Technology razvija i proizvodi visokoučinkovite baterijske sustave, električne pogonske sklopove i naprednu elektroniku za globalne automobilske OEM lidere kao što su Porsche, BMW, Hyundai i Aston Martin.',
    officeLocations: ['Sveta Nedelja (Rimac Kampus)', 'Zagreb', 'Split', 'Warwick UK'],
    openRolesCount: 22,
  },
  {
    id: 'comp-span',
    name: 'Span d.d.',
    slug: 'span',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=160&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
    industry: 'Cloud Services & Cybersecurity',
    headquarters: 'Zagreb, Croatia',
    employeeCount: '900+ zaposlenika',
    foundedYear: 1993,
    website: 'https://span.eu',
    rating: 4.7,
    reviewCount: 194,
    ceo: {
      name: 'Nikola Dujmović',
      title: 'President of the Management Board',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&auto=format&fit=crop&q=80',
      approvalRate: 95,
      totalRatings: 172,
    },
    recommendToFriendRate: 93,
    businessOutlookRate: 90,
    cultureScores: {
      cultureAndValues: 4.8,
      workLifeBalance: 4.7,
      seniorLeadership: 4.6,
      compAndBenefits: 4.5,
      careerOpportunities: 4.6,
      diversityInclusion: 4.8,
    },
    techStack: ['Azure', 'Microsoft 365', 'Terraform', 'Kubernetes', 'C# .NET', 'React', 'Splunk', 'Sentinel'],
    perks: ['Javna burzovna kompanija (ZSE: SPAN)', 'Span Akademija', 'Vrhunska ravnoteža posla i života', 'Dopunsko i dodatno zdravstvo', 'Roditeljski benefiti'],
    verified: true,
    about: 'Span je jedna od vodećih hrvatskih IT kompanija, specijalizirana za migraciju u oblak, kibernetičku sigurnost i upravljane usluge za globalne enterprise klijente poput McDonaldsa, Rolls-Roycea i stotina financijskih institucija.',
    officeLocations: ['Zagreb', 'Osijek', 'Rijeka', 'Varaždin', 'Ljubljana', 'Kijev'],
    openRolesCount: 9,
  },
  {
    id: 'comp-nanobit',
    name: 'Nanobit',
    slug: 'nanobit',
    logoUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=160&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
    industry: 'Mobile Gaming & Entertainment',
    headquarters: 'Zagreb, Croatia',
    employeeCount: '160+ developera i umjetnika',
    foundedYear: 2008,
    website: 'https://nanobit.com',
    rating: 4.4,
    reviewCount: 112,
    ceo: {
      name: 'Alan Sumina',
      title: 'Co-founder & Managing Director',
      photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&auto=format&fit=crop&q=80',
      approvalRate: 91,
      totalRatings: 98,
    },
    recommendToFriendRate: 87,
    businessOutlookRate: 85,
    cultureScores: {
      cultureAndValues: 4.6,
      workLifeBalance: 4.5,
      seniorLeadership: 4.3,
      compAndBenefits: 4.3,
      careerOpportunities: 4.2,
      diversityInclusion: 4.7,
    },
    techStack: ['Unity', 'C#', 'Python', 'Node.js', 'AWS', 'Blender', 'Photoshop', 'Spine 2D'],
    perks: ['Stillfront Group sinergija', 'Igraonice i opuštena kultura', 'Financiranje konferencija', 'Pet-friendly ured', 'Kvalitetna oprema po izboru'],
    verified: true,
    about: 'Nanobit je vodeći regionalni studio za razvoj mobilnih igara, dio švedske Stillfront grupe. Naše igre preuzete su preko 250 milijuna puta s milijunima aktivnih igrača diljem svijeta.',
    officeLocations: ['Zagreb (Radnička)'],
    openRolesCount: 6,
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-001',
    companyId: 'comp-infobip',
    companyName: 'Infobip',
    rating: 5.0,
    subRatings: {
      cultureAndValues: 5.0,
      workLifeBalance: 4.5,
      seniorLeadership: 4.8,
      compAndBenefits: 4.7,
      careerOpportunities: 5.0,
      diversityInclusion: 5.0,
    },
    title: 'Globalna skala, inženjerska sloboda i nevjerojatan timski duh',
    pros: 'Rad na sustavima koji procesiraju milijarde transakcija, najnoviji cloud alati (K8s, Kafka, GCP/AWS). Kolege su iznimno kompetentne i spremne pomoći. Mogućnosti napredovanja su stvarne ako se pokaže inicijativa. Kampus u Vodnjanu i Zagrebu pruža uvjete svjetske klase.',
    cons: 'Zbog veličine kompanije (preko 3.500 ljudi) koordinacija između različitih timova i vremenskih zona ponekad može potrajati duže.',
    adviceToManagement: 'Nastavite smanjivati birokraciju u unutar-timskim odobrenjima i zadržite fokus na inženjerskoj kulturi.',
    authorRole: 'Senior Staff Software Engineer',
    employmentStatus: 'Current',
    yearsAtCompany: '3+ godine',
    recommends: true,
    ceoApproval: true,
    businessOutlook: 'Positive',
    helpfulCount: 42,
    createdAt: '2026-08-15T14:22:00Z',
    verifiedEmployee: true,
    employerResponse: {
      author: 'Infobip People Operations Team',
      title: 'Official Employer Response',
      comment: 'Hvala ti na detaljnoj i konstruktivnoj recenziji! Drago nam je vidjeti da inženjerska autonomija i kampus potiču vrhunske rezultate. Aktivno radimo na optimizaciji među-timskih tokova u 2026.',
      date: '2026-08-18T10:00:00Z',
    },
  },
  {
    id: 'rev-002',
    companyId: 'comp-rimac',
    companyName: 'Rimac Technology',
    rating: 4.7,
    subRatings: {
      cultureAndValues: 5.0,
      workLifeBalance: 4.0,
      seniorLeadership: 4.6,
      compAndBenefits: 4.5,
      careerOpportunities: 4.9,
      diversityInclusion: 4.6,
    },
    title: 'Nema boljeg mjesta za razvoj hardvera i embedded softvera u Europi',
    pros: 'Rješavamo inženjerske probleme koje nitko drugi nije riješio. Vidjeti kako vaš kod upravlja baterijom ili inverterom u hiperautomobilu koji obara svjetske rekorde je neopisiv osjećaj. Novi Rimac Kampus je zapanjujući.',
    cons: 'Tempo može biti intenzivan pred isporuke ključnih projekata i milestonea za globalne klijente (Porsche, BMW). Nije za one koji traže lagan 9-do-5 posao bez izazova.',
    adviceToManagement: 'Paziti na opterećenje ključnih seniora i nastaviti ulagati u standardizaciju procesa testiranja.',
    authorRole: 'Lead Embedded Systems Engineer',
    employmentStatus: 'Current',
    yearsAtCompany: '4 godine',
    recommends: true,
    ceoApproval: true,
    businessOutlook: 'Positive',
    helpfulCount: 56,
    createdAt: '2026-08-02T11:15:00Z',
    verifiedEmployee: true,
  },
  {
    id: 'rev-003',
    companyId: 'comp-span',
    companyName: 'Span d.d.',
    rating: 4.8,
    subRatings: {
      cultureAndValues: 4.9,
      workLifeBalance: 4.9,
      seniorLeadership: 4.7,
      compAndBenefits: 4.6,
      careerOpportunities: 4.6,
      diversityInclusion: 4.9,
    },
    title: 'Top poslodavac za dugoročnu karijeru, ravnotežu života i certifikate',
    pros: 'Apsolutno poštovanje radnog vremena, bez nepotrebnog prekovremenog rada. Kompanija pokriva sve Microsoft i cloud certifikate uz novčane bonuse po položenom ispitu. Ljudi i atmosfera su fantastični.',
    cons: 'U enterprise konzultantskim projektima ponekad se ovisi o tempu i odlukama vanjskog klijenta.',
    adviceToManagement: 'Samo tako nastavite, stabilnost i transparentnost su vam najveći aduti na tržištu.',
    authorRole: 'Cloud Solutions Architect',
    employmentStatus: 'Current',
    yearsAtCompany: '2 godine',
    recommends: true,
    ceoApproval: true,
    businessOutlook: 'Positive',
    helpfulCount: 31,
    createdAt: '2026-07-28T09:40:00Z',
    verifiedEmployee: true,
  }
];

export const INITIAL_INTERVIEWS: Interview[] = [
  {
    id: 'int-001',
    companyId: 'comp-infobip',
    companyName: 'Infobip',
    jobTitle: 'Senior Software Engineer (Backend / Distributed Systems)',
    department: 'Engineering',
    difficulty: 3.8,
    experience: 'Positive',
    offerOutcome: 'Accepted',
    processLength: '3 tjedna',
    applicationSource: 'Recruiter Reachout',
    stages: ['Uvodni razgovor s regruterom (30 min)', 'Tehnički intervju i arhitektura sustava (90 min)', 'Praktični live-coding / pair programming zadatak (60 min)', 'Kulturni fit i razgovor s Engineering Managerom (45 min)'],
    questions: [
      {
        id: 'q-1',
        question: 'Kako biste dizajnirali idempotentni mehanizam za slanje milijuna SMS notifikacija preko višestrukih telekom operatera s automatskim failoverom?',
        type: 'System Design',
        helpfulCount: 28,
        answersCount: 4,
      },
      {
        id: 'q-2',
        question: 'Opišite kako biste riješili split-brain problem u Kafka klasteru ili distribuiranim bazama podataka.',
        type: 'Technical',
        helpfulCount: 19,
        answersCount: 2,
      },
      {
        id: 'q-3',
        question: 'Opišite situaciju u kojoj se niste slagali s arhitektonskom odlukom tima i kako ste pristupili rješavanju.',
        type: 'Behavioral',
        helpfulCount: 15,
        answersCount: 3,
      }
    ],
    advice: 'Pripremite se dobro na pitanja o skaliranju, mrežnim particijama, konkurentnosti i radu s porukama (Kafka/RabbitMQ). Intervjueri su vrlo kolegijalni i cijene ako glasno razmišljate.',
    helpfulCount: 34,
    createdAt: '2026-08-10T16:00:00Z',
  },
  {
    id: 'int-002',
    companyId: 'comp-rimac',
    companyName: 'Rimac Technology',
    jobTitle: 'Embedded C++ Software Engineer',
    department: 'Powertrain Control',
    difficulty: 4.2,
    experience: 'Positive',
    offerOutcome: 'Accepted',
    processLength: '4 tjedna',
    applicationSource: 'Online Application',
    stages: ['CV Screening', 'Tehnički test (C++ & Embedded koncepti)', 'Dubinski intervju s tehničkim vođom', 'Upoznavanje tima na kampusu'],
    questions: [
      {
        id: 'q-4',
        question: 'Kako biste implementirali circular ring buffer za CAN bus poruke u real-time sustavu bez dinamičke alokacije memorije?',
        type: 'Technical',
        helpfulCount: 41,
        answersCount: 5,
      },
      {
        id: 'q-5',
        question: 'Koje su razlike između std::atomic i mutexa u višenitnom programiranju na embedded procesoru?',
        type: 'Technical',
        helpfulCount: 22,
        answersCount: 3,
      }
    ],
    advice: 'Ključno je poznavanje C++ standarda (C++17/20), pointera, bitwise operacija i real-time ograničenja (ISO 26262 funkcionalna sigurnost).',
    helpfulCount: 48,
    createdAt: '2026-07-19T13:30:00Z',
  }
];

export const INITIAL_SALARIES: SalaryReport[] = [
  {
    id: 'sal-001',
    companyId: 'comp-infobip',
    companyName: 'Infobip',
    jobTitle: 'Senior Software Engineer',
    department: 'Engineering',
    level: 'Senior',
    baseSalary: 48000,
    bonus: 6000,
    equity: 5000,
    totalComp: 59000,
    yearsOfExperience: 6,
    location: 'Zagreb / Remote',
    currency: 'EUR',
    verified: true,
    createdAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'sal-002',
    companyId: 'comp-infobip',
    companyName: 'Infobip',
    jobTitle: 'Software Engineer',
    department: 'Engineering',
    level: 'Mid',
    baseSalary: 34000,
    bonus: 3500,
    equity: 2500,
    totalComp: 40000,
    yearsOfExperience: 3,
    location: 'Zagreb',
    currency: 'EUR',
    verified: true,
    createdAt: '2026-08-12T11:00:00Z',
  },
  {
    id: 'sal-003',
    companyId: 'comp-rimac',
    companyName: 'Rimac Technology',
    jobTitle: 'Lead Embedded Engineer',
    department: 'Engineering',
    level: 'Lead',
    baseSalary: 62000,
    bonus: 8000,
    equity: 12000,
    totalComp: 82000,
    yearsOfExperience: 9,
    location: 'Sveta Nedelja',
    currency: 'EUR',
    verified: true,
    createdAt: '2026-07-29T14:30:00Z',
  },
  {
    id: 'sal-004',
    companyId: 'comp-span',
    companyName: 'Span d.d.',
    jobTitle: 'Cloud Solution Architect',
    department: 'Cloud Services',
    level: 'Senior',
    baseSalary: 46000,
    bonus: 5000,
    equity: 3000,
    totalComp: 54000,
    yearsOfExperience: 7,
    location: 'Zagreb',
    currency: 'EUR',
    verified: true,
    createdAt: '2026-08-05T09:15:00Z',
  },
  {
    id: 'sal-005',
    companyId: 'comp-nanobit',
    companyName: 'Nanobit',
    jobTitle: 'Senior Game Developer (Unity)',
    department: 'Game Dev',
    level: 'Senior',
    baseSalary: 42000,
    bonus: 4500,
    equity: 2000,
    totalComp: 48500,
    yearsOfExperience: 5,
    location: 'Zagreb',
    currency: 'EUR',
    verified: true,
    createdAt: '2026-07-15T15:00:00Z',
  }
];

export const INITIAL_BENEFITS: CompanyBenefit[] = [
  {
    id: 'ben-001',
    companyId: 'comp-infobip',
    category: 'Work Flexibility',
    name: 'Fleksibilno radno vrijeme & Remote / Hibrid',
    rating: 4.8,
    ratingCount: 184,
    description: 'Mogućnost rada na daljinu, hibridnog rada ili iz modernih kampusa u Zagrebu i Vodnjanu.',
    comments: [
      { author: 'Backend Dev', comment: 'Potpuna sloboda u dogovoru s timom o danima rada od kuće.', rating: 5, date: '2026-08-10' }
    ]
  },
  {
    id: 'ben-002',
    companyId: 'comp-infobip',
    category: 'Health & Wellness',
    name: 'Privatno dodatno i dopunsko zdravstveno osiguranje',
    rating: 4.7,
    ratingCount: 210,
    description: 'Godišnji sistematski pregled u poliklinikama, specijalistički pregledi i pokriće stomatoloških usluga.',
    comments: [
      { author: 'QA Lead', comment: 'Vrhunska polica bez čekanja na preglede.', rating: 5, date: '2026-07-22' }
    ]
  },
  {
    id: 'ben-003',
    companyId: 'comp-infobip',
    category: 'Professional Growth',
    name: 'Godišnji edukacijski budžet & certifikati (2.000 €)',
    rating: 4.9,
    ratingCount: 165,
    description: 'Financiranje međunarodnih konferencija, tečajeva i certifikata po vlastitom izboru.',
    comments: [
      { author: 'DevOps Engineer', comment: 'Iskoristio za KubeCon u Parizu, kompanija pokrila sve troškove.', rating: 5, date: '2026-06-30' }
    ]
  },
  {
    id: 'ben-004',
    companyId: 'comp-rimac',
    category: 'Financial & Retirement',
    name: 'ESOP program & nagradni bonusi',
    rating: 4.6,
    ratingCount: 140,
    description: 'Dioničke opcije i bonusi vezani uz isporuke projekata za globalne automobilske gigante.',
    comments: [
      { author: 'Powertrain Engineer', comment: 'Dionice daju pravi osjećaj suvlasništva.', rating: 5, date: '2026-08-01' }
    ]
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-001',
    companyId: 'comp-infobip',
    companyName: 'Infobip',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80',
    companyRating: 4.6,
    title: 'Senior Backend Engineer (Java / Distributed Core)',
    department: 'Core Infrastructure',
    location: 'Zagreb, Hrvatska (ili Remote)',
    workplaceType: 'Hybrid',
    type: 'Full-time',
    experienceLevel: 'Senior',
    salaryMin: 45000,
    salaryMax: 62000,
    currency: 'EUR',
    description: 'Pridružite se našem timu zaduženom za izgradnju i održavanje distribuirane komunikacijske infrastrukture koja procesira milijarde transakcija mjesečno u milisekundama.',
    responsibilities: [
      'Razvoj visokodostupnih servisa u Javi/Kotlinu na Spring Boot platformi',
      'Arhitektura event-driven sustava koristeći Apache Kafka i Redis',
      'Optimizacija performansi i smanjenje latencije na mikroservisima',
      'Mentoriranje mlađih kolega i vođenje code review procesa'
    ],
    requirements: [
      'Minimalno 5 godina iskustva u backend razvoju (Java / Kotlin)',
      'Duboko razumijevanje distribuiranih sustava, višenitnosti i cachinga',
      'Iskustvo s kontejnerima (Docker, Kubernetes) i cloud providerima',
      'Izvrsno poznavanje relacijskih i NoSQL baza podataka'
    ],
    skills: ['Java', 'Spring Boot', 'Kafka', 'Kubernetes', 'PostgreSQL', 'Docker', 'Microservices', 'Distributed Systems'],
    perks: ['Neograničeni GO', 'Privatno zdravstveno', '2.000 € edukacijski budžet', 'Najnoviji MacBook Pro'],
    easyApply: true,
    applicantCount: 24,
    responseSLA: 'Tipičan odgovor unutar 24 sata',
    createdAt: '2026-09-08T09:00:00Z',
    expiresAt: '2026-10-08T23:59:59Z',
    status: 'active',
    featured: true,
  },
  {
    id: 'job-002',
    companyId: 'comp-rimac',
    companyName: 'Rimac Technology',
    companyLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=160&auto=format&fit=crop&q=80',
    companyRating: 4.5,
    title: 'Embedded Software Engineer (BMS & Powertrain)',
    department: 'Battery Management Systems',
    location: 'Sveta Nedelja (Rimac Kampus)',
    workplaceType: 'Onsite',
    type: 'Full-time',
    experienceLevel: 'Mid',
    salaryMin: 36000,
    salaryMax: 50000,
    currency: 'EUR',
    description: 'Radite na razvoju sigurnosno-kritičnog softvera za baterijske sustave sljedeće generacije električnih vozila vodećih svjetskih proizvođača.',
    responsibilities: [
      'Implementacija algoritama procjene stanja baterije (SoC, SoH, SoP)',
      'Razvoj drivera i protokola komunikacije na CAN/CAN-FD sabirnicama',
      'Rad prema ISO 26262 normama funkcionalne sigurnosti (ASIL C/D)',
      'Hardversko-softverska integracija i validacija na HIL simulatorima'
    ],
    requirements: [
      'Minimalno 3 godine iskustva u razvoju u C ili modernom C++',
      'Iskustvo s mikrokontrolerima (ARM Cortex-M, Infineon Aurix ili slično)',
      'Poznavanje automobilskih komunikacijskih protokola (CAN, LIN, UDS)',
      'Razumijevanje elektronike i čitanja hardverskih shema'
    ],
    skills: ['C++', 'Embedded C', 'CAN bus', 'AUTOSAR', 'ISO 26262', 'Hardware-in-the-Loop', 'Git'],
    perks: ['Subvencionirani gurmanski ručak', 'Rimac Kampus sadržaji', 'Dionice', 'Besplatan prijevoz'],
    easyApply: true,
    applicantCount: 38,
    responseSLA: 'Odgovor unutar 48 sati',
    createdAt: '2026-09-07T12:30:00Z',
    expiresAt: '2026-10-07T23:59:59Z',
    status: 'active',
    featured: true,
  },
  {
    id: 'job-003',
    companyId: 'comp-span',
    companyName: 'Span d.d.',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=160&auto=format&fit=crop&q=80',
    companyRating: 4.7,
    title: 'Cloud Solutions Architect (Azure / Enterprise)',
    department: 'Cloud Infrastructure',
    location: 'Zagreb, Hrvatska (Hibrid)',
    workplaceType: 'Hybrid',
    type: 'Full-time',
    experienceLevel: 'Senior',
    salaryMin: 44000,
    salaryMax: 58000,
    currency: 'EUR',
    description: 'Dizajnirajte složene cloud arhitekture za međunarodne enterprise klijente s fokusom na visoku dostupnost, sigurnost i automatizaciju putem Infrastructure as Code.',
    responsibilities: [
      'Dizajn enterprise Azure cloud arhitekture za globalne klijente',
      'Definiranje strategije migracije on-premise sustava u oblak',
      'Izrada IaC predložaka (Terraform, Bicep) i CI/CD cjevovoda',
      'Konzultacije s klijentima oko optimizacije troškova (FinOps)'
    ],
    requirements: [
      'Aktivni Microsoft certifikati (npr. Azure Solutions Architect Expert)',
      'Duboko poznavanje mrežnih topologija, sigurnosnih politika i hibridnog oblaka',
      'Iskustvo s Terraformom ili Bicepom i DevOps praksama',
      'Izvrsne komunikacijske vještine na engleskom jeziku'
    ],
    skills: ['Azure', 'Terraform', 'Kubernetes', 'CI/CD', 'Security', 'FinOps', 'Architecture'],
    perks: ['Nagradni bonusi za certifikate', 'Span akademija', 'Dopunsko i dodatno zdravstvo', 'Home office oprema'],
    easyApply: true,
    applicantCount: 16,
    responseSLA: 'Tipičan odgovor unutar 24 sata',
    createdAt: '2026-09-09T14:00:00Z',
    expiresAt: '2026-10-09T23:59:59Z',
    status: 'active',
  },
  {
    id: 'job-004',
    companyId: 'comp-nanobit',
    companyName: 'Nanobit',
    companyLogo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=160&auto=format&fit=crop&q=80',
    companyRating: 4.4,
    title: 'Senior Unity Game Developer',
    department: 'Game Production',
    location: 'Zagreb, Hrvatska',
    workplaceType: 'Hybrid',
    type: 'Full-time',
    experienceLevel: 'Senior',
    salaryMin: 40000,
    salaryMax: 52000,
    currency: 'EUR',
    description: 'Kreirajte uzbudljive narativne igre i interaktivne doživljaje u Unityju koji zabavljaju milijune igrača širom svijeta.',
    responsibilities: [
      'Razvoj ključnih mehanika igara i optimizacija performansi za mobilne platforme',
      'Suradnja s game dizajnerima, 2D/3D artistima i animatorima',
      'Profiliranje memorije, renderinga i optimizacija potrošnje baterije',
      'Implementacija novih gameplay značajki i live-ops evenata'
    ],
    requirements: [
      'Minimalno 4 godine iskustva u Unityju i C# razvoju za mobilne igre',
      'Poznavanje grafičkih pipelinea, shadera i optimizacije na iOS/Androidu',
      'Iskustvo s Gitom, automatiziranim buildovima i analitičkim SDK-ovima'
    ],
    skills: ['Unity', 'C#', 'Mobile Games', 'Shader Graph', 'Git', 'Performance Optimization'],
    perks: ['Stillfront razmjene znanja', 'Pet-friendly ured', 'Edukacije', 'Opuštena atmosfera'],
    easyApply: true,
    applicantCount: 29,
    responseSLA: 'Odgovor unutar 3 dana',
    createdAt: '2026-09-06T10:00:00Z',
    expiresAt: '2026-10-06T23:59:59Z',
    status: 'active',
  }
];

export const INITIAL_DISCUSSIONS: DiscussionPost[] = [
  {
    id: 'disc-001',
    companyId: 'comp-infobip',
    companyName: 'Infobip',
    category: 'Interview Prep',
    title: 'Kakva su iskustva s tehničkim intervjuom za Senior Backend u Infobipu?',
    content: 'Prijavio sam se za poziciju Senior Java Backend inženjera. Zanimaju me konkretna iskustva oko praktičnog live coding dijela – traže li se strogi LeetCode hard algoritmi ili se više fokusira na arhitekturu i stvarne probleme iz prakse?',
    authorAnonTag: 'Anonimni Kandidat #491',
    authorRole: 'Backend Inženjer',
    isVerifiedEmployee: false,
    upvotes: 18,
    replyCount: 3,
    replies: [
      {
        id: 'rep-1',
        authorAnonTag: 'Anonimni Infobipovac #12',
        authorRole: 'Senior Staff Engineer @ Infobip',
        content: 'Fokus je na stvarnim situacijama iz distribuiranih sustava! Ne mučimo kandidate s apstraktnim trikovima. Očekuj zadatak tipa izgradnja rate-limitera, idempotencije u obradi poruka ili rukovanja failoverom baze. Gleda se čistoća koda, concurrency i objašnjavanje odluka.',
        createdAt: '2026-09-02T18:30:00Z',
        upvotes: 14,
      },
      {
        id: 'rep-2',
        authorAnonTag: 'Anonimni Kolega #77',
        content: 'Imao sam intervju prije 2 mjeseca. Intervjueri su bili super opušteni, atmosfera je kao pair programming s kolegom s posla.',
        createdAt: '2026-09-03T09:12:00Z',
        upvotes: 6,
      }
    ],
    createdAt: '2026-09-02T15:20:00Z',
  },
  {
    id: 'disc-002',
    category: 'Salary & Negotiations',
    title: 'Usporedba rasta plaća i paketa: Hrvatska vs Remote EU u 2026.',
    content: 'Kolika je realna razlika u ukupnom kompenzacijskom paketu (Base + Bonus + Equity) između vodećih domaćih tehnoloških firmi i stranih remote poslodavaca za pozicije Staff / Lead inženjera u 2026. godini?',
    authorAnonTag: 'Tech Lead #230',
    authorRole: 'Staff Software Architect',
    isVerifiedEmployee: true,
    upvotes: 27,
    replyCount: 2,
    replies: [
      {
        id: 'rep-3',
        authorAnonTag: 'Anonimni Remote Inženjer #88',
        content: 'Za Staff razinu domaći tier-1 poslodavci nude između 60.000 € i 85.000 € brutto 1 (ili odgovarajući paušal/doo ekvivalent) uz opcije dionica. Zapadnoeuropski remote kreće od 95.000 € do 130.000 €, no domaći kampusi nude bolju pravnu sigurnost i timsku sinergiju.',
        createdAt: '2026-09-05T11:45:00Z',
        upvotes: 19,
      }
    ],
    createdAt: '2026-09-05T10:00:00Z',
  }
];

export const INITIAL_CANDIDATE_PROFILE: CandidateProfile = {
  id: 'cand-001',
  name: 'Ivan Kovač',
  email: 'ivan.kovac@dev.hr',
  title: 'Full Stack & Cloud Software Engineer',
  bio: 'Strastveni softverski inženjer s 5+ godina iskustva u razvoju modernih distribuiranih web aplikacija i cloud arhitektura. Fokusiran na performanse, TypeScript i Java ekosustav.',
  location: 'Zagreb, Hrvatska',
  experienceYears: 5,
  targetSalary: 52000,
  preferredWorkplace: 'Hybrid',
  skills: ['Java', 'Spring Boot', 'TypeScript', 'React', 'Docker', 'Kubernetes', 'PostgreSQL', 'Git', 'Kafka', 'Microservices'],
  savedJobIds: ['job-001', 'job-003'],
  appliedJobIds: ['job-001'],
};

export const INITIAL_APPLICATIONS: CandidateApplication[] = [
  {
    id: 'app-001',
    jobId: 'job-001',
    jobTitle: 'Senior Backend Engineer (Java / Distributed Core)',
    companyName: 'Infobip',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80',
    candidateName: 'Ivan Kovač',
    candidateEmail: 'ivan.kovac@dev.hr',
    candidatePhone: '+385 91 555 1234',
    coverNote: 'Oduvijek pratim rad Infobipa i iznimno bih volio doprinijeti razvoju core messaging servisa.',
    skillsMatched: ['Java', 'Spring Boot', 'Kafka', 'Kubernetes', 'PostgreSQL', 'Docker', 'Microservices', 'Distributed Systems'],
    skillsMissing: [],
    matchScore: 100,
    status: 'Interviewing',
    appliedAt: '2026-09-08T11:00:00Z',
  }
];

// Dual-Mode Persistence Store with LocalStorage and In-Memory Fallback
class JobPlatformStore {
  private companiesKey = 'job_platform_companies_v1';
  private reviewsKey = 'job_platform_reviews_v1';
  private interviewsKey = 'job_platform_interviews_v1';
  private salariesKey = 'job_platform_salaries_v1';
  private benefitsKey = 'job_platform_benefits_v1';
  private jobsKey = 'job_platform_jobs_v1';
  private discussionsKey = 'job_platform_discussions_v1';
  private candidateKey = 'job_platform_candidate_v1';
  private applicationsKey = 'job_platform_applications_v1';

  private load<T>(key: string, fallback: T[]): T[] {
    if (typeof window === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  private save<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Companies
  getCompanies(): Company[] {
    return this.load<Company>(this.companiesKey, INITIAL_COMPANIES);
  }

  getCompanyById(id: string): Company | undefined {
    return this.getCompanies().find((c) => c.id === id || c.slug === id);
  }

  // Reviews
  getReviews(companyId?: string): Review[] {
    const list = this.load<Review>(this.reviewsKey, INITIAL_REVIEWS);
    return companyId ? list.filter((r) => r.companyId === companyId) : list;
  }

  addReview(review: Review): void {
    const list = this.getReviews();
    list.unshift(review);
    this.save(this.reviewsKey, list);

    // Recalculate company metrics
    const company = this.getCompanyById(review.companyId);
    if (company) {
      const companyReviews = list.filter((r) => r.companyId === review.companyId);
      const avgRating =
        companyReviews.reduce((sum, r) => sum + r.rating, 0) / companyReviews.length;
      const recommendCount = companyReviews.filter((r) => r.recommends).length;
      const ceoCount = companyReviews.filter((r) => r.ceoApproval).length;

      company.rating = Math.round(avgRating * 10) / 10;
      company.reviewCount = companyReviews.length;
      company.recommendToFriendRate = Math.round((recommendCount / companyReviews.length) * 100);
      company.ceo.approvalRate = Math.round((ceoCount / companyReviews.length) * 100);
      company.ceo.totalRatings = companyReviews.length;

      const companies = this.getCompanies();
      const idx = companies.findIndex((c) => c.id === company.id);
      if (idx >= 0) {
        companies[idx] = company;
        this.save(this.companiesKey, companies);
      }
    }
  }

  // Interviews
  getInterviews(companyId?: string): Interview[] {
    const list = this.load<Interview>(this.interviewsKey, INITIAL_INTERVIEWS);
    return companyId ? list.filter((i) => i.companyId === companyId) : list;
  }

  addInterview(interview: Interview): void {
    const list = this.getInterviews();
    list.unshift(interview);
    this.save(this.interviewsKey, list);
  }

  // Salaries
  getSalaries(companyId?: string): SalaryReport[] {
    const list = this.load<SalaryReport>(this.salariesKey, INITIAL_SALARIES);
    return companyId ? list.filter((s) => s.companyId === companyId) : list;
  }

  addSalary(salary: SalaryReport): void {
    const list = this.getSalaries();
    list.unshift(salary);
    this.save(this.salariesKey, list);
  }

  // Benefits
  getBenefits(companyId: string): CompanyBenefit[] {
    const list = this.load<CompanyBenefit>(this.benefitsKey, INITIAL_BENEFITS);
    return list.filter((b) => b.companyId === companyId);
  }

  // Jobs
  getJobs(): Job[] {
    return this.load<Job>(this.jobsKey, INITIAL_JOBS);
  }

  getJobById(id: string): Job | undefined {
    return this.getJobs().find((j) => j.id === id);
  }

  addJob(job: Job): void {
    const list = this.getJobs();
    list.unshift(job);
    this.save(this.jobsKey, list);

    // Increment company open roles
    const company = this.getCompanyById(job.companyId);
    if (company) {
      company.openRolesCount += 1;
      const companies = this.getCompanies();
      const idx = companies.findIndex((c) => c.id === company.id);
      if (idx >= 0) {
        companies[idx] = company;
        this.save(this.companiesKey, companies);
      }
    }
  }

  // Discussions
  getDiscussions(companyId?: string): DiscussionPost[] {
    const list = this.load<DiscussionPost>(this.discussionsKey, INITIAL_DISCUSSIONS);
    return companyId ? list.filter((d) => !d.companyId || d.companyId === companyId) : list;
  }

  addDiscussion(post: DiscussionPost): void {
    const list = this.getDiscussions();
    list.unshift(post);
    this.save(this.discussionsKey, list);
  }

  addReply(postId: string, reply: { authorAnonTag: string; authorRole?: string; content: string }): void {
    const list = this.getDiscussions();
    const post = list.find((p) => p.id === postId);
    if (post) {
      post.replies.push({
        id: `rep-${Date.now()}`,
        authorAnonTag: reply.authorAnonTag,
        authorRole: reply.authorRole,
        content: reply.content,
        createdAt: new Date().toISOString(),
        upvotes: 0,
      });
      post.replyCount = post.replies.length;
      this.save(this.discussionsKey, list);
    }
  }

  // Candidate Profile
  getCandidateProfile(): CandidateProfile {
    if (typeof window === 'undefined') return INITIAL_CANDIDATE_PROFILE;
    const raw = localStorage.getItem(this.candidateKey);
    if (!raw) {
      localStorage.setItem(this.candidateKey, JSON.stringify(INITIAL_CANDIDATE_PROFILE));
      return INITIAL_CANDIDATE_PROFILE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CANDIDATE_PROFILE;
    }
  }

  updateCandidateProfile(profile: CandidateProfile): void {
    this.save(this.candidateKey, profile);
  }

  // Applications
  getApplications(): CandidateApplication[] {
    return this.load<CandidateApplication>(this.applicationsKey, INITIAL_APPLICATIONS);
  }

  submitApplication(application: CandidateApplication): void {
    const list = this.getApplications();
    list.unshift(application);
    this.save(this.applicationsKey, list);

    // Update candidate profile
    const profile = this.getCandidateProfile();
    if (!profile.appliedJobIds.includes(application.jobId)) {
      profile.appliedJobIds.push(application.jobId);
      this.updateCandidateProfile(profile);
    }

    // Increment job applicant count
    const job = this.getJobById(application.jobId);
    if (job) {
      job.applicantCount += 1;
      const jobs = this.getJobs();
      const idx = jobs.findIndex((j) => j.id === job.id);
      if (idx >= 0) {
        jobs[idx] = job;
        this.save(this.jobsKey, jobs);
      }
    }
  }
}

export const jobDataService = new JobPlatformStore();

/**
 * Seed Cloud Firestore collections if empty on Firebase Project agencija-za-osiguranje
 */
export async function seedJobPlatformFirestoreIfEmpty(): Promise<void> {
  try {
    const { db } = await import('../api/firebase');
    const { getDocs, setDoc, doc, collection } = await import('firebase/firestore');

    const snap = await getDocs(collection(db, 'job_companies'));
    if (snap.empty) {
      for (const comp of INITIAL_COMPANIES) {
        await setDoc(doc(db, 'job_companies', comp.id), comp);
      }
      for (const job of INITIAL_JOBS) {
        await setDoc(doc(db, 'job_listings', job.id), job);
      }
      for (const rev of INITIAL_REVIEWS) {
        await setDoc(doc(db, 'job_reviews', rev.id), rev);
      }
      for (const intv of INITIAL_INTERVIEWS) {
        await setDoc(doc(db, 'job_interviews', intv.id), intv);
      }
      for (const sal of INITIAL_SALARIES) {
        await setDoc(doc(db, 'job_salaries', sal.id), sal);
      }
      for (const disc of INITIAL_DISCUSSIONS) {
        await setDoc(doc(db, 'job_discussions', disc.id), disc);
      }
    }
  } catch (err) {
    console.info('Firestore job platform seeding using local cache fallback:', err);
  }
}

seedJobPlatformFirestoreIfEmpty().catch(() => {});
