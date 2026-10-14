import type { SocietyView } from '../context/SocietyContext';

/**
 * Exam blueprint taxonomy.
 *
 * `weight` values are ILLUSTRATIVE relative weights (they need not sum to 100;
 * readiness is a weighted average). Replace them with the official конспект
 * weights when available (see SPEC.md open question #1).
 *
 * The three presets share this one taxonomy and differ only by title, source,
 * preferred society, and optional weight overrides — so gaps are computed once.
 */

export interface BlueprintTopic {
  id: string;
  title: string;
  /** Relative exam weight (illustrative). */
  weight: number;
  /** Condition ids (from data/conditions) belonging to this topic. */
  conditionIds: string[];
  /** Guideline ids (from data/guidelines) that cover this topic. */
  guidelineIds: string[];
}

export interface Blueprint {
  id: 'esc-core-curriculum' | 'bg-specialty-exam' | 'acc-in-training';
  title: string;
  source: string;
  preferredSociety: SocietyView;
  /** Optional per-topic weight overrides for this preset. */
  weightOverrides?: Record<string, number>;
}

export const TOPICS: BlueprintTopic[] = [
  { id: 'acs', title: 'Acute coronary syndromes', weight: 15, conditionIds: ['stemi', 'nstemi', 'unstable-angina', 'minoca', 'takotsubo-syndrome', 'scad'], guidelineIds: ['esc-2023-acs', 'acc-2025-acs', 'acc-2021-chest-pain'] },
  { id: 'ccs', title: 'Chronic coronary syndromes', weight: 6, conditionIds: ['stable-ischemic-heart-disease', 'prinzmetal-angina'], guidelineIds: ['esc-2024-ccs', 'acc-2023-ccd'] },
  { id: 'hf', title: 'Heart failure', weight: 12, conditionIds: ['hfref', 'hfpef', 'acute-decompensated-hf', 'dilated-cardiomyopathy', 'amyloidosis'], guidelineIds: ['esc-2026-hf', 'acc-2022-hf'] },
  { id: 'cardiomyopathies', title: 'Cardiomyopathies', weight: 6, conditionIds: ['hcm', 'arvc', 'dilated-cardiomyopathy', 'restrictive-cardiomyopathy', 'peripartum-cardiomyopathy', 'cardiac-sarcoidosis'], guidelineIds: ['esc-2023-cardiomyopathies', 'acc-2024-hcm', 'esc-2022-va-scd'] },
  { id: 'af', title: 'Atrial fibrillation & flutter', weight: 10, conditionIds: ['atrial-fibrillation', 'atrial-flutter'], guidelineIds: ['esc-2024-af', 'acc-2023-af'] },
  { id: 'va-scd', title: 'Ventricular arrhythmias & SCD', weight: 7, conditionIds: ['ventricular-tachycardia', 'brugada-syndrome', 'long-qt-syndrome'], guidelineIds: ['esc-2022-va-scd'] },
  { id: 'svt', title: 'SVT & pre-excitation', weight: 4, conditionIds: ['svt-psvt', 'wpw-syndrome'], guidelineIds: ['esc-2019-svt', 'acc-2015-svt'] },
  { id: 'brady', title: 'Bradycardia & conduction disease', weight: 4, conditionIds: ['third-degree-av-block', 'sick-sinus-syndrome'], guidelineIds: ['esc-2021-pacing', 'acc-2018-bradycardia', 'acc-2017-syncope'] },
  { id: 'vhd', title: 'Valvular heart disease', weight: 10, conditionIds: ['aortic-stenosis', 'aortic-regurgitation', 'mitral-regurgitation', 'mitral-stenosis', 'tricuspid-regurgitation', 'mitral-valve-prolapse', 'bicuspid-aortic-valve', 'prosthetic-valve-management', 'acute-rheumatic-fever'], guidelineIds: ['esc-2025-vhd', 'acc-2020-vhd'] },
  { id: 'endocarditis', title: 'Infective endocarditis', weight: 4, conditionIds: ['infective-endocarditis'], guidelineIds: ['esc-2023-endocarditis'] },
  { id: 'inflammatory', title: 'Myocarditis & pericardial disease', weight: 4, conditionIds: ['myocarditis', 'acute-pericarditis', 'cardiac-tamponade', 'constrictive-pericarditis'], guidelineIds: ['esc-2025-myopericarditis'] },
  { id: 'pe', title: 'Pulmonary embolism', weight: 4, conditionIds: ['pulmonary-embolism'], guidelineIds: ['esc-2019-pe'] },
  { id: 'aortic', title: 'Aortic disease', weight: 5, conditionIds: ['aortic-dissection', 'aaa', 'bicuspid-aortic-valve', 'coarctation-aorta'], guidelineIds: ['esc-2024-pad-aorta', 'acc-2022-aortic'] },
  { id: 'pad', title: 'Peripheral arterial disease', weight: 3, conditionIds: ['peripheral-artery-disease', 'aaa'], guidelineIds: ['esc-2024-pad-aorta', 'acc-2024-pad'] },
  { id: 'chd', title: 'Adult congenital heart disease', weight: 4, conditionIds: ['asd', 'coarctation-aorta', 'bicuspid-aortic-valve', 'ventricular-septal-defect', 'pulmonary-stenosis', 'patent-ductus-arteriosus', 'ebstein-anomaly', 'tetralogy-of-fallot'], guidelineIds: ['esc-2020-achd'] },
  { id: 'emergencies', title: 'Acute & critical care cardiology', weight: 6, conditionIds: ['cardiogenic-shock', 'scai-shock', 'hypertensive-emergency', 'cardiac-tamponade'], guidelineIds: ['esc-2026-hf'] },
  { id: 'prevention', title: 'Preventive cardiology & lipids', weight: 5, conditionIds: ['stable-ischemic-heart-disease', 'peripheral-artery-disease'], guidelineIds: ['esc-2025-lipids', 'acc-2026-dyslipidemia'] },
  { id: 'ckd', title: 'Cardio-renal & cardiometabolic', weight: 3, conditionIds: ['hfref', 'amyloidosis'], guidelineIds: ['esc-2026-ckd'] },
  { id: 'pregnancy', title: 'Cardiovascular disease in pregnancy', weight: 2, conditionIds: ['mitral-stenosis', 'aortic-dissection', 'pulmonary-embolism'], guidelineIds: ['esc-2025-pregnancy'] },
  { id: 'rehab', title: 'Cardiac rehabilitation', weight: 2, conditionIds: ['stable-ischemic-heart-disease', 'hfref'], guidelineIds: ['esc-2026-cardiac-rehab'] },
  { id: 'syncope', title: 'Syncope & autonomic disorders', weight: 4, conditionIds: ['syncope', 'orthostatic-hypotension'], guidelineIds: ['esc-2018-syncope', 'acc-2017-syncope'] },
  { id: 'hypertension', title: 'Hypertension', weight: 5, conditionIds: ['hypertension', 'hypertensive-emergency'], guidelineIds: ['esc-2024-hypertension'] },
  { id: 'pulmonary-hypertension', title: 'Pulmonary hypertension', weight: 4, conditionIds: ['pulmonary-arterial-hypertension'], guidelineIds: ['esc-2022-ph'] },
  { id: 'channelopathies', title: 'Inherited arrhythmia syndromes', weight: 4, conditionIds: ['cpvt', 'short-qt-syndrome', 'long-qt-syndrome', 'brugada-syndrome'], guidelineIds: ['esc-2022-va-scd'] },
  { id: 'devices', title: 'Devices, pacing & CRT', weight: 5, conditionIds: ['implanted-devices', 'third-degree-av-block', 'sick-sinus-syndrome'], guidelineIds: ['esc-2021-pacing', 'esc-2022-va-scd', 'esc-2026-hf'] },
  { id: 'revascularization', title: 'Revascularization (PCI vs CABG)', weight: 5, conditionIds: ['coronary-revascularization', 'stable-ischemic-heart-disease'], guidelineIds: ['acc-2021-revascularization', 'esc-2024-ccs'] },
  { id: 'advanced-hf', title: 'Advanced HF, MCS & transplant', weight: 4, conditionIds: ['advanced-heart-failure', 'cardiogenic-shock'], guidelineIds: ['esc-2026-hf', 'acc-2022-hf'] },
  { id: 'cardio-oncology', title: 'Cardio-oncology', weight: 3, conditionIds: ['cardio-oncology', 'cardiac-tumours'], guidelineIds: ['esc-2022-cardioonc'] },
  { id: 'sports', title: 'Sports cardiology', weight: 3, conditionIds: ['athlete-sports-cardiology'], guidelineIds: ['esc-2020-sports'] },
  { id: 'cardiometabolic', title: 'Cardiometabolic & sleep', weight: 4, conditionIds: ['cardiometabolic-ckm', 'obstructive-sleep-apnoea'], guidelineIds: ['esc-2019-diabetes'] },
  { id: 'geriatric', title: 'Geriatric cardiology', weight: 3, conditionIds: ['geriatric-cardiology'], guidelineIds: [] },
  { id: 'non-invasive-testing', title: 'Non-invasive testing', weight: 4, conditionIds: ['non-invasive-testing'], guidelineIds: ['esc-2024-ccs', 'acc-2021-chest-pain'] },
];

export const BLUEPRINTS: Blueprint[] = [
  {
    id: 'esc-core-curriculum',
    title: 'ESC Core Curriculum',
    source: 'Mapped to the ESC Core Curriculum for the General Cardiologist',
    preferredSociety: 'ESC',
  },
  {
    id: 'bg-specialty-exam',
    title: 'Bulgarian specialty exam',
    source: 'Mapped to the ESC Core Curriculum with the official Bulgarian конспект (64 points)',
    preferredSociety: 'ESC',
    // The Bulgarian exam is ESC-based; weight the core clinical topics a little higher.
    weightOverrides: { acs: 16, hf: 13, af: 11, vhd: 11 },
  },
  {
    id: 'acc-in-training',
    title: 'ACC In-Training (US)',
    source: 'Mapped to AHA/ACC guideline topics',
    preferredSociety: 'AHA/ACC',
    weightOverrides: { prevention: 7, ccs: 8, 'va-scd': 8 },
  },
];

/** Resolve a blueprint's topics with its weight overrides applied. */
export function blueprintTopics(blueprint: Blueprint): BlueprintTopic[] {
  return TOPICS.map((topic) => ({
    ...topic,
    weight: blueprint.weightOverrides?.[topic.id] ?? topic.weight,
  }));
}
