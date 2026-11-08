/**
 * Croatian Algorithmic Validators & Currency Formatting Utilities
 * Compliant with Porezna uprava RH (ISO 7064, MOD 11, 10), HUO VIN standards, and HNB SEPA HR IBAN format.
 */

/**
 * 1. Strict 11-digit ISO 7064, MOD 11, 10 checksum validation for Croatian OIB.
 */
export function validateOIB(oib: string): boolean {
  if (!oib || typeof oib !== 'string') return false;
  const clean = oib.trim().replace(/\s+/g, '');
  if (!/^\d{11}$/.test(clean)) return false;

  let remainder = 10;
  for (let i = 0; i < 10; i++) {
    remainder = (remainder + parseInt(clean.charAt(i), 10)) % 10;
    if (remainder === 0) {
      remainder = 10;
    }
    remainder = (remainder * 2) % 11;
  }

  let checkDigit = 11 - remainder;
  if (checkDigit === 10) {
    checkDigit = 0;
  }

  return checkDigit === parseInt(clean.charAt(10), 10);
}

/**
 * 2. 17-character alphanumeric VIN check (excluding I, O, Q per ISO 3779).
 */
export function validateVIN(vin: string): boolean {
  if (!vin || typeof vin !== 'string') return false;
  const clean = vin.trim().toUpperCase().replace(/[\s-]+/g, '');
  if (clean.length !== 17) return false;
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(clean);
}

/**
 * 3. Validates Croatian IBAN: 'HR' prefix + 19 digits (21 characters total).
 */
export function validateCroatianIBAN(iban: string): boolean {
  if (!iban || typeof iban !== 'string') return false;
  const clean = iban.trim().toUpperCase().replace(/\s+/g, '');
  if (clean.length !== 21) return false;
  return /^HR\d{19}$/.test(clean);
}

/**
 * 4. Formats numeric EUR values using Croatian locale ('hr-HR', 'EUR').
 */
export function formatEUR(amount: number): string {
  const safeAmount = typeof amount === 'number' && !Number.isNaN(amount) ? amount : 0;
  return new Intl.NumberFormat('hr-HR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeAmount);
}

/**
 * Helper: Sanitizes OIB input to max 11 digits
 */
export function normalizeOIBInput(value: string): string {
  return (value || '').replace(/\D/g, '').slice(0, 11);
}

/**
 * Helper: Sanitizes VIN input to max 17 valid uppercase characters (strips I, O, Q)
 */
export function normalizeVINInput(value: string): string {
  return (value || '')
    .toUpperCase()
    .replace(/[^A-HJ-NPR-Z0-9]/g, '')
    .slice(0, 17);
}

/**
 * Helper: Sanitizes Croatian IBAN input (HR + 19 digits)
 */
export function normalizeCroatianIBANInput(value: string): string {
  const upper = (value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!upper) return '';
  if (upper.startsWith('HR')) {
    const digits = upper.slice(2).replace(/\D/g, '').slice(0, 19);
    return `HR${digits}`;
  }
  const digitsOnly = upper.replace(/\D/g, '').slice(0, 19);
  return digitsOnly ? `HR${digitsOnly}` : upper.slice(0, 2);
}

export const normalizeIBANInput = normalizeCroatianIBANInput;

