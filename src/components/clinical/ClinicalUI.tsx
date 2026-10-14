import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

/**
 * ScoreDisplay: High-fidelity clinical results container.
 */
interface ScoreDisplayProps {
  score: number | string;
  label: string;
  interpretation: string;
  recommendation?: string;
  color?: 'medical-accent' | 'rose' | 'emerald' | 'amber' | 'slate';
  size?: 'normal' | 'large';
}

export function ScoreDisplay({ score, label, interpretation, recommendation, color = 'medical-accent', size = 'normal' }: ScoreDisplayProps) {
  const colorMap = {
    'medical-accent': 'bg-medical-accent',
    'rose': 'bg-rose-600',
    'emerald': 'bg-emerald-600',
    'amber': 'bg-amber-500',
    'slate': 'bg-slate-800'
  };

  return (
    <div className={cn(
      "rounded-3xl md:rounded-[4rem] p-6 sm:p-10 md:p-14 text-white text-center shadow-2xl relative overflow-hidden mb-6 md:mb-12 border border-white/20 transition-all duration-700 group", 
      colorMap[color]
    )}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-[120px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
      <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/80 mb-4 md:mb-6">{label}</p>
      <div className={cn("font-black mb-6 md:mb-8 tracking-tighter italic leading-none transition-all", size === 'large' ? "text-7xl sm:text-9xl md:text-[12rem]" : "text-6xl sm:text-8xl md:text-[10rem]")}>{score}</div>
      <div className="space-y-4">
         <div className="px-6 py-3 md:px-10 md:py-4 bg-white/20 rounded-full inline-block backdrop-blur-xl border border-white/20 shadow-xl">
            <p className="text-xs md:text-sm font-black uppercase tracking-wider md:tracking-[0.2em] leading-none">{interpretation}</p>
         </div>
         {recommendation && (
            <div className="max-w-md mx-auto pt-4 md:pt-6 border-t border-white/10">
               <p className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-white/60 mb-2 underline decoration-white/20 underline-offset-4">ESC/AHA 2024 Guidance</p>
               <p className="text-[11px] md:text-xs font-black italic uppercase leading-relaxed text-white/90">{recommendation}</p>
            </div>
         )}
      </div>
    </div>
  );
}

/**
 * ToggleItem: Standardized Clinical Criterion Card.
 */
interface ToggleItemProps {
  label: string;
  sub?: string;
  value: boolean | number;
  points: number;
  onClick: () => void;
  activeColor?: string;
  disabled?: boolean;
  locked?: boolean;
}

export function ToggleItem({ label, sub, value, points, onClick, activeColor = 'bg-medical-accent', disabled = false, locked = false }: ToggleItemProps) {
  return (
    <Card className={cn("p-4 sm:p-6 md:p-8 bg-white border border-slate-100 transition-all group rounded-2xl md:rounded-[2.5rem] shadow-sm relative overflow-hidden", (disabled || locked) && "bg-slate-50/50", locked && "border-medical-accent/20")}>
      {locked && (
         <div className="absolute top-3 right-4 md:top-4 md:right-8">
            <Badge variant="ghost" className="bg-medical-accent/10 text-medical-accent border-medical-accent/20 text-[7px] md:text-[8px] font-black uppercase tracking-wider px-2 py-0.5">Auto-Linked</Badge>
         </div>
      )}
      <div className="flex justify-between items-center h-full gap-3 sm:gap-4">
        <div className="space-y-1 flex-1">
          <h4 className="text-[11px] sm:text-xs md:text-[13px] font-black text-slate-900 uppercase tracking-tight leading-tight">{label}</h4>
          {sub && <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider italic">{sub}</p>}
        </div>
        <button 
          onClick={onClick}
          disabled={disabled || locked}
          className={cn(
            "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-sm shrink-0 active:scale-95",
            value ? `${activeColor} border-transparent text-white scale-105 shadow-md` : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200",
            locked && "opacity-100 cursor-default"
          )}
        >
          {value ? <ShieldCheck className="w-6 h-6 md:w-7 md:h-7" /> : <div className="text-xs md:text-sm font-black">+{points}</div>}
        </button>
      </div>
    </Card>
  );
}

/**
 * ClinicalField: Unified Biochemistry and Parameter Input.
 */
interface ClinicalFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit?: string;
  variant?: 'light' | 'dark' | 'minimal';
  elevated?: boolean;
  icon?: React.ReactNode;
  placeholder?: string;
}

export function ClinicalField({ 
  label, 
  value, 
  onChange, 
  unit, 
  variant = 'light', 
  elevated, 
  icon,
  placeholder = '----'
}: ClinicalFieldProps) {
  const isDark = variant === 'dark';
  const isMinimal = variant === 'minimal';

  return (
    <div className={cn("space-y-2 md:space-y-3 group/field w-full", isMinimal && "space-y-1")}>
      <div className="flex items-center justify-between px-1">
        <label className={cn(
          "text-[9px] md:text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors",
          isDark ? "text-slate-400 group-focus-within/field:text-medical-accent" : "text-slate-400 group-focus-within/field:text-medical-accent"
        )}>
          {icon} {label}
        </label>
        {elevated && (
          <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-[7px] md:text-[8px] font-black uppercase border-none shadow-sm">
            Elevated
          </Badge>
        )}
      </div>
      <div className="relative">
        <Input 
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-12 font-black transition-all duration-300 rounded-2xl text-center uppercase no-scrollbar",
            isDark 
              ? "bg-white/5 border-white/10 text-white text-lg md:text-xl focus:bg-white/10 focus:border-medical-accent/50 selection:bg-medical-accent shadow-inner"
              : "bg-slate-50 border-slate-100 text-slate-900 text-base md:text-lg hover:border-slate-200 focus:bg-white focus:border-medical-accent/30",
            elevated && "border-rose-200 focus:border-rose-500 bg-rose-50/10",
            isMinimal && "h-10 text-base"
          )}
        />
        {unit && (
          <div className={cn(
            "absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-[9px] md:text-[10px] font-black uppercase tracking-wider pointer-events-none transition-opacity group-focus-within/field:opacity-30",
            isDark ? "text-white/30" : "text-slate-400"
          )}>
            {unit}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * RiskHeatmap: Linear risk progress visualizer.
 */
export function RiskHeatmap({ value, thresholds, unit = '%', label = '10y CVD Risk' }: { value: number, thresholds: { low: number, high: number }, unit?: string, label?: string }) {
  const getStatus = () => {
    if (value < thresholds.low) return { label: 'Low-Mod Risk', color: 'bg-emerald-500', text: 'text-emerald-500' };
    if (value < thresholds.high) return { label: 'High Risk', color: 'bg-orange-500', text: 'text-orange-500' };
    return { label: 'Very High Risk', color: 'bg-rose-600', text: 'text-rose-600' };
  };

  const status = getStatus();

  return (
    <div className="space-y-4 mb-6 md:mb-12">
      <div className="flex justify-between items-end mb-2">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</span>
          <h2 className={cn("text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tighter leading-none", status.text)}>{value.toFixed(1)}{unit}</h2>
        </div>
        <Badge className={cn("px-4 py-1.5 md:px-6 md:py-2 rounded-full uppercase text-[9px] md:text-[10px] font-black text-white border-none shadow-lg", status.color)}>
           {status.label}
        </Badge>
      </div>
      <div className="h-3 md:h-4 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/50">
         <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-orange-500 to-rose-600 opacity-20" />
         <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(value * 4, 100)}%` }}
            className={cn("h-full relative shadow-lg transition-all duration-1000", status.color)}
         >
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/40" />
         </motion.div>
      </div>
    </div>
  );
}
