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
    { id: 'auto' as InsuranceCategory, label: 'Auto & Kasko', icon: Car },
    { id: 'property' as InsuranceCategory, label: 'Imovina', icon: Home },
    { id: 'health' as InsuranceCategory, label: 'Zdravstvo', icon: HeartPulse },
    { id: 'travel' as InsuranceCategory, label: 'Putno', icon: Plane },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Izračunaj i usporedi police</h2>
            <p className="text-xs text-slate-500">10 vodećih osiguratelja • Službene HANFA tarife • Bez provizije</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Zatvori prozor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-100 bg-white">
          <div className="flex space-x-2 overflow-x-auto scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
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
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30">
          {activeCategory === 'auto' && <AutoQuoteWizard />}
          {activeCategory === 'property' && <PropertyQuoteWizard />}
          {activeCategory === 'health' && <HealthQuoteWizard />}
          {activeCategory === 'travel' && <TravelQuoteWizard />}
        </div>
      </div>
    </div>
  );
};
