import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { registerSchema, RegisterFormData } from '../utils/validators';
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#fb6504]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-xl w-full space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#fb6504] to-[#ff7b1a] text-white flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(251,101,4,0.4)]">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Registracija Korisničkog Računa
          </h2>
          <p className="text-xs text-slate-400 font-light">
            Otvorite svoj digitalni profil za ugovaranje polica i prijavu šteta
          </p>
        </div>

        <div className="p-6 sm:p-8 bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl rounded-3xl shadow-2xl">
          {authError && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                Vrsta korisničkog računa
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue('role', 'policyholder')}
                  className={`p-3 rounded-2xl border text-xs font-mono font-bold transition-all text-center ${
                    selectedRole === 'policyholder'
                      ? 'bg-[#fb6504]/10 border-[#fb6504] text-[#ff7b1a] shadow-[0_0_12px_rgba(251,101,4,0.25)]'
                      : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:border-white/[0.16] hover:text-white'
                  }`}
                >
                  Ugovaratelj (Klijent)
                </button>
                <button
                  type="button"
                  onClick={() => setValue('role', 'broker')}
                  className={`p-3 rounded-2xl border text-xs font-mono font-bold transition-all text-center ${
                    selectedRole === 'broker'
                      ? 'bg-[#fb6504]/10 border-[#fb6504] text-[#ff7b1a] shadow-[0_0_12px_rgba(251,101,4,0.25)]'
                      : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:border-white/[0.16] hover:text-white'
                  }`}
                >
                  Ovlašteni Zastupnik (Broker)
                </button>
              </div>
            </div>

            {selectedRole === 'broker' && (
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                <label className="block text-xs font-mono font-semibold text-cyan-300 mb-1">
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
                <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                  Ime i prezime / Naziv obrta *
                </label>
                <Input
                  placeholder="npr. Marko Horvat"
                  {...register('fullName')}
                  error={errors.fullName?.message}
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
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
                <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
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
                <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
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
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
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
                <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                  Ulica i kućni broj
                </label>
                <Input
                  placeholder="npr. Ilica 120"
                  {...register('street')}
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
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
                  className="mt-0.5 w-4 h-4 rounded border-white/[0.2] bg-[#06080c] text-[#fb6504] focus:ring-[#fb6504]"
                  {...register('acceptTerms')}
                />
                <span className="text-xs text-slate-400">
                  Prihvaćam{' '}
                  <Link to="/legal" className="text-[#ff7b1a] underline">
                    Opće uvjete poslovanja
                  </Link>{' '}
                  i potvrđujem da sam upoznat/a s{' '}
                  <Link to="/privacy" className="text-[#ff7b1a] underline">
                    Politikom privatnosti (GDPR)
                  </Link>
                  .
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-xs font-mono text-rose-400 mt-1">{errors.acceptTerms.message}</p>
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

          <div className="mt-6 pt-6 border-t border-white/[0.06] text-center text-xs text-slate-400 font-mono">
            Već imate račun?{' '}
            <Link to="/login" className="font-bold text-[#ff7b1a] hover:underline">
              Prijavite se ovdje &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
