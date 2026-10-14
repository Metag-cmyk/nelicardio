import { useState, useMemo, memo } from 'react';
import { 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle,
  Calculator,
  Activity,
  Zap,
  ShieldCheck,
  FlaskConical,
  AlertOctagon,
  Pill
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { medications, medicationsMap } from '../../data/medications';
import type { Medication } from '../../data/medications';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import DoseCalculator from './DoseCalculator';
import { usePatient } from '../../context/usePatient';
import { RENAL_IMPAIRMENT_UMOL } from '../../lib/units';

type MedCategory = Medication['category'];

const categories: (MedCategory | 'All')[] = [
  'All', 'Antiplatelet', 'Anticoagulant', 'Beta-Blocker', 'ACEi/ARB/ARNI', 'Lipid Management', 'Antiarrhythmic', 'Diuretic', 'Emergency', 'Vasodilator', 'SGLT2i', 'Inotrope/Vasopressor', 'Pulmonary HTN', 'Specialty HF', 'Chronic Angina', 'Thrombolytic', 'Anti-inflammatory'
];

// Pre-compute lowercase values for performance optimization
const processedMeds = medications.map(m => ({
  ...m,
  _lowerName: m.name.toLowerCase(),
  _lowerBrands: m.brandNames.map(b => b.toLowerCase())
}));

interface MedCalculatorProps {
  /** Drug id from the route (`#/pharma/:id`). */
  selectedId?: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function MedCalculator({ selectedId, onSelect, onClose }: MedCalculatorProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<MedCategory | 'All'>('All');

  const filteredMeds = useMemo(() => {
    if (!search && activeCategory === 'All') return processedMeds;

    const lowercasedSearch = search.toLowerCase();
    return processedMeds.filter(m => {
      const matchesSearch = !search || m._lowerName.includes(lowercasedSearch) ||
                           m._lowerBrands.some(b => b.includes(lowercasedSearch));
      const matchesCategory = activeCategory === 'All' || m.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const selected = selectedId ? medicationsMap.get(selectedId) : undefined;

  return (
    <div className="space-y-6 pb-20">
      {/* Search & Header */}
      <div className="space-y-4">
        <div className="relative group">
          <Input
            placeholder="Search Pharmacology Library..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-5 h-5 text-slate-400 group-hover:text-medical-accent transition-colors" />}
            className="h-12 md:h-14 text-base md:text-lg bg-white border-slate-200/60 focus:border-medical-accent/30 text-slate-900 rounded-2xl md:rounded-[1.5rem] transition-all duration-300 placeholder:text-slate-400 shadow-sm"
          />
          <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2">
            <Badge variant="ghost" size="xs" className="text-medical-accent font-black uppercase tracking-wider bg-medical-accent/5 border-medical-accent/10">{filteredMeds.length} Items</Badge>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 md:gap-2 p-1 bg-slate-100/60 rounded-2xl md:rounded-[1.8rem] w-full border border-slate-200/50 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3.5 py-2 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-wider transition-all shrink-0 min-h-[36px] active:scale-95",
                activeCategory === cat 
                  ? "bg-white text-medical-accent shadow-sm border border-slate-200/60" 
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(320px,420px)_minmax(0,1fr)] lg:gap-6 lg:items-start">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 md:gap-4">
          <AnimatePresence mode="popLayout">
            {filteredMeds.map((med) => (
              <MedCard 
                key={med.id} 
                med={med} 
                isSelected={selectedId === med.id} 
                onSelect={() => onSelect(med.id)} 
              />
            ))}
          </AnimatePresence>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-6">
            <Card className="flex flex-col h-[calc(100vh-9rem)] overflow-hidden border-2 border-slate-100 rounded-[2.5rem] bg-medical-surface shadow-xl">
              {selected ? (
                <MedicationDetailPanel key={selected.id} med={selected} onClose={onClose} inPane />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 gap-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                    <Pill className="w-8 h-8 text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900 uppercase tracking-tight italic">Select a medication</h3>
                    <p className="prose-clinical mx-auto text-center">Pick a drug to view dosing, mechanism, interactions and safety interlocks.</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <AnimatePresence mode="wait">
          {selected && (
            <MedicationDetail key={selected.id} med={selected} onClose={onClose} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const MedCard = memo(({ med, isSelected, onSelect }: {
  med: Medication;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  return (
    <div className="[content-visibility:auto] [contain-intrinsic-size:100px]">
      <button
        onClick={onSelect}
        className={cn(
          "bg-white border border-slate-200/60 p-4 flex flex-col justify-between group h-full relative overflow-hidden w-full transition-all duration-200 rounded-2xl md:rounded-[1.5rem] shadow-sm hover:shadow-md hover:border-slate-300 text-left active:scale-[0.98]",
          isSelected && "ring-1 ring-medical-accent border-transparent"
        )}
      >
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-1.5 transition-colors",
          med.category === 'Anticoagulant' ? 'bg-rose-500' :
          med.category === 'Antiplatelet' ? 'bg-amber-500' :
          med.category === 'Beta-Blocker' ? 'bg-medical-accent' :
          med.category === 'ACEi/ARB/ARNI' ? 'bg-emerald-500' :
          'bg-slate-300'
        )} />
        
        <div className="space-y-3 relative z-10 pl-2.5">
          <div className="flex justify-between items-start w-full">
            <div className="flex flex-col flex-1 truncate">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] md:text-[10px] font-black text-medical-accent uppercase tracking-wider">{med.category}</span>
                <p className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase tracking-tight opacity-75 italic truncate">REC: {med.classOfRec || 'ESC/AHA'}</p>
              </div>
              <h4 className="font-black text-base md:text-lg tracking-tight leading-none text-slate-900 group-hover:text-medical-accent transition-colors uppercase italic truncate">
                {med.name}
              </h4>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
});

function MedicationDetailPanel({ med, onClose, inPane = false }: { med: Medication; onClose: () => void; inPane?: boolean }) {
  const patient = usePatient();
  const [showCalculator, setShowCalculator] = useState(false);
  
  const potassium = parseFloat(patient.labs.k);
  const creatinine = parseFloat(patient.labs.creatinine);
  
  const hasHyperkalemiaRisk = potassium > 5.5 && (med.category === 'ACEi/ARB/ARNI' || med.category === 'Diuretic' || med.name.includes('Spironolactone') || med.name.includes('Eplerenone'));
  const hasRenalRisk = creatinine > RENAL_IMPAIRMENT_UMOL && (med.category === 'ACEi/ARB/ARNI' || med.name.includes('Metformin') || med.name.includes('SGLT2i'));

  return (
    <>
        <Card className="border-none shadow-none bg-transparent h-full flex flex-col overflow-hidden rounded-none">
          {!inPane && (
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 mb-1 shrink-0 md:hidden" />
          )}

          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 md:px-6 md:py-5 border-b border-slate-100 flex items-center justify-between">
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-medical-accent hover:border-medical-accent transition-all active:scale-95 group shrink-0"
              aria-label="Back"
            >
              <ChevronRight className="w-5 h-5 rotate-180 group-hover:-translate-x-0.5" />
            </button>
            <div className="flex flex-col items-center flex-1 px-2">
              <span className="text-[9px] md:text-[10px] font-black text-medical-accent uppercase tracking-wider mb-0.5">{med.category}</span>
              <h2 className="text-lg md:text-2xl font-black text-slate-900 italic uppercase tracking-tight text-center leading-tight truncate max-w-[240px] sm:max-w-md">{med.name}</h2>
            </div>
            <div className="w-10" /> 
          </div>

          <div className="flex-1 overflow-y-auto vertical-clinical-scroll px-4 py-5 md:px-10 md:py-8 no-scrollbar text-left">
            {/* ... content code ... */}
            <div className="max-w-6xl mx-auto space-y-10">
              
              {/* Biochemistry Safety Interlocks */}
              <AnimatePresence>
                 {(hasHyperkalemiaRisk || hasRenalRisk) && (
                   <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="bg-rose-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-rose-600/20 mb-10 overflow-hidden relative"
                   >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                      <div className="flex items-center gap-6 relative z-10">
                         <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 animate-pulse">
                            <AlertOctagon className="w-10 h-10 text-white" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 mb-1">Safety Interlock: Contraindicated</p>
                            <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
                               {hasHyperkalemiaRisk && `Severe Hyperkalemia (K+ ${potassium})`}
                               {hasHyperkalemiaRisk && hasRenalRisk && ' & '}
                               {hasRenalRisk && `Renal Impairment (Cr ${creatinine} µmol/L)`}
                            </h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-white/80">Hazard: High risk of life-threatening arrhythmia / AKI. Verified from real-time labs.</p>
                         </div>
                         <div className="ml-auto hidden md:block">
                            <FlaskConical className="w-16 h-16 text-white/10" />
                         </div>
                      </div>
                   </motion.div>
                 )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="md:col-span-12 lg:col-span-8 space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-white border border-slate-100 rounded-[3rem] shadow-sm">
                      <div className="space-y-4">
                         <div className="flex items-center gap-3 mb-6">
                            <Zap className="w-5 h-5 text-medical-accent" />
                            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Adult Dosing</h5>
                         </div>
                         <p className="text-lg font-black text-slate-900 leading-tight italic uppercase tracking-tight">{med.adultDose}</p>
                      </div>
                      
                      <div className="space-y-4">
                         <div className="flex items-center gap-3 mb-6">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Indications</h5>
                         </div>
                         <div className="flex flex-wrap gap-2">
                            {med.indications.map((ind, i) => (
                              <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black border border-emerald-100 uppercase tracking-widest">{ind}</span>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="p-8 bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-800 relative overflow-hidden text-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                         <div className="space-y-6">
                            <div className="flex items-center gap-3">
                               <Activity className="w-5 h-5 text-medical-accent" />
                               <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Mechanism of Action</h5>
                            </div>
                            <p className="text-base font-black italic uppercase tracking-tight leading-relaxed text-slate-200">{med.moa}</p>
                         </div>
                         
                         <div className="space-y-6">
                            <div className="flex items-center gap-3">
                               <ShieldCheck className="w-5 h-5 text-emerald-400" />
                               <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Clinical Rec.</h5>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                               <p className="text-xl font-black italic tracking-tighter text-medical-accent mb-1">{med.classOfRec || 'Class I, Level A'}</p>
                               <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">ESC 2024 / AHA 2023 Guidelines</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="md:col-span-12 lg:col-span-4 space-y-10">
                   <div className={cn(
                     "p-8 text-white rounded-[3rem] shadow-xl relative overflow-hidden group transition-all duration-700",
                     hasHyperkalemiaRisk || hasRenalRisk ? "bg-rose-900 border-2 border-rose-500 scale-105" : "bg-medical-accent"
                   )}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                      <div className="flex items-center gap-3 mb-8 relative z-10">
                         <AlertTriangle className="w-5 h-5 text-white/60" />
                         <h5 className="text-[10px] font-black uppercase tracking-[0.4em]">Contraindications</h5>
                      </div>
                      <div className="space-y-4 relative z-10">
                         {med.contraindications.map((contra, i) => (
                           <div key={i} className="flex items-center gap-4 p-3 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-crosshair">
                              <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", hasHyperkalemiaRisk && contra.includes('K') ? "bg-medical-accent animate-ping" : "bg-white")} />
                              <span className="text-[10px] font-black uppercase tracking-widest text-left">{contra}</span>
                           </div>
                         ))}
                      </div>
                   </div>

                   {med.dosingCalculatorType && (
                     <button 
                       onClick={() => setShowCalculator(true)}
                       className="w-full p-6 bg-slate-900 border border-medical-accent/30 rounded-[2.5rem] flex items-center justify-between group hover:border-medical-accent transition-all duration-500 shadow-2xl"
                     >
                        <div className="flex items-center gap-4 text-left">
                           <div className="w-10 h-10 rounded-2xl bg-medical-accent flex items-center justify-center shadow-lg shadow-medical-accent/40 group-hover:scale-110 transition-transform">
                              <Calculator className="w-5 h-5 text-white" />
                           </div>
                           <div className="text-left">
                              <h5 className="text-[11px] font-black text-white uppercase tracking-widest group-hover:text-medical-accent transition-colors">Precision Calculator</h5>
                              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tight mt-1">Weight/Creatinine-based Dosing</p>
                           </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-medical-accent group-hover:translate-x-1 transition-all" />
                     </button>
                   )}
                </div>
              </div>
            </div>
          </div>
        </Card>

      <AnimatePresence>
        {showCalculator && med.dosingCalculatorType && (
          <DoseCalculator 
            type={med.dosingCalculatorType}
            age={patient.age}
            weight={patient.weight}
            creatinine={patient.labs.creatinine}
            gender={patient.gender}
            setAge={patient.setAge}
            setWeight={patient.setWeight}
            setCr={(cr) => patient.setLabs({creatinine: cr})}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function MedicationDetail({ med, onClose }: { med: Medication; onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 bg-slate-900/50 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 cursor-pointer"
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full h-[92dvh] md:h-auto md:max-h-[85vh] md:max-w-6xl bg-medical-surface rounded-t-[2rem] md:rounded-[3rem] relative overflow-hidden flex flex-col shadow-2xl z-10 overscroll-contain pb-[env(safe-area-inset-bottom,0px)]"
      >
        <MedicationDetailPanel med={med} onClose={onClose} />
      </motion.div>
    </motion.div>
  );
}

