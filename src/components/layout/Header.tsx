import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Phone,
  Menu,
  X,
  Calculator,
  ChevronDown,
  AlertTriangle,
  FileCheck2,
  HelpCircle,
  Car,
  Home,
  Heart,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  onOpenQuote?: (category?: 'auto' | 'property' | 'health' | 'travel' | 'business') => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuote }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleQuoteClick = (category?: 'auto' | 'property' | 'health' | 'travel' | 'business') => {
    setMobileMenuOpen(false);
    if (onOpenQuote) {
      onOpenQuote(category);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-md">
      {/* Top Utility Strip (Emergency & Regulatory) */}
      <div className="bg-slate-950 border-b border-slate-800/80 py-1.5 px-4 sm:px-6 lg:px-8 text-[11px] text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-semibold font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              HANFA Licenca
            </span>
            <span className="hidden sm:inline text-slate-400 font-mono">
              Ovlašteni distributer osiguranja u RH &bull; Registar br. ZO-88912
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <Link
              to="/prijava-stete"
              className="text-slate-300 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span>Prijava štete 24/7</span>
            </Link>
            <span className="text-slate-700">|</span>
            <a
              href="tel:015550666"
              className="text-emerald-400 font-bold hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>01 555 0666</span>
            </a>
          </div>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & HANFA Badge */}
          <Link to="/" className="flex items-center gap-3 group text-left">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors leading-tight">
                AGENCIJA ZA OSIGURANJE
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-semibold leading-none">
                Usporedba &bull; Savjetovanje &bull; Ugovaranje
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => handleQuoteClick('auto')}
              className="px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
            >
              <Car className="w-4 h-4 text-emerald-400" />
              <span>Auto osiguranje</span>
            </button>

            <button
              onClick={() => handleQuoteClick('property')}
              className="px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
            >
              <Home className="w-4 h-4 text-blue-400" />
              <span>Imovina i dom</span>
            </button>

            <button
              onClick={() => handleQuoteClick('health')}
              className="px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Zdravstveno</span>
            </button>

            <Link
              to="/kalkulator-prijepisa"
              className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                isActive('/kalkulator-prijepisa')
                  ? 'bg-blue-900/40 text-blue-400 border border-blue-800'
                  : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Prijepis vozila</span>
            </Link>

            <Link
              to="/prijava-stete"
              className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                isActive('/prijava-stete')
                  ? 'bg-rose-950/50 text-rose-300 border border-rose-800'
                  : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-rose-400" />
              <span>Prijava štete</span>
            </Link>

            <Link
              to="/o-nama-pravno"
              className={`px-3 py-2 rounded-xl transition-colors ${
                isActive('/o-nama-pravno')
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              O nama
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:015550666"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-white transition-all active:scale-95"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>01 555 0666</span>
            </a>

            <Button
              variant="emerald"
              size="sm"
              onClick={() => handleQuoteClick()}
              className="font-bold shadow-lg shadow-emerald-900/20"
            >
              Zatraži ponudu
            </Button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex xl:hidden items-center gap-2">
            <Button
              variant="emerald"
              size="sm"
              onClick={() => handleQuoteClick()}
              className="font-bold text-xs"
            >
              Ponuda
            </Button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Izbornik"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200 text-left">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuoteClick('auto')}
              className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 flex items-center gap-2.5 text-xs font-bold text-white hover:bg-slate-800"
            >
              <Car className="w-4 h-4 text-emerald-400" />
              <span>Auto osiguranje</span>
            </button>

            <button
              onClick={() => handleQuoteClick('property')}
              className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 flex items-center gap-2.5 text-xs font-bold text-white hover:bg-slate-800"
            >
              <Home className="w-4 h-4 text-blue-400" />
              <span>Imovina i dom</span>
            </button>

            <button
              onClick={() => handleQuoteClick('health')}
              className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 flex items-center gap-2.5 text-xs font-bold text-white hover:bg-slate-800"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Zdravstveno</span>
            </button>

            <button
              onClick={() => handleQuoteClick('travel')}
              className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 flex items-center gap-2.5 text-xs font-bold text-white hover:bg-slate-800"
            >
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Putno osiguranje</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-1 text-sm font-medium">
            <Link
              to="/kalkulator-prijepisa"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800"
            >
              Kalkulator prijepisa vozila
            </Link>
            <Link
              to="/prijava-stete"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800"
            >
              Prijava štete (FNOL)
            </Link>
            <Link
              to="/o-nama-pravno"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800"
            >
              O nama i pravne informacije
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <a
              href="tel:015550666"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 text-white font-bold text-sm min-h-[44px]"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Pozovi agenta: 01 555 0666</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
