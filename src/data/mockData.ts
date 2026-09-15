import {
  CarrierPartner,
  CoverageComparisonTier,
  InsuranceGlossaryTerm,
  SpeedCameraLocation,
} from '../lib/types';

// 1. 10 Recognized Croatian Carrier Partners
export const CARRIER_PARTNERS: CarrierPartner[] = [
  {
    id: 'croatia',
    name: 'Croatia osiguranje d.d.',
    shortName: 'Croatia',
    marketShare: '26.4%',
    rating: 4.8,
    reviewCount: 3120,
    brandColor: '#004B87',
    badge: 'Tradicija od 1884.',
    features: ['Najveća mreža procjenilišta u RH', 'Digitalna prijava štete', 'Zelena karta gratis'],
  },
  {
    id: 'allianz',
    name: 'Allianz Hrvatska d.d.',
    shortName: 'Allianz',
    marketShare: '14.2%',
    rating: 4.9,
    reviewCount: 2450,
    brandColor: '#003780',
    badge: 'Globalna stabilnost',
    features: ['Vrhunsko kasko pokriće', '24/7 asistencija diljem Europe', 'Brza isplata unutar 48h'],
  },
  {
    id: 'euroherc',
    name: 'Euroherc osiguranje d.d.',
    shortName: 'Euroherc',
    marketShare: '12.8%',
    rating: 4.7,
    reviewCount: 1890,
    brandColor: '#B91C1C',
    badge: 'Lider u AO osiguranju',
    features: ['Povoljne cijene auto odgovornosti', 'Široka mreža stanica za tehnički pregled'],
  },
  {
    id: 'generali',
    name: 'Generali osiguranje d.d.',
    shortName: 'Generali',
    marketShare: '10.5%',
    rating: 4.8,
    reviewCount: 1670,
    brandColor: '#C8102E',
    badge: 'Europski standard',
    features: ['Inovativna pokrića doma', 'Popust na kombinirane police', 'Odlična asistencija'],
  },
  {
    id: 'wiener',
    name: 'Wiener osiguranje VIG d.d.',
    shortName: 'Wiener VIG',
    marketShare: '9.8%',
    rating: 4.8,
    reviewCount: 1420,
    brandColor: '#1E3A8A',
    badge: 'Vienna Insurance Group',
    features: ['Specijalist za imovinu i potres', 'Povoljne franšize', 'Fleksibilno plaćanje na rate'],
  },
  {
    id: 'triglav',
    name: 'Triglav osiguranje d.d.',
    shortName: 'Triglav',
    marketShare: '6.9%',
    rating: 4.7,
    reviewCount: 980,
    brandColor: '#0284C7',
    badge: 'Regionalna snaga',
    features: ['Kompletna zaštita motornih vozila', 'Pokriće tuče i prirodnih nepogoda'],
  },
  {
    id: 'uniqa',
    name: 'UNIQA osiguranje d.d.',
    shortName: 'UNIQA',
    marketShare: '6.1%',
    rating: 4.8,
    reviewCount: 890,
    brandColor: '#0D9488',
    badge: 'Moderna asistencija',
    features: ['Izvrsna zdravstvena pokrića', 'Mobilna asistencija MedUNIQA'],
  },
  {
    id: 'grawe',
    name: 'GRAWE Hrvatska d.d.',
    shortName: 'GRAWE',
    marketShare: '5.8%',
    rating: 4.9,
    reviewCount: 1150,
    brandColor: '#15803D',
    badge: 'Pouzdanost od 1828.',
    features: ['Najbolje ocjene za životna osiguranja', 'Dugoročna financijska stabilnost'],
  },
  {
    id: 'hok',
    name: 'HOK osiguranje d.d.',
    shortName: 'HOK',
    marketShare: '4.5%',
    rating: 4.6,
    reviewCount: 650,
    brandColor: '#D97706',
    badge: 'Brzi domaći servis',
    features: ['Konkurentne auto premije', 'Direktan kontakt s procjeniteljima'],
  },
  {
    id: 'groupama',
    name: 'Groupama osiguranje d.d.',
    shortName: 'Groupama',
    marketShare: '3.0%',
    rating: 4.7,
    reviewCount: 420,
    brandColor: '#059669',
    badge: 'Francuska grupacija',
    features: ['Inovativni digitalni proizvodi', 'Jednostavni procesi ugovaranja'],
  },
];

