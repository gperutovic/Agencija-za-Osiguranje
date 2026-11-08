import { jsPDF } from 'jspdf';
import { Policy, Appointment } from '../types/database';

export function formatCurrency(amount?: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0,00 €';
  }
  return new Intl.NumberFormat('hr-HR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(isoDate: string, locale: string = 'hr'): string {
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    return new Intl.DateTimeFormat(locale === 'hr' ? 'hr-HR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  } catch {
    return isoDate;
  }
}

export function formatDateTime(isoDate: string, locale: string = 'hr'): string {
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    return new Intl.DateTimeFormat(locale === 'hr' ? 'hr-HR' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return isoDate;
  }
}

/**
 * Generate official Croatian claim reference (e.g. ST-2026-4819)
 */
export function generateClaimTrackingCode(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `ST-${year}-${randomSuffix}`;
}

/**
 * Generate and download an iCalendar (.ics) invite file
 */
export function downloadAppointmentIcs(appointment: Appointment): void {
  const start = new Date(appointment.dateTime);
  const end = new Date(start.getTime() + 30 * 60000); // 30 mins

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const formatIcsTime = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

  const locationMap = {
    phone: 'Telefonski poziv (+385 91 450 1458)',
    video: 'Generali Video dvorana (Poveznica putem e-pošte)',
    in_person: 'Ured ŽIVOT d.o.o. za zastupanje u osiguranju, Palmotićeva ulica 76, 10000 Zagreb',
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Agencija Zivot d.o.o.//Termin Savjetovanja//HR',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${appointment.id}@agencija-zivot.hr`,
    `DTSTAMP:${formatIcsTime(new Date())}`,
    `DTSTART:${formatIcsTime(start)}`,
    `DTEND:${formatIcsTime(end)}`,
    `SUMMARY:Savjetovanje o osiguranju - ${appointment.topic}`,
    `DESCRIPTION:Sastanak s ovlaštenim zastupnikom Agencije Život (ŽIVOT d.o.o.). Tema: ${appointment.topic}.`,
    `LOCATION:${locationMap[appointment.type]}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Sastanak_Agencija_Zivot_${appointment.id.slice(0, 8)}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Sanitizes text for jsPDF built-in Helvetica (WinAnsiEncoding / Windows-1252).
 * Prevents jsPDF from switching strings containing č, ć, đ, Č, Ć, Đ or symbols (✓, ✗, ℹ)
 * into unrendered 2-byte UTF-16BE streams while keeping š, ž, Š, Ž, €, • intact.
 */
export function toPdfText(input: string): string {
  if (!input) return '';
  return input
    .replace(/č/g, 'c')
    .replace(/ć/g, 'c')
    .replace(/đ/g, 'd')
    .replace(/Č/g, 'C')
    .replace(/Ć/g, 'C')
    .replace(/Đ/g, 'D')
    .replace(/✓/g, '[+]')
    .replace(/✗/g, '[-]')
    .replace(/ℹ/g, '[i]');
}

/**
 * Creates a jsPDF instance whose text() and splitTextToSize() methods automatically
 * sanitize strings through toPdfText() so no line suffers WinAnsiEncoding corruption.
 */
export function createSafePdf(options?: any): jsPDF {
  const doc = options ? new jsPDF(options) : new jsPDF();
  const origText = doc.text.bind(doc);
  const origSplit = doc.splitTextToSize.bind(doc);

  doc.text = ((text: string | string[], x: number, y: number, opts?: any, transform?: any) => {
    const safeText = Array.isArray(text) ? text.map((t) => toPdfText(String(t))) : toPdfText(String(text));
    return origText(safeText as any, x, y, opts, transform);
  }) as any;

  doc.splitTextToSize = ((text: string, maxLen: number, opts?: any) => {
    return origSplit(toPdfText(String(text)), maxLen, opts);
  }) as any;

  return doc;
}

/**
 * Generate client-side PDF certificate using jsPDF
 */
export function generatePolicyCertificatePdf(policy: Policy | any): void {
  const doc = createSafePdf();

  // Header Generali Crimson bar
  doc.setFillColor(194, 24, 23);
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('AGENCIJA ŽIVOT — ŽIVOT d.o.o.', 20, 18);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Ovlašteni zastupnik u osiguranju • Službeni partner Generali osiguranja d.d. & Toyota Centar Zagreb', 20, 26);

  // Policy Title
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SLUŽBENA DIGITALNA POTVRDA O POLICI OSIGURANJA', 20, 50);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Šifra police: ${policy.policyNumber}`, 20, 62);
  doc.text(`Ugovaratelj: ${policy.insuredName || policy.clientName || 'Marko Horvatić'}`, 20, 70);
  doc.text(`Osiguratelj: ${policy.insurer || policy.carrier || 'Generali osiguranje d.d.'}`, 20, 78);
  doc.text(`Predmet / Program: ${policy.assetName || String(policy.type || 'AUTO').toUpperCase()}`, 20, 86);
  doc.text(`Razdoblje valjanosti: ${formatDate(policy.startDate)} do ${formatDate(policy.endDate)}`, 20, 94);
  const prem = policy.premiumAmount ?? policy.premiumAnnual ?? 0;
  doc.text(`Ugovorena premija: ${formatCurrency(prem)} (${policy.paymentFrequency || 'annual'})`, 20, 102);

  // Document Vault files listed
  doc.setFont('helvetica', 'bold');
  doc.text('Priloženi elektronički dokumenti i pokrića:', 20, 118);
  doc.setFont('helvetica', 'normal');

  let y = 126;
  const docs = policy.documents || [];
  docs.forEach((docItem: any) => {
    const docTitle = docItem.title || docItem.name || 'Dokument police';
    const docDate = formatDate(docItem.uploadedAt || policy.startDate);
    doc.text(`• ${docTitle} (evidencija: ${docDate})`, 24, y);
    y += 8;
  });

  if (policy.coverageDetails?.riders?.length) {
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.text('Ugovorena pokrića (Riders):', 20, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    policy.coverageDetails.riders.forEach((rider: string) => {
      doc.text(`• ${rider}`, 24, y);
      y += 7;
    });
  }

  // Regulatory Footnote
  doc.setDrawColor(226, 232, 240);
  doc.line(20, 250, 190, 250);

  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'ŽIVOT d.o.o. za zastupanje u osiguranju | Palmotićeva ulica 76, 10000 Zagreb | OIB: 14329077049 | MBS: 01918940',
    20,
    257
  );
  doc.text(
    'Upisano u registar HANFA-e (Članak 417. Zakona o osiguranju). Kontakt: +385 91 450 1458 | agencija.zivot@generali.com',
    20,
    263
  );

  doc.save(`Polica_${policy.policyNumber}.pdf`);
}

