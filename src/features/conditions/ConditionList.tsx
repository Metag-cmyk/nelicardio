import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Activity, 
  Stethoscope,
  ArrowRightCircle,
  ExternalLink,
  Info,
  Calculator,
  Dna,
  CheckCircle2,
  Scale,
  Zap,
  TrendingUp,
  BookOpen,
  Image as ImageIcon
} from 'lucide-react';
import { conditions, type Condition, type ScoringSystem } from '../../data/conditions';
import { guidelinesForCondition, matchesSociety } from '../../data/guidelines';
import { figuresForCondition } from '../../data/figures';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { PageHeader } from '../../components/layout/PageHeader';
import { cn } from '../../lib/utils';
import React from 'react';
import { usePatient } from '../../context/usePatient';
import { useSociety } from '../../context/useSociety';
import { resolveScoreInterpretation, autoSelectCriteria } from '../../lib/scores';
import { getInstrument } from '../../lib/instruments';
import { instrumentsForCondition } from '../../data/toolWiring';
import { RecommendationCard, PendingGradesNotice } from '../../components/clinical/Evidence';
import { InstrumentPanel } from '../../components/clinical/InstrumentPanel';
import { FigureCard } from '../../components/clinical/Figure';
import { PrintButton } from '../../components/ui/PrintButton';

// --- Types ---
type DetailTab = 'overview' | 'diagnostics' | 'management' | 'tools';