// 2. Multi-Tier Side-by-Side Coverage Comparison Matrix
export const COVERAGE_TIERS: CoverageComparisonTier[] = [
  {
    id: 'osnovni',
    name: 'Osnovni Paket',
    tagline: 'Zakonito i sigurno pokriće bez suvišnih troškova',
    monthlyPriceStarting: 11.2,
    annualPriceStarting: 134.4,
    includedFeatures: [
      'Zakonito obvezno osiguranje (AO) do 6,45 mil. €',
      'Priznavanje do 50% stečenog bonusa',
      'Zelena karta za putovanja u inozemstvo (PDF)',
      'Osnovna asistencija na cesti (vuča do 50 km)',
      'Pravna pomoć u slučaju prometne nezgode',
    ],
    excludedFeatures: [
      'Puni kasko (šteta na vlastitom vozilu)',
      'Lom stakla bez utjecaja na bonus',
      'Zaštita stečenog bonusa pri prvoj šteti',
      'Zamjensko vozilo do 5 dana',
    ],
    recommendedFor: 'Vozila starija od 8 godina i vozače s urednom poviješću vožnje.',
  },
  {
    id: 'plus',
    name: 'Plus Paket (Najpopularniji)',
    tagline: 'Optimalan omjer cijene i sveobuhvatne zaštite',
    highlightBadge: 'Najčešći odabir 72% vozača',
    monthlyPriceStarting: 19.8,
    annualPriceStarting: 237.6,
    includedFeatures: [
      'Sve iz Osnovnog paketa',
      'Djelomični kasko: lom svih stakala do 500 €',
      'Proširena asistencija 24/7 (HR + Europa, vuča do 200 km)',
      'Zaštita 50% bonusa kod prvog štetnog događaja',
      'Zamjensko vozilo do 3 radna dana',
      'Osiguranje vozača i putnika od nezgode (AO Plus)',
    ],
    excludedFeatures: [
      'Puni kasko od krađe vozila i vandalizma',
      'Zamjensko vozilo duže od 3 dana',
    ],
    recommendedFor: 'Obiteljska i novija rabljena vozila (starost 3 do 8 godina).',
  },
  {
    id: 'premium',
    name: 'Premium Kasko All-Inclusive',
    tagline: 'Beskompromisna sigurnost i mir u svakoj situaciji',
    highlightBadge: 'Maksimalna zaštita',
    monthlyPriceStarting: 34.5,
    annualPriceStarting: 414.0,
    includedFeatures: [
      'Sve iz Plus paketa',
      'Puni kasko bez odbitne franšize (0 €)',
      'Pokriće krađe, provale, požara, udara groma i tuče',
      'Nalet na divljač i štete na parkiralištu',
      'Zamjensko vozilo do 7 dana u slučaju popravka',
      'Neograničena asistencija na cesti u cijeloj Europi',
      'Brza isplata nespornog dijela štete u roku 48h',
    ],
    excludedFeatures: [],
    recommendedFor: 'Nova vozila, vozila na leasing i vozače koji prelaze veće kilometraže.',
  },
];

// 3. Jargon-Free Insurance Glossary
export const GLOSSARY_TERMS: InsuranceGlossaryTerm[] = [
  {
    term: 'Odbitna franšiza',
    slug: 'odbitna-fransiza',
    simpleExplanation:
      'Iznos kojim osiguranik samostalno sudjeluje u trošku popravka kod svake štete (npr. 150 € ili 300 €). Što je franšiza veća, godišnja cijena kasko police je znatno niža.',
    practicalExample:
      'Ako je šteta na autu 1.000 €, a vaša ugovorena franšiza je 150 €, osiguravajuće društvo plaća 850 €, a vi 150 €.',
    legalBasis: 'Članak 948. Zakona o obveznim odnosima',
  },
  {
    term: 'Bonus-malus sustav',
    slug: 'bonus-malus',
    simpleExplanation:
      'Sustav nagrađivanja savjesnih vozača popustom do 50% na osnovnu premiju (bonus) ili povećanja cijene police u slučaju skrivljene prometne nezgode (malus).',
    practicalExample:
      'Svaka godina bez prijavljene štete donosi dodatnih 5% bonusa. Bonus se može prenijeti i na članove uže obitelji sukladno uvjetima osiguratelja.',
    legalBasis: 'Zakon o obveznim osiguranjima u prometu',
  },
  {
    term: 'Vinkulacija police',
    slug: 'vinkulacija',
    simpleExplanation:
      'Prijenos prava na isplatu osigurnine s ugovaratelja na banku ili leasing kuću do potpunog namirenja stambenog ili autokredita.',
    practicalExample:
      'Kod stambenog kredita, polica osiguranja stana vinkulira se u korist banke koja je odobrila kredit.',
    legalBasis: 'Ugovor o kreditu i uvjeti osiguranja imovine',
  },
  {
    term: 'Podosiguranje',
    slug: 'podosiguranje',
    simpleExplanation:
      'Opasna situacija u kojoj je ugovorena svota osiguranja manja od stvarne građevinske vrijednosti imovine. U slučaju štete, isplata se razmjerno umanjuje.',
    practicalExample:
      'Ako kuća vrijedi 200.000 €, a osigurana je na samo 100.000 € (50% vrijednosti), kod štete od 20.000 € osiguranje će isplatiti samo 10.000 €.',
    legalBasis: 'Članak 945. Zakona o obveznim odnosima',
  },
  {
    term: 'IPID obrazac',
    slug: 'ipid-obrazac',
    simpleExplanation:
      'Standardizirani informativni dokument o proizvodu osiguranja na 2 stranice koji sažima što je točno pokriveno, što je isključeno i koje su obveze klijenta.',
    practicalExample:
      'Prije sklapanja bilo koje police, naš agent vam besplatno uručuje IPID kako biste jednostavno usporedili uvjete.',
    legalBasis: 'Direktiva o distribuciji osiguranja (IDD 2016/97)',
  },
];

