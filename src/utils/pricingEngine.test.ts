import { describe, expect, it } from 'vitest';
import {
  AutoQuoteInput,
  BusinessQuoteInput,
  CoverageCustomization,
  HealthQuoteInput,
  LifeQuoteInput,
  PetQuoteInput,
  PropertyQuoteInput,
  TravelQuoteInput,
} from '../types/domain';
import {
  buildCompetingOffersFromExtracted,
  computeBundleDiscountPercent,
  DEFAULT_CUSTOMIZATION,
  generateCarrierOffers,
  getDefaultCustomizationForLine,
  isDeductibleApplicable,
} from './pricingEngine';

const sampleAuto: AutoQuoteInput = {
  productLine: 'auto',
  plateNumber: 'ZG-1234-AB',
  make: 'Volkswagen',
  model: 'Golf',
  year: 2022,
  kw: 96,
  bonusPercent: 50,
  youngDriver: false,
  annualMileage: '10k_20k',
  kaskoTier: 'full_kasko',
};

const sampleProperty: PropertyQuoteInput = {
  productLine: 'imovina',
  city: 'Zagreb',
  postalCode: '10000',
  propertyType: 'stan',
  areaSqm: 72,
  coverageScope: 'both',
  includeEarthquake: true,
  includeFlood: false,
  includeBurglary: true,
};

const sampleHealth: HealthQuoteInput = {
  productLine: 'zdravstveno',
  age: 34,
  planTier: 'kombinirano',
  includeBListDrugs: true,
  includeDiagnostics: true,
  familyMembers: 2,
};

const sampleLife: LifeQuoteInput = {
  productLine: 'zivotno',
  age: 35,
  smoker: false,
  sumInsured: 100000,
  termYears: 20,
  includeCriticalIllness: true,
};

const sampleTravel: TravelQuoteInput = {
  productLine: 'putno',
  destination: 'eu',
  days: 10,
  travelers: 2,
  includeWinterSports: false,
  includeCancellation: true,
};

const samplePet: PetQuoteInput = {
  productLine: 'ljubimci',
  petType: 'dog',
  petAgeYears: 4,
  breedSize: 'medium',
  includeLiability: true,
};

const sampleBusiness: BusinessQuoteInput = {
  productLine: 'poslovno',
  companyType: 'doo',
  employees: 8,
  annualRevenueBand: '100k_500k',
  includeProfessionalLiability: true,
  includeCyber: true,
};

