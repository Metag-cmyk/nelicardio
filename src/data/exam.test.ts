import { describe, it, expect } from 'vitest';
import { examSections, examTopics } from './exam';
import { conditions } from './conditions';
import { guidelinesMap } from './guidelines';
import { instrumentsMap } from '../lib/instruments';
import { figures } from './figures';
import { medicationsMap } from './medications';
const conditionIds = new Set(conditions.map((c) => c.id));
const figureIds = new Set(figures.map((f) => f.id));

describe('exam syllabus integrity', () => {
  it('covers all 64 syllabus points', () => {
    expect(examSections.length).toBeGreaterThan(0);
    expect(examTopics).toHaveLength(64);
  });

  it('topic ids and codes are unique', () => {
    const ids = examTopics.map((t) => t.id);
    const codes = examTopics.map((t) => t.code);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('every linked id resolves to existing content', () => {
    const bad: string[] = [];
    for (const topic of examTopics) {
      for (const id of topic.links.conditionIds) if (!conditionIds.has(id)) bad.push(`${topic.id}:condition:${id}`);
      for (const id of topic.links.guidelineIds) if (!guidelinesMap.has(id)) bad.push(`${topic.id}:guideline:${id}`);
      for (const id of topic.links.medicationIds) if (!medicationsMap.has(id)) bad.push(`${topic.id}:medication:${id}`);
      for (const id of topic.links.instrumentIds) if (!instrumentsMap.has(id)) bad.push(`${topic.id}:instrument:${id}`);
      for (const id of topic.links.figureIds) if (!figureIds.has(id)) bad.push(`${topic.id}:figure:${id}`);
    }
    expect(bad).toEqual([]);
  });

  it('marks high-yield points and keeps the flag on real topics', () => {
    const flagged = examTopics.filter((t) => t.highYield);
    expect(flagged.length).toBeGreaterThan(0);
    expect(flagged.every((t) => examTopics.includes(t))).toBe(true);
  });

  it('every focused point matches at least one of its recommendations', () => {
    const bad: string[] = [];
    for (const topic of examTopics) {
      const focus = topic.focus ?? [];
      if (focus.length === 0) continue;
      const recs = topic.links.guidelineIds.flatMap((id) => guidelinesMap.get(id)?.recommendations ?? []);
      const hit = recs.some((r) => focus.some((k) => r.text.toLowerCase().includes(k.toLowerCase())));
      if (!hit) bad.push(topic.id);
    }
    expect(bad).toEqual([]);
  });
});
