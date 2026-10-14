/**
 * Bulgarian specialist-exam syllabus (конспект) — 64 points.
 * ---------------------------------------------------------------------------
 * One `ExamTopic` per syllabus point. Each study note is assembled live from
 * the linked conditions / guidelines / medications / instruments / figures, so
 * content stays in sync and nothing is duplicated.
 *
 * Headings are Bulgarian; clinical terms stay English (per the user's choice).
 * A point with no mapped data renders an explicit gap notice instead of hiding it.
 */
export interface ExamTopicLinks {
  conditionIds: string[];
  guidelineIds: string[];
  medicationIds: string[];
  instrumentIds: string[];
  figureIds: string[];
}

/** The nature of a syllabus point (drives what a complete answer must contain). */
export type ExamTopicKind =
  | 'disease'
  | 'physiology'
  | 'concept'
  | 'procedure'
  | 'classification'
  | 'pharmacology'
  | 'resuscitation';

/** How a point's content is sourced today. */
export type ExamCoverage = 'condition' | 'authored';

export type RequirementKey =
  | 'definition'
  | 'etiology'
  | 'pathogenesis'
  | 'clinic'
  | 'diagnosis'
  | 'ddx'
  | 'treatment'
  | 'complications'
  | 'classification'
  | 'epidemiology'
  | 'prevention'
  | 'outcomes'
  | 'indications'
  | 'risks'
  | 'hemodynamics'
  | 'forms'
  | 'principles'
  | 'pharmacology'
  | 'technique'
  | 'scope';

export interface ExamRequirement {
  key: RequirementKey;
  /** Bulgarian exam heading for the requirement. */
  labelBg: string;
  /** Keywords used to look inside guideline text. */
  keywords: string[];
  satisfiedBy: 'condition-field' | 'guideline-rec' | 'drug' | 'instrument' | 'figure' | 'authored';
}

export interface ExamTopic {
  id: string;
  /** Syllabus number, e.g. "27". */
  code: string;
  /** Bulgarian heading (English clinical term in parentheses). */
  title: string;
  /** Short exam framing (Bulgarian). */
  orientation: string;
  /** Classic must-know point, highlighted in the list and note. */
  highYield?: boolean;
  /**
   * Keywords selecting this point's key recommendations from its linked
   * guidelines (matched case-insensitively against the recommendation text).
   * The full guideline list is always available, collapsed.
   */
  focus?: string[];
  /** Nature of the point and how its content is sourced. */
  kind?: ExamTopicKind;
  coverage?: ExamCoverage;
  /** Requirements derived from the title (what a complete answer must cover). */
  requirements?: ExamRequirement[];
  /** Title-oriented authored blocks (used when `coverage` is "authored"). */
  authoredSections?: { key: RequirementKey; body: string }[];
  links: ExamTopicLinks;
}

export interface ExamSection {
  id: string;
  title: string;
  topics: ExamTopic[];
}

const topic = (
  id: string,
  code: string,
  title: string,
  orientation: string,
  links: Partial<ExamTopicLinks> = {},
): ExamTopic => ({
  id,
  code,
  title,
  orientation,
  links: {
    conditionIds: links.conditionIds ?? [],
    guidelineIds: links.guidelineIds ?? [],
    medicationIds: links.medicationIds ?? [],
    instrumentIds: links.instrumentIds ?? [],
    figureIds: links.figureIds ?? [],
  },
});

