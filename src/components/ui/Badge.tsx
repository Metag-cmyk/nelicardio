import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export function Badge({ children, variant = 'primary', size = 'sm', className, dot = false }: BadgeProps) {
  const variants = {
    primary: 'bg-medical-accent/10 text-medical-accent border-medical-accent/20',
    secondary: 'bg-medical-primary/10 text-medical-primary border-medical-primary/20',
    success: 'bg-medical-success/10 text-medical-success border-medical-success/20',
    warning: 'bg-medical-warning/10 text-medical-warning border-medical-warning/20',
    danger: 'bg-medical-danger/10 text-medical-danger border-medical-danger/20',
    ghost: 'bg-slate-100 text-slate-500 border-slate-200',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px] rounded-md',
    sm: 'px-2 py-1 text-xs rounded-lg',
    md: 'px-3 py-1.5 text-sm rounded-xl',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-bold tracking-wider uppercase border',
      variants[variant],
      sizes[size],
      className
    )}>
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full bg-current opacity-80 animate-pulse-soft")} />
      )}
      {children}
    </span>
  );
}
