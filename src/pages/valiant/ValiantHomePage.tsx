import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  Clock, 
  Zap, 
  Layers, 
  TrendingUp, 
  Lock, 
  CheckCircle2 
} from 'lucide-react';
import { ValiantNavbar } from '../../components/valiant/Navbar';
import { ValiantFooter } from '../../components/valiant/Footer';
import { UnderwritingConsoleCell } from '../../components/valiant/bento/UnderwritingConsoleCell';
import { CoiPreviewerCell } from '../../components/valiant/bento/CoiPreviewerCell';
import { FnolClaimsCell } from '../../components/valiant/bento/FnolClaimsCell';
import { AppetiteMatrixCell } from '../../components/valiant/bento/AppetiteMatrixCell';
import { SecurityTrustCell } from '../../components/valiant/bento/SecurityTrustCell';

export const ValiantHomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col selection:bg-[#0284C7] selection:text-white">
      <ValiantNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
          {/* Dual Ambient Glowing Lighting */}
          <div className="ambient-glow-cerulean" />
          <div className="ambient-glow-indigo right-10 top-20" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto space-y-6">
              {/* Header Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-[#38bdf8] backdrop-blur-md shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse" />
                <span className="uppercase tracking-widest text-[11px] font-bold">
                  AUTONOMOUS MULTI-CARRIER TRANSACTIONAL PLATFORM
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
                Enterprise Risk Architecture.{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#38bdf8] via-[#0284C7] to-[#6366F1]">
                  Underwritten in Minutes.
                </span>
              </h1>

              {/* Subhead */}
              <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
                Replace manual broker friction with institutional algorithmic risk underwriting, instant ACORD 25 certificates, and real-time carrier syndication.
              </p>

              {/* Quick Actions */}
              <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/quote"
                  className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-semibold text-sm text-white bg-gradient-to-r from-[#0284C7] to-[#0369a1] hover:from-[#0369a1] hover:to-[#0284C7] shadow-[0_0_35px_-5px_rgba(2,132,199,0.6)] border border-white/20 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Launch Quote & Instant Bind</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/portal/coi"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] transition-all"
                >
                  <span>Instant ACORD 25 Generator</span>
                </Link>
              </div>

              {/* Live Operational Telemetry Bar */}
              <div className="pt-10 max-w-5xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-2xl bg-[#0E131F]/80 border border-white/[0.08] backdrop-blur-xl shadow-2xl">
                  {/* Metric 1 */}
                  <div className="p-3 text-left">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 uppercase">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>Active Capacity</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-extrabold text-white font-mono tabular-nums mt-1">
                      $450M+
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                      <TrendingUp className="w-2.5 h-2.5" />
                      <span>Surplus Lines Deployed</span>
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="p-3 text-left border-l border-white/[0.06]">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 uppercase">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Mean FNOL Turnaround</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-extrabold text-white font-mono tabular-nums mt-1">
                      1.4 Hours
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      98.2% Auto-Triaged
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="p-3 text-left border-l border-white/[0.06]">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 uppercase">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Platform Uptime</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono tabular-nums mt-1">
                      99.99%
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      High-Availability SLA
                    </div>
                  </div>

                  {/* Metric 4 */}
                  <div className="p-3 text-left border-l border-white/[0.06]">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 uppercase">
                      <Zap className="w-3.5 h-3.5 text-[#6366F1]" />
                      <span>Algorithmic Bind</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-extrabold text-white font-mono tabular-nums mt-1">
                      &lt; 120s
                    </div>
                    <div className="text-[10px] text-[#38bdf8] font-mono mt-0.5">
                      Zero Manual Touch
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Responsive Bento Grid Section */}
        <section className="pb-24 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="vgr-pill bg-white/[0.04] text-slate-300 border-white/[0.08]">
                  OPERATIONAL ARCHITECTURE
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2">
                  Institutional Transactional Capabilities
                </h2>
              </div>
              <div className="text-xs font-mono text-slate-400">
                Connected to Lloyd's, Chubb, and AIG rating engines
              </div>
            </div>

            {/* Asymmetrical Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Cell 1: Underwriting Console (Span 8) */}
              <UnderwritingConsoleCell />

              {/* Cell 2: Certificate Previewer (Span 4) */}
              <CoiPreviewerCell />

              {/* Cell 3: FNOL Claims Triage (Span 4) */}
              <FnolClaimsCell />

              {/* Cell 4: Appetite Matrix (Span 4) */}
              <AppetiteMatrixCell />

              {/* Cell 5: Security & Compliance Badges (Span 4) */}
              <SecurityTrustCell />
            </div>
          </div>
        </section>

        {/* Carrier Syndicates Trust Marquee */}
        <section className="py-12 border-y border-white/[0.06] bg-slate-950/40 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500">
                Underwriting Syndicates & Global Carrier Partners
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center justify-items-center opacity-70 hover:opacity-100 transition-opacity">
              <div className="text-center font-bold text-slate-300 font-sans tracking-tight text-sm">
                CHUBB
                <div className="text-[10px] font-mono text-slate-500">A++ Superior</div>
              </div>
              <div className="text-center font-bold text-slate-300 font-sans tracking-tight text-sm">
                LLOYD'S
                <div className="text-[10px] font-mono text-slate-500">Syndicate 2003</div>
              </div>
              <div className="text-center font-bold text-slate-300 font-sans tracking-tight text-sm">
                AIG
                <div className="text-[10px] font-mono text-slate-500">Commercial Risk</div>
              </div>
              <div className="text-center font-bold text-slate-300 font-sans tracking-tight text-sm">
                TRAVELERS
                <div className="text-[10px] font-mono text-slate-500">Surety & Casualty</div>
              </div>
              <div className="text-center font-bold text-slate-300 font-sans tracking-tight text-sm">
                ZURICH
                <div className="text-[10px] font-mono text-slate-500">Global Corporate</div>
              </div>
              <div className="text-center font-bold text-slate-300 font-sans tracking-tight text-sm">
                MUNICH RE
                <div className="text-[10px] font-mono text-slate-500">Reinsurance Facultative</div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-20 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0E131F] via-[#0A0E18] to-[#07090E] border border-[#0284C7]/30 shadow-[0_20px_60px_-15px_rgba(2,132,199,0.3)] text-center space-y-6">
              <span className="vgr-pill bg-[#0284C7]/10 text-[#38bdf8] border-[#0284C7]/30">
                ZERO BROKER FRICTION
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Ready to Programmatically Secure Your Balance Sheet?
              </h2>
              <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
                Generate real-time quotes from top A-rated syndicates, review exclusions side-by-side, sign the digital binder, and issue your first ACORD 25 COI.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/quote"
                  className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#0284C7] to-[#0369a1] text-white font-semibold text-sm shadow-[0_0_30px_-5px_rgba(2,132,199,0.6)] hover:scale-105 transition-all"
                >
                  <span>Start Quote Funnel</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/portal"
                  className="px-8 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.1] text-sm font-semibold transition-all"
                >
                  Access Enterprise Portal
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ValiantFooter />
    </div>
  );
};

