import { describe, it, expect } from 'vitest';
import {
  LAB_FIELD_UNITS,
  creatinineUmolToMgdl,
  creatinineMgdlToUmol,
  cholesterolMmolToMgdl,
  cholesterolMgdlToMmol,
  APIXABAN_SCR_UMOL,
  RENAL_IMPAIRMENT_UMOL,
  ntProBnpUpperLimit,
} from './units';
import type { LabState } from '../context/PatientContext';

describe('LAB_FIELD_UNITS integrity', () => {
  const expected: (keyof LabState)[] = [
    'troponin', 'bnp', 'k', 'mg', 'creatinine', 'ldl', 'ph',
    'pco2', 'hco3', 'po2', 'lactate', 'na', 'cl',
  ];

  it('declares a unit for every lab field', () => {
    expect(Object.keys(LAB_FIELD_UNITS).sort()).toEqual([...expected].sort());
  });

  it('uses canonical SI display units', () => {
    expect(LAB_FIELD_UNITS.creatinine).toBe('µmol/L');
    expect(LAB_FIELD_UNITS.ldl).toBe('mmol/L');
    expect(LAB_FIELD_UNITS.troponin).toBe('ng/L');
  });
});

describe('creatinine conversion (µmol/L ↔ mg/dL)', () => {
  it('converts 1.0 mg/dL to 88.4 µmol/L', () => {
    expect(creatinineMgdlToUmol(1)).toBeCloseTo(88.4, 5);
  });

  it('converts 88.4 µmol/L back to 1.0 mg/dL', () => {
    expect(creatinineUmolToMgdl(88.4)).toBeCloseTo(1, 5);
  });

  it('round-trips arbitrary values', () => {
    for (const v of [40, 80, 132.6, 500]) {
      expect(creatinineMgdlToUmol(creatinineUmolToMgdl(v))).toBeCloseTo(v, 6);
    }
  });
});

describe('cholesterol conversion (mmol/L ↔ mg/dL)', () => {
  it('converts 1.8 mmol/L to ~69.6 mg/dL', () => {
    expect(cholesterolMmolToMgdl(1.8)).toBeCloseTo(69.6, 1);
  });

  it('round-trips', () => {
    expect(cholesterolMgdlToMmol(cholesterolMmolToMgdl(2.6))).toBeCloseTo(2.6, 6);
  });
});

describe('guideline thresholds in canonical units', () => {
  it('expresses the Apixaban creatinine threshold (~133 µmol/L)', () => {
    expect(APIXABAN_SCR_UMOL).toBeCloseTo(132.6, 1);
  });

  it('is consistent with the renal-impairment flag', () => {
    expect(RENAL_IMPAIRMENT_UMOL).toBeGreaterThan(APIXABAN_SCR_UMOL);
  });
});

describe('ntProBnpUpperLimit (age-stratified)', () => {
  it('returns 125 for age < 50', () => expect(ntProBnpUpperLimit(30)).toBe(125));
  it('returns 250 for age 50–75', () => {
    expect(ntProBnpUpperLimit(50)).toBe(250);
    expect(ntProBnpUpperLimit(75)).toBe(250);
  });
  it('returns 450 for age > 75', () => expect(ntProBnpUpperLimit(80)).toBe(450));
  it('falls back to 450 for invalid age', () => expect(ntProBnpUpperLimit(Number.NaN)).toBe(450));
});
