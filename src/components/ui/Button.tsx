import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  isLoading, 
  disabled, 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-medical-accent text-white hover:bg-medical-accent/90 shadow-sm shadow-medical-accent/20',
    secondary: 'bg-medical-primary text-white hover:bg-medical-primary/90 shadow-sm shadow-medical-primary/20',
    outline: 'border-2 border-medical-accent/30 text-medical-accent hover:bg-medical-accent/5',
    ghost: 'text-slate-500 hover:text-medical-accent hover:bg-medical-accent/5',
    danger: 'bg-medical-danger text-white hover:bg-medical-danger/90 shadow-sm shadow-medical-danger/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-bold rounded-lg',
    md: 'px-4 py-2 text-sm font-bold rounded-xl',
    lg: 'px-6 py-3 text-base font-bold rounded-2xl',
    xl: 'px-8 py-4 text-lg font-bold rounded-2xl',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-accent/50 focus-visible:ring-offset-2',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}
