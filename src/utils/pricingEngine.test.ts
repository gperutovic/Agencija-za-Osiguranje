import { describe, expect, it } from 'vitest';
import {
  AutoQuoteInput,
  CoverageCustomization,
  PropertyQuoteInput,
} from '../types/domain';
import {
  computeBundleDiscountPercent,
  DEFAULT_CUSTOMIZATION,
  generateCarrierOffers,
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

describe('pricingEngine — Multi-Carrier Actuarial Quotes', () => {
  it('returns sorted offers for all 7 Croatian partner insurers', () => {
    const offers = generateCarrierOffers(sampleAuto, DEFAULT_CUSTOMIZATION);
    expect(offers.length).toBe(7);
    for (let i = 1; i < offers.length; i++) {
      const prev = offers[i - 1];
      const curr = offers[i];
      expect(prev && curr && prev.annualPrice <= curr.annualPrice).toBe(true);
    }
  });

  it('recalculates premiums dynamically when deductible changes', () => {
    const zeroDeductible: CoverageCustomization = { ...DEFAULT_CUSTOMIZATION, deductible: 0 };
    const highDeductible: CoverageCustomization = { ...DEFAULT_CUSTOMIZATION, deductible: 500 };

    const offersZero = generateCarrierOffers(sampleAuto, zeroDeductible);
    const offersHigh = generateCarrierOffers(sampleAuto, highDeductible);

    expect(offersZero[0]!.annualPrice).toBeGreaterThan(offersHigh[0]!.annualPrice);
  });

  it('applies higher premiums for lower bonus class and young drivers', () => {
    const lowBonusOffers = generateCarrierOffers(
      { ...sampleAuto, bonusPercent: 0 },
      DEFAULT_CUSTOMIZATION
    );
    const highBonusOffers = generateCarrierOffers(sampleAuto, DEFAULT_CUSTOMIZATION);
    expect(lowBonusOffers[0]!.annualPrice).toBeGreaterThan(highBonusOffers[0]!.annualPrice);

    const youngOffers = generateCarrierOffers(
      { ...sampleAuto, youngDriver: true },
      DEFAULT_CUSTOMIZATION
    );
    expect(youngOffers[0]!.annualPrice).toBeGreaterThan(highBonusOffers[0]!.annualPrice);
  });

  it('increases property premium and updates coverage list when earthquake is toggled', () => {
    const withEq = generateCarrierOffers(sampleProperty, {
      ...DEFAULT_CUSTOMIZATION,
      addons: { ...DEFAULT_CUSTOMIZATION.addons, earthquake: true },
    });
    const withoutEq = generateCarrierOffers(
      { ...sampleProperty, includeEarthquake: false },
      {
        ...DEFAULT_CUSTOMIZATION,
        addons: { ...DEFAULT_CUSTOMIZATION.addons, earthquake: false },
      }
    );

    expect(withEq[0]!.annualPrice).toBeGreaterThan(withoutEq[0]!.annualPrice);
    expect(withEq[0]!.coveredItems.some((c) => c.toLowerCase().includes('potres'))).toBe(true);
    expect(withoutEq[0]!.excludedItems.some((e) => e.toLowerCase().includes('potres'))).toBe(true);
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
});
