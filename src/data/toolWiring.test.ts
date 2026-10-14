import { describe, it, expect } from 'vitest';
import { conditionInstruments, instrumentsForCondition, isToolWired } from './toolWiring';
import { instrumentsMap } from '../lib/instruments';
import { conditions } from './conditions';

const conditionIds = new Set(conditions.map((c) => c.id));

describe('tool wiring integrity', () => {
  it('references only existing conditions and instruments', () => {
    const unknown: string[] = [];
    for (const [conditionId, ids] of Object.entries(conditionInstruments)) {
      if (!conditionIds.has(conditionId)) unknown.push(`condition:${conditionId}`);
      for (const id of ids) if (!instrumentsMap.has(id)) unknown.push(`${conditionId}:${id}`);
    }
    expect(unknown).toEqual([]);
  });

  it('reports wiring helpers correctly', () => {
    expect(isToolWired('pulmonary-embolism')).toBe(true);
    expect(isToolWired('atrial-fibrillation')).toBe(true);
    expect(isToolWired('syncope')).toBe(false);
    expect(instrumentsForCondition('pulmonary-embolism')).toContain('wells-pe');
  });
});