describe('pricingEngine — Multi-Carrier Actuarial Quotes (All 7 Lines)', () => {
  it('returns sorted positive offers for all 7 Croatian partner insurers across all 7 product lines', () => {
    const allInputs = [
      sampleAuto,
      sampleProperty,
      sampleHealth,
      sampleLife,
      sampleTravel,
      samplePet,
      sampleBusiness,
    ];

    for (const input of allInputs) {
      const cust = getDefaultCustomizationForLine(input.productLine);
      const offers = generateCarrierOffers(input, cust);
      expect(offers.length).toBe(7);
      expect(offers[0]!.annualPrice).toBeGreaterThan(0);
      for (let i = 1; i < offers.length; i++) {
        expect(offers[i - 1]!.annualPrice).toBeLessThanOrEqual(offers[i]!.annualPrice);
      }
    }
  });

  it('determines deductible applicability accurately per line and enforces 0€ deductible on non-deductible lines', () => {
    expect(isDeductibleApplicable(sampleAuto)).toBe(true);
    expect(isDeductibleApplicable({ ...sampleAuto, kaskoTier: 'ao_only' })).toBe(false);
    expect(isDeductibleApplicable(sampleProperty)).toBe(true);
    expect(isDeductibleApplicable(samplePet)).toBe(true);
    expect(isDeductibleApplicable(sampleBusiness)).toBe(true);
    expect(isDeductibleApplicable(sampleHealth)).toBe(false);
    expect(isDeductibleApplicable(sampleLife)).toBe(false);
    expect(isDeductibleApplicable(sampleTravel)).toBe(false);

    const healthOffers = generateCarrierOffers(sampleHealth, { ...DEFAULT_CUSTOMIZATION, deductible: 500 });
    expect(healthOffers[0]!.deductible).toBe(0);

    const aoOnlyOffers = generateCarrierOffers(
      { ...sampleAuto, kaskoTier: 'ao_only' },
      { ...DEFAULT_CUSTOMIZATION, deductible: 300 }
    );
    expect(aoOnlyOffers[0]!.deductible).toBe(0);
  });

  it('recalculates premiums dynamically when deductible changes on Kasko/Property/Pet/Business', () => {
    const zeroDed: CoverageCustomization = { ...DEFAULT_CUSTOMIZATION, deductible: 0 };
    const highDed: CoverageCustomization = { ...DEFAULT_CUSTOMIZATION, deductible: 500 };

    expect(generateCarrierOffers(sampleAuto, zeroDed)[0]!.annualPrice).toBeGreaterThan(
      generateCarrierOffers(sampleAuto, highDed)[0]!.annualPrice
    );
    expect(generateCarrierOffers(sampleProperty, zeroDed)[0]!.annualPrice).toBeGreaterThan(
      generateCarrierOffers(sampleProperty, highDed)[0]!.annualPrice
    );
    expect(generateCarrierOffers(samplePet, zeroDed)[0]!.annualPrice).toBeGreaterThan(
      generateCarrierOffers(samplePet, highDed)[0]!.annualPrice
    );
    expect(generateCarrierOffers(sampleBusiness, zeroDed)[0]!.annualPrice).toBeGreaterThan(
      generateCarrierOffers(sampleBusiness, highDed)[0]!.annualPrice
    );
  });

  it('computes Travel as single-trip total (never nonsensical 12-month installments)', () => {
    const cust = getDefaultCustomizationForLine('putno');
    const offers = generateCarrierOffers(sampleTravel, cust);
    expect(offers[0]!.annualPrice).toBe(offers[0]!.monthlyPrice);
    expect(offers[0]!.deductible).toBe(0);

    const withSki = generateCarrierOffers({ ...sampleTravel, includeWinterSports: true }, cust);
    expect(withSki[0]!.annualPrice).toBeGreaterThan(offers[0]!.annualPrice);
  });

  it('derives Property earthquake solely from input.includeEarthquake (fixes stale customization sync bug)', () => {
    const withEq = generateCarrierOffers(
      { ...sampleProperty, includeEarthquake: true },
      { ...DEFAULT_CUSTOMIZATION, addons: { ...DEFAULT_CUSTOMIZATION.addons, earthquake: false } }
    );
    const withoutEq = generateCarrierOffers(
      { ...sampleProperty, includeEarthquake: false },
      { ...DEFAULT_CUSTOMIZATION, addons: { ...DEFAULT_CUSTOMIZATION.addons, earthquake: true } }
    );

    expect(withEq[0]!.annualPrice).toBeGreaterThan(withoutEq[0]!.annualPrice);
    expect(withEq[0]!.coveredItems.some((c) => c.toLowerCase().includes('potres'))).toBe(true);
    expect(withoutEq[0]!.excludedItems.some((e) => e.toLowerCase().includes('potres'))).toBe(true);
  });

  it('supports bilingual Croatian (hr) and English (en) offer descriptions & badges', () => {
    const hrOffers = generateCarrierOffers(sampleAuto, DEFAULT_CUSTOMIZATION, [], 'hr');
    const enOffers = generateCarrierOffers(sampleAuto, DEFAULT_CUSTOMIZATION, [], 'en');

    expect(hrOffers[0]!.coveredItems[0]).toContain('Obvezna');
    expect(enOffers[0]!.coveredItems[0]).toContain('Mandatory Motor Liability');
    expect(enOffers[0]!.tierLabel).toBe('Optimal Plan');
  });

  it('applies multi-policy bundle discounts accurately (12% for 2 lines, 15% for 3+ lines)', () => {
    expect(computeBundleDiscountPercent(['auto'])).toBe(0);
    expect(computeBundleDiscountPercent(['auto', 'imovina'])).toBe(12);
    expect(computeBundleDiscountPercent(['auto', 'imovina', 'zdravstveno'])).toBe(15);

    const single = generateCarrierOffers(sampleAuto, DEFAULT_CUSTOMIZATION, ['auto']);
    const bundled = generateCarrierOffers(sampleAuto, DEFAULT_CUSTOMIZATION, ['auto', 'imovina']);

    expect(bundled[0]!.bundleDiscountPercent).toBe(12);
    expect(bundled[0]!.annualPrice).toBeLessThan(single[0]!.annualPrice);
  });

  it('computes realistic competing Switch & Save offers via the pricing engine (excluding current carrier)', () => {
    const result = buildCompetingOffersFromExtracted({
      insurer: 'Croatia osiguranje d.d.',
      productLine: 'auto',
      policyNumber: 'CRO-123456',
      expiryDate: '2026-12-31',
      currentAnnualPremium: 700,
      bonusPercent: 50,
      deductible: 150,
      vehiclePlate: 'ZG-1234-AB',
    });

    expect(result.competingOffers.length).toBeGreaterThan(0);
    expect(result.competingOffers.every((o) => !o.carrierName.includes('Croatia'))).toBe(true);
    expect(result.estimatedNewAnnualPremium).toBe(result.bestOffer.annualPrice);
    expect(result.estimatedAnnualSavings).toBe(
      Math.round(Math.max(0, 700 - result.estimatedNewAnnualPremium) * 100) / 100
    );
  });
});
