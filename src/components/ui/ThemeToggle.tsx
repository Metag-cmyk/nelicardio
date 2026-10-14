import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../theme/useTheme';
import { cn } from '../../lib/utils';

/**
 * Cycles Light -> Dark -> System. Persisted by the ThemeProvider.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, resolved, cycle } = useTheme();
  const Icon = theme === 'system' ? Monitor : resolved === 'dark' ? Moon : Sun;
  const label = theme === 'system' ? 'System theme' : theme === 'dark' ? 'Dark theme' : 'Light theme';

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Theme: ${label}. Activate to change.`}
      title={label}
      data-testid="theme-toggle"
      className={cn(
        "w-10 h-10 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-medical-accent hover:border-medical-accent/40 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-accent/50",
        className,
      )}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