export const examSections: ExamSection[] = [
  {
    id: 's1',
    title: 'I. Функция на сърцето и сърдечна недостатъчност',
    topics: [
      topic(
        'bg-1',
        '1',
        'Функция на сърцето: систолна и диастолна (Systolic & diastolic function)',
        'Дефиниция на систолна и диастолна функция, показатели (EF, E/A, E/e′, TAPSE), роля в класификацията на СН и при оценка на застой. Разграничаване HFrEF / HFmrEF / HFpEF.',
        {
          conditionIds: ['hfpef'],
          guidelineIds: ['esc-2026-hf', 'acc-2022-hf'],
          instrumentIds: ['nyha', 'hf-stage', 'h2fpef', 'hfa-peff'],
          medicationIds: ['sacubitril-valsartan', 'dapagliflozin'],
        },
      ),
      topic(
        'bg-2',
        '2',
        'Остра сърдечна недостатъчност — кардиогенен шок (Cardiogenic shock)',
        'Дефиниция, хемодинамични критерии, SCAI стадии, причини (ОКС, миокардит, клапна катастрофа), инотропна/вазопресорна подкрепа и механична циркулаторна подкрепа.',
        {
          conditionIds: ['cardiogenic-shock', 'scai-shock'],
          guidelineIds: ['esc-2026-hf', 'acc-2022-hf'],
          medicationIds: ['furosemide', 'milrinone-iv', 'vasopressin-iv', 'nitroglycerin-sl-iv', 'norepinephrine'],
          instrumentIds: ['scai-shock', 'killip', 'nyha'],
        },
      ),
      topic(
        'bg-3',
        '3',
        'Остра сърдечна недостатъчност: кардиална астма, кардиогенен белодробен оток (Acute pulmonary oedema)',
        'Патогенеза на застоя, клинична картина, неинвазивна вентилация, диуретици и вазодилататори, тактика при хипертоничния оток.',
        {
          conditionIds: ['acute-decompensated-hf', 'hfpef'],
          guidelineIds: ['esc-2026-hf', 'acc-2022-hf'],
          medicationIds: ['furosemide', 'nitroglycerin-sl-iv'],
          instrumentIds: ['nyha', 'hf-stage'],
        },
      ),
    ],
  },
  {
    id: 's2',
    title: 'II. Надкамерни (суправентрикуларни) тахиаритмии',
    topics: [
      topic(
        'bg-4',
        '4',
        'Предсърдна тахикардия (Focal atrial tachycardia)',
        'Фокална предсърдна тахикардия: огнищен механизъм, P-вълнова морфология, диференциална диагноза и лечение (бета-блокер, AAD, аблация).',
        {
          conditionIds: ['svt-psvt'],
          guidelineIds: ['esc-2019-svt', 'acc-2015-svt'],
          medicationIds: ['metoprolol-tartrate', 'esmolol-iv', 'flecainide'],
          instrumentIds: ['ehra'],
        },
      ),
      topic(
        'bg-5',
        '5',
        'Предсърдно трептене (Atrial flutter)',
        'Типичен/атипичен флътър, „onion-sawtooth" Ф-вълни, 2:1 блокада, anticoagulation по CHA₂DS₂-VA, rate/rhythm control и катетърна аблация на cavotricuspid isthmus.',
        {
          conditionIds: ['atrial-flutter'],
          guidelineIds: ['esc-2024-af', 'acc-2023-af'],
          medicationIds: ['apixaban', 'metoprolol-succinate', 'amiodarone'],
          instrumentIds: ['cha2ds2-va', 'cha2ds2-vasc', 'has-bled', 'ehra'],
          figureIds: ['ecg-flutter'],
        },
      ),
      topic(
        'bg-6',
        '6',
        'Предсърдно мъждене (Atrial fibrillation)',
        'AF: механизъм, класификация (paroxysmal/persistent/permanent), thrombo-embolic risk и anticoagulation, rate vs rhythm control, кардиоверзия и аблация.',
        {
          conditionIds: ['atrial-fibrillation'],
          guidelineIds: ['esc-2024-af', 'acc-2023-af'],
          medicationIds: ['apixaban', 'rivaroxaban', 'dabigatran', 'edoxaban', 'warfarin', 'metoprolol-succinate', 'bisoprolol', 'digoxin', 'amiodarone'],
          instrumentIds: ['cha2ds2-va', 'cha2ds2-vasc', 'has-bled', 'ehra'],
          figureIds: ['ecg-af'],
        },
      ),
      topic(
        'bg-7',
        '7',
        'AV нодални тахикардии (AVNRT)',
        'AVNRT: двойна AV-нодална проводна система, типична/атипична форма, P-вълна в QRS, Vagal маневри и adenosine.',
        {
          conditionIds: ['svt-psvt'],
          guidelineIds: ['esc-2019-svt', 'acc-2015-svt'],
          medicationIds: ['verapamil', 'diltiazem-iv-po', 'metoprolol-tartrate', 'adenosine'],
        },
      ),
      topic(
        'bg-8',
        '8',
        'AV тахикардии при скрита връзка/и (Concealed accessory pathway AVRT)',
        'Скрита (retrograde-only) допълнителна връзка, ортодромна AVRT, диференциална диагноза с AVNRT и лечение/аблация.',
        {
          conditionIds: ['svt-psvt'],
          guidelineIds: ['esc-2019-svt'],
          medicationIds: ['flecainide', 'propafenone', 'adenosine'],
        },
      ),
      topic(
        'bg-9',
        '9',
        'AV тахикардии при WPW-синдром (WPW syndrome)',
        'Предвъзбуден синдром: delta-вълна, антидромна/орподромна тахикардия, риск от бърза провеждане при AF, стратификация и аблация. Избягване на AV-нодални блокери при антидромна AF.',
        {
          conditionIds: ['wpw-syndrome'],
          guidelineIds: ['esc-2019-svt', 'esc-2022-va-scd'],
          medicationIds: ['procainamide-iv', 'flecainide', 'amiodarone'],
        },
      ),
    ],
  },
  {
    id: 's3',
    title: 'III. Камерни тахикардии',
    topics: [
      topic(
        'bg-10',
        '10',
        'Камерни тахикардии — класификация, електрогенеза, етиология и диагностика',
        'Класификация (monomorphic/polymorphic, nonsustained/sustained), механизми (reentry, automaticity, triggered), етиология (ischemic, ARVC, HCM, channelopathy) и EKG-критерии.',
        {
          conditionIds: ['ventricular-tachycardia'],
          guidelineIds: ['esc-2022-va-scd'],
          medicationIds: ['amiodarone', 'lidocaine-iv'],
          figureIds: ['ecg-brugada'],
        },
      ),
      topic(
        'bg-11',
        '11',
        'Камерни тахикардии — принципи на лечение, медикаментозна терапия',
        'Оценка на haemodynamic stability, acutely (cardioversion, amiodarone, lidocaine), chronicantiarrhythmics и роля на beta-blockers при structural disease.',
        {
          conditionIds: ['ventricular-tachycardia'],
          guidelineIds: ['esc-2022-va-scd'],
          medicationIds: ['amiodarone', 'lidocaine-iv', 'mexiletine', 'procainamide-iv', 'metoprolol-succinate'],
        },
      ),
      topic(
        'bg-12',
        '12',
        'Камерни тахикардии — немедикаментозна терапия',
        'ICD при вторична/първична профилактика, катетърна аблация на VT, sympathetic modulation и преоценка на възникналите рецидиви.',
        {
          conditionIds: ['ventricular-tachycardia', 'implanted-devices'],
          guidelineIds: ['esc-2022-va-scd'],
          instrumentIds: ['nyha'],
        },
      ),
    ],
  },
  {
    id: 's4',
    title: 'IV. Диагностика и лечение на тахиаритмии',
    topics: [
      topic(
        'bg-13',
        '13',
        'Диференциална диагноза на надкамерни и камерни тахикардии (Narrow vs wide QRS tachycardia)',
        'Алгоритъм при wide-QRS тахикардия и haemodynamic stability, AV-dissociation, fusion/capture beats, morphology criteria и значение на предишен ИМ.',
        {
          conditionIds: ['ventricular-tachycardia', 'svt-psvt'],
          guidelineIds: ['esc-2022-va-scd', 'esc-2019-svt'],
        },
      ),
      topic(
        'bg-14',
        '14',
        'Противоаритмични медикаментозни средства (Antiarrhythmic drugs)',
        'Класификация на Vaughan-Williams, основни представители, показания, proarrhythmic risk и drug interaction profile.',
        {
          conditionIds: ['atrial-fibrillation', 'ventricular-tachycardia'],
          guidelineIds: ['esc-2024-af', 'esc-2022-va-scd'],
          medicationIds: ['amiodarone', 'dronedarone', 'flecainide', 'propafenone', 'mexiletine', 'lidocaine-iv', 'procainamide-iv', 'digoxin', 'metoprolol-tartrate', 'esmolol-iv', 'diltiazem-iv-po', 'verapamil'],
          instrumentIds: ['schwartz-lqts'],
        },
      ),
      topic(
        'bg-15',
        '15',
        'Проаритмии (Proarrhythmia)',
        'Механизми на проаритмия, drug-induced QT prolongation и torsades de pointes, рискове при структурна болест и тактика.',
        {
          conditionIds: ['ventricular-tachycardia', 'long-qt-syndrome'],
          guidelineIds: ['esc-2022-va-scd'],
          medicationIds: ['dronedarone', 'amiodarone'],
          instrumentIds: ['schwartz-lqts'],
          figureIds: ['ecg-long-qt'],
        },
      ),
      topic(
        'bg-16',
        '16',
        'Немедикаментозни методи за лечение на проаритмии',
        'Роля на устройства и аблация при рецидивираща проаритмия, ICD при високорискови пациенти и проследяване.',
        {
          conditionIds: ['ventricular-tachycardia', 'implanted-devices'],
          guidelineIds: ['esc-2022-va-scd'],
        },
      ),
      topic(
        'bg-17',
        '17',
        'Кардиоелектрошокова терапия (Cardioversion / defibrillation)',
        'Синхронизирана кардиоверзия при организирана тахикардия, дефибрилация при VF/pVT, енергии и техника, anticoagulation преди електрическа кардиоверзия при AF.',
        {
          conditionIds: ['atrial-fibrillation', 'ventricular-tachycardia'],
          guidelineIds: ['esc-2024-af', 'esc-2022-va-scd'],
          medicationIds: ['amiodarone'],
        },
      ),
    ],
  },
  {
    id: 's5',
    title: 'V. Брадиаритмии и антибрадикардна стимулация',
    topics: [
      topic(
        'bg-18',
        '18',
        'Брадиаритмии (Bradyarrhythmias)',
        'Дефиниция, симптоматика, синусова брадикардия, sinus node dysfunction и AV блокове; неотложно лечение и индикации за pacing.',
        {
          conditionIds: ['third-degree-av-block', 'sick-sinus-syndrome'],
          guidelineIds: ['esc-2021-pacing', 'acc-2018-bradycardia'],
          medicationIds: ['atropine'],
          instrumentIds: ['nyha'],
        },
      ),
      topic(
        'bg-19',
        '19',
        'Проводни нарушения — SA, AV-нодални, интракамерни (Conduction disorders)',
        'SA блок, AV блок I–III степен, intraventricular/bifascicular block, EKG-признаци и прогностично значение.',
        {
          conditionIds: ['third-degree-av-block', 'sick-sinus-syndrome'],
          guidelineIds: ['esc-2021-pacing', 'acc-2018-bradycardia'],
          medicationIds: ['atropine'],
        },
      ),
      topic(
        'bg-20',
        '20',
        'Антибрадикардна кардиостимулация (Cardiac pacing)',
        'Индикации за pacemaker, режими (AAI/VVI/DDD), leadless pacing, усложнения и проследяване; CRT при диссинхрония.',
        {
          conditionIds: ['implanted-devices', 'third-degree-av-block', 'sick-sinus-syndrome'],
          guidelineIds: ['esc-2021-pacing', 'acc-2018-bradycardia'],
          instrumentIds: ['nyha'],
        },
      ),
    ],
  },
  {
    id: 's6',
    title: 'VI. Внезапна сърдечна смърт',
    topics: [
      topic(
        'bg-21',
        '21',
        'Внезапна сърдечна смърт — кардио-респираторна ресусцитация (CPR)',
        'Верига на оцеляване, базисна и advanced life support, дефибрилация, post-resuscitation care и терапевтична хипотермия.',
        {
          conditionIds: ['ventricular-tachycardia'],
          guidelineIds: ['esc-2022-va-scd'],
          medicationIds: ['amiodarone', 'lidocaine-iv', 'epinephrine'],
        },
      ),
      topic(
        'bg-22',
        '22',
        'Внезапна сърдечна смърт — етиология, патогенеза, профилактика, медикаментозна терапия (алгоритъм)',
        'Причини (ischemic, cardiomyopathy, channelopathy), рискови маркери, първична/вторична профилактика с ICD и медикаментозен алгоритъм.',
        {
          conditionIds: ['ventricular-tachycardia', 'hcm', 'arvc', 'long-qt-syndrome', 'brugada-syndrome'],
          guidelineIds: ['esc-2022-va-scd'],
          medicationIds: ['amiodarone', 'bisoprolol', 'metoprolol-succinate'],
          instrumentIds: ['schwartz-lqts', 'shanghai-brugada'],
        },
      ),
    ],
  },
  {
    id: 's7',
    title: 'VII. Артериална хипертония и атеросклероза',
    topics: [
      topic(
        'bg-23',
        '23',
        'Артериална хипертония — есенциална (Essential hypertension)',
        'Дефиниция и степени, оценка на total CV risk, target organ damage, избор и комбинации на антихипертензивни средства, цели на лечение.',
        {
          conditionIds: ['hypertension'],
          guidelineIds: ['esc-2024-hypertension'],
          medicationIds: ['amlodipine', 'lisinopril', 'ramipril', 'losartan', 'valsartan', 'chlorthalidone', 'metoprolol-succinate'],
          instrumentIds: ['bp-category'],
        },
      ),
      topic(
        'bg-24',
        '24',
        'Артериална хипертония — вторична (Secondary hypertension)',
        'Причини (renal, endocrine, reno-vascular, sleep apnoea, drugs), скрининг и кога да търсим вторична АХ, хипертонична криза.',
        {
          conditionIds: ['hypertension', 'hypertensive-emergency', 'obstructive-sleep-apnoea'],
          guidelineIds: ['esc-2024-hypertension'],
          medicationIds: ['hydralazine', 'esmolol-iv', 'amlodipine'],
          instrumentIds: ['bp-category', 'osa-severity'],
        },
      ),
      topic(
        'bg-25',
        '25',
        'Атеросклероза — патогенеза, клинични форми, рискови фактори (Atherosclerosis)',
        'Ендотелна дисфункция, липидна инфилтрация и плака, стабилна vs нестабилна плака, клинични форми и рискови фактори.',
        {
          conditionIds: ['atherosclerosis', 'peripheral-artery-disease'],
          guidelineIds: ['esc-2024-ccs', 'esc-2025-lipids', 'acc-2026-dyslipidemia'],
          medicationIds: ['atorvastatin', 'rosuvastatin', 'ezetimibe'],
        },
      ),
    ],
  },
  {
    id: 's8',
    title: 'VIII. Исхемична (коронарна) болест на сърцето',
    topics: [
      topic(
        'bg-26',
        '26',
        'ИБС: класификация, епидемиология, рискови фактори (Ischemic heart disease)',
        'Класификация (CCS stable, ACS), епидемиология и рискови фактори, преценка на pretest probability и диагностична стратегия.',
        {
          conditionIds: ['stable-ischemic-heart-disease', 'coronary-revascularization'],
          guidelineIds: ['esc-2024-ccs', 'acc-2023-ccd', 'acc-2021-chest-pain'],
          instrumentIds: ['ccs-angina', 'heart'],
        },
      ),
      topic(
        'bg-27',
        '27',
        'Стабилна стенокардия (хронична ангина пекторис — Stable angina)',
        'Клинична картина, неинвазивна диагностика (CCTA, стрес-тест), антиангинозно и антитромботично лечение, реваскуларизация при показания.',
        {
          conditionIds: ['stable-ischemic-heart-disease'],
          guidelineIds: ['esc-2024-ccs', 'acc-2023-ccd'],
          medicationIds: ['metoprolol-succinate', 'bisoprolol', 'amlodipine', 'nitroglycerin-sl-iv', 'ismn', 'ivabradine', 'atorvastatin', 'aspirin'],
          instrumentIds: ['ccs-angina', 'heart'],
        },
      ),
      topic(
        'bg-28',
        '28',
        'Вазоспастична ангина пекторис (Vasospastic / Prinzmetal angina)',
        'Коронарен спазъм, нощна/покойна стенокардия, преходна ST-елевация, провокативен тест и лечение с вазодилататори и калциеви антагонисти.',
        {
          conditionIds: ['prinzmetal-angina'],
          guidelineIds: ['esc-2024-ccs', 'acc-2023-ccd'],
          medicationIds: ['nitroglycerin-sl-iv', 'ismn', 'amlodipine', 'diltiazem-iv-po', 'verapamil'],
        },
      ),
      topic(
        'bg-29',
        '29',
        'Перкутанна транслуминална коронарна ангиопластика и коронарен стентинг (PCI)',
        'Показания за PCI, BMS vs DES, техника, перипроцедурна терапия, рискове (restenosis, thrombosis) и резултати.',
        {
          conditionIds: ['coronary-revascularization'],
          guidelineIds: ['acc-2021-revascularization', 'esc-2023-acs'],
          medicationIds: ['aspirin', 'clopidogrel', 'ticagrelor', 'prasugrel', 'cangrelor', 'heparin'],
        },
      ),
      topic(
        'bg-30',
        '30',
        'Оперативно лечение на коронарната болест на сърцето — показания и резултати (CABG)',
        'Показания за CABG (left main, multivessel, diabetics), conduits, близки и далечни резултати, сравнение с PCI.',
        {
          conditionIds: ['coronary-revascularization'],
          guidelineIds: ['acc-2021-revascularization', 'esc-2024-ccs'],
          medicationIds: ['aspirin', 'atorvastatin'],
        },
      ),
      topic(
        'bg-31',
        '31',
        'Остри коронарни синдроми — нестабилна стенокардия (НС / Unstable angina)',
        'Дефиниция и рискова стратификация, антиисхемично лечение, антитромбоцитна и антикоагулантна терапия, invasive strategy timing.',
        {
          conditionIds: ['unstable-angina'],
          guidelineIds: ['esc-2023-acs', 'acc-2025-acs'],
          medicationIds: ['aspirin', 'ticagrelor', 'clopidogrel', 'enoxaparin', 'metoprolol-succinate', 'atorvastatin'],
          instrumentIds: ['timi-nstemi', 'grace', 'heart'],
        },
      ),
      topic(
        'bg-32',
        '32',
        'Остър коронарен синдром. Остър миокарден инфаркт без ST-елевация (NSTEMI)',
        'Патогенеза (субтотална окузия), диагноза с hs-troponin, EKG, рискови скоринг, timing на коронарография и лечение.',
        {
          conditionIds: ['nstemi'],
          guidelineIds: ['esc-2023-acs', 'acc-2025-acs'],
          medicationIds: ['aspirin', 'ticagrelor', 'enoxaparin', 'atorvastatin', 'metoprolol-succinate'],
          instrumentIds: ['timi-nstemi', 'grace', 'killip'],
        },
      ),
      topic(
        'bg-33',
        '33',
        'ОКС. Остър миокарден инфаркт със ST-елевация — етиология, патогенеза, диагноза, диференциална диагноза (STEMI)',
        'Тотална коронарна окузия, EKG-критерии за ST-елевация, тропонин, диференциална диагноза на ST-елевацията и initial risk assessment.',
        {
          conditionIds: ['stemi'],
          guidelineIds: ['esc-2023-acs', 'acc-2025-acs'],
          medicationIds: ['aspirin', 'ticagrelor', 'heparin'],
          instrumentIds: ['grace', 'killip'],
          figureIds: ['ecg-stemi'],
        },
      ),
      topic(
        'bg-34',
        '34',
        'ОКС. STEMI — лечение (Reperfusion & medical therapy)',
        'Реперфузионна стратегия (първична PCI, фибринолиза, спасителна PCI), DAPT, антикоагулация, антиисхемична и адювантна терапия.',
        {
          conditionIds: ['stemi'],
          guidelineIds: ['esc-2023-acs', 'acc-2025-acs'],
          medicationIds: ['aspirin', 'ticagrelor', 'prasugrel', 'heparin', 'enoxaparin', 'metoprolol-tartrate', 'atorvastatin', 'nitroglycerin-sl-iv', 'amiodarone'],
          instrumentIds: ['grace'],
        },
      ),
      topic(
        'bg-35',
        '35',
        'ОКС. STEMI — усложнения и тяхното лечение (Complications)',
        'Ранни и късни усложнения: arrhythmias, HF/кардиогенен шок, механични (VSD, papillary muscle rupture), перикардит, mural thrombus и лечение.',
        {
          conditionIds: ['stemi', 'cardiogenic-shock'],
          guidelineIds: ['esc-2023-acs'],
          medicationIds: ['amiodarone', 'furosemide', 'milrinone-iv'],
          instrumentIds: ['killip', 'scai-shock', 'grace'],
        },
      ),
      topic(
        'bg-36',
        '36',
        'Тромболитична терапия на STEMI (Fibrinolysis)',
        'Показания и противопоказания, fibrinolytics (tenecteplase/alteplase), съпътстваща антикоагулация/антиагрегация и rescue PCI.',
        {
          conditionIds: ['stemi'],
          guidelineIds: ['esc-2023-acs'],
          medicationIds: ['aspirin', 'clopidogrel', 'enoxaparin', 'heparin', 'alteplase', 'tenecteplase'],
        },
      ),
      topic(
        'bg-37',
        '37',
        'Рехабилитация след остър миокарден инфаркт — съвременен комплексен подход (Cardiac rehabilitation)',
        'Фази на рехабилитацията, физическа активност и тренировка, контрол на рисковите фактори, психо-социална подкрепа и вторична профилактика.',
        {
          conditionIds: ['stable-ischemic-heart-disease'],
          guidelineIds: ['esc-2026-cardiac-rehab', 'acc-2025-acs'],
          medicationIds: ['atorvastatin', 'metoprolol-succinate'],
        },
      ),
      topic(
        'bg-38',
        '38',
        'Профилактика на атеросклерозата — първична и вторична (Primary & secondary prevention)',
        'Оценка на CV риск, LDL-C цели, lifestyle, statin/ezetimibe/ PCSK9, контрол на АХ и диабет.',
        {
          conditionIds: ['stable-ischemic-heart-disease', 'peripheral-artery-disease'],
          guidelineIds: ['esc-2025-lipids', 'acc-2026-dyslipidemia'],
          medicationIds: ['atorvastatin', 'rosuvastatin', 'ezetimibe', 'aspirin'],
          instrumentIds: ['bp-category'],
        },
      ),
    ],
  },
  {
    id: 's9',
    title: 'IX. Придобити клапни болести',
    topics: [
      topic(
        'bg-39',
        '39',
        'Придобити клапни болести: митрална инсуфициенция (Mitral regurgitation)',
        'Първична (дегенеративна) vs вторична (функционална) MR, хемодинамика, ехокардиографска оценка и индикации за операция.',
        {
          conditionIds: ['mitral-regurgitation', 'mitral-valve-prolapse'],
          guidelineIds: ['esc-2025-vhd', 'acc-2020-vhd'],
          medicationIds: ['furosemide', 'metoprolol-succinate'],
          instrumentIds: ['nyha'],
          figureIds: ['valve-lesions'],
        },
      ),
      topic(
        'bg-40',
        '40',
        'Придобити клапни болести: митрална стеноза и съчетание с митрална инсуфициенция (Mitral stenosis)',
        'Ревматична етиология, диастолно обструкция, ехокардиография (planimetry, gradient), белодробна хипертония, PMBC и MVR.',
        {
          conditionIds: ['mitral-stenosis'],
          guidelineIds: ['esc-2025-vhd', 'acc-2020-vhd'],
          medicationIds: ['furosemide', 'metoprolol-succinate'],
          instrumentIds: ['nyha'],
          figureIds: ['valve-lesions'],
        },
      ),
      topic(
        'bg-41',
        '41',
        'Придобити клапни болести: аортна клапна стеноза — етиология, клиника, диагноза, усложнения, лечение (Aortic stenosis)',
        'Етиология (degenerative vs bicuspid vs rheumatic), симптомен триада, эхокард оценка, AVR/TAVI индикации и усложнения.',
        {
          conditionIds: ['aortic-stenosis', 'bicuspid-aortic-valve'],
          guidelineIds: ['esc-2025-vhd', 'acc-2020-vhd'],
          medicationIds: ['furosemide'],
          instrumentIds: ['nyha'],
          figureIds: ['valve-lesions'],
        },
      ),
      topic(
        'bg-42',
        '42',
        'Придобити клапни болести: аортна клапна инсуфициенция и комбиниран аортен порок (Aortic regurgitation)',
        'Хемодинамика (volume overload), клиника, ехокард оценка (vena contracta, RF), индикации за операция и възстановима функция на ЛК.',
        {
          conditionIds: ['aortic-regurgitation'],
          guidelineIds: ['esc-2025-vhd', 'acc-2020-vhd'],
          medicationIds: ['metoprolol-succinate', 'lisinopril'],
          figureIds: ['valve-lesions'],
        },
      ),
      topic(
        'bg-43',
        '43',
        'Клапни балонни дилатации при клапни стенози: индикации, очаквани резултати, усложнения (Balloon valvuloplasty)',
        'PMBC при митрална стеноза (Wilkins score) и balloon valvotomy при аортна стеноза, индикации, резултати и рискове.',
        {
          conditionIds: ['mitral-stenosis', 'aortic-stenosis'],
          guidelineIds: ['esc-2025-vhd'],
        },
      ),
      topic(
        'bg-44',
        '44',
        'Ревматизъм и ревмокардит — етиология, клиника, диагноза, диференциална диагноза и лечение (Acute rheumatic fever)',
        'Стрептококова етиология, Jones критерии, ревмокардит, диференциална диагноза и антибактериална/противовъзпалителна терапия; профилактика.',
        {
          conditionIds: ['acute-rheumatic-fever', 'mitral-stenosis'],
          guidelineIds: ['esc-2025-vhd'],
        },
      ),
    ],
  },
  {
    id: 's10',
    title: 'X. Инфекциозен ендокардит и кардиомиопатии',
    topics: [
      topic(
        'bg-45',
        '45',
        'Инфекциозен ендокардит — етиология, патогенеза, клиника, диагноза, диф. диагноза и лечение (Infective endocarditis)',
        'Duke criteria, ехокардиография (TEE), хемокултури, консервативно и оперативно лечение, профилактика при рискови процедури.',
        {
          conditionIds: ['infective-endocarditis', 'prosthetic-valve-management'],
          guidelineIds: ['esc-2023-endocarditis'],
        },
      ),
      topic(
        'bg-46',
        '46',
        'Хипертрофични кардиомиопатии (Hypertrophic cardiomyopathy)',
        'Саркомерни мутации, асиметрична хипертрофия, outflow obstruction, screening на роднини, риск от SCD и лечение (beta-blockers, миэктомия, ICD).',
        {
          conditionIds: ['hcm'],
          guidelineIds: ['esc-2023-cardiomyopathies', 'acc-2024-hcm'],
          medicationIds: ['bisoprolol', 'verapamil'],
          instrumentIds: ['nyha'],
        },
      ),
      topic(
        'bg-47',
        '47',
        'Дилатативни кардиомиопатии (Dilated cardiomyopathy)',
        'Етиология (idiopathic, genetic, post-myocarditis, toxic), ремоделиране, guideline-directed medical therapy и устройства (CRT/ICD).',
        {
          conditionIds: ['dilated-cardiomyopathy'],
          guidelineIds: ['esc-2023-cardiomyopathies', 'esc-2026-hf', 'acc-2022-hf'],
          medicationIds: ['sacubitril-valsartan', 'carvedilol', 'bisoprolol', 'spironolactone', 'eplerenone', 'empagliflozin', 'dapagliflozin', 'furosemide'],
          instrumentIds: ['nyha', 'hf-stage'],
        },
      ),
      topic(
        'bg-48',
        '48',
        'Рестриктивни кардиомиопатии (Restrictive cardiomyopathy)',
        'Restrictive physiology, амилоидоза и др., диференциална диагноза с constrictive pericarditis, диагностика и лечение.',
        {
          conditionIds: ['restrictive-cardiomyopathy', 'amyloidosis'],
          guidelineIds: ['esc-2023-cardiomyopathies'],
          medicationIds: ['furosemide'],
          instrumentIds: ['nyha'],
        },
      ),
      topic(
        'bg-49',
        '49',
        'Миокардити — етиология, клинични форми, диагноза, лечение, профилактика, късни резултати (Myocarditis)',
        'Вирусна/автоимунна етиология, CMR (Lake Louise criteria), клинични форми, лечение и риск от DCM/arrhythmia.',
        {
          conditionIds: ['myocarditis'],
          guidelineIds: ['esc-2025-myopericarditis'],
          medicationIds: ['bisoprolol', 'furosemide'],
          instrumentIds: ['nyha'],
        },
      ),
    ],
  },
  {
    id: 's11',
    title: 'XI. Болести на перикарда',
    topics: [
      topic(
        'bg-50',
        '50',
        'Ексудативен перикардит — етиология, диагноза и лечение (Pericardial effusion)',
        'Етиология, ехокардиографска оценка на effusion, тампонада, перикардиоцентеза и лечение.',
        {
          conditionIds: ['acute-pericarditis', 'cardiac-tamponade'],
          guidelineIds: ['esc-2025-myopericarditis'],
          medicationIds: ['aspirin', 'colchicine'],
        },
      ),
      topic(
        'bg-51',
        '51',
        'Констриктивен перикардит — етиология, хемодинамика, диагноза, диф. диагноза и лечение (Constrictive pericarditis)',
        'Хемодинамика (ventricular interdependence, Kussmaul), диагностика (echo, CT/MRI), диференциална диагноза с RCM и перикардиектомия.',
        {
          conditionIds: ['constrictive-pericarditis'],
          guidelineIds: ['esc-2025-myopericarditis'],
          medicationIds: ['furosemide'],
          instrumentIds: ['nyha'],
        },
      ),
    ],
  },
  {
    id: 's12',
    title: 'XII. Белодробна хипертония и белодробен тромбоемболизъм',
    topics: [
      topic(
        'bg-52',
        '52',
        'Пулмонална артериална хипертония — първична и вторична, патогенеза и лечение (Pulmonary arterial hypertension)',
        'Класификация (групи 1–5), патогенеза, диагностичен алгоритъм, хемодинамика и целево лечение (ERA, PDE5i, prostacyclin).',
        {
          conditionIds: ['pulmonary-arterial-hypertension'],
          guidelineIds: ['esc-2022-ph'],
          medicationIds: ['sildenafil-pah', 'bosentan', 'furosemide'],
          instrumentIds: ['nyha'],
        },
      ),
      topic(
        'bg-53',
        '53',
        'Хронично белодробно сърце — патогенеза, клиника, диагноза и лечение (Cor pulmonale)',
        'Хронична хипоксемия и пулмонална вазоконстрикция, remodeling на дясното сърце, клиника, диагноза и лечение.',
        {
          conditionIds: ['cor-pulmonale', 'obstructive-sleep-apnoea'],
          guidelineIds: ['esc-2022-ph'],
          medicationIds: ['furosemide', 'sildenafil-pah'],
          instrumentIds: ['nyha', 'osa-severity'],
        },
      ),
      topic(
        'bg-54',
        '54',
        'Белодробен тромбоемболизъм, остро белодробно сърце — етиология, патогенеза, клиника, диагноза, лечение и профилактика (Pulmonary embolism)',
        'Вирхов триада, диагностичен алгоритъм (Wells, D-dimer, CTPA), рискова стратификация, антикоагулация и тромболиза при высокорискови.',
        {
          conditionIds: ['pulmonary-embolism'],
          guidelineIds: ['esc-2019-pe'],
          medicationIds: ['apixaban', 'rivaroxaban', 'edoxaban', 'dabigatran', 'warfarin', 'enoxaparin', 'heparin'],
          instrumentIds: ['wells-pe', 'geneva-pe', 'spesi', 'years-pe', 'hestia-pe'],
        },
      ),
    ],
  },
  {
    id: 's13',
    title: 'XIII. Болести на аортата и вродени сърдечни малформации',
    topics: [
      topic(
        'bg-55',
        '55',
        'Болести на аортата — аортна аневризма и аортна дисекация (Aortic aneurysm & dissection)',
        'Етиология (degenerative, bicuspid, Marfan, connective tissue), тип A/B Stanford, клиника, диагностика и лечение (антихипертензивно, TEVAR, операция).',
        {
          conditionIds: ['aortic-dissection', 'aaa', 'bicuspid-aortic-valve'],
          guidelineIds: ['esc-2024-pad-aorta', 'acc-2022-aortic'],
          medicationIds: ['esmolol-iv', 'metoprolol-succinate', 'losartan'],
        },
      ),
      topic(
        'bg-56',
        '56',
        'Вродени сърдечни малформации — дефекти на междупредсърдната преграда (ASD)',
        'Типове (ostium secundum/primum, sinus venosus), хемодинамика (L→R shunt), клиника, диагноза, индикации и timing за closure.',
        {
          conditionIds: ['asd'],
          guidelineIds: ['esc-2020-achd'],
          instrumentIds: ['nyha'],
          figureIds: ['shunt-physiology'],
        },
      ),
      topic(
        'bg-57',
        '57',
        'Вродени сърдечни малформации — дефекти на междукамерната преграда (VSD)',
        'Типове (perimembranous, muscular), хемодинамика и Eisenmenger physiology, клиника, диагноза и лечение.',
        {
          conditionIds: ['ventricular-septal-defect'],
          guidelineIds: ['esc-2020-achd'],
          figureIds: ['shunt-physiology'],
        },
      ),
      topic(
        'bg-58',
        '58',
        'Вродени сърдечни малформации — пулмонална стеноза: форми, клиника, диагноза, еволюция, лечение, резултати (Pulmonary stenosis)',
        'Форми (valvular/subvalvular), хемодинамика, клиника, диагноза и balloon valvuloplasty; резултати.',
        {
          conditionIds: ['pulmonary-stenosis'],
          guidelineIds: ['esc-2020-achd'],
        },
      ),
      topic(
        'bg-59',
        '59',
        'Вродени сърдечни малформации — дуктус Ботали апертус: форма, клиника, диагноза, еволюция, лечение и резултати (PDA)',
        'Отворен ductus arteriosus, хемодинамика, клиника, диагноза и затваряне (перкутанен/оперативен).',
        {
          conditionIds: ['patent-ductus-arteriosus'],
          guidelineIds: ['esc-2020-achd'],
          figureIds: ['shunt-physiology'],
        },
      ),
      topic(
        'bg-60',
        '60',
        'Вродени сърдечни малформации — трикуспидална аномалия на Ебщайн: хемодинамика, клиника, диагноза, лечение (Ebstein anomaly)',
        'Апикална дисплазия на трикуспидалната клапа, атриализация на дясна камера, ARVD/accessory pathways, клиника и оперативна корекция.',
        {
          conditionIds: ['ebstein-anomaly'],
          guidelineIds: ['esc-2020-achd'],
        },
      ),
      topic(
        'bg-61',
        '61',
        'Вродени сърдечни малформации — Тетралогия на Фало: хемодинамика, клиника, диагноза, лечение (Tetralogy of Fallot)',
        'Четирите компонента, хемодинамика (right-to-left shunt), hypercyanotic spells, палиативна и total correction, късни усложнения.',
        {
          conditionIds: ['tetralogy-of-fallot'],
          guidelineIds: ['esc-2020-achd'],
          figureIds: ['tof-anatomy'],
        },
      ),
      topic(
        'bg-62',
        '62',
        'Вродени сърдечни малформации — коарктация на аортата: форми, хемодинамика, клиника, диагноза, лечение (Coarctation of the aorta)',
        'Класификация, хемодинамика (pressure overload, collaterals), клиника (upper/lower gradient), диагноза и лечение (stent/surgery).',
        {
          conditionIds: ['coarctation-aorta'],
          guidelineIds: ['esc-2020-achd'],
        },
      ),
    ],
  },
  {
    id: 's14',
    title: 'XIV. Тумори на сърцето и бременност',
    topics: [
      topic(
        'bg-63',
        '63',
        'Тумори на сърцето — диагноза и лечение (Cardiac tumours)',
        'Първични (myxoma, sarcoma) и метастатични тумори, клиника (емболии, обструкция), диагностика (echo, CT/MRI) и лечение.',
        {
          conditionIds: ['cardiac-tumours'],
          guidelineIds: ['esc-2022-cardioonc'],
          instrumentIds: ['nyha'],
        },
      ),
      topic(
        'bg-64',
        '64',
        'Бременност и сърце — диагноза и лечение на артериалната хипертония (Pregnancy & hypertension)',
        'Класификация на хипертензивните нарушения в бременността, preeclampsia, безопасни антихипертензивни средства и перипартална кардиомиопатия.',
        {
          conditionIds: ['hypertension', 'peripartum-cardiomyopathy', 'mitral-stenosis'],
          guidelineIds: ['esc-2025-pregnancy', 'esc-2024-hypertension'],
          medicationIds: ['amlodipine', 'metoprolol-succinate', 'hydralazine', 'furosemide', 'labetalol'],
          instrumentIds: ['bp-category', 'nyha'],
        },
      ),
    ],
  },
];

