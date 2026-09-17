import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  FileText,
  Clock,
  Car,
  Home,
  Heart,
  Plane,
  Download,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Plus,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { useInsurtechStore } from '../../store/useInsurtechStore';
import { Policy, InsuranceProductType } from '../../types/insurance';
import { InstantDocumentCenter } from './InstantDocumentCenter';
import { ProactiveRenewalRadar } from './ProactiveRenewalRadar';

interface PolicyWalletDashboardProps {
  onAddNewPolicy?: () => void;
  className?: string;
}

export const PolicyWalletDashboard: React.FC<PolicyWalletDashboardProps> = ({
  onAddNewPolicy,
  className = '',
}) => {
  const { policies, acceptPolicyRenewal } = useInsurtechStore();
  const [selectedAssetFilter, setSelectedAssetFilter] = useState<string>('all');
  const [activeDocumentPolicy, setActiveDocumentPolicy] = useState<Policy | null>(null);

  // Filter policies
  const filteredPolicies =
    selectedAssetFilter === 'all'
      ? policies
      : selectedAssetFilter === 'vehicles'
      ? policies.filter((p) => p.type === 'auto' || p.type === 'kasko')
      : selectedAssetFilter === 'properties'
      ? policies.filter((p) => p.type === 'property')
      : policies.filter((p) => p.type === 'life' || p.type === 'travel');

  // Group policies by assetName
  const assetGroups = filteredPolicies.reduce<Record<string, Policy[]>>((acc, policy) => {
    const key = policy.assetName || 'Ostala pokrića';
    if (!acc[key]) acc[key] = [];
    acc[key].push(policy);
    return acc;
  }, {});

  const getStatusBadge = (status: Policy['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Aktivna polica
          </span>
        );
      case 'expiring_soon':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
            <Clock className="w-3.5 h-3.5" />
            Istječe uskoro (&lt;30 dana)
          </span>
        );
      case 'renewal_pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Čeka obnovu
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            Istekla
          </span>
        );
    }
  };

  const getProductIcon = (type: InsuranceProductType) => {
    switch (type) {
      case 'auto':
      case 'kasko':
        return Car;
      case 'property':
        return Home;
      case 'health':
      case 'life':
        return Heart;
      default:
        return Plane;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 1. Proactive Renewal Radar Banner */}
      <ProactiveRenewalRadar
        policies={policies}
        onAcceptRenewal={acceptPolicyRenewal}
      />

      {/* 2. Top Controls & Asset Filter */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Digitalni Novčanik Polica &bull; Moj Život</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Aktivna pokrića grupirana po imovini
          </h2>
          <p className="text-xs text-slate-500">
            Prikaz {policies.length} polica s trenutnim pristupom policama u PDF-u, zelenim kartama i uplatnicama.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: `Sva pokrića (${policies.length})` },
            { id: 'vehicles', label: 'Vozila' },
            { id: 'properties', label: 'Nekretnine' },
            { id: 'other', label: 'Zdravlje & Život' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedAssetFilter(tab.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                selectedAssetFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Asset-Grouped Policy Cards */}
      <div className="space-y-6">
        {Object.entries(assetGroups).map(([assetName, assetPolicies]) => {
          const firstPolicy = assetPolicies[0];
          const Icon = getProductIcon(firstPolicy.type);

          return (
            <div
              key={assetName}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              {/* Asset Header */}
              <div className="p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {assetName}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      {assetPolicies.length} {assetPolicies.length === 1 ? 'polica ugovorena' : 'police ugovorene'} &bull; Primarni partner: {firstPolicy.carrier}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Godišnji trošak imovine:
                  </span>
                  <span className="text-base font-black font-mono text-slate-900 dark:text-white">
                    {assetPolicies.reduce((sum, p) => sum + p.premiumAnnual, 0).toFixed(2)} €
                  </span>
                </div>
              </div>

              {/* Sub-policy cards */}
              <div className="p-5 sm:p-6 space-y-4">
                {assetPolicies.map((policy) => (
                  <div
                    key={policy.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(policy.status)}
                        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                          {policy.policyNumber}
                        </span>
                        <span className="text-xs text-slate-500">
                          {policy.carrier}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
                        <span>
                          Trajanje: <strong className="text-slate-800 dark:text-slate-200 font-mono">{policy.startDate} &rarr; {policy.endDate}</strong>
                        </span>
                        <span>&bull;</span>
                        <span>
                          Premija: <strong className="text-slate-900 dark:text-white font-mono">{policy.premiumAnnual.toFixed(2)} € / god.</strong> ({policy.paymentFrequency})
                        </span>
                        <span>&bull;</span>
                        <span>
                          Franšiza: <strong className="text-slate-800 dark:text-slate-200 font-mono">{policy.coverageDetails?.deductibleEur || 0} €</strong>
                        </span>
                      </div>

                      {/* Riders Chips */}
                      {policy.coverageDetails?.riders && policy.coverageDetails.riders.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {policy.coverageDetails.riders.map((rider, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              {rider}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-auto">
                      <button
                        type="button"
                        onClick={() => setActiveDocumentPolicy(policy)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-sm transition-all"
                      >
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>Dokumenti & Zelena Karta ({policy.documents.length})</span>
                      </button>

                      {policy.renewalOffer && !policy.renewalOffer.accepted && (
                        <button
                          type="button"
                          onClick={() => acceptPolicyRenewal(policy.id)}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Obnovi s popustom</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Instant Document Center Modal */}
      {activeDocumentPolicy && (
        <InstantDocumentCenter
          policy={activeDocumentPolicy}
          isOpen={!!activeDocumentPolicy}
          onClose={() => setActiveDocumentPolicy(null)}
        />
      )}
    </div>
  );
};
