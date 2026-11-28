import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { PRODUCT_CATALOG } from '../../i18n/translations';
import { BrandWordmark } from '../illustrations/EditorialIllustrations';

export const Footer: React.FC = () => {
  const { language, copy } = useLanguage();
  const { isAgent } = useAuth();

  return (
    <footer className="bg-ink text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Contact */}
          <div className="space-y-4">
            <BrandWordmark inverted />
            <p className="text-sm text-white/70 leading-relaxed">
              {BRAND_CONFIG.legalName}
              <br />
              {BRAND_CONFIG.address}, {BRAND_CONFIG.postalCode} {BRAND_CONFIG.city}
            </p>
            <div className="space-y-1 text-sm tabular-nums">
              <div>
                <a href={BRAND_CONFIG.phoneHref} className="text-white hover:text-accent transition-colors">
                  {BRAND_CONFIG.phone}
                </a>
              </div>
              <div>
                <a href={`mailto:${BRAND_CONFIG.email}`} className="text-white/75 hover:text-white transition-colors">
                  {BRAND_CONFIG.email}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Products */}
          <div className="space-y-3">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-white/50">
              {copy.footer.products}
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              {PRODUCT_CATALOG.map((p) => (
                <li key={p.id}>
                  <Link to={`/izracun/${p.id}`} className="hover:text-white transition-colors">
                    {language === 'hr' ? p.nameHr : p.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Digital Tools & Portals */}
          <div className="space-y-3">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-white/50">
              {copy.footer.tools}
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link to="/izracun" className="hover:text-white transition-colors">
                  {language === 'hr' ? '90-sekundni izračun cijene' : '90-Second Quote Engine'}
                </Link>
              </li>
              <li>
                <Link to="/usporedi-policu" className="hover:text-white transition-colors">
                  {copy.nav.switchPolicy}
                </Link>
              </li>
              <li>
                <Link to="/prijava-stete" className="hover:text-white transition-colors">
                  {copy.nav.claims}
                </Link>
              </li>
              <li>
                <Link to="/ai-savjetnik" className="hover:text-white transition-colors">
                  {copy.nav.aiAdvisor}
                </Link>
              </li>
              <li>
                <Link to="/moj-profil" className="hover:text-white transition-colors">
                  {copy.nav.myProfile}
                </Link>
              </li>
              {isAgent ? (
                <li>
                  <Link to="/admin" className="hover:text-white transition-colors">
                    {language === 'hr' ? 'Portal za zastupnike' : 'Agency Operations Portal'}
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>

          {/* Column 4: Regulatory & Legal */}
          <div className="space-y-3">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-white/50">
              {copy.footer.compliance}
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link to="/o-nama" className="hover:text-white transition-colors">
                  {copy.nav.about}
                </Link>
              </li>
              <li>
                <Link to="/pravne-informacije" className="hover:text-white transition-colors">
                  {language === 'hr' ? 'Pravne informacije i HANFA' : 'Legal & HANFA Disclosures'}
                </Link>
              </li>
              <li>
                <Link to="/privatnost" className="hover:text-white transition-colors">
                  {language === 'hr' ? 'Zaštita privatnosti (GDPR)' : 'Privacy Policy (GDPR)'}
                </Link>
              </li>
              <li>
                <Link to="/kolacici" className="hover:text-white transition-colors">
                  {language === 'hr' ? 'Politika kolačića' : 'Cookie Policy'}
                </Link>
              </li>
              <li>
                <Link to="/prigovori" className="hover:text-white transition-colors">
                  {language === 'hr' ? 'Prigovori potrošača (čl. 401.)' : 'Consumer Complaints (Art. 401)'}
                </Link>
              </li>
              <li>
                <a
                  href={BRAND_CONFIG.hanfaRegistryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-white/80 hover:text-accent transition-colors"
                >
                  <span>{language === 'hr' ? 'Registar HANFA' : 'HANFA Registry'}</span>
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Croatian Regulatory Disclosure Block */}
        <div className="pt-8 border-t border-white/10 space-y-4 text-xs text-white/60 leading-relaxed">
          <div className="flex flex-wrap gap-x-6 gap-y-1.5 tabular-nums text-white/75">
            <span>{BRAND_CONFIG.legalName}</span>
            <span>OIB: {BRAND_CONFIG.oib}</span>
            <span>MBS: {BRAND_CONFIG.mbs}</span>
            <span>
              {language === 'hr' ? 'HANFA upisnik:' : 'HANFA Registry:'}{' '}
              {BRAND_CONFIG.hanfaRegistrationNumber}
            </span>
          </div>
          <p>{copy.footer.disclosure}</p>
          <p>
            <strong className="text-white/80 font-medium">{copy.footer.representedInsurers}</strong>{' '}
            {BRAND_CONFIG.partnerInsurers.map((p) => p.name).join(' • ')}.
          </p>
          <p className="text-white/45">
            © {new Date().getFullYear()} {BRAND_CONFIG.legalName}. {copy.footer.rightsReserved}
          </p>
        </div>
      </div>
    </footer>
  );
};