// ---------------------------------------------------------------------------
// Derived metadata: high-yield flags and per-point recommendation focus.
// ---------------------------------------------------------------------------

/** Classic must-know points, highlighted in the list and note header. */
const HIGH_YIELD_IDS = new Set([
  'bg-2', 'bg-6', 'bg-21', 'bg-22', 'bg-27', 'bg-32', 'bg-33', 'bg-34', 'bg-41', 'bg-45', 'bg-54',
]);

/** Keywords selecting a point's key recommendations from its linked guidelines. */
const TOPIC_FOCUS: Record<string, string[]> = {
  'bg-5': ['anticoagul', 'ablation', 'rate control', 'cardioversion'],
  'bg-6': ['anticoagul', 'ablation', 'rate control', 'rhythm'],
  'bg-27': ['beta-blocker', 'statin', 'LDL', 'revasculari', 'CCTA', 'antiplatelet'],
  'bg-31': ['antiplatelet', 'P2Y12', 'ticagrelor', 'anticoagul', 'invasive', 'risk'],
  'bg-32': ['antiplatelet', 'P2Y12', 'invasive', 'anticoagul', 'revasculari'],
  'bg-33': ['reperfusion', 'primary PCI', 'aspirin', 'ticagrelor', 'radial'],
  'bg-34': ['primary PCI', 'reperfusion', 'P2Y12', 'radial', 'aspirin', 'prasugrel'],
  'bg-35': ['shock', 'heart failure', 'revasculari'],
  'bg-36': ['fibrinol', 'rescue', 'reperfusion'],
  'bg-39': ['mitral', 'TEER', 'repair', 'surgery'],
  'bg-40': ['mitral', 'valvotomy', 'commissurotomy', 'anticoagul'],
  'bg-41': ['aortic stenosis', 'TAVI', 'AVR', 'intervention'],
  'bg-42': ['aortic regurgitation', 'surgery', 'TAVI'],
  'bg-45': ['endocarditis', 'antibiotic', 'surgery', 'blood culture'],
  'bg-46': ['myosin', 'septal', 'ICD', 'beta-blocker', 'obstruction'],
  'bg-52': ['pulmonary', 'ERA', 'prostacyclin', 'PDE5'],
  'bg-54': ['anticoagul', 'thromboly', 'DOAC', 'NOAC', 'risk'],
  'bg-64': ['pregnancy', 'contraindicat', 'ACE', 'statin'],
};

