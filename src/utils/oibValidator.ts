/**
 * Croatian Personal Identification Number (OIB - Osobni identifikacijski broj)
 * Official ISO 7064, MOD 11, 10 checksum algorithm implementation.
 */

export interface OibValidationResult {
  isValid: boolean;
  message: string;
  cleanOib: string;
}

/**
 * Validates an 11-digit Croatian OIB using the ISO 7064, MOD 11, 10 algorithm.
 * @param oib Raw input string (can contain spaces or hyphens)
 * @returns boolean true if valid, false otherwise
 */
export function isValidOIB(oib: string | null | undefined): boolean {
  if (!oib) return false;
  const clean = oib.replace(/\s+/g, '').replace(/-/g, '');
  if (clean.length !== 11 || !/^\d{11}$/.test(clean)) {
    return false;
  }

  let a = 10;
  for (let i = 0; i < 10; i++) {
    a = a + parseInt(clean.charAt(i), 10);
    a = a % 10;
    if (a === 0) a = 10;
    a = (a * 2) % 11;
  }

  let controlDigit = 11 - a;
  if (controlDigit === 10) {
    controlDigit = 0;
  }

  return controlDigit === parseInt(clean.charAt(10), 10);
}

/**
 * Formats a raw input to 11 digits without invalid characters
 */
export function sanitizeOIB(input: string): string {
  return input.replace(/\D/g, '').slice(0, 11);
}

/**
 * Validates OIB with descriptive feedback for UI inputs
 */
export function validateOibWithFeedback(oib: string): OibValidationResult {
  const clean = sanitizeOIB(oib);

  if (!clean) {
    return {
      isValid: false,
      message: 'OIB je obvezan podatak za izračun police.',
      cleanOib: '',
    };
  }

  if (clean.length < 11) {
    return {
      isValid: false,
      message: `Unesite još ${11 - clean.length} znamenki (uneseno ${clean.length}/11).`,
      cleanOib: clean,
    };
  }

  if (isValidOIB(clean)) {
    return {
      isValid: true,
      message: 'OIB je valjan (ISO 7064 MOD 11, 10 kontrolna znamenka potvrđena).',
      cleanOib: clean,
    };
  }

  return {
    isValid: false,
    message: 'Neispravan OIB: kontrolna znamenka ne odgovara izračunu Porezne uprave RH.',
    cleanOib: clean,
  };
}
