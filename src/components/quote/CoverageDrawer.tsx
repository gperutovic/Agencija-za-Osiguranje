import React from 'react';
import { Check, Download, X } from 'lucide-react';
import { CarrierOffer } from '../../types/domain';
import { downloadIpidPdf } from '../../utils/documentGenerator';
import { formatEur } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { Drawer } from '../ui/Drawer';

interface CoverageDrawerProps {
  offer: CarrierOffer | null;
  productLabel: string;
  onClose: () => void;
  onSelectOffer: (offer: CarrierOffer) => void;
}

export const CoverageDrawer: React.FC<CoverageDrawerProps> = ({
  offer,
  productLabel,
  onClose,
  onSelectOffer,
}) => {
  if (!offer) return null;

  return (
    <Drawer
      isOpen={Boolean(offer)}
      onClose={onClose}
      title={`${offer.carrierShortName} — ${offer.tierLabel}`}
      subtitle={`${productLabel} • IPID oznaka: ${offer.ipidCode}`}
    >
      <div className="space-y-6">
        {/* Price & Deductible Summary */}
        <div className="rounded-editorial bg-canvas-warm border border-hairline p-4 grid grid-cols-2 gap-4 tabular-nums">
          <div>
            <div className="text-xs text-ink-muted">Godišnja premija</div>
            <div className="text-xl font-bold text-ink mt-0.5">{formatEur(offer.annualPrice)}</div>
            <div className="text-xs text-ink-secondary">
              ili {formatEur(offer.monthlyPrice)} / mj.
            </div>
          </div>
          <div>
            <div className="text-xs text-ink-muted">Franšiza & limit</div>
            <div className="text-base font-semibold text-ink mt-0.5">
              Franšiza: {formatEur(offer.deductible)}
            </div>
            <div className="text-xs text-ink-secondary">
              Limit: {formatEur(offer.coverageLimit)}
            </div>
          </div>
        </div>

        {/* Covered Items — Plain-Language Policy 2.0 */}
        <div className="space-y-3">
          <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-status-success">
            Što je pokriveno
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
            Što nije pokriveno (Glavna isključenja)
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

        {/* Actions */}
        <div className="pt-5 border-t border-hairline space-y-2.5">
          <Button
            fullWidth
            variant="outline"
            onClick={() => downloadIpidPdf(offer, productLabel)}
          >
            <Download className="w-4 h-4" strokeWidth={1.5} />
            <span>Preuzmi službeni IPID (PDF)</span>
          </Button>
          <Button
            fullWidth
            onClick={() => {
              onClose();
              onSelectOffer(offer);
            }}
          >
            Zatraži obvezujuću ponudu
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
