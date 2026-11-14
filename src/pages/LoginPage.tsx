import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { loginSchema, LoginFormData } from '../utils/validators';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { AGENCY_DETAILS } from '../lib/content/insurance-data';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/portal';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setAuthError(null);
      await login(data.email, 'policyholder');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Neuspješna prijava. Provjerite podatke.';
      setAuthError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickPortalAccess = (role: 'policyholder' | 'broker') => {
    switchDemoRole(role);
    navigate(role === 'policyholder' ? '/portal' : '/admin');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-11 h-11 rounded-xl bg-[#0F2942] text-white flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Portal za klijente
          </h1>
          <p className="text-sm text-slate-600">
            Pregled aktivnih polica, dokumenata i statusa prijava šteta
          </p>
        </div>

        <Card className="p-6 sm:p-8 bg-white border-slate-200 shadow-sm">
          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                E-mail adresa
              </label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="ime.prezime@email.hr"
                  className="pl-10"
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lozinka
              </label>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  {...register('password')}
                  error={errors.password?.message}
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Prijava u tijeku...' : 'Prijavite se'}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-200 text-center text-xs text-slate-600">
            Još nemate korisnički račun?{' '}
            <Link to="/register" className="font-semibold text-[#0F2942] hover:underline">
              Registrirajte se
            </Link>
          </div>
        </Card>

        {/* Discreet Demo Preview Switch */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 text-center space-y-2.5">
          <p className="text-xs font-medium text-slate-500">
            Brzi pregled funkcionalnosti klijentskog portala:
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickPortalAccess('policyholder')}
              className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0F2942] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Korisnički pregled (Ana Horvat)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleQuickPortalAccess('broker')}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
            >
              Uredski CRM
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Pomoć pri pristupu: {AGENCY_DETAILS.phone} • {AGENCY_DETAILS.email}
          </p>
        </div>
      </div>
    </div>
  );
};
