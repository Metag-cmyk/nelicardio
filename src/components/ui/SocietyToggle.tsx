import { useSociety } from '../../context/useSociety';
import type { SocietyView } from '../../context/SocietyContext';
import { cn } from '../../lib/utils';

const OPTIONS: { id: SocietyView; label: string }[] = [
  { id: 'ESC', label: 'ESC' },
  { id: 'AHA/ACC', label: 'AHA/ACC' },
  { id: 'both', label: 'Both' },
];

export function SocietyToggle({ className }: { className?: string }) {
  const { society, setSociety } = useSociety();

  return (
    <div
      role="group"
      aria-label="Guideline society"
      className={cn('inline-flex items-center gap-0.5 p-0.5 bg-slate-100 rounded-xl border border-slate-200/60', className)}
    >
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          onClick={() => setSociety(option.id)}
          aria-pressed={society === option.id}
          className={cn(
            'px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all min-h-[28px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-accent/50',
            society === option.id ? 'bg-white text-medical-accent shadow-sm' : 'text-slate-400 hover:text-slate-600',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
