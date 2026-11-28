import type { PDFDocument as PDFDocumentType, PDFFont, PDFPage, RGB } from 'pdf-lib';
import { BRAND_CONFIG } from '../config/brand';
import { CarrierOffer, PolicyRecord, QuoteSubmission } from '../types/domain';
import { formatDateHr, formatEur } from './formatters';

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const MARGIN_X = 44;
const CONTENT_WIDTH = A4_WIDTH - MARGIN_X * 2;
const FOOTER_SAFE_Y = 74;

type PdfLibModule = typeof import('pdf-lib');

let pdfDepsPromise: Promise<{ pdfLib: PdfLibModule; fontkit: unknown }> | null = null;

async function loadPdfDeps() {
  if (!pdfDepsPromise) {
    pdfDepsPromise = Promise.all([import('pdf-lib'), import('@pdf-lib/fontkit')]).then(
      ([pdfLib, fk]) => ({ pdfLib, fontkit: fk.default ?? fk })
    );
  }
  return pdfDepsPromise;
}

interface PdfColors {
  INK: RGB;
  INK_SECONDARY: RGB;
  INK_MUTED: RGB;
  ACCENT: RGB;
  ACCENT_SOFT: RGB;
  HAIRLINE: RGB;
  WARM_BG: RGB;
  SUCCESS: RGB;
  SUCCESS_BG: RGB;
  DANGER: RGB;
  DANGER_BG: RGB;
  WARNING: RGB;
  WARNING_BG: RGB;
  WHITE: RGB;
}

function makePalette(rgbFn: PdfLibModule['rgb']): PdfColors {
  return {
    INK: rgbFn(17 / 255, 24 / 255, 39 / 255),
    INK_SECONDARY: rgbFn(75 / 255, 85 / 255, 99 / 255),
    INK_MUTED: rgbFn(107 / 255, 114 / 255, 128 / 255),
    ACCENT: rgbFn(255 / 255, 0 / 255, 110 / 255),
    ACCENT_SOFT: rgbFn(255 / 255, 240 / 255, 246 / 255),
    HAIRLINE: rgbFn(229 / 255, 231 / 255, 235 / 255),
    WARM_BG: rgbFn(247 / 255, 247 / 255, 245 / 255),
    SUCCESS: rgbFn(5 / 255, 150 / 255, 105 / 255),
    SUCCESS_BG: rgbFn(236 / 255, 253 / 255, 245 / 255),
    DANGER: rgbFn(220 / 255, 38 / 255, 38 / 255),
    DANGER_BG: rgbFn(254 / 255, 242 / 255, 242 / 255),
    WARNING: rgbFn(217 / 255, 119 / 255, 6 / 255),
    WARNING_BG: rgbFn(255 / 255, 251 / 255, 235 / 255),
    WHITE: rgbFn(1, 1, 1),
  };
}

let cachedFontsPromise: Promise<{ regular: Uint8Array; bold: Uint8Array }> | null = null;

async function loadFontBytes(): Promise<{ regular: Uint8Array; bold: Uint8Array }> {
  if (cachedFontsPromise) return cachedFontsPromise;

  cachedFontsPromise = (async () => {
    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      const [regRes, boldRes] = await Promise.all([
        fetch('/fonts/DejaVuSans.ttf'),
        fetch('/fonts/DejaVuSans-Bold.ttf'),
      ]);
      if (!regRes.ok || !boldRes.ok) {
        throw new Error('Failed to load embedded Croatian PDF fonts');
      }
      const [regBuf, boldBuf] = await Promise.all([regRes.arrayBuffer(), boldRes.arrayBuffer()]);
      return {
        regular: new Uint8Array(regBuf),
        bold: new Uint8Array(boldBuf),
      };
    }

    // Node.js / Vitest environment fallback (dynamic specifier keeps browser bundle clean)
    const fsSpec = 'node:fs/promises';
    const pathSpec = 'node:path';
    const [{ readFile }, pathMod] = await Promise.all([
      import(/* @vite-ignore */ fsSpec),
      import(/* @vite-ignore */ pathSpec),
    ]);
    const fontsDir = pathMod.resolve(process.cwd(), 'public', 'fonts');
    const [regBuf, boldBuf] = await Promise.all([
      readFile(pathMod.join(fontsDir, 'DejaVuSans.ttf')),
      readFile(pathMod.join(fontsDir, 'DejaVuSans-Bold.ttf')),
    ]);
    return {
      regular: new Uint8Array(regBuf),
      bold: new Uint8Array(boldBuf),
    };
  })();

  return cachedFontsPromise;
}

function wrapTextToWidth(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const paragraphs = text.split('\n');
  const lines: string[] = [];

  for (const para of paragraphs) {
    const words = para.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push('');
      continue;
    }
    let current = '';
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, fontSize) > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

interface VectorPdfContext {
  doc: PDFDocumentType;
  fontRegular: PDFFont;
  fontBold: PDFFont;
  colors: PdfColors;
  pages: PDFPage[];
  page: PDFPage;
  y: number;
  badge: string;
}

