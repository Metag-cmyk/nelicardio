import { Printer } from 'lucide-react';
import { cn } from '../../lib/utils';

/** Triggers the browser print/PDF dialog for the current view. */
export function PrintButton({ className, label = 'Print' }: { className?: string; label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      aria-label={label}
      className={cn(
        'no-print inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-medical-accent hover:border-medical-accent transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-accent/50',
        className,
      )}
    >
      <Printer className="w-3.5 h-3.5" /> {label}
    </button>
  );
}
