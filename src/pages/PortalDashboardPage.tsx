import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  FileText,
  AlertTriangle,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Plus,
  RefreshCw,
  Sparkles,
  Award,
  Layers,
  BarChart3,
} from 'lucide-react';
import { useInsurtechStore } from '../store/useInsurtechStore';
import { PolicyWalletDashboard } from '../components/dashboard/PolicyWalletDashboard';
import { IncidentWizardFNOL } from '../components/claims/IncidentWizardFNOL';
import { LiveClaimMilestoneTracker } from '../components/claims/LiveClaimMilestoneTracker';
import { AssignedAdvisorBadge } from '../components/advisor/AssignedAdvisorBadge';
import { MultiCarrierComparisonMatrix } from '../components/advisor/MultiCarrierComparisonMatrix';
import { MayaQuoteEngine } from '../components/quote-funnel/MayaQuoteEngine';

export const PortalDashboardPage: React.FC = () => {
  const { user, advisor, policies, claims } = useInsurtechStore();
  const [activeTab, setActiveTab] = useState<'policies' | 'fnol' | 'claims' | 'comparison' | 'quote'>('policies');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-24">
      {/* Top Welcome Header - Institutional Modern Financial Style */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-10 pb-12 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono font-bold tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white">Klijentski Portal</span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="text-emerald-400">Moj Život</span>
                </div>
                {user?.oib && (
                  <span className="text-xs font-mono text-slate-300 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                    OIB: {user.oib}
                  </span>
                )}
                <span className="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                  Digitalni novčanik
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Dobrodošli, {user?.displayName || 'Marko Horvatić'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-light max-w-2xl">
                Upravljajte svojim policama osiguranja, preuzimajte Zelene karte i PDF ugovore te pratite status isplate odštetnih spisa u stvarnom vremenu.
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('quote')}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Novi izračun (Maya Engine)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('fnol')}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Prijavi štetu (FNOL)</span>
              </button>
            </div>
          </div>

          {/* Assigned Advisor Hub Banner */}
          <div className="pt-2">
            <AssignedAdvisorBadge advisor={advisor} />
          </div>
        </div>
      </section>

      {/* Main Viewport Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {[
            { id: 'policies', label: `Novčanik Polica (${policies.length})`, icon: Shield },
            { id: 'fnol', label: 'Prijavi Štetu (FNOL)', icon: AlertTriangle },
            { id: 'claims', label: `Status Odšteta (${claims.length})`, icon: Clock },
            { id: 'comparison', label: 'Usporedba Tržišta RH', icon: BarChart3 },
            { id: 'quote', label: 'Kalkulator Cijena', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: POLICIES WALLET */}
        {activeTab === 'policies' && (
          <div>
            <PolicyWalletDashboard onAddNewPolicy={() => setActiveTab('quote')} />
          </div>
        )}

        {/* TAB 2: DIGITAL FNOL CLAIMS */}
        {activeTab === 'fnol' && (
          <div>
            <IncidentWizardFNOL
              onClaimSubmitted={(newClaim) => {
                setActiveTab('claims');
              }}
            />
          </div>
        )}

        {/* TAB 3: LIVE CLAIMS TRACKER */}
        {activeTab === 'claims' && (
          <div className="space-y-6">
            {claims.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Nemate aktivnih odštetnih zahtjeva
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Sve je sigurno! Ako vam se dogodi nezgoda na cesti ili oštećenje imovine, možete je prijaviti online u roku od nekoliko minuta.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('fnol')}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                >
                  Prijavi novu štetu (FNOL)
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {claims.map((claim) => (
                  <LiveClaimMilestoneTracker key={claim.id} claim={claim} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MULTI-CARRIER COMPARISON */}
        {activeTab === 'comparison' && (
          <div>
            <MultiCarrierComparisonMatrix />
          </div>
        )}

        {/* TAB 5: MAYA QUOTE ENGINE */}
        {activeTab === 'quote' && (
          <div>
            <MayaQuoteEngine onCompleted={() => setActiveTab('policies')} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PortalDashboardPage;
