import { createContext } from 'react';

export type Gender = 'Male' | 'Female';

export interface LabState {
  troponin: string;
  bnp: string;
  k: string;
  mg: string;
  creatinine: string;
  ldl: string;
  ph: string;
  pco2: string;
  hco3: string;
  po2: string;
  lactate: string;
  na: string;
  cl: string;
}

export interface PatientState {
  age: string;
  gender: Gender;
  weight: string;
  height: string;
  bsa: number | null;
  labs: LabState;
}

export interface PatientContextType extends PatientState {
  setAge: (age: string) => void;
  setGender: (gender: Gender) => void;
  setWeight: (weight: string) => void;
  setHeight: (height: string) => void;
  setLabs: (labs: Partial<LabState>) => void;
  resetCase: () => void;
}

export const PatientContext = createContext<PatientContextType | undefined>(undefined);
