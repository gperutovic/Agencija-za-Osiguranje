import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  tabular?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, tabular = false, id, className = '', ...rest }, ref) => {
    const inputId = id ?? (label ? `input-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : undefined);
    return (
      <div className="space-y-1.5">
        {label ? (
          <label htmlFor={inputId} className="block text-xs font-semibold text-ink">
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={`w-full h-11 rounded-lg border bg-canvas px-3.5 text-sm text-ink placeholder:text-ink-muted transition-colors focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent ${
            error ? 'border-status-danger' : 'border-hairline-strong hover:border-ink/40'
          } ${tabular ? 'tabular-nums' : ''} ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          {...rest}
        />
        {error ? (
          <p role="alert" className="text-xs font-medium text-status-danger">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-ink-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
