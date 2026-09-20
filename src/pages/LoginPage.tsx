import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Shield, Lock, Mail, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { loginSchema, LoginFormData } from '../lib/validation';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/portal';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'ana.horvat@email.hr',
      password: 'password123',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setAuthError(null);
      await login(data.email, 'policyholder');
      navigate(from, { replace: true });
    } catch (err: any) {
      setAuthError(err.message || 'Neuspješna prijava. Provjerite podatke.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickPersona = (role: 'policyholder' | 'broker' | 'admin') => {
    switchDemoRole(role);
    if (role === 'policyholder') navigate('/portal');
    else navigate('/admin');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md shadow-teal-600/30">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Prijava u Moj Život Portal
          </h2>
          <p className="text-xs text-slate-500 font-normal">
            Siguran pristup vašim policama, digitalnom trezoru i odštetnim spisima
          </p>
        </div>

        {/* 1-Click Fast Demo Personas */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-bento space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 font-mono font-bold text-[11px] uppercase tracking-wider">
            <UserCheck className="w-4 h-4 text-teal-600" />
            <span>1-Klik Brza Prijava (Test Personas):</span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickPersona('policyholder')}
              className="p-2 rounded-2xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-800 text-center transition-colors group cursor-pointer"
            >
              <span className="block font-bold text-[11px] group-hover:text-teal-700">Ana Horvat</span>
              <span className="text-[10px] text-teal-600 font-mono">Klijent</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPersona('broker')}
              className="p-2 rounded-2xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-800 text-center transition-colors group cursor-pointer"
            >
              <span className="block font-bold text-[11px] group-hover:text-teal-700">Marija Šarić</span>
              <span className="text-[10px] text-sky-600 font-mono">Broker</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPersona('admin')}
              className="p-2 rounded-2xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-800 text-center transition-colors group cursor-pointer"
            >
              <span className="block font-bold text-[11px] group-hover:text-teal-700">Ivan Radić</span>
              <span className="text-[10px] text-amber-600 font-mono">Procjenitelj</span>
            </button>
          </div>
        </div>

        {/* Login Card */}
        <div className="p-6 sm:p-8 bg-white border border-slate-200/80 rounded-3xl shadow-bento">
          {authError && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                Korisnički email
              </label>
              <Input
                type="email"
                placeholder="npr. korisnik@email.hr"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono font-semibold text-slate-700">Lozinka</label>
                <a href="#" className="text-[11px] font-mono text-teal-700 hover:underline">
                  Zaboravljena lozinka?
                </a>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full font-mono font-bold mt-2"
            >
              {isSubmitting ? 'Prijava u tijeku...' : 'Prijavi se u portal'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500 font-mono">
            Nemate otvoren korisnički račun?{' '}
            <Link to="/register" className="font-bold text-teal-700 hover:underline">
              Registrirajte se ovdje &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
