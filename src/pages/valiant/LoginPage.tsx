import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  UserCheck, 
  KeyRound, 
  Sparkles, 
  CheckCircle2, 
  Globe, 
  Briefcase, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { useValiantStore } from '../../services/valiantStore';
import { ValiantNavbar } from '../../components/valiant/Navbar';
import { ValiantFooter } from '../../components/valiant/Footer';

export const ValiantLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('e.rostova@nexusquantum.io');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activePersona, setActivePersona] = useState<string>('elena');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/portal');
    }, 800);
  };

  const handlePersonaLogin = (personaKey: 'elena' | 'marcus' | 'alistair') => {
    setActivePersona(personaKey);
    setIsLoading(true);

    if (personaKey === 'elena') {
      setEmail('e.rostova@nexusquantum.io');
    } else if (personaKey === 'marcus') {
      setEmail('m.vance@valiantglobalrisk.com');
    } else {
      setEmail('a.sterling@lloyds-syndicate2003.com');
    }

    setTimeout(() => {
      setIsLoading(false);
      navigate('/portal');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col selection:bg-[#0284C7] selection:text-white">
      <ValiantNavbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#0284C7]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#6366F1]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full space-y-8 relative z-10">

        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#0369a1] flex items-center justify-center text-white shadow-[0_0_25px_-5px_rgba(2,132,199,0.5)] border border-white/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-xl font-extrabold text-white tracking-tight">VALIANT</div>
              <div className="text-[10px] font-mono text-[#38bdf8] font-bold tracking-wider">GLOBAL RISK PORTAL</div>
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-2">
            Enterprise Client & Broker Access
          </h2>
          <p className="text-xs text-slate-400">
            Secure single sign-on (SSO) and authenticated policy management for commercial clients, adjusters, and syndicates.
          </p>
        </div>

        {/* 1-Click Demo Personas */}
        <div className="p-4 rounded-2xl bg-[#0E131F] border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Test Personas (1-Click Login)</span>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handlePersonaLogin('elena')}
              className="w-full text-left p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-[#38bdf8] flex items-center gap-2">
                  <span>Elena Rostova</span>
                  <span className="px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 text-[10px] font-mono">Policyholder CRO</span>
                </div>
                <div className="text-[11px] text-slate-400">Nexus Quantum Dynamics ($17M Coverage In Force)</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
            </button>

            <button
              onClick={() => handlePersonaLogin('marcus')}
              className="w-full text-left p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-400 flex items-center gap-2">
                  <span>Marcus Vance</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono">Senior Adjuster</span>
                </div>
                <div className="text-[11px] text-slate-400">Valiant Claims Operations & FNOL Triage Desk</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
            </button>

            <button
              onClick={() => handlePersonaLogin('alistair')}
              className="w-full text-left p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-purple-400 flex items-center gap-2">
                  <span>Alistair Sterling</span>
                  <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400 text-[10px] font-mono">Underwriter</span>
                </div>
                <div className="text-[11px] text-slate-400">Lloyd's of London Specialty Syndicate 2003</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-white/[0.08]"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-[11px] font-mono uppercase">or authenticate via credentials</span>
          <div className="flex-grow border-t border-white/[0.08]"></div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleManualLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Corporate Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0E131F] border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#0284C7] focus:outline-none font-mono"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300">Password / Token</label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset token dispatched to authorized security contact."); }} className="text-[11px] text-[#38bdf8] hover:underline font-mono">
                Forgot token?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0E131F] border border-white/[0.1] rounded-xl pl-4 pr-10 py-2.5 text-xs text-white focus:border-[#0284C7] focus:outline-none font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0369a1] hover:from-[#0369a1] hover:to-[#0284C7] text-white font-bold text-xs shadow-lg shadow-sky-900/30 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="font-mono">Verifying SAML / 256-Bit Token...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Sign In to Valiant Portal</span>
              </>
            )}
          </button>
        </form>

        {/* Institutional Trust Seals */}
        <div className="pt-4 border-t border-white/[0.08] text-center space-y-2">
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>SOC2 TYPE II</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-sky-400" />
              <span>256-BIT TLS ENCRYPTED</span>
            </span>
          </div>
          <p className="text-[10px] text-slate-500">
            Authorized access only. All sessions logged to Lloyd’s Syndicate security audits.
          </p>
        </div>

        </div>
      </main>

      <ValiantFooter />
    </div>
  );
};
