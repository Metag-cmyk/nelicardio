import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Search, Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { PageHeader } from '../../components/layout/PageHeader';
import { SocietyToggle } from '../../components/ui/SocietyToggle';
import { PrintButton } from '../../components/ui/PrintButton';
import { RecommendationCard, PendingGradesNotice } from '../../components/clinical/Evidence';
import { conditions } from '../../data/conditions';
import { guidelines, matchesSociety, societyLabel, type Guideline } from '../../data/guidelines';
import { useSociety } from '../../context/useSociety';
import { cn } from '../../lib/utils';

interface GuidelinesViewProps {
  /** Guideline id from the route (`#/guidelines/:id`). */
  selectedId?: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

const conditionName = (id: string): string =>
  conditions.find((c) => c.id === id)?.name ?? id;

function GuidelineListCard({ guideline, active, onClick }: { guideline: Guideline; active: boolean; onClick: () => void }) {
  const graded = guideline.recommendations.length;
  return (
    <Card
      onClick={onClick}
      className={cn(
        'group p-5 bg-white border-2 transition-all duration-200 cursor-pointer rounded-2xl md:rounded-[1.75rem] flex flex-col h-full active:scale-[0.99]',
        active ? 'border-medical-accent bg-slate-50 shadow-xl' : 'border-slate-100 hover:border-medical-accent/40',
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[9px] md:text-[10px] font-black text-medical-accent uppercase tracking-wider">
          {guideline.society.map((s) => societyLabel[s]).join(' / ')} {guideline.edition}
        </span>
        {graded > 0
          ? <Badge variant="success" className="text-[8px] font-black">{graded} graded</Badge>
          : <Badge variant="ghost" className="text-[8px] font-black">Pending</Badge>}
      </div>
      <h3 className="text-sm md:text-base font-black text-slate-900 italic uppercase tracking-tight leading-tight group-hover:text-medical-accent transition-colors mb-2">
        {guideline.title}
      </h3>
      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider line-clamp-2 leading-relaxed mt-auto">
        {guideline.summary}
      </p>
    </Card>
  );
}

function GuidelineDetail({ guideline }: { guideline: Guideline }) {
  const { society } = useSociety();
  const graded = guideline.recommendations;

  return (
    <div className="flex flex-col h-full w-full bg-medical-surface">
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 px-5 md:px-8 pt-4 pb-5 space-y-3 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-black text-medical-accent uppercase tracking-wider">
            {guideline.society.map((s) => societyLabel[s]).join(' / ')}
          </span>
          <Badge variant="ghost" className="text-[8px] font-black">Edition {guideline.edition}</Badge>
          {guideline.verifiedAt
            ? <Badge variant="success" className="text-[8px] font-black">Checked {guideline.verifiedAt}</Badge>
            : <Badge variant="warning" className="text-[8px] font-black">Edition to verify</Badge>}
          <PrintButton className="ml-auto" />
        </div>
        <h2 className="text-xl md:text-2xl font-black text-slate-900 italic uppercase tracking-tighter leading-tight">{guideline.title}</h2>
        <p className="prose-clinical">{guideline.summary}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 no-scrollbar bg-slate-50/50">
        {graded.length > 0 ? (
          <div className="space-y-3">
            <h4 className="label-clinical">Key recommendations</h4>
            {graded.map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} guideline={guideline} society={society} />
            ))}
          </div>
        ) : (
          <div className="p-6 bg-white border-2 border-dashed border-slate-200 rounded-2xl">
            <PendingGradesNotice />
          </div>
        )}

        {guideline.changesSince && guideline.changesSince.length > 0 && (
          <div className="space-y-3">
            <h4 className="label-clinical flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> What changed</h4>
            {guideline.changesSince.map((change, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-white border border-slate-100 rounded-2xl">
                <Badge
                  variant={change.kind === 'new' ? 'success' : change.kind === 'removed' ? 'danger' : 'warning'}
                  className="text-[8px] font-black shrink-0"
                >
                  {change.kind}
                </Badge>
                <p className="prose-clinical">{change.text}</p>
              </div>
            ))}
          </div>
        )}

        {guideline.topics.length > 0 && (
          <div className="space-y-3">
            <h4 className="label-clinical">Applies to</h4>
            <div className="flex flex-wrap gap-2">
              {guideline.topics.map((topic) => (
                <span key={topic} className="px-3 py-1.5 bg-white border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  {conditionName(topic)}
                </span>
              ))}
            </div>
          </div>
        )}

        {guideline.url && (
          <a
            href={guideline.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-medical-accent hover:underline"
          >
            <ArrowRight className="w-3.5 h-3.5" /> Primary source
          </a>
        )}
      </div>
    </div>
  );
}

export default function GuidelinesView({ selectedId, onSelect, onClose }: GuidelinesViewProps) {
  const { society } = useSociety();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const lower = search.toLowerCase();
    return guidelines
      .filter((g) => matchesSociety(g, society))
      .filter((g) => !search || g.title.toLowerCase().includes(lower) || g.summary.toLowerCase().includes(lower))
      .sort((a, b) => b.year - a.year);
  }, [society, search]);

  const active = useMemo(() => guidelines.find((g) => g.id === selectedId), [selectedId]);

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      <PageHeader title="Guideline Library" subtitle="ESC + AHA/ACC recommendations with Class & Level of Evidence" badge="Evidence">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
          <SocietyToggle shrink-0 className="self-start sm:self-auto" />
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-medical-accent transition-colors" />
            <input
              type="text"
              placeholder="Search guidelines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border-2 border-slate-100 rounded-full py-3.5 md:py-4 pl-11 md:pl-14 pr-6 text-sm font-bold uppercase tracking-wider text-slate-900 focus:outline-none focus:border-medical-accent transition-all placeholder:text-slate-300"
            />
          </div>
        </div>
      </PageHeader>

      <div className="lg:grid lg:grid-cols-[minmax(320px,400px)_minmax(0,1fr)] lg:gap-8 lg:items-start">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
          {filtered.map((guideline) => (
            <GuidelineListCard
              key={guideline.id}
              guideline={guideline}
              active={selectedId === guideline.id}
              onClick={() => onSelect(guideline.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="p-8 bg-white border-2 border-dashed border-slate-200 rounded-2xl text-center">
              <p className="text-xs font-black uppercase tracking-wider text-slate-300">No guidelines match</p>
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-6">
            <Card className="flex flex-col h-[calc(100vh-9rem)] overflow-hidden border-2 border-slate-100 rounded-[2.5rem] bg-medical-surface shadow-xl">
              {active ? (
                <GuidelineDetail guideline={active} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 gap-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900 uppercase tracking-tight italic">Select a guideline</h3>
                    <p className="prose-clinical mx-auto text-center">Pick a document to view its graded recommendations and what changed.</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-medical-surface w-full h-[92dvh] rounded-t-[2rem] shadow-2xl overflow-hidden flex flex-col pb-[env(safe-area-inset-bottom,0px)]"
            >
              <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 mb-1 shrink-0" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 active:scale-95"
                aria-label="Close"
              >
                <span className="text-xl leading-none">×</span>
              </button>
              <GuidelineDetail guideline={active} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
