import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ children, className, onClick, hoverable = false }: CardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-white border border-medical-border rounded-2xl overflow-hidden",
        onClick && "cursor-pointer",
        hoverable && "transition-all duration-300 hover:shadow-sm hover:-translate-y-1 cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode, className?: string }) {
  return <div className={cn("p-4 border-b border-medical-border font-bold text-slate-800", className)}>{children}</div>;
}

export function CardBody({ children, className }: { children: ReactNode, className?: string }) {
  return <div className={cn("p-4", className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: ReactNode, className?: string }) {
  return <div className={cn("p-4 border-t border-medical-border bg-slate-50/50", className)}>{children}</div>;
}
