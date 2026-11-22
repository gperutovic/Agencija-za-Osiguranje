import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  maxWidthClass?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  maxWidthClass = 'max-w-lg',
  children,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/45"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-heading"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto rounded-editorial bg-canvas border border-hairline shadow-elevated p-6 sm:p-8 animate-step`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-hairline">
          <div>
            <h3 id="modal-heading" className="font-display text-2xl sm:text-3xl text-ink leading-tight">
              {title}
            </h3>
            {subtitle ? <p className="text-sm text-ink-secondary mt-1">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas-warm transition-colors"
            aria-label="Zatvori"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="pt-5">{children}</div>
      </div>
    </div>
  );
};
