import { useState, useMemo, memo } from 'react';
import { 
  Waves, 
  Layers, 
  Scaling, 
  Activity, 
  Search,
  Zap,
  Camera,
  type LucideIcon
} from 'lucide-react';
import { imagingParameters, type ImagingParameter, type Modality, type ViewBlueprint } from '../../data/measurements';
import { PageHeader } from '../../components/layout/PageHeader';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { ClinicalField } from '../../components/clinical/ClinicalUI';
import { usePatient } from '../../context/usePatient';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

const modalities: { id: Modality; label: string; icon: LucideIcon }[] = [
  { id: 'ECHO', label: 'Echo', icon: Waves },
  { id: 'CMR', label: 'MRI', icon: Layers },
  { id: 'CCTA', label: 'CT', icon: Scaling },
  { id: 'NUCLEAR', label: 'Nuclear', icon: Activity },
  { id: 'CXR', label: 'X-Ray', icon: Camera }
];

// High-Fidelity Minimalist SVG Blueprints
const BlueprintIcon = ({ type, className }: { type: ViewBlueprint; className?: string }) => {
  if (type === 'NONE') return null;
  
  return (
    <svg viewBox="0 0 100 100" className={cn("fill-none stroke-current stroke-[1.5]", className)}>
      {type === 'PLAX' && (
        <g strokeLinecap="round" strokeLinejoin="round">
           <path d="M20,50 Q20,20 50,20 Q80,20 80,50 Q80,80 50,80 Q20,80 20,50" className="opacity-40" />
           <path d="M60,20 L80,5" className="opacity-80" />
           <path d="M40,20 L20,5" className="opacity-80" />
           <path d="M35,30 L35,70" className="stroke-medical-accent stroke-[3]" />
           <circle cx="35" cy="30" r="2" fill="currentColor" />
           <circle cx="35" cy="70" r="2" fill="currentColor" />
        </g>
      )}
      {type === 'A4C' && (
        <g strokeLinecap="round" strokeLinejoin="round">
           <path d="M50,90 Q20,60 25,20 Q50,15 75,20 Q80,60 50,90" className="opacity-40" />
           <path d="M25,50 L75,50" className="opacity-20" />
           <path d="M50,20 L50,90" className="opacity-20" />
           <path d="M35,25 Q50,30 65,25" className="stroke-medical-accent stroke-[3]" />
           <path d="M35,75 Q50,80 65,75" className="stroke-medical-accent stroke-[3]" />
        </g>
      )}
      {type === 'A2C' && (
        <g strokeLinecap="round" strokeLinejoin="round">
           <path d="M50,90 Q25,60 30,20 Q50,15 70,20 Q75,60 50,90" className="opacity-40" />
           <path d="M30,50 L70,50" className="opacity-20" />
           <path d="M35,35 Q50,40 65,35" className="stroke-medical-accent opacity-60" />
        </g>
      )}
      {type === 'A3C' && (
        <g strokeLinecap="round" strokeLinejoin="round">
           <path d="M50,90 Q20,60 25,20 Q50,15 75,20 Q80,60 50,90" className="opacity-40" />
           <path d="M25,50 L75,50" className="opacity-20" />
           {/* Aortic Outlet */}
           <path d="M55,25 L75,5" className="stroke-medical-accent stroke-[2]" />
           <path d="M45,25 L25,5" className="opacity-20" />
        </g>
      )}
      {type === 'RV' && (
        <g strokeLinecap="round" strokeLinejoin="round">
           {/* RV Heart View - Tilted Right */}
           <path d="M40,90 Q10,60 15,20 Q40,15 65,20 Q70,60 40,90" className="opacity-40" />
           <path d="M15,50 L65,50" className="opacity-20" />
           {/* RA / Tricuspid focus */}
           <path d="M25,65 Q40,70 55,65" className="stroke-medical-accent stroke-[3]" />
           <circle cx="25" cy="65" r="2" fill="currentColor" />
           <circle cx="55" cy="65" r="2" fill="currentColor" />
        </g>
      )}
      {type === 'CXR-C' && (
        <g strokeLinecap="round" strokeLinejoin="round">
           <path d="M20,20 Q50,15 80,20 Q85,80 50,85 Q15,80 20,20" className="opacity-40" />
           <path d="M80,60 L70,60" className="stroke-medical-accent opacity-60" />
           <path d="M80,65 L70,65" className="stroke-medical-accent opacity-60" />
           <circle cx="50" cy="55" r="15" className="opacity-20" />
        </g>
      )}
      {type === 'CT-C' && (
        <g strokeLinecap="round" strokeLinejoin="round">
           <circle cx="50" cy="50" r="35" className="opacity-40" />
           <path d="M50,15 A35,35 0 0,1 85,50 L50,50 Z" className="fill-medical-accent opacity-20 stroke-none" />
           <path d="M50,15 A35,35 0 0,1 85,50" className="stroke-medical-accent stroke-[2]" />
           <circle cx="50" cy="50" r="4" fill="currentColor" />
        </g>
      )}
      {type === 'CMR-AX' && (
        <g strokeLinecap="round" strokeLinejoin="round">
           <circle cx="50" cy="50" r="38" className="opacity-40" strokeDasharray="4 2" />
           <circle cx="50" cy="50" r="30" className="stroke-medical-accent stroke-[2]" />
           <path d="M50,20 L50,80 M20,50 L80,50" className="opacity-10" />
           <path d="M35,35 L65,65" className="stroke-medical-accent/30 stroke-[1]" />
        </g>
      )}
      {type === 'NUC-P' && (
        <g strokeLinecap="round" strokeLinejoin="round">
           <circle cx="50" cy="50" r="35" className="opacity-20" fill="currentColor" />
           <circle cx="50" cy="50" r="25" className="opacity-40" />
           <circle cx="50" cy="50" r="15" className="opacity-60" />
           <path d="M50,15 L50,85 M15,50 L85,50" className="opacity-30" />
           <path d="M50,50 L75,25" className="stroke-medical-accent stroke-[3]" />
        </g>
      )}
    </svg>
  );
};

