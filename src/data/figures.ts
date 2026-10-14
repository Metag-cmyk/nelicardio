import type { EcgPattern } from '../components/clinical/EcgStrip';
import type { SchematicId } from '../components/clinical/Schematic';

/**
 * Figure atlas.
 * `kind: 'ecg'` renders a built-in, license-clean SVG schematic.
 * `kind: 'schematic'` renders a hand-authored teaching diagram.
 * `kind: 'image'` renders a supplied (licensed) asset from `public/`.
 * All schematics are illustrative teaching diagrams, not real tracings.
 */
export type FigureKind = 'ecg' | 'image' | 'schematic';

export interface Figure {
  id: string;
  title: string;
  finding: string;
  description: string;
  kind: FigureKind;
  ecgPattern?: EcgPattern;
  schematicId?: SchematicId;
  /** Public path to a licensed asset, when available. */
  imagePath?: string;
  conditionIds: string[];
  source: string;
  illustrative: boolean;
}

export const figures: Figure[] = [
  {
    id: 'ecg-normal',
    title: 'Normal sinus rhythm',
    finding: 'Regular rate, upright P before every QRS',
    description: 'Regularly spaced narrow QRS complexes, each preceded by a P wave, with a normal PR and QT interval.',
    kind: 'ecg',
    ecgPattern: 'normal',
    conditionIds: ['stable-ischemic-heart-disease', 'hypertension', 'athlete-sports-cardiology'],
    source: 'Teaching schematic',
    illustrative: true,
  },
  {
    id: 'ecg-af',
    title: 'Atrial fibrillation',
    finding: 'Irregularly irregular RR, no P waves',
    description: 'Absent P waves with a fibrillatory baseline and an irregularly irregular ventricular response.',
    kind: 'ecg',
    ecgPattern: 'af',
    conditionIds: ['atrial-fibrillation'],
    source: 'Teaching schematic',
    illustrative: true,
  },
  {
    id: 'ecg-flutter',
    title: 'Atrial flutter (sawtooth)',
    finding: 'Sawtooth F-waves, often 2:1 conduction',
    description: 'Organised atrial activity at ~300/min produces a sawtooth (F-wave) baseline, commonly with 2:1 AV conduction (~150 bpm).',
    kind: 'ecg',
    ecgPattern: 'flutter',
    conditionIds: ['atrial-flutter'],
    source: 'Teaching schematic',
    illustrative: true,
  },
  {
    id: 'ecg-stemi',
    title: 'ST-elevation myocardial infarction',
    finding: 'ST elevation in contiguous leads',
    description: 'Coved ST-segment elevation with hyperacute T waves reflecting transmural ischaemia; reciprocal depression occurs in opposite leads.',
    kind: 'ecg',
    ecgPattern: 'stemi',
    conditionIds: ['stemi'],
    source: 'Teaching schematic',
    illustrative: true,
  },
  {
    id: 'ecg-brugada',
    title: 'Brugada type 1 pattern',
    finding: 'Coved ST elevation with negative T (V1–V2)',
    description: 'A coved (type 1) ST-segment elevation terminating in a negative T wave in the right precordial leads.',
    kind: 'ecg',
    ecgPattern: 'brugada',
    conditionIds: ['brugada-syndrome'],
    source: 'Teaching schematic',
    illustrative: true,
  },
  {
    id: 'ecg-long-qt',
    title: 'Long QT interval',
    finding: 'Prolonged QTc, risk of torsades',
    description: 'Delayed ventricular repolarisation with a prolonged QT interval, predisposing to torsades de pointes.',
    kind: 'ecg',
    ecgPattern: 'long-qt',
    conditionIds: ['long-qt-syndrome'],
    source: 'Teaching schematic',
    illustrative: true,
  },
  {
    id: 'shunt-physiology',
    title: 'Left-to-right shunt and its reversal',
    finding: 'Pulmonary overcirculation, then Eisenmenger physiology',
    description: 'A stepwise diagram of how an ASD, VSD or PDA shunts left-to-right, overloads the pulmonary circulation, and — once pulmonary vascular resistance rises — reverses to a right-to-left shunt with cyanosis.',
    kind: 'schematic',
    schematicId: 'shunt',
    conditionIds: ['asd', 'ventricular-septal-defect', 'patent-ductus-arteriosus'],
    source: 'Teaching schematic (ESC ACHD 2020 concept)',
    illustrative: true,
  },
  {
    id: 'tof-anatomy',
    title: 'Tetralogy of Fallot — four components',
    finding: 'RVOTO + VSD + overriding aorta + RV hypertrophy',
    description: 'The four defining features of tetralogy of Fallot and how right ventricular outflow tract obstruction drives the right-to-left shunt and cyanosis.',
    kind: 'schematic',
    schematicId: 'tof',
    conditionIds: ['tetralogy-of-fallot'],
    source: 'Teaching schematic (ESC ACHD 2020 concept)',
    illustrative: true,
  },
  {
    id: 'valve-lesions',
    title: 'Valve lesions at a glance',
    finding: 'Stenosis (pressure overload) vs regurgitation (volume overload)',
    description: 'A four-panel schematic contrasting aortic stenosis, aortic regurgitation, mitral stenosis and mitral regurgitation, with the resulting ventricular loading pattern.',
    kind: 'schematic',
    schematicId: 'valves',
    conditionIds: ['aortic-stenosis', 'aortic-regurgitation', 'mitral-stenosis', 'mitral-regurgitation'],
    source: 'Teaching schematic (ESC/EACTS VHD 2025 concept)',
    illustrative: true,
  },
];

export const figuresForCondition = (conditionId: string): Figure[] =>
  figures.filter((f) => f.conditionIds.includes(conditionId));

export const getFigure = (id: string): Figure | undefined => figures.find((f) => f.id === id);
