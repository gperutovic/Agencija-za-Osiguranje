import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const CardSkeleton: React.FC<{ rows?: number }> = ({ rows = 3 }) => (
  <div className="space-y-3" aria-busy="true" aria-label="Učitavanje podataka">
    {Array.from({ length: rows }).map((_, idx) => (
      <div
        key={idx}
        className="rounded-editorial bg-canvas border border-hairline p-6 space-y-3 animate-pulse"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="h-4 w-40 rounded bg-canvas-warm" />
          <div className="h-5 w-20 rounded-pill bg-canvas-warm" />
        </div>
        <div className="h-5 w-2/3 rounded bg-canvas-warm" />
        <div className="h-3.5 w-1/2 rounded bg-canvas-warm" />
      </div>
    ))}
  </div>
);

export const PageSkeleton: React.FC = () => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-6 animate-pulse" aria-busy="true">
    <div className="h-3 w-32 rounded bg-canvas-warm" />
    <div className="h-10 w-2/3 rounded bg-canvas-warm" />
    <div className="h-4 w-1/2 rounded bg-canvas-warm" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
      <div className="h-36 rounded-editorial bg-canvas-warm border border-hairline" />
      <div className="h-36 rounded-editorial bg-canvas-warm border border-hairline" />
      <div className="h-36 rounded-editorial bg-canvas-warm border border-hairline" />
    </div>
  </div>
);

export const ErrorBanner: React.FC<{
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}> = ({ message, onRetry, retryLabel = 'Pokušaj ponovno' }) => (
  <div
    role="alert"
    className="rounded-editorial bg-red-50 border border-red-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-ink"
  >
    <div className="flex items-start gap-2.5">
      <AlertCircle className="w-4 h-4 text-status-danger shrink-0 mt-0.5" strokeWidth={1.75} />
      <span>{message}</span>
    </div>
    {onRetry ? (
      <Button size="sm" variant="outline" onClick={onRetry} className="self-start sm:self-auto shrink-0">
        <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.75} />
        <span>{retryLabel}</span>
      </Button>
    ) : null}
  </div>
);
