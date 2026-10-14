/**
 * Key numbers per condition — only well-established thresholds/targets, each
 * with a source label. Nothing is invented; where no firm figure exists the
 * condition is simply absent from this map.
 */
export interface KeyNumber {
  label: string;
  value: string;
  source: string;
}

export const keyNumbers: Record<string, KeyNumber[]> = {
  atherosclerosis: [
    { label: 'LDL-C target (established ASCVD)', value: '<1.4 mmol/L (<55 mg/dL) and >=50% reduction', source: 'ESC dyslipidaemia' }
  ],
  'stable-ischemic-heart-disease': [
    { label: 'LDL-C target', value: '<1.4 mmol/L (<55 mg/dL)', source: 'ESC 2024 CCS' }
  ],
  stemi: [
    { label: 'Primary PCI delay (first medical contact)', value: '<=120 min', source: 'ESC 2023 ACS' },
    { label: 'Door-to-needle if fibrinolysis used', value: '<=30 min', source: 'ESC 2023 ACS' }
  ],
  'aortic-stenosis': [
    { label: 'Severe aortic stenosis', value: 'peak velocity >=4 m/s, mean gradient >=40 mmHg, or AVA <1.0 cm2', source: 'ESC/EACTS VHD' }
  ],
  'mitral-stenosis': [
    { label: 'Severe mitral stenosis', value: 'mitral valve area <1.5 cm2', source: 'ESC/EACTS VHD' }
  ],
  'mitral-regurgitation': [
    { label: 'Severe primary MR (quantitative)', value: 'EROA >=0.4 cm2, regurgitant volume >=60 mL', source: 'ESC/EACTS VHD' }
  ],
  hypertension: [
    { label: 'Office hypertension threshold', value: '>=140/90 mmHg', source: 'ESC 2024 hypertension' },
    { label: 'Home/ambulatory threshold', value: '>=130/80 mmHg (24-h average)', source: 'ESC 2024 hypertension' }
  ],
  'hypertensive-emergency': [
    { label: 'Typical presenting blood pressure', value: '>180/120 mmHg with target-organ damage', source: 'ESC 2024 hypertension' }
  ],
  'atrial-fibrillation': [
    { label: 'Lenient rate-control target', value: 'resting heart rate <110 bpm', source: 'ESC AF' }
  ],
  'hfref': [
    { label: 'Reduced ejection fraction', value: 'LVEF <=40%', source: 'ESC HF' },
    { label: 'Primary-prevention ICD threshold', value: 'LVEF <=35% (NYHA II-III on GDMT)', source: 'ESC 2022 VA/SCD' }
  ],
  hfpef: [
    { label: 'Preserved ejection fraction', value: 'LVEF >=50%', source: 'ESC HF' }
  ],
  hcm: [
    { label: 'Diagnostic wall thickness', value: '>=15 mm unexplained LV hypertrophy', source: 'ESC cardiomyopathy' }
  ],
  'aortic-dissection': [
    { label: 'Prophylactic aortic surgery threshold (root)', value: 'aortic diameter >=55 mm (lower if Marfan/bicuspid)', source: 'ESC aortic' }
  ],
  aaa: [
    { label: 'Elective repair threshold', value: 'AAA diameter >=55 mm (men), >=50 mm (women)', source: 'ACC/AHA aortic; ESC' }
  ],
  'coarctation-aorta': [
    { label: 'Arm-leg blood-pressure differential', value: '>20 mmHg suggests coarctation', source: 'ESC ACHD' }
  ],
  'pulmonary-stenosis': [
    { label: 'Severity by peak Doppler velocity', value: 'mild <3 m/s, moderate 3-4 m/s, severe >4 m/s', source: 'AHA/ACC ACHD' }
  ],
  'tetralogy-of-fallot': [
    { label: 'Right aortic arch', value: 'present in about 25%', source: 'ESC ACHD' }
  ],
  'brugada-syndrome': [
    { label: 'Type-1 ECG pattern', value: 'coved ST elevation >=2 mm in V1-V2', source: 'ESC 2022 VA/SCD' }
  ],
  'short-qt-syndrome': [
    { label: 'Diagnostic QTc', value: 'QTc <=340 ms', source: 'ESC 2022 VA/SCD' }
  ],
  'implanted-devices': [
    { label: 'CRT indication', value: 'QRS >=130 ms with LBBB and HFrEF', source: 'ESC HF/pacing' },
    { label: 'Primary-prevention ICD', value: 'LVEF <=35% on GDMT', source: 'ESC 2022 VA/SCD' }
  ],
  'infective-endocarditis': [
    { label: 'Antibiotic duration (native valve)', value: '4-6 weeks', source: 'ESC 2023 endocarditis' }
  ],
  'peripartum-cardiomyopathy': [
    { label: 'Diagnostic LVEF', value: '<45% in late pregnancy or <=5 months postpartum', source: 'ESC pregnancy/HF' }
  ],
  'cardio-oncology': [
    { label: 'Cancer-therapy cardiac dysfunction', value: 'LVEF decline >=10% to <53%', source: 'ESC cardio-oncology' }
  ],
  'obstructive-sleep-apnoea': [
    { label: 'Diagnostic apnoea-hypopnoea index', value: 'AHI >=5 with symptoms, or >=15', source: 'Sleep-medicine consensus' }
  ],
  'orthostatic-hypotension': [
    { label: 'Orthostatic hypotension', value: 'SBP fall >=20 mmHg or DBP fall >=10 mmHg on standing', source: 'ESC syncope' },
    { label: 'POTS heart-rate criterion', value: 'HR rise >=30 bpm (>=40 in teens) without hypotension', source: 'ESC syncope' }
  ],
  'pulmonary-embolism': [
    { label: 'High-risk PE', value: 'haemodynamic instability (obstructive shock)', source: 'ESC 2019 PE' }
  ],
  'acute-rheumatic-fever': [
    { label: 'Timing after streptococcal pharyngitis', value: '2-4 weeks', source: 'AHA Jones criteria' }
  ],
  'constrictive-pericarditis': [
    { label: 'Haemodynamic hallmark', value: 'elevated and equalised diastolic pressures with ventricular interdependence', source: 'ESC myopericarditis' }
  ]
};
