import React, { createContext, useContext, useState, useCallback } from 'react';
import * as RadixToast from '@radix-ui/react-toast';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastContextType {
  toast: {
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((type: ToastType, message: string, title?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-emerald-50/90 text-emerald-950',
    error: 'border-rose-200 bg-rose-50/90 text-rose-950',
    info: 'border-brand-200 bg-brand-50/90 text-brand-950',
  };

  return (
    <ToastContext.Provider
      value={{
        toast: {
          success: (msg, title) => addToast('success', msg, title),
          error: (msg, title) => addToast('error', msg, title),
          info: (msg, title) => addToast('info', msg, title),
        },
      }}
    >
      <RadixToast.Provider swipeDirection="right" duration={4500}>
        {children}
        {toasts.map((item) => (
          <RadixToast.Root
            key={item.id}
            onOpenChange={(open) => !open && removeToast(item.id)}
            className={`flex items-start gap-3 p-4 rounded-2xl border shadow-floating max-w-sm backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200 pointer-events-auto ${
              borders[item.type]
            }`}
          >
            {icons[item.type]}
            <div className="grow space-y-0.5">
              {item.title && (
                <RadixToast.Title className="text-xs font-bold leading-none">
                  {item.title}
                </RadixToast.Title>
              )}
              <RadixToast.Description className="text-xs leading-snug">
                {item.message}
              </RadixToast.Description>
            </div>
            <RadixToast.Close
              onClick={() => removeToast(item.id)}
              className="rounded-lg p-1 text-slate-400 hover:text-slate-700 hover:bg-black/5"
            >
              <X className="w-4 h-4" />
            </RadixToast.Close>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none p-4" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
