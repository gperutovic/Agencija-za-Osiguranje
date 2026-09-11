import React, { useState } from 'react';
import { 
  CreditCard, 
  PhoneCall, 
  QrCode, 
  Download, 
  ShieldCheck, 
  MapPin, 
  Truck, 
  Wrench, 
  Zap, 
  KeyRound, 
  AlertTriangle, 
  CheckCircle2 
} from 'lucide-react';
import { CarrierLogo } from './CarrierLogos';

interface DigitalCardProps {
  policyNumber?: string;
  insuredName?: string;
  vehiclePlate?: string;
  carrierName?: string;
  validUntil?: string;
}

export const GeicoDigitalCardModal: React.FC<DigitalCardProps> = ({
  policyNumber = 'HR-AO-2026-88192',
  insuredName = 'Ana Horvat',
  vehiclePlate = 'ZG-9412-AH',
  carrierName = 'Croatia Osiguranje d.d.',
  validUntil = '31.12.2026.'
}) => {
  const [activeTab, setActiveTab] = useState<'card' | 'sos'>('card');
  const [sosSent, setSosSent] = useState<boolean>(false);
  const [selectedIssue, setSelectedIssue] = useState<string>('towing');
  const [gpsLocation, setGpsLocation] = useState<string>('Zagreb, Ilica 242 (45.8150° N, 15.9819° E)');

  const handleRequestSos = () => {
    setSosSent(true);
    setTimeout(() => {
      alert('Hitna služba pomoći na cesti Agencije Život je obaviještena! Vučno vozilo je na putu prema vašoj GPS lokaciji.');
    }, 400);
  };

  return (
    <div className="rr-surface-card rounded-2xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl relative overflow-hidden">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#fb6504]" />
            <h3 className="text-base font-bold text-white tracking-tight">
              GEICO Standard • Digitalna Polica & 24/7 Asistencija
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Službena digitalna iskaznica osiguranja i hitni dispečer pomoći na cesti u cijeloj Hrvatskoj i EU
          </p>
        </div>

        <div className="flex rounded-xl bg-white/[0.04] p-1 border border-white/[0.08]">
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'card'
                ? 'bg-[#fb6504] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Digitalna Iskaznica & Zelena Karta
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sos')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'sos'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-rose-400 hover:text-rose-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>SOS Pomoć na Cesti</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Digital Policy Card (GEICO Signature wallet card) */}
      {activeTab === 'card' && (
        <div className="py-6 space-y-6">
          <div className="max-w-md mx-auto rounded-2xl p-6 bg-gradient-to-br from-[#121622] via-[#090d16] to-[#04060a] border border-[#fb6504]/40 shadow-2xl relative text-white">
            {/* Top Bar of card */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="font-mono text-[10px] font-bold tracking-widest text-[#fb6504]">
                  DIGITAL INSURANCE ID • RH / EU
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">HANFA LICENCA</span>
            </div>

            {/* Carrier & Insured */}
            <div className="my-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Ugovaratelj Osiguranja</div>
                  <div className="text-base font-bold text-white tracking-tight">{insuredName}</div>
                  <div className="text-xs font-mono text-[#fb6504] font-bold mt-0.5">OIB: 26182105153</div>
                </div>
                <CarrierLogo name={carrierName} className="h-6" />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06]">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Broj Police (AO + Kasko)</div>
                  <div className="text-xs font-mono font-bold text-white">{policyNumber}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Registarska Oznaka</div>
                  <div className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-white/10 inline-block">
                    {vehiclePlate}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06]">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Vrijedi do</div>
                  <div className="text-xs font-mono font-bold text-emerald-400">{validUntil}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Zelena Karta (IMIS)</div>
                  <div className="text-xs font-mono font-bold text-slate-200">HR • SVE ZEMLJE EU</div>
                </div>
              </div>
            </div>

            {/* Bottom QR & verification */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white text-black">
                  <QrCode className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400">Kripto verifikacija</div>
                  <div className="text-[9px] font-mono text-emerald-400 font-bold">✓ SLUŽBENI MUP/STP DOKUMENT</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert(`Preuzimanje službene PDF police i Zelene karte za ${policyNumber}...`)}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Preuzmi PDF</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400">
            Prihvaćeno na tehničkim pregledima (STP) i policijskim kontrolama sukladno Zakonu o obveznim osiguranjima u prometu.
          </div>
        </div>
      )}

      {/* Tab 2: 24/7 Roadside Assistance SOS (GEICO signature emergency feature) */}
      {activeTab === 'sos' && (
        <div className="py-6 space-y-6">
          {sosSent ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Dispečer je Poslao Pomoć na Cesti!</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Vučna služba partnera HAK / Generali / Croatia Asistencije stiže za otprilike <strong>18 minuta</strong>. 
                Dežurni koordinator vas zove na mobitel.
              </p>
              <div className="pt-2">
                <a
                  href="tel:+38514800120"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Direktni Poziv Dispečeru: +385 1 4800 120</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white">Hitna pomoć na cesti u 1 klik (GEICO stil): </strong>
                  <span className="text-slate-300">
                    Nalazite se u kvaru, prometnoj nezgodi ili trebate vuču? Pritisnite SOS gumb i naša asistencija automatski locira vaše vozilo.
                  </span>
                </div>
              </div>

              {/* Problem selection */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase">Odaberite vrstu kvara / potrebe:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedIssue('towing')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedIssue === 'towing'
                        ? 'bg-rose-600/20 border-rose-500 text-white'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                    }`}
                  >
                    <Truck className="w-5 h-5 mx-auto mb-1 text-rose-400" />
                    <div className="text-xs font-bold">Vuča / Šlepanje</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedIssue('tire')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedIssue === 'tire'
                        ? 'bg-rose-600/20 border-rose-500 text-white'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                    }`}
                  >
                    <Wrench className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                    <div className="text-xs font-bold">Puknuta Guma</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedIssue('battery')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedIssue === 'battery'
                        ? 'bg-rose-600/20 border-rose-500 text-white'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                    }`}
                  >
                    <Zap className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
                    <div className="text-xs font-bold">Akumulator / Struja</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedIssue('keys')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedIssue === 'keys'
                        ? 'bg-rose-600/20 border-rose-500 text-white'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                    }`}
                  >
                    <KeyRound className="w-5 h-5 mx-auto mb-1 text-sky-400" />
                    <div className="text-xs font-bold">Zaključani Ključevi</div>
                  </button>
                </div>
              </div>

              {/* Detected GPS location */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#fb6504]" />
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Vaša Detektirana GPS Lokacija</div>
                    <div className="text-xs text-white font-mono font-bold">{gpsLocation}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('GPS koordinati osvježeni s vašeg uređaja.')}
                  className="text-[11px] text-[#fb6504] hover:underline font-mono"
                >
                  Osvježi GPS
                </button>
              </div>

              {/* Trigger Button */}
              <button
                type="button"
                onClick={handleRequestSos}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-sm shadow-xl shadow-rose-900/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <PhoneCall className="w-5 h-5" />
                <span>POŠALJI HITNU POMOĆ NA CESTI SADA</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