// ---------------------------------------------------------------------------
// Requirement model: what a complete answer to each title must contain.
// ---------------------------------------------------------------------------

const REQUIREMENT_LABELS: Record<RequirementKey, { labelBg: string; keywords: string[] }> = {
  definition: { labelBg: 'Дефиниция', keywords: ['definition', 'defined as'] },
  etiology: { labelBg: 'Етиология', keywords: ['etiology', 'aetiology'] },
  pathogenesis: { labelBg: 'Патогенеза', keywords: ['pathogenesis', 'pathophysiology', 'mechanism'] },
  clinic: { labelBg: 'Клинична картина', keywords: ['symptom', 'clinical', 'presentation'] },
  diagnosis: { labelBg: 'Диагноза', keywords: ['diagnos', 'criteria', 'imaging', 'ecg', 'echo'] },
  ddx: { labelBg: 'Диференциална диагноза', keywords: ['differential'] },
  treatment: { labelBg: 'Лечение', keywords: ['treat', 'therap', 'management'] },
  complications: { labelBg: 'Усложнения', keywords: ['complication'] },
  classification: { labelBg: 'Класификация', keywords: ['classif'] },
  epidemiology: { labelBg: 'Епидемиология', keywords: ['epidemiolog', 'prevalence', 'incidence'] },
  prevention: { labelBg: 'Профилактика', keywords: ['prevention', 'prophylax'] },
  outcomes: { labelBg: 'Резултати', keywords: ['mortality', 'survival', 'outcome'] },
  indications: { labelBg: 'Показания', keywords: ['indication'] },
  risks: { labelBg: 'Рискове', keywords: ['risk'] },
  hemodynamics: { labelBg: 'Хемодинамика', keywords: ['haemodynam', 'hemodynam'] },
  forms: { labelBg: 'Форми', keywords: ['form', 'variant'] },
  principles: { labelBg: 'Принципи', keywords: ['principle'] },
  pharmacology: { labelBg: 'Фармакология', keywords: ['class', 'agent', 'drug'] },
  technique: { labelBg: 'Техника', keywords: ['technique', 'procedure'] },
  scope: { labelBg: 'Обхват на темата', keywords: [] },
};

