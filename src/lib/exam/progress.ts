/**
 * Per-point study progress for the Bulgarian exam tab.
 * Stored locally under its own key so it never collides with the SM-2 deck.
 */
export interface ExamPointProgress {
  studied?: boolean;
  /** Self-rated confidence, 1 (low) to 3 (high). */
  confidence?: number;
  /** Unix ms of the last time the point was opened. */
  lastOpened?: number;
}

export type ExamProgressMap = Record<string, ExamPointProgress>;

const KEY = 'nelicardio.exam.progress.v1';

export function loadExamProgress(): ExamProgressMap {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as ExamProgressMap) : {};
  } catch {
    return {};
  }
}

export function saveExamProgress(map: ExamProgressMap): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* storage unavailable — progress is non-critical */
  }
}

export function withStudied(map: ExamProgressMap, id: string, studied: boolean): ExamProgressMap {
  return { ...map, [id]: { ...map[id], studied } };
}

export function withConfidence(map: ExamProgressMap, id: string, confidence: number): ExamProgressMap {
  return { ...map, [id]: { ...map[id], confidence } };
}

export function withOpened(map: ExamProgressMap, id: string, at: number): ExamProgressMap {
  return { ...map, [id]: { ...map[id], lastOpened: at } };
}
