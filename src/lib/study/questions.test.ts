import { describe, it, expect } from 'vitest';
import { buildQuestionBank, QUESTION_TYPE_LABEL } from './questions';

const bank = buildQuestionBank('ESC');

describe('question bank', () => {
  it('builds a substantial, deduplicated bank', () => {
    expect(bank.length).toBeGreaterThan(100);
    const ids = bank.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every question has a valid answer pointing at an option', () => {
    for (const q of bank) {
      expect(q.options.length, q.id).toBeGreaterThanOrEqual(2);
      expect(q.options.some((o) => o.id === q.answerId), q.id).toBe(true);
      expect(q.rationale.length, q.id).toBeGreaterThan(0);
    }
  });

  it('class questions offer the four ESC classes', () => {
    const cls = bank.filter((q) => q.type === 'class');
    expect(cls.length).toBeGreaterThan(50);
    for (const q of cls.slice(0, 20)) {
      expect(q.options).toHaveLength(4);
      const answer = q.options.find((o) => o.id === q.answerId)!;
      expect(answer.text).toMatch(/^Class (I|IIa|IIb|III)$/);
    }
  });

  it('band questions have the band label as the answer', () => {
    const bands = bank.filter((q) => q.type === 'band');
    expect(bands.length).toBeGreaterThan(20);
    for (const q of bands.slice(0, 20)) {
      const answer = q.options.find((o) => o.id === q.answerId)!;
      expect(q.rationale.startsWith(answer.text)).toBe(true);
    }
  });

  it('includes figure-recognition questions', () => {
    const figs = bank.filter((q) => q.type === 'figure');
    expect(figs.length).toBeGreaterThanOrEqual(6);
    for (const q of figs) expect(q.figureId).toBeTruthy();
  });

  it('is deterministic across builds', () => {
    const again = buildQuestionBank('ESC');
    expect(again.map((q) => q.id)).toEqual(bank.map((q) => q.id));
    for (let i = 0; i < 25; i++) {
      expect(again[i].answerId).toBe(bank[i].answerId);
      expect(again[i].options.map((o) => o.text)).toEqual(bank[i].options.map((o) => o.text));
    }
  });

  it('the ACC view differs from the ESC view', () => {
    const acc = buildQuestionBank('AHA/ACC');
    expect(acc.map((q) => q.id)).not.toEqual(bank.map((q) => q.id));
  });

  it('exposes a label for every question type', () => {
    for (const q of bank) expect(QUESTION_TYPE_LABEL[q.type]).toBeTruthy();
  });
});
