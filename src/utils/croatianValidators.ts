/**
 * Official Croatian regulatory & format validators:
 * - OIB (ISO 7064, MOD 11,10)
 * - Croatian Vehicle License Plates (all 34 registration areas)
 * - Croatian Phone Numbers (+385 / local)
 * - Croatian Postal Codes (10000 - 53296)
 * - Croatian IBAN (HR + 19 digits, ISO 7064 MOD 97-10)
 */

export const CROATIAN_PLATE_AREA_CODES = new Set<string>([
  'BJ',
  'BM',
  'ČK',
  'DA',
  'DE',
  'DJ',
  'DU',
  'GS',
  'IM',
  'KA',
  'KC',
  'KR',
  'KT',
  'KŽ',
  'MA',
  'NA',
  'NG',
  'OG',
  'OS',
  'PU',
  'PŽ',
  'RI',
  'SB',
  'SK',
  'SL',
  'ST',
  'ŠI',
  'VK',
  'VT',
  'VU',
  'VŽ',
  'ZD',
  'ZG',
  'ŽU',
]);

const ASCII_TO_DIACRITIC_AREA: Record<string, string> = {
  CK: 'ČK',
  KZ: 'KŽ',
  PZ: 'PŽ',
  SI: 'ŠI',
  VZ: 'VŽ',
  ZU: 'ŽU',
};

/**
 * Validates Croatian 11-digit OIB using the official ISO 7064 (MOD 11,10) algorithm.
 */
export function isValidOIB(raw: string): boolean {
  const cleaned = raw.trim();
  if (!/^\d{11}$/.test(cleaned)) {
    return false;
  }

  let remainder = 10;
  for (let i = 0; i < 10; i++) {
    const digit = Number(cleaned.charAt(i));
    remainder = (remainder + digit) % 10;
    if (remainder === 0) {
      remainder = 10;
    }
    remainder = (remainder * 2) % 11;
  }

  let controlDigit = 11 - remainder;
  if (controlDigit === 10) {
    controlDigit = 0;
  }

  return controlDigit === Number(cleaned.charAt(10));
}

/**
 * Generates a valid Croatian OIB for testing/demo fixtures using ISO 7064 MOD 11,10.
 */
export function computeOibControlDigit(firstTenDigits: string): string {
  if (!/^\d{10}$/.test(firstTenDigits)) {
    throw new Error('Expected exactly 10 digits');
  }
  let remainder = 10;
  for (let i = 0; i < 10; i++) {
    const digit = Number(firstTenDigits.charAt(i));
    remainder = (remainder + digit) % 10;
    if (remainder === 0) remainder = 10;
    remainder = (remainder * 2) % 11;
  }
  const control = 11 - remainder === 10 ? 0 : 11 - remainder;
  return `${firstTenDigits}${control}`;
}

/**
 * Normalizes a Croatian registration plate into standard `XX-NNNN-LL` format.
 */
export function normalizeCroatianPlate(raw: string): string {
  const compact = raw.trim().toUpperCase().replace(/[\s-]+/g, '');
  const match = compact.match(/^([A-ZČĆŽŠĐ]{2})(\d{3,4})([A-ZČĆŽŠĐ]{1,2})$/);
  if (!match) {
    return raw.trim().toUpperCase();
  }
  const rawCode = match[1] ?? '';
  const digits = match[2] ?? '';
  const suffix = match[3] ?? '';
  const areaCode = ASCII_TO_DIACRITIC_AREA[rawCode] ?? rawCode;
  return `${areaCode}-${digits}-${suffix}`;
}

/**
 * Validates standard Croatian registration plates (e.g. ZG-1234-AB, ST-999-A, VŽ-4521-BK).
 */
export function isValidCroatianPlate(raw: string): boolean {
  const normalized = normalizeCroatianPlate(raw);
  const match = normalized.match(/^([A-ZČĆŽŠĐ]{2})-(\d{3,4})-([A-ZČĆŽŠĐ]{1,2})$/);
  if (!match) {
    return false;
  }
  const areaCode = match[1] ?? '';
  const suffix = match[3] ?? '';
  // Croatian plate suffixes disallow Q, W, X, Y
  if (/[QWXY]/.test(suffix)) {
    return false;
  }
  return CROATIAN_PLATE_AREA_CODES.has(areaCode);
}

export function extractPlateCityCode(raw: string): string | null {
  if (!isValidCroatianPlate(raw)) return null;
  return normalizeCroatianPlate(raw).slice(0, 2);
}

/**
 * Validates Croatian mobile and landline numbers (+385..., 00385..., or 0...).
 */
export function isValidCroatianPhone(raw: string): boolean {
  const cleaned = raw.trim().replace(/[\s().-]/g, '');
  if (/^\+385(9[125789]\d{6,7}|[1-5]\d{6,7})$/.test(cleaned)) {
    return true;
  }
  if (/^00385(9[125789]\d{6,7}|[1-5]\d{6,7})$/.test(cleaned)) {
    return true;
  }
  if (/^0(9[125789]\d{6,7}|[1-5]\d{6,7})$/.test(cleaned)) {
    return true;
  }
  return false;
}

export function normalizeCroatianPhone(raw: string): string {
  const cleaned = raw.trim().replace(/[\s().-]/g, '');
  if (cleaned.startsWith('00385')) {
    return `+385${cleaned.slice(5)}`;
  }
  if (cleaned.startsWith('0') && !cleaned.startsWith('00')) {
    return `+385${cleaned.slice(1)}`;
  }
  return cleaned;
}

/**
 * Validates Croatian 5-digit postal code (10000 - 53296).
 */
export function isValidCroatianPostalCode(raw: string): boolean {
  const cleaned = raw.trim();
  if (!/^\d{5}$/.test(cleaned)) {
    return false;
  }
  const numeric = Number(cleaned);
  return numeric >= 10000 && numeric <= 53296;
}

/**
 * Validates Croatian IBAN (HR + 19 digits) using ISO 7064 MOD 97-10 checksum.
 */
export function isValidCroatianIban(raw: string): boolean {
  const compact = raw.trim().toUpperCase().replace(/\s+/g, '');
  if (!/^HR\d{19}$/.test(compact)) {
    return false;
  }
  // Move first 4 chars to end and replace H=17, R=27
  const rearranged = `${compact.slice(4)}1727${compact.slice(2, 4)}`;
  let remainder = 0;
  for (let i = 0; i < rearranged.length; i++) {
    remainder = (remainder * 10 + Number(rearranged.charAt(i))) % 97;
  }
  return remainder === 1;
}
