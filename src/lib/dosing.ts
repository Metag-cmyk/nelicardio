/**
 * DOAC / LMWH dosing logic (Phase 3 residual)
 * ---------------------------------------------------------------------------
 * Renally-dosed anticoagulant rules for the AF indication, kept as pure
 * functions so they can be unit-tested. Creatinine clearance is passed in as
 * mL/min (Cockcroft–Gault), computed upstream from canonical µmol/L values.
 *
 * Sources: ESC 2024 AF guideline DOAC tables and the European SmPCs.
 */

export interface DoacInput {
  age: number;
  weightKg: number;
  /** Cockcroft–Gault creatinine clearance, mL/min. */
  crCl: number;
  /** Concomitant strong P-glycoprotein (and moderate CYP3A4) inhibitor. */
  pgpInhibitor?: boolean;
}

export interface DoseRecommendation {
  drug: string;
  dose: string;
  reduce: boolean;
  contraindicated: boolean;
  rationale: string;
}

const needsData = (drug: string): DoseRecommendation => ({
  drug,
  dose: 'Enter data',
  reduce: false,
  contraindicated: false,
  rationale: 'Enter age, weight and creatinine to calculate CrCl.',
});

const isNum = (n: number): boolean => Number.isFinite(n);

export function rivaroxabanAf({ crCl }: DoacInput): DoseRecommendation {
  const drug = 'Rivaroxaban';
  if (!isNum(crCl)) return needsData(drug);
  if (crCl < 15) return { drug, dose: 'Avoid', reduce: false, contraindicated: true, rationale: 'Not recommended when CrCl <15 mL/min in AF.' };
  if (crCl < 50) return { drug, dose: '15 mg once daily', reduce: true, contraindicated: false, rationale: `CrCl ${crCl} mL/min (15–49): reduce to 15 mg daily.` };
  return { drug, dose: '20 mg once daily with the main meal', reduce: false, contraindicated: false, rationale: `CrCl ${crCl} mL/min (≥50): standard 20 mg daily.` };
}

export function dabigatranAf({ age, crCl, pgpInhibitor }: DoacInput): DoseRecommendation {
  const drug = 'Dabigatran';
  if (!isNum(crCl)) return needsData(drug);
  if (crCl < 30) return { drug, dose: 'Avoid', reduce: false, contraindicated: true, rationale: 'Contraindicated when CrCl <30 mL/min.' };
  const reasons: string[] = [];
  if (crCl < 50) reasons.push(`CrCl ${crCl} mL/min (30–49)`);
  if (isNum(age) && age >= 80) reasons.push('age ≥80 years');
  if (pgpInhibitor) reasons.push('concomitant P-gp inhibitor');
  if (reasons.length > 0) {
    return { drug, dose: '110 mg twice daily', reduce: true, contraindicated: false, rationale: `Reduce to 110 mg BID (${reasons.join(', ')}).` };
  }
  return { drug, dose: '150 mg twice daily', reduce: false, contraindicated: false, rationale: `CrCl ${crCl} mL/min and no other reduction criteria: standard 150 mg BID.` };
}

export function edoxabanAf({ weightKg, crCl, pgpInhibitor }: DoacInput): DoseRecommendation {
  const drug = 'Edoxaban';
  if (!isNum(crCl)) return needsData(drug);
  if (crCl > 95) {
    return { drug, dose: 'Use an alternative DOAC', reduce: false, contraindicated: true, rationale: 'Reduced efficacy in AF when CrCl >95 mL/min; choose another anticoagulant.' };
  }
  const reasons: string[] = [];
  if (crCl >= 15 && crCl <= 50) reasons.push(`CrCl ${crCl} mL/min (15–50)`);
  if (isNum(weightKg) && weightKg > 0 && weightKg <= 60) reasons.push('weight ≤60 kg');
  if (pgpInhibitor) reasons.push('concomitant P-gp inhibitor');
  if (reasons.length > 0) {
    return { drug, dose: '30 mg once daily', reduce: true, contraindicated: false, rationale: `Reduce to 30 mg daily (${reasons.join(', ')}).` };
  }
  return { drug, dose: '60 mg once daily', reduce: false, contraindicated: false, rationale: `CrCl ${crCl} mL/min and no reduction criteria: standard 60 mg daily.` };
}

export type EnoxaparinIndication = 'treatment' | 'prophylaxis';

export function enoxaparinDose(weightKg: number, crCl: number, indication: EnoxaparinIndication): DoseRecommendation {
  const drug = 'Enoxaparin';
  if (!isNum(weightKg) || weightKg <= 0) return needsData(drug);

  if (indication === 'prophylaxis') {
    if (isNum(crCl) && crCl < 30) {
      return { drug, dose: '20 mg subcutaneously once daily', reduce: true, contraindicated: false, rationale: `Prophylaxis with CrCl ${crCl} mL/min (<30): reduce to 20 mg daily.` };
    }
    return { drug, dose: '40 mg subcutaneously once daily', reduce: false, contraindicated: false, rationale: 'Standard VTE prophylaxis dose.' };
  }

  if (isNum(crCl) && crCl < 30) {
    return { drug, dose: '1 mg/kg subcutaneously once daily', reduce: true, contraindicated: false, rationale: `Treatment with CrCl ${crCl} mL/min (<30): 1 mg/kg once daily.` };
  }
  return { drug, dose: '1 mg/kg subcutaneously every 12 hours', reduce: false, contraindicated: false, rationale: 'Standard treatment dose (1 mg/kg q12h).' };
}