const CLAUSE_PATTERNS: { re: RegExp; key: RequirementKey }[] = [
  { re: /етиолог/i, key: 'etiology' },
  { re: /патогенез/i, key: 'pathogenesis' },
  { re: /хемодинамик/i, key: 'hemodynamics' },
  { re: /класификац/i, key: 'classification' },
  { re: /епидемиолог/i, key: 'epidemiology' },
  { re: /клини/i, key: 'clinic' },
  { re: /диагноз|диагностик/i, key: 'diagnosis' },
  { re: /диференциал/i, key: 'ddx' },
  { re: /лечение|терапия/i, key: 'treatment' },
  { re: /усложнени/i, key: 'complications' },
  { re: /профилактик/i, key: 'prevention' },
  { re: /резултат/i, key: 'outcomes' },
  { re: /показани/i, key: 'indications' },
  { re: /рискове|риск/i, key: 'risks' },
  // "форми" but not "малформации"
  { re: /(?<!мал)форми|(?<!мал)форма(?!ц)/i, key: 'forms' },
  { re: /принципи/i, key: 'principles' },
];

const SATISFIED_BY: Record<RequirementKey, ExamRequirement['satisfiedBy']> = {
  definition: 'condition-field',
  etiology: 'condition-field',
  pathogenesis: 'condition-field',
  clinic: 'condition-field',
  diagnosis: 'condition-field',
  ddx: 'condition-field',
  treatment: 'condition-field',
  classification: 'condition-field',
  complications: 'condition-field',
  hemodynamics: 'condition-field',
  prevention: 'guideline-rec',
  outcomes: 'guideline-rec',
  indications: 'guideline-rec',
  risks: 'guideline-rec',
  pharmacology: 'drug',
  technique: 'instrument',
  forms: 'condition-field',
  principles: 'authored',
  epidemiology: 'authored',
  scope: 'authored',
};

