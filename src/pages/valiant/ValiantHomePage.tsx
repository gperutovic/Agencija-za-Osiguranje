import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Layers, 
  TrendingUp, 
  Lock, 
  CheckCircle2, 
  FileText, 
  AlertTriangle, 
  Building2, 
  Briefcase, 
  Award, 
  Download,
  Copy,
  Check,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { ValiantNavbar } from '../../components/valiant/Navbar';
import { ValiantFooter } from '../../components/valiant/Footer';
import { UnderwritingConsoleCell } from '../../components/valiant/bento/UnderwritingConsoleCell';
import { CoiPreviewerCell } from '../../components/valiant/bento/CoiPreviewerCell';
import { FnolClaimsCell } from '../../components/valiant/bento/FnolClaimsCell';
import { AppetiteMatrixCell } from '../../components/valiant/bento/AppetiteMatrixCell';
import { SecurityTrustCell } from '../../components/valiant/bento/SecurityTrustCell';

export const ValiantHomePage: React.FC = () => {
  // RankRush typewriter text rotation for target sectors
  const sectors = [
    'Cold-Chain & Warehousing',
    'SaaS & Cloud Platforms',
    'Life Sciences & MedTech',
    'Precision Manufacturing',
    'FinTech & Payment Rails',
  ];
  const [currentSectorIndex, setCurrentSectorIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSectorIndex((prev) => (prev + 1) % sectors.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#06080c] text-slate-100 flex flex-col selection:bg-[#fb6504] selection:text-white">
      <ValiantNavbar />

      <main className="flex-1">
        
        {/* ========================================================================= */}
        {/* SECTION 1: RANKRUSH-STYLE SPLIT-2 HERO WITH LIVE UNDERWRITING DASHBOARD   */}
        {/* ========================================================================= */}
        <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
          {/* Ambient Radial Lighting Overlay */}
          <div className="ambient-glow-orange" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Copy & CTAs (Span 7) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Eyebrow */}
                <div className="eyebrow">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#fb6504]" />
                  <span>Commercial Risk & Digital Brokerage</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                  Commercial Insurance for modern enterprises in{' '}
                  <span className="rr-orange block sm:inline mt-1 sm:mt-0 transition-all duration-300">
                    {sectors[currentSectorIndex]}.
                  </span>
                </h1>

                {/* Subheading */}
                <p className="text-slate-300 text-sm sm:text-base sm:leading-relaxed max-w-2xl">
                  Automate multi-carrier quoting across Chubb, Travelers, and Lloyd’s of London. Generate cryptographically verified ACORD 25 certificates in 60 seconds, triage FNOL claims autonomously, and manage in-force risk through a unified digital console.
                </p>

                {/* Dual Buttons (Exact RankRush Button Row) */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <Link
                    to="/quote"
                    className="rr-btn rr-btn--primary text-sm py-3 px-6 shadow-xl shadow-orange-950/40"
                  >
                    <span>Start Multi-Carrier Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/appetite"
                    className="rr-btn rr-btn--ghost text-sm py-3 px-5"
                  >
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span>View Carrier Appetite</span>
                  </Link>
                </div>

                {/* Trust / Feature Strip (Exact RankRush Pill Card) */}
                <div className="inline-flex flex-wrap items-center gap-3 p-2.5 px-4 rounded-xl bg-[#0a0d16]/90 border border-white/[0.06] backdrop-blur-md">
                  <span className="rr-pill rr-pill--success">
                    <span className="rr-pill__dot" />
                    A++ CAPACITY
                  </span>
                  <span className="rr-label text-slate-400">INSTANT ACORD 25</span>
                  <span className="text-slate-600 font-mono">•</span>
                  <span className="rr-label text-slate-400">12 COMMERCIAL LINES</span>
                  <span className="text-slate-600 font-mono">•</span>
                  <span className="rr-label text-slate-400">&lt;120s BIND</span>
                </div>

              </div>

              {/* Right Column: Live Interactive Commercial Policy Mockup (Span 5) */}
              <div className="lg:col-span-5">
                <div className="rr-surface-card p-5 sm:p-6 shadow-2xl border border-white/[0.08] space-y-4 relative overflow-hidden">
                  
                  {/* Card Header: Enterprise Account Telemetry */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                          Active Account In-Force
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5">
                        Vanguard Cold-Chain Solutions
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Total Aggregate</span>
                      <div className="text-sm font-mono font-black text-[#fb6504]">
                        $19,000,000
                      </div>
                    </div>
                  </div>

                  {/* Active Policy Rows (Analogous to RankRush Live Keyword Tracking Rows) */}
                  <div className="space-y-2.5">
                    
                    {/* Row 1: Commercial General Liability */}
                    <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] space-y-1.5 hover:border-white/[0.12] transition-colors">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#fb6504]" />
                          <span className="font-bold text-white">Commercial General Liability</span>
                        </div>
                        <span className="rr-pill rr-pill--success font-mono text-[9px]">ACTIVE</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>Chubb Federal (NAIC #22667)</span>
                        <span className="text-slate-200 font-bold">$2M / $1M Limit</span>
                      </div>
                    </div>

                    {/* Row 2: Commercial Property & Interruption */}
                    <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] space-y-1.5 hover:border-white/[0.12] transition-colors">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span className="font-bold text-white">Property & Interruption</span>
                        </div>
                        <span className="rr-pill rr-pill--warning font-mono text-[9px]">RENEWAL 34D</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>Travelers Property Casualty</span>
                        <span className="text-slate-200 font-bold">$12M Limit</span>
                      </div>
                    </div>

                    {/* Row 3: Tech E&O & Cyber */}
                    <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] space-y-1.5 hover:border-white/[0.12] transition-colors">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                          <span className="font-bold text-white">Technology E&O & Cyber</span>
                        </div>
                        <span className="rr-pill rr-pill--violet font-mono text-[9px]">ACTIVE</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>Lloyd’s Syndicate 2003</span>
                        <span className="text-slate-200 font-bold">$5M Limit</span>
                      </div>
                    </div>

                  </div>

                  {/* Mockup Action Footer */}
                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                      <FileText className="w-3.5 h-3.5 text-[#fb6504]" />
                      <span>Last COI: Prologis Hub LLC</span>
                    </div>

                    <Link
                      to="/portal"
                      className="text-xs font-semibold text-[#fb6504] hover:text-[#ff7b1a] flex items-center gap-1 font-mono"
                    >
                      <span>Open Portal</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CARRIER SYNDICATE TICKER STRIP                                            */}
        {/* ========================================================================= */}
        <section className="py-6 border-y border-white/[0.06] bg-[#080c14]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2 shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#fb6504]" />
                <span>Underwriting Syndicates & Admitted Paper:</span>
              </div>
              <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-mono text-slate-300 font-medium">
                <span className="hover:text-white transition-colors">CHUBB GLOBAL (NAIC 22667)</span>
                <span className="text-slate-600">•</span>
                <span className="hover:text-white transition-colors">TRAVELERS PROPERTY (NAIC 25674)</span>
                <span className="text-slate-600">•</span>
                <span className="hover:text-white transition-colors">LLOYD’S SYNDICATES 2003 / 1882</span>
                <span className="text-slate-600">•</span>
                <span className="hover:text-white transition-colors">ZURICH AMERICAN (NAIC 16535)</span>
                <span className="text-slate-600">•</span>
                <span className="hover:text-white transition-colors">AIG COMMERCIAL (NAIC 19445)</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: THE 4-ENGINE UNDERWRITING LOOP (RANKRUSH SEQUENTIAL ARCH)      */}
        {/* ========================================================================= */}
        <section className="py-20 sm:py-28 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="eyebrow justify-center">
                <span>The Underwriting Loop · Four Core Engines</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                From submission to certificate in under 120 seconds.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Legacy commercial brokerages rely on paper ACORD forms and multi-day carrier back-and-forths. Valiant Global Risk connects programmatic rating algorithms directly with syndicate capacity.
              </p>
            </div>

            {/* Bento Grid Architecture */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Cell 1: Underwriting Rating Console (Span 8) */}
              <div className="lg:col-span-8">
                <UnderwritingConsoleCell />
              </div>

              {/* Cell 2: ACORD 25 Certificate Engine (Span 4) */}
              <div className="lg:col-span-4">
                <CoiPreviewerCell />
              </div>

              {/* Cell 3: FNOL Claims Triage (Span 4) */}
              <div className="lg:col-span-4">
                <FnolClaimsCell />
              </div>

              {/* Cell 4: Appetite Matrix (Span 4) */}
              <div className="lg:col-span-4">
                <AppetiteMatrixCell />
              </div>

              {/* Cell 5: Regulatory Compliance & Trust (Span 4) */}
              <div className="lg:col-span-4">
                <SecurityTrustCell />
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: INSTITUTIONAL PERFORMANCE TELEMETRY                            */}
        {/* ========================================================================= */}
        <section className="py-16 border-t border-white/[0.06] bg-[#080c14]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              
              <div className="space-y-1.5">
                <div className="text-xs font-mono text-slate-400 uppercase">Syndicated Capacity</div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                  $450M+
                </div>
                <p className="text-[11px] text-slate-400">
                  Primary and layered casualty capacity via Lloyd’s Coverholder binding slips.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-mono text-slate-400 uppercase">Average Bind Turnaround</div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-[#fb6504] tracking-tight">
                  1.4 Hours
                </div>
                <p className="text-[11px] text-slate-400">
                  From intake submission to fully executed digital binder delivery.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-mono text-slate-400 uppercase">Automated Auto-Bind Rate</div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                  84.2%
                </div>
                <p className="text-[11px] text-slate-400">
                  Of commercial submissions bound without manual underwriter intervention.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-mono text-slate-400 uppercase">Certificates Dispatched</div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                  24,000+
                </div>
                <p className="text-[11px] text-slate-400">
                  ACORD 25 certificates generated with SHA-256 cryptographic proof stamps.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: FINAL CALL TO ACTION BANNER (RANKRUSH FINALE)                  */}
        {/* ========================================================================= */}
        <section className="py-20 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <div className="eyebrow justify-center">
              <span>Ready for Modern Commercial Risk Architecture?</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Bind your enterprise policy today with zero paperwork.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Explore comparative rates across Tier-1 carriers, customize liability deductibles, and download your legally executed policy binder instantly.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/quote"
                className="rr-btn rr-btn--primary text-sm py-3 px-6 shadow-xl shadow-orange-950/50"
              >
                <span>Start Multi-Carrier Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/portal/coi"
                className="rr-btn rr-btn--ghost text-sm py-3 px-5"
              >
                <span>Generate ACORD 25</span>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <ValiantFooter />
    </div>
  );
};
