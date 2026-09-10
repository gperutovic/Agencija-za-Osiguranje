import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  ChevronDown, 
  FileText, 
  AlertTriangle, 
  Briefcase, 
  ExternalLink, 
  Lock, 
  Menu, 
  X, 
  Activity,
  Cpu
} from 'lucide-react';

export const ValiantNavbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lobDropdownOpen, setLobDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#07090E]/80 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#0284C7] to-[#0369a1] shadow-[0_0_20px_-3px_rgba(2,132,199,0.5)] border border-white/20 transition-all duration-300 group-hover:scale-105">
              <ShieldCheck className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#10B981] border-2 border-[#07090E] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-[#38bdf8] transition-colors">
                  VALIANT
                </span>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white/[0.06] text-[#38bdf8] border border-white/[0.08]">
                  GLOBAL RISK
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-wider flex items-center gap-1.5">
                <span>LLOYD'S COVERHOLDER</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400">SOC2 COMPLIANT</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Lines of Business Dropdown */}
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
                <span>Lines of Business</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${lobDropdownOpen ? 'rotate-180 text-[#0284C7]' : 'text-slate-400'}`} />
              </button>

              {lobDropdownOpen && (
                <div className="absolute left-0 mt-1 w-80 rounded-2xl bg-[#0E131F]/95 border border-white/[0.1] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-2 z-50">
                  <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/[0.06]">
                    Underwritten Portfolios
                  </div>
                  <Link 
                    to="/quote?lob=commercial" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                  >
                    <Briefcase className="w-5 h-5 text-[#0284C7] mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-[#38bdf8]">Commercial General Liability</div>
                      <div className="text-[11px] text-slate-400">Premises, operations, and product hazard protection up to $10M.</div>
                    </div>
                  </Link>
                  <Link 
                    to="/quote?lob=cyber" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                  >
                    <Cpu className="w-5 h-5 text-[#6366F1] mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-indigo-400">Cyber Extortion & Tech E&O</div>
                      <div className="text-[11px] text-slate-400">Ransomware negotiation, forensic costs, and algorithmic liability.</div>
                    </div>
                  </Link>
                  <Link 
                    to="/quote?lob=property" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                  >
                    <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-emerald-300">Commercial Property & BI</div>
                      <div className="text-[11px] text-slate-400">All-risk physical assets, business interruption, and equipment breakdown.</div>
                    </div>
                  </Link>
                  <Link 
                    to="/quote?lob=executive" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                  >
                    <Activity className="w-5 h-5 text-amber-400 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-amber-300">Executive Risk & D&O</div>
                      <div className="text-[11px] text-slate-400">Directors & officers fiduciary defense with Side A/B/C indemnity.</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/portal/coi"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/portal/coi')
                  ? 'text-white bg-white/[0.08] shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <FileText className="w-4 h-4 text-[#38bdf8]" />
              <span>ACORD 25 Generator</span>
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
              <span>FNOL Claims</span>
            </Link>

            <Link
              to="/appetite"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/appetite')
                  ? 'text-white bg-white/[0.08]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <span>Appetite Matrix</span>
            </Link>
          </nav>

          {/* Right Controls & CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Live Operational Status */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">UPTIME</span>
              <span className="text-white font-bold">99.99%</span>
            </div>

            {/* Client Portal Link */}
            <Link
              to="/portal"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Client Portal</span>
            </Link>

            {/* Primary Bind CTA */}
            <Link
              to="/quote"
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-sans font-semibold text-sm text-white bg-gradient-to-r from-[#0284C7] to-[#0369a1] hover:from-[#0369a1] hover:to-[#0284C7] shadow-[0_0_25px_-5px_rgba(2,132,199,0.6)] border border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Get Instant Bind</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              to="/quote"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0284C7]"
            >
              Instant Bind
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/[0.05] text-slate-300 hover:text-white border border-white/[0.08]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/[0.08] bg-[#07090E]/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/quote"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0369a1] text-white font-semibold text-sm"
          >
            <span>Start Multi-Carrier Quote & Bind</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
          <Link
            to="/portal/coi"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] text-slate-200 border border-white/[0.08] text-sm"
          >
            <FileText className="w-4 h-4 text-[#38bdf8]" />
            <span>Instant ACORD 25 COI Generator</span>
          </Link>
          <Link
            to="/claims/file"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] text-slate-200 border border-white/[0.08] text-sm"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Autonomous FNOL Claims Triage</span>
          </Link>
          <Link
            to="/portal"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] text-slate-200 border border-white/[0.08] text-sm"
          >
            <Lock className="w-4 h-4 text-[#0284C7]" />
            <span>Authenticated Client Portal</span>
          </Link>
          <Link
            to="/appetite"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] text-slate-200 border border-white/[0.08] text-sm"
          >
            <span>Underwriting Appetite Matrix</span>
          </Link>
        </div>
      )}
    </header>
  );
};

