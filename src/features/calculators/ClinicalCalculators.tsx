import { useState, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { PageHeader } from '../../components/layout/PageHeader';
import { motion, AnimatePresence } from 'motion/react';
import { Ruler, Activity, RotateCcw, Droplets } from 'lucide-react';
import { cn } from '../../lib/utils';
import { usePatient } from '../../context/usePatient';
import { RiskHeatmap } from '../../components/clinical/ClinicalUI';
import { InstrumentCard } from '../../components/clinical/InstrumentPanel';
import { calculateGfr, calculateBsa, calculateBmi } from '../../lib/medical';
import { instruments, instrumentCategories } from '../../lib/instruments';

/**
 * Illustrative CV risk estimator. The validated SCORE2/SCORE2-OP coefficient
 * tables are not bundled yet, so this is explicitly labelled as non-clinical.
 */
function SCORE2() {
  const { age, gender, labs } = usePatient();
  const [region, setRegion] = useState('High');
  const [sbp, setSbp] = useState('140');
  const nonHdl = labs.ldl ? (parseFloat(labs.ldl) + 0.8).toString() : '4.0';

  const riskValue = useMemo(() => {
    const ageVal = parseInt(age) || 50;
    const sbpVal = parseFloat(sbp) || 120;
    const cholVal = parseFloat(nonHdl) || 3.0;
    const regionMult = region === 'Low' ? 0.7 : region === 'Moderate' ? 0.9 : region === 'High' ? 1.2 : 1.5;
    const base = (ageVal - 20) * 0.15 + (sbpVal - 100) * 0.08 + cholVal * 0.5;
    const finalRatio = gender === 'Female' ? base * 0.85 : base;
    return finalRatio * regionMult;
  }, [age, gender, region, sbp, nonHdl]);

  const thresholds = useMemo(() => {
    const ageVal = parseInt(age) || 50;
    if (ageVal < 50) return { low: 2.5, high: 7.5 };
    if (ageVal < 70) return { low: 5.0, high: 10.0 };
    return { low: 7.5, high: 15.0 };
  }, [age]);

  return (
    <div className="space-y-6 md:space-y-8 text-left">
      <div className="p-4 md:p-5 rounded-2xl border border-amber-200 bg-amber-50 text-amber-800">
        <p className="text-[10px] md:text-[11px] font-black uppercase tracking-wider">Illustrative estimator — not the validated SCORE2 model</p>
        <p className="text-[10px] md:text-[11px] font-bold tracking-normal mt-1 opacity-80">
          Simplified risk model for orientation only; do not use for clinical decisions. Validated SCORE2 / SCORE2-OP coefficients ship separately.
        </p>
      </div>
      <RiskHeatmap value={riskValue} thresholds={thresholds} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-5 sm:p-6 md:p-8 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-2xl shadow-sm">
          <h4 className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-wider md:tracking-[0.3em] mb-4 md:mb-6">Risk Region</h4>
          <div className="grid grid-cols-2 gap-2">
            {['Low', 'Moderate', 'High', 'Very High'].map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={cn(
                  'px-3 py-2.5 md:px-4 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase transition-all border min-h-[44px] active:scale-95',
                  region === r ? 'bg-medical-accent border-transparent text-white shadow-sm shadow-medical-accent/25' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200',
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5 sm:p-6 md:p-8 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-2xl shadow-sm">
          <h4 className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-wider md:tracking-[0.3em] mb-4 md:mb-6">Systolic BP (mmHg)</h4>
          <Input type="number" value={sbp} onChange={(e) => setSbp(e.target.value)} className="h-12 md:h-14 text-xl md:text-2xl font-black bg-white rounded-2xl" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-3">Non-HDL (derived): {nonHdl} mmol/L</p>
        </Card>
      </div>
    </div>
  );
}

function Biochemistry() {
  const { weight, setWeight, height, setHeight, labs, setLabs, resetCase, age, gender } = usePatient();
  const bmi = useMemo(() => calculateBmi(weight, height), [weight, height]);
  const bsa = useMemo(() => calculateBsa(weight, height), [weight, height]);
  const gfr = useMemo(() => calculateGfr(age, weight, labs.creatinine, gender), [age, weight, labs.creatinine, gender]);

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center bg-slate-50 p-6 rounded-2xl border border-slate-200/50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-medical-accent/10 rounded-xl flex items-center justify-center"><Activity className="w-5 h-5 text-medical-accent" /></div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Patient Data Link</h4>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">GFR (C-G): {gfr || '--'} mL/min</p>
          </div>
        </div>
        <button onClick={resetCase} className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-medical-accent active:scale-95 transition-all">
          <RotateCcw className="w-4 h-4" /> Reset Case
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <Card className="p-5 sm:p-6 md:p-10 bg-white border border-slate-100 rounded-2xl md:rounded-2xl shadow-sm space-y-6 md:space-y-8">
          <div className="flex items-center gap-2.5"><Ruler className="w-5 h-5 text-medical-accent" /><h5 className="text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-400">Body Metrics</h5></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
            <Input label="Weight (kg)" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="h-12 md:h-14 text-xl md:text-2xl font-black bg-slate-50 rounded-2xl" />
            <Input label="Height (cm)" type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="h-12 md:h-14 text-xl md:text-2xl font-black bg-slate-50 rounded-2xl" />
          </div>
          <div className="flex justify-between pt-4 md:pt-6 border-t border-slate-50">
            <div className="text-center flex-1">
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase mb-1 md:mb-2">BMI</p>
              <p className="text-3xl md:text-4xl font-black italic tracking-tighter text-slate-900 tabular-num">{bmi ? bmi.toFixed(1) : '--.-'}</p>
            </div>
            <div className="w-px bg-slate-100 mx-4 md:mx-6" />
            <div className="text-center flex-1">
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase mb-1 md:mb-2">BSA m²</p>
              <p className="text-3xl md:text-4xl font-black italic tracking-tighter text-slate-900 tabular-num">{bsa ? bsa.toFixed(2) : '-.--'}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 md:p-10 bg-slate-900 text-white rounded-2xl md:rounded-2xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-medical-accent/10 rounded-full blur-[80px] -mr-32 -mt-32" />
          <div className="flex items-center gap-2.5 mb-6 md:mb-10"><Droplets className="w-5 h-5 text-medical-accent" /><h5 className="text-[10px] md:text-[11px] font-black uppercase tracking-wider text-white/50">Diagnostic Markers</h5></div>
          <div className="space-y-6 md:space-y-8 relative z-10">
            <div>
              <label className="text-[10px] md:text-xs font-black uppercase tracking-wider text-white/60">Troponin (ng/L)</label>
              <input type="number" value={labs.troponin} onChange={(e) => setLabs({ troponin: e.target.value })} className="w-full bg-transparent border-none text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tighter text-medical-accent focus:ring-0 p-0 tabular-num" placeholder="---" />
            </div>
            <div>
              <label className="text-[10px] md:text-xs font-black uppercase tracking-wider text-white/60">Creatinine (µmol/L)</label>
              <input type="number" value={labs.creatinine} onChange={(e) => setLabs({ creatinine: e.target.value })} className="w-full bg-transparent border-none text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tighter text-indigo-400 focus:ring-0 p-0 tabular-num" placeholder="---" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function ClinicalCalculators() {
  const categoryTabs = instrumentCategories();
  const tabs = ['Biochem', 'CV Risk', ...categoryTabs];
  const [activeTab, setActiveTab] = useState('Biochem');

  const visible = instruments.filter((i) => i.category === activeTab);

  return (
    <div className="pb-20 max-w-7xl mx-auto space-y-6 md:space-y-10">
      <PageHeader title="Risk Scores & Calculators" subtitle="Validated instruments with class & source" badge="Decision Support" />

      <div className="flex overflow-x-auto gap-2 md:gap-3 pb-2 md:pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={cn(
              'px-5 py-3 md:px-8 md:py-4 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-wider md:tracking-[0.2em] transition-all whitespace-nowrap border-2 shadow-sm shrink-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-accent/50',
              activeTab === t ? 'bg-medical-accent border-transparent text-white scale-[1.02] shadow-sm shadow-medical-accent/30' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: 'circOut' }}>
          {activeTab === 'Biochem' && <Biochemistry />}
          {activeTab === 'CV Risk' && <SCORE2 />}
          {categoryTabs.includes(activeTab) && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {visible.map((instrument) => (
                <InstrumentCard key={instrument.id} instrument={instrument} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
