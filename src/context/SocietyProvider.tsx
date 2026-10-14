import React, { useState, useMemo, useCallback } from 'react';
import { SocietyContext, nextSociety, type SocietyView } from './SocietyContext';

const STORAGE_KEY = 'nelicardio_society_v1';

const isSocietyView = (value: unknown): value is SocietyView =>
  value === 'ESC' || value === 'AHA/ACC' || value === 'both';

function readStoredSociety(): SocietyView {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isSocietyView(saved) ? saved : 'ESC';
  } catch {
    return 'ESC';
  }
}

export const SocietyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [society, setSocietyState] = useState<SocietyView>(readStoredSociety);

  const setSociety = useCallback((next: SocietyView) => {
    setSocietyState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — in-memory only */
    }
  }, []);

  const cycle = useCallback(() => setSociety(nextSociety(society)), [society, setSociety]);

  const value = useMemo(() => ({ society, setSociety, cycle }), [society, setSociety, cycle]);

  return <SocietyContext.Provider value={value}>{children}</SocietyContext.Provider>;
};
