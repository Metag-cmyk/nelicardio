/**
 * Mechanistic treatment rationale (D4).
 * Links a treatment step / drug class to its target in the pathogenesis, so the
 * "Лечение" section explains *why* each therapy works rather than only *what* to give.
 * Kept separate from the condition cards so it is easy to author and audit.
 */
export const treatmentRationale: Record<string, string[]> = {
  'atrial-fibrillation': [
    'Anticoagulation targets the left atrial appendage stasis that causes stroke.',
    'Rate control (beta-blocker / CCB / digoxin) slows AV-nodal conduction to improve ventricular filling.',
    'Ablation isolates the pulmonary-vein triggers that initiate AF.',
    'Rhythm control (amiodarone / flecainide) suppresses the re-entrant substrate.'
  ],
  stemi: [
    'Primary PCI or fibrinolysis restores flow before necrosis becomes transmural (time is muscle).',
    'DAPT (aspirin + P2Y12 inhibitor) prevents further thrombus on the disrupted plaque.',
    'Beta-blockade reduces myocardial oxygen demand and arrhythmia risk.'
  ],
  hfref: [
    'ARNi/ACEi and MRA oppose the neurohormonal (RAAS) activation that drives adverse remodelling.',
    'Beta-blockers reverse sympathetic-mediated remodelling and reduce arrhythmic death.',
    'SGLT2 inhibitors improve natriuresis and cardiac metabolism independent of glycaemia.',
    'Diuretics relieve congestion without altering the underlying mechanism.'
  ],
  'aortic-stenosis': [
    'No drug reverses the fixed mechanical obstruction — valve replacement (SAVR/TAVI) is required once symptomatic.',
    'Diuretics relieve congestion, but vasodilators risk dangerous hypotension.'
  ],
  nstemi: [
    'DAPT plus anticoagulation stabilises the non-occlusive thrombus.',
    'An early invasive strategy treats the culprit lesion before further occlusion.',
    'High-intensity statin stabilises the plaque and lowers LDL-C.'
  ],
  'unstable-angina': [
    'Antithrombotic therapy stabilises the unstable plaque.',
    'Antianginal drugs reduce demand and relieve ischaemia.',
    'Early revascularisation prevents progression to infarction.'
  ],
  hcm: [
    'Beta-blockers (or verapamil) reduce contractility and heart rate, lessening the dynamic LVOT gradient.',
    'Myosin inhibitors (mavacamten) directly reduce hypercontractility.',
    'An ICD addresses the arrhythmic (SCD) mechanism, not the obstruction.'
  ],
  'aortic-dissection': [
    'IV beta-blockade (esmolol) reduces dP/dt and shear stress on the tear before vasodilation.',
    'Type A dissection needs emergency surgery to prevent rupture and tamponade.'
  ],
  'pulmonary-embolism': [
    'Anticoagulation prevents thrombus propagation and recurrence.',
    'Systemic thrombolysis lyses the clot to offload the failing right ventricle in high-risk PE.'
  ],
  'cardiogenic-shock': [
    'Inotropes/vasopressors restore perfusion pressure while revascularisation treats the ischaemic cause.',
    'Norepinephrine maintains coronary perfusion pressure.',
    'Mechanical circulatory support offloads the failing ventricle.'
  ],
  'infective-endocarditis': [
    'Prolonged bactericidal antibiotics eradicate the vegetation organisms.',
    'Surgery removes infected material when the valve is destroyed or causes heart failure/embolism.'
  ],
  'svt-psvt': [
    'Vagal manoeuvres and adenosine interrupt AV-nodal-dependent re-entry.',
    'Ablation targets the slow pathway or accessory pathway itself.'
  ],
  'ventricular-tachycardia': [
    'Amiodarone/lidocaine suppress the re-entrant/triggered substrate acutely.',
    'Beta-blockers reduce sympathetic triggering in structural disease.',
    'An ICD terminates VT/VF when drugs fail; ablation removes the scar circuit.'
  ],
  'atrial-flutter': [
    'Anticoagulation addresses the same appendage stasis as AF.',
    'Ablation of the cavotricuspid isthmus interrupts the macro-re-entrant circuit.'
  ],
  'third-degree-av-block': [
    'Atropine only works above the block; pacing restores rate and AV synchrony in infra-nodal block.'
  ],
  'mitral-regurgitation': [
    'Diuretics relieve congestion; vasodilators reduce afterload and the regurgitant fraction.',
    'Surgery targets the valve mechanism (repair preferred) before irreversible LV dysfunction.'
  ],
  'mitral-stenosis': [
    'Rate control prolongs diastole and lowers the transmitral gradient.',
    'PMBC or valve replacement relieves the fixed obstruction; anticoagulation addresses left atrial stasis.'
  ],
  'aortic-regurgitation': [
    'Vasodilators reduce the regurgitant fraction; surgery is indicated before irreversible LV dysfunction.'
  ],
  'wpw-syndrome': [
    'Ablation of the accessory pathway removes the substrate and the antegrade conduction responsible for VF during AF.',
    'AV-nodal blockers are avoided in pre-excited AF because they favour conduction over the pathway.'
  ],
  'long-qt-syndrome': [
    'Beta-blockers blunt the sympathetic triggers of torsades.',
    'Avoid QT-prolonging drugs and correct K+/Mg2+.',
    'ICD for survivors; left cardiac sympathetic denervation in refractory cases.'
  ],
  'dilated-cardiomyopathy': [
    'GDMT opposes neurohormonal activation and reverses remodelling.',
    'CRT/ICD address dyssynchrony and SCD, added after 3 months of therapy.'
  ],
  arvc: [
    'Restriction from competitive exercise reduces exercise-triggered arrhythmia.',
    'Beta-blockers and flecainide suppress the scar-related VT; ICD for high-risk.',
    'Ablation targets the scar circuit.'
  ],
  asd: [
    'Closure eliminates the left-to-right shunt; it is avoided when Eisenmenger physiology is present.'
  ],
  'ventricular-septal-defect': [
    'Closure removes the shunt before pulmonary vascular disease becomes irreversible.'
  ],
  'tetralogy-of-fallot': [
    'Surgical repair relieves the RVOTO and closes the VSD.',
    'Beta-blockers, morphine and the knee-chest position reduce the right-to-left shunt during spells.'
  ],
  hfpef: [
    'SGLT2 inhibitors and MRA reduce heart-failure hospitalisation despite preserved EF.',
    'Diuretics relieve the elevated filling pressures; comorbidity control targets the inflammatory driver.'
  ],
  'acute-decompensated-hf': [
    'IV diuretics and vasodilators reduce filling pressures and congestion.',
    'Non-invasive ventilation supports oxygenation in pulmonary oedema.',
    'Treating the precipitant reverses the decompensation.'
  ],
  'cardiac-tamponade': [
    'Pericardiocentesis removes the constraint; volume and vasopressors are temporising measures.'
  ],
  myocarditis: [
    'Management is supportive — GDMT for failure and avoidance of exertion; immunosuppression only for specific autoimmune forms.'
  ],
  amyloidosis: [
    'Diuretics relieve congestion but must be used cautiously (restrictive physiology).',
    'Tafamidis stabilises transthyretin; chemotherapy targets AL clonal disease.'
  ],
  'bicuspid-aortic-valve': [
    'Valve/aorta are surveilled; intervention addresses stenosis/regurgitation or aneurysmal dilatation.',
    'Blood-pressure control reduces aortic wall stress.'
  ],
  'coarctation-aorta': [
    'Stenting/surgery relieves the obstruction; blood-pressure control is needed before and after.'
  ],
  'acute-pericarditis': [
    'NSAID/aspirin plus colchicine relieve inflammation; colchicine specifically reduces recurrence.'
  ],
  'tricuspid-regurgitation': [
    'Diuretics relieve systemic congestion; surgery addresses severe functional/organic TR.',
    'Treating pulmonary hypertension reduces the functional driver.'
  ],
  aaa: [
    'Risk-factor control and surveillance reduce growth; repair prevents rupture when the diameter threshold is reached.'
  ],
  'peripheral-artery-disease': [
    'Structured exercise and risk-factor control improve perfusion; antiplatelet/statin reduce events; revascularisation for limb threat.'
  ],
  'hypertensive-emergency': [
    'Controlled IV blood-pressure reduction prevents further endothelial injury while avoiding hypoperfusion.'
  ],
  'pulmonary-arterial-hypertension': [
    'Pulmonary vasodilators (ERA, PDE5i, prostacyclin) target the proliferative/vasoconstrictive remodelling.',
    'Diuretics relieve RV congestion; oxygen corrects hypoxaemia.'
  ],
  'constrictive-pericarditis': [
    'Diuretics relieve congestion cautiously; pericardiectomy removes the constraining shell — the only definitive therapy.'
  ],
  'restrictive-cardiomyopathy': [
    'Treat the infiltration and relieve congestion; diuretics must be cautious with restrictive physiology.'
  ],
  'prinzmetal-angina': [
    'Nitrates and calcium-channel blockers relieve and prevent the coronary spasm; smoking cessation reduces spasm.'
  ],
  'scai-shock': [
    'Staging guides escalation from fluids/pressors to mechanical support.'
  ],
  'takotsubo-syndrome': [
    'Management is supportive; catecholamines are avoided and the dysfunction usually recovers.'
  ],
  scad: [
    'Conservative management is preferred because PCI can extend the dissection; therapy targets associated conditions.'
  ],
  'brugada-syndrome': [
    'Avoid triggers (fever, sodium-blocking drugs); ICD for high-risk; quinidine/ablation in selected cases.'
  ],
  'stable-ischemic-heart-disease': [
    'Antianginals reduce demand and relieve ischaemia; statin/antiplatelet slow plaque progression; revascularisation for refractory symptoms.'
  ],
  'sick-sinus-syndrome': [
    'Pacing corrects symptomatic bradycardia (chronotropic drugs are unreliable).',
    'Anticoagulation for the tachyarrhythmic component.'
  ],
  'mitral-valve-prolapse': [
    'Usually reassurance; surgery for severe MR or chordal rupture; beta-blockers for palpitations.'
  ],
  'pulmonary-stenosis': [
    'Balloon valvuloplasty relieves the obstruction; surgery for dysplastic valves.'
  ],
  'patent-ductus-arteriosus': [
    'Closure removes the left-to-right shunt before pulmonary vascular disease develops.'
  ],
  'ebstein-anomaly': [
    'Surgical repair/replacement for severe TR; ablation of accessory pathways; treat cyanosis.'
  ],
  'acute-rheumatic-fever': [
    'Penicillin eradicates the streptococcus; anti-inflammatory therapy controls carditis; secondary prophylaxis prevents recurrence.'
  ],
  minoca: [
    'Treatment targets the specific mechanism (spasm, thrombus, microvascular dysfunction) rather than uniform ACS therapy.'
  ],
  syncope: [
    'Treatment is cause-specific: pacing for bradyarrhythmia, ablation/ICD for tachyarrhythmia, counter-pressure for reflex syncope.'
  ],
  'orthostatic-hypotension': [
    'Volume/salt and compression improve preload; midodrine/fludrocortisone support vascular tone.'
  ],
  cpvt: [
    'Non-selective beta-blockade blunts the adrenergic trigger of the calcium leak; flecainide adds Na-channel blockade; ICD for survivors.'
  ],
  'short-qt-syndrome': [
    'ICD for high-risk; quinidine lengthens the QT in selected patients.'
  ],
  'peripartum-cardiomyopathy': [
    'Standard HF therapy adapted for pregnancy/lactation; bromocriptine targets the prolactin mechanism in severe cases.'
  ],
  'cardiac-sarcoidosis': [
    'Immunosuppression suppresses the granulomatous inflammation; devices address the conduction/arrhythmic consequences.'
  ],
  hypertension: [
    'Combination therapy (ACEi/ARB + CCB + thiazide) attacks the multifactorial mechanism to reach target.'
  ],
  'advanced-heart-failure': [
    'MCS/transplant replace pump function; inotropes bridge or palliate.'
  ],
  'implanted-devices': [
    'Pacing/ICD/CRT deliver the needed electrical therapy — the indication determines the benefit.'
  ],
  'coronary-revascularization': [
    'Modality matches the anatomy — CABG bypasses, PCI stents — while medical therapy is universal.'
  ],
  'prosthetic-valve-management': [
    'Anticoagulation prevents mechanical-valve thrombosis; surgery treats thrombosis/endocarditis.'
  ],
  'cardio-oncology': [
    'ACEi/ARB plus beta-blocker and dexrazoxane mitigate anthracycline toxicity; immunosuppression for checkpoint-inhibitor myocarditis.'
  ],
  'athlete-sports-cardiology': [
    'Detraining distinguishes physiology; restriction prevents arrhythmic death in pathological substrates.'
  ],
  'cardiometabolic-ckm': [
    'SGLT2i and GLP-1 RA give shared heart-kidney-metabolic benefit; finerenone targets albuminuric CKD.'
  ],
  'obstructive-sleep-apnoea': [
    'CPAP reverses the hypoxaemia/sympathetic surge, improving blood-pressure and AF control.'
  ],
  'cardiac-tumours': [
    'Surgical resection removes the mechanical/embolic source; malignant disease is managed multimodally.'
  ],
  'geriatric-cardiology': [
    'Therapy is individualised to frailty and life expectancy; deprescribing reduces harm.'
  ],
  'non-invasive-testing': [
    'Test choice matches pre-test probability; it informs, but does not itself change, the underlying mechanism.'
  ],
  atherosclerosis: [
    'Statins reduce LDL-C (the causal driver); antiplatelet therapy limits thrombotic complications.'
  ],
  'cor-pulmonale': [
    'Treating the lung disease and oxygen improve the hypoxaemic driver; diuretics relieve congestion.'
  ]
};
