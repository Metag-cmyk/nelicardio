import { describe, it, expect } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { auditDepth } from './depth';
import { depthMarkdown } from './depthReport';
import { conditions } from '../../data/conditions';
import { treatmentRationale } from '../../data/treatmentRationale';

describe('pathogenesis depth audit', () => {
  const { rows, summary, topicDepth } = auditDepth();

  it('covers every condition', () => {
    expect(rows).toHaveLength(conditions.length);
  });

  it('assigns a valid level to every condition', () => {
    const valid = new Set(['deep', 'adequate', 'shallow', 'missing']);
    for (const r of rows) {
      expect(valid.has(r.level), r.id).toBe(true);
      expect(r.steps).toBeGreaterThanOrEqual(0);
    }
    expect(summary.total).toBe(rows.length);
  });

  it('maps every syllabus point to a depth level', () => {
    expect(topicDepth).toHaveLength(64);
  });

  it('provides a treatment rationale for every condition', () => {
    const missing = conditions.filter((c) => !(treatmentRationale[c.id]?.length)).map((c) => c.id);
    expect(missing).toEqual([]);
  });

  it('gives every condition labs and physical signs', () => {
    for (const r of rows) {
      expect(r.labs, r.id).toBeGreaterThan(0);
      expect(r.signs, r.id).toBeGreaterThan(0);
    }
  });

  it('regenerates docs/bg-pathogenesis-audit.md', () => {
    mkdirSync('docs', { recursive: true });
    writeFileSync('docs/bg-pathogenesis-audit.md', depthMarkdown(), 'utf8');
    expect(summary.total).toBeGreaterThan(0);
  });
});
