import { describe, it, expect } from 'vitest';
import { questionsForTopic } from './study';
import { examTopics, type ExamTopic } from '../../data/exam';

describe('per-topic study questions', () => {
  it('scopes a point to questions about its linked content', () => {
    const af = examTopics.find((t) => t.id === 'bg-6')!;
    const questions = questionsForTopic(af, 'ESC');
    expect(questions.length).toBeGreaterThan(0);
  });

  it('returns nothing for a point with no links', () => {
    const empty: ExamTopic = {
      id: 'x',
      code: '0',
      title: '',
      orientation: '',
      links: { conditionIds: [], guidelineIds: [], medicationIds: [], instrumentIds: [], figureIds: [] },
    };
    expect(questionsForTopic(empty, 'ESC')).toEqual([]);
  });
});
