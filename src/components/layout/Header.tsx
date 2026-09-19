import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Car,
  Home,
  HeartPulse,
  Building2,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Shield,
  Phone,
  Mail,
  Users,
  FileText,
  Sparkles,
  X,
  Menu,
  Calculator,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { AGENCY_DETAILS } from '../../lib/content/insurance-data';
import { InsuranceCategory } from '../../lib/types';

interface HeaderProps {
  onOpenQuote?: (category?: InsuranceCategory) => void;
  onOpenSavjetnik?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuote, onOpenSavjetnik }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<'osiguranja' | 'o-nama' | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<'osiguranja' | 'o-nama' | null>('osiguranja');

  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on route changes
  useEffect(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle outside clicks to close desktop dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleDropdown = (name: 'osiguranja' | 'o-nama') => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const toggleMobileAccordion = (name: 'osiguranja' | 'o-nama') => {
    setMobileAccordion((prev) => (prev === name ? null : name));
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/90 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20" ref={dropdownRef}>
          {/* 1. Brand Logo */}
          <Link
            to="/"
            className="group focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-xl"
            aria-label="Naslovna stranica - Agencija za osiguranje"
          >
            <BrandLogo variant="full" theme="light" showBadge={false} />
          </Link>

          {/* 2. Desktop Navigation Menu */}
          <nav
            className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200"
            aria-label="Glavna navigacija"
          >
            {/* DROPDOWN 1: Osiguranja */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('osiguranja')}
                onMouseEnter={() => setOpenDropdown('osiguranja')}
                aria-expanded={openDropdown === 'osiguranja'}
                aria-haspopup="true"
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  openDropdown === 'osiguranja' ||
                  ['/auto-osiguranje', '/dopunsko-zdravstveno', '/imovina', '/services'].includes(location.pathname)
                    ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-bold'
                    : 'hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                }`}
              >
                <span>Osiguranja</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openDropdown === 'osiguranja' ? 'rotate-180 text-teal-600' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* Mega Dropdown Menu Panel */}
              {openDropdown === 'osiguranja' && (
                <div
                  onMouseLeave={() => setOpenDropdown(null)}
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-[780px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 p-6 grid grid-cols-2 gap-6 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  {/* Category: Vozila */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-teal-800 dark:text-teal-300 font-bold text-xs uppercase tracking-wider font-mono">
                      <Car className="w-4 h-4 text-teal-600" />
                      <span>Vozila</span>
                    </div>
                    <ul className="space-y-1">
                      <li>
                        <Link
                          to="/auto-osiguranje"
                          className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 block group transition-colors"
                        >
                          <div className="font-semibold text-slate-900 dark:text-white text-xs group-hover:text-teal-600 flex items-center justify-between">
                            <span>Obvezno auto osiguranje (AO)</span>
                            <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">50% bonusa</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Trenutni prijenos bonusa, asistencija i brza registracija
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/auto-osiguranje"
                          className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 block group transition-colors"
                        >
                          <div className="font-semibold text-slate-900 dark:text-white text-xs group-hover:text-teal-600">
                            Kasko osiguranje
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Puna zaštita od šteta, sudara, krađe i elementarnih nepogoda
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/kalkulator-prijepisa"
                          className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 block group transition-colors"
                        >
                          <div className="font-semibold text-slate-900 dark:text-white text-xs group-hover:text-teal-600 flex items-center gap-1.5">
                            <Calculator className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600" />
                            <span>Kalkulator prijepisa vozila</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Točan izračun upravne pristojbe prema zakonu (NN 92/21)
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Category: Imovina */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
                      <Home className="w-4 h-4 text-amber-500" />
                      <span>Imovina</span>
                    </div>
                    <ul className="space-y-1">
                      <li>
                        <Link
                          to="/imovina"
                          className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 block group transition-colors"
                        >
                          <div className="font-semibold text-slate-900 dark:text-white text-xs group-hover:text-teal-600">
                            Osiguranje stana i kuće
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Požar, oluja, izljev vode iz instalacija i provalna krađa
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/imovina"
                          className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 block group transition-colors"
                        >
                          <div className="font-semibold text-slate-900 dark:text-white text-xs group-hover:text-teal-600">
                            Osiguranje od potresa
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Nova građevinska vrijednost bez podosiguranja i skrivenih odbitaka
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Category: Život i Zdravlje */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider font-mono">
                      <HeartPulse className="w-4 h-4 text-rose-500" />
                      <span>Život i Zdravlje</span>
                    </div>
                    <ul className="space-y-1">
                      <li>
                        <Link
                          to="/dopunsko-zdravstveno"
                          className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 block group transition-colors"
                        >
                          <div className="font-semibold text-slate-900 dark:text-white text-xs group-hover:text-teal-600 flex items-center justify-between">
                            <span>Dopunsko zdravstveno (2026)</span>
                            <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">od 9,50 €</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Zaštita od poskupljenja HZZO-a uz pokriće B-liste lijekova
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/services"
                          className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 block group transition-colors"
                        >
                          <div className="font-semibold text-slate-900 dark:text-white text-xs group-hover:text-teal-600">
                            Dodatno zdravstveno &amp; Životno
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Sistematski pregledi u privatnim poliklinikama bez čekanja
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Category: Poslovanje */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-blue-700 dark:text-blue-400 font-bold text-xs uppercase tracking-wider font-mono">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      <span>Poslovanje</span>
                    </div>
                    <ul className="space-y-1">
                      <li>
                        <Link
                          to="/services"
                          className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 block group transition-colors"
                        >
                          <div className="font-semibold text-slate-900 dark:text-white text-xs group-hover:text-teal-600">
                            Odgovornost iz djelatnosti
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Opća i profesionalna odgovornost za tvrtke i obrtnike
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/services"
                          className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 block group transition-colors"
                        >
                          <div className="font-semibold text-slate-900 dark:text-white text-xs group-hover:text-teal-600">
                            Imovina poduzeća &amp; Djelatnici
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Zaštita zaliha, opreme i kolektivno osiguranje zaposlenika
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Bottom Strip in Mega Menu */}
                  <div className="col-span-2 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Trebate pomoć oko izbora optimalnog pokrića?</span>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenDropdown(null);
                        if (onOpenSavjetnik) onOpenSavjetnik();
                      }}
                      className="text-teal-600 hover:text-teal-700 dark:text-teal-400 font-bold flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Pokrenite digitalnog savjetnika</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* DROPDOWN 2: O nama & Partneri */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('o-nama')}
                onMouseEnter={() => setOpenDropdown('o-nama')}
                aria-expanded={openDropdown === 'o-nama'}
                aria-haspopup="true"
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  openDropdown === 'o-nama' || isActive('/o-nama') || isActive('/prigovori')
                    ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-bold'
                    : 'hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                }`}
              >
                <span>O nama &amp; Partneri</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openDropdown === 'o-nama' ? 'rotate-180 text-teal-600' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* O nama Dropdown Panel */}
              {openDropdown === 'o-nama' && (
                <div
                  onMouseLeave={() => setOpenDropdown(null)}
                  className="absolute left-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 p-3 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <Link
                    to="/o-nama"
                    className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 flex items-start gap-3 group transition-colors"
                  >
                    <Users className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white text-xs group-hover:text-teal-600">
                        Tko smo mi
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        O agenciji, naš tim ovlaštenih savjetnika i misija neovisnog zastupanja
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/o-nama"
                    className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 flex items-start gap-3 group transition-colors"
                  >
                    <Building2 className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white text-xs group-hover:text-teal-600">
                        Naša uloga i strateško partnerstvo
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Strateški partner Generali osiguranja d.d. i neovisno posredovanje
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/prigovori"
                    className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 flex items-start gap-3 group transition-colors border-t border-slate-100 dark:border-slate-800"
                  >
                    <FileText className="w-5 h-5 text-slate-400 mt-0.5 shrink-0 group-hover:text-teal-600" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white text-xs group-hover:text-teal-600">
                        Pravne obavijesti &amp; Zaštita potrošača
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Postupak rješavanja prigovora i transparentno poslovanje
                      </p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* DIRECT LINK 1: Prijava štete (High Visibility) */}
            <Link
              to="/prijava-stete"
              className="px-3.5 py-2 rounded-xl text-rose-600 dark:text-rose-400 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all flex items-center gap-1.5 font-bold text-xs sm:text-sm shadow-xs"
              title="24/7 Digitalna prijava i praćenje šteta"
            >
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Prijava štete</span>
            </Link>

            {/* DIRECT LINK 2: Moj Portal */}
            <Link
              to="/portal"
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                isActive('/portal')
                  ? 'bg-teal-600 text-white shadow-md font-bold'
                  : 'hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
              }`}
            >
              <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Moj Portal</span>
            </Link>
          </nav>

          {/* 3. Right Action Center */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Digital Advisor Launcher */}
            <button
              type="button"
              onClick={() => onOpenSavjetnik && onOpenSavjetnik()}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
              title="Pokrenite digitalnog savjetnika za optimalan izračun"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Digitalni savjetnik</span>
            </button>

            {/* Primary CTA: "Zatražite ponudu" */}
            <button
              type="button"
              onClick={() => onOpenQuote && onOpenQuote('auto')}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Zatražite ponudu</span>
              <ChevronRight className="w-4 h-4 text-teal-100" />
            </button>
          </div>

          {/* 4. Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-950 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Otvori navigacijski izbornik"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Accessible Mobile Off-Canvas Slide-Out Sheet Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end" role="dialog" aria-modal="true">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Sheet Panel */}
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 overflow-y-auto border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
            {/* Sheet Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <BrandLogo variant="compact" theme="light" showBadge={false} />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Zatvori izbornik"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Sheet Navigation Body */}
            <div className="p-4 space-y-4 flex-1">
              {/* Accordion 1: Osiguranja */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleMobileAccordion('osiguranja')}
                  className="w-full p-3.5 text-left font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 min-h-[44px]"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>Osiguranja</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileAccordion === 'osiguranja' ? 'rotate-180 text-teal-600' : 'text-slate-400'
                    }`}
                  />
                </button>

                {mobileAccordion === 'osiguranja' && (
                  <div className="p-2 space-y-1 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    <Link
                      to="/auto-osiguranje"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-3 min-h-[44px]"
                    >
                      <Car className="w-4 h-4 text-teal-600 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">Auto &amp; Kasko osiguranje</div>
                        <div className="text-[11px] text-slate-500">50% bonusa i Toyota VIP program</div>
                      </div>
                    </Link>

                    <Link
                      to="/dopunsko-zdravstveno"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-3 min-h-[44px]"
                    >
                      <HeartPulse className="w-4 h-4 text-rose-500 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">Dopunsko zdravstveno (2026)</div>
                        <div className="text-[11px] text-slate-500">HZZO 15 € vs Privatno od 9,50 €</div>
                      </div>
                    </Link>

                    <Link
                      to="/imovina"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-3 min-h-[44px]"
                    >
                      <Home className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">Osiguranje stana i kuće</div>
                        <div className="text-[11px] text-slate-500">Zaštita od požara, oluje i potresa</div>
                      </div>
                    </Link>

                    <Link
                      to="/kalkulator-prijepisa"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-3 min-h-[44px]"
                    >
                      <Calculator className="w-4 h-4 text-slate-400 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">Kalkulator prijepisa vozila</div>
                        <div className="text-[11px] text-slate-500">Službeni izračun upravne pristojbe</div>
                      </div>
                    </Link>

                    <Link
                      to="/services"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-3 min-h-[44px]"
                    >
                      <Briefcase className="w-4 h-4 text-blue-500 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">Svi programi osiguranja</div>
                        <div className="text-[11px] text-slate-500">Poslovna i privatna pokrića</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Accordion 2: O nama & Partneri */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleMobileAccordion('o-nama')}
                  className="w-full p-3.5 text-left font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 min-h-[44px]"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-teal-600" />
                    <span>O nama &amp; Partneri</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileAccordion === 'o-nama' ? 'rotate-180 text-teal-600' : 'text-slate-400'
                    }`}
                  />
                </button>

                {mobileAccordion === 'o-nama' && (
                  <div className="p-2 space-y-1 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    <Link
                      to="/o-nama"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 block min-h-[44px]"
                    >
                      <div className="font-bold text-slate-900 dark:text-white">Tko smo mi</div>
                      <div className="text-[11px] text-slate-500">O agenciji i licenciranom timu</div>
                    </Link>

                    <Link
                      to="/o-nama"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 block min-h-[44px]"
                    >
                      <div className="font-bold text-slate-900 dark:text-white">Strateško partnerstvo</div>
                      <div className="text-[11px] text-slate-500">Partnerstvo s Generali osiguranjem d.d.</div>
                    </Link>

                    <Link
                      to="/prigovori"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 block min-h-[44px]"
                    >
                      <div className="font-bold text-slate-900 dark:text-white">Pravne obavijesti &amp; Prigovori</div>
                      <div className="text-[11px] text-slate-500">Zaštita prava potrošača</div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Direct Links in Drawer */}
              <div className="space-y-1.5 pt-2">
                {/* Prijava štete */}
                <Link
                  to="/prijava-stete"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 font-bold text-sm min-h-[44px]"
                >
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>Prijava štete (24/7 FNOL)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-rose-400" />
                </Link>

                {/* Moj Portal */}
                <Link
                  to="/portal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 text-teal-800 dark:text-teal-200 font-bold text-sm min-h-[44px]"
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-5 h-5 text-teal-600 shrink-0" />
                    <span>Moj Portal &bull; Digitalne police</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-teal-400" />
                </Link>

                {/* Kontakt */}
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm min-h-[44px]"
                >
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                    <span>Kontakt i lokacija ureda</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Direct Phone Support */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-teal-600" />
                  <span>Savjetovanje:</span>
                </div>
                <a
                  href={`tel:${AGENCY_DETAILS.phone.replace(/\s+/g, '')}`}
                  className="font-bold text-teal-700 dark:text-teal-400 font-mono text-xs hover:underline"
                >
                  {AGENCY_DETAILS.phone}
                </a>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2 bg-slate-50 dark:bg-slate-900/80">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenQuote) onOpenQuote('auto');
                }}
                className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all min-h-[44px]"
              >
                <span>Zatražite ponudu</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenSavjetnik) onOpenSavjetnik();
                }}
                className="w-full py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all min-h-[44px]"
              >
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Digitalni savjetnik</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
