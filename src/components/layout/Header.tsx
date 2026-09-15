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
  Heart,
  UserCheck,
  Sparkles,
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
    <header className="sticky top-0 z-40 w-full bg-[#06080c]/95 backdrop-blur-md border-b border-white/[0.07] text-white shadow-xl">
      {/* Top Utility Strip (Emergency, HANFA & Partner info) */}
      <div className="bg-[#080c14] border-b border-white/[0.05] py-1.5 px-4 sm:px-6 lg:px-8 text-[11px] text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              HANFA LICENCA ZO-88912
            </span>
            <span className="hidden md:inline text-slate-400 font-mono text-[11px]">
              Ekskluzivni partner Generali osiguranja &bull; Toyota Centar Zagreb
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <Link
              to="/prijava-stete"
              className="text-slate-300 hover:text-[#fb6504] flex items-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#fb6504]" />
              <span>Prijava štete 24/7</span>
            </Link>
            <span className="text-slate-700">|</span>
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

      {/* Primary Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Authentic Agencija Život Credentials */}
          <Link to="/" className="flex items-center gap-3.5 group text-left">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#fb6504] to-[#d95302] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#fb6504]/20 group-hover:scale-105 transition-transform border border-white/10">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white group-hover:text-[#fb6504] transition-colors leading-tight">
                  AGENCIJA ŽIVOT
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-white/10 text-slate-300 border border-white/10 uppercase">
                  Generali Partner
                </span>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-medium leading-none mt-0.5">
                Toyota VIP Kasko &bull; Imovina &bull; Život &bull; STP Prijepis
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 text-sm font-medium">
            <button
              onClick={() => handleQuoteClick('auto')}
              className="px-3.5 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/[0.05] transition-colors flex items-center gap-1.5"
            >
              <Car className="w-4 h-4 text-[#fb6504]" />
              <span>Auto & Kasko</span>
            </button>

            <button
              onClick={() => handleQuoteClick('property')}
              className="px-3.5 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/[0.05] transition-colors flex items-center gap-1.5"
            >
              <Home className="w-4 h-4 text-blue-400" />
              <span>Imovina i dom</span>
            </button>

            <button
              onClick={() => handleQuoteClick('health')}
              className="px-3.5 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/[0.05] transition-colors flex items-center gap-1.5"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Zdravstvo</span>
            </button>

            <Link
              to="/kalkulator-prijepisa"
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                isActive('/kalkulator-prijepisa')
                  ? 'bg-white/[0.08] text-[#fb6504] border border-[#fb6504]/30'
                  : 'text-slate-200 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Prijepis (NN 92/21)</span>
            </Link>

            <Link
              to="/prijava-stete"
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                isActive('/prijava-stete')
                  ? 'bg-white/[0.08] text-rose-400 border border-rose-500/30'
                  : 'text-slate-200 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-rose-400" />
              <span>Prijava štete</span>
            </Link>

            <Link
              to="/portal"
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                isActive('/portal')
                  ? 'bg-white/[0.08] text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-200 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Moj Život</span>
            </Link>
          </nav>

          {/* Right Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => handleQuoteClick('auto')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white font-bold text-sm shadow-lg shadow-[#fb6504]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Zatraži ponudu</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white"
              aria-label="Izbornik"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#080c14] px-4 pt-4 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/10 text-xs">
            <button
              onClick={() => handleQuoteClick('auto')}
              className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-left space-y-1"
            >
              <Car className="w-4 h-4 text-[#fb6504]" />
              <p className="font-bold text-white">Auto & Kasko</p>
              <p className="text-[10px] text-slate-400">Toyota VIP i 50% bonusa</p>
            </button>
            <button
              onClick={() => handleQuoteClick('property')}
              className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-left space-y-1"
            >
              <Home className="w-4 h-4 text-blue-400" />
              <p className="font-bold text-white">Imovina & Dom</p>
              <p className="text-[10px] text-slate-400">Potres, voda, požar</p>
            </button>
          </div>

          <div className="space-y-1 text-sm font-medium">
            <Link
              to="/kalkulator-prijepisa"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2.5 p-3 rounded-xl text-slate-200 hover:bg-white/[0.05]"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Kalkulator prijepisa vozila (NN 92/21)</span>
            </Link>
            <Link
              to="/prijava-stete"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2.5 p-3 rounded-xl text-slate-200 hover:bg-white/[0.05]"
            >
              <FileCheck2 className="w-4 h-4 text-rose-400" />
              <span>Prijava štete (FNOL 24/7)</span>
            </Link>
            <Link
              to="/portal"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2.5 p-3 rounded-xl text-slate-200 hover:bg-white/[0.05]"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Klijentski portal Moj Život</span>
            </Link>
            <Link
              to="/o-nama-pravno"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2.5 p-3 rounded-xl text-slate-200 hover:bg-white/[0.05]"
            >
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Pravne obavijesti i HANFA licenca</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-white/10">
            <button
              onClick={() => handleQuoteClick('auto')}
              className="w-full py-3 rounded-xl bg-[#fb6504] text-white font-bold text-sm shadow-md flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Zatraži ponudu online</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
