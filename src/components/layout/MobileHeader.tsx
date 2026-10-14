import { Heart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../ui/ThemeToggle';

interface MobileHeaderProps {
  isScrolled: boolean;
}

export function MobileHeader({ isScrolled }: MobileHeaderProps) {
  return (
    <header className={cn(
      "md:hidden sticky top-0 z-30 w-full transition-all duration-300",
      "pt-[max(env(safe-area-inset-top,0px),0.75rem)] pb-3 px-4",
      isScrolled 
        ? "bg-medical-surface/95 backdrop-blur-md border-b border-slate-200/60 shadow-sm" 
        : "bg-medical-surface"
    )}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 bg-medical-accent rounded-xl flex items-center justify-center shadow-sm shadow-medical-accent/25 heart-pulse shrink-0">
            <Heart className="w-5 h-5 text-white fill-white/20" />
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="font-black text-xl text-slate-900 tracking-tight italic leading-none truncate">NeliCardio</h1>
            <span className="text-[9px] font-black uppercase tracking-wider text-medical-accent leading-none mt-1">Precision Cardio</span>
          </div>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