async function createVectorContext(title: string, badge: string): Promise<VectorPdfContext> {
  const { pdfLib, fontkit } = await loadPdfDeps();
  const colors = makePalette(pdfLib.rgb);
  const doc = await pdfLib.PDFDocument.create();
  doc.registerFontkit(fontkit as Parameters<PDFDocumentType['registerFontkit']>[0]);
  doc.setTitle(title);
  doc.setAuthor(BRAND_CONFIG.legalName);
  doc.setCreator(`${BRAND_CONFIG.brandName} Digital Insurance Platform`);
  doc.setProducer('pdf-lib vector generator');
  doc.setCreationDate(new Date());

  const { regular, bold } = await loadFontBytes();
  const fontRegular = await doc.embedFont(regular, { subset: true });
  const fontBold = await doc.embedFont(bold, { subset: true });

  const page = doc.addPage([A4_WIDTH, A4_HEIGHT]);
  const ctx: VectorPdfContext = {
    doc,
    fontRegular,
    fontBold,
    colors,
    pages: [page],
    page,
    y: A4_HEIGHT - 44,
    badge,
  };
  drawPageHeader(ctx, true);
  return ctx;
}

function drawPageHeader(ctx: VectorPdfContext, isFirstPage: boolean): void {
  const { page, fontBold, fontRegular, badge, colors } = ctx;
  const topY = A4_HEIGHT - 44;

  // Brand stripe
  page.drawRectangle({ x: MARGIN_X, y: topY - 22, width: 5, height: 22, color: colors.INK });
  page.drawRectangle({ x: MARGIN_X + 7, y: topY - 22, width: 5, height: 22, color: colors.ACCENT });

  page.drawText(`${BRAND_CONFIG.brandName}.`, {
    x: MARGIN_X + 20,
    y: topY - 16,
    size: 16,
    font: fontBold,
    color: colors.INK,
  });

  if (isFirstPage) {
    page.drawText(`${BRAND_CONFIG.legalName}  •  HANFA ${BRAND_CONFIG.hanfaRegistrationNumber}`, {
      x: MARGIN_X + 20,
      y: topY - 29,
      size: 7.5,
      font: fontRegular,
      color: colors.INK_MUTED,
    });
  }

  // Right document badge
  const badgeText = badge.slice(0, 32);
  const badgeW = Math.min(200, Math.max(90, fontBold.widthOfTextAtSize(badgeText, 8.5) + 20));
  page.drawRectangle({
    x: A4_WIDTH - MARGIN_X - badgeW,
    y: topY - 22,
    width: badgeW,
    height: 20,
    color: colors.ACCENT_SOFT,
    borderColor: colors.ACCENT,
    borderWidth: 0.5,
  });
  page.drawText(badgeText, {
    x: A4_WIDTH - MARGIN_X - badgeW + 10,
    y: topY - 15,
    size: 8.5,
    font: fontBold,
    color: colors.ACCENT,
  });

  const dividerY = isFirstPage ? topY - 40 : topY - 30;
  page.drawLine({
    start: { x: MARGIN_X, y: dividerY },
    end: { x: A4_WIDTH - MARGIN_X, y: dividerY },
    thickness: 0.75,
    color: colors.HAIRLINE,
  });

  ctx.y = dividerY - 22;
}

function ensureSpace(ctx: VectorPdfContext, requiredHeight: number): void {
  if (ctx.y - requiredHeight < FOOTER_SAFE_Y) {
    const newPage = ctx.doc.addPage([A4_WIDTH, A4_HEIGHT]);
    ctx.pages.push(newPage);
    ctx.page = newPage;
    drawPageHeader(ctx, false);
  }
}

function drawDocumentTitle(ctx: VectorPdfContext, title: string, subtitle: string): void {
  const titleLines = wrapTextToWidth(title, ctx.fontBold, 18, CONTENT_WIDTH);
  ensureSpace(ctx, titleLines.length * 23 + 40);
  for (const line of titleLines) {
    ctx.page.drawText(line, {
      x: MARGIN_X,
      y: ctx.y,
      size: 18,
      font: ctx.fontBold,
      color: ctx.colors.INK,
    });
    ctx.y -= 23;
  }
  const subLines = wrapTextToWidth(subtitle, ctx.fontRegular, 9.5, CONTENT_WIDTH);
  for (const line of subLines) {
    ctx.page.drawText(line, {
      x: MARGIN_X,
      y: ctx.y,
      size: 9.5,
      font: ctx.fontRegular,
      color: ctx.colors.INK_SECONDARY,
    });
    ctx.y -= 14;
  }
  ctx.y -= 10;
}

