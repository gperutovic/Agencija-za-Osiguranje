import { z } from 'zod';

/**
 * Croatian Tax Identification Number (OIB - Osobni identifikacijski broj)
 * Validates 11-digit numerical sequence according to ISO 7064, MOD 11, 10 algorithm.
 */
export function isValidOIB(oib: string): boolean {
  if (!oib || oib.length !== 11 || !/^\d{11}$/.test(oib)) {
    return false;
  }

  let a = 10;
  for (let i = 0; i < 10; i++) {
    a = a + parseInt(oib.charAt(i), 10);
    a = a % 10;
    if (a === 0) a = 10;
    a = (a * 2) % 11;
  }

  let controlDigit = 11 - a;
  if (controlDigit === 10) {
    controlDigit = 0;
  }

  return controlDigit === parseInt(oib.charAt(10), 10);
}

export const loginSchema = z.object({
  email: z.string().min(1, 'Email je obvezan').email('Neispravna email adresa'),
  password: z.string().min(6, 'Lozinka mora imati najmanje 6 znakova'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
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
}).superRefine((data, ctx) => {
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

export const appointmentSchema = z.object({
  customerName: z.string().min(2, 'Ime i prezime je obvezno'),
  customerEmail: z.string().email('Ispravna email adresa je obvezna'),
  customerPhone: z.string().min(6, 'Kontakt telefon je obvezan'),
  type: z.enum(['phone', 'video', 'in_person']),
  dateTime: z.string().min(1, 'Odaberite termin sastanka'),
  topic: z.string().min(3, 'Navedite temu savjetovanja'),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
