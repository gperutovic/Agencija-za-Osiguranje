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
  Eye,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePolicies } from '../hooks/usePolicies';
import { useClaims } from '../hooks/useClaims';
import { PolicyVault } from '../components/portal/PolicyVault';
import { DigitalClaimsFNOL } from '../components/portal/DigitalClaimsFNOL';
import { RenewalAlertBanner } from '../components/portal/RenewalAlertBanner';
import { DocumentVault } from '../components/portal/DocumentVault';
import { AppointmentScheduler } from '../components/portal/AppointmentScheduler';
import { ClaimStatusTimeline } from '../components/claims/ClaimStatusTimeline';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Policy, Claim } from '../types/database';

export const PortalDashboardPage: React.FC = () => {
  const { user, role } = useAuth();
  const { policies, renewPolicy, isLoading: policiesLoading } = usePolicies(user?.uid);
  const { claims, isLoading: claimsLoading } = useClaims(user?.uid);

  const [activeTab, setActiveTab] = useState<'policies' | 'fnol' | 'claims' | 'vault' | 'appointments'>('policies');

  const handleRenew = async (policyId: string) => {
    await renewPolicy(policyId);
  };

  return (
    <div className="space-y-8 pb-24 text-slate-100">
      {/* Top Welcome Header */}
      <section className="relative overflow-hidden pt-12 pb-14">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#fb6504]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#fb6504] animate-pulse" />
                <span className="text-white">Korisnički Portal</span>
                <span className="text-slate-500">&bull;</span>
                <span className="text-[#ff7b1a]">Moj Život</span>
              </div>
              {user?.oib && (
                <span className="text-xs font-mono text-slate-400 bg-white/[0.02] px-2.5 py-0.5 rounded-full border border-white/[0.06]">
                  OIB: {user.oib}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Dobrodošli, {user?.displayName || 'Korisnik'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-light">
              Upravljajte svojim policama osiguranja, preuzimajte digitalne certifikate i pratite odštetne spise.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/calculator">
              <Button variant="primary" size="sm" className="font-mono font-bold">
                <Plus className="w-4 h-4 mr-1" />
                Ugovori novu policu
              </Button>
            </Link>
            <Link to="/claims">
              <Button variant="danger" size="sm" className="font-mono font-bold">
                Prijavi štetu (FNOL)
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Automatic Renewal Alert Banner */}
        <RenewalAlertBanner policies={policies} onRenewPolicy={handleRenew} />

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-white/[0.08] pb-3">
          {[
            { id: 'policies', label: `Trezor Polica (${policies.length})`, icon: Shield },
            { id: 'fnol', label: 'Prijavi Štetu (Digitalni FNOL)', icon: AlertTriangle },
            { id: 'claims', label: `Status Odštetnih Spisa (${claims.length})`, icon: Clock },
            { id: 'vault', label: 'Pravni Dokumenti & IPID', icon: FileText },
            { id: 'appointments', label: 'Termin Savjetovanja', icon: Calendar },
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

        {/* TAB 1: POLICIES VAULT */}
        {activeTab === 'policies' && (
          <div className="space-y-4">
            {policiesLoading ? (
              <div className="text-center py-12 text-slate-400 font-mono">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-[#ff7b1a]" />
                <p className="text-sm">Učitavanje polica osiguranja...</p>
              </div>
            ) : (
              <PolicyVault policies={policies} onRenewPolicy={handleRenew} />
            )}
          </div>
        )}

        {/* TAB 2: DIGITAL FNOL CLAIMS */}
        {activeTab === 'fnol' && (
          <div className="space-y-4">
            <DigitalClaimsFNOL />
          </div>
        )}

        {/* TAB 3: CLAIMS TRACKING */}
        {activeTab === 'claims' && (
          <div className="space-y-6">
            {claims.length === 0 ? (
              <div className="p-12 text-center bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl rounded-3xl shadow-xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="font-bold text-white text-lg">Nemate evidentiranih šteta</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-6 font-mono">
                  Sve je sigurno! Ako vam se dogodi nezgoda ili šteta na imovini, možete je prijaviti online u samo nekoliko minuta.
                </p>
                <Button
                  variant="danger"
                  onClick={() => setActiveTab('fnol')}
                  className="font-mono font-bold"
                >
                  Prijavi novu štetu (FNOL)
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {claims.map((claim: Claim) => (
                  <div key={claim.id} className="p-6 bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl rounded-3xl shadow-xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.08] gap-2">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                          Broj spisa
                        </span>
                        <h4 className="text-xl font-mono font-bold text-[#ff7b1a]">
                          {claim.claimNumber}
                        </h4>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        Polica: <strong className="font-mono text-white">{claim.policyId}</strong>
                      </div>
                    </div>

                    {/* Live Progress Timeline */}
                    <ClaimStatusTimeline claim={claim} />

                    <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/[0.06] text-xs space-y-1 text-slate-300">
                      <p>
                        <strong className="text-white">Mjesto i opis:</strong> {claim.incidentLocation} &bull; {claim.description}
                      </p>
                      {claim.brokerNotes && (
                        <p className="text-[#ff7b1a] font-mono font-semibold pt-1 border-t border-white/[0.06] mt-2">
                          Status odjela likvidacije: {claim.brokerNotes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DOCUMENT VAULT */}
        {activeTab === 'vault' && (
          <div>
            <DocumentVault policies={policies} />
          </div>
        )}

        {/* TAB 4: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div>
            <AppointmentScheduler />
          </div>
        )}
      </div>
    </div>
  );
};
