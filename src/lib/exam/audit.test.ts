import { describe, it, expect } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { auditAll } from './audit';
import { auditMarkdown } from './auditReport';
import { examTopics } from '../../data/exam';

describe('exam audit engine', () => {
  const { topics, summary } = auditAll();

  it('audits every syllabus point', () => {
    expect(topics).toHaveLength(64);
    expect(topics).toHaveLength(examTopics.length);
  });

  it('gives every point requirements and a readiness in 0..100', () => {
    for (const t of topics) {
      expect(t.requirements.length, t.id).toBeGreaterThan(0);
      expect(t.readiness, t.id).toBeGreaterThanOrEqual(0);
      expect(t.readiness, t.id).toBeLessThanOrEqual(100);
    }
  });

  it('authored-coverage points carry a title-oriented note and pass', () => {
    const authored = topics.filter((t) => t.coverage === 'authored');
    expect(authored.length).toBeGreaterThan(0);
    for (const t of authored) expect(t.verdict, t.id).toBe('ok');
  });

  it('leaves no point needing authoring or slicing', () => {
    expect(summary.byVerdict['needs-authoring']).toBe(0);
    expect(summary.byVerdict['needs-slicing']).toBe(0);
  });

  it('regenerates docs/bg-exam-audit.md', () => {
    mkdirSync('docs', { recursive: true });
    writeFileSync('docs/bg-exam-audit.md', auditMarkdown(), 'utf8');
    expect(summary.total).toBe(64);
  });
});