export default function ImagingView() {
  const { bsa, weight } = usePatient();
  const [activeModality, setActiveModality] = useState<Modality>('ECHO');
  const [search, setSearch] = useState('');

  const filteredParams = useMemo(() => {
    const lowercasedSearch = search.toLowerCase();
    return imagingParameters.filter(p => {
      const matchesModality = p.modality === activeModality;
      const matchesSearch = p.name.toLowerCase().includes(lowercasedSearch) ||
                           p.shortName.toLowerCase().includes(lowercasedSearch);
      return matchesModality && matchesSearch;
    });
  }, [activeModality, search]);

  return (
    <div className="space-y-6 pb-20">
      <PageHeader 
        title="Imaging Intelligence" 
        subtitle="High-fidelity multimodality diagnostic suite"
        badge="Radiology Command"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 w-full">
          <div className="flex items-center justify-around gap-2 bg-slate-50 p-1.5 rounded-full border border-slate-100 shrink-0">
             <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white rounded-full border border-slate-100 shadow-sm flex-1 sm:flex-initial justify-center">
                <span className="text-[10px] md:text-xs font-black text-slate-400">BSA</span>
                <span className="text-xs md:text-sm font-black text-slate-900 italic tracking-tighter">{bsa} m²</span>
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white rounded-full border border-slate-100 shadow-sm ml-1 flex-1 sm:flex-initial justify-center">
                <span className="text-[10px] md:text-xs font-black text-slate-400">Weight</span>
                <span className="text-xs md:text-sm font-black text-slate-900 italic tracking-tighter">{weight} kg</span>
             </div>
          </div>
          
          <div className="relative group flex-1">
            <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-medical-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search Parameters..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-full py-3 md:py-5 pl-11 md:pl-14 pr-6 md:pr-8 text-xs md:text-xs font-bold uppercase tracking-wider text-slate-900 focus:outline-none focus:border-medical-accent/30 focus:bg-slate-50/50 transition-all placeholder:text-slate-300"
            />
          </div>
        </div>
      </PageHeader>

      <div className="space-y-4">
        <SegmentedControl 
          options={modalities.map(m => ({ id: m.id, label: m.label, icon: m.icon }))}
          activeId={activeModality}
          onChange={(id) => setActiveModality(id as Modality)}
        />
      </div>

      {/* Protocol Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredParams.map((param) => (
            <MeasurementStrip key={param.id} param={param} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

const MeasurementStrip = memo(({ param }: { param: ImagingParameter }) => {
  const { gender, bsa } = usePatient();
  const [inputValue, setInputValue] = useState<string>('');
  
  const tiers = gender === 'Male' ? param.severityTiersM : param.severityTiersF;

  const currentSeverity = useMemo(() => {
    if (inputValue === '') return null;
    let val = parseFloat(inputValue);
    
    if (param.isIndexed && bsa) {
       val = val / bsa;
    }

    if (param.type === 'categorical') {
       return tiers.find(t => t.min === val);
    }
    return tiers.find(t => val >= t.min && val <= t.max);
  }, [inputValue, tiers, param.isIndexed, bsa, param.type]);

  const normalRange = gender === 'Male' ? param.normalRangeM : param.normalRangeF;
  const isAbnormal = useMemo(() => {
    if (inputValue === '') return false;
    let val = parseFloat(inputValue);
    if (param.isIndexed && bsa) val = val / bsa;
    return val < normalRange.min || val > normalRange.max;
  }, [inputValue, normalRange, param.isIndexed, bsa]);

  return (
    <motion.div
      layout
      className={cn(
        "bg-white border p-4 sm:p-5 md:p-6 rounded-2xl md:rounded-2xl flex flex-col group transition-all duration-300 relative overflow-hidden h-full",
        isAbnormal ? "border-medical-accent/30 shadow-sm shadow-medical-accent/5" : "border-slate-200/60 hover:shadow-sm hover:border-slate-300/60"
      )}
    >
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300",
        isAbnormal ? "bg-medical-accent" : "bg-slate-100 group-hover:bg-medical-accent/20"
      )} />

      {/* Protocol Header */}
      <div className="pl-3 md:pl-4 mb-4 md:mb-6 flex justify-between items-start gap-3 md:gap-4">
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
             <span className="text-[9px] md:text-[10px] font-black text-medical-accent uppercase tracking-wider">{param.category}</span>
             {param.isIndexed && <span className="text-[8px] font-black text-sky-500 bg-sky-50 px-1 rounded uppercase">Index: BSA</span>}
          </div>
          <h4 className="font-black text-sm md:text-base tracking-tight text-slate-900 uppercase italic leading-tight truncate mb-1">
            {param.name}
          </h4>
          <span className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase tracking-wider">{param.source}</span>
        </div>
        <div className="w-11 h-11 md:w-14 md:h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
           <BlueprintIcon type={param.blueprint} className="w-8 h-8 md:w-10 md:h-10 text-slate-300 group-hover:text-medical-accent transition-all duration-300" />
        </div>
      </div>

      <div className="pl-4 space-y-5 flex-1 flex flex-col">
        {/* Interaction Area */}
        {param.type === 'categorical' ? (
           <div className="grid grid-cols-2 gap-2">
              {tiers.map((tier) => (
                 <button
                    key={tier.label}
                    onClick={() => setInputValue(tier.min.toString())}
                    className={cn(
                      "px-3 py-3 rounded-2xl text-[10px] font-black uppercase tracking-tight text-left transition-all border",
                      inputValue === tier.min.toString()
                        ? "bg-white border-medical-accent text-medical-accent shadow-sm translate-y-[-2px]"
                        : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-white hover:border-slate-200"
                    )}
                 >
                    {tier.label}
                 </button>
              ))}
           </div>
        ) : (
           <div className="flex flex-col gap-1">
              <ClinicalField 
                label={param.name}
                value={inputValue}
                unit={param.unit}
                onChange={setInputValue}
                variant={isAbnormal ? 'minimal' : 'minimal'}
                elevated={isAbnormal}
                placeholder="---"
              />
              <div className="flex items-center justify-between px-1 mt-1">
                <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">
                  Ref Range: {normalRange.min}-{normalRange.max} {param.unit}
                </span>
                <div className="flex-1 max-w-[120px] h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-0.5 p-0.5 ml-4">
                  {tiers.map((t) => (
                    <div 
                      key={t.label} 
                      className={cn(
                        "h-full flex-1 transition-all duration-700 rounded-full",
                        currentSeverity?.label === t.label ? t.color.replace('text-', 'bg-') : "bg-slate-100 opacity-30"
                      )}
                    />
                  ))}
                </div>
              </div>
           </div>
        )}

        {/* Dynamic Context Display */}
        <div className="mt-auto pt-5">
           <AnimatePresence mode="wait">
              {currentSeverity ? (
                 <motion.div
                    key={currentSeverity.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="bg-slate-50 p-4 rounded-2xl border border-slate-100/60"
                 >
                    <div className="flex items-center gap-2 mb-1">
                       <Zap className={cn("w-3 h-3", currentSeverity.color)} />
                       <span className={cn("text-[10px] font-black uppercase tracking-widest", currentSeverity.color)}>Severity: {currentSeverity.label}</span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-tight italic leading-snug">
                       {currentSeverity.description || param.pearls[0]}
                    </p>
                 </motion.div>
              ) : (
                 <div className="bg-slate-50/50 p-4 rounded-2xl border border-dashed border-slate-200 text-center">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{param.type === 'categorical' ? 'Select clinical finding above' : `Enter value in ${param.unit}`}</p>
                 </div>
              )}
           </AnimatePresence>

           {/* Clinical Pearls (Footer) */}
           {!currentSeverity && (
              <div className="pt-4">
                 <p className="text-[9px] font-bold text-slate-400 italic line-clamp-2 uppercase leading-relaxed">
                    {param.pearls[0]}
                 </p>
              </div>
           )}
        </div>
      </div>
    </motion.div>
  );
});
