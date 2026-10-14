import { createContext } from 'react';

export type ThemeSetting = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextType {
  /** User preference (may be 'system'). */
  theme: ThemeSetting;
  /** Effective theme after resolving 'system'. */
  resolved: ResolvedTheme;
  setTheme: (theme: ThemeSetting) => void;
  /** Cycle light -> dark -> system -> light. */
  cycle: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/** Pure theme cycle order: light -> dark -> system -> light. */
export function nextTheme(theme: ThemeSetting): ThemeSetting {
  if (theme === 'light') return 'dark';
  if (theme === 'dark') return 'system';
  return 'light';
}

