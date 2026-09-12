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
import { firestoreService } from '../../api/firestoreService';

export const ValiantLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('m.vance@vanguardlogistics.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activePersona, setActivePersona] = useState<string>('marcus');

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await firestoreService.saveUserProfile({
      uid: `user-${Date.now()}`,
      email,
      displayName: email.split('@')[0],
      role: 'policyholder',
      phone: '+385 91 234 5678',
      createdAt: new Date().toISOString(),
    });
    setIsLoading(false);
    navigate('/portal');
  };

  const handlePersonaLogin = async (personaKey: 'marcus' | 'sarah' | 'david') => {
    setActivePersona(personaKey);
    setIsLoading(true);

    let selectedEmail = 'm.vance@vanguardlogistics.com';
    let displayName = 'Robert Vance (Policyholder)';
    let role: 'policyholder' | 'broker' | 'admin' = 'policyholder';
    let uid = 'user-policyholder-1';

    if (personaKey === 'marcus') {
      selectedEmail = 'm.vance@vanguardlogistics.com';
      displayName = 'Robert Vance (VP of Risk)';
      role = 'policyholder';
      uid = 'user-policyholder-1';
    } else if (personaKey === 'sarah') {
      selectedEmail = 's.lin@chubb-commercial.com';
      displayName = 'Sarah Lin, CPCU (Lead Underwriter)';
      role = 'broker';
      uid = 'user-broker-1';
    } else {
      selectedEmail = 'd.sterling@lloyds-syndicate2003.com';
      displayName = 'David Sterling (Senior Adjuster)';
      role = 'broker';
      uid = 'user-adjuster-1';
    }

    setEmail(selectedEmail);

    await firestoreService.saveUserProfile({
      uid,
      email: selectedEmail,
      displayName,
      role,
      phone: '+385 1 4800 120',
      createdAt: new Date().toISOString(),
    });

    setIsLoading(false);
    navigate('/portal');
  };

  return (
    <div className="min-h-screen bg-[#06080c] text-slate-100 flex flex-col selection:bg-[#fb6504] selection:text-white">
      <ValiantNavbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#fb6504]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#fb6504]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full space-y-6 relative z-10">

        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-[#fb6504] flex items-center justify-center text-white shadow-[0_0_30px_-5px_rgba(251,101,4,0.4)] border border-white/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-xl font-extrabold text-white tracking-tight">VALIANT</div>
              <div className="text-[10px] font-mono text-[#fb6504] font-bold tracking-wider">GLOBAL RISK PORTAL</div>
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-2">
            Enterprise Commercial Portal Access
          </h2>
          <p className="text-xs text-slate-400">
            Secure single sign-on (SSO) and authenticated policy management for commercial clients, brokers, and risk managers.
          </p>
        </div>

        {/* Card Surface */}
        <div className="rr-surface-card p-6 sm:p-8 rounded-2xl space-y-6">
          {/* 1-Click Demo Personas */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#fb6504]" />
                <span>Verified Test Personas (1-Click Login)</span>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handlePersonaLogin('marcus')}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group ${
                  activePersona === 'marcus' 
                    ? 'bg-[#fb6504]/10 border border-[#fb6504]/40' 
                    : 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06]'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[#fb6504] flex items-center gap-2">
                    <span>Marcus Vance</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#fb6504]/15 text-[#fb6504] text-[10px] font-mono font-bold">Policyholder VP Risk</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Vanguard Logistics LLC ($45M In-Force Exposure)</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#fb6504] transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => handlePersonaLogin('sarah')}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group ${
                  activePersona === 'sarah' 
                    ? 'bg-[#fb6504]/10 border border-[#fb6504]/40' 
                    : 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06]'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[#fb6504] flex items-center gap-2">
                    <span>Sarah Lin, CPCU</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold">Senior Underwriter</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Chubb Commercial Lines Underwriting Desk</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#fb6504] transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => handlePersonaLogin('david')}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group ${
                  activePersona === 'david' 
                    ? 'bg-[#fb6504]/10 border border-[#fb6504]/40' 
                    : 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06]'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[#fb6504] flex items-center gap-2">
                    <span>David Sterling, ACII</span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 text-[10px] font-mono font-bold">Coverholder Adjuster</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Lloyd's Syndicate 2003 Claims Desk</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#fb6504] transition-colors" />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-white/[0.08]"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-[11px] font-mono uppercase tracking-wider">or corporate sso credentials</span>
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
                className="w-full bg-[#0c101a] border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#fb6504] focus:outline-none font-mono transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-300">Password / Access Token</label>
                <a 
                  href="#forgot" 
                  onClick={(e) => { e.preventDefault(); alert("Single Sign-On (SSO) magic link dispatched to registered corporate email address."); }} 
                  className="text-[11px] text-[#fb6504] hover:underline font-mono"
                >
                  Forgot token?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0c101a] border border-white/[0.1] rounded-xl pl-4 pr-10 py-2.5 text-xs text-white focus:border-[#fb6504] focus:outline-none font-mono transition-colors"
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
              className="rr-btn--primary w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20"
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
                <Lock className="w-3 h-3 text-[#10B981]" />
                <span>SOC2 TYPE II</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#fb6504]" />
                <span>256-BIT TLS ENCRYPTED</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>ACORD 25 COMPLIANT</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-500">
              Authorized commercial policyholders and appointed brokers only. All access monitored under Lloyd’s Syndicate security audits.
            </p>
          </div>
        </div>

        </div>
      </main>

      <ValiantFooter />
    </div>
  );
};
