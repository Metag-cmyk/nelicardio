/**
 * Guideline Registry
 * ---------------------------------------------------------------------------
 * Guidelines are data: each carries an edition, the recommendations it makes,
 * and a verification status. Recommendations carry a Class of Recommendation
 * and Level of Evidence per society (ESC and AHA/ACC use different scales).
 *
 * IMPORTANT EDITORIAL RULE
 *   Never populate a grade from memory. A record is `verified` only after the
 *   primary source has been pulled and `verifiedAt` is set. Records without a
 *   verified grade for a society are still listed (edition/topic metadata) but
 *   surface no fabricated class/LOE.
 */

export type Society =
  | 'ESC'
  | 'AHA/ACC'
  | 'ESC/EACTS'
  | 'ESC/ERS'
  | 'ESC/HFA'
  | 'HRS';

export type RecommendationClass = 'I' | 'IIa' | 'IIb' | 'III';
/**
 * ESC levels of evidence. The revised ESC framework (used from ~2024) retains
 * A/B/C and splits B into B1/B2, so both notations are accepted here.
 */
export type EscLoe = 'A' | 'B' | 'B1' | 'B2' | 'C';
/** AHA/ACC levels of evidence. */
export type AccLoe = 'A' | 'B-R' | 'B-NR' | 'C-LD' | 'C-EO';

export type VerificationStatus = 'verified' | 'pending';

export interface Recommendation {
  id: string;
  text: string;
  escClass?: RecommendationClass;
  escLoe?: EscLoe;
  accClass?: RecommendationClass;
  accLoe?: AccLoe;
  /** Section/table reference within the source document. */
  section?: string;
}

