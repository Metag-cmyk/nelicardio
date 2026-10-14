/**
 * NeliCardio Clinical Logic Engine (The Protocol)
 * Centralized medical formulas and diagnostic interpretation logic.
 *
 * All clinical inputs are in canonical units (see `./units`):
 * creatinine µmol/L, cholesterol mmol/L, NT-proBNP pg/mL, etc.
 */
import { APIXABAN_SCR_UMOL, ntProBnpUpperLimit } from './units';

export { ntProBnpUpperLimit };

export const CLINICAL_NORMALS = {
  troponin: 14, // ng/L (High-Sens ULN)
  bnp: 450,     // pg/mL (NT-proBNP ULN for age > 75; use ntProBnpUpperLimit(age))
  k: { low: 3.5, high: 5.0, sweet: [4.0, 4.5] },
  mg: { low: 0.7, high: 1.0, sweet: [0.85, 1.0] },
  creatinine: 110, // µmol/L (≈ 1.24 mg/dL ULN)
  ldl: 1.8,        // mmol/L (High-risk target)
  ph: { low: 7.35, high: 7.45 },
  pco2: { low: 35, high: 45 },
  hco3: { low: 22, high: 26 },
  anionGap: 12
};

/**
 * Cockcroft-Gault GFR Calculation
 */
export function calculateGfr(age: string, weight: string, creatinine: string, gender: 'Male' | 'Female'): number | null {
  const ageNum = parseInt(age);
  const weightNum = parseFloat(weight);
  const creatNum = parseFloat(creatinine);
  
  if (isNaN(ageNum) || isNaN(weightNum) || isNaN(creatNum) || creatNum <= 0) return null;
  
  let result = ((140 - ageNum) * weightNum) / (72 * (creatNum / 88.4));
  if (gender === 'Female') result *= 0.85;
  return Math.round(result);
}

/**
 * Body Mass Index (BMI)
 */
export function calculateBmi(weight: string, height: string): number | null {
  const w = parseFloat(weight);
  const h_cm = parseFloat(height);
  if (isNaN(w) || isNaN(h_cm) || h_cm === 0) return null;
  return w / ((h_cm / 100) * (h_cm / 100));
}

/**
 * Mosteller BSA Calculation
 */
export function calculateBsa(weight: string, height: string): number | null {
  const w = parseFloat(weight);
  const h = parseFloat(height);
  if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null;
  return Math.sqrt((h * w) / 3600);
}

/**
 * Anion Gap Calculation
 */
export function calculateAnionGap(na: string, cl: string, hco3: string): number | null {
  const naNum = parseFloat(na);
  const clNum = parseFloat(cl);
  const hco3Num = parseFloat(hco3);
  if (isNaN(naNum) || isNaN(clNum) || isNaN(hco3Num)) return null;
  return Math.round(naNum - (clNum + hco3Num));
}

/**
 * ABG / VBG Interpretation Suite
 */
export interface AbgResult {
  type: "Acidemia" | "Alkalemia" | "Normal";
  primary: string;
  compensation: string;
  isGap: boolean;
  deltaGap?: number;
  expectedPco2?: { min: number; max: number };
  expectedHco3?: { min: number; max: number };
}

