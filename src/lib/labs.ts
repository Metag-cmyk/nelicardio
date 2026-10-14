import type { Condition } from '../data/conditions';

export type LabEntry = NonNullable<Condition['labDeviations']>[number];
export type LabDirection = '↑' | '↓' | '±';

/**
 * Effective direction of a lab deviation. Uses the authored `direction` when
 * present, otherwise infers it from the value text so every lab renders with an
 * arrow.
 */
export function labDirection(lab: LabEntry): LabDirection {
  if (lab.direction) return lab.direction;
  const v = lab.value.toLowerCase();
  if (/(↑|elev|high|raised|increas|\bpositive\b|prolong|polycythaemia)/.test(v)) return '↑';
  if (/(↓|\blow\b|reduc|decreas|negative|\bshort\b|hypo)/.test(v)) return '↓';
  return '±';
}
