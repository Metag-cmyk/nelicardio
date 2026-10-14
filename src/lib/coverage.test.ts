import { describe, it, expect } from 'vitest';
import { computeCoverage, computeTopicCoverage, SUPERSEDED_IDS, STATUS_SCORE } from './coverage';
import { BLUEPRINTS, TOPICS, blueprintTopics } from '../data/blueprint';

describe('coverage engine', () => {
  it('computes a report for every blueprint with readiness in 0..100', () => {
    for (const blueprint of BLUEPRINTS) {
      const report = computeCoverage(blueprint, blueprint.preferredSociety);
      expect(report.topics.length, blueprint.id).toBe(TOPICS.length);
      expect(report.readiness, blueprint.id).toBeGreaterThanOrEqual(0);
      expect(report.readiness, blueprint.id).toBeLessThanOrEqual(100);

      const summed =
        report.counts.covered + report.counts.partial + report.counts.outdated + report.counts.missing;
      expect(summed, blueprint.id).toBe(TOPICS.length);
    }
  });

  it('marks a topic with no conditions as missing (score 0)', () => {
    const tc = computeTopicCoverage(
      { id: 'x', title: 'X', weight: 1, conditionIds: [], guidelineIds: [] },
      'ESC',
    );
    expect(tc.status).toBe('missing');
    expect(tc.score).toBe(STATUS_SCORE.missing);
    expect(tc.totalCount).toBe(0);
  });

  it('marks a topic as outdated when a covering guideline is superseded', () => {
    const tc = computeTopicCoverage(
      { id: 'pad', title: 'PAD', weight: 1, conditionIds: ['peripheral-artery-disease'], guidelineIds: ['acc-2016-pad'] },
      'both',
    );
    expect(tc.status).toBe('outdated');
    expect(tc.supersededGuidelineIds).toContain('acc-2016-pad');
  });

  it('records the superseded ids declared in the registry', () => {
    expect(SUPERSEDED_IDS.has('acc-2016-pad')).toBe(true);
    expect(SUPERSEDED_IDS.has('esc-2021-hf')).toBe(true);
    expect(SUPERSEDED_IDS.has('acc-2018-cholesterol')).toBe(true);
  });

  it('marks an ungraded condition as partial', () => {
    // Geriatric cardiology has no graded guideline mapped yet.
    const tc = computeTopicCoverage(
      { id: 't', title: 'T', weight: 1, conditionIds: ['geriatric-cardiology'], guidelineIds: [] },
      'ESC',
    );
    expect(tc.conditions[0].graded).toBe(false);
    expect(tc.status).toBe('partial');
  });

  it('marks a graded condition that also has tools as covered (AF)', () => {
    const tc = computeTopicCoverage(
      { id: 'af', title: 'AF', weight: 1, conditionIds: ['atrial-fibrillation'], guidelineIds: ['esc-2024-af'] },
      'ESC',
    );
    expect(tc.conditions[0].graded).toBe(true);
    expect(tc.status).toBe('covered');
  });

  it('scores covered higher than partial (weighting sanity)', () => {
    expect(STATUS_SCORE.covered).toBeGreaterThan(STATUS_SCORE.partial);
    expect(STATUS_SCORE.partial).toBeGreaterThan(STATUS_SCORE.outdated);
    expect(STATUS_SCORE.outdated).toBeGreaterThan(STATUS_SCORE.missing);
  });

  it('applies blueprint weight overrides', () => {
    const blueprint = BLUEPRINTS.find((b) => b.id === 'bg-specialty-exam')!;
    const topics = blueprintTopics(blueprint);
    const acs = topics.find((t) => t.id === 'acs')!;
    const base = TOPICS.find((t) => t.id === 'acs')!;
    expect(acs.weight).toBeGreaterThan(base.weight);
  });

  it('recognises the Phase 4 content additions', () => {
    const syncope = TOPICS.find((t) => t.id === 'syncope')!;
    expect(computeTopicCoverage(syncope, 'both').totalCount).toBe(2);

    const ph = TOPICS.find((t) => t.id === 'pulmonary-hypertension')!;
    expect(computeTopicCoverage(ph, 'ESC').totalCount).toBe(1);

    const channel = TOPICS.find((t) => t.id === 'channelopathies')!;
    expect(computeTopicCoverage(channel, 'ESC').totalCount).toBe(4);

    const htn = TOPICS.find((t) => t.id === 'hypertension')!;
    expect(computeTopicCoverage(htn, 'ESC').totalCount).toBe(2);

    const devices = TOPICS.find((t) => t.id === 'devices')!;
    expect(computeTopicCoverage(devices, 'ESC').totalCount).toBe(3);

    const revasc = TOPICS.find((t) => t.id === 'revascularization')!;
    expect(computeTopicCoverage(revasc, 'ESC').totalCount).toBe(2);

    const sports = TOPICS.find((t) => t.id === 'sports')!;
    expect(computeTopicCoverage(sports, 'ESC').totalCount).toBe(1);

    const cm = TOPICS.find((t) => t.id === 'cardiometabolic')!;
    expect(computeTopicCoverage(cm, 'ESC').totalCount).toBe(2);
  });
});
