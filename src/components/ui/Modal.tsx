import React, { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  maxWidthClass?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  maxWidthClass = 'max-w-lg',
  footer,
  children,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = useId();
  useFocusTrap(isOpen, panelRef, onClose);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`w-full ${maxWidthClass} max-h-[90vh] flex flex-col rounded-editorial bg-canvas border border-hairline shadow-elevated animate-step focus:outline-none overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Header */}
        <div className="shrink-0 flex items-start justify-between gap-4 px-6 sm:px-8 pt-6 pb-4 border-b border-hairline bg-canvas">
          <div className="min-w-0">
            <h3 id={headingId} className="font-display text-2xl sm:text-3xl text-ink leading-tight">
              {title}
            </h3>
            {subtitle ? <p className="text-sm text-ink-secondary mt-1">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg text-ink-muted hover:text-ink hover:bg-canvas-warm transition-colors shrink-0"
            aria-label="Zatvori"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-5">{children}</div>

        {/* Optional Sticky Footer */}
        {footer ? (
          <div className="shrink-0 px-6 sm:px-8 py-4 border-t border-hairline bg-canvas">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body
  );
};
