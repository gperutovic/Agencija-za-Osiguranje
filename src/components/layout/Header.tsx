import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Car,
  Home,
  HeartPulse,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Shield,
  Phone,
  Sparkles,
  X,
  Menu,
  Calculator,
  ShieldCheck,
  Briefcase,
  Bell,
  Award,
  Headphones,
  Bot,
  FilePlus2,
  UserCheck,
  Building2,
  FileText,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { AGENCY_DETAILS, LICENSED_AGENTS } from '../../lib/content/insurance-data';
import { InsuranceCategory } from '../../lib/types';
import { useInsurtechStore } from '../../store/useInsurtechStore';

interface HeaderProps {
  onOpenQuote?: (category?: InsuranceCategory) => void;
  onOpenSavjetnik?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuote, onOpenSavjetnik }) => {
  /**
   * Collision-Free Mutual-Exclusion Menu Manager:
   * Only ONE menu/dropdown/drawer can be active at any time (`activeMenuId: string | null`).
   * Values: 'more-tools' | 'agent-switcher' | 'mobile-drawer' | null
   */
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [mobileSubMenuId, setMobileSubMenuId] = useState<string | null>(null);

  const { activeAgentId, setActiveAgentId, policies, claims, informativeOffers } = useInsurtechStore();
  const currentAgent = LICENSED_AGENTS.find((a) => a.id === activeAgentId) || LICENSED_AGENTS[0];

  const location = useLocation();
  const headerRef = useRef<HTMLDivElement>(null);

  // Automatically close any open menu on route change
  useEffect(() => {
    setActiveMenuId(null);
    setMobileSubMenuId(null);
  }, [location.pathname]);

  // Outside click closes any open desktop dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveMenuId((prev) => (prev === 'mobile-drawer' ? prev : null));
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (activeMenuId === 'mobile-drawer') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeMenuId]);

  const toggleMenu = (menuId: string) => {
    setActiveMenuId((prev) => (prev === menuId ? null : menuId));
  };

  const isPathActive = (paths: string[]) => paths.includes(location.pathname);

  const pendingOffersCount = informativeOffers.filter((o) => o.status !== 'prihvacena' && o.status !== 'odbijena').length;

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-subtle transition-all"
    >
      {/* Top Institutional Compliance & Dual Partner Strip */}
      <div className="bg-[#0F172A] text-slate-300 border-b border-slate-800 text-[11px] py-1.5 px-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#C21817] text-white font-mono font-bold text-[10px]">
              GENERALI PARTNER
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#1E293B] border border-slate-700 text-slate-100 font-mono font-bold text-[10px]">
              TOYOTA CENTAR ZAGREB
            </span>
            <span className="hidden md:inline text-slate-400 truncate">
              ŽIVOT d.o.o. za zastupanje u osiguranju &bull; Palmotićeva 76, Zagreb &bull; OIB: 14329077049
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
            <a
              href="tel:+385914501458"
              className="hidden sm:inline-flex items-center gap-1 text-white hover:text-red-300 font-semibold transition-colors"
            >
              <Phone className="w-3 h-3 text-[#C21817]" />
              <span>+385 91 450 1458</span>
            </a>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <Link to="/podsjetnik-isteka" className="text-amber-400 hover:text-amber-300 font-bold hidden lg:inline-flex items-center gap-1">
              <Bell className="w-3 h-3" />
              <span>Podsjetnik isteka</span>
            </Link>
            <span className="text-slate-700 hidden lg:inline">|</span>

            {/* Mutual-Exclusion Agent Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu('agent-switcher')}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                title="Aktivni licencirani zastupnik"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Zastupnik: {currentAgent.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {activeMenuId === 'agent-switcher' && (
                <div className="absolute right-0 mt-2 w-72 bg-white text-[#0F172A] rounded-2xl shadow-floating border border-[#E2E8F0] p-2.5 z-50 font-sans">
                  <div className="px-2.5 py-1.5 border-b border-slate-100 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                    Odabir licenciranog zastupnika
                  </div>
                  <div className="mt-1 space-y-1">
                    {LICENSED_AGENTS.map((agent) => {
                      const isSelected = agent.id === activeAgentId;
                      return (
                        <button
                          key={agent.id}
                          type="button"
                          onClick={() => {
                            setActiveAgentId(agent.id);
                            setActiveMenuId(null);
                          }}
                          className={`w-full text-left p-2 rounded-xl flex items-start gap-2.5 transition-colors cursor-pointer ${
                            isSelected ? 'bg-[#FEF2F2] border border-[#FECACA]' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div
                            className="w-7 h-7 rounded-lg text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5"
                            style={{ backgroundColor: agent.badgeColor }}
                          >
                            {agent.avatarInitials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-[#0F172A] flex items-center justify-between">
                              <span>{agent.name}</span>
                              {isSelected && (
                                <span className="text-[10px] font-mono text-[#C21817] font-bold">AKTIVAN</span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono truncate">{agent.email}</div>
                            <div className="text-[10px] text-slate-500 truncate">{agent.organization}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Collision-Free Navigation Bar (All 9 Core Platform Destinations) */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-[72px] gap-2">
          {/* 1. Brand Logo -> AGENCIJA ŽIVOT (/) */}
          <Link
            to="/"
            onClick={() => setActiveMenuId(null)}
            className="shrink-0 focus:outline-none rounded-xl"
            aria-label="AGENCIJA ŽIVOT - Početna stranica"
          >
            <BrandLogo variant="compact" theme="light" showBadge={false} />
          </Link>

          {/* 2. Desktop Navigation: 9 Core Destinations + Specijalni Alati Dropdown */}
          <nav
            className="hidden xl:flex items-center gap-0.5 text-[12.5px] font-semibold text-[#0F172A]"
            aria-label="Glavna navigacija"
          >
            {/* Destination 1: AGENCIJA ŽIVOT */}
            <Link
              to="/"
              className={`px-2.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                isPathActive(['/'])
                  ? 'bg-[#FEF2F2] text-[#C21817] font-bold border border-[#FECACA]'
                  : 'hover:bg-slate-100 text-slate-700 hover:text-[#0F172A]'
              }`}
            >
              AGENCIJA ŽIVOT
            </Link>

            {/* Destination 2: Toyota partnerstvo */}
            <Link
              to="/toyota-partnerstvo"
              className={`px-2.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                isPathActive(['/toyota-partnerstvo'])
                  ? 'bg-[#0F172A] text-white font-bold shadow-xs'
                  : 'hover:bg-slate-100 text-slate-700 hover:text-[#0F172A]'
              }`}
            >
              <Car className="w-3.5 h-3.5 text-[#C21817]" />
              <span>Toyota partnerstvo</span>
            </Link>

            {/* Destination 3: Zatraži ponudu */}
            <Link
              to="/zatrazi-ponudu"
              className={`px-2.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                isPathActive(['/zatrazi-ponudu'])
                  ? 'bg-[#C21817] text-white font-bold shadow-xs'
                  : 'hover:bg-[#FEF2F2] text-[#C21817] font-bold'
              }`}
            >
              <FilePlus2 className="w-3.5 h-3.5" />
              <span>Zatraži ponudu</span>
            </Link>

            {/* Destination 4: Prijava šteta */}
            <Link
              to="/prijava-stete"
              className={`px-2.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                isPathActive(['/prijava-stete', '/claims'])
                  ? 'bg-[#FEF2F2] text-[#C21817] font-bold border border-[#FECACA]'
                  : 'hover:bg-slate-100 text-slate-700 hover:text-[#0F172A]'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#C21817]" />
              <span>Prijava šteta</span>
            </Link>

            {/* Destination 5: AI Centar */}
            <Link
              to="/ai-centar"
              className={`px-2.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                isPathActive(['/ai-centar'])
                  ? 'bg-[#FEF2F2] text-[#C21817] font-bold border border-[#FECACA]'
                  : 'hover:bg-slate-100 text-slate-700 hover:text-[#0F172A]'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-[#C21817]" />
              <span>AI Centar</span>
            </Link>

            {/* Destination 6: Program vjernosti */}
            <Link
              to="/program-vjernosti"
              className={`px-2.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                isPathActive(['/program-vjernosti'])
                  ? 'bg-[#FEF2F2] text-[#C21817] font-bold border border-[#FECACA]'
                  : 'hover:bg-slate-100 text-slate-700 hover:text-[#0F172A]'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Program vjernosti</span>
            </Link>

            {/* Destination 7: Brza podrška */}
            <Link
              to="/brza-podrska"
              className={`px-2.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                isPathActive(['/brza-podrska'])
                  ? 'bg-[#FEF2F2] text-[#C21817] font-bold border border-[#FECACA]'
                  : 'hover:bg-slate-100 text-slate-700 hover:text-[#0F172A]'
              }`}
            >
              <Headphones className="w-3.5 h-3.5 text-slate-600" />
              <span>Brza podrška</span>
            </Link>

            {/* Mutual-Exclusion Dropdown for Preserved Specialized Calculators & Legal Pages */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu('more-tools')}
                aria-expanded={activeMenuId === 'more-tools'}
                className={`px-2 py-2 rounded-xl transition-all flex items-center gap-1 text-xs cursor-pointer ${
                  activeMenuId === 'more-tools'
                    ? 'bg-slate-100 text-[#0F172A] font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#0F172A]'
                }`}
              >
                <span>Kalkulatori</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    activeMenuId === 'more-tools' ? 'rotate-180 text-[#C21817]' : 'text-slate-400'
                  }`}
                />
              </button>

              {activeMenuId === 'more-tools' && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-floating border border-[#E2E8F0] p-3 z-50 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Specijalizirani moduli i izračuni
                  </div>
                  <Link
                    to="/auto-osiguranje"
                    className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 text-xs font-semibold text-[#0F172A]"
                  >
                    <Car className="w-4 h-4 text-[#C21817] shrink-0" />
                    <div>
                      <div>Auto osiguranje (AO &amp; Kasko)</div>
                      <div className="text-[10px] text-slate-500 font-normal">50% bonusa i izračun po kW</div>
                    </div>
                  </Link>
                  <Link
                    to="/dopunsko-zdravstveno"
                    className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 text-xs font-semibold text-[#0F172A]"
                  >
                    <HeartPulse className="w-4 h-4 text-[#C21817] shrink-0" />
                    <div>
                      <div>Dopunsko zdravstveno (HZZO 15 € vs Privatno)</div>
                      <div className="text-[10px] text-slate-500 font-normal">Usporedba s B-listom lijekova</div>
                    </div>
                  </Link>
                  <Link
                    to="/imovina"
                    className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 text-xs font-semibold text-[#0F172A]"
                  >
                    <Home className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div>Osiguranje imovine i potresa</div>
                      <div className="text-[10px] text-slate-500 font-normal">Stan, kuća i kuća za odmor</div>
                    </div>
                  </Link>
                  <Link
                    to="/kalkulator-prijepisa"
                    className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 text-xs font-semibold text-[#0F172A]"
                  >
                    <Calculator className="w-4 h-4 text-slate-600 shrink-0" />
                    <div>
                      <div>Kalkulator prijepisa vozila (NN 92/21)</div>
                      <div className="text-[10px] text-slate-500 font-normal">Službeni izračun upravne pristojbe</div>
                    </div>
                  </Link>
                  <Link
                    to="/podsjetnik-isteka"
                    className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 text-xs font-semibold text-[#0F172A]"
                  >
                    <Bell className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div>Podsjetnik na istek police</div>
                      <div className="text-[10px] text-slate-500 font-normal">Obavijest 30 dana prije isteka</div>
                    </div>
                  </Link>
                  <div className="border-t border-slate-100 pt-1 mt-1 flex items-center justify-between px-2.5 py-1.5 text-[11px]">
                    <Link to="/o-nama" className="text-slate-600 hover:text-[#C21817] font-semibold">
                      O nama
                    </Link>
                    <Link to="/prigovori" className="text-slate-600 hover:text-[#C21817] font-semibold">
                      Prigovori potrošača
                    </Link>
                    <Link to="/services" className="text-slate-600 hover:text-[#C21817] font-semibold">
                      Katalog
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* 3. Right Dual Portals: Destination 8 (Korisnički portal) & Destination 9 (Zastupnički portal) */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {/* Destination 8: Korisnički portal */}
            <Link
              to="/korisnicki-portal"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                isPathActive(['/korisnicki-portal', '/portal', '/portal/coi'])
                  ? 'bg-[#C21817] text-white border-[#C21817] shadow-crimson-glow'
                  : 'bg-[#FEF2F2] text-[#C21817] border-[#FECACA] hover:bg-[#C21817] hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Korisnički portal</span>
              {pendingOffersCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white text-[#C21817] font-extrabold">
                  {pendingOffersCount}
                </span>
              )}
            </Link>

            {/* Destination 9: Zastupnički portal */}
            <Link
              to="/zastupnicki-portal"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                isPathActive(['/zastupnicki-portal', '/admin'])
                  ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md'
                  : 'bg-[#0F172A] text-white border-[#0F172A] hover:bg-[#1E293B]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-red-400" />
              <span>Zastupnički portal</span>
            </Link>
          </div>

          {/* 4. Mobile & Tablet Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <Link
              to="/korisnicki-portal"
              className="px-2.5 py-1.5 rounded-lg bg-[#FEF2F2] text-[#C21817] border border-[#FECACA] text-xs font-bold flex items-center gap-1 lg:hidden"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Portal</span>
            </Link>
            <button
              type="button"
              onClick={() => toggleMenu('mobile-drawer')}
              className="p-2.5 rounded-xl bg-slate-100 border border-[#E2E8F0] text-[#0F172A] hover:bg-slate-200 transition-colors min-h-[42px] min-w-[42px] flex items-center justify-center cursor-pointer"
              aria-label="Otvori navigacijski izbornik"
            >
              {activeMenuId === 'mobile-drawer' ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Collision-Free Mobile & Tablet Slide-Out Navigation Drawer */}
      {activeMenuId === 'mobile-drawer' && (
        <div className="fixed inset-0 z-50 xl:hidden flex justify-end" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setActiveMenuId(null)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto border-l border-[#E2E8F0]">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <BrandLogo variant="compact" theme="light" showBadge={false} />
              <button
                type="button"
                onClick={() => setActiveMenuId(null)}
                className="p-2 rounded-xl text-slate-500 hover:text-[#0F172A] hover:bg-slate-200/60 transition-colors"
                aria-label="Zatvori izbornik"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-2 flex-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-2">
                9 Glavnih modula platforme
              </div>

              {[
                { path: '/', label: '1. AGENCIJA ŽIVOT (Početna & Kalkulator)', icon: ShieldCheck, accent: 'text-[#C21817]' },
                { path: '/toyota-partnerstvo', label: '2. Toyota partnerstvo (TCZ Hub)', icon: Car, accent: 'text-[#0F172A]' },
                { path: '/zatrazi-ponudu', label: '3. Zatraži ponudu (Višeproizvodni izračun)', icon: FilePlus2, accent: 'text-[#C21817]' },
                { path: '/prijava-stete', label: '4. Prijava šteta (Vođeni FNOL centar)', icon: AlertTriangle, accent: 'text-[#C21817]' },
                { path: '/ai-centar', label: '5. AI Centar (AI Agenti & Štit pokrića)', icon: Bot, accent: 'text-[#C21817]' },
                { path: '/program-vjernosti', label: '6. Program vjernosti (Silver / Gold / Platinum)', icon: Award, accent: 'text-amber-600' },
                { path: '/brza-podrska', label: '7. Brza podrška (24/7 Pomoć & Dokumenti)', icon: Headphones, accent: 'text-slate-700' },
                {
                  path: '/korisnicki-portal',
                  label: `8. Korisnički portal (${policies.length} polica / ${claims.length} šteta)`,
                  icon: Shield,
                  accent: 'text-[#C21817]',
                },
                {
                  path: '/zastupnicki-portal',
                  label: `9. Zastupnički portal (CRM — ${currentAgent.name})`,
                  icon: UserCheck,
                  accent: 'text-[#0F172A]',
                },
              ].map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setActiveMenuId(null)}
                    className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold border transition-all ${
                      active
                        ? 'bg-[#FEF2F2] text-[#C21817] border-[#FECACA]'
                        : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 shrink-0 ${item.accent}`} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                );
              })}

              {/* Single Mutual-Exclusion Sub-Accordion for Additional Tools */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setMobileSubMenuId((prev) => (prev === 'extra' ? null : 'extra'))}
                  className="w-full p-3 rounded-xl bg-slate-100 text-[#0F172A] text-xs font-bold flex items-center justify-between"
                >
                  <span>Dodatni kalkulatori i pravne stranice</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${mobileSubMenuId === 'extra' ? 'rotate-180' : ''}`}
                  />
                </button>
                {mobileSubMenuId === 'extra' && (
                  <div className="mt-1.5 space-y-1 pl-2 border-l-2 border-[#C21817]">
                    <Link
                      to="/auto-osiguranje"
                      onClick={() => setActiveMenuId(null)}
                      className="block p-2 text-xs font-semibold text-slate-700 hover:text-[#C21817]"
                    >
                      Auto osiguranje (AO &amp; Kasko)
                    </Link>
                    <Link
                      to="/dopunsko-zdravstveno"
                      onClick={() => setActiveMenuId(null)}
                      className="block p-2 text-xs font-semibold text-slate-700 hover:text-[#C21817]"
                    >
                      Dopunsko zdravstveno (HZZO 15 € vs Privatno)
                    </Link>
                    <Link
                      to="/imovina"
                      onClick={() => setActiveMenuId(null)}
                      className="block p-2 text-xs font-semibold text-slate-700 hover:text-[#C21817]"
                    >
                      Osiguranje imovine i potresa
                    </Link>
                    <Link
                      to="/kalkulator-prijepisa"
                      onClick={() => setActiveMenuId(null)}
                      className="block p-2 text-xs font-semibold text-slate-700 hover:text-[#C21817]"
                    >
                      Kalkulator prijepisa vozila (NN 92/21)
                    </Link>
                    <Link
                      to="/podsjetnik-isteka"
                      onClick={() => setActiveMenuId(null)}
                      className="block p-2 text-xs font-semibold text-slate-700 hover:text-[#C21817]"
                    >
                      Podsjetnik na istek police
                    </Link>
                    <Link
                      to="/prigovori"
                      onClick={() => setActiveMenuId(null)}
                      className="block p-2 text-xs font-semibold text-slate-700 hover:text-[#C21817]"
                    >
                      Prigovori potrošača
                    </Link>
                    <Link
                      to="/o-nama"
                      onClick={() => setActiveMenuId(null)}
                      className="block p-2 text-xs font-semibold text-slate-700 hover:text-[#C21817]"
                    >
                      O nama i impresum
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Hitni kontakt:</span>
                <a href="tel:+385914501458" className="font-mono font-bold text-[#C21817]">
                  +385 91 450 1458
                </a>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/zatrazi-ponudu"
                  onClick={() => setActiveMenuId(null)}
                  className="py-2.5 px-3 rounded-xl bg-[#C21817] text-white font-bold text-xs text-center"
                >
                  Zatraži ponudu
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMenuId(null);
                    if (onOpenSavjetnik) onOpenSavjetnik();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#0F172A] text-white font-bold text-xs flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-red-400" />
                  <span>AI Savjetnik</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