/**
 * Generate official Croatian / European Green Card (Zelena karta / Međunarodna karta osiguranja)
 */
export function generateGreenCardPdf(policy: Policy | any): void {
  const doc = createSafePdf();

  // Distinctive Green Header Bar
  doc.setFillColor(22, 101, 52); // Forest green
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('MEĐUNARODNA KARTA OSIGURANJA VOZILA', 20, 16);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("CARTE INTERNATIONALE D'ASSURANCE AUTOMOBILE (ZELENA KARTA)", 20, 24);

  doc.setFontSize(8);
  doc.text('Hrvatski ured za osiguranje (HUO) • Council of Bureaux', 20, 30);

  // Policy info
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('1. MEĐUNARODNA KARTA OSIGURANJA BR: ' + policy.policyNumber, 20, 48);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`2. Vrijedi od: ${formatDate(policy.startDate)} do: ${formatDate(policy.endDate)}`, 20, 58);
  doc.text(`3. Kod države / Osiguratelj: HR / ${(policy.insurer || policy.carrier || 'Generali osiguranje d.d.').toUpperCase()}`, 20, 66);
  doc.text(`4. Ugovaratelj i osiguranik: ${policy.insuredName || policy.clientName || 'Marko Horvatić'}`, 20, 74);
  doc.text(`5. Registarska oznaka / Br. šasije: ${policy.assetName || policy.id}`, 20, 82);
  doc.text(`6. Kategorija vozila: Osobni automobil (A)`, 20, 90);

  // Grid of countries
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(34, 197, 94);
  doc.rect(20, 102, 170, 75, 'FD');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52);
  doc.text('TERITORIJALNA VALJANOST / VALIDITÉ TERRITORIALE', 25, 112);

  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.text('Vrijedi u svim državama članicama Sustava zelene karte:', 25, 120);
  doc.text('A • B • BG • CY • CZ • D • DK • E • EST • F • FIN • GR • H • HR • I • IRL • IS • L • LT • LV', 25, 128);
  doc.text('M • N • NL • P • PL • RO • S • SK • SLO • CH • AL • AND • BIH • MD • MK • MNE • SRB • TR • UK', 25, 136);

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('* Za države u kojima je ova karta precrtana križićem, pokriće nije ugovoreno.', 25, 146);
  doc.text('Izdano u Zagrebu, Republika Hrvatska. Ovaj dokument je elektronički generiran.', 25, 154);
  doc.text('U slučaju prometne nezgode u inozemstvu, predati duplikat ove karte policiji ili oštećenoj strani.', 25, 162);

  // Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(20, 250, 190, 250);

  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'ŽIVOT d.o.o. za zastupanje u osiguranju • Palmotićeva ulica 76, 10000 Zagreb • OIB: 14329077049 • MBS: 01918940',
    20,
    257
  );
  doc.text(
    'Hrvatski ured za osiguranje (HUO), Martićeva 71, 10000 Zagreb • www.huo.hr',
    20,
    263
  );

  doc.save(`Zelena_Karta_${policy.policyNumber}.pdf`);
}

