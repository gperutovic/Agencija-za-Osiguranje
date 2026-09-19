import React, { useState } from 'react';
import { AlertTriangle, Clock, RefreshCw, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Policy } from '../../types/database';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Button } from '../common/Button';

interface RenewalAlertBannerProps {
  policies: Policy[];
  onRenewPolicy: (policyId: string) => Promise<void>;
}

export const RenewalAlertBanner: React.FC<RenewalAlertBannerProps> = ({
  policies,
  onRenewPolicy,
}) => {
  const [renewingId, setRenewingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  // Find policies expiring within 30 days or expired
  const expiringPolicies = policies.filter((p) => {
    const end = new Date(p.endDate).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  });

  if (expiringPolicies.length === 0) return null;

  const handleRenew = async (id: string) => {
    try {
      setRenewingId(id);
      await onRenewPolicy(id);
      setSuccessId(id);
      setTimeout(() => {
        setSuccessId(null);
      }, 4000);
    } catch (err) {
      console.error('Failed to renew policy:', err);
    } finally {
      setRenewingId(null);
    }
  };

  return (
    <div className="space-y-3 mb-6">
      {expiringPolicies.map((p) => {
        const end = new Date(p.endDate).getTime();
        const diffDays = Math.ceil((end - new Date().getTime()) / (1000 * 60 * 60 * 24));
        const isExpired = diffDays <= 0;
        const isSuccess = successId === p.id;

        return (
          <div
            key={p.id}
            className={`p-4 sm:p-5 rounded-2xl border transition-all backdrop-blur-xl ${
              isSuccess
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : isExpired
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    isSuccess
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                      : isExpired
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-500 dark:text-rose-400'
                      : 'bg-amber-500/20 border-amber-500/40 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {isSuccess ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {isSuccess
                      ? `Uspješno zatražena obnova police ${p.policyNumber}`
                      : isExpired
                      ? `Polica osiguranja ${p.policyNumber} je istekla!`
                      : `Upozorenje o isteku: Polica ${p.policyNumber} ističe za ${diffDays} dana`}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {isSuccess
                      ? 'Vaš zahtjev za obnovom je proslijeđen agentu. Potvrda i nova polica stići će na vaš email.'
                      : `Polica za ${p.type.toUpperCase()} (${p.insurer}) završava ${formatDate(
                          p.endDate
                        )}. Obnovite na vrijeme bez prekida pokrića.`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                {!isSuccess && (
                  <Button
                    variant={isExpired ? 'danger' : 'primary'}
                    size="sm"
                    disabled={renewingId === p.id}
                    onClick={() => handleRenew(p.id)}
                    className="flex items-center gap-2 whitespace-nowrap shadow-sm"
                  >
                    {renewingId === p.id ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Obnavljanje...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Obnovi policu ({formatCurrency(p.premiumAmount)})
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
