export type Modality = 'ECHO' | 'CMR' | 'CCTA' | 'NUCLEAR' | 'CXR';
export type ViewBlueprint = 'PLAX' | 'A4C' | 'A2C' | 'A3C' | 'PSAX' | 'RV' | 'CXR-C' | 'CT-C' | 'CMR-AX' | 'NUC-P' | 'NONE';

export interface SeverityTier {
  label: string;
  min: number;
  max: number;
  color: string;
  description?: string;
}

export interface ImagingParameter {
  id: string;
  name: string;
  shortName: string;
  unit: string;
  modality: Modality;
  category: 'Chambers' | 'Valvular' | 'Vascular' | 'Functional' | 'Tissue' | 'Pulmonary';
  type: 'slider' | 'categorical';
  isIndexed?: boolean;
  blueprint: ViewBlueprint;
  normalRangeM: { min: number; max: number };
  normalRangeF: { min: number; max: number };
  severityTiersM: SeverityTier[];
  severityTiersF: SeverityTier[];
  pearls: string[];
  source: string;
}

export const imagingParameters: ImagingParameter[] = [
  // --- ECHOCARDIOGRAPHY (V3 Expansion) ---
  {
    id: 'echo-lvef',
    name: 'Left Ventricular Ejection Fraction (LVEF)',
    shortName: 'LVEF',
    unit: '%',
    modality: 'ECHO',
    category: 'Functional',
    type: 'slider',
    blueprint: 'A4C',
    normalRangeM: { min: 52, max: 72 },
    normalRangeF: { min: 54, max: 74 },
    severityTiersM: [
      { label: 'Normal', min: 52, max: 72, color: 'text-emerald-500' },
      { label: 'Mildly Reduced', min: 41, max: 51, color: 'text-amber-500' },
      { label: 'Moderately Reduced', min: 30, max: 40, color: 'text-orange-500' },
      { label: 'Severely Reduced', min: 0, max: 29, color: 'text-rose-500' }
    ],
    severityTiersF: [
      { label: 'Normal', min: 54, max: 74, color: 'text-emerald-500' },
      { label: 'Mildly Reduced', min: 41, max: 53, color: 'text-amber-500' },
      { label: 'Moderately Reduced', min: 30, max: 40, color: 'text-orange-500' },
      { label: 'Severely Reduced', min: 0, max: 29, color: 'text-rose-500' }
    ],
    pearls: [
      'Visual estimation (Eyeballing) should be verified by Simpson\'s Biplane.',
      'LVEF is load-dependent; consider afterload (BP) during assessment.'
    ],
    source: 'ESC Heart Failure 2023 / ASE 2015'
  },
  {
    id: 'echo-diastolic',
    name: 'Diastolic Function Grade',
    shortName: 'Diastolic',
    unit: 'grade',
    modality: 'ECHO',
    category: 'Functional',
    type: 'categorical',
    blueprint: 'A4C',
    normalRangeM: { min: 0, max: 0 },
    normalRangeF: { min: 0, max: 0 },
    severityTiersM: [
       { label: 'Normal', min: 0, max: 0, color: 'text-emerald-500', description: 'Avg E/e\' <= 14, TR < 2.8 m/s, LAVI < 34' },
       { label: 'Grade I', min: 1, max: 1, color: 'text-amber-500', description: 'Impaired Relaxation: LAP normal' },
       { label: 'Grade II', min: 2, max: 2, color: 'text-orange-500', description: 'Pseudonormal: LAP elevated' },
       { label: 'Grade III', min: 3, max: 3, color: 'text-rose-600', description: 'Restrictive: High LAP' }
    ],
    severityTiersF: [
       { label: 'Normal', min: 0, max: 0, color: 'text-emerald-500', description: 'Avg E/e\' <= 14, TR < 2.8 m/s, LAVI < 34' },
       { label: 'Grade I', min: 1, max: 1, color: 'text-amber-500', description: 'Impaired Relaxation: LAP normal' },
       { label: 'Grade II', min: 2, max: 2, color: 'text-orange-500', description: 'Pseudonormal: LAP elevated' },
       { label: 'Grade III', min: 3, max: 3, color: 'text-rose-600', description: 'Restrictive: High LAP' }
    ],
    pearls: [
       'Diastolic dysfunction is central to HFpEF diagnosis.',
       'Must exclude Mitral Annular Calcification (MAC) when using E/e\'.'
    ],
    source: 'ASE/EACVI 2016 Update'
  },
  {
    id: 'echo-tapse',
    name: 'RV TAPSE',
    shortName: 'TAPSE',
    unit: 'mm',
    modality: 'ECHO',
    category: 'Functional',
    type: 'slider',
    blueprint: 'RV',
    normalRangeM: { min: 17, max: 30 },
    normalRangeF: { min: 17, max: 30 },
    severityTiersM: [
       { label: 'Normal', min: 17, max: 30, color: 'text-emerald-500' },
       { label: 'Reduced', min: 0, max: 16, color: 'text-rose-500' }
    ],
    severityTiersF: [
       { label: 'Normal', min: 17, max: 30, color: 'text-emerald-500' },
       { label: 'Reduced', min: 0, max: 16, color: 'text-rose-500' }
    ],
    pearls: [
       'TAPSE is a simple, reproducible measure of longitudinal RV systolic function.',
       'May be falsely elevated in severe TR.'
    ],
    source: 'ASE RV Assessment'
  },
  {
    id: 'echo-ao-indexed',
    name: 'Aortic Root (Indexed)',
    shortName: 'Ao Root Index',
    unit: 'mm/m²',
    modality: 'ECHO',
    category: 'Vascular',
    type: 'slider',
    isIndexed: true,
    blueprint: 'A3C',
    normalRangeM: { min: 15, max: 21 },
    normalRangeF: { min: 15, max: 21 },
    severityTiersM: [
       { label: 'Normal', min: 0, max: 21, color: 'text-emerald-500' },
       { label: 'Dilated', min: 22, max: 40, color: 'text-rose-500' }
    ],
    severityTiersF: [
       { label: 'Normal', min: 0, max: 21, color: 'text-emerald-500' },
       { label: 'Dilated', min: 22, max: 40, color: 'text-rose-500' }
    ],
    pearls: [
       'Measure at Sinus of Valsalva in end-diastole (Inner-to-Inner).',
       'Index to BSA in every patient to avoid missing aortic dilation.'
    ],
    source: 'ESC Aortic Disease 2014'
  },
  {
    id: 'echo-mr-pisa',
    name: 'Mitral Regurgitation (PISA)',
    shortName: 'MR EROA',
    unit: 'cm²',
    modality: 'ECHO',
    category: 'Valvular',
    type: 'slider',
    blueprint: 'A4C',
    normalRangeM: { min: 0, max: 0.19 },
    normalRangeF: { min: 0, max: 0.19 },
    severityTiersM: [
       { label: 'Mild', min: 0, max: 0.19, color: 'text-emerald-500' },
       { label: 'Moderate', min: 0.20, max: 0.39, color: 'text-orange-500' },
       { label: 'Severe', min: 0.40, max: 2.0, color: 'text-rose-500' }
    ],
    severityTiersF: [
       { label: 'Mild', min: 0, max: 0.19, color: 'text-emerald-500' },
       { label: 'Moderate', min: 0.20, max: 0.39, color: 'text-orange-500' },
       { label: 'Severe', min: 0.40, max: 2.0, color: 'text-rose-500' }
    ],
    pearls: [
       'EROA >= 0.40 cm² defines severe primary MR.',
       'Secondary MR (FMR) threshold is lower (>= 0.20 cm²) per ESC guidelines.'
    ],
    source: 'ESC Valvular Disease 2021'
  },
  {
    id: 'echo-peri-effusion',
    name: 'Pericardial Effusion Staging',
    shortName: 'Effusion',
    unit: 'size',
    modality: 'ECHO',
    category: 'Tissue',
    type: 'categorical',
    blueprint: 'PLAX',
    normalRangeM: { min: 0, max: 0 },
    normalRangeF: { min: 0, max: 0 },
    severityTiersM: [
       { label: 'None', min: 0, max: 0, color: 'text-emerald-500', description: 'No pericardial fluid' },
       { label: 'Small', min: 1, max: 1, color: 'text-amber-400', description: '< 10mm (Posterior only)' },
       { label: 'Moderate', min: 2, max: 2, color: 'text-orange-500', description: '10-20mm (Circumferential)' },
       { label: 'Large', min: 3, max: 3, color: 'text-rose-600', description: '> 20mm (Potential tamponade)' }
    ],
    severityTiersF: [
       { label: 'None', min: 0, max: 0, color: 'text-emerald-500', description: 'No pericardial fluid' },
       { label: 'Small', min: 1, max: 1, color: 'text-amber-400', description: '< 10mm (Posterior only)' },
       { label: 'Moderate', min: 2, max: 2, color: 'text-orange-500', description: '10-20mm (Circumferential)' },
       { label: 'Large', min: 3, max: 3, color: 'text-rose-600', description: '> 20mm (Potential tamponade)' }
    ],
    pearls: [
       'Always look for RV diastolic collapse or RA systolic collapse (Tamponade signs).',
       'Respiratory variation in mitral inflow (>25%) suggests pulsus paradoxus.'
    ],
    source: 'ESC Pericardial Disease'
  },

  // --- OTHERS (Existing) ---
  {
    id: 'ct-cad-rads',
    name: 'CAD-RADS 2.0 Status',
    shortName: 'CAD-RADS',
    unit: 'score',
    modality: 'CCTA',
    category: 'Vascular',
    type: 'categorical',
    blueprint: 'CT-C',
    normalRangeM: { min: 0, max: 0 },
    normalRangeF: { min: 0, max: 0 },
    severityTiersM: [
       { label: '0: None', min: 0, max: 0, color: 'text-emerald-500', description: 'No plaque' },
       { label: '1-2: Minimal', min: 1, max: 1, color: 'text-emerald-400', description: 'Stenosis < 50%' },
       { label: '3: Moderate', min: 2, max: 2, color: 'text-amber-500', description: 'Stenosis 50-69%' },
       { label: '4: Severe', min: 3, max: 3, color: 'text-orange-500', description: 'Stenosis 70-99%' },
       { label: '5: Occluded', min: 4, max: 4, color: 'text-rose-600', description: '100% Occlusion' }
    ],
    severityTiersF: [
       { label: '0: None', min: 0, max: 0, color: 'text-emerald-500', description: 'No plaque' },
       { label: '1-2: Minimal', min: 1, max: 1, color: 'text-emerald-400', description: 'Stenosis < 50%' },
       { label: '3: Moderate', min: 2, max: 2, color: 'text-amber-500', description: 'Stenosis 50-69%' },
       { label: '4: Severe', min: 3, max: 3, color: 'text-orange-500', description: 'Stenosis 70-99%' },
       { label: '5: Occluded', min: 4, max: 4, color: 'text-rose-600', description: '100% Occlusion' }
    ],
    pearls: [
       'CAD-RADS 3 or higher warrants intensive medical therapy.',
       'Include HRP (High Risk Plaque) modifiers if plaque is non-calcified.'
    ],
    source: 'SCCT CAD-RADS 2.0'
  },
  {
    id: 'cxr-congestion',
    name: 'CXR Congestion Stage',
    shortName: 'Congestion',
    unit: 'stage',
    modality: 'CXR',
    category: 'Pulmonary',
    type: 'categorical',
    blueprint: 'CXR-C',
    normalRangeM: { min: 0, max: 0 },
    normalRangeF: { min: 0, max: 0 },
    severityTiersM: [
       { label: 'Normal', min: 0, max: 0, color: 'text-emerald-500', description: 'Clear lung fields' },
       { label: 'Stage 1: Venous', min: 1, max: 1, color: 'text-amber-400', description: 'Cephalization / Redistribution' },
       { label: 'Stage 2: Interstitial', min: 2, max: 2, color: 'text-orange-500', description: 'Kerley B lines, Peribronchial cuffing' },
       { label: 'Stage 3: Alveolar', min: 3, max: 3, color: 'text-rose-600', description: 'Bat-wing edema, Pleural effusion' }
    ],
    severityTiersF: [
       { label: 'Normal', min: 0, max: 0, color: 'text-emerald-500', description: 'Clear lung fields' },
       { label: 'Stage 1: Venous', min: 1, max: 1, color: 'text-amber-400', description: 'Cephalization / Redistribution' },
       { label: 'Stage 2: Interstitial', min: 2, max: 2, color: 'text-orange-500', description: 'Kerley B lines, Peribronchial cuffing' },
       { label: 'Stage 3: Alveolar', min: 3, max: 3, color: 'text-rose-600', description: 'Bat-wing edema, Pleural effusion' }
    ],
    pearls: [
       'Stage 1 Cephalization occurs at PCWP 12-18 mmHg.',
       'Interstitial edema (Stage 2) occurs at PCWP 18-25 mmHg.'
    ],
    source: 'ESC Heart Failure 2023'
  },
  // --- CMR (Cardiac MRI) ---
  {
    id: 'cmr-lvedvi',
    name: 'LV End-Diastolic Volume Index (LVEDVi)',
    shortName: 'LVEDVi',
    unit: 'mL/m²',
    modality: 'CMR',
    category: 'Chambers',
    type: 'slider',
    isIndexed: true,
    blueprint: 'CMR-AX',
    normalRangeM: { min: 62, max: 105 },
    normalRangeF: { min: 56, max: 91 },
    severityTiersM: [
       { label: 'Normal', min: 62, max: 105, color: 'text-emerald-500' },
       { label: 'Mildly Dilated', min: 106, max: 120, color: 'text-amber-500' },
       { label: 'Moderately Dilated', min: 121, max: 140, color: 'text-orange-500' },
       { label: 'Severely Dilated', min: 141, max: 300, color: 'text-rose-500' }
    ],
    severityTiersF: [
       { label: 'Normal', min: 56, max: 91, color: 'text-emerald-500' },
       { label: 'Mildly Dilated', min: 92, max: 105, color: 'text-amber-500' },
       { label: 'Moderately Dilated', min: 106, max: 125, color: 'text-orange-500' },
       { label: 'Severely Dilated', min: 126, max: 250, color: 'text-rose-500' }
    ],
    pearls: [
       'CMR is the gold standard for ventricular volume quantification.',
       'Always index to BSA using the Mosteller or DuBois formula.'
    ],
    source: 'SCMR Guidelines 2020'
  },
  {
    id: 'cmr-scar',
    name: 'Late Gadolinium Enhancement (LGE)',
    shortName: 'LGE / Scar',
    unit: 'pattern',
    modality: 'CMR',
    category: 'Tissue',
    type: 'categorical',
    blueprint: 'CMR-AX',
    normalRangeM: { min: 0, max: 0 },
    normalRangeF: { min: 0, max: 0 },
    severityTiersM: [
       { label: 'None', min: 0, max: 0, color: 'text-emerald-500', description: 'No replacement fibrosis' },
       { label: 'Ischemic', min: 1, max: 1, color: 'text-rose-500', description: 'Subendocardial / Transmural scar' },
       { label: 'Non-Ischemic', min: 2, max: 2, color: 'text-orange-500', description: 'Mid-wall or Epicardial enhancement' },
       { label: 'Patchy', min: 3, max: 3, color: 'text-amber-500', description: 'Infiltrative pattern (e.g. Sarcoid)' }
    ],
    severityTiersF: [
       { label: 'None', min: 0, max: 0, color: 'text-emerald-500', description: 'No replacement fibrosis' },
       { label: 'Ischemic', min: 1, max: 1, color: 'text-rose-500', description: 'Subendocardial / Transmural scar' },
       { label: 'Non-Ischemic', min: 2, max: 2, color: 'text-orange-500', description: 'Mid-wall or Epicardial enhancement' },
       { label: 'Patchy', min: 3, max: 3, color: 'text-amber-500', description: 'Infiltrative pattern (e.g. Sarcoid)' }
    ],
    pearls: [
       'Subendocardial LGE confirms prior myocardial infarction.',
       'Mid-wall LGE in DCM is a strong predictor of ventricular arrhythmias.'
    ],
    source: 'SCMR Scar Imaging'
  },
  // --- NUCLEAR (SPECT/PET) ---
  {
    id: 'nuc-sss',
    name: 'Summed Stress Score (SSS)',
    shortName: 'SSS',
    unit: 'score',
    modality: 'NUCLEAR',
    category: 'Functional',
    type: 'slider',
    blueprint: 'NUC-P',
    normalRangeM: { min: 0, max: 3 },
    normalRangeF: { min: 0, max: 3 },
    severityTiersM: [
       { label: 'Normal', min: 0, max: 3, color: 'text-emerald-500' },
       { label: 'Mild Defect', min: 4, max: 8, color: 'text-amber-500' },
       { label: 'Moderate Defect', min: 9, max: 13, color: 'text-orange-500' },
       { label: 'Severe Defect', min: 14, max: 68, color: 'text-rose-500' }
    ],
    severityTiersF: [
       { label: 'Normal', min: 0, max: 3, color: 'text-emerald-500' },
       { label: 'Mild Defect', min: 4, max: 8, color: 'text-amber-500' },
       { label: 'Moderate Defect', min: 9, max: 13, color: 'text-orange-500' },
       { label: 'Severe Defect', min: 14, max: 68, color: 'text-rose-500' }
    ],
    pearls: [
       'SSS integrates extent and severity of perfusion defects at stress.',
       'Scores > 13 indicate high-risk coronary artery disease.'
    ],
    source: 'ASNC Imaging Guidelines'
  }
];
