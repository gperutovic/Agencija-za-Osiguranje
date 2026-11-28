import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      // Max 2 stacked toasts so notifications never clutter the screen
      setToasts((prev) => [...prev.slice(-1), { id, message, variant }]);
      setTimeout(() => dismiss(id), 4500);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        style={{ bottom: 'var(--toast-bottom-offset, 1.25rem)' }}
        className="fixed right-4 z-[60] flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-sm pointer-events-none transition-[bottom] duration-200"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 rounded-editorial bg-canvas border border-hairline shadow-elevated px-4 py-3 text-sm text-ink animate-step"
          >
            {item.variant === 'success' && (
              <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" strokeWidth={1.75} />
            )}
            {item.variant === 'error' && (
              <AlertCircle className="w-4 h-4 text-status-danger shrink-0 mt-0.5" strokeWidth={1.75} />
            )}
            {item.variant === 'info' && (
              <Info className="w-4 h-4 text-ink-secondary shrink-0 mt-0.5" strokeWidth={1.75} />
            )}
            <p className="flex-1 leading-snug">{item.message}</p>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              className="text-ink-muted hover:text-ink transition-colors"
              aria-label="Zatvori obavijest"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
};