function drawSectionHeading(ctx: VectorPdfContext, heading: string, accentColor?: RGB): void {
  ensureSpace(ctx, 42);
  ctx.page.drawRectangle({
    x: MARGIN_X,
    y: ctx.y - 18,
    width: CONTENT_WIDTH,
    height: 22,
    color: ctx.colors.WARM_BG,
  });
  ctx.page.drawRectangle({
    x: MARGIN_X,
    y: ctx.y - 18,
    width: 3,
    height: 22,
    color: accentColor ?? ctx.colors.INK,
  });
  ctx.page.drawText(heading, {
    x: MARGIN_X + 10,
    y: ctx.y - 11,
    size: 10,
    font: ctx.fontBold,
    color: ctx.colors.INK,
  });
  ctx.y -= 32;
}

function drawBulletLines(
  ctx: VectorPdfContext,
  lines: string[],
  options?: { prefix?: string; prefixColor?: RGB; indent?: number }
): void {
  const indent = options?.indent ?? 8;
  const maxWidth = CONTENT_WIDTH - indent - (options?.prefix ? 14 : 0);

  for (const raw of lines) {
    const wrapped = wrapTextToWidth(raw, ctx.fontRegular, 9.2, maxWidth);
    const blockHeight = wrapped.length * 13.5 + 4;
    ensureSpace(ctx, blockHeight);

    if (options?.prefix) {
      ctx.page.drawText(options.prefix, {
        x: MARGIN_X + indent,
        y: ctx.y,
        size: 9.2,
        font: ctx.fontBold,
        color: options.prefixColor ?? ctx.colors.INK,
      });
    }

    for (const line of wrapped) {
      ctx.page.drawText(line, {
        x: MARGIN_X + indent + (options?.prefix ? 14 : 0),
        y: ctx.y,
        size: 9.2,
        font: ctx.fontRegular,
        color: ctx.colors.INK_SECONDARY,
      });
      ctx.y -= 13.5;
    }
    ctx.y -= 3;
  }
  ctx.y -= 8;
}

function drawKeyValueGrid(
  ctx: VectorPdfContext,
  rows: Array<{ label: string; value: string }>
): void {
  const colW = CONTENT_WIDTH / 2 - 6;
  for (let i = 0; i < rows.length; i += 2) {
    const left = rows[i]!;
    const right = rows[i + 1];
    ensureSpace(ctx, 36);

    ctx.page.drawRectangle({
      x: MARGIN_X,
      y: ctx.y - 26,
      width: colW,
      height: 30,
      color: ctx.colors.WHITE,
      borderColor: ctx.colors.HAIRLINE,
      borderWidth: 0.6,
    });
    ctx.page.drawText(left.label, {
      x: MARGIN_X + 8,
      y: ctx.y - 7,
      size: 7.5,
      font: ctx.fontRegular,
      color: ctx.colors.INK_MUTED,
    });
    ctx.page.drawText(left.value.slice(0, 42), {
      x: MARGIN_X + 8,
      y: ctx.y - 20,
      size: 9.5,
      font: ctx.fontBold,
      color: ctx.colors.INK,
    });

    if (right) {
      const rx = MARGIN_X + colW + 12;
      ctx.page.drawRectangle({
        x: rx,
        y: ctx.y - 26,
        width: colW,
        height: 30,
        color: ctx.colors.WHITE,
        borderColor: ctx.colors.HAIRLINE,
        borderWidth: 0.6,
      });
      ctx.page.drawText(right.label, {
        x: rx + 8,
        y: ctx.y - 7,
        size: 7.5,
        font: ctx.fontRegular,
        color: ctx.colors.INK_MUTED,
      });
      ctx.page.drawText(right.value.slice(0, 42), {
        x: rx + 8,
        y: ctx.y - 20,
        size: 9.5,
        font: ctx.fontBold,
        color: ctx.colors.INK,
      });
    }
    ctx.y -= 38;
  }
  ctx.y -= 6;
}

/**
 * Draws a deterministic vector verification matrix (stylized QR checksum block)
 * derived from the document reference string.
 */
function drawVerificationMatrix(
  page: PDFPage,
  x: number,
  y: number,
  size: number,
  seed: string,
  colors: PdfColors
): void {
  const cells = 11;
  const cellSize = size / cells;
  page.drawRectangle({
    x: x - 3,
    y: y - 3,
    width: size + 6,
    height: size + 6,
    color: colors.WHITE,
    borderColor: colors.HAIRLINE,
    borderWidth: 0.6,
  });

  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      const isCornerFinder =
        (r < 3 && c < 3) || (r < 3 && c >= cells - 3) || (r >= cells - 3 && c < 3);
      const bit = ((hash >>> ((r * cells + c) % 24)) ^ (r * 7 + c * 13)) & 1;
      if (isCornerFinder || bit === 1) {
        page.drawRectangle({
          x: x + c * cellSize,
          y: y + (cells - 1 - r) * cellSize,
          width: cellSize - 0.3,
          height: cellSize - 0.3,
          color: colors.INK,
        });
      }
    }
  }
}

