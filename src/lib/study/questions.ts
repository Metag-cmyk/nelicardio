import { guidelines } from '../../data/guidelines';
import { instruments, type Instrument } from '../instruments';
import { conditions } from '../../data/conditions';
import { figures } from '../../data/figures';
import { TOPICS } from '../../data/blueprint';
import type { SocietyView } from '../../context/SocietyContext';

/**
 * Deterministic question generation from the app's structured data.
 * No runtime randomness: ids and option order are stable, so spaced-repetition
 * state survives reloads.
 */
export type QuestionType = 'class' | 'band' | 'first-line' | 'figure';

export interface StudyQuestion {
  id: string;
  type: QuestionType;
  topicId: string;
  conditionId?: string;
  instrumentId?: string;
  prompt: string;
  options: { id: string; text: string }[];
  answerId: string;
  rationale: string;
  sourceRef?: string;
  figureId?: string;
}

const CLASSES = ['I', 'IIa', 'IIb', 'III'] as const;

const CATEGORY_TOPIC: Record<string, string> = {
  'Acute coronary': 'acs',
  Arrhythmia: 'af',
  'Heart failure': 'hf',
  Thromboembolism: 'pe',
  'Risk & prevention': 'prevention',
};

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickDistractors(pool: string[], answer: string, count: number, seed: string): string[] {
  const unique = [...new Set(pool)].filter((p) => p !== answer);
  const out: string[] = [];
  let h = hash(seed) || 1;
  while (out.length < count && unique.length > 0) {
    h = (Math.imul(h, 1103515245) + 12345) >>> 0;
    out.push(unique.splice(h % unique.length, 1)[0]);
  }
  return out;
}

function makeOptions(answer: string, pool: string[], seed: string, count = 3) {
  const distractors = pickDistractors(pool, answer, count, `opt:${seed}`);
  const all = [answer, ...distractors];
  let h = hash(seed) || 1;
  for (let i = all.length - 1; i > 0; i--) {
    h = (Math.imul(h, 1103515245) + 12345) >>> 0;
    const j = h % (i + 1);
    [all[i], all[j]] = [all[j], all[i]];
  }
  const options = all.map((text, i) => ({ id: `o${i}`, text }));
  return { options, answerId: options.find((o) => o.text === answer)!.id };
}

const topicForGuideline = (guidelineId: string): string =>
  TOPICS.find((t) => t.guidelineIds.includes(guidelineId))?.id ?? 'other';

const topicForCondition = (conditionId: string): string =>
  TOPICS.find((t) => t.conditionIds.includes(conditionId))?.id ?? 'other';

function classQuestions(society: SocietyView): StudyQuestion[] {
  const questions: StudyQuestion[] = [];
  for (const guideline of guidelines) {
    const label = guideline.society.join('/');
    for (const rec of guideline.recommendations) {
      const cls = society === 'AHA/ACC' ? rec.accClass : rec.escClass ?? rec.accClass;
      if (!cls) continue;
      const answer = `Class ${cls}`;
      const { options, answerId } = makeOptions(
        answer,
        CLASSES.map((c) => `Class ${c}`),
        `class:${guideline.id}:${rec.id}`,
      );
      questions.push({
        id: `q:class:${guideline.id}:${rec.id}:${society}`,
        type: 'class',
        topicId: topicForGuideline(guideline.id),
        prompt: `Per the ${label} guideline "${guideline.title}", the following recommendation carries which Class of Recommendation?\n\n“${rec.text}”`,
        options,
        answerId,
        rationale: `${answer}${rec.escLoe || rec.accLoe ? `, LOE ${rec.escLoe ?? rec.accLoe}` : ''} — ${guideline.title}${rec.section ? ` (${rec.section})` : ''}.`,
        sourceRef: guideline.id,
      });
    }
  }
  return questions;
}

function instrumentQuestions(instrument: Instrument): StudyQuestion[] {
  const bands = instrument.bands ?? [];
  if (bands.length < 2) return [];
  return bands.map((band) => {
    const labels = bands.map((b) => b.label);
    const { options, answerId } = makeOptions(band.label, labels, `band:${instrument.id}:${band.label}`);
    return {
      id: `q:band:${instrument.id}:${band.label}`,
      type: 'band' as const,
      topicId: CATEGORY_TOPIC[instrument.category] ?? 'other',
      instrumentId: instrument.id,
      prompt: `A patient scores ${band.min} on the ${instrument.name} (${instrument.description}). Which interpretation applies?`,
      options,
      answerId,
      rationale: `${band.label}${band.recommendation ? ` — ${band.recommendation}` : ''}. ${instrument.sourceNote}`,
      sourceRef: instrument.sourceRef,
    };
  });
}

function firstLineQuestions(): StudyQuestion[] {
  const pool = conditions.map((c) => c.management.primary[0]).filter(Boolean);
  return conditions
    .filter((c) => c.management.primary.length > 0)
    .map((condition) => {
      const answer = condition.management.primary[0];
      const { options, answerId } = makeOptions(answer, pool, `first:${condition.id}`);
      return {
        id: `q:first:${condition.id}`,
        type: 'first-line' as const,
        topicId: topicForCondition(condition.id),
        conditionId: condition.id,
        prompt: `Which of the following is a recognised first-line management step in ${condition.name}?`,
        options,
        answerId,
        rationale: `${condition.name}: ${answer}. Source: ${condition.source ?? 'guideline'}.`,
        sourceRef: condition.source,
      };
    });
}

function figureQuestions(): StudyQuestion[] {
  const pool = figures.map((f) => f.finding);
  return figures.map((figure) => {
    const { options, answerId } = makeOptions(figure.finding, pool, `figure:${figure.id}`);
    return {
      id: `q:figure:${figure.id}`,
      type: 'figure' as const,
      topicId: topicForCondition(figure.conditionIds[0] ?? ''),
      conditionId: figure.conditionIds[0],
      prompt: 'Which finding does this schematic show?',
      figureId: figure.id,
      options,
      answerId,
      rationale: figure.description,
      sourceRef: figure.source,
    };
  });
}

/** Deterministic, deduplicated question bank for a society view. */
export function buildQuestionBank(society: SocietyView): StudyQuestion[] {
  const bank: StudyQuestion[] = [
    ...classQuestions(society),
    ...instruments.flatMap(instrumentQuestions),
    ...firstLineQuestions(),
    ...figureQuestions(),
  ];
  const seen = new Set<string>();
  return bank.filter((q) => (seen.has(q.id) ? false : (seen.add(q.id), true)));
}

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  class: 'Class of recommendation',
  band: 'Score interpretation',
  'first-line': 'First-line therapy',
  figure: 'Image recognition',
};