function deriveRequirementKeys(title: string): RequirementKey[] {
  const keys: RequirementKey[] = [];
  for (const { re, key } of CLAUSE_PATTERNS) if (re.test(title) && !keys.includes(key)) keys.push(key);
  // A plain disease title implies the standard exam backbone.
  if (keys.length === 0) return ['definition', 'etiology', 'clinic', 'diagnosis', 'treatment'];
  // A complete answer always opens with a definition and closes with treatment.
  if (!keys.includes('definition')) keys.unshift('definition');
  if (!keys.includes('treatment')) keys.push('treatment');
  return keys;
}

/** Bulgarian label for a requirement key. */
export const requirementLabelBg = (key: RequirementKey): string => REQUIREMENT_LABELS[key]?.labelBg ?? key;

function buildRequirements(title: string, coverage: ExamCoverage, override?: RequirementKey[]): ExamRequirement[] {
  const keys = override && override.length > 0 ? override : deriveRequirementKeys(title);
  return keys.map((key) => ({
    key,
    labelBg: REQUIREMENT_LABELS[key].labelBg,
    keywords: REQUIREMENT_LABELS[key].keywords,
    satisfiedBy: coverage === 'authored' ? 'authored' : SATISFIED_BY[key],
  }));
}

interface TopicMeta {
  kind: ExamTopicKind;
  coverage: ExamCoverage;
  /** Explicit requirement skeleton (used for concept/procedure points). */
  requirementKeys?: RequirementKey[];
}

/** Nature + current sourcing of the points that are not plain disease cards. */
const TOPIC_META: Record<string, TopicMeta> = {
  'bg-1': { kind: 'physiology', coverage: 'authored', requirementKeys: ['definition', 'classification', 'diagnosis', 'treatment'] },
  'bg-4': { kind: 'disease', coverage: 'authored', requirementKeys: ['definition', 'etiology', 'clinic', 'diagnosis', 'ddx', 'treatment'] },
  'bg-13': { kind: 'concept', coverage: 'authored', requirementKeys: ['definition', 'diagnosis', 'ddx', 'treatment'] },
  'bg-14': { kind: 'pharmacology', coverage: 'authored', requirementKeys: ['definition', 'classification', 'pharmacology', 'indications', 'treatment'] },
  'bg-15': { kind: 'concept', coverage: 'authored', requirementKeys: ['definition', 'etiology', 'pathogenesis', 'clinic', 'diagnosis', 'treatment'] },
  'bg-16': { kind: 'procedure', coverage: 'authored', requirementKeys: ['definition', 'indications', 'technique', 'complications', 'treatment'] },
  'bg-17': { kind: 'procedure', coverage: 'authored', requirementKeys: ['definition', 'indications', 'technique', 'complications', 'treatment'] },
  'bg-19': { kind: 'concept', coverage: 'authored', requirementKeys: ['definition', 'classification', 'etiology', 'diagnosis', 'treatment'] },
  'bg-21': { kind: 'resuscitation', coverage: 'authored', requirementKeys: ['definition', 'principles', 'technique', 'treatment', 'outcomes'] },
  'bg-25': { kind: 'disease', coverage: 'condition', requirementKeys: ['definition', 'pathogenesis', 'clinic', 'risks', 'forms', 'diagnosis', 'treatment'] },
  'bg-26': { kind: 'classification', coverage: 'authored', requirementKeys: ['definition', 'classification', 'epidemiology', 'risks', 'diagnosis', 'treatment'] },
  'bg-29': { kind: 'procedure', coverage: 'authored', requirementKeys: ['definition', 'indications', 'technique', 'complications', 'outcomes'] },
  'bg-30': { kind: 'procedure', coverage: 'authored', requirementKeys: ['definition', 'indications', 'technique', 'complications', 'outcomes'] },
  'bg-37': { kind: 'concept', coverage: 'authored', requirementKeys: ['definition', 'principles', 'treatment', 'outcomes'] },
  'bg-43': { kind: 'procedure', coverage: 'authored', requirementKeys: ['definition', 'indications', 'technique', 'complications', 'outcomes'] },
  'bg-53': { kind: 'disease', coverage: 'condition', requirementKeys: ['definition', 'pathogenesis', 'clinic', 'diagnosis', 'treatment'] },
};

/**
 * Title-oriented authored exam notes for the points that are not plain disease
 * cards (concepts, procedures, physiology, pharmacology). Content is grounded in
 * the named source guidelines; no grades or numbers are invented.
 */
