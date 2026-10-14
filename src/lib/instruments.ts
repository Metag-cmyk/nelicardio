/**
 * Clinical instrument engine (Phase 3)
 * ---------------------------------------------------------------------------
 * A single declarative model for the point-scoring and classification tools,
 * replacing the previous hand-wired calculator components. Instruments are data:
 * criteria carry published point values, bands carry the interpretation, and the
 * source is recorded. Nothing here invents a point value.
 */
import type { LabField } from './units';

export type InstrumentKind = 'score' | 'classification';
export type RiskLevel = 'low' | 'moderate' | 'high' | 'info';

export type AutoRule =
  | { type: 'age'; gte?: number; lt?: number }
  | { type: 'sex'; sex: 'Male' | 'Female' }
  | { type: 'lab'; lab: LabField; comparison: 'gt' | 'gte' | 'lt' | 'lte'; value: number };

export interface Criterion {
  id: string;
  label: string;
  points: number;
  /** Optional grouping label (e.g. "History", "ECG") for multi-part scores. */
  group?: string;
  /** Criteria sharing an exclusive group behave like a single-choice variable. */
  exclusiveGroup?: string;
  /** Auto-select from the patient profile where safe. */
  auto?: AutoRule;
}

export interface Band {
  min: number;
  max: number;
  label: string;
  risk: RiskLevel;
  recommendation?: string;
}

export interface ClassificationOption {
  id: string;
  label: string;
  recommendation?: string;
}

export interface Instrument {
  id: string;
  name: string;
  kind: InstrumentKind;
  /** Grouping for the UI tabs. */
  category: string;
  description: string;
  criteria?: Criterion[];
  bands?: Band[];
  /** Upper bound applied to the summed points of each named group (e.g. HFA-PEFF domains). */
  groupCaps?: Record<string, number>;
  options?: ClassificationOption[];
  /** Points label shown next to the total (default "points"). */
  unitLabel?: string;
  /** True when the model is illustrative and must not be used clinically. */
  illustrative?: boolean;
  /** Guideline id (from data/guidelines) that documents the instrument. */
  sourceRef?: string;
  sourceNote: string;
}

export interface ScoreResult {
  total: number;
  band: Band | null;
  groupTotals: { group: string; total: number }[];
  metCriteria: string[];
}

export interface AutoPatient {
  age?: string;
  gender?: string;
  labs?: Partial<Record<LabField, string>>;
}

// ---------------------------------------------------------------------------
// Evaluation
// ---------------------------------------------------------------------------

export function resolveBand(bands: Band[], total: number): Band | null {
  return bands.find((b) => total >= b.min && total <= b.max) ?? null;
}

export function evaluateScore(instrument: Instrument, criterionIds: Iterable<string>): ScoreResult {
  const criteria = instrument.criteria ?? [];
  const selected = new Set(criterionIds);

  const metCriteria: string[] = [];
  const rawByGroup = new Map<string, number>();

  for (const criterion of criteria) {
    if (!selected.has(criterion.id)) continue;
    metCriteria.push(criterion.id);
    const group = criterion.group ?? instrument.name;
    rawByGroup.set(group, (rawByGroup.get(group) ?? 0) + criterion.points);
  }

  // Apply per-domain caps (e.g. HFA-PEFF: no domain contributes more than 2).
  const groupTotals = [...rawByGroup.entries()].map(([group, raw]) => {
    const cap = instrument.groupCaps?.[group];
    return { group, total: cap !== undefined ? Math.min(raw, cap) : raw };
  });
  const total = groupTotals.reduce((sum, g) => sum + g.total, 0);

  return {
    total,
    band: resolveBand(instrument.bands ?? [], total),
    groupTotals,
    metCriteria,
  };
}

/** The exclusive group (if any) a criterion belongs to. */
export function exclusiveGroupOf(instrument: Instrument, criterionId: string): string | undefined {
  return instrument.criteria?.find((c) => c.id === criterionId)?.exclusiveGroup;
}

