/**
 * NeliCardio Units Layer
 * ---------------------------------------------------------------------------
 * Single source of truth for clinical units and unit conversions.
 *
 * Canonical internal units (everything entered/stored/compared uses these):
 *   creatinine                µmol/L
 *   LDL / total cholesterol   mmol/L
 *   potassium, magnesium      mmol/L
 *   sodium, chloride, HCO3    mmol/L
 *   troponin                  ng/L
 *   NT-proBNP                 pg/mL  (numerically == ng/L)
 *   lactate                   mmol/L
 *
 * Conversion happens ONLY at display time or when a guideline threshold is
 * written in a different unit (e.g. Apixaban "SCr >= 1.5 mg/dL").
 *
 * Conventional (US) equivalents are provided so a future unit toggle (§7/§9)
 * can flip display without touching stored values.
 */

export type UnitSystem = 'SI' | 'Conventional';

/** µmol/L per mg/dL for creatinine (molar mass 113.12 g/mol). */
export const CREATININE_UMOL_PER_MGDL = 88.4;
/** mg/dL per mmol/L for cholesterol (molar mass 386.65 g/mol). */
export const CHOLESTEROL_MGDL_PER_MMOL = 38.67;

export const creatinineUmolToMgdl = (umol: number): number => umol / CREATININE_UMOL_PER_MGDL;
export const creatinineMgdlToUmol = (mgdl: number): number => mgdl * CREATININE_UMOL_PER_MGDL;

export const cholesterolMmolToMgdl = (mmol: number): number => mmol * CHOLESTEROL_MGDL_PER_MMOL;
export const cholesterolMgdlToMmol = (mgdl: number): number => mgdl / CHOLESTEROL_MGDL_PER_MMOL;

/**
 * Declared unit for every lab field, in canonical SI display units.
 * Kept as a loose record so the integrity test can assert full coverage of
 * `LabState` without importing React state into the lib layer.
 */
export const LAB_FIELD_UNITS = {
  troponin: 'ng/L',
  bnp: 'pg/mL',
  k: 'mmol/L',
  mg: 'mmol/L',
  creatinine: 'µmol/L',
  ldl: 'mmol/L',
  ph: '',
  pco2: 'mmHg',
  hco3: 'mmol/L',
  po2: 'mmHg',
  lactate: 'mmol/L',
  na: 'mmol/L',
  cl: 'mmol/L',
} as const;

export type LabField = keyof typeof LAB_FIELD_UNITS;

// ---------------------------------------------------------------------------
// Guideline thresholds expressed in canonical units
// ---------------------------------------------------------------------------

/** Apixaban dose-reduction criterion: serum creatinine >= 1.5 mg/dL. */
export const APIXABAN_SCR_MGDL = 1.5;
export const APIXABAN_SCR_UMOL = creatinineMgdlToUmol(APIXABAN_SCR_MGDL); // ≈ 132.6 µmol/L

/** Renal-impairment flag used by the drug safety interlocks (≈ 2.5 mg/dL). */
export const RENAL_IMPAIRMENT_UMOL = 220;

/**
 * Age-stratified upper limit of normal for NT-proBNP (ESC heart failure
 * diagnostic thresholds, ambulatory setting).
 *   < 50 y : 125 pg/mL
 *   50–75 y: 250 pg/mL
 *   > 75 y : 450 pg/mL
 * NOTE: acute decompensated rule-in/rule-out thresholds are higher
 * (300 / 900 / 1800 pg/mL) and are handled separately where relevant.
 */
export function ntProBnpUpperLimit(ageYears: number): number {
  if (Number.isNaN(ageYears)) return 450;
  if (ageYears < 50) return 125;
  if (ageYears <= 75) return 250;
  return 450;
}
