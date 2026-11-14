import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  FileText,
  AlertTriangle,
  Calendar,
  Clock,
  CheckCircle2,
  Plus,
  RefreshCw,
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
import { Button } from '../components/common/Button';
import { Claim } from '../types/database';

export const PortalDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { policies, renewPolicy, isLoading: policiesLoading } = usePolicies(user?.uid);
  const { claims, isLoading: claimsLoading } = useClaims(user?.uid);

  const [activeTab, setActiveTab] = useState<'policies' | 'fnol' | 'claims' | 'vault' | 'appointments'>('policies');

  const handleRenew = async (policyId: string) => {
    await renewPolicy(policyId);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 text-slate-900">
      {/* Top Welcome Header */}
      <section className="bg-white border-b border-slate-200 pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2942]/5 border border-[#0F2942]/15 text-xs font-semibold text-[#0F2942]">
                <span>Korisnički portal</span>
                <span className="text-slate-400">&bull;</span>
                <span>Agencija Život</span>
              </div>
              {user?.oib && (
                <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  OIB: {user.oib}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Dobrodošli, {user?.displayName || 'Korisnik'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Upravljajte svojim policama osiguranja, preuzimajte potvrde i pratite status odštetnih spisa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/auto-osiguranje')}
              className="font-semibold"
            >
              <Plus className="w-4 h-4 mr-1" />
              Ugovori novu policu
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => navigate('/prijava-stete')}
              className="font-semibold"
            >
              Prijavi štetu
            </Button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Automatic Renewal Alert Banner */}
        <RenewalAlertBanner policies={policies} onRenewPolicy={handleRenew} />

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {[
            { id: 'policies', label: `Trezor polica (${policies.length})`, icon: Shield },
            { id: 'fnol', label: 'Prijava štete', icon: AlertTriangle },
            { id: 'claims', label: `Status odštetnih spisa (${claims.length})`, icon: Clock },
            { id: 'vault', label: 'Dokumenti i IPID', icon: FileText },
            { id: 'appointments', label: 'Termin savjetovanja', icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#0F2942] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
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
              <div className="text-center py-12 text-slate-500">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-[#0F2942]" />
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
            {claimsLoading ? (
              <div className="text-center py-12 text-slate-500">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-[#0F2942]" />
                <p className="text-sm">Učitavanje odštetnih spisa...</p>
              </div>
            ) : claims.length === 0 ? (
              <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 text-lg">Nemate evidentiranih šteta</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 mb-6">
                  U slučaju prometne nezgode ili štete na imovini, prijavu možete podnijeti elektroničkim putem u nekoliko koraka.
                </p>
                <Button
                  variant="danger"
                  onClick={() => setActiveTab('fnol')}
                  className="font-semibold"
                >
                  Prijavi novu štetu
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {claims.map((claim: Claim) => (
                  <div key={claim.id} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          Broj spisa
                        </span>
                        <h4 className="text-xl font-mono font-bold text-[#0F2942]">
                          {claim.claimNumber}
                        </h4>
                      </div>
                      <div className="text-xs text-slate-500">
                        Polica: <strong className="font-mono text-slate-900">{claim.policyId}</strong>
                      </div>
                    </div>

                    {/* Live Progress Timeline */}
                    <ClaimStatusTimeline claim={claim} />

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-700">
                      <p>
                        <strong className="text-slate-900">Mjesto i opis:</strong> {claim.incidentLocation} &bull; {claim.description}
                      </p>
                      {claim.brokerNotes && (
                        <p className="text-[#0F2942] font-semibold pt-2 border-t border-slate-200 mt-2">
                          Bilješka obrade: {claim.brokerNotes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DOCUMENT VAULT */}
        {activeTab === 'vault' && (
          <div>
            <DocumentVault policies={policies} />
          </div>
        )}

        {/* TAB 5: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div>
            <AppointmentScheduler />
          </div>
        )}
      </div>
    </div>
  );
};
