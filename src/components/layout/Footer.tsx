import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Lock,
  Scale,
  CheckCircle2,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { AGENCY_DETAILS } from '../../lib/content/insurance-data';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B1528] text-slate-300 border-t border-slate-800 text-left relative overflow-hidden">
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 space-y-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Entity & Value Proposition */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="full" theme="dark" showBadge={false} />

            <p className="text-xs text-slate-300 leading-relaxed pr-4 pt-1">
              Ovlašteni distributer osiguranja i pouzdani savjetnik za privatne i poslovne osiguranike. Pružamo stručno savjetovanje, neovisnu usporedbu polica vodećih osiguravajućih društava i podršku pri obradi šteta bez dodatnih naknada za ugovaratelja.
            </p>

            {/* Advisory Trust & Consumer Value Note */}
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-[11px] font-mono">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>SAVJETOVANJE I ZASTUPANJE BEZ PROVIZIJE</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Sukladno čl. 401. Zakona o osiguranju, ugovaranje polica putem agencije ne stvara nikakav dodatni trošak za osiguranika. Police imaju jednake ili povoljnije uvjete u odnosu na izravne ponude osiguratelja.
              </p>
            </div>
          </div>

          {/* Col 3: Osigurateljni Programi */}
          <div className="space-y-3.5 text-xs">
            <h4 className="font-mono font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
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
                  Toyota Centar Zagreb VIP Kasko
                </Link>
              </li>
              <li>
                <Link to="/imovina" className="hover:text-white transition-colors">
                  Osiguranje doma &amp; Zaštita od potresa
                </Link>
              </li>
              <li>
                <Link to="/kalkulator-prijepisa" className="hover:text-white transition-colors">
                  Kalkulator prijepisa vozila (NN 92/21)
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Svi programi i poslovna osiguranja
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
                  Klijentski portal "Moj Portal"
                </Link>
              </li>
              <li>
                <Link to="/o-nama" className="hover:text-white transition-colors">
                  O nama &amp; Profil agencije
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
                <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                <a href={`tel:${AGENCY_DETAILS.secondaryPhone.replace(/\s+/g, '')}`} className="hover:text-white font-mono font-semibold">
                  {AGENCY_DETAILS.secondaryPhone} (Dežurni za štete)
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
              Sigurni kanali naplate:
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
            <span className="text-slate-400">Ovlašteni ugovorni zastupnik</span>
          </div>
        </div>

        {/* Statutory Legal Sub-bar (Exclusively Isolated Regulatory Mentions) */}
        <div className="border-t border-slate-800 pt-6 mt-8 text-[11px] text-slate-400 font-sans leading-relaxed">
          <p>
            Agencija za zastupanje u osiguranju d.o.o. je ovlašteni distributer osiguranja upisan u Registar distributera osiguranja koji vodi Hrvatska agencija za nadzor financijskih usluga (HANFA) pod brojem {AGENCY_DETAILS.hanfaRegisterNumber}, temeljem rješenja {AGENCY_DETAILS.hanfaLicense}. 
            Strateški partner: Generali osiguranje d.d. Sjedište: {AGENCY_DETAILS.address}, {AGENCY_DETAILS.postalCode} {AGENCY_DETAILS.city}. MBS: {AGENCY_DETAILS.mbs}, OIB: {AGENCY_DETAILS.oib}.
          </p>
          <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-center md:text-left">
              &copy; {currentYear} {AGENCY_DETAILS.legalName}. Sva prava pridržana. Informacije na ovoj stranici imaju informativni karakter i ne predstavljaju obvezujuću ponudu do trenutka izdavanja police.
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
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