// 4. Speed Cameras in Croatia (for High-Converting Organic Utility SEO)
export const SPEED_CAMERAS: SpeedCameraLocation[] = [
  { id: 'zg-1', city: 'Zagreb', county: 'Grad Zagreb', street: 'Slavonska avenija kod raskrižja s Čulinečkom', speedLimit: 80, direction: 'Oba smjera' },
  { id: 'zg-2', city: 'Zagreb', county: 'Grad Zagreb', street: 'Avenija Dubrovnik (ispred Muzeja suvremene umjetnosti)', speedLimit: 60, direction: 'Smjer istok' },
  { id: 'zg-3', city: 'Zagreb', county: 'Grad Zagreb', street: 'Aleja Bologne kod Gajnica', speedLimit: 70, direction: 'Smjer zapad' },
  { id: 'st-1', city: 'Split', county: 'Splitsko-dalmatinska', street: 'Ulica Domovinskog rata kod ulaza u grad', speedLimit: 70, direction: 'Smjer centar' },
  { id: 'st-2', city: 'Split', county: 'Splitsko-dalmatinska', street: 'Jadranska magistrala D8 (Podstrana)', speedLimit: 60, direction: 'Oba smjera' },
  { id: 'ri-1', city: 'Rijeka', county: 'Primorsko-goranska', street: 'Riječka obilaznica (čvor Škurinje)', speedLimit: 90, direction: 'Smjer Zagreb/Trst' },
  { id: 'os-1', city: 'Osijek', county: 'Osječko-baranjska', street: 'Južna obilaznica (čvor Frigis)', speedLimit: 110, direction: 'Oba smjera' },
  { id: 'zd-1', city: 'Zadar', county: 'Zadarska', street: 'Jadranska magistrala kod raskrižja s Biogradskom', speedLimit: 60, direction: 'Smjer jug' },
];

// 5. Frequently Asked Questions (FAQ)
export const FREQUENT_QUESTIONS = [
  {
    q: 'Koliko košta usluga posredovanja i savjetovanja preko vaše agencije?',
    a: 'Naša usluga je 100% besplatna za ugovaratelje osiguranja. Našu naknadu podmiruje osiguravajuće društvo kod kojeg odaberete policu, a cijena police je potpuno ista ili povoljnija nego izravno u poslovnici osiguratelja.',
  },
  {
    q: 'Mogu li prenijeti svoj 50% bonus na automobil s drugog člana obitelji?',
    a: 'Da! Većina osiguratelja u Hrvatskoj omogućuje prijenos bonusa između bračnih drugova, roditelja i djece uz predočenje rodnog ili vjenčanog lista i kopije police.',
  },
  {
    q: 'Što je točno upravna pristojba kod prijepisa rabljenog vozila?',
    a: 'Upravna pristojba zamijenila je nekadašnji porez na stjecanje rabljenih motornih vozila. Obračunava se po kilovatu (kW) snage motora i godini starosti vozila te se plaća izravno u stanici za tehnički pregled.',
  },
  {
    q: 'Što trebam učiniti u slučaju prometne nezgode?',
    a: 'Ako nema ozlijeđenih, osigurajte mjesto događaja, uključite sva 4 pokazivača smjera i postavite sigurnosni trokut. Ispunite Europsko izvješće o nezgodi, fotografirajte oštećenja i položaj vozila, te prijavite štetu preko našeg online obrasca ili dežurnog telefona.',
  },
];
