import { examTopics, type ExamTopic } from '../../data/exam';

/**
 * Related syllabus points, derived from shared condition sources (weighted 2)
 * and shared guidelines (weighted 1). Deterministic.
 */
export function relatedTopics(topic: ExamTopic, limit = 6): ExamTopic[] {
  const conditions = new Set(topic.links.conditionIds);
  const guidelines = new Set(topic.links.guidelineIds);
  return examTopics
    .filter((t) => t.id !== topic.id)
    .map((t) => {
      let score = 0;
      for (const c of t.links.conditionIds) if (conditions.has(c)) score += 2;
      for (const g of t.links.guidelineIds) if (guidelines.has(g)) score += 1;
      return { t, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.t);
}
