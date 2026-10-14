import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  PatientContext, 
  type PatientState, 
  type LabState, 
  type Gender 
} from './PatientContext';

const STORAGE_KEY = 'nelicardio_patient_state_v2';

const initialLabs: LabState = {
  troponin: '',
  bnp: '',
  k: '4.0',
  mg: '0.85',
  creatinine: '80',
  ldl: '3.0',
  ph: '7.40',
  pco2: '40',
  hco3: '24',
  po2: '90',
  lactate: '1.0',
  na: '140',
  cl: '101'
};

const initialState: PatientState = {
  age: '65',
  gender: 'Male',
  weight: '70',
  height: '175',
  bsa: 1.84,
  labs: initialLabs
};

const validatePatientState = (data: unknown): PatientState => {
  if (!data || typeof data !== 'object') return initialState;

  const typedData = data as Record<string, unknown>;
  const labs = { ...initialLabs };
  if (typedData.labs && typeof typedData.labs === 'object') {
    const typedLabs = typedData.labs as Record<string, unknown>;
    Object.keys(initialLabs).forEach((key) => {
      const k = key as keyof LabState;
      if (typeof typedLabs[k] === 'string') labs[k] = typedLabs[k] as string;
    });
  }

  return {
    age: typeof typedData.age === 'string' ? typedData.age : initialState.age,
    gender: (typedData.gender === 'Male' || typedData.gender === 'Female') ? typedData.gender : initialState.gender,
    weight: typeof typedData.weight === 'string' ? typedData.weight : initialState.weight,
    height: typeof typedData.height === 'string' ? typedData.height : initialState.height,
    bsa: (typeof typedData.bsa === 'number' || typedData.bsa === null) ? typedData.bsa : initialState.bsa,
    labs
  };
};

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PatientState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialState;
    try {
      return validatePatientState(JSON.parse(saved));
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setAge = useCallback((age: string) => setState(prev => ({ ...prev, age })), []);
  const setGender = useCallback((gender: Gender) => setState(prev => ({ ...prev, gender })), []);
  const setWeight = useCallback((weight: string) => setState(prev => ({ ...prev, weight })), []);
  const setHeight = useCallback((height: string) => setState(prev => ({ ...prev, height })), []);
  const setLabs = useCallback((newLabs: Partial<LabState>) => setState(prev => ({ 
    ...prev, 
    labs: { ...prev.labs, ...newLabs } 
  })), []);

  const resetCase = useCallback(() => {
     setState(prev => ({
       ...initialState,
       age: prev.age,
       gender: prev.gender,
       weight: '',
       height: '',
       labs: initialLabs
     }));
  }, []);

  const bsa = useMemo(() => {
    const w = parseFloat(state.weight);
    const h = parseFloat(state.height);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null;
    return Math.sqrt((h * w) / 3600);
  }, [state.weight, state.height]);

  const value = useMemo(() => ({
    ...state,
    bsa,
    setAge,
    setGender,
    setWeight,
    setHeight,
    setLabs,
    resetCase
  }), [state, bsa, setAge, setGender, setWeight, setHeight, setLabs, resetCase]);

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
};
