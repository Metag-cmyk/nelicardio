import { Heart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { NAV_GROUPS, NAV_ITEMS, activeNavId } from '../../config/nav';
import type { RouteName } from '../../router/router';
import { ThemeToggle } from '../ui/ThemeToggle';
import { SocietyToggle } from '../ui/SocietyToggle';
import { useI18n } from '../../i18n/useI18n';
import { LanguageToggle } from '../../i18n/LanguageToggle';
import type { StringKey } from '../../i18n/strings';

interface SidebarProps {
  routeName: RouteName;
  onNavigate: (id: RouteName) => void;
}

export function Sidebar({ routeName, onNavigate }: SidebarProps) {
  const activeId = activeNavId(routeName);
  const { t } = useI18n();
  const navLabel = (id: string, fallback: string) => t(`nav.${id}` as StringKey, fallback);
  const groupLabel = (id: string, fallback: string) => t(`group.${id}` as StringKey, fallback);

  return (
    <aside className="hidden md:flex flex-col w-64 bg-medical-secondary border-r border-slate-200/60 fixed h-full left-0 top-0 z-50">
      <div className="p-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-medical-accent rounded-2xl flex items-center justify-center shadow-2xl shadow-medical-accent/40 group transition-all duration-500 hover:rotate-12 heart-pulse">
          <Heart className="w-7 h-7 text-white fill-white/20" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-black tracking-tighter leading-none text-slate-900 italic">NeliCardio</h1>
          <p className="text-[9px] text-medical-accent font-black uppercase tracking-[0.3em] mt-1.5">Precision Cardio</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto no-scrollbar" aria-label="Primary">
        {NAV_GROUPS.map((group) => {
          const items = NAV_ITEMS.filter((item) => item.group === group.id);
          if (items.length === 0) return null;

          return (
            <div key={group.id} className="space-y-1.5">
              <p className="px-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">{groupLabel(group.id, group.label)}</p>
              {items.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      "w-full flex items-center gap-4 px-5 py-3.5 rounded-3xl text-xs font-black uppercase tracking-widest transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-accent/50",
                      isActive
                        ? "bg-medical-accent text-white shadow-2xl shadow-medical-accent/30 translate-x-1"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5 transition-transform duration-500 group-hover:scale-110 shrink-0", isActive ? "text-white" : "text-slate-600")} />
                    <span className="flex-1 text-left">{navLabel(item.id, item.label)}</span>
                    {item.planned && (
                      <span className={cn(
                        "text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border",
                        isActive ? "border-white/40 text-white/80" : "border-slate-200 text-slate-400"
                      )}>
                        {t('ui.soon')}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 mt-auto space-y-3">
        <div className="flex items-center justify-between gap-3 px-2">
          <span className="label-clinical">{t('ui.society')}</span>
          <SocietyToggle />
        </div>
        <div className="flex items-center justify-between gap-3 px-2">
          <span className="label-clinical">{t('ui.theme')}</span>
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-between gap-3 px-2">
          <span className="label-clinical">{t('ui.language')}</span>
          <LanguageToggle />
        </div>
        <p className="px-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">
          {t('ui.disclaimer')}
        </p>
      </div>
    </aside>
  );
}
