/**
 * Službeni podaci o poslovanju, partnerskim osigurateljima i FAQ setovima
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
    highlight: 'Strateški partner i nositelj programa Toyota Centar Zagreb VIP Kasko',
    isPrimaryPartner: true,
  },
  {
    id: 'croatia',
    name: 'Croatia osiguranje d.d.',
    shortName: 'Croatia',
    marketShare: '25.8%',
    solvencyRatio: '228%',
    claimSpeedScore: '4.8/5',
    highlight: 'Najšira mreža procjene šteta i dugogodišnja tradicija na domaćem tržištu',
  },
  {
    id: 'allianz',
    name: 'Allianz Hrvatska d.d.',
    shortName: 'Allianz',
    marketShare: '13.1%',
    solvencyRatio: '240%',
    claimSpeedScore: '4.9/5',
    highlight: 'Dopunsko i dodatno zdravstveno osiguranje s pokrićem B-liste lijekova',
  },
  {
    id: 'wiener',
    name: 'Wiener osiguranje VIG d.d.',
    shortName: 'Wiener',
    marketShare: '9.6%',
    solvencyRatio: '202%',
    claimSpeedScore: '4.7/5',
    highlight: 'Paketi osiguranja stana, obiteljske kuće i zaštite od potresa',
  },
  {
    id: 'laqo',
    name: 'LAQO osiguranje (Croatia d.d.)',
    shortName: 'LAQO',
    marketShare: 'Digital',
    solvencyRatio: '228%',
    claimSpeedScore: '4.8/5',
    highlight: 'Online auto ugovaranje i digitalno vođenje polica',
  },
  {
    id: 'triglav',
    name: 'Triglav osiguranje d.d.',
    shortName: 'Triglav',
    marketShare: '5.2%',
    solvencyRatio: '210%',
    claimSpeedScore: '4.6/5',
    highlight: 'Pouzdanost u asistenciji na cesti i programima za obiteljsku imovinu',
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
  workingHours: 'Pon – Pet: 08:00 – 18:00 h',
  geoCoordinates: {
    latitude: 45.8082,
    longitude: 15.9835,
  },
  websiteUrl: 'https://agencija-za-osiguranje.web.app',
};

export const PAYMENT_METHODS = [
  {
    id: 'corvus',
    name: 'CorvusPay / Kartice',
    description: 'Kartično plaćanje do 12 rata bez kamata (Visa, Mastercard, Diners)',
  },
  {
    id: 'hub3',
    name: 'HUB 3A Uplatnica',
    description: 'Standardni SEPA nalog i 2D barkod za mobilno bankarstvo',
  },
  {
    id: 'keks',
    name: 'KEKS Pay',
    description: 'Brzo plaćanje putem mobilne aplikacije',
  },
];

export const FAQ_DOPUNSKO = [
  {
    question: 'Zašto je cijena police HZZO dopunskog zdravstvenog osiguranja porasla na 15,00 € mjesečno?',
    answer:
      'Prema važećoj tarifi od 1. veljače 2026., polica HZZO-a iznosi fiksnih 15,00 € mjesečno (180,00 € godišnje) za sve punoljetne osiguranike neovisno o dobi. Za mlađe i srednje dobne skupine (18–50 godina) privatni osiguratelji poput Allianza, Generali i Croatia osiguranja nude usporedive ili šire police od 6,50 € mjesečno.',
  },
  {
    question: 'Koja je razlika između HZZO police i privatnog dopunskog osiguranja?',
    answer:
      'Obje vrste polica u potpunosti pokrivaju zakonske participacije u javnom zdravstvenom sustavu (specijalistički pregledi, bolničko liječenje, A-lista lijekova). Privatne police u pravilu dodatno obuhvaćaju i doplatu za lijekove s dopunske B-liste te uslugu telefonskog ili video liječničkog savjetovanja.',
  },
  {
    question: 'Što savjetujete osiguranicima starijima od 60 godina?',
    answer:
      'Za osobe starije od 60 godina HZZO polica po jedinstvenoj cijeni od 15,00 € mjesečno u većini slučajeva ostaje najpovoljnija opcija za pokriće participacija. Privatnu policu za tu dobnu skupinu preporučujemo prvenstveno kada postoji izričita potreba za pokrićem lijekova s B-liste ili pregledima u privatnim poliklinikama.',
  },
  {
    question: 'Postoji li rok čekanja (karenca) pri prelasku s HZZO-a na privatnog osiguratelja?',
    answer:
      'Ako prijelaz obavljate bez prekida osiguranja (unutar 30 dana od isteka ili otkaza prethodne police), karenca se ukida i nova polica stupa na snagu odmah od datuma ugovaranja.',
  },
];

export const FAQ_AUTO = [
  {
    question: 'Kako se izračunava premija obveznog auto osiguranja (AO)?',
    answer:
      'Godišnja premija temelji se na snazi motora vozila (kW), registracijskom području, dobi vlasnika i stečenom bonus-malus stupnju (od 0% u B0 do 50% popusta u B10 razredu). Dodatne uštede ostvaruju se ugovaranjem obiteljskih paketa ili kombiniranjem s kasko policom.',
  },
  {
    question: 'Mogu li prenijeti 50% bonusa na drugo vozilo ili člana obitelji?',
    answer:
      'Da. Stečeni bonus od 50% može se prenijeti na novo kupljeno vozilo temeljem kupoprodajnog ugovora ili police prethodnog vozila, kao i između bračnih drugova te s roditelja na djecu uz odgovarajuću dokumentaciju.',
  },
  {
    question: 'Koje pogodnosti uključuje program Toyota Centar Zagreb VIP Kasko?',
    answer:
      'Vlasnicima vozila Toyota u suradnji s Generali osiguranjem i Toyota Centrom Zagreb osiguravamo popravak isključivo originalnim dijelovima u ovlaštenom servisu, zamjensko vozilo za vrijeme popravka i povoljnije uvjete franšize.',
  },
  {
    question: 'Kada dobivam policu i Zelenu kartu za tehnički pregled?',
    answer:
      'Po potvrdi ponude i evidentiranoj uplati, elektronička polica i međunarodna karta osiguranja dostavljaju se putem e-pošte te su dostupne u vašem klijentskom portalu i odmah vidljive u evidenciji stanica za tehnički pregled.',
  },
];

export const FAQ_PROPERTY = [
  {
    question: 'Je li potres automatski uključen u osnovno osiguranje stana ili kuće?',
    answer:
      'Ne, rizik potresa ugovara se kao posebno dopunsko pokriće uz policu imovine. Preporučujemo ugovaranje na punu novu građevinsku vrijednost objekta kako bi u slučaju štete naknada pokrila stvarne troškove obnove.',
  },
  {
    question: 'Što znači franšiza i kada ju je smisleno odabrati?',
    answer:
      'Franšiza predstavlja ugovoreno sudjelovanje osiguranika u svakoj prijavljenoj šteti (primjerice 150 €). Odabir franšize snižava godišnju cijenu police do 20%, dok pokriće bez franšize (0 €) osigurava isplatu od prvog eura priznate štete.',
  },
];
