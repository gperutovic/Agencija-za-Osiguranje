import React, { useState } from 'react';
import { FileCheck2, AlertTriangle, Phone, Search, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { ClaimsIntakeForm } from '../components/claims/ClaimsIntakeForm';
import { ClaimStatusTimeline } from '../components/claims/ClaimStatusTimeline';
import { JsonLd } from '../components/seo/JsonLd';
import { AGENCY_DETAILS } from '../lib/content/insurance-data';

export const metadata = {
  title: 'Prijava Štete 24/7 (FNOL) | Agencija Život Zagreb',
  description:
    'Digitalna prijava štete za auto, kasko, imovinu i zdravstvo. Prijavite štetni događaj online u 3 minute ili provjerite status predmeta uz asistenciju Agencije Život.',
};

export default function PrijavaStetePage() {
  const [activeTab, setActiveTab] = useState<'nova' | 'status'>('nova');
  const [searchClaimId, setSearchClaimId] = useState('');
  const [activeClaimData, setActiveClaimData] = useState<any>(null);

  const howToSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'HowTo' as const,
    name: 'Kako prijaviti štetu na vozilu ili imovini u Hrvatskoj',
    description:
      'Vodič u 4 koraka za brzu i pravovaljanu digitalnu prijavu štetnog događaja prema osiguratelju i ostvarivanje naknade bez kašnjenja.',
    step: [
      {
        '@type': 'HowToStep' as const,
        position: 1,
        name: 'Osiguranje mjesta događaja i fotografiranje',
        text: 'Osigurajte mjesto nesreće ili štete, pozovite policiju po potrebi (prometna nesreća s ozlijeđenima ili veća šteta) i fotografirajte oštećenja iz više kutova.',
      },
      {
        '@type': 'HowToStep' as const,
        position: 2,
        name: 'Popunjavanje Europskog izvješća ili zapisnika',
        text: 'Kod prometnih nesreća bez policijskog očevida, popunite i potpišite Europsko izvješće o nezgodi s drugim sudionikom.',
      },
      {
        '@type': 'HowToStep' as const,
        position: 3,
        name: 'Digitalna prijava štete putem Agencije Život',
        text: 'Unesite broj police, OIB osiguranika, IBAN za isplatu i priložite fotografije oštećenja kroz naš 24/7 obrazac za prijavu.',
      },
      {
        '@type': 'HowToStep' as const,
        position: 4,
        name: 'Procjena štete i isplata naknade',
        text: 'Procjenitelj osiguratelja vrši uviđaj uživo ili putem video procjene. Odobreni iznos naknade uplaćuje se izravno na Vaš IBAN ili ovlaštenom servisu.',
      },
    ],
  };

  const handleSearchStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchClaimId.trim()) {
      setActiveClaimData({
        id: 'claim-' + Date.now(),
        claimNumber: searchClaimId.toUpperCase(),
        policyId: 'POL-88912-ZG',
        userId: 'usr_guest',
        claimantName: 'Ivan Horvat',
        carrierName: 'Generali osiguranje d.d.',
        incidentDate: '12.02.2026.',
        incidentLocation: 'Zagreb, Slavonska avenija',
        description: 'Materijalna šteta na prednjem braniku i vjetrobranskom staklu.',
        estimatedDamage: 1450,
        status: 'assessing',
        brokerNotes: 'Uviđaj zakazan u ovlaštenom servisu Toyota Centar Zagreb za 15.02.2026.',
        createdAt: '2026-02-12T09:14:00Z',
        updatedAt: '2026-02-12T11:30:00Z',
      });
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-10 sm:py-16">
      <JsonLd schema={howToSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header and GEO Standalone Direct Answer Block */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>24/7 CENTAR ZA ŠTETE &bull; DEŽURNI AGENT: 01 4800 120</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            Digitalna prijava i vođenje štete (FNOL)
          </h1>

          {/* Standalone GEO Direct Answer Block */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-left text-sm text-slate-700 leading-relaxed">
            <p>
              <strong>Prijava štete (First Notice of Loss - FNOL)</strong> je službeni početak postupka naknade štete iz osiguranja. U slučaju prometne nezgode, loma stakla ili štete na stanu (potres, izljev vode), prijavu možete podnijeti online 24 sata dnevno bez odlaska u poslovnicu. Agencija Život osigurava besplatnu pravnu i administrativnu asistenciju: od prijave i zakazivanja procjene do kontrole izračuna i isplate naknade od strane osiguratelja (Generali, Croatia, Allianz, Wiener).
            </p>
          </div>

          {/* Selector Tabs */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 mt-2">
            <button
              onClick={() => setActiveTab('nova')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'nova'
                  ? 'bg-white text-slate-950 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-rose-600" />
              <span>Nova digitalna prijava štete</span>
            </button>

            <button
              onClick={() => setActiveTab('status')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'status'
                  ? 'bg-white text-slate-950 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-4 h-4 text-blue-600" />
              <span>Provjeri status postojećeg predmeta</span>
            </button>
          </div>
        </div>

        {/* Tab 1: New Claim Intake Form */}
        {activeTab === 'nova' && (
          <div className="max-w-5xl mx-auto">
            <ClaimsIntakeForm />
          </div>
        )}

        {/* Tab 2: Claim Status Lookup */}
        {activeTab === 'status' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Praćenje statusa likvidacije štete</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Unesite broj predmeta štete (npr. ST-2026-8912) za provjeru faze obrade.
                </p>
              </div>

              <form onSubmit={handleSearchStatus} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  value={searchClaimId}
                  onChange={(e) => setSearchClaimId(e.target.value)}
                  placeholder="ST-2026-8912"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-sm font-mono uppercase focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Provjeri spis</span>
                </button>
              </form>

              {activeClaimData && (
                <div className="pt-6 border-t border-slate-200">
                  <ClaimStatusTimeline claim={activeClaimData} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Emergency Assistance Hotline Card */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-mono uppercase font-bold text-amber-400">
              Hitni slučajevi na cesti ili u stanu?
            </span>
            <h3 className="text-2xl font-black">Dežurna asistencija i pravni savjet 24/7</h3>
            <p className="text-xs text-slate-300 max-w-md">
              Ako je došlo do teže nezgode ili sporne krivnje, nazovite našeg dežurnog likvidatora prije potpisivanja spornih dokumenata.
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
            <a
              href="tel:014800120"
              className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>01 4800 120 (Centrala)</span>
            </a>
            <a
              href="tel:015550666"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center justify-center gap-2"
            >
              <span>01 555 0666 (Dežurni mobitel)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

