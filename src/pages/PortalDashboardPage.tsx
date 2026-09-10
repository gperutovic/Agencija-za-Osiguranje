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
import { PolicyCard } from '../components/portal/PolicyCard';
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

  const [activeTab, setActiveTab] = useState<'policies' | 'claims' | 'vault' | 'appointments'>('policies');

  const handleRenew = async (policyId: string) => {
    await renewPolicy(policyId);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Welcome Header */}
      <section className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/20 px-3 py-0.5 rounded-full border border-teal-400/30">
                Korisnički Portal &bull; Moj Život
              </span>
              {user?.oib && (
                <span className="text-xs font-mono text-slate-300">
                  OIB: {user.oib}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Dobrodošli, {user?.displayName || 'Korisnik'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Upravljajte svojim policama osiguranja, preuzimajte digitalne certifikate i pratite odštetne spise.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/calculator">
              <Button variant="teal" size="sm" className="font-bold">
                <Plus className="w-4 h-4 mr-1" />
                Ugovori novu policu
              </Button>
            </Link>
            <Link to="/claims">
              <Button variant="danger" size="sm" className="font-bold">
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
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {[
            { id: 'policies', label: `Moje Police (${policies.length})`, icon: Shield },
            { id: 'claims', label: `Moji Odštetni Zahtjevi (${claims.length})`, icon: AlertTriangle },
            { id: 'vault', label: 'Trezor Dokumenata', icon: FileText },
            { id: 'appointments', label: 'Termin Savjetovanja', icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: POLICIES */}
        {activeTab === 'policies' && (
          <div className="space-y-4">
            {policiesLoading ? (
              <div className="text-center py-12 text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-sm">Učitavanje polica osiguranja...</p>
              </div>
            ) : policies.length === 0 ? (
              <Card className="p-12 text-center bg-white border-slate-200">
                <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 text-lg">Nemate aktivnih polica osiguranja</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
                  Izračunajte ponudu u našem kalkulatoru i ugovorite optimalno pokriće za vozilo, nekretninu ili zdravlje.
                </p>
                <Link to="/calculator">
                  <Button variant="primary">Pokreni kalkulator premije</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {policies.map((p: Policy) => (
                  <PolicyCard key={p.id} policy={p} onRenew={handleRenew} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CLAIMS */}
        {activeTab === 'claims' && (
          <div className="space-y-6">
            {claims.length === 0 ? (
              <Card className="p-12 text-center bg-white border-slate-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 text-lg">Nemate evidentiranih šteta</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
                  Sve je sigurno! Ako vam se dogodi nezgoda ili šteta na imovini, možete je prijaviti online u samo nekoliko minuta.
                </p>
                <Link to="/claims">
                  <Button variant="danger">Prijavi novu štetu (FNOL)</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-6">
                {claims.map((claim: Claim) => (
                  <Card key={claim.id} className="p-6 bg-white border-slate-200 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Broj spisa
                        </span>
                        <h4 className="text-xl font-mono font-bold text-brand-900">
                          {claim.claimNumber}
                        </h4>
                      </div>
                      <div className="text-xs text-slate-500">
                        Polica: <strong className="font-mono text-slate-800">{claim.policyId}</strong>
                      </div>
                    </div>

                    {/* Live Progress Timeline */}
                    <ClaimStatusTimeline claim={claim} />

                    <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-1 text-slate-700">
                      <p>
                        <strong>Mjesto i opis:</strong> {claim.incidentLocation} &bull; {claim.description}
                      </p>
                      {claim.brokerNotes && (
                        <p className="text-brand-900 font-semibold pt-1 border-t border-slate-200 mt-2">
                          Status odjela likvidacije: {claim.brokerNotes}
                        </p>
                      )}
                    </div>
                  </Card>
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
