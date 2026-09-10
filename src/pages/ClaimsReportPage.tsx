import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  AlertTriangle,
  Search,
  PhoneCall,
  Clock,
  ShieldAlert,
  FileCheck,
  HelpCircle,
} from 'lucide-react';
import { FNOLWizard } from '../components/claims/FNOLWizard';
import { ClaimStatusTimeline } from '../components/claims/ClaimStatusTimeline';
import { useClaims } from '../hooks/useClaims';
import { Claim } from '../types/database';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const ClaimsReportPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialPolicyId = searchParams.get('policyId') || undefined;

  const [activeTab, setActiveTab] = useState<'report' | 'track'>(
    searchParams.get('track') ? 'track' : 'report'
  );
  const [trackQuery, setTrackQuery] = useState(searchParams.get('track') || '');
  const [searchedClaimNumber, setSearchedClaimNumber] = useState<string | null>(
    searchParams.get('track') || null
  );

  const { claims } = useClaims();

  const foundClaim = searchedClaimNumber
    ? claims.find(
        (c: Claim) =>
          c.claimNumber.trim().toLowerCase() === searchedClaimNumber.trim().toLowerCase()
      )
    : null;

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackQuery.trim()) {
      setSearchedClaimNumber(trackQuery.trim());
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-navy-950 via-slate-900 to-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Digitalna Prijava i Likvidacija Šteta &bull; 24/7 Dostupno</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto">
            Prijavite štetu ili provjerite status spisa
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Jednostavan postupak prijave uz prijenos fotografija. Pratite tijek obrade u realnom vremenu od uviđaja do konačne isplate.
          </p>

          {/* Tab Selector */}
          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={() => setActiveTab('report')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'report'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Nova prijava štete (FNOL)
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'track'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Praćenje postojećeg spisa (ST-2026-XXXX)
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'report' ? (
          <div>
            <FNOLWizard initialPolicyId={initialPolicyId} />
          </div>
        ) : (
          <div className="space-y-8 max-w-2xl mx-auto">
            {/* Lookup Input */}
            <Card className="p-6 sm:p-8 bg-white border-slate-200 shadow-md">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Unesite službeni broj odštetnog spisa
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Broj spisa započinje s <strong>ST-2026-</strong> (npr. ST-2026-4819). Pronaći ćete ga u potvrdnom emailu ili SMS obavijesti.
              </p>

              <form onSubmit={handleTrackSubmit} className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="npr. ST-2026-4819"
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    className="font-mono uppercase font-bold"
                  />
                </div>
                <Button type="submit" variant="primary" className="px-6">
                  <Search className="w-4 h-4 mr-1.5" />
                  Pronađi spis
                </Button>
              </form>
            </Card>

            {/* Results */}
            {searchedClaimNumber && (
              <div>
                {foundClaim ? (
                  <Card className="p-6 sm:p-8 bg-white border-slate-200 shadow-md space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Odštetni spis
                        </span>
                        <h4 className="text-2xl font-mono font-black text-brand-900">
                          {foundClaim.claimNumber}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">Broj police:</span>
                        <span className="text-xs font-mono font-bold text-slate-800">
                          {foundClaim.policyId}
                        </span>
                      </div>
                    </div>

                    {/* Timeline Component */}
                    <ClaimStatusTimeline claim={foundClaim} />

                    {foundClaim.brokerNotes && (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                        <strong className="block mb-1 text-slate-900">Bilješka likvidatora:</strong>
                        <p>{foundClaim.brokerNotes}</p>
                      </div>
                    )}
                  </Card>
                ) : (
                  <Card className="p-8 text-center bg-slate-50 border-slate-200">
                    <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                    <h4 className="font-bold text-slate-900 text-base">
                      Spis pod brojem "{searchedClaimNumber}" nije pronađen
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                      Provjerite jeste li točno prepisali format (npr. ST-2026-4819). Za provjeru kontaktirajte naš odjel likvidacije šteta.
                    </p>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {/* Emergency Hotline Box */}
        <div className="mt-12 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base">Hitna Asistencija i Prijava Telefonom 24/7</h4>
              <p className="text-xs text-slate-400">
                U slučaju prometne nezgode ili hitne vuče vozila nazovite besplatni Generali centar:
              </p>
            </div>
          </div>
          <div className="text-right">
            <a
              href="tel:0800242424"
              className="text-xl sm:text-2xl font-mono font-black text-rose-400 hover:text-rose-300"
            >
              0800 24 24 24
            </a>
            <span className="block text-[11px] text-slate-400">Besplatan poziv unutar RH</span>
          </div>
        </div>
      </section>
    </div>
  );
};
