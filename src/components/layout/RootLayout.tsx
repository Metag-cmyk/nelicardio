import React from 'react';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { useI18n } from '../../i18n/useI18n';
import type { Route, RouteName } from '../../router/router';

interface RootLayoutProps {
  route: Route;
  isScrolled: boolean;
  onNavigate: (name: RouteName) => void;
  children: React.ReactNode;
}

export function RootLayout({ route, isScrolled, onNavigate, children }: RootLayoutProps) {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-medical-surface text-slate-600 flex flex-col md:pl-64 font-sans max-w-[100vw] overflow-x-hidden selection:bg-medical-accent selection:text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[200] focus:rounded-xl focus:bg-medical-accent focus:px-4 focus:py-2 focus:text-xs focus:font-black focus:uppercase focus:tracking-wider focus:text-white"
      >
        {t('ui.skip')}
      </a>
      <Sidebar 
        routeName={route.name} 
        onNavigate={onNavigate} 
      />
      
      <MobileHeader 
        isScrolled={isScrolled} 
      />

      <main id="main-content" className="flex-1 w-full max-w-6xl mx-auto px-4 py-4 pb-24 sm:px-6 md:py-16 md:pb-16">
        {children}
      </main>

      <MobileBottomNav 
        routeName={route.name} 
        onNavigate={onNavigate} 
      />
    </div>
  );
}
