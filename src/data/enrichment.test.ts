import { describe, it, expect } from 'vitest';
import { conditions } from './conditions';
import { complications } from './complications';
import { epiPrognosis } from './prognosis';
import { pitfalls } from './pitfalls';
import { treatmentRationale } from './treatmentRationale';

describe('content enrichment coverage', () => {
  const ids = conditions.map((c) => c.id);

  it('every condition has complications, epidemiology/prognosis, pitfalls and a rationale', () => {
    for (const id of ids) {
      expect(complications[id]?.length, `complications:${id}`).toBeGreaterThan(0);
      expect(epiPrognosis[id]?.epidemiology, `epidemiology:${id}`).toBeTruthy();
      expect(epiPrognosis[id]?.prognosis, `prognosis:${id}`).toBeTruthy();
      expect(pitfalls[id]?.length, `pitfalls:${id}`).toBeGreaterThan(0);
      expect(treatmentRationale[id]?.length, `rationale:${id}`).toBeGreaterThan(0);
    }
  });

  it('has no orphan keys', () => {
    const known = new Set(ids);
    for (const k of Object.keys(complications)) expect(known.has(k), `complications:${k}`).toBe(true);
    for (const k of Object.keys(epiPrognosis)) expect(known.has(k), `prognosis:${k}`).toBe(true);
    for (const k of Object.keys(pitfalls)) expect(known.has(k), `pitfalls:${k}`).toBe(true);
    for (const k of Object.keys(treatmentRationale)) expect(known.has(k), `rationale:${k}`).toBe(true);
  });
});
