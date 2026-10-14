import { conditions, type Condition } from '../../data/conditions';
import { examTopics } from '../../data/exam';
import { labDirection } from '../labs';
import { treatmentRationale } from '../../data/treatmentRationale';

/**
 * Depth audit — separate from coverage.
 * Coverage asks "is there an answer?"; depth asks "how mechanistic is the
 * pathogenesis, and is the clinic/lab/treatment layer present?".
 */
export type DepthLevel = 'deep' | 'adequate' | 'shallow' | 'missing';

const OVERVIEW_MIN = 120;

export interface ConditionDepth {
  id: string;
  name: string;
  category: string;
  /** Number of ordered pathogenesis steps (the focus metric). */
  steps: number;
  overviewChars: number;
  signs: number;
  labs: number;
  labsWithDirection: number;
  rationale: boolean;
  level: DepthLevel;
}

function levelFor(steps: number, overviewChars: number): DepthLevel {
  if (steps >= 3) return 'deep';
  if (steps >= 1) return 'adequate';
  if (overviewChars >= OVERVIEW_MIN) return 'adequate';
  if (overviewChars > 0) return 'shallow';
  return 'missing';
}

export function auditConditionDepth(c: Condition): ConditionDepth {
  const steps = c.pathogenesis?.length ?? 0;
  const overviewChars = c.pathophysiology?.length ?? 0;
  const labs = c.labDeviations?.length ?? 0;
  return {
    id: c.id,
    name: c.name,
    category: c.category,
    steps,
    overviewChars,
    signs: c.signs?.length ?? 0,
    labs,
    labsWithDirection: (c.labDeviations ?? []).filter((l) => labDirection(l)).length,
    rationale: (c.management.rationale?.length ?? 0) > 0 || (treatmentRationale[c.id]?.length ?? 0) > 0,
    level: levelFor(steps, overviewChars),
  };
}

export interface DepthSummary {
  total: number;
  byLevel: Record<DepthLevel, number>;
  noSteps: number;
  noSigns: number;
  noLabs: number;
  noRationale: number;
}

export interface TopicDepth {
  id: string;
  code: string;
  title: string;
  conditionIds: string[];
  level: DepthLevel;
  weakest: string;
}

const ORDER: DepthLevel[] = ['deep', 'adequate', 'shallow', 'missing'];

export function auditDepth() {
  const rows = conditions.map(auditConditionDepth);
  const byLevel: Record<DepthLevel, number> = { deep: 0, adequate: 0, shallow: 0, missing: 0 };
  for (const r of rows) byLevel[r.level] += 1;

  const summary: DepthSummary = {
    total: rows.length,
    byLevel,
    noSteps: rows.filter((r) => r.steps === 0).length,
    noSigns: rows.filter((r) => r.signs === 0).length,
    noLabs: rows.filter((r) => r.labs === 0).length,
    noRationale: rows.filter((r) => !r.rationale).length,
  };

  const byId = new Map(rows.map((r) => [r.id, r]));
  const topicDepth: TopicDepth[] = examTopics.map((t) => {
    const linked = t.links.conditionIds.map((id) => byId.get(id)).filter((c): c is ConditionDepth => Boolean(c));
    if (linked.length === 0) {
      return { id: t.id, code: t.code, title: t.title, conditionIds: [], level: 'missing' as DepthLevel, weakest: 'авторска бележка' };
    }
    let weakest = linked[0];
    for (const c of linked) if (ORDER.indexOf(c.level) > ORDER.indexOf(weakest.level)) weakest = c;
    return { id: t.id, code: t.code, title: t.title, conditionIds: t.links.conditionIds, level: weakest.level, weakest: weakest.name };
  });

  return { rows, summary, topicDepth };
}