/**
 * Generate Informative Offer PDF (Informativni izračun ponude)
 */
export function generateInformativeOfferPdf(offer: {
  offerNumber: string;
  clientName: string;
  clientOib: string;
  productTitle: string;
  carrier: string;
  annualPremium?: number;
  annualPremiumEur?: number;
  paymentDynamics?: string;
  deductibleEur?: number;
  assetDescription?: string;
  coverageSummary?: string[];
  coverageHighlights?: string[];
  riders?: string[];
  agentName?: string;
  agentEmail?: string;
  validUntil: string;
}): void {
  const doc = createSafePdf();

  doc.setFillColor(194, 24, 23);
  doc.rect(0, 0, 210, 34, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMATIVNA PONUDA OSIGURANJA', 20, 16);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('ŽIVOT d.o.o. za zastupanje u osiguranju | Generali osiguranje d.d. & Toyota Centar Zagreb Partner', 20, 25);

  const prem = offer.annualPremium ?? offer.annualPremiumEur ?? 0;
  const dynamics = offer.paymentDynamics || 'Mjesečno (12 rata) / Godišnje';
  const deduct = offer.deductibleEur ?? 100;
  const agentName = offer.agentName || 'Diana (Agencija Život)';
  const agentEmail = offer.agentEmail || 'agencija.zivot@generali.com';
  const summaryList = offer.coverageSummary || offer.coverageHighlights || offer.riders || [];

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Broj ponude: ${offer.offerNumber}`, 20, 48);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Klijent / Ugovaratelj: ${offer.clientName} (OIB: ${offer.clientOib})`, 20, 56);
  doc.text(`Proizvod: ${offer.productTitle} ${offer.assetDescription ? `— ${offer.assetDescription}` : ''}`, 20, 64);
  doc.text(`Osiguratelj: ${offer.carrier}`, 20, 72);
  doc.text(`Godišnja premija: ${formatCurrency(prem)} (${dynamics})`, 20, 80);
  doc.text(`Ugovorena franšiza: ${formatCurrency(deduct)}`, 20, 88);
  doc.text(`Valjanost ponude do: ${offer.validUntil}`, 20, 96);
  doc.text(`Ovlašteni zastupnik: ${agentName} (${agentEmail})`, 20, 104);

  doc.setFont('helvetica', 'bold');
  doc.text('Specifikacija pokrića i prednosti:', 20, 118);
  doc.setFont('helvetica', 'normal');
  let y = 126;
  summaryList.forEach((item) => {
    doc.text(`• ${item}`, 24, y);
    y += 7;
  });

  y += 8;
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Napomena sukladno IDD direktivi i Zakonu o osiguranju: Ponuda je kreirana temeljem provedenog Testa zahtjeva i potreba.',
    20,
    y
  );

  doc.setDrawColor(226, 232, 240);
  doc.line(20, 250, 190, 250);
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'ŽIVOT d.o.o. za zastupanje u osiguranju | Palmotićeva ulica 76, 10000 Zagreb | OIB: 14329077049 | MBS: 01918940',
    20,
    257
  );
  doc.text(
    'Kontakt: +385 91 450 1458 | agencija.zivot@generali.com | Registar HANFA-e (Članak 417. Zakona o osiguranju)',
    20,
    263
  );

  doc.save(`Ponuda_${offer.offerNumber}.pdf`);
}

/**
 * Generate Downloadable Europsko izvješće o prometnoj nesreći / Uvjeti osiguranja PDF
 */
