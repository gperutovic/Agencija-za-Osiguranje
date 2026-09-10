import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Award, MapPin, Phone, Mail, Clock, FileText, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#06080c] text-slate-300 border-t border-white/[0.08] pt-16 pb-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#fb6504]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#fb6504] to-[#ff7b1a] flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(251,101,4,0.4)]">
                Ž
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                AGENCIJA ŽIVOT d.o.o.
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pr-4">
              Vodeća digitalna agencija za poslove zastupanja u osiguranju Generali osiguranja d.d. na području Republike Hrvatske. Spajamo suvremenu tehnologiju i individualno savjetovanje za potpunu financijsku i imovinsku sigurnost.
            </p>

            <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/[0.08] text-xs space-y-1.5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-[#fb6504] font-bold text-[11px]">
                <Award className="w-4 h-4 shrink-0" />
                <span className="font-mono uppercase tracking-wider">Nadzor Hrvatske agencije za nadzor financijskih usluga (HANFA)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                Klasa rješenja: UP/I-983-02/24-01/12 &bull; Upisano u službeni registar distributera osiguranja RH.
              </p>
            </div>
          </div>

          {/* Quick Links / Services */}
          <div className="space-y-3.5 text-xs">
            <h4 className="font-mono font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="rr-pill__dot bg-[#fb6504]" />
              Osigurateljni programi
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <Link to="/services/auto" className="hover:text-[#ff7b1a] transition-colors">
                  Auto odgovornost & Kasko
                </Link>
              </li>
              <li>
                <Link to="/services/property" className="hover:text-[#ff7b1a] transition-colors">
                  Osiguranje doma i potresa
                </Link>
              </li>
              <li>
                <Link to="/services/life" className="hover:text-[#ff7b1a] transition-colors">
                  Životno osiguranje ŽIVOT+
                </Link>
              </li>
              <li>
                <Link to="/services/health" className="hover:text-[#ff7b1a] transition-colors">
                  Dopunsko i dodatno zdravstvo
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="hover:text-white font-mono font-bold text-[#fb6504] transition-colors flex items-center gap-1">
                  <span>&rarr;</span>
                  <span>Interaktivni kalkulator</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Portal & Claims */}
          <div className="space-y-3.5 text-xs">
            <h4 className="font-mono font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="rr-pill__dot bg-teal-400" />
              Klijentski servis
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <Link to="/portal" className="hover:text-white transition-colors font-bold text-teal-400">
                  Moj Život Klijentski portal
                </Link>
              </li>
              <li>
                <Link to="/claims" className="hover:text-rose-300 transition-colors text-rose-400">
                  Prijava odštetnog zahtjeva (FNOL)
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#ff7b1a] transition-colors">
                  O Agenciji Život & Tim
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-[#ff7b1a] transition-colors">
                  Pravne obavijesti & Pritužbe
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#ff7b1a] transition-colors">
                  Izjava o privatnosti (GDPR)
                </Link>
              </li>
            </ul>
          </div>

          {/* Head Office & Contact */}
          <div className="space-y-3.5 text-xs text-slate-400">
            <h4 className="font-mono font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="rr-pill__dot bg-[#fb6504]" />
              Sjedište i kontakt
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#fb6504] mt-0.5 shrink-0" />
                <span>Junija Palmotića 76, 10000 Zagreb, Hrvatska</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#fb6504] shrink-0" />
                <a href="tel:+38514800120" className="hover:text-white transition-colors font-mono">
                  +385 1 4800 120
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#fb6504] shrink-0" />
                <a href="mailto:osiguranje@agencija-zivot.hr" className="hover:text-white transition-colors">
                  osiguranje@agencija-zivot.hr
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-[11px] font-mono text-slate-500">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Pon - Pet: 08:30 - 17:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Regulatory Registry Footnote */}
        <div className="pt-8 border-t border-white/[0.08] text-[11px] text-slate-400 leading-relaxed space-y-4">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-slate-300">
            <strong>Službeni podaci o registraciji:</strong> ŽIVOT društvo s ograničenom odgovornošću za poslove zastupanja u osiguranju | Sjedište: Junija Palmotića 76, 10000 Zagreb | OIB: 14329077049 | MBS: 080514170 (Trgovački sud u Zagrebu) | Temeljni kapital uplaćen u cijelosti | Ugovorni partner: GENERALI OSIGURANJE d.d. Zagreb.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {currentYear} ŽIVOT d.o.o. Sva prava pridržana. Izrađeno u skladu s IDD direktivom Europske unije.</p>
            <div className="flex items-center gap-5">
              <Link to="/legal" className="hover:text-slate-300 transition-colors">
                Opći uvjeti
              </Link>
              <Link to="/privacy" className="hover:text-slate-300 transition-colors">
                Privatnost & GDPR
              </Link>
              <Link to="/legal" className="hover:text-slate-300 transition-colors">
                IDD Direktiva
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
