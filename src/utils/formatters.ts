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
    phone: 'Telefonski poziv (Agent kontaktira klijenta)',
    video: 'Generali Video dvorana (Poveznica putem e-pošte)',
    in_person: 'Ured Agencija Život d.o.o., Junija Palmotića 76, 10000 Zagreb',
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
    `DESCRIPTION:Sastanak s ovlaštenim zastupnikom Agencije Život d.o.o. Tema: ${appointment.topic}.`,
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
 * Generate client-side PDF certificate using jsPDF
 */
export function generatePolicyCertificatePdf(policy: Policy): void {
  const doc = new jsPDF();

  // Header navy bar
  doc.setFillColor(10, 25, 47);
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('AGENCIJA ŽIVOT d.o.o.', 20, 18);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Ovlašteni distributer osiguranja • Partner Generali osiguranja d.d.', 20, 26);

  // Policy Title
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SLUŽBENA DIGITALNA POTVRDA O POLICI OSIGURANJA', 20, 50);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Broj police: ${policy.policyNumber}`, 20, 62);
  doc.text(`Ugovaratelj: ${policy.insuredName}`, 20, 70);
  doc.text(`Osiguratelj: ${policy.insurer}`, 20, 78);
  doc.text(`Kategorija pokrića: ${policy.type.toUpperCase()}`, 20, 86);
  doc.text(`Razdoblje valjanosti: ${formatDate(policy.startDate)} do ${formatDate(policy.endDate)}`, 20, 94);
  doc.text(`Ugovorena premija: ${formatCurrency(policy.premiumAmount)} (${policy.paymentFrequency})`, 20, 102);

  // Document Vault files listed
  doc.setFont('helvetica', 'bold');
  doc.text('Priloženi elektronički dokumenti:', 20, 118);
  doc.setFont('helvetica', 'normal');

  let y = 126;
  policy.documents.forEach((docItem) => {
    const docTitle = docItem.title || docItem.name || 'Dokument police';
    const docDate = formatDate(docItem.uploadedAt || policy.startDate);
    doc.text(`• ${docTitle} (evidencija: ${docDate})`, 24, y);
    y += 8;
  });

  // Regulatory Footnote
  doc.setDrawColor(226, 232, 240);
  doc.line(20, 250, 190, 250);

  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'ŽIVOT d.o.o. za poslove zastupanja u osiguranju | Junija Palmotića 76, 10000 Zagreb | OIB: 14329077049 | MBS: 080514170',
    20,
    257
  );
  doc.text(
    'Upisano u registar distributera osiguranja HANFA-e (Klasa: UP/I-983-02/24-01/12). Ugovor ima izravnu pravnu snagu.',
    20,
    263
  );

  doc.save(`Polica_${policy.policyNumber}.pdf`);
}

/**
 * Generate official Croatian / European Green Card (Zelena karta / Međunarodna karta osiguranja)
 */
export function generateGreenCardPdf(policy: Policy): void {
  const doc = new jsPDF();

  // Distinctive Green Header Bar
  doc.setFillColor(22, 101, 52); // Forest green
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('MEĐUNARODNA KARTA OSIGURANJA VOZILA', 20, 16);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('CARTE INTERNATIONALE D\'ASSURANCE AUTOMOBILE (ZELENA KARTA)', 20, 24);

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
  doc.text(`3. Kod države / Osiguratelj: HR / ${policy.insurer.toUpperCase()}`, 20, 66);
  doc.text(`4. Ugovaratelj i osiguranik: ${policy.insuredName}`, 20, 74);
  doc.text(`5. Registarska oznaka / Br. šasije: ZG-1950-AG (ili broj ugovora: ${policy.id})`, 20, 82);
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
    'ŽIVOT d.o.o. za poslove zastupanja u osiguranju • Ovlašteni distributer • Registar HANFA-e',
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

