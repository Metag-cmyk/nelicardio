/**
 * Spaced-repetition scheduler (SM-2).
 * Pure functions so the behaviour is unit-tested; persistence is handled by the
 * caller (localStorage in the Study view).
 */

export type Grade = 'again' | 'hard' | 'good' | 'easy';

export interface CardState {
  id: string;
  /** Ease factor (SM-2). */
  ease: number;
  intervalDays: number;
  reps: number;
  lapses: number;
  /** Unix ms when the card is next due. */
  due: number;
}

export const DAY_MS = 86_400_000;
const MIN_EASE = 1.3;
const AGAIN_DELAY_MS = 60_000; // re-show after 1 minute

export function newCard(id: string, now: number): CardState {
  return { id, ease: 2.5, intervalDays: 0, reps: 0, lapses: 0, due: now };
}

export function schedule(card: CardState, grade: Grade, now: number): CardState {
  let { ease, intervalDays, reps, lapses } = card;

  if (grade === 'again') {
    lapses += 1;
    reps = 0;
    ease = Math.max(MIN_EASE, ease - 0.2);
    intervalDays = 0;
  } else if (grade === 'hard') {
    reps += 1;
    ease = Math.max(MIN_EASE, ease - 0.15);
    intervalDays = Math.max(1, Math.round((intervalDays || 1) * 1.2));
  } else if (grade === 'good') {
    reps += 1;
    intervalDays = reps === 1 ? 1 : reps === 2 ? 6 : Math.round((intervalDays || 1) * ease);
  } else {
    reps += 1;
    ease = ease + 0.15;
    intervalDays = Math.max(1, Math.round((intervalDays || 1) * ease * 1.3));
  }

  const due = now + (grade === 'again' ? AGAIN_DELAY_MS : intervalDays * DAY_MS);
  return { ...card, ease, intervalDays, reps, lapses, due };
}

export const isDue = (card: CardState, now: number): boolean => card.due <= now;

/** A card counts as "mastered" once its interval reaches three weeks. */
export const isMastered = (card: CardState): boolean => card.intervalDays >= 21;

export interface TopicMastery {
  topicId: string;
  total: number;
  mastered: number;
  seen: number;
  rate: number;
}

/** Group card states by topic and compute mastery. */
export function masteryByTopic(
  topics: { id: string; title: string }[],
  cardsByTopic: Map<string, CardState[]>,
): TopicMastery[] {
  return topics.map((topic) => {
    const cards = cardsByTopic.get(topic.id) ?? [];
    const mastered = cards.filter(isMastered).length;
    const seen = cards.filter((c) => c.reps > 0 || c.lapses > 0).length;
    return {
      topicId: topic.id,
      total: cards.length,
      mastered,
      seen,
      rate: cards.length > 0 ? mastered / cards.length : 0,
    };
  });
}

/** Human-readable interval label. */
export function intervalLabel(card: CardState): string {
  if (card.intervalDays <= 0) return 'now';
  if (card.intervalDays === 1) return '1 day';
  if (card.intervalDays < 30) return `${card.intervalDays} days`;
  const months = Math.round(card.intervalDays / 30);
  return `${months} mo`;
}
