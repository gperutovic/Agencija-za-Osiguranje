import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Award,
  Lock,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#06080c] text-slate-400 border-t border-white/[0.08] text-left relative overflow-hidden">
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#fb6504]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 space-y-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Entity & Regulatory Credentials */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fb6504] to-[#d95302] flex items-center justify-center text-white font-black text-xl shadow-md border border-white/10">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight block">
                  AGENCIJA ŽIVOT
                </span>
                <span className="text-[10px] font-mono text-slate-400 tracking-wider">
                  ŽIVOT d.o.o. za poslove zastupanja u osiguranju
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pr-4">
              Vodeća digitalna agencija za posredovanje i zastupanje u osiguranju. Ekskluzivni partner
              Generali osiguranja d.d. i Toyota Centra Zagreb za Toyota VIP Kasko programe.
              Pružamo besprijekornu uslugu izračuna, online ugovaranja i 24/7 obrade šteta.
            </p>

            {/* Official HANFA Badge Callout */}
            <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/[0.07] text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-[11px] font-mono">
                <Award className="w-4 h-4 shrink-0" />
                <span>HANFA REGISTAR DISTRIBUTERA OSIGURANJA: ZO-88912</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                Licenca: <strong>Klasa: UP/I-983-02/24-01/12</strong> pod nadzorom Hrvatske agencije
                za nadzor financijskih usluga (HANFA). Poslovanje u cijelosti usklađeno sa Zakonom o osiguranju (NN 30/15, 112/18, 63/20, 133/20).
              </p>
            </div>
          </div>

          {/* Col 3: Osigurateljni Programi */}
          <div className="space-y-3.5 text-xs">
            <h4 className="font-mono font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fb6504]" />
              Programi osiguranja
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Auto odgovornost (AO) & Kasko
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#fb6504] transition-colors text-slate-300 font-semibold">
                  Toyota VIP Kasko Program
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  ŽIVOT Dom & Potres
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  ŽIVOT+ Životno osiguranje
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Dopunsko i dodatno zdravstvo
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Putno zdravstveno osiguranje
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Digitalni Alati & Portal */}
          <div className="space-y-3.5 text-xs">
            <h4 className="font-mono font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Digitalni servisi
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/kalkulator-prijepisa" className="hover:text-white transition-colors font-medium text-amber-400">
                  Kalkulator prijepisa vozila (NN 92/21)
                </Link>
              </li>
              <li>
                <Link to="/prijava-stete" className="hover:text-white transition-colors font-medium text-rose-400">
                  Prijava štete (FNOL 24/7)
                </Link>
              </li>
              <li>
                <Link to="/portal" className="hover:text-white transition-colors">
                  Klijentski portal "Moj Život"
                </Link>
              </li>
              <li>
                <Link to="/portal" className="hover:text-white transition-colors">
                  Preuzimanje Zelene karte (PDF)
                </Link>
              </li>
              <li>
                <Link to="/o-nama-pravno" className="hover:text-white transition-colors">
                  Predugovorna IDD obavijest
                </Link>
              </li>
              <li>
                <Link to="/o-nama-pravno" className="hover:text-white transition-colors">
                  Prigovori & Mirenje pri HUO
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Kontakt & Sjedište */}
          <div className="space-y-3.5 text-xs">
            <h4 className="font-mono font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Sjedište & Kontakt
            </h4>
            <div className="space-y-2.5 text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Junija Palmotića 76, 10000 Zagreb, Hrvatska</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:014800120" className="hover:text-white font-mono font-semibold">
                  01 4800 120
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#fb6504] shrink-0" />
                <a href="tel:015550666" className="hover:text-white font-mono font-semibold">
                  01 555 0666 (Dežurni 24/7)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <a href="mailto:osiguranje@agencija-zivot.hr" className="hover:text-white">
                  osiguranje@agencija-zivot.hr
                </a>
              </div>
              <div className="pt-2 text-[11px] text-slate-400 font-mono">
                Radno vrijeme: Pon – Pet: 08:00 – 18:00
              </div>
            </div>
          </div>
        </div>

        {/* Payment Rails & Security Trust Strip */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Sigurni kanali naplate:
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/10 font-bold text-slate-200 text-[10px] font-mono">
                VISA
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/10 font-bold text-slate-200 text-[10px] font-mono">
                MASTERCARD
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/10 font-bold text-emerald-400 text-[10px] font-mono">
                KEKS PAY
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/10 font-bold text-amber-400 text-[10px] font-mono">
                AIRCASH
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/10 font-bold text-blue-400 text-[10px] font-mono">
                HUB 3A (2D BARKOD)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              256-bitna TLS enkripcija
            </span>
            <span>&bull;</span>
            <span className="text-slate-400">ISO 27001 standard</span>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center md:text-left text-[11px]">
            &copy; {currentYear} ŽIVOT d.o.o. za poslove zastupanja u osiguranju. Sva prava pridržana.
            MBS: 080514170 &bull; OIB: 14329077049 &bull; Registarski sud: Trgovački sud u Zagrebu.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
            <Link to="/o-nama-pravno" className="hover:text-white transition-colors">
              Pravne obavijesti
            </Link>
            <span>&bull;</span>
            <Link to="/o-nama-pravno" className="hover:text-white transition-colors">
              Zaštita osobnih podataka (GDPR)
            </Link>
            <span>&bull;</span>
            <Link to="/o-nama-pravno" className="hover:text-white transition-colors">
              IDD direktiva
            </Link>
            <span>&bull;</span>
            <a
              href="https://www.huo.hr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors inline-flex items-center gap-1"
            >
              Centar za mirenje HUO <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
