import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, AlertCircle } from 'lucide-react';
import { registerSchema, RegisterFormData } from '../utils/validators';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'policyholder',
      email: '',
      password: '',
      fullName: '',
      phone: '',
      oib: '',
      street: '',
      city: '',
      postalCode: '',
      licenseNumber: '',
      acceptTerms: false,
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      setAuthError(null);

      await registerUser({
        email: data.email,
        displayName: data.fullName,
        phone: data.phone,
        oib: data.oib,
        role: data.role,
        licenseNumber: data.licenseNumber || undefined,
        address: {
          street: data.street || '',
          city: data.city || '',
          postalCode: data.postalCode || '',
          country: 'Hrvatska',
        },
      });

      navigate(data.role === 'policyholder' ? '/portal' : '/admin');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registracija nije uspjela. Provjerite unesene podatke.';
      setAuthError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-xl w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-11 h-11 rounded-xl bg-[#0F2942] text-white flex items-center justify-center mx-auto shadow-sm">
            <UserPlus className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Otvaranje korisničkog računa
          </h1>
          <p className="text-sm text-slate-600">
            Pristupite svojim policama, dokumentaciji i statusu odštetnih zahtjeva
          </p>
        </div>

        <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-xl shadow-sm">
          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Vrsta korisničkog računa
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue('role', 'policyholder')}
                  className={`p-3 rounded-lg border text-xs font-semibold transition-colors text-center cursor-pointer ${
                    selectedRole === 'policyholder'
                      ? 'bg-[#0F2942] border-[#0F2942] text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Ugovaratelj (Klijent)
                </button>
                <button
                  type="button"
                  onClick={() => setValue('role', 'broker')}
                  className={`p-3 rounded-lg border text-xs font-semibold transition-colors text-center cursor-pointer ${
                    selectedRole === 'broker'
                      ? 'bg-[#0F2942] border-[#0F2942] text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Ovlašteni zastupnik u osiguranju
                </button>
              </div>
            </div>

            {selectedRole === 'broker' && (
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <Input
                  label="Broj HANFA ovlaštenja zastupnika *"
                  placeholder="npr. HANFA-ZAS-2026-991"
                  {...register('licenseNumber')}
                  error={errors.licenseNumber?.message}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Ime i prezime / Naziv tvrtke *"
                placeholder="npr. Marko Horvat"
                {...register('fullName')}
                error={errors.fullName?.message}
              />
              <Input
                label="OIB (11 znamenki) *"
                placeholder="npr. 14329077049"
                maxLength={11}
                {...register('oib')}
                error={errors.oib?.message}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="E-mail adresa *"
                type="email"
                placeholder="npr. marko@email.hr"
                {...register('email')}
                error={errors.email?.message}
              />
              <Input
                label="Kontakt telefon *"
                placeholder="npr. 091 123 4567"
                {...register('phone')}
                error={errors.phone?.message}
              />
            </div>

            <Input
              label="Lozinka (min. 6 znakova) *"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <Input
                  label="Ulica i kućni broj"
                  placeholder="npr. Ilica 120"
                  {...register('street')}
                />
              </div>
              <Input
                label="Grad"
                placeholder="Zagreb"
                {...register('city')}
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-[#0F2942]"
                  {...register('acceptTerms')}
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  Prihvaćam{' '}
                  <Link to="/o-nama-pravno" className="text-[#0F2942] font-semibold underline">
                    Opće uvjete poslovanja
                  </Link>{' '}
                  i potvrđujem da sam upoznat s{' '}
                  <Link to="/o-nama-pravno" className="text-[#0F2942] font-semibold underline">
                    Pravilima zaštite privatnosti (GDPR)
                  </Link>
                  .
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-xs text-red-600 mt-1">{errors.acceptTerms.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full mt-2"
            >
              {isSubmitting ? 'Otvaranje računa...' : 'Dovrši registraciju'}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-200 text-center text-xs text-slate-600">
            Već imate otvoren korisnički račun?{' '}
            <Link to="/login" className="font-semibold text-[#0F2942] hover:underline">
              Prijavite se ovdje
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
