import { z } from 'zod';

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
 */
export function isValidOIB(oib: string | null | undefined): boolean {
  if (!oib || typeof oib !== 'string') return false;
  const clean = oib.replace(/\s+/g, '').replace(/-/g, '');
  if (clean.length !== 11 || !/^\d{11}$/.test(clean)) {
    return false;
  }

  let a = 10;
  for (let i = 0; i < 10; i++) {
    a = (a + parseInt(clean.charAt(i), 10)) % 10;
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

// ==========================================
// Reusable Custom Zod Types
// ==========================================

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

// ==========================================
// Auth Schemas
// ==========================================

export const loginSchema = z.object({
  email: z.string().min(1, 'Email je obvezan').email('Neispravna email adresa'),
  password: z.string().min(6, 'Lozinka mora imati najmanje 6 znakova'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    role: z.enum(['policyholder', 'broker', 'admin']),
    email: z.string().min(1, 'Email je obvezan').email('Neispravna email adresa'),
    password: z.string().min(6, 'Lozinka mora imati najmanje 6 znakova'),
    fullName: z.string().min(2, 'Ime i prezime mora imati najmanje 2 znaka'),
    phone: z.string().min(6, 'Kontakt telefon je obvezan'),
    oib: z.string().refine((val) => isValidOIB(val.trim()), {
      message: 'Neispravan 11-znamenkasti OIB (ISO 7064 Mod 11,10)',
    }),
    street: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    licenseNumber: z.string().optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Morate prihvatiti opće uvjete i izjavu o privatnosti',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.role === 'broker') {
      if (!data.licenseNumber || data.licenseNumber.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['licenseNumber'],
          message: 'Broj HANFA licence je obvezan za brokere / zastupnike',
        });
      }
    }
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// ==========================================
// Appointment & Consultation Schema
// ==========================================

export const appointmentSchema = z.object({
  customerName: z.string().min(2, 'Ime i prezime je obvezno'),
  customerEmail: z.string().email('Ispravna email adresa je obvezna'),
  customerPhone: z.string().min(6, 'Kontakt telefon je obvezan'),
  type: z.enum(['phone', 'video', 'in_person']),
  dateTime: z.string().min(1, 'Odaberite termin sastanka'),
  topic: z.string().min(3, 'Navedite temu savjetovanja'),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

// ==========================================
// FNOL Claim Form Schema
// ==========================================

export const fnolClaimSchema = z.object({
  policyId: z.string().min(1, 'Molimo odaberite važeću policu osiguranja'),
  incidentDate: z.string().min(1, 'Datum nastanka štete je obvezan'),
  incidentLocation: z.string().min(3, 'Lokacija događaja je obvezna'),
  description: z.string().min(20, 'Opis štete mora imati najmanje 20 znakova'),
  estimatedDamage: z.coerce.number().min(0, 'Iznos procjene ne može biti negativan').optional(),
  policeInvolved: z.boolean().default(false),
  iban: z.string().min(15, 'Ispravan IBAN za isplatu je obvezan'),
});

export type FNOLClaimFormData = z.infer<typeof fnolClaimSchema>;

// ==========================================
// Quote & Calculator Schemas
// ==========================================

export const dopunskoQuoteSchema = z.object({
  birthDate: z.string().min(1, 'Datum rođenja je obvezan'),
  age: z.number().min(18, 'Minimalna dob je 18 godina').max(100, 'Neispravna dob'),
  currentProvider: z.enum(['hzzo', 'private', 'none']),
  includeBList: z.boolean().default(true),
  fullName: z.string().min(3, 'Ime i prezime je obvezno'),
  oib: oibSchema,
  email: emailSchema,
  phone: croatianPhoneSchema,
  address: z.string().min(5, 'Ulica i kućni broj su obvezni'),
  city: z.string().min(2, 'Grad je obvezan'),
  postalCode: z.string().regex(/^\d{5}$/, 'Poštanski broj mora imati 5 znamenki'),
  consentGdpr: z.literal(true, {
    errorMap: () => ({ message: 'Potrebna je suglasnost s uvjetima poslovanja i obradom podataka.' }),
  }),
});

export type DopunskoQuoteFormData = z.infer<typeof dopunskoQuoteSchema>;

export const autoCalculatorSchema = z.object({
  kw: z.number().min(15, 'Snaga mora biti najmanje 15 kW').max(600, 'Maksimalna snaga je 600 kW'),
  zone: z.enum(['zona_1', 'zona_2', 'zona_3', 'zona_ostalo']),
  bonusClass: z.enum(['B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10']),
  includeKasko: z.boolean().default(false),
  vehicleValueEuro: z.number().min(1000).max(250000).optional(),
  kaskoDeductible: z.enum(['0', '150', '300']).optional(),
  glassBreakage: z.boolean().default(false),
  bonusProtection: z.boolean().default(false),
  roadAssistance: z.boolean().default(true),
  passengerInsurance: z.boolean().default(false),
  isToyotaVehicle: z.boolean().default(false),
  fullName: z.string().min(3, 'Ime i prezime je obvezno'),
  email: emailSchema,
  phone: croatianPhoneSchema,
  licensePlate: z.string().optional(),
});

export type AutoCalculatorFormData = z.infer<typeof autoCalculatorSchema>;

export const propertyCalculatorSchema = z.object({
  propertyType: z.enum(['stan', 'kuca', 'vikendica']),
  squareMeters: z.number().min(15, 'Minimalna kvadratura je 15 m²').max(600, 'Maksimalna kvadratura je 600 m²'),
  buildingYear: z.number().min(1900).max(2026),
  city: z.string().min(2, 'Grad je obvezan'),
  includeEarthquake: z.boolean().default(true),
  includeWaterLeak: z.boolean().default(true),
  includeTheft: z.boolean().default(true),
  deductibleEuro: z.enum(['0', '150', '300']).default('0'),
  fullName: z.string().min(3, 'Ime i prezime je obvezno'),
  email: emailSchema,
  phone: croatianPhoneSchema,
  oib: oibSchema.optional().or(z.literal('')),
});

export type PropertyCalculatorFormData = z.infer<typeof propertyCalculatorSchema>;

export const consumerComplaintSchema = z.object({
  fullName: z.string().min(3, 'Ime i prezime ili naziv pravne osobe je obvezno'),
  oib: oibSchema,
  email: emailSchema,
  phone: croatianPhoneSchema,
  address: z.string().min(5, 'Adresa prebivališta je obvezna'),
  policyNumber: z.string().optional(),
  claimNumber: z.string().optional(),
  subject: z.string().min(5, 'Naslov prigovora je obvezan'),
  description: z.string().min(20, 'Detaljan opis prigovora mora sadržavati najmanje 20 znakova'),
  desiredResolution: z.string().optional(),
  consentFormal: z.literal(true, {
    errorMap: () => ({ message: 'Morate potvrditi točnost navedenih podataka.' }),
  }),
});

export type ConsumerComplaintFormData = z.infer<typeof consumerComplaintSchema>;

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
