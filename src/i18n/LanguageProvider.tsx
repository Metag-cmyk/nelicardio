import React, { useState, useMemo, useCallback } from 'react';
import { I18nContext } from './LanguageContext';
import { dictionaries, type Lang, type StringKey } from './strings';

const STORAGE_KEY = 'nelicardio_lang_v1';

function readLang(): Lang {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'bg' ? 'bg' : 'en';
  } catch {
    return 'en';
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(readLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const t = useCallback(
    (key: StringKey, fallback?: string) => dictionaries[lang][key] ?? fallback ?? key,
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