function finalizeFooters(ctx: VectorPdfContext): void {
  const totalPages = ctx.pages.length;
  const generatedStr = formatDateHr(new Date().toISOString());

  ctx.pages.forEach((p, idx) => {
    p.drawLine({
      start: { x: MARGIN_X, y: 58 },
      end: { x: A4_WIDTH - MARGIN_X, y: 58 },
      thickness: 0.6,
      color: ctx.colors.HAIRLINE,
    });
    p.drawText(
      `${BRAND_CONFIG.legalName} • OIB: ${BRAND_CONFIG.oib} • ${BRAND_CONFIG.address}, ${BRAND_CONFIG.postalCode} ${BRAND_CONFIG.city}`,
      {
        x: MARGIN_X,
        y: 44,
        size: 7.2,
        font: ctx.fontRegular,
        color: ctx.colors.INK_MUTED,
      }
    );
    p.drawText(
      `Generirano digitalno: ${generatedStr} • HANFA upisnik ${BRAND_CONFIG.hanfaRegistrationNumber} • EU IDD (2016/97)`,
      {
        x: MARGIN_X,
        y: 33,
        size: 7.2,
        font: ctx.fontRegular,
        color: ctx.colors.INK_MUTED,
      }
    );
    const pageLabel = `Stranica ${idx + 1} / ${totalPages}`;
    const labelW = ctx.fontBold.widthOfTextAtSize(pageLabel, 7.5);
    p.drawText(pageLabel, {
      x: A4_WIDTH - MARGIN_X - labelW,
      y: 38,
      size: 7.5,
      font: ctx.fontBold,
      color: ctx.colors.INK_SECONDARY,
    });
  });
}

