import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Award, MapPin, Phone, Mail, Clock, FileText, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-md">
                Ž
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                AGENCIJA ŽIVOT d.o.o.
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pr-4">
              Vodeća digitalna agencija za poslove zastupanja u osiguranju Generali osiguranja d.d. na području Republike Hrvatske. Spajamo suvremenu tehnologiju i individualno savjetovanje za potpunu financijsku i imovinsku sigurnost.
            </p>

            <div className="p-4 bg-navy-900/90 rounded-2xl border border-navy-800 text-xs space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-[11px]">
                <Award className="w-4 h-4 shrink-0" />
                <span>Nadzor Hrvatske agencije za nadzor financijskih usluga (HANFA)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Klasa rješenja: UP/I-983-02/24-01/12 &bull; Upisano u službeni registar distributera osiguranja RH.
              </p>
            </div>
          </div>

          {/* Quick Links / Services */}
          <div className="space-y-3.5 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Osigurateljni programi
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <Link to="/services/auto" className="hover:text-teal-300 transition-colors">
                  Auto odgovornost & Kasko
                </Link>
              </li>
              <li>
                <Link to="/services/property" className="hover:text-teal-300 transition-colors">
                  Osiguranje doma i potresa
                </Link>
              </li>
              <li>
                <Link to="/services/life" className="hover:text-teal-300 transition-colors">
                  Životno osiguranje ŽIVOT+
                </Link>
              </li>
              <li>
                <Link to="/services/health" className="hover:text-teal-300 transition-colors">
                  Dopunsko i dodatno zdravstvo
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="hover:text-white font-bold text-teal-400 transition-colors">
                  &rarr; Interaktivni kalkulator premije
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Portal & Claims */}
          <div className="space-y-3.5 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Klijentski servis
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <Link to="/portal" className="hover:text-teal-300 transition-colors font-bold text-teal-400">
                  Moj Život Klijentski portal
                </Link>
              </li>
              <li>
                <Link to="/claims" className="hover:text-rose-400 transition-colors">
                  Prijava odštetnog zahtjeva (FNOL)
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-300 transition-colors">
                  O Agenciji Život & Tim
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-teal-300 transition-colors">
                  Pravne obavijesti & Pritužbe
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-teal-300 transition-colors">
                  Izjava o privatnosti (GDPR)
                </Link>
              </li>
            </ul>
          </div>

          {/* Head Office & Contact */}
          <div className="space-y-3.5 text-xs text-slate-400">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Sjedište i savjetovalište
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <span>Junija Palmotića 76, 10000 Zagreb, Hrvatska</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <a href="tel:+38514800120" className="hover:text-white transition-colors">
                  +385 1 4800 120
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href="mailto:osiguranje@agencija-zivot.hr" className="hover:text-white transition-colors">
                  osiguranje@agencija-zivot.hr
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-[11px]">
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Pon - Pet: 08:30 - 17:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Regulatory Registry Footnote */}
        <div className="pt-8 border-t border-navy-800/80 text-[11px] text-slate-400 leading-relaxed space-y-4">
          <div className="p-4 rounded-2xl bg-navy-900/60 border border-navy-800/80 text-slate-300">
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
