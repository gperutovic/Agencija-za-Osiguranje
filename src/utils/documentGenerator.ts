import { BRAND_CONFIG } from '../config/brand';
import { CarrierOffer, PolicyRecord, QuoteSubmission } from '../types/domain';
import { formatDateHr, formatEur } from './formatters';

interface PdfSection {
  heading: string;
  lines: string[];
}

/**
 * Wraps long UTF-8 Croatian text onto a canvas cleanly.
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Encodes a single JPEG dataURL image into a valid binary A4 PDF (595 x 842 pt).
 * Using Canvas rendering guarantees 100% accurate Croatian diacritics (čćžšđČĆŽŠĐ)
 * with zero external font files or third-party PDF bundle bloat.
 */
function buildSinglePagePdfFromJpeg(jpegBytes: Uint8Array, widthPx: number, heightPx: number): Blob {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;

  const pushStr = (s: string) => {
    const bytes = encoder.encode(s);
    chunks.push(bytes);
    length += bytes.length;
  };
  const pushBytes = (b: Uint8Array) => {
    chunks.push(b);
    length += b.length;
  };

  pushStr('%PDF-1.4\n%\xFF\xFF\xFF\xFF\n');

  // Obj 1: Catalog
  offsets.push(length);
  pushStr('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  // Obj 2: Pages
  offsets.push(length);
  pushStr('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');

  // Obj 3: Page (A4 595x842 pt)
  offsets.push(length);
  pushStr(
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n'
  );

  // Obj 4: Image XObject
  offsets.push(length);
  pushStr(
    `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${widthPx} /Height ${heightPx} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`
  );
  pushBytes(jpegBytes);
  pushStr('\nendstream\nendobj\n');

  // Obj 5: Content stream placing image full page
  const contentStream = 'q\n595 0 0 842 0 0 cm\n/Im0 Do\nQ\n';
  offsets.push(length);
  pushStr(
    `5 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}endstream\nendobj\n`
  );

  const xrefOffset = length;
  pushStr(`xref\n0 ${offsets.length + 1}\n`);
  pushStr('0000000000 65535 f \n');
  for (const offset of offsets) {
    pushStr(`${String(offset).padStart(10, '0')} 00000 n \n`);
  }
  pushStr(
    `trailer\n<< /Size ${offsets.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
  );

  return new Blob(chunks as BlobPart[], { type: 'application/pdf' });
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] ?? '';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function renderEditorialPdf(title: string, subtitle: string, badge: string, sections: PdfSection[], filename: string): void {
  const width = 1190;
  const height = 1684;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Pure white A4 canvas
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Top hairline brand strip
  ctx.fillStyle = '#111827';
  ctx.fillRect(72, 72, 10, 44);
  ctx.fillStyle = BRAND_CONFIG.accentHex;
  ctx.fillRect(86, 72, 10, 44);

  ctx.fillStyle = '#111827';
  ctx.font = '700 32px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText(BRAND_CONFIG.brandName, 114, 105);

  ctx.fillStyle = '#6B7280';
  ctx.font = '500 18px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText(`${BRAND_CONFIG.legalName} • HANFA ${BRAND_CONFIG.hanfaRegistrationNumber}`, 114, 132);

  // Right document badge
  ctx.fillStyle = '#FFF0F6';
  ctx.fillRect(width - 360, 74, 288, 42);
  ctx.fillStyle = BRAND_CONFIG.accentHex;
  ctx.font = '700 17px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText(badge, width - 340, 101);

  // Divider
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(72, 162);
  ctx.lineTo(width - 72, 162);
  ctx.stroke();

  // Document Title
  ctx.fillStyle = '#111827';
  ctx.font = '700 38px Georgia, serif';
  ctx.fillText(title, 72, 224);

  ctx.fillStyle = '#4B5563';
  ctx.font = '400 21px "Plus Jakarta Sans", Arial, sans-serif';
  let y = 264;
  for (const sub of wrapText(ctx, subtitle, width - 144)) {
    ctx.fillText(sub, 72, y);
    y += 30;
  }

  y += 24;

  // Sections
  for (const section of sections) {
    if (y > height - 220) break;
    ctx.fillStyle = '#F7F7F5';
    ctx.fillRect(72, y, width - 144, 44);
    ctx.fillStyle = '#111827';
    ctx.font = '700 20px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText(section.heading, 90, y + 29);
    y += 66;

    ctx.fillStyle = '#374151';
    ctx.font = '400 19px "Plus Jakarta Sans", Arial, sans-serif';
    for (const rawLine of section.lines) {
      const wrapped = wrapText(ctx, rawLine, width - 180);
      for (const line of wrapped) {
        if (y > height - 160) break;
        ctx.fillText(line, 90, y);
        y += 28;
      }
      y += 6;
    }
    y += 18;
  }

  // Footer compliance notice
  ctx.strokeStyle = '#E5E7EB';
  ctx.beginPath();
  ctx.moveTo(72, height - 125);
  ctx.lineTo(width - 72, height - 125);
  ctx.stroke();

  ctx.fillStyle = '#6B7280';
  ctx.font = '400 16px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText(
    `${BRAND_CONFIG.legalName} • OIB: ${BRAND_CONFIG.oib} • ${BRAND_CONFIG.address}, ${BRAND_CONFIG.postalCode} ${BRAND_CONFIG.city}`,
    72,
    height - 92
  );
  ctx.fillText(
    `Generirano digitalno: ${formatDateHr(new Date().toISOString())} • Dokument služi za informativnu i pred-ugovornu dokumentaciju sukladno IDD Direktivi.`,
    72,
    height - 64
  );

  const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.92);
  const pdfBlob = buildSinglePagePdfFromJpeg(dataUrlToUint8Array(jpegDataUrl), width, height);
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadIpidPdf(offer: CarrierOffer, productLabel: string): void {
  renderEditorialPdf(
    `IPID — ${productLabel}`,
    `Informativni dokument o proizvodu osiguranja (${offer.ipidCode}) • Osiguratelj: ${offer.carrierName} (${offer.tierLabel})`,
    offer.ipidCode,
    [
      {
        heading: '1. Osnovni podaci i financijski sažetak',
        lines: [
          `Osiguratelj: ${offer.carrierName} (Bonitet: ${offer.rating})`,
          `Informativna godišnja premija: ${formatEur(offer.annualPrice)} | Mjesečno: ${formatEur(offer.monthlyPrice)}`,
          `Ugovorena franšiza: ${formatEur(offer.deductible)} | Limit pokrića: ${formatEur(offer.coverageLimit)}`,
          offer.bundleDiscountPercent > 0
            ? `Uključen paketni popust: -${offer.bundleDiscountPercent}%`
            : 'Pojedinačna polica bez paketnog popusta',
        ],
      },
      {
        heading: '2. Što je osigurano (Ključna pokrića)',
        lines: offer.coveredItems.map((item) => `✓ ${item}`),
      },
      {
        heading: '3. Što nije osigurano (Glavna isključenja)',
        lines: offer.excludedItems.map((item) => `✕ ${item}`),
      },
      {
        heading: '4. Zakonske obavijesti (IDD & HANFA)',
        lines: [
          `Distributer: ${BRAND_CONFIG.legalName}, HANFA upisnik ${BRAND_CONFIG.hanfaRegistrationNumber}.`,
          'Zastupnik djeluje u ime i za račun osiguratelja uz provizijsku naknadu osiguratelja — bez ikakvog dodatnog troška za ugovaratelja.',
          'Ugovor sklopljen na daljinu potrošač može jednostrano raskinuti u roku od 14 dana sukladno Zakonu o zaštiti potrošača.',
        ],
      },
    ],
    `${offer.ipidCode}.pdf`
  );
}

export function downloadQuoteSummaryPdf(quote: QuoteSubmission): void {
  renderEditorialPdf(
    `Sažetak ponude ${quote.referenceNumber}`,
    `Ugovaratelj: ${quote.customer.fullName} (OIB: ${quote.customer.oib}) • Osiguratelj: ${quote.selectedOffer.carrierName}`,
    quote.referenceNumber,
    [
      {
        heading: '1. Odabrana ponuda i premija',
        lines: [
          `Osiguratelj: ${quote.selectedOffer.carrierName} — ${quote.selectedOffer.tierLabel}`,
          `Godišnja premija: ${formatEur(quote.selectedOffer.annualPrice)}`,
          `Mjesečna rata: ${formatEur(quote.selectedOffer.monthlyPrice)}`,
          `Franšiza: ${formatEur(quote.selectedOffer.deductible)} | Limit pokrića: ${formatEur(quote.selectedOffer.coverageLimit)}`,
        ],
      },
      {
        heading: '2. Podaci ugovaratelja i privole',
        lines: [
          `Ime i prezime: ${quote.customer.fullName}`,
          `OIB: ${quote.customer.oib} | Telefon: ${quote.customer.phone} | E-mail: ${quote.customer.email}`,
          `IPID potvrđen: DA | GDPR nužna obrada: DA | Marketing privola: ${quote.consents.gdprMarketing ? 'DA' : 'NE'}`,
          `Vrijeme zapisa privole: ${formatDateHr(quote.consents.timestamp)}`,
        ],
      },
      {
        heading: '3. Uključena pokrića',
        lines: quote.selectedOffer.coveredItems.map((item) => `✓ ${item}`),
      },
    ],
    `Ponuda-${quote.referenceNumber}.pdf`
  );
}

export function downloadPolicyDocumentPdf(policy: PolicyRecord, kind: 'policy' | 'green_card' | 'ipid'): void {
  if (kind === 'green_card') {
    renderEditorialPdf(
      'Međunarodna karta osiguranja (Zelena karta)',
      `Polica: ${policy.policyNumber} • Registracija: ${policy.vehiclePlate ?? 'N/A'} • Izdavatelj: ${policy.carrierName}`,
      policy.greenCardNumber ?? 'HR-ZK-2026',
      [
        {
          heading: '1. Podaci o vozilu i polici',
          lines: [
            `Broj Zelene karte: ${policy.greenCardNumber ?? 'HR/012/2026'}`,
            `Registarska oznaka: ${policy.vehiclePlate ?? 'N/A'}`,
            `Vrijedi od: ${formatDateHr(policy.startDate)} do: ${formatDateHr(policy.expiryDate)}`,
            `Osiguranik: ${policy.clientName} (OIB: ${policy.clientOib})`,
          ],
        },
        {
          heading: '2. Teritorijalno važenje',
          lines: [
            'Vrijedi u svim državama članicama Europskog gospodarskog prostora (EEA), Švicarskoj, Ujedinjenom Kraljevstvu, BiH, Srbiji, Crnoj Gori i ostalim članicama Sustava zelene karte.',
            `24/7 asistencija i prijava štete: ${BRAND_CONFIG.claimsPhone}`,
          ],
        },
      ],
      `Zelena-karta-${policy.policyNumber}.pdf`
    );
    return;
  }

  renderEditorialPdf(
    kind === 'ipid' ? `IPID — ${policy.ipidCode}` : `Polica osiguranja ${policy.policyNumber}`,
    `Osiguranik: ${policy.clientName} (OIB: ${policy.clientOib}) • ${policy.carrierName}`,
    policy.policyNumber,
    [
      {
        heading: '1. Podaci o ugovoru',
        lines: [
          `Broj police: ${policy.policyNumber}`,
          `Osiguratelj: ${policy.carrierName}`,
          `Predmet osiguranja: ${policy.assetSummary}`,
          `Trajanje: ${formatDateHr(policy.startDate)} – ${formatDateHr(policy.expiryDate)}`,
        ],
      },
      {
        heading: '2. Financijski uvjeti',
        lines: [
          `Godišnja premija: ${formatEur(policy.annualPremium)} (${formatEur(policy.monthlyPremium)} / mj.)`,
          `Ugovorena franšiza: ${formatEur(policy.deductible)} | Osigurana svota: ${formatEur(policy.coverageLimit)}`,
          `IPID oznaka: ${policy.ipidCode}`,
        ],
      },
    ],
    `${kind === 'ipid' ? policy.ipidCode : policy.policyNumber}.pdf`
  );
}
