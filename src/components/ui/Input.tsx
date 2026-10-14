import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
}

export function Input({ 
  label, 
  error, 
  icon, 
  rightElement, 
  className, 
  ...props 
}: InputProps) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-medical-accent transition-colors">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'flex h-11 w-full rounded-xl border-2 border-medical-border bg-white px-3.5 py-2 text-sm font-medium transition-all',
            'placeholder:text-slate-400 focus:outline-none focus:border-medical-accent focus:ring-4 focus:ring-medical-accent/5',
            'disabled:cursor-not-allowed disabled:opacity-50',
            icon && 'pl-11',
            rightElement && 'pr-11',
            error && 'border-medical-danger focus:border-medical-danger focus:ring-medical-danger/5',
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-[10px] font-bold text-medical-danger ml-1 uppercase tracking-wide animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}
