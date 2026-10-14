import React from 'react';
import { motion } from 'motion/react';
import { Calculator, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { apixabanReductionCriteria, calculateGfr } from '../../lib/medical';
import { rivaroxabanAf, dabigatranAf, edoxabanAf, enoxaparinDose, type EnoxaparinIndication, type DoseRecommendation } from '../../lib/dosing';
import type { DosingCalculatorType } from '../../data/medications';
import type { Gender } from '../../context/PatientContext';

interface DoseCalculatorProps {
  type: DosingCalculatorType;
  age: string;
  weight: string;
  creatinine: string;
  gender?: Gender;
  setAge: (v: string) => void;
  setWeight: (v: string) => void;
  setCr: (v: string) => void;
}

export default function DoseCalculator({
  type,
  age, weight, creatinine, gender = 'Male',
  setAge, setWeight, setCr,
}: DoseCalculatorProps) {

  const [protocol, setProtocol] = React.useState<'acs' | 'vte'>('acs');
  const [indication, setIndication] = React.useState<EnoxaparinIndication>('treatment');
  const [pgp, setPgp] = React.useState(false);

  const numAge = parseFloat(age);
  const numWeight = parseFloat(weight);
  const crCl = calculateGfr(age, weight, creatinine, gender) ?? Number.NaN;

  const calculateDose = (): DoseRecommendation | { dose: string; rationale: string } | null => {
    if (type === 'apixaban') {
      const result = apixabanReductionCriteria({ age, weightKg: weight, creatinineUmol: creatinine });
      return {
        dose: result.reduce ? '2.5 mg BID' : '5 mg BID',
        rationale: result.reduce
          ? `Dose reduced: ${result.met} of 3 criteria met (${result.reasons.join('; ')}).`
          : `Standard dose: only ${result.met} of 3 reduction criteria met (2 required).`,
      };
    }

    if (type === 'heparin') {
      if (!numWeight) return { dose: 'Entry Required', rationale: 'Enter weight to calculate protocols.' };
      const bolus = protocol === 'acs' ? 60 : 80;
      const infusion = protocol === 'acs' ? 12 : 18;
      const maxBolus = protocol === 'acs' ? 4000 : 5000;
      const maxInfusion = 1000;
      const calcBolus = Math.min(numWeight * bolus, maxBolus);
      const calcInfusion = Math.min(numWeight * infusion, maxInfusion);
      return {
        dose: `Bolus: ${Math.round(calcBolus)} units | Drip: ${Math.round(calcInfusion)} units/hr`,
        rationale: `${protocol.toUpperCase()} Protocol: bolus ${bolus}u/kg (max ${maxBolus}), drip ${infusion}u/kg/hr (max ${maxInfusion}). CrCl ${Number.isFinite(crCl) ? `${crCl} mL/min` : '—'}.`,
      };
    }

    const doacInput = { age: numAge, weightKg: numWeight, crCl, pgpInhibitor: pgp };
    if (type === 'rivaroxaban') return rivaroxabanAf(doacInput);
    if (type === 'dabigatran') return dabigatranAf(doacInput);
    if (type === 'edoxaban') return edoxabanAf(doacInput);

    if (type === 'enoxaparin' || type === 'weight-based') return enoxaparinDose(numWeight, crCl, indication);

    if (type === 'warfarin') {
      return {
        dose: 'Titrate to INR',
        rationale: 'Target INR 2.0–3.0 for most indications (2.5–3.5 for mechanical mitral valves or older-generation designs). Avoid DOACs with mechanical valves.',
      };
    }

    return null;
  };

  const results = calculateDose();

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputGroup label="Patient Age" value={age} onChange={setAge} placeholder="Years" />
        <InputGroup label="Total Body Weight" value={weight} onChange={setWeight} placeholder="kg" />
        <InputGroup label="Serum Creatinine" value={creatinine} onChange={setCr} placeholder="µmol/L" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {type === 'heparin' && (
          <div className="flex p-1 bg-slate-800 rounded-2xl w-fit border border-white/5">
            <ProtocolBtn active={protocol === 'acs'} onClick={() => setProtocol('acs')} label="ACS Protocol" />
            <ProtocolBtn active={protocol === 'vte'} onClick={() => setProtocol('vte')} label="VTE Protocol" />
          </div>
        )}
        {(type === 'enoxaparin' || type === 'weight-based') && (
          <div className="flex p-1 bg-slate-800 rounded-2xl w-fit border border-white/5">
            <ProtocolBtn active={indication === 'treatment'} onClick={() => setIndication('treatment')} label="Treatment" />
            <ProtocolBtn active={indication === 'prophylaxis'} onClick={() => setIndication('prophylaxis')} label="Prophylaxis" />
          </div>
        )}
        {(type === 'dabigatran' || type === 'edoxaban') && (
          <button
            onClick={() => setPgp(!pgp)}
            className={cn('px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all', pgp ? 'bg-medical-accent text-white border-transparent' : 'bg-slate-800 text-slate-400 border-white/5')}
          >
            P-gp inhibitor
          </button>
        )}
        {Number.isFinite(crCl) && (type === 'rivaroxaban' || type === 'dabigatran' || type === 'edoxaban' || type === 'enoxaparin' || type === 'weight-based' || type === 'apixaban') && (
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">CrCl (C-G) {crCl} mL/min</span>
        )}
      </div>

      {(type === 'rivaroxaban' || type === 'dabigatran' || type === 'edoxaban' || type === 'enoxaparin' || type === 'weight-based') && (
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 -mt-4">
          AF dosing per ESC 2024; verify against the local SmPC.
        </p>
      )}

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'p-8 rounded-2xl shadow-sm relative overflow-hidden group',
            'contraindicated' in results && (results as DoseRecommendation).contraindicated ? 'bg-rose-600' : 'bg-medical-accent',
          )}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />

          <div className="relative z-10 space-y-6">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                      <Calculator className="w-5 h-5 text-white" />
                   </div>
                   <h5 className="text-xs font-black uppercase tracking-[0.3em] text-white/80">Calculated Bio-Regimen</h5>
                </div>
                <Badge className="bg-white/10 text-white border-white/20 text-[9px] uppercase font-black tracking-widest">Live Result</Badge>
             </div>

             <div>
                <p className="text-3xl font-black text-white italic tracking-tighter leading-none uppercase">
                   {results.dose}
                </p>
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mt-4 flex items-start gap-2 max-w-lg leading-relaxed italic">
                   <Info className="w-4 h-4 shrink-0 text-white/40" />
                   {results.rationale}
                </p>
             </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function InputGroup({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder: string }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-2">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-14 bg-slate-800 border border-white/5 rounded-2xl px-6 text-white font-black placeholder:text-slate-600 focus:outline-none focus:border-medical-accent/40 transition-all transition-colors"
      />
    </div>
  );
}

function ProtocolBtn({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all',
        active ? 'bg-medical-accent text-white shadow-sm' : 'text-slate-400 hover:text-white',
      )}
    >
      {label}
    </button>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn('px-3 py-1 rounded-full text-[9px] font-black', className)}>
      {children}
    </span>
  );
}
