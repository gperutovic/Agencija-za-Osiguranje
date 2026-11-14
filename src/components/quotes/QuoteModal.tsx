import React, { useState, useEffect } from 'react';
import { X, Car, Home, HeartPulse, Plane } from 'lucide-react';
import { InsuranceCategory } from '../../lib/types';
import { AutoQuoteWizard } from './AutoQuoteWizard';
import { PropertyQuoteWizard } from './PropertyQuoteWizard';
import { HealthQuoteWizard } from './HealthQuoteWizard';
import { TravelQuoteWizard } from './TravelQuoteWizard';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: InsuranceCategory;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'auto',
}) => {
  const [activeCategory, setActiveCategory] = useState<InsuranceCategory>(initialCategory);

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = [
    { id: 'auto' as InsuranceCategory, label: 'Auto i kasko', icon: Car },
    { id: 'property' as InsuranceCategory, label: 'Imovina', icon: Home },
    { id: 'health' as InsuranceCategory, label: 'Zdravstvo', icon: HeartPulse },
    { id: 'travel' as InsuranceCategory, label: 'Putno', icon: Plane },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Informativni izračun osiguranja"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col z-10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Informativni izračun i usporedba ponuda</h2>
            <p className="text-xs text-slate-500">Agencija Život • Partnerski osiguratelji u RH • Bez agencijske provizije</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
            aria-label="Zatvori prozor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-6 pt-3 pb-3 border-b border-slate-200 bg-white">
          <div className="flex space-x-2 overflow-x-auto scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-xs whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#0F2942] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Wizard Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/40">
          {activeCategory === 'auto' && <AutoQuoteWizard />}
          {activeCategory === 'property' && <PropertyQuoteWizard />}
          {activeCategory === 'health' && <HealthQuoteWizard />}
          {activeCategory === 'travel' && <TravelQuoteWizard />}
        </div>
      </div>
    </div>
  );
};
