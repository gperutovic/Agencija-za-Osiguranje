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
  Building,
  Truck,
  Cpu,
  Users,
  ShieldAlert,
  ArrowRight,
  Layers,
  Sparkles
} from 'lucide-react';

export const ValiantNavbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lobDropdownOpen, setLobDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.07] bg-[#06080c]/85 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#fb6504] to-[#ea580c] shadow-[0_0_20px_-3px_rgba(251,101,4,0.5)] border border-white/20 transition-all duration-300 group-hover:scale-105">
              <ShieldCheck className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#10B981] border-2 border-[#06080c] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-[#ff7b1a] transition-colors">
                  VALIANT
                </span>
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-white/[0.06] text-[#fb6504] border border-[#fb6504]/30">
                  GLOBAL RISK
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-wider flex items-center gap-1.5">
                <span>LLOYD'S COVERHOLDER</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">SURPLUS LINES</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            
            {/* Commercial Lines Mega-Menu (RankRush Product Dropdown Architecture) */}
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
                <span>Commercial Lines</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${lobDropdownOpen ? 'rotate-180 text-[#fb6504]' : 'text-slate-400'}`} />
              </button>

              {lobDropdownOpen && (
                <div className="absolute left-0 mt-1 w-[680px] rounded-2xl bg-[#0a0d16]/98 border border-white/[0.08] backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-5 z-50 grid grid-cols-12 gap-5">
                  
                  {/* Left 7 Cols: Lines of Insurance Grid */}
                  <div className="col-span-7 space-y-3">
                    <p className="rr-label text-[#fb6504]">The Underwriting Loop · Core Portfolios</p>
                    <div className="grid grid-cols-1 gap-1.5">
                      <Link 
                        to="/quote?lob=general-liability" 
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.05] transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-[#10b981]/10 text-[#10b981] mt-0.5">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-[#fb6504]">Commercial General Liability</span>
                            <span className="rr-pill rr-pill--success">CG 00 01</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Premises, operations, and product hazard protection up to $10M.</div>
                        </div>
                      </Link>

                      <Link 
                        to="/quote?lob=property" 
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.05] transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-[#fb6504]/10 text-[#fb6504] mt-0.5">
                          <Building className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-[#fb6504]">Property & Business Interruption</span>
                            <span className="rr-pill rr-pill--orange">CP 00 10</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Real property, cold storage, equipment breakdown, and extra expense.</div>
                        </div>
                      </Link>

                      <Link 
                        to="/quote?lob=cyber" 
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.05] transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-[#a855f7]/10 text-[#a855f7] mt-0.5">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-[#fb6504]">Technology E&O & Cyber Risk</span>
                            <span className="rr-pill rr-pill--violet">TECH E&O</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Ransomware, privacy liability, business interruption, and regulatory defense.</div>
                        </div>
                      </Link>

                      <Link 
                        to="/quote?lob=workers-comp" 
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.05] transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-[#3b82f6]/10 text-[#3b82f6] mt-0.5">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-[#fb6504]">Workers' Comp & Employers' Liability</span>
                            <span className="rr-pill rr-pill--info">STATUTORY</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Mandatory statutory benefits and employers' liability limits up to $1M/$1M/$1M.</div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Right 5 Cols: Use Cases & Promo Card (Exact RankRush Side Panel) */}
                  <div className="col-span-5 border-l border-white/[0.06] pl-5 flex flex-col justify-between space-y-4">
                    <div>
                      <p className="rr-label">Target Industry Appetites</p>
                      <div className="space-y-1 mt-2">
                        <Link to="/appetite?sector=cold-chain" className="block text-xs text-slate-300 hover:text-[#fb6504] py-1 font-medium">
                          Cold-Chain & Warehousing
                        </Link>
                        <Link to="/appetite?sector=tech" className="block text-xs text-slate-300 hover:text-[#fb6504] py-1 font-medium">
                          SaaS & Cloud Platforms
                        </Link>
                        <Link to="/appetite?sector=manufacturing" className="block text-xs text-slate-300 hover:text-[#fb6504] py-1 font-medium">
                          Precision Manufacturing
                        </Link>
                        <Link to="/appetite?sector=healthcare" className="block text-xs text-slate-300 hover:text-[#fb6504] py-1 font-medium">
                          Life Sciences & Medical Tech
                        </Link>
                      </div>
                    </div>

                    {/* RankRush In-Menu Promo Card */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-b from-[#fb6504]/15 to-transparent border border-[#fb6504]/25 space-y-2">
                      <p className="rr-label text-[#fb6504]">Self-Service · 60 Sec</p>
                      <h5 className="text-xs font-bold text-white">Instant ACORD 25 Generator</h5>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Issue verifiable Certificates of Insurance with SHA-256 tamper stamps for landlords and lenders.
                      </p>
                      <Link 
                        to="/portal/coi" 
                        className="rr-btn rr-btn--primary text-[11px] py-1.5 px-3 w-full justify-center mt-1"
                      >
                        <span>Issue Certificate</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                  </div>

                </div>
              )}
            </div>

            <Link
              to="/portal/coi"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/portal/coi')
                  ? 'text-white bg-white/[0.08]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <FileText className="w-4 h-4 text-[#fb6504]" />
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

          {/* Right Action Controls (RankRush Button Pair) */}
          <div className="hidden lg:flex items-center gap-3.5">
            {/* Real Brokerage Rating Badge */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">CAPACITY</span>
              <span className="text-white font-bold">A.M. BEST 'A++'</span>
            </div>

            {/* Client Portal Link */}
            <Link
              to="/portal"
              className="rr-btn rr-btn--ghost text-xs py-2 px-3.5"
            >
              <Lock className="w-3.5 h-3.5 text-[#fb6504]" />
              <span>Client Portal</span>
            </Link>

            {/* Primary Quote CTA */}
            <Link
              to="/quote"
              className="rr-btn rr-btn--primary text-xs py-2.5 px-4"
            >
              <span>Get Commercial Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              to="/quote"
              className="rr-btn rr-btn--primary text-xs py-1.5 px-3"
            >
              Get Quote
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
            <span>Start Multi-Carrier Commercial Quote</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/portal/coi"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] text-slate-200 border border-white/[0.08] text-sm"
          >
            <FileText className="w-4 h-4 text-[#fb6504]" />
            <span>Instant ACORD 25 COI Generator</span>
          </Link>
          <Link
            to="/claims/file"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] text-slate-200 border border-white/[0.08] text-sm"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Autonomous FNOL Claims Triage</span>
          </Link>
          <Link
            to="/portal"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] text-slate-200 border border-white/[0.08] text-sm"
          >
            <Lock className="w-4 h-4 text-[#fb6504]" />
            <span>Enterprise Client Portal</span>
          </Link>
          <Link
            to="/appetite"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] text-slate-200 border border-white/[0.08] text-sm"
          >
            <span>Underwriting Appetite Matrix</span>
          </Link>
        </div>
      )}
    </header>
  );
};