const AUTHORED: Record<string, { key: RequirementKey; body: string }[]> = {
  'bg-1': [
    { key: 'definition', body: 'Систолната функция е способността на камерата да се съкращава и изтласква кръв (количествено — ejection fraction, EF). Диастолната функция е способността да се пълни при ниски налягания.' },
    { key: 'classification', body: 'По EF сърдечната недостатъчност се класифицира като HFrEF (EF ≤40%), HFmrEF (EF 41–49%) и HFpEF (EF ≥50%).' },
    { key: 'diagnosis', body: 'Ехокардиография: EF (Simpson biplane), митрален inflow E/A, tissue Doppler E/e′, TAPSE за дясна камера, LA volume index.\nДиастолна дисфункция се подозира при E/e′ >14 и увеличен LA volume index.' },
    { key: 'treatment', body: 'Функционалната оценка насочва терапията: при HFrEF има доказана GDMT (ARNi/ACEi, beta-blocker, MRA, SGLT2i); при HFpEF ползата е по-ограничена (SGLT2i, MRA). Диуретиците облекчават застоя независимо от EF.' },
  ],
  'bg-4': [
    { key: 'definition', body: 'Фокална предсърдна тахикардия — регулярна надкамерна тахикардия от огнище в предсърдието извън AV-възела (crista terminalis, устия на белодробни вени, коронарен синус); механизъм — abnormal automaticity или micro-reentry.' },
    { key: 'etiology', body: 'Идиопатична; свързана с предсърдно ремоделиране, COPD/хипоксемия, електролитни нарушения, алкохол, тиреотоксикоза, след предсърдна операция или аблация.' },
    { key: 'clinic', body: 'Палпитации, диспнея, замайване; при продължителна форма — tachycardia-induced cardiomyopathy.' },
    { key: 'diagnosis', body: 'EKG: тесни QRS с абнормна P-вълнова морфология/ос, различна от sinus; изолирани P-вълни след спонтанна пауза. P-вълновата морфология локализира огнището.' },
    { key: 'ddx', body: 'AVNRT (P в QRS), AVRT, предсърдно трептене с 2:1 блок, sinus tachycardia.' },
    { key: 'treatment', body: 'Beta-blocker или non-dihydropyridine CCB за rate control; adenosine може да прекъсне/разкрие; flecainide/propafenone или amiodarone; катетърна аблация при симптоматична/рецидивираща форма (ESC 2019 SVT).' },
  ],
  'bg-13': [
    { key: 'definition', body: 'Wide-QRS тахикардия (QRS ≥120 ms) може да бъде камерна (VT) или надкамерна с аберация/предвъзбуждане; VT представлява около 80% от случаите.' },
    { key: 'diagnosis', body: 'Признаци за VT: AV dissociation, capture/fusion beats, concordance, Brugada/Vereckei алгоритъм, морфология (LBBB-подобна → десен източник), предишна ИМ. Хемодинамичната стабилност не изключва VT.' },
    { key: 'ddx', body: 'SVT с аберация, pre-excited AF (WPW), VT, paced rhythm, артефакт.' },
    { key: 'treatment', body: 'Нестабилност → синхронизирана кардиоверзия/дефибрилация; при стабилност и съмнение за VT — treat as VT (amiodarone/lidocaine/procainamide). Избягвай verapamil при suspected VT.' },
  ],
  'bg-14': [
    { key: 'definition', body: 'Противоаритмичните средства потискат образуването/провеждането на абнормния импулс чрез действие върху Na+, K+, Ca2+ канали и автономни рецептори.' },
    { key: 'classification', body: 'Vaughan-Williams: I (Na-block) — Ia (procainamide), Ib (lidocaine, mexiletine), Ic (flecainide, propafenone); II — beta-blockers; III (K-block) — amiodarone, dronedarone, sotalol; IV — CCB (verapamil, diltiazem). Допълнително: digoxin, adenosine.' },
    { key: 'pharmacology', body: 'Amiodarone — мултиканален, дълъг half-life, тиреоидна/белодробна/чернодробна токсичност; flecainide/propafenone — забранени при структурна болест (CAST); lidocaine — само IV; dronedarone — противопоказан при HF.' },
    { key: 'indications', body: 'Ритъм-контрол при AF, прекъсване на SVT, VT/VF (amiodarone/lidocaine), rate control (beta-blocker/CCB/digoxin).' },
    { key: 'treatment', body: 'Избор според аритмията и субстрата; избягвай проаритмични комбинации, следи QT/QRS и електролити (ESC 2024 AF; ESC 2022 VA/SCD).' },
  ],
  'bg-15': [
    { key: 'definition', body: 'Проаритмия — ново или влошено нарушение на ритъма, предизвикано от антиаритмично средство.' },
    { key: 'etiology', body: 'Class I (особено Ic при структурна болест), class III (QT-удължаващи: dronedarone/sotalol), digoxin токсичност; хипокалиемия/хипомагнезиемия.' },
    { key: 'pathogenesis', body: 'Забавяне на проводимостта → re-entry (use-dependence); early/late afterdepolarizations → torsades de pointes; удължаване на реполаризацията (QT).' },
    { key: 'clinic', body: 'Палпитации, syncope, VF/SCD; torsades de pointes.' },
    { key: 'diagnosis', body: 'EKG мониторинг (QRS widening, QTc >500 ms), електролити, проследяване след започване/титрация.' },
    { key: 'treatment', body: 'Спиране на причинителя, корекция на K+/Mg2+, IV magnesium и overdrive pacing при torsades; избягване при структурна болест (ESC 2022 VA/SCD).' },
  ],
  'bg-16': [
    { key: 'definition', body: 'Немедикаментозни методи за лечение на аритмии: катетърна аблация, имплантируеми устройства (ICD/CRT), симпатикова модулация.' },
    { key: 'indications', body: 'Аблация при SVT/AF/flutter/VT; ICD за вторична и първична профилактика на SCD; CRT при диссинхрония.' },
    { key: 'technique', body: 'Radiofrequency/cryo аблация с electroanatomical mapping; transvenous или leadless pacing; subcutaneous ICD.' },
    { key: 'complications', body: 'Тампонада/перфорация, съдови усложнения, stroke/TIA, инфекция, lead failure.' },
    { key: 'treatment', body: 'Проследяване на устройства, перипроцедурна антикоагулация, повторна аблация при рецидив.' },
  ],
  'bg-17': [
    { key: 'definition', body: 'Електрическа кардиоверзия — синхронизиран разряд за прекъсване на организирана тахикардия; дефибрилация — несинхронизиран разряд при VF/pVT.' },
    { key: 'indications', body: 'Нестабилна тахикардия, VF/pVT; планова кардиоверзия при AF/flutter; AF с предсърден тромб изисква антикоагулация преди процедурата.' },
    { key: 'technique', body: 'R-синхронизация при организирани ритми; biphasic разряд; енергии (AF ~120–200 J, VT/VF escalating); anterolateral позиция на електродите.' },
    { key: 'complications', body: 'Тромбоемболия (нужна 3-седмична антикоагулация или TEE-guided), кожни изгаряния, post-shock аритмия, рискове от седация.' },
    { key: 'treatment', body: '3 седмици OAC или TEE-водачество преди електрическа кардиоверзия при AF ≥48 h; продължаване на OAC ≥4 седмици след (ESC 2024 AF).' },
  ],
  'bg-19': [
    { key: 'definition', body: 'Проводни нарушения — забавяне или блок на импулса в SA-възела, AV-възела или интравентрикуларната система.' },
    { key: 'classification', body: 'SA блок; AV блок I/II (Mobitz I/II)/III степен; интравентрикуларни — RBBB/LBBB, bifascicular/trifascicular block.' },
    { key: 'etiology', body: 'Идиопатична дегенерация (Lev/Lenègre), ИБС/ИМ, миокардит, амилоидоза, саркоидоза, лекарства (beta-blocker, CCB, digoxin), хиперкалиемия, след процедури.' },
    { key: 'diagnosis', body: '12-lead EKG и rhythm strip; оценка на симптомия (syncope) и обратими причини; His-bundle изследване при нужда.' },
    { key: 'treatment', body: 'Корекция на обратими причини; atropine при AV-nodal блок; pacemaker при симптоматичен high-degree/инфранодален блок (ESC 2021 pacing).' },
  ],
  'bg-21': [
    { key: 'definition', body: 'Кардио-респираторна ресусцитация — действия за възстановяване на спонтанна циркулация при сърдечен арест.' },
    { key: 'principles', body: 'Верига на оцеляване: ранно разпознаване и повикване → ранна CPR → ранна дефибрилация → advanced life support → post-resuscitation care.' },
    { key: 'technique', body: 'Висококачествени компресии (100–120/min, 5–6 cm), минимални прекъсвания, 30:2; AED възможно най-рано; advanced airway; adrenaline на всеки 3–5 min; amiodarone след 3-ти шок.' },
    { key: 'treatment', body: 'Post-resuscitation: контрол на температура (targeted temperature management), MAP/хемодинамика, оксигенация, глюкоза, контрол на гърчове.' },
    { key: 'outcomes', body: 'Прогнозата зависи от времето до дефибрилация и качеството на CPR; shockable ритми имат по-добра прогноза.' },
  ],
  'bg-25': [
    { key: 'definition', body: 'Атеросклероза — хронично възпалително заболяване на артериалната стена с липидна плака в интимата.' },
    { key: 'pathogenesis', body: 'Ендотелна дисфункция → LDL инфилтрация и оксидация → възпаление (макрофаги, foam cells) → фиброзна плака. Нестабилната (thin-cap) плака руптурира → тромбоза.' },
    { key: 'clinic', body: 'Дълго безсимптомна; прояви според басейна — angina, claudication, TIA/stroke.' },
    { key: 'risks', body: 'LDL-C, артериална хипертония, тютюнопушене, диабет, възраст, мъжки пол, наследственост, Lp(a), възпаление (hs-CRP).' },
    { key: 'forms', body: 'Коронарна (ИБС), цереброваскуларна, периферна (PAD), аортна; клинично стабилна vs остра (ACS).' },
    { key: 'diagnosis', body: 'Клинично + образна (CCTA, carotid/периферна Doppler, ABI), рискови скоринг (SCORE2), липиден профил.' },
    { key: 'treatment', body: 'Lifestyle + високоинтензивен statin с LDL-C цел <1.4 mmol/L (<55 mg/dL) при ASCVD, ezetimibe/PCSK9; контрол на АХ/диабет; антитромботична терапия при клинична проява (ESC 2025 lipids; ESC 2024 CCS).' },
  ],
  'bg-26': [
    { key: 'definition', body: 'Исхемична (коронарна) болест — миокардна исхемия вследствие на атеросклеротична обструкция (или вазоспазъм/микроваскуларна дисфункция) на коронарните артерии.' },
    { key: 'classification', body: 'Стабилна (CCS) vs остри коронарни синдроми (UA/NSTEMI/STEMI); ANOCA/INOCA при необструктивна ИБС.' },
    { key: 'epidemiology', body: 'Водеща причина за смърт в Европа; честота расте с възрастта и при мъже; значима заболеваемост при диабет.' },
    { key: 'risks', body: 'LDL-C, АХ, тютюнопушене, диабет, затлъстяване, заседнал начин на живот, наследственост.' },
    { key: 'diagnosis', body: 'Клинична оценка + pretest probability; неинвазивни тестове (CCTA, стрес-ехо/CMR, SPECT); инвазивна ангиография при висок риск.' },
    { key: 'treatment', body: 'Модификация на рисковите фактори, statin, антиангинозни средства, антитромбоцитна терапия; реваскуларизация при показания (ESC 2024 CCS).' },
  ],
  'bg-29': [
    { key: 'definition', body: 'PCI — транскатетърна реваскуларизация чрез балонна ангиопластика и коронарен стент.' },
    { key: 'indications', body: 'Стабилна ИБС с рефрактерна симптоматика/висок риск; ACS (първична PCI при STEMI, early invasive при NSTE-ACS).' },
    { key: 'technique', body: 'Радиален достъп (предпочитан), balloon dilatation, ново поколение drug-eluting stents; възможна е intravascular imaging.' },
    { key: 'complications', body: 'Перипроцедурен ИМ, дисекция/перфорация, no-reflow, restenosis, stent thrombosis, съдови/бъбречни усложнения.' },
    { key: 'outcomes', body: 'Подобрява симптомите, а при ACS — преживяемостта; DAPT е задължителна след стентиране (ACC/AHA 2021 revascularization; ESC 2023 ACS).' },
  ],
  'bg-30': [
    { key: 'definition', body: 'CABG — хирургична реваскуларизация чрез байпас на стенозираните коронарни артерии.' },
    { key: 'indications', body: 'Значимо left main, multivessel CAD (особено при диабет или намалена LVEF), когато CABG превъзхожда PCI.' },
    { key: 'technique', body: 'LIMA към LAD + grafts (saphenous vein/radial); on-pump или off-pump; решение от Heart Team.' },
    { key: 'complications', body: 'Периоперативен ИМ/инсулт, кървене, предсърдно мъждене, инфекция на раната, graft failure.' },
    { key: 'outcomes', body: 'По-добра преживяемост при left main/multivessel и при LVEF ≤35%; aspirin започва рано след операцията (ACC/AHA 2021 revascularization).' },
  ],
  'bg-37': [
    { key: 'definition', body: 'Сърдечна рехабилитация — комплексна програма (упражнения + контрол на рискови фактори + психо-социална подкрепа) след сърдечно събитие.' },
    { key: 'principles', body: 'Фази: стационарна → ранна амбулаторна → поддържаща; индивидуализирана физическа тренировка и обучение на пациента.' },
    { key: 'treatment', body: 'Контрол на рисковите фактори (липиди, АХ, диабет, тютюнопушене), вторична профилактика, рехабилитация при HF и след ИМ.' },
    { key: 'outcomes', body: 'Намалява CV смъртност и хоспитализации, подобрява функционалния капацитет и качеството на живот; реферал преди изписване (ESC cardiac rehab).' },
  ],
  'bg-43': [
    { key: 'definition', body: 'Балонна валвулопластика — транскатетърно разширяване на стенозирана клапа с балон.' },
    { key: 'indications', body: 'PMBC при ревматична митрална стеноза (подходящ Wilkins score); balloon valvotomy при вродена/аортна стеноза при селектирани пациенти.' },
    { key: 'technique', body: 'Балон, проведен през клапата (Inoue за митрална; antegrade/retrograde за аортна), с флуороскопски и ехокардиографски контрол.' },
    { key: 'complications', body: 'Значима регургитация, перфорация/тампонада, емболия, restenosis.' },
    { key: 'outcomes', body: 'Добри резултати при подходяща морфология; алтернатива на хирургия при млади/бременни (ESC/EACTS VHD 2025).' },
  ],
  'bg-53': [
    { key: 'definition', body: 'Хронично белодробно сърце (cor pulmonale) — дяснокамерна хипертрофия/дилатация вследствие на белодробна хипертония от заболяване на белите дробове или дихателната механика.' },
    { key: 'pathogenesis', body: 'Хронична хипоксемия и хиперкапния → пулмонална вазоконстрикция и ремоделиране → повишено дяснокамерно налягане → дяснокамерна дисфункция.' },
    { key: 'clinic', body: 'Диспнея, цианоза, подути вратни вени, хепатомегалия, периферни отоци; акцентиран/разцепен P2.' },
    { key: 'diagnosis', body: 'Ехокардиография (дяснокамерна хипертрофия/дилатация, оценка на PA налягане), EKG (RVH, RAE), CXR/CT, ABG, PFT; изключване на PAH група 1.' },
    { key: 'treatment', body: 'Лечение на основното белодробно заболяване, дългосрочна кислородотерапия при хипоксемия, диуретици при застой; внимателна употреба на вазодилататори (ESC 2022 PH).' },
  ],
};

