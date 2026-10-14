/**
 * Coverage engine (Phase 2)
 * ---------------------------------------------------------------------------
 * Computes, per exam-blueprint topic, whether the app's content is
 *   covered  — every condition has a graded recommendation (for the selected
 *              society) AND at least one decision-support tool;
 *   partial  — some conditions are ungraded or lack tools;
 *   outdated — a covering guideline has been superseded in the registry;
 *   missing  — no condition is mapped to the topic.
 *
 * The result drives the Coverage heatmap and the weighted "exam readiness" %.
 */
import { conditions } from '../data/conditions';
import { guidelines, guidelinesForCondition, matchesSociety } from '../data/guidelines';
import { blueprintTopics, type Blueprint, type BlueprintTopic } from '../data/blueprint';
import { isToolWired } from '../data/toolWiring';
import type { SocietyView } from '../context/SocietyContext';

export type CoverageStatus = 'missing' | 'partial' | 'outdated' | 'covered';

export interface ConditionCoverage {
  conditionId: string;
  name: string;
  graded: boolean;
  hasTools: boolean;
  hasImaging: boolean;
  sourced: boolean;
  guidelineIds: string[];
}

export interface TopicCoverage {
  id: string;
  title: string;
  weight: number;
  status: CoverageStatus;
  score: number;
  conditions: ConditionCoverage[];
  gradedCount: number;
  totalCount: number;
  hasToolsCount: number;
  /** Fraction of this topic's conditions that have a wired/available tool. */
  tooledFraction: number;
  supersededGuidelineIds: string[];
}

export interface CoverageReport {
  topics: TopicCoverage[];
  /** Weighted evidence coverage: fraction of the blueprint whose recommendations are graded. */
  readiness: number;
  /** Weighted tooling coverage: fraction of conditions that have a decision-support tool. */
  tooling: number;
  counts: Record<CoverageStatus, number>;
  /** Topics that are not fully covered, worst-first by weight. */
  gaps: TopicCoverage[];
}

/** Relative score contributed to readiness by each status. */
export const STATUS_SCORE: Record<CoverageStatus, number> = {
  covered: 1,
  partial: 0.5,
  outdated: 0.25,
  missing: 0,
};

export const STATUS_LABEL: Record<CoverageStatus, string> = {
  covered: 'Covered',
  partial: 'Partial',
  outdated: 'Outdated',
  missing: 'Missing',
};

/** Guideline ids that a newer guideline in the registry supersedes. */
export const SUPERSEDED_IDS = new Set(guidelines.flatMap((g) => g.supersedes ?? []));

const conditionsById = new Map(conditions.map((c) => [c.id, c]));

function isGraded(guideline: (typeof guidelines)[number], society: SocietyView): boolean {
  return guideline.recommendations.some((r) => {
    if (society === 'AHA/ACC') return !!r.accClass;
    if (society === 'ESC') return !!r.escClass;
    return !!r.escClass || !!r.accClass;
  });
}

function computeConditionCoverage(conditionId: string, society: SocietyView): ConditionCoverage | null {
  const condition = conditionsById.get(conditionId);
  if (!condition) return null;

  const covering = guidelinesForCondition(conditionId).filter((g) => matchesSociety(g, society));

  return {
    conditionId,
    name: condition.name,
    graded: covering.some((g) => isGraded(g, society)),
    hasTools: !!condition.clinicalTools || isToolWired(conditionId),
    hasImaging: !!condition.imaging || (condition.ekgFindings?.length ?? 0) > 0,
    sourced: !!condition.source,
    guidelineIds: covering.map((g) => g.id),
  };
}

export function computeTopicCoverage(topic: BlueprintTopic, society: SocietyView): TopicCoverage {
  const conditionCoverages = topic.conditionIds
    .map((id) => computeConditionCoverage(id, society))
    .filter((c): c is ConditionCoverage => c !== null);

  const supersededGuidelineIds = topic.guidelineIds.filter((id) => SUPERSEDED_IDS.has(id));

  let status: CoverageStatus;
  if (conditionCoverages.length === 0) {
    status = 'missing';
  } else if (supersededGuidelineIds.length > 0) {
    status = 'outdated';
  } else if (conditionCoverages.every((c) => c.graded)) {
    // "Covered" = every condition has graded recommendations for the selected society.
    // Tool availability is reported separately (tooledFraction / report.tooling).
    status = 'covered';
  } else {
    status = 'partial';
  }

  const hasToolsCount = conditionCoverages.filter((c) => c.hasTools).length;

  return {
    id: topic.id,
    title: topic.title,
    weight: topic.weight,
    status,
    score: STATUS_SCORE[status],
    conditions: conditionCoverages,
    gradedCount: conditionCoverages.filter((c) => c.graded).length,
    totalCount: conditionCoverages.length,
    hasToolsCount,
    tooledFraction: conditionCoverages.length > 0 ? hasToolsCount / conditionCoverages.length : 0,
    supersededGuidelineIds,
  };
}

export function computeCoverage(blueprint: Blueprint, society: SocietyView): CoverageReport {
  const topics = blueprintTopics(blueprint).map((t) => computeTopicCoverage(t, society));

  const totalWeight = topics.reduce((sum, t) => sum + t.weight, 0) || 1;
  const readiness = Math.round((topics.reduce((sum, t) => sum + t.weight * t.score, 0) / totalWeight) * 100);
  const tooling = Math.round((topics.reduce((sum, t) => sum + t.weight * t.tooledFraction, 0) / totalWeight) * 100);

  const counts: Record<CoverageStatus, number> = { covered: 0, partial: 0, outdated: 0, missing: 0 };
  for (const t of topics) counts[t.status] += 1;

  const gaps = topics
    .filter((t) => t.status !== 'covered')
    .sort((a, b) => b.weight - a.weight);

  return { topics, readiness, tooling, counts, gaps };
}