export function interpretAbg(ph: string, pco2: string, hco3: string, na?: string, cl?: string): AbgResult | null {
  const phNum = parseFloat(ph);
  const pco2Num = parseFloat(pco2);
  const hco3Num = parseFloat(hco3);

  if (isNaN(phNum) || isNaN(pco2Num) || isNaN(hco3Num)) return null;

  let primary = "";
  let compensation = "";
  let type: "Acidemia" | "Alkalemia" | "Normal" = "Normal";
  let expectedPco2: { min: number; max: number } | undefined;
  let expectedHco3: { min: number; max: number } | undefined;

  // 1. Identify Primary Disorder
  if (phNum < 7.35) {
    type = "Acidemia";
    if (pco2Num > 45) primary = "Respiratory Acidosis";
    else if (hco3Num < 22) primary = "Metabolic Acidosis";
  } else if (phNum > 7.45) {
    type = "Alkalemia";
    if (pco2Num < 35) primary = "Respiratory Alkalosis";
    else if (hco3Num > 26) primary = "Metabolic Alkalosis";
  } else {
    if (pco2Num > 45 && hco3Num > 26) primary = "Mixed Respiratory Acidosis & Metabolic Alkalosis";
    else if (pco2Num < 35 && hco3Num < 22) primary = "Mixed Respiratory Alkalosis & Metabolic Acidosis";
    else if (pco2Num > 45) primary = "Compensated Respiratory Acidosis";
    else if (hco3Num < 22) primary = "Compensated Metabolic Acidosis";
    else if (pco2Num < 35) primary = "Compensated Respiratory Alkalosis";
    else if (hco3Num > 26) primary = "Compensated Metabolic Alkalosis";
    else primary = "Normal Acid-Base Profile";
  }

  // 2. Compensation & Triple Disorder Logic
  const gap = (na && cl) ? calculateAnionGap(na, cl, hco3) : null;
  const deltaGapValue = gap ? gap - CLINICAL_NORMALS.anionGap : 0;

  if (primary.includes("Metabolic Acidosis")) {
    // Winter's Formula: Expected pCO2 = (1.5 * HCO3) + 8 ± 2
    const exp = 1.5 * hco3Num + 8;
    expectedPco2 = { min: exp - 2, max: exp + 2 };
    
    if (pco2Num > expectedPco2.max) compensation = "Concurrent Respiratory Acidosis";
    else if (pco2Num < expectedPco2.min) compensation = "Concurrent Respiratory Alkalosis";
    else compensation = "Appropriate Respiratory Compensation";

    // Delta-Delta for Triple Disorders
    if (gap && gap > CLINICAL_NORMALS.anionGap) {
      const correctedHco3 = deltaGapValue + hco3Num;
      if (correctedHco3 > 26) primary = `AGMA + Metabolic Alkalosis`;
      else if (correctedHco3 < 22) primary = `AGMA + NAGMA`;
      else primary = "High-Anion Gap Metabolic Acidosis (AGMA)";
    }
  } 
  else if (primary.includes("Metabolic Alkalosis")) {
    // Metabolic Alkalosis: pCO2 = 0.7 * (HCO3 - 24) + 40 ± 2
    const exp = 0.7 * (hco3Num - 24) + 40;
    expectedPco2 = { min: exp - 2, max: exp + 2 };

    if (pco2Num > expectedPco2.max) compensation = "Concurrent Respiratory Acidosis";
    else if (pco2Num < expectedPco2.min) compensation = "Concurrent Respiratory Alkalosis";
    else compensation = "Appropriate Respiratory Compensation";
  }
  else if (primary.includes("Respiratory Acidosis")) {
    const deltaPco2 = pco2Num - 40;
    // Acute: HCO3 increases 1 for every 10 pCO2
    const acuteExp = 24 + (deltaPco2 / 10);
    // Chronic: HCO3 increases 3.5-4 for every 10 pCO2
    const chronicExp = 24 + (4 * deltaPco2 / 10);
    
    expectedHco3 = { min: Math.min(acuteExp, chronicExp), max: Math.max(acuteExp, chronicExp) };
    
    if (hco3Num > chronicExp + 2) compensation = "Concurrent Metabolic Alkalosis";
    else if (hco3Num < acuteExp - 2) compensation = "Concurrent Metabolic Acidosis";
    else if (hco3Num > acuteExp + 1) compensation = "Likely Chronic Respiratory Acidosis";
    else compensation = "Acute Respiratory Acidosis";
  }
  else if (primary.includes("Respiratory Alkalosis")) {
    const deltaPco2 = 40 - pco2Num;
    // Acute: HCO3 decreases 2 for every 10 pCO2
    const acuteExp = 24 - (2 * deltaPco2 / 10);
    // Chronic: HCO3 decreases 5 for every 10 pCO2
    const chronicExp = 24 - (5 * deltaPco2 / 10);

    expectedHco3 = { min: Math.min(acuteExp, chronicExp), max: Math.max(acuteExp, chronicExp) };

    if (hco3Num < chronicExp - 2) compensation = "Concurrent Metabolic Acidosis";
    else if (hco3Num > acuteExp + 2) compensation = "Concurrent Metabolic Alkalosis";
    else if (hco3Num < acuteExp - 1) compensation = "Likely Chronic Respiratory Alkalosis";
    else compensation = "Acute Respiratory Alkalosis";
  }

  return { 
    type, 
    primary, 
    compensation, 
    isGap: !!(gap && gap > CLINICAL_NORMALS.anionGap),
    deltaGap: deltaGapValue > 0 ? deltaGapValue : undefined,
    expectedPco2,
    expectedHco3
  };
}

/**
 * Apixaban dose-reduction criteria (AFib / VTE).
 * Reduce to 2.5 mg BID when >= 2 of: age >= 80 y, weight <= 60 kg,
 * serum creatinine >= 1.5 mg/dL (>= 132.6 µmol/L).
 * Creatinine is accepted in canonical µmol/L.
 */
export interface ApixabanCriteriaInput {
  age: string;
  weightKg: string;
  creatinineUmol: string;
}

export interface ApixabanCriteriaResult {
  met: number;
  reduce: boolean;
  reasons: string[];
}

export function apixabanReductionCriteria(input: ApixabanCriteriaInput): ApixabanCriteriaResult {
  const age = parseInt(input.age);
  const weight = parseFloat(input.weightKg);
  const creatinine = parseFloat(input.creatinineUmol);
  const reasons: string[] = [];

  if (!Number.isNaN(age) && age >= 80) reasons.push('Age ≥ 80 years');
  if (!Number.isNaN(weight) && weight > 0 && weight <= 60) reasons.push('Weight ≤ 60 kg');
  if (!Number.isNaN(creatinine) && creatinine >= APIXABAN_SCR_UMOL) {
    reasons.push('Creatinine ≥ 1.5 mg/dL (≥ 133 µmol/L)');
  }

  return { met: reasons.length, reduce: reasons.length >= 2, reasons };
}
