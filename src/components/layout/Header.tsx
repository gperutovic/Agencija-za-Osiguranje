import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Phone,
  Menu,
  X,
  Calculator,
  AlertTriangle,
  FileCheck2,
  Car,
  Home,
  HeartPulse,
  Sparkles,
  Info,
  Scale,
  ShieldCheck,
  Shield,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { AGENCY_DETAILS } from '../../lib/content/insurance-data';

interface HeaderProps {
  onOpenQuote?: (category?: 'auto' | 'property' | 'health' | 'travel' | 'business') => void;
  onOpenSavjetnik?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuote, onOpenSavjetnik }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      {/* 1. Top Institutional Utility Bar */}
      <div className="bg-[#0B1528] text-slate-300 py-2 px-4 sm:px-6 lg:px-8 text-[11px] font-sans border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Official Accreditation & Strategic Partners */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.hanfa.hr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono font-bold text-[10px] border border-emerald-500/25 hover:bg-emerald-500/25 transition-colors"
              title="Službeni upis u registar distributera osiguranja HANFA"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              HANFA REGISTAR: ZO-88912
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>

            <span className="hidden md:inline text-slate-400 font-medium">
              ŽIVOT d.o.o. &bull; Strateški partner <strong className="text-white">Generali osiguranja d.d.</strong> &bull; Toyota Centar Zagreb
            </span>
          </div>

          {/* Right: 24/7 Claims & Hotline Contact */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <Link
              to="/prijava-stete"
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1.5 font-bold transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">24/7 Prijava štete</span>
              <span className="sm:hidden">Štete</span>
            </Link>

            <span className="text-slate-700">|</span>

            <a
              href={`tel:${AGENCY_DETAILS.phone.replace(/\s+/g, '')}`}
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{AGENCY_DETAILS.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Institutional Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Official Brand Logo */}
          <Link to="/" className="group focus:outline-none" aria-label="Naslovna stranica Agencija Život">
            <BrandLogo variant="full" theme="light" showBadge={true} />
          </Link>

          {/* Desktop Navigation Links with Category Indicators */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-semibold text-slate-700">
            {/* Dopunsko zdravstveno */}
            <Link
              to="/dopunsko-zdravstveno"
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${
                isActive('/dopunsko-zdravstveno')
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-sm'
                  : 'hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <HeartPulse className="w-4 h-4 text-rose-600" />
              <span>Dopunsko 2026</span>
              <span className="text-[10px] font-mono font-bold bg-rose-600 text-white px-1.5 py-0.5 rounded leading-none">
                15 €
              </span>
            </Link>

            {/* Auto & Kasko */}
            <Link
              to="/auto-osiguranje"
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${
                isActive('/auto-osiguranje')
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                  : 'hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <Car className="w-4 h-4 text-blue-600" />
              <span>Auto &amp; Kasko</span>
              <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded leading-none">
                50% bonus
              </span>
            </Link>

            {/* Imovina & Dom */}
            <Link
              to="/imovina"
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${
                isActive('/imovina')
                  ? 'bg-amber-50 text-amber-800 border border-amber-200 shadow-sm'
                  : 'hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4 text-amber-600" />
              <span>Imovina i dom</span>
            </Link>

            {/* Prijepis vozila */}
            <Link
              to="/kalkulator-prijepisa"
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${
                isActive('/kalkulator-prijepisa')
                  ? 'bg-slate-100 text-slate-950 border border-slate-200'
                  : 'hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <Calculator className="w-4 h-4 text-slate-500" />
              <span>Prijepis (NN 92/21)</span>
            </Link>

            {/* Prijava štete */}
            <Link
              to="/prijava-stete"
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${
                isActive('/prijava-stete')
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-rose-500" />
              <span>Centar za štete</span>
            </Link>

            {/* Korisnički portal / Digitalni novčanik polica */}
            <Link
              to="/portal"
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                isActive('/portal')
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Moj Portal</span>
            </Link>

            {/* O Agenciji */}
            <Link
              to="/o-nama"
              className={`px-3 py-2 rounded-xl transition-all ${
                isActive('/o-nama')
                  ? 'bg-slate-100 text-slate-950 font-bold'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <span>O Agenciji</span>
            </Link>
          </nav>

          {/* Right Action Center */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Digital Advisor Launcher */}
            <button
              onClick={() => onOpenSavjetnik && onOpenSavjetnik()}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
              title="Pokrenite konverzacijski digitalni savjetnik"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Digitalni savjetnik</span>
            </button>

            {/* Primary Quote Request CTA */}
            <button
              onClick={() => onOpenQuote && onOpenQuote('auto')}
              className="px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs shadow-md shadow-slate-900/10 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Zatraži ponudu</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex xl:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-950 transition-colors"
              aria-label="Otvori navigacijski izbornik"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-4 pb-8 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <Link
              to="/dopunsko-zdravstveno"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-left space-y-1 block"
            >
              <HeartPulse className="w-5 h-5 text-rose-600" />
              <p className="font-bold text-slate-950 text-sm">Dopunsko 2026</p>
              <p className="text-[11px] text-slate-600">HZZO 15 € vs 6,50 €</p>
            </Link>

            <Link
              to="/auto-osiguranje"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-left space-y-1 block"
            >
              <Car className="w-5 h-5 text-blue-600" />
              <p className="font-bold text-slate-950 text-sm">Auto &amp; Kasko</p>
              <p className="text-[11px] text-slate-600">50% bonusa & Toyota</p>
            </Link>
          </div>

          <div className="space-y-1 text-sm font-semibold divide-y divide-slate-100">
            <Link
              to="/imovina"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl text-slate-800 hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4 text-amber-500" />
                <span>Osiguranje stana, kuće i potresa</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/kalkulator-prijepisa"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl text-slate-800 hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-4 h-4 text-slate-500" />
                <span>Kalkulator pristojbe prijepisa (NN 92/21)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/prijava-stete"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl text-slate-800 hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <FileCheck2 className="w-4 h-4 text-rose-500" />
                <span>24/7 Digitalni centar za štete (FNOL)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/portal"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl text-emerald-800 bg-emerald-50/60 font-bold hover:bg-emerald-100/60"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Moj Portal &bull; Digitalni novčanik polica</span>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-600" />
            </Link>

            <Link
              to="/o-nama"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl text-slate-800 hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>O Agenciji Život &amp; HANFA akreditacija</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/prigovori"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl text-slate-800 hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <Scale className="w-4 h-4 text-slate-500" />
                <span>Prigovori potrošača &amp; Mirenje pri HUO</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          <div className="pt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenSavjetnik) onOpenSavjetnik();
              }}
              className="py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Savjetnik</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenQuote) onOpenQuote('auto');
              }}
              className="py-3 rounded-xl bg-[#0F172A] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
            >
              <span>Zatraži ponudu</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
