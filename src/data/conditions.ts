export type ConditionCategory = 
  | 'Arrhythmia' 
  | 'Ischemic' 
  | 'Structural' 
  | 'Heart Failure' 
  | 'Vascular' 
  | 'Emergency'
  | 'Other';

export interface TreatmentStep {
  id: string;
  label: string;
  action: string;
  notes?: string;
  category: 'initial' | 'intervention' | 'long-term' | 'escalation';
}

export interface ScoringSystem {
  id: string;
  name: string;
  description?: string;
  criteria: { label: string; points: number; category?: string }[];
  interpretation: { range: string; risk: string; recommendation?: string }[];
}

export interface ImagingMatrix {
  title: string;
  headers: string[];
  rows: { metric: string; values: string[] }[];
}

export interface PharmaProtocol {
  title: string;
  steps: { label: string; action: string }[];
}

export interface Condition {
  id: string;
  name: string;
  category: ConditionCategory;
  priority?: 'Normal' | 'Critical';
  summary?: string;
  /** One- to two-sentence overview of the disturbed physiology. */
  pathophysiology?: string;
  /**
   * Ordered mechanistic chain — the pathogenesis focus: trigger → mechanism →
   * remodelling → haemodynamic/functional consequence → clinical correlate.
   */
  pathogenesis?: { stage?: string; text: string }[];
  etiology?: string[];
  classifications?: { name: string; score?: string; interpretation?: string }[];
  symptoms: string[];
  /** Objective physical findings (complementary to symptoms). */
  signs?: string[];
  diagnosticCriteria: string[];
  diagnosticAlgorithm?: string[];
  labDeviations?: { label: string; value: string; direction?: '↑' | '↓' | '±'; range?: string; isCritical?: boolean }[];
  ekgFindings?: string[];
  imaging?: {
    echo?: string[];
    ct_mri?: string[];
    cxr?: string[];
  };
  severeCriteria?: {
    label: string;
    metrics: { name: string; value: string; unit: string }[];
  };
  treatmentAlgorithm?: TreatmentStep[];
  management: {
    primary: string[];
    secondary: string[];
    /** Mechanistic rationale linking drug class / step to its target in the pathogenesis. */
    rationale?: string[];
  };
  clinicalTools?: {
    scores?: ScoringSystem[];
    imaging?: ImagingMatrix[];
    protocols?: PharmaProtocol[];
  };
  pearls: string[];
  differentialDiagnosis?: string[];
  discriminators?: Record<string, string>;
  redFlags: string[];
  visualCues?: {
    title: string;
    imagePath: string;
    description: string;
  }[];
  source?: string;
  lastUpdated?: string;
}


