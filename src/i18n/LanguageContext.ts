import { createContext } from 'react';
import type { Lang, StringKey } from './strings';

export interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: StringKey, fallback?: string) => string;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);
