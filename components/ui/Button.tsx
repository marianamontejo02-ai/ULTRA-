import { cn } from '@/lib/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed',
          {
            primary:
              'bg-ultra-gradient text-white hover:opacity-90 ultra-shadow hover:ultra-shadow-lg active:scale-[0.98]',
            secondary:
              'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]',
            outline:
              'border-2 border-ultra-500 text-ultra-600 hover:bg-ultra-50 active:scale-[0.98]',
            ghost:
              'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
          }[variant],
          {
            sm: 'px-4 py-2 text-sm',
            md: 'px-6 py-3 text-sm',
            lg: 'px-8 py-4 text-base',
          }[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Cargando...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
