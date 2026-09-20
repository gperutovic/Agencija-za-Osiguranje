import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { registerSchema, RegisterFormData } from '../lib/validation';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Card } from '../components/common/Card';

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
        licenseNumber: data.licenseNumber,
        address: {
          street: data.street || '',
          city: data.city || '',
          postalCode: data.postalCode || '',
          country: 'Hrvatska',
        },
      });

      if (data.role === 'policyholder') {
        navigate('/portal');
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Registracija nije uspjela. Provjerite unesene podatke.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-xl w-full space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md shadow-teal-600/30">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Registracija Korisničkog Računa
          </h2>
          <p className="text-xs text-slate-500 font-normal">
            Otvorite svoj digitalni profil za ugovaranje polica i prijavu šteta
          </p>
        </div>

        <div className="p-6 sm:p-8 bg-white border border-slate-200/80 rounded-3xl shadow-bento">
          {authError && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                Vrsta korisničkog računa
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue('role', 'policyholder')}
                  className={`p-3 rounded-2xl border text-xs font-mono font-bold transition-all text-center cursor-pointer ${
                    selectedRole === 'policyholder'
                      ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  Ugovaratelj (Klijent)
                </button>
                <button
                  type="button"
                  onClick={() => setValue('role', 'broker')}
                  className={`p-3 rounded-2xl border text-xs font-mono font-bold transition-all text-center cursor-pointer ${
                    selectedRole === 'broker'
                      ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  Ovlašteni Zastupnik (Broker)
                </button>
              </div>
            </div>

            {selectedRole === 'broker' && (
              <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200">
                <label className="block text-xs font-mono font-semibold text-teal-800 mb-1">
                  Broj HANFA licence zastupnika *
                </label>
                <Input
                  placeholder="npr. HR-HANFA-2026-99124"
                  {...register('licenseNumber')}
                  error={errors.licenseNumber?.message}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                  Ime i prezime / Naziv obrta *
                </label>
                <Input
                  placeholder="npr. Marko Horvat"
                  {...register('fullName')}
                  error={errors.fullName?.message}
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                  OIB (11 znamenaka) *
                </label>
                <Input
                  placeholder="npr. 14329077049"
                  maxLength={11}
                  {...register('oib')}
                  error={errors.oib?.message}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                  Email adresa *
                </label>
                <Input
                  type="email"
                  placeholder="npr. marko@email.hr"
                  {...register('email')}
                  error={errors.email?.message}
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                  Kontakt telefon *
                </label>
                <Input
                  placeholder="npr. 091 123 4567"
                  {...register('phone')}
                  error={errors.phone?.message}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                Lozinka (min. 6 znakova) *
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                  Ulica i kućni broj
                </label>
                <Input
                  placeholder="npr. Ilica 120"
                  {...register('street')}
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                  Grad
                </label>
                <Input
                  placeholder="Zagreb"
                  {...register('city')}
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  {...register('acceptTerms')}
                />
                <span className="text-xs text-slate-600">
                  Prihvaćam{' '}
                  <Link to="/legal" className="text-teal-700 underline font-semibold">
                    Opće uvjete poslovanja
                  </Link>{' '}
                  i potvrđujem da sam upoznat/a s{' '}
                  <Link to="/privacy" className="text-teal-700 underline font-semibold">
                    Politikom privatnosti (GDPR)
                  </Link>
                  .
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-xs font-mono text-rose-600 mt-1">{errors.acceptTerms.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full font-mono font-bold mt-3"
            >
              {isSubmitting ? 'Stvaranje računa...' : 'Dovrši registraciju'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500 font-mono">
            Već imate račun?{' '}
            <Link to="/login" className="font-bold text-teal-700 hover:underline">
              Prijavite se ovdje &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
