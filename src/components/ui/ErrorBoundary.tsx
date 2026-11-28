import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand';
import { Button } from './Button';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'Došlo je do neočekivane pogreške u aplikaciji.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('[Vedro ErrorBoundary]', error, info.componentStack);
  }

  render(): React.ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-canvas-warm flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-editorial bg-canvas border border-hairline p-8 text-center space-y-5 shadow-card">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-status-danger">
            <AlertTriangle className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-3xl text-ink">Nešto je pošlo po krivu</h1>
            <p className="text-sm text-ink-secondary leading-relaxed">
              Došlo je do privremene pogreške pri prikazu stranice. Vaši spremljeni podaci u{' '}
              {BRAND_CONFIG.brandName} sustavu su sigurni.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
            <Button
              onClick={() => {
                this.setState({ hasError: false, message: '' });
                window.location.reload();
              }}
            >
              <RefreshCw className="w-4 h-4" strokeWidth={1.75} />
              <span>Osvježi stranicu</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                this.setState({ hasError: false, message: '' });
                window.location.href = '/';
              }}
            >
              Naslovnica
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
