import { buildQuestionBank, type StudyQuestion } from '../study/questions';
import type { SocietyView } from '../../context/SocietyContext';
import type { ExamTopic } from '../../data/exam';

/**
 * Questions relevant to a single syllabus point, drawn from the shared study
 * bank and scoped to the point's linked conditions, instruments and guidelines.
 * Deterministic for a given society view.
 */
export function questionsForTopic(topic: ExamTopic, society: SocietyView): StudyQuestion[] {
  const conditionIds = new Set(topic.links.conditionIds);
  const guidelineIds = new Set(topic.links.guidelineIds);
  const instrumentIds = new Set(topic.links.instrumentIds);
  if (conditionIds.size === 0 && guidelineIds.size === 0 && instrumentIds.size === 0) return [];

  return buildQuestionBank(society).filter(
    (q) =>
      (q.conditionId !== undefined && conditionIds.has(q.conditionId)) ||
      (q.instrumentId !== undefined && instrumentIds.has(q.instrumentId)) ||
      (q.sourceRef !== undefined && guidelineIds.has(q.sourceRef)),
  );
}
