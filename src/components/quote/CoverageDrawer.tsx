import React, { useState } from 'react';
import { Check, Download, X } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { CarrierOffer, ProductLine } from '../../types/domain';
import { downloadIpidPdf } from '../../utils/documentGenerator';
import { formatEur } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { Drawer } from '../ui/Drawer';

interface CoverageDrawerProps {
  offer: CarrierOffer | null;
  productLine?: ProductLine;
  productLabel: string;
  onClose: () => void;
  onSelectOffer: (offer: CarrierOffer) => void;
}

export const CoverageDrawer: React.FC<CoverageDrawerProps> = ({
  offer,
  productLine,
  productLabel,
  onClose,
  onSelectOffer,
}) => {
  const { language, copy, t } = useLanguage();
  const [downloading, setDownloading] = useState(false);

  if (!offer) return null;

  const isTravel = productLine === 'putno';

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadIpidPdf(offer, productLabel);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Drawer
      isOpen={Boolean(offer)}
      onClose={onClose}
      title={`${offer.carrierShortName} — ${offer.tierLabel}`}
      subtitle={`${productLabel} • ${t('IPID oznaka', 'IPID Code')}: ${offer.ipidCode}`}
      footer={
        <div className="space-y-2.5">
          <Button fullWidth variant="outline" isLoading={downloading} onClick={() => void handleDownload()}>
            <Download className="w-4 h-4" strokeWidth={1.5} />
            <span>{t('Preuzmi službeni IPID (PDF)', 'Download Official IPID (PDF)')}</span>
          </Button>
          <Button
            fullWidth
            onClick={() => {
              onClose();
              onSelectOffer(offer);
            }}
          >
            {t('Zatraži obvezujuću ponudu', 'Request Binding Offer')}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="rounded-editorial bg-canvas-warm border border-hairline p-4 grid grid-cols-2 gap-4 tabular-nums">
          <div>
            <div className="text-xs text-ink-muted">
              {isTravel ? t('Cijena putovanja', 'Single-trip total') : t('Godišnja premija', 'Annual premium')}
            </div>
            <div className="text-xl font-bold text-ink mt-0.5">{formatEur(offer.annualPrice)}</div>
            {!isTravel ? (
              <div className="text-xs text-ink-secondary">
                {language === 'hr' ? 'ili' : 'or'} {formatEur(offer.monthlyPrice)} {copy.units.perMonthShort}
              </div>
            ) : null}
          </div>
          <div>
            <div className="text-xs text-ink-muted">
              {offer.deductible > 0
                ? t('Franšiza & limit', 'Deductible & limit')
                : t('Limit pokrića', 'Coverage limit')}
            </div>
            {offer.deductible > 0 ? (
              <div className="text-base font-semibold text-ink mt-0.5">
                {t('Franšiza', 'Deductible')}: {formatEur(offer.deductible)}
              </div>
            ) : (
              <div className="text-base font-semibold text-ink mt-0.5">
                {t('Bez franšize (0 €)', 'No deductible (€0)')}
              </div>
            )}
            <div className="text-xs text-ink-secondary">
              {t('Limit', 'Limit')}: {formatEur(offer.coverageLimit)}
            </div>
          </div>
        </div>

        {/* Covered Items */}
        <div className="space-y-3">
          <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-status-success">
            {t('Što je pokriveno', 'What is covered')}
          </h4>
          <ul className="space-y-2.5">
            {offer.coveredItems.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-ink">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-50 text-status-success flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" strokeWidth={2.25} />
                </span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Excluded Items */}
        <div className="space-y-3 pt-4 border-t border-hairline">
          <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-status-danger">
            {t('Što nije pokriveno (Glavna isključenja)', 'What is not covered (Key exclusions)')}
          </h4>
          <ul className="space-y-2.5">
            {offer.excludedItems.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-ink-secondary">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-red-50 text-status-danger flex items-center justify-center shrink-0">
                  <X className="w-3.5 h-3.5" strokeWidth={2.25} />
                </span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Drawer>
  );
};
