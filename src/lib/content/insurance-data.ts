/**
 * Službeni podaci o poslovanju, osiguravajućim partnerima, zakonskim ogradama i FAQ setovima
 * za tržište osiguranja u Republici Hrvatskoj (AGENCIJA ŽIVOT - ŽIVOT d.o.o. za zastupanje u osiguranju).
 */

export interface CarrierPartner {
  id: string;
  name: string;
  shortName: string;
  marketShare: string;
  solvencyRatio: string;
  claimSpeedScore: string;
  highlight: string;
  isPrimaryPartner?: boolean;
  rating?: number;
  reviewCount?: number;
}

export const CARRIER_PARTNERS: CarrierPartner[] = [
  {
    id: 'generali',
    name: 'Generali osiguranje d.d.',
    shortName: 'Generali',
    marketShare: '12.4%',
    solvencyRatio: '215%',
    claimSpeedScore: '4.9/5',
    highlight: 'Službeni strateški partner Agencije Život & ekskluzivni nositelj programa Toyota Osiguranje',
    isPrimaryPartner: true,
    rating: 4.9,
    reviewCount: 840,
  },
  {
    id: 'toyota',
    name: 'Toyota Osiguranje (Generali × Toyota Centar Zagreb)',
    shortName: 'Toyota Osiguranje',
    marketShare: 'OEM VIP',
    solvencyRatio: '215%',
    claimSpeedScore: '5.0/5',
    highlight: 'Specijalizirano kasko i hibrid/EV osiguranje uz popravak u Toyota Centru Zagreb s originalnim OEM dijelovima',
    isPrimaryPartner: true,
    rating: 5.0,
    reviewCount: 420,
  },
  {
    id: 'croatia',
    name: 'Croatia osiguranje d.d.',
    shortName: 'Croatia',
    marketShare: '25.8%',
    solvencyRatio: '228%',
    claimSpeedScore: '4.8/5',
    highlight: 'Široka mreža procjene šteta i dugogodišnja domaća tradicija',
    rating: 4.8,
    reviewCount: 610,
  },
  {
    id: 'allianz',
    name: 'Allianz Hrvatska d.d.',
    shortName: 'Allianz',
    marketShare: '13.1%',
    solvencyRatio: '240%',
    claimSpeedScore: '4.9/5',
    highlight: 'Vrhunsko dopunsko i dobrovoljno zdravstveno osiguranje s B-listom i telemedicinom',
    rating: 4.9,
    reviewCount: 530,
  },
  {
    id: 'wiener',
    name: 'Wiener osiguranje VIG d.d.',
    shortName: 'Wiener',
    marketShare: '9.6%',
    solvencyRatio: '202%',
    claimSpeedScore: '4.7/5',
    highlight: 'Sveobuhvatni paketi imovinskog osiguranja doma, potresa i poplave',
    rating: 4.7,
    reviewCount: 390,
  },
  {
    id: 'triglav',
    name: 'Triglav osiguranje d.d.',
    shortName: 'Triglav',
    marketShare: '5.2%',
    solvencyRatio: '210%',
    claimSpeedScore: '4.6/5',
    highlight: 'Regionalna snaga i pouzdana asistencija na cestama',
    rating: 4.6,
    reviewCount: 280,
  },
];

export const AGENCY_DETAILS = {
  legalName: 'ŽIVOT d.o.o. za zastupanje u osiguranju',
  brandName: 'AGENCIJA ŽIVOT',
  address: 'Palmotićeva ulica 76',
  city: 'Zagreb',
  postalCode: '10000',
  country: 'Hrvatska',
  oib: '14329077049',
  mbs: '01918940',
  hanfaLicense: 'Klasa: UP/I-983-02/24-01/12',
  hanfaRegisterNumber: 'ZO-01918940',
  phone: '+385 91 450 1458',
  secondaryPhone: '+385 1 4800 120',
  email: 'agencija.zivot@generali.com',
  claimsEmail: 'agencija.zivot@generali.com',
  complaintsEmail: 'agencija.zivot@generali.com',
  toyotaEmailPrimary: 'osiguranje@tcz.hr',
  toyotaEmailSecondary: 'osiguranje2@tcz.hr',
  workingHours: 'Pon – Pet: 08:00 – 18:00 h (Digitalni portal & FNOL 24/7)',
  geoCoordinates: {
    latitude: 45.8082,
    longitude: 15.9835,
  },
  websiteUrl: 'https://agencija-za-osiguranje.web.app',
};

export interface LicensedAgentProfile {
  id: 'diana' | 'hrvoje' | 'laura';
  name: string;
  fullName: string;
  role: string;
  email: string;
  phone: string;
  organization: string;
  licenseNumber: string;
  specialization: string;
  avatarInitials: string;
  badgeColor: string;
}

