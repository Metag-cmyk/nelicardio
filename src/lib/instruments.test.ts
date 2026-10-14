import { describe, it, expect } from 'vitest';
import {
  instruments,
  instrumentsMap,
  evaluateScore,
  resolveBand,
  autoSelectCriteria,
  exclusiveGroupOf,
  type Band,
} from './instruments';

const evaluate = (id: string, ids: string[]) => evaluateScore(instrumentsMap.get(id)!, ids);

describe('evaluateScore — published worked examples', () => {
  it('CHA₂DS₂-VA: CHF + HTN + age ≥75 + diabetes = 5 (high)', () => {
    const r = evaluate('cha2ds2-va', ['chf', 'htn', 'age75', 'diabetes']);
    expect(r.total).toBe(5);
    expect(r.band?.risk).toBe('high');
  });

  it('CHA₂DS₂-VA: score of 1 is “consider” (moderate)', () => {
    const r = evaluate('cha2ds2-va', ['htn']);
    expect(r.total).toBe(1);
    expect(r.band?.risk).toBe('moderate');
  });

  it('CHA₂DS₂-VASc: includes the female sex category', () => {
    const r = evaluate('cha2ds2-vasc', ['female', 'htn']);
    expect(r.total).toBe(2);
  });

  it('HAS-BLED: three criteria = 3 (high bleeding risk)', () => {
    const r = evaluate('has-bled', ['h', 'r', 's']);
    expect(r.total).toBe(3);
    expect(r.band?.risk).toBe('high');
  });

  it('HEART: 2+2+2+2 = 8 (high)', () => {
    const r = evaluate('heart', ['hist-high', 'ecg-st', 'age65', 'trop2']);
    expect(r.total).toBe(8);
    expect(r.band?.risk).toBe('high');
  });

  it('TIMI UA/NSTEMI: all seven criteria = 7 (high)', () => {
    const r = evaluate('timi-nstemi', ['age65', 'risk3', 'cad', 'asa', 'angina', 'st', 'biomarker']);
    expect(r.total).toBe(7);
    expect(r.band?.risk).toBe('high');
  });

  it('Wells PE: DVT signs alone = 3 (unlikely); +PE likely = 6 (likely)', () => {
    expect(evaluate('wells-pe', ['dvt']).band?.label).toBe('PE unlikely');
    expect(evaluate('wells-pe', ['dvt', 'likely']).band?.label).toBe('PE likely');
  });

  it('sPESI: age >80 alone flips to high risk', () => {
    expect(evaluate('spesi', []).band?.risk).toBe('low');
    expect(evaluate('spesi', ['age80']).band?.risk).toBe('high');
  });

  it('H2FPEF: Heaviness + AF = 5 (intermediate)', () => {
    const r = evaluate('h2fpef', ['heavy', 'af']);
    expect(r.total).toBe(5);
    expect(r.band?.risk).toBe('moderate');
  });

  it('Schwartz: QTc ≥480 + syncope with stress = 5 (high), with group totals', () => {
    const r = evaluate('schwartz-lqts', ['qtc480', 'syncope-stress']);
    expect(r.total).toBe(5);
    expect(r.band?.risk).toBe('high');
    expect(r.groupTotals.find((g) => g.group === 'ECG')?.total).toBe(3);
  });
});

describe('resolveBand', () => {
  const bands: Band[] = [
    { min: 0, max: 1, label: 'low', risk: 'low' },
    { min: 2, max: 4, label: 'mid', risk: 'moderate' },
    { min: 5, max: 9, label: 'high', risk: 'high' },
  ];

  it('matches lower and upper boundaries inclusively', () => {
    expect(resolveBand(bands, 0)?.label).toBe('low');
    expect(resolveBand(bands, 1)?.label).toBe('low');
    expect(resolveBand(bands, 2)?.label).toBe('mid');
    expect(resolveBand(bands, 4)?.label).toBe('mid');
    expect(resolveBand(bands, 5)?.label).toBe('high');
  });

  it('returns null when no band matches', () => {
    expect(resolveBand([{ min: 0, max: 1, label: 'x', risk: 'low' }], 5)).toBeNull();
  });
});

