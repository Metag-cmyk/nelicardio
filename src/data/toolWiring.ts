/**
 * Tool wiring (Phase 4c)
 * ---------------------------------------------------------------------------
 * Maps each condition to the clinical instruments (from `lib/instruments`) that
 * are relevant to it. Used to surface the right scores inside the condition
 * detail and to count "tool coverage" in the Coverage matrix. Only instrument
 * ids that exist in the registry should be listed.
 */
export const conditionInstruments: Record<string, string[]> = {
  // Acute coronary
  stemi: ['grace', 'killip'],
  nstemi: ['grace', 'timi-nstemi', 'killip'],
  'unstable-angina': ['grace', 'timi-nstemi', 'heart'],
  minoca: ['heart'],
  'stable-ischemic-heart-disease': ['ccs-angina', 'heart'],
  'prinzmetal-angina': ['ccs-angina'],
  'coronary-revascularization': ['ccs-angina'],
  'takotsubo-syndrome': ['nyha', 'hf-stage'],
  scad: ['ccs-angina'],
  'non-invasive-testing': ['ccs-angina'],

  // Heart failure & cardiomyopathies
  hfref: ['nyha', 'hf-stage'],
  hfpef: ['h2fpef', 'hfa-peff', 'nyha'],
  'acute-decompensated-hf': ['nyha', 'hf-stage'],
  'dilated-cardiomyopathy': ['nyha', 'hf-stage'],
  'restrictive-cardiomyopathy': ['nyha'],
  'peripartum-cardiomyopathy': ['nyha'],
  'cardiac-sarcoidosis': ['nyha'],
  amyloidosis: ['nyha'],
  'advanced-heart-failure': ['nyha', 'hf-stage', 'scai-shock'],
  hcm: ['nyha'],

  // Arrhythmia
  'atrial-fibrillation': ['cha2ds2-va', 'cha2ds2-vasc', 'has-bled', 'ehra'],
  'atrial-flutter': ['cha2ds2-va', 'cha2ds2-vasc', 'has-bled'],
  'brugada-syndrome': ['shanghai-brugada'],
  'long-qt-syndrome': ['schwartz-lqts'],
  'cardiogenic-shock': ['scai-shock', 'killip'],
  'scai-shock': ['scai-shock'],

  // Thromboembolism / vascular / valvular / other
  'pulmonary-embolism': ['wells-pe', 'geneva-pe', 'spesi', 'years-pe', 'hestia-pe'],
  'pulmonary-arterial-hypertension': ['nyha'],
  'aortic-stenosis': ['nyha'],
  'aortic-regurgitation': ['nyha'],
  'mitral-regurgitation': ['nyha'],
  'mitral-stenosis': ['nyha'],
  'cardio-oncology': ['nyha'],

  // Risk & prevention
  hypertension: ['bp-category'],
  'hypertensive-emergency': ['bp-category'],
  'cardiometabolic-ckm': ['ckm-stage'],
  'obstructive-sleep-apnoea': ['osa-severity'],
};

export const instrumentsForCondition = (conditionId: string): string[] =>
  conditionInstruments[conditionId] ?? [];

export const isToolWired = (conditionId: string): boolean =>
  instrumentsForCondition(conditionId).length > 0;
