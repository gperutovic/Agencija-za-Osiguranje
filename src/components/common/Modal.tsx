import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth,
  size = 'lg',
}) => {
  const effectiveWidth = maxWidth || size;
  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#06080c]/80 backdrop-blur-md z-50 animate-in fade-in duration-150" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <Dialog.Content
            className={twMerge(
              clsx(
                'w-full bg-[#0a0d16] rounded-3xl p-6 sm:p-8 shadow-floating border border-white/[0.1] relative my-8 animate-in zoom-in-95 duration-150 text-slate-100',
                maxWidths[effectiveWidth]
              )
            )}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.08] mb-6">
              <div className="space-y-1">
                {title && (
                  <Dialog.Title className="text-lg sm:text-xl font-black text-white tracking-tight">
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className="text-xs text-slate-400">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                  aria-label="Zatvori"
                >
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
            {children}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