describe('autoSelectCriteria', () => {
  it('auto-selects age bands', () => {
    const cha = instrumentsMap.get('cha2ds2-va')!;
    expect(autoSelectCriteria(cha, { age: '80' })).toContain('age75');
    expect(autoSelectCriteria(cha, { age: '70' })).toContain('age65');
    expect(autoSelectCriteria(cha, { age: '40' })).not.toContain('age65');
  });

  it('auto-selects the female sex category where present', () => {
    const vasc = instrumentsMap.get('cha2ds2-vasc')!;
    expect(autoSelectCriteria(vasc, { age: '40', gender: 'Female' })).toContain('female');
    expect(autoSelectCriteria(vasc, { age: '40', gender: 'Male' })).not.toContain('female');
  });

  it('auto-selects troponin bands from labs', () => {
    const heart = instrumentsMap.get('heart')!;
    expect(autoSelectCriteria(heart, { labs: { troponin: '100' } })).toContain('trop2');
    expect(autoSelectCriteria(heart, { labs: { troponin: '20' } })).toContain('trop1');
    expect(autoSelectCriteria(heart, { labs: { troponin: '5' } })).not.toContain('trop1');
  });
});

describe('instrument registry integrity', () => {
  it('has unique ids', () => {
    const ids = instruments.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every score criteria and ordered bands', () => {
    for (const i of instruments) {
      if (i.kind !== 'score') continue;
      expect(i.criteria?.length, i.id).toBeGreaterThan(0);
      expect(i.bands?.length, i.id).toBeGreaterThan(0);
      for (const b of i.bands!) expect(b.min, i.id).toBeLessThanOrEqual(b.max);
    }
  });

  it('gives every classification options', () => {
    for (const i of instruments) {
      if (i.kind !== 'classification') continue;
      expect(i.options?.length, i.id).toBeGreaterThan(0);
    }
  });

  it('records a source note on every instrument', () => {
    for (const i of instruments) expect(i.sourceNote.length, i.id).toBeGreaterThan(0);
  });

  it('uses unique criterion ids within an instrument', () => {
    for (const i of instruments) {
      const ids = (i.criteria ?? []).map((c) => c.id);
      expect(new Set(ids).size, i.id).toBe(ids.length);
    }
  });
});

describe('Phase 3b instruments', () => {
  const evaluate = (id: string, ids: string[]) => evaluateScore(instrumentsMap.get(id)!, ids);

  it('GRACE: age 70–79 + HR 110–149 + SBP 100–119 + Killip II + ST deviation = 190 (high)', () => {
    const r = evaluate('grace', ['age70', 'hr110', 'sbp100', 'killip2', 'st']);
    expect(r.total).toBe(75 + 24 + 43 + 20 + 28);
    expect(r.band?.risk).toBe('high');
  });

  it('GRACE auto-fills the age band from the patient profile', () => {
    const grace = instrumentsMap.get('grace')!;
    expect(autoSelectCriteria(grace, { age: '72' })).toContain('age70');
  });

  it('Revised Geneva: prior VTE + leg pain + HR ≥95 = 11 (high)', () => {
    const r = evaluate('geneva-pe', ['prior', 'legpain', 'hr95']);
    expect(r.total).toBe(11);
    expect(r.band?.risk).toBe('high');
  });

  it('YEARS: no items vs ≥1 item', () => {
    expect(evaluate('years-pe', []).band?.label).toBe('0 YEARS items');
    expect(evaluate('years-pe', ['dvt']).band?.label).toBe('≥1 YEARS item');
  });

  it('Hestia: any positive criterion excludes outpatient management', () => {
    expect(evaluate('hestia-pe', []).band?.risk).toBe('low');
    expect(evaluate('hestia-pe', ['oxygen']).band?.risk).toBe('high');
  });

  it('Shanghai: spontaneous type 1 alone = 3.5 (probable); syncope alone = 2 (possible)', () => {
    expect(evaluate('shanghai-brugada', ['spont1']).band?.risk).toBe('high');
    expect(evaluate('shanghai-brugada', ['syncope']).band?.risk).toBe('moderate');
  });

  it('HFA-PEFF caps each domain at 2 points', () => {
    // Three functional majors (6 raw) must cap to 2.
    const capped = evaluate('hfa-peff', ['fn-e', 'fn-ee', 'fn-tr']);
    expect(capped.total).toBe(2);
    expect(capped.groupTotals.find((g) => g.group === 'Functional')?.total).toBe(2);

    // One major in each of the three domains = 6 (definite).
    const definite = evaluate('hfa-peff', ['fn-e', 'mo-lavi', 'bi-np']);
    expect(definite.total).toBe(6);
    expect(definite.band?.risk).toBe('high');
  });

  it('exposes exclusive groups for single-choice variables', () => {
    const grace = instrumentsMap.get('grace')!;
    expect(exclusiveGroupOf(grace, 'age70')).toBe('age');
    expect(exclusiveGroupOf(grace, 'st')).toBeUndefined();
  });
});