interface ConditionListProps {
  /** Condition id from the route (`#/diagnose/:id`). */
  selectedId?: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

// Pre-compute normalized fields for faster filtering
const searchableConditions = conditions.map(c => ({
  condition: c,
  normalizedCategory: c.category.toLowerCase().replace(' ', ''),
  searchName: c.name.toLowerCase(),
  searchCategory: c.category.toLowerCase()
}));

// --- Shared Components ---

function Section({ title, icon, color = 'text-medical-accent', children, className }: { title: string, icon: React.ReactNode, color?: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-3 px-1">
        <div className={cn("shrink-0", color)}>{icon}</div>
        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 italic">{title}</h4>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/**
 * Interactive Scoring Component.
 * Interpretation is resolved by the typed resolver in `lib/scores`. When a score
 * cannot be evaluated numerically (e.g. Duke major/minor, Killip classes) a
 * reference table is shown instead of a potentially wrong risk label.
 */
function Scorer({ score, patient }: { score: ScoringSystem; patient: ReturnType<typeof usePatient> }) {
  const [manual, setManual] = useState<Set<string>>(new Set());

  const autoSelected = useMemo(
    () => new Set(autoSelectCriteria(score.criteria, patient)),
    [score, patient],
  );

  const isSelected = (label: string) => autoSelected.has(label) || manual.has(label);

  const totalScore = score.criteria.reduce(
    (acc, criterion) => (isSelected(criterion.label) ? acc + criterion.points : acc),
    0,
  );

  const interpretation = resolveScoreInterpretation(score.interpretation, totalScore, patient.gender);

  const toggle = (label: string) => {
    if (autoSelected.has(label)) return; // auto-linked from the patient profile
    setManual((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const risk = interpretation?.risk ?? '';
  const tone = /high|definite|severe/i.test(risk)
    ? 'rose'
    : /moderate|intermediate|possible/i.test(risk)
      ? 'amber'
      : 'emerald';

  return (
    <Card className="p-5 sm:p-6 md:p-8 bg-white border-2 border-slate-100 rounded-2xl md:rounded-2xl shadow-sm relative overflow-hidden group">
      <div className="flex justify-between items-start mb-6 md:mb-8">
        <div>
           <h5 className="text-xl md:text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-1">{score.name}</h5>
           <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">{score.description}</p>
        </div>
        <div className="text-right">
           <div className="text-3xl md:text-4xl font-black text-medical-accent italic leading-none tabular-num">{totalScore}</div>
           <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Points</div>
        </div>
      </div>

      <div className="space-y-2 mb-6 md:mb-8">
        {score.criteria.map((criterion, ci) => {
          const selected = isSelected(criterion.label);
          const auto = autoSelected.has(criterion.label);
          return (
            <button
              key={ci}
              onClick={() => toggle(criterion.label)}
              aria-pressed={selected}
              className={cn(
                "w-full flex justify-between items-center p-3.5 sm:p-4 rounded-xl md:rounded-2xl transition-all border-2 active:scale-[0.99] min-h-[48px]",
                selected
                  ? "bg-medical-accent/5 border-medical-accent/20 text-medical-accent"
                  : "bg-slate-50 border-transparent text-slate-500 hover:border-slate-100",
                auto && "opacity-90"
              )}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 text-left">
                 <div className={cn(
                   "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors shrink-0",
                   selected ? "bg-medical-accent border-medical-accent" : "bg-white border-slate-200"
                 )}>
                    {selected && <CheckCircle2 className="w-4 h-4 text-white" />}
                 </div>
                 <span className="text-[11px] sm:text-xs font-black uppercase tracking-tight">{criterion.label}</span>
                 {auto && <span className="text-[8px] font-black uppercase tracking-wider text-medical-accent/70 border border-medical-accent/20 rounded px-1">Auto</span>}
              </div>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full border border-current shrink-0 ml-2">+{criterion.points}</span>
            </button>
          );
        })}
      </div>

      {interpretation ? (
        <div className={cn(
          "p-4 sm:p-6 rounded-xl md:rounded-2xl border-2 transition-all duration-500",
          tone === 'rose' ? "bg-rose-50 border-rose-100 text-rose-700" :
          tone === 'amber' ? "bg-amber-50 border-amber-100 text-amber-700" :
          "bg-emerald-50 border-emerald-100 text-emerald-700"
        )}>
           <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider opacity-70">Clinical Interpretation</span>
              <Badge variant="ghost" className="text-[8px] font-black border-current opacity-70">Result Matrix</Badge>
           </div>
           <h6 className="text-lg md:text-xl font-black uppercase italic tracking-tighter leading-tight">{interpretation.risk}</h6>
           {interpretation.recommendation && (
             <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-tight mt-2 opacity-80">{interpretation.recommendation}</p>
           )}
        </div>
      ) : (
        <div className="p-4 sm:p-6 rounded-xl md:rounded-2xl border-2 border-slate-200 bg-slate-50 text-slate-600">
           <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider opacity-70">Reference thresholds (criteria-based score)</span>
           <div className="mt-3 space-y-2">
             {score.interpretation.map((row, i) => (
               <div key={i} className="flex justify-between gap-3 text-[10px] md:text-[11px] font-black uppercase tracking-tight">
                 <span className="text-slate-400">{row.range}</span>
                 <span className="text-slate-800 text-right">{row.risk}</span>
               </div>
             ))}
           </div>
        </div>
      )}
    </Card>
  );
}

/**
 * GDMT Decision Support (Heart Failure Spec)
 */
const GDMT_TONES: Record<'emerald' | 'amber' | 'accent' | 'sky', string> = {
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  accent: 'bg-medical-accent/10 text-medical-accent border-medical-accent/20',
  sky: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
};

function GDMTSupport({ condition }: { condition: Condition }) {
  if (condition.category !== 'Heart Failure') return null;

  const pillars = [
    { med: 'ARNI / ACEi', status: 'Optimal', note: 'Continue titration as BP allows.', tone: 'emerald' as const },
    { med: 'Beta-Blocker', status: 'Caution', note: 'HR < 60 bpm detected. Hold titration.', tone: 'amber' as const },
    { med: 'MRA', status: 'Recommended', note: 'Initiate based on current K+ levels.', tone: 'accent' as const },
    { med: 'SGLT2i', status: 'Strong REC', note: 'Indicated for all HFrEF patients.', tone: 'sky' as const }
  ];

  return (
    <Section title="GDMT Optimization Logic" icon={<TrendingUp className="w-5 h-5" />} color="text-emerald-500">
       <Card className="p-5 sm:p-6 md:p-8 bg-slate-900 border border-emerald-500/30 rounded-2xl md:rounded-2xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse" />
          
          <div className="flex items-center gap-3 sm:gap-4 mb-6 md:mb-8">
             <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-emerald-500 flex items-center justify-center shadow-sm shadow-emerald-500/30 shrink-0">
                <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-white" />
             </div>
             <div>
                <h5 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter leading-none">Guideline Titration Engine</h5>
                <p className="text-[9px] md:text-[10px] font-bold text-emerald-400/80 uppercase tracking-wider mt-1">ESC 2024 / HFA GDMT Protocols</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {pillars.map((item, i) => (
                <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-[1.8rem] group hover:bg-white/10 transition-all">
                   <div className="flex justify-between items-center mb-3">
                      <span className="text-[11px] font-black text-white uppercase tracking-tight">{item.med}</span>
                      <Badge className={cn("text-[8px] font-black uppercase", GDMT_TONES[item.tone])}>
                        {item.status}
                      </Badge>
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-normal leading-snug">{item.note}</p>
                </div>
             ))}
          </div>
       </Card>
    </Section>
  );
}

const ShieldCheck = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>
);

/**
 * Detail panel. Owns its own tab state so it can be mounted (and keyed) by
 * condition id in either the desktop master–detail pane or the mobile sheet.
 */
function ConditionDetail({
  condition,
  patient,
  onClose,
  onSelectCondition,
}: {
  condition: Condition;
  patient: ReturnType<typeof usePatient>;
  onClose: () => void;
  onSelectCondition: (id: string) => void;
}) {
  const [activeImagingTab, setActiveImagingTab] = useState<'EKG' | 'Echo' | 'Radiology'>('EKG');
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTab>('overview');
  const { society } = useSociety();

  const coveringGuidelines = useMemo(
    () => guidelinesForCondition(condition.id).filter((g) => matchesSociety(g, society)),
    [condition.id, society],
  );
  const gradedRecommendations = useMemo(
    () => coveringGuidelines.flatMap((g) => g.recommendations.map((recommendation) => ({ guideline: g, recommendation }))),
    [coveringGuidelines],
  );
  const wiredInstruments = useMemo(
    () => instrumentsForCondition(condition.id).map((id) => getInstrument(id)).filter((i): i is NonNullable<typeof i> => Boolean(i)),
    [condition.id],
  );
  const conditionFigures = useMemo(() => figuresForCondition(condition.id), [condition.id]);

  return (
    <div className="flex flex-col h-full w-full bg-medical-surface">
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 flex flex-col pt-3 md:pt-6 space-y-4 shrink-0">
        <div className="flex justify-between items-start px-5 md:px-8 gap-4">
          <div className="space-y-2 md:space-y-3 min-w-0">
            <div className="flex items-center gap-2 md:gap-3">
              <Badge variant={condition.priority === 'Critical' ? 'danger' : 'primary'} className="font-black tracking-wider uppercase text-[8px] md:text-[9px] py-0.5 md:py-1 px-2.5 md:px-4">
                {condition.priority === 'Critical' ? 'CRITICAL PATHWAY' : 'STANDARD PROTOCOL'}
              </Badge>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 italic">{condition.category}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 italic uppercase tracking-tighter leading-tight">{condition.name}</h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <PrintButton className="hidden sm:inline-flex" />
            <button 
              onClick={onClose} 
              className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-rose-50 hover:border-rose-100 hover:text-rose-500 transition-all font-black group active:scale-95 text-slate-500 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-accent/50"
              aria-label="Close details"
            >
              <span className="text-xl md:text-2xl leading-none">×</span>
            </button>
          </div>
        </div>
        
        <div className="flex px-4 md:px-8 gap-5 md:gap-8 overflow-x-auto no-scrollbar pb-0">
          {[
            { id: 'overview', label: 'OVERVIEW', icon: <Info className="w-4 h-4" /> },
            { id: 'diagnostics', label: 'DIAGNOSTICS', icon: <Stethoscope className="w-4 h-4" /> },
            { id: 'tools', label: 'DECISION SUPPORT', icon: <Zap className="w-4 h-4" /> },
            { id: 'management', label: 'MANAGEMENT', icon: <ArrowRightCircle className="w-4 h-4" /> }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveDetailTab(tab.id as DetailTab)} className={cn("pb-3 md:pb-5 flex items-center gap-2 text-[10px] md:text-[11px] font-black uppercase tracking-wider md:tracking-widest transition-all border-b-4 whitespace-nowrap outline-none min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-accent/50", activeDetailTab === tab.id ? "border-medical-accent text-medical-accent" : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300")}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 md:space-y-10 no-scrollbar bg-slate-50/50">
         <AnimatePresence mode="wait">
            <motion.div key={activeDetailTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full">
               {activeDetailTab === 'overview' && (
                  <div className="space-y-8">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                     <Section title="Pathophysiology" icon={<Activity className="w-5 h-5" />} color="text-medical-accent">
                        <Card className="p-8 bg-white border-2 border-slate-100/50 rounded-2xl shadow-sm relative overflow-hidden h-full group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-medical-accent/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-medical-accent/10 transition-colors" />
                           <p className="prose-clinical relative z-10">{condition.pathophysiology}</p>
                        </Card>
                     </Section>
                     <Section title="Etiology & Risk Factors" icon={<Dna className="w-5 h-5" />} color="text-indigo-500">
                        <div className="grid grid-cols-1 gap-3">
                           {condition.etiology?.map((cause, i) => (
                              <div key={i} className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm hover:border-indigo-200 transition-colors">
                                 <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                 <span className="text-[11px] font-black uppercase tracking-widest text-slate-600">{cause}</span>
                              </div>
                           ))}
                        </div>
                     </Section>
                  </div>
                  {conditionFigures.length > 0 && (
                     <Section title="Figures" icon={<ImageIcon className="w-5 h-5" />} color="text-sky-500">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                           {conditionFigures.map((figure) => (
                              <FigureCard key={figure.id} figure={figure} />
                           ))}
                        </div>
                     </Section>
                  )}
                  </div>
               )}

               {activeDetailTab === 'diagnostics' && (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                     <Section title="Diagnostic Algorithm" icon={<Stethoscope className="w-5 h-5" />} color="text-medical-accent">
                        <div className="space-y-4">
                           {(condition.diagnosticAlgorithm || condition.diagnosticCriteria).map((c, i) => (
                              <div key={i} className="flex gap-6 items-start">
                                 <div className="w-10 h-10 rounded-2xl bg-medical-accent/10 border border-medical-accent/20 flex items-center justify-center shrink-0 font-black text-xs text-medical-accent">{i+1}</div>
                                 <Card className="p-6 bg-white border-2 border-slate-50 rounded-[1.5rem] shadow-sm flex-1">
                                    <p className="prose-clinical">{c}</p>
                                 </Card>
                              </div>
                           ))}
                        </div>
                     </Section>
                     <Section title="Imaging & Biomarkers Matrix" icon={<Scale className="w-5 h-5" />} color="text-sky-500">
                        <div className="space-y-6">
                           <div className="flex p-1.5 bg-slate-900 rounded-2xl gap-1 shadow-sm">
                              {(['EKG', 'Echo', 'Radiology'] as const).map((tab) => (
                                 <button key={tab} onClick={() => setActiveImagingTab(tab)} className={cn("flex-1 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all outline-none focus-visible:ring-2 focus-visible:ring-white/50", activeImagingTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-200")}>{tab}</button>
                              ))}
                           </div>
                           <Card className="p-8 bg-white border-2 border-slate-100 rounded-2xl shadow-sm min-h-[240px]">
                              <div className="space-y-4">
                                 {(activeImagingTab === 'EKG' ? condition.ekgFindings : 
                                   activeImagingTab === 'Echo' ? condition.imaging?.echo :
                                   [...(condition.imaging?.ct_mri || []), ...(condition.imaging?.cxr || [])])?.map((finding, i) => (
                                    <div key={i} className="flex gap-4 items-start p-4 bg-slate-50/50 rounded-2xl">
                                       <Activity className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                                       <p className="prose-clinical">{finding}</p>
                                    </div>
                                 )) || <p className="text-xs font-black uppercase text-slate-300 italic text-center py-12">Data not digitized.</p>}
                              </div>
                           </Card>
                        </div>
                     </Section>
                  </div>
               )}

               {activeDetailTab === 'tools' && (
                  <div className="space-y-12">
                     {wiredInstruments.length > 0 && (
                        <Section title="Interactive Instruments" icon={<Calculator className="w-5 h-5" />} color="text-medical-accent">
                           <div className="space-y-8">
                              {wiredInstruments.map((instrument) => (
                                 <Card key={instrument.id} className="p-5 sm:p-6 md:p-8 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
                                    <InstrumentPanel instrument={instrument} />
                                 </Card>
                              ))}
                           </div>
                        </Section>
                     )}

                     <GDMTSupport condition={condition} />
                     
                     {condition.clinicalTools ? (
                        <div className="space-y-12">
                           {condition.clinicalTools.scores && (
                              <Section title="Interactive Risk Stratification" icon={<Calculator className="w-5 h-5" />} color="text-medical-accent">
                                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                    {condition.clinicalTools.scores.map(score => (
                                       <Scorer key={score.id} score={score} patient={patient} />
                                    ))}
                                 </div>
                              </Section>
                           )}
                           {condition.clinicalTools.imaging && (
                              <Section title="Severity Thresholds" icon={<Activity className="w-5 h-5" />} color="text-sky-500">
                                 {condition.clinicalTools.imaging.map((matrix, mi) => (
                                    <Card key={mi} className="overflow-hidden border-2 border-slate-100 rounded-2xl bg-white shadow-sm">
                                       <div className="p-6 bg-slate-900 text-white flex justify-between items-center"><h5 className="font-black uppercase italic tracking-tighter text-lg">{matrix.title}</h5></div>
                                       <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-slate-50 border-b border-slate-100"><th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Metric</th>{matrix.headers.map((h, hi) => (<th key={hi} className="p-6 text-[10px] font-black uppercase tracking-widest text-center italic text-slate-600">{h}</th>))}</tr></thead><tbody>{matrix.rows.map((row, ri) => (<tr key={ri} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"><td className="p-6"><span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{row.metric}</span></td>{row.values.map((v, vi) => (<td key={vi} className="p-6 text-center"><span className="text-[11px] font-black text-medical-accent uppercase italic">{v}</span></td>))}</tr>))}</tbody></table></div>
                                    </Card>
                                 ))}
                              </Section>
                           )}
                        </div>
                     ) : (
                        <div className="p-20 bg-white border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-4"><div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto"><Calculator className="w-10 h-10 text-slate-300" /></div><div className="space-y-1"><h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">No Specialized Tools</h4></div></div>
                     )}
                  </div>
               )}

               {activeDetailTab === 'management' && (
                  <div className="space-y-12">
                     <Section title="Guidelines & Evidence" icon={<BookOpen className="w-5 h-5" />} color="text-medical-accent">
                        {coveringGuidelines.length === 0 ? (
                           <Card className="p-6 bg-white border-2 border-dashed border-slate-200 rounded-2xl">
                              <PendingGradesNotice />
                           </Card>
                        ) : (
                           <div className="space-y-4">
                              <div className="flex flex-wrap gap-2">
                                 {coveringGuidelines.map((g) => (
                                    <span key={g.id} className="px-3 py-1.5 bg-white border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-wider">
                                       {g.society.join(' / ')} {g.edition}
                                    </span>
                                 ))}
                              </div>
                              {gradedRecommendations.length > 0 ? (
                                 <div className="space-y-3">
                                    {gradedRecommendations.map(({ guideline, recommendation }) => (
                                       <RecommendationCard
                                          key={`${guideline.id}-${recommendation.id}`}
                                          recommendation={recommendation}
                                          guideline={guideline}
                                          society={society}
                                       />
                                    ))}
                                 </div>
                              ) : (
                                 <Card className="p-6 bg-white border-2 border-dashed border-slate-200 rounded-2xl">
                                    <PendingGradesNotice />
                                 </Card>
                              )}
                           </div>
                        )}
                     </Section>

                     <Section title="Treatment Pathway" icon={<ArrowRightCircle className="w-5 h-5" />} color="text-indigo-500">
                        <div className="relative pl-10 space-y-6 mt-4"><div className="absolute top-4 bottom-8 left-[17px] w-1 bg-slate-100 rounded-full" />{condition.management.primary.map((m, i) => (<div key={i} className="relative"><div className="absolute -left-[45px] w-10 h-10 rounded-2xl bg-white border-2 border-indigo-500 flex items-center justify-center shrink-0 font-black text-xs text-indigo-500 z-10">{i+1}</div><Card className="p-6 bg-indigo-50/50 border border-indigo-100/50 rounded-2xl flex items-start text-indigo-950 shadow-sm transition-all hover:bg-indigo-50/80"><p className="prose-clinical">{m}</p></Card></div>))}</div>
                     </Section>

                     <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                        <Section title="Enhanced Differentials" icon={<ExternalLink className="w-5 h-5" />} color="text-amber-500">
                           <div className="flex flex-wrap gap-3">
                              {condition.differentialDiagnosis?.map((d, i) => {
                                 const discriminator = condition.discriminators?.[d];
                                 return (
                                    <Card key={i} className="p-4 bg-white border border-slate-100 rounded-2xl flex flex-col gap-2 min-w-[200px] flex-1">
                                       <button onClick={() => {const term=d.toLowerCase(); const found=conditions.find(c=>c.name.toLowerCase().includes(term)); if(found){onSelectCondition(found.id);}}} className="text-left text-[11px] font-black text-slate-900 uppercase tracking-tight hover:text-medical-accent transition-colors">{d}</button>
                                       {discriminator && <div className="p-2 bg-amber-50 rounded-lg border border-amber-100"><p className="text-[9px] font-bold text-amber-700 uppercase tracking-tight leading-snug italic"><span className="opacity-50">vs:</span> {discriminator}</p></div>}
                                    </Card>
                                 );
                              })}
                           </div>
                        </Section>

                        <Section title="Clinical Wisdom" icon={<Info className="w-5 h-5" />} color="text-teal-500">
                           <div className="p-8 bg-teal-50 border border-teal-100 rounded-2xl relative overflow-hidden group shadow-sm h-full"><div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/10 rounded-full -mr-20 -mt-20 blur-2xl transition-all duration-700" /><div className="space-y-6 relative z-10">{condition.pearls.map((p, i) => (<div key={i} className="flex gap-4 items-start"><div className="w-1.5 h-6 bg-teal-400 rounded-full shrink-0" /><p className="text-[12px] font-black italic text-teal-800 leading-relaxed uppercase tracking-tight">"{p}"</p></div>))}</div></div>
                        </Section>
                     </div>
                  </div>
               )}
            </motion.div>
         </AnimatePresence>
      </div>
    </div>
  );
}

function EmptyDetailPane() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-10 gap-4">
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
        <Stethoscope className="w-8 h-8 text-slate-300" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-black text-slate-900 uppercase tracking-tight italic">Select a condition</h3>
        <p className="prose-clinical mx-auto text-center">Pick a topic from the list to view its diagnosis, imaging and management pathway.</p>
      </div>
    </div>
  );
}

// --- Main Component ---

export default function ConditionList({ selectedId, onSelect, onClose }: ConditionListProps) {
  const patient = usePatient();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredConditions = useMemo(() => {
    let result = searchableConditions;
    
    if (activeCategory !== 'all') {
      const targetCategory = activeCategory.toLowerCase();
      result = result.filter(c => c.normalizedCategory === targetCategory);
    }
    if (search) {
      const lowercasedSearch = search.toLowerCase();
      result = result.filter(c => 
        c.searchName.includes(lowercasedSearch) ||
        c.searchCategory.includes(lowercasedSearch)
      );
    }
    
    return result.map(c => c.condition);
  }, [search, activeCategory]);

  const activeCondition = useMemo(() => 
    conditions.find(c => c.id === selectedId), 
    [selectedId]
  );

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      <PageHeader 
        title="Clinical Workstation" 
        subtitle="Precision diagnostic algorithms & decision support"
        badge="Cardiology HUD"
      >
        <div className="relative group max-w-md w-full">
           <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-medical-accent transition-colors" />
           <input 
             type="text" 
             placeholder="Search Conditions / Guidelines..." 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="w-full bg-white border-2 border-slate-100 rounded-full py-3.5 md:py-4 pl-11 md:pl-14 pr-6 md:pr-8 text-sm font-bold uppercase tracking-wider text-slate-900 focus:outline-none focus:border-medical-accent focus:shadow-sm focus:shadow-medical-accent/10 transition-all placeholder:text-slate-300"
           />
        </div>
      </PageHeader>

      <div className="lg:grid lg:grid-cols-[minmax(320px,400px)_minmax(0,1fr)] lg:gap-8 lg:items-start">
        {/* Left: filters + list */}
        <div className="space-y-4">
          {/* Category Filter Bar - Horizontal swipe carousel on Android */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              { id: 'all', label: 'All' },
              { id: 'ischemic', label: 'Ischemic' },
              { id: 'arrhythmia', label: 'Arrhythmia' },
              { id: 'heartFailure', label: 'Heart Failure' },
              { id: 'structural', label: 'Structural' },
              { id: 'vascular', label: 'Vascular' },
              { id: 'emergency', label: 'Emergency' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-4 py-2.5 md:px-5 md:py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-wider transition-all border-2 shrink-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-accent/50",
                  activeCategory === cat.id 
                    ? "bg-medical-accent border-medical-accent text-white shadow-sm shadow-medical-accent/25 scale-[1.02]" 
                    : "bg-white border-slate-100 text-slate-400 hover:border-medical-accent/30 hover:text-slate-600"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
            {filteredConditions.map((condition) => (
              <Card 
                key={condition.id}
                onClick={() => onSelect(condition.id)}
                className={cn(
                  "group p-5 md:p-5 bg-white border-2 transition-all duration-200 cursor-pointer rounded-2xl md:rounded-2xl relative overflow-hidden flex flex-col h-full active:scale-[0.99]",
                  selectedId === condition.id 
                    ? "border-medical-accent bg-slate-50 shadow-sm" 
                    : condition.priority === 'Critical'
                      ? "border-rose-100 hover:border-rose-300 shadow-sm"
                      : "border-slate-100 hover:border-medical-accent/40"
                )}
              >
                <div className="flex justify-between items-start mb-3">
                   <Badge variant={condition.priority === 'Critical' ? 'danger' : 'primary'} className="font-black tracking-wider uppercase text-[9px] md:text-[10px] py-0.5 px-2">
                     {condition.category}
                   </Badge>
                   {condition.clinicalTools && (
                     <div className="flex gap-2">
                        <Calculator className="w-4 h-4 text-indigo-500" />
                        <Zap className="w-4 h-4 text-amber-500" />
                     </div>
                   )}
                </div>
                <h3 className="text-base md:text-lg font-black text-slate-900 italic uppercase tracking-tight leading-tight group-hover:text-medical-accent transition-colors mb-2">{condition.name}</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider line-clamp-2 mb-3 leading-relaxed">{condition.summary}</p>
                <div className="space-y-2 mt-auto pt-2 border-t border-slate-50">
                   <div className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-medical-accent shrink-0" />
                      <span className="text-[10px] font-black uppercase text-slate-400 truncate">EKG: {condition.ekgFindings?.[0] || 'Standard'}</span>
                   </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: detail pane (desktop master–detail) */}
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <Card className="flex flex-col h-[calc(100vh-9rem)] overflow-hidden border-2 border-slate-100 rounded-2xl bg-medical-surface shadow-sm">
              {activeCondition ? (
                <ConditionDetail
                  key={activeCondition.id}
                  condition={activeCondition}
                  patient={patient}
                  onClose={onClose}
                  onSelectCondition={onSelect}
                />
              ) : (
                <EmptyDetailPane />
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile detail sheet */}
      <AnimatePresence>
        {activeCondition && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
               initial={{ y: "100%" }}
               animate={{ y: 0 }}
               exit={{ y: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="bg-medical-surface w-full h-[92dvh] rounded-t-[2rem] shadow-sm overflow-hidden flex flex-col border border-white/20 overscroll-contain pb-[env(safe-area-inset-bottom,0px)]"
            >
               <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 mb-1 shrink-0" />
               <ConditionDetail
                 key={activeCondition.id}
                 condition={activeCondition}
                 patient={patient}
                 onClose={onClose}
                 onSelectCondition={onSelect}
               />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
