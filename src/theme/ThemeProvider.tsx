import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ThemeContext, nextTheme, type ThemeSetting, type ResolvedTheme } from './ThemeContext';

const STORAGE_KEY = 'nelicardio_theme_v1';
const DARK_QUERY = '(prefers-color-scheme: dark)';

const isThemeSetting = (value: unknown): value is ThemeSetting =>
  value === 'light' || value === 'dark' || value === 'system';

function readStoredTheme(): ThemeSetting {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isThemeSetting(saved) ? saved : 'system';
  } catch {
    return 'system';
  }
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeSetting>(readStoredTheme);
  const [systemDark, setSystemDark] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.(DARK_QUERY).matches === true,
  );

  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY);
    const handler = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const resolved: ResolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', resolved === 'dark');
    root.style.colorScheme = resolved;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', resolved === 'dark' ? '#0b1220' : '#10b981');
  }, [resolved]);

  const applyTheme = useCallback((next: ThemeSetting) => {
    // Side effects stay OUT of the state updater: React StrictMode may invoke
    // updaters more than once, which would otherwise over-advance the cycle.
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — in-memory only */
    }
  }, []);

  const setTheme = applyTheme;

  const cycle = useCallback(() => {
    applyTheme(nextTheme(theme));
  }, [theme, applyTheme]);

  const value = useMemo(
    () => ({ theme, resolved, setTheme, cycle }),
    [theme, resolved, setTheme, cycle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
