import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Kanban,
  FileCheck,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  FileText,
  DollarSign,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useQuotes } from '../hooks/useQuotes';
import { useClaims } from '../hooks/useClaims';
import { LeadsTable } from '../components/admin/LeadsTable';
import { QuotePipelineBoard } from '../components/admin/QuotePipelineBoard';
import { ClaimsManagementTable } from '../components/admin/ClaimsManagementTable';
import { RegulatoryAuditView } from '../components/admin/RegulatoryAuditView';
import { QuoteRequest, Claim } from '../types/database';
import { formatCurrency } from '../utils/formatters';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { quotes, updateQuoteStatus, isLoading: quotesLoading } = useQuotes();
  const { claims, updateClaimStatus, isLoading: claimsLoading } = useClaims();

  const [activeTab, setActiveTab] = useState<'leads' | 'pipeline' | 'claims' | 'audit'>('leads');

  // Aggregated KPIs
  const newLeadsCount = quotes.filter((q: QuoteRequest) => q.status === 'new').length;
  const boundQuotesCount = quotes.filter((q: QuoteRequest) => q.status === 'bound').length;
  const activeClaimsCount = claims.filter(
    (c: Claim) => c.status === 'submitted' || c.status === 'under_review' || c.status === 'assessing'
  ).length;
  const totalPipelineVal = quotes.reduce(
    (sum: number, q: QuoteRequest) => sum + (q.calculatedEstimate.annualPremium || 0),
    0
  );

  return (
    <div className="space-y-8 pb-24 text-slate-100">
      {/* Top Header Banner */}
      <section className="relative overflow-hidden pt-12 pb-14">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#fb6504]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono font-bold tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-[#fb6504] animate-pulse" />
              <span className="text-white">Broker Back-Office & CRM</span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-[#ff7b1a]">Agencija Život</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Upravljačka ploča brokera
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-light">
              Pregled prodajnog lijevka, obrada dolaznih upita i rješavanje odštetnih spisa Generali osiguranja.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 bg-white/[0.02] px-3 py-1.5 rounded-2xl border border-white/[0.08]">
              Prijavljeni broker:{' '}
              <strong className="text-white font-bold">{user?.displayName || 'Marija Šarić'}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl rounded-3xl shadow-xl flex items-center gap-4 group hover:border-cyan-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Novi upiti</span>
              <p className="text-2xl font-black text-white font-mono">{newLeadsCount}</p>
            </div>
          </div>

          <div className="p-5 bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl rounded-3xl shadow-xl flex items-center gap-4 group hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Ugovorene police</span>
              <p className="text-2xl font-black text-emerald-400 font-mono">{boundQuotesCount}</p>
            </div>
          </div>

          <div className="p-5 bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl rounded-3xl shadow-xl flex items-center gap-4 group hover:border-rose-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Štete u rješavanju</span>
              <p className="text-2xl font-black text-rose-400 font-mono">{activeClaimsCount}</p>
            </div>
          </div>

          <div className="p-5 bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl rounded-3xl shadow-xl flex items-center gap-4 group hover:border-[#fb6504]/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#fb6504]/10 border border-[#fb6504]/20 text-[#ff7b1a] flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Vrijednost pipelinea</span>
              <p className="text-xl font-bold text-[#ff7b1a] font-mono">
                {formatCurrency(totalPipelineVal)}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 border-b border-white/[0.08] pb-3">
          {[
            { id: 'leads', label: `Upiti i Klijenti (${quotes.length})`, icon: Users },
            { id: 'pipeline', label: 'Kanban Prodajni Lijevak', icon: Kanban },
            { id: 'claims', label: `Likvidacija Šteta (${claims.length})`, icon: FileCheck },
            { id: 'audit', label: 'HANFA & IDD Usklađenost', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#fb6504] to-[#ff7b1a] text-white shadow-[0_0_16px_rgba(251,101,4,0.35)]'
                    : 'bg-[#0a0d16]/90 text-slate-400 hover:text-white border border-white/[0.08] hover:border-white/[0.16]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: LEADS TABLE */}
        {activeTab === 'leads' && (
          <LeadsTable quotes={quotes} onStatusChange={updateQuoteStatus} />
        )}

        {/* TAB 2: PIPELINE BOARD */}
        {activeTab === 'pipeline' && (
          <QuotePipelineBoard quotes={quotes} onStatusChange={updateQuoteStatus} />
        )}

        {/* TAB 3: CLAIMS MANAGEMENT */}
        {activeTab === 'claims' && (
          <ClaimsManagementTable claims={claims} onUpdateStatus={updateClaimStatus} />
        )}

        {/* TAB 4: REGULATORY AUDIT */}
        {activeTab === 'audit' && (
          <RegulatoryAuditView />
        )}
      </div>
    </div>
  );
};
