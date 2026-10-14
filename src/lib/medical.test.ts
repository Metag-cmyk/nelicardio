import { describe, it, expect } from 'vitest';
import { calculateAnionGap, calculateBsa, calculateBmi, calculateGfr, apixabanReductionCriteria } from './medical';

describe('calculateGfr', () => {
  it('calculates GFR correctly for a standard male', () => {
    // Age 50, Weight 70kg, Creatinine 100 umol/L, Male
    // ((140 - 50) * 70) / (72 * (100 / 88.4)) = 6300 / 81.447... = 77.349... -> 77
    expect(calculateGfr('50', '70', '100', 'Male')).toBe(77);
  });

  it('calculates GFR correctly for a standard female', () => {
    // Age 50, Weight 70kg, Creatinine 100 umol/L, Female
    // 77.349... * 0.85 = 65.746... -> 66
    expect(calculateGfr('50', '70', '100', 'Female')).toBe(66);
  });

  it('calculates GFR correctly with creatinine exactly 88.4 (1.0 mg/dL)', () => {
    // Age 20, Weight 80kg, Creatinine 88.4 umol/L, Male
    // ((140 - 20) * 80) / (72 * 1) = 9600 / 72 = 133.333... -> 133
    expect(calculateGfr('20', '80', '88.4', 'Male')).toBe(133);
  });

  it('returns null if age is non-numeric', () => {
    expect(calculateGfr('abc', '70', '100', 'Male')).toBeNull();
  });

  it('returns null if weight is non-numeric', () => {
    expect(calculateGfr('50', 'xyz', '100', 'Male')).toBeNull();
  });

  it('returns null if creatinine is non-numeric', () => {
    expect(calculateGfr('50', '70', 'def', 'Male')).toBeNull();
  });

  it('returns null if any input is an empty string', () => {
    expect(calculateGfr('', '70', '100', 'Male')).toBeNull();
    expect(calculateGfr('50', '', '100', 'Male')).toBeNull();
    expect(calculateGfr('50', '70', '', 'Male')).toBeNull();
  });

  it('returns null if creatinine is zero or negative', () => {
    expect(calculateGfr('50', '70', '0', 'Male')).toBeNull();
    expect(calculateGfr('50', '70', '-10', 'Male')).toBeNull();
  });
});

describe('calculateAnionGap', () => {
  it('calculates the anion gap correctly with normal values', () => {
    // Normal values: Na=140, Cl=104, HCO3=24. AG = 140 - (104 + 24) = 12
    expect(calculateAnionGap('140', '104', '24')).toBe(12);
  });

  it('rounds the result correctly', () => {
    // Na=140.5, Cl=104.2, HCO3=24.1. AG = 140.5 - (104.2 + 24.1) = 140.5 - 128.3 = 12.2 -> 12
    expect(calculateAnionGap('140.5', '104.2', '24.1')).toBe(12);
    // Na=140.8, Cl=104.1, HCO3=24.1. AG = 140.8 - 128.2 = 12.6 -> 13
    expect(calculateAnionGap('140.8', '104.1', '24.1')).toBe(13);
  });

  it('handles negative values correctly if provided', () => {
    expect(calculateAnionGap('140', '100', '-5')).toBe(45);
  });

  it('returns null if any input is missing or empty', () => {
    expect(calculateAnionGap('', '104', '24')).toBeNull();
    expect(calculateAnionGap('140', '', '24')).toBeNull();
    expect(calculateAnionGap('140', '104', '')).toBeNull();
  });

  it('returns null if any input is non-numeric', () => {
    expect(calculateAnionGap('abc', '104', '24')).toBeNull();
    expect(calculateAnionGap('140', 'xyz', '24')).toBeNull();
    expect(calculateAnionGap('140', '104', 'def')).toBeNull();
  });

  it('returns null if all inputs are invalid', () => {
    expect(calculateAnionGap('abc', 'xyz', 'def')).toBeNull();
  });
});