/** Criterion ids implied by the patient profile (age/sex/labs). */
export function autoSelectCriteria(instrument: Instrument, patient: AutoPatient): string[] {
  const age = patient.age !== undefined ? parseInt(patient.age) : Number.NaN;
  const selected: string[] = [];

  for (const criterion of instrument.criteria ?? []) {
    const rule = criterion.auto;
    if (!rule) continue;

    if (rule.type === 'age') {
      if (Number.isNaN(age)) continue;
      if (rule.gte !== undefined && rule.lt !== undefined) {
        if (age >= rule.gte && age < rule.lt) selected.push(criterion.id);
      } else if (rule.gte !== undefined && age >= rule.gte) {
        selected.push(criterion.id);
      } else if (rule.lt !== undefined && age < rule.lt) {
        selected.push(criterion.id);
      }
    } else if (rule.type === 'sex') {
      if (patient.gender === rule.sex) selected.push(criterion.id);
    } else {
      const raw = patient.labs?.[rule.lab];
      const value = raw !== undefined ? parseFloat(raw) : Number.NaN;
      if (Number.isNaN(value)) continue;
      const hit =
        (rule.comparison === 'gt' && value > rule.value) ||
        (rule.comparison === 'gte' && value >= rule.value) ||
        (rule.comparison === 'lt' && value < rule.value) ||
        (rule.comparison === 'lte' && value <= rule.value);
      if (hit) selected.push(criterion.id);
    }
  }

  return selected;
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

const CHA2DS2 = {
  chf: { id: 'chf', label: 'Congestive heart failure', points: 1, group: 'CHA₂DS₂' },
  htn: { id: 'htn', label: 'Hypertension', points: 1, group: 'CHA₂DS₂' },
  age75: { id: 'age75', label: 'Age ≥75 years', points: 2, group: 'CHA₂DS₂', auto: { type: 'age', gte: 75 } as AutoRule },
  diabetes: { id: 'diabetes', label: 'Diabetes mellitus', points: 1, group: 'CHA₂DS₂' },
  stroke: { id: 'stroke', label: 'Prior stroke / TIA / thromboembolism', points: 2, group: 'CHA₂DS₂' },
  vascular: { id: 'vascular', label: 'Vascular disease (prior MI, PAD)', points: 1, group: 'CHA₂DS₂' },
  age65: { id: 'age65', label: 'Age 65–74 years', points: 1, group: 'CHA₂DS₂', auto: { type: 'age', gte: 65, lt: 75 } as AutoRule },
  female: { id: 'female', label: 'Sex category (female)', points: 1, group: 'CHA₂DS₂', auto: { type: 'sex', sex: 'Female' } as AutoRule },
} satisfies Record<string, Criterion>;

export const instruments: Instrument[] = [
  // ----- Arrhythmia -----
  {
    id: 'cha2ds2-va',
    name: 'CHA₂DS₂-VA (ESC 2024)',
    kind: 'score',
    category: 'Arrhythmia',
    description: 'Thromboembolic risk in AF; the sex category was removed in the 2024 ESC guideline.',
    criteria: [CHA2DS2.chf, CHA2DS2.htn, CHA2DS2.age75, CHA2DS2.diabetes, CHA2DS2.stroke, CHA2DS2.vascular, CHA2DS2.age65],
    bands: [
      { min: 0, max: 0, label: 'Low', risk: 'low', recommendation: 'No oral anticoagulation indicated by risk score.' },
      { min: 1, max: 1, label: 'Moderate', risk: 'moderate', recommendation: 'Consider oral anticoagulation (Class IIa, ESC 2024).' },
      { min: 2, max: 9, label: 'High', risk: 'high', recommendation: 'Oral anticoagulation recommended (Class I, ESC 2024).' },
    ],
    sourceRef: 'esc-2024-af',
    sourceNote: 'ESC 2024 AF Guidelines, Section 6.1.',
  },
  {
    id: 'cha2ds2-vasc',
    name: 'CHA₂DS₂-VASc',
    kind: 'score',
    category: 'Arrhythmia',
    description: 'Stroke risk in non-valvular AF (includes the female sex category).',
    criteria: [...Object.values(CHA2DS2)],
    bands: [
      { min: 0, max: 1, label: 'Low', risk: 'low', recommendation: 'No anticoagulation for males at 0 / consider for males at 1 and females at 1.' },
      { min: 2, max: 9, label: 'High', risk: 'high', recommendation: 'Oral anticoagulation recommended (DOAC preferred).' },
    ],
    sourceRef: 'acc-2023-af',
    sourceNote: 'ACC/AHA 2023 AF Guideline; ESC. Superseded by CHA₂DS₂-VA in ESC 2024.',
  },
  {
    id: 'has-bled',
    name: 'HAS-BLED',
    kind: 'score',
    category: 'Arrhythmia',
    description: 'Major bleeding risk on anticoagulation.',
    criteria: [
      { id: 'h', label: 'Hypertension (SBP >160)', points: 1 },
      { id: 'r', label: 'Abnormal renal / liver function', points: 1 },
      { id: 's', label: 'Stroke history', points: 1 },
      { id: 'b', label: 'Bleeding predisposition / prior bleed', points: 1 },
      { id: 'l', label: 'Labile INRs (if on VKA)', points: 1 },
      { id: 'e', label: 'Elderly (age >65)', points: 1, auto: { type: 'age', gte: 66 } },
      { id: 'd', label: 'Drugs or alcohol', points: 1 },
    ],
    bands: [
      { min: 0, max: 2, label: 'Low–moderate', risk: 'low', recommendation: 'Relatively safe to anticoagulate.' },
      { min: 3, max: 9, label: 'High', risk: 'high', recommendation: 'Address modifiable bleeding risk factors; review frequently.' },
    ],
    sourceRef: 'esc-2024-af',
    sourceNote: 'ESC 2024 AF Guidelines (HAS-BLED ≥3 flags high bleeding risk).',
  },
  {
    id: 'chads2',
    name: 'CHADS₂',
    kind: 'score',
    category: 'Arrhythmia',
    description: 'Older stroke risk score in AF (predecessor of CHA₂DS₂-VASc).',
    criteria: [
      { id: 'chf', label: 'Congestive heart failure', points: 1 },
      { id: 'htn', label: 'Hypertension', points: 1 },
      { id: 'age75', label: 'Age ≥75 years', points: 1, auto: { type: 'age', gte: 75 } },
      { id: 'dm', label: 'Diabetes mellitus', points: 1 },
      { id: 'stroke', label: 'Prior stroke / TIA', points: 2 },
    ],
    bands: [
      { min: 0, max: 0, label: 'Low', risk: 'low' },
      { min: 1, max: 1, label: 'Moderate', risk: 'moderate', recommendation: 'Consider anticoagulation.' },
      { min: 2, max: 6, label: 'High', risk: 'high', recommendation: 'Anticoagulation recommended.' },
    ],
    sourceNote: 'Historical AF risk score (Gage 2001). Prefer CHA₂DS₂-VASc / CHA₂DS₂-VA.',
  },
  {
    id: 'ehra',
    name: 'EHRA symptom class',
    kind: 'classification',
    category: 'Arrhythmia',
    description: 'AF-related symptom severity.',
    options: [
      { id: '1', label: 'EHRA 1 — no symptoms', recommendation: 'No rhythm-control therapy needed for symptoms.' },
      { id: '2a', label: 'EHRA 2a — mild, normal activity unaffected', recommendation: 'Rate/rhythm control for symptom burden.' },
      { id: '2b', label: 'EHRA 2b — moderate, normal activity affected', recommendation: 'Consider rhythm control (AAD or ablation).' },
      { id: '3', label: 'EHRA 3 — severe, normal activity discontinued', recommendation: 'Pursue rhythm control.' },
      { id: '4', label: 'EHRA 4 — disabling, normal activity discontinued', recommendation: 'Urgent rhythm control / cardioversion.' },
    ],
    sourceRef: 'esc-2024-af',
    sourceNote: 'EHRA symptom classification (ESC 2024 AF).',
  },
  {
    id: 'schwartz-lqts',
    name: 'Schwartz score (LQTS)',
    kind: 'score',
    category: 'Arrhythmia',
    description: 'Clinical probability of congenital long QT syndrome.',
    unitLabel: 'points',
    criteria: [
      { id: 'qtc480', label: 'QTc ≥480 ms', points: 3, group: 'ECG' },
      { id: 'qtc460', label: 'QTc 460–479 ms', points: 2, group: 'ECG' },
      { id: 'qtc450', label: 'QTc 450–459 ms (males)', points: 1, group: 'ECG' },
      { id: 'recovery', label: 'QTc ≥480 ms at 4th min of recovery', points: 1, group: 'ECG' },
      { id: 'tdp', label: 'Torsades de pointes', points: 2, group: 'ECG' },
      { id: 'twa', label: 'T-wave alternans', points: 1, group: 'ECG' },
      { id: 'notched', label: 'Notched T wave in 3 leads', points: 1, group: 'ECG' },
      { id: 'lowhr', label: 'Low heart rate for age', points: 0.5, group: 'ECG' },
      { id: 'syncope-stress', label: 'Syncope with stress', points: 2, group: 'Clinical history' },
      { id: 'syncope-rest', label: 'Syncope without stress', points: 1, group: 'Clinical history' },
      { id: 'deafness', label: 'Congenital deafness', points: 0.5, group: 'Clinical history' },
      { id: 'fam-lqts', label: 'Family member with definite LQTS', points: 1, group: 'Family history' },
      { id: 'fam-scd', label: 'Unexplained SCD <30 y in immediate family', points: 0.5, group: 'Family history' },
    ],
    bands: [
      { min: 0, max: 1, label: 'Low probability', risk: 'low', recommendation: 'Genetic testing generally not indicated.' },
      { min: 1.5, max: 3, label: 'Intermediate probability', risk: 'moderate', recommendation: 'Further evaluation / cardiology referral.' },
      { min: 3.5, max: 9, label: 'High probability', risk: 'high', recommendation: 'Definite LQTS until proven otherwise (Class I).' },
    ],
    sourceRef: 'esc-2022-va-scd',
    sourceNote: 'Schwartz score (modified; Schwartz & Crotti). Quoted in ESC 2022 VA/SCD.',
  },

  // ----- Acute coronary -----
  {
    id: 'heart',
    name: 'HEART score',
    kind: 'score',
    category: 'Acute coronary',
    description: 'Risk of MACE in undifferentiated chest pain.',
    criteria: [
      { id: 'hist-mod', label: 'History: moderately suspicious', points: 1, group: 'History' },
      { id: 'hist-high', label: 'History: highly suspicious', points: 2, group: 'History' },
      { id: 'ecg-ns', label: 'ECG: non-specific repolarisation changes', points: 1, group: 'ECG' },
      { id: 'ecg-st', label: 'ECG: significant ST deviation', points: 2, group: 'ECG' },
      { id: 'age45', label: 'Age 45–64 years', points: 1, group: 'Age', auto: { type: 'age', gte: 45, lt: 65 } },
      { id: 'age65', label: 'Age ≥65 years', points: 2, group: 'Age', auto: { type: 'age', gte: 65 } },
      { id: 'risk12', label: '1–2 risk factors', points: 1, group: 'Risk factors' },
      { id: 'risk3', label: '≥3 risk factors or atherosclerotic disease', points: 2, group: 'Risk factors' },
      { id: 'trop1', label: 'Troponin 1–3× normal limit', points: 1, group: 'Troponin', auto: { type: 'lab', lab: 'troponin', comparison: 'gt', value: 14 } },
      { id: 'trop2', label: 'Troponin >3× normal limit', points: 2, group: 'Troponin', auto: { type: 'lab', lab: 'troponin', comparison: 'gt', value: 42 } },
    ],
    bands: [
      { min: 0, max: 3, label: 'Low risk', risk: 'low', recommendation: 'Suitable for early discharge (with follow-up).' },
      { min: 4, max: 6, label: 'Intermediate', risk: 'moderate', recommendation: 'Admission for observation.' },
      { min: 7, max: 10, label: 'High risk', risk: 'high', recommendation: 'Early invasive strategy.' },
    ],
    sourceRef: 'acc-2021-chest-pain',
    sourceNote: 'HEART score (Backus 2013); referenced for chest-pain risk stratification.',
  },
  {
    id: 'timi-nstemi',
    name: 'TIMI risk score (UA/NSTEMI)',
    kind: 'score',
    category: 'Acute coronary',
    description: '14-day ischaemic event risk in unstable angina / NSTEMI.',
    criteria: [
      { id: 'age65', label: 'Age ≥65 years', points: 1, auto: { type: 'age', gte: 65 } },
      { id: 'risk3', label: '≥3 CAD risk factors', points: 1 },
      { id: 'cad', label: 'Known CAD (stenosis ≥50%)', points: 1 },
      { id: 'asa', label: 'Aspirin use in the past 7 days', points: 1 },
      { id: 'angina', label: '≥2 anginal episodes in 24 h', points: 1 },
      { id: 'st', label: 'ST deviation ≥0.5 mm', points: 1 },
      { id: 'biomarker', label: 'Elevated cardiac markers', points: 1, auto: { type: 'lab', lab: 'troponin', comparison: 'gt', value: 14 } },
    ],
    bands: [
      { min: 0, max: 2, label: 'Low risk', risk: 'low', recommendation: '4.7–8.3% 14-day event risk.' },
      { min: 3, max: 4, label: 'Moderate risk', risk: 'moderate', recommendation: '13.2–19.9% risk; consider invasive strategy.' },
      { min: 5, max: 7, label: 'High risk', risk: 'high', recommendation: '26.2–40.9% risk; early invasive strategy.' },
    ],
    sourceRef: 'esc-2023-acs',
    sourceNote: 'TIMI UA/NSTEMI score (Antman 2000).',
  },
  {
    id: 'killip',
    name: 'Killip classification',
    kind: 'classification',
    category: 'Acute coronary',
    description: 'Heart-failure severity after acute MI.',
    options: [
      { id: '1', label: 'Killip I — no HF signs', recommendation: 'Low baseline mortality (~6%).' },
      { id: '2', label: 'Killip II — crackles / S3 gallop', recommendation: 'Mortality ~17%.' },
      { id: '3', label: 'Killip III — acute pulmonary oedema', recommendation: 'Mortality ~38%.' },
      { id: '4', label: 'Killip IV — cardiogenic shock', recommendation: 'Mortality ~81%; mechanical support.' },
    ],
    sourceRef: 'esc-2023-acs',
    sourceNote: 'Killip classification (ESC 2023 ACS).',
  },

  // ----- Heart failure -----
  {
    id: 'h2fpef',
    name: 'H2FPEF score',
    kind: 'score',
    category: 'Heart failure',
    description: 'Probability of HFpEF in patients with dyspnoea.',
    criteria: [
      { id: 'heavy', label: 'Heaviness (BMI >30 kg/m²)', points: 2 },
      { id: 'htn', label: 'Hypertension (≥2 antihypertensives)', points: 1 },
      { id: 'af', label: 'Atrial fibrillation', points: 3 },
      { id: 'ph', label: 'Pulmonary hypertension (PASP >35 mmHg)', points: 1 },
      { id: 'elderly', label: 'Elderly (age >60 years)', points: 1, auto: { type: 'age', gte: 61 } },
      { id: 'filling', label: 'Filling pressures (E/e′ >9)', points: 1 },
    ],
    bands: [
      { min: 0, max: 1, label: 'Low (<10%)', risk: 'low', recommendation: 'Look for other causes of dyspnoea.' },
      { min: 2, max: 5, label: 'Intermediate', risk: 'moderate', recommendation: 'Consider invasive exercise testing.' },
      { min: 6, max: 9, label: 'High (>90%)', risk: 'high', recommendation: 'HFpEF diagnosis likely.' },
    ],
    sourceRef: 'acc-2022-hf',
    sourceNote: 'H2FPEF score (Reddy 2018).',
  },
  {
    id: 'nyha',
    name: 'NYHA functional class',
    kind: 'classification',
    category: 'Heart failure',
    description: 'Symptom severity in heart failure.',
    options: [
      { id: '1', label: 'NYHA I — no limitation', recommendation: 'Asymptomatic; continue GDMT.' },
      { id: '2', label: 'NYHA II — slight limitation', recommendation: 'Optimise GDMT.' },
      { id: '3', label: 'NYHA III — marked limitation', recommendation: 'Optimise GDMT; consider advanced options.' },
      { id: '4', label: 'NYHA IV — symptoms at rest', recommendation: 'Advanced HF; consider MCS/transplant.' },
    ],
    sourceRef: 'esc-2026-hf',
    sourceNote: 'NYHA functional classification.',
  },
  {
    id: 'hf-stage',
    name: 'ACC/AHA HF stages',
    kind: 'classification',
    category: 'Heart failure',
    description: 'Structural progression of heart failure.',
    options: [
      { id: 'a', label: 'Stage A — at risk', recommendation: 'Risk-factor modification.' },
      { id: 'b', label: 'Stage B — pre-HF (asymptomatic)', recommendation: 'ACEi/ARB + beta-blocker for LVEF ≤40%.' },
      { id: 'c', label: 'Stage C — symptomatic', recommendation: 'Foundational GDMT.' },
      { id: 'd', label: 'Stage D — advanced', recommendation: 'Advanced therapies / palliative care.' },
    ],
    sourceRef: 'acc-2022-hf',
    sourceNote: 'ACC/AHA HF stages.',
  },
  {
    id: 'ccs-angina',
    name: 'CCS angina class',
    kind: 'classification',
    category: 'Acute coronary',
    description: 'Canadian Cardiovascular Society angina severity.',
    options: [
      { id: '1', label: 'CCS I — only strenuous activity', recommendation: 'Medical therapy.' },
      { id: '2', label: 'CCS II — moderate activity', recommendation: 'Medical therapy; risk-factor control.' },
      { id: '3', label: 'CCS III — mild activity', recommendation: 'Consider revascularization.' },
      { id: '4', label: 'CCS IV — any activity / rest', recommendation: 'Urgent evaluation; revascularization.' },
    ],
    sourceRef: 'esc-2024-ccs',
    sourceNote: 'CCS angina classification.',
  },

  // ----- Thromboembolism -----
  {
    id: 'wells-pe',
    name: 'Wells score (PE)',
    kind: 'score',
    category: 'Thromboembolism',
    description: 'Pre-test probability of pulmonary embolism.',
    criteria: [
      { id: 'dvt', label: 'Clinical signs of DVT', points: 3 },
      { id: 'likely', label: 'PE is the most likely diagnosis', points: 3 },
      { id: 'hr', label: 'Heart rate >100 bpm', points: 1.5 },
      { id: 'immob', label: 'Immobilisation ≥3 days / surgery in 4 weeks', points: 1.5 },
      { id: 'prior', label: 'Previous DVT or PE', points: 1.5 },
      { id: 'hemoptysis', label: 'Haemoptysis', points: 1 },
      { id: 'malignancy', label: 'Active malignancy', points: 1 },
    ],
    bands: [
      { min: 0, max: 4, label: 'PE unlikely', risk: 'low', recommendation: 'Order D-dimer; PE excluded if negative.' },
      { min: 5, max: 13, label: 'PE likely', risk: 'high', recommendation: 'Proceed to CTPA.' },
    ],
    sourceRef: 'esc-2019-pe',
    sourceNote: 'Wells score (two-tier); ESC 2019 PE.',
  },
  {
    id: 'spesi',
    name: 'Simplified PESI (sPESI)',
    kind: 'score',
    category: 'Thromboembolism',
    description: '30-day mortality risk after acute PE.',
    criteria: [
      { id: 'age80', label: 'Age >80 years', points: 1, auto: { type: 'age', gte: 81 } },
      { id: 'cancer', label: 'History of cancer', points: 1 },
      { id: 'cardiopulm', label: 'Chronic cardiopulmonary disease', points: 1 },
      { id: 'hr110', label: 'Heart rate ≥110 bpm', points: 1 },
      { id: 'sbp', label: 'Systolic BP <100 mmHg', points: 1 },
      { id: 'sat', label: 'O₂ saturation <90%', points: 1 },
    ],
    bands: [
      { min: 0, max: 0, label: 'Low risk', risk: 'low', recommendation: '1.1% mortality; consider outpatient management.' },
      { min: 1, max: 6, label: 'High risk', risk: 'high', recommendation: '8.9% mortality; inpatient management.' },
    ],
    sourceRef: 'esc-2019-pe',
    sourceNote: 'Simplified PESI (Jiménez 2010).',
  },
  {
    id: 'scai-shock',
    name: 'SCAI shock stage',
    kind: 'classification',
    category: 'Heart failure',
    description: 'Severity staging of cardiogenic shock.',
    options: [
      { id: 'a', label: 'Stage A — at risk', recommendation: 'Monitor; no shock.' },
      { id: 'b', label: 'Stage B — beginning', recommendation: 'Hypotension / tachycardia, normal perfusion.' },
      { id: 'c', label: 'Stage C — classic', recommendation: 'Hypoperfusion requiring intervention.' },
      { id: 'd', label: 'Stage D — deteriorating', recommendation: 'Escalate mechanical circulatory support.' },
      { id: 'e', label: 'Stage E — extremis', recommendation: 'Circulatory collapse; maximal support.' },
    ],
    sourceRef: 'esc-2026-hf',
    sourceNote: 'SCAI SHOCK staging.',
  },

  // ----- Phase 3b additions -----
  {
    id: 'grace',
    name: 'GRACE score (ACS)',
    kind: 'score',
    category: 'Acute coronary',
    description: 'In-hospital / 6-month mortality risk in acute coronary syndrome.',
    criteria: [
      { id: 'age30', label: 'Age 30–39', points: 8, group: 'Age', exclusiveGroup: 'age', auto: { type: 'age', gte: 30, lt: 40 } },
      { id: 'age40', label: 'Age 40–49', points: 25, group: 'Age', exclusiveGroup: 'age', auto: { type: 'age', gte: 40, lt: 50 } },
      { id: 'age50', label: 'Age 50–59', points: 41, group: 'Age', exclusiveGroup: 'age', auto: { type: 'age', gte: 50, lt: 60 } },
      { id: 'age60', label: 'Age 60–69', points: 58, group: 'Age', exclusiveGroup: 'age', auto: { type: 'age', gte: 60, lt: 70 } },
      { id: 'age70', label: 'Age 70–79', points: 75, group: 'Age', exclusiveGroup: 'age', auto: { type: 'age', gte: 70, lt: 80 } },
      { id: 'age80', label: 'Age 80–89', points: 91, group: 'Age', exclusiveGroup: 'age', auto: { type: 'age', gte: 80, lt: 90 } },
      { id: 'age90', label: 'Age ≥90', points: 100, group: 'Age', exclusiveGroup: 'age', auto: { type: 'age', gte: 90 } },
      { id: 'hr50', label: 'Heart rate 50–69', points: 3, group: 'Heart rate', exclusiveGroup: 'hr' },
      { id: 'hr70', label: 'Heart rate 70–89', points: 9, group: 'Heart rate', exclusiveGroup: 'hr' },
      { id: 'hr90', label: 'Heart rate 90–109', points: 15, group: 'Heart rate', exclusiveGroup: 'hr' },
      { id: 'hr110', label: 'Heart rate 110–149', points: 24, group: 'Heart rate', exclusiveGroup: 'hr' },
      { id: 'hr150', label: 'Heart rate 150–199', points: 38, group: 'Heart rate', exclusiveGroup: 'hr' },
      { id: 'hr200', label: 'Heart rate ≥200', points: 46, group: 'Heart rate', exclusiveGroup: 'hr' },
      { id: 'sbp79', label: 'Systolic BP <80', points: 58, group: 'Systolic BP', exclusiveGroup: 'sbp' },
      { id: 'sbp80', label: 'Systolic BP 80–99', points: 53, group: 'Systolic BP', exclusiveGroup: 'sbp' },
      { id: 'sbp100', label: 'Systolic BP 100–119', points: 43, group: 'Systolic BP', exclusiveGroup: 'sbp' },
      { id: 'sbp120', label: 'Systolic BP 120–139', points: 34, group: 'Systolic BP', exclusiveGroup: 'sbp' },
      { id: 'sbp140', label: 'Systolic BP 140–159', points: 24, group: 'Systolic BP', exclusiveGroup: 'sbp' },
      { id: 'sbp160', label: 'Systolic BP 160–199', points: 10, group: 'Systolic BP', exclusiveGroup: 'sbp' },
      { id: 'cr1', label: 'Creatinine 0–0.39 mg/dL', points: 1, group: 'Creatinine', exclusiveGroup: 'cr' },
      { id: 'cr4', label: 'Creatinine 0.4–0.79', points: 4, group: 'Creatinine', exclusiveGroup: 'cr' },
      { id: 'cr7', label: 'Creatinine 0.8–1.19', points: 7, group: 'Creatinine', exclusiveGroup: 'cr' },
      { id: 'cr10', label: 'Creatinine 1.2–1.59', points: 10, group: 'Creatinine', exclusiveGroup: 'cr' },
      { id: 'cr13', label: 'Creatinine 1.6–1.99', points: 13, group: 'Creatinine', exclusiveGroup: 'cr' },
      { id: 'cr21', label: 'Creatinine 2.0–3.99', points: 21, group: 'Creatinine', exclusiveGroup: 'cr' },
      { id: 'cr28', label: 'Creatinine ≥4.0', points: 28, group: 'Creatinine', exclusiveGroup: 'cr' },
      { id: 'killip2', label: 'Killip II', points: 20, group: 'Killip', exclusiveGroup: 'killip' },
      { id: 'killip3', label: 'Killip III', points: 39, group: 'Killip', exclusiveGroup: 'killip' },
      { id: 'killip4', label: 'Killip IV', points: 59, group: 'Killip', exclusiveGroup: 'killip' },
      { id: 'arrest', label: 'Cardiac arrest at presentation', points: 39, group: 'Other' },
      { id: 'st', label: 'ST-segment deviation', points: 28, group: 'Other' },
      { id: 'markers', label: 'Raised cardiac biomarkers', points: 14, group: 'Other', auto: { type: 'lab', lab: 'troponin', comparison: 'gt', value: 14 } },
    ],
    bands: [
      { min: 0, max: 108, label: 'Low risk', risk: 'low', recommendation: 'In-hospital mortality <1%.' },
      { min: 109, max: 140, label: 'Intermediate', risk: 'moderate', recommendation: 'Mortality 1–3%; consider early invasive strategy.' },
      { min: 141, max: 372, label: 'High risk', risk: 'high', recommendation: 'Mortality >3%; early invasive strategy (ESC 2023 threshold >140).' },
    ],
    sourceRef: 'esc-2023-acs',
    sourceNote: 'GRACE risk score (Granger 2003); ESC 2023 ACS.',
  },
  {
    id: 'geneva-pe',
    name: 'Revised Geneva score (PE)',
    kind: 'score',
    category: 'Thromboembolism',
    description: 'Clinical probability of pulmonary embolism.',
    criteria: [
      { id: 'age65', label: 'Age >65 years', points: 1, group: 'Risk factors', auto: { type: 'age', gte: 66 } },
      { id: 'prior', label: 'Previous DVT or PE', points: 3, group: 'Risk factors' },
      { id: 'surgery', label: 'Surgery or lower-limb fracture within 1 month', points: 2, group: 'Risk factors' },
      { id: 'malignancy', label: 'Active malignancy', points: 2, group: 'Risk factors' },
      { id: 'legpain', label: 'Unilateral lower-limb pain', points: 3, group: 'Symptoms' },
      { id: 'hemoptysis', label: 'Haemoptysis', points: 2, group: 'Symptoms' },
      { id: 'hr75', label: 'Heart rate 75–94 bpm', points: 3, group: 'Signs', exclusiveGroup: 'hr' },
      { id: 'hr95', label: 'Heart rate ≥95 bpm', points: 5, group: 'Signs', exclusiveGroup: 'hr' },
      { id: 'deeppain', label: 'Pain on deep venous palpation + unilateral oedema', points: 4, group: 'Signs' },
    ],
    bands: [
      { min: 0, max: 3, label: 'Low', risk: 'low', recommendation: 'PE prevalence ~8%.' },
      { min: 4, max: 10, label: 'Intermediate', risk: 'moderate', recommendation: 'Order D-dimer.' },
      { min: 11, max: 25, label: 'High', risk: 'high', recommendation: 'PE prevalence ~74%; proceed to CTPA.' },
    ],
    sourceRef: 'esc-2019-pe',
    sourceNote: 'Revised Geneva score (Le Gal 2006).',
  },
  {
    id: 'years-pe',
    name: 'YEARS algorithm (PE)',
    kind: 'score',
    category: 'Thromboembolism',
    description: 'D-dimer-based rule to exclude pulmonary embolism.',
    criteria: [
      { id: 'dvt', label: 'Clinical signs of DVT', points: 1 },
      { id: 'hemoptysis', label: 'Haemoptysis', points: 1 },
      { id: 'likely', label: 'PE is the most likely diagnosis', points: 1 },
    ],
    bands: [
      { min: 0, max: 0, label: '0 YEARS items', risk: 'low', recommendation: 'PE excluded if D-dimer <1000 ng/mL (age-adjusted).' },
      { min: 1, max: 3, label: '≥1 YEARS item', risk: 'moderate', recommendation: 'PE excluded if D-dimer <500 ng/mL (age-adjusted); otherwise CTPA.' },
    ],
    sourceRef: 'esc-2019-pe',
    sourceNote: 'YEARS algorithm (van der Hulle 2017).',
  },
  {
    id: 'hestia-pe',
    name: 'Hestia criteria (PE)',
    kind: 'score',
    category: 'Thromboembolism',
    description: 'Eligibility for outpatient management of acute PE.',
    criteria: [
      { id: 'unstable', label: 'Haemodynamic instability', points: 1 },
      { id: 'thrombolysis', label: 'Thrombolysis or embolectomy needed', points: 1 },
      { id: 'bleeding', label: 'Active bleeding or high bleeding risk', points: 1 },
      { id: 'oxygen', label: 'Oxygen needed >24 h to keep SpO₂ >90%', points: 1 },
      { id: 'anticoag', label: 'PE diagnosed while already on anticoagulation', points: 1 },
      { id: 'pain', label: 'Severe pain needing IV analgesia >24 h', points: 1 },
      { id: 'social', label: 'Medical or social reason for admission', points: 1 },
      { id: 'renal', label: 'Creatinine clearance <30 mL/min', points: 1 },
      { id: 'liver', label: 'Severe liver impairment', points: 1 },
      { id: 'pregnancy', label: 'Pregnancy', points: 1 },
      { id: 'hit', label: 'Documented history of heparin-induced thrombocytopenia', points: 1 },
    ],
    bands: [
      { min: 0, max: 0, label: 'Eligible', risk: 'low', recommendation: 'Outpatient management may be considered.' },
      { min: 1, max: 11, label: 'Not eligible', risk: 'high', recommendation: 'Inpatient management indicated.' },
    ],
    sourceRef: 'esc-2019-pe',
    sourceNote: 'Hestia criteria (Zondag 2011).',
  },
  {
    id: 'shanghai-brugada',
    name: 'Shanghai score (Brugada)',
    kind: 'score',
    category: 'Arrhythmia',
    description: 'Diagnostic score for Brugada syndrome.',
    criteria: [
      { id: 'spont1', label: 'Spontaneous type 1 Brugada ECG', points: 3.5, group: 'ECG', exclusiveGroup: 'ecg' },
      { id: 'fever1', label: 'Fever-induced type 1 Brugada ECG', points: 3, group: 'ECG', exclusiveGroup: 'ecg' },
      { id: 'drug1', label: 'Drug-induced type 1 Brugada ECG', points: 2, group: 'ECG', exclusiveGroup: 'ecg' },
      { id: 'arrest', label: 'Unexplained cardiac arrest', points: 3, group: 'Clinical history' },
      { id: 'resp', label: 'Nocturnal agonal respiration', points: 2, group: 'Clinical history' },
      { id: 'syncope', label: 'Unexplained syncope', points: 2, group: 'Clinical history' },
      { id: 'afpvc', label: 'Atrial fibrillation or PVCs', points: 1, group: 'Clinical history' },
      { id: 'famscd', label: 'Family history of SCD <45 years', points: 2, group: 'Family' },
      { id: 'fambrs', label: 'Family member with type 1 Brugada', points: 2, group: 'Family' },
      { id: 'scn5a', label: 'Pathogenic SCN5A mutation', points: 1.5, group: 'Genetics' },
    ],
    bands: [
      { min: 0, max: 1.99, label: 'Non-diagnostic', risk: 'low', recommendation: 'Brugada syndrome unlikely.' },
      { min: 2, max: 3.49, label: 'Possible', risk: 'moderate', recommendation: 'Further evaluation.' },
      { min: 3.5, max: 20, label: 'Probable / definite', risk: 'high', recommendation: 'Diagnosis of Brugada syndrome (≥3.5).' },
    ],
    sourceRef: 'esc-2022-va-scd',
    sourceNote: 'Shanghai score (Antzelevitch/Kawada 2016–2018).',
  },
  {
    id: 'hfa-peff',
    name: 'HFA-PEFF score',
    kind: 'score',
    category: 'Heart failure',
    description: 'Step-2 diagnostic score for HFpEF (max 2 points per domain).',
    groupCaps: { Functional: 2, Morphological: 2, Biomarker: 2 },
    criteria: [
      { id: 'fn-e', label: 'Functional major: septal e′ <7 / lateral e′ <10 cm/s', points: 2, group: 'Functional' },
      { id: 'fn-ee', label: 'Functional major: E/e′ ≥15', points: 2, group: 'Functional' },
      { id: 'fn-tr', label: 'Functional major: TR velocity >2.8 m/s', points: 2, group: 'Functional' },
      { id: 'fn-gls', label: 'Functional major: GLS <16%', points: 2, group: 'Functional' },
      { id: 'fn-ee2', label: 'Functional minor: E/e′ 9–14', points: 1, group: 'Functional' },
      { id: 'fn-gls2', label: 'Functional minor: GLS 16–18%', points: 1, group: 'Functional' },
      { id: 'mo-lavi', label: 'Morphological major: LAVI >34 mL/m²', points: 2, group: 'Morphological' },
      { id: 'mo-lvmi', label: 'Morphological major: LVMI ≥149/122 or RWT >0.42', points: 2, group: 'Morphological' },
      { id: 'mo-wt', label: 'Morphological major: LV wall thickness ≥12 mm', points: 2, group: 'Morphological' },
      { id: 'mo-lavi2', label: 'Morphological minor: LAVI 29–34 mL/m²', points: 1, group: 'Morphological' },
      { id: 'bi-np', label: 'Biomarker major: NT-proBNP >220 (SR) / >660 (AF) pg/mL', points: 2, group: 'Biomarker' },
      { id: 'bi-np2', label: 'Biomarker minor: NT-proBNP 125–220 (SR) / 375–660 (AF) pg/mL', points: 1, group: 'Biomarker' },
    ],
    bands: [
      { min: 0, max: 1, label: 'HFpEF unlikely', risk: 'low', recommendation: 'Look for alternative causes of dyspnoea.' },
      { min: 2, max: 4, label: 'Diagnostic uncertainty', risk: 'moderate', recommendation: 'Proceed to Step 3 (exercise stress testing).' },
      { min: 5, max: 6, label: 'Definite HFpEF', risk: 'high', recommendation: 'HFpEF confirmed.' },
    ],
    sourceRef: 'acc-2022-hf',
    sourceNote: 'HFA-PEFF consensus (Pieske 2019); cited in the ACC/AHA 2022 HF guideline.',
  },
  {
    id: 'bp-category',
    name: 'Blood pressure category',
    kind: 'classification',
    category: 'Risk & prevention',
    description: 'ESC 2024 classification of office blood pressure.',
    options: [
      { id: 'optimal', label: 'Optimal (<120/70 mmHg)', recommendation: 'Lifestyle measures only.' },
      { id: 'normal', label: 'Normal (120–129/70–79 mmHg)', recommendation: 'Lifestyle measures.' },
      { id: 'high-normal', label: 'High-normal (130–139/85–89 mmHg)', recommendation: 'Lifestyle; treat coexisting risk factors.' },
      { id: 'grade1', label: 'Grade 1 hypertension (140–159/90–99 mmHg)', recommendation: 'Lifestyle ± pharmacological therapy.' },
      { id: 'grade2', label: 'Grade 2 hypertension (160–179/100–109 mmHg)', recommendation: 'Pharmacological therapy.' },
      { id: 'grade3', label: 'Grade 3 hypertension (≥180/110 mmHg)', recommendation: 'Pharmacological therapy; urgent if organ damage.' },
    ],
    sourceRef: 'esc-2024-hypertension',
    sourceNote: 'ESC 2024 blood-pressure classification.',
  },
  {
    id: 'ckm-stage',
    name: 'CKM syndrome stage',
    kind: 'classification',
    category: 'Risk & prevention',
    description: 'Cardiovascular-kidney-metabolic staging.',
    options: [
      { id: '0', label: 'Stage 0 — no CKM risk factors', recommendation: 'Primary prevention.' },
      { id: '1', label: 'Stage 1 — excess/dysfunctional adiposity', recommendation: 'Lifestyle and weight management.' },
      { id: '2', label: 'Stage 2 — metabolic risk factors / CKD', recommendation: 'Treat risk factors; consider SGLT2i/GLP-1 RA.' },
      { id: '3', label: 'Stage 3 — subclinical CVD', recommendation: 'Intensify prevention.' },
      { id: '4', label: 'Stage 4 — clinical CVD', recommendation: 'Secondary prevention; organ-protective therapy.' },
    ],
    sourceRef: 'esc-2019-diabetes',
    sourceNote: 'AHA cardiovascular-kidney-metabolic (CKM) advisory.',
  },
  {
    id: 'osa-severity',
    name: 'OSA severity (AHI)',
    kind: 'classification',
    category: 'Risk & prevention',
    description: 'Apnoea-hypopnoea index grading.',
    options: [
      { id: 'mild', label: 'Mild (AHI 5–15/h)', recommendation: 'Lifestyle; consider treatment if symptomatic.' },
      { id: 'moderate', label: 'Moderate (AHI 15–30/h)', recommendation: 'CPAP or mandibular advancement.' },
      { id: 'severe', label: 'Severe (AHI >30/h)', recommendation: 'CPAP; assess cardiovascular risk.' },
    ],
    sourceRef: 'esc-2019-diabetes',
    sourceNote: 'Sleep-medicine AHI classification.',
  },
];

export const instrumentsMap = new Map(instruments.map((i) => [i.id, i]));

export const getInstrument = (id: string): Instrument | undefined => instrumentsMap.get(id);

/** Distinct categories, in a stable display order. */
export const instrumentCategories = (): string[] => {
  const order = ['Acute coronary', 'Arrhythmia', 'Heart failure', 'Thromboembolism'];
  const present = [...new Set(instruments.map((i) => i.category))];
  return order.filter((c) => present.includes(c)).concat(present.filter((c) => !order.includes(c)));
};
