import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  DollarSign,
  HelpCircle,
  MessageSquare,
  PlusCircle,
  User,
  Menu,
  X,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { jobDataService } from '../../services/jobDataService';

export const JobNavbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const profile = jobDataService.getCandidateProfile();

  const navLinks = [
    { label: 'Poslovi', path: '/jobs', icon: Briefcase },
    { label: 'Tvrtke & Recenzije', path: '/companies', icon: Building2 },
    { label: 'Plaće & Leveling', path: '/salaries', icon: DollarSign },
    { label: 'Intervjui', path: '/interviews', icon: HelpCircle },
    { label: 'Zajednica (Work Talk)', path: '/community', icon: MessageSquare },
  ];

  const isActive = (path: string) => {
    if (path === '/jobs' && (location.pathname === '/' || location.pathname === '/jobs')) return true;
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#06080c]/90 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/jobs" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fb6504] to-amber-500 p-0.5 shadow-lg shadow-[#fb6504]/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-[#0a0d16] rounded-[10px] flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-[#ff7b1a]" />
              </div>
            </div>
            <div>
              <span className="text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                KARIJERE<span className="text-[#ff7b1a]">HUB</span>
              </span>
              <p className="text-[10px] font-mono text-slate-400 tracking-wider uppercase -mt-0.5">
                Glassdoor Model • Radna Transparentnost
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#fb6504]/15 text-[#ff7b1a] border border-[#fb6504]/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/post-a-job"
              className="px-4 py-2 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white text-xs font-extrabold shadow-lg shadow-[#fb6504]/25 hover:shadow-[#fb6504]/40 transition-all flex items-center gap-1.5 hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Objavi Oglas</span>
            </Link>

            <Link
              to="/profile"
              className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-bold text-slate-200 hover:text-white transition flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-[11px] font-bold">
                IK
              </div>
              <span className="max-w-[100px] truncate">{profile.name.split(' ')[0]}</span>
              {profile.appliedJobIds.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#fb6504] text-[9px] font-black text-white flex items-center justify-center">
                  {profile.appliedJobIds.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/post-a-job"
              className="px-2.5 py-1.5 rounded-lg bg-[#fb6504] text-white text-xs font-bold sm:hidden"
            >
              Objavi
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl bg-white/[0.05] text-slate-300 hover:text-white border border-white/[0.08]"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0a0d16] border-b border-white/[0.1] px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold ${
                  active
                    ? 'bg-[#fb6504]/15 text-[#ff7b1a] border border-[#fb6504]/30'
                    : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
            <Link
              to="/post-a-job"
              onClick={() => setMobileOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#fb6504] text-white text-xs font-bold text-center flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Objavi Posao (Za Poslodavce)
            </Link>
            <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className="w-full py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-xs font-bold text-center flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              Moj Profil & Prijave ({profile.appliedJobIds.length})
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
