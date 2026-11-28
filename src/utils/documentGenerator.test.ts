import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { BRAND_CONFIG } from '../config/brand';
import { PolicyRecord, QuoteSubmission } from '../types/domain';
import {
  buildIpidPdfBytes,
  buildPolicyDocumentPdfBytes,
  buildQuoteSummaryPdfBytes,
} from './documentGenerator';
import { DEFAULT_CUSTOMIZATION, generateCarrierOffers } from './pricingEngine';

const sampleOffer = generateCarrierOffers(
  {
    productLine: 'auto',
    plateNumber: 'ZG-4821-MK',
    make: 'Volkswagen',
    model: 'Golf VIII',
    year: 2022,
    kw: 96,
    bonusPercent: 50,
    youngDriver: false,
    annualMileage: '10k_20k',
    kaskoTier: 'full_kasko',
  },
  DEFAULT_CUSTOMIZATION
)[0]!;

const sampleQuote: QuoteSubmission = {
  id: 'quote-test-1',
  referenceNumber: 'PON-2026-9901',
  productLine: 'auto',
  bundleProducts: ['auto', 'imovina'],
  inputs: {
    productLine: 'auto',
    plateNumber: 'ZG-4821-MK',
    make: 'Volkswagen',
    model: 'Golf VIII',
    year: 2022,
    kw: 96,
    bonusPercent: 50,
    youngDriver: false,
    annualMileage: '10k_20k',
    kaskoTier: 'full_kasko',
  },
  customization: DEFAULT_CUSTOMIZATION,
  selectedOffer: sampleOffer,
  customer: {
    fullName: 'Željko Čović-Šarić',
    oib: '26182105152',
    email: 'zeljko@example.hr',
    phone: '+385912345678',
  },
  consents: {
    ipidAcknowledged: true,
    gdprEssential: true,
    gdprMarketing: false,
    timestamp: '2026-11-28T12:00:00.000Z',
    policyVersion: '2026.1',
  },
  status: 'new',
  source: 'quote_engine',
  createdAt: '2026-11-28T12:00:00.000Z',
  updatedAt: '2026-11-28T12:00:00.000Z',
};

const samplePolicy: PolicyRecord = {
  id: 'pol-test-1',
  policyNumber: 'GEN-AO-2026-441082',
  userId: 'user-1',
  clientName: 'Đurđica Kovačević',
  clientOib: '26182105152',
  productLine: 'auto',
  carrierName: 'Generali osiguranje d.d.',
  status: 'active',
  startDate: '2026-01-01',
  expiryDate: '2027-01-01',
  annualPremium: 468.5,
  monthlyPremium: 40.2,
  deductible: 150,
  coverageLimit: 6450000,
  assetSummary: 'Volkswagen Golf VIII • Čakovec / Varaždin / Šibenik',
  vehiclePlate: 'VŽ-4521-ČK',
  greenCardNumber: 'HR/012/441082',
  ipidCode: 'IPID-GEN-AUTO-2026',
  endorsements: [
    {
      id: 'end-1',
      type: 'add_driver',
      summary: 'Dodan dodatni vozač Luka Čović',
      status: 'completed',
      agentNote: 'Aneks potvrđen bez doplate.',
      createdAt: '2026-05-10T09:00:00.000Z',
    },
  ],
};

describe('documentGenerator — True Multi-Page Vector PDFs with Croatian UTF-8', () => {
  it('generates a valid vector IPID PDF with Croatian diacritics and Vedro branding', async () => {
    const bytes = await buildIpidPdfBytes(sampleOffer, 'Auto osiguranje — Čakovec & Šibenik');
    const header = new TextDecoder().decode(bytes.slice(0, 5));
    expect(header).toBe('%PDF-');

    const loaded = await PDFDocument.load(bytes);
    expect(loaded.getPageCount()).toBeGreaterThanOrEqual(1);
    expect(loaded.getAuthor()).toBe(BRAND_CONFIG.legalName);
    expect(loaded.getTitle()).toContain('IPID');
  });

  it('automatically paginates multi-page IPID PDFs without truncation when content is extensive', async () => {
    const longOffer = {
      ...sampleOffer,
      coveredItems: Array.from(
        { length: 24 },
        (_, i) => `Prošireno pokriće #${i + 1}: Čuvanje vozila, tuča, požar, krađa i žurna asistencija u RH i EU.`
      ),
      excludedItems: Array.from(
        { length: 16 },
        (_, i) => `Isključenje #${i + 1}: Štete nastale namjernim kršenjem propisa ili vožnjom bez vozačke dozvole.`
      ),
    };

    const bytes = await buildIpidPdfBytes(longOffer, 'Auto Kasko Plus');
    const loaded = await PDFDocument.load(bytes);
    expect(loaded.getPageCount()).toBeGreaterThanOrEqual(2);
  });

  it('generates a valid binding Quote Summary PDF with HUB-3A payment block', async () => {
    const bytes = await buildQuoteSummaryPdfBytes(sampleQuote);
    const loaded = await PDFDocument.load(bytes);
    expect(loaded.getPageCount()).toBeGreaterThanOrEqual(1);
    expect(loaded.getTitle()).toContain(sampleQuote.referenceNumber);
    expect(loaded.getAuthor()).toContain('Vedro');
  });

  it('generates valid vector Policy Certificate and Green Card PDFs', async () => {
    const policyBytes = await buildPolicyDocumentPdfBytes(samplePolicy, 'policy');
    const policyDoc = await PDFDocument.load(policyBytes);
    expect(policyDoc.getPageCount()).toBeGreaterThanOrEqual(1);

    const greenCardBytes = await buildPolicyDocumentPdfBytes(samplePolicy, 'green_card');
    const greenCardDoc = await PDFDocument.load(greenCardBytes);
    expect(greenCardDoc.getPageCount()).toBeGreaterThanOrEqual(1);
    expect(greenCardDoc.getTitle()).toContain('Zelena karta');
  });
});
