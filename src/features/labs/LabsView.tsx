import { useMemo } from 'react';
import { usePatient } from '../../context/usePatient';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { 
  Activity, 
  Zap, 
  Scale, 
  FlaskConical,
  Flame,
  Waves,
  ShieldCheck,
  Heart,
  Wind,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { PageHeader } from '../../components/layout/PageHeader';
import { ClinicalField } from '../../components/clinical/ClinicalUI';
import { calculateGfr, calculateAnionGap, interpretAbg, CLINICAL_NORMALS } from '../../lib/medical';
import { ntProBnpUpperLimit } from '../../lib/units';

export default function LabsView() {
  const { labs, setLabs, age, gender, weight } = usePatient();

  // 1. Renal Interlock (GFR)
  const gfr = useMemo(() => calculateGfr(age, weight, labs.creatinine, gender), [age, gender, weight, labs.creatinine]);
  const gfrColor = gfr ? (gfr < 30 ? 'text-rose-500' : gfr < 60 ? 'text-amber-500' : 'text-emerald-500') : 'text-slate-300';

  // 2. Anion Gap Calculation
  const anionGap = useMemo(() => calculateAnionGap(labs.na, labs.cl, labs.hco3), [labs.na, labs.cl, labs.hco3]);

  // 3. Age-stratified NT-proBNP upper limit of normal
  const bnpUpperLimit = useMemo(() => ntProBnpUpperLimit(parseInt(age)), [age]);

  // 3. VBG/ABG Interpreter Engine
  const abgAnalysis = useMemo(() => interpretAbg(labs.ph, labs.pco2, labs.hco3, labs.na, labs.cl), [labs.ph, labs.pco2, labs.hco3, labs.na, labs.cl]);

  return (
    <div className="space-y-8 pb-20">
      <PageHeader 
        title="Diagnostic Center" 
        subtitle="Precision biochemistry & acid-base analytics"
        badge="Biochemistry Command"
      >
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
           <div className="flex flex-col text-right">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">eGFR (C-G)</span>
              <div className={cn("text-2xl font-black italic tracking-tighter leading-none transition-colors", gfrColor)}>
                {gfr || '--'} <span className="text-[10px] uppercase font-bold text-slate-300">mL/min</span>
              </div>
           </div>
           <div className="w-[1px] h-10 bg-slate-100" />
           <ShieldCheck className="w-8 h-8 text-emerald-500" />
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Left Column: Traditional Labs */}
        <div className="lg:col-span-4 space-y-4 md:space-y-6">
          <Card className="p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
               <FlaskConical className="w-24 h-24 text-medical-accent" />
            </div>
            <div className="relative z-10 space-y-6 md:space-y-8">
              <div className="flex items-center gap-3">
                 <Heart className="w-5 h-5 text-medical-accent" />
                 <h3 className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wider italic">Cardiac Markers</h3>
              </div>
              
              <div className="space-y-4 md:space-y-6">
                <ClinicalField label="Troponin" value={labs.troponin} unit="ng/L" onChange={(v) => setLabs({ troponin: v })} icon={<Flame className="w-3 h-3 text-rose-500" />} elevated={parseFloat(labs.troponin) > CLINICAL_NORMALS.troponin} />
                <ClinicalField label="NT-proBNP" value={labs.bnp} unit="pg/mL" onChange={(v) => setLabs({ bnp: v })} icon={<Waves className="w-3 h-3 text-sky-500" />} elevated={parseFloat(labs.bnp) > bnpUpperLimit} />
              </div>
            </div>
          </Card>

          <Card className="p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border-slate-100 shadow-sm bg-white space-y-6 md:space-y-8">
              <div className="flex items-center gap-3">
                 <Activity className="w-5 h-5 text-medical-accent" />
                 <h3 className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wider italic">Renal & Lipids</h3>
              </div>
              <div className="space-y-4 md:space-y-6">
                   <ClinicalField label="Creatinine" value={labs.creatinine} unit="µmol/L" onChange={(v) => setLabs({ creatinine: v })} icon={<Scale className="w-3 h-3 text-amber-500" />} elevated={parseFloat(labs.creatinine) > CLINICAL_NORMALS.creatinine} />
                   <ClinicalField label="LDL Cholesterol" value={labs.ldl} unit="mmol/L" onChange={(v) => setLabs({ ldl: v })} icon={<Activity className="w-3 h-3 text-emerald-500" />} elevated={parseFloat(labs.ldl) > CLINICAL_NORMALS.ldl} />
              </div>
          </Card>
        </div>

        {/* Right Column: VBG/ABG Command Center */}
        <div className="lg:col-span-8 space-y-4 md:space-y-6">
           <Card className="rounded-2xl md:rounded-[3rem] bg-slate-900 border-slate-800 shadow-2xl overflow-hidden min-h-64">
              <div className="p-5 sm:p-6 md:p-10 flex flex-col h-full gap-6 md:gap-8">
                 <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 md:gap-4">
                       <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-2xl flex items-center justify-center text-medical-accent border border-white/10 shadow-inner shrink-0">
                          <Wind className="w-5 h-5 md:w-6 md:h-6" />
                       </div>
                       <div>
                          <h3 className="text-base md:text-lg font-black text-white italic uppercase tracking-tight leading-tight">Acid-Base Interpreter</h3>
                          <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-wider mt-0.5">High-Fidelity VBG/ABG Suite</p>
                       </div>
                    </div>
                    {abgAnalysis && (
                       <Badge className={cn(
                          "px-3 py-1.5 md:px-4 md:py-2 rounded-xl font-black uppercase tracking-wider italic text-[10px] md:text-[11px] shadow-lg shrink-0",
                          abgAnalysis.type === 'Acidemia' ? 'bg-rose-500 text-white' : 
                          abgAnalysis.type === 'Alkalemia' ? 'bg-sky-500 text-white' : 
                          'bg-emerald-500 text-white'
                       )}>
                          {abgAnalysis.type}
                       </Badge>
                    )}
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <ClinicalField variant="dark" label="pH" value={labs.ph} onChange={(v) => setLabs({ ph: v })} />
                    <ClinicalField variant="dark" label="pCO2" value={labs.pco2} unit="mmHg" onChange={(v) => setLabs({ pco2: v })} />
                    <ClinicalField variant="dark" label="HCO3" value={labs.hco3} unit="mEq/L" onChange={(v) => setLabs({ hco3: v })} />
                    <ClinicalField variant="dark" label="Lactate" value={labs.lactate} unit="mmol/L" onChange={(v) => setLabs({ lactate: v })} icon={parseFloat(labs.lactate) > 2 ? <Zap className="w-3 h-3 text-amber-500" /> : null} />
                 </div>

                 <AnimatePresence mode="wait">
                    {abgAnalysis && (
                       <motion.div 
                          key={`${labs.ph}-${labs.pco2}-${labs.hco3}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex-1 bg-white/5 border border-white/10 rounded-2xl md:rounded-[2.5rem] p-5 sm:p-6 md:p-8 flex flex-col justify-center gap-4 text-center md:text-left group/analysis hover:bg-white/[0.07] transition-all duration-500"
                       >
                          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                             <div className="shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full bg-medical-accent/20 flex items-center justify-center border border-medical-accent/30 shadow-xl shadow-medical-accent/20">
                                <Zap className="w-6 h-6 md:w-8 md:h-8 text-medical-accent" />
                             </div>
                             <div className="flex-1 space-y-1.5 md:space-y-2">
                                <h4 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter leading-tight">{abgAnalysis.primary}</h4>
                                <p className="text-[10px] md:text-[11px] font-black text-medical-accent uppercase tracking-wider">{abgAnalysis.compensation || 'Evaluating Secondary Response...'}</p>
                             </div>
                             {anionGap !== null && (abgAnalysis.primary.includes('Acidosis') || abgAnalysis.isGap) && (
                                <div className="shrink-0 px-5 py-3 md:px-6 md:py-4 bg-slate-800 rounded-2xl md:rounded-[1.8rem] border border-slate-700 text-center shadow-xl">
                                   <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Anion Gap Analytics</p>
                                   <div className={cn("text-xl md:text-2xl font-black italic", anionGap > CLINICAL_NORMALS.anionGap ? "text-rose-400" : "text-emerald-400")}>{anionGap}</div>
                                   <div className="flex flex-col mt-0.5">
                                      <p className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 leading-none">
                                         {anionGap > CLINICAL_NORMALS.anionGap ? 'HIGH GAP' : 'NORMAL GAP'}
                                      </p>
                                      {abgAnalysis.deltaGap && (
                                         <p className="text-[8px] font-bold text-medical-accent uppercase tracking-tight mt-1 opacity-80">
                                            Δ-Gap: +{abgAnalysis.deltaGap.toFixed(1)}
                                         </p>
                                      )}
                                   </div>
                                </div>
                             )}
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <ClinicalField variant="dark" label="Sodium (Na+)" value={labs.na} unit="mEq/L" onChange={(v) => setLabs({ na: v })} />
                    <ClinicalField variant="dark" label="Chloride (Cl-)" value={labs.cl} unit="mEq/L" onChange={(v) => setLabs({ cl: v })} />
                 </div>
              </div>
           </Card>

           {/* Clinical Interlock Widget */}
           <div className="bg-medical-secondary p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-[3rem] border border-slate-100 flex items-center justify-between group overflow-hidden relative shadow-sm">
              <div className="absolute top-0 left-0 w-2 h-full bg-medical-accent" />
              <div className="flex items-center gap-4 sm:gap-6 relative z-10">
                 <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg border border-slate-100 group-hover:rotate-6 transition-all duration-300 shrink-0">
                    <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-medical-accent" />
                 </div>
                 <div>
                    <h4 className="text-base md:text-lg font-black text-slate-900 italic uppercase tracking-tight">Clinical Safety Interlock</h4>
                    <p className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-tight italic opacity-80 leading-snug max-w-sm">
                       {gfr && gfr < 30 ? "Critical Renal Clearance detected. Cross-verify DOAC and Contrast dosages in Pharma Lab." : "Biochemistry parameters are reacting to current patient state. All interlocks active."}
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