export interface Guideline {
  id: string;
  /** Issuing society/bodies. */
  society: Society[];
  title: string;
  /** Edition label, e.g. '2026' or '2023 (focused update)'. */
  edition: string;
  year: number;
  /** Ids of guidelines this one supersedes. */
  supersedes?: string[];
  /** Condition ids (from data/conditions) covered by this guideline. */
  topics: string[];
  summary: string;
  recommendations: Recommendation[];
  changesSince?: { text: string; kind: 'new' | 'revised' | 'removed' }[];
  url?: string;
  /** ISO date the record was checked against the primary source. */
  verifiedAt?: string;
  status: VerificationStatus;
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const guidelines: Guideline[] = [
  // ----- Acute coronary syndromes -----
  {
    id: 'acc-2025-acs',
    society: ['AHA/ACC'],
    title: 'ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes',
    edition: '2025',
    year: 2025,
    supersedes: ['acc-2013-stemi', 'acc-2014-nstemi'],
    topics: ['stemi', 'nstemi', 'unstable-angina', 'minoca', 'cardiogenic-shock'],
    summary: 'Combines STEMI and NSTE-ACS into a single ACS document; focuses on type 1 MI.',
    url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000001309',
    verifiedAt: '2026-10-14',
    status: 'verified',
    changesSince: [
      { text: 'STEMI + NSTE-ACS merged into one ACS guideline and graded under current methodology.', kind: 'new' },
      { text: 'Intravascular imaging to guide PCI raised to Class 1, LOE A.', kind: 'new' },
      { text: 'Chewed aspirin/P2Y12 loading and radial-first access reinforced.', kind: 'revised' },
    ],
    recommendations: [
      { id: 'acs-dapt-12', text: 'In patients with ACS who are not at high bleeding risk, dual antiplatelet therapy with aspirin and an oral P2Y12 inhibitor is indicated for at least 12 months.', accClass: 'I', section: 'Top Take-Home Messages' },
      { id: 'acs-p2y12-preference', text: 'In patients with ACS undergoing PCI, ticagrelor or prasugrel is recommended in preference to clopidogrel.', accClass: 'I', section: 'Top Take-Home Messages' },
      { id: 'acs-radial', text: 'Radial access is preferred over femoral access in patients with ACS undergoing PCI to reduce bleeding, vascular complications, and death.', accClass: 'I', section: 'Top Take-Home Messages' },
      { id: 'acs-intracoronary-imaging', text: 'Intravascular (intracoronary) imaging is recommended to guide PCI in patients with ACS with complex coronary lesions.', accClass: 'I', accLoe: 'A', section: 'Top Take-Home Messages' },
      { id: 'acs-complete-revasc', text: 'A strategy of complete revascularization is recommended in patients with STEMI or NSTE-ACS.', accClass: 'I', section: 'Top Take-Home Messages' },
      { id: 'acs-shock-culprit', text: 'In patients with ACS and cardiogenic shock, emergency revascularization of the culprit vessel is indicated.', accClass: 'I', section: 'Top Take-Home Messages' },
      { id: 'acs-shock-nonculprit', text: 'In patients with ACS and cardiogenic shock, routine PCI of non-infarct-related arteries at the time of PCI is NOT recommended.', accClass: 'III', section: 'Top Take-Home Messages' },
      { id: 'acs-nsteacs-invasive', text: 'In patients with NSTE-ACS at intermediate or high risk of ischemic events, an invasive approach with intent to revascularize is recommended during hospitalization.', accClass: 'I', section: 'Top Take-Home Messages' },
      { id: 'acs-lipid-panel', text: 'A fasting lipid panel is recommended 4 to 8 weeks after initiating or adjusting lipid-lowering therapy.', accClass: 'I', section: 'Top Take-Home Messages' },
      { id: 'acs-nonstatin', text: 'In patients already on maximally tolerated statin with LDL-C ≥ 70 mg/dL (1.8 mmol/L), a nonstatin lipid-lowering agent is recommended.', accClass: 'I', section: 'Top Take-Home Messages' },
      { id: 'acs-cardiac-rehab', text: 'Referral to outpatient cardiac rehabilitation before hospital discharge is recommended.', accClass: 'I', section: 'Top Take-Home Messages' },
      { id: 'acs-oac-dat', text: 'In patients with ACS who require oral anticoagulation, aspirin should be discontinued after 1 to 4 weeks of triple therapy, continuing a P2Y12 inhibitor (preferably clopidogrel) plus the oral anticoagulant.', accClass: 'I', section: 'Top Take-Home Messages' },
      { id: 'acs-fibrinolysis', text: 'In patients with STEMI who cannot receive timely primary PCI (within 120 minutes of first medical contact), fibrinolytic therapy is recommended within 30 minutes of presentation in the absence of contraindications.', accClass: 'I', section: 'Reperfusion' },
      { id: 'acs-rescue-pci', text: 'Rescue PCI is recommended in patients with failed fibrinolysis (persistent ST elevation or ongoing ischaemia).', accClass: 'I', section: 'Reperfusion' },
    ],
  },
  {
    id: 'esc-2023-acs',
    society: ['ESC'],
    title: 'ESC Guidelines for the management of acute coronary syndromes',
    edition: '2023',
    year: 2023,
    topics: ['stemi', 'nstemi', 'unstable-angina', 'minoca', 'scad'],
    summary: 'European ACS framework (STEMI and NSTE-ACS) across the care pathway.',
    url: 'https://academic.oup.com/eurheartj/article/44/38/3720/7243210',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'acs-esc-p2y12', text: 'A potent P2Y12 inhibitor (prasugrel or ticagrelor), or clopidogrel if these are unavailable or contraindicated, is recommended before or at the time of PCI and maintained for 12 months unless there is excessive bleeding risk.', escClass: 'I', escLoe: 'A', section: 'Recommendation Table 5' },
      { id: 'acs-esc-pretreat-ppci', text: 'Pre-treatment with a P2Y12 inhibitor may be considered in patients undergoing a primary PCI strategy.', escClass: 'IIb', escLoe: 'B', section: 'Recommendation Table 5' },
      { id: 'acs-esc-pretreat-nste', text: 'Routine pre-treatment with a P2Y12 inhibitor in NSTE-ACS patients whose coronary anatomy is unknown and in whom early invasive management (<24 h) is planned is not recommended.', escClass: 'III', escLoe: 'A', section: 'Recommendation Table 5' },
      { id: 'acs-esc-radial', text: 'Radial access is recommended as the standard approach for coronary angiography and PCI, unless there are overriding procedural considerations.', escClass: 'I', escLoe: 'A', section: 'Recommendation Table 11' },
      { id: 'acs-esc-primary-pci', text: 'Primary PCI of the infarct-related artery is indicated in STEMI, with stenting (preferably new-generation drug-eluting stents) recommended.', escClass: 'I', escLoe: 'A', section: 'Recommendation Table 4' },
      { id: 'acs-esc-complete-revasc', text: 'In haemodynamically stable patients with STEMI and multivessel disease, complete revascularization is recommended either during the index PCI or within 45 days.', escClass: 'I', escLoe: 'A', section: 'Recommendation Table 12' },
      { id: 'acs-esc-nonira-angiographic', text: 'PCI of the non-infarct-related artery should be based on angiographic severity in haemodynamically stable patients.', escClass: 'I', escLoe: 'B', section: 'Recommendation Table 12' },
      { id: 'acs-esc-nonira-functional', text: 'Invasive epicardial functional assessment of non-culprit segments of the infarct-related artery is not recommended during the index procedure.', escClass: 'III', section: 'Recommendation Table 12' },
      { id: 'acs-esc-nste-timing', text: 'An early invasive strategy within 24 h should be considered in patients with a confirmed diagnosis of NSTE-ACS and at least one high-risk criterion.', escClass: 'IIa', escLoe: 'A', section: 'Recommendation Table 4' },
      { id: 'acs-esc-imaging', text: 'Intravascular imaging should be considered to guide PCI.', escClass: 'IIa', escLoe: 'A', section: 'Recommendation Table 11' },
      { id: 'acs-esc-imaging-ambiguous', text: 'Intravascular imaging, preferably optical coherence tomography, may be considered in patients with ambiguous culprit lesions.', escClass: 'IIb', escLoe: 'C', section: 'Recommendation Table 11' },
      { id: 'acs-esc-thrombus-aspiration', text: 'Routine thrombus aspiration is not recommended in primary PCI.', escClass: 'III', escLoe: 'A', section: 'Recommendation Table 11' },
      { id: 'acs-esc-scd', text: 'In spontaneous coronary artery dissection, PCI is recommended only for patients with ongoing myocardial ischaemia, a large area of myocardium in jeopardy, and reduced antegrade flow.', escClass: 'I', section: 'Recommendation Table 11' },
      { id: 'acs-esc-fibrinolysis', text: 'Fibrinolysis is recommended when primary PCI cannot be performed in a timely manner (within 12 hours of symptom onset) in patients with STEMI and no contraindications.', escClass: 'I', section: 'Recommendation Table 4' },
      { id: 'acs-esc-fibrinolysis-early', text: 'Fibrinolysis should be considered in patients presenting within 2 hours of symptom onset with a large infarct and an anticipated delay to primary PCI of more than 120 minutes.', escClass: 'IIa', section: 'Recommendation Table 4' },
      { id: 'acs-esc-rescue-pci', text: 'Rescue PCI is recommended in patients with failed fibrinolysis (persisting ST elevation or ongoing ischaemia) or evidence of re-occlusion.', escClass: 'I', section: 'Recommendation Table 4' },
    ],
  },
  {
    id: 'esc-2024-ccs',
    society: ['ESC'],
    title: 'ESC Guidelines for the management of chronic coronary syndromes',
    edition: '2024',
    year: 2024,
    topics: ['stable-ischemic-heart-disease', 'prinzmetal-angina', 'minoca', 'takotsubo-syndrome', 'coronary-revascularization', 'non-invasive-testing', 'atherosclerosis'],
    summary: 'Chronic coronary syndrome diagnosis, risk stratification and long-term therapy.',
    url: 'https://academic.oup.com/eurheartj/article/45/36/3415/7743115',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'ccs-esc-ldl', text: 'Lipid-lowering treatment with an LDL-C goal of <1.4 mmol/L (55 mg/dL) and a ≥50% reduction from baseline is recommended.', escClass: 'I', escLoe: 'A', section: 'Recommendation Table 18' },
      { id: 'ccs-esc-statin', text: 'Statins are recommended in all patients with chronic coronary syndrome, using a high-intensity statin up to the highest tolerated dose to reach LDL-C goals.', escClass: 'I', section: 'Recommendation Table 18' },
      { id: 'ccs-esc-bempedoic-intolerant', text: 'In patients who are statin-intolerant and do not achieve their LDL-C goal on ezetimibe, combination with bempedoic acid is recommended.', escClass: 'I', escLoe: 'B', section: 'Recommendation Table 18' },
      { id: 'ccs-esc-bempedoic-addon', text: 'In patients who do not achieve their goal on a maximally tolerated statin and ezetimibe, combination with bempedoic acid should be considered.', escClass: 'IIa', escLoe: 'C', section: 'Recommendation Table 18' },
      { id: 'ccs-esc-antianginal-first', text: 'Beta-blockers, calcium-channel blockers, or short-acting nitrates are recommended as first-line antianginal/anti-ischaemic therapy, tailored to the patient.', escClass: 'I', escLoe: 'B', section: 'Recommendation Table 16' },
      { id: 'ccs-esc-antianginal-addon', text: 'As add-on therapy for inadequate symptom control on a beta-blocker and/or calcium-channel blocker, ivabradine (if LVEF <40%), ranolazine, or long-acting nitrates should be considered.', escClass: 'IIa', escLoe: 'B', section: 'Recommendation Table 16' },
      { id: 'ccs-esc-antianginal-third', text: 'Nicorandil or trimetazidine may be considered as additional antianginal therapy.', escClass: 'IIb', escLoe: 'B', section: 'Recommendation Table 16' },
      { id: 'ccs-esc-anoca', text: 'In symptomatic patients with angina and non-obstructive coronary arteries (ANOCA/INOCA), medical therapy based on coronary functional testing should be considered.', escClass: 'IIa', escLoe: 'A', section: 'Recommendation Table 25' },
      { id: 'ccs-esc-endothelial', text: 'For the management of endothelial dysfunction, ACE inhibitors should be considered for symptom control.', escClass: 'IIa', escLoe: 'B', section: 'Recommendation Table 25' },
      { id: 'ccs-esc-microvascular', text: 'For microvascular angina associated with reduced coronary/myocardial blood flow reserve, beta-blockers should be considered for symptom control.', escClass: 'IIa', escLoe: 'B', section: 'Recommendation Table 25' },
    ],
  },
  {
    id: 'acc-2023-ccd',
    society: ['AHA/ACC'],
    title: 'AHA/ACC Guideline for the Management of Patients With Chronic Coronary Disease',
    edition: '2023',
    year: 2023,
    topics: ['stable-ischemic-heart-disease', 'prinzmetal-angina'],
    summary: 'Chronic coronary disease management and secondary prevention.',
    url: 'https://www.ahajournals.org/doi/full/10.1161/CIR.0000000000001168',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'ccd-acc-bb-lvef40', text: 'In patients with chronic coronary disease and LVEF ≤40%, with or without previous MI, beta-blocker therapy is recommended to reduce the risk of future MACE, including cardiovascular death.', accClass: 'I', accLoe: 'A', section: 'Beta blockers' },
      { id: 'ccd-acc-bb-agents', text: 'In patients with chronic coronary disease and LVEF <50%, sustained-release metoprolol succinate, carvedilol, or bisoprolol, titrated to target doses, is recommended in preference to other beta-blockers.', accClass: 'I', accLoe: 'A', section: 'Beta blockers' },
      { id: 'ccd-acc-bb-reassess', text: 'In patients with chronic coronary disease started on a beta-blocker for a previous MI, without LVEF ≤50%, angina, arrhythmia, or uncontrolled hypertension, it may be reasonable to reassess the indication after 1 year.', accClass: 'IIb', accLoe: 'B-NR', section: 'Beta blockers' },
      { id: 'ccd-acc-statin', text: 'High-intensity statin therapy is recommended for all patients with chronic coronary disease to reduce the risk of MACE; where high-intensity statin is contraindicated or not tolerated, moderate-intensity statin therapy is recommended.', accClass: 'I', accLoe: 'A', section: 'Lipid management' },
      { id: 'ccd-acc-lipid-monitor', text: 'In patients with chronic coronary disease, adherence and the lipid-lowering effect should be assessed with fasting lipids 4–12 weeks after statin initiation or dose adjustment.', accClass: 'I', accLoe: 'A', section: 'Lipid management' },
      { id: 'ccd-acc-sapt', text: 'In patients with chronic coronary disease who are not on oral anticoagulation, single antiplatelet therapy with low-dose aspirin (75–100 mg) is recommended to reduce atherosclerotic cardiovascular events.', accClass: 'I', section: 'Antiplatelet therapy' },
      { id: 'ccd-acc-antianginal', text: 'Either a calcium-channel blocker or a beta-blocker is recommended as first-line antianginal therapy.', accClass: 'I', section: 'Antianginal therapy' },
      { id: 'ccd-acc-sglt2-glp1', text: 'SGLT2 inhibitors and GLP-1 receptor agonists are recommended for selected patients with chronic coronary disease, including those without diabetes, to improve cardiovascular outcomes.', accClass: 'I', section: 'Diabetes and cardiometabolic therapy' },
      { id: 'ccd-acc-no-routine-testing', text: 'Routine periodic anatomic or ischaemic testing without a change in clinical or functional status is not recommended for risk stratification or to guide therapeutic decision-making.', accClass: 'III', section: 'Testing' },
      { id: 'ccd-acc-ecig', text: 'E-cigarettes are not recommended as a first-line aid for smoking cessation.', accClass: 'III', section: 'Smoking cessation' },
    ],
  },

  // ----- Heart failure -----
  {
    id: 'esc-2026-hf',
    society: ['ESC', 'ESC/HFA'],
    title: 'ESC Guidelines for the management of heart failure',
    edition: '2026',
    year: 2026,
    supersedes: ['esc-2021-hf', 'esc-2023-hf-update'],
    topics: ['hfref', 'hfpef', 'acute-decompensated-hf', 'dilated-cardiomyopathy', 'amyloidosis', 'cardiogenic-shock', 'scai-shock', 'advanced-heart-failure'],
    summary: 'Refines HF classification by LVEF and adds a stage-based framework; all recommendations regraded to the revised ESC evidence system.',
    url: 'https://academic.oup.com/eurheartj/advance-article/doi/10.1093/eurheartj/ehag100/8766302',
    verifiedAt: '2026-10-14',
    status: 'verified',
    changesSince: [
      { text: 'New LVEF-based classification and an A–D stage-based framework emphasising prevention and early detection.', kind: 'new' },
      { text: 'Revised nomenclature for HF therapies (foundational vs additional).', kind: 'revised' },
      { text: 'All recommendations regraded under the revised ESC evidence framework (LOE A / B1 / B2 / C).', kind: 'revised' },
    ],
    recommendations: [
      { id: 'hf-esc-sglt2i', text: 'An SGLT2 inhibitor (dapagliflozin or empagliflozin) is recommended in patients with symptomatic heart failure, independent of LVEF, to reduce the risk of HF hospitalization or cardiovascular death.', escClass: 'I', escLoe: 'A', section: 'Recommendation Table 5' },
      { id: 'hf-esc-mra', text: 'A mineralocorticoid receptor antagonist (steroidal for HFrEF; steroidal or non-steroidal for HFpEF) is recommended in patients with symptomatic heart failure, independent of LVEF, to reduce the risk of HF hospitalization or cardiovascular death.', escClass: 'I', escLoe: 'A', section: 'Recommendation Table 5' },
      { id: 'hf-esc-bb', text: 'A beta-blocker is recommended in stable patients with symptomatic HFrEF to reduce the risk of HF hospitalization and death.', escClass: 'I', escLoe: 'A', section: 'Recommendation Table 5' },
      { id: 'hf-esc-acei-arni', text: 'An ACE inhibitor or an ARNI is recommended in patients with symptomatic HFrEF to reduce the risk of HF hospitalization and death.', escClass: 'I', escLoe: 'A', section: 'Recommendation Table 5' },
      { id: 'hf-esc-switch-arni', text: 'Switching from an ACE inhibitor or ARB to an ARNI is recommended in patients with symptomatic HFrEF to reduce the risk of HF hospitalization and death.', escClass: 'I', escLoe: 'B1', section: 'Recommendation Table 5' },
      { id: 'hf-esc-arb', text: 'An ARB is recommended in patients with symptomatic HFrEF who are unable to tolerate an ACE inhibitor or an ARNI.', escClass: 'I', escLoe: 'A', section: 'Recommendation Table 5' },
      { id: 'hf-esc-ivabradine', text: 'Ivabradine should be considered in patients with symptomatic HFrEF (LVEF ≤35%, sinus rhythm, resting heart rate >70 bpm) already on the highest tolerated ACE-I/ARNI, MRA, SGLT2 inhibitor and beta-blocker.', escClass: 'IIa', escLoe: 'B1', section: 'Recommendation Table 5' },
      { id: 'hf-esc-glycoside', text: 'A cardiac glycoside (digoxin or digitoxin) should be considered in patients with symptomatic HFrEF and LVEF ≤40% despite optimal foundational therapy, to reduce the risk of HF hospitalization.', escClass: 'IIa', escLoe: 'B1', section: 'Recommendation Table 5' },
      { id: 'hf-esc-hfpef-rasi', text: 'An ACE inhibitor, ARB or ARNI may be considered in patients with symptomatic HFpEF to reduce the risk of HF hospitalization.', escClass: 'IIb', escLoe: 'C', section: 'Recommendation Table 5' },
      { id: 'hf-esc-stageb-acei', text: 'An ACE inhibitor or ARB (if intolerant to an ACE-I) is recommended in patients with stage B heart failure and LVEF ≤40% to reduce the risk of HF hospitalization and death.', escClass: 'I', escLoe: 'A', section: 'Recommendation Table 2' },
      { id: 'hf-esc-stageb-bb', text: 'A beta-blocker is recommended in patients with stage B heart failure and LVEF <50% to reduce the risk of HF hospitalization or death.', escClass: 'I', escLoe: 'B1', section: 'Recommendation Table 2' },
      { id: 'hf-esc-stageb-eplerenone', text: 'Eplerenone is recommended in patients after myocardial infarction with LVEF ≤40% and signs of heart failure or diabetes.', escClass: 'I', escLoe: 'B1', section: 'Recommendation Table 2' },
      { id: 'hf-esc-bp', text: 'Strict blood pressure control (systolic target <130 mmHg) is recommended in patients with hypertension or stage B heart failure to reduce the risk of heart failure.', escClass: 'I', escLoe: 'A', section: 'Recommendation Table 1' },
      { id: 'hf-esc-glp1', text: 'Semaglutide or tirzepatide should be considered in patients with HFpEF and obesity.', escClass: 'IIa', section: 'Recommendation Table 5' },
      { id: 'hf-esc-sglt2i-t2dm', text: 'An SGLT2 inhibitor is recommended in patients with type 2 diabetes at risk of heart failure to reduce the risk of heart failure and cardiovascular death.', escClass: 'I', escLoe: 'A', section: 'Recommendation Table 1' },
    ],
  },
  {
    id: 'acc-2022-hf',
    society: ['AHA/ACC'],
    title: 'AHA/ACC/HFSA Guideline for the Management of Heart Failure',
    edition: '2022',
    year: 2022,
    topics: ['hfref', 'hfpef', 'acute-decompensated-hf', 'amyloidosis', 'dilated-cardiomyopathy'],
    summary: 'US heart failure guideline covering stages A–D and guideline-directed medical therapy.',
    url: 'https://www.ahajournals.org/doi/full/10.1161/CIR.0000000000001063',
    verifiedAt: '2026-10-14',
    status: 'verified',
    changesSince: [
      { text: 'GDMT for HFrEF expanded to four classes, adding SGLT2 inhibitors.', kind: 'new' },
      { text: 'New recommendations for SGLT2i (2a), MRAs (2b) and ARNi (2b) in HFpEF.', kind: 'new' },
    ],
    recommendations: [
      { id: 'hf-acc-arni', text: 'In patients with HFrEF, an ARNI is recommended as first-line renin-angiotensin system inhibition to reduce morbidity and mortality.', accClass: 'I', accLoe: 'A', section: 'GDMT for HFrEF' },
      { id: 'hf-acc-acei', text: 'In patients with HFrEF, an ACE inhibitor is recommended to reduce morbidity and mortality when ARNI is not feasible.', accClass: 'I', accLoe: 'A', section: 'GDMT for HFrEF' },
      { id: 'hf-acc-arb', text: 'In patients with HFrEF who cannot be given an ACE inhibitor or ARNI, an ARB is recommended to reduce morbidity and mortality.', accClass: 'I', accLoe: 'A', section: 'GDMT for HFrEF' },
      { id: 'hf-acc-bb', text: 'In patients with HFrEF, one of bisoprolol, carvedilol, or sustained-release metoprolol succinate is recommended to reduce mortality and hospitalizations.', accClass: 'I', accLoe: 'A', section: 'GDMT for HFrEF' },
      { id: 'hf-acc-mra', text: 'In patients with HFrEF, a mineralocorticoid receptor antagonist is recommended to reduce morbidity and mortality.', accClass: 'I', accLoe: 'A', section: 'GDMT for HFrEF' },
      { id: 'hf-acc-sglt2i', text: 'In patients with HFrEF, an SGLT2 inhibitor is recommended to reduce morbidity and mortality.', accClass: 'I', accLoe: 'A', section: 'GDMT for HFrEF' },
      { id: 'hf-acc-hfimpef', text: 'In patients with HF with improved ejection fraction, guideline-directed medical therapy should be continued to prevent relapse of HF and left ventricular dysfunction.', accClass: 'I', accLoe: 'B-R', section: 'HFimpEF' },
      { id: 'hf-acc-hfmref-sglt2', text: 'In patients with HF with mildly reduced ejection fraction, an SGLT2 inhibitor can be beneficial in decreasing HF hospitalizations and cardiovascular mortality.', accClass: 'IIa', section: 'HFmrEF' },
      { id: 'hf-acc-hfpef-sglt2', text: 'In patients with HFpEF, an SGLT2 inhibitor can be beneficial in decreasing HF hospitalizations and cardiovascular mortality.', accClass: 'IIa', section: 'HFpEF' },
      { id: 'hf-acc-t2dm-sglt2', text: 'In patients with type 2 diabetes and either established cardiovascular disease or high cardiovascular risk, an SGLT2 inhibitor should be used to prevent hospitalizations for HF.', accClass: 'I', accLoe: 'B-NR', section: 'Stage A' },
    ],
  },

  // ----- Arrhythmia -----
  {
    id: 'esc-2024-af',
    society: ['ESC'],
    title: 'ESC Guidelines for the management of atrial fibrillation',
    edition: '2024',
    year: 2024,
    topics: ['atrial-fibrillation', 'atrial-flutter'],
    summary: 'AF/flutter: AF-CARE pathway, thromboembolic risk (CHA2DS2-VA), rate/rhythm control.',
    url: 'https://academic.oup.com/eurheartj/article/45/36/3314/7738779',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'af-esc-oac', text: 'Oral anticoagulation is recommended in patients with clinical AF at elevated thromboembolic risk to prevent ischaemic stroke and thromboembolism.', escClass: 'I', section: 'Recommendation Table 7' },
      { id: 'af-esc-cha2ds2va-2', text: 'A CHA2DS2-VA score of 2 or more is recommended as an indicator of elevated thromboembolic risk for decisions on initiating oral anticoagulation.', escClass: 'I', section: 'Recommendation Table 6' },
      { id: 'af-esc-cha2ds2va-1', text: 'A CHA2DS2-VA score of 1 should be considered an indicator of elevated thromboembolic risk for decisions on initiating oral anticoagulation.', escClass: 'IIa', section: 'Recommendation Table 6' },
      { id: 'af-esc-doac', text: 'Direct oral anticoagulants are preferred over vitamin K antagonists, except in patients with mechanical heart valves or moderate-to-severe mitral stenosis.', escClass: 'I', section: 'Recommendation Table 7' },
      { id: 'af-esc-no-antiplatelet', text: 'Adding antiplatelet therapy to oral anticoagulation for the purpose of preventing ischaemic stroke or thromboembolism is not recommended.', escClass: 'III', section: 'Recommendation Table 8' },
      { id: 'af-esc-hcm-amyloid', text: 'Oral anticoagulation is recommended in all patients with AF and hypertrophic cardiomyopathy or cardiac amyloidosis, regardless of CHA2DS2-VA score.', escClass: 'I', section: 'Recommendation Table 7' },
      { id: 'af-esc-no-underdose', text: 'A reduced dose of DOAC therapy is not recommended unless the patient meets DOAC-specific dose-reduction criteria.', escClass: 'III', section: 'Recommendation Table 7' },
      { id: 'af-esc-hasbled', text: 'The HAS-BLED score should be considered to help address modifiable bleeding risk factors and to identify patients at high bleeding risk for early and frequent review.', escClass: 'IIa', section: 'Recommendation Table 12' },
      { id: 'af-esc-rate-control', text: 'Rate control therapy is recommended as initial therapy in the acute setting, as an adjunct to rhythm control, or as a sole strategy to control heart rate and reduce symptoms.', escClass: 'I', escLoe: 'B', section: 'Recommendation Table 14' },
      { id: 'af-esc-rate-drugs', text: 'Beta-blockers, diltiazem, verapamil, or digoxin are recommended as first-choice rate-control drugs in patients with AF and LVEF > 40%.', escClass: 'I', section: 'Recommendation Table 14' },
      { id: 'af-esc-ablation-paroxysmal', text: 'Catheter ablation is recommended as a first-line option within a shared decision-making rhythm-control strategy in patients with paroxysmal AF, to reduce symptoms, recurrence and progression.', escClass: 'I', escLoe: 'A', section: 'Recommendation Table 19' },
      { id: 'af-esc-early-rhythm', text: 'A rhythm-control strategy should be considered within 12 months of diagnosis in selected patients with AF at risk of thromboembolic events, to reduce cardiovascular death or hospitalization.', escClass: 'IIa', section: 'Recommendation Table 15' },
    ],
  },
  {
    id: 'acc-2023-af',
    society: ['AHA/ACC'],
    title: 'ACC/AHA/ACCP/HRS Guideline for the Diagnosis and Management of Atrial Fibrillation',
    edition: '2023',
    year: 2023,
    topics: ['atrial-fibrillation', 'atrial-flutter'],
    summary: 'AF staging and management, anticoagulation and rhythm control.',
    url: 'https://www.ahajournals.org/doi/full/10.1161/CIR.0000000000001193',
    verifiedAt: '2026-10-14',
    status: 'verified',
    changesSince: [
      { text: 'New AF staging system (1: at risk; 2: pre-AF; 3: paroxysmal/persistent/long-standing persistent; 4: permanent).', kind: 'new' },
      { text: 'Catheter ablation upgraded to first-line therapy in selected patients.', kind: 'revised' },
    ],
    recommendations: [
      { id: 'af-acc-ablation', text: 'In patients with symptomatic AF in whom antiarrhythmic drug therapy has been ineffective, contraindicated, or not tolerated, catheter ablation is recommended as first-line rhythm control.', accClass: 'I', accLoe: 'A', section: 'Rhythm control' },
      { id: 'af-acc-rate-bb', text: 'Beta-blockers are recommended for long-term rate control in patients with AF.', accClass: 'I', accLoe: 'B-NR', section: 'Long-term rate control' },
      { id: 'af-acc-doac', text: 'In patients with AF eligible for anticoagulation, DOACs are recommended in preference to warfarin, except in those with mechanical valves or moderate-to-severe rheumatic mitral stenosis.', accClass: 'I', accLoe: 'A', section: 'Anticoagulation' },
      { id: 'af-acc-laao-2a', text: 'In patients with a CHA2DS2-VASc score ≥2 and a contraindication to long-term oral anticoagulation, percutaneous left atrial appendage occlusion is reasonable.', accClass: 'IIa', section: 'LAA occlusion' },
      { id: 'af-acc-laao-2b', text: 'In patients with a moderate-to-high risk of stroke and a high risk of major bleeding on oral anticoagulation, percutaneous LAA occlusion may be a reasonable alternative to anticoagulation.', accClass: 'IIb', section: 'LAA occlusion' },
      { id: 'af-acc-lifestyle', text: 'Lifestyle and risk-factor modification is recommended in patients with AF to prevent onset, progression, and adverse outcomes (weight loss if BMI >27 kg/m², exercise training, tobacco cessation, alcohol minimization, blood-pressure control, sleep-apnoea screening).', accClass: 'I', section: 'Risk factor modification' },
    ],
  },
  {
    id: 'esc-2022-va-scd',
    society: ['ESC'],
    title: 'ESC Guidelines for the management of patients with ventricular arrhythmias and the prevention of sudden cardiac death',
    edition: '2022',
    year: 2022,
    topics: ['ventricular-tachycardia', 'long-qt-syndrome', 'brugada-syndrome', 'arvc', 'hcm', 'dilated-cardiomyopathy'],
    summary: 'Ventricular arrhythmia risk, ICD indications and inherited arrhythmia syndromes.',
    url: 'https://academic.oup.com/eurheartj/article/43/40/3997/6674606',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'va-esc-icd-secondary', text: 'ICD implantation is recommended in patients with documented ventricular fibrillation or haemodynamically not-tolerated ventricular tachycardia in the absence of reversible causes.', escClass: 'I', escLoe: 'A', section: 'Recommendation Table 12' },
      { id: 'va-esc-cad-nyha23', text: 'ICD therapy is recommended in patients with coronary artery disease, symptomatic heart failure (NYHA class II–III) and LVEF ≤35% despite ≥3 months of optimal medical therapy.', escClass: 'I', section: 'Recommendation Table — CAD' },
      { id: 'va-esc-cad-nyha1', text: 'ICD therapy should be considered in patients with coronary artery disease, NYHA class I and LVEF ≤30% despite ≥3 months of optimal medical therapy.', escClass: 'IIa', section: 'Recommendation Table — CAD' },
      { id: 'va-esc-cad-nsvt', text: 'ICD implantation should be considered in patients with coronary artery disease, LVEF ≤40% despite ≥3 months of optimal medical therapy and non-sustained VT who are inducible for VT at electrophysiological study.', escClass: 'IIa', section: 'Recommendation Table — CAD' },
      { id: 'va-esc-pes-syncope', text: 'In patients with syncope and previous STEMI, electrophysiological study is indicated when syncope remains unexplained after non-invasive evaluation.', escClass: 'I', escLoe: 'C', section: 'Recommendation Table — CAD' },
      { id: 'va-esc-sarco-lvef', text: 'ICD implantation is recommended in patients with cardiac sarcoidosis and LVEF ≤35%.', escClass: 'I', escLoe: 'B', section: 'Recommendation Table 35' },
      { id: 'va-esc-sarco-vt', text: 'ICD implantation is recommended in patients with cardiac sarcoidosis who have documented sustained VT or aborted cardiac arrest.', escClass: 'I', escLoe: 'B', section: 'Recommendation Table 35' },
      { id: 'va-esc-myocarditis-smvt', text: 'ICD implantation is recommended in patients with haemodynamically not-tolerated sustained monomorphic VT occurring in the chronic phase of myocarditis.', escClass: 'I', escLoe: 'C', section: 'Recommendation Table 35' },
      { id: 'va-esc-arvc-cmr', text: 'Cardiac magnetic resonance imaging is recommended in patients with suspected arrhythmogenic right ventricular cardiomyopathy.', escClass: 'I', section: 'ARVC' },
      { id: 'va-esc-arvc-icd', text: 'ICD implantation should be considered in symptomatic patients with definite ARVC, moderate right or left ventricular dysfunction, and either non-sustained VT or inducibility of sustained monomorphic VT at electrophysiological study.', escClass: 'IIa', section: 'ARVC' },
    ],
  },
  {
    id: 'acc-2018-bradycardia',
    society: ['AHA/ACC', 'HRS'],
    title: 'ACC/AHA/HRS Guideline on the Evaluation and Management of Patients With Bradycardia and Cardiac Conduction Delay',
    edition: '2018',
    year: 2018,
    topics: ['third-degree-av-block', 'sick-sinus-syndrome'],
    summary: 'Bradycardia and conduction disease evaluation, pacing indications.',
    url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000000628',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'brady-acc-ecg', text: 'ECG is recommended to document rhythm, rate and conduction disorder in patients with suspected bradycardia.', accClass: 'I', section: 'Initial evaluation' },
      { id: 'brady-acc-shared', text: 'In patients with bradycardia who have indications for pacemaker implantation, shared decision-making and patient-centred care are recommended.', accClass: 'I', section: 'Shared decision-making' },
      { id: 'brady-acc-no-pace', text: 'In patients with an indication for permanent pacing but significant comorbidities such that pacing is unlikely to provide meaningful clinical benefit, or whose goals of care preclude pacing, implantation or replacement should not be performed.', accClass: 'III', section: 'Shared decision-making' },
    ],
  },
  {
    id: 'acc-2015-svt',
    society: ['AHA/ACC', 'HRS'],
    title: 'ACC/AHA/HRS Guideline for the Management of Adult Patients With Supraventricular Tachycardia',
    edition: '2015',
    year: 2015,
    topics: ['svt-psvt', 'wpw-syndrome', 'atrial-flutter'],
    summary: 'SVAT/SVT diagnosis, acute management and ablation.',
    url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000000310',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'svt-acc-vagal', text: 'Vagal manoeuvres are recommended for acute treatment in patients with regular SVT.', accClass: 'I', accLoe: 'B-R', section: 'Acute treatment' },
      { id: 'svt-acc-adenosine', text: 'Adenosine is recommended for acute treatment in patients with regular SVT.', accClass: 'I', accLoe: 'B-R', section: 'Acute treatment' },
      { id: 'svt-acc-cardioversion', text: 'Synchronized cardioversion is recommended for acute treatment in haemodynamically unstable patients with SVT when vagal manoeuvres or adenosine are ineffective or not feasible.', accClass: 'I', accLoe: 'B-NR', section: 'Acute treatment' },
    ],
  },

  // ----- Valvular / structural -----
  {
    id: 'esc-2025-vhd',
    society: ['ESC/EACTS'],
    title: 'ESC/EACTS Guidelines for the management of valvular heart disease',
    edition: '2025',
    year: 2025,
    topics: ['aortic-stenosis', 'aortic-regurgitation', 'mitral-regurgitation', 'mitral-stenosis', 'tricuspid-regurgitation', 'mitral-valve-prolapse', 'bicuspid-aortic-valve', 'prosthetic-valve-management'],
    summary: 'European valvular heart disease guideline (joint with EACTS).',
    url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/valvular-heart-disease',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'vhd-esc-heart-team', text: 'All patients with severe valvular heart disease should be evaluated by a multidisciplinary Heart Team, with patient-centred shared decision-making.', escClass: 'I', section: 'Section 3' },
      { id: 'vhd-esc-as-lvef', text: 'Intervention is recommended in asymptomatic patients with severe aortic stenosis and LVEF <50% without another cause.', escClass: 'I', escLoe: 'B', section: 'Recommendation Table — AS' },
      { id: 'vhd-esc-as-asymptomatic', text: 'Intervention is recommended in asymptomatic patients with severe aortic stenosis and any three of: significant left atrial dilatation, pulmonary hypertension, atrial fibrillation, or moderate-or-greater tricuspid regurgitation.', escClass: 'I', escLoe: 'B', section: 'Recommendation Table — AS' },
      { id: 'vhd-esc-as-lflg', text: 'Intervention should be considered in symptomatic patients with low-flow, low-gradient severe aortic stenosis and normal LVEF (≥50%), after careful confirmation that the stenosis is severe.', escClass: 'IIa', escLoe: 'B', section: 'Recommendation Table — AS' },
      { id: 'vhd-esc-ccta', text: 'Coronary CT angiography is recommended before valve intervention in patients with a moderate or lower pre-test likelihood of obstructive coronary artery disease.', escClass: 'I', escLoe: 'B', section: 'Recommendation Table — pre-procedural' },
      { id: 'vhd-esc-teer-vsmr', text: 'Transcatheter edge-to-edge repair is recommended in patients with severe ventricular secondary mitral regurgitation without coronary artery disease.', escClass: 'I', escLoe: 'A', section: 'Recommendation Table — MR' },
      { id: 'vhd-esc-mvr-asymptomatic', text: 'Surgical mitral valve repair is recommended in asymptomatic patients with severe primary mitral regurgitation who meet guideline criteria.', escClass: 'I', escLoe: 'B', section: 'Recommendation Table — MR' },
      { id: 'vhd-esc-tavi-ar', text: 'Transcatheter aortic valve implantation may be considered in patients with aortic regurgitation who are ineligible for surgery.', escClass: 'IIb', escLoe: 'B', section: 'Recommendation Table — AR' },
    ],
  },
  {
    id: 'acc-2020-vhd',
    society: ['AHA/ACC'],
    title: 'ACC/AHA Guideline for the Management of Patients With Valvular Heart Disease',
    edition: '2020',
    year: 2020,
    topics: ['aortic-stenosis', 'aortic-regurgitation', 'mitral-regurgitation', 'mitral-stenosis', 'tricuspid-regurgitation'],
    summary: 'US valvular heart disease guideline with a 2025 focused update.',
    url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000000923',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'vhd-acc-noac', text: 'In patients with AF and native valvular heart disease (except rheumatic mitral stenosis), or a bioprosthetic valve implanted more than 3 months earlier, a DOAC is an effective alternative to a vitamin K antagonist.', accClass: 'I', accLoe: 'A', section: 'Anticoagulation in VHD' },
      { id: 'vhd-acc-as-symptomatic', text: 'Aortic valve replacement (surgical or transcatheter) is recommended for symptomatic patients with severe aortic stenosis.', accClass: 'I', section: 'Aortic stenosis' },
      { id: 'vhd-acc-tavi-prohibitive', text: 'TAVR is recommended for symptomatic patients with severe aortic stenosis at prohibitive surgical risk.', accClass: 'I', accLoe: 'A', section: 'Aortic stenosis' },
      { id: 'vhd-acc-heart-team', text: 'A multidisciplinary Heart Team is recommended for the evaluation and management of patients with severe valvular heart disease.', accClass: 'I', section: 'Heart Team' },
    ],
  },

  // ----- Cardiomyopathies / pericardial / myocarditis -----
  {
    id: 'acc-2024-hcm',
    society: ['AHA/ACC'],
    title: 'AHA/ACC Guideline for the Management of Hypertrophic Cardiomyopathy',
    edition: '2024',
    year: 2024,
    topics: ['hcm'],
    summary: 'HCM diagnosis, sudden-death risk, and septal reduction.',
    url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000001250',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'hcm-acc-bb-ccb', text: 'In patients with obstructive HCM and symptoms, a beta-blocker (or a non-dihydropyridine calcium-channel blocker if beta-blockers are ineffective or not tolerated) is recommended as first-line therapy.', accClass: 'I', section: 'Medical therapy' },
      { id: 'hcm-acc-mavacamten', text: 'In patients with obstructive HCM with persistent symptoms despite beta-blockers or non-dihydropyridine calcium-channel blockers, a cardiac myosin inhibitor (mavacamten) is recommended.', accClass: 'I', section: 'Medical therapy' },
      { id: 'hcm-acc-srt', text: 'In patients with obstructive HCM and severe symptoms despite maximal tolerated medical therapy, septal reduction therapy (surgical myectomy or alcohol septal ablation) is recommended, performed at experienced centres.', accClass: 'I', section: 'Septal reduction' },
      { id: 'hcm-acc-af-oac', text: 'In patients with HCM and clinical AF (or subclinical AF lasting >24 h), systemic anticoagulation with a DOAC (first line) or vitamin K antagonist (second line) is recommended, irrespective of CHA2DS2-VASc score.', accClass: 'I', section: 'Atrial fibrillation' },
      { id: 'hcm-acc-mavacamten-preg', text: 'Mavacamten is contraindicated in pregnancy due to potential teratogenic effects.', accClass: 'III', section: 'Pregnancy' },
    ],
  },
  {
    id: 'esc-2025-myopericarditis',
    society: ['ESC'],
    title: 'ESC Guidelines for the management of myocarditis and pericarditis',
    edition: '2025',
    year: 2025,
    supersedes: ['esc-2015-pericardial'],
    topics: ['myocarditis', 'acute-pericarditis', 'cardiac-tamponade', 'constrictive-pericarditis'],
    summary: 'Combined myocarditis and pericarditis guideline.',
    url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/myocarditis-and-pericarditis',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'mp-esc-clinical-eval', text: 'A complete clinical evaluation (history, examination, biomarkers, chest X-ray, ECG and echocardiography) is recommended in all patients with suspected myocarditis or pericarditis during the initial diagnostic assessment.', escClass: 'I', section: 'Diagnostic evaluation' },
      { id: 'mp-esc-cmr', text: 'Cardiac magnetic resonance imaging is recommended in patients with clinical suspicion of myocarditis or pericarditis for non-invasive diagnosis.', escClass: 'I', section: 'Diagnostic evaluation' },
      { id: 'mp-esc-colchicine', text: 'Colchicine is recommended as first-line therapy in patients with pericarditis, as an adjunct to aspirin/NSAID or corticosteroid therapy, to reduce subsequent recurrences.', escClass: 'I', escLoe: 'A', section: 'Recommendation Table — pericarditis' },
      { id: 'mp-esc-nsaid', text: 'High-dose aspirin or NSAIDs, with proton-pump inhibition, are recommended as first-line therapy for symptom control and to reduce recurrences in patients with pericarditis.', escClass: 'I', section: 'Recommendation Table — pericarditis' },
      { id: 'mp-esc-antiil1', text: 'Anti-IL-1 agents (anakinra or rilonacept) are recommended for patients with recurrent pericarditis after failure of first-line therapy and corticosteroids with elevated C-reactive protein, to reduce recurrences.', escClass: 'I', section: 'Recommendation Table — pericarditis' },
      { id: 'mp-esc-steroid', text: 'Low-to-moderate dose corticosteroids should be reserved for patients in whom first-line therapy (NSAID/aspirin plus colchicine) fails or is contraindicated.', escClass: 'IIa', escLoe: 'C', section: 'Recommendation Table — pericarditis' },
      { id: 'mp-esc-exercise', text: 'Exercise restriction is recommended in the acute phase of myocarditis and pericarditis, with duration guided by clinical and inflammatory-marker resolution.', escClass: 'I', section: 'Table 13' },
      { id: 'mp-esc-beta-blocker', text: 'Beta-blockers for 6 months or longer should be considered in patients with acute myocarditis and elevated troponin to control symptoms and prevent arrhythmias.', escClass: 'IIa', section: 'Medical therapy — myocarditis' },
      { id: 'mp-esc-no-immunosuppression', text: 'Routine use of immunosuppressive therapy is not recommended in acute myocarditis with preserved left ventricular function, as no outcome benefit has been shown.', escClass: 'III', escLoe: 'C', section: 'Recommendation Table — myocarditis' },
    ],
  },

  // ----- Pulmonary / aortic / vascular -----
  {
    id: 'esc-2019-pe',
    society: ['ESC'],
    title: 'ESC Guidelines for the diagnosis and management of acute pulmonary embolism',
    edition: '2019',
    year: 2019,
    topics: ['pulmonary-embolism'],
    summary: 'PE diagnostic algorithm, risk stratification and anticoagulation.',
    url: 'https://erj.ersjournals.com/content/54/3/1901647',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'pe-esc-probability', text: 'Validated clinical probability scores (Wells or Geneva, or their simplified versions) are recommended for assessing the pre-test probability of PE.', escClass: 'I', escLoe: 'B', section: 'Section 4' },
      { id: 'pe-esc-risk-stratification', text: 'Initial risk stratification is recommended in all patients with suspected or confirmed PE, incorporating clinical severity (e.g. sPESI) plus RV function and biomarkers.', escClass: 'I', section: 'Section 5.7' },
      { id: 'pe-esc-anticoag-early', text: 'Initiation of anticoagulation is recommended without delay in patients with high or intermediate clinical probability of PE while the diagnostic workup is in progress.', escClass: 'I', escLoe: 'C', section: 'Section 6' },
      { id: 'pe-esc-parenteral', text: 'If anticoagulation is initiated parenterally, low-molecular-weight heparin or fondaparinux is recommended over unfractionated heparin for most patients.', escClass: 'I', escLoe: 'A', section: 'Section 6' },
      { id: 'pe-esc-noac', text: 'When oral anticoagulation is started in a patient with PE who is eligible for a NOAC, a NOAC is recommended in preference to a vitamin K antagonist.', escClass: 'I', escLoe: 'A', section: 'Section 6' },
      { id: 'pe-esc-thrombolysis-high', text: 'Systemic thrombolytic therapy is recommended for patients with high-risk (haemodynamically unstable) PE.', escClass: 'I', escLoe: 'B', section: 'Section 6.6' },
      { id: 'pe-esc-no-routine-thrombolysis', text: 'Routine primary systemic thrombolysis is not recommended in patients with intermediate- or low-risk PE.', escClass: 'III', escLoe: 'B', section: 'Section 6.7' },
      { id: 'pe-esc-rescue-thrombolysis', text: 'Rescue thrombolytic therapy is recommended for patients with haemodynamic deterioration on anticoagulation treatment.', escClass: 'I', section: 'Section 6.7' },
      { id: 'pe-esc-embolectomy', text: 'Surgical pulmonary embolectomy is recommended for patients with high-risk PE in whom thrombolysis is contraindicated or has failed.', escClass: 'I', escLoe: 'C', section: 'Section 6.6' },
      { id: 'pe-esc-catheter', text: 'Percutaneous catheter-directed treatment should be considered for patients with high-risk PE in whom thrombolysis is contraindicated or has failed.', escClass: 'IIa', escLoe: 'C', section: 'Section 6.6' },
      { id: 'pe-esc-3months', text: 'Therapeutic anticoagulation for at least 3 months is recommended in all patients with PE.', escClass: 'I', escLoe: 'A', section: 'Section 8' },
      { id: 'pe-esc-followup', text: 'Clinical evaluation is recommended 3 to 6 months after acute PE.', escClass: 'I', escLoe: 'B', section: 'Section 10.4' },
    ],
  },
  {
    id: 'esc-2024-pad-aorta',
    society: ['ESC'],
    title: 'ESC Guidelines for the management of peripheral arterial and aortic diseases',
    edition: '2024',
    year: 2024,
    topics: ['peripheral-artery-disease', 'aaa', 'aortic-dissection', 'coarctation-aorta'],
    summary: 'Combined peripheral arterial and aortic disease guideline.',
    url: 'https://academic.oup.com/eurheartj/article/45/36/3538/7740848',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'pad-esc-aaa-screening', text: 'Screening with duplex ultrasound is recommended in men aged ≥65 years with a history of smoking, to reduce the risk of death from ruptured abdominal aortic aneurysm.', escClass: 'I', escLoe: 'A', section: 'Recommendation Table — AAA screening' },
      { id: 'pad-esc-aaa-relatives', text: 'First-degree relatives aged ≥50 years of patients with an abdominal aortic aneurysm should be screened with duplex ultrasound, unless another cause for the index aneurysm is identified.', escClass: 'I', escLoe: 'C', section: 'Recommendation Table — AAA screening' },
      { id: 'pad-esc-aaa-women', text: 'Screening may be considered in women aged >65 years with a history of current or past smoking.', escClass: 'IIb', section: 'Recommendation Table — AAA screening' },
      { id: 'pad-esc-entire-aorta', text: 'When an aortic aneurysm is identified at any location, assessment of the entire aorta is recommended at baseline and during follow-up.', escClass: 'I', escLoe: 'C', section: 'Recommendation Table — aortic aneurysm' },
      { id: 'pad-esc-taa-valve', text: 'When a thoracic aortic aneurysm is identified, assessment of the aortic valve (especially for a bicuspid aortic valve) is recommended.', escClass: 'I', escLoe: 'C', section: 'Recommendation Table — aortic aneurysm' },
      { id: 'pad-esc-aaa-fem-pop', text: 'When an abdominal aortic aneurysm is identified, evaluation for aneurysm in the femoro-popliteal segment should be considered.', escClass: 'IIa', escLoe: 'C', section: 'Recommendation Table — aortic aneurysm' },
      { id: 'pad-esc-ascending-surgery', text: 'In patients with an ascending aortic aneurysm, surgery is recommended at a maximal diameter of ≥55 mm; a valve-sparing aortic root replacement is recommended in experienced centres.', escClass: 'I', escLoe: 'B', section: 'Thoracic aortic aneurysm' },
      { id: 'pad-esc-bav-surgery', text: 'Surgery for a bicuspid aortic valve with an ascending aortic aneurysm should be considered at a diameter ≥45 mm.', escClass: 'IIa', escLoe: 'C', section: 'Thoracic aortic aneurysm' },
      { id: 'pad-esc-pad-bp', text: 'In patients with peripheral arterial disease and hypertension, a systolic blood pressure target of 120–129 mmHg is recommended.', escClass: 'I', section: 'PAD risk-factor management' },
      { id: 'pad-esc-aortic-plaque', text: 'In patients with severe or complex aortic atheromatous plaques, initiating statin treatment or single antiplatelet therapy (clopidogrel or low-dose aspirin) should be considered.', escClass: 'IIa', escLoe: 'C', section: 'Aortic atherosclerosis' },
    ],
  },

  // ----- Infective endocarditis -----
  {
    id: 'esc-2023-endocarditis',
    society: ['ESC'],
    title: 'ESC Guidelines for the management of infective endocarditis',
    edition: '2023',
    year: 2023,
    topics: ['infective-endocarditis'],
    summary: 'IE diagnosis (modified Duke), imaging, and surgical indications.',
    url: 'https://academic.oup.com/eurheartj/article/44/39/3948/7241291',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'ie-esc-cultures', text: 'At least three sets of blood cultures should be obtained at 30-minute intervals from a peripheral vein before starting antibiotics in suspected infective endocarditis.', escClass: 'I', section: 'Section 5.3' },
      { id: 'ie-esc-hf-surgery', text: 'Urgent surgery is recommended in aortic or mitral native or prosthetic valve endocarditis resulting in heart failure.', escClass: 'I', section: 'Recommendation Table 12' },
      { id: 'ie-esc-emergency-surgery', text: 'Emergency surgery (within 24 h) is recommended when aortic or mitral native or prosthetic valve endocarditis causes regurgitation, obstruction or fistula resulting in refractory pulmonary oedema or cardiogenic shock.', escClass: 'I', section: 'Recommendation Table 12' },
      { id: 'ie-esc-vegetation-10', text: 'Urgent surgery is recommended in infective endocarditis with vegetation ≥10 mm and other indications for surgery.', escClass: 'I', escLoe: 'C', section: 'Recommendation Table 12' },
      { id: 'ie-esc-vegetation-isolated', text: 'Urgent surgery may be considered in aortic or mitral IE with vegetation ≥10 mm without severe valve dysfunction or clinical evidence of embolism, in patients at low surgical risk.', escClass: 'IIb', escLoe: 'B', section: 'Recommendation Table 12' },
      { id: 'ie-esc-early-pve', text: 'Surgery is recommended for early prosthetic valve endocarditis (within 6 months of valve surgery) with valve replacement and complete debridement.', escClass: 'I', escLoe: 'C', section: 'Recommendation Table 19' },
      { id: 'ie-esc-cied-extraction', text: 'Complete system extraction without delay is recommended in patients with definite CIED-related infective endocarditis during initial empiric antibiotic therapy.', escClass: 'I', section: 'Recommendation Table 20' },
      { id: 'ie-esc-right-sided', text: 'Surgery is recommended in right-sided IE with acute severe tricuspid regurgitation causing RV dysfunction, recurrent pulmonary embolism requiring ventilatory support, large (>20 mm) residual vegetations, or left-sided involvement.', escClass: 'I', section: 'Recommendation Table 21' },
      { id: 'ie-esc-ischaemic-stroke', text: 'In patients with ischaemic stroke and a clear indication for surgery, surgery should not be delayed.', escClass: 'I', section: 'Recommendation Table 13' },
      { id: 'ie-esc-haemorrhagic-stroke', text: 'In patients with significant pre-operative haemorrhagic stroke, a delay in surgery of at least 4 weeks should be considered.', escClass: 'IIa', section: 'Recommendation Table 13' },
    ],
  },

  // ----- Prevention / comorbidity / rehab -----
  {
    id: 'esc-2025-lipids',
    society: ['ESC'],
    title: 'ESC/EAS Guidelines for the management of dyslipidaemias (focused update)',
    edition: '2025',
    year: 2025,
    supersedes: ['esc-2019-lipids'],
    topics: ['stable-ischemic-heart-disease', 'peripheral-artery-disease', 'atherosclerosis'],
    summary: 'LDL-C targets and lipid-lowering therapy; focused update of the 2019 guideline.',
    url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/dyslipidaemias',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'lipids-esc-primary-prevention', text: 'In primary prevention, pharmacological LDL-C-lowering therapy is recommended in persons at very high risk with LDL-C ≥1.8 mmol/L (70 mg/dL), or at high risk with LDL-C ≥2.6 mmol/L (100 mg/dL), despite optimisation of non-pharmacological measures, to lower cardiovascular risk.', escClass: 'I', escLoe: 'A', section: 'Recommendation Table' },
      { id: 'lipids-esc-nonstatin', text: 'Non-statin therapies with proven cardiovascular benefit, taken alone or in combination, are recommended for patients unable to take statin therapy, to lower LDL-C and reduce cardiovascular events.', escClass: 'I', escLoe: 'A', section: 'Recommendation Table' },
      { id: 'lipids-esc-bempedoic', text: 'Bempedoic acid is recommended in patients who are unable to take statin therapy in order to achieve the LDL-C goal.', escClass: 'I', escLoe: 'B', section: 'Recommendation Table' },
      { id: 'lipids-esc-target-veryhigh', text: 'An LDL-C goal of <1.4 mmol/L (55 mg/dL) and a ≥50% reduction from baseline is recommended for patients at very high cardiovascular risk.', escClass: 'I', section: 'LDL-C targets' },
      { id: 'lipids-esc-target-high', text: 'An LDL-C goal of <1.8 mmol/L (70 mg/dL) is recommended for patients at high cardiovascular risk.', escClass: 'I', section: 'LDL-C targets' },
      { id: 'lipids-esc-hiv', text: 'Statin therapy is recommended in people with HIV aged ≥40 years, irrespective of baseline LDL-C, to reduce cardiovascular risk.', escClass: 'I', section: 'Special populations' },
    ],
  },
  {
    id: 'esc-2026-ckd',
    society: ['ESC'],
    title: 'ESC Guidelines for the management of cardiovascular disease and chronic kidney disease',
    edition: '2026',
    year: 2026,
    topics: ['hfref', 'amyloidosis'],
    summary: 'First ESC guideline dedicated to CVD and CKD ("STAMP on CKD" framework).',
    url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/cvd-chronic-kidney-disease',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'ckd-esc-acei-arb-sglt2', text: 'An ACE inhibitor or ARB, together with an SGLT2 inhibitor, is recommended for most patients with chronic kidney disease to reduce the risk of CKD progression and cardiovascular events.', escClass: 'I', section: 'Addressing risk — medical therapy' },
      { id: 'ckd-esc-finerenone-glp1', text: 'A non-steroidal mineralocorticoid receptor antagonist (finerenone) and a GLP-1 receptor agonist (semaglutide) are recommended for patients with CKD, type 2 diabetes and albuminuria, to reduce CKD progression and cardiovascular events.', escClass: 'I', section: 'Addressing risk — medical therapy' },
      { id: 'ckd-esc-statin', text: 'Suitably intensive statin-based therapy, with or without ezetimibe, is recommended for patients with CKD not on dialysis, irrespective of lipid levels, to reduce the risk of atherosclerotic cardiovascular disease.', escClass: 'I', section: 'Addressing risk — medical therapy' },
      { id: 'ckd-esc-risk-score', text: 'Cardiovascular risk scores that incorporate eGFR and/or albuminuria should be used to establish accurate cardiovascular risk in patients with CKD.', escClass: 'I', section: 'Triage' },
      { id: 'ckd-esc-sglt2-threshold', text: 'SGLT2 inhibitors may be initiated at an eGFR ≥20 mL/min/1.73 m² and continued as eGFR declines below 20 until the initiation of kidney replacement therapy.', escClass: 'IIa', section: 'Addressing risk — medical therapy' },
    ],
  },
  {
    id: 'esc-2026-cardiac-rehab',
    society: ['ESC'],
    title: 'ESC Guidelines on cardiac rehabilitation',
    edition: '2026',
    year: 2026,
    topics: ['stable-ischemic-heart-disease', 'hfref'],
    summary: 'First ESC guideline dedicated to cardiac rehabilitation.',
    url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/cardiac-rehabilitation',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'cr-esc-hf-telehealth', text: 'Integration of telehealth consultations is recommended in patients with heart failure to reduce short-term cardiovascular mortality and hospitalization.', escClass: 'I', escLoe: 'B1', section: 'Recommendation Table — delivery' },
      { id: 'cr-esc-participation', text: 'Endorsement of cardiac rehabilitation by the attending physician and other health professionals, automatic referral, invitation to an initial assessment, and increasing programme availability are recommended to improve participation.', escClass: 'I', section: 'Recommendation Table — participation' },
      { id: 'cr-esc-telehealth-participation', text: 'Telehealth consultations should be considered to increase cardiac rehabilitation participation and adherence.', escClass: 'IIa', section: 'Recommendation Table — delivery' },
      { id: 'cr-esc-early-dhf', text: 'Early initiation of cardiac rehabilitation should be considered in patients hospitalized for decompensated heart failure, to reduce in-hospital mortality, once congestion and haemodynamics are stabilized and guideline-directed medical therapy initiated.', escClass: 'IIa', section: 'Recommendation Table — indications' },
      { id: 'cr-esc-telemetry', text: 'Telemetry during exercise training may be considered in selected patients.', escClass: 'IIb', section: 'Recommendation Table — delivery' },
    ],
  },
  {
    id: 'esc-2025-pregnancy',
    society: ['ESC'],
    title: 'ESC Guidelines for the management of cardiovascular disease and pregnancy',
    edition: '2025',
    year: 2025,
    topics: ['aortic-dissection', 'mitral-stenosis', 'pulmonary-embolism'],
    summary: 'CVD in pregnancy: risk assessment and management.',
    url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/cardiovascular-diseases-during-pregnancy-management-of',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'preg-esc-heart-team', text: 'Consultation with a Pregnancy Heart Team is recommended for women with cardiovascular disease classified mWHO 2.0 class II–III or higher, from preconception through the postpartum period.', escClass: 'I', section: 'Pregnancy Heart Team' },
      { id: 'preg-esc-chest-pain', text: 'In pregnant women with chest pain, it is recommended to exclude life-threatening cardiovascular conditions, including pulmonary embolism and acute coronary syndrome.', escClass: 'I', section: 'Recommendation Table 12' },
      { id: 'preg-esc-lqts-bb', text: 'Beta-blockers (propranolol or nadolol) are recommended throughout pregnancy in women with long QT syndrome or catecholaminergic polymorphic VT, with fetal growth monitoring; atenolol is the only contraindicated beta-blocker.', escClass: 'I', section: 'Primary arrhythmia syndromes' },
      { id: 'preg-esc-mechanical-valve', text: 'Mechanical heart valves should be avoided, where possible, in women of childbearing age.', escClass: 'I', section: 'Valvular heart disease' },
      { id: 'preg-esc-htn-drugs', text: 'Methyldopa, labetalol and calcium channel blockers are recommended for the treatment of hypertension in pregnancy.', escClass: 'I', section: 'Hypertensive disorders' },
      { id: 'preg-esc-cpr', text: 'Continuous manual left uterine displacement is recommended during cardiopulmonary resuscitation in pregnant women at ≥20 weeks of gestation.', escClass: 'I', section: 'Cardiac arrest' },
      { id: 'preg-esc-rasi-no', text: 'ACE inhibitors, ARBs, direct renin inhibitors, ARNIs, mineralocorticoid receptor antagonists and SGLT2 inhibitors are not recommended during pregnancy.', escClass: 'III', section: 'Drugs during pregnancy' },
      { id: 'preg-esc-ablation', text: 'When catheter ablation is performed during pregnancy, the use of non-fluoroscopic mapping and navigation systems should be considered.', escClass: 'IIa', escLoe: 'C', section: 'Arrhythmias' },
    ],
  },
  {
    id: 'esc-udmi5-2026',
    society: ['ESC', 'AHA/ACC'],
    title: 'Fifth Universal Definition of Myocardial Infarction',
    edition: '2026',
    year: 2026,
    topics: ['stemi', 'nstemi', 'minoca'],
    summary: 'Consensus definition and classification of myocardial infarction.',
    verifiedAt: '2026-10-14',
    status: 'pending',
    recommendations: [],
  },

  // ----- Adult congenital heart disease -----
  {
    id: 'esc-2020-achd',
    society: ['ESC'],
    title: 'ESC Guidelines for the management of adult congenital heart disease',
    edition: '2020',
    year: 2020,
    topics: ['asd', 'coarctation-aorta', 'bicuspid-aortic-valve', 'ventricular-septal-defect', 'pulmonary-stenosis', 'patent-ductus-arteriosus', 'ebstein-anomaly', 'tetralogy-of-fallot'],
    summary: 'Adult congenital heart disease: diagnosis, repair and follow-up.',
    url: 'https://academic.oup.com/eurheartj/article/42/6/563/5898956',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'achd-esc-asd-closure', text: 'ASD closure is recommended, regardless of symptoms, in patients with evidence of right ventricular volume overload without pulmonary arterial hypertension or left ventricular disease.', escClass: 'I', section: 'ASD' },
      { id: 'achd-esc-asd-no', text: 'ASD closure is not recommended in patients with Eisenmenger physiology, pulmonary arterial hypertension with PVR >5 WU despite targeted treatment, or desaturation on exercise.', escClass: 'III', section: 'ASD' },
      { id: 'achd-esc-asd-balloon', text: 'In patients with left ventricular disease, balloon testing is recommended before ASD closure to weigh the benefit of eliminating the left-to-right shunt against the risk of rising filling pressures.', escClass: 'I', escLoe: 'C', section: 'ASD' },
      { id: 'achd-esc-shunt-closure', text: 'Closure of an ASD, VSD or PDA with a significant shunt (Qp:Qs >1.5) and PVR <3 Wood units is recommended.', escClass: 'I', section: 'Shunt closure' },
      { id: 'achd-esc-shunt-pvr', text: 'Closure of an ASD, VSD or PDA with PVR 3–5 Wood units should be considered.', escClass: 'IIa', section: 'Shunt closure' },
      { id: 'achd-esc-arrhythmia-referral', text: 'Patients with moderate or severe congenital heart disease complexity and documented arrhythmias should be referred to a centre with a multidisciplinary ACHD team.', escClass: 'I', section: 'Arrhythmias in ACHD' },
      { id: 'achd-esc-surgical-closure', text: 'Surgical closure by a congenital cardiac surgeon is recommended in patients with significant right ventricular volume overload.', escClass: 'I', section: 'ASD' },
      { id: 'achd-esc-av-valve', text: 'Valve surgery, preferably AV valve repair, by a congenital cardiac surgeon is recommended in symptomatic patients with moderate-to-severe AV valve regurgitation.', escClass: 'I', section: 'AV valve disease' },
    ],
  },

  // ----- US-only guidelines (AHA/ACC) -----
  {
    id: 'acc-2021-chest-pain',
    society: ['AHA/ACC'],
    title: 'AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for the Evaluation and Diagnosis of Chest Pain',
    edition: '2021',
    year: 2021,
    topics: ['stable-ischemic-heart-disease', 'unstable-angina', 'nstemi'],
    summary: 'Symptom-based evaluation of acute and stable chest pain; defines modern diagnostic testing pathways.',
    url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000001029',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'cp-acc-ccta', text: 'For intermediate-high risk patients with stable chest pain and no known CAD, CCTA is effective for the diagnosis of CAD, risk stratification and guiding treatment decisions.', accClass: 'I', accLoe: 'A', section: 'Anatomic testing' },
      { id: 'cp-acc-stress-after-ccta', text: 'For intermediate-high risk patients with stable chest pain after an inconclusive CCTA, stress imaging is reasonable.', accClass: 'IIa', accLoe: 'B-NR', section: 'Stress testing' },
      { id: 'cp-acc-ica', text: 'Invasive coronary angiography is recommended for patients with moderate-to-severe ischaemia, high-risk CAD (e.g. left main >50% or 3-vessel >70%), or obstructive CAD with frequent angina.', accClass: 'I', accLoe: 'C-EO', section: 'Invasive testing' },
      { id: 'cp-acc-troponin', text: 'High-sensitivity cardiac troponin is the preferred biomarker for the diagnosis of acute myocardial injury in patients with acute chest pain.', accClass: 'I', section: 'Biomarkers' },
    ],
  },
  {
    id: 'acc-2021-revascularization',
    society: ['AHA/ACC'],
    title: 'ACC/AHA/SCAI Guideline for Coronary Artery Revascularization',
    edition: '2021',
    year: 2021,
    topics: ['stable-ischemic-heart-disease', 'stemi', 'nstemi'],
    summary: 'Choice of PCI vs CABG and peri-procedural management for significant coronary artery disease.',
    url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000001038',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'rev-acc-leftmain', text: 'In patients who require revascularization for significant left main CAD with high-complexity CAD, it is recommended to choose CABG over PCI to improve survival.', accClass: 'I', accLoe: 'B-R', section: 'Complex disease' },
      { id: 'rev-acc-heart-team', text: 'A multidisciplinary Heart Team approach is recommended in patients being considered for coronary revascularization in whom the optimal treatment strategy is unclear.', accClass: 'I', section: 'Heart Team' },
      { id: 'rev-acc-cabg-lvef', text: 'CABG is recommended in patients with significant CAD and LVEF ≤35% to improve survival.', accClass: 'I', section: 'Left ventricular dysfunction' },
      { id: 'rev-acc-cabg-aspirin', text: 'In patients undergoing CABG, aspirin (100–325 mg daily) should be initiated within 6 hours postoperatively and continued indefinitely to reduce saphenous vein graft closure and adverse cardiovascular events.', accClass: 'I', accLoe: 'A', section: 'Post-CABG' },
    ],
  },
  {
    id: 'acc-2024-pad',
    society: ['AHA/ACC'],
    title: 'ACC/AHA/Multisociety Guideline for the Management of Lower Extremity Peripheral Artery Disease',
    edition: '2024',
    year: 2024,
    supersedes: ['acc-2016-pad'],
    topics: ['peripheral-artery-disease', 'aaa'],
    summary: 'Updates the 2016 PAD guideline; structured exercise and comprehensive cardiovascular risk management.',
    url: 'https://www.jacc.org/doi/10.1016/j.jacc.2024.02.013',
    verifiedAt: '2026-10-14',
    status: 'verified',
    changesSince: [
      { text: 'Structured exercise therapy (supervised or structured community/home-based) reinforced as first-line for claudication.', kind: 'revised' },
      { text: 'New emphasis on comprehensive cardiovascular risk reduction and longitudinal functional assessment.', kind: 'new' },
    ],
    recommendations: [
      { id: 'pad-acc-exercise', text: 'In patients with chronic symptomatic PAD, supervised exercise therapy or a structured community-based exercise programme with behavioural change techniques is recommended to improve walking performance, functional status and quality of life.', accClass: 'I', accLoe: 'A', section: 'Exercise therapy' },
      { id: 'pad-acc-abi-diagnosis', text: 'In patients with a history or physical examination findings suggestive of PAD, a resting ankle-brachial index is recommended to establish the diagnosis.', accClass: 'I', accLoe: 'B-NR', section: 'Diagnosis' },
      { id: 'pad-acc-abi-screening', text: 'In patients at increased risk of PAD, screening with a resting ankle-brachial index is reasonable.', accClass: 'IIa', accLoe: 'B-NR', section: 'Screening' },
      { id: 'pad-acc-followup-exam', text: 'In patients with PAD, with or without revascularization, longitudinal follow-up with physical examination is recommended.', accClass: 'I', accLoe: 'C-EO', section: 'Follow-up' },
      { id: 'pad-acc-postrevasc-duplex', text: 'In patients who have undergone revascularization and have new lower extremity signs or symptoms, ABI and arterial duplex ultrasound are recommended.', accClass: 'I', accLoe: 'C-LD', section: 'Follow-up' },
    ],
  },
  {
    id: 'acc-2026-dyslipidemia',
    society: ['AHA/ACC'],
    title: 'ACC/AHA/Multisociety Guideline on the Management of Dyslipidemia',
    edition: '2026',
    year: 2026,
    supersedes: ['acc-2018-cholesterol'],
    topics: ['stable-ischemic-heart-disease', 'peripheral-artery-disease', 'atherosclerosis'],
    summary: 'Reintroduces LDL-C treatment goals based on the PREVENT risk calculator; retires the 2018 cholesterol guideline.',
    url: 'https://www.jacc.org/doi/10.1016/j.jacc.2025.11.016',
    verifiedAt: '2026-10-14',
    status: 'verified',
    changesSince: [
      { text: 'LDL-C and non-HDL-C treatment goals reintroduced (borderline/intermediate <100, high <70, very high <55 mg/dL).', kind: 'new' },
      { text: 'PREVENT risk equations replace the pooled cohort equations.', kind: 'revised' },
      { text: 'Retires and replaces the 2018 blood cholesterol guideline.', kind: 'removed' },
    ],
    recommendations: [
      { id: 'lip-acc-diabetes', text: 'In adults 40–75 years of age with diabetes and without clinical ASCVD, moderate-intensity statin therapy is recommended to achieve a ≥30–49% LDL-C reduction and a goal of LDL-C <100 mg/dL (2.6 mmol/L) and non-HDL-C <130 mg/dL (3.4 mmol/L).', accClass: 'I', accLoe: 'A', section: 'Diabetes' },
      { id: 'lip-acc-ckd', text: 'In adults 40–75 years of age with CKD stage ≥3 and LDL-C 70–189 mg/dL (1.8–4.9 mmol/L), moderate-intensity statin therapy, or moderate-intensity statin combined with ezetimibe, is recommended to reduce ASCVD risk.', accClass: 'I', accLoe: 'B-R', section: 'CKD' },
      { id: 'lip-acc-cac', text: 'In adults with a coronary artery calcium score ≥1000 AU, LDL-C-lowering therapy (statin first line) is recommended to achieve a ≥50% LDL-C reduction and a goal of LDL-C <55 mg/dL (1.4 mmol/L) and non-HDL-C <85 mg/dL (2.2 mmol/L).', accClass: 'I', accLoe: 'B-NR', section: 'Risk stratification' },
    ],
  },
  {
    id: 'acc-2022-aortic',
    society: ['AHA/ACC'],
    title: 'ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease',
    edition: '2022',
    year: 2022,
    topics: ['aortic-dissection', 'aaa', 'bicuspid-aortic-valve', 'coarctation-aorta'],
    summary: 'Surgical thresholds, imaging and multidisciplinary aortic team care across the aorta.',
    url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000001106',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'ao-acc-ascending-55', text: 'In asymptomatic patients with aneurysms of the aortic root or ascending aorta, surgery is indicated at a maximal diameter ≥5.5 cm; surgery is reasonable at ≥5.0 cm in experienced centres with a multidisciplinary aortic team.', accClass: 'I', section: 'Ascending aorta' },
      { id: 'ao-acc-marfan-50', text: 'In patients with Marfan syndrome and an aortic root diameter ≥5.0 cm, surgery to replace the aortic root and ascending aorta is recommended.', accClass: 'I', section: 'Heritable thoracic aortic disease' },
      { id: 'ao-acc-nshtad', text: 'In patients with nonsyndromic heritable thoracic aortic disease and no identified genetic cause, repair is recommended at ≥5.0 cm without high-risk features, or ≥4.5 cm with high-risk features.', accClass: 'I', accLoe: 'C-LD', section: 'Heritable thoracic aortic disease' },
      { id: 'ao-acc-aaa', text: 'In patients with an unruptured abdominal aortic aneurysm, repair is recommended at a maximal diameter ≥5.5 cm in men or ≥5.0 cm in women.', accClass: 'I', accLoe: 'A', section: 'Abdominal aorta' },
      { id: 'ao-acc-aaa-symptoms', text: 'In patients with an unruptured abdominal aortic aneurysm and symptoms attributable to the aneurysm, repair is recommended to reduce the risk of rupture.', accClass: 'I', accLoe: 'B-NR', section: 'Abdominal aorta' },
      { id: 'ao-acc-bav-surveillance', text: 'In patients with a bicuspid aortic valve who have undergone aortic valve repair or replacement and have an aortic root or ascending aortic diameter ≥4.0 cm, lifelong surveillance imaging is recommended.', accClass: 'I', accLoe: 'B-NR', section: 'Bicuspid aortic valve' },
    ],
  },
  {
    id: 'acc-2017-syncope',
    society: ['AHA/ACC', 'HRS'],
    title: 'ACC/AHA/HRS Guideline for the Evaluation and Management of Patients With Syncope',
    edition: '2017',
    year: 2017,
    topics: ['third-degree-av-block', 'sick-sinus-syndrome'],
    summary: 'Structured evaluation of transient loss of consciousness and risk assessment.',
    url: 'https://www.ahajournals.org/doi/10.1161/cir.0000000000000499',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'syn-acc-history', text: 'A detailed history and physical examination should be performed in patients with syncope.', accClass: 'I', accLoe: 'B-NR', section: 'Initial evaluation' },
      { id: 'syn-acc-ecg', text: 'A 12-lead ECG should be obtained as part of the initial evaluation of patients with syncope.', accClass: 'I', section: 'Initial evaluation' },
      { id: 'syn-acc-risk', text: 'Evaluation of the cause and assessment of the short- and long-term morbidity and mortality risk of syncope are recommended.', accClass: 'I', accLoe: 'B-NR', section: 'Risk assessment' },
      { id: 'syn-acc-arvc-icd', text: 'ICD implantation is recommended in patients with ARVC who present with syncope and have documented sustained ventricular arrhythmia.', accClass: 'I', accLoe: 'B-NR', section: 'ARVC' },
    ],
  },

  // ----- Phase 4 additions -----
  {
    id: 'esc-2018-syncope',
    society: ['ESC'],
    title: 'ESC Guidelines for the diagnosis and management of syncope',
    edition: '2018',
    year: 2018,
    topics: ['syncope', 'orthostatic-hypotension'],
    summary: 'Initial evaluation, risk stratification and management of transient loss of consciousness.',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'syn-esc-csm', text: 'Carotid sinus massage is recommended in patients >40 years with syncope of unknown origin compatible with a reflex mechanism.', escClass: 'I', escLoe: 'B', section: 'Diagnostic tests' },
      { id: 'syn-esc-css-pacing', text: 'Cardiac pacing is recommended in patients with cardioinhibitory carotid sinus syndrome and recurrent unpredictable syncope, with reproduction of symptoms on carotid sinus massage.', escClass: 'I', escLoe: 'A', section: 'Treatment' },
      { id: 'syn-esc-ecg-monitoring', text: 'Immediate ECG monitoring is recommended in patients with suspected arrhythmic syncope.', escClass: 'I', section: 'Diagnostic tests' },
      { id: 'syn-esc-echo', text: 'Echocardiography is recommended in patients with suspected structural heart disease and syncope.', escClass: 'I', section: 'Diagnostic tests' },
      { id: 'syn-esc-tilt', text: 'Head-up tilt testing is recommended in patients with suspected reflex syncope or orthostatic hypotension.', escClass: 'I', section: 'Diagnostic tests' },
    ],
  },
  {
    id: 'esc-2022-ph',
    society: ['ESC/ERS'],
    title: 'ESC/ERS Guidelines for the diagnosis and treatment of pulmonary hypertension',
    edition: '2022',
    year: 2022,
    topics: ['pulmonary-arterial-hypertension', 'cor-pulmonale'],
    summary: 'WHO classification, diagnostic algorithm and risk-stratified therapy for pulmonary hypertension.',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'ph-esc-echo', text: 'Echocardiography is recommended as the initial non-invasive diagnostic study in patients with suspected pulmonary hypertension.', escClass: 'I', section: 'Diagnosis' },
      { id: 'ph-esc-rhc', text: 'Right heart catheterisation is recommended to confirm the diagnosis of pulmonary hypertension.', escClass: 'I', section: 'Diagnosis' },
      { id: 'ph-esc-vq', text: 'Ventilation/perfusion or perfusion lung scanning is recommended in patients with unexplained pulmonary hypertension to detect chronic thromboembolic pulmonary hypertension.', escClass: 'I', section: 'Diagnosis' },
      { id: 'ph-esc-scleroderma', text: 'Annual screening for pulmonary arterial hypertension is recommended in patients with systemic sclerosis.', escClass: 'I', section: 'Screening' },
      { id: 'ph-esc-ccb', text: 'High-dose calcium-channel blocker therapy is recommended in patients with idiopathic, heritable or drug-associated PAH (WHO-FC I–II) with a positive vasoreactivity test and marked haemodynamic improvement.', escClass: 'I', section: 'Treatment — PAH' },
      { id: 'ph-esc-combo', text: 'Initial combination therapy with a PDE5 inhibitor and an endothelin receptor antagonist is recommended in low- or intermediate-risk patients with idiopathic, heritable or drug-associated PAH.', escClass: 'I', escLoe: 'B', section: 'Treatment — PAH' },
      { id: 'ph-esc-cteph-anticoag', text: 'Lifelong anticoagulation is recommended in all patients with chronic thromboembolic pulmonary hypertension.', escClass: 'I', section: 'Treatment — CTEPH' },
      { id: 'ph-esc-riociguat', text: 'Riociguat is recommended for symptomatic patients with inoperable CTEPH, or with persistent or recurrent pulmonary hypertension after pulmonary endarterectomy.', escClass: 'I', section: 'Treatment — CTEPH' },
    ],
  },
  {
    id: 'esc-2024-hypertension',
    society: ['ESC'],
    title: 'ESC Guidelines for the management of elevated blood pressure and hypertension',
    edition: '2024',
    year: 2024,
    topics: ['hypertension', 'hypertensive-emergency'],
    summary: 'Diagnosis, risk assessment and treatment of elevated blood pressure and hypertension.',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'htn-esc-target', text: 'To reduce cardiovascular risk, treated systolic blood pressure in most adults should be targeted to 120–129 mmHg, provided the treatment is well tolerated.', escClass: 'I', escLoe: 'A', section: 'Recommendation Table 18' },
      { id: 'htn-esc-alara', text: 'Where blood-pressure-lowering treatment is poorly tolerated and a systolic of 120–129 mmHg cannot be achieved, a target systolic level as low as reasonably achievable (ALARA) is recommended.', escClass: 'I', escLoe: 'A', section: 'Recommendation Table 18' },
      { id: 'htn-esc-outofoffice', text: 'Out-of-office blood pressure measurement (ambulatory or home) is recommended for the diagnosis of hypertension to detect white-coat and masked hypertension.', escClass: 'I', section: 'Diagnosis' },
      { id: 'htn-esc-elevated', text: 'In high-risk individuals with elevated blood pressure (130–139/80–89 mmHg), a short period of lifestyle therapy followed by pharmacological therapy if blood pressure remains ≥130/80 mmHg is recommended.', escClass: 'I', escLoe: 'A', section: 'Treatment' },
    ],
  },
  {
    id: 'esc-2022-cardioonc',
    society: ['ESC'],
    title: 'ESC Guidelines on cardio-oncology',
    edition: '2022',
    year: 2022,
    topics: ['cardio-oncology', 'cardiac-tumours'],
    summary: 'Cardiovascular toxicity of cancer therapy: prevention, surveillance and management.',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'co-esc-baseline-echo', text: 'Baseline echocardiography is recommended in all patients with cancer before anthracycline chemotherapy.', escClass: 'I', escLoe: 'B', section: 'Recommendation Table 5' },
      { id: 'co-esc-echo-12mo', text: 'In all adults receiving anthracycline chemotherapy, an echocardiogram is recommended within 12 months after completing treatment.', escClass: 'I', escLoe: 'B', section: 'Recommendation Table 5' },
      { id: 'co-esc-highrisk-monitoring', text: 'In high- and very-high-risk patients, echocardiography is recommended every two cycles during anthracycline chemotherapy.', escClass: 'I', escLoe: 'C', section: 'Recommendation Table 5' },
      { id: 'co-esc-risk-assessment', text: 'Baseline cardiovascular toxicity risk assessment using the HFA-ICOS proformas is recommended before potentially cardiotoxic cancer therapy.', escClass: 'I', section: 'Baseline risk assessment' },
      { id: 'co-esc-secondary-prevention', text: 'Management of cardiovascular disease according to the applicable ESC guidelines is recommended before, during and after cancer therapy.', escClass: 'I', escLoe: 'C', section: 'Recommendation Table 6' },
    ],
  },
  {
    id: 'esc-2020-sports',
    society: ['ESC'],
    title: 'ESC Guidelines on sports cardiology and exercise in patients with cardiovascular disease',
    edition: '2020',
    year: 2020,
    topics: ['athlete-sports-cardiology'],
    summary: 'Exercise prescription and eligibility for competitive sport in cardiovascular disease.',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'sp-esc-aerobic', text: 'At least 150 min/week of moderate-intensity, or 75 min/week of vigorous-intensity aerobic exercise (or an equivalent combination), is recommended in all healthy adults.', escClass: 'I', escLoe: 'A', section: 'General recommendations' },
      { id: 'sp-esc-progress', text: 'A gradual increase in aerobic exercise to 300 min/week of moderate-intensity (or 150 min/week of vigorous-intensity) is recommended for additional benefit.', escClass: 'I', escLoe: 'A', section: 'General recommendations' },
      { id: 'sp-esc-hypertension-resistance', text: 'In individuals with well-controlled hypertension, resistance training ≥3 times per week, in addition to aerobic exercise, is recommended to reduce blood pressure and cardiovascular risk.', escClass: 'I', escLoe: 'A', section: 'Hypertension' },
      { id: 'sp-esc-diabetes-resistance', text: 'In individuals with diabetes mellitus, resistance training ≥3 times per week, in addition to aerobic exercise, is recommended to improve insulin sensitivity and cardiovascular risk profile.', escClass: 'I', escLoe: 'A', section: 'Diabetes' },
    ],
  },
  {
    id: 'esc-2019-diabetes',
    society: ['ESC'],
    title: 'ESC Guidelines on diabetes, pre-diabetes and cardiovascular diseases',
    edition: '2019',
    year: 2019,
    topics: ['cardiometabolic-ckm', 'obstructive-sleep-apnoea'],
    summary: 'Cardiometabolic risk and organ-protective therapies in diabetes and cardiovascular disease.',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'dia-esc-sglt2', text: 'SGLT2 inhibitors with proven cardiovascular benefit are recommended in patients with type 2 diabetes and atherosclerotic cardiovascular disease, to reduce cardiovascular events.', escClass: 'I', escLoe: 'A', section: 'Glucose-lowering therapy' },
      { id: 'dia-esc-glp1', text: 'GLP-1 receptor agonists with proven cardiovascular benefit are recommended in patients with type 2 diabetes and atherosclerotic cardiovascular disease, to reduce cardiovascular events.', escClass: 'I', escLoe: 'A', section: 'Glucose-lowering therapy' },
      { id: 'dia-esc-hf-sglt2', text: 'SGLT2 inhibitors are recommended in patients with type 2 diabetes and heart failure to reduce heart failure hospitalisation.', escClass: 'I', escLoe: 'A', section: 'Heart failure' },
    ],
  },
  {
    id: 'esc-2023-cardiomyopathies',
    society: ['ESC'],
    title: 'ESC Guidelines for the management of cardiomyopathies',
    edition: '2023',
    year: 2023,
    topics: ['hcm', 'arvc', 'dilated-cardiomyopathy', 'restrictive-cardiomyopathy', 'peripartum-cardiomyopathy', 'cardiac-sarcoidosis'],
    summary: 'First dedicated ESC cardiomyopathy guideline: HCM, DCM, ARVC, NDLVC, RCM and phenotype-specific SCD risk.',
    url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/cardiomyopathy',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'cm-esc-icd-secondary', text: 'ICD implantation is recommended in patients with HCM, DCM or ARVC who have survived a cardiac arrest due to VT/VF, or who have spontaneous sustained ventricular arrhythmia causing syncope or haemodynamic compromise, in the absence of reversible causes.', escClass: 'I', escLoe: 'B', section: 'Secondary prevention' },
      { id: 'cm-esc-dcm-icd', text: 'ICD implantation should be considered in patients with DCM, symptomatic heart failure and LVEF ≤35% despite more than 3 months of optimal medical therapy.', escClass: 'IIa', escLoe: 'A', section: 'DCM — SCD prevention' },
      { id: 'cm-esc-dcm-genotype-icd', text: 'ICD implantation should be considered in patients with DCM with a high-risk genotype and LVEF >35% in the presence of additional risk factors.', escClass: 'IIa', escLoe: 'C', section: 'DCM — SCD prevention' },
      { id: 'cm-esc-hcm-score', text: 'Use of a validated SCD risk score/algorithm is recommended to aid shared decision-making when offering ICD implantation in patients with HCM.', escClass: 'I', escLoe: 'B', section: 'HCM — SCD risk' },
      { id: 'cm-esc-hcm-bb', text: 'Beta-blockers are recommended as first-line therapy in symptomatic patients with HCM and left ventricular outflow tract obstruction.', escClass: 'I', section: 'HCM — medical therapy' },
      { id: 'cm-esc-hcm-mavacamten', text: 'Mavacamten should be considered in patients with obstructive HCM who remain symptomatic despite beta-blockers or non-dihydropyridine calcium-channel blockers.', escClass: 'IIa', section: 'HCM — medical therapy' },
      { id: 'cm-esc-arvc-bb', text: 'Beta-blocker therapy is recommended in patients with ARVC and ventricular ectopy, non-sustained VT or VT.', escClass: 'I', escLoe: 'C', section: 'ARVC — treatment' },
      { id: 'cm-esc-arvc-icd', text: 'ICD implantation is recommended in ARVC patients with haemodynamically not-tolerated VT or VF.', escClass: 'I', escLoe: 'C', section: 'ARVC — SCD prevention' },
    ],
  },
  {
    id: 'esc-2019-svt',
    society: ['ESC'],
    title: 'ESC Guidelines for the management of patients with supraventricular tachycardia',
    edition: '2019',
    year: 2019,
    topics: ['svt-psvt', 'wpw-syndrome'],
    summary: 'Diagnosis and management of SVT (AVNRT, AVRT/WPW, atrial tachycardia) with a central role for catheter ablation.',
    url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/supraventricular-tachycardia',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'svt-esc-vagal', text: 'Vagal manoeuvres, preferably in the supine position with leg elevation, are recommended for the acute management of regular SVT.', escClass: 'I', escLoe: 'B', section: 'Acute therapy' },
      { id: 'svt-esc-adenosine', text: 'Adenosine (6–18 mg IV bolus) is recommended for the acute management of regular SVT if vagal manoeuvres fail.', escClass: 'I', escLoe: 'B', section: 'Acute therapy' },
      { id: 'svt-esc-dccv', text: 'Synchronized DC cardioversion is recommended in haemodynamically unstable patients with SVT, and when drug therapy fails to convert or control the tachycardia.', escClass: 'I', escLoe: 'B', section: 'Acute therapy' },
      { id: 'svt-esc-verapamil', text: 'IV verapamil or diltiazem should be considered for regular SVT if vagal manoeuvres and adenosine fail.', escClass: 'IIa', escLoe: 'B', section: 'Acute therapy' },
      { id: 'svt-esc-ablation-avrt', text: 'Catheter ablation of the accessory pathway is recommended in patients with symptomatic, recurrent AVRT.', escClass: 'I', escLoe: 'B', section: 'Chronic therapy' },
      { id: 'svt-esc-verapamil-contra', text: 'Verapamil is not recommended in wide-QRS-complex tachycardia of unknown aetiology.', escClass: 'III', section: 'Acute therapy' },
    ],
  },
  {
    id: 'esc-2021-pacing',
    society: ['ESC'],
    title: 'ESC Guidelines on cardiac pacing and cardiac resynchronization therapy',
    edition: '2021',
    year: 2021,
    topics: ['implanted-devices', 'third-degree-av-block', 'sick-sinus-syndrome'],
    summary: 'Pacing modes, bradycardia indications and CRT selection by QRS morphology and duration.',
    url: 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/cardiac-pacing-and-cardiac-resynchronization-therapy',
    verifiedAt: '2026-10-14',
    status: 'verified',
    recommendations: [
      { id: 'pace-esc-crt-lbbb150', text: 'CRT is recommended for symptomatic patients with heart failure in sinus rhythm, LVEF ≤35%, QRS ≥150 ms and LBBB morphology, to improve symptoms and reduce morbidity and mortality.', escClass: 'I', escLoe: 'A', section: 'CRT' },
      { id: 'pace-esc-crt-lbbb130', text: 'CRT should be considered for symptomatic patients with heart failure, LVEF ≤35%, QRS 130–149 ms and LBBB morphology.', escClass: 'IIa', section: 'CRT' },
      { id: 'pace-esc-crt-nonlbbb', text: 'CRT should be considered for patients with heart failure, LVEF ≤35%, QRS ≥150 ms and non-LBBB morphology.', escClass: 'IIa', section: 'CRT' },
      { id: 'pace-esc-avb', text: 'Permanent pacemaker implantation is recommended in patients with third-degree or advanced second-degree AV block with symptoms or haemodynamic compromise.', escClass: 'I', section: 'Bradycardia — AV block' },
      { id: 'pace-esc-snd', text: 'Permanent pacemaker implantation is recommended for symptomatic sinus node dysfunction, with a preference for physiologic (atrial-based) pacing to reduce pacing-induced heart failure.', escClass: 'I', section: 'Bradycardia — sinus node dysfunction' },
    ],
  },
];

export const guidelinesMap = new Map(guidelines.map((g) => [g.id, g]));

export const getGuideline = (id: string): Guideline | undefined => guidelinesMap.get(id);

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

export const societyLabel: Record<Society, string> = {
  'ESC': 'ESC',
  'AHA/ACC': 'AHA/ACC',
  'ESC/EACTS': 'ESC/EACTS',
  'ESC/ERS': 'ESC/ERS',
  'ESC/HFA': 'ESC/HFA',
  'HRS': 'HRS',
};

/** Guidelines that cover a given condition id. */
export function guidelinesForCondition(conditionId: string): Guideline[] {
  return guidelines.filter((g) => g.topics.includes(conditionId));
}

/** Whether a guideline belongs to the selected society view. */
export function matchesSociety(guideline: Guideline, society: Society | 'both'): boolean {
  if (society === 'both') return true;
  if (society === 'ESC') return guideline.society.some((s) => s.startsWith('ESC'));
  return guideline.society.some((s) => s === 'AHA/ACC' || s === 'HRS' || s.startsWith('ACC'));
}
