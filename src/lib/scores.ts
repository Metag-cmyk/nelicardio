/**
 * NeliCardio Score Interpretation Resolver
 * ---------------------------------------------------------------------------
 * Robustly maps a computed numeric score onto an interpretation band.
 *
 * Replaces the previous brittle `range.includes('+')` parsing which
 * mis-assigned bands for scores with compound or sex-specific ranges such as
 *   - CHA2DS2-VASc: "≥1 (M) / ≥2 (F)"
 *   - Duke criteria: "2 Major / 1 Major + 3 Minor"
 *   - Killip:        "I", "IV"
 *
 * When a band cannot be evaluated numerically the resolver returns `null`, so
 * the UI can show reference thresholds instead of a wrong risk label.
 */

export type ScoreGender = 'Male' | 'Female';

export interface InterpretationBand {
  range: string;
  risk: string;
  recommendation?: string;
}

interface Predicate {
  min: number;
  max: number;
  sex?: ScoreGender;
}

/** Split on "/" but never inside parentheses (protects "(M/F)"). */
export function splitTopLevel(input: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of input) {
    if (ch === '(') depth += 1;
    if (ch === ')') depth = Math.max(0, depth - 1);
    if (ch === '/' && depth === 0) {
      out.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  out.push(current);
  return out;
}

/** Parse a single range token into a numeric predicate, or null if not numeric. */
export function parseRangeToken(token: string): Predicate | null {
  const trimmed = token.trim();
  if (!trimmed) return null;

  const sexMatch = trimmed.match(/\(\s*(M|F|M\s*\/\s*F)\s*\)/i);
  let sex: ScoreGender | undefined;
  if (sexMatch) {
    const s = sexMatch[1].replace(/\s/g, '').toUpperCase();
    if (s === 'M') sex = 'Male';
    else if (s === 'F') sex = 'Female';
  }

  const body = trimmed.replace(/\(.*?\)/g, '').replace(/\s+/g, ' ').trim();

  // Point scores are integer totals, so strict ">" / "<" are normalised to
  // the equivalent inclusive bound (e.g. "> 8" ⇒ "≥ 9").
  let m = body.match(/^(≥|>=|>)\s*(\d+(?:\.\d+)?)/);
  if (m) {
    const strict = m[1] === '>';
    const n = parseFloat(m[2]);
    return { min: strict ? n + 1 : n, max: Number.POSITIVE_INFINITY, sex };
  }

  m = body.match(/^(≤|<=|<)\s*(\d+(?:\.\d+)?)/);
  if (m) {
    const strict = m[1] === '<';
    const n = parseFloat(m[2]);
    return { min: Number.NEGATIVE_INFINITY, max: strict ? n - 1 : n, sex };
  }

  m = body.match(/^(\d+(?:\.\d+)?)\s*[-–—]\s*(\d+(?:\.\d+)?)$/);
  if (m) return { min: parseFloat(m[1]), max: parseFloat(m[2]), sex };

  m = body.match(/^(\d+(?:\.\d+)?)$/);
  if (m) return { min: parseFloat(m[1]), max: parseFloat(m[1]), sex };

  return null;
}

/**
 * Return the first interpretation band that applies to `score`, or null when
 * no band can be evaluated numerically.
 */
export function resolveScoreInterpretation(
  bands: InterpretationBand[],
  score: number,
  gender?: ScoreGender,
): InterpretationBand | null {
  for (const band of bands) {
    for (const token of splitTopLevel(band.range)) {
      const predicate = parseRangeToken(token);
      if (!predicate) continue;
      if (predicate.sex && gender && predicate.sex !== gender) continue;
      if (score >= predicate.min && score <= predicate.max) return band;
    }
  }
  return null;
}

export interface AutoSelectPatient {
  age?: string;
  gender?: string;
}

/**
 * Pure auto-fill: which criteria labels should be pre-selected from the patient
 * profile (age / sex). Extracted from the component so it has no side effects.
 */
export function autoSelectCriteria(
  criteria: { label: string }[],
  patient: AutoSelectPatient,
): string[] {
  const age = patient.age !== undefined ? parseInt(patient.age) : Number.NaN;
  const selected: string[] = [];

  for (const criterion of criteria) {
    const label = criterion.label.toLowerCase();
    const isAge = label.includes('age');

    if (isAge && label.includes('75') && !Number.isNaN(age) && age >= 75) {
      selected.push(criterion.label);
    } else if (
      isAge && label.includes('65') && label.includes('74') &&
      !Number.isNaN(age) && age >= 65 && age < 75
    ) {
      selected.push(criterion.label);
    }

    if (label.includes('female') && patient.gender === 'Female') {
      selected.push(criterion.label);
    }
  }

  return selected;
}
