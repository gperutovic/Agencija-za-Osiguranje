import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Car,
  HeartPulse,
  Home,
  Calculator,
  Layers,
  Building2,
  Scale,
  FileText,
  MapPin,
  FileWarning,
  User,
  Phone,
  Menu,
  X,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useAuth } from '../../context/AuthContext';

export interface HeaderProps {
  onOpenSavjetnik?: () => void;
}

interface DropdownItem {
  to: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const INSURANCE_VEHICLE_ITEMS: DropdownItem[] = [
  {
    to: '/auto-osiguranje',
    label: 'Auto i kasko osiguranje',
    description: 'Obvezno AO, puni kasko i program Toyota Centar Zagreb VIP Kasko',
    icon: Car,
  },
  {
    to: '/kalkulator-prijepisa',
    label: 'Kalkulator prijepisa vozila',
    description: 'Izračun upravne pristojbe prema snazi (kW) i starosti (NN 92/21)',
    icon: Calculator,
  },
];

const INSURANCE_PERSONAL_ITEMS: DropdownItem[] = [
  {
    to: '/dopunsko-zdravstveno',
    label: 'Dopunsko zdravstveno osiguranje',
    description: 'Usporedba s HZZO policom (15,00 €), B-lista lijekova i specijalistički pregledi',
    icon: HeartPulse,
  },
  {
    to: '/imovina',
    label: 'Osiguranje doma i potresa',
    description: 'Zaštita stana, obiteljske kuće, stvari kućanstva i pokriće potresa',
    icon: Home,
  },
  {
    to: '/services',
    label: 'Svi programi osiguranja',
    description: 'Cjeloviti pregled životnih, imovinskih i poslovnih polica',
    icon: Layers,
  },
];

const AGENCY_ITEMS: DropdownItem[] = [
  {
    to: '/o-nama',
    label: 'O agenciji i partnerstva',
    description: 'Generali osiguranje d.d. i Toyota Centar Zagreb',
    icon: Building2,
  },
  {
    to: '/o-nama-pravno',
    label: 'Pravne obavijesti i HANFA',
    description: 'Regulatorni podaci, IDD direktiva i zaštita privatnosti',
    icon: Scale,
  },
  {
    to: '/prigovori',
    label: 'Knjiga prigovora potrošača',
    description: 'Službeni postupak prigovora sukladno čl. 401. Zakona o osiguranju',
    icon: FileText,
  },
  {
    to: '/contact',
    label: 'Kontakt i poslovnica',
    description: 'Palmotićeva 76, Zagreb • 01 4800 120',
    icon: MapPin,
  },
];

export const Header: React.FC<HeaderProps> = ({ onOpenSavjetnik }) => {
  const [openDropdown, setOpenDropdown] = useState<'osiguranja' | 'agencija' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<'osiguranja' | 'agencija' | null>('osiguranja');
  const navRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user: userProfile } = useAuth();