export const conditions: Condition[] = [
  {
    id: 'atrial-fibrillation',
    name: 'Atrial Fibrillation (AFib)',
    category: 'Arrhythmia',
    summary: 'Rapid, irregular atrial rhythm leading to poor blood flow and risk of stroke.',
    pathophysiology: 'Re-entrant electrical circuits in the atria, often originating from the pulmonary veins, leading to uncoordinated atrial contraction and stasis of blood in the left atrial appendage.',
    pathogenesis: [
      { stage: 'Trigger', text: 'Rapidly firing ectopic foci in the pulmonary vein ostia initiate the arrhythmia.' },
      { stage: 'Substrate', text: 'Atrial fibrosis and electrical remodelling (shortened refractory period) sustain it.' },
      { stage: 'Re-entry', text: 'Multiple re-entrant wavelets cause loss of organised atrial contraction.' },
      { stage: 'Stasis', text: 'Blood stasis in the left atrial appendage promotes thrombus formation and embolism.' },
      { stage: 'Remodelling', text: 'Tachycardia-mediated atrial and ventricular remodelling makes the arrhythmia self-perpetuating.' }
    ],
    signs: [
      'Irregularly irregular pulse',
      'Pulse deficit (apical rate exceeds radial rate)',
      'Variable first heart sound intensity',
      'Signs of heart failure or systemic embolism'
    ],
    etiology: [
      'Hypertension',
      'Valvular heart disease (Mitral)',
      'Hyperthyroidism',
      'Obesity / Sleep Apnea',
      'Alcohol consumption ("Holiday Heart")',
      'Advanced Age'
    ],
    classifications: [
      { name: 'EHRA Score', interpretation: 'Symptom severity (I: None, II: Mild, III: Severe, IV: Disabling)' },
      { name: 'CHA2DS2-VASc', interpretation: 'Stroke risk stratification (Low: 0, Mod: 1, High: >=2)' },
      { name: 'HAS-BLED', interpretation: 'Bleeding risk assessment while on anticoagulation' }
    ],
    symptoms: [
      'Palpitations (fluttering in chest)',
      'Shortness of breath (SOB)',
      'Fatigue or exercise intolerance',
      'Lightheadedness or dizziness'
    ],
    diagnosticCriteria: [
      'Irregularly irregular rhythm on auscultation/pulse.',
      'Confirmed by 12-lead EKG or rhythm strip (lasting >30s).',
      'Absence of p-waves.'
    ],
    diagnosticAlgorithm: [
      'Confirm irregularity (>30s)',
      'Exclude reversible causes (Thyroid, EtOH, PE)',
      'Assess hemodynamic stability',
      'Calculate CHA2DS2-VASc'
    ],
    labDeviations: [
      { label: 'Teads', value: 'Normal', isCritical: false },
      { label: 'TSH', value: 'Low (Hyperthyroid)', isCritical: false },
      { label: 'Cardiac Troponin', value: 'Stable or ↑ in RVR', isCritical: false }
    ],
    ekgFindings: [
      'Absence of discrete P waves.',
      'Irregularly irregular R-R intervals.',
      'Fibrillatory waves (f-waves) seen in V1.'
    ],
    imaging: {
      echo: [
        'LA enlargement (>4.0 cm or >22 ml/m²).',
        'Exclude LA/LAA thrombus before cardioversion.',
        'Assessment of valvular structure (Mitral/Tricuspid).'
      ],
      cxr: [
        'Often normal.',
        'Enlarged cardiac silhouette if chronic/congestive HF present.'
      ]
    },
    treatmentAlgorithm: [
      { id: 'af-1', label: 'Stability Assessment', action: 'Check for hemodynamic instability (Shock, Pulmonary Edema, ACS).', category: 'initial' },
      { id: 'af-2', label: 'Urgent Cardioversion', action: 'If unstable, immediate Synchronized Cardioversion (after sedation).', category: 'intervention', notes: 'Consider Heparin bolus before shock if possible.' },
      { id: 'af-3', label: 'Rate Control', action: 'Beta-blocker (Metoprolol 5mg IV) or CCB (Diltiazem 0.25mg/kg IV) if stable.', category: 'intervention' },
      { id: 'af-4', label: 'Anticoagulation', action: 'Calculate CHA2DS2-VASc score; start DOAC if score >=2 (Male) or >=3 (Female).', category: 'long-term' },
      { id: 'af-5', label: 'Rhythm Control', action: 'Amiodarone or Catheter Ablation for symptomatic refractory patients.', category: 'escalation' }
    ],
    clinicalTools: {
      scores: [
        {
          id: 'cha2ds2-vasc',
          name: 'CHA2DS2-VASc Score',
          description: 'Stroke risk stratification in non-valvular AFib',
          criteria: [
            { label: 'Congestive Heart Failure', points: 1 },
            { label: 'Hypertension', points: 1 },
            { label: 'Age ≥ 75 years', points: 2 },
            { label: 'Diabetes Mellitus', points: 1 },
            { label: 'Stroke/TIA/Thromboembolism', points: 2 },
            { label: 'Vascular Disease (Prior MI, PAD)', points: 1 },
            { label: 'Age 65-74 years', points: 1 },
            { label: 'Sex Category (Female)', points: 1 }
          ],
          interpretation: [
            { range: '0-1 (M/F)', risk: 'Low', recommendation: 'Consider no anticoagulation' },
            { range: '≥1 (M) / ≥2 (F)', risk: 'Moderate-High', recommendation: 'Oral Anticoagulation (DOAC preferred)' }
          ]
        },
        {
          id: 'has-bled',
          name: 'HAS-BLED Score',
          description: 'Major bleeding risk assessment on anticoagulation',
          criteria: [
            { label: 'Hypertension (SBP > 160)', points: 1 },
            { label: 'Abnormal Renal/Liver Function', points: 1 },
            { label: 'Stroke History', points: 1 },
            { label: 'Bleeding Predisposition', points: 1 },
            { label: 'Labile INRs (if on Warfarin)', points: 1 },
            { label: 'Elderly (Age > 65)', points: 1 },
            { label: 'Drugs or Alcohol', points: 1 }
          ],
          interpretation: [
            { range: '0-2', risk: 'Low-Moderate', recommendation: 'Relatively safe' },
            { range: '≥3', risk: 'High Risk', recommendation: 'Requires caution & frequent review' }
          ]
        }
      ],
      protocols: [
        {
          title: 'DOAC Renal Adjustment Guide',
          steps: [
            { label: 'Apixaban', action: 'Reduce to 2.5mg BID if 2/3: Age ≥80, Wt ≤60kg, Cr ≥1.5.' },
            { label: 'Rivaroxaban', action: '15mg QD if CrCl 15-50 ml/min (20mg otherwise).' },
            { label: 'Dabigatran', action: 'Avoid if CrCl < 30 ml/min.' }
          ]
        }
      ]
    },
    management: {
      primary: [
        'Rate Control: Beta-blockers (Metoprolol) or Calcium Channel Blockers (Diltiazem).',
        'Anticoagulation: Based on CHA2DS2-VASc score (DOACs preferred over Warfarin).',
        'Rhythm Control: Cardioversion (if <48h or anticoagulated) or Antiarrhythmics (Amiodarone).'
      ],
      secondary: [
        'Catheter Ablation for symptomatic refractory patients.',
        'Left Atrial Appendage Occlusion (LAAO) if anticoagulation is contraindicated.'
      ]
    },
    pearls: [
      '"AF begets AF": Early rhythm control can prevent structural remodeling.',
      'Always calculate HAS-BLED alongside CHA2DS2-VASc.'
    ],
    redFlags: [
      'Syncope (consider TIA/Stroke or RVR leading to low output).',
      'Signs of acute heart failure.',
      'Chest pain (tachycardia-induced ischemia).'
    ],
    differentialDiagnosis: [
      'Atrial Flutter (regularly irregular or fixed block)',
      'Multifocal Atrial Tachycardia (MAT)',
      'Frequent PACs'
    ],
    source: 'ESC 2024 Guidelines',
    lastUpdated: '2024'
  },
  {
    id: 'stemi',
    name: 'ST-Elevation Myocardial Infarction (STEMI)',
    category: 'Ischemic',
    priority: 'Critical',
    summary: 'Full-thickness myocardial necrosis due to complete coronary artery occlusion.',
    pathophysiology: 'Rupture of an atherosclerotic plaque with subsequent thrombus formation leads to total occlusion of a coronary artery, resulting in transmural ischemia and necrosis.',
    pathogenesis: [
      { stage: 'Trigger', text: 'Rupture or erosion of a thin-cap fibroatheroma in a coronary artery.' },
      { stage: 'Thrombosis', text: 'Platelet activation and thrombin generation build an occlusive fibrin-rich thrombus.' },
      { stage: 'Occlusion', text: 'Total occlusion halts antegrade flow; the subendocardium is the most vulnerable zone.' },
      { stage: 'Necrosis', text: 'Transmural coagulative necrosis begins within 20-40 minutes and progresses over hours.' },
      { stage: 'Remodelling', text: 'Neutrophil infiltration, then granulation and fibrosis; the infarcted segment thins and the ventricle dilates (adverse remodelling).' }
    ],
    signs: [
      'Pallor, diaphoresis, cold extremities',
      'Tachycardia or bradycardia; hypotension',
      'New murmur (mitral regurgitation, VSD)',
      'Signs of heart failure (raised JVP, crackles)',
      'Raised JVP without pulmonary congestion in RV infarction'
    ],
    etiology: [
      'Atherosclerotic cardiovascular disease (ASCVD)',
      'Hyperlipidemia',
      'Diabetes Mellitus',
      'Smoking',
      'Family history of premature CAD'
    ],
    classifications: [
      { name: 'Killip Classification', interpretation: 'Heart failure severity (I: No HF, II: Crackles/S3, III: Edema, IV: Shock)' },
      { name: 'TIMI Risk Score', interpretation: '30-day mortality prediction' }
    ],
    symptoms: [
      'Crushing substernal chest pain / pressure',
      'Radiation to left arm, neck, or jaw',
      'Diaphoresis (heavy sweating)',
      'Nausea and vomiting'
    ],
    diagnosticCriteria: [
      'Clinical symptoms of ischemia.',
      'New ST-elevation at the J-point in ≥2 contiguous leads.',
      'Elevation of Cardiac Troponins above 99th percentile.'
    ],
    diagnosticAlgorithm: [
      'Confirm STE (≥1mm)',
      'Check Reciprocal Changes',
      'Time-to-Device (<90m Goal)',
      'Assess for Cardiogenic Shock'
    ],
    labDeviations: [
      { label: 'Troponin', value: 'High (>99th pct)', isCritical: true },
      { label: 'Lactate', value: '↑ if Shock', isCritical: false },
      { label: 'K+', value: 'Monitor closely (RISK: VF)', isCritical: false }
    ],
    ekgFindings: [
      'ST-segment elevation ≥1mm in ≥2 contiguous leads.',
      'New Left Bundle Branch Block (LBBB).',
      'Hyperacute T-waves (early phase).',
      'Reciprocal ST-depression in opposite leads.'
    ],
    imaging: {
      echo: [
        'Regional Wall motion Abnormality (RWMA) in culprit territory.',
        'Assessment of LVEF and mechanical complications (VSD, MR).',
        'Check for pericardial effusion.'
      ],
      ct_mri: [
        'Cardiac MRI: Late Gadolinium Enhancement (LGE) for infarct sizing.',
        'CCTA: Not usually indicated in hyper-acute STEMI (go to Cath Lab).'
      ]
    },
    treatmentAlgorithm: [
      { id: 'stemi-1', label: 'Initial Loading', action: 'Aspirin 325mg (chewed) + P2Y12 (Ticagrelor 180mg) + Heparin UFH bolus.', category: 'initial' },
      { id: 'stemi-2', label: 'Reperfusion Decision', action: 'PCI-capable facility? Goal Door-to-Device < 90 min.', category: 'intervention', notes: 'Radial access preferred over femoral.' },
      { id: 'stemi-3', label: 'Fibrinolysis', action: 'If PCI unavailable within 120 min, give Tenecteplase/Alteplase < 30 min from arrival.', category: 'escalation' },
      { id: 'stemi-4', label: 'Post-PCI Care', action: 'Start High-intensity Statin, ACEi, and Beta-blocker within 24h.', category: 'long-term' }
    ],
    management: {
      primary: [
        'Immediate reperfusion: Primary PCI (goal <90 min from arrival).',
        'Fibrinolytics (Alteplase) if PCI not available within 120 min.',
        'Loading: Aspirin 325mg + P2Y12 inhibitor (Ticagrelor or Prasugrel).'
      ],
      secondary: [
        'Beta-blockers and ACE inhibitors (started within 24h).',
        'High-intensity Statin (Atorvastatin 80mg).',
        'Long-term Dual Antiplatelet Therapy (DAPT).'
      ]
    },
    clinicalTools: {
      scores: [
        {
          id: 'timi-stemi',
          name: 'TIMI Risk Score for STEMI',
          description: 'Mortality risk calculation for STEMI patients',
          criteria: [
            { label: 'Age ≥ 75 (3 pts) or 65-74 (2 pts)', points: 3 },
            { label: 'Diabetes, HTN, or Angina', points: 1 },
            { label: 'SBP < 100 mmHg', points: 3 },
            { label: 'Heart Rate > 100 bpm', points: 2 },
            { label: 'Killip II-IV', points: 2 },
            { label: 'Weight < 67 kg', points: 1 },
            { label: 'Anterior STE or LBBB', points: 1 },
            { label: 'Time-to-Treatment > 4 hrs', points: 1 }
          ],
          interpretation: [
            { range: '0-2', risk: 'Low (0-2%)', recommendation: 'Standard care' },
            { range: '3-4', risk: 'Intermediate (4-7%)', recommendation: 'Intensive monitoring' },
            { range: '≥5', risk: 'High (>12%)', recommendation: 'High risk; consider mechanical support if cardiogenic shock' }
          ]
        },
        {
          id: 'killip-class',
          name: 'Killip Classification',
          description: 'Clinical severity of heart failure in acute MI',
          criteria: [
             { label: 'Killip I: No HF signs', points: 0 },
             { label: 'Killip II: Crackles / S3 Gallop', points: 1 },
             { label: 'Killip III: Acute Pulmonary Edema', points: 2 },
             { label: 'Killip IV: Cardiogenic Shock', points: 3 }
          ],
          interpretation: [
             { range: 'I', risk: '6% Mortality', recommendation: 'Low baseline risk' },
             { range: 'IV', risk: '81% Mortality', recommendation: 'Requires mechanical circulatory support' }
          ]
        }
      ]
    },
    pearls: [
      '"Time is muscle": Every 30-minute delay increases mortality.',
      'Beware of the "Widow Maker" (LAD occlusion).'
    ],
    redFlags: [
      'Cardiogenic shock (hypotension, cold extremities).',
      'Acute pulmonary edema.',
      'Ventricular Arrhythmias (V-Fid/V-Tach).'
    ],
    differentialDiagnosis: [
      'Acute Pericarditis (diffuse STE)',
      'Aortic Dissection',
      'Prinzmetal Angina',
      'Takotsubo Cardiomyopathy'
    ],
    source: 'AHA/ACC STEMI Guidelines',
    lastUpdated: '2024'
  },
  {
    id: 'hfref',
    name: 'HF with Reduced Ejection Fraction (HFrEF)',
    category: 'Heart Failure',
    summary: 'Clinical syndrome characterized by reduced pump function (LVEF <= 40%).',
    pathophysiology: 'Initial myocardial insult (ischemia, toxins, hypertension) leads to ventricular remodeling, eccentric hypertrophy, and progressive systolic dysfunction, triggering neurohormonal activation (RAAS, Sympathetic).',
    pathogenesis: [
      { stage: 'Index insult', text: 'Myocardial infarction, toxin, pressure or volume overload damages contractile mass.' },
      { stage: 'Systolic loss', text: 'Reduced stroke volume lowers cardiac output and perfusion.' },
      { stage: 'Neurohormonal activation', text: 'RAAS and sympathetic activation initially maintain perfusion.' },
      { stage: 'Adverse remodelling', text: 'Chronic activation causes vasoconstriction, sodium retention and eccentric hypertrophy.' },
      { stage: 'Vicious cycle', text: 'Progressive dilatation and further systolic dysfunction perpetuate the syndrome.' }
    ],
    signs: [
      'Displaced, laterally deviated apical impulse',
      'Raised JVP, peripheral oedema, ascites',
      'Third heart sound (S3) gallop',
      'Cool peripheries with narrow pulse pressure in low-output states'
    ],
    etiology: [
      'Ischemic Heart Disease (most common)',
      'Dilated Cardiomyopathy',
      'Valvular Heart Disease',
      'Persistent Tachyarrhythmias',
      'Viral Myocarditis'
    ],
    classifications: [
      { name: 'NYHA Functional Class', interpretation: 'Symptom level (I: No limitations, IV: Symptoms at rest)' },
      { name: 'ACC/AHA HF Stages', interpretation: 'Structural progression (Stage A: At risk, Stage D: Advanced)' }
    ],
    symptoms: [
      'Dyspnea on exertion (DOE)',
      'Orthopnea (need to prop up with pillows)',
      'Paroxysmal Nocturnal Dyspnea (PND)',
      'Edema (swelling of ankles/legs)'
    ],
    diagnosticCriteria: [
      'Signs and symptoms of heart failure.',
      'Ejection Fraction (EF) ≤ 40% on Echocardiogram.',
      'Elevated Natriuretic Peptides (BNP or NT-proBNP).'
    ],
    diagnosticAlgorithm: [
      'Symptoms + EF ≤40%',
      'Rule out Ischemia',
      'Assess Volemic Status',
      'Initiate 4 Pillars'
    ],
    ekgFindings: [
      'Left Bundle Branch Block (LBBB) - QRS > 120ms with notched R in V6.',
      'Left Ventricular Hypertrophy (LVH) - Sokolow-Lyon criteria.',
      'Frequent Premature Ventricular Contractions (PVCs).',
      'Atrial Fibrillation (common comorbid rhythm).'
    ],
    imaging: {
      echo: [
        'LVEF ≤ 40% (Global systolic dysfunction).',
        'Increased Left Ventricular End-Diastolic Diameter (LVEDD).',
        'Functional Mitral Regurgitation (tethering).',
        'Elevated E/e\' ratio suggesting high filling pressures.'
      ],
      cxr: [
        'Cardiomegaly (Cardiothoracic ratio > 0.5).',
        'Pulmonary venous congestion (Cephalization).',
        'Pleural effusions (usually bilateral or right-sided).'
      ]
    },
    labDeviations: [
      { label: 'BNP', value: 'Elevated (>400 pg/mL)', isCritical: false },
      { label: 'Cr', value: 'Baseline vs. AKI', isCritical: false },
      { label: 'Na+', value: '↓ in Advanced HF', isCritical: false }
    ],
    treatmentAlgorithm: [
      { id: 'hf-1', label: 'Diuresis', action: 'Decongest with IV Loop Diuretics until euvolemic.', category: 'initial', notes: 'Monitor K+, Cr, and daily weights.' },
      { id: 'hf-2', label: 'The Four Pillars', action: 'Initiate ARNI, Beta-blocker, MRA, and SGLT2i simultaneously or in rapid sequence.', category: 'intervention' },
      { id: 'hf-3', label: 'Titration', action: 'Up-titrate GDMT every 2 weeks to maximum tolerated goal doses.', category: 'long-term' },
      { id: 'hf-4', label: 'SCD Prevention', action: 'If EF <=35% after 3m of OMT, consider ICD or CRT (if QRS >=130ms).', category: 'escalation' }
    ],
    management: {
      primary: [
        'The "Four Pillars": ARNI (Sacubitril/Valsartan), Beta-blocker, MRA (Spironolactone), and SGLT2 inhibitor.',
        'Diuretics (Furosemide) for volume control (symptomatic only).'
      ],
      secondary: [
        'ICD for EF ≤ 35% after 3 months of optimal medical therapy.',
        'CRT for QRS ≥ 130ms and LBBB.',
        'Advanced therapies: LVAD or Transplant.'
      ]
    },
    clinicalTools: {
      protocols: [
        {
          title: 'GDMT Titration Guide (HFrEF)',
          steps: [
            { label: 'Step 1: Initiation', action: 'Start ARNI + BB + MRA + SGLT2i immediately (simultaneous or rapid seq).' },
            { label: 'Step 2: Titration', action: 'Up-titrate BB and ARNI every 2 weeks to target doses (e.g. Metoprolol 200mg/d, Entresto 97/103mg BID).' },
            { label: 'Step 3: Verification', action: 'Re-assess LVEF after 3 months of maximally tolerated GDMT.' }
          ]
        },
        {
          title: 'ICD / CRT-D Eligibility',
          steps: [
            { label: 'Primary SCD Prevention', action: 'ICD indicated if LVEF ≤ 35% AFTER 90 days of GDMT (and NYHA II-III).' },
            { label: 'CRT-D Criteria', action: 'LVEF ≤ 35% + QRS ≥ 150ms + LBBB morphology (Class I).' },
            { label: 'Non-LBBB Note', action: 'If QRS 120-149ms or non-LBBB, benefit is more limited (Class IIa/b).' }
          ]
        }
      ]
    },
    pearls: [
      'SGLT2 inhibitors provide benefits even in patients without diabetes.',
      'Beta-blockers should be initiated only when the patient is stable/euvolemic.'
    ],
    redFlags: [
      'Acute decompensation (Flash Pulmonary Edema).',
      'Worsening renal function.',
      'Refractory VT/VF.'
    ],
    differentialDiagnosis: [
      'COPD/Asthma',
      'Pneumonia',
      'PE',
      'HFpEF'
    ],
    discriminators: {
      'COPD/Asthma': 'Wheezing present; High BNP usually excludes pure pulmonary cause.',
      'Pneumonia': 'Fever, cough, and purulent sputum; Consolidation on CXR.',
      'PE': 'Sudden onset; Wells Score high; Wedge pressure normal.',
      'HFpEF': 'Symptoms identical, but EF ≥ 50% on Echo.'
    },
    source: 'ESC Heart Failure Guidelines 2023',
    lastUpdated: '2023'
  },
  {
    id: 'aortic-stenosis',
    name: 'Severe Aortic Stenosis (AS)',
    category: 'Structural',
    summary: 'Narrowing of the aortic valve orifice, obstructing blood flow from the LV to the aorta.',
    pathophysiology: 'Chronic mechanical stress leads to calcification, fibrosis, and fusion of the aortic valve cusps, resulting in increased afterload and subsequent concentric Left Ventricular Hypertrophy (LVH).',
    pathogenesis: [
      { stage: 'Initiation', text: 'Endothelial injury and lipid deposition on the valve leaflets.' },
      { stage: 'Valve change', text: 'Chronic inflammation, fibrosis and calcification with progressive cusp fusion.' },
      { stage: 'Obstruction', text: 'Outflow obstruction increases left ventricular afterload.' },
      { stage: 'Hypertrophy', text: 'Compensatory concentric LV hypertrophy preserves output at rest.' },
      { stage: 'Decompensation', text: 'LVH causes subendocardial ischaemia and diastolic dysfunction; fixed obstruction limits output reserve, producing angina, syncope and failure.' }
    ],
    signs: [
      'Ejection systolic murmur radiating to the carotids',
      'Slow-rising, low-amplitude pulse (pulsus parvus et tardus)',
      'Narrow pulse pressure',
      'Soft or absent second heart sound',
      'Signs of heart failure in the decompensated stage'
    ],
    etiology: [
      'Age-related calcification (Senile)',
      'Bicuspid Aortic Valve (Congenital)',
      'Rheumatic Heart Disease',
      'Hyperlipidemia'
    ],
    symptoms: [
      'The "SAD" triad: Syncope, Angina, Dyspnea',
      'Exertional lightheadedness',
      'Decreased exercise tolerance'
    ],
    diagnosticCriteria: [
      'Harsh systolic crescendo-decrescendo murmur at RUSB.',
      'Paradoxically split S2.',
      'Echo: Aortic Valve Area (AVA) < 1.0 cm², Mean gradient > 40 mmHg.'
    ],
    diagnosticAlgorithm: [
      'Auscultate (systolic murmur)',
      'Confirm Severity via Echo',
      'Evaluate for "SAD" Triad',
      'Compare AVA and Mean Gradient'
    ],
    ekgFindings: [
      'Left Ventricular Hypertrophy (LVH) with strain pattern (ST-depression/TWI in lateral leads).',
      'Left Atrial Enlargement (P-mitrale).',
      'Left Axis Deviation.',
      'AV blocks (if calcification extends into the conduction system).'
    ],
    imaging: {
      echo: [
        'Aortic Valve Area (AVA) < 1.0 cm² (Severe) or < 0.6 cm²/m².',
        'Mean pressure gradient > 40 mmHg (Severe).',
        'Peak velocity (Vmax) > 4 m/s.',
        'Concentric LV Hypertrophy.'
      ],
      cxr: [
        'Aortic valve calcification (visible on lateral view).',
        'Post-stenotic dilation of the ascending aorta.',
        'Rounding of the left cardiac border (LVH silhouette).'
      ]
    },
    labDeviations: [
      { label: 'BNP', value: '↑ in symptomatic AS', isCritical: false },
      { label: 'Troponin', value: 'Leaks in severe cases', isCritical: false }
    ],
    treatmentAlgorithm: [
      { id: 'as-1', label: 'Severity Confirmation', action: 'Confirm Severe AS via Echo: Vmax >4m/s, Mean Gradient >40mmHg, or AVA <1.0cm².', category: 'initial' },
      { id: 'as-2', label: 'Symptom Assessment', action: 'Evaluate for the "SAD" triad (Syncope, Angina, Dyspnea).', category: 'initial' },
      { id: 'as-3', label: 'Intervention Decision', action: 'If symptomatic, proceed to TAVI or SAVR based on age and surgical risk.', category: 'intervention', notes: 'Consider stress test if asymptomatic but high-grade AS.' },
      { id: 'as-4', label: 'Contraindication Check', action: 'Avoid aggressive vasodilator/ACEi therapy in severe obstructive AS.', category: 'long-term' }
    ],
    management: {
      primary: [
        'Valve Replacement (Surgical SAVR or Transcatheter TAVI).',
        'TAVI is now preferred for patients >75y or those with high surgical risk.'
      ],
      secondary: [
        'Symptom management (Diuretics) while awaiting intervention.',
        'Avoid aggressive afterload reduction (ACEi) in severe stenosis.'
      ]
    },
    clinicalTools: {
      imaging: [
        {
          title: 'Aortic Stenosis Severity Matrix',
          headers: ['Mild', 'Moderate', 'Severe'],
          rows: [
            { metric: 'Peak Velocity (m/s)', values: ['2.0 - 2.9', '3.0 - 4.0', '> 4.0'] },
            { metric: 'Mean Gradient (mmHg)', values: ['< 20', '20 - 40', '> 40'] },
            { metric: 'Valve Area (cm²)', values: ['> 1.5', '1.0 - 1.5', '< 1.0'] },
            { metric: 'Dimensionless Index', values: ['> 0.50', '0.25 - 0.50', '< 0.25'] }
          ]
        }
      ]
    },
    pearls: [
      'Symptoms signal a drastic drop in life expectancy (2-5 years without replacement).',
      'Check for "Low-flow, low-gradient" AS in patients with low EF.'
    ],
    redFlags: [
      'Syncope on exertion.',
      'New onset Heart Failure symptoms.',
      'Sudden Cardiac Death risk.'
    ],
    differentialDiagnosis: [
      'HOCM',
      'Mitral Regurgitation',
      'Bicuspid Aortic Valve'
    ],
    discriminators: {
      'HOCM': 'Murmur INCREASES with Valsalva/Standing (Preload reduction).',
      'Mitral Regurgitation': 'Holosystolic murmur radiating to axilla; no carotid radiation.',
      'Bicuspid Aortic Valve': 'Younger patients; systolic ejection click often present.'
    },
    source: 'AHA/ACC Valvular Disease 2020',
    lastUpdated: '2024'
  },
  {
    id: 'svt-psvt',
    name: 'Supraventricular Tachycardia (SVT)',
    category: 'Arrhythmia',
    summary: 'Rapid heart rhythm originating above the ventricles, often causing sudden palpitations.',
    pathophysiology: 'Re-entrant rhythm involving either the AV node (AVNRT) or an accessory pathway (AVRT), or an ectopic atrial focus (Atrial Tachycardia).',
    pathogenesis: [
      { stage: 'Trigger', text: 'An atrial premature beat.' },
      { stage: 'Substrate', text: 'Dual AV-nodal pathways (AVNRT), an accessory pathway (AVRT), or an ectopic atrial focus.' },
      { stage: 'Re-entry', text: 'A critically timed impulse initiates a re-entrant circuit.' },
      { stage: 'Rate', text: 'A rapid, regular narrow-complex tachycardia ensues.' },
      { stage: 'Consequence', text: 'Reduced diastolic filling; usually tolerated, but can cause syncope or tachycardia-mediated cardiomyopathy.' }
    ],
    signs: [
      'Regular rapid pulse (~150-250 bpm)',
      'Haemodynamic stability is usual',
      'Cannon A waves from atrial contraction against a closed tricuspid valve',
      'Signs of low output if very fast or in structural heart disease'
    ],
    etiology: [
      'Accessory electrical pathways (WPW)',
      'Excessive caffeine or stimulant use',
      'Hyperthyroidism',
      'Electrolyte disturbances',
      'Emotional stress or physical exhaustion'
    ],
    symptoms: [
      'Sudden onset rapid pounding in chest',
      'Anxiety / Panic sensation',
      'Neck pulsation',
      'Polyuria (due to ANP release)'
    ],
    diagnosticCriteria: [
      'Regular narrow-complex tachycardia (>150 bpm).',
      'Abrupt onset and termination.'
    ],
    diagnosticAlgorithm: [
      'Regular Narrow QRS?',
      'Attempt Vagal Maneuver',
      'Adenosine 6mg rapid IV',
      'R/o A-Flutter with 2:1 block'
    ],
    labDeviations: [
      { label: 'BNP', value: 'Transient ↑ during RVR', isCritical: false },
      { label: 'Na+', value: 'ANP-mediated diuresis', isCritical: false }
    ],
    ekgFindings: [
      'Heart rate 150-250 bpm.',
      'P-waves usually buried in QRS or retrograde.',
      'Narrow QRS (<120ms).'
    ],
    imaging: {
      echo: [
        'Usually structurally normal heart.',
        'Exclude cardiomyopathy if recurrent/refractory.',
        'Assess for Mitral Valve Prolapse (associated with some SVTs).'
      ]
    },
    treatmentAlgorithm: [
      { id: 'svt-1', label: 'Vagal Maneuvers', action: 'Modified Valsalva (Legs up) or Carotid Sinus Massage.', category: 'initial' },
      { id: 'svt-2', label: 'Adenosine Trial', action: 'Adenosine 6mg rapid IV push; then 12mg if no conversion.', category: 'intervention', notes: 'Warn patient of brief flushing/chest pressure.' },
      { id: 'svt-3', label: 'Escalation', action: 'IV Diltiazem or Metoprolol if adenosine fails.', category: 'intervention' },
      { id: 'svt-4', label: 'Cardioversion', action: 'Immediate Synchronized Cardioversion if hemodynamically unstable.', category: 'intervention' },
      { id: 'svt-5', label: 'Prevention', action: 'Catheter Ablation or long-term Beta-blocker.', category: 'long-term' }
    ],
    management: {
      primary: [
        'Vagal Maneuvers (Modified Valsalva).',
        'Adenosine 6mg rapid IV push (then 12mg if needed).',
        'Synchronized Cardioversion if hemodynamically unstable.'
      ],
      secondary: [
        'Beta-blockers or Verapamil for prevention.',
        'Catheter Ablation (highly effective for AVNRT/AVRT).'
      ]
    },
    pearls: [
      'Modified Valsalva (legs up) increases success rate from 17% to 43%.',
      'Adenosine can cause brief asystole; warn the patient of a "dying" sensation.'
    ],
    redFlags: [
      'Hypotension / Shock.',
      'Chest pain.',
      'Syncope.'
    ],
    differentialDiagnosis: [
      'Sinus Tachycardia',
      'Atrial Flutter with 2:1 block',
      'Ventricular Tachycardia (if QRS is wide)'
    ],
    source: 'ESC Tachycardia Guidelines',
    lastUpdated: '2024'
  },
  {
    id: 'ventricular-tachycardia',
    name: 'Ventricular Tachycardia (VT)',
    category: 'Arrhythmia',
    summary: 'Life-threatening rapid heart rhythm originating from the ventricles.',
    pathophysiology: 'Ectopic electrical activity originating in the ventricles (below the His bundle), often due to re-entry around a myocardial scar (ischemic) or triggered activity/automaticity.',
    pathogenesis: [
      { stage: 'Trigger', text: 'A premature ventricular beat in a susceptible substrate.' },
      { stage: 'Substrate', text: 'Re-entry around a myocardial scar (ischaemic) or triggered activity/automaticity.' },
      { stage: 'Circuit', text: 'A stable circuit sustains monomorphic VT.' },
      { stage: 'Haemodynamics', text: 'Loss of AV synchrony and a rapid rate reduce cardiac output.' },
      { stage: 'Deterioration', text: 'May degenerate to ventricular fibrillation and cardiac arrest.' }
    ],
    signs: [
      'Rapid regular pulse or impalpable pulse',
      'Hypotension and syncope',
      'Cannon A waves',
      'Dissociated venous pulsation',
      'Signs of ischaemia or heart failure'
    ],
    classifications: [
      { name: 'Morphology', interpretation: 'Monomorphic vs polymorphic' },
      { name: 'Duration', interpretation: 'Non-sustained (<30 s) vs sustained (>=30 s or haemodynamic compromise)' },
      { name: 'Substrate', interpretation: 'Ischaemic (scar-related) vs non-ischaemic / inherited' }
    ],
    etiology: [
      'Ischemic Heart Disease (Old MI)',
      'Electrolyte Imbalance (K+, Mg2+)',
      'Long QT Syndrome',
      'Cardiomyopathy (DCM, HCM, ARVC)',
      'Drug Toxicity'
    ],
    symptoms: [
      'Sudden palpitations',
      'Shortness of breath',
      'Presyncope or Syncope',
      'Chest discomfort'
    ],
    diagnosticCriteria: [
      'Wide-complex tachycardia (QRS ≥ 120ms).',
      'Rate usually > 100 bpm (monomorphic or polymorphic).',
      'AV dissociation (P-waves dissociated from QRS).'
    ],
    diagnosticAlgorithm: [
      'Wide QRS (>120ms)',
      'Check Hemodynamic Pulse',
      'Look for AV Dissociation',
      'Confirm with Brugada criteria'
    ],
    labDeviations: [
      { label: 'K+', value: 'Hypokalemia Triggers', isCritical: false },
      { label: 'Mg2+', value: 'Check for TdP risk', isCritical: false },
      { label: 'Troponin', value: 'Leak due to Tachycardia', isCritical: false }
    ],
    ekgFindings: [
      'Wide QRS complexes.',
      'AV dissociation / Capture beats / Fusion beats.',
      'Northwest axis deviation (Extreme right axis).'
    ],
    imaging: {
      echo: [
        'Assessment of LVEF (crucial for ICD indication).',
        'Identify regional wall motion abnormalities (Old Infarct).',
        'Exclude structural disease (ARVC/HCM/DCM).'
      ],
      ct_mri: [
        'Cardiac MRI (LGE): Gold standard for identifying myocardial scar/fibrosis.',
        'Quantification of infarct size.',
        'Fatty infiltration of RV (suggests ARVC).'
      ]
    },
    treatmentAlgorithm: [
      { id: 'vt-1', label: 'Stability Check', action: 'Assess for pulse and hemodynamic stability.', category: 'initial' },
      { id: 'vt-2', label: 'Pharmacotherapy', action: 'Stable: Amiodarone 150mg IV bolus or Procainamide IV.', category: 'intervention' },
      { id: 'vt-3', label: 'Electrical Therapy', action: 'Unstable or Persistent: Synchronized Cardioversion.', category: 'intervention' },
      { id: 'vt-4', label: 'Pulseless VT', action: 'Immediate Defibrillation and ACLS protocol.', category: 'intervention' },
      { id: 'vt-5', label: 'Secondary Prevention', action: 'ICD Implantation (Class I) and Beta-blocker initiation.', category: 'long-term' }
    ],
    management: {
      primary: [
        'Stable: Amiodarone 150mg IV or Procainamide IV.',
        'Unstable (with pulse): Synchronized Cardioversion.',
        'Pulseless: Defibrillation (ACLS code).'
      ],
      secondary: [
        'ICD implantation for secondary prevention.',
        'Beta-blockers if structurally normal heart.',
        'Ablation for refractory cases.'
      ]
    },
    clinicalTools: {
      protocols: [
        {
          title: 'Amiodarone Loading Protocol',
          steps: [
            { label: 'Cardiac Arrest', action: '300mg IV Bolus; secondary 150mg if needed.' },
            { label: 'Stable VT (IV Loading)', action: '150mg IV over 10 mins; can repeat once.' },
            { label: 'Maintenance Infusion', action: '1mg/min for 6 hrs; then 0.5mg/min for 18 hrs.' }
          ]
        }
      ]
    },
    pearls: [
      '"Wide complex tachycardia = VT until proven otherwise" in patients with structural heart disease.',
      'Brugada criteria can help differentiate VT from SVT with aberrancy.'
    ],
    redFlags: [
      'Loss of consciousness.',
      'Hypotension / Shock.',
      'Active chest pain / Ischemia.'
    ],
    differentialDiagnosis: [
      'SVT with pre-existing BBB',
      'SVT with rate-related aberrancy',
      'Antidromic AVRT'
    ],
    source: 'ACC/AHA/HRS 2024 VT Guidelines',
    lastUpdated: '2024'
  },
  {
    id: 'atrial-flutter',
    name: 'Atrial Flutter (A-Flutter)',
    category: 'Arrhythmia',
    summary: 'A macro-re-entrant atrial rhythm characterized by a "sawtooth" pattern on EKG.',
    pathophysiology: 'A single macro-re-entrant circuit, most commonly utilizing the cavotricuspid isthmus (typical flutter), leading to rapid atrial rates (250-350 bpm) with varying degrees of AV block.',
    pathogenesis: [
      { stage: 'Trigger', text: 'An atrial premature beat in a susceptible atrium.' },
      { stage: 'Substrate', text: 'A macro-re-entrant circuit around the tricuspid annulus (cavotricuspid isthmus).' },
      { stage: 'Rate', text: 'Atrial rate ~250-350 bpm with variable AV block (often 2:1, giving ~150 bpm).' },
      { stage: 'Consequence', text: 'Loss of the atrial kick and a rapid ventricular rate impair filling.' },
      { stage: 'Stasis', text: 'Left atrial appendage stasis creates a thromboembolic risk similar to AF.' }
    ],
    signs: [
      'Rapid regular or regularly irregular pulse (~150 bpm with 2:1 block)',
      'Jugular venous flutter waves',
      'Signs of reduced cardiac output',
      'Carotid pulsation may exceed the ventricular rate'
    ],
    etiology: [
      'Chronic Obstructive Pulmonary Disease (COPD)',
      'Valvular Heart Disease',
      'Post-cardiac surgery',
      'Hyperthyroidism',
      'Atrial enlargement'
    ],
    symptoms: [
      'Palpitations (often regular)',
      'Fatigue / Weakness',
      'Mild dyspnea',
      'Exercise intolerance'
    ],
    diagnosticCriteria: [
      'Sawtooth "F-waves" usually at rate 250-350 bpm.',
      'Regular ventricular rate (often 150 bpm due to 2:1 block).',
      'Regularly irregular if block varies.'
    ],
    diagnosticAlgorithm: [
      'Analyze II/III/aVF Sawtooth',
      'Assess conduction ratio',
      'Test responsiveness to DC Shock',
      'R/o Isthmus-dependence'
    ],
    labDeviations: [
      { label: 'K+', value: 'Maintain ≥ 4.0 mEq/L', isCritical: false },
      { label: 'Mg2+', value: 'Maintain ≥ 2.0 mEq/L', isCritical: false }
    ],
    ekgFindings: [
      'Negative sawtooth waves in II, III, aVF (Typical).',
      'Positive sawtooth in II, III, aVF (Atypical/Reverse).',
      'Fixed or variable conduction ratio.'
    ],
    imaging: {
      echo: [
        'Measurement of Left Atrial (LA) dimensions.',
        'Rule out LA/LAA thrombus before cardioversion (TEE preferred).',
        'Assessment of Right Atrial (RA) enlargement.'
      ]
    },
    treatmentAlgorithm: [
      { id: 'afl-1', label: 'Rate Control', action: 'Beta-blocker or CCB (Diltiazem/Verapamil).', category: 'initial', notes: 'A-Flutter is often refractory to rate control.' },
      { id: 'afl-2', label: 'Cardioversion', action: 'Highly responsive to low-energy DC Shock (50-100J).', category: 'intervention' },
      { id: 'afl-3', label: 'Anticoagulation', action: 'Calculate CHA2DS2-VASc; chronic therapy as per AFib guidelines.', category: 'long-term' },
      { id: 'afl-4', label: 'Ablation', action: 'Isthmus-dependent flutter: Early Catheter Ablation (High success rate).', category: 'intervention' }
    ],
    management: {
      primary: [
        'Rate Control: Beta-blockers or CCB (Diltiazem).',
        'Anticoagulation: Same as AFib (CHA2DS2-VASc).',
        'Cardioversion: Highly sensitive to low-energy DC shock.'
      ],
      secondary: [
        'Catheter Ablation (Isthmus-dependent): High success rate (>95%).',
        'Long-term antiarrhythmic therapy (Class IC or III).'
      ]
    },
    pearls: [
      'More difficult to rate control than AFib.',
      'Ablation is often the first-line therapy for recurrent Typical Flutter.'
    ],
    redFlags: [
      '1:1 conduction (very high HR, cardiovascular collapse).',
      'Syncope.',
      'Worsening heart failure.'
    ],
    differentialDiagnosis: [
      'Atrial fibrillation',
      'SVT / AVNRT',
      'MAT'
    ],
    source: 'ESC 2024 AF/Flutter Guidelines',
    lastUpdated: '2024'
  },
  {
    id: 'third-degree-av-block',
    name: '3rd Degree AV Block (Complete Heart Block)',
    category: 'Arrhythmia',
    summary: 'Complete failure of electrical conduction between the atria and ventricles.',
    pathophysiology: 'Total dissociation of atrial and ventricular activity due to complete failure of conduction through the AV node, Bundle of His, or both bundle branches, necessitating an escape rhythm.',
    pathogenesis: [
      { stage: 'Trigger', text: 'Injury or degeneration of the conduction system.' },
      { stage: 'Mechanism', text: 'Complete failure of conduction through the AV node, His bundle or both bundle branches.' },
      { stage: 'Escape', text: 'A junctional (~40-60 bpm) or ventricular (20-40 bpm) escape rhythm emerges.' },
      { stage: 'Dissociation', text: 'Atria and ventricles beat independently (AV dissociation).' },
      { stage: 'Consequence', text: 'Bradycardia reduces cardiac output; risk of syncope and sudden death.' }
    ],
    signs: [
      'Bradycardia with a regular slow pulse',
      'Intermittent Cannon A waves',
      'Variable first heart sound intensity',
      'Wide pulse pressure',
      'Syncope (Stokes-Adams attacks)'
    ],
    etiology: [
      'Infarction (Inferior MI)',
      'Degenerative fibrosis (Lenegre disease)',
      'Medication toxicity (Beta-blockers, CCBs, Digoxin)',
      'Hyperkalemia',
      'Infectious (Lyme disease)'
    ],
    symptoms: [
      'Profound fatigue',
      'Dizziness or Syncope',
      'Convulsions (Stokes-Adams attacks)',
      'Dyspnea'
    ],
    diagnosticCriteria: [
      'No relationship between P waves and QRS complexes.',
      'Atrial rate > Ventricular rate.',
      'Constant P-P and R-R intervals.'
    ],
    diagnosticAlgorithm: [
      'Assess P-QRS dissociation',
      'Determine Escape Site (Narrow/Wide)',
      'Check for reversible triggers (Meds, Mi)',
      'Assess Hemodynamic stability'
    ],
    labDeviations: [
      { label: 'K+', value: 'Hyperkalemia (Trigger)', isCritical: false },
      { label: 'Digoxin', value: 'Check for toxicity', isCritical: false },
      { label: 'Troponin', value: 'Rule out ACS (Inferior MI)', isCritical: false }
    ],
    ekgFindings: [
      'P-waves "marching" through QRS complexes.',
      'Narrow QRS (Junctional escape) or Wide QRS (Ventricular escape).',
      'Bradycardia (20-60 bpm).'
    ],
    imaging: {
      echo: [
        'Identify potential structural triggers (Inferior MI, Myocarditis).',
        'Rule out abscess (if IE suspected).',
        'Assessment of LVEF.'
      ]
    },
    treatmentAlgorithm: [
      { id: 'avb-1', label: 'Acute Stabilization', action: 'Atropine 1mg IV; repeat q3-5m (total 3mg).', category: 'initial', notes: 'May not be effective in infra-nodal block.' },
      { id: 'avb-2', label: 'External Pacing', action: 'Transcutaneous Pacing (TCP) for symptomatic/unstable block.', category: 'intervention' },
      { id: 'avb-3', label: 'Transvenous Bridge', action: 'Temporary Transvenous Pacing (TVP) if TCP is failing or painful.', category: 'intervention' },
      { id: 'avb-4', label: 'Definitive Care', action: 'Permanent Pacemaker (PPM) Implantation.', category: 'long-term' }
    ],
    management: {
      primary: [
        'Atropine 0.5-1mg (may not work if infra-nodal).',
        'Transcutaneous Pacing (TCP).',
        'Transvenous Pacing (TVP) as bridge to permanent.'
      ],
      secondary: [
        'Permanent Pacemaker (PPM) implantation.',
        'Review and stop nodal-blocking agents.'
      ]
    },
    pearls: [
      'Narrow QRS escape usually suggests nodal/his site (better prognosis).',
      'Wide QRS escape suggests infra-hisian site (more unstable).'
    ],
    redFlags: [
      'Asystole / Long pauses (>3s).',
      'Hypotension.',
      'Syncope.'
    ],
    differentialDiagnosis: [
      'Mobitz II AV Block',
      'Non-conducted PACs',
      'Atrioventricular dissociation (without block)'
    ],
    source: 'AHA/ACC/HRS Bradycardia 2018',
    lastUpdated: '2024'
  },
  {
    id: 'nstemi',
    name: 'Non-ST Elevation MI (NSTEMI)',
    category: 'Ischemic',
    summary: 'Partial coronary artery occlusion causing myocardial necrosis without ST elevation.',
    pathophysiology: 'Plaque rupture or erosion with non-occlusive thrombus leads to subendocardial ischemia and necrosis, evidenced by elevated cardiac biomarkers without transmural ST-segment elevation.',
    pathogenesis: [
      { stage: 'Trigger', text: 'Plaque rupture or erosion.' },
      { stage: 'Thrombus', text: 'A non-occlusive, platelet-rich thrombus forms at the lesion.' },
      { stage: 'Ischaemia', text: 'Flow limitation plus a demand-supply mismatch cause subendocardial ischaemia.' },
      { stage: 'Necrosis', text: 'Necrosis remains confined to the subendocardium and releases troponin.' },
      { stage: 'Dynamics', text: 'Intermittent occlusion or vasospasm produces dynamic flow and fluctuating symptoms.' }
    ],
    signs: [
      'Autonomic signs (sweating, pallor)',
      'Signs of acute heart failure',
      'New mitral regurgitation murmur',
      'Haemodynamic instability in high-risk cases'
    ],
    etiology: [
      'Atherosclerotic plaque rupture',
      'Coronary vasospasm',
      'Supply-demand mismatch (Type 2 MI)',
      'Microvascular dysfunction'
    ],
    symptoms: [
      'Angina at rest or with minimal exertion',
      'Nausea / Diaphoresis',
      'Shortness of breath'
    ],
    diagnosticCriteria: [
      'Elevated cardiac biomarkers (Troponin) with a rising/falling pattern.',
      'No ST-elevation on EKG.',
      'Evidence of ischemia (ST-depression or T-wave inversion).'
    ],
    diagnosticAlgorithm: [
      'Confirm Troponin elevation',
      'Assess Clinical Ischemia',
      'Calculate GRACE Score',
      'Rule out STEMI (No STE)'
    ],
    labDeviations: [
      { label: 'Troponin', value: 'Positive (Elevated)', isCritical: true },
      { label: 'Cr', value: 'Monitor for CIN post-cath', isCritical: false },
      { label: 'Lactate', value: '↑ if Cardiogenic Shock', isCritical: false }
    ],
    treatmentAlgorithm: [
      { id: 'nst-1', label: 'Loading', action: 'Aspirin 325mg + P2Y12 (Ticagrelor 180mg) + Heparin (UFH or Enoxaparin).', category: 'initial' },
      { id: 'nst-2', label: 'Risk Stratification', action: 'Calculate GRACE / HEART scores.', category: 'initial' },
      { id: 'nst-3', label: 'Path Selection', action: 'Very High Risk: Immediate invasive (<2h); High Risk: Early invasive (<24h).', category: 'intervention' },
      { id: 'nst-4', label: 'Secondary Prevention', action: 'Beta-blocker, ACEi, and High-intensity Statin.', category: 'long-term' }
    ],
    ekgFindings: [
      'ST-segment depression (≥0.5 mm) in ≥2 contiguous leads.',
      'T-wave inversion (>1 mm) in leads with dominant R waves.',
      'Transient ST changes that resolve with symptom relief.',
      'Normal EKG in up to 30-50% of NSTE-ACS (does not exclude ischemia).',
      'New LBBB or paced rhythm obscures ST-segment assessment.'
    ],
    imaging: {
      echo: [
        'Regional wall motion abnormality (RWMA) in the culprit territory.',
        'LVEF assessment to guide prognosis and secondary prevention (ACEi/ARB).',
        'Exclude mechanical complications (acute MR, VSD) and LV thrombus.',
        'Assessment of right ventricular involvement in inferior territory.'
      ]
    },
    management: {
      primary: [
        'Antiplatelets: Aspirin (325mg) + P2Y12 inhibitor.',
        'Anticoagulation: Heparin (UFH) or LMWH (Enoxaparin).',
        'Anti-ischemics: Nitroglycerin, Beta-blockers (if no HF).'
      ],
      secondary: [
        'Invasive strategy (Cath) within 24-72h based on risk (GRACE score).',
        'Statin therapy (High-intensity).',
        'ACE-inhibitor if EF < 40%.'
      ]
    },
    pearls: [
      'Always differentiate from Unstable Angina based on Troponin elevation.',
      'Wellens Syndrome: Warning sign for critical LAD stenosis (deep TWI in V2-V3).'
    ],
    redFlags: [
      'Refractory chest pain.',
      'Hemodynamic instability / Shock.',
      'Dynamic EKG changes.'
    ],
    differentialDiagnosis: [
      'Unstable Angina',
      'Myocarditis',
      'Takotsubo',
      'Aortic Dissection'
    ],
    source: 'AHA/ACC NSTE-ACS 2024',
    lastUpdated: '2024'
  },
  {
    id: 'unstable-angina',
    name: 'Unstable Angina (UA)',
    category: 'Ischemic',
    summary: 'Ischemic chest pain occurring at rest or with increasing frequency, without necrosis.',
    pathophysiology: 'Transient or incomplete coronary occlusion that causes myocardial ischemia but is not prolonged or severe enough to cause detectable myocardial necrosis (negative biomarkers).',
    pathogenesis: [
      { stage: 'Trigger', text: 'Unstable plaque with fissuring or erosion.' },
      { stage: 'Thrombus', text: 'Transient, non-occlusive thrombus forms and may embolise distally.' },
      { stage: 'Ischaemia', text: 'Intermittent flow reduction causes ischaemia without prolonged occlusion.' },
      { stage: 'Vasomotion', text: 'Focal vasoconstriction at the lesion amplifies the flow limitation.' },
      { stage: 'Reversibility', text: 'Ischaemia resolves without detectable necrosis (negative troponin).' }
    ],
    signs: [
      'Transient ischaemic ECG changes during pain',
      'Signs of heart failure if a large area is at risk',
      'No biomarker evidence of necrosis'
    ],
    etiology: [
      'Atherosclerotic plaque progression',
      'Transient thrombus formation',
      'Vasoconstriction'
    ],
    symptoms: [
      'New onset severe angina',
      'Angina at rest (>20 min)',
      'Increasing intensity (Crescendo pattern)'
    ],
    diagnosticCriteria: [
      'Clinical symptoms of ischemia.',
      'Negative cardiac biomarkers (Troponin).',
      'EKG may show ST-depression or TWI (transient).'
    ],
    diagnosticAlgorithm: [
      'Rule out NSTEMI (Neg Trops)',
      'Assess for "Crescendo" Pattern',
      'Calculate TIMI Score',
      'Aspirin + Early Stress Test/Cath'
    ],
    labDeviations: [
      { label: 'Troponin', value: 'Strictly Negative', isCritical: false },
      { label: 'Ldl', value: 'Assess for baseline risk', isCritical: false }
    ],
    ekgFindings: [
      'Normal EKG in >50% of cases.',
      'Transient ST-segment depression (≥0.5mm).',
      'T-wave inversion (>1mm) in leads with dominant R waves.',
      'Dynamic changes (appearing and resolving with pain).'
    ],
    imaging: {
      echo: [
        'Often normal at rest.',
        'Transient regional wall motion abnormalities (RWMA) during episodes of pain.',
        'Assessment of LVEF to determine risk.'
      ],
      cxr: [
        'Usually normal.',
        'May show signs of congestion if multi-vessel disease/HF present.'
      ]
    },
    management: {
      primary: [
        'Aspirin 325mg.',
        'Sublingual Nitroglycerin.',
        'Risk stratification (TIMI / GRACE score).'
      ],
      secondary: [
        'Stress testing or Coronary Angiography.',
        'Medical optimization (Statins, Beta-blockers).'
      ]
    },
    pearls: [
      'UA and NSTEMI are collectively termed NSTE-ACS.',
      'UA carries a high risk of progressing to MI if untreated.'
    ],
    redFlags: [
      'Chest pain lasting > 20 min at rest.',
      'Hypotension.',
      'New mitral regurgitation murmur (papillary muscle ischemia).'
    ],
    differentialDiagnosis: [
      'Stable Angina',
      'NSTEMI',
      'Gerd',
      'Panic Attack'
    ],
    source: 'AHA/ACC NSTE-ACS',
    lastUpdated: '2024'
  },
  {
    id: 'prinzmetal-angina',
    name: "Prinzmetal's (Variant) Angina",
    category: 'Ischemic',
    summary: 'Episodes of chest pain caused by temporary coronary artery vasospasm.',
    pathophysiology: 'Hyper-reactivity of coronary vascular smooth muscle leads to focal, intense vasospasm causing transient transmural ischemia (ST-elevation) in the absence of high-grade obstructive CAD.',
    pathogenesis: [
      { stage: 'Trigger', text: 'Coronary vascular smooth-muscle hyper-reactivity.' },
      { stage: 'Spasm', text: 'Focal intense coronary vasospasm.' },
      { stage: 'Ischaemia', text: 'Transient transmural ischaemia (ST elevation).' },
      { stage: 'Resolution', text: 'Spontaneous or nitrate-induced resolution.' },
      { stage: 'Consequence', text: 'Arrhythmia or VF risk during episodes; usually no fixed obstruction.' }
    ],
    signs: [
      'Transient ST elevation during pain',
      'Pain at rest or at night',
      'Arrhythmia during episodes',
      'Usually no fixed stenosis on angiography'
    ],
    etiology: [
      'Smoking',
      'Stimulant use (Cocaine)',
      'Emotional stress',
      'Cold exposure',
      'Autoimmune dysfunction'
    ],
    symptoms: [
      'Episodes of chest pain at rest (often between midnight and early morning)',
      'Not usually triggered by exertion',
      'Rapid response to Nitroglycerin'
    ],
    diagnosticCriteria: [
      'Transient ST-segment elevation during pain.',
      'Absence of high-grade obstructive CAD on angiography.',
      'Provocative testing (Acetylcholine/Ergonovine) induces spasm.'
    ],
    diagnosticAlgorithm: [
      'Record EKG during pain (STE)',
      'Confirm STE resolves post-Nitro',
      'Rule out obstructive CAD via Angio',
      'Assess for tobacco/stimulant triggers'
    ],
    labDeviations: [
      { label: 'Troponin', value: 'Usually Negative', isCritical: false },
      { label: 'Cotinine', value: 'Elevated in smokers', isCritical: false }
    ],
    ekgFindings: [
      'Transient ST-segment elevation (resembles STEMI but resolves with pain).',
      'No development of pathologic Q-waves.',
      'Transient R-wave peaked amplitude during spasm.',
      'Ventricular arrhythmias (VT/VF) may occur during peak ischemia.'
    ],
    imaging: {
      echo: [
        'Usually normal between episodes.',
        'Transient wall motion abnormality during focal spasm.',
        'Rule out structural heart disease as a trigger.'
      ]
    },
    management: {
      primary: [
        'Calcium Channel Blockers (CCB) - First-line (Verapamil/Diltiazem/Amlodipine).',
        'Nitrates for acute episodes.'
      ],
      secondary: [
        'Smoking cessation (critical trigger).',
        'Avoid non-selective Beta-blockers (may worsen spasm via alpha-1).'
      ]
    },
    pearls: [
      'Typically affects younger patients without traditional CAD risk factors.',
      'Avoid high-dose Aspirin as it may inhibit prostacyclin (vasoconstrictor effect).'
    ],
    treatmentAlgorithm: [
      { id: 'prz-1', label: 'Acute Episode', action: 'Sublingual Nitroglycerin or IV Nitrates for rapid vasodilation.', category: 'initial' },
      { id: 'prz-2', label: 'Maintenance', action: 'Calcium Channel Blockers (Diltiazem or Amlodipine) as first-line therapy.', category: 'intervention' },
      { id: 'prz-3', label: 'Escalation', action: 'Long-acting Nitrates (ISMN) as add-on therapy.', category: 'escalation' },
      { id: 'prz-4', label: 'Prevention', action: 'Strict Smoking Cessation and avoidance of sympathomimetics.', category: 'long-term' }
    ],
    redFlags: [
      'Spasm-induced ventricular arrhythmias (VF/VT).',
      'Syncope during chest pain.'
    ],
    differentialDiagnosis: [
      'STEMI',
      'Cocaine-induced vasospasm',
      'Esophageal spasm'
    ],
    source: 'AHA Cardiology Reference',
    lastUpdated: '2024'
  },
  {
    id: 'hfpef',
    name: 'HF with Preserved Ejection Fraction (HFpEF)',
    category: 'Heart Failure',
    summary: 'Heart failure syndrome where the heart contracts normally but is stiff and fails to fill correctly.',
    pathophysiology: 'Imparied ventricular relaxation and increased myocardial stiffness lead to elevated filling pressures (diastolic dysfunction) despite a preserved ejection fraction (EF ≥ 50%). Often driven by systemic inflammation and comorbidities.',
    pathogenesis: [
      { stage: 'Trigger', text: 'Comorbidity-driven systemic inflammation (obesity, hypertension, diabetes, atrial fibrillation).' },
      { stage: 'Mechanism', text: 'Increased myocardial stiffness and impaired relaxation.' },
      { stage: 'Filling', text: 'Elevated filling pressures (diastolic dysfunction) despite a preserved ejection fraction.' },
      { stage: 'Load', text: 'Left atrial enlargement and pulmonary congestion.' },
      { stage: 'Consequence', text: 'Exertional dyspnoea and HF hospitalisation; right ventricular involvement late.' }
    ],
    signs: [
      'Raised JVP',
      'Bibasal crackles',
      'Peripheral oedema',
      'Fourth heart sound (S4)',
      'Often hypertensive at presentation'
    ],
    etiology: [
      'Advanced Age',
      'Hypertension',
      'Obesity / Metabolic Syndrome',
      'Diabetes Mellitus',
      'Chronic Kidney Disease'
    ],
    symptoms: [
      'Dyspnea on exertion',
      'Exercise intolerance',
      'Orthopnea / PND',
      'Peripheral edema'
    ],
    diagnosticCriteria: [
      'Signs and symptoms of heart failure.',
      'LVEF ≥ 50% on Echocardiogram.',
      'Elevated natriuretic peptides AND structural heart disease (LVH/LAE) / Diastolic dysfunction.'
    ],
    diagnosticAlgorithm: [
      'Symptoms + EF ≥50%',
      'Check NT-proBNP (>125 pg/mL)',
      'Confirm LVH/LAE or E/e\' >9',
      'Calculate H2FPEF Score'
    ],
    ekgFindings: [
      'Left Atrial Enlargement (P-mitrale in lead II).',
      'Left Ventricular Hypertrophy (LVH) with strain pattern.',
      'Atrial Fibrillation (frequent trigger for decompensation).',
      'Normal QRS duration (usually).'
    ],
    imaging: {
      echo: [
        'LVEF ≥ 50% with evidence of diastolic dysfunction.',
        'Left Atrial Volume Index (LAVI) > 34 ml/m².',
        'Septal e\' < 7 cm/s or Lateral e\' < 10 cm/s.',
        'Average E/e\' ratio > 14 (High-fidelity marker).'
      ],
      cxr: [
        'Often normal heart size.',
        'Signs of pulmonary venous congestion during acute episodes.',
        'Pleural effusions may be present.'
      ]
    },
    labDeviations: [
      { label: 'NT-proBNP', value: '↑ (often lower than HFrEF)', isCritical: false },
      { label: 'Uric Acid', value: '↑ in severe diastolic dysfunction', isCritical: false }
    ],
    management: {
      primary: [
        'SGLT2 inhibitors (Empagliflozin/Dapagliflozin) - Strongest evidence.',
        'Diuretics for symptom relief (Furosemide).',
        'MRA (Spironolactone) to reduce hospitalizations.'
      ],
      secondary: [
        'Manage comorbidities (HTN, AFib, Obesity).',
        'ARBs (Candesartan) or ARNIs may be considered in selected patients.'
      ]
    },
    clinicalTools: {
      scores: [
        {
          id: 'h2fpef-score',
          name: 'H2FPEF Score',
          description: 'Probability of HFpEF in patients with dyspnea',
          criteria: [
            { label: 'Heaviness (BMI > 30 kg/m²)', points: 2 },
            { label: 'Hypertension (≥2 meds)', points: 1 },
            { label: 'Atrial Fibrillation (Paroxysmal or Persistent)', points: 3 },
            { label: 'Pulmonary Hypertension (PASP > 35 mmHg)', points: 1 },
            { label: 'Elderly (Age > 60 years)', points: 1 },
            { label: 'Filling Pressures (E/e\' > 9)', points: 1 }
          ],
          interpretation: [
            { range: '0-1', risk: 'Low (<10%)', recommendation: 'Look for other causes' },
            { range: '2-5', risk: 'Intermediate', recommendation: 'Consider invasive exercise testing' },
            { range: '6-9', risk: 'High (>90%)', recommendation: 'Definitive HFpEF diagnosis' }
          ]
        }
      ],
      imaging: [
        {
          title: 'Diastolic Function Matrix',
          headers: ['Grade I', 'Grade II', 'Grade III'],
          rows: [
            { metric: 'E/A Ratio', values: ['≤ 0.8', '0.8 - 2.0', '> 2.0'] },
            { metric: 'Avg E/e\'', values: ['< 10', '10 - 14', '> 14'] },
            { metric: 'LAVi (ml/m²)', values: ['≤ 34', '> 34', '> 34'] },
            { metric: 'TR Velocity (m/s)', values: ['≤ 2.8', '> 2.8', '> 2.8'] }
          ]
        }
      ]
    },
    pearls: [
      'Commonly associated with older age, female sex, and obesity.',
      'Requires ruling out HF mimics like Pulmonary HTN or Valvular disease.'
    ],
    redFlags: [
      'Acute flash pulmonary edema.',
      'Rapidly worsening renal function.',
      'New onset Atrial Fibrillation with RVR.'
    ],
    differentialDiagnosis: [
      'HFrEF',
      'COPD',
      'Obesity-related dyspnea',
      'Cor Pulmonale'
    ],
    source: 'ESC/AHA HF Guidelines 2024',
    lastUpdated: '2024'
  },
  {
    id: 'acute-decompensated-hf',
    name: 'Acute Decompensated Heart Failure (ADHF)',
    category: 'Heart Failure',
    summary: 'Sudden worsening of heart failure symptoms requiring urgent medical therapy.',
    pathophysiology: 'Acute exacerbation of volume overload or low cardiac output (or both), leading to pulmonary and/or systemic congestion due to failing compensatory mechanisms.',
    pathogenesis: [
      { stage: 'Trigger', text: 'A precipitant such as ischaemia, infection, arrhythmia, non-adherence or valve failure.' },
      { stage: 'Mechanism', text: 'Acute volume or pressure overload, or falling cardiac output.' },
      { stage: 'Congestion', text: 'Rising filling pressures cause pulmonary and/or systemic congestion.' },
      { stage: 'Decompensation', text: 'Neurohormonal compensation is exhausted.' },
      { stage: 'Consequence', text: 'Dyspnoea at rest, oedema and hypoxaemia; may progress to cardiogenic shock.' }
    ],
    signs: [
      'Orthopnoea and paroxysmal nocturnal dyspnoea',
      'Bibasal crackles with raised JVP',
      'Peripheral oedema',
      'Third heart sound (S3)',
      'Oliguria and cool peripheries in low-output states'
    ],
    etiology: [
      'Dietary indiscretion (Sodium intake)',
      'Medication non-compliance',
      'Acute Myocardial Ischemia',
      'New onset Arrhythmia (AFib)',
      'Infection / Sepsis'
    ],
    symptoms: [
      'Severe respiratory distress',
      'Wet crackles on auscultation',
      'Weight gain (rapid)',
      'Jugular Venous Distension (JVD)'
    ],
    diagnosticCriteria: [
      'Clinical evidence of volume overload.',
      'Significantly elevated NT-proBNP (>300 in adults).',
      'CXR showing cephalization, Kerley B lines, or pleural effusions.'
    ],
    diagnosticAlgorithm: [
      'Assess for "Wet & Warm/Cold"',
      'Measure NT-proBNP',
      'Perform CXR (B-lines)',
      'Assess Bedside Echo (Lung/VCI)'
    ],
    ekgFindings: [
      'Sinus Tachycardia (compensatory).',
      'New onset Atrial Fibrillation with RVR.',
      'Ischemic changes (ST-depression) due to supply/demand mismatch.',
      'Low voltage (if large pericardial effusion present).'
    ],
    imaging: {
      echo: [
        'Bedside POCUS: Multiple B-lines (Lung rockets) >3 per zone.',
        'Plethoric IVC with <50% respiratory collapse.',
        'Global hypokinesis (if HFrEF) or Small, thick LV (if HFpEF).',
        'Assess for mechanical triggers (Acute MR or VSD).'
      ],
      cxr: [
        'Alveolar edema (Bat-wing distribution).',
        'Kerley B lines (Interlobular septal thickening).',
        'Prominent upper lobe pulmonary veins (Cephalization).'
      ]
    },
    labDeviations: [
      { label: 'NT-proBNP', value: 'Markedly ↑ (>1000)', isCritical: false },
      { label: 'Lactate', value: '↑ if Low-Output state', isCritical: true },
      { label: 'Cr', value: 'Worsening (Cardiorenal)', isCritical: false }
    ],
    management: {
      primary: [
        'Oxygen / Non-invasive ventilation (BiPAP/CPAP).',
        'Loop Diuretics IV (Furosemide 2x home dose).',
        'Vasodilators (Nitroglycerin IV) if BP allows.'
      ],
      secondary: [
        'Inotropes (Dobutamine) if low output/shock.',
        'Mechanical Circulatory Support (IABP/Impella) if refractory.',
        'Transition to GDMT once stable.'
      ]
    },
    pearls: [
      'Always search for the trigger (MI, Arrhythmia, Dietary indiscretion, Med non-compliance).',
      '"Warm & Wet" is the most common presentation.'
    ],
    redFlags: [
      'Hypotension / Cardiogenic shock.',
      'Refractory hypoxemia.',
      'Anuria.'
    ],
    differentialDiagnosis: [
      'Acute Kidney Injury (Overload)',
      'ARDS',
      'Massive PE',
      'Pneumonia'
    ],
    source: 'ESC Heart Failure Guidelines',
    lastUpdated: '2024'
  },
  {
    id: 'mitral-regurgitation',
    name: 'Mitral Regurgitation (MR)',
    category: 'Structural',
    summary: 'Leakage of blood backward through the mitral valve from the LV to the LA during systole.',
    pathophysiology: 'Abnormalities of the valve leaflets, annulus, chordae tendineae, or papillary muscles result in incomplete valve closure, causing volume overload of both the LA and LV.',
    labDeviations: [
      { label: 'BNP/NT-proBNP', value: 'Raised if heart failure', direction: '↑' },
      { label: 'Troponin', value: 'Usually normal', direction: '±' }
    ],
    pathogenesis: [
      { stage: 'Trigger', text: 'Leaflet, annular, chordal or papillary muscle abnormality.' },
      { stage: 'Mechanism', text: 'Incomplete systolic coaptation produces a regurgitant jet into the left atrium.' },
      { stage: 'Load', text: 'Left atrial and left ventricular volume overload (eccentric hypertrophy).' },
      { stage: 'Remodelling', text: 'Progressive LV dilatation and systolic dysfunction.' },
      { stage: 'Consequence', text: 'Pulmonary congestion, atrial fibrillation and eventually heart failure.' }
    ],
    signs: [
      'Holosystolic murmur at the apex radiating to the axilla',
      'Third heart sound (S3)',
      'Displaced, hyperdynamic apical impulse',
      'Signs of pulmonary congestion'
    ],
    etiology: [
      'Degenerative (Mitral Valve Prolapse)',
      'Ischemic (Papillary muscle dysfunction)',
      'Rheumatic Heart Disease',
      'Functional (LV enlargement/remodeling)',
      'Infective Endocarditis'
    ],
    symptoms: [
      'Dyspnea on exertion / Fatigability',
      'Palpitations (AFib common)',
      'Signs of right heart failure (Advanced)'
    ],
    diagnosticCriteria: [
      'Holosystolic murmur at the apex radiating to the axilla.',
      'Confirmed by Echocardiography (PISA, Vena Contracta).',
      'LA and LV enlargement on chronic cases.'
    ],
    ekgFindings: [
      'Often normal in early disease.',
      'Signs of Left Atrial Enlargement (p-mitrale).',
      'Signs of Left Ventricular Hypertrophy (LVH).',
      'Atrial Fibrillation (frequent complication).'
    ],
    imaging: {
      echo: [
        'Regurgitant jet area vs. LA area ratio.',
        'Vena contracta width ≥ 0.7 cm (Severe).',
        'Regurgitant volume ≥ 60 mL (Severe).',
        'Effective Regurgitant Orifice Area (EROA) ≥ 0.40 cm² (Severe).'
      ],
      cxr: [
        'Left atrial and left ventricular enlargement.',
        'Pulmonary venous congestion.',
        'Mitral valve calcification (if degenerative).'
      ]
    },
    severeCriteria: {
      label: 'Severe MR Criteria (ASE)',
      metrics: [
        { name: "VC Width", value: "≥ 0.7", unit: "cm" },
        { name: "Regurg Vol", value: "≥ 60", unit: "mL" },
        { name: "EROA", value: "≥ 0.40", unit: "cm²" },
        { name: "Fraction", value: "≥ 50", unit: "%" }
      ]
    },
    management: {
      primary: [
        'Afterload reduction (ACEi/ARB) for symptomatic chronic MR.',
        'Diuretics for volume control.',
        'Surgical Repair (preferred over replacement).'
      ],
      secondary: [
        'Transcatheter Edge-to-Edge Repair (TEER/MitraClip) for high surgical risk.',
        'AFib management (Anticoagulation).'
      ]
    },
    pearls: [
      'Acute MR (e.g., chordal rupture) is a surgical emergency.',
      'Standard HF medications are not proven to prevent progression of primary MR.'
    ],
    redFlags: [
      'Acute Pulmonary Edema.',
      'New onset AFib.',
      'Worsening LV systolic function (EF < 60% is a trigger for surgery in MR).'
    ],
    differentialDiagnosis: [
      'Tricuspid Regurgitation',
      'Aortic Stenosis',
      'VSD'
    ],
    source: 'AHA/ACC Valvular Disease',
    lastUpdated: '2024'
  },
  {
    id: 'hcm',
    name: 'Hypertrophic Cardiomyopathy (HCM)',
    category: 'Structural',
    summary: 'Genetic disorder causing unexplained thickening of the heart muscle.',
    pathophysiology: 'Mutations in sarcomere proteins lead to asymmetric myocardial hypertrophy (usually of the septum), myofibrillar disarray, and fibrosis, often causing LV outflow tract (LVOT) obstruction.',
    pathogenesis: [
      { stage: 'Genetic defect', text: 'A sarcomere gene mutation (e.g. MYH7, MYBPC3).' },
      { stage: 'Myocyte change', text: 'Myocyte disarray and interstitial fibrosis develop.' },
      { stage: 'Hypertrophy', text: 'Asymmetric septal hypertrophy thickens the outflow septum.' },
      { stage: 'Obstruction', text: 'Dynamic LVOT obstruction (systolic anterior motion of the mitral valve), worsened by reduced preload or increased contractility.' },
      { stage: 'Consequences', text: 'Diastolic dysfunction, ischaemia and an arrhythmia substrate cause syncope and sudden cardiac death risk.' }
    ],
    signs: [
      'Harsh ejection systolic murmur at the left lower sternal border, louder with Valsalva',
      'Jerky (bifid) pulse',
      'Double apical impulse',
      'Fourth heart sound (S4)',
      'Dynamic murmur that falls with handgrip'
    ],
    etiology: [
      'Genetic mutations (Autosomal Dominant)',
      'MYH7 mutation',
      'MYBPC3 mutation'
    ],
    symptoms: [
      'Exertional dyspnea / Angina',
      'Syncope (often post-exertional)',
      'Sudden Cardiac Death risk (first manifestation in some)'
    ],
    diagnosticCriteria: [
      'LV wall thickness ≥ 15mm (or 13mm with family history).',
      'Absence of other causes (HTN/AS) for hypertrophy.',
      'Dynamic LVOT gradient on Echo.'
    ],
    diagnosticAlgorithm: [
      'Measure Max LV Wall Thickness',
      'Assess LVOT Gradient (Rest/Valsalva)',
      'Calculate HCM-Risk-SCD score',
      'Family Screening (First-degree)'
    ],
    ekgFindings: [
      'Giant, deep T-wave inversions (precordial leads).',
      'Left Ventricular Hypertrophy (high QRS voltage).',
      'Pathological Q-waves (pseudo-infarct pattern, especially inferolateral).',
      'Left Axis Deviation.'
    ],
    imaging: {
      echo: [
        'Maximal LV wall thickness ≥ 15 mm (or 13 mm with family history).',
        'Dynamic LVOT gradient (Valsalva enhances gradient).',
        'Systolic Anterior Motion (SAM) of the mitral valve.',
        'Ground-glass appearance of the myocardium.'
      ],
      ct_mri: [
        'Cardiac MRI (LGE): Late Gadolinium Enhancement at the RV insertion points.',
        'Assessment of apical morphology (Apical HCM variants).',
        'Precise infarct sizing and fibrosis mapping.'
      ],
      cxr: [
        'Often normal heart size early on.',
        'Left atrial enlargement if significant mitral regurgitation present.'
      ]
    },
    labDeviations: [
      { label: 'NT-proBNP', value: '↑ in symptomatic HCM', isCritical: false },
      { label: 'Troponin', value: 'Chronic low-level leaks', isCritical: false },
      { label: 'Genetic', value: 'MYH7/MYBPC3 mutations', isCritical: false }
    ],
    treatmentAlgorithm: [
      { id: 'hcm-1', label: 'SCD Assessment', action: 'Calculate HCM-Risk-SCD score (ESC).', category: 'initial' },
      { id: 'hcm-2', label: 'Drug Therapy', action: 'First-line: Beta-blockers or Verapamil (avoid DHP-CCBs/Nitrates in SAM).', category: 'intervention' },
      { id: 'hcm-3', label: 'Myosin Inhibitor', action: 'Consider Mavacamten if still symptomatic despite BB/CCB.', category: 'intervention' },
      { id: 'hcm-4', label: 'Septal Reduction', action: 'Surgical Myectomy or Alcohol Septal Ablation for refractory obstruction.', category: 'escalation' },
      { id: 'hcm-5', label: 'Protection', action: 'ICD Implantation if SCD risk is high.', category: 'long-term' }
    ],
    management: {
      primary: [
        'Beta-blockers (Metoprolol) or CCB (Verapamil) to improve filling.',
        'Mavacamten (Cardiac Myosin Inhibitor) for obstructive HCM.',
        'Avoid Dehydration and high-intensity sports.'
      ],
      secondary: [
        'Septal Myectomy or Alcohol Septal Ablation for refractory obstruction.',
        'ICD for SCD prevention based on risk scores.'
      ]
    },
    pearls: [
      'Murmur increases with Valsalva and Standing (decreased preload).',
      'Autosomal dominant inheritance; screen first-degree relatives.'
    ],
    redFlags: [
      'Family history of premature SCD.',
      'Unexplained syncope.',
      'Non-sustained VT on holter.'
    ],
    differentialDiagnosis: [
      'Hypertensive Heart Disease',
      'Athlete\'s Heart',
      'Cardiac Amyloidosis'
    ],
    source: 'ACC/AHA HCM Guidelines 2024',
    lastUpdated: '2024'
  },
  {
    id: 'aortic-dissection',
    name: 'Acute Aortic Dissection',
    category: 'Vascular',
    priority: 'Critical',
    summary: 'Life-threatening tear in the inner layer of the aorta, creating a false lumen.',
    pathophysiology: 'High blood pressure or structural weakness causes a tear in the aortic intima, allowing blood to enter the media and create a false channel, potentially leading to rupture or organ malperfusion.',
    pathogenesis: [
      { stage: 'Intimal tear', text: 'A tear (commonly at the aortic root or isthmus) occurs under high shear stress.' },
      { stage: 'False lumen', text: 'Blood enters the media and dissects along the aortic wall, creating a false lumen.' },
      { stage: 'Propagation', text: 'The dissection extends antegrade (and sometimes retrograde) along the aorta.' },
      { stage: 'Malperfusion', text: 'Branch-vessel compromise causes coronary, cerebral, renal, mesenteric or limb ischaemia.' },
      { stage: 'Rupture', text: 'Rupture into the pericardium (tamponade), pleura or mediastinum, or acute aortic regurgitation.' }
    ],
    signs: [
      'Inter-arm or inter-leg blood pressure differential',
      'New early diastolic murmur of aortic regurgitation',
      'Pulse deficit',
      'Focal neurological deficit',
      'Hypotension or tamponade in type A dissection'
    ],
    etiology: [
      'Chronic Hypertension (most common)',
      'Connective tissue disorders (Marfan, Ehlers-Danlos)',
      'Bicuspid Aortic Valve',
      'Aortic Coarctation',
      'Trauma'
    ],
    symptoms: [
      'Sudden, "tearing" or "ripping" chest/back pain',
      'Radiation between the shoulder blades',
      'Pulse deficit (unequal BP in arms)'
    ],
    diagnosticCriteria: [
      'Sudden onset, severe, "tearing" or "ripping" chest/back pain.',
      'Blood pressure differential between arms (>20 mmHg).',
      'New diastolic murmur (Aortic Regurgitation).',
      'Confirmed by CTA or TEE.'
    ],
    diagnosticAlgorithm: [
      'BP/Pulse differential Check',
      'Emergent CTA (Gold Std)',
      'Classify Type A vs. B',
      'Immediate HR/BP Control'
    ],
    labDeviations: [
      { label: 'D-dimer', value: '↑ (helps r/o if negative)', isCritical: false },
      { label: 'Troponin', value: 'May ↑ if RCA involved', isCritical: false },
      { label: 'Cr', value: 'Assess branch involvement', isCritical: false }
    ],
    treatmentAlgorithm: [
      { id: 'dis-1', label: 'Impulse Control', action: 'Beta-blocker (Esmolol or Labetalol) to target HR <60 and SBP <120.', category: 'initial', notes: 'Control HR before BP to prevent reflex tachycardia.' },
      { id: 'dis-2', label: 'Vasodilatation', action: 'Add Nitroprusside ONLY after HR <60 is achieved.', category: 'intervention' },
      { id: 'dis-3', label: 'Localization', action: 'Stanford Type A (Ascending): Immediate Surgery. Type B: Medical mgmt.', category: 'intervention' },
      { id: 'dis-4', label: 'Escalation', action: 'Complicated Type B: Proceed to TEVAR.', category: 'escalation' }
    ],
    imaging: {
      echo: [
        'TEE: Intimal flap in ascending aorta (Type A).',
        'TTE: Often poor view, but may show dilated aortic root or AR.',
        'Assess for pericardial tamponade (complication).'
      ],
      ct_mri: [
        'CT Angiography (Gold Standard): Visible intimal flap separating true and false lumens.',
        'False lumen often larger and contains thrombus.',
        'Involvement of major branches (coronaries, carotids).'
      ],
      cxr: [
        'Widened mediastinum (>8cm).',
        'Displacement of intimal calcification.',
        'Left pleural effusion (Hemothorax).'
      ]
    },
    severeCriteria: {
        label: 'Stanford Classification',
        metrics: [
          { name: "Type A", value: "Ascending", unit: "Aorta" },
          { name: "Type B", value: "Descending", unit: "Aorta" }
        ]
    },
    ekgFindings: [
      'Often normal or shows non-specific ST/T changes.',
      'May show STEMI (Inferior) if RCA is involved in the dissection.'
    ],
    management: {
      primary: [
        'Immediate HR/BP control: Esmolol or Labetalol (Goal SBP < 120, HR < 60).',
        'Pain Control (Fentanyl/Morphine).',
        'Surgical Consultation (Emergent for Stanford Type A).'
      ],
      secondary: [
        'Type B: Medical management usually preferred unless complications.',
        'Long-term BP control and serial imaging.'
      ]
    },
    pearls: [
      'Stanford Type A: Involves Ascending Aorta (Surgical).',
      'Stanford Type B: Limited to Descending Aorta (Medical).'
    ],
    redFlags: [
      'Cardiac Tamponade (Retrograde dissection).',
      'Stroke / Malperfusion syndromes.',
      'Hypotension / Shock.'
    ],
    differentialDiagnosis: [
      'Myocardial Infarction',
      'Pulmonary Embolism',
      'Pneumothorax'
    ],
    source: 'AHA Aortic Disease Guidelines',
    lastUpdated: '2024'
  },
  {
    id: 'pulmonary-embolism',
    name: 'Acute Pulmonary Embolism (PE)',
    category: 'Vascular',
    summary: 'Obstruction of a pulmonary artery by a blood clot, typically from a DVT.',
    pathophysiology: 'Thrombi (usually from lower extremity DVTs) travel to and lodge in the pulmonary circulation, increasing pulmonary vascular resistance and RV afterload, impairing gas exchange.',
    pathogenesis: [
      { stage: 'Embolisation', text: 'A deep vein thrombus dislodges and embolises to the pulmonary arteries.' },
      { stage: 'Obstruction', text: 'Mechanical obstruction plus release of vasoconstrictor mediators raises pulmonary vascular resistance.' },
      { stage: 'RV afterload', text: 'Acute right ventricular afterload causes RV dilatation and dysfunction.' },
      { stage: 'Interdependence', text: 'RV dilatation impairs left ventricular filling (ventricular interdependence), reducing cardiac output.' },
      { stage: 'Gas exchange', text: 'Ventilation-perfusion mismatch and shunt cause hypoxaemia; massive PE may infarct the RV.' }
    ],
    signs: [
      'Tachycardia and tachypnoea',
      'Raised JVP and a right ventricular heave',
      'Hypoxaemia with clear lungs',
      'Hypotension or syncope in massive PE',
      'Unilateral leg swelling (source DVT)'
    ],
    etiology: [
      'Deep Vein Thrombosis (DVT)',
      'Prolonged Immobility',
      'Recent Surgery',
      'Malignancy',
      'Hypercoagulable states'
    ],
    symptoms: [
      'Sudden onset dyspnea',
      'Pleuritic chest pain',
      'Hemoptysis',
      'Tachycardia'
    ],
    diagnosticCriteria: [
      'Sudden onset dyspnea, pleuritic chest pain, and hemoptysis.',
      'Positive D-dimer (in low-probability patients).',
      'Confirmed by CT Pulmonary Angiography (CTPA) or V/Q scan.'
    ],
    diagnosticAlgorithm: [
      'Calculate Wells/Geneva Score',
      'D-dimer if low probability',
      'CTPA if high probability',
      'Assess RV Strain (Echo/CTA)'
    ],
    labDeviations: [
      { label: 'D-dimer', value: 'Positive (Elevated)', isCritical: false },
      { label: 'Troponin', value: '↑ (RV Strain marker)', isCritical: false },
      { label: 'BNP', value: '↑ (RV Strain marker)', isCritical: false }
    ],
    imaging: {
      echo: [
        'McConnell\'s Sign (RV free wall akinesis with apical sparing).',
        'RV dilation (RV/LV ratio > 1.0).',
        'Septal flattening (D-shaped LV) due to RV pressure overload.',
        'Pulmonary Artery Systolic Pressure (PASP) elevation (>35 mmHg).'
      ],
      ct_mri: [
        'CTPA: Visible filling defects in pulmonary arteries (saddle or segmental).',
        'RV/LV diameter ratio > 0.9 on CT suggests RV strain.'
      ],
      cxr: [
        'Westermark sign (focal oligemia).',
        'Hampton hump (peripheral wedge-shaped opacity).'
      ]
    },
    ekgFindings: [
      'Sinus Tachycardia (most common).',
      'S1Q3T3 pattern (Specific but rare).',
      'Right axis deviation / New RBBB.'
    ],
    management: {
      primary: [
        'Anticoagulation: Heparin or LMWH.',
        'Thrombolysis (Alteplase) for massive/high-risk PE (Hypotension).',
        'Oxygen therapy.'
      ],
      secondary: [
        'DOACs for 3-6 months (unprovoked: lifelong).',
        'IVC filter if anticoagulation contraindicated.'
      ]
    },
    pearls: [
      'Use PERC criteria to rule out low-probability patients.',
      'Massive PE is defined by sustained hypotension (SBP < 90).'
    ],
    redFlags: [
      'Hypotension / Obstructive shock.',
      'Right Ventricular Strain on Echo.',
      'Syncope.'
    ],
    differentialDiagnosis: [
      'Pneumothorax',
      'MI',
      'Pneumonia',
      'Pericarditis'
    ],
    discriminators: {
      'Pneumothorax': 'Sudden pleuritic pain with absent breath sounds and a hyperlucent hemithorax; tracheal shift.',
      'MI': 'Crushing central pain with ischemic ST changes and a troponin rise; RV strain on echo is non-specific.',
      'Pneumonia': 'Fever and productive cough with consolidation on CXR; D-dimer/CTPA negative for PE.',
      'Pericarditis': 'Positional pain, friction rub, diffuse ST elevation / PR depression; no RV strain.'
    },
    source: 'ESC PE Guidelines 2024',
    lastUpdated: '2024'
  },
  {
    id: 'cardiac-tamponade',
    name: 'Cardiac Tamponade',
    category: 'Emergency',
    summary: 'Compression of the heart due to fluid accumulation in the pericardial sac.',
    pathophysiology: 'Accumulation of pericardial fluid under pressure impairs diastolic filling of the heart chambers, leading to reduced stroke volume and cardiac output.',
    pathogenesis: [
      { stage: 'Trigger', text: 'Rapid pericardial fluid accumulation.' },
      { stage: 'Mechanism', text: 'Rising intrapericardial pressure compresses the right-sided chambers.' },
      { stage: 'Filling', text: 'Impaired diastolic filling reduces stroke volume.' },
      { stage: 'Interdependence', text: 'Ventricular interdependence produces pulsus paradoxus.' },
      { stage: 'Consequence', text: 'Hypotension, tachycardia and progression to shock or PEA arrest.' }
    ],
    signs: [
      'Hypotension with tachycardia',
      'Raised JVP with clear lungs',
      'Pulsus paradoxus',
      'Muffled heart sounds',
      'Beck triad in acute tamponade'
    ],
    etiology: [
      'Malignancy',
      'Uremia',
      'Post-procedural / Trauma',
      'Aortic Dissection (Retrograde)',
      'Acute Pericarditis'
    ],
    symptoms: [
      'Beck\'s Triad: Hypotension, JVD, Muffled heart sounds',
      'Dyspnea / Tachypnea',
      'Pulsus paradoxus (>10mmHg drop in SBP on inspiration)'
    ],
    diagnosticCriteria: [
      'Beck\'s Triad (Hypotension, JVD, Muffled Heart Sounds).',
      'Pulsus Paradoxus (>10mmHg drop in SBP on inspiration).',
      'Electrical alternans on EKG.',
      'Confirmed by Echocardiography.'
    ],
    diagnosticAlgorithm: [
      'Assess for Beck\'s Triad',
      'Confirm with Bedside Echo (RV Collapse)',
      'Check Pulsus Paradoxus',
      'Emergent Pericardiocentesis'
    ],
    labDeviations: [
      { label: 'Lactate', value: '↑ due to low output', isCritical: true },
      { label: 'Urea/Cr', value: 'Check for Uremic cause', isCritical: false }
    ],
    treatmentAlgorithm: [
      { id: 'tam-1', label: 'Volume Support', action: 'Small fluid boluses to maintain cardiac output (Bridge only).', category: 'initial' },
      { id: 'tam-2', label: 'Intervention', action: 'Emergent Pericardiocentesis under ultrasound guidance.', category: 'intervention' },
      { id: 'tam-3', label: 'Mechanical Complication', action: 'Avoid Positive Pressure Ventilation (reduces preload further).', category: 'initial' },
      { id: 'tam-4', label: 'Definitive Care', action: 'Surgical Pericardial Window for refractory/malignant effusions.', category: 'escalation' }
    ],
    imaging: {
      echo: [
        'Large pericardial effusion.',
        'RA collapse (late diastole) and RV collapse (early diastole).',
        'Dilated IVC with <50% inspiratory collapse (Plethoric IVC).',
        'Respiratory variation in mitral/tricuspid inflow (>25%/40%).'
      ],
      cxr: [
        'Enlarged "Water-bottle" heart silhouette.',
        'Clear lung fields (distinct from CHF).'
      ]
    },
    ekgFindings: [
      'Low voltage QRS complexes.',
      'Electrical alternans (alternating QRS amplitude).',
      'Sinus tachycardia.'
    ],
    management: {
      primary: [
        'Emergent Pericardiocentesis.',
        'Volume expansion (Fluids) - temporary measure to maintain preload.',
        'Avoid positive pressure ventilation if possible.'
      ],
      secondary: [
        'Drain placement for continuous drainage.',
        'Pericardial window for recurrent effusions.'
      ]
    },
    pearls: [
      'It is a clinical diagnosis, not just an echo finding.',
      'Often occurs with low volume in traumatic / acute cases.'
    ],
    redFlags: [
      'PEA (Pulseless Electrical Activity).',
      'Shock.',
      'Muffled heart sounds.'
    ],
    differentialDiagnosis: [
      'Tension Pneumothorax',
      'Constrictive Pericarditis',
      'Massive PE'
    ],
    source: 'ESC Pericardial Disease',
    lastUpdated: '2024'
  },
  {
    id: 'cardiogenic-shock',
    name: 'Cardiogenic Shock',
    category: 'Emergency',
    summary: 'State of severe systemic hypoperfusion due to primary heart failure.',
    pathophysiology: 'Severe impairment of myocardial pump function leads to a spiral of reduced cardiac output, hypotension, coronary hypoperfusion, and systemic organ failure.',
    pathogenesis: [
      { stage: 'Pump failure', text: 'Acute severe pump failure (commonly a large myocardial infarction).' },
      { stage: 'Low output', text: 'Cardiac output and stroke volume fall, causing hypotension.' },
      { stage: 'Compensation', text: 'Vasoconstriction and tachycardia attempt to preserve perfusion pressure.' },
      { stage: 'Coronary hypoperfusion', text: 'Low diastolic pressure worsens myocardial ischaemia, further reducing output.' },
      { stage: 'Organ failure', text: 'Systemic hypoperfusion causes lactic acidosis and multi-organ failure (death spiral).' }
    ],
    signs: [
      'Systolic blood pressure <90 mmHg with hypoperfusion',
      'Cool, clammy, mottled skin',
      'Oliguria',
      'Altered mental status',
      'SCAI stage C to E features'
    ],
    etiology: [
      'Acute Myocardial Infarction (AMI)',
      'Acute Mitral Regurgitation (Papillary rupture)',
      'Ventricular Septal Rupture',
      'Post-cardiotomy syndrome',
      'End-stage heart failure'
    ],
    symptoms: [
      'Hypotension (SBP < 90)',
      'Signs of hypoperfusion (Cold limbs, oliguria, confusion)',
      'Respiratory distress / Congestion'
    ],
    diagnosticCriteria: [
      'Cardiac Index < 2.2 L/min/m².',
      'PCWP > 15 mmHg.',
      'Lactate > 2.0 mmol/L.'
    ],
    ekgFindings: [
      'Reflects underlying cause (STEMI/NSTEMI, Acute MR).',
      'Global ST-depression (Supply/Demand mismatch).',
      'Wide QRS or Arrhythmias (VT/VF, 3rd Degree Block).'
    ],
    imaging: {
      echo: [
        'Severe global or regional LV hypokinesis (LVEF < 25%).',
        'Large, fixed RWMA (suggests old MI or large acute MI).',
        'Small, hyperdynamic LV (suggests non-cardiac or obstructive shock).',
        'Assessment of RV function (RV Shock).'
      ],
      ct_mri: [
        'CT: Evaluate for mechanical triggers (Aortic Dissection/PE).',
        'Chest CT: Diffuse pulmonary edema.'
      ]
    },
    diagnosticAlgorithm: [
      'Assess Perfusions (Cold/Wet)',
      'Confirm low Cardiac Index',
      'Measure PCWP/CVP',
      'Identify Trigger (ACS/Arrhythmia)'
    ],
    labDeviations: [
      { label: 'Lactate', value: 'Positive (>2.0 mmol/L)', isCritical: true },
      { label: 'Mixed Venous O2', value: '↓ (<60%)', isCritical: false },
      { label: 'ALT/AST', value: '↑ (Shock Liver)', isCritical: false }
    ],
    treatmentAlgorithm: [
      { id: 'shk-1', label: 'Pressor Support', action: 'Norepinephrine as first-line for MAP targeted at 65.', category: 'initial' },
      { id: 'shk-2', label: 'Inotropic Support', action: 'Dobutamine or Milrinone (if on BB) to improve cardiac output.', category: 'intervention' },
      { id: 'shk-3', label: 'Early MCS', action: 'Consider balloon pump (IABP) or Impella for escalating support.', category: 'intervention' },
      { id: 'shk-4', label: 'Refractory Shock', action: 'VA-ECMO evaluation in centers of excellence.', category: 'escalation' }
    ],
    management: {
      primary: [
        'Treat underlying cause (Reperfusion for MI).',
        'Vasopressors (Norepinephrine) for MAP support.',
        'Inotropes (Dobutamine / Milrinone).'
      ],
      secondary: [
        'Mechanical Circulatory Support (IABP, Impella, ECMO).',
        'LVAD or Heart Transplant evaluation.'
      ]
    },
    pearls: [
      'Primary cause is acute MI (5-10% of cases).',
      'Avoid aggressive fluid loading in the presence of congestion.'
    ],
    redFlags: [
      'Multiorgan failure.',
      'Refractory metabolic acidosis.',
      'Anuria.'
    ],
    differentialDiagnosis: [
      'Hypovolemic Shock',
      'Septic Shock',
      'Obstructive Shock (PE/Tamponade)'
    ],
    source: 'AHA/ACC Shock Guidelines',
    lastUpdated: '2024'
  },
  {
    id: 'scai-shock',
    name: 'Cardiogenic Shock (SCAI Stages)',
    category: 'Emergency',
    summary: 'Classification system for the severity of cardiogenic shock based on symptoms and perfusion status.',
    pathophysiology: 'Different stages (A-E) represent a continuum from "at risk" to "extremis," providing a standardized language for clinicians to assess the depth and trajectory of shock.',
    pathogenesis: [
      { stage: 'Stage A', text: 'At risk — a haemodynamic insult without hypoperfusion.' },
      { stage: 'Stage B', text: 'Beginning — hypotension or tachycardia with normal perfusion.' },
      { stage: 'Stage C', text: 'Classic — hypoperfusion requiring inotropes or vasopressors.' },
      { stage: 'Stage D', text: 'Deteriorating — escalating support with worsening perfusion.' },
      { stage: 'Stage E', text: 'Extremis — refractory shock with circulatory collapse.' }
    ],
    signs: [
      'Hypotension and tachycardia',
      'Cool extremities and mottling',
      'Oliguria',
      'Rising lactate',
      'Escalating vasopressor requirement'
    ],
    etiology: [
      'Acute Coronary Syndromes',
      'Decompensated Heart Failure',
      'Valvular Emergencies',
      'Myocarditis'
    ],
    symptoms: [
      'Hypotension (SBP < 90 mmHg)',
      'Signs of poor organ perfusion (Cool limbs, Confusion)',
      'Oliguria (Low urine output)',
      'Lactic Acidosis'
    ],
    diagnosticCriteria: [
      'Stage A (At Risk): Not in shock, but high risk (e.g. large MI).',
      'Stage B (Beginning): Hypotension/Tachycardia, Normal Perfusion.',
      'Stage C (Classic): Hypoperfusion requiring Intervention.',
      'Stage D (Deteriorating): Failure to stabilize with initial support.',
      'Stage E (Extremis): Circulatory collapse / Refractory.'
    ],
    diagnosticAlgorithm: [
      'Assess Perfusions & BP',
      'Assign SCAI Stage (A-E)',
      'Assign Trigger Category',
      'Initiate stage-specific MCS'
    ],
    labDeviations: [
      { label: 'Lactate', value: '≥ 2.0 (Stage C+)', isCritical: true },
      { label: 'pH', value: 'Acidosis in Stage D/E', isCritical: false }
    ],
    ekgFindings: [
      'Often reflects underlying cause (STEMI, Arrhythmia).',
      'Non-specific ST/T changes.',
      'Signs of right heart strain if PE-induced.'
    ],
    imaging: {
      echo: [
        'Severe LV/RV dysfunction (LVEF < 25-30%).',
        'Increased filling pressures (Elevated E/e\').',
        'Dynamic assessment of stroke volume (VTI).',
        'Exclude mechanical complications (VSD, Papillary Muscle Rupture).'
      ],
      ct_mri: [
        'CT: Identify underling causes (Aortic Dissection, PE).',
        'Chest CT: Pulmonary edema and congestion.'
      ]
    },
    severeCriteria: {
      label: 'SCAI Shock Stage (2022 Update)',
      metrics: [
        { name: "Stage C", value: "Classic", unit: "Perfusion" },
        { name: "Stage D", value: "Deteriorate", unit: "Support" },
        { name: "Lactate", value: "> 2.0", unit: "mmol/L" },
        { name: "MAP", value: "< 60", unit: "mmHg" }
      ]
    },
    treatmentAlgorithm: [
      { id: 'scai-1', label: 'Staging', action: 'Classify using SCAI Criteria (A-E) based on labs and physical exam.', category: 'initial' },
      { id: 'scai-2', label: 'Invasive Monitoring', action: 'Early Pulmonary Artery Catheter (PAC) placement for Stage C+.', category: 'intervention' },
      { id: 'scai-3', label: 'Support Escalation', action: 'Proceed to MCS (Impella/ECMO) if Stage D/E reached.', category: 'escalation' },
      { id: 'scai-4', label: 'Reperfusion', action: 'Immediate Revascularization if shock is AMI-related.', category: 'intervention' }
    ],
    management: {
      primary: [
        'Volume resuscitation (unless congested).',
        'Vasopressors: Norepinephrine (First line).',
        'Inotropes: Dobutamine / Milrinone.'
      ],
      secondary: [
        'Early Mechanical Circulatory Support (Impella, IABP, ECMO).',
        'Revascularization (SCAI/ACC/AHA Class I for AMI).'
      ]
    },
    pearls: [
      'SCAI Stage C is the inflection point for aggressive intervention.',
      'Always check for correctable mechanical causes (Echo).'
    ],
    redFlags: [
      'Refractory Hypoperfusion',
      'Escalating Vasopressors',
      'Lactate > 5.0'
    ],
    differentialDiagnosis: [
      'Septic Shock',
      'Hypovolemic Shock',
      'Obstructive Shock'
    ],
    source: 'SCAI 2022 Guidelines',
    lastUpdated: '2024'
  },
  {
    id: 'infective-endocarditis',
    name: 'Infective Endocarditis',
    category: 'Emergency',
    summary: 'Microbial infection of the endocardial surface (native or prosthetic valves), causing valvular destruction, embolisation and systemic sepsis.',
    pathophysiology: 'Bacteraemia seeds a damaged or prosthetic valve surface; platelet-fibrin vegetations form, destroying leaflets and embolising systemically.',
    pathogenesis: [
      { stage: 'Susceptible surface', text: 'Endothelial injury or prosthetic material provides a site for adhesion.' },
      { stage: 'Bacteraemia', text: 'Transient bacteraemia (dental, gastrointestinal, skin or line-related).' },
      { stage: 'Vegetation', text: 'Organisms adhere and a platelet-fibrin vegetation forms.' },
      { stage: 'Destruction', text: 'Local valve destruction causes regurgitation, abscess or fistula.' },
      { stage: 'Embolism', text: 'Septic emboli (brain, spleen, kidney) and immune-complex phenomena (glomerulonephritis, Osler nodes).' }
    ],
    signs: [
      'Fever with a new or changing murmur',
      'Peripheral stigmata: Osler nodes, Janeway lesions, splinter haemorrhages',
      'Murmur of acute aortic or mitral regurgitation',
      'Splenomegaly',
      'Signs of heart failure or embolic events'
    ],
    symptoms: [
      'Fever of unknown origin',
      'New or changing Heart Murmur',
      'Embolic phenomena (Stroke, Splenic infarct)',
      'Janeway lesions / Osler nodes'
    ],
    diagnosticCriteria: [
      'Modified Duke Criteria: 2 Major, 1 Major + 3 Minor, or 5 Minor.',
      'Major: Positive Blood Cultures (typical organisms).',
      'Major: Echo evidence of vegetation, abscess, or new dehiscence.',
      'Minor: Predisposition, Fever, Vascular/Immunologic phenomena.'
    ],
    diagnosticAlgorithm: [
      'Draw 3 Sets of Blood Cx',
      'Perform TTE (then TEE if neg)',
      'Check for Duke Minor Criteria',
      'Assess for Embolic Events'
    ],
    labDeviations: [
      { label: 'Blood Culture', value: 'Positive (Major)', isCritical: true },
      { label: 'ESR/CRP', value: '↑ (Infectious marker)', isCritical: false },
      { label: 'Urinalysis', value: 'Hematuria (Glomerulonephritis)', isCritical: false }
    ],
    treatmentAlgorithm: [
      { id: 'ie-1', label: 'Culture First', action: 'Draw 3 sets of Blood Cultures before starting Antibiotics.', category: 'initial' },
      { id: 'ie-2', label: 'Imaging', action: 'TTE initially; proceed to TEE if TTE negative but suspicion high.', category: 'initial' },
      { id: 'ie-3', label: 'Surgical Consult', action: 'Early consult if: HF, Abscess, Large vegetation (>10mm), or Fungal.', category: 'intervention' },
      { id: 'ie-4', label: 'Prolonged Therapy', action: '4-6 weeks of IV Antibiotics; monitor inflammatory markers.', category: 'long-term' }
    ],
    ekgFindings: [
      'New PR interval prolongation (suggests perivalvular abscess).',
      'Ischemic changes if coronary embolization occurs.',
      'Bundle branch blocks.'
    ],
    imaging: {
      echo: [
        'TEE (90% sensitivity): Presence of oscillating mass (Vegetation).',
        'Perivalvular abscess or pseudoaneurysm.',
        'New valvular regurgitation (flail leaflet).',
        'Dehiscence of prosthetic valve.'
      ],
      ct_mri: [
        'Cardiac CT: Mapping perivalvular complications for surgical planning.',
        'Brain MRI: Detect subclinical embolic events.',
        'PET/CT (ESC 1A for PVE): Increased uptake around prosthetic valve.'
      ]
    },
    management: {
      primary: [
        'Prolonged IV Antibiotics (Culture-directed).',
        'Consult Infectious Disease and Cardiac Surgery early.'
      ],
      secondary: [
        'Early Surgery: Heart Failure, Uncontrolled Infection, or High Embolic Risk (>10mm vegetation).'
      ]
    },
    clinicalTools: {
      scores: [
        {
          id: 'duke-criteria',
          name: 'Modified Duke Criteria',
          description: 'Standard for diagnosis of Infective Endocarditis',
          criteria: [
            { label: 'Blood Cx+ for typical organism (Major)', points: 2 },
            { label: 'Echo evidence of IE (Major)', points: 2 },
            { label: 'Predisposition / IVDU (Minor)', points: 1 },
            { label: 'Fever ≥ 38.0°C (Minor)', points: 1 },
            { label: 'Vascular phenomena (Minor)', points: 1 },
            { label: 'Immunologic phenomena (Minor)', points: 1 },
            { label: 'Microbiologic evidence (Minor)', points: 1 }
          ],
          interpretation: [
            { range: '2 Major / 1 Major + 3 Minor', risk: 'Definite IE', recommendation: 'Start prolonged IV Abx' },
            { range: '1 Major + 1 Minor / 3 Minor', risk: 'Possible IE', recommendation: 'Continue workup' }
          ]
        }
      ],
      protocols: [
        {
          title: 'Indications for Early Surgery',
          steps: [
            { label: 'Heart Failure', action: 'Severe acute MR, AR, or TR with heart failure signs.' },
            { label: 'Uncontrolled Infection', action: 'Abscess, pseudoaneurysm, fistula, or enlarging vegetation.' },
            { label: 'Prevention of Embolism', action: 'Vegetation > 10mm after embolic event OR > 15mm isolation.' }
          ]
        }
      ]
    },
    pearls: [
      'TEE is mandatory if TTE is negative but clinical suspicion remains high.',
      'New heart block in a patient with aortic endocarditis is pathognomonic for abscess.'
    ],
    redFlags: [
      'New AV Block',
      'Acute Heart Failure',
      'Sepsis / Shock'
    ],
    differentialDiagnosis: [
      'Culture-Negative Endocarditis',
      'Non-bacterial Thrombotic Endocarditis (NBTE)',
      'Rheumatic Heart Disease'
    ],
    source: 'ESC 2023 Guidelines',
    lastUpdated: '2023'
  },
  {
    id: 'mitral-stenosis',
    name: 'Mitral Stenosis (Rheumatic/Calcific)',
    category: 'Structural',
    summary: 'Obstruction to left ventricular inflow from a narrowed mitral valve, usually rheumatic, causing left atrial hypertension and pulmonary congestion.',
    pathophysiology: 'Rheumatic commissural fusion and leaflet thickening restrict diastolic opening, raising left atrial pressure and producing a transmitral gradient that worsens with tachycardia.',
    pathogenesis: [
      { stage: 'Trigger', text: 'Rheumatic or calcific leaflet thickening.' },
      { stage: 'Mechanism', text: 'Commissural fusion and leaflet immobility obstruct diastolic inflow.' },
      { stage: 'Pressure', text: 'Rising left atrial pressure and a transmitral gradient.' },
      { stage: 'Consequence', text: 'Pulmonary congestion and reactive pulmonary hypertension.' },
      { stage: 'Complications', text: 'Left atrial stasis and atrial fibrillation; reduced cardiac output because stroke volume is fixed.' }
    ],
    signs: [
      'Mid-diastolic rumble with an opening snap',
      'Loud first heart sound',
      'Signs of pulmonary hypertension (loud P2, RV heave)',
      'Malar flush',
      'Irregular pulse if atrial fibrillation'
    ],
    etiology: [
      'Rheumatic heart disease (most common worldwide)',
      'Degenerative mitral annular calcification (elderly)',
      'Congenital (rare)'
    ],
    symptoms: [
      'Exertional Dyspnea (progressive)',
      'Hemoptysis',
      'Atrial Fibrillation (frequent)',
      'Hoarseness (Ortner\'s Syndrome)'
    ],
    diagnosticCriteria: [
      'Diastolic opening snap followed by a decrescendo murmur.',
      'Confirmed by Echocardiography (Mean gradient, MVA).',
      'Often history of Rheumatic Fever (WHF criteria).'
    ],
    diagnosticAlgorithm: [
      'Auscultate Opening Snap',
      'Echo (Planimetry of MVA)',
      'Calculate Mean Gradient',
      'Rule out LA Thrombus (TEE)'
    ],
    labDeviations: [
      { label: 'ASO Titer', value: '↑ (if Acute Rheumatic)', isCritical: false },
      { label: 'BNP', value: '↑ (Pulmonary HTN marker)', isCritical: false }
    ],
    ekgFindings: [
      'Left Atrial Enlargement (P-mitrale: notched P-wave >120ms in lead II).',
      'Right Axis Deviation (if pulmonary hypertension developed).',
      'Right Ventricular Hypertrophy (RVH).',
      'Atrial Fibrillation (highly prevalent).'
    ],
    imaging: {
      echo: [
        'Thickened mitral leaflets with "hockey-stick" appearance (Rheumatic).',
        'Mitral Valve Area (MVA) ≤ 1.5 cm² (Severe).',
        'Mean pressure gradient > 10 mmHg (Severe).',
        'LA dilation and spontaneous echo contrast.',
        'Pulmonary Artery Systolic Pressure measurement (>50 mmHg suggests severe).'
      ],
      cxr: [
        'Straightening of the left heart border (due to LAE).',
        'Double density sign (LA within the RA silhouette).',
        'Elevation of the left main bronchus.'
      ]
    },
    severeCriteria: {
      label: 'Severe MS Criteria (ACC/ESC)',
      metrics: [
        { name: "Valve Area", value: "≤ 1.5", unit: "cm²" },
        { name: "Mean Gradient", value: "> 10", unit: "mmHg" },
        { name: "PASP", value: "> 50", unit: "mmHg" }
      ]
    },
    treatmentAlgorithm: [
      { id: 'ms-1', label: 'Rate Control', action: 'Aggressive HR control (Metoprolol) to maximize diastolic filling time.', category: 'initial' },
      { id: 'ms-2', label: 'Anticoagulation', action: 'Warfarin mandatory if AFib or LA Thrombus (DOACs Not recommended for Rheumatic MS).', category: 'long-term', notes: 'Target INR 2.0-3.0.' },
      { id: 'ms-3', label: 'PMBC', action: 'Consider balloon commissurotomy if favorable anatomy (Wilkins score <8).', category: 'intervention' },
      { id: 'ms-4', label: 'Valve Replacement', action: 'MVR for calcific MS or failed PMBC.', category: 'intervention' }
    ],
    management: {
      primary: [
        'Diuretics for congestion.',
        'Beta-blockers for heart rate control (especially in AFib).',
        'Anticoagulation (Warfarin) for AFib or prior embolus.'
      ],
      secondary: [
        'Percutaneous Mitral Balloon Commissurotomy (PMBC) if favorable anatomy.',
        'Mitral Valve Replacement if calcific or failed PMBC.'
      ]
    },
    clinicalTools: {
      imaging: [
        {
          title: 'Mitral Stenosis Severity Matrix',
          headers: ['Mild', 'Moderate', 'Severe'],
          rows: [
            { metric: 'Mean Gradient (mmHg)', values: ['< 5', '5 - 10', '> 10'] },
            { metric: 'Mitral Valve Area (cm²)', values: ['> 1.5', '1.0 - 1.5', '≤ 1.0'] },
            { metric: 'PASP (mmHg)', values: ['< 30', '30 - 50', '> 50'] }
          ]
        }
      ],
      scores: [
        {
          id: 'wilkins-score',
          name: 'Wilkins Score (Echo suitability)',
          description: 'Suitability for Balloon Commissurotomy (PMBC)',
          criteria: [
            { label: 'Leaflet Mobility (1-4)', points: 4 },
            { label: 'Leaflet Thickening (1-4)', points: 4 },
            { label: 'Subvalvular Thickening (1-4)', points: 4 },
            { label: 'Leaflet Calcification (1-4)', points: 4 }
          ],
          interpretation: [
            { range: '≤ 8', risk: 'Favorable', recommendation: 'Recommended for PMBC' },
            { range: '> 8', risk: 'Unfavorable', recommendation: 'Consider Surgical Replacement' }
          ]
        }
      ]
    },
    pearls: [
      'Severity is primarily determined by Mean Gradient and Valve Area.',
      'Wilkins Score is used to assess PMBC suitability.'
    ],
    redFlags: [
      'New onset AFib',
      'Acute Pulmonary Edema',
      'LA Thrombus'
    ],
    differentialDiagnosis: [
      'Atrial Myxoma',
      'Cor Triatriatum',
      'Severe Mitral Regurgitation'
    ],
    source: 'ESC/AHA 2021 VHD Guidelines',
    lastUpdated: '2021'
  },
  {
    id: 'takotsubo-syndrome',
    name: 'Takotsubo (Stress) Syndrome',
    category: 'Ischemic',
    summary: 'Transient stress-induced LV dysfunction with apical ballooning, usually in postmenopausal women, mimicking ACS without obstructive coronary disease.',
    pathophysiology: 'A catecholamine surge from emotional or physical stress causes myocardial stunning and microvascular dysfunction, producing apical ballooning and transient LV dysfunction.',
    pathogenesis: [
      { stage: 'Trigger', text: 'Emotional or physical stress causing a catecholamine surge.' },
      { stage: 'Mechanism', text: 'Catecholamine myocyte toxicity and microvascular spasm.' },
      { stage: 'Wall motion', text: 'Apical and mid-ventricular ballooning with preserved basal function.' },
      { stage: 'Dysfunction', text: 'Transient left ventricular systolic impairment.' },
      { stage: 'Recovery', text: 'Usually recovers within days to weeks; complications possible.' }
    ],
    signs: [
      'Apical ballooning on echo or ventriculography',
      'New ECG changes (ST elevation, T inversion, QT prolongation)',
      'Modest troponin rise',
      'No obstructive coronary disease'
    ],
    symptoms: [
      'Acute "broken heart" chest pain',
      'Dyspnea',
      'Often preceded by emotional/physical stressor'
    ],
    diagnosticCriteria: [
      'InterTAK Criteria.',
      'Transient LV dysfunction (apical/midventricular ballooning).',
      'Absence of culprit coronary artery disease (usually).',
      'New EKG changes (ST-elevation or T-wave inversion).'
    ],
    diagnosticAlgorithm: [
      'Angio (Rule out ACS)',
      'Confirm Apical Ballooning',
      'Check InterTAK Score',
      'Identify Trigger Stressor'
    ],
    labDeviations: [
      { label: 'Troponin', value: 'Moderate ↑ (Incongruent with EF)', isCritical: false },
      { label: 'BNP', value: 'Markedly ↑ (Stress-related)', isCritical: false },
      { label: 'ALT/AST', value: 'Usually Normal', isCritical: false }
    ],
    treatmentAlgorithm: [
      { id: 'tks-1', label: 'Rule out MI', action: 'Emergency Coronary Angiography (Must exclude culprit CAD).', category: 'initial' },
      { id: 'tks-2', label: 'LVOT Management', action: 'Check for LVOT Obstruction before giving inotropes.', category: 'intervention', notes: 'Inotropes are contraindicated if LVOT obstruction present.' },
      { id: 'tks-3', label: 'Heart Failure Support', action: 'Beta-blockers and ACEi until LV function recovers.', category: 'long-term' },
      { id: 'tks-4', label: 'Thrombus Check', action: 'Apical anticoagulation for 3m if apical thrombus present.', category: 'intervention' }
    ],
    ekgFindings: [
      'ST-segment elevation (resembles STEMI).',
      'Deep, widespread T-wave inversions (post-acute phase).',
      'QT prolongation.'
    ],
    imaging: {
      echo: [
        'Apical ballooning with hyperdynamic basal segments.',
        'Transient decrease in LVEF.',
        'Check for LV outflow tract (LVOT) obstruction.'
      ],
      ct_mri: [
        'CMR: Absence of Late Gadolinium Enhancement (LGE) [Differentiates from MI].',
        'Presence of myocardial edema in ballooning areas.'
      ],
      cxr: [
        'May show pulmonary edema.'
      ]
    },
    management: {
      primary: [
        'Supportive care: Heart failure therapy (ACEi/Beta-blockers).',
        'Anticoagulation if apical thrombus is present.'
      ],
      secondary: [
        'Management of complications: Cardiogenic shock or LVOT obstruction.'
      ]
    },
    pearls: [
      'Characterized by transient recovery of LV function (days to weeks).',
      'Predominantly affects post-menopausal women.'
    ],
    redFlags: [
      'Heart Failure / Shock',
      'LV Thrombus',
      'Malignant Arrhythmias'
    ],
    differentialDiagnosis: [
      'ST-Elevation MI (STEMI)',
      'Acute Myocarditis',
      'Pheochromocytoma'
    ],
    source: 'ESC/InterTAK Guidelines',
    lastUpdated: '2024'
  },
  {
    id: 'scad',
    name: 'Spontaneous Coronary Artery Dissection (SCAD)',
    category: 'Ischemic',
    summary: 'Non-atherosclerotic dissection of a coronary artery causing myocardial infarction, most often in younger women.',
    pathophysiology: 'An intimal tear or intramural haematoma compresses the true lumen, causing coronary obstruction and ischaemia; often associated with fibromuscular dysplasia and pregnancy.',
    pathogenesis: [
      { stage: 'Trigger', text: 'Spontaneous intimal tear or intramural haematoma.' },
      { stage: 'Compression', text: 'The false lumen compresses the true lumen.' },
      { stage: 'Ischaemia', text: 'Reduced coronary flow causes myocardial infarction.' },
      { stage: 'Associations', text: 'Fibromuscular dysplasia, pregnancy/peripartum, connective tissue disease.' },
      { stage: 'Consequence', text: 'MI, usually managed conservatively unless ischaemia persists.' }
    ],
    signs: [
      'MI presentation in a young or middle-aged woman',
      'Often few traditional risk factors',
      'Angiographic dissection / intramural haematoma',
      'Risk of recurrence'
    ],
    symptoms: [
      'Acute chest pain / MI presentation',
      'Often seen in young/middle-aged women without traditional risk factors'
    ],
    diagnosticCriteria: [
      'Coronary Angiography (Saw Classification).',
      'Type 1: Intimal flap/double lumen.',
      'Type 2: Diffuse narrowing (interstitial hematoma).',
      'Type 3: Resembles atherosclerosis (requires OCT/IVUS confirmation).'
    ],
    diagnosticAlgorithm: [
      'Angio (Identify Saw Type)',
      'Consider IVUS/OCT (Type 3)',
      'Avoid iatrogenic dissection',
      'Screen for FMD'
    ],
    labDeviations: [
      { label: 'Troponin', value: 'Elevated (STEMI/NSTEMI)', isCritical: false },
      { label: 'NT-proBNP', value: '↑ in extensive dissection', isCritical: false }
    ],
    treatmentAlgorithm: [
      { id: 'scad-1', label: 'Conservative Mgmt', action: 'Mainstay for stable patients; hospitalize for 3-5 days.', category: 'initial' },
      { id: 'scad-2', label: 'Shear Reduction', action: 'Aggressive Beta-blocker therapy to reduce coronary wall stress.', category: 'intervention' },
      { id: 'scad-3', label: 'Avoid PCI', action: 'Avoid PCI unless ongoing ischemia/collapse; high complication rate.', category: 'intervention' },
      { id: 'scad-4', label: 'Screening', action: 'Screen other vascular beds for FMD (CTA Neck/Renals).', category: 'long-term' }
    ],
    ekgFindings: [
      'STEMI or NSTEMI patterns.',
      'Ischemic changes in non-traditional distributions.'
    ],
    imaging: {
      echo: [
        'Regional wall motion abnormalities (RWMA) corresponding to the dissection.',
        'LVEF assessment.'
      ],
      ct_mri: [
        'CCTA: Can identify hematoma in proximal vessels but limited sensitivity in mid/distal.',
        'Cardiac MRI: Infarct assessment (LGE).'
      ]
    },
    management: {
      primary: [
        'Conservative management (preferred) for stable patients (90% heal spontaneously).',
        'Aspirin + Beta-blockers (Reduce wall stress).'
      ],
      secondary: [
        'PCI or CABG only for ongoing ischemia or hemodynamic instability (high complication risk).'
      ]
    },
    pearls: [
      'Iatrogenic dissection is a major risk during angiography for SCAD.',
      'Associated with Fibromuscular Dysplasia (FMD); screen other vascular beds.'
    ],
    redFlags: [
      'Left Main involvement',
      'Ongoing Ischemia',
      'Ventricular Arrhythmias'
    ],
    differentialDiagnosis: [
      'Atherosclerotic ACS',
      'Coronary Vasospasm',
      'Takotsubo Syndrome'
    ],
    source: 'AHA/ESC SCAD Position Paper',
    lastUpdated: '2023'
  },
  {
    id: 'myocarditis',
    name: 'Acute Myocarditis',
    category: 'Emergency',
    summary: 'Inflammation of the myocardium, usually viral or immune-mediated, ranging from mild chest pain to fulminant heart failure and arrhythmia.',
    pathophysiology: 'Myocyte injury from direct viral cytotoxicity and immune-mediated inflammation causes oedema, necrosis and contractile dysfunction.',
    pathogenesis: [
      { stage: 'Trigger', text: 'Viral infection (or an autoimmune or toxic cause).' },
      { stage: 'Direct injury', text: 'Viral cytotoxicity and the innate immune response.' },
      { stage: 'Inflammation', text: 'Cellular infiltration with myocardial oedema and necrosis.' },
      { stage: 'Dysfunction', text: 'Contractile impairment and an arrhythmia substrate.' },
      { stage: 'Remodelling', text: 'Resolution, or progression to fibrosis and dilated cardiomyopathy.' }
    ],
    signs: [
      'Fever and a viral prodrome',
      'Tachycardia out of proportion to fever',
      'Murmur or pericardial friction rub',
      'Signs of heart failure',
      'Arrhythmia'
    ],
    etiology: [
      'Viral (parvovirus B19, coxsackievirus, adenovirus)',
      'Autoimmune / giant-cell',
      'Drugs, toxins and systemic disease'
    ],
    symptoms: [
      'Chest pain (often pleuritic)',
      'Fever / viral prodrome',
      'Heart Failure symptoms',
      'Sudden death risk'
    ],
    diagnosticCriteria: [
      'Lake Louise Criteria (CMR).',
      'Elevated Troponin with normal coronary arteries.',
      'EKG changes and new Echo dysfunction.'
    ],
    diagnosticAlgorithm: [
      'Rule out AMI (Angio)',
      'Confirm CMR (Lake Louise)',
      'Check for Viral Prodrome',
      'Assess for Fulminant signs'
    ],
    labDeviations: [
      { label: 'Troponin', value: 'Positive (Elevated)', isCritical: false },
      { label: 'CRP/ESR', value: '↑ (Infectious marker)', isCritical: false },
      { label: 'BNP', value: '↑ if LF dysfunction', isCritical: false }
    ],
    ekgFindings: [
      'Non-specific ST/T wave changes.',
      'PR segment depression / ST elevation (if myopericarditis).',
      'Ventricular arrhythmias.'
    ],
    imaging: {
      echo: [
        'Global or regional wall motion abnormalities.',
        'Increased wall thickness (interstitial edema).',
        'Pericardial effusion.'
      ],
      ct_mri: [
        'CMR (Gold Standard): T2-weighted imaging for edema.',
        'Late Gadolinium Enhancement (LGE): Typically non-ischemic (subepicardial/mid-wall).',
        'T1/T2 Mapping.'
      ]
    },
    management: {
      primary: [
        'Rest / Exercise restriction (3-6 months).',
        'Heart failure therapy (ACEi/Beta-blockers).',
        'NSAIDs only if pericarditis is present (caution in acute myocarditis).'
      ],
      secondary: [
        'Immunosuppression for specific types (Giant Cell, Sarcoid).',
        'Mechanical Circulatory Support for Fulminant cases.'
      ]
    },
    pearls: [
      'Fulminant myocarditis has high mortality but excellent recovery if survived.',
      'Endomyocardial biopsy is reserved for high-risk/refractory cases.'
    ],
    redFlags: [
      'LVEF < 35%',
      'Sustained VT',
      'Cardiogenic Shock'
    ],
    differentialDiagnosis: [
      'Acute MI',
      'Takotsubo Syndrome',
      'Pericarditis'
    ],
    source: 'ESC 2024 Guidelines',
    lastUpdated: '2024'
  },
  {
    id: 'amyloidosis',
    name: 'Cardiac Amyloidosis (Restrictive)',
    category: 'Heart Failure',
    summary: 'Myocardial infiltration by amyloid fibrils (AL or ATTR) producing a restrictive, non-dilated cardiomyopathy with thickened walls.',
    pathophysiology: 'Amyloid fibril deposition expands the interstitium, increasing myocardial stiffness and wall thickness with impaired diastolic filling; conduction-tissue involvement causes arrhythmia and heart block.',
    pathogenesis: [
      { stage: 'Trigger', text: 'Misfolded protein precursors (transthyretin in ATTR, light chains in AL).' },
      { stage: 'Deposition', text: 'Extracellular amyloid fibril accumulation.' },
      { stage: 'Stiffness', text: 'Increased myocardial wall thickness and stiffness.' },
      { stage: 'Filling', text: 'Restrictive physiology with raised filling pressures and biatrial enlargement.' },
      { stage: 'Consequence', text: 'Right heart failure, conduction disease and arrhythmia.' }
    ],
    signs: [
      'Raised JVP and oedema',
      'Low-voltage ECG despite increased wall thickness',
      'Apical sparing on strain imaging',
      'Macroglossia or periorbital purpura (AL)',
      'Carpal tunnel syndrome (ATTR)'
    ],
    symptoms: [
      'Heart Failure with Preserved EF (HFpEF)',
      'Carpal Tunnel Syndrome / Spinal Stenosis (ATTR)',
      'Macroglossia / Periorbital purpura (AL)',
      'Orthostatic hypotension'
    ],
    diagnosticCriteria: [
      'Technetium Pyrophosphate (PYP) scan [Positive Grade 2/3 for ATTR].',
      'Free Light Chain assay (Exclude AL).',
      'Endomyocardial or Extracardiac biopsy.'
    ],
    diagnosticAlgorithm: [
      'Assess for "Bull\'s Eye" Strain',
      'Rule out AL with Light Chains',
      'Perform PYP scan (ATTR)',
      'Confirm with Biopsy if AL pos'
    ],
    labDeviations: [
      { label: 'Free Light Chains', value: 'Abnormal (suggests AL)', isCritical: true },
      { label: 'NT-proBNP', value: '↑ (Incongruent with symptoms)', isCritical: false },
      { label: 'Troponin', value: 'Chronic persistent elevation', isCritical: false }
    ],
    ekgFindings: [
      'Low voltage QRS (despite thick walls on Echo).',
      'Pseudo-infarct pattern (pathologic Q-waves in V1-V3).',
      'AV blocks and Atrial Fibrillation.'
    ],
    imaging: {
      echo: [
        'Increased wall thickness (Granular/Sparkling appearance).',
        'Apical Sparing Pattern on Strain Imaging (Bull\'s eye).',
        'LA enlargement and thick interatrial septum.',
        'Diastolic Dysfunction (Restrictive Fill Pattern).'
      ],
      ct_mri: [
        'CMR: Diffuse subendocardial LGE.',
        'Increased Extracellular Volume (ECV).',
        'Longer T1 times.'
      ]
    },
    severeCriteria: {
      label: 'Restrictive Fill Pattern',
      metrics: [
        { name: "E/A Ratio", value: "> 2.0", unit: "ratio" },
        { name: "Decel Time", value: "< 160", unit: "ms" },
        { name: "Average E/e'", value: "> 14", unit: "ratio" }
      ]
    },
    management: {
      primary: [
        'ATTR: Tafamidis (Stabilizer), Patisiran (Silencer).',
        'AL: Chemotherapy / Autologous Stem Cell Transplant.',
        'Careful Diuresis (Restrictive physiology requires preload).'
      ],
      secondary: [
        'Heart Transplantation for eligible candidates.'
      ]
    },
    pearls: [
      'Consider in any HFpEF patient with thick walls and low EKG voltage.',
      'Beta-blockers and ACEi are often poorly tolerated due to restrictive physiology.'
    ],
    redFlags: [
      'Syncope (conduction disease)',
      'Refractory Nephrotic Syndrome (AL)',
      'Advanced HF'
    ],
    differentialDiagnosis: [
      'Hypertrophic Cardiomyopathy',
      'Fabry Disease',
      'Hypertensive Heart Disease'
    ],
    source: 'ESC Amyloidosis Consensus 2024',
    lastUpdated: '2024'
  },
  {
    id: 'bicuspid-aortic-valve',
    name: 'Bicuspid Aortic Valve (BAV)',
    category: 'Structural',
    summary: 'Congenital fusion of two aortic cusps, predisposing to aortic stenosis, regurgitation and aortopathy.',
    pathophysiology: 'Abnormal cusp architecture causes turbulent flow and accelerated leaflet calcification, while an associated aortopathy weakens the aortic wall and predisposes to dilatation and dissection.',
    pathogenesis: [
      { stage: 'Congenital anomaly', text: 'Fusion of two aortic cusps.' },
      { stage: 'Flow', text: 'Turbulent flow and abnormal mechanical stress.' },
      { stage: 'Valve', text: 'Accelerated fibrosis and calcification leading to stenosis or regurgitation.' },
      { stage: 'Aortopathy', text: 'Medial degeneration causes root/ascending aortic dilatation.' },
      { stage: 'Consequence', text: 'Aortic stenosis/regurgitation, aneurysm and dissection risk.' }
    ],
    signs: [
      'Ejection systolic murmur (if aortic stenosis)',
      'Early diastolic murmur (if aortic regurgitation)',
      'Systolic ejection click',
      'Aortic dilatation on imaging'
    ],
    symptoms: [
      'Often asymptomatic for decades',
      'Exertional dyspnea (if AS/AR develops)',
      'Chest pain (if aortic dilation occurs)'
    ],
    diagnosticCriteria: [
      'TTE showing two functional cusps (usually R-L or R-N fusion).',
      'Systolic doming of the valve.',
      'Eccentric closure line.'
    ],
    diagnosticAlgorithm: [
      'Confirm Valve Morphology (TTE)',
      'Measure Aortic Root (MRI/CT)',
      'Assess for AS/AR severity',
      'Screen for Coarctation'
    ],
    labDeviations: [
      { label: 'BNP', value: '↑ if AS/AR developed', isCritical: false },
      { label: 'TGF-beta', value: 'Elevated Pathological Signal', isCritical: false }
    ],
    imaging: {
      echo: [
        'Diagnosis of BAV morphology.',
        'Assessment of Aortic Stenosis (Vmax, Mean Gradient).',
        'Assessment of Aortic Regurgitation.',
        'Measurement of Aortic Root and Ascending Aorta diameters.'
      ],
      ct_mri: [
        'Cardiac MRI/CT: GOLD Standard for measuring the entire aorta.',
        '4D Flow MRI: Assess wall shear stress (specialized centers).'
      ]
    },
    severeCriteria: {
      label: 'Aortic Dilation Thresholds',
      metrics: [
        { name: "Surgical Trigger", value: "> 5.5", unit: "cm" },
        { name: "Trigger w/ Risk", value: "> 5.0", unit: "cm" },
        { name: "Dilation Rate", value: "> 0.5", unit: "cm/yr" }
      ]
    },
    management: {
      primary: [
        'Serial Echo/MRI monitoring (annual if > 4.5 cm).',
        'Blood pressure control (Beta-blockers/ARBs).'
      ],
      secondary: [
        'Aortic Valve Replacement + Aortic Root replacement (Bentall) if thresholds met.'
      ]
    },
    pearls: [
      'Most common congenital heart defect (1-2% of population).',
      'High association with Coarctation of the Aorta and Turner Syndrome.'
    ],
    redFlags: [
      'Aortic Diameter > 5.0 cm',
      'Rapid Dilation',
      'New onset Aortic Regurgitation'
    ],
    differentialDiagnosis: [
      'Senile Calcific Aortic Stenosis',
      'Rheumatic Aortic Valve Disease'
    ],
    source: 'ACC/AHA 2020 VHD Guidelines',
    lastUpdated: '2024'
  },
  {
    id: 'coarctation-aorta',
    name: 'Coarctation of the Aorta',
    category: 'Vascular',
    summary: 'Congenital narrowing of the aortic isthmus, causing upper-limb hypertension and left ventricular pressure overload.',
    pathophysiology: 'Mechanical obstruction at the isthmus raises upper-body afterload and reduces lower-body perfusion; collateral arteries develop and chronic hypertension drives left ventricular hypertrophy.',
    pathogenesis: [
      { stage: 'Congenital defect', text: 'Juxtaductal aortic narrowing.' },
      { stage: 'Obstruction', text: 'Mechanical obstruction raises upper-body afterload.' },
      { stage: 'Collateral', text: 'Intercostal collateral arteries develop.' },
      { stage: 'LV load', text: 'Chronic hypertension drives left ventricular hypertrophy.' },
      { stage: 'Consequence', text: 'Hypertension, LVH, premature coronary disease and aortic complications.' }
    ],
    signs: [
      'Upper-limb hypertension with brachial-femoral delay',
      'Blood-pressure differential >20 mmHg',
      'Weak femoral pulses',
      'Continuous murmur over the back',
      'Associated bicuspid aortic valve'
    ],
    etiology: [
      'Congenital juxtaductal aortic wall abnormality',
      'Associated with bicuspid aortic valve and Turner syndrome'
    ],
    symptoms: [
      'Upper extremity Hypertension',
      'Lower extremity weakness / claudication',
      'Headache / Cold feet'
    ],
    diagnosticCriteria: [
      'Brachial-femoral pulse delay.',
      'BP differential > 20 mmHg between upper and lower extremities.',
      'Continuous murmur over the back.'
    ],
    diagnosticAlgorithm: [
      'Compare Upper/Lower BP',
      'Assess Brachial-Femoral Pulse',
      'Confirm with CT/MRI (Isthmus)',
      'Screen for BAV'
    ],
    labDeviations: [
      { label: 'Renin', value: '↑ (due to low renal flow)', isCritical: false },
      { label: 'Cr', value: 'Monitor renal function', isCritical: false }
    ],
    ekgFindings: [
      'Left Ventricular Hypertrophy (LVH).',
      'Right Bundle Branch Block (post-repair).'
    ],
    imaging: {
      echo: [
        'Narrowing at the aortic isthmus.',
        'Diastolic "tail" (run-off) in the descending aorta.',
        'Associated Bicuspid Aortic Valve (50-75% of cases).'
      ],
      ct_mri: [
        'Cardiac CT/MRI: Defined anatomy of the narrowing and collaterals.',
        'Assessment of post-stenotic dilation.'
      ],
      cxr: [
        'Rib notching (3rd to 8th ribs).',
        '"Figure 3" sign on the aortic knob.'
      ]
    },
    management: {
      primary: [
        'Blood pressure management.',
        'Stent placement (preferred in adults) or surgical repair.'
      ],
      secondary: [
        'Surgical resection with end-to-end anastomosis (infants/children).'
      ]
    },
    pearls: [
      'Classically occurs just distal to the left subclavian artery.',
      'Life-long follow-up needed even after repair (risk of re-coarctation and aneurysms).'
    ],
    redFlags: [
      'Severe Hypertension',
      'Heart Failure',
      'Aortic Aneurysm'
    ],
    differentialDiagnosis: [
      'Pseudocoarctation',
      'Takayasu Arteritis',
      'Interrupt Aortic Arch'
    ],
    source: 'ACC/AHA Adult Congenital Guidelines',
    lastUpdated: '2024'
  },
  {
    id: 'brugada-syndrome',
    name: 'Brugada Syndrome',
    category: 'Arrhythmia',
    summary: 'Inherited channelopathy with a coved type-1 ST pattern in V1-V2 and a risk of polymorphic VT/VF, often at rest or at night.',
    pathophysiology: 'Loss-of-function sodium-channel (SCN5A) mutations cause heterogeneous repolarisation in the right ventricular epicardium, creating a substrate for phase-2 re-entry and VF.',
    pathogenesis: [
      { stage: 'Genetic defect', text: 'SCN5A loss of function, or another susceptibility gene.' },
      { stage: 'Repolarisation', text: 'Outward/inward current imbalance in the RV epicardium.' },
      { stage: 'Substrate', text: 'Phase-2 re-entry.' },
      { stage: 'Trigger', text: 'Fever, rest, vagal tone or sodium-blocking drugs.' },
      { stage: 'Consequence', text: 'Polymorphic VT/VF and sudden death, often nocturnal.' }
    ],
    signs: [
      'Type-1 coved ST elevation in V1-V2',
      'Syncope, often nocturnal',
      'Unmasked by fever or drug challenge',
      'Structurally normal heart'
    ],
    symptoms: [
      'Syncope (often at night)',
      'Nocturnal agonal respirations',
      'Palpitations',
      'Often asymptomatic until SCD'
    ],
    diagnosticCriteria: [
      'Type 1 Brugada pattern (coved ST-elevation ≥2mm) in V1-V2.',
      'Occurs spontaneously or after provocative testing (Ajmaline).',
      'History of VT/VF or family history of SCD.'
    ],
    diagnosticAlgorithm: [
      'Identify Type 1 ECG Pattern',
      'Fever provocation check',
      'Drug Challenge (Ajmaline)',
      'Assess for SCD family Hx'
    ],
    labDeviations: [
      { label: 'Genetic', value: 'SCN5A Mutation (common)', isCritical: false },
      { label: 'K+', value: 'Check for hypo/hyper', isCritical: false }
    ],
    ekgFindings: [
      'Type 1: Coved ST-elevation followed by negative T-wave.',
      'Type 2: Saddleback ST-elevation (>2mm).',
      'Type 3: Saddleback or coved (<1mm elevation).'
    ],
    treatmentAlgorithm: [
      { id: 'bru-1', label: 'Pattern Eval', action: 'Identify spontaneous vs induced Type 1 pattern.', category: 'initial' },
      { id: 'bru-2', label: 'Risk Screening', action: 'Evaluate for syncope or SCD events.', category: 'initial' },
      { id: 'bru-3', label: 'Prevention', action: 'Aggressive fever treatment (Tylenol) and avoidance of Brugada-triggers.', category: 'long-term' },
      { id: 'bru-4', label: 'Definitive', action: 'ICD Implantation if high risk (Symptomatic or spontaneous Type 1).', category: 'intervention' }
    ],
    management: {
      primary: [
        'Fever management (antipyretics).',
        'Avoidance of triggers (BrugadaDrugs.org).'
      ],
      secondary: [
        'ICD implantation for symptomatic patients.',
        'Quinidine (if ICD contraindicated or storm).'
      ]
    },
    pearls: [
      'Genetic defect in sodium channel (SCN5A).',
      'Most episodes occur at rest/sleep, not during exercise.'
    ],
    redFlags: [
      'Agonal nocturnal respirations.',
      'Spontaneous Type 1 pattern.',
      'Family history of premature SCD.'
    ],
    differentialDiagnosis: [
      'Early repolarization',
      'Arrhythmogenic Cardiomyopathy (ARVC)',
      'Pectus excavatum'
    ],
    source: 'HRS/EHRA Brugada Consensus',
    lastUpdated: '2024'
  },
  {
    id: 'stable-ischemic-heart-disease',
    name: 'Chronic Coronary Syndrome (CCS)',
    category: 'Ischemic',
    summary: 'Stable, predominantly obstructive coronary artery disease presenting with predictable exertional angina, distinct from an acute coronary syndrome.',
    pathophysiology: 'Atherosclerotic plaques limit coronary flow reserve; a demand-supply mismatch during exertion causes predictable ischaemia without acute plaque rupture.',
    pathogenesis: [
      { stage: 'Substrate', text: 'Obstructive coronary plaque(s).' },
      { stage: 'Reserve', text: 'Reduced coronary flow reserve.' },
      { stage: 'Mismatch', text: 'Exertion raises demand beyond a fixed supply, causing ischaemia.' },
      { stage: 'Reversibility', text: 'Ischaemia resolves at rest.' },
      { stage: 'Progression', text: 'Plaque destabilisation may cause an acute coronary syndrome.' }
    ],
    signs: [
      'Reproducible exertional chest pain relieved by rest or nitrates',
      'Often a normal examination',
      'Transient ST depression during stress',
      'Signs of associated risk factors'
    ],
    etiology: [
      'Atherosclerotic coronary plaque (>50% stenosis)',
      'Coronary vasospasm or microvascular dysfunction (ANOCA/INOCA)',
      'Risk factors: LDL-C, hypertension, smoking, diabetes, age, male sex, family history'
    ],
    symptoms: [
      'Stable Angina (with exertion, relieved by rest)',
      'Dyspnea on exertion',
      'Silent ischemia (diabetics)'
    ],
    diagnosticCriteria: [
      'Typical Angina symptoms.',
      'Functional Stress Test (Echo/Nuclear) or CCTA showing >50% stenosis.',
      'Calculated pre-test probability.'
    ],
    diagnosticAlgorithm: [
      'Pre-test Prob Assessment',
      'CCTA (Low-Intermediate Risk)',
      'Stress Test (Intermediate-High)',
      'Assess for refectory Angina'
    ],
    labDeviations: [
      { label: 'LDL', value: 'Target < 55 mg/dL (ESC)', isCritical: false },
      { label: 'HbA1c', value: 'Monitor diabetes control', isCritical: false },
      { label: 'Lp(a)', value: 'Screen once to assess risk', isCritical: false }
    ],
    treatmentAlgorithm: [
      { id: 'ccs-1', label: 'GDMT', action: 'Start Aspirin, High-dose Statin, and Beta-blocker/CCB.', category: 'initial' },
      { id: 'ccs-2', label: 'Testing', action: 'Perform Functional Stress Test or Cardiac CT (CCTA) if low-intermediate risk.', category: 'initial' },
      { id: 'ccs-3', label: 'Invasive Eval', action: 'Proceed to ICA if symptoms refractory or high-risk stress/CT.', category: 'intervention' },
      { id: 'ccs-4', label: 'Lifestyle', action: 'Strict Smoking cessation, Diet, and Cardiac Rehabilitation.', category: 'long-term' }
    ],
    management: {
      primary: [
        'Intensive Medical Therapy (Statins, Anti-ischemics).',
        'Lifestyle Modification.'
      ],
      secondary: [
        'Revascularization (PCI or CABG) for symptoms or prognostic benefit (LAD/Multivessel).'
      ]
    },
    pearls: [
      'ISCHEMIA trial showed medical therapy is equal to PCI for stable CAD without high-risk anatomy.',
      'Nitrates are for symptom relief, not mortality benefit.'
    ],
    redFlags: [
      'Crescendo symptoms (progressing to Unstable Angina).',
      'Symptomatic even at rest.',
      'Low exercise capacity.'
    ],
    differentialDiagnosis: [
      'Non-cardiac chest pain',
      'Aortic Stenosis',
      'Microvascular Angina'
    ],
    ekgFindings: [
      'Normal EKG (approx. 50% of patients).',
      'Pathological Q-waves (old infarct).',
      'Non-specific ST-T wave changes.',
      'Left Ventricular Hypertrophy (LVH).'
    ],
    imaging: {
      echo: [
        'Assessment of LVEF.',
        'Wall motion abnormalities (at rest or during stress echo).',
        'Valvular assessment (Mitral Regurgitation).'
      ],
      ct_mri: [
        'CCTA (Gold Standard for exclusion): Severity of stenosis and plaque morphology.',
        'Cardiac MRI (Stress): Identify areas of reversible ischemia/perfusion defects.',
        'CACS: Coronary Artery Calcium Score (>400 is high risk).'
      ]
    },
    source: 'ESC CCS Guidelines 2024',
    lastUpdated: '2024'
  },
  {
    id: 'acute-pericarditis',
    name: 'Acute Pericarditis',
    category: 'Other',
    summary: 'Acute inflammation of the pericardium, most often viral or idiopathic, causing sharp pleuritic chest pain.',
    pathophysiology: 'Pericardial inflammation produces a fibrinous exudate and pain; a smaller or larger effusion may form, and the process may become constrictive over time.',
    pathogenesis: [
      { stage: 'Trigger', text: 'Viral infection, or an immune, uraemic or post-infarction (Dressler) cause.' },
      { stage: 'Inflammation', text: 'Pericardial oedema and fibrin deposition.' },
      { stage: 'Pain', text: 'Visceral and parietal irritation causes pleuritic pain.' },
      { stage: 'Effusion', text: 'Serous or haemorrhagic pericardial fluid may accumulate.' },
      { stage: 'Consequence', text: 'Rarely tamponade; may evolve to constrictive pericarditis.' }
    ],
    signs: [
      'Pericardial friction rub',
      'Positional pleuritic pain relieved by sitting forward',
      'Fever',
      'Pulsus paradoxus if effusion',
      'ECG PR depression and diffuse ST elevation'
    ],
    symptoms: [
      'Pleuritic chest pain (sharp, stabbing)',
      'Pain worsens with lying flat, relieved by sitting forward',
      'Fever (occasional)',
      'Pericardial friction rub on auscultation'
    ],
    diagnosticCriteria: [
      'Chest pain characteristic of pericarditis.',
      'Pericardial friction rub.',
      'Widespread ST-elevation or PR-depression on EKG.',
      'New or worsening pericardial effusion.'
    ],
    diagnosticAlgorithm: [
      'Assess for "Positional" Pain',
      'Listen for Friction Rub',
      'Confirm Diffuse STE on EKG',
      'Check for Effusion (Echo)'
    ],
    labDeviations: [
      { label: 'CRP/ESR', value: '↑ (Key for monitoring)', isCritical: false },
      { label: 'Troponin', value: '↑ (suggests Myopericarditis)', isCritical: false },
      { label: 'WBC', value: 'Leukocytosis (common)', isCritical: false }
    ],
    ekgFindings: [
      'Diffuse ST-elevation (upward concavity).',
      'PR-segment depression (especially in II, aVF, V2-V6).',
      'PR-elevation in aVR.'
    ],
    imaging: {
      echo: [
        'Often normal.',
        'Check for small/moderate pericardial effusion.',
        'Assess for signs of tamponade.'
      ],
      ct_mri: [
        'Cardiac MRI (Late Gadolinium Enhancement): Gold standard for showing pericardial inflammation.'
      ]
    },
    treatmentAlgorithm: [
      { id: 'per-1', label: 'Initial Therapy', action: 'High-dose Aspirin (750mg) or NSAID (Ibuprofen 600mg) q8h.', category: 'initial' },
      { id: 'per-2', label: 'Adjuvant therapy', action: 'Colchicine (0.5mg qd/bid) for 3 months to prevent recurrence.', category: 'intervention' },
      { id: 'per-3', label: 'Refractory Cases', action: 'Consider low-dose Corticosteroids if NSAIDs/Colchicine fail.', category: 'escalation' },
      { id: 'per-4', label: 'Restriction', action: 'Exercise restriction until symptoms and CRP resolve (>3 months for athletes).', category: 'long-term' }
    ],
    management: {
      primary: [
        'NSAIDs (Ibuprofen/Aspirin) + Colchicine.',
        'Exercise restriction (critical for prevention of recurrence).'
      ],
      secondary: [
        'Steroids (only if refractory or contraindicated for NSAIDs).',
        'Anakinra for recurrent autoreactive pericarditis.'
      ]
    },
    pearls: [
      'Colchicine reduces the risk of recurrence by 50%.',
      'Avoid high-dose steroids early; they increase the risk of recurrence.'
    ],
    redFlags: [
      'Large pericardial effusion.',
      'Fever >38°C.',
      'Subacute onset over weeks.',
      'Failure of NSAID response.'
    ],
    differentialDiagnosis: [
      'STEMI',
      'Aortic Dissection',
      'Pulmonary Embolism'
    ],
    source: 'ESC Pericardial Disease 2024',
    lastUpdated: '2024'
  },
  {
    id: 'sick-sinus-syndrome',
    name: 'Sick Sinus Syndrome (SSS)',
    category: 'Arrhythmia',
    summary: 'Sinus node dysfunction causing sinus bradycardia, pauses and tachy-brady syndrome with syncope or exercise intolerance.',
    pathophysiology: 'Degeneration or fibrosis of the sinus node and surrounding tissue reduces automaticity and sinoatrial conduction, causing bradycardia, pauses and a tachycardia-bradycardia pattern.',
    pathogenesis: [
      { stage: 'Trigger', text: 'Age-related degeneration, ischaemia, infiltration or drugs.' },
      { stage: 'Node', text: 'Reduced sinus-node automaticity.' },
      { stage: 'Conduction', text: 'Sinoatrial exit block and sinus pauses.' },
      { stage: 'Tachy-brady', text: 'Paroxysmal atrial tachyarrhythmias alternating with bradycardia.' },
      { stage: 'Consequence', text: 'Syncope and exercise intolerance; pacing may be required.' }
    ],
    signs: [
      'Sinus bradycardia or pauses',
      'Tachy-brady pattern on Holter',
      'Syncope or presyncope',
      'Blunted chronotropic response to exercise'
    ],
    symptoms: [
      'Syncope or Presyncope (Stokes-Adams attacks)',
      'Palpitations (tachy-brady syndrome)',
      'Exercise intolerance',
      'Lightheadedness'
    ],
    diagnosticCriteria: [
      'Sinus bradycardia without extrinsic cause.',
      'Sinus pauses (>3s) or arrest.',
      'Sinoatrial exit block.',
      'Correlation of symptoms with findings.'
    ],
    diagnosticAlgorithm: [
      'Rule out Med effects (BB/CCB)',
      'Holter (Correlation to Sx)',
      'Assess for Chronotropic Incomp',
      'Identify Tachy-Brady'
    ],
    labDeviations: [
      { label: 'TSH', value: 'Check for Hypothyroidism', isCritical: false },
      { label: 'Digoxin Level', value: 'Assess for toxicity', isCritical: false }
    ],
    ekgFindings: [
      'Profound Sinus Bradycardia.',
      'Sinus pauses / SA blocks.',
      'Tachy-Brady (AFib followed by long pauses).'
    ],
    treatmentAlgorithm: [
      { id: 'sss-1', label: 'Drug Review', action: 'Stop culprit meds (Beta-blockers, CCBs, Digoxin).', category: 'initial' },
      { id: 'sss-2', label: 'Symptom Link', action: 'Link symptoms to bradycardia via Holter/Loop recorder.', category: 'initial' },
      { id: 'sss-3', label: 'Definitive Cure', action: 'Permanent Pacemaker (PPM) if symptomatic.', category: 'intervention' },
      { id: 'sss-4', label: 'Tachy-Brady', action: 'Anticoagulation if AFib is part of the syndrome.', category: 'long-term' }
    ],
    management: {
      primary: [
        'Permanent Pacemaker (DDD) for symptomatic bradycardia.',
        'Stop nodal-blocking agents.'
      ],
      secondary: [
        'Ablation for tachy-components (AFib/Flutter) once PPM in place.'
      ]
    },
    pearls: [
      'Most common reason for permanent pacemaker implantation.',
      'Ensure the bradycardia is not just physiological (e.g. athlete).'
    ],
    redFlags: [
        'Syncope',
        'Pauses > 3.0s',
        'Tachy-brady exacerbation'
    ],
    differentialDiagnosis: [
      'Physiological Bradycardia',
      'B-blocker toxicity',
      'Carotid Sinus Hypersensitivity'
    ],
    source: 'AHA/ACC/HRS Bradycardia 2018',
    lastUpdated: '2024'
  },
  {
    id: 'aortic-regurgitation',
    name: 'Aortic Regurgitation (AR)',
    category: 'Structural',
    summary: 'Diastolic leakage of the aortic valve producing left ventricular volume overload and progressive eccentric hypertrophy.',
    pathophysiology: 'Incomplete diastolic coaptation allows regurgitant flow back into the left ventricle, imposing combined pressure and volume overload that drives eccentric hypertrophy.',
    pathogenesis: [
      { stage: 'Trigger', text: 'Primary valve disease or aortic root dilatation.' },
      { stage: 'Mechanism', text: 'Incomplete diastolic coaptation produces a regurgitant jet.' },
      { stage: 'Load', text: 'Combined pressure and volume overload of the left ventricle.' },
      { stage: 'Remodelling', text: 'Eccentric hypertrophy with progressive dilatation.' },
      { stage: 'Consequence', text: 'Large stroke volume with wide pulse pressure; eventual LV dysfunction and failure.' }
    ],
    signs: [
      'Early diastolic decrescendo murmur',
      'Wide pulse pressure with a bounding (water-hammer) pulse',
      'Corrigan pulse and de Musset sign',
      'Displaced, hyperdynamic apical impulse'
    ],
    etiology: [
      'Primary valve disease (bicuspid valve, endocarditis, rheumatic)',
      'Aortic root dilatation (Marfan, hypertension, annulo-aortic ectasia)',
      'Aortic dissection'
    ],
    symptoms: [
      'Exertional dyspnea / Fatigue',
      'Palpitations (forceful heartbeat)',
      'Head pounding (Corrigan\'s pulse)',
      'Wide pulse pressure discomfort'
    ],
    diagnosticCriteria: [
      'Early diastolic decrescendo murmur at LUSB.',
      'Wide pulse pressure (e.g., 150/50 mmHg).',
      'Confirmed by Echocardiography (Regurgitant Volume, PISA).'
    ],
    diagnosticAlgorithm: [
      'Assess for "Wide" Pulse Pressure',
      'Quantify AR Severity (Echo)',
      'Measure LVESD Trigger (>50mm)',
      'Assess for LVEF <55%'
    ],
    labDeviations: [
      { label: 'BNP', value: '↑ (Marker of LV Stress)', isCritical: false },
      { label: 'Cr', value: 'Baseline for monitoring', isCritical: false }
    ],
    imaging: {
      echo: [
        'Vena contracta width > 0.6 cm (Severe).',
        'Regurgitant volume ≥ 60 mL (Severe).',
        'Effective Regurgitant Orifice Area (EROA) ≥ 0.30 cm².',
        'Holodiastolic retrograde flow in the descending aorta.'
      ],
      ct_mri: [
        'Cardiac MRI (Gold Standard for quantification): Regurgitant fraction > 33% (Severe).'
      ]
    },
    treatmentAlgorithm: [
      { id: 'ar-1', label: 'Severity Check', action: 'Determine severity via Echo: Regurg Vol >60mL or VC >0.6cm.', category: 'initial' },
      { id: 'ar-2', label: 'LV Status', action: 'Assess LV dimensions: LVEDD >65mm or LVESD >50mm (trigger for surgery).', category: 'initial' },
      { id: 'ar-3', label: 'Afterload Reduction', action: 'Target SBP <120 using ACEi/ARB or Nifedipine (DHP-CCB).', category: 'long-term' },
      { id: 'ar-4', label: 'Surgery', action: 'AVR for symptomatic severe AR or asymptomatic with LV dilation/dysfunction.', category: 'intervention' }
    ],
    management: {
      primary: [
        'Aortic Valve Replacement (AVR).',
        'Blood pressure control (Vasodilators like ACEi/ARBs).'
      ],
      secondary: [
        'Surgical management of associated aortic root dilation.'
      ]
    },
    pearls: [
      'Water-hammer pulse (Corrigan\'s) and De Musset\'s sign (head nodding).',
      'Chronic AR leads to massive eccentric LV hypertrophy ("cor bovinum").'
    ],
    redFlags: [
      'New onset HF',
      'LVESD > 50 mm (or 25 mm/m²)',
      'LVEF < 55%'
    ],
    differentialDiagnosis: [
      'Pulmonary Regurgitation (Graham-Steell murmur)',
      'Mitral Stenosis'
    ],
    source: 'ACC/AHA 2020 VHD Guidelines',
    lastUpdated: '2024'
  },
  {
    id: 'mitral-valve-prolapse',
    name: 'Mitral Valve Prolapse (MVP)',
    category: 'Structural',
    summary: 'Systolic displacement of a thickened mitral leaflet into the left atrium, usually benign but sometimes causing regurgitation, arrhythmia or endocarditis.',
    pathophysiology: 'Myxomatous degeneration of the mitral leaflets and chordae causes leaflet prolapse; the resulting mitral regurgitation and chordal redundancy account for the features and complications.',
    pathogenesis: [
      { stage: 'Substrate', text: 'Myxomatous leaflet degeneration.' },
      { stage: 'Prolapse', text: 'Systolic leaflet displacement into the left atrium.' },
      { stage: 'Regurgitation', text: 'Incomplete coaptation produces mitral regurgitation.' },
      { stage: 'Complications', text: 'Arrhythmia, chordal rupture, endocarditis.' },
      { stage: 'Consequence', text: 'Usually benign; severe regurgitation drives symptoms.' }
    ],
    signs: [
      'Mid-to-late systolic click',
      'Late systolic murmur',
      'Often a normal examination',
      'Signs of mitral regurgitation if severe'
    ],
    symptoms: [
      'Chest pain (atypical)',
      'Palpitations',
      'Panic attacks / Anxiety',
      'Syncope (Rare, but seen in malignant MVP)'
    ],
    diagnosticCriteria: [
      'Mid-systolic click followed by a late systolic murmur.',
      'Echo: Systolic displacement of leaflet > 2mm beyond annular plane.'
    ],
    ekgFindings: [
      'Often normal.',
      'Non-specific ST-T wave changes.',
      'Premature Ventricular Contractions (PVCs).',
      'T-wave inversions in inferior leads (if "Malignant MVP").'
    ],
    imaging: {
      echo: [
        'Systolic displacement of leaflet > 2mm beyond annular plane in parasternal long-axis.',
        'Leaflet thickening (>5mm is "Barlow-like").',
        'Mitral Annular Disjunction (MAD): Separation of the LA-LV junction.',
        'Degree of associated Mitral Regurgitation.'
      ],
      cxr: [
        'Usually normal.',
        'May show LAE if severe MR develops.'
      ]
    },
    diagnosticAlgorithm: [
      'Listen for Mid-systolic Click',
      'Echo: Measure Valve Prolapse',
      'Assess for MAD',
      'Screen for complex VPCs'
    ],
    labDeviations: [
      { label: 'NT-proBNP', value: '↑ if significant MR developed', isCritical: false },
      { label: 'Mg2+', value: 'Check if palpitations present', isCritical: false }
    ],
    treatmentAlgorithm: [
      { id: 'mvp-1', label: 'Echo Assessment', action: 'Confirm MVP and assess for associated Mitral Regurgitation (MR).', category: 'initial' },
      { id: 'mvp-2', label: 'Symptom Mgmt', action: 'Beta-blockers for symptomatic palpitations/anxiety.', category: 'long-term' },
      { id: 'mvp-3', label: 'MAD Check', action: 'Screen for Mitral Annular Disjunction (MAD) and complex VPCs if symptomatic.', category: 'initial' },
      { id: 'mvp-4', label: 'Intervention', action: 'Mitral Valve Repair if severe MR with symptoms or LV dysfunction develops.', category: 'intervention' }
    ],
    management: {
      primary: [
        'Observation (Low-risk MVP).',
        'Beta-blockers for palpitations.'
      ],
      secondary: [
        'Mitral Valve Repair for severe secondary MR.',
        'ICD for high-risk "Malignant MVP" with documented VT.'
      ]
    },
    pearls: [
      'Association with Marfan and Ehlers-Danlos syndromes.',
      '"Malignant MVP" syndrome includes MAD, T-wave inversions, and ventricular arrhythmias.'
    ],
    redFlags: [
      'Complex VT on holter',
      'Mitral Annular Disjunction (MAD)',
      'Syncope'
    ],
    differentialDiagnosis: [
      'HOCM',
      'Tricuspid Prolapse'
    ],
    source: 'ESC Valvular Guidelines',
    lastUpdated: '2024'
  },
  {
    id: 'tricuspid-regurgitation',
    name: 'Tricuspid Regurgitation (TR)',
    category: 'Structural',
    summary: 'Backflow through the tricuspid valve, usually functional due to right ventricular or annular dilatation.',
    pathophysiology: 'Annular dilatation or leaflet abnormality prevents systolic coaptation, causing right atrial and systemic venous congestion.',
    pathogenesis: [
      { stage: 'Trigger', text: 'Right ventricular dilatation / pulmonary hypertension (functional) or leaflet disease (organic).' },
      { stage: 'Mechanism', text: 'Annular dilatation with incomplete coaptation.' },
      { stage: 'Regurgitation', text: 'Systolic backflow into the right atrium.' },
      { stage: 'Congestion', text: 'Raised systemic venous pressure.' },
      { stage: 'Consequence', text: 'Right heart failure with oedema and ascites.' }
    ],
    signs: [
      'Holosystolic murmur at the left lower sternal border, louder with inspiration',
      'Raised JVP with a prominent v wave',
      'Pulsatile liver',
      'Peripheral oedema and ascites'
    ],
    symptoms: [
      'Fatigue',
      'Abdominal bloating / Ascites',
      'Pulsatile neck veins',
      'Ankle edema'
    ],
    diagnosticCriteria: [
      'Holosystolic murmur at LLSB (increases with inspiration).',
      'Prominent V-wave in JVP.',
      'Echo: RV enlargement, systolic reversal in hepatic veins.'
    ],
    ekgFindings: [
      'Right Atrial Enlargement (P-pulmonale: peaked P > 2.5mm in II).',
      'Right Axis Deviation.',
      'Incomplete or Complete RBBB.',
      'Atrial Fibrillation.'
    ],
    imaging: {
      echo: [
        'Vena contracta width > 0.7 cm (Severe).',
        'Effective Regurgitant Orifice Area (EROA) ≥ 0.40 cm².',
        'Systolic flow reversal in hepatic veins (Specific for severe).',
        'Right Ventricular and Atrial dilation.'
      ],
      cxr: [
        'Enlarged Right Atrial silhouette.',
        'Prominent azygos vein.',
        'Dilatated superior vena cava.'
      ]
    },
    diagnosticAlgorithm: [
      'Measure Vena Contracta (Echo)',
      'Assess Hepatic Vein Flow',
      'Quantify EROA (≥0.40 cm²)',
      'Check for RV Dilation'
    ],
    labDeviations: [
      { label: 'Bilirubin', value: '↑ (Cardiac Cirrhosis risk)', isCritical: false }
    ],
    treatmentAlgorithm: [
      { id: 'tr-1', label: 'Etiology Check', action: 'Determine if Primary (Valve defect) or Secondary (PH / RV dilation/HF).', category: 'initial' },
      { id: 'tr-2', label: 'Diuresis', action: 'Loop diuretics for peripheral edema and congestion.', category: 'initial' },
      { id: 'tr-3', label: 'Surgery', action: 'TV Surgery if undergoing left-sided valve surgery or for isolated symptomatic severe TR.', category: 'intervention' },
      { id: 'tr-4', label: 'TEER', action: 'Consider Transcatheter Edge-to-Edge Repair (TriClip) for high surgical risk.', category: 'intervention' }
    ],
    management: {
      primary: [
        'Diuretics for volume management.',
        'Manage underlying Heart Failure or Pulmonary Hypertension.'
      ],
      secondary: [
        'Surgical Tricuspid Annuloplasty.',
        'Transcatheter Tricuspid Valve Repair (TTVR).'
      ]
    },
    pearls: [
      'Carvallo\'s sign: Murmur intensity increases with inspiration.',
      'Secondary (functional) TR is most common, driven by PH or AFib.'
    ],
    redFlags: [
      'Liver failure / Cardiac cirrhosis',
      'Severe RV dysfunction',
      'Refractory Ascites'
    ],
    differentialDiagnosis: [
      'Mitral Regurgitation',
      'VSD'
    ],
    source: 'ESC Heart Failure / VHD 2024',
    lastUpdated: '2024'
  },
  {
    id: 'wpw-syndrome',
    name: 'Wolff-Parkinson-White (WPW)',
    category: 'Arrhythmia',
    summary: 'Pre-excitation syndrome caused by an accessory AV pathway, predisposing to re-entrant tachycardias and very rapid conduction during atrial fibrillation.',
    pathophysiology: 'An accessory AV pathway (bundle of Kent) bypasses the AV node, allowing pre-excitation (delta wave) and a substrate for re-entrant tachycardia; rapid antegrade conduction during AF can cause ventricular fibrillation.',
    pathogenesis: [
      { stage: 'Substrate', text: 'A congenital accessory AV pathway (bundle of Kent).' },
      { stage: 'Pre-excitation', text: 'Antegrade conduction bypasses the AV node, producing a short PR and delta wave.' },
      { stage: 'Re-entry', text: 'A circuit using the pathway and AV node causes orthodromic or antidromic AVRT.' },
      { stage: 'AF risk', text: 'Rapid antegrade conduction during atrial fibrillation can degenerate to VF.' },
      { stage: 'Stratification', text: 'Risk depends on the pathway refractory period and symptoms.' }
    ],
    signs: [
      'Tachycardia with a sudden onset',
      'Delta wave on the resting ECG',
      'Syncope or cardiac arrest in high-risk pathways',
      'Usually a normal examination between episodes'
    ],
    etiology: [
      'Congenital accessory AV pathway (bundle of Kent)',
      'Usually sporadic; rare familial forms'
    ],
    symptoms: [
      'Sudden palpitations',
      'Dizziness / Syncope',
      'Chest pain'
    ],
    diagnosticCriteria: [
      'Short PR interval (<120ms).',
      'Delta wave (slurred upstroke of QRS).',
      'Broad QRS (>120ms).',
      'Secondary ST-T wave changes.'
    ],
    diagnosticAlgorithm: [
      'Assess PR Interval (<120ms)',
      'Confirm Delta Wave',
      'Assess for Pre-excited AFib',
      'High-risk occupation screen'
    ],
    labDeviations: [
      { label: 'K+', value: 'Check for abnormalities', isCritical: false },
      { label: 'TSH', value: 'Rule out Hyperthyroidism', isCritical: false }
    ],
    ekgFindings: [
      'PR interval < 120ms.',
      'Delta wave (pre-excitation).',
      'Widened QRS (>110ms).'
    ],
    imaging: {
      echo: [
        'Exclude Ebstein Anomaly (high association with right-sided pathways).',
        'Exclude HCM (pseudo-delta waves may mimic WPW).',
        'Rule out other structural congenital defects.'
      ]
    },
    treatmentAlgorithm: [
      { id: 'wpw-1', label: 'ECG Screening', action: 'Identify Delta waves and Pre-excitation in asymptomatic patients.', category: 'initial' },
      { id: 'wpw-2', label: 'Unstable SVT', action: 'Immediate Synchronized Cardioversion for unstable PSVT.', category: 'intervention' },
      { id: 'wpw-3', label: 'Stable Tachycardia', action: 'Vagal maneuvers or Procainamide/Ibutilide.', category: 'intervention', notes: 'AVOID AV-nodal blockers (Beta-blockers/CCB/Digoxin) in pre-excited AFib!' },
      { id: 'wpw-4', label: 'Definitive', action: 'Catheter Ablation of the accessory pathway (Class I for symptomatic).', category: 'intervention' }
    ],
    management: {
      primary: [
        'Catheter Ablation (Permanent cure).',
        'Antiarrhythmics (Procainamide/Flecainide) if surgery declined.'
      ],
      secondary: [
        'Avoidance of AV-nodal blockers (ABCD: Adenosine, B-blockers, CCBs, Digoxin) in pre-excited AFib.'
      ]
    },
    pearls: [
      'Pre-excited AFib is a medical emergency; can degenerate to VF.',
      'Accessory pathway (Bundle of Kent) allows bypass of AV node.'
    ],
    redFlags: [
      'Syncope',
      'Short R-R interval (<250ms) in AFib',
      'High-risk professions (Pilot/Driver)'
    ],
    differentialDiagnosis: [
      'Ventricular Tachycardia',
      'LBBB/RBBB',
      'Left Ventricular Hypertrophy'
    ],
    source: 'ESC SVT Guidelines',
    lastUpdated: '2024'
  },
  {
    id: 'long-qt-syndrome',
    name: 'Long QT Syndrome (LQTS)',
    category: 'Arrhythmia',
    summary: 'Inherited or acquired prolongation of ventricular repolarisation that increases the risk of torsades de pointes and sudden death.',
    pathophysiology: 'Prolonged ventricular repolarisation (QTc) creates early afterdepolarisations that can trigger polymorphic VT (torsades de pointes).',
    pathogenesis: [
      { stage: 'Substrate', text: 'Ion-channel mutation (congenital) or drug/electrolyte effect (acquired).' },
      { stage: 'Repolarisation', text: 'Prolonged action potential duration and QT interval.' },
      { stage: 'Afterdepolarisation', text: 'Early afterdepolarisations during the vulnerable repolarisation phase.' },
      { stage: 'Arrhythmia', text: 'Torsades de pointes (polymorphic VT).' },
      { stage: 'Consequence', text: 'Syncope or degeneration to ventricular fibrillation and sudden death.' }
    ],
    signs: [
      'Syncope, often during exertion or emotion',
      'Seizures (misdiagnosed)',
      'Prolonged QTc on the ECG',
      'Cardiac arrest in untreated cases'
    ],
    symptoms: [
      'Syncope (often during exercise/emotion)',
      'Seizures (misdiagnosed)',
      'Cardiac arrest'
    ],
    diagnosticCriteria: [
      'Schwartz Score ≥ 3.5.',
      'Corrected QT (QTc) > 480ms (repeated) or >500ms.',
      'Presence of pathogenic mutation (KCNQ1, KCNH2, SCN5A).'
    ],
    diagnosticAlgorithm: [
      'Measure QTc (Bazett/Fridericia)',
      'Calculate Schwartz Score',
      'Obtain Family Hx (SCD)',
      'Genetic Testing (High yield)'
    ],
    labDeviations: [
      { label: 'Genetic', value: 'KCNQ1/KCNH2 mutation', isCritical: false },
      { label: 'K+', value: 'Hypokalemia (Triggers TdP)', isCritical: true },
      { label: 'Mg2+', value: 'Check if TdP occurs', isCritical: true }
    ],
    ekgFindings: [
      'QTc ≥ 470ms (males) or ≥ 480ms (females).',
      'T-wave abnormalities (notched/bifid).',
      'Torsades de Pointes (TdP) during monitoring.'
    ],
    imaging: {
      echo: [
        'Usually structurally normal heart.',
        'Rule out other causes of SCD (HCM/DCM).',
        'T-wave alternans (sometimes visible on echo/Doplper).'
      ]
    },
    treatmentAlgorithm: [
      { id: 'lqt-1', label: 'Risk Score', action: 'Calculate Schwartz Score and obtain family history of SCD.', category: 'initial' },
      { id: 'lqt-2', label: 'Beta-Blockade', action: 'Non-selective Beta-blocker (Nadolol or Propranolol) is first-line.', category: 'long-term' },
      { id: 'lqt-3', label: 'Trigger Avoidance', action: 'Avoid QT-prolonging drugs (CredibleMeds.org) and correct electrolytes.', category: 'long-term' },
      { id: 'lqt-4', label: 'Protection', action: 'ICD Implantation for symptomatic or very long QT (>500ms) despite therapy.', category: 'intervention' }
    ],
    management: {
      primary: [
        'Non-selective Beta-blockers (Nadolol/Propranolol).',
        'Avoidance of QT-prolonging medications.'
      ],
      secondary: [
        'ICD for high-risk patients.',
        'Left Cervicothoracic Sympathetic Denervation (LCSD).'
      ]
    },
    pearls: [
      'LQT1: Triggered by exercise (swimming).',
      'LQT2: Triggered by auditory stimuli (alarm clock).',
      'LQT3: Triggered during sleep/rest.'
    ],
    redFlags: [
      'QTc > 500 ms',
      'Syncope despite Beta-blockers',
      'Documented Torsades de Pointes'
    ],
    differentialDiagnosis: [
      'Drug-induced Long QT',
      'Hypokalemia / Hypomagnesemia',
      'Hypocalcemia'
    ],
    source: 'ESC Sudden Death Guidelines 2024',
    lastUpdated: '2024'
  },
  {
    id: 'aaa',
    name: 'Abdominal Aortic Aneurysm (AAA)',
    category: 'Vascular',
    summary: 'Irreversible dilatation of the abdominal aorta (>=30 mm), usually infrarenal, at risk of rupture.',
    pathophysiology: 'Degradation of the aortic media with loss of elastin and collagen weakens the wall; wall stress rises with diameter (Laplace) until rupture.',
    pathogenesis: [
      { stage: 'Trigger', text: 'Smoking, age, male sex and atherosclerosis.' },
      { stage: 'Wall', text: 'Degradation of elastin and collagen with chronic inflammation.' },
      { stage: 'Dilatation', text: 'Progressive expansion; Laplace law increases wall stress.' },
      { stage: 'Thrombus', text: 'Mural thrombus forms and the wall weakens further.' },
      { stage: 'Consequence', text: 'Rupture (often retroperitoneal) with high mortality.' }
    ],
    signs: [
      'Pulsatile, expansile abdominal mass',
      'Abdominal or back pain, or asymptomatic',
      'Abdominal bruit',
      'Hypotension with contained rupture'
    ],
    symptoms: [
      'Often asymptomatic (incidental finding)',
      'Pulsatile abdominal mass',
      'Vague back or abdominal pain'
    ],
    diagnosticCriteria: [
      'Aortic diameter ≥ 3.0 cm.',
      'Confirmed by Ultrasound or CT.'
    ],
    diagnosticAlgorithm: [
      'Screen (Men 65-75 ever smokers)',
      'Measure infrarenal diameter',
      'Assess for Pulsatile Mass',
      'Follow growth rate (q6-12m)'
    ],
    labDeviations: [
      { label: 'Cotinine', value: 'Elevated (Key for screening)', isCritical: false },
      { label: 'Cr', value: 'Baseline for repair assessment', isCritical: false }
    ],
    imaging: {
      echo: [
        'Abdominal Ultrasound (Gold Standard for screen/follow-up).',
        'Assess maximum infrarenal diameter (outer-to-outer).'
      ],
      ct_mri: [
        'CT Angiography (Best for surgical planning).',
        'Identify involvement of renal and iliac arteries.'
      ]
    },
    treatmentAlgorithm: [
      { id: 'aaa-1', label: 'Size Screening', action: 'Aortic diameter <4.0cm: Follow q12m. 4.0-4.9cm: Follow q6m.', category: 'initial' },
      { id: 'aaa-2', label: 'Risk Mgmt', action: 'Aggressive BP control and high-intensity statin.', category: 'long-term' },
      { id: 'aaa-3', label: 'Intervention', action: 'Surgical Repair (EVAR or Open) if diameter ≥5.5cm (Male) or ≥5.0cm (Female).', category: 'intervention' },
      { id: 'aaa-4', label: 'Growth Check', action: 'Proceed to repair if expansion >0.5cm in 6 months.', category: 'escalation' }
    ],
    management: {
      primary: [
        'Smoking Cessation (single most important factor).',
        'Blood pressure and lipid management.',
        'Statin therapy.'
      ],
      secondary: [
        'Endovascular Aortic Repair (EVAR).',
        'Open Surgical Repair.'
      ]
    },
    pearls: [
      'Screening recommended for men 65-75 who have ever smoked.',
      'Expansion rate > 0.5 cm in 6 months is an indication for surgery.'
    ],
    redFlags: [
      'Diameter > 5.5 cm',
      'Rapid Expansion',
      'Sudden severe back pain (Impending rupture)'
    ],
    differentialDiagnosis: [
      'Renal Colic',
      'Pancreatitis',
      'Musculoskeletal pain'
    ],
    source: 'ESC Aortic Guidelines 2024',
    lastUpdated: '2024'
  },
  {
    id: 'peripheral-artery-disease',
    name: 'Peripheral Artery Disease (PAD)',
    category: 'Vascular',
    summary: 'Atherosclerotic narrowing of the lower-limb arteries causing claudication and limb ischaemia.',
    pathophysiology: 'Atherosclerotic plaques reduce arterial perfusion to the lower limbs; a demand-supply mismatch during exercise causes claudication, and severe disease threatens limb viability.',
    pathogenesis: [
      { stage: 'Trigger', text: 'Atherosclerosis risk factors (smoking, diabetes, dyslipidaemia).' },
      { stage: 'Plaque', text: 'Arterial narrowing or occlusion in the lower limbs.' },
      { stage: 'Mismatch', text: 'Exercise increases demand beyond fixed supply, causing claudication.' },
      { stage: 'Remodelling', text: 'Collateral development with chronic ischaemia.' },
      { stage: 'Consequence', text: 'Rest pain, ulcers and critical limb ischaemia.' }
    ],
    signs: [
      'Reduced or absent peripheral pulses',
      'Abnormal ankle-brachial index',
      'Cold, hairless, atrophic skin',
      'Ischaemic ulcers or gangrene',
      'Femoral bruit'
    ],
    symptoms: [
      'Intermittent Claudication (pain on walking, relieved by rest)',
      'Non-healing leg ulcers',
      'Cold / Cyanotic feet',
      'Critical Limb Ischemia (pain at rest)'
    ],
    diagnosticCriteria: [
      'Ankle-Brachial Index (ABI) ≤ 0.9.',
      'Lower ABI correlates with increased cardiovascular mortality.'
    ],
    imaging: {
      echo: [
        'Arterial Duplex Ultrasound: Directly visualize stenotic/occluded segments.',
        'Peak Systolic Velocity (PSV) ratio > 2.0 suggests ≥50% stenosis.',
        'Assessment of monophasic vs. triphasic flow waveforms.'
      ],
      ct_mri: [
        'CT Angiography (CTA) Runoff: High-resolution mapping from distal aorta to feet.',
        'MR Angiography (MRA): Excellent visualization of peripheral bed without radiation.'
      ]
    },
    diagnosticAlgorithm: [
      'Assess for Claudication',
      'Measure ABI (Resting)',
      'Consider Exercise ABI (if post-exertion)',
      'Toe-Brachial Index (if calcified)'
    ],
    labDeviations: [
      { label: 'ABI', value: '≤ 0.9 (Pathological)', isCritical: false },
      { label: 'LDL', value: 'Target < 55 mg/dL', isCritical: false },
      { label: 'HbA1c', value: '↑ (Major risk factor)', isCritical: false }
    ],
    treatmentAlgorithm: [
      { id: 'pad-1', label: 'ABI Calculation', action: 'Standard screening for all patients with risk factors.', category: 'initial' },
      { id: 'pad-2', label: 'Anti-thrombotic', action: 'Low-dose Aspirin + High-intensity Statin.', category: 'long-term' },
      { id: 'pad-3', label: 'Exercise', action: 'Supervised Walking Program (Class I) for claudication.', category: 'intervention' },
      { id: 'pad-4', label: 'Revascularization', action: 'Endovascular (Stent) or Bypass for CLI or lifestyle-limiting claudication.', category: 'intervention' }
    ],
    management: {
      primary: [
        'Antiplatelet therapy (Aspirin or Clopidogrel).',
        'Statins (High-intensity).',
        'Supervised exercise therapy.'
      ],
      secondary: [
        'Cilostazol for symptomatic claudication (avoid in HF!).',
        'Endovascular stenting or surgical bypass.'
      ]
    },
    pearls: [
      'PAD is a cardiovascular risk equivalent; these patients die of MI/Stroke.',
      'ABI > 1.4 suggests non-compressible calcified vessels (calciphylaxis/diabetes).'
    ],
    redFlags: [
      'Rest pain',
      'Gangrene',
      'Non-healing ulcers'
    ],
    differentialDiagnosis: [
      'Spinal Stenosis (Pseudoclaudication)',
      'Chronic Venous Insufficiency',
      'Baker\'s Cyst'
    ],
    source: 'AHA/ACC PAD Guidelines 2024',
    lastUpdated: '2024'
  },
  {
    id: 'dilated-cardiomyopathy',
    name: 'Dilated Cardiomyopathy (DCM)',
    category: 'Heart Failure',
    summary: 'Left ventricular systolic dysfunction with dilatation and impaired contractility, not explained by abnormal loading conditions or coronary disease alone.',
    pathophysiology: 'Myocyte loss from genetic, inflammatory or toxic injury increases wall stress; chamber dilatation and eccentric hypertrophy (Laplace) produce progressive systolic dysfunction and neurohormonal activation.',
    pathogenesis: [
      { stage: 'Trigger', text: 'Genetic, post-inflammatory or toxic insult.' },
      { stage: 'Mechanism', text: 'Myocyte loss and increased wall stress.' },
      { stage: 'Remodelling', text: 'Chamber dilatation with eccentric hypertrophy (Laplace).' },
      { stage: 'Dysfunction', text: 'Progressive systolic impairment and falling ejection fraction.' },
      { stage: 'Neurohormonal', text: 'RAAS and sympathetic activation drive the heart-failure syndrome.' }
    ],
    signs: [
      'Displaced apical impulse',
      'Third heart sound (S3) gallop',
      'Signs of congestion (raised JVP, oedema, crackles)',
      'Functional mitral regurgitation murmur'
    ],
    etiology: [
      'Idiopathic / genetic (titin, laminopathy)',
      'Post-myocarditis (viral / autoimmune)',
      'Toxic (alcohol, anthracyclines)',
      'Peripartum, thyroid disease, tachyarrhythmia'
    ],
    symptoms: [
      'Progressive dyspnea on exertion',
      'Orthopnea / PND',
      'Peripheral edema',
      'Fatigue and reduced exercise capacity'
    ],
    diagnosticCriteria: [
      'Left ventricular dilation (LVEDD > 117% of predicted).',
      'Reduced systolic function (LVEF < 40%).',
      'Absence of abnormal loading conditions (HTN/Valve disease) or significant CAD.'
    ],
    diagnosticAlgorithm: [
      'Confirm LV Dilation (Echo)',
      'Rule out CAD (Angio/CCTA)',
      'Assess for Viral/Toxic triggers',
      'Genetic Testing (TTN mutation)'
    ],
    labDeviations: [
      { label: 'NT-proBNP', value: 'Elevated (Marker of stress)', isCritical: false },
      { label: 'Troponin', value: 'Chronic low-level elevation', isCritical: false },
      { label: 'Genetic', value: 'TTN (Titin) most common', isCritical: false }
    ],
    ekgFindings: [
      'Normal EKG is rare.',
      'Left Bundle Branch Block (LBBB).',
      'Non-specific ST-T wave changes.',
      'Atrial Fibrillation.'
    ],
    imaging: {
      echo: [
        'LVEDD > 58mm (Male) or > 52mm (Female).',
        'LVEF < 40% with global hypokinesis.',
        'Functional Mitral/Tricuspid Regurgitation.',
        'Increased EPSS (E-point septal separation) > 7mm.'
      ],
      ct_mri: [
        'CMR (Gold Standard): Mid-wall Late Gadolinium Enhancement (LGE).',
        'Increased Extracellular Volume (ECV).',
        'Precise quantification of LV/RV volumes.'
      ]
    },
    treatmentAlgorithm: [
      { id: 'dcm-1', label: 'Four Pillars', action: 'Initiate ARNI, Beta-blocker, MRA, and SGLT2i.', category: 'initial' },
      { id: 'dcm-2', label: 'Etiology Search', action: 'Rule out ischemia, alcohol, tachycardia-induced, or peripartum causes.', category: 'initial' },
      { id: 'dcm-3', label: 'SCD Prevention', action: 'Re-assess EF after 3m of OMT; consider ICD if EF <= 35%.', category: 'escalation' },
      { id: 'dcm-4', label: 'Genetic Screen', action: 'Screen first-degree relatives if familial DCM suspected.', category: 'long-term' }
    ],
    management: {
      primary: [
        'Guideline-Directed Medical Therapy (GDMT): ARNI, BB, MRA, SGLT2i.',
        'Diuretics for decongestion.'
      ],
      secondary: [
        'ICD for SCD prevention.',
        'CRT-D if QRS >= 130ms and LBBB.',
        'LVAD or Transplant for advanced stages.'
      ]
    },
    pearls: [
      'Titin (TTN) mutations are found in ~25% of familial DCM cases.',
      'Alcohol-induced DCM may be reversible with complete abstinence.'
    ],
    redFlags: [
      'Syncope (Arrhythmia risk)',
      'Advanced HF (NYHA IV)',
      'Complex Ventricular Arrhythmias'
    ],
    differentialDiagnosis: [
      'Ischemic Cardiomyopathy',
      'Hypertensive Heart Disease',
      'Valvular Heart Disease',
      'Myocarditis'
    ],
    source: 'ESC Heart Failure Guidelines 2023',
    lastUpdated: '2024'
  },
  {
    id: 'arvc',
    name: 'Arrhythmogenic RV Cardiomyopathy (ARVC)',
    category: 'Structural',
    summary: 'Genetic cardiomyopathy characterised by fibrofatty replacement of the right ventricular myocardium and exercise-related ventricular arrhythmia.',
    pathophysiology: 'Desmosomal dysfunction (often PKP2 mutations) causes myocyte detachment and fibrofatty replacement, producing a scar-related arrhythmia substrate.',
    pathogenesis: [
      { stage: 'Genetic defect', text: 'A desmosomal gene mutation (e.g. PKP2).' },
      { stage: 'Myocyte injury', text: 'Mechanical stress causes myocyte detachment and death.' },
      { stage: 'Replacement', text: 'Fibrofatty replacement of the right ventricular myocardium.' },
      { stage: 'Substrate', text: 'Scar-related re-entry, typically exercise-triggered.' },
      { stage: 'Consequence', text: 'VT/VF and sudden cardiac death, especially in athletes.' }
    ],
    signs: [
      'Often a normal cardiac examination',
      'Exercise-induced palpitations or arrhythmia',
      'Syncope',
      'Right ventricular abnormalities on echo/CMR'
    ],
    symptoms: [
      'Palpitations',
      'Syncope (especially during exercise)',
      'Atypical chest pain',
      'Right-sided heart failure (Late)'
    ],
    diagnosticCriteria: [
      'Global or regional RV dysfunction and structural alterations (Echo/MRI).',
      'Fibro-fatty replacement of RV myocardium (Biopsy/MRI).',
      'Repolarization/Depolarization EKG abnormalities.',
      'Arrhythmias (LBBB-morphology VT).'
    ],
    diagnosticAlgorithm: [
      'Assess RV Morphology (MRI)',
      'Check V1-V3 EKG TWI',
      'Monitor for LBBB-VT',
      'Genetic Screen (Desmosomal)'
    ],
    labDeviations: [
      { label: 'Genetic', value: 'PKP2 (Desmosomal) common', isCritical: false }
    ],
    ekgFindings: [
      'T-wave inversion in V1-V3 (in absence of RBBB).',
      'Epsilon wave (small deflection at end of QRS) in V1-V2.',
      'Terminal activation delay (TAD) > 55ms in V1-V3.',
      'Frequent PVCs with LBBB morphology.'
    ],
    imaging: {
      echo: [
        'Regional RV wall motion abnormalities (akinesis, dyskinesis, or aneurysms).',
        'RV dilation (PLAX RVOT > 32mm).',
        'Reduced RV fractional area change (FAC < 33%).'
      ],
      ct_mri: [
        'CMR: Regional RV akinesis/dyskinesis.',
        'RVEDV/BSA > 110 ml/m² (Male) or > 100 ml/m² (Female).',
        'RVEF <= 40%.',
        'Late gadolinium enhancement or fatty infiltration.'
      ]
    },
    treatmentAlgorithm: [
      { id: 'arv-1', label: 'Activity Restriction', action: 'Strict avoidance of high-intensity competitive sports.', category: 'initial', notes: 'Exercise accelerates the disease phenotype.' },
      { id: 'arv-2', label: 'Arrhythmia Mgmt', action: 'Beta-blockers (Atenolol/Nadolol) as first-line for PVCs/VT.', category: 'long-term' },
      { id: 'arv-3', label: 'Protection', action: 'ICD implantation for high-risk patients (SCD survivors, sustained VT).', category: 'intervention' },
      { id: 'arv-4', label: 'Family Screening', action: 'Genetic testing and clinical screening for all first-degree relatives.', category: 'long-term' }
    ],
    management: {
      primary: [
        'Beta-blockers to reduce arrhythmia burden.',
        'Exercise restriction (Non-competitive only).',
        'ICD for secondary prevention.'
      ],
      secondary: [
        'Antiarrhythmics (Sotalol/Amiodarone) if BB fails.',
        'Catheter ablation for refractory VT.',
        'Heart transplant for end-stage Biventricular HF.'
      ]
    },
    pearls: [
      '"Triangle of Dysplasia": RV inflow, RV outflow, and RV apex.',
      'Classic presentation is a young athlete with syncope during sports.'
    ],
    redFlags: [
      'Syncope during exertion',
      'Documented sustained VT',
      'Severe RV dilation'
    ],
    differentialDiagnosis: [
      'RV Outflow Tract VT (Structurally normal heart)',
      'Pulmonary Hypertension',
      'Ebstein Anomaly',
      'Sarcoidosis'
    ],
    source: 'Revised Task Force Criteria / HRS 2024',
    lastUpdated: '2024'
  },
  {
    id: 'asd',
    name: 'Atrial Septal Defect (ASD)',
    category: 'Structural',
    summary: 'Interatrial communication producing a left-to-right shunt, right heart volume overload and, late, pulmonary hypertension.',
    pathophysiology: 'Higher left than right atrial pressure drives a left-to-right shunt, causing right atrial and right ventricular volume overload and increased pulmonary blood flow.',
    pathogenesis: [
      { stage: 'Substrate', text: 'A congenital interatrial communication.' },
      { stage: 'Shunt', text: 'Higher LA than RA pressure drives a left-to-right shunt.' },
      { stage: 'Load', text: 'Right atrial and right ventricular volume overload.' },
      { stage: 'Remodelling', text: 'RV dilatation and increased pulmonary blood flow.' },
      { stage: 'Consequence', text: 'Late pulmonary hypertension, atrial fibrillation and, if reversed, Eisenmenger physiology.' }
    ],
    signs: [
      'Fixed, widely split second heart sound',
      'Systolic murmur at the upper left sternal border (increased flow)',
      'Right ventricular heave',
      'Signs of pulmonary hypertension late'
    ],
    etiology: [
      'Congenital failure of septal fusion (secundum, primum, sinus venosus)',
      'Associations: Holt-Oram, Down syndrome, anomalous pulmonary venous drainage'
    ],
    symptoms: [
      'Exertional dyspnea (mild)',
      'Palpitations (AFib/A-Flutter)',
      'Recurrent respiratory infections',
      'Paradoxical Embolism (Stroke)'
    ],
    diagnosticCriteria: [
      'Fixed split S2 on auscultation.',
      'Echo: Left-to-right shunt across the interatrial septum.',
      'Right heart enlargement (RA/RV dilation).'
    ],
    diagnosticAlgorithm: [
      'Auscultate S2 splitting',
      'Bubble Study (R-to-L check)',
      'Measure RV Volume (Echo)',
      'Identify Type (Secundum/Primum)'
    ],
    labDeviations: [
      { label: 'BNP', value: '↑ if RV failure occurs', isCritical: false }
    ],
    ekgFindings: [
      'Incomplete Right Bundle Branch Block (RBBB) [rsR\' pattern in V1].',
      'Right Axis Deviation (Secundum) or Left Axis Deviation (Primum).',
      'Right Atrial Enlargement (p-pulmonale).',
      'Atrial Fibrillation (especially in older adults).'
    ],
    imaging: {
      echo: [
        'Visualization of septal defect (Secundum is middle, Primum is lower).',
        'Right Ventricular Volume Overload (RVVO) with septal flattening.',
        'Bubble study with agitated saline showing shunt.',
        'Qp/Qs > 1.5 suggests significant shunt.'
      ],
      ct_mri: [
        'CMR: Accurate Qp/Qs calculation (Flow quantification).',
        'Precise measurement of defect size and rims for device closure.',
        'Assessment of anomalous pulmonary venous drainage.'
      ],
      cxr: [
        'Enlarged Right heart silhouette.',
        'Prominent pulmonary artery segment.',
        'Increased pulmonary vascular markings (Shunt).'
      ]
    },
    treatmentAlgorithm: [
      { id: 'asd-1', label: 'Shunt Assessment', action: 'Determine Qp/Qs and RV volume status.', category: 'initial' },
      { id: 'asd-2', label: 'Device Evaluation', action: 'Assess rims for percutaneous closure (Only for Secundum).', category: 'intervention' },
      { id: 'asd-3', label: 'Closure', action: 'Percutaneous (Amplatzer) or Surgical closure if RV enlargement present.', category: 'intervention' },
      { id: 'asd-4', label: 'Monitoring', action: 'Monitor for AFib and Pulmonary HTN post-closure.', category: 'long-term' }
    ],
    management: {
      primary: [
        'Percutaneous Device Closure (for Secundum ASD).',
        'Surgical Repair (for Primum, Sinus Venosus, or large Secundum).'
      ],
      secondary: [
        'Management of Pulmonary HTN (if Eisenmenger, DON\'T close).',
        'AFib management (Anticoagulation).'
      ]
    },
    pearls: [
      'Secundum ASD (75% cases) involves the fossa ovalis.',
      'Primum ASD is often associated with Cleft Mitral Valve.',
      'Small ASDs may remain asymptomatic until the 4th/5th decade.'
    ],
    redFlags: [
      'Cyanosis (Eisenmenger syndrome)',
      'Severe Pulmonary Hypertension',
      'TIA / Stroke (Paradoxical)'
    ],
    differentialDiagnosis: [
      'Patent Foramen Ovale (PFO)',
      'VSD',
      'Partial Anomalous Pulmonary Venous Return (PAPVR)'
    ],
    source: 'ESC Grown-Up Congenital Heart (GUCH) 2024',
    lastUpdated: '2024'
  },
  {
    id: 'ventricular-septal-defect',
    name: 'Ventricular Septal Defect (VSD)',
    category: 'Structural',
    summary: 'A left-to-right shunt at the ventricular level — the most common congenital heart defect.',
    pathophysiology: 'Shunt magnitude depends on defect size and the ratio of pulmonary to systemic vascular resistance. Large, non-restrictive defects cause pulmonary overcirculation, left atrial and left ventricular volume overload, and progressive pulmonary vascular disease that may culminate in Eisenmenger physiology.',
    pathogenesis: [
      { stage: 'Substrate', text: 'A congenital ventricular septal defect.' },
      { stage: 'Shunt', text: 'A left-to-right shunt determined by defect size and pulmonary vascular resistance.' },
      { stage: 'Load', text: 'Pulmonary overcirculation with LA and LV volume overload.' },
      { stage: 'Remodelling', text: 'Progressive pulmonary vascular disease in large defects.' },
      { stage: 'Consequence', text: 'Heart failure in infancy; Eisenmenger physiology if untreated.' }
    ],
    signs: [
      'Harsh holosystolic murmur at the left lower sternal border',
      'Louder murmur with a small defect (maladie de Roger)',
      'Signs of heart failure in large defects',
      'Failure to thrive'
    ],
    etiology: [
      'Congenital maldevelopment of the interventricular septum',
      'Chromosomal anomalies (trisomy 21, 18, 13)',
      'Part of complex lesions (Tetralogy of Fallot, double outlet RV)'
    ],
    classifications: [
      { name: 'Location', interpretation: 'Perimembranous (~70-80%), muscular, inlet (AV canal-type), outlet/subarterial' },
      { name: 'Size', interpretation: 'Small/restrictive versus large/non-restrictive' },
      { name: 'Shunt', interpretation: 'Pulmonary-to-systemic flow ratio (Qp:Qs); > 1.5 is significant' }
    ],
    symptoms: [
      'Small defect: often asymptomatic with a loud murmur',
      'Large defect: failure to thrive, tachypnea, poor feeding',
      'Recurrent respiratory infections',
      'Signs of heart failure in infancy'
    ],
    diagnosticCriteria: [
      'Harsh holosystolic murmur at the left lower sternal border (loudness is inversely related to defect size).',
      'Echo with Doppler confirming the defect and shunt direction.',
      'Qp:Qs > 1.5 indicates a haemodynamically significant shunt.'
    ],
    diagnosticAlgorithm: [
      'Auscultate for holosystolic murmur',
      'Confirm defect and shunt on echo/Doppler',
      'Calculate Qp:Qs and estimate pulmonary pressures',
      'Assess pulmonary vascular resistance before closure'
    ],
    labDeviations: [
      { label: 'BNP', value: '↑ if heart failure develops', isCritical: false }
    ],
    ekgFindings: [
      'Small defect: normal ECG.',
      'Large defect: left ventricular hypertrophy and left atrial enlargement.',
      'With pulmonary hypertension: right ventricular hypertrophy and right atrial enlargement.'
    ],
    imaging: {
      echo: [
        'Defect location and size, with Doppler shunt direction.',
        'Left atrial and left ventricular dilation.',
        'Estimation of right ventricular / pulmonary pressures.'
      ],
      cxr: [
        'Cardiomegaly with a large shunt.',
        'Increased pulmonary vascular markings.',
        'Left atrial enlargement.'
      ]
    },
    treatmentAlgorithm: [
      { id: 'vsd-1', label: 'Assess Shunt', action: 'Measure Qp:Qs and pulmonary pressures.', category: 'initial' },
      { id: 'vsd-2', label: 'Closure Decision', action: 'Refer for closure if symptomatic, Qp:Qs > 1.5, or pulmonary hypertension with PVR < 3 WU.', category: 'intervention' },
      { id: 'vsd-3', label: 'Follow-up', action: 'Monitor small defects for spontaneous closure and endocarditis.', category: 'long-term' }
    ],
    management: {
      primary: [
        'Small muscular defects often close spontaneously.',
        'Surgical patch closure for large or symptomatic defects.',
        'Transcatheter device closure for selected muscular defects.'
      ],
      secondary: [
        'Manage pulmonary hypertension; closure is contraindicated in Eisenmenger physiology.',
        'Treat heart failure and prevent infective endocarditis.'
      ]
    },
    pearls: [
      'VSD is the most common congenital heart defect.',
      'A small restrictive VSD produces the loudest murmur ("maladie de Roger").',
      'A perimembranous VSD can cause aortic cusp prolapse and aortic regurgitation.'
    ],
    redFlags: [
      'Eisenmenger physiology',
      'Heart failure in infancy',
      'Aortic regurgitation from cusp prolapse'
    ],
    differentialDiagnosis: [
      'Atrial septal defect',
      'Patent ductus arteriosus',
      'Tricuspid regurgitation',
      'Subaortic stenosis'
    ],
    source: 'ESC Adult Congenital Heart Disease Guidelines (2020); AHA/ACC ACHD (2018)',
    lastUpdated: '2026'
  },
  {
    id: 'pulmonary-stenosis',
    name: 'Pulmonary Valve Stenosis (PS)',
    category: 'Structural',
    summary: 'Congenital right ventricular outflow obstruction, most often at the valve.',
    pathophysiology: 'Obstruction to right ventricular outflow causes right ventricular pressure overload and hypertrophy. Severe stenosis impairs cardiac output, reduces pulmonary blood flow and can lead to right ventricular failure.',
    pathogenesis: [
      { stage: 'Substrate', text: 'Congenital valvular dysplasia.' },
      { stage: 'Obstruction', text: 'Right ventricular outflow obstruction.' },
      { stage: 'Pressure', text: 'RV pressure overload and hypertrophy.' },
      { stage: 'Flow', text: 'Reduced pulmonary blood flow in severe cases.' },
      { stage: 'Consequence', text: 'Right ventricular failure; balloon valvuloplasty for significant stenosis.' }
    ],
    signs: [
      'Ejection systolic murmur at the left upper sternal border',
      'Ejection click',
      'Widely split second heart sound',
      'Right ventricular heave in severe cases'
    ],
    etiology: [
      'Congenital valvular dysplasia (most common)',
      'Noonan syndrome (dysplastic valve)',
      'Rarely acquired (carcinoid, rheumatic)'
    ],
    classifications: [
      { name: 'Severity (peak Doppler velocity)', interpretation: 'Mild < 3 m/s, moderate 3-4 m/s, severe > 4 m/s (AHA/ACC 2018 ACHD)' }
    ],
    symptoms: [
      'Often asymptomatic',
      'Exertional dyspnea and fatigue',
      'Syncope or chest pain (severe)'
    ],
    diagnosticCriteria: [
      'Ejection systolic murmur at the left upper sternal border, often with an ejection click.',
      'Widely split second heart sound.',
      'Echo/Doppler peak gradient quantifies severity.'
    ],
    diagnosticAlgorithm: [
      'Auscultate for ejection murmur and click',
      'Quantify the peak gradient on Doppler',
      'Assess right ventricular hypertrophy',
      'Assess valve morphology (dysplastic vs doming)'
    ],
    labDeviations: [
      { label: 'BNP', value: '↑ if right ventricular failure develops', isCritical: false }
    ],
    ekgFindings: [
      'Right ventricular hypertrophy.',
      'Right axis deviation.',
      'Right atrial enlargement in severe stenosis.'
    ],
    imaging: {
      echo: [
        'Doming valve with a measured peak gradient.',
        'Right ventricular hypertrophy.',
        'Assessment of valve annulus and pulmonary artery.'
      ],
      cxr: [
        'Post-stenotic dilatation of the main pulmonary artery.',
        'Normal or reduced pulmonary vascularity in severe cases.'
      ]
    },
    management: {
      primary: [
        'Balloon pulmonary valvuloplasty is first-line for moderate or severe valvular stenosis.',
        'Surgical valvotomy for dysplastic valves that are unsuitable for ballooning.'
      ],
      secondary: [
        'Treat right ventricular failure.',
        'Repeat intervention for restenosis.'
      ]
    },
    pearls: [
      'Noonan syndrome causes a dysplastic valve that responds poorly to ballooning.',
      'Post-stenotic dilatation of the main pulmonary artery is characteristic.',
      'Mild stenosis is usually followed conservatively.'
    ],
    redFlags: [
      'Severe gradient',
      'Right ventricular dysfunction',
      'Syncope'
    ],
    differentialDiagnosis: [
      'Atrial septal defect',
      'Tetralogy of Fallot',
      'Double-chambered right ventricle',
      'Infundibular stenosis'
    ],
    source: 'ESC Adult Congenital Heart Disease Guidelines (2020); AHA/ACC ACHD (2018)',
    lastUpdated: '2026'
  },
  {
    id: 'patent-ductus-arteriosus',
    name: 'Patent Ductus Arteriosus (PDA)',
    category: 'Structural',
    summary: 'Persistent fetal connection between the descending aorta and the pulmonary artery.',
    pathophysiology: 'A left-to-right shunt from the aorta to the pulmonary artery causes pulmonary overcirculation and left atrial and left ventricular volume overload. Long-standing large shunts raise pulmonary vascular resistance and may reverse the shunt (Eisenmenger physiology).',
    pathogenesis: [
      { stage: 'Substrate', text: 'A persistent fetal ductus arteriosus.' },
      { stage: 'Shunt', text: 'Aorta-to-pulmonary-artery left-to-right shunt.' },
      { stage: 'Load', text: 'Pulmonary overcirculation with LA/LV volume overload.' },
      { stage: 'Remodelling', text: 'Rising pulmonary vascular resistance.' },
      { stage: 'Consequence', text: 'Heart failure in infancy; Eisenmenger reversal if untreated.' }
    ],
    signs: [
      'Continuous machinery murmur at the left infraclavicular area',
      'Bounding pulses with a wide pulse pressure',
      'Signs of heart failure in infants',
      'Differential cyanosis if reversed'
    ],
    etiology: [
      'Failure of ductal closure after birth',
      'Prematurity',
      'Congenital rubella',
      'High altitude'
    ],
    classifications: [
      { name: 'Haemodynamic', interpretation: 'Silent, small, moderate, large or Eisenmenger' }
    ],
    symptoms: [
      'Continuous murmur',
      'Bounding pulses with a wide pulse pressure (large shunt)',
      'Heart failure and failure to thrive in infants',
      'Differential cyanosis when the shunt reverses'
    ],
    diagnosticCriteria: [
      'Continuous "machinery" murmur at the left infraclavicular area.',
      'Bounding peripheral pulses.',
      'Echo with Doppler demonstrating ductal flow.'
    ],
    diagnosticAlgorithm: [
      'Auscultate for continuous murmur',
      'Confirm ductal flow on echo',
      'Assess shunt magnitude and pulmonary pressures',
      'Exclude Eisenmenger physiology before closure'
    ],
    labDeviations: [
      { label: 'BNP', value: '↑ with significant shunt and heart failure', isCritical: false }
    ],
    ekgFindings: [
      'Left ventricular hypertrophy with a large shunt.',
      'Right ventricular hypertrophy if pulmonary hypertension develops.'
    ],
    imaging: {
      echo: [
        'Direct visualisation of the ductus.',
        'Continuous-flow shunt pattern on Doppler.',
        'Left atrial and left ventricular enlargement.'
      ],
      cxr: [
        'Cardiomegaly.',
        'Increased pulmonary vascularity.',
        'Prominent ascending and descending aorta.'
      ]
    },
    management: {
      primary: [
        'Transcatheter device closure for a significant PDA.',
        'Surgical ligation or division when closure is unsuitable percutaneously.',
        'Indomethacin or ibuprofen for preterm neonates.'
      ],
      secondary: [
        'Closure is contraindicated in Eisenmenger physiology.',
        'Manage pulmonary hypertension and prevent infective endocarditis.'
      ]
    },
    pearls: [
      'A continuous murmur is the classic finding.',
      'In Eisenmenger physiology there is differential cyanosis (lower limbs cyanotic, upper limbs normal).',
      'PDA carries a risk of infective endocarditis and, rarely, ductal aneurysm.'
    ],
    redFlags: [
      'Eisenmenger physiology',
      'Heart failure in infancy',
      'Differential cyanosis'
    ],
    differentialDiagnosis: [
      'Ventricular septal defect with aortic regurgitation',
      'Aortopulmonary window',
      'Coronary fistula',
      'Venous hum'
    ],
    source: 'ESC Adult Congenital Heart Disease Guidelines (2020); AHA/ACC ACHD (2018)',
    lastUpdated: '2026'
  },
  {
    id: 'ebstein-anomaly',
    name: 'Ebstein Anomaly',
    category: 'Structural',
    summary: 'Congenital apical displacement of the tricuspid valve into the right ventricle, "atrialising" the RV inflow.',
    pathophysiology: 'Downward displacement of the tricuspid leaflets produces tricuspid regurgitation and a functionally small right ventricle. An associated atrial septal defect or patent foramen ovale allows right-to-left shunting and cyanosis. Right-sided accessory pathways are common.',
    pathogenesis: [
      { stage: 'Substrate', text: 'Apical displacement of the tricuspid valve.' },
      { stage: 'Regurgitation', text: 'Tricuspid regurgitation with an atrialised right ventricle.' },
      { stage: 'Shunt', text: 'ASD/PFO right-to-left shunt causes cyanosis.' },
      { stage: 'Arrhythmia', text: 'Accessory pathways (WPW) are common.' },
      { stage: 'Consequence', text: 'Right heart failure, cyanosis and arrhythmia.' }
    ],
    signs: [
      'Cyanosis',
      'Raised JVP with giant v waves',
      'Right-sided third/fourth heart sounds',
      'Widely split first heart sound',
      'Signs of right heart failure'
    ],
    etiology: [
      'Congenital maldevelopment of the tricuspid valve',
      'Association with maternal lithium exposure',
      'Associated with ASD/PFO and accessory pathways'
    ],
    classifications: [
      { name: 'Severity', interpretation: 'Based on the degree of tricuspid valve displacement; neonatal presentation is the most severe' }
    ],
    symptoms: [
      'Cyanosis',
      'Fatigue and exercise intolerance',
      'Palpitations from supraventricular arrhythmias',
      'Right heart failure'
    ],
    diagnosticCriteria: [
      'Echo showing apical displacement of the tricuspid septal leaflet (indexed displacement > 8 mm/m2).',
      'Tricuspid regurgitation with an atrialised right ventricle.',
      'Associated interatrial communication.'
    ],
    diagnosticAlgorithm: [
      'Echo assessment of tricuspid displacement',
      'Assess tricuspid regurgitation severity',
      'Look for an interatrial shunt',
      'Screen for accessory pathways (WPW)'
    ],
    labDeviations: [
      { label: 'BNP', value: '↑ with right heart failure', isCritical: false }
    ],
    ekgFindings: [
      'Tall, broad P waves (right atrial enlargement).',
      'Right bundle branch block pattern.',
      'Pre-excitation (delta wave) from an accessory pathway in up to a third of patients.'
    ],
    imaging: {
      echo: [
        'Apical displacement of the tricuspid valve.',
        'Atrialised right ventricle and functional RV size.',
        'Tricuspid regurgitation severity and ASD.',
        'Choice of repair (cone procedure) versus replacement.'
      ]
    },
    management: {
      primary: [
        'Surgical repair (cone reconstruction) or valve replacement for severe symptomatic disease.',
        'Catheter ablation of accessory pathways.',
        'Medical management of heart failure and arrhythmias.'
      ],
      secondary: [
        'Avoid measures that raise pulmonary vascular resistance.',
        'Treat cyanosis; close the interatrial communication as part of surgical repair.'
      ]
    },
    pearls: [
      'Strong association with WPW and right-sided accessory pathways.',
      'The "atrialised right ventricle" is the hallmark.',
      'Neonatal presentation indicates the most severe form.'
    ],
    redFlags: [
      'Neonatal cyanosis',
      'Severe tricuspid regurgitation',
      'Supraventricular arrhythmias'
    ],
    differentialDiagnosis: [
      'Tricuspid valve dysplasia',
      'Arrhythmogenic right ventricular cardiomyopathy',
      'Uhl anomaly (parchment right ventricle)',
      'Tetralogy of Fallot'
    ],
    source: 'ESC Adult Congenital Heart Disease Guidelines (2020); AHA/ACC ACHD (2018)',
    lastUpdated: '2026'
  },
  {
    id: 'tetralogy-of-fallot',
    name: 'Tetralogy of Fallot (TOF)',
    category: 'Structural',
    summary: 'The classic cyanotic congenital heart defect, defined by four components.',
    pathophysiology: 'Right ventricular outflow tract obstruction drives a right-to-left shunt through a large VSD, causing cyanosis; the degree of outflow obstruction determines the degree of cyanosis. The four features are RV outflow obstruction, VSD, an overriding aorta and right ventricular hypertrophy.',
    pathogenesis: [
      { stage: 'Trigger', text: 'Conotruncal maldevelopment.' },
      { stage: 'Anatomy', text: 'RV outflow obstruction with a large VSD and an overriding aorta.' },
      { stage: 'Shunt', text: 'Right-to-left shunting proportional to the obstruction causes cyanosis.' },
      { stage: 'Hypertrophy', text: 'Secondary right ventricular hypertrophy.' },
      { stage: 'Dynamics', text: 'Hypercyanotic spells when RVOTO worsens (falling SVR, exercise, crying).' }
    ],
    signs: [
      'Central cyanosis and clubbing',
      'Harsh ejection systolic murmur at the left upper sternal border (RVOTO)',
      'Single second heart sound',
      'Squatting to relieve spells',
      'Right aortic arch on chest radiograph in ~25%'
    ],
    etiology: [
      'Conotruncal maldevelopment',
      '22q11 deletion / DiGeorge syndrome',
      'Trisomy 21'
    ],
    classifications: [
      { name: 'Variant', interpretation: 'With or without pulmonary atresia; "pink" tetralogy; with absent pulmonary valve' }
    ],
    symptoms: [
      'Cyanosis',
      'Hypercyanotic ("tet") spells',
      'Squatting',
      'Clubbing and exertional dyspnea'
    ],
    diagnosticCriteria: [
      'Echo showing RV outflow obstruction, VSD, overriding aorta and RV hypertrophy.',
      '"Boot-shaped" heart on chest radiograph.',
      'Decreased pulmonary vascularity.'
    ],
    diagnosticAlgorithm: [
      'Confirm four components on echo',
      'Assess the degree of outflow obstruction',
      'Assess pulmonary arteries and aortic arch',
      'Plan timing of surgical repair'
    ],
    labDeviations: [
      { label: 'Haemoglobin', value: '↑ (secondary erythrocytosis)', isCritical: false }
    ],
    ekgFindings: [
      'Right ventricular hypertrophy with right axis deviation.',
      'Tall R wave in V1.'
    ],
    imaging: {
      echo: [
        'VSD with an overriding aorta.',
        'Right ventricular outflow tract obstruction.',
        'Branch pulmonary artery anatomy.'
      ],
      cxr: [
        '"Boot-shaped" heart (coeur en sabot).',
        'Right aortic arch in about 25% of cases.',
        'Decreased pulmonary vascularity.'
      ]
    },
    treatmentAlgorithm: [
      { id: 'tof-1', label: 'Confirm Anatomy', action: 'Define the four components and pulmonary artery anatomy.', category: 'initial' },
      { id: 'tof-2', label: 'Repair', action: 'Complete surgical repair in infancy.', category: 'intervention' },
      { id: 'tof-3', label: 'Follow-up', action: 'Monitor for pulmonary regurgitation, RV dilation and arrhythmia; consider pulmonary valve replacement.', category: 'long-term' }
    ],
    management: {
      primary: [
        'Complete surgical repair in infancy (usually within the first year).',
        'Palliative Blalock-Taussig shunt if repair must be deferred.',
        'Hypercyanotic spell: knee-chest position, oxygen, morphine, a beta-blocker and IV fluids.'
      ],
      secondary: [
        'Lifelong follow-up for pulmonary regurgitation, RV dilation and arrhythmia.',
        'Consider pulmonary valve replacement for significant regurgitation.'
      ]
    },
    pearls: [
      'Squatting raises systemic vascular resistance and reduces the right-to-left shunt.',
      'A right aortic arch is present in about 25% of cases.',
      'Cyanotic patients are at risk of brain abscess and stroke.'
    ],
    redFlags: [
      'Severe hypercyanotic spell',
      'Syncope',
      'Ventricular arrhythmia',
      'Infective endocarditis'
    ],
    differentialDiagnosis: [
      'VSD with pulmonary stenosis',
      'Transposition of the great arteries',
      'Double outlet right ventricle',
      'Tricuspid atresia'
    ],
    source: 'ESC Adult Congenital Heart Disease Guidelines (2020); AHA/ACC ACHD (2018)',
    lastUpdated: '2026'
  },
  {
    id: 'acute-rheumatic-fever',
    name: 'Acute Rheumatic Fever & Rheumatic Carditis',
    category: 'Other',
    summary: 'A post-streptococcal inflammatory disease that may involve the heart, joints, skin and nervous system, and can lead to rheumatic heart disease.',
    pathophysiology: 'Molecular mimicry between group A streptococcal antigens and host tissues (heart, joints and others) triggers an immune-mediated inflammatory response, typically 2-4 weeks after a streptococcal pharyngitis.',
    pathogenesis: [
      { stage: 'Trigger', text: 'Group A streptococcal pharyngitis.' },
      { stage: 'Mimicry', text: 'Molecular mimicry between streptococcal antigens and host tissue.' },
      { stage: 'Inflammation', text: 'Immune-mediated inflammation of heart, joints, skin and brain.' },
      { stage: 'Carditis', text: 'Valvular (mainly mitral) inflammation and regurgitation.' },
      { stage: 'Sequelae', text: 'Chronic rheumatic heart disease.' }
    ],
    signs: [
      'Migratory polyarthritis',
      'Carditis with a new murmur',
      'Erythema marginatum and subcutaneous nodules',
      'Chorea (Sydenham)',
      'Fever with raised ESR/CRP'
    ],
    etiology: [
      'Group A beta-haemolytic streptococcal pharyngitis',
      'Socioeconomic crowding',
      'Genetic susceptibility'
    ],
    classifications: [
      { name: 'Jones criteria', interpretation: 'Major criteria: carditis, polyarthritis, chorea, erythema marginatum, subcutaneous nodules. Minor criteria: fever, arthralgia, raised ESR/CRP, prolonged PR interval.' }
    ],
    symptoms: [
      'Fever',
      'Migratory polyarthritis (large joints)',
      'Carditis (new murmur, heart failure)',
      'Chorea (Sydenham)',
      'Erythema marginatum and subcutaneous nodules'
    ],
    diagnosticCriteria: [
      'Evidence of preceding group A streptococcal infection (raised ASO titre, positive throat culture or rapid antigen test).',
      'Two major criteria, or one major plus two minor criteria (Jones criteria).',
      'Exclusion of alternative diagnoses.'
    ],
    diagnosticAlgorithm: [
      'Clinical suspicion after streptococcal pharyngitis',
      'Confirm preceding GAS infection (ASO, throat swab)',
      'Apply the Jones criteria',
      'Echocardiography to assess for carditis and valvular involvement'
    ],
    labDeviations: [
      { label: 'ASO titre', value: '↑ (evidence of preceding streptococcal infection)', isCritical: false },
      { label: 'ESR / CRP', value: '↑ (acute-phase reactants)', isCritical: false }
    ],
    ekgFindings: [
      'Prolonged PR interval (first-degree AV block).',
      'Occasional other arrhythmias.'
    ],
    imaging: {
      echo: [
        'Valvular regurgitation (most often mitral, then aortic).',
        'Valve thickening and leaflet changes.',
        'Pericardial effusion.'
      ]
    },
    management: {
      primary: [
        'Penicillin to eradicate the streptococcal infection.',
        'Anti-inflammatory therapy — aspirin, or corticosteroids for severe carditis.',
        'Supportive care and bed rest during the acute phase.'
      ],
      secondary: [
        'Secondary antibiotic prophylaxis (penicillin) to prevent recurrence.',
        'Long-term prophylaxis tailored to the severity of cardiac involvement.'
      ]
    },
    pearls: [
      'Migratory polyarthritis is the most common major criterion.',
      'Carditis is the most serious manifestation and the main cause of long-term morbidity.',
      'Chorea (Sydenham) may be the only manifestation.',
      'Rheumatic heart disease most commonly affects the mitral valve.'
    ],
    redFlags: [
      'Heart failure from severe carditis',
      'Significant valvular dysfunction',
      'Chorea'
    ],
    differentialDiagnosis: [
      'Infective endocarditis',
      'Juvenile idiopathic arthritis',
      'Kawasaki disease',
      'Systemic lupus erythematosus',
      'Viral myocarditis'
    ],
    source: 'AHA Jones Criteria (2015 revision); ESC/EACTS Valvular Heart Disease Guidelines (2025)',
    lastUpdated: '2026'
  },
  {
    id: 'minoca',
    name: 'MINOCA',
    category: 'Ischemic',
    summary: 'Myocardial infarction with non-obstructive coronary arteries, caused by mechanisms other than a ruptured plaque with obstructive stenosis.',
    pathophysiology: 'Ischaemia and necrosis arise from mechanisms such as plaque erosion with spontaneous lysis, coronary spasm, microvascular dysfunction, embolism or dissection, without obstructive CAD.',
    pathogenesis: [
      { stage: 'MI', text: 'Troponin rise with ischaemic evidence.' },
      { stage: 'No obstruction', text: 'Angiography shows less than 50% stenosis.' },
      { stage: 'Mechanisms', text: 'Erosion/lysis, spasm, microvascular dysfunction, embolism, dissection.' },
      { stage: 'CMR', text: 'Distinguishes true infarction from myocarditis or takotsubo.' },
      { stage: 'Consequence', text: 'Variable prognosis; treat the identified mechanism.' }
    ],
    signs: [
      'MI presentation with raised troponin',
      'Non-obstructive coronary arteries',
      'Variable ECG changes',
      'CMR findings establishing the aetiology'
    ],
    symptoms: [
      'Chest pain (MI presentation)',
      'Shortness of breath',
      'Palpitations'
    ],
    diagnosticCriteria: [
      'MI criteria met (Positive Troponin + Ischemia signs).',
      'Non-obstructive coronary arteries on angiography (stenosis < 50%).',
      'No alternative clinically obvious non-ischemic cause (e.g. Sepsis).'
    ],
    diagnosticAlgorithm: [
      'Confirm Angio < 50% stenosis',
      'Perform CMR (Lake Louise)',
      'Check for Vasospasm',
      'Rule out Myocarditis'
    ],
    labDeviations: [
      { label: 'Troponin', value: 'Positive (Elevated)', isCritical: true },
      { label: 'D-dimer', value: 'Check to r/o PE', isCritical: false }
    ],
    ekgFindings: [
      'ST-segment changes (Elevation or Depression).',
      'T-wave inversions.',
      'New Bundle Branch Block.'
    ],
    imaging: {
      echo: [
        'Often normal LVEF.',
        'May show regional wall motion abnormalities (temporary).',
        'Assess for Takotsubo ballooning.'
      ],
      ct_mri: [
        'CMR (Mandatory): Differentiates between MI, Myocarditis, and Takotsubo.',
        'Late Gadolinium Enhancement (LGE): Subendocardial (MI) vs. Subepicardial (Myocarditis).'
      ]
    },
    treatmentAlgorithm: [
      { id: 'min-1', label: 'Emergency Angio', action: 'Confirm non-obstructive CAD (<50%).', category: 'initial' },
      { id: 'min-2', label: 'Etiology Workup', action: 'Perform CMR (within 2 weeks) and search for plaque rupture/erosion.', category: 'initial' },
      { id: 'min-3', label: 'Intracoronary Imaging', action: 'IVUS or OCT to identify "hidden" plaque ruptures.', category: 'intervention' },
      { id: 'min-4', label: 'Secondary Prevention', action: 'Statins and ACEi; Beta-blockers if reduced EF.', category: 'long-term' }
    ],
    management: {
      primary: [
        'Treat according to underlying cause (e.g. Statins for plaque, CCB for spasm).',
        'Aspirin and ACE inhibitors show benefit in observational studies.'
      ],
      secondary: [
        'Beta-blockers if LVEF is reduced.'
      ]
    },
    pearls: [
      'MINOCA stands for Myocardial Infarction with Non-Obstructive Coronary Arteries.',
      'Myocarditis and Takotsubo are "MINOCA mimics" but officially classified separately after CMR.'
    ],
    redFlags: [
      'Marked Troponin elevation',
      'Recurrent Angina',
      'Reduced LV function'
    ],
    differentialDiagnosis: [
      'Myocarditis',
      'Takotsubo Syndrome',
      'Pulmonary Embolism',
      'Aortic Dissection'
    ],
    source: 'ESC MINOCA Position Paper 2024',
    lastUpdated: '2024'
  },
  {
    id: 'hypertensive-emergency',
    name: 'Hypertensive Emergency',
    category: 'Emergency',
    summary: 'Severe blood-pressure elevation with acute target-organ damage, not simply a very high reading.',
    pathophysiology: 'Abrupt severe hypertension overwhelms cerebral, cardiac and renal autoregulation, causing endothelial injury, fibrinoid necrosis and organ ischaemia.',
    pathogenesis: [
      { stage: 'Trigger', text: 'An abrupt rise in blood pressure.' },
      { stage: 'Autoregulation', text: 'Failure of cerebral, cardiac and renal autoregulation.' },
      { stage: 'Endothelium', text: 'Endothelial injury and fibrinoid necrosis.' },
      { stage: 'Injury', text: 'Organ ischaemia (retina, brain, heart, kidney, aorta).' },
      { stage: 'Consequence', text: 'Encephalopathy, stroke, ACS, pulmonary oedema, acute kidney injury or aortic dissection.' }
    ],
    signs: [
      'Blood pressure usually >180/120 mmHg',
      'Papilloedema or retinal haemorrhage',
      'Neurological deficit or encephalopathy',
      'Chest pain or pulmonary oedema',
      'Renal impairment with haematuria'
    ],
    symptoms: [
      'Severe headache',
      'Visual disturbances / Blurred vision',
      'Chest pain / Shortness of breath',
      'Confusion / Encephalopathy',
      'Seizures'
    ],
    diagnosticCriteria: [
      'Markedly elevated blood pressure (usually > 180/120 mmHg).',
      'Evidence of acute, life-threatening end-organ damage (Target organ damage).',
      'NOT defined by BP level alone (Hypertensive Urgency has no organ damage).'
    ],
    diagnosticAlgorithm: [
      'Assess for End-Organ Damage',
      'Check Fundoscopy (Papilledema)',
      'Measure Cr / Troponin',
      'Perform Head CT (if Neuro)'
    ],
    labDeviations: [
      { label: 'Cr', value: '↑ (Acute Kidney Injury)', isCritical: true },
      { label: 'Troponin', value: '↑ (Demand Ischemia)', isCritical: false },
      { label: 'Schistocytes', value: 'Positive if MAHA present', isCritical: false }
    ],
    ekgFindings: [
      'Left Ventricular Hypertrophy (LVH) with strain pattern.',
      'Ischemic changes (ST-depression) due to high afterload.',
      'Signs of Acute Heart Failure.'
    ],
    imaging: {
      echo: [
        'Severe concentric LV Hypertrophy.',
        'Assess for new RWMA or acute MR.',
        'Evidence of high filling pressures.'
      ],
      ct_mri: [
        'Head CT/MRI: Search for hemorrhage, stroke, or PRES (Posterior Reversible Encephalopathy Syndrome).',
        'CT Aorta: Rule out Aortic Dissection.'
      ],
      cxr: [
        'Pulmonary edema.',
        'Widened mediastinum (Aortic Dissection).'
      ]
    },
    treatmentAlgorithm: [
      { id: 'hte-1', label: 'Immediate ICU', action: 'Admit to ICU for continuous BP monitoring (Art-line preferred).', category: 'initial' },
      { id: 'hte-2', label: 'Rate of Reduction', action: 'Reduce MAP by no more than 20-25% in the first hour.', category: 'intervention', notes: 'Rapid reduction can cause cerebral/renal ischemia.' },
      { id: 'hte-3', label: 'Agent Selection', action: 'IV Labetalol, Nicardipine, or Esmolol based on end-organ damage.', category: 'intervention' },
      { id: 'hte-4', label: 'Exception: Dissection', action: 'In Acute Aortic Dissection, reduce SBP to <120 within 20 minutes.', category: 'intervention' }
    ],
    management: {
      primary: [
        'Intravenous antihypertensives (Labetalol, Nicardipine, Clevidipine).',
        'Control of Target Organ Damage.'
      ],
      secondary: [
        'Transition to oral therapy once stable for 24h.',
        'Search for secondary causes (Renal Artery Stenosis, Pheo).'
      ]
    },
    pearls: [
      'Lowering BP too fast can cause stroke or blindness due to autoregulation shift.',
      'Hypertensive Urgency does NOT need IV therapy; oral meds and follow-up are sufficient.'
    ],
    redFlags: [
      'Altered mental status',
      'Chest pain / Back pain',
      'New onset AKI'
    ],
    differentialDiagnosis: [
      'Hypertensive Urgency',
      'Acute Stroke (Primary)',
      'Aortic Dissection',
      'Pheochromocytoma crisis'
    ],
    source: 'ESC/AHA Hypertension Guidelines',
    lastUpdated: '2024'
  },

  // ===== Phase 4 content expansion =====
  {
    id: 'syncope',
    name: 'Syncope',
    category: 'Other',
    summary: 'Transient, self-limited loss of consciousness due to global cerebral hypoperfusion, with rapid complete recovery.',
    pathophysiology: 'A transient fall in systemic blood pressure reduces cerebral perfusion below the threshold for consciousness. The mechanism is reflex (vasovagal/situational/carotid sinus), orthostatic, or cardiac (arrhythmic or structural).',
    labDeviations: [
      { label: 'Haemoglobin', value: 'Low = anaemia', direction: '↓' },
      { label: 'Glucose', value: 'Exclude hypoglycaemia', direction: '±' },
      { label: 'Troponin', value: 'Raised suggests a cardiac cause', direction: '↑' }
    ],
    pathogenesis: [
      { stage: 'Trigger', text: 'A transient fall in systemic blood pressure.' },
      { stage: 'Mechanism', text: 'A reflex, orthostatic or cardiac cause.' },
      { stage: 'Perfusion', text: 'Cerebral perfusion falls below the threshold for consciousness.' },
      { stage: 'Recovery', text: 'Rapid and complete recovery.' },
      { stage: 'Consequence', text: 'Prognosis depends on the cause; cardiac syncope is high-risk.' }
    ],
    signs: [
      'Transient loss of consciousness with rapid complete recovery',
      'Prodrome (nausea, warmth, diaphoresis) in reflex syncope',
      'No or minimal prodrome in cardiac syncope',
      'Exertional or supine onset suggests a cardiac cause'
    ],
    etiology: ['Reflex (vasovagal, situational, carotid sinus)', 'Orthostatic hypotension', 'Cardiac arrhythmia (brady- or tachyarrhythmia)', 'Structural (aortic stenosis, HCM, tamponade, PE)', 'Drugs (vasodilators, diuretics, alpha-blockers)'],
    classifications: [
      { name: 'Mechanism', interpretation: 'Reflex / orthostatic / cardiac' },
      { name: 'ESC risk', interpretation: 'High-risk features mandate admission and monitoring' },
    ],
    symptoms: ['Sudden transient loss of consciousness', 'Rapid spontaneous complete recovery', 'Prodrome (nausea, warmth, diaphoresis) in reflex syncope', 'No or minimal prodrome in cardiac syncope'],
    diagnosticCriteria: ['Transient loss of consciousness with rapid complete recovery', 'Initial evaluation = history, physical examination and 12-lead ECG (Class I)', 'Cause identified in ~50% after initial evaluation'],
    diagnosticAlgorithm: ['Initial evaluation (history, exam, ECG)', 'Risk-stratify for high-risk features', 'Directed testing (carotid sinus massage, tilt test, ambulatory ECG, echocardiography)', 'Treat the specific cause'],
    ekgFindings: ['Sinus bradycardia or pauses', 'Bifascicular block, Mobitz II or complete AV block', 'Pre-excitation (WPW)', 'Brugada pattern or long QT', 'Ischaemic changes'],
    imaging: {
      echo: ['Structural cause: aortic stenosis, HCM, tamponade, acute PE', 'A normal echo does not exclude arrhythmic syncope'],
    },
    management: {
      primary: ['Treat the underlying cause', 'Reflex syncope: education, salt/fluid intake, counter-pressure manoeuvres', 'Orthostatic: stop culprit drugs, compression stockings, midodrine or fludrocortisone', 'Cardiac: pacing for documented bradyarrhythmia; ablation or ICD for tachyarrhythmia'],
      secondary: ['Cardiac pacing in cardioinhibitory carotid sinus syndrome', 'ICD for syncope with a high-risk ventricular arrhythmia substrate'],
    },
    pearls: ['The initial evaluation (history, examination, ECG) establishes the cause in about half of patients.', 'Syncope while supine or during exertion suggests a cardiac cause and warrants urgent evaluation.'],
    redFlags: ['Syncope during exertion or while supine', 'Family history of sudden cardiac death', 'ECG abnormalities (conduction disease, Brugada, long QT)', 'Structural heart disease or heart failure'],
    differentialDiagnosis: ['Seizure', 'Hypoglycaemia', 'Psychogenic pseudosyncope', 'Vertebrobasilar TIA'],
    source: 'ESC 2018 Syncope Guidelines / ACC/AHA/HRS 2017',
    lastUpdated: '2024'
  },
  {
    id: 'orthostatic-hypotension',
    name: 'Orthostatic Hypotension & POTS',
    category: 'Other',
    summary: 'Symptoms from cerebral hypoperfusion on standing, due to a fall in blood pressure (OH) or an excessive postural heart-rate rise (POTS).',
    pathophysiology: 'Failure of the autonomic reflex (baroreflex) or of vascular volume regulation leads to a >20 mmHg systolic (or >10 mmHg diastolic) fall on standing; POTS is an excessive heart-rate increase without hypotension.',
    labDeviations: [
      { label: 'Haemoglobin', value: 'Low = anaemia', direction: '↓' },
      { label: 'Sodium/creatinine', value: 'Volume and renal status', direction: '±' },
      { label: 'Morning cortisol', value: 'Low = adrenal insufficiency', direction: '↓' }
    ],
    pathogenesis: [
      { stage: 'Trigger', text: 'Standing up.' },
      { stage: 'Mechanism', text: 'Baroreflex failure or volume depletion.' },
      { stage: 'Pressure', text: 'Systolic fall of 20 mmHg or more (or diastolic 10 mmHg or more) on standing.' },
      { stage: 'Perfusion', text: 'Cerebral hypoperfusion causes symptoms.' },
      { stage: 'POTS', text: 'Excessive heart-rate rise without hypotension.' }
    ],
    signs: [
      'Postural blood-pressure fall',
      'Lightheadedness or blackouts on standing',
      'Coat-hanger neck/shoulder pain',
      'POTS: heart-rate rise of 30 bpm or more without hypotension'
    ],
    etiology: ['Neurogenic (Parkinson disease, diabetes, amyloidosis)', 'Volume depletion or deconditioning', 'Drugs (diuretics, vasodilators, alpha-blockers, TCA)', 'Prolonged bed rest', 'Post-viral (POTS)'],
    symptoms: ['Lightheadedness or syncope on standing', 'Blurred vision', 'Coat-hanger neck/shoulder pain', 'POTS: palpitations, exercise intolerance, brain fog'],
    diagnosticCriteria: ['OH: SBP fall ≥20 mmHg or DBP fall ≥10 mmHg within 3 min of standing', 'POTS: heart-rate rise ≥30 bpm (≥40 bpm in teens) within 10 min without hypotension'],
    diagnosticAlgorithm: ['Supine and standing BP/HR (or active stand/tilt test)', 'Review medications', 'Assess for neurogenic vs non-neurogenic cause', 'Holter/autonomic testing if needed'],
    ekgFindings: ['Usually normal', 'Sinus tachycardia in POTS'],
    management: {
      primary: ['Education and counter-pressure manoeuvres (leg crossing, muscle tensing)', 'Increase salt and fluid intake', 'Compression stockings (abdominal-thigh)', 'Stop culprit medications'],
      secondary: ['Midodrine or fludrocortisone for refractory OH', 'Ivabradine or low-dose beta-blocker for POTS; graded exercise programme'],
    },
    pearls: ['Measure BP both supine and after standing for 3 minutes — a single sitting measurement misses OH.', 'POTS is diagnosed by the heart-rate rise, not blood pressure.'],
    redFlags: ['Orthostatic syncope with injury', 'Shock or hypovolaemia', 'Signs of autonomic failure with a neurological deficit'],
    differentialDiagnosis: ['Syncope (reflex or cardiac)', 'Anaemia', 'Deconditioning', 'Anxiety'],
    source: 'ESC Syncope Guidelines / ACC',
    lastUpdated: '2024'
  },
  {
    id: 'cpvt',
    name: 'Catecholaminergic Polymorphic VT (CPVT)',
    category: 'Arrhythmia',
    summary: 'Inherited arrhythmia syndrome with exercise- or emotion-induced bidirectional/polymorphic VT and sudden death in a structurally normal heart.',
    pathophysiology: 'Mutations (RyR2, calsequestrin) cause diastolic calcium leak from the sarcoplasmic reticulum; beta-adrenergic stimulation triggers delayed after-depolarisations and polymorphic VT.',
    labDeviations: [
      { label: 'Troponin', value: 'Usually normal (no necrosis)', direction: '±' },
      { label: 'Electrolytes (K+/Mg2+)', value: 'Normal; correct abnormalities', direction: '±' },
      { label: 'Genetic test', value: 'Pathogenic RyR2/CASQ2 variant supports the diagnosis', direction: '↑' }
    ],
    pathogenesis: [
      { stage: 'Genetic defect', text: 'RyR2 or CASQ2 mutation.' },
      { stage: 'Mechanism', text: 'Diastolic calcium leak from the sarcoplasmic reticulum.' },
      { stage: 'Trigger', text: 'Beta-adrenergic stimulation (exercise or emotion).' },
      { stage: 'Arrhythmia', text: 'Delayed afterdepolarisations cause bidirectional/polymorphic VT.' },
      { stage: 'Consequence', text: 'Syncope and sudden death in a structurally normal heart.' }
    ],
    signs: [
      'Normal resting ECG',
      'Exercise-induced bidirectional VT',
      'Exercise- or emotion-induced syncope',
      'Family history of sudden cardiac death'
    ],
    etiology: ['RyR2 mutation (autosomal dominant)', 'CASQ2 mutation (autosomal recessive)', 'Typically a structurally normal heart', 'Family history of exercise-related syncope or SCD'],
    symptoms: ['Syncope during exercise or emotional stress', 'Palpitations', 'Cardiac arrest (often in a young patient)', 'Often no symptoms between episodes'],
    diagnosticCriteria: ['Exercise- or emotion-induced bidirectional or polymorphic VT', 'Normal resting ECG and structurally normal heart', 'Exercise stress test reproduces arrhythmia', 'Pathogenic RyR2/CASQ2 mutation'],
    diagnosticAlgorithm: ['Exercise stress test (reproduce graded bidirectional VT)', 'Echocardiography (structurally normal)', 'Genetic testing', 'Family screening'],
    ekgFindings: ['Normal resting ECG (often)', 'Exercise-induced bidirectional VT', 'Polymorphic VT with catecholamine provocation', 'Normal QTc'],
    management: {
      primary: ['Non-selective beta-blocker (nadolol or propranolol) — first line', 'Restrict strenuous exercise and competitive sport', 'Flecainide add-on if beta-blockade insufficient'],
      secondary: ['ICD for survivors of cardiac arrest or breakthrough arrhythmia on therapy', 'Left cardiac sympathetic denervation for refractory cases'],
    },
    pearls: ['Bidirectional VT during exercise in a young patient with a normal QT is CPVT until proven otherwise.', 'Unlike LQTS, the resting ECG is normal.'],
    redFlags: ['Cardiac arrest', 'Exercise-induced syncope', 'Family history of SCD <40 years'],
    differentialDiagnosis: ['Long QT syndrome', 'Catecholamine-sensitive VT with structural disease', 'Brugada syndrome'],
    source: 'ESC 2022 VA/SCD Guidelines',
    lastUpdated: '2024'
  },
  {
    id: 'short-qt-syndrome',
    name: 'Short QT Syndrome',
    category: 'Arrhythmia',
    summary: 'Rare inherited channelopathy with an abnormally short QT interval and a risk of atrial and ventricular fibrillation.',
    pathophysiology: 'Gain-of-function mutations in potassium channels (KCNH2, KCNQ1, KCNJ2) shorten the action potential, increasing dispersion of repolarisation and arrhythmia risk.',
    labDeviations: [
      { label: 'QTc', value: 'Short (<=340 ms)', direction: '↓' },
      { label: 'Serum K+/Ca2+', value: 'Normal (exclude secondary causes)', direction: '±' },
      { label: 'Genetic test', value: 'Gain-of-function potassium-channel variant', direction: '↑' }
    ],
    pathogenesis: [
      { stage: 'Genetic defect', text: 'Gain-of-function potassium-channel mutation.' },
      { stage: 'Repolarisation', text: 'Shortened action potential.' },
      { stage: 'Dispersion', text: 'Increased heterogeneity of repolarisation.' },
      { stage: 'Arrhythmia', text: 'Atrial and ventricular fibrillation.' },
      { stage: 'Consequence', text: 'Syncope and sudden death.' }
    ],
    signs: [
      'QTc of 340 ms or less',
      'Tall, peaked T waves',
      'Atrial fibrillation',
      'Family history of sudden cardiac death'
    ],
    etiology: ['Gain-of-function potassium-channel mutations', 'Autosomal dominant inheritance', 'Family history of SCD'],
    symptoms: ['Palpitations / atrial fibrillation', 'Syncope', 'Cardiac arrest (may be the first presentation)'],
    diagnosticCriteria: ['QTc ≤340 ms', 'OR QTc <360 ms with a pathogenic mutation, family history of SCD, or a short-QT family member', 'Tall/peaked T waves'],
    diagnosticAlgorithm: ['Measure QTc (Bazett)', 'Assess for family history of SCD', 'Genetic testing', 'Exclude secondary causes'],
    ekgFindings: ['QTc ≤340 ms', 'Tall, peaked T waves', 'Occasional bradycardia', 'Atrial fibrillation'],
    management: {
      primary: ['ICD implantation for symptomatic patients (survivors of cardiac arrest)', 'Avoid QT-shortening or pro-arrhythmic drugs'],
      secondary: ['Quinidine may be considered', 'Family screening of first-degree relatives'],
    },
    pearls: ['Short QT is much rarer than long QT but carries a high risk of atrial fibrillation and SCD.', 'QTc ≤340 ms is diagnostic.'],
    redFlags: ['Syncope', 'Documented atrial or ventricular fibrillation', 'Family history of SCD'],
    differentialDiagnosis: ['Early repolarisation', 'Hypercalcaemia', 'Athlete\'s heart'],
    source: 'ESC 2022 VA/SCD Guidelines',
    lastUpdated: '2024'
  },
  {
    id: 'pulmonary-arterial-hypertension',
    name: 'Pulmonary Hypertension (WHO classification)',
    category: 'Vascular',
    summary: 'Mean pulmonary artery pressure >20 mmHg; group 1 (PAH) is the primary target for pulmonary vasodilator therapy.',
    pathophysiology: 'Proliferation and remodelling of the pulmonary arterioles raise pulmonary vascular resistance and RV afterload, leading to right heart failure. Prognosis depends on the group and RV adaptation.',
    labDeviations: [
      { label: 'NT-proBNP', value: 'Raised (RV strain)', direction: '↑' },
      { label: 'ABG', value: 'Hypoxaemia', direction: '↓' },
      { label: 'Autoantibodies / HIV', value: 'Screen for associated causes', direction: '±' }
    ],
    pathogenesis: [
      { stage: 'Trigger', text: 'Genetic, immune or toxic insult, or an unknown cause (group 1).' },
      { stage: 'Mechanism', text: 'Proliferation of endothelial and smooth-muscle cells in the arterioles.' },
      { stage: 'Remodelling', text: 'Plexiform lesions raise pulmonary vascular resistance.' },
      { stage: 'RV afterload', text: 'Right ventricular hypertrophy progresses to failure.' },
      { stage: 'Consequence', text: 'Exertional dyspnoea, syncope and right heart failure.' }
    ],
    signs: [
      'Accentuated pulmonary component of the second heart sound (loud P2)',
      'Right ventricular heave',
      'Raised JVP and peripheral oedema',
      'Tricuspid regurgitation murmur',
      'Desaturation on exertion'
    ],
    etiology: ['Group 1: idiopathic/heritable PAH, connective tissue disease, congenital heart disease', 'Group 1: portopulmonary, HIV, drug/toxin', 'Group 2: left heart disease', 'Group 3: lung disease/hypoxia', 'Group 4: chronic thromboembolic PH', 'Group 5: multifactorial'],
    classifications: [
      { name: 'WHO Groups', interpretation: 'Group 1 PAH, 2 left heart, 3 lung, 4 CTEPH, 5 multifactorial' },
      { name: 'Functional class', interpretation: 'WHO FC I-IV' },
    ],
    symptoms: ['Exertional dyspnoea', 'Fatigue', 'Syncope', 'Chest pain', 'Peripheral oedema and signs of RV failure'],
    diagnosticCriteria: ['Right heart catheterisation: mPAP >20 mmHg, and pre-capillary wedge pressure ≤15 mmHg', 'Pulmonary vascular resistance >2 WU (pre-capillary PH)'],
    diagnosticAlgorithm: ['Echocardiographic suspicion (TR velocity, RV dilation)', 'Confirm with right heart catheterisation', 'Assign WHO group', 'Vasoreactivity testing in idiopathic PAH'],
    ekgFindings: ['Right axis deviation', 'Right ventricular hypertrophy', 'Right atrial enlargement (P-pulmonale)', 'RBBB'],
    imaging: {
      echo: ['Elevated TR velocity', 'RV dilation and flattening of the interventricular septum', 'Reduced TAPSE', 'Pericardial effusion in severe disease'],
      ct_mri: ['CTPA for group 3/4 (thrombi, parenchymal disease)', 'CMR for RV volumes and function'],
    },
    management: {
      primary: ['Group 1 PAH: PAH-specific therapy (PDE5 inhibitor, endothelin receptor antagonist, prostacyclin pathway agent) — risk-stratified and often combination', 'Oxygen and diuretics for symptoms', 'Anticoagulation in idiopathic PAH'],
      secondary: ['Group 4 CTEPH: pulmonary endarterectomy where operable', 'Group 2/3: treat the underlying left-heart or lung disease', 'Lung transplantation for refractory disease'],
    },
    pearls: ['Always classify the WHO group first — PAH-specific drugs are harmful in group 2 (left heart) PH.', 'Vasoreactivity testing identifies the few idiopathic PAH patients who benefit from calcium-channel blockers.'],
    redFlags: ['Syncope', 'Right ventricular failure', 'Elevated RA pressure / pericardial effusion'],
    differentialDiagnosis: ['Left heart disease (group 2)', 'COPD/ILD (group 3)', 'Chronic thromboembolic PH (group 4)'],
    source: 'ESC/ERS 2022 Pulmonary Hypertension Guidelines',
    lastUpdated: '2024'
  },
  {
    id: 'constrictive-pericarditis',
    name: 'Constrictive Pericarditis',
    category: 'Other',
    summary: 'Impaired diastolic filling due to a rigid, thickened pericardium, causing elevated and equalised filling pressures.',
    pathophysiology: 'Fibrosis and calcification of the pericardium prevent diastolic expansion, raising and equalising right and left diastolic pressures; ventricular interdependence couples the two ventricles.',
    labDeviations: [
      { label: 'NT-proBNP', value: 'Raised (less than in heart failure)', direction: '↑' },
      { label: 'Albumin', value: 'Low in protein-losing states', direction: '↓' },
      { label: 'CRP/ESR', value: 'Raised with active inflammation', direction: '↑' }
    ],
    pathogenesis: [
      { stage: 'Trigger', text: 'Prior pericarditis, tuberculosis, cardiac surgery, radiotherapy or malignancy.' },
      { stage: 'Fibrosis', text: 'Pericardial thickening and calcification.' },
      { stage: 'Filling', text: 'A rigid pericardium prevents diastolic expansion.' },
      { stage: 'Equalisation', text: 'Raised and equalised diastolic pressures in all chambers.' },
      { stage: 'Interdependence', text: 'Ventricular interdependence produces Kussmaul sign and a septal bounce.' }
    ],
    signs: [
      'Raised JVP with Kussmaul sign',
      'Pericardial knock',
      'Ascites and oedema',
      'Hepatic pulsatility',
      'Clear lungs (in contrast to heart failure)'
    ],
    etiology: ['Idiopathic / post-viral', 'Tuberculosis', 'Prior cardiac surgery or radiotherapy', 'Post-pericarditis', 'Malignancy'],
    symptoms: ['Progressive dyspnoea', 'Fatigue', 'Peripheral oedema / ascites', 'Abdominal fullness'],
    diagnosticCriteria: ['Elevated and equalised diastolic pressures at catheterisation', 'Ventricular interdependence (septal bounce, respiratory septal shift)', 'Kussmaul sign and pericardial knock'],
    diagnosticAlgorithm: ['Echo: septal bounce, respiratory mitral/tricuspid inflow variation', 'CT/CMR: pericardial thickening/calcification', 'Cardiac catheterisation: square-root sign, ventricular interdependence'],
    ekgFindings: ['Low-voltage QRS', 'Atrial fibrillation', 'P-wave abnormalities', 'Non-specific ST/T changes'],
    imaging: {
      echo: ['Septal bounce', 'Respiratory variation in mitral (>25%) and tricuspid (>40%) inflow', 'Medial mitral annulus e′ often preserved'],
      ct_mri: ['Pericardial thickening (>4 mm) and calcification on CT', 'CMR for pericardial inflammation and fibrosis'],
    },
    management: {
      primary: ['Diuretics for congestion (cautious — preload-dependent)', 'Treat the underlying cause (e.g. anti-tuberculous therapy)'],
      secondary: ['Pericardiectomy for refractory symptomatic constriction'],
    },
    pearls: ['Distinguish from restrictive cardiomyopathy: preserved medial e′ and respiratory septal shift favour constriction.', 'Anti-inflammatory therapy (colchicine/NSAID) may help active pericardial inflammation.'],
    redFlags: ['Severe right heart failure', 'Cachexia / cardiac cirrhosis', 'Progression to low cardiac output'],
    differentialDiagnosis: ['Restrictive cardiomyopathy', 'Cardiac tamponade', 'Right heart failure from PH'],
    source: 'ESC Pericardial Disease / ESC 2025 Myopericarditis',
    lastUpdated: '2024'
  },
  {
    id: 'restrictive-cardiomyopathy',
    name: 'Restrictive Cardiomyopathy',
    category: 'Heart Failure',
    summary: 'Non-dilated ventricles with impaired filling and restrictive physiology, often due to infiltration or fibrosis.',
    pathophysiology: 'Increased myocardial stiffness from infiltration (amyloid, sarcoid, Fabry) or fibrosis impairs diastolic filling despite normal or near-normal systolic function; both atria dilate and filling pressures rise.',
    labDeviations: [
      { label: 'NT-proBNP', value: 'Raised (high filling pressures)', direction: '↑' },
      { label: 'Troponin', value: 'Often mildly raised', direction: '↑' },
      { label: 'Free light chains / TTR', value: 'Define the amyloid type', direction: '±' }
    ],
    pathogenesis: [
      { stage: 'Trigger', text: 'Myocardial infiltration (amyloid, sarcoid) or fibrosis.' },
      { stage: 'Stiffness', text: 'Increased myocardial stiffness.' },
      { stage: 'Filling', text: 'Impaired diastolic filling with biatrial enlargement.' },
      { stage: 'Pressure', text: 'Raised filling pressures in both ventricles.' },
      { stage: 'Consequence', text: 'Dyspnoea, right heart failure and arrhythmia.' }
    ],
    signs: [
      'Raised JVP and oedema',
      'Third or fourth heart sound',
      'Biatrial enlargement',
      'Signs of right heart failure',
      'Preserved ejection fraction'
    ],
    etiology: ['Cardiac amyloidosis (AL / ATTR)', 'Cardiac sarcoidosis', 'Fabry disease', 'Idiopathic / familial', 'Endomyocardial fibrosis'],
    symptoms: ['Dyspnoea', 'Exercise intolerance', 'Right heart failure (oedema, ascites)', 'Arrhythmias / syncope'],
    diagnosticCriteria: ['Restrictive filling pattern on echo (E/A >2, short deceleration time)', 'Normal or mildly reduced LVEF with small ventricles', 'Biatrial enlargement', 'CMR/biopsy for the underlying cause'],
    diagnosticAlgorithm: ['Echo (restrictive pattern, biatrial enlargement)', 'CMR (LGE, T1/ECV, apical sparing)', 'PYP scan / light chains if amyloid suspected', 'Bone marrow / biopsy for specific causes'],
    ekgFindings: ['Low-voltage QRS (amyloid)', 'Pseudo-infarct Q waves', 'Atrial fibrillation', 'Conduction disease'],
    imaging: {
      echo: ['Restrictive filling, biatrial enlargement, small ventricles', 'Apical sparing on strain (amyloid)', 'Thick walls with sparkling appearance'],
      ct_mri: ['Diffuse late gadolinium enhancement / elevated ECV', 'T1 mapping for infiltration'],
    },
    management: {
      primary: ['Treat the underlying cause (tafamidis for ATTR, chemotherapy for AL, enzyme replacement for Fabry)', 'Cautious diuresis — preload-dependent physiology', 'Rate control for atrial fibrillation'],
      secondary: ['Heart transplantation for eligible candidates', 'Avoid drugs poorly tolerated in restrictive physiology (high-dose beta-blockers, ACEi)'],
    },
    pearls: ['Low-voltage ECG with thick walls suggests infiltrative restrictive cardiomyopathy (amyloid).', 'Restrictive physiology is preload-dependent; over-diuresis causes low output.'],
    redFlags: ['Syncope (conduction disease)', 'Advanced heart failure', 'Nephrotic syndrome (AL amyloidosis)'],
    differentialDiagnosis: ['Constrictive pericarditis', 'HCM', 'Amyloidosis', 'Hypertensive heart disease'],
    source: 'ESC Cardiomyopathy Guidelines',
    lastUpdated: '2024'
  },
  {
    id: 'peripartum-cardiomyopathy',
    name: 'Peripartum Cardiomyopathy (PPCM)',
    category: 'Heart Failure',
    summary: 'Heart failure with reduced LVEF occurring late in pregnancy or in the months after delivery, without another identifiable cause.',
    pathophysiology: 'An abnormal late-pregnancy/peripartum response (oxidative stress, prolactin cleavage, anti-angiogenic signalling) precipitates a dilated, reversible-to-variable cardiomyopathy.',
    labDeviations: [
      { label: 'NT-proBNP', value: 'Raised', direction: '↑' },
      { label: 'Troponin', value: 'May be raised', direction: '↑' },
      { label: 'BP / urine protein', value: 'Screen for preeclampsia', direction: '±' }
    ],
    pathogenesis: [
      { stage: 'Timing', text: 'Late pregnancy or up to 5 months postpartum.' },
      { stage: 'Trigger', text: 'Oxidative stress, prolactin cleavage and anti-angiogenic signalling.' },
      { stage: 'Dysfunction', text: 'LV dilatation with reduced LVEF (less than 45%).' },
      { stage: 'Thrombus', text: 'Left ventricular thrombus risk.' },
      { stage: 'Course', text: 'Recovery in about half; persistent dysfunction in the rest.' }
    ],
    signs: [
      'Signs of heart failure in late pregnancy or postpartum',
      'Dyspnoea, orthopnoea and oedema',
      'LV dilation with reduced LVEF',
      'Arrhythmia'
    ],
    etiology: ['Late pregnancy or up to 5 months postpartum', 'Multiparity, multiple gestation', 'Chronic hypertension / preeclampsia', 'Afro-Caribbean ethnicity', 'Family history'],
    symptoms: ['Dyspnoea and orthopnoea', 'Peripheral oedema', 'Fatigue', 'Palpitations'],
    diagnosticCriteria: ['Heart failure in late pregnancy or ≤5 months postpartum', 'LVEF <45%', 'No pre-existing or other identifiable cause of cardiomyopathy'],
    diagnosticAlgorithm: ['Echocardiography (LVEF, LV dilation, thrombi)', 'NT-proBNP and ECG', 'Exclude pre-existing or ischaemic cause', 'Assess LV thrombus'],
    ekgFindings: ['Sinus tachycardia', 'Arrhythmias', 'Non-specific ST/T changes', 'LBBB'],
    imaging: {
      echo: ['LV dilation with reduced LVEF (<45%)', 'LV thrombus (assess before anticoagulation decisions)', 'Functional mitral regurgitation'],
    },
    management: {
      primary: ['Standard heart failure therapy, adapted for pregnancy/lactation (avoid ACEi/ARB/ARNI/MRA/SGLT2i in pregnancy)', 'Beta-blockers (metoprolol/bisoprolol) and diuretics', 'Bromocriptine may be considered in severe cases (specialist use)'],
      secondary: ['Anticoagulation if LV thrombus', 'ICD/CRT or mechanical support for refractory cases', 'Subsequent pregnancy generally contraindicated if LVEF does not recover'],
    },
    pearls: ['Bromocriptine with prophylactic anticoagulation is used in selected severe cases.', 'LVEF recovery occurs in about half of patients within 6 months.'],
    redFlags: ['Cardiogenic shock', 'LV thrombus / thromboembolism', 'Sustained ventricular arrhythmia'],
    differentialDiagnosis: ['Pre-existing dilated cardiomyopathy unmasked by pregnancy', 'Preeclampsia-related pulmonary oedema', 'Amniotic fluid embolism'],
    source: 'ESC 2025 CVD in Pregnancy / ESC HF',
    lastUpdated: '2024'
  },
  {
    id: 'cardiac-sarcoidosis',
    name: 'Cardiac Sarcoidosis',
    category: 'Other',
    summary: 'Granulomatous myocardial inflammation and fibrosis that can cause conduction disease, ventricular arrhythmia and heart failure.',
    pathophysiology: 'Non-caseating granulomas infiltrate the myocardium (especially the basal septum), causing scar, conduction block and a substrate for re-entrant ventricular arrhythmia.',
    labDeviations: [
      { label: 'Troponin', value: 'May be raised', direction: '↑' },
      { label: 'Serum ACE', value: 'May be raised', direction: '↑' },
      { label: 'Calcium', value: 'Raised = hypercalcaemia', direction: '↑' }
    ],
    pathogenesis: [
      { stage: 'Trigger', text: 'Non-caseating granulomatous inflammation.' },
      { stage: 'Location', text: 'Basal septum and myocardium.' },
      { stage: 'Fibrosis', text: 'Scar and conduction-tissue injury.' },
      { stage: 'Arrhythmia', text: 'Re-entrant VT substrate and AV block.' },
      { stage: 'Consequence', text: 'Conduction disease, ventricular arrhythmia and heart failure.' }
    ],
    signs: [
      'Advanced AV block in a young patient',
      'Ventricular arrhythmia',
      'Basal septal thinning or LGE on CMR',
      'Extra-cardiac sarcoidosis'
    ],
    etiology: ['Systemic sarcoidosis with cardiac involvement', 'Isolated cardiac involvement', 'Young/middle-aged patients', 'Afro-Caribbean ethnicity'],
    symptoms: ['Palpitations / syncope', 'Heart failure', 'AV block (may be the presenting feature)', 'Often asymptomatic'],
    diagnosticCriteria: ['Histological confirmation or clinical diagnosis (HRS/ESC criteria)', 'CMR: non-ischaemic LGE (basal septum/subepicardial)', '18F-FDG PET for active inflammation'],
    diagnosticAlgorithm: ['ECG (conduction disease), ambulatory monitoring', 'CMR for scar', 'FDG PET for active inflammation', 'Endomyocardial biopsy if needed'],
    ekgFindings: ['AV block (often advanced)', 'Bundle branch block', 'Ventricular arrhythmia / PVCs', 'Non-specific changes'],
    imaging: {
      echo: ['Basal septal thinning', 'Regional wall motion abnormality', 'Reduced LVEF'],
      ct_mri: ['Patchy mid-wall/subepicardial LGE (basal septum)', 'CMR is key for diagnosis and risk stratification'],
    },
    management: {
      primary: ['Immunosuppression (corticosteroids ± steroid-sparing agents) for active inflammation', 'Continue GDMT for heart failure', 'Device therapy for conduction disease / arrhythmia'],
      secondary: ['ICD for high-risk (LVEF ≤35%, or documented VT)', 'Catheter ablation for refractory VT'],
    },
    pearls: ['Any young patient with unexplained AV block should raise suspicion of cardiac sarcoidosis.', 'CMR and FDG PET are complementary: scar vs active inflammation.'],
    redFlags: ['Advanced AV block', 'Sustained VT / cardiac arrest', 'Heart failure with reduced EF'],
    differentialDiagnosis: ['ARVC', 'Dilated cardiomyopathy', 'Myocarditis', 'Amyloidosis'],
    source: 'HRS Expert Consensus / ESC 2022 VA-SCD',
    lastUpdated: '2024'
  },
  {
    id: 'hypertension',
    name: 'Hypertension (systemic arterial)',
    category: 'Vascular',
    summary: 'Persistent elevation of systemic blood pressure, the most prevalent modifiable cardiovascular risk factor.',
    pathophysiology: 'Multifactorial: increased sympathetic tone, RAAS activation, sodium retention and vascular remodelling raise peripheral resistance and blood pressure, driving target-organ damage.',
    labDeviations: [
      { label: 'Renal function/eGFR', value: 'Target-organ damage', direction: '±' },
      { label: 'K+', value: 'Hypokalaemia suggests primary aldosteronism', direction: '↓' },
      { label: 'Urine albumin/creatinine', value: 'Raised = target-organ damage', direction: '↑' },
      { label: 'Lipids/glucose', value: 'Total cardiovascular risk', direction: '±' }
    ],
    pathogenesis: [
      { stage: 'Mechanism', text: 'Increased sympathetic tone and RAAS activation.' },
      { stage: 'Sodium', text: 'Sodium and water retention.' },
      { stage: 'Remodelling', text: 'Vascular remodelling raises peripheral resistance.' },
      { stage: 'Load', text: 'Increased afterload causes left ventricular hypertrophy.' },
      { stage: 'Consequence', text: 'Target-organ damage (heart, brain, kidney, retina).' }
    ],
    signs: [
      'Elevated repeated office blood pressure',
      'LV hypertrophy / diastolic dysfunction on echo',
      'Retinal changes',
      'Usually asymptomatic'
    ],
    etiology: ['Primary (essential) hypertension (90%)', 'Renal parenchymal disease', 'Renovascular disease (renal artery stenosis)', 'Primary aldosteronism', 'Phaeochromocytoma', 'Obstructive sleep apnoea', 'Drug/induced (NSAID, steroids, OCP)'],
    classifications: [
      { name: 'ESC 2024 grades', interpretation: 'Grade 1: 140-159/90-99; Grade 2: 160-179/100-109; Grade 3: ≥180/110 mmHg' },
    ],
    symptoms: ['Usually asymptomatic ("silent killer")', 'Headache (severe)', 'Visual disturbance', 'Epistaxis (unreliable)'],
    diagnosticCriteria: ['Office SBP ≥140 or DBP ≥90 mmHg on repeated measurement', 'Confirm with ambulatory or home BP monitoring', 'Assess target-organ damage and total cardiovascular risk'],
    diagnosticAlgorithm: ['Confirm diagnosis (ABPM/HBPM)', 'Assess target-organ damage and cardiovascular risk', 'Screen for secondary causes', 'Lifestyle + pharmacological therapy'],
    ekgFindings: ['LVH with or without strain', 'Left atrial enlargement', 'Conduction abnormalities'],
    imaging: {
      echo: ['Concentric LV hypertrophy', 'Diastolic dysfunction', 'Left atrial enlargement'],
    },
    management: {
      primary: ['Lifestyle: sodium restriction, weight loss, exercise, alcohol reduction, smoking cessation', 'Pharmacological: ACEi/ARB, calcium-channel blocker, or thiazide-like diuretic (often single-pill combination)', 'Most patients need combination therapy to reach target'],
      secondary: ['Resistant hypertension: add spironolactone', 'Treat secondary causes; renal denervation in selected-resistant cases'],
    },
    pearls: ['Home/ambulatory BP avoids white-coat and masked hypertension misclassification.', 'Most patients require two or more drugs to reach target.'],
    redFlags: ['Hypertensive emergency with target-organ damage', 'New onset severe hypertension in a young patient (secondary cause)', 'Aortic dissection'],
    differentialDiagnosis: ['White-coat hypertension', 'Secondary hypertension', 'Hypertensive urgency (no organ damage)'],
    source: 'ESC 2024 Hypertension Guidelines',
    lastUpdated: '2024'
  },

  // ===== Phase 4b content expansion =====
  {
    id: 'advanced-heart-failure',
    name: 'Advanced Heart Failure (MCS & Transplant)',
    category: 'Heart Failure',
    summary: 'End-stage heart failure requiring inotropes, durable mechanical circulatory support, or transplantation.',
    pathophysiology: 'Progressive pump failure with persistent congestion and/or hypoperfusion despite optimal guideline-directed therapy leads to end-organ dysfunction and refractory symptoms.',
    labDeviations: [
      { label: 'NT-proBNP', value: 'Markedly raised', direction: '↑' },
      { label: 'Creatinine/eGFR', value: 'Cardiorenal impairment', direction: '↑' },
      { label: 'Lactate', value: 'Raised with hypoperfusion', direction: '↑' },
      { label: 'Liver enzymes', value: 'Raised with congestion', direction: '↑' }
    ],
    pathogenesis: [
      { stage: 'Progression', text: 'Pump failure despite optimal therapy.' },
      { stage: 'Congestion', text: 'Persistent congestion and/or hypoperfusion.' },
      { stage: 'Organs', text: 'End-organ dysfunction (kidney, liver).' },
      { stage: 'Reserve', text: 'Low functional reserve (NYHA III-IV).' },
      { stage: 'Consequence', text: 'Need for mechanical support, transplant or palliation.' }
    ],
    signs: [
      'NYHA III-IV symptoms',
      'Refractory congestion',
      'Cool extremities and oliguria',
      'Recurrent hospitalisation'
    ],
    etiology: ['End-stage ischaemic or dilated cardiomyopathy', 'Valvular heart disease', 'Cardiac amyloidosis', 'Myocarditis sequelae', 'Adult congenital heart disease'],
    symptoms: ['NYHA III–IV symptoms', 'Refractory congestion', 'Hypoperfusion (cool extremities, oliguria)', 'Recurrent hospitalisations'],
    diagnosticCriteria: ['NYHA III–IV despite optimal GDMT', 'Severe LV dysfunction with recurrent hospitalisation or intolerance of GDMT', 'Assess INTERMACS profile for durable MCS candidacy'],
    diagnosticAlgorithm: ['Confirm advanced HF criteria', 'Assess right ventricular and end-organ function', 'Evaluate transplant / MCS candidacy', 'Consider inotropes as bridge or palliation'],
    ekgFindings: ['LBBB / wide QRS', 'Atrial fibrillation or ventricular arrhythmia', 'Low-voltage QRS'],
    imaging: {
      echo: ['Severe LV dilation with low LVEF', 'Right ventricular dysfunction (key for MCS)', 'Functional mitral/tricuspid regurgitation'],
      ct_mri: ['Late gadolinium enhancement for aetiology and scar'],
    },
    management: {
      primary: ['Optimise GDMT and achieve decongestion', 'Consider durable mechanical circulatory support (LVAD) in eligible patients', 'Heart transplantation for eligible candidates'],
      secondary: ['Inotropes for palliation or bridge-to-decision', 'Palliative and supportive care when not a candidate'],
    },
    pearls: ['Right ventricular function is the key determinant of durable MCS candidacy.', 'Reassess after 3 months of optimal therapy before committing to advanced options.'],
    redFlags: ['Cardiogenic shock', 'End-organ failure', 'Refractory ventricular arrhythmia'],
    differentialDiagnosis: ['Refractory HF due to non-adherence', 'Severe valvular disease', 'Restrictive cardiomyopathy'],
    source: 'ESC 2026 HF / ACC/AHA 2022 HF',
    lastUpdated: '2024'
  },
  {
    id: 'implanted-devices',
    name: 'Cardiac Implantable Electronic Devices',
    category: 'Arrhythmia',
    summary: 'Pacemakers, ICDs and CRT devices — indications, modes and follow-up.',
    pathophysiology: 'Devices deliver pacing (bradycardia or cardiac resynchronisation) or defibrillation (ventricular tachyarrhythmia); lead position and programmed mode determine the physiological effect.',
    labDeviations: [
      { label: 'Renal function', value: 'Baseline before contrast/lead procedures', direction: '±' },
      { label: 'INR', value: 'Within target if anticoagulated', direction: '±' },
      { label: 'CRP/ESR', value: 'Raised with device infection', direction: '↑' }
    ],
    pathogenesis: [
      { stage: 'Indication', text: 'Bradyarrhythmia, SCD risk or dyssynchrony.' },
      { stage: 'Pacing', text: 'Restores rate and AV synchrony (physiological pacing preferred).' },
      { stage: 'Defibrillation', text: 'ICD terminates VT/VF.' },
      { stage: 'Resynchronisation', text: 'CRT corrects delayed LV activation (LBBB).' },
      { stage: 'Consequence', text: 'Symptom and outcome benefit if correctly indicated and programmed.' }
    ],
    signs: [
      'Pacing spikes / paced rhythm',
      'Device interrogation findings',
      'LBBB with a wide QRS (CRT indication)',
      'Examination findings depend on the indication'
    ],
    etiology: ['Sinus node dysfunction or AV block (pacing)', 'Primary or secondary SCD prevention (ICD)', 'LBBB with reduced LVEF (CRT)'],
    symptoms: ['Syncope/bradycardia (pacing indication)', 'Heart failure symptoms (CRT indication)', 'SCD risk (ICD indication)'],
    diagnosticCriteria: ['Pacing: symptomatic bradycardia from SND or AV block', 'ICD: LVEF ≤35% NYHA II–III on GDMT, or prior VT/VF', 'CRT: symptomatic HFrEF with QRS ≥130 ms and LBBB'],
    diagnosticAlgorithm: ['Document the conduction abnormality or SCD risk', 'Assess LVEF, QRS duration and morphology', 'Select device and mode (DDD, VVI, CRT-D)', 'Program and arrange follow-up'],
    ekgFindings: ['Bradycardia or AV block', 'LBBB (CRT indication)', 'Wide QRS'],
    imaging: {
      echo: ['LVEF (ICD/CRT eligibility)', 'Right ventricular function', 'Mechanical dyssynchrony'],
    },
    management: {
      primary: ['Pacemaker for symptomatic sinus node dysfunction / AV block (prefer physiologic atrial pacing)', 'ICD for secondary prevention (post-VT/VF) or primary prevention (LVEF ≤35%)', 'CRT for HFrEF with LBBB and QRS ≥130–150 ms'],
      secondary: ['Device interrogation and optimisation at follow-up', 'Extraction of infected devices/leads'],
    },
    pearls: ['CRT benefit is greatest with LBBB and QRS ≥150 ms.', 'Not everyone with LVEF ≤35% needs an ICD — reassess after 3 months of GDMT.'],
    redFlags: ['Device infection / endocarditis', 'Appropriate or inappropriate shocks', 'Lead failure'],
    differentialDiagnosis: ['Syncope unrelated to bradyarrhythmia', 'Reversible cause of LV dysfunction'],
    source: 'ESC 2022 VA/SCD; ESC 2026 HF; ACC/AHA/HRS 2018 Bradycardia',
    lastUpdated: '2024'
  },
  {
    id: 'coronary-revascularization',
    name: 'Coronary Revascularization (PCI vs CABG)',
    category: 'Ischemic',
    summary: 'Selecting PCI or CABG for significant coronary artery disease.',
    pathophysiology: 'Revascularisation relieves ischaemia and improves prognosis in selected anatomy; the optimal modality depends on disease complexity, LV function and comorbidity.',
    labDeviations: [
      { label: 'Troponin', value: 'Rise indicates peri-procedural MI', direction: '↑' },
      { label: 'LDL-C', value: 'Target <1.4 mmol/L', direction: '↓' },
      { label: 'Creatinine/eGFR', value: 'Baseline before contrast', direction: '±' }
    ],
    pathogenesis: [
      { stage: 'Anatomy', text: 'Obstructive coronary artery disease.' },
      { stage: 'Ischaemia', text: 'Revascularisation relieves ischaemia.' },
      { stage: 'Modality', text: 'Complexity and LV function decide PCI vs CABG.' },
      { stage: 'Survival', text: 'CABG improves survival in high-complexity left main / multivessel disease.' },
      { stage: 'Consequence', text: 'Complete revascularisation plus medical therapy.' }
    ],
    signs: [
      'Ischaemia on stress testing',
      'Significant stenosis on angiography',
      'Angina refractory to medical therapy',
      'LV dysfunction (prognostic)'
    ],
    etiology: ['Obstructive coronary artery disease', 'Multivessel disease', 'Left main disease', 'Diabetes with multivessel disease'],
    symptoms: ['Angina refractory to medical therapy', 'Ischaemia on stress testing', 'Heart failure with ischaemic cardiomyopathy'],
    diagnosticCriteria: ['Significant stenosis with symptoms or documented ischaemia', 'Anatomical complexity (SYNTAX score) guides the modality'],
    diagnosticAlgorithm: ['Confirm ischaemia and anatomy', 'Calculate SYNTAX score', 'Heart-Team decision: PCI vs CABG', 'Best medical therapy in all patients'],
    ekgFindings: ['Ischaemic ST/T changes', 'Pathological Q waves (prior MI)', 'LVH'],
    imaging: {
      echo: ['LVEF for prognosis and surgical risk'],
      ct_mri: ['CCTA for anatomy', 'CT for surgical planning if CABG considered'],
    },
    management: {
      primary: ['CABG over PCI for high-complexity left main or multivessel disease, especially with diabetes', 'PCI for lower-complexity disease or acute presentations', 'Complete revascularisation where feasible'],
      secondary: ['Antiplatelet therapy per ACS/CCS protocols', 'Optimise GDMT and risk factors'],
    },
    pearls: ['CABG improves survival over PCI in high-complexity left main disease.', 'Involve the Heart Team for complex or ambiguous cases.'],
    redFlags: ['Left main or three-vessel disease', 'Ischaemic cardiomyopathy', 'Ongoing ischaemia'],
    differentialDiagnosis: ['Non-obstructive coronary artery disease (INOCA)', 'Microvascular angina'],
    source: 'ACC/AHA/SCAI 2021 Revascularization; ESC 2024 CCS',
    lastUpdated: '2024'
  },
  {
    id: 'prosthetic-valve-management',
    name: 'Prosthetic Heart Valve Management',
    category: 'Structural',
    summary: 'Antithrombotic therapy, monitoring and complications of prosthetic heart valves.',
    pathophysiology: 'Mechanical valves are thrombogenic without anticoagulation; bioprostheses degenerate over time. Prosthetic valve thrombosis and endocarditis are the key complications.',
    labDeviations: [
      { label: 'INR', value: 'Target per valve (2.5-3.5 for mitral)', direction: '±' },
      { label: 'Lactate dehydrogenase', value: 'Raised with haemolysis (paravalvular leak)', direction: '↑' },
      { label: 'Blood cultures', value: 'Positive in endocarditis', direction: '↑' }
    ],
    pathogenesis: [
      { stage: 'Material', text: 'Mechanical (thrombogenic) or bioprosthetic (degenerative).' },
      { stage: 'Thrombosis', text: 'Mechanical valves require anticoagulation.' },
      { stage: 'Dysfunction', text: 'Thrombosis, pannus or structural degeneration.' },
      { stage: 'Infection', text: 'Prosthetic valve endocarditis.' },
      { stage: 'Consequence', text: 'Embolism, obstruction or regurgitation.' }
    ],
    signs: [
      'New or changed murmur',
      'Increased trans-prosthetic gradient',
      'Embolic events',
      'Fever (endocarditis)'
    ],
    etiology: ['Mechanical valve (thrombogenic)', 'Bioprosthetic valve (degeneration)', 'Transcatheter valve prosthesis'],
    symptoms: ['Dyspnoea / reduced exercise tolerance', 'Embolic events', 'Change in murmur'],
    diagnosticCriteria: ['Mechanical valve: lifelong anticoagulation required', 'Prosthetic valve thrombosis: increased gradients with thrombus on imaging', 'Prosthetic valve endocarditis: modified Duke criteria'],
    diagnosticAlgorithm: ['Assess valve function (echo/fluoroscopy)', 'Ensure anticoagulation intensity (INR) for mechanical valves', 'Evaluate for thrombosis or endocarditis if dysfunction'],
    ekgFindings: ['Often non-specific', 'Arrhythmias (especially atrial fibrillation)'],
    imaging: {
      echo: ['Trans-prosthetic gradients', 'Leaflet mobility, thrombus vs pannus', 'TEE for thrombosis and endocarditis'],
      ct_mri: ['Fluoroscopy for mechanical disc mobility'],
    },
    management: {
      primary: ['Mechanical valve: warfarin (INR 2.5–3.5 for mitral or older designs); DOACs are contraindicated', 'Bioprosthesis: aspirin, with anticoagulation for the first 3 months if indicated', 'Prosthetic valve thrombosis: anticoagulation, thrombolysis or surgery'],
      secondary: ['Prosthetic valve endocarditis: surgery for heart failure, abscess or dehiscence', 'Serial imaging follow-up'],
    },
    pearls: ['DOACs must not be used with mechanical valves.', 'A new murmur or embolism with a prosthetic valve suggests thrombosis or endocarditis.'],
    redFlags: ['Prosthetic valve thrombosis with obstruction', 'Prosthetic valve endocarditis with heart failure', 'Embolic events'],
    differentialDiagnosis: ['Degenerative native valve disease', 'Prosthetic valve dehiscence'],
    source: 'ESC/EACTS 2025 VHD; ESC 2023 Endocarditis',
    lastUpdated: '2024'
  },
  {
    id: 'cardio-oncology',
    name: 'Cardio-Oncology (Cancer Therapy Cardiotoxicity)',
    category: 'Other',
    summary: 'Cardiovascular toxicity of cancer therapy (anthracyclines, HER2- and VEGF-targeted agents, checkpoint inhibitors).',
    pathophysiology: 'Type I (anthracycline) and type II (HER2) cardiotoxicity, vascular toxicity and immune-mediated myocarditis cause LV dysfunction, hypertension or arrhythmia.',
    labDeviations: [
      { label: 'Troponin', value: 'Raised = early cardiotoxicity', direction: '↑' },
      { label: 'NT-proBNP', value: 'Raised', direction: '↑' },
      { label: 'eGFR', value: 'Baseline and during therapy', direction: '±' }
    ],
    pathogenesis: [
      { stage: 'Exposure', text: 'Anthracyclines, HER2- or VEGF-targeted agents, checkpoint inhibitors.' },
      { stage: 'Mechanism', text: 'Type I or type II toxicity; immune-mediated myocarditis.' },
      { stage: 'Myocardium', text: 'LV dysfunction, hypertension and arrhythmia.' },
      { stage: 'Detection', text: 'Global longitudinal strain declines before LVEF falls.' },
      { stage: 'Consequence', text: 'Cancer-therapy-related cardiac dysfunction.' }
    ],
    signs: [
      'LVEF decline of 10% or more to below 53%',
      'Raised troponin or natriuretic peptides',
      'Hypertension (VEGF inhibitors)',
      'Myocarditis (checkpoint inhibitors)'
    ],
    etiology: ['Anthracyclines', 'HER2-targeted therapy (trastuzumab)', 'VEGF inhibitors (hypertension)', 'Checkpoint inhibitors (myocarditis)', 'Radiotherapy to the chest'],
    symptoms: ['Exertional dyspnoea', 'Heart failure signs', 'Chest pain / hypertension', 'Asymptomatic LVEF decline'],
    diagnosticCriteria: ['Cancer-therapy-related cardiac dysfunction: LVEF decline ≥10% to <53%', 'Elevated troponin / natriuretic peptides', 'Checkpoint-inhibitor myocarditis: troponin rise with CMR findings'],
    diagnosticAlgorithm: ['Baseline cardiovascular risk assessment and echocardiography', 'Serial troponin/echo during therapy in high-risk patients', 'Manage according to the cardiotoxicity mechanism'],
    ekgFindings: ['Non-specific ST/T changes', 'Arrhythmias (including QTc prolongation)', 'Conduction abnormalities'],
    imaging: {
      echo: ['LVEF (global longitudinal strain is more sensitive)', 'Diastolic function'],
      ct_mri: ['CMR for myocarditis and scar characterisation'],
    },
    management: {
      primary: ['Type I cardiotoxicity: ACE inhibitor/ARB plus beta-blocker; consider dexrazoxane for anthracyclines', 'Cardio-oncology co-management', 'Hold the offending agent if LVEF falls significantly'],
      secondary: ['Control hypertension from VEGF inhibitors', 'Immunosuppression for checkpoint-inhibitor myocarditis', 'Resume therapy after LV recovery if clinically needed'],
    },
    pearls: ['Global longitudinal strain detects cardiotoxicity before LVEF falls.', 'Checkpoint-inhibitor myocarditis is rare but highly lethal — treat with high-dose steroids.'],
    redFlags: ['Symptomatic heart failure during therapy', 'Checkpoint-inhibitor myocarditis', 'Severe hypertension'],
    differentialDiagnosis: ['Pre-existing cardiomyopathy', 'Ischaemic heart disease', 'Cancer-related cardiac compression'],
    source: 'ESC 2022 Cardio-Oncology Guidelines',
    lastUpdated: '2024'
  },
  {
    id: 'athlete-sports-cardiology',
    name: "Athlete's Heart & Sports Cardiology",
    category: 'Other',
    summary: "Distinguishing physiological athlete's heart from cardiomyopathy, and screening for sudden cardiac death risk.",
    pathophysiology: 'Chronic training causes physiological LV/RV enlargement, bradycardia and repolarisation changes that can mimic cardiomyopathy; recognising pathological patterns prevents SCD in athletes.',
    labDeviations: [
      { label: 'Haemoglobin', value: 'Normal (exclude anaemia)', direction: '±' },
      { label: 'Ferritin', value: 'Low in athlete iron deficiency', direction: '↓' },
      { label: 'Electrolytes', value: 'Normal', direction: '±' }
    ],
    pathogenesis: [
      { stage: 'Adaptation', text: 'Chronic training causes physiological LV/RV enlargement.' },
      { stage: 'Autonomic', text: 'Bradycardia and repolarisation changes.' },
      { stage: 'Mimicry', text: 'Can mimic cardiomyopathy or channelopathy.' },
      { stage: 'Risk', text: 'A pathological substrate risks sudden cardiac death.' },
      { stage: 'Consequence', text: 'Screening distinguishes physiological from pathological.' }
    ],
    signs: [
      'Sinus bradycardia and first-degree AV block (normal)',
      'Early repolarisation (normal)',
      'Physiological LV/RV enlargement',
      'Pathological: deep T-wave inversion, epsilon wave, long QT'
    ],
    etiology: ['Physiological adaptation in trained athletes', 'Underlying cardiomyopathy or channelopathy', 'Commotio cordis', 'Coronary artery anomalies'],
    symptoms: ['Usually asymptomatic', 'Exertional syncope (pathological)', 'Palpitations', 'Family history of SCD'],
    diagnosticCriteria: ['International athlete ECG criteria: training-related vs pathological', 'Detraining test for LV/RV hypertrophy', 'Exercise testing and family screening if abnormal'],
    diagnosticAlgorithm: ['Pre-participation screening (history, examination, ECG)', 'Identify pathological ECG patterns', 'Advanced testing (echo, CMR, exercise test)', 'Detraining trial'],
    ekgFindings: ['Sinus bradycardia and first-degree AV block (normal)', 'Early repolarisation (normal)', 'Isolated voltage criteria for LVH', 'Pathological: deep T-wave inversion, epsilon wave, Brugada, long QT, pathological Q waves'],
    imaging: {
      echo: ['Physiological LV/RV enlargement (end-diastolic dimension <60 mm)', 'Reduction with detraining'],
      ct_mri: ['CMR to exclude structural disease when echocardiography is equivocal'],
    },
    management: {
      primary: ['Reassure and allow continued sport when physiological', 'Restrict from competitive sport for cardiomyopathies and channelopathies per guidelines', 'Treat the underlying condition'],
      secondary: ['Shared decision-making on return to play', 'Family screening for inherited disease', 'AED availability and emergency action plans'],
    },
    pearls: ["Exertional syncope is pathological until proven otherwise.", "Athlete's heart regresses with detraining; pathological remodelling does not."],
    redFlags: ['Exertional syncope', 'Family history of SCD', 'Pathological ECG patterns'],
    differentialDiagnosis: ['HCM', 'ARVC', 'Dilated cardiomyopathy', 'Hypertensive heart disease'],
    source: 'ESC 2020 Sports Cardiology Guidelines',
    lastUpdated: '2024'
  },
  {
    id: 'cardiometabolic-ckm',
    name: 'Cardiometabolic Risk & CKM Syndrome',
    category: 'Vascular',
    summary: 'The overlap of obesity, diabetes, chronic kidney disease and cardiovascular disease (cardiovascular-kidney-metabolic syndrome).',
    pathophysiology: 'Clustered metabolic risk factors drive inflammation, insulin resistance and atherosclerosis; the CKM spectrum links obesity, diabetes, CKD and CVD with shared organ-protective therapies.',
    labDeviations: [
      { label: 'HbA1c', value: 'Dysglycaemia', direction: '↑' },
      { label: 'eGFR / urine ACR', value: 'CKD staging', direction: '±' },
      { label: 'LDL-C', value: 'Target-driven', direction: '↓' }
    ],
    pathogenesis: [
      { stage: 'Cluster', text: 'Obesity, dysglycaemia, dyslipidaemia and hypertension.' },
      { stage: 'Mechanism', text: 'Inflammation and insulin resistance.' },
      { stage: 'Atherosclerosis', text: 'Accelerated atherosclerotic cardiovascular disease.' },
      { stage: 'Overlap', text: 'Cardiorenal-metabolic continuum.' },
      { stage: 'Consequence', text: 'Shared organ-protective therapies benefit heart, kidneys and metabolism.' }
    ],
    signs: [
      'Central obesity',
      'Elevated blood pressure',
      'Reduced eGFR or albuminuria',
      'Signs of heart failure (HFpEF)'
    ],
    etiology: ['Obesity / metabolic syndrome', 'Type 2 diabetes mellitus', 'Chronic kidney disease', 'Physical inactivity', 'Genetic predisposition'],
    symptoms: ['Often asymptomatic', 'Exertional symptoms', 'Features of heart failure or CKD'],
    diagnosticCriteria: ['Clustered metabolic risk factors (obesity, dysglycaemia, dyslipidaemia, hypertension)', 'CKD by eGFR and albuminuria', 'ASCVD risk estimation (SCORE2 / PREVENT)'],
    diagnosticAlgorithm: ['Assign CKM stage 0–4', 'Assess ASCVD risk and kidney function', 'Treat with shared, organ-protective therapies'],
    ekgFindings: ['Left ventricular hypertrophy', 'Non-specific ST/T changes'],
    imaging: {
      echo: ['LV hypertrophy / diastolic dysfunction'],
    },
    management: {
      primary: ['SGLT2 inhibitors and GLP-1 receptor agonists (with or without diabetes) for heart/kidney/atherosclerosis benefit', 'Statin for lipid lowering', 'Blood-pressure control to target', 'Lifestyle and weight management'],
      secondary: ['Finerenone for albuminuric diabetic CKD', 'Treat obstructive sleep apnoea'],
    },
    pearls: ['SGLT2 inhibitors and GLP-1 receptor agonists benefit the heart, kidneys and metabolism together.', 'Obesity is a modifiable driver of HFpEF and atrial fibrillation.'],
    redFlags: ['Established ASCVD', 'Progressive CKD', 'Heart failure'],
    differentialDiagnosis: ['Primary dyslipidaemia', 'Secondary hypertension', 'Genetic obesity syndromes'],
    source: 'ESC Diabetes & CVD Guidelines; ACC/AHA CKM',
    lastUpdated: '2024'
  },
  {
    id: 'obstructive-sleep-apnoea',
    name: 'Obstructive Sleep Apnoea & CVD',
    category: 'Other',
    summary: 'Recurrent upper-airway obstruction during sleep, associated with hypertension, atrial fibrillation, heart failure and stroke.',
    pathophysiology: 'Intermittent hypoxaemia and sympathetic surges from apnoeas raise blood pressure, provoke arrhythmia and worsen heart failure.',
    labDeviations: [
      { label: 'ABG / O2 saturation', value: 'Hypoxaemia/hypercapnia', direction: '↓' },
      { label: 'Bicarbonate', value: 'Raised = metabolic compensation', direction: '↑' },
      { label: 'Haemoglobin', value: 'Raised = secondary polycythaemia', direction: '↑' }
    ],
    pathogenesis: [
      { stage: 'Trigger', text: 'Upper-airway obstruction during sleep.' },
      { stage: 'Hypoxaemia', text: 'Intermittent hypoxaemia and sympathetic surges.' },
      { stage: 'Pressure', text: 'Blood-pressure rises; nocturnal bradyarrhythmia.' },
      { stage: 'Arrhythmia', text: 'Atrial fibrillation and heart-failure worsening.' },
      { stage: 'Consequence', text: 'Resistant hypertension, atrial fibrillation and stroke.' }
    ],
    signs: [
      'Loud snoring with witnessed apnoeas',
      'Daytime somnolence',
      'Non-dipping blood-pressure pattern',
      'Nocturnal arrhythmia'
    ],
    etiology: ['Obesity', 'Male sex and older age', 'Upper-airway anatomy', 'Alcohol and sedatives'],
    symptoms: ['Loud snoring', 'Witnessed apnoeas', 'Daytime somnolence', 'Morning headache'],
    diagnosticCriteria: ['Apnoea-hypopnoea index ≥5 with symptoms, or ≥15 regardless of symptoms', 'Home sleep apnoea testing or polysomnography'],
    diagnosticAlgorithm: ['Screen (STOP-BANG) in AF, HF and resistant hypertension', 'Confirm with a sleep study', 'Treat (CPAP, weight loss)', 'Reassess arrhythmia and HF control'],
    ekgFindings: ['Nocturnal bradyarrhythmias', 'Atrial fibrillation / flutter', 'Non-dipping blood-pressure pattern'],
    imaging: {
      echo: ['Assess for heart failure and pulmonary hypertension'],
    },
    management: {
      primary: ['Continuous positive airway pressure (CPAP)', 'Weight loss and lifestyle modification', 'Avoid alcohol and sedatives at night'],
      secondary: ['Mandibular advancement device or surgery in selected cases', 'Optimise AF and HF management'],
    },
    pearls: ['OSA is a reversible driver of atrial fibrillation and resistant hypertension.', 'Screen for OSA in patients with AF and HFpEF.'],
    redFlags: ['Severe daytime somnolence (driving risk)', 'Significant nocturnal hypoxaemia', 'Associated pulmonary hypertension'],
    differentialDiagnosis: ['Central sleep apnoea', 'Obesity hypoventilation syndrome', 'Cheyne-Stokes respiration'],
    source: 'ESC AF/HF Guidelines; sleep medicine consensus',
    lastUpdated: '2024'
  },
  {
    id: 'cardiac-tumours',
    name: 'Cardiac Tumours',
    category: 'Other',
    summary: 'Primary (benign or malignant) and metastatic cardiac tumours.',
    pathophysiology: 'The majority are benign (myxoma) or metastatic; they cause intracardiac obstruction, embolism, arrhythmia or pericardial effusion.',
    labDeviations: [
      { label: 'CRP/ESR', value: 'Raised with inflammation', direction: '↑' },
      { label: 'LDH', value: 'Raised in malignant tumours', direction: '↑' },
      { label: 'Tumour markers', value: 'Guided by the suspected type', direction: '±' }
    ],
    pathogenesis: [
      { stage: 'Substrate', text: 'Primary (myxoma) or metastatic tumour.' },
      { stage: 'Mass', text: 'Intracardiac mass effect.' },
      { stage: 'Obstruction', text: 'Inflow or outflow obstruction.' },
      { stage: 'Embolism', text: 'A friable tumour embolises.' },
      { stage: 'Consequence', text: 'Obstruction, embolism, arrhythmia or effusion.' }
    ],
    signs: [
      'Cardiac murmur or tumour plop',
      'Embolic events',
      'Constitutional symptoms',
      'Pericardial effusion'
    ],
    etiology: ['Myxoma (most common primary benign)', 'Angiosarcoma / rhabdomyosarcoma (malignant)', 'Metastatic (lung, breast, melanoma, lymphoma)', 'Thrombus (common mimic)'],
    symptoms: ['Obstruction (syncope, dyspnoea)', 'Embolic events', 'Arrhythmias', 'Constitutional symptoms'],
    diagnosticCriteria: ['Echo/CMR mass with characteristic location and attachment', 'Malignant features: broad base, local extension, pericardial effusion'],
    diagnosticAlgorithm: ['Echocardiography (first-line)', 'CMR/CT for tissue characterisation', 'Biopsy and staging', 'Multidisciplinary team review'],
    ekgFindings: ['Often non-specific', 'Arrhythmias', 'Conduction changes'],
    imaging: {
      echo: ['Mass with attachment and mobility', 'Myxoma: left atrial septum, pedicled'],
      ct_mri: ['CMR tissue characterisation and LGE', 'CT for extent, calcification and metastasis'],
    },
    management: {
      primary: ['Surgical resection of benign tumours (myxoma)', 'Multidisciplinary management of malignant or metastatic tumours', 'Anticoagulation for thromboembolic risk'],
      secondary: ['Chemotherapy or radiotherapy for malignant primaries', 'Palliation for advanced disease'],
    },
    pearls: ['Myxoma is the most common primary cardiac tumour and recurs if incompletely excised.', 'A cardiac mass in a patient with cancer is far more likely metastatic than primary.'],
    redFlags: ['Embolic events', 'Intracardiac obstruction', 'Pericardial effusion with tamponade'],
    differentialDiagnosis: ['Cardiac thrombus', 'Vegetation', 'Infiltrative cardiomyopathy'],
    source: 'ESC Cardio-Oncology; cardiac tumour literature',
    lastUpdated: '2024'
  },
  {
    id: 'geriatric-cardiology',
    name: 'Geriatric Cardiology',
    category: 'Other',
    summary: 'Cardiovascular care in older adults, balancing guideline therapy against frailty, polypharmacy and life expectancy.',
    pathophysiology: 'Age-related vascular and myocardial stiffening, reduced physiological reserve and multimorbidity shift the balance of benefit and harm for cardiovascular therapies.',
    labDeviations: [
      { label: 'eGFR', value: 'Low with age/renal impairment', direction: '↓' },
      { label: 'Albumin', value: 'Low in frailty/malnutrition', direction: '↓' },
      { label: 'Electrolytes', value: 'Monitor diuretic therapy', direction: '±' }
    ],
    pathogenesis: [
      { stage: 'Mechanism', text: 'Age-related vascular and myocardial stiffening.' },
      { stage: 'Reserve', text: 'Reduced physiological reserve.' },
      { stage: 'Multimorbidity', text: 'Multimorbidity and polypharmacy.' },
      { stage: 'Presentation', text: 'Atypical presentations (falls, delirium).' },
      { stage: 'Consequence', text: 'Shifts the balance of benefit and harm.' }
    ],
    signs: [
      'Atypical presentation (falls, delirium, fatigue)',
      'Frailty',
      'Polypharmacy with drug interactions',
      'Orthostatic hypotension'
    ],
    etiology: ['Advanced age', 'Frailty and sarcopenia', 'Multimorbidity', 'Polypharmacy', 'Cognitive impairment'],
    symptoms: ['Atypical presentation (falls, delirium, fatigue)', 'Exertional dyspnoea', 'Syncope and falls'],
    diagnosticCriteria: ['Comprehensive geriatric assessment (frailty, cognition, function)', 'Estimate life expectancy and clarify goals of care', 'Assess falls and orthostatic blood pressure'],
    diagnosticAlgorithm: ['Assess frailty and life expectancy', 'Review and deprescribe medications', 'Choose goal-directed vs symptom-directed therapy', 'Shared decision-making'],
    ekgFindings: ['Conduction disease', 'Atrial fibrillation', 'Non-specific ST/T changes'],
    imaging: {
      echo: ['Aortic stenosis severity (TAVI decisions)', 'Diastolic dysfunction'],
    },
    management: {
      primary: ['Individualise therapy to frailty and life expectancy', 'Deprescribe non-beneficial or harmful drugs', 'Treat symptomatic aortic stenosis with TAVI/SAVR in eligible patients'],
      secondary: ['Fall-prevention and orthostatic management', 'Anticoagulation in the elderly balancing bleeding and stroke risk'],
    },
    pearls: ['Atypical presentations (falls, delirium) are common in older patients with ACS and heart failure.', 'Frailty, not chronological age alone, should guide the intensity of intervention.'],
    redFlags: ['Falls and syncope', 'Delirium', 'Polypharmacy with drug interactions'],
    differentialDiagnosis: ['Deconditioning', 'Depression', 'Cognitive impairment'],
    source: 'ESC/AHA cardiovascular care in older adults',
    lastUpdated: '2024'
  },
  {
    id: 'non-invasive-testing',
    name: 'Non-invasive Cardiac Testing',
    category: 'Other',
    summary: 'Stress testing, CT, nuclear and MR modalities for ischaemia detection and risk stratification.',
    pathophysiology: 'Modalities detect ischaemia (exercise/dobutamine stress, perfusion) or anatomy (CCTA, CT-FFR); cardiac MR characterises tissue. Modality choice depends on pre-test probability, exercise capacity and local expertise.',
    labDeviations: [
      { label: 'Troponin', value: 'Raised = myocardial injury', direction: '↑' },
      { label: 'LDL-C', value: 'Risk stratification / target', direction: '↓' },
      { label: 'Creatinine/eGFR', value: 'Before contrast (CCTA)', direction: '±' }
    ],
    pathogenesis: [
      { stage: 'Choice', text: 'Pre-test probability drives modality selection.' },
      { stage: 'Ischaemia', text: 'Functional tests detect inducible ischaemia.' },
      { stage: 'Anatomy', text: 'CCTA detects stenosis; CT-FFR assesses significance.' },
      { stage: 'Tissue', text: 'CMR characterises tissue and viability.' },
      { stage: 'Consequence', text: 'Informs risk stratification and treatment.' }
    ],
    signs: [
      'Exercise-induced ST depression',
      'Inducible wall-motion or perfusion defect',
      'CCTA stenosis and plaque',
      'Reduced global longitudinal strain for early dysfunction'
    ],
    etiology: ['Suspected stable chest pain', 'Risk stratification in known CAD', 'Myocardial viability assessment', 'Cardiomyopathy characterisation'],
    symptoms: ['Exertional chest pain', 'Dyspnoea', 'Pre-operative risk assessment'],
    diagnosticCriteria: ['Pre-test probability drives test selection', 'Exercise ECG requires an interpretable baseline ECG and adequate exercise capacity', 'CCTA has the highest negative predictive value for anatomical exclusion'],
    diagnosticAlgorithm: ['Estimate pre-test probability', 'Choose anatomical (CCTA) vs functional (stress) testing', 'Add CT-FFR for intermediate CCTA stenosis', 'Cardiac MR for tissue characterisation and viability'],
    ekgFindings: ['Exercise-induced ST-segment depression', 'Stress-induced arrhythmia or hypotension'],
    imaging: {
      echo: ['Stress echo: inducible wall-motion abnormality'],
      ct_mri: ['CCTA: stenosis severity and plaque characterisation', 'CT-FFR for functional significance of intermediate lesions', 'Stress CMR/PET: perfusion defects and viability', 'CMR mapping and LGE for infiltration and scar'],
    },
    management: {
      primary: ['Anatomical testing (CCTA ± CT-FFR) for lower/intermediate risk', 'Functional stress imaging for intermediate-high risk or known CAD', 'Stress CMR or PET where available for ischaemia and viability'],
      secondary: ['Strain imaging (global longitudinal strain) for early LV dysfunction', 'CMR mapping/LGE for cardiomyopathy and infiltration'],
    },
    pearls: ['CCTA has a high negative predictive value but is limited by heavy calcification and arrhythmia.', 'Global longitudinal strain detects subclinical LV dysfunction before LVEF falls.'],
    redFlags: ['High-risk ischaemia (left main or three-vessel disease)', 'Exercise-induced arrhythmia or hypotension'],
    differentialDiagnosis: ['Non-cardiac chest pain', 'Microvascular angina'],
    source: 'ESC 2024 CCS; AHA/ACC 2021 Chest Pain',
    lastUpdated: '2024'
  },
  {
    id: 'atherosclerosis',
    name: 'Atherosclerosis',
    category: 'Vascular',
    summary: 'Chronic inflammatory disease of the arterial wall, driven by lipid accumulation in the intima, that underlies coronary, cerebrovascular and peripheral arterial disease.',
    pathophysiology: 'Endothelial dysfunction permits LDL retention and oxidation in the intima; monocyte recruitment and macrophage foam-cell formation create a fatty streak that matures into a fibrous plaque. Thin-cap, lipid-rich plaques are rupture-prone and cause acute thrombosis.',
    pathogenesis: [
      { stage: 'Endothelium', text: 'Endothelial dysfunction with LDL retention and oxidation.' },
      { stage: 'Inflammation', text: 'Monocyte recruitment and foam-cell formation.' },
      { stage: 'Plaque', text: 'A fatty streak matures into a fibrous plaque.' },
      { stage: 'Vulnerability', text: 'A thin-cap, lipid-rich plaque is rupture-prone.' },
      { stage: 'Consequence', text: 'Rupture causes acute thrombosis (acute coronary syndrome).' }
    ],
    signs: [
      'Usually asymptomatic for decades',
      'Reduced peripheral pulses (PAD)',
      'Bruit over affected arteries',
      'Organ-specific ischaemia later'
    ],
    etiology: [
      'Elevated LDL-C',
      'Hypertension',
      'Smoking',
      'Diabetes / insulin resistance',
      'Age and male sex',
      'Family history / raised Lp(a)',
      'Chronic inflammation'
    ],
    classifications: [
      { name: 'Plaque phenotype', interpretation: 'Stable (fibrous, calcified) vs vulnerable (thin-cap fibroatheroma)' },
      { name: 'Clinical forms', interpretation: 'Coronary (IHD), cerebrovascular, peripheral (PAD), aortic' }
    ],
    symptoms: [
      'Often asymptomatic for decades',
      'Exertional angina (coronary)',
      'Intermittent claudication (peripheral)',
      'TIA / stroke (cerebrovascular)'
    ],
    diagnosticCriteria: [
      'Clinical presentation within an arterial bed.',
      'Imaging: CCTA, carotid/duplex ultrasound, ankle-brachial index.',
      'Risk stratification with SCORE2 and a lipid panel.'
    ],
    diagnosticAlgorithm: [
      'Assess symptoms by vascular bed',
      'Risk score (SCORE2) + lipid panel',
      'Targeted imaging (CCTA / duplex / ABI)',
      'Assess total atherosclerotic burden'
    ],
    labDeviations: [
      { label: 'LDL-C', value: 'Target <1.4 mmol/L (<55 mg/dL) in established ASCVD', isCritical: false },
      { label: 'Lp(a)', value: 'Measure once — high level is a risk enhancer', isCritical: false },
      { label: 'hs-CRP', value: 'May refine risk assessment', isCritical: false }
    ],
    imaging: {
      echo: [],
      ct_mri: [
        'CCTA — coronary plaque and stenosis.',
        'CT/MR angiography — aortic and peripheral arterial disease.'
      ],
      cxr: []
    },
    management: {
      primary: [
        'Lifestyle: smoking cessation, diet, regular exercise.',
        'High-intensity statin to an LDL-C goal of <1.4 mmol/L (<55 mg/dL) in established ASCVD.',
        'Antiplatelet therapy when clinically manifest.'
      ],
      secondary: [
        'Add ezetimibe, then a PCSK9 inhibitor if the goal is not met.',
        'Control blood pressure and diabetes (SGLT2i / GLP-1 RA).',
        'Bempedoic acid in statin-intolerant patients.'
      ]
    },
    pearls: [
      'Atherosclerosis is a systemic disease — one vascular bed often implies others.',
      'Plaque rupture rather than stenosis severity causes most acute events.',
      'Lowering LDL-C reduces events irrespective of the baseline level.'
    ],
    redFlags: [
      'Acute coronary syndrome',
      'Transient ischaemic attack / stroke',
      'Critical limb ischaemia'
    ],
    differentialDiagnosis: [
      'Vasculitis',
      'Fibromuscular dysplasia',
      'Aortic dissection',
      'Embolic source'
    ],
    source: 'ESC 2025 dyslipidaemia; ESC 2024 CCS',
    lastUpdated: '2026'
  },
  {
    id: 'cor-pulmonale',
    name: 'Cor Pulmonale (Chronic)',
    category: 'Heart Failure',
    summary: 'Right ventricular hypertrophy or dilatation caused by pulmonary hypertension resulting from diseases of the lungs or the respiratory mechanics.',
    pathophysiology: 'Chronic hypoxaemia and hypercapnia cause pulmonary vasoconstriction and vascular remodelling, raising pulmonary artery pressure; the right ventricle hypertrophies and eventually dilates and fails.',
    pathogenesis: [
      { stage: 'Cause', text: 'Chronic lung disease or hypoventilation.' },
      { stage: 'Hypoxaemia', text: 'Chronic hypoxaemia and hypercapnia.' },
      { stage: 'Vasoconstriction', text: 'Pulmonary vasoconstriction and vascular remodelling.' },
      { stage: 'Afterload', text: 'Raised pulmonary artery pressure causes RV hypertrophy.' },
      { stage: 'Consequence', text: 'Right ventricular dilatation and failure.' }
    ],
    signs: [
      'Raised JVP and peripheral oedema',
      'Right ventricular heave and loud P2',
      'Hepatomegaly',
      'Hypoxaemia'
    ],
    etiology: [
      'COPD',
      'Obstructive sleep apnoea / hypoventilation',
      'Interstitial lung disease / pulmonary fibrosis',
      'Cystic fibrosis / bronchiectasis',
      'Chest-wall deformity or neuromuscular disease'
    ],
    classifications: [
      { name: 'Course', interpretation: 'Acute cor pulmonale (e.g. massive PE) vs chronic cor pulmonale' },
      { name: 'PH group', interpretation: 'Group 3 (lung disease) of the ESC/ERS classification' }
    ],
    symptoms: [
      'Exertional dyspnoea',
      'Cyanosis',
      'Raised JVP and peripheral oedema',
      'Hepatomegaly, ascites'
    ],
    diagnosticCriteria: [
      'Underlying lung disease plus signs of right heart failure.',
      'Echocardiography: right ventricular hypertrophy/dilatation with raised pulmonary artery pressure.',
      'ECG right ventricular/atrial enlargement; prominent central pulmonary arteries on CXR.'
    ],
    diagnosticAlgorithm: [
      'Identify the underlying pulmonary disease',
      'ABG and pulmonary function tests',
      'Echocardiography for the right ventricle',
      'Exclude group 1 pulmonary arterial hypertension'
    ],
    labDeviations: [
      { label: 'BNP / NT-proBNP', value: '↑ with right ventricular failure', isCritical: false },
      { label: 'ABG', value: 'Hypoxaemia ± hypercapnia', isCritical: false }
    ],
    ekgFindings: [
      'Right ventricular hypertrophy.',
      'Right atrial enlargement (p pulmonale).',
      'Right axis deviation.',
      'Incomplete RBBB.'
    ],
    imaging: {
      echo: [
        'Right ventricular hypertrophy / dilatation.',
        'Estimated pulmonary artery pressure.',
        'Flattened interventricular septum.'
      ],
      ct_mri: [
        'CT for the underlying lung disease and pulmonary artery size.'
      ],
      cxr: [
        'Prominent central pulmonary arteries.',
        'Right ventricular enlargement.',
        'Signs of the underlying lung disease.'
      ]
    },
    management: {
      primary: [
        'Treat the underlying lung disease.',
        'Long-term oxygen therapy for chronic hypoxaemia.',
        'Diuretics for right heart congestion.'
      ],
      secondary: [
        'Cautious use of pulmonary vasodilators (risk of worsening gas exchange).',
        'Vaccination and smoking cessation.',
        'Treat sleep apnoea.'
      ]
    },
    pearls: [
      'Cor pulmonale is right heart failure secondary to lung disease — distinct from group 1 PAH.',
      'Long-term oxygen therapy is the only intervention with a survival benefit in COPD-related cor pulmonale.',
      'Vasodilators can worsen hypoxaemia by increasing V/Q mismatch.'
    ],
    redFlags: [
      'Severe hypoxaemia',
      'Right ventricular failure / oedema',
      'Syncope'
    ],
    differentialDiagnosis: [
      'Group 1 pulmonary arterial hypertension',
      'Left heart failure',
      'Constrictive pericarditis'
    ],
    source: 'ESC/ERS 2022 pulmonary hypertension guidelines',
    lastUpdated: '2026'
  },

];
