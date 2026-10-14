import type { CardState } from './scheduler';

const STORAGE_KEY = 'nelicardio_study_v1';

export interface StudyStore {
  cards: Record<string, CardState>;
  /** Reviews per ISO date (YYYY-MM-DD) for streak tracking. */
  history: Record<string, number>;
}

export const emptyStore = (): StudyStore => ({ cards: {}, history: {} });

export function loadStore(): StudyStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as Partial<StudyStore>;
    return { cards: parsed.cards ?? {}, history: parsed.history ?? {} };
  } catch {
    return emptyStore();
  }
}

export function saveStore(store: StudyStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* storage unavailable */
  }
}

export const dayKey = (ms: number): string => new Date(ms).toISOString().slice(0, 10);

/** Consecutive days with at least one review, ending today or yesterday. */
export function currentStreak(history: Record<string, number>, now: number): number {
  let streak = 0;
  const cursor = new Date(now);
  // Allow the streak to be "alive" if the last review was today.
  if (!history[dayKey(now)]) cursor.setDate(cursor.getDate() - 1);
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (history[key]) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