  // Close menus on route change
  useEffect(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close desktop dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isActiveGroup = (paths: string[]) => paths.some((p) => location.pathname.startsWith(p));

  const handlePrimaryCta = () => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    if (onOpenSavjetnik) {
      onOpenSavjetnik();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[72px] flex items-center justify-between gap-4">
          {/* Left: Bespoke Institutional Brand Logo */}
          <Link
            to="/"
            className="flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2942] rounded-lg py-1"
            aria-label="Agencija Život - Početna stranica"
          >
            <BrandLogo variant="light" size="md" showSubtitle />
          </Link>

          {/* Center: Desktop Structured Navigation */}
          <nav
            ref={navRef}
            className="hidden lg:flex items-center gap-1"
            aria-label="Glavna navigacija"
          >
            {/* Dropdown 1: Osiguranja */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'osiguranja' ? null : 'osiguranja')}
                aria-expanded={openDropdown === 'osiguranja'}
                aria-haspopup="true"
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  openDropdown === 'osiguranja' ||
                  isActiveGroup(['/auto-osiguranje', '/dopunsko-zdravstveno', '/imovina', '/kalkulator-prijepisa', '/services'])
                    ? 'text-[#0F2942] bg-slate-100/90'
                    : 'text-slate-700 hover:text-[#0F2942] hover:bg-slate-50'
                }`}
              >
                <span>Osiguranja</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-150 ${
                    openDropdown === 'osiguranja' ? 'rotate-180 text-[#0F2942]' : ''
                  }`}
                />
              </button>

              {openDropdown === 'osiguranja' && (
                <div
                  role="menu"
                  className="absolute left-0 top-full mt-2 w-[620px] bg-white rounded-xl border border-slate-200 shadow-lg p-5 grid grid-cols-2 gap-6 z-50"
                >
                  <div>
                    <p className="px-2.5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Vozila i promet
                    </p>
                    <div className="space-y-1">
                      {INSURANCE_VEHICLE_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            role="menuitem"
                            className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#0F2942] text-slate-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-900 group-hover:text-[#0F2942]">
                                {item.label}
                              </div>
                              <p className="text-xs text-slate-500 leading-snug mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="px-2.5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Zdravlje, dom i ostalo
                    </p>
                    <div className="space-y-1">
                      {INSURANCE_PERSONAL_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            role="menuitem"
                            className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#0F2942] text-slate-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-900 group-hover:text-[#0F2942]">
                                {item.label}
                              </div>
                              <p className="text-xs text-slate-500 leading-snug mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Link: Prijava štete */}
            <Link
              to="/prijava-stete"
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/prijava-stete'
                  ? 'text-[#B91C1C] bg-red-50/80'
                  : 'text-slate-700 hover:text-[#0F2942] hover:bg-slate-50'
              }`}
            >
              <FileWarning className="w-4 h-4 text-[#DC2626]" />
              <span>Prijava štete</span>
            </Link>

            {/* Dropdown 2: O agenciji & Partneri */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'agencija' ? null : 'agencija')}
                aria-expanded={openDropdown === 'agencija'}
                aria-haspopup="true"
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  openDropdown === 'agencija' ||
                  isActiveGroup(['/o-nama', '/o-nama-pravno', '/prigovori', '/contact'])
                    ? 'text-[#0F2942] bg-slate-100/90'
                    : 'text-slate-700 hover:text-[#0F2942] hover:bg-slate-50'
                }`}
              >
                <span>O nama i partneri</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-150 ${
                    openDropdown === 'agencija' ? 'rotate-180 text-[#0F2942]' : ''
                  }`}
                />
              </button>

              {openDropdown === 'agencija' && (
                <div
                  role="menu"
                  className="absolute left-0 top-full mt-2 w-[360px] bg-white rounded-xl border border-slate-200 shadow-lg p-3 space-y-1 z-50"
                >
                  {AGENCY_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        role="menuitem"
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#0F2942] text-slate-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#0F2942]">
                            {item.label}
                          </div>
                          <p className="text-xs text-slate-500 leading-snug mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right: Phone, Client Portal, Primary CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+38514800120"
              className="hidden xl:inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#0F2942] px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors tabular-nums"
            >
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>01 4800 120</span>
            </a>

            <Link
              to="/portal"
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                location.pathname.startsWith('/portal') || location.pathname.startsWith('/admin')
                  ? 'border-[#0F2942] bg-slate-50 text-[#0F2942]'
                  : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:text-[#0F2942] bg-white'
              }`}
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>{userProfile ? 'Moj portal' : 'Portal za klijente'}</span>
            </Link>

            <button
              type="button"
              onClick={handlePrimaryCta}
              className="px-4 py-2 bg-[#0F2942] hover:bg-[#163859] text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Zatražite ponudu
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label={mobileMenuOpen ? 'Zatvori izbornik' : 'Otvori izbornik'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Off-Canvas Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white max-h-[calc(100vh-72px)] overflow-y-auto shadow-lg">
          <div className="px-4 py-4 space-y-3">
            {/* Accordion 1: Osiguranja */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setMobileAccordion(mobileAccordion === 'osiguranja' ? null : 'osiguranja')}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-900 bg-slate-50"
                aria-expanded={mobileAccordion === 'osiguranja'}
              >
                <span>Programi osiguranja</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform ${
                    mobileAccordion === 'osiguranja' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {mobileAccordion === 'osiguranja' && (
                <div className="p-2 space-y-1 bg-white">
                  {[...INSURANCE_VEHICLE_ITEMS, ...INSURANCE_PERSONAL_ITEMS].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-sm text-slate-700 font-medium"
                      >
                        <Icon className="w-4 h-4 text-[#0F2942] shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Direct Link: Prijava štete */}
            <Link
              to="/prijava-stete"
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-red-200 bg-red-50/60 text-sm font-semibold text-[#B91C1C]"
            >
              <span className="flex items-center gap-2.5">
                <FileWarning className="w-4 h-4 text-[#DC2626]" />
                <span>Prijava štete i provjera statusa</span>
              </span>
            </Link>

            {/* Accordion 2: O agenciji */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setMobileAccordion(mobileAccordion === 'agencija' ? null : 'agencija')}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-900 bg-slate-50"
                aria-expanded={mobileAccordion === 'agencija'}
              >
                <span>O nama, partneri i pravno</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform ${
                    mobileAccordion === 'agencija' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {mobileAccordion === 'agencija' && (
                <div className="p-2 space-y-1 bg-white">
                  {AGENCY_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-sm text-slate-700 font-medium"
                      >
                        <Icon className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Portal & Actions */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-1 gap-2.5">
              <Link
                to="/portal"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>{userProfile ? 'Moj portal polica' : 'Portal za klijente'}</span>
              </Link>

              <a
                href="tel:+38514800120"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 tabular-nums"
              >
                <Phone className="w-4 h-4 text-slate-500" />
                <span>01 4800 120</span>
              </a>

              <button
                type="button"
                onClick={handlePrimaryCta}
                className="w-full py-3 px-4 rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white text-sm font-semibold shadow-sm transition-colors"
              >
                Zatražite ponudu
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
