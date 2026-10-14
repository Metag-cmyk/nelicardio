import { describe, it, expect } from 'vitest';
import {
  splitTopLevel,
  parseRangeToken,
  resolveScoreInterpretation,
  autoSelectCriteria,
  type InterpretationBand,
} from './scores';

describe('splitTopLevel', () => {
  it('does not split inside parentheses', () => {
    expect(splitTopLevel('0-1 (M/F)')).toEqual(['0-1 (M/F)']);
  });

  it('splits sex-specific compound ranges', () => {
    expect(splitTopLevel('≥1 (M) / ≥2 (F)')).toEqual(['≥1 (M) ', ' ≥2 (F)']);
  });

  it('splits unparseable compound ranges', () => {
    expect(splitTopLevel('2 Major / 1 Major + 3 Minor')).toEqual(['2 Major ', ' 1 Major + 3 Minor']);
  });
});

describe('parseRangeToken', () => {
  it('parses inclusive lower bounds and sex qualifiers', () => {
    expect(parseRangeToken('≥1 (M)')).toMatchObject({ min: 1, max: Number.POSITIVE_INFINITY, sex: 'Male' });
  });

  it('parses "(M/F)" as sex-agnostic', () => {
    expect(parseRangeToken('0-1 (M/F)')).toMatchObject({ min: 0, max: 1, sex: undefined });
  });

  it('normalises strict inequalities for integer scores', () => {
    expect(parseRangeToken('> 8')).toMatchObject({ min: 9 });
    expect(parseRangeToken('< 5')).toMatchObject({ max: 4 });
    expect(parseRangeToken('≥ 8')).toMatchObject({ min: 8 });
  });

  it('parses plain ranges and exact values', () => {
    expect(parseRangeToken('3-4')).toMatchObject({ min: 3, max: 4 });
    expect(parseRangeToken('0')).toMatchObject({ min: 0, max: 0 });
  });

  it('returns null for non-numeric tokens', () => {
    expect(parseRangeToken('2 Major')).toBeNull();
    expect(parseRangeToken('IIa')).toBeNull();
  });
});

describe('resolveScoreInterpretation', () => {
  const cha: InterpretationBand[] = [
    { range: '0-1 (M/F)', risk: 'Low' },
    { range: '≥1 (M) / ≥2 (F)', risk: 'Moderate-High' },
  ];

  it('selects the numeric band for a plain range', () => {
    expect(resolveScoreInterpretation(cha, 0)?.risk).toBe('Low');
  });

  it('honours sex-specific bands', () => {
    const maleBands: InterpretationBand[] = [{ range: '≥1 (M) / ≥2 (F)', risk: 'Moderate-High' }];
    const femaleBands: InterpretationBand[] = maleBands;
    expect(resolveScoreInterpretation(maleBands, 1, 'Male')?.risk).toBe('Moderate-High');
    expect(resolveScoreInterpretation(femaleBands, 1, 'Female')).toBeNull();
    expect(resolveScoreInterpretation(femaleBands, 2, 'Female')?.risk).toBe('Moderate-High');
  });

  it('matches TIMI-style bands', () => {
    const timi: InterpretationBand[] = [
      { range: '0-2', risk: 'Low' },
      { range: '3-4', risk: 'Intermediate' },
      { range: '≥5', risk: 'High' },
    ];
    expect(resolveScoreInterpretation(timi, 4)?.risk).toBe('Intermediate');
    expect(resolveScoreInterpretation(timi, 7)?.risk).toBe('High');
  });

  it('returns null (no wrong risk) for non-numeric scores', () => {
    const duke: InterpretationBand[] = [
      { range: '2 Major / 1 Major + 3 Minor', risk: 'Definite IE' },
      { range: '1 Major + 1 Minor / 3 Minor', risk: 'Possible IE' },
    ];
    expect(resolveScoreInterpretation(duke, 3)).toBeNull();
    const killip: InterpretationBand[] = [
      { range: 'I', risk: '6%' },
      { range: 'IV', risk: '81%' },
    ];
    expect(resolveScoreInterpretation(killip, 3)).toBeNull();
  });
});

describe('autoSelectCriteria', () => {
  const criteria = [
    { label: 'Age ≥ 75 years' },
    { label: 'Age 65-74 years' },
    { label: 'Sex Category (Female)' },
    { label: 'Hypertension' },
  ];

  it('auto-selects the ≥75 band', () => {
    expect(autoSelectCriteria(criteria, { age: '80', gender: 'Male' })).toEqual(['Age ≥ 75 years']);
  });

  it('auto-selects the 65-74 band', () => {
    expect(autoSelectCriteria(criteria, { age: '70', gender: 'Male' })).toEqual(['Age 65-74 years']);
  });

  it('auto-selects female sex', () => {
    expect(autoSelectCriteria(criteria, { age: '40', gender: 'Female' })).toContain('Sex Category (Female)');
  });

  it('selects nothing for a young male', () => {
    expect(autoSelectCriteria(criteria, { age: '40', gender: 'Male' })).toEqual([]);
  });
});
