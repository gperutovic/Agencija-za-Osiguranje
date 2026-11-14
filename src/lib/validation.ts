import { z } from 'zod';

/**
 * Validates an 11-digit Croatian OIB using the official ISO 7064 Mod 11, 10 algorithm
 */
export function isValidOIB(oib: string): boolean {
  if (!oib || typeof oib !== 'string') return false;
  const clean = oib.trim();
  if (clean.length !== 11 || !/^\d{11}$/.test(clean)) return false;

  let a = 10;
  for (let i = 0; i < 10; i++) {
    a = (a + parseInt(clean.charAt(i), 10)) % 10;
    if (a === 0) a = 10;
    a = (a * 2) % 11;
  }

  let control = 11 - a;
  if (control === 10) control = 0;

  return control === parseInt(clean.charAt(10), 10);
}

// Reusable custom Zod types
export const oibSchema = z
  .string()
  .min(1, 'OIB je obvezan podatak')
  .refine(isValidOIB, {
    message: 'Neispravan OIB. Mora imati 11 znamenki i točnu kontrolnu znamenku po ISO 7064 Mod 11, 10.',
  });

export const croatianPhoneSchema = z
  .string()
  .min(8, 'Broj telefona je prekratak')
  .regex(
    /^(\+385|00385|0)[1-9][0-9]{6,8}$/,
    'Unesite valjani telefonski broj u Hrvatskoj (npr. 091 234 5678 ili +385 91 234 5678)'
  );

export const emailSchema = z
  .string()
  .min(1, 'E-mail adresa je obvezna')
  .email('Unesite ispravnu e-mail adresu');

// Schemas for multi-line quoting funnels
export const autoQuoteSchema = z.object({
  kw: z.number().min(20, 'Minimalna snaga je 20 kW').max(350, 'Maksimalna snaga je 350 kW'),
  driverAge: z.number().min(18, 'Vozač mora imati najmanje 18 godina').max(95, 'Neispravna dob'),
  registrationZone: z.string().min(2, 'Odaberite registarsko područje'),
  bonusPercent: z.number().min(0).max(50),
  coverageType: z.enum(['ao_only', 'ao_kasko', 'kasko_only']),
  franchiseAmount: z.number().default(0),
  glassBreakage: z.boolean().default(false),
  roadAssistance: z.boolean().default(true),
  bonusProtection: z.boolean().default(false),
  // Step 2 & 3 holder info
  fullName: z.string().min(2, 'Ime i prezime je obvezno'),
  email: emailSchema,
  phone: croatianPhoneSchema,
  oib: oibSchema.optional().or(z.literal('')),
  licensePlate: z.string().optional(),
});

export const propertyQuoteSchema = z.object({
  propertyType: z.enum(['stan', 'kuca', 'vikendica']),
  squareMeters: z.number().min(15, 'Minimalna kvadratura je 15 m²').max(500, 'Maksimalna kvadratura je 500 m²'),
  locationZone: z.string().min(2, 'Unesite grad ili općinu'),
  includeEarthquake: z.boolean().default(true),
  includeWaterLeak: z.boolean().default(true),
  includeContents: z.boolean().default(true),
  fullName: z.string().min(2, 'Ime i prezime je obvezno'),
  email: emailSchema,
  phone: croatianPhoneSchema,
  oib: oibSchema.optional().or(z.literal('')),
});

export const vehicleTransferSchema = z.object({
  kw: z.number().min(15, 'Unesite snagu u kW').max(350),
  ageYears: z.number().min(0, 'Unesite starost vozila').max(35),
  retainPlates: z.boolean().default(false),
  registrationArea: z.string().default('ZG'),
});

export const claimsIntakeSchema = z.object({
  category: z.enum(['collision', 'property', 'health', 'travel']),
  policyNumber: z.string().min(3, 'Unesite broj police osiguranja'),
  carrierName: z.string().min(2, 'Odaberite osiguratelja'),
  claimantOib: oibSchema,
  claimantName: z.string().min(3, 'Ime i prezime osiguranika je obvezno'),
  claimantPhone: croatianPhoneSchema,
  claimantEmail: emailSchema,
  incidentDate: z.string().min(1, 'Datum događaja je obvezan'),
  incidentLocation: z.string().min(3, 'Mjesto štetnog događaja je obvezno'),
  description: z.string().min(10, 'Opišite okolnosti nastanka štete (najmanje 10 znakova)'),
  policeReportFiled: z.boolean().default(false),
  policeStation: z.string().optional(),
  iban: z
    .string()
    .min(21, 'Hrvatski IBAN ima točno 21 znak')
    .max(21, 'Hrvatski IBAN ima točno 21 znak')
    .regex(/^HR\d{19}$/, 'IBAN mora početi s HR i sadržavati 19 znamenki računa'),
});

export const quickCallbackSchema = z.object({
  fullName: z.string().min(2, 'Ime i prezime je obvezno'),
  phone: croatianPhoneSchema,
  insuranceTopic: z.string().optional(),
});
