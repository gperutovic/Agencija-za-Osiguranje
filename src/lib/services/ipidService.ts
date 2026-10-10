import { jsPDF } from 'jspdf';
import { AGENCY_DETAILS } from '../content/insurance-data';

export type IpidProductCategory = 'auto' | 'kasko' | 'dopunsko' | 'imovina' | 'zivot';

interface IpidGeneratorOptions {
  category: IpidProductCategory;
  carrierName?: string;
  productName?: string;
  customDetails?: {
    kw?: number;
    age?: number;
    squareMeters?: number;
    annualPremium?: number;
  };
}

export function generateIpidPdf(options: IpidGeneratorOptions): void {
  const { category, carrierName = 'Generali osiguranje d.d.', productName, customDetails } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [13, 148, 136]; // Teal #0D9488
  const darkSlate = [15, 23, 42]; // Slate-900

  // 1. Header Box
  doc.setFillColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('DOKUMENT S INFORMACIJAMA O PROIZVODU OSIGURANJA (IPID)', 15, 14);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(204, 251, 241); // Teal-100
  doc.text(
    'Usklađeno s Direktivom (EU) 2016/97 (IDD) & čl. 401. Zakona o osiguranju RH',
    15,
    22
  );

  // 2. Insurer & Distributor Metadata
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, 38, 180, 24, 'FD');

  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Društvo za osiguranje:', 18, 44);
  doc.setFont('helvetica', 'normal');
  doc.text(carrierName, 60, 44);

  doc.setFont('helvetica', 'bold');
  doc.text('Ovlašteni zastupnik:', 18, 50);
  doc.setFont('helvetica', 'normal');
  doc.text(`${AGENCY_DETAILS.legalName} (Reg. br: ${AGENCY_DETAILS.hanfaRegisterNumber})`, 60, 50);

  doc.setFont('helvetica', 'bold');
  doc.text('Proizvod osiguranja:', 18, 56);
  doc.setFont('helvetica', 'normal');

  let title = 'Obvezno osiguranje automobilske odgovornosti (AO)';
  let coveredItems: string[] = [];
  let excludedItems: string[] = [];
  let limitsText = '';

  if (category === 'auto') {
    title = productName || 'Obvezno auto osiguranje (AO) & Dopunska pokrića';
    coveredItems = [
      'Materijalne štete nanesene trećim osobama do zakonskog limita od 1.300.000 €',
      'Nematerijalne štete i tjelesne ozljede trećih osoba do zakonskog limita od 6.450.000 €',
      'Troškovi sudskog i izvansudskog postupka te pravne zaštite',
      'Besplatna Zelena karta (Međunarodna karta osiguranja)',
      'Opcija: Zaštita stečenog bonusa (50%) kod prvog štetnog događaja',
      'Opcija: Pokriće loma vjetrobranskog i bočnih stakala bez franšize',
      'Opcija: Pomoć na cesti (asistencija) 24/7 na području RH i Europe',
    ];
    excludedItems = [
      'Štete na vlastitom vozilu koje je skrivio sam vozač (pokriva isključivo kasko)',
      'Štete nastale pod utjecajem alkohola, opojnih droga ili bez vozačke dozvole',
      'Štete nastale tijekom sudjelovanja u neregistriranim utrkama ili natjecanjima',
    ];
    limitsText = 'Limiti: Sukladno Zakonu o obveznim osiguranjima u prometu RH.';
  } else if (category === 'kasko') {
    title = productName || 'Puni Kasko & Toyota Centar Zagreb VIP Program';
    coveredItems = [
      'Materijalna šteta uslijed prometne nezgode, prevrtanja ili slijetanja',
      'Šteta od elementarnih nepogoda (oluja, tuča, grom, snježna lavina)',
      'Požar, eksplozija i pad zrakoplovnih objekata',
      'Provalna krađa, razbojstvo i krađa čitavog vozila',
      'Vandalizam i zlonamjerni postupci trećih osoba',
      'Toyota VIP: Popravak isključivo originalnim OEM dijelovima uz zamjensko vozilo',
    ];
    excludedItems = [
      'Ugovorena odbitna franšiza (0 €, 150 € ili 300 € prema odabiru)',
      'Kvarovi uslijed redovitog trošenja, zamora materijala ili neodržavanja',
    ];
    limitsText = 'Vrijednost pokrića: do novonabavne vrijednosti vozila bez podosiguranja.';
  } else if (category === 'dopunsko') {
    title = productName || 'Dopunsko i Dodatno zdravstveno osiguranje (2026 Reform)';
    coveredItems = [
      '100% pokriće svih zakonskih participacija u javnom zdravstvu RH (HZZO)',
      'Bolničko liječenje, operativni zahvati i dani ležanja u bolnici bez nadoplate',
      'Pregledi liječnika primarne prakse i specijalistički pregledi u bolnicama',
      'Izdavanje lijekova s osnovne A-liste HZZO-a po receptu',
      'Dopunsko pokriće B-liste lijekova (nadoplata za originalne i suvremene lijekove)',
      '24/7 pristup m-Doktor video konzultacijama i telemedicini bez čekanja',
    ];
    excludedItems = [
      'Troškovi estetskih operacija bez medicinske indikacije',
      'Eksperimentalni tretmani koji nisu odobreni od strane HALMED-a',
    ];
    limitsText = 'HZZO 2026 referentna cijena: 15,00 €/mj. vs Privatna polica od 9,50 €/mj.';
  } else if (category === 'imovina') {
    title = productName || 'Osiguranje doma, stvari kućanstva i rizika potresa';
    coveredItems = [
      'Građevinski dio stana/kuće: požar, eksplozija, oluja, udar groma',
      'Izljev vode iz vodovodnih i kanalizacijskih instalacija',
      'Stvari kućanstva: namještaj, tehnika, odjeća na novonabavnu vrijednost',
      'Provalna krađa i razbojstvo',
      'Dopunski rizik potresa (građevinska obnova bez podosiguranja)',
      'Privatna odgovornost prema trećim osobama (npr. poplava susjednog stana)',
    ];
    excludedItems = [
      'Štete nastale uslijed vlage, gljivica ili dugotrajnog neodržavanja',
      'Ratni sukobi i nuklearna kontaminacija',
    ];
    limitsText = 'Građevinska vrijednost: nova građevinska vrijednost bez odbitka amortizacije.';
  }

  doc.text(title, 60, 56);

  let curY = 68;

  // 3. ŠTO JE OSIGURANO?
  doc.setFillColor(236, 253, 245); // Emerald-50
  doc.rect(15, curY, 180, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(5, 150, 105); // Emerald-600
  doc.text('✓  ŠTO JE OSIGURANO?', 18, curY + 5.5);

  curY += 12;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);

  for (const item of coveredItems) {
    doc.text(`•  ${item}`, 20, curY);
    curY += 5;
  }

  curY += 3;

  // 4. ŠTO NIJE OSIGURANO?
  doc.setFillColor(254, 242, 242); // Rose-50
  doc.rect(15, curY, 180, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(225, 29, 72); // Rose-600
  doc.text('✗  ŠTO NIJE OSIGURANO?', 18, curY + 5.5);

  curY += 12;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);

  for (const item of excludedItems) {
    doc.text(`•  ${item}`, 20, curY);
    curY += 5;
  }

  curY += 3;

  // 5. GDJE VRIJEDI POKRIĆE I KOJE SU MOJE OBVEZE?
  doc.setFillColor(241, 245, 249); // Slate-100
  doc.rect(15, curY, 180, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('ℹ  GDJE VRIJEDI POKRIĆE I VAŠE OBVEZE', 18, curY + 5.5);

  curY += 12;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);

  const obligations = [
    'Geografsko područje: Teritorij Republike Hrvatske i država članica sustava Zelene karte / EU.',
    'Obveze ugovaratelja: Točno prijaviti podatke o riziku i pravovremeno podmirivati ugovorene premije.',
    'Postupak kod štete: Prijaviti štetni događaj u roku od 3 radna dana putem 24/7 FNOL portala Agencije Život.',
    'Raskid ugovora: Pravo na jednostrani raskid ugovora sklopljenog na daljinu u roku od 14 dana bez penala.',
    limitsText,
  ];

  for (const item of obligations) {
    if (item) {
      doc.text(`•  ${item}`, 20, curY);
      curY += 5;
    }
  }

  // 6. Regulatory Footer
  curY = Math.max(curY + 6, 260);
  doc.setDrawColor(203, 213, 225);
  doc.line(15, curY, 195, curY);

  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Ovaj sažetak ima isključivo informativnu svrhu sukladno IDD regulativi i ne zamjenjuje cjelovite Opće i Posebne uvjete osiguratelja.',
    15,
    curY + 5
  );
  doc.text(
    `Nadzorno tijelo: HANFA (Hrvatska agencija za nadzor financijskih usluga, Franje Račkoga 6, Zagreb) • Web: www.hanfa.hr`,
    15,
    curY + 9
  );
  doc.text(
    `Dokument izdao: ${AGENCY_DETAILS.legalName} • Datum izdavanja: ${new Date().toLocaleDateString('hr-HR')}`,
    15,
    curY + 13
  );

  const filename = `IPID_Obrazac_${category}_${carrierName.split(' ')[0]}.pdf`;
  doc.save(filename);
}
