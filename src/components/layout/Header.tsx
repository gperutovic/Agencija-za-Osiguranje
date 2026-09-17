import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
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
} from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      {/* Top Utility Bar: HANFA License, Generali Partner & Emergency line */}
      <div className="bg-slate-900 py-1.5 px-4 sm:px-6 lg:px-8 text-[11px] text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold font-mono text-[10px] border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              HANFA ZO-88912
            </span>
            <span className="hidden md:inline text-slate-300 font-mono">
              Generali osiguranje partner &bull; Toyota Centar Zagreb
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs">
            <Link
              to="/prijava-stete"
              className="text-slate-300 hover:text-rose-400 flex items-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span>Prijava štete 24/7</span>
            </Link>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <a
              href="tel:014800120"
              className="text-emerald-400 font-bold hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>01 4800 120</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Authentic Agencija Život Credentials */}
          <Link to="/" className="flex items-center gap-3.5 group text-left">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF0055] to-rose-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-[#FF0055]/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-950 group-hover:text-[#FF0055] transition-colors leading-tight">
                  AGENCIJA ŽIVOT
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                  Generali Partner
                </span>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-semibold leading-none mt-0.5">
                Dopunsko &bull; Auto &bull; Toyota VIP Kasko &bull; Imovina
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold">
            <Link
              to="/dopunsko-zdravstveno"
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                isActive('/dopunsko-zdravstveno')
                  ? 'bg-rose-50 text-[#FF0055] border border-rose-200'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <HeartPulse className="w-4 h-4 text-[#FF0055]" />
              <span>Dopunsko 2026</span>
              <span className="text-[9px] font-mono font-bold bg-[#FF0055] text-white px-1.5 py-0.2 rounded-full">
                15 €
              </span>
            </Link>

            <Link
              to="/auto-osiguranje"
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                isActive('/auto-osiguranje')
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Car className="w-4 h-4 text-blue-600" />
              <span>Auto &amp; Kasko</span>
            </Link>

            <Link
              to="/imovina"
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                isActive('/imovina')
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4 text-amber-500" />
              <span>Imovina i dom</span>
            </Link>

            <Link
              to="/kalkulator-prijepisa"
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                isActive('/kalkulator-prijepisa')
                  ? 'bg-slate-100 text-slate-950'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Calculator className="w-4 h-4 text-slate-500" />
              <span>Prijepis (NN 92/21)</span>
            </Link>

            <Link
              to="/prijava-stete"
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                isActive('/prijava-stete')
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-rose-500" />
              <span>Prijava štete</span>
            </Link>

            <Link
              to="/o-nama"
              className={`px-3 py-2 rounded-xl transition-colors ${
                isActive('/o-nama')
                  ? 'bg-slate-100 text-slate-950'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <span>O nama</span>
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={() => onOpenSavjetnik && onOpenSavjetnik()}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#FF0055] hover:bg-[#d90048] text-white font-bold text-sm shadow-md shadow-[#FF0055]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Agent Savjetnik</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
              aria-label="Otvori navigaciju"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-4 pb-6 space-y-3 shadow-xl">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100 text-xs">
            <Link
              to="/dopunsko-zdravstveno"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-left space-y-1 block"
            >
              <HeartPulse className="w-5 h-5 text-[#FF0055]" />
              <p className="font-bold text-slate-900">Dopunsko 2026</p>
              <p className="text-[10px] text-slate-500">HZZO 15 € vs 6,50 €</p>
            </Link>

            <Link
              to="/auto-osiguranje"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-left space-y-1 block"
            >
              <Car className="w-5 h-5 text-blue-600" />
              <p className="font-bold text-slate-900">Auto &amp; Kasko</p>
              <p className="text-[10px] text-slate-500">50% bonusa & Toyota</p>
            </Link>
          </div>

          <div className="space-y-1 text-sm font-semibold">
            <Link
              to="/imovina"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2.5 p-3 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              <Home className="w-4 h-4 text-amber-500" />
              <span>Osiguranje imovine, stana i potresa</span>
            </Link>

            <Link
              to="/kalkulator-prijepisa"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2.5 p-3 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              <Calculator className="w-4 h-4 text-slate-500" />
              <span>Kalkulator upravne pristojbe prijepisa (NN 92/21)</span>
            </Link>

            <Link
              to="/prijava-stete"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2.5 p-3 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              <FileCheck2 className="w-4 h-4 text-rose-500" />
              <span>24/7 Digitalna prijava štete (FNOL)</span>
            </Link>

            <Link
              to="/o-nama"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2.5 p-3 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              <Info className="w-4 h-4 text-blue-500" />
              <span>O Agenciji Život i HANFA licenca ZO-88912</span>
            </Link>

            <Link
              to="/prigovori"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2.5 p-3 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              <Scale className="w-4 h-4 text-slate-500" />
              <span>Postupak podnošenja prigovora potrošača</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenSavjetnik) onOpenSavjetnik();
              }}
              className="w-full py-3.5 rounded-2xl bg-[#FF0055] text-white font-bold text-sm shadow-md flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Pokreni Agenta Savjetnika</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
