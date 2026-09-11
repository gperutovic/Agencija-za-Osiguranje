import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  ChevronDown, 
  FileText, 
  AlertTriangle, 
  Briefcase, 
  Lock, 
  Menu, 
  X, 
  Car,
  Home,
  Heart,
  Activity,
  ArrowRight,
  PhoneCall,
  Sliders,
  Sparkles
} from 'lucide-react';

export const ValiantNavbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lobDropdownOpen, setLobDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.07] bg-[#06080c]/90 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & HANFA Badge */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#fb6504] via-[#ff7b1a] to-[#ea580c] shadow-[0_0_25px_-3px_rgba(251,101,4,0.5)] border border-white/20 transition-all duration-300 group-hover:scale-105">
              <img src="/logo.svg" alt="Agencija Život" className="w-7 h-7" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#10B981] border-2 border-[#06080c] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-[#ff7b1a] transition-colors">
                  AGENCIJA ŽIVOT
                </span>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white/[0.06] text-[#fb6504] border border-[#fb6504]/30">
                  HRVATSKA
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-wider flex items-center gap-1.5">
                <span>OVLAŠTENI POSREDNIK</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400">HANFA LICENCA</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            
            {/* Croatian Insurance Programs Mega-Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setLobDropdownOpen(true)}
              onMouseLeave={() => setLobDropdownOpen(false)}
            >
              <button 
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  lobDropdownOpen ? 'text-white bg-white/[0.05]' : 'text-slate-300 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <span>Programi Osiguranja</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${lobDropdownOpen ? 'rotate-180 text-[#fb6504]' : 'text-slate-400'}`} />
              </button>

              {lobDropdownOpen && (
                <div className="absolute left-0 mt-1 w-[680px] rounded-2xl bg-[#0a0d16]/98 border border-white/[0.08] backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-5 z-50 grid grid-cols-12 gap-5">
                  
                  {/* Left 7 Cols: Lines of Insurance Grid */}
                  <div className="col-span-7 space-y-2">
                    <p className="rr-label text-[#fb6504]">Vodeći Programi za Građane i Tvrtke</p>
                    <div className="grid grid-cols-1 gap-1.5">
                      <Link 
                        to="/quote?lob=auto" 
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.05] transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-[#fb6504]/10 text-[#fb6504] mt-0.5">
                          <Car className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-[#fb6504]">Auto Osiguranje & Kasko</span>
                            <span className="rr-pill rr-pill--orange">Zelena Karta</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Obvezno AO do 50% bonusa, zaštita stakala i 24/7 vučna služba.</div>
                        </div>
                      </Link>

                      <Link 
                        to="/quote?lob=property" 
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.05] transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-[#10b981]/10 text-[#10b981] mt-0.5">
                          <Home className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-[#fb6504]">Osiguranje Doma & Potresa</span>
                            <span className="rr-pill rr-pill--success">Seizmički Rider</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Građevinski dio i stvari kućanstva od požara, oluje i potresa u RH.</div>
                        </div>
                      </Link>

                      <Link 
                        to="/quote?lob=life" 
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.05] transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 mt-0.5">
                          <Heart className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-[#fb6504]">Životno Osiguranje ŽIVOT+</span>
                            <span className="rr-pill">Financijska Sigurnost</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Kapitalizirana štednja, otplata stambenog kredita i zaštita obitelji.</div>
                        </div>
                      </Link>

                      <Link 
                        to="/quote?lob=health" 
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.05] transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 mt-0.5">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-[#fb6504]">Dopunsko & Dodatno Zdravstvo</span>
                            <span className="rr-pill">B-Lista Lijekova</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Bez participacija u bolnicama i privatni specijalistički pregledi.</div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Right 5 Cols: Carrier Partners & Quick Action */}
                  <div className="col-span-5 border-l border-white/[0.06] pl-5 flex flex-col justify-between space-y-4">
                    <div>
                      <p className="rr-label">Partner Osiguratelji u RH</p>
                      <div className="space-y-1.5 mt-2">
                        <span className="block text-xs text-slate-300 font-medium">Croatia Osiguranje d.d.</span>
                        <span className="block text-xs text-slate-300 font-medium">Allianz Hrvatska d.d.</span>
                        <span className="block text-xs text-slate-300 font-medium">Generali Osiguranje d.d.</span>
                        <span className="block text-xs text-slate-300 font-medium">Wiener Städtische VIG</span>
                        <span className="block text-xs text-slate-300 font-medium">Grawe Hrvatska d.d.</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-gradient-to-b from-[#fb6504]/15 to-transparent border border-[#fb6504]/25 space-y-1.5">
                      <p className="rr-label text-[#fb6504]">90-Sekundni Izračun</p>
                      <h5 className="text-xs font-bold text-white">Maya AI Pametni Asistent</h5>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Interaktivno podesite franšizu klizačem i odmah usporedite premije svih osiguratelja.
                      </p>
                      <Link 
                        to="/quote" 
                        className="rr-btn rr-btn--primary text-[11px] py-1.5 px-3 w-full justify-center mt-1"
                      >
                        <span>Izračunaj Premiju</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                  </div>

                </div>
              )}
            </div>

            <Link
              to="/quote"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/quote')
                  ? 'text-white bg-white/[0.08]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Sliders className="w-4 h-4 text-[#fb6504]" />
              <span>Izračun Premije</span>
            </Link>

            <Link
              to="/claims/file"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/claims/file')
                  ? 'text-white bg-white/[0.08]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Prijava Štete</span>
            </Link>

            <Link
              to="/portal/coi"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/portal/coi')
                  ? 'text-white bg-white/[0.08]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <FileText className="w-4 h-4 text-[#fb6504]" />
              <span>Potvrda o Osiguranju</span>
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center gap-3">
            {/* 24/7 Roadside SOS Hotline Button */}
            <a
              href="tel:+38514800120"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-rose-400 animate-pulse" />
              <span>SOS 24/7: 01 4800 120</span>
            </a>

            {/* Client Portal Link */}
            <Link
              to="/portal"
              className="rr-btn rr-btn--ghost text-xs py-2 px-3.5"
            >
              <Lock className="w-3.5 h-3.5 text-[#fb6504]" />
              <span>Moj Portal</span>
            </Link>

            {/* Primary Quote CTA */}
            <Link
              to="/quote"
              className="rr-btn rr-btn--primary text-xs py-2.5 px-4"
            >
              <span>Usporedi Police</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              to="/quote"
              className="rr-btn rr-btn--primary text-xs py-1.5 px-3"
            >
              Izračun
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/[0.05] text-slate-300 hover:text-white border border-white/[0.08]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/[0.08] bg-[#06080c]/98 backdrop-blur-2xl px-4 pt-4 pb-6 space-y-3">
          <Link
            to="/quote"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-xl bg-[#fb6504] text-white font-semibold text-sm"
          >
            <span>Usporedi Ponude Osiguranja</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/claims/file"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] text-slate-200 border border-white/[0.08] text-sm"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Prijava Štete (FNOL) u 3 Minute</span>
          </Link>
          <Link
            to="/portal"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] text-slate-200 border border-white/[0.08] text-sm"
          >
            <Lock className="w-4 h-4 text-[#fb6504]" />
            <span>Klijentski Portal & Digitalna Polica</span>
          </Link>
          <Link
            to="/portal/coi"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] text-slate-200 border border-white/[0.08] text-sm"
          >
            <FileText className="w-4 h-4 text-[#fb6504]" />
            <span>Potvrda o Osiguranju (Zelena Karta)</span>
          </Link>
          <div className="pt-2 border-t border-white/[0.08]">
            <a
              href="tel:+38514800120"
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-600 text-white font-bold text-xs"
            >
              <PhoneCall className="w-4 h-4" />
              <span>SOS Hitna Pomoć na Cesti 24/7: 01 4800 120</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
