import { cn } from '../lib/utils';
import { useI18n } from './useI18n';
import type { Lang } from './strings';

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <div
      role="group"
      aria-label="Language"
      className={cn('inline-flex items-center gap-0.5 p-0.5 bg-slate-100 rounded-xl border border-slate-200/60', className)}
    >
      {(['en', 'bg'] as Lang[]).map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={cn(
            'px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all min-h-[28px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-accent/50',
            lang === code ? 'bg-white text-medical-accent shadow-sm' : 'text-slate-400 hover:text-slate-600',
          )}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
