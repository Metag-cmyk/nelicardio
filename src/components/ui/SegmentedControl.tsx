import { useId } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import type { LucideIcon } from 'lucide-react';

interface SegmentedControlOption {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function SegmentedControl({ options, activeId, onChange, className }: SegmentedControlProps) {
  const groupId = useId();
  return (
    <div className={cn(
      "flex items-center gap-1 p-1 bg-slate-50/50 backdrop-blur-xl rounded-[2rem] border border-slate-200/40 w-full overflow-x-auto no-scrollbar", 
      className
    )}>
      {options.map((opt) => {
        const isActive = activeId === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            aria-pressed={isActive}
            className={cn(
              "flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-wider transition-all duration-300 shrink-0 relative min-h-[44px] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-accent/50 focus-visible:ring-offset-1",
              isActive ? "text-medical-accent" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {isActive && (
              <motion.div
                layoutId={`segmented-bg-${groupId}`}
                className="absolute inset-0 bg-white shadow-sm border border-slate-100 rounded-full z-0"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {opt.icon && <opt.icon className="w-3.5 h-3.5" />}
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
