import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from '../common/Button';
import {
  Shield,
  Calculator,
  AlertTriangle,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Calendar,
  Briefcase,
  HelpCircle,
  Phone,
} from 'lucide-react';
import { UserProfile } from '../../types/database';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, role, logout, switchDemoRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [personaMenuOpen, setPersonaMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handlePersonaSwitch = (newRole: UserProfile['role']) => {
    switchDemoRole(newRole);
    setPersonaMenuOpen(false);
    if (newRole === 'policyholder') navigate('/portal');
    else navigate('/admin');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#06080c]/90 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#fb6504] to-[#ff7b1a] flex items-center justify-center text-white font-black text-2xl shadow-[0_0_20px_rgba(251,101,4,0.4)] group-hover:scale-105 transition-transform">
              Ž
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white group-hover:text-[#fb6504] transition-colors leading-tight">
                AGENCIJA ŽIVOT
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#fb6504] leading-none">
                Generali Partner &bull; Zagreb
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1.5">
            <Link
              to="/services"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive('/services')
                  ? 'bg-white/[0.08] text-[#ff7b1a] border border-white/[0.1]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {t('nav.services')}
            </Link>

            <Link
              to="/calculator"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive('/calculator')
                  ? 'bg-[#fb6504]/15 text-[#ff7b1a] border border-[#fb6504]/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Calculator className="w-4 h-4 text-[#fb6504]" />
              <span>{t('nav.calculator')}</span>
            </Link>

            <Link
              to="/claims"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive('/claims')
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>{t('nav.claims')}</span>
            </Link>

            <Link
              to="/about"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive('/about')
                  ? 'bg-white/[0.08] text-[#ff7b1a] border border-white/[0.1]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {t('nav.about')}
            </Link>

            <Link
              to="/contact"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive('/contact')
                  ? 'bg-white/[0.08] text-[#ff7b1a] border border-white/[0.1]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {t('nav.contact')}
            </Link>
          </nav>

          {/* Right Action Tools & Portals */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />

            {/* Quick Calculator CTA */}
            <Link to="/calculator">
              <Button
                variant="primary"
                size="sm"
                className="font-bold shadow-[0_0_20px_-3px_rgba(251,101,4,0.4)]"
              >
                Izračunaj premiju
              </Button>
            </Link>

            {/* Portal Action Link */}
            <Link to="/portal">
              <Button
                variant={isActive('/portal') ? 'secondary' : 'outline'}
                size="sm"
                leftIcon={<Shield className="w-3.5 h-3.5 text-[#fb6504]" />}
                className="font-bold"
              >
                Moj Život Portal
              </Button>
            </Link>

            {/* Broker CRM Link */}
            {(role === 'broker' || role === 'admin') && (
              <Link to="/admin">
                <Button
                  variant={isActive('/admin') ? 'secondary' : 'ghost'}
                  size="sm"
                  leftIcon={<LayoutDashboard className="w-3.5 h-3.5 text-teal-400" />}
                  className="font-bold text-slate-300 hover:text-white"
                >
                  Broker CRM
                </Button>
              </Link>
            )}

            {/* 1-Click Test Persona Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setPersonaMenuOpen(!personaMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-bold transition-all border border-white/[0.08]"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#fb6504] to-[#ff7b1a] text-white flex items-center justify-center text-[10px] font-black">
                  {user?.displayName.charAt(0) || 'U'}
                </div>
                <div className="text-left leading-tight hidden sm:block">
                  <div className="text-[11px] font-black truncate max-w-[100px] text-white">
                    {user?.displayName || 'Gost'}
                  </div>
                  <div className="text-[9px] uppercase font-mono tracking-wider text-slate-400 font-semibold">
                    {role || 'prijava'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {personaMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0a0d16] p-2 text-white shadow-2xl border border-white/[0.12] z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl"
                  onClick={() => setPersonaMenuOpen(false)}
                >
                  <div className="px-3 py-2 text-[10px] font-mono font-bold text-[#fb6504] uppercase tracking-wider border-b border-white/[0.08]">
                    Test Personas (RBAC Simulacija)
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePersonaSwitch('policyholder')}
                    className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      role === 'policyholder'
                        ? 'bg-white/[0.08] text-[#ff7b1a] font-bold border border-[#fb6504]/30'
                        : 'hover:bg-white/[0.04] text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-white">Ana Horvat</div>
                      <div className="text-[10px] text-slate-400">Ugovaratelj (Klijentski portal)</div>
                    </div>
                    {role === 'policyholder' && <span className="text-[#fb6504] font-black">✓</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePersonaSwitch('broker')}
                    className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      role === 'broker'
                        ? 'bg-white/[0.08] text-[#ff7b1a] font-bold border border-[#fb6504]/30'
                        : 'hover:bg-white/[0.04] text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-white">Marija Šarić</div>
                      <div className="text-[10px] text-slate-400">Ovlašteni agent (Broker CRM)</div>
                    </div>
                    {role === 'broker' && <span className="text-[#fb6504] font-black">✓</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePersonaSwitch('admin')}
                    className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      role === 'admin'
                        ? 'bg-white/[0.08] text-[#ff7b1a] font-bold border border-[#fb6504]/30'
                        : 'hover:bg-white/[0.04] text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-white">Ivan Radić</div>
                      <div className="text-[10px] text-slate-400">Direktor Agencije (Admin audit)</div>
                    </div>
                    {role === 'admin' && <span className="text-[#fb6504] font-black">✓</span>}
                  </button>

                  <div className="pt-2 mt-1 border-t border-white/[0.08] flex items-center justify-between px-2 text-[11px]">
                    <Link to="/login" className="text-[#fb6504] font-bold hover:underline">
                      Prijava s lozinkom
                    </Link>
                    {user && (
                      <button
                        onClick={logout}
                        className="text-rose-400 font-bold flex items-center gap-1 hover:underline"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Odjava</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white bg-white/[0.04] border border-white/[0.08]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.08] bg-[#06080c]/98 backdrop-blur-2xl px-4 py-6 flex flex-col gap-3 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-200 hover:bg-white/[0.05] flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4 text-[#fb6504]" />
            <span>{t('nav.services')}</span>
          </Link>

          <Link
            to="/calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-[#ff7b1a] bg-[#fb6504]/10 border border-[#fb6504]/20 flex items-center gap-2"
          >
            <Calculator className="w-4 h-4 text-[#fb6504]" />
            <span>{t('nav.calculator')}</span>
          </Link>

          <Link
            to="/claims"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{t('nav.claims')}</span>
          </Link>

          <Link
            to="/portal"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-200 bg-white/[0.04] border border-white/[0.08] flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-[#fb6504]" />
            <span>Klijentski portal &bdquo;Moj Život&ldquo;</span>
          </Link>

          {(role === 'broker' || role === 'admin') && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-teal-400" />
              <span>Broker CRM & Back-Office</span>
            </Link>
          )}

          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/[0.05] flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>{t('nav.about')}</span>
          </Link>

          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/[0.05] flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-slate-400" />
            <span>{t('nav.contact')}</span>
          </Link>

          <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
            <div className="text-[11px] font-mono font-bold text-[#fb6504] uppercase tracking-wider">
              Brza uloga za testiranje:
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => handlePersonaSwitch('policyholder')}
                className="p-2 rounded-lg border border-white/[0.08] bg-white/[0.04] text-white font-bold text-center hover:bg-white/[0.08]"
              >
                Klijent
              </button>
              <button
                onClick={() => handlePersonaSwitch('broker')}
                className="p-2 rounded-lg border border-[#fb6504]/30 bg-[#fb6504]/15 text-[#ff7b1a] font-bold text-center"
              >
                Broker
              </button>
              <button
                onClick={() => handlePersonaSwitch('admin')}
                className="p-2 rounded-lg border border-teal-500/30 bg-teal-500/15 text-teal-300 font-bold text-center"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
