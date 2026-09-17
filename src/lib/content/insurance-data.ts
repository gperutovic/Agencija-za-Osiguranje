/**
 * Službeni podaci o poslovanju, osiguravajućim partnerima, zakonskim ogradama i FAQ setovima
 * za tržište osiguranja u Republici Hrvatskoj (Agencija Život - ŽIVOT d.o.o.).
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
}

export const CARRIER_PARTNERS: CarrierPartner[] = [
  {
    id: 'generali',
    name: 'Generali osiguranje d.d.',
    shortName: 'Generali',
    marketShare: '12.4%',
    solvencyRatio: '215%',
    claimSpeedScore: '4.9/5',
    highlight: 'Glavni strateški partner & Toyota VIP Kasko program s originalnim dijelovima',
    isPrimaryPartner: true,
  },
  {
    id: 'croatia',
    name: 'Croatia osiguranje d.d.',
    shortName: 'Croatia',
    marketShare: '25.8%',
    solvencyRatio: '228%',
    claimSpeedScore: '4.8/5',
    highlight: 'Najveća mreža procjene šteta i dugogodišnja domaća tradicija',
  },
  {
    id: 'allianz',
    name: 'Allianz Hrvatska d.d.',
    shortName: 'Allianz',
    marketShare: '13.1%',
    solvencyRatio: '240%',
    claimSpeedScore: '4.9/5',
    highlight: 'Vrhunsko dopunsko zdravstveno osiguranje s B-listom i telemedicinom',
  },
  {
    id: 'wiener',
    name: 'Wiener osiguranje VIG d.d.',
    shortName: 'Wiener',
    marketShare: '9.6%',
    solvencyRatio: '202%',
    claimSpeedScore: '4.7/5',
    highlight: 'Odlični paketi imovinskog osiguranja doma i potresa',
  },
  {
    id: 'laqo',
    name: 'LAQO osiguranje (Croatia d.d.)',
    shortName: 'LAQO',
    marketShare: 'Digital',
    solvencyRatio: '228%',
    claimSpeedScore: '4.8/5',
    highlight: 'Digitalno 100% ugovaranje putem mobilne aplikacije uz telematiku',
  },
  {
    id: 'triglav',
    name: 'Triglav osiguranje d.d.',
    shortName: 'Triglav',
    marketShare: '5.2%',
    solvencyRatio: '210%',
    claimSpeedScore: '4.6/5',
    highlight: 'Regionalna snaga i pouzdana asistencija na cestama',
  },
];

export const AGENCY_DETAILS = {
  legalName: 'ŽIVOT d.o.o. za poslove zastupanja u osiguranju',
  brandName: 'Agencija Život',
  address: 'Junija Palmotića 76',
  city: 'Zagreb',
  postalCode: '10000',
  country: 'Republika Hrvatska',
  oib: '14329077049',
  mbs: '080514170',
  hanfaLicense: 'Klasa: UP/I-983-02/24-01/12',
  hanfaRegisterNumber: 'ZO-88912',
  phone: '01 4800 120',
  secondaryPhone: '01 555 0666',
  email: 'osiguranje@agencija-zivot.hr',
  claimsEmail: 'stete@agencija-zivot.hr',
  complaintsEmail: 'prigovori@agencija-zivot.hr',
  workingHours: 'Pon – Pet: 08:00 – 18:00 h (Online 24/7)',
  geoCoordinates: {
    latitude: 45.8082,
    longitude: 15.9835,
  },
  websiteUrl: 'https://agencija-za-osiguranje.web.app',
};

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
      'Sukladno odluci Upravnog vijeća HZZO-a, od 1. veljače 2026. cijena police dopunskog zdravstvenog osiguranja iznosi fiksnih 15,00 € mjesečno (180,00 € godišnje) za sve punoljetne osiguranike. Zbog tog rasta, privatna osiguranja (Allianz, Generali, Croatia) postala su znatno povoljnija za osiguranike u dobi od 18 do 50 godina, nudeći cijene već od 6,50 € mjesečno.',
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
    question: 'Što donosi ekskluzivni Toyota Centar Zagreb VIP Kasko program?',
    answer:
      'Kao ovlašteni partner Toyota Centra Zagreb i Generali osiguranja, našim klijentima jamčimo popravak isključivo s originalnim OEM dijelovima u ovlaštenom servisu, zamjensko Toyota hibridno vozilo za vrijeme popravka, fiksnu franšizu bez skrivenih troškova i 50% popusta na osiguranje doma.',
  },
  {
    question: 'Kada i kako preuzimam policu i Zelenu kartu?',
    answer:
      'Odmah po autorizaciji plaćanja, digitalna polica i međunarodna karta osiguranja (Zelena karta) generiraju se u PDF formatu s QR kodom i šalju na Vaš e-mail, te su trenutno dostupne u portalu "Moj Život". Polica je odmah vidljiva u bazi MUP-a za tehnički pregled.',
  },
];

export const FAQ_PROPERTY = [
  {
    question: 'Pokriva li osnovno osiguranje stana ili kuće potres?',
    answer:
      'Ne, rizik potresa (zemljotresa) je zasebno dopunsko pokriće. U našim paketima "ŽIVOT Dom" omogućujemo ugovaranje potresa bez franšize ili s minimalnom franšizom, pokrivajući građevinski dio i stvari kućanstva na novu nabavnu vrijednost.',
  },
  {
    question: 'Što je franšiza kod osiguranja imovine i kako utječe na cijenu?',
    answer:
      'Franšiza je iznos učešća osiguranika u šteti. Ako odaberete franšizu od npr. 150 €, Vaša godišnja premija bit će do 20% niža. Ako odaberete pokriće bez franšize (0 €), osiguranje u cijelosti isplaćuje štetu od prvog eura.',
  },
];
