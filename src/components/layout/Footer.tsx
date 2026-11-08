import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Lock,
  Scale,
  Star,
  FileCheck2,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { AGENCY_DETAILS } from '../../lib/content/insurance-data';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F172A] text-slate-300 border-t border-slate-800 text-left relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12 space-y-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: Corporate Entity & Članak 417. Notice */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="full" theme="dark" showBadge={true} />

            <p className="text-xs text-slate-300 leading-relaxed pr-4 pt-1">
              <strong>{AGENCY_DETAILS.legalName}</strong> službeni je partner društva{' '}
              <strong className="text-white">Generali osiguranje d.d.</strong> i ovlašteni partner{' '}
              <strong className="text-white">Toyota Centra Zagreb (Toyota Osiguranje)</strong>. Pružamo cjelovito
              savjetovanje, izračun premije, ugovaranje polica i vođenje odštetnih zahtjeva (FNOL).
            </p>

            {/* Commission Transparency Notice (Članak 417. Zakona o osiguranju) */}
            <div className="p-4 bg-[#1E293B] rounded-2xl border border-slate-700/80 text-xs space-y-2">
              <div className="flex items-center gap-2 text-[#F87171] font-bold text-[11px] font-mono uppercase">
                <Scale className="w-4 h-4 shrink-0 text-[#C21817]" />
                <span>TRANSPARENTNOST NAKNADE &bull; ČLANAK 417. ZAKONA O OSIGURANJU</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Društvo djeluje kao zastupnik u osiguranju te za svoj rad prima proviziju od društva za osiguranje koja je već uračunata u premiju police osiguranja. Ugovaratelj osiguranja ne plaća nikakvu dodatnu naknadu niti proviziju zastupniku.
              </p>
            </div>
          </div>

          {/* Col 3: 9 Glavnih Modula Platforme */}
          <div className="space-y-3 text-xs">
            <h4 className="font-mono font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C21817]" />
              Glavni moduli portala
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition-colors font-semibold text-slate-200">
                  1. AGENCIJA ŽIVOT (Početna &amp; Kalkulator)
                </Link>
              </li>
              <li>
                <Link to="/toyota-partnerstvo" className="hover:text-white transition-colors font-semibold text-red-300">
                  2. Toyota partnerstvo (Toyota Centar Zagreb)
                </Link>
              </li>
              <li>
                <Link to="/zatrazi-ponudu" className="hover:text-white transition-colors font-semibold text-white">
                  3. Zatraži ponudu (Višeproizvodni izračun)
                </Link>
              </li>
              <li>
                <Link to="/prijava-stete" className="hover:text-white transition-colors text-slate-300">
                  4. Prijava šteta (Vođeni FNOL centar)
                </Link>
              </li>
              <li>
                <Link to="/ai-centar" className="hover:text-white transition-colors text-slate-300">
                  5. AI Centar (AI Agenti &amp; Štit pokrića)
                </Link>
              </li>
              <li>
                <Link to="/program-vjernosti" className="hover:text-white transition-colors text-slate-300">
                  6. Program vjernosti (Silver / Gold / Platinum)
                </Link>
              </li>
              <li>
                <Link to="/brza-podrska" className="hover:text-white transition-colors text-slate-300">
                  7. Brza podrška (24/7 Pomoć na cesti &amp; Dokumenti)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Portali & Specijalizirani Kalkulatori */}
          <div className="space-y-3 text-xs">
            <h4 className="font-mono font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Portali &amp; Specijalni alati
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/korisnicki-portal" className="hover:text-white transition-colors font-bold text-[#F87171]">
                  8. Korisnički portal (Moje police, štete i ponude)
                </Link>
              </li>
              <li>
                <Link to="/zastupnicki-portal" className="hover:text-white transition-colors font-bold text-emerald-400">
                  9. Zastupnički portal (Agent CRM &amp; Skadencar)
                </Link>
              </li>
              <li>
                <Link to="/auto-osiguranje" className="hover:text-white transition-colors">
                  Auto odgovornost (AO) &amp; Kasko kalkulator
                </Link>
              </li>
              <li>
                <Link to="/dopunsko-zdravstveno" className="hover:text-white transition-colors">
                  Dopunsko 2026 (HZZO 15 € vs Privatno)
                </Link>
              </li>
              <li>
                <Link to="/imovina" className="hover:text-white transition-colors">
                  Osiguranje doma i potresa
                </Link>
              </li>
              <li>
                <Link to="/kalkulator-prijepisa" className="hover:text-white transition-colors">
                  Kalkulator prijepisa vozila (NN 92/21)
                </Link>
              </li>
              <li>
                <Link to="/podsjetnik-isteka" className="hover:text-white transition-colors">
                  Podsjetnik na istek police (-35%)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Sjedište, Kontakt & Licencirani Zastupnici */}
          <div className="space-y-3 text-xs">
            <h4 className="font-mono font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Sjedište &amp; Licencirani tim
            </h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C21817] shrink-0 mt-0.5" />
                <span>Palmotićeva ulica 76, 10000 Zagreb, Hrvatska</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+385914501458" className="hover:text-white font-mono font-bold text-white">
                  +385 91 450 1458
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F87171] shrink-0" />
                <a href="mailto:agencija.zivot@generali.com" className="hover:text-white font-mono">
                  agencija.zivot@generali.com
                </a>
              </div>
              <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px] font-mono text-slate-400">
                <div>Diana: agencija.zivot@generali.com</div>
                <div>Hrvoje (TCZ): osiguranje@tcz.hr</div>
                <div>Laura (TCZ): osiguranje2@tcz.hr</div>
              </div>
            </div>
          </div>
        </div>

        {/* Statutory Disclosures Block (Članak 417. Zakona o osiguranju & HANFA Registar) */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-white font-bold font-mono text-xs">
              <FileCheck2 className="w-4 h-4 text-[#C21817]" />
              <span>ZAKONSKE OBAVIJESTI SUKLADNO ČLANKU 417. ZAKONA O OSIGURANJU (NN 30/15, 112/18, 63/20, 133/20, 151/22)</span>
            </div>
            <a
              href="https://www.hanfa.hr/registri/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1E293B] hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-[11px] font-bold transition-colors"
            >
              <span>Provjera u javnom registru HANFA-e</span>
              <ExternalLink className="w-3 h-3 text-[#F87171]" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-slate-300 leading-relaxed">
            <div>
              <strong className="text-white block mb-1">1. Podaci o zastupniku i registru HANFA-e:</strong>
              Pun naziv tvrtke: <strong>ŽIVOT d.o.o. za zastupanje u osiguranju</strong>. Sjedište: <strong>Palmotićeva ulica 76, 10000 Zagreb</strong>. Upisano u sudski registar Trgovačkog suda u Zagrebu pod <strong>MBS: 01918940</strong>, <strong>OIB: 14329077049</strong>. Društvo je ovlašteno društvo za zastupanje u osiguranju upisano u javni Registar distributera osiguranja koji vodi Hrvatska agencija za nadzor financijskih usluga (HANFA, Franje Račkoga 6, 10000 Zagreb, <a href="https://www.hanfa.hr" target="_blank" rel="noopener noreferrer" className="underline text-slate-200">www.hanfa.hr</a>).
            </div>

            <div>
              <strong className="text-white block mb-1">2. Ovlaštenje, savjetovanje i transparentnost provizije:</strong>
              Društvo obavlja poslove distribucije osiguranja kao zastupnik u osiguranju u ime i za račun <strong>Generali osiguranja d.d.</strong> te u okviru partnerstva s <strong>Toyota Centrom Zagreb (Toyota Osiguranje)</strong>. Prije sklapanja ugovora provodi se obvezni Test zahtjeva i potreba (IDD). Za rad zastupnika obračunava se provizija sadržana u premiji osiguranja koju plaća osiguratelj (bez dodatnog troška za ugovaratelja).
            </div>

            <div>
              <strong className="text-white block mb-1">3. Postupak podnošenja pisanih prigovora (rok 15 dana):</strong>
              Ugovaratelj, osiguranik ili korisnik osiguranja ima pravo podnijeti pisani prigovor na rad zastupnika putem e-pošte na <a href="mailto:agencija.zivot@generali.com" className="text-[#F87171] font-mono font-bold underline">agencija.zivot@generali.com</a>, poštom na adresu <em>Palmotićeva ulica 76, 10000 Zagreb</em> ili putem obrasca <Link to="/prigovori" className="underline text-white font-semibold">Prigovori potrošača</Link>. Društvo je obvezno dostaviti pisani odgovor na prigovor najkasnije u roku od <strong>15 dana</strong> od dana zaprimanja prigovora.
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Security Strip */}
        <div className="pt-4 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-3 font-mono">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              <span>TLS 256-bit &amp; GDPR / AZOP Usklađeno</span>
            </span>
            <span>&bull;</span>
            <span className="inline-flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>4.9/5 Ocjena klijenata</span>
            </span>
            <span>&bull;</span>
            <span>HUB 3A 2D Barkod &amp; SEPA</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-mono">
            <span>&copy; {currentYear} ŽIVOT d.o.o. za zastupanje u osiguranju. Sva prava pridržana.</span>
            <Link to="/o-nama-pravno" className="hover:text-white transition-colors">
              Impresum &amp; IDD
            </Link>
            <Link to="/prigovori" className="hover:text-white transition-colors">
              Prigovori (15 dana)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
