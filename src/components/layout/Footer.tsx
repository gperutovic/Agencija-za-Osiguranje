import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, ExternalLink, Scale } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { AGENCY_DETAILS } from '../../lib/content/insurance-data';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B1522] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          {/* Column 1: Agency Identity */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-block">
              <BrandLogo variant="dark" size="md" showSubtitle />
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Ovlašteni zastupnik u osiguranju pod nadzorom Hrvatske agencije za nadzor financijskih usluga
              (HANFA). Strateški partner Generali osiguranja d.d. i Toyota Centra Zagreb.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-1">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>
                  {AGENCY_DETAILS.address}, {AGENCY_DETAILS.postalCode} {AGENCY_DETAILS.city}
                </span>
              </div>
              <div className="flex items-center gap-2.5 tabular-nums">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <a href="tel:+38514800120" className="hover:text-white transition-colors font-medium text-slate-300">
                  {AGENCY_DETAILS.phone}
                </a>
                <span className="text-slate-600">•</span>
                <span>{AGENCY_DETAILS.workingHours}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <a href={`mailto:${AGENCY_DETAILS.email}`} className="hover:text-white transition-colors">
                  {AGENCY_DETAILS.email}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Programi osiguranja */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Programi osiguranja
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/auto-osiguranje" className="hover:text-white transition-colors">
                  Auto i kasko osiguranje
                </Link>
              </li>
              <li>
                <Link to="/dopunsko-zdravstveno" className="hover:text-white transition-colors">
                  Dopunsko i dodatno zdravstveno
                </Link>
              </li>
              <li>
                <Link to="/imovina" className="hover:text-white transition-colors">
                  Osiguranje doma i od potresa
                </Link>
              </li>
              <li>
                <Link to="/kalkulator-prijepisa" className="hover:text-white transition-colors">
                  Kalkulator prijepisa vozila
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Svi proizvodi za građane i tvrtke
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Podrška & Portal */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Klijentski servis
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/prijava-stete" className="hover:text-white transition-colors">
                  Prijava štete (FNOL)
                </Link>
              </li>
              <li>
                <Link to="/portal" className="hover:text-white transition-colors">
                  Portal za osiguranike
                </Link>
              </li>
              <li>
                <Link to="/o-nama" className="hover:text-white transition-colors">
                  O agenciji i partneri
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Kontakt i savjetovanje
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Regulatorni okvir */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Regulatorna sukladnost
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/o-nama-pravno" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-slate-500" />
                  <span>Pravne obavijesti i IDD informacije</span>
                </Link>
              </li>
              <li>
                <Link to="/prigovori" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span>Podnošenje prigovora (čl. 401. ZO)</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://www.hanfa.hr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Registar HANFA ({AGENCY_DETAILS.hanfaRegisterNumber})</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.huo.hr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Hrvatski ured za osiguranje (HUO)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-2">
                Mogućnosti plaćanja
              </p>
              <div className="flex flex-wrap gap-1.5 text-[11px] font-medium text-slate-300">
                <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80">
                  HUB 3A / SEPA
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80">
                  Kartice do 12 rata
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80">
                  KEKS Pay
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Disclosure Strip (strictly confined to Footer) */}
        <div className="pt-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs text-slate-400">
          <div className="space-y-1">
            <p className="font-medium text-slate-300">
              {AGENCY_DETAILS.legalName} • Sjedište: {AGENCY_DETAILS.address}, {AGENCY_DETAILS.postalCode} {AGENCY_DETAILS.city}
            </p>
            <p className="tabular-nums text-slate-500">
              OIB: {AGENCY_DETAILS.oib} • MBS: {AGENCY_DETAILS.mbs} • Dozvola HANFA: {AGENCY_DETAILS.hanfaLicense} ({AGENCY_DETAILS.hanfaRegisterNumber})
            </p>
          </div>
          <p className="text-slate-500 shrink-0">
            © {new Date().getFullYear()} {AGENCY_DETAILS.brandName}. Sva prava pridržana.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
