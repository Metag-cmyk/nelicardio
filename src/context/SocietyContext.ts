import { createContext } from 'react';

/** Which society's recommendations to show. */
export type SocietyView = 'ESC' | 'AHA/ACC' | 'both';

export interface SocietyContextType {
  society: SocietyView;
  setSociety: (society: SocietyView) => void;
  cycle: () => void;
}

export const SocietyContext = createContext<SocietyContextType | undefined>(undefined);

/** Pure cycle order: ESC -> AHA/ACC -> both -> ESC. */
export function nextSociety(society: SocietyView): SocietyView {
  if (society === 'ESC') return 'AHA/ACC';
  if (society === 'AHA/ACC') return 'both';
  return 'ESC';
}