export function generateSupportDocumentPdf(docType: 'euro_report' | 'general_terms' | 'toyota_terms'): void {
  const doc = createSafePdf();

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 32, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');

  const title =
    docType === 'euro_report'
      ? 'EUROPSKO IZVJEŠĆE O PROMETNOJ NESREĆI — PREDLOŽAK I UPUTE'
      : docType === 'toyota_terms'
      ? 'UVJETI PROGRAMA TOYOTA OSIGURANJE (GENERALI × TCZ)'
      : 'OPĆI I POSEBNI UVJETI OSIGURANJA (IPID / HANFA IDD)';

  doc.text(title, 20, 16);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('AGENCIJA ŽIVOT (ŽIVOT d.o.o. za zastupanje u osiguranju) • Palmotićeva ulica 76, 10000 Zagreb', 20, 24);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);

  if (docType === 'euro_report') {
    doc.setFont('helvetica', 'bold');
    doc.text('1. OBVEZNI PODACI KOD POPUNJAVANJA EUROPSKOG IZVJEŠĆA:', 20, 48);
    doc.setFont('helvetica', 'normal');
    const lines = [
      '• Datum, sat i točna lokacija prometne nesreće (ulica, kućni broj, grad ili km autoceste).',
      '• Podaci o vozilu A i vozilu B: registarska oznaka, marka, tip i broj šasije (VIN).',
      '• Podaci o osiguratelju i Šifra police obveznog automobilskog osiguranja (AO) i Kasko police.',
      '• Označite točne okolnosti nesreće u središnjoj koloni (polja 1 do 17) i upišite broj označenih polja.',
      '• Nacrtajte skicu sudara s oznakom smjera kretanja vozila A i B te točkom udara.',
      '• Fotografirajte sva 4 kuta vozila, oštećene zone i potpisano Europsko izvješće te prijavite u FNOL centar.',
      '• Dežurna pomoć na cesti 0-24 (HR i EU): +385 91 450 1458 | agencija.zivot@generali.com',
    ];
    let y = 58;
    lines.forEach((l) => {
      doc.text(l, 22, y);
      y += 8;
    });
  } else if (docType === 'toyota_terms') {
    doc.setFont('helvetica', 'bold');
    doc.text('POSEBNE POGODNOSTI PROGRAMA TOYOTA OSIGURANJE (TOYOTA CENTAR ZAGREB):', 20, 48);
    doc.setFont('helvetica', 'normal');
    const lines = [
      '• Jamstvo popravka u ovlaštenom servisu Toyota Centar Zagreb uz 100% originalne OEM dijelove.',
      '• Prošireno pokriće za visokonaponsku Hybrid / EV bateriju, inverter i elektroničke sustave Toyota Safety Sense.',
      '• Uključeno zamjensko vozilo tijekom trajanja kasko popravka u ovlaštenom servisu.',
      '• Paketni popust za istodobno ugovaranje Obveznog AO + Puni Kasko osiguranja.',
      '• Kontakt zastupnika u TCZ: Hrvoje (osiguranje@tcz.hr) i Laura (osiguranje2@tcz.hr).',
    ];
    let y = 58;
    lines.forEach((l) => {
      doc.text(l, 22, y);
      y += 8;
    });
  } else {
    doc.setFont('helvetica', 'bold');
    doc.text('SAŽETAK PREDUUGOVORNIH INFORMACIJA (ČLANAK 417. ZAKONA O OSIGURANJU):', 20, 48);
    doc.setFont('helvetica', 'normal');
    const lines = [
      '• Zastupnik: ŽIVOT d.o.o. za zastupanje u osiguranju, Palmotićeva ulica 76, 10000 Zagreb.',
      '• Identifikatori: OIB: 14329077049, MBS: 01918940, Registar HANFA-e.',
      '• Zastupnik djeluje u ime i za račun društva Generali osiguranje d.d. te partnerskih osiguratelja.',
      '• Naknada: Zastupnik ostvaruje proviziju od društva za osiguranje koja je već uključena u premiju (0 € troška za klijenta).',
      '• Prigovori: Pisani prigovori podnose se na agencija.zivot@generali.com uz zakonski rok odgovora od 15 dana.',
    ];
    let y = 58;
    lines.forEach((l) => {
      doc.text(l, 22, y);
      y += 8;
    });
  }

  doc.setDrawColor(226, 232, 240);
  doc.line(20, 250, 190, 250);
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'ŽIVOT d.o.o. za zastupanje u osiguranju | Palmotićeva ulica 76, 10000 Zagreb | OIB: 14329077049 | MBS: 01918940',
    20,
    257
  );

  doc.save(`Dokument_${docType}_Agencija_Zivot.pdf`);
}