describe('calculateBsa', () => {
  it('should calculate BSA for standard adult', () => {
    // 70kg, 170cm -> sqrt(70 * 170 / 3600) -> sqrt(11900 / 3600) -> sqrt(3.3055) -> 1.818
    const bsa = calculateBsa('70', '170');
    expect(bsa).toBeCloseTo(1.818, 3);
  });

  it('should calculate BSA for a newborn/infant', () => {
    // 3kg, 50cm -> sqrt(3 * 50 / 3600) -> sqrt(150 / 3600) -> sqrt(0.04166) -> 0.204
    const bsa = calculateBsa('3', '50');
    expect(bsa).toBeCloseTo(0.204, 3);
  });

  it('should calculate BSA for extreme obesity', () => {
    // 150kg, 160cm -> sqrt(150 * 160 / 3600) -> sqrt(24000 / 3600) -> sqrt(6.666) -> 2.5819
    const bsa = calculateBsa('150', '160');
    expect(bsa).toBeCloseTo(2.582, 3);
  });

  it('should return null for non-numeric weight', () => {
    expect(calculateBsa('abc', '170')).toBeNull();
  });

  it('should return null for non-numeric height', () => {
    expect(calculateBsa('70', 'abc')).toBeNull();
  });

  it('should return null for negative weight', () => {
    expect(calculateBsa('-70', '170')).toBeNull();
  });

  it('should return null for negative height', () => {
    expect(calculateBsa('70', '-170')).toBeNull();
  });

  it('should return null for zero weight', () => {
    expect(calculateBsa('0', '170')).toBeNull();
  });

  it('should return null for zero height', () => {
    expect(calculateBsa('70', '0')).toBeNull();
  });
});

describe('calculateBmi', () => {
  it('calculates BMI correctly for valid inputs', () => {
    // 70kg, 175cm -> 70 / (1.75 * 1.75) = 22.857...
    const result = calculateBmi('70', '175');
    expect(result).toBeCloseTo(22.857, 3);
  });

  it('returns null if weight is empty', () => {
    expect(calculateBmi('', '175')).toBeNull();
  });

  it('returns null if height is empty', () => {
    expect(calculateBmi('70', '')).toBeNull();
  });

  it('returns null if inputs are not numeric', () => {
    expect(calculateBmi('abc', '175')).toBeNull();
    expect(calculateBmi('70', 'xyz')).toBeNull();
  });

  it('returns null if height is 0 (prevents division by zero)', () => {
    expect(calculateBmi('70', '0')).toBeNull();
  });
});

describe('apixabanReductionCriteria (unit-safe)', () => {
  it('does NOT reduce for a standard patient', () => {
    const r = apixabanReductionCriteria({ age: '65', weightKg: '80', creatinineUmol: '80' });
    expect(r.met).toBe(0);
    expect(r.reduce).toBe(false);
  });

  it('reduces when 2 of 3 criteria are met (age + weight)', () => {
    const r = apixabanReductionCriteria({ age: '82', weightKg: '55', creatinineUmol: '80' });
    expect(r.met).toBe(2);
    expect(r.reduce).toBe(true);
  });

  it('treats the creatinine criterion in µmol/L (133 µmol/L ≈ 1.5 mg/dL)', () => {
    const below = apixabanReductionCriteria({ age: '70', weightKg: '80', creatinineUmol: '120' });
    const above = apixabanReductionCriteria({ age: '70', weightKg: '80', creatinineUmol: '140' });
    expect(below.reasons).not.toContain('Creatinine ≥ 1.5 mg/dL (≥ 133 µmol/L)');
    expect(above.reasons).toContain('Creatinine ≥ 1.5 mg/dL (≥ 133 µmol/L)');
  });

  it('does not reduce with only 1 criterion', () => {
    const r = apixabanReductionCriteria({ age: '82', weightKg: '80', creatinineUmol: '80' });
    expect(r.met).toBe(1);
    expect(r.reduce).toBe(false);
  });
});
