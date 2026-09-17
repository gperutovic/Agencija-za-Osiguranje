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
  Scale,
  CreditCard,
} from 'lucide-react';
import { AGENCY_DETAILS } from '../../lib/content/insurance-data';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-left relative overflow-hidden">
      {/* Decorative subtle ambient highlight */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF0055]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 space-y-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Entity & Regulatory Credentials */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF0055] to-rose-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight block">
                  AGENCIJA ŽIVOT
                </span>
                <span className="text-[10px] font-mono text-slate-400 tracking-wider">
                  {AGENCY_DETAILS.legalName}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pr-4">
              Vodeća hrvatska digitalna agencija za posredovanje i zastupanje u osiguranju. Ovlašteni
              partner Generali osiguranja d.d. i Toyota Centra Zagreb za Toyota VIP Kasko programe.
              Pružamo besprijekornu uslugu izračuna, online ugovaranja i 24/7 obrade šteta.
            </p>

            {/* Official HANFA Badge Callout */}
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-[11px] font-mono">
                <Award className="w-4 h-4 shrink-0" />
                <span>HANFA REGISTAR DISTRIBUTERA OSIGURANJA: {AGENCY_DETAILS.hanfaRegisterNumber}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                Licenca: <strong>{AGENCY_DETAILS.hanfaLicense}</strong> pod nadzorom Hrvatske agencije
                za nadzor financijskih usluga (HANFA). Poslovanje u cijelosti usklađeno sa Zakonom o osiguranju (NN 30/15, 112/18, 63/20, 133/20, 151/22).
              </p>
            </div>
          </div>

          {/* Col 3: Osigurateljni Programi */}
          <div className="space-y-3.5 text-xs">
            <h4 className="font-mono font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF0055]" />
              Programi osiguranja
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/dopunsko-zdravstveno" className="hover:text-white transition-colors text-rose-300 font-semibold">
                  Dopunsko 2026 (HZZO 15 €)
                </Link>
              </li>
              <li>
                <Link to="/auto-osiguranje" className="hover:text-white transition-colors">
                  Auto odgovornost (AO) &amp; 50% bonusa
                </Link>
              </li>
              <li>
                <Link to="/auto-osiguranje" className="hover:text-white transition-colors text-blue-300 font-semibold">
                  Toyota VIP Kasko Program
                </Link>
              </li>
              <li>
                <Link to="/imovina" className="hover:text-white transition-colors">
                  Osiguranje imovine &amp; Potres
                </Link>
              </li>
              <li>
                <Link to="/kalkulator-prijepisa" className="hover:text-white transition-colors">
                  Prijepis vozila (NN 92/21)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Digitalni Alati & Zaštita Potrošača */}
          <div className="space-y-3.5 text-xs">
            <h4 className="font-mono font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Digitalni servisi &amp; Prava
            </h4>
            <ul className="space-y-2.5">
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
                <Link to="/o-nama" className="hover:text-white transition-colors">
                  O nama i HANFA akreditacija
                </Link>
              </li>
              <li>
                <Link to="/prigovori" className="hover:text-white transition-colors font-semibold text-amber-300">
                  Prigovori potrošača (čl. 401.)
                </Link>
              </li>
              <li>
                <a
                  href="https://www.huo.hr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Centar za mirenje pri HUO <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Kontakt & Sjedište */}
          <div className="space-y-3.5 text-xs">
            <h4 className="font-mono font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Sjedište &amp; Kontakt
            </h4>
            <div className="space-y-2.5 text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{AGENCY_DETAILS.address}, {AGENCY_DETAILS.postalCode} {AGENCY_DETAILS.city}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${AGENCY_DETAILS.phone.replace(/\s+/g, '')}`} className="hover:text-white font-mono font-semibold">
                  {AGENCY_DETAILS.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FF0055] shrink-0" />
                <a href={`tel:${AGENCY_DETAILS.secondaryPhone.replace(/\s+/g, '')}`} className="hover:text-white font-mono font-semibold">
                  {AGENCY_DETAILS.secondaryPhone} (Dežurni 24/7)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <a href={`mailto:${AGENCY_DETAILS.email}`} className="hover:text-white">
                  {AGENCY_DETAILS.email}
                </a>
              </div>
              <div className="pt-2 text-[11px] text-slate-400 font-mono">
                {AGENCY_DETAILS.workingHours}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Rails & Security Trust Strip */}
        <div className="pt-8 border-t border-slate-800 flex flex-wrap items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Podržana plaćanja:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 font-bold text-slate-200 text-[10px] font-mono">
                CORVUSPAY (DO 12 RATA)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 font-bold text-slate-200 text-[10px] font-mono">
                VISA / MASTERCARD
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 font-bold text-emerald-400 text-[10px] font-mono">
                KEKS PAY
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 font-bold text-amber-400 text-[10px] font-mono">
                AIRCASH
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 font-bold text-blue-400 text-[10px] font-mono">
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
            <span className="text-slate-400">HANFA nadzor</span>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center md:text-left text-[11px]">
            &copy; {currentYear} {AGENCY_DETAILS.legalName}. Sva prava pridržana.
            MBS: {AGENCY_DETAILS.mbs} &bull; OIB: {AGENCY_DETAILS.oib} &bull; Trgovački sud u Zagrebu.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
            <Link to="/o-nama" className="hover:text-white transition-colors">
              Pravne obavijesti
            </Link>
            <span>&bull;</span>
            <Link to="/prigovori" className="hover:text-white transition-colors">
              Zaštita potrošača
            </Link>
            <span>&bull;</span>
            <Link to="/o-nama" className="hover:text-white transition-colors">
              IDD direktiva
            </Link>
            <span>&bull;</span>
            <a
              href="https://www.hanfa.hr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors inline-flex items-center gap-1"
            >
              HANFA portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