function triggerPdfDownload(bytes: Uint8Array, filename: string): void {
  if (typeof document === 'undefined' || typeof URL === 'undefined') return;
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/**
 * 1. EU Standardized IPID (Insurance Product Information Document) — Multi-Page Vector PDF
 */
export async function buildIpidPdfBytes(
  offer: CarrierOffer,
  productLabel: string
): Promise<Uint8Array> {
  const ctx = await createVectorContext(`IPID — ${productLabel}`, offer.ipidCode);

  drawDocumentTitle(
    ctx,
    `IPID — ${productLabel}`,
    `Informativni dokument o proizvodu osiguranja (${offer.ipidCode}) • Osiguratelj: ${offer.carrierName} (${offer.tierLabel})`
  );

  drawKeyValueGrid(ctx, [
    { label: 'Osiguratelj i bonitet', value: `${offer.carrierName} (${offer.rating})` },
    { label: 'Paket i IPID oznaka', value: `${offer.tierLabel} • ${offer.ipidCode}` },
    {
      label: 'Informativna godišnja premija',
      value: `${formatEur(offer.annualPrice)} (${formatEur(offer.monthlyPrice)} / mj.)`,
    },
    {
      label: 'Franšiza i gornji limit pokrića',
      value: `${formatEur(offer.deductible)}  |  Limit: ${formatEur(offer.coverageLimit)}`,
    },
  ]);

  // EU Standardized 2-column Summary Banner (Green Covered vs Red Excluded)
  const colGap = 14;
  const colW = (CONTENT_WIDTH - colGap) / 2;
  const coveredWrapped = offer.coveredItems.flatMap((it) =>
    wrapTextToWidth(`+ ${it}`, ctx.fontRegular, 8.6, colW - 18)
  );
  const excludedWrapped = offer.excludedItems.flatMap((it) =>
    wrapTextToWidth(`× ${it}`, ctx.fontRegular, 8.6, colW - 18)
  );

  // If both columns fit on current page, draw standardized EU 2-column boxes side-by-side
  const maxLines = Math.max(coveredWrapped.length, excludedWrapped.length);
  const boxHeight = Math.max(90, maxLines * 12.5 + 36);
  if (boxHeight <= 340) {
    ensureSpace(ctx, boxHeight + 16);
    const topBoxY = ctx.y;

    // Left: Covered (Green)
    ctx.page.drawRectangle({
      x: MARGIN_X,
      y: topBoxY - boxHeight,
      width: colW,
      height: boxHeight,
      color: ctx.colors.SUCCESS_BG,
      borderColor: ctx.colors.SUCCESS,
      borderWidth: 0.75,
    });
    ctx.page.drawText('[✓] Što je osigurano?', {
      x: MARGIN_X + 10,
      y: topBoxY - 18,
      size: 9.5,
      font: ctx.fontBold,
      color: ctx.colors.SUCCESS,
    });
    let ly = topBoxY - 34;
    for (const line of coveredWrapped) {
      ctx.page.drawText(line, {
        x: MARGIN_X + 10,
        y: ly,
        size: 8.6,
        font: ctx.fontRegular,
        color: ctx.colors.INK,
      });
      ly -= 12.5;
    }

    // Right: Excluded (Red)
    const rx = MARGIN_X + colW + colGap;
    ctx.page.drawRectangle({
      x: rx,
      y: topBoxY - boxHeight,
      width: colW,
      height: boxHeight,
      color: ctx.colors.DANGER_BG,
      borderColor: ctx.colors.DANGER,
      borderWidth: 0.75,
    });
    ctx.page.drawText('[×] Što nije osigurano?', {
      x: rx + 10,
      y: topBoxY - 18,
      size: 9.5,
      font: ctx.fontBold,
      color: ctx.colors.DANGER,
    });
    let ry = topBoxY - 34;
    for (const line of excludedWrapped) {
      ctx.page.drawText(line, {
        x: rx + 10,
        y: ry,
        size: 8.6,
        font: ctx.fontRegular,
        color: ctx.colors.INK,
      });
      ry -= 12.5;
    }

    ctx.y = topBoxY - boxHeight - 16;
  } else {
    drawSectionHeading(ctx, 'Što je osigurano (Ključna pokrića)', ctx.colors.SUCCESS);
    drawBulletLines(ctx, offer.coveredItems, { prefix: '✓', prefixColor: ctx.colors.SUCCESS });
    drawSectionHeading(ctx, 'Što nije osigurano (Glavna isključenja)', ctx.colors.DANGER);
    drawBulletLines(ctx, offer.excludedItems, { prefix: '×', prefixColor: ctx.colors.DANGER });
  }

  // Amber Box: Restrictions & Deductibles
  const restrictionLines = [
    offer.deductible > 0
      ? `Ugovorena franšiza (vlastito sudjelovanje u šteti): ${formatEur(offer.deductible)} po štetnom događaju.`
      : 'Ova ponuda nema ugovorenu obveznu franšizu (0,00 €).',
    offer.bundleDiscountPercent > 0
      ? `Aktivan paketni popust: -${offer.bundleDiscountPercent}% (osnovna godišnja premija bez popusta: ${formatEur(offer.baseAnnualBeforeBundle)}).`
      : 'Pojedinačna polica bez dodatnog paketnog popusta.',
    'Potpune ugovorne odredbe i opći uvjeti osiguratelja dostavljaju se prije sklapanja obvezujućeg ugovora.',
  ];
  const restWrapped = restrictionLines.flatMap((l) =>
    wrapTextToWidth(`! ${l}`, ctx.fontRegular, 8.8, CONTENT_WIDTH - 20)
  );
  const restHeight = restWrapped.length * 13 + 32;
  ensureSpace(ctx, restHeight + 12);
  const restTop = ctx.y;
  ctx.page.drawRectangle({
    x: MARGIN_X,
    y: restTop - restHeight,
    width: CONTENT_WIDTH,
    height: restHeight,
    color: ctx.colors.WARNING_BG,
    borderColor: ctx.colors.WARNING,
    borderWidth: 0.75,
  });
  ctx.page.drawText('[!] Ograničenja pokrića i franšiza', {
    x: MARGIN_X + 10,
    y: restTop - 18,
    size: 9.5,
    font: ctx.fontBold,
    color: ctx.colors.WARNING,
  });
  let wy = restTop - 33;
  for (const line of restWrapped) {
    ctx.page.drawText(line, {
      x: MARGIN_X + 10,
      y: wy,
      size: 8.8,
      font: ctx.fontRegular,
      color: ctx.colors.INK,
    });
    wy -= 13;
  }
  ctx.y = restTop - restHeight - 18;

  // Regulatory & Consumer Rights Section (automatically flows to page 2 if needed)
  drawSectionHeading(ctx, 'Zakonske obavijesti (EU IDD 2016/97 & Zakon o osiguranju RH)', ctx.colors.ACCENT);
  drawBulletLines(ctx, [
    `Distributer: ${BRAND_CONFIG.legalName}, ${BRAND_CONFIG.address}, ${BRAND_CONFIG.postalCode} ${BRAND_CONFIG.city}, OIB: ${BRAND_CONFIG.oib}, MBS: ${BRAND_CONFIG.mbs}.`,
    `Upis u registar HANFA: ${BRAND_CONFIG.hanfaRegistrationNumber} (${BRAND_CONFIG.hanfaRegistryUrl}).`,
    'Naknada: Agencija djeluje kao ovlašteni zastupnik u osiguranju i prima isključivo proviziju od osiguravajućih društava — bez ikakvog dodatnog troška (0,00 €) za ugovaratelja.',
    'Pravo na jednostrani raskid: Potrošač ima pravo u roku od 14 dana raskinuti ugovor sklopljen na daljinu bez navođenja razloga sukladno Zakonu o zaštiti potrošača.',
    `Prigovori potrošača (čl. 401.): ${BRAND_CONFIG.complaintsEmail} • Zakonski rok odgovora: 15 dana • Izvansudsko mirenje: Centar za mirenje pri HUO (${BRAND_CONFIG.huoMediationUrl}).`,
  ]);

  finalizeFooters(ctx);
  return ctx.doc.save();
}

/**
 * 2. Binding Quote Summary PDF + Croatian HUB-3A Payment Slip Reference & Verification QR
 */
export async function buildQuoteSummaryPdfBytes(quote: QuoteSubmission): Promise<Uint8Array> {
  const ctx = await createVectorContext(
    `Sažetak ponude ${quote.referenceNumber}`,
    quote.referenceNumber
  );

  drawDocumentTitle(
    ctx,
    `Sažetak ponude ${quote.referenceNumber}`,
    `Ugovaratelj: ${quote.customer.fullName} (OIB: ${quote.customer.oib}) • Osiguratelj: ${quote.selectedOffer.carrierName}`
  );

  drawSectionHeading(ctx, '1. Odabrana ponuda i financijski sažetak', ctx.colors.ACCENT);
  drawKeyValueGrid(ctx, [
    { label: 'Osiguratelj', value: `${quote.selectedOffer.carrierName}` },
    { label: 'Paket i IPID oznaka', value: `${quote.selectedOffer.tierLabel} (${quote.selectedOffer.ipidCode})` },
    { label: 'Godišnja / ukupna premija', value: formatEur(quote.selectedOffer.annualPrice) },
    {
      label: quote.productLine === 'putno' ? 'Obračun' : 'Mjesečna rata',
      value:
        quote.productLine === 'putno'
          ? 'Jednokratno za putovanje'
          : `${formatEur(quote.selectedOffer.monthlyPrice)} / mj.`,
    },
    { label: 'Franšiza', value: formatEur(quote.selectedOffer.deductible) },
    { label: 'Limit pokrića', value: formatEur(quote.selectedOffer.coverageLimit) },
  ]);

  drawSectionHeading(ctx, '2. Podaci ugovaratelja i revizijski zapis privola (GDPR / IDD)');
  drawBulletLines(ctx, [
    `Ime i prezime: ${quote.customer.fullName}`,
    `OIB: ${quote.customer.oib}  |  Telefon: ${quote.customer.phone}  |  E-mail: ${quote.customer.email}`,
    quote.customer.iban ? `IBAN (SEPA): ${quote.customer.iban}` : 'Način plaćanja: Internet bankarstvo / HUB-3A uplatnica',
    `IPID potvrđen: DA  |  GDPR nužna obrada: DA  |  Marketing privola: ${quote.consents.gdprMarketing ? 'DA' : 'NE'}`,
    `Vremenska oznaka privole: ${formatDateHr(quote.consents.timestamp)} (verzija politike ${quote.consents.policyVersion})`,
  ]);

  drawSectionHeading(ctx, '3. Uključena pokrića i glavna isključenja', ctx.colors.SUCCESS);
  drawBulletLines(ctx, quote.selectedOffer.coveredItems, { prefix: '✓', prefixColor: ctx.colors.SUCCESS });
  drawBulletLines(ctx, quote.selectedOffer.excludedItems, { prefix: '×', prefixColor: ctx.colors.DANGER });

  // Croatian HUB-3A Payment Reference Block + Verification Matrix
  const hubHeight = 114;
  ensureSpace(ctx, hubHeight + 16);
  const hubTop = ctx.y;
  ctx.page.drawRectangle({
    x: MARGIN_X,
    y: hubTop - hubHeight,
    width: CONTENT_WIDTH,
    height: hubHeight,
    color: ctx.colors.WARM_BG,
    borderColor: ctx.colors.INK,
    borderWidth: 0.75,
  });

  const numericRef = quote.referenceNumber.replace(/[^0-9]/g, '') || '20260001';
  ctx.page.drawText('HUB-3A REFERENCA ZA PLAĆANJE (informativni predložak nakon potvrde police)', {
    x: MARGIN_X + 12,
    y: hubTop - 18,
    size: 8.5,
    font: ctx.fontBold,
    color: ctx.colors.INK,
  });

  const hubLines = [
    `Primatelj: ${quote.selectedOffer.carrierName} (putem ${BRAND_CONFIG.legalName})`,
    `IBAN primatelja: ${BRAND_CONFIG.paymentIban}   |   Valuta: EUR   |   Iznos: ${formatEur(quote.selectedOffer.annualPrice)}`,
    `Model: HR00   |   Poziv na broj primatelja: ${numericRef}`,
    `Platitelj: ${quote.customer.fullName}, OIB: ${quote.customer.oib}`,
    `Opis plaćanja: Premija osiguranja po ponudi ${quote.referenceNumber} (${quote.productLine.toUpperCase()})`,
  ];
  let hy = hubTop - 36;
  for (const line of hubLines) {
    ctx.page.drawText(line, {
      x: MARGIN_X + 12,
      y: hy,
      size: 8.4,
      font: ctx.fontRegular,
      color: ctx.colors.INK_SECONDARY,
    });
    hy -= 14;
  }

  drawVerificationMatrix(
    ctx.page,
    A4_WIDTH - MARGIN_X - 78,
    hubTop - hubHeight + 22,
    64,
    `${quote.referenceNumber}|${quote.customer.oib}|${quote.selectedOffer.annualPrice}`,
    ctx.colors
  );
  ctx.page.drawText('VERIFIKACIJA', {
    x: A4_WIDTH - MARGIN_X - 76,
    y: hubTop - hubHeight + 8,
    size: 6.5,
    font: ctx.fontBold,
    color: ctx.colors.INK_MUTED,
  });
  ctx.y = hubTop - hubHeight - 16;

  finalizeFooters(ctx);
  return ctx.doc.save();
}

/**
 * 3. Policy Certificate / Green Card / Policy IPID — Multi-Page Vector PDF
 */
export async function buildPolicyDocumentPdfBytes(
  policy: PolicyRecord,
  kind: 'policy' | 'green_card' | 'ipid'
): Promise<Uint8Array> {
  if (kind === 'green_card') {
    const gcNumber = policy.greenCardNumber || `HR/012/${policy.policyNumber.slice(-6)}`;
    const ctx = await createVectorContext('Međunarodna karta osiguranja (Zelena karta)', gcNumber);

    // Official Green Card Accent Banner
    ensureSpace(ctx, 56);
    ctx.page.drawRectangle({
      x: MARGIN_X,
      y: ctx.y - 44,
      width: CONTENT_WIDTH,
      height: 44,
      color: ctx.colors.SUCCESS_BG,
      borderColor: ctx.colors.SUCCESS,
      borderWidth: 1,
    });
    ctx.page.drawText('MEĐUNARODNA KARTA OSIGURANJA AUTOMOBILSKE ODGOVORNOSTI', {
      x: MARGIN_X + 12,
      y: ctx.y - 19,
      size: 10.5,
      font: ctx.fontBold,
      color: ctx.colors.SUCCESS,
    });
    ctx.page.drawText('INTERNATIONAL MOTOR INSURANCE CARD  •  CARTE INTERNATIONALE D\'ASSURANCE AUTOMOBILE', {
      x: MARGIN_X + 12,
      y: ctx.y - 34,
      size: 7.5,
      font: ctx.fontRegular,
      color: ctx.colors.INK_SECONDARY,
    });
    ctx.y -= 60;

    drawKeyValueGrid(ctx, [
      { label: 'Broj Zelene karte / Country Code', value: gcNumber },
      { label: 'Broj police osiguranja', value: policy.policyNumber },
      { label: 'Registarska oznaka vozila', value: policy.vehiclePlate ?? 'N/A' },
      { label: 'Osiguratelj (Izdavatelj)', value: policy.carrierName },
      { label: 'Vrijedi od (Valid From)', value: formatDateHr(policy.startDate) },
      { label: 'Vrijedi do (Valid To)', value: formatDateHr(policy.expiryDate) },
      { label: 'Osiguranik (Policyholder)', value: policy.clientName },
      { label: 'OIB osiguranika', value: policy.clientOib },
    ]);

    drawSectionHeading(ctx, 'Teritorijalno važenje (Države članice Sustava zelene karte)', ctx.colors.SUCCESS);
    const countries = [
      'A', 'AL', 'AND', 'AZ', 'B', 'BG', 'BIH', 'CH', 'CY', 'CZ', 'D', 'DK', 'E', 'EST',
      'F', 'FIN', 'GB', 'GR', 'H', 'HR', 'I', 'IRL', 'IS', 'L', 'LT', 'LV', 'M', 'MD',
      'MK', 'MNE', 'N', 'NL', 'P', 'PL', 'RO', 'S', 'SK', 'SLO', 'SRB', 'TR', 'UA',
    ];
    const cellW = CONTENT_WIDTH / 11;
    const cellH = 22;
    const totalRows = Math.ceil(countries.length / 11);
    ensureSpace(ctx, totalRows * cellH + 20);
    for (let i = 0; i < countries.length; i++) {
      const col = i % 11;
      const row = Math.floor(i / 11);
      const cx = MARGIN_X + col * cellW;
      const cy = ctx.y - (row + 1) * cellH;
      ctx.page.drawRectangle({
        x: cx,
        y: cy,
        width: cellW,
        height: cellH,
        color: countries[i] === 'HR' ? ctx.colors.SUCCESS_BG : ctx.colors.WHITE,
        borderColor: ctx.colors.HAIRLINE,
        borderWidth: 0.6,
      });
      ctx.page.drawText(countries[i]!, {
        x: cx + 10,
        y: cy + 7,
        size: 8.5,
        font: countries[i] === 'HR' ? ctx.fontBold : ctx.fontRegular,
        color: countries[i] === 'HR' ? ctx.colors.SUCCESS : ctx.colors.INK,
      });
    }
    ctx.y -= totalRows * cellH + 20;

    drawSectionHeading(ctx, '24/7 Asistencija i prijava štete u inozemstvu');
    drawBulletLines(ctx, [
      `Hitna asistencija i prijava štete (${BRAND_CONFIG.brandName}): ${BRAND_CONFIG.claimsPhone} • ${BRAND_CONFIG.email}`,
      'U slučaju prometne nezgode u inozemstvu ispunite Europsko izvješće o nezgodi, fotografirajte oštećenja i kontaktirajte asistencijski centar.',
      `Predmet osiguranja: ${policy.assetSummary}`,
    ]);

    finalizeFooters(ctx);
    return ctx.doc.save();
  }

  const title =
    kind === 'ipid'
      ? `IPID — ${policy.ipidCode}`
      : `Polica osiguranja ${policy.policyNumber}`;
  const ctx = await createVectorContext(title, kind === 'ipid' ? policy.ipidCode : policy.policyNumber);

  drawDocumentTitle(
    ctx,
    title,
    `Osiguranik: ${policy.clientName} (OIB: ${policy.clientOib}) • Osiguratelj: ${policy.carrierName}`
  );

  drawSectionHeading(ctx, '1. Podaci o ugovoru o osiguranju', ctx.colors.ACCENT);
  drawKeyValueGrid(ctx, [
    { label: 'Broj police', value: policy.policyNumber },
    { label: 'Osiguratelj', value: policy.carrierName },
    { label: 'Početak osiguranja', value: formatDateHr(policy.startDate) },
    { label: 'Istek osiguranja (Skadenca)', value: formatDateHr(policy.expiryDate) },
    { label: 'Godišnja premija', value: `${formatEur(policy.annualPremium)} (${formatEur(policy.monthlyPremium)}/mj.)` },
    { label: 'Franšiza / Osigurana svota', value: `${formatEur(policy.deductible)}  |  ${formatEur(policy.coverageLimit)}` },
  ]);

  drawSectionHeading(ctx, '2. Predmet osiguranja i ugovorni detalji');
  drawBulletLines(ctx, [
    `Predmet osiguranja: ${policy.assetSummary}`,
    policy.vehiclePlate ? `Registarska oznaka: ${policy.vehiclePlate}` : '',
    policy.propertyAddress ? `Adresa nekretnine: ${policy.propertyAddress}` : '',
    policy.greenCardNumber ? `Zelena karta: ${policy.greenCardNumber}` : '',
    `IPID oznaka: ${policy.ipidCode}`,
    policy.assignedAgent
      ? `Dodijeljeni ovlašteni zastupnik: ${policy.assignedAgent}${policy.assignedAgentLicense ? ` (HANFA ${policy.assignedAgentLicense})` : ''}`
      : `Posredovanje i podrška: ${BRAND_CONFIG.defaultAdvisorDeskHr}`,
  ].filter(Boolean));

  if (policy.endorsements.length > 0) {
    drawSectionHeading(ctx, '3. Evidencija izmjena i aneksa police');
    drawBulletLines(
      ctx,
      policy.endorsements.map(
        (e) =>
          `[${e.status === 'completed' ? 'ODOBRENO' : 'ZATRAŽENO'}] ${formatDateHr(e.createdAt)} — ${e.summary}${e.agentNote ? ` (Napomena zastupnika: ${e.agentNote})` : ''}`
      )
    );
  }

  // Verification seal
  ensureSpace(ctx, 84);
  drawVerificationMatrix(
    ctx.page,
    MARGIN_X,
    ctx.y - 68,
    60,
    `${policy.policyNumber}|${policy.clientOib}|${policy.expiryDate}`,
    ctx.colors
  );
  ctx.page.drawText('Digitalno potvrđeno u sustavu agencije', {
    x: MARGIN_X + 76,
    y: ctx.y - 24,
    size: 9.5,
    font: ctx.fontBold,
    color: ctx.colors.INK,
  });
  ctx.page.drawText(
    `${BRAND_CONFIG.legalName} • HANFA ${BRAND_CONFIG.hanfaRegistrationNumber}`,
    {
      x: MARGIN_X + 76,
      y: ctx.y - 38,
      size: 8.5,
      font: ctx.fontRegular,
      color: ctx.colors.INK_SECONDARY,
    }
  );
  ctx.page.drawText(`24/7 digitalna prijava štete: ${BRAND_CONFIG.claimsPhone} • ${BRAND_CONFIG.siteUrl}`, {
    x: MARGIN_X + 76,
    y: ctx.y - 52,
    size: 8.2,
    font: ctx.fontRegular,
    color: ctx.colors.INK_MUTED,
  });
  ctx.y -= 80;

  finalizeFooters(ctx);
  return ctx.doc.save();
}

export async function downloadIpidPdf(offer: CarrierOffer, productLabel: string): Promise<void> {
  const bytes = await buildIpidPdfBytes(offer, productLabel);
  triggerPdfDownload(bytes, `${offer.ipidCode}.pdf`);
}

export async function downloadQuoteSummaryPdf(quote: QuoteSubmission): Promise<void> {
  const bytes = await buildQuoteSummaryPdfBytes(quote);
  triggerPdfDownload(bytes, `Ponuda-${quote.referenceNumber}.pdf`);
}

export async function downloadPolicyDocumentPdf(
  policy: PolicyRecord,
  kind: 'policy' | 'green_card' | 'ipid'
): Promise<void> {
  const bytes = await buildPolicyDocumentPdfBytes(policy, kind);
  const filename =
    kind === 'green_card'
      ? `Zelena-karta-${policy.policyNumber}.pdf`
      : `${kind === 'ipid' ? policy.ipidCode : policy.policyNumber}.pdf`;
  triggerPdfDownload(bytes, filename);
}
