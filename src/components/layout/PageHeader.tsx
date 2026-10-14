import React from 'react';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
  badgeVariant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, badge, badgeVariant = 'ghost', children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 mb-6 md:mb-8", className)}>
      <div className="space-y-1">
        {badge && (
          <Badge 
            variant={badgeVariant} 
            className="bg-medical-accent/10 text-medical-accent border-medical-accent/20 mb-2 font-black tracking-widest uppercase text-[10px]"
          >
            {badge}
          </Badge>
        )}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-tight md:leading-none">
          {title}
        </h2>
        <p className="text-xs md:text-[10px] font-black text-slate-400 uppercase tracking-wider md:tracking-[0.2em] mt-1 md:mt-2">
          {subtitle}
        </p>
      </div>
      {children && (
        <div className="w-full md:w-auto">
          {children}
        </div>
      )}
    </div>
  );
}
