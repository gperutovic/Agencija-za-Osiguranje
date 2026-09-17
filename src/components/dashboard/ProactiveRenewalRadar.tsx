import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellRing,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertTriangle,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { Policy } from '../../types/insurance';

interface ProactiveRenewalRadarProps {
  policies: Policy[];
  onAcceptRenewal: (policyId: string) => void;
  className?: string;
}

export const ProactiveRenewalRadar: React.FC<ProactiveRenewalRadarProps> = ({
  policies,
  onAcceptRenewal,
  className = '',
}) => {
  const [selectedPolicyForComparison, setSelectedPolicyForComparison] = useState<Policy | null>(null);
  const [justAcceptedId, setJustAcceptedId] = useState<string | null>(null);

  // Find policies expiring within 45 days or with status expiring_soon or renewal_pending
  const expiringPolicies = policies.filter(
    (p) => p.status === 'expiring_soon' || p.status === 'renewal_pending' || !!p.renewalOffer
  );

  if (expiringPolicies.length === 0) {
    return null;
  }

  const handleAccept = (policyId: string) => {
    onAcceptRenewal(policyId);
    setJustAcceptedId(policyId);
    setTimeout(() => {
      setJustAcceptedId(null);
      setSelectedPolicyForComparison(null);
    }, 2500);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top Proactive Alert Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 dark:border-amber-500/20 backdrop-blur-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
              <BellRing className="w-6 h-6 animate-bounce" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                <span>Proaktivni radar obnove (30–45 dana do isteka)</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Imate {expiringPolicies.length} policu kojoj se bliži redovni istek pokrića
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
                Agencija Život pripremila je optimizirane uvjete obnove s uračunatim popustom za lojalnost i zaštitom bonusa bez prekida osiguranja.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedPolicyForComparison(expiringPolicies[0])}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all self-start sm:self-auto shrink-0"
          >
            <Zap className="w-4 h-4" />
            <span>Usporedi i obnovi (1-klik)</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Modal / Box */}
      <AnimatePresence>
        {selectedPolicyForComparison && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6"
            >
              {justAcceptedId === selectedPolicyForComparison.id ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-9 h-9 stroke-[3]" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white">
                    Polica je uspješno obnovljena na idućih 12 mjeseci!
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Nova polica i digitalna zelena karta pohranjene su u vašem digitalnom novčaniku s kontinuitetom pokrića.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                        Usporedba uvjeta &bull; Radar obnove
                      </span>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">
                        {selectedPolicyForComparison.assetName}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Osiguratelj: {selectedPolicyForComparison.carrier} &bull; Broj:{' '}
                        {selectedPolicyForComparison.policyNumber}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPolicyForComparison(null)}
                      className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Side-by-side columns: Current vs Renewal */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Column 1: Current Policy */}
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          Postojeća polica
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Istječe: {selectedPolicyForComparison.endDate}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Dosadašnja godišnja premija:</span>
                        <div className="text-2xl font-black text-slate-800 dark:text-slate-200 font-mono">
                          {selectedPolicyForComparison.premiumAnnual.toFixed(2)} €
                        </div>
                      </div>
                      <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-slate-500 font-semibold block">Uključena pokrića:</span>
                        {selectedPolicyForComparison.coverageDetails?.riders.map((r, i) => (
                          <div key={i} className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: New Renewal Offer with Discount */}
                    <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-100 space-y-4 shadow-sm relative">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          Nova ponuda obnove
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                          Popust: -{selectedPolicyForComparison.renewalOffer?.carrierDiscountPercentage || 7}%
                        </span>
                      </div>
                      <div>
                        <span className="text-emerald-700 dark:text-emerald-400 block">
                          Nova povlaštena premija:
                        </span>
                        <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono flex items-baseline gap-2">
                          <span>
                            {(
                              selectedPolicyForComparison.renewalOffer?.newPremiumAnnual ||
                              selectedPolicyForComparison.premiumAnnual * 0.93
                            ).toFixed(2)}{' '}
                            €
                          </span>
                          <span className="text-xs line-through text-slate-400">
                            {selectedPolicyForComparison.premiumAnnual.toFixed(2)} €
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1.5 pt-2 border-t border-emerald-200 dark:border-emerald-800">
                        <span className="text-emerald-800 dark:text-emerald-300 font-semibold block">
                          Dodatne pogodnosti uz obnovu:
                        </span>
                        <div className="text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Zadržavanje 50% stečenog bonusa</span>
                        </div>
                        <div className="text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Pomoć na cesti i pravna zaštita uključeni</span>
                        </div>
                        <div className="text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Kontinuitet bez ijednog dana prekida</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSelectedPolicyForComparison(null)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                    >
                      Odustani
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAccept(selectedPolicyForComparison.id)}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Prihvati obnovu i aktiviraj policu</span>
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