export const LICENSED_AGENTS: LicensedAgentProfile[] = [
  {
    id: 'diana',
    name: 'Diana',
    fullName: 'Diana — Agencija Život (Generali Partner)',
    role: 'Ovlaštena zastupnica u osiguranju & Voditeljica ureda',
    email: 'agencija.zivot@generali.com',
    phone: '+385 91 450 1458',
    organization: 'ŽIVOT d.o.o. / Generali osiguranje d.d.',
    licenseNumber: 'HANFA Registar zastupnika',
    specialization: 'Životno, imovinsko, zdravstveno, MSP i korporativna osiguranja',
    avatarInitials: 'DI',
    badgeColor: '#C21817',
  },
  {
    id: 'hrvoje',
    name: 'Hrvoje',
    fullName: 'Hrvoje — Toyota Centar Zagreb',
    role: 'Specijalist za Toyota Osiguranje (AO, Kasko & Hybrid/EV)',
    email: 'osiguranje@tcz.hr',
    phone: '+385 91 450 1458',
    organization: 'Toyota Centar Zagreb / Agencija Život',
    licenseNumber: 'HANFA Ovlašteni zastupnik',
    specialization: 'Toyota & Lexus AO/Kasko, zaštita hibridne baterije i flotna vozila',
    avatarInitials: 'HR',
    badgeColor: '#0F172A',
  },
  {
    id: 'laura',
    name: 'Laura',
    fullName: 'Laura — Toyota Centar Zagreb',
    role: 'Savjetnica za prodaju i obnove polica vozila',
    email: 'osiguranje2@tcz.hr',
    phone: '+385 91 450 1458',
    organization: 'Toyota Centar Zagreb / Agencija Život',
    licenseNumber: 'HANFA Ovlašteni zastupnik',
    specialization: 'Obnove polica, leasing kasko paketi, prijava šteta i asistencija',
    avatarInitials: 'LA',
    badgeColor: '#1E293B',
  },
];

export const PAYMENT_METHODS = [
  {
    id: 'corvus',
    name: 'CorvusPay / WSPay',
    description: 'Do 12 rata bez kamata (Visa, Mastercard, Maestro, Diners)',
  },
  {
    id: 'keks',
    name: 'KEKS Pay',
    description: 'Trenutno plaćanje mobitelom u par sekundi',
  },
  {
    id: 'aircash',
    name: 'AirCash Marketplace',
    description: 'Brza uplata bez unosa broja kartice',
  },
  {
    id: 'hub3',
    name: 'HUB 3A 2D Barkod',
    description: 'Uplata skeniranjem barkoda u m-bankarstvu',
  },
];

export const FAQ_DOPUNSKO = [
  {
    question: 'Zašto je HZZO poskupio dopunsko na 15,00 € mjesečno od veljače 2026.?',
    answer:
      'Sukladno odluci Upravnog vijeća HZZO-a, od 1. veljače 2026. cijena police dopunskog zdravstvenog osiguranja iznosi fiksnih 15,00 € mjesečno (180,00 € godišnje) za sve punoljetne osiguranike. Zbog tog rasta, privatna osiguranja (Generali, Allianz, Croatia) postala su znatno povoljnija za osiguranike u dobi od 18 do 50 godina, nudeći cijene već od 6,50 € mjesečno.',
  },
  {
    question: 'Koja je stvarna razlika između HZZO police i privatnog dopunskog osiguranja?',
    answer:
      'I HZZO i privatna polica u 100% iznosu pokrivaju sve zakonske participacije u javnom zdravstvu (bolnički dani, operacije, pregledi specijalista, recepti s osnovne A-liste). No, privatne police u pravilu uključuju i pokriće dopunske B-liste lijekova (nadoplata za originalne lijekove) te m-Doktor telemedicinu 24/7, dok HZZO polica to ne sadrži.',
  },
  {
    question: 'Što je s osiguranicima starijima od 60 godina?',
    answer:
      'Prema našem etičkom aktuarskom savjetovanju, za osobe starije od 60 godina HZZO polica po solidarnoj cijeni od 15,00 €/mj. predstavlja financijski najpovoljniji izbor za osnovne participacije. Privatne police za tu dobnu skupinu preporučujemo isključivo ako klijent izričito traži pokriće B-liste lijekova i pristup privatnim poliklinikama.',
  },
  {
    question: 'Postoji li karenca pri prijelazu s HZZO-a na privatnog osiguratelja?',
    answer:
      'Ako već imate aktivnu policu HZZO-a ili drugog osiguratelja i prelazite bez prekida unutar 30 dana, karenca se u potpunosti ukida (0 dana čekanja). Polica počinje vrijediti odmah od datuma isteka prethodne police.',
  },
];

