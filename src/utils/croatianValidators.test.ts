import { describe, expect, it } from 'vitest';
import {
  computeOibControlDigit,
  extractPlateCityCode,
  isValidCroatianIban,
  isValidCroatianPhone,
  isValidCroatianPlate,
  isValidCroatianPostalCode,
  isValidOIB,
  normalizeCroatianPhone,
  normalizeCroatianPlate,
} from './croatianValidators';

describe('croatianValidators — OIB (ISO 7064 MOD 11,10)', () => {
  it('validates mathematically valid Croatian OIBs', () => {
    const generatedA = computeOibControlDigit('2618210515');
    const generatedB = computeOibControlDigit('1234567890');
    const generatedC = computeOibControlDigit('9081726354');

    expect(isValidOIB(generatedA)).toBe(true);
    expect(isValidOIB(generatedB)).toBe(true);
    expect(isValidOIB(generatedC)).toBe(true);
    expect(isValidOIB('11111111119')).toBe(true);
  });

  it('rejects OIBs with invalid checksum, wrong length, or non-digits', () => {
    const valid = computeOibControlDigit('2618210515');
    const wrongLastDigit = `${valid.slice(0, 10)}${(Number(valid.charAt(10)) + 1) % 10}`;

    expect(isValidOIB(wrongLastDigit)).toBe(false);
    expect(isValidOIB('1234567890')).toBe(false);
    expect(isValidOIB('123456789012')).toBe(false);
    expect(isValidOIB('2618210515A')).toBe(false);
    expect(isValidOIB('')).toBe(false);
  });
});

describe('croatianValidators — License Plates', () => {
  it('normalizes and validates Croatian registration plates across cities', () => {
    expect(normalizeCroatianPlate('zg 1234 ab')).toBe('ZG-1234-AB');
    expect(normalizeCroatianPlate('vz4521bk')).toBe('VŽ-4521-BK');
    expect(isValidCroatianPlate('ZG-1234-AB')).toBe(true);
    expect(isValidCroatianPlate('ST 999 A')).toBe(true);
    expect(isValidCroatianPlate('RI-4501-CD')).toBe(true);
    expect(isValidCroatianPlate('ČK-312-EF')).toBe(true);
    expect(extractPlateCityCode('st 4122 mn')).toBe('ST');
  });

  it('rejects invalid registration area codes, forbidden suffix letters, and bad formats', () => {
    expect(isValidCroatianPlate('XX-1234-AB')).toBe(false);
    expect(isValidCroatianPlate('ZG-1234-QX')).toBe(false);
    expect(isValidCroatianPlate('ZG-12-AB')).toBe(false);
    expect(isValidCroatianPlate('ZG-12345-AB')).toBe(false);
    expect(extractPlateCityCode('INVALID')).toBeNull();
  });
});

describe('croatianValidators — Phone, Postal Code & IBAN', () => {
  it('validates and normalizes Croatian phone numbers', () => {
    expect(isValidCroatianPhone('+385 91 234 5678')).toBe(true);
    expect(isValidCroatianPhone('098 123 4567')).toBe(true);
    expect(isValidCroatianPhone('01 4800 910')).toBe(true);
    expect(normalizeCroatianPhone('091 234 5678')).toBe('+385912345678');
    expect(isValidCroatianPhone('12345')).toBe(false);
  });

  it('validates Croatian postal codes strictly between 10000 and 53296', () => {
    expect(isValidCroatianPostalCode('10000')).toBe(true);
    expect(isValidCroatianPostalCode('21000')).toBe(true);
    expect(isValidCroatianPostalCode('53296')).toBe(true);
    expect(isValidCroatianPostalCode('09999')).toBe(false);
    expect(isValidCroatianPostalCode('53297')).toBe(false);
    expect(isValidCroatianPostalCode('1000')).toBe(false);
  });

  it('validates Croatian IBAN checksum (ISO 7064 MOD 97-10)', () => {
    expect(isValidCroatianIban('HR1210010051863000160')).toBe(true);
    expect(isValidCroatianIban('HR12 1001 0051 8630 0016 0')).toBe(true);
    expect(isValidCroatianIban('HR0010010051863000160')).toBe(false);
    expect(isValidCroatianIban('DE89370400440532013000')).toBe(false);
  });
});
