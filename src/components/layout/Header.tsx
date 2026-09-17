import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Phone,
  Menu,
  X,
  AlertTriangle,
  Car,
  Home,
  HeartPulse,
  Sparkles,
  ShieldCheck,
  Shield,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Mail,
  Grid,
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
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all">
      {/* 1. Top Utility & Regulatory Bar */}
      <div className="bg-slate-900 text-slate-300 py-2 px-4 sm:px-6 lg:px-8 text-[11px] font-sans border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Official Accreditation & Strategic Partners */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.hanfa.hr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-400 font-mono font-bold text-[10px] border border-teal-500/25 hover:bg-teal-500/25 transition-colors"
              title="Službeni upis u registar distributera osiguranja HANFA"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              HANFA REGISTAR: ZO-88912
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>

            <span className="hidden md:inline text-slate-400 font-medium">
              Agencija za osiguranje &bull; Strateški partner <strong className="text-white font-semibold">Generali osiguranja d.d.</strong> &bull; Toyota Centar Zagreb
            </span>
          </div>

          {/* Right: 24/7 Claims & Direct Phone */}
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
              className="text-teal-400 hover:text-teal-300 flex items-center gap-1.5 font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{AGENCY_DETAILS.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Glassmorphic Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="group focus:outline-none" aria-label="Naslovna stranica Agencija za osiguranje">
            <BrandLogo variant="full" theme="light" showBadge={true} />
          </Link>

          {/* Desktop Navigation Links ('Usluge', 'O nama', 'Kontakt', 'Blog', 'Moj Portal') */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
            {/* Usluge / Programi */}
            <Link
              to="/services"
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                isActive('/services')
                  ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-bold'
                  : 'hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/70'
              }`}
            >
              <Grid className="w-4 h-4 text-teal-600" />
              <span>Usluge</span>
            </Link>

            {/* O nama */}
            <Link
              to="/o-nama"
              className={`px-3.5 py-2 rounded-xl transition-all ${
                isActive('/o-nama')
                  ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/70'
              }`}
            >
              <span>O nama</span>
            </Link>

            {/* Kontakt */}
            <Link
              to="/contact"
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                isActive('/contact')
                  ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/70'
              }`}
            >
              <Mail className="w-4 h-4 text-slate-400" />
              <span>Kontakt</span>
            </Link>

            {/* Blog / Savjeti */}
            <Link
              to="/prigovori"
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                isActive('/prigovori')
                  ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/70'
              }`}
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Blog &amp; Vodiči</span>
            </Link>

            {/* Moj Portal (Digital Policy Wallet) */}
            <Link
              to="/portal"
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ml-2 ${
                isActive('/portal')
                  ? 'bg-teal-600 text-white shadow-md font-bold'
                  : 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-bold hover:bg-teal-100'
              }`}
            >
              <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Moj Portal</span>
            </Link>
          </nav>

          {/* Right Action Center */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Digital Advisor Launcher */}
            <button
              onClick={() => onOpenSavjetnik && onOpenSavjetnik()}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
              title="Pokrenite konverzacijski digitalni savjetnik"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Digitalni savjetnik</span>
            </button>

            {/* Prominent "Zatraži ponudu" (Request Quote) Button */}
            <button
              onClick={() => onOpenQuote && onOpenQuote('auto')}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Zatraži ponudu</span>
              <ChevronRight className="w-3.5 h-3.5 text-teal-100" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-950 transition-colors"
              aria-label="Otvori navigacijski izbornik"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Glassmorphic Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl px-4 pt-4 pb-8 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <Link
              to="/auto-osiguranje"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200 text-left space-y-1 block"
            >
              <Car className="w-5 h-5 text-teal-600" />
              <p className="font-bold text-slate-950 text-sm">Auto &amp; Kasko</p>
              <p className="text-[11px] text-slate-600">50% bonusa & Toyota</p>
            </Link>

            <Link
              to="/dopunsko-zdravstveno"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-left space-y-1 block"
            >
              <HeartPulse className="w-5 h-5 text-rose-600" />
              <p className="font-bold text-slate-950 text-sm">Dopunsko 2026</p>
              <p className="text-[11px] text-slate-600">HZZO 15 € vs 6,50 €</p>
            </Link>
          </div>

          <div className="space-y-1 text-sm font-semibold divide-y divide-slate-100 dark:divide-slate-800">
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <Grid className="w-4 h-4 text-teal-600" />
                <span>Sve usluge i programi osiguranja</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/portal"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl text-teal-800 bg-teal-50/80 font-bold hover:bg-teal-100"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-teal-600" />
                <span>Moj Portal &bull; Digitalni novčanik polica</span>
              </div>
              <ChevronRight className="w-4 h-4 text-teal-600" />
            </Link>

            <Link
              to="/imovina"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4 text-amber-500" />
                <span>Osiguranje stana, kuće i potresa</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/prijava-stete"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>24/7 Digitalni centar za štete (FNOL)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/o-nama"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>O Agenciji &amp; HANFA licenca ZO-88912</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>Kontakt i lokacija ureda</span>
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
              className="py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Savjetnik</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenQuote) onOpenQuote('auto');
              }}
              className="py-3 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Zatraži ponudu</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