export const FAQ_AUTO = [
  {
    question: 'Kako se određuje cijena obveznog auto osiguranja (AO) u Hrvatskoj?',
    answer:
      'Cijena se formira aktuarskom formulom na temelju snage motora (kW), registracijskog područja (npr. ZG zona ima veći rizični faktor od OS ili GS zone), povijesti vožnje i stečenog bonusa (od B0 s 0% do B10 s maksimalnih 50% popusta). Dodatni popusti ostvaruju se za obiteljski paket ili ugovaranje kaska.',
  },
  {
    question: 'Mogu li prenijeti 50% bonusa na novo kupljeno vozilo ili drugog člana obitelji?',
    answer:
      'Da. Prema hrvatskoj regulativi i praksi naših partnera, 50% bonusa prenosi se odmah temeljem kupoprodajnog ugovora ili police prethodnog vozila. Također, omogućujemo prijenos bonusa između bračnih drugova i s roditelja na djecu.',
  },
  {
    question: 'Što donosi ekskluzivni Toyota Centar Zagreb — Toyota Osiguranje program?',
    answer:
      'Kao ovlašteni partner Toyota Centra Zagreb i Generali osiguranja d.d., našim klijentima jamčimo popravak isključivo s originalnim OEM dijelovima u ovlaštenom servisu Toyota Centar Zagreb, zaštitu visokonaponske Hybrid/EV baterije, zamjensko Toyota vozilo za vrijeme popravka i paketne popuste za AO + Kasko.',
  },
  {
    question: 'Kada i kako preuzimam policu i Zelenu kartu?',
    answer:
      'Odmah po autorizaciji plaćanja, digitalna polica i međunarodna karta osiguranja (Zelena karta) generiraju se u PDF formatu s QR kodom i šalju na Vaš e-mail, te su trenutno dostupne u Korisničkom portalu. Polica je odmah vidljiva u bazi HUO/MUP-a za tehnički pregled.',
  },
];

export const FAQ_PROPERTY = [
  {
    question: 'Pokriva li osnovno osiguranje stana ili kuće potres?',
    answer:
      'Ne, rizik potresa (zemljotresa) je zasebno dopunsko pokriće. U našim paketima Generali Dom omogućujemo ugovaranje potresa na novu građevinsku vrijednost za građevinski dio i stvari kućanstva uz prilagođenu franšizu.',
  },
  {
    question: 'Što je franšiza kod osiguranja imovine i kako utječe na cijenu?',
    answer:
      'Franšiza je iznos učešća osiguranika u šteti. Ako odaberete franšizu od npr. 150 €, Vaša godišnja premija bit će do 20% niža. Ako odaberete pokriće bez franšize (0 €), osiguranje u cijelosti isplaćuje štetu od prvog eura.',
  },
];

export interface ClaimPhaseDefinition {
  phase: 1 | 2 | 3 | 4 | 5;
  label: string;
  description: string;
}

export const CLAIM_PHASE_LABELS: ClaimPhaseDefinition[] = [
  {
    phase: 1,
    label: '1. Zaprimljeno',
    description: 'Prijava štete (FNOL) evidentirana u sustavu Agencije Život.',
  },
  {
    phase: 2,
    label: '2. Provjera dokumentacije',
    description: 'Zastupnik provjerava Europsko izvješće, policu, fotografije i IBAN.',
  },
  {
    phase: 3,
    label: '3. Predano osiguratelju',
    description: 'Kompletiran spis proslijeđen likvidaturi Generali / Toyota Osiguranja.',
  },
  {
    phase: 4,
    label: '4. Procjena štete',
    description: 'Izvid procjenitelja i odobrenje popravka u ovlaštenom servisu.',
  },
  {
    phase: 5,
    label: '5. Isplata / Riješeno',
    description: 'Odobrena isplata odštete na IBAN osiguranika ili servisu.',
  },
];

export interface ContractStageDefinition {
  stage: 1 | 2 | 3 | 4 | 5;
  label: string;
  description: string;
}

export const CONTRACT_STAGE_LABELS: ContractStageDefinition[] = [
  {
    stage: 1,
    label: '1. Upit i IDD analiza',
    description: 'Zaprimljen zahtjev i proveden HANFA IDD Test zahtjeva i potreba.',
  },
  {
    stage: 2,
    label: '2. Obrada i procjena rizika',
    description: 'Provjera bonusa u HUO bazi, tehničkih parametara i pokrića.',
  },
  {
    stage: 3,
    label: '3. Ponuda poslana klijentu',
    description: 'Informativna ponuda s IPID-om dostupna u Korisničkom portalu.',
  },
  {
    stage: 4,
    label: '4. Potpis i uplata premije',
    description: 'Klijent prihvatio ponudu; SEPA HUB 3A ili kartična autorizacija.',
  },
  {
    stage: 5,
    label: '5. Polica izdana i arhivirana',
    description: 'Polica aktivna u Skadencaru i Korisničkom portalu.',
  },
];

