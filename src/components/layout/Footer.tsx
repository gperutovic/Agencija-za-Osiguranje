import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Scale,
  Building2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Award,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-left relative overflow-hidden">
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 space-y-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Entity & Regulatory Credentials */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-xl shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                AGENCIJA ZA OSIGURANJE d.o.o.
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pr-4">
              Vodeća digitalna agencija za posredovanje i zastupanje u osiguranju u Republici Hrvatskoj.
              Uspoređujemo ponude vodećih osiguratelja, pružamo nepristrano stručno vodstvo i omogućujemo
              brzo online ugovaranje polica bez skrivenih troškova.
            </p>

            {/* Official HANFA Badge Callout */}
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-[11px] font-mono">
                <Award className="w-4 h-4 shrink-0" />
                <span>Nadzor Hrvatske agencije za nadzor financijskih usluga (HANFA)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                Društvo je upisano u Registar distributera osiguranja pod brojem <strong>ZO-88912</strong>.
                Usluge distribucije osiguranja pružaju se u cijelosti u skladu sa Zakonom o osiguranju (NN 30/15, 112/18, 63/20, 133/20).
              </p>
            </div>
          </div>

          {/* Col 3: Osigurateljni Programi */}
          <div className="space-y-3.5 text-xs">
            <h4 className="font-mono font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Programi osiguranja
            </h4>
            <ul className="space-y-2.5 text-slate-300">
              <li>
                <Link to="/?category=auto" className="hover:text-emerald-400 transition-colors">
                  Auto odgovornost & Puni Kasko
                </Link>
              </li>
              <li>
                <Link to="/?category=property" className="hover:text-emerald-400 transition-colors">
                  Osiguranje doma & Potresa
                </Link>
              </li>
              <li>
                <Link to="/?category=health" className="hover:text-emerald-400 transition-colors">
                  Dopunsko i dodatno zdravstvo
                </Link>
              </li>
              <li>
                <Link to="/?category=travel" className="hover:text-emerald-400 transition-colors">
                  Putno zdravstveno osiguranje
                </Link>
              </li>
              <li>
                <Link to="/kalkulator-prijepisa" className="text-emerald-400 font-semibold hover:underline flex items-center gap-1">
                  <span>Kalkulator prijepisa vozila</span>
                  <span>&rarr;</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Korisnički Servis & Štete */}
          <div className="space-y-3.5 text-xs">
            <h4 className="font-mono font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Korisnički servis
            </h4>
            <ul className="space-y-2.5 text-slate-300">
              <li>
                <Link to="/prijava-stete" className="text-rose-400 font-bold hover:underline flex items-center gap-1">
                  <span>Prijava štete (FNOL 24/7)</span>
                </Link>
              </li>
              <li>
                <Link to="/o-nama-pravno" className="hover:text-emerald-400 transition-colors">
                  O nama & Licencirani agenti
                </Link>
              </li>
              <li>
                <Link to="/o-nama-pravno#prigovori" className="hover:text-emerald-400 transition-colors">
                  Prigovori potrošača
                </Link>
              </li>
              <li>
                <Link to="/o-nama-pravno#privatnost" className="hover:text-emerald-400 transition-colors">
                  Zaštita osobnih podataka (GDPR)
                </Link>
              </li>
              <li>
                <Link to="/o-nama-pravno#uvjeti" className="hover:text-emerald-400 transition-colors">
                  Opći uvjeti poslovanja
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Kontakt & Sjedište */}
          <div className="space-y-3.5 text-xs">
            <h4 className="font-mono font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Sjedište i kontakt
            </h4>
            <div className="space-y-2.5 text-slate-300 font-mono text-[11px]">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>Junija Palmotića 76, 10000 Zagreb</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="tel:015550666" className="text-white hover:text-emerald-400 font-bold">
                  01 555 0666
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <a href="mailto:info@agencija-osiguranje.hr" className="hover:underline">
                  info@agencija-osiguranje.hr
                </a>
              </p>
              <div className="pt-2 text-[10px] text-slate-400 space-y-0.5 border-t border-slate-800">
                <p>OIB: 14329077049 &bull; MBS: 080514170</p>
                <p>Nadležni sud: Trgovački sud u Zagrebu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Accepted Payment Rails Display */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sigurno 256-bitno SSL plaćanje &bull; Podržani načini plaćanja u RH:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-bold text-white font-mono">
              VISA
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-bold text-white font-mono">
              Mastercard
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-[11px] font-bold text-emerald-300 font-mono">
              KEKS Pay
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-800/60 text-[11px] font-bold text-rose-300 font-mono">
              Aircash
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-800/60 text-[11px] font-bold text-blue-300 font-mono">
              2D Barkod HUB 3A
            </span>
          </div>
        </div>

        {/* Statutory Disclosures & HUO Mediation */}
        <div className="pt-6 border-t border-slate-800/80 space-y-3 text-[11px] text-slate-400 leading-relaxed font-mono">
          <p>
            <strong>IDD Obavijest o distribuciji:</strong> Distribuciju osiguranja obavljamo na temelju objektivne i nepristrane analize tržišta u skladu sa Zakonom o osiguranju (ZOS). Naše usluge savjetovanja i posredovanja potpuno su besplatne za ugovaratelje osiguranja.
          </p>
          <p>
            <strong>Izvansudsko rješavanje sporova:</strong> Sukladno Zakonu o zaštiti potrošača, potrošač ima pravo podnijeti prigovor Centru za mirenje pri Hrvatskom uredu za osiguranje (HUO), Martićeva 71, 10000 Zagreb, web:{' '}
            <a
              href="https://www.huo.hr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline inline-flex items-center gap-0.5"
            >
              www.huo.hr <ExternalLink className="w-2.5 h-2.5 inline" />
            </a>.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>&copy; {currentYear} Agencija za osiguranje d.o.o. Sva prava pridržana.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/o-nama-pravno#privatnost" className="hover:text-white transition-colors">
              Zaštita privatnosti (AZOP)
            </Link>
            <span className="text-slate-700">&bull;</span>
            <Link to="/o-nama-pravno#uvjeti" className="hover:text-white transition-colors">
              Uvjeti korištenja
            </Link>
            <span className="text-slate-700">&bull;</span>
            <Link to="/o-nama-pravno" className="hover:text-white transition-colors">
              Impressum
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