/**
 * Differentiators for sub-topics that share one condition card, so the note is
 * unmistakably about the titled point rather than its sibling.
 */
const DIFFERENTIATORS: Record<string, { key: RequirementKey; body: string }[]> = {
  'bg-10': [{ key: 'scope', body: 'Фокус: класификация и електрогенеза на VT — monomorphic vs polymorphic, non-sustained vs sustained, reentry (scar) vs triggered/automatic; роля на предишен ИМ и генетични синдроми.' }],
  'bg-27': [{ key: 'scope', body: 'Фокус: стабилна стенокардия — клинична картина (на усилие, отзвучава при покой), неинвазивна диагностика (CCTA/стрес-тест), антиангинозно и антитромботично лечение, реваскуларизация при показания.' }],
  'bg-38': [{ key: 'scope', body: 'Фокус: профилактика на атеросклерозата — първична (SCORE2, lifestyle, statin според риск) и вторична (LDL-C цел <1.4 mmol/L, ezetimibe/PCSK9); контрол на АХ и диабет.' }],
  'bg-7': [{ key: 'scope', body: 'Фокус: AVNRT — двойна AV-нодална проводна система; типична (slow-fast) и атипична форма; P-вълна в/непосредствено след QRS (pseudo-r′ in V1); лечение с vagal маневри, adenosine, verapamil; аблация на slow pathway.' }],
  'bg-8': [{ key: 'scope', body: 'Фокус: скрита (retrograde-only) допълнителна връзка → orthodromic AVRT; P-вълна след QRS (RP interval), често дискордантна ос; лечение — adenosine, AV-nodal blockers, аблация на пътеката.' }],
  'bg-12': [{ key: 'scope', body: 'Фокус: немедикаментозна терапия на VT — ICD (вторична/първична профилактика), катетърна аблация, sympathetic modulation; оценка на LVEF и субстрата.' }],
  'bg-18': [{ key: 'scope', body: 'Фокус: брадиаритмии — sinus bradycardia, sinus node dysfunction (tachy-brady), AV блокове; симптоматика (syncope, замайване); неотложен atropine и индикации за pacing.' }],
  'bg-33': [{ key: 'scope', body: 'Фокус: разпознаване на STEMI — ST-елевация в континентни отвеждания, reciprocal depression, posterior/RV инфаркт, LBBB; диференциална диагноза на ST-елевацията (перикардит, early repolarization, аортна дисекация, PE).' }],
  'bg-34': [{ key: 'scope', body: 'Фокус: реперфузия — първична PCI като предпочитана стратегия, timing, DAPT + антикоагулация и адювантна терапия; фибринолиза при недостъпна PCI (виж тема 36).' }],
  'bg-36': [{ key: 'scope', body: 'Фокус: фибринолиза — показания и противопоказания, tenecteplase/alteplase, съпътстваща антикоагулация/антиагрегация и rescue PCI при неуспех.' }],
};

/**
 * Supplementary authored sections that fill a single missing requirement on an
 * otherwise condition-sourced point (prevention, forms, results, principles).
 */
const SUPPLEMENTS: Record<string, { key: RequirementKey; body: string }[]> = {
  'bg-11': [
    { key: 'principles', body: 'Принципи на лечение на VT: оценка на хемодинамичната стабилност → при нестабилност незабавна кардиоверзия/дефибрилация; при стабилност — медикаментозно според субстрата (beta-blocker при structural disease, amiodarone/lidocaine при acute), търсене и корекция на обратими причини (ischemia, електролити, drugs), последваща преоценка за ICD/аблация.' },
  ],
  'bg-22': [
    { key: 'prevention', body: 'Профилактика на SCD: първична — оптимизирана терапия на СН и ИБС (GDMT, реваскуларизация) и ICD при LVEF ≤35% (NYHA II–III) или при високорискови генетични синдроми; вторична — ICD след преживян VF/хемодинамично непоносима VT без обратима причина (ESC 2022 VA/SCD).' },
  ],
  'bg-49': [
    { key: 'prevention', body: 'Профилактика: избягване на физическо натоварване в острия период (риск от аритмия), лечение на причинителя, проследяване за DCM и аритмии.' },
    { key: 'forms', body: 'Клинични форми: остър миокардит (инфарктоподобна болка, fulminant HF), миокардит с аритмия; хроничен/пост-вирусен с развитие на DCM.' },
  ],
  'bg-54': [
    { key: 'prevention', body: 'Профилактика на ВТЕ: ранна мобилизация и фармакологична тромбопрофилактика при рискови хоспитализирани; удължена антикоагулация след ПЕ според риска от рецидив (ESC 2019 PE).' },
  ],
  'bg-58': [
    { key: 'forms', body: 'Форми: valvular (типична, dome-shaped), dysplastic (при Noonan), subvalvular/infundibular; тежест по peak Doppler velocity.' },
    { key: 'outcomes', body: 'Резултати: balloon valvuloplasty постига трайно намаляване на градиента при повечето пациенти; възможна е restenosis с нужда от повторна интервенция.' },
  ],
  'bg-59': [
    { key: 'forms', body: 'Форми: клинично (silent, small, moderate, large, Eisenmenger) и ангиографски (тип A/B/C).' },
    { key: 'outcomes', body: 'Резултати: транскатетърното затваряне/лигиране е ефективно с ниска честота на усложнения; без лечение значимият PDA води до белодробна хипертония.' },
  ],
  'bg-62': [
    { key: 'forms', body: 'Форми: предуктална (infantile/критична), juxtaductal (класическа), postductal; със или без хипоплазия на аортната дъга.' },
  ],
};

for (const section of examSections) {
  for (const t of section.topics) {
    if (HIGH_YIELD_IDS.has(t.id)) t.highYield = true;
    const focus = TOPIC_FOCUS[t.id];
    if (focus) t.focus = focus;
    const meta = TOPIC_META[t.id];
    t.kind = meta?.kind ?? 'disease';
    t.coverage = meta?.coverage ?? 'condition';
    t.requirements = buildRequirements(t.title, t.coverage, meta?.requirementKeys);
    const authored = AUTHORED[t.id] ?? DIFFERENTIATORS[t.id] ?? SUPPLEMENTS[t.id];
    if (authored) t.authoredSections = authored;
  }
}

export const examTopics: ExamTopic[] = examSections.flatMap((s) => s.topics);

export const getExamTopic = (id: string): ExamTopic | undefined =>
  examTopics.find((t) => t.id === id);
