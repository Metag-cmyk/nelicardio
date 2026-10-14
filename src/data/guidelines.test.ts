import { describe, it, expect } from 'vitest';
import { guidelines, guidelinesMap, matchesSociety, guidelinesForCondition } from './guidelines';
import { conditions } from './conditions';

const conditionIds = new Set(conditions.map((c) => c.id));
const conditionCategoryIds = new Set(conditions.map((c) => c.category.toLowerCase()));

describe('guideline registry integrity', () => {
  it('has unique guideline ids', () => {
    const ids = guidelines.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has required metadata on every guideline', () => {
    for (const g of guidelines) {
      expect(g.title.length).toBeGreaterThan(0);
      expect(g.edition.length).toBeGreaterThan(0);
      expect(g.year).toBeGreaterThan(2000);
      expect(g.society.length).toBeGreaterThan(0);
      expect(Array.isArray(g.topics)).toBe(true);
      expect(g.summary.length).toBeGreaterThan(0);
    }
  });

  it('maps every topic to a known condition id', () => {
    const unknown: string[] = [];
    for (const g of guidelines) {
      for (const topic of g.topics) {
        if (!conditionIds.has(topic) && !conditionCategoryIds.has(topic)) unknown.push(`${g.id}:${topic}`);
      }
    }
    expect(unknown).toEqual([]);
  });

  it('marks a verifiedAt date on any verified guideline', () => {
    for (const g of guidelines) {
      if (g.status === 'verified') expect(g.verifiedAt).toBeTruthy();
    }
  });

  it('never lists a superseded id that equals the guideline itself', () => {
    for (const g of guidelines) {
      expect(g.supersedes ?? []).not.toContain(g.id);
    }
  });

  it('has unique recommendation ids within each guideline', () => {
    for (const g of guidelines) {
      const ids = g.recommendations.map((r) => r.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('never stores a recommendation without a class of recommendation', () => {
    const offenders: string[] = [];
    for (const g of guidelines) {
      for (const r of g.recommendations) {
        if (!r.escClass && !r.accClass) offenders.push(`${g.id}:${r.id}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('never stores a level of evidence without a class of recommendation', () => {
    const offenders: string[] = [];
    for (const g of guidelines) {
      for (const r of g.recommendations) {
        if (r.escLoe && !r.escClass) offenders.push(`ESC ${g.id}:${r.id}`);
        if (r.accLoe && !r.accClass) offenders.push(`ACC ${g.id}:${r.id}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe('guideline selectors', () => {
  it('exposes a map lookup', () => {
    expect(guidelinesMap.get('acc-2025-acs')?.year).toBe(2025);
  });

  it('matches societies including joint guidelines', () => {
    const vhd = guidelinesMap.get('esc-2025-vhd')!;
    expect(matchesSociety(vhd, 'ESC')).toBe(true);
    expect(matchesSociety(vhd, 'AHA/ACC')).toBe(false);
    expect(matchesSociety(vhd, 'both')).toBe(true);
  });

  it('finds guidelines covering a condition', () => {
    const covering = guidelinesForCondition('stemi').map((g) => g.id);
    expect(covering).toContain('acc-2025-acs');
    expect(covering).toContain('esc-2023-acs');
  });

  it('returns graded ACS recommendations sourced from the 2025 guideline', () => {
    const acs = guidelinesMap.get('acc-2025-acs')!;
    expect(acs.recommendations.length).toBeGreaterThan(0);
    const radial = acs.recommendations.find((r) => r.id === 'acs-radial');
    expect(radial?.accClass).toBe('I');
  });
});

describe('ESC grading pass (verified guidelines)', () => {
  const graded = [
    'esc-2023-acs',
    'esc-2024-af',
    'esc-2026-hf',
    'esc-2024-ccs',
    'esc-2023-endocarditis',
    'esc-2019-pe',
    'esc-2025-vhd',
    'esc-2022-va-scd',
    'esc-2025-myopericarditis',
    'esc-2020-achd',
    'esc-2024-pad-aorta',
    'esc-2025-lipids',
    'esc-2026-ckd',
    'esc-2026-cardiac-rehab',
    'esc-2025-pregnancy',
  ];

  it('has ESC-graded recommendations and is marked verified', () => {
    for (const id of graded) {
      const g = guidelinesMap.get(id);
      expect(g, id).toBeDefined();
      expect(g!.status, id).toBe('verified');
      expect(g!.verifiedAt, id).toBeTruthy();
      expect(g!.recommendations.length, id).toBeGreaterThan(0);
      expect(g!.recommendations.every((r) => r.escClass), id).toBe(true);
    }
  });

  it('captures the ESC 2023 ACS radial-access recommendation (I A)', () => {
    const radial = guidelinesMap.get('esc-2023-acs')!.recommendations.find((r) => r.id === 'acs-esc-radial');
    expect(radial?.escClass).toBe('I');
    expect(radial?.escLoe).toBe('A');
  });

  it('captures an ESC 2026 HF foundational therapy (I A)', () => {
    const sglt2 = guidelinesMap.get('esc-2026-hf')!.recommendations.find((r) => r.id === 'hf-esc-sglt2i');
    expect(sglt2?.escClass).toBe('I');
    expect(sglt2?.escLoe).toBe('A');
  });

  it('supports the revised ESC B1 level of evidence', () => {
    const arni = guidelinesMap.get('esc-2026-hf')!.recommendations.find((r) => r.id === 'hf-esc-switch-arni');
    expect(arni?.escLoe).toBe('B1');
  });

  it('captures the ESC 2024 AF anticoagulation recommendation (Class I)', () => {
    const oac = guidelinesMap.get('esc-2024-af')!.recommendations.find((r) => r.id === 'af-esc-oac');
    expect(oac?.escClass).toBe('I');
  });

  it('captures the ESC 2019 PE NOAC preference (I A)', () => {
    const noac = guidelinesMap.get('esc-2019-pe')!.recommendations.find((r) => r.id === 'pe-esc-noac');
    expect(noac?.escClass).toBe('I');
    expect(noac?.escLoe).toBe('A');
  });

  it('captures the ESC 2024 CCS LDL-C goal (I A)', () => {
    const ldl = guidelinesMap.get('esc-2024-ccs')!.recommendations.find((r) => r.id === 'ccs-esc-ldl');
    expect(ldl?.escClass).toBe('I');
    expect(ldl?.escLoe).toBe('A');
  });

  it('captures the ESC 2025 VHD TEER for secondary MR (I A)', () => {
    const teer = guidelinesMap.get('esc-2025-vhd')!.recommendations.find((r) => r.id === 'vhd-esc-teer-vsmr');
    expect(teer?.escClass).toBe('I');
    expect(teer?.escLoe).toBe('A');
  });

  it('captures the ESC 2022 VA/SCD secondary-prevention ICD (I A)', () => {
    const icd = guidelinesMap.get('esc-2022-va-scd')!.recommendations.find((r) => r.id === 'va-esc-icd-secondary');
    expect(icd?.escClass).toBe('I');
    expect(icd?.escLoe).toBe('A');
  });

  it('captures the ESC 2025 myopericarditis colchicine recommendation (I A)', () => {
    const colchicine = guidelinesMap.get('esc-2025-myopericarditis')!.recommendations.find((r) => r.id === 'mp-esc-colchicine');
    expect(colchicine?.escClass).toBe('I');
    expect(colchicine?.escLoe).toBe('A');
  });

  it('captures the ESC 2024 PAD/aortic AAA screening recommendation (I A)', () => {
    const screen = guidelinesMap.get('esc-2024-pad-aorta')!.recommendations.find((r) => r.id === 'pad-esc-aaa-screening');
    expect(screen?.escClass).toBe('I');
    expect(screen?.escLoe).toBe('A');
  });

  it('captures the ESC 2025 lipids primary-prevention threshold (I A)', () => {
    const rec = guidelinesMap.get('esc-2025-lipids')!.recommendations.find((r) => r.id === 'lipids-esc-primary-prevention');
    expect(rec?.escClass).toBe('I');
    expect(rec?.escLoe).toBe('A');
  });

  it('captures the ESC 2026 CKD ACEi/ARB + SGLT2 recommendation (Class I)', () => {
    const rec = guidelinesMap.get('esc-2026-ckd')!.recommendations.find((r) => r.id === 'ckd-esc-acei-arb-sglt2');
    expect(rec?.escClass).toBe('I');
  });

  it('captures the ESC 2026 cardiac-rehab telehealth recommendation (I B1)', () => {
    const rec = guidelinesMap.get('esc-2026-cardiac-rehab')!.recommendations.find((r) => r.id === 'cr-esc-hf-telehealth');
    expect(rec?.escClass).toBe('I');
    expect(rec?.escLoe).toBe('B1');
  });

  it('captures the ESC 2025 pregnancy RAS-inhibitor contraindication (Class III)', () => {
    const rec = guidelinesMap.get('esc-2025-pregnancy')!.recommendations.find((r) => r.id === 'preg-esc-rasi-no');
    expect(rec?.escClass).toBe('III');
  });
});

describe('AHA/ACC comparison layer', () => {
  const graded = [
    'acc-2025-acs',
    'acc-2023-ccd',
    'acc-2022-hf',
    'acc-2023-af',
    'acc-2018-bradycardia',
    'acc-2015-svt',
    'acc-2020-vhd',
    'acc-2024-hcm',
    'acc-2021-chest-pain',
    'acc-2021-revascularization',
    'acc-2024-pad',
    'acc-2026-dyslipidemia',
    'acc-2022-aortic',
    'acc-2017-syncope',
  ];

  it('has AHA/ACC-graded recommendations and is marked verified', () => {
    for (const id of graded) {
      const g = guidelinesMap.get(id);
      expect(g, id).toBeDefined();
      expect(g!.status, id).toBe('verified');
      expect(g!.verifiedAt, id).toBeTruthy();
      expect(g!.recommendations.length, id).toBeGreaterThan(0);
      expect(g!.recommendations.every((r) => r.accClass), id).toBe(true);
    }
  });

  it('captures the 2022 HF four-pillar GDMT (ARNi I A)', () => {
    const arni = guidelinesMap.get('acc-2022-hf')!.recommendations.find((r) => r.id === 'hf-acc-arni');
    expect(arni?.accClass).toBe('I');
    expect(arni?.accLoe).toBe('A');
  });

  it('captures the 2023 AF first-line catheter ablation (I A)', () => {
    const ab = guidelinesMap.get('acc-2023-af')!.recommendations.find((r) => r.id === 'af-acc-ablation');
    expect(ab?.accClass).toBe('I');
    expect(ab?.accLoe).toBe('A');
  });

  it('captures the 2024 HCM myosin inhibitor recommendation (Class I)', () => {
    const mava = guidelinesMap.get('acc-2024-hcm')!.recommendations.find((r) => r.id === 'hcm-acc-mavacamten');
    expect(mava?.accClass).toBe('I');
  });

  it('captures the 2015 SVT adenosine recommendation (I B-R)', () => {
    const ade = guidelinesMap.get('acc-2015-svt')!.recommendations.find((r) => r.id === 'svt-acc-adenosine');
    expect(ade?.accClass).toBe('I');
    expect(ade?.accLoe).toBe('B-R');
  });

  it('captures the 2021 chest-pain CCTA recommendation (I A)', () => {
    const ccta = guidelinesMap.get('acc-2021-chest-pain')!.recommendations.find((r) => r.id === 'cp-acc-ccta');
    expect(ccta?.accClass).toBe('I');
    expect(ccta?.accLoe).toBe('A');
  });

  it('captures the 2024 PAD structured exercise recommendation (I A)', () => {
    const ex = guidelinesMap.get('acc-2024-pad')!.recommendations.find((r) => r.id === 'pad-acc-exercise');
    expect(ex?.accClass).toBe('I');
    expect(ex?.accLoe).toBe('A');
  });

  it('captures the 2022 aortic AAA repair threshold (I A)', () => {
    const aaa = guidelinesMap.get('acc-2022-aortic')!.recommendations.find((r) => r.id === 'ao-acc-aaa');
    expect(aaa?.accClass).toBe('I');
    expect(aaa?.accLoe).toBe('A');
  });

  it('captures the 2021 revascularization left-main CABG recommendation (I B-R)', () => {
    const lm = guidelinesMap.get('acc-2021-revascularization')!.recommendations.find((r) => r.id === 'rev-acc-leftmain');
    expect(lm?.accClass).toBe('I');
    expect(lm?.accLoe).toBe('B-R');
  });

  it('captures the 2026 dyslipidemia CKD statin recommendation (I B-R)', () => {
    const ckd = guidelinesMap.get('acc-2026-dyslipidemia')!.recommendations.find((r) => r.id === 'lip-acc-ckd');
    expect(ckd?.accClass).toBe('I');
    expect(ckd?.accLoe).toBe('B-R');
  });
});
