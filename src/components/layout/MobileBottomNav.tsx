import { useState } from 'react';
import { MoreHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { NAV_ITEMS, MOBILE_PRIMARY, activeNavId, getNavItem, type NavItem } from '../../config/nav';
import { useI18n } from '../../i18n/useI18n';
import type { StringKey } from '../../i18n/strings';
import type { RouteName } from '../../router/router';

interface MobileBottomNavProps {
  routeName: RouteName;
  onNavigate: (id: RouteName) => void;
}

export function MobileBottomNav({ routeName, onNavigate }: MobileBottomNavProps) {
  const [showMore, setShowMore] = useState(false);
  const activeId = activeNavId(routeName);
  const { t } = useI18n();
  const navLabel = (id: string, fallback: string) => t(`nav.${id}` as StringKey, fallback);

  const primary = MOBILE_PRIMARY
    .map(getNavItem)
    .filter((item): item is NavItem => Boolean(item));
  const more = NAV_ITEMS.filter((item) => !MOBILE_PRIMARY.includes(item.id));
  const moreActive = more.some((item) => item.id === activeId);

  const go = (id: RouteName) => {
    onNavigate(id);
    setShowMore(false);
  };

  return (
    <>
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50 flex items-end bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowMore(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full bg-medical-secondary rounded-t-[2rem] p-5 pb-[max(env(safe-area-inset-bottom,0px),1rem)] max-w-md mx-auto"
            >
              <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">All sections</h2>
                <button
                  onClick={() => setShowMore(false)}
                  aria-label="Close"
                  className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {more.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => go(item.id)}
                      className={cn(
                        "flex flex-col items-start gap-2 p-4 rounded-2xl border text-left min-h-[92px] transition-all active:scale-[0.98]",
                        isActive ? "border-medical-accent bg-medical-accent/5" : "border-slate-100 bg-white",
                      )}
                    >
                      <item.icon className={cn("w-5 h-5", isActive ? "text-medical-accent" : "text-slate-500")} />
                      <span className="text-xs font-black uppercase tracking-tight text-slate-900">{navLabel(item.id, item.label)}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-tight">{item.description}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav
        aria-label="Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-2 pt-1 pb-[max(env(safe-area-inset-bottom,0px),0.5rem)]"
      >
        <div className="grid grid-cols-5 items-center max-w-md mx-auto">
          {primary.map((item) => {
            const isActive = activeId === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  "flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-200 group active:scale-90 min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-accent/50",
                  isActive ? "text-medical-accent" : "text-slate-400 hover:text-slate-600",
                )}
              >
                <div className={cn(
                  "relative flex items-center justify-center w-12 h-7 rounded-full transition-all duration-300",
                  isActive ? "bg-medical-accent/15 text-medical-accent" : "bg-transparent text-slate-400 group-hover:text-slate-600",
                )}>
                  <Icon className={cn("w-5 h-5 transition-transform duration-200", isActive && "scale-110")} />
                </div>
                <span className={cn("text-[10px] uppercase tracking-wider font-black mt-0.5 transition-colors leading-none", isActive ? "text-medical-accent" : "text-slate-400")}>
                  {navLabel(item.id, item.label)}
                </span>
              </button>
            );
          })}
          <button
            onClick={() => setShowMore(true)}
            aria-label="More sections"
            className={cn(
              "flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all group active:scale-90 min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-accent/50",
              moreActive ? "text-medical-accent" : "text-slate-400 hover:text-slate-600",
            )}
          >
            <div className={cn(
              "relative flex items-center justify-center w-12 h-7 rounded-full transition-all duration-300",
              moreActive ? "bg-medical-accent/15 text-medical-accent" : "bg-transparent",
            )}>
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-black mt-0.5 leading-none">{t('ui.more')}</span>
          </button>
        </div>
      </nav>
    </>
  );
}
