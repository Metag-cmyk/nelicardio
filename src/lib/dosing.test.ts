import { describe, it, expect } from 'vitest';
import { rivaroxabanAf, dabigatranAf, edoxabanAf, enoxaparinDose } from './dosing';

describe('rivaroxaban (AF)', () => {
  it('standard dose at CrCl ≥50', () => {
    const r = rivaroxabanAf({ crCl: 80, age: 70, weightKg: 80 });
    expect(r.dose).toContain('20 mg');
    expect(r.reduce).toBe(false);
  });
  it('reduces to 15 mg at CrCl 15–49', () => {
    expect(rivaroxabanAf({ crCl: 40, age: 70, weightKg: 80 }).dose).toContain('15 mg');
  });
  it('is contraindicated below CrCl 15', () => {
    expect(rivaroxabanAf({ crCl: 10, age: 70, weightKg: 80 }).contraindicated).toBe(true);
  });
});

describe('dabigatran (AF)', () => {
  it('standard 150 mg BID without reduction criteria', () => {
    expect(dabigatranAf({ crCl: 80, age: 70, weightKg: 80 }).dose).toContain('150 mg');
  });
  it('reduces to 110 mg BID for CrCl 30–49', () => {
    expect(dabigatranAf({ crCl: 40, age: 70, weightKg: 80 }).dose).toContain('110 mg');
  });
  it('reduces for age ≥80 or a P-gp inhibitor', () => {
    expect(dabigatranAf({ crCl: 80, age: 82, weightKg: 80 }).dose).toContain('110 mg');
    expect(dabigatranAf({ crCl: 80, age: 70, weightKg: 80, pgpInhibitor: true }).dose).toContain('110 mg');
  });
  it('is contraindicated below CrCl 30', () => {
    expect(dabigatranAf({ crCl: 20, age: 70, weightKg: 80 }).contraindicated).toBe(true);
  });
});

describe('edoxaban (AF)', () => {
  it('standard 60 mg without criteria', () => {
    expect(edoxabanAf({ crCl: 70, age: 70, weightKg: 80 }).dose).toContain('60 mg');
  });
  it('reduces to 30 mg for renal impairment, low weight, or a P-gp inhibitor', () => {
    expect(edoxabanAf({ crCl: 40, age: 70, weightKg: 80 }).dose).toContain('30 mg');
    expect(edoxabanAf({ crCl: 70, age: 70, weightKg: 55 }).dose).toContain('30 mg');
    expect(edoxabanAf({ crCl: 70, age: 70, weightKg: 80, pgpInhibitor: true }).dose).toContain('30 mg');
  });
  it('flags reduced efficacy when CrCl >95', () => {
    expect(edoxabanAf({ crCl: 100, age: 60, weightKg: 80 }).contraindicated).toBe(true);
  });
});

describe('enoxaparin', () => {
  it('treatment dose is 1 mg/kg q12h with normal renal function', () => {
    expect(enoxaparinDose(80, 80, 'treatment').dose).toContain('every 12 hours');
  });
  it('treatment dose is reduced to once daily when CrCl <30', () => {
    expect(enoxaparinDose(80, 25, 'treatment').dose).toContain('once daily');
  });
  it('prophylaxis is 40 mg daily, reduced to 20 mg when CrCl <30', () => {
    expect(enoxaparinDose(80, 80, 'prophylaxis').dose).toContain('40 mg');
    expect(enoxaparinDose(80, 25, 'prophylaxis').dose).toContain('20 mg');
  });
  it('asks for data when weight is missing', () => {
    expect(enoxaparinDose(NaN, 80, 'treatment').dose).toBe('Enter data');
  });
});
