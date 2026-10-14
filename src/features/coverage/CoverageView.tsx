import { useMemo, useState } from 'react';
import { Target, CheckCircle2, AlertTriangle, CircleDashed, Layers, BookOpen } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { PageHeader } from '../../components/layout/PageHeader';
import { SocietyToggle } from '../../components/ui/SocietyToggle';
import { BLUEPRINTS, type Blueprint } from '../../data/blueprint';
import { computeCoverage, STATUS_LABEL, type CoverageStatus, type TopicCoverage } from '../../lib/coverage';
import { getGuideline } from '../../data/guidelines';
import { useSociety } from '../../context/useSociety';
import { cn } from '../../lib/utils';

const STATUS_STYLE: Record<CoverageStatus, { chip: string; border: string; bar: string }> = {
  covered: { chip: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30', border: 'border-emerald-200', bar: 'bg-emerald-500' },
  partial: { chip: 'bg-amber-500/10 text-amber-600 border-amber-500/30', border: 'border-amber-200', bar: 'bg-amber-500' },
  outdated: { chip: 'bg-rose-500/10 text-rose-600 border-rose-500/30', border: 'border-rose-200', bar: 'bg-rose-500' },
  missing: { chip: 'bg-slate-400/10 text-slate-500 border-slate-300', border: 'border-slate-200', bar: 'bg-slate-400' },
};

function StatusChip({ status }: { status: CoverageStatus }) {
  const Icon = status === 'covered' ? CheckCircle2 : status === 'missing' ? CircleDashed : AlertTriangle;
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider', STATUS_STYLE[status].chip)}>
      <Icon className="w-3 h-3" /> {STATUS_LABEL[status]}
    </span>
  );
}

function TopicCard({ topic, active, onClick }: { topic: TopicCoverage; active: boolean; onClick: () => void }) {
  const pct = topic.totalCount > 0 ? Math.round((topic.gradedCount / topic.totalCount) * 100) : 0;
  return (
    <Card
      onClick={onClick}
      className={cn(
        'p-4 md:p-5 bg-white border-2 transition-all cursor-pointer rounded-2xl flex flex-col h-full active:scale-[0.99]',
        active ? 'border-medical-accent shadow-sm' : cn(STATUS_STYLE[topic.status].border, 'hover:shadow-sm'),
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <StatusChip status={topic.status} />
        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">{topic.weight}% wt</span>
      </div>
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight mb-3">{topic.title}</h3>
      <div className="mt-auto space-y-2">
        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-slate-400">
          <span>Graded {topic.gradedCount}/{topic.totalCount}</span>
          <span>Tools {topic.hasToolsCount}/{topic.totalCount}</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={cn('h-full rounded-full transition-all duration-700', STATUS_STYLE[topic.status].bar)} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </Card>
  );
}

function TopicDetail({ topic }: { topic: TopicCoverage }) {
  return (
    <Card className={cn('p-5 md:p-6 bg-white border-2 rounded-2xl space-y-4', STATUS_STYLE[topic.status].border)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter leading-tight">{topic.title}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
            {topic.gradedCount}/{topic.totalCount} conditions graded · {topic.hasToolsCount}/{topic.totalCount} with tools
          </p>
        </div>
        <StatusChip status={topic.status} />
      </div>

      {topic.supersededGuidelineIds.length > 0 && (
        <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
          Outdated guideline(s): {topic.supersededGuidelineIds.join(', ')}
        </p>
      )}

      <div className="space-y-2">
        {topic.conditions.map((c) => (
          <div key={c.conditionId} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex flex-wrap items-center gap-2 justify-between">
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{c.name}</span>
            <div className="flex items-center gap-1.5">
              <Badge variant={c.graded ? 'success' : 'ghost'} className="text-[8px] font-black">
                {c.graded ? 'Graded' : 'Ungraded'}
              </Badge>
              <Badge variant={c.hasTools ? 'success' : 'ghost'} className="text-[8px] font-black">
                {c.hasTools ? 'Tools' : 'No tools'}
              </Badge>
              {!c.hasImaging && <Badge variant="warning" className="text-[8px] font-black">No imaging</Badge>}
            </div>
          </div>
        ))}
        {topic.conditions.length === 0 && (
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">No conditions mapped to this topic.</p>
        )}
      </div>

      <div className="space-y-2">
        <h4 className="label-clinical flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> Covering guidelines</h4>
        <div className="flex flex-wrap gap-2">
          {topic.conditions.flatMap((c) => c.guidelineIds).filter((id, i, arr) => arr.indexOf(id) === i).map((id) => {
            const g = getGuideline(id);
            return (
              <span key={id} className="px-2.5 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-wider">
                {g ? `${g.society[0]} ${g.edition}` : id}
              </span>
            );
          })}
          {topic.conditions.every((c) => c.guidelineIds.length === 0) && (
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">None mapped</span>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function CoverageView() {
  const { society } = useSociety();
  const [blueprintId, setBlueprintId] = useState<Blueprint['id']>('esc-core-curriculum');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const blueprint = BLUEPRINTS.find((b) => b.id === blueprintId) ?? BLUEPRINTS[0];
  const report = useMemo(() => computeCoverage(blueprint, society), [blueprint, society]);
  const selectedTopic = report.topics.find((t) => t.id === selectedTopicId) ?? null;

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      <PageHeader
        title="Exam Coverage"
        subtitle="Blueprint heatmap: what is graded vs. content-thin"
        badge="Readiness"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <SocietyToggle />
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200/60 overflow-x-auto no-scrollbar">
            {BLUEPRINTS.map((b) => (
              <button
                key={b.id}
                onClick={() => setBlueprintId(b.id)}
                aria-pressed={blueprintId === b.id}
                className={cn(
                  'px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-accent/50',
                  blueprintId === b.id ? 'bg-white text-medical-accent shadow-sm' : 'text-slate-400 hover:text-slate-600',
                )}
              >
                {b.title}
              </button>
            ))}
          </div>
        </div>
      </PageHeader>

      {/* Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4 md:gap-6">
        <Card className="p-6 md:p-8 bg-medical-accent text-white rounded-2xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 mb-2">Exam readiness</p>
          <div className="text-6xl md:text-7xl font-black italic tracking-tighter leading-none tabular-num">{report.readiness}<span className="text-3xl">%</span></div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/70 mt-3">{blueprint.title} · {society === 'both' ? 'ESC + AHA/ACC' : society}</p>
          <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-white/70">Tooling</span>
            <span className="text-xl font-black italic tabular-num">{report.tooling}%</span>
          </div>
        </Card>

        <Card className="p-5 md:p-6 bg-white border-2 border-slate-100 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-medical-accent" />
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Coverage by status</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['covered', 'partial', 'outdated', 'missing'] as CoverageStatus[]).map((s) => (
              <div key={s} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                <StatusChip status={s} />
                <div className="text-3xl font-black italic tracking-tighter text-slate-900 mt-2 tabular-num">{report.counts[s]}</div>
              </div>
            ))}
          </div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-4">
            Readiness = graded guideline evidence per topic; Tooling = conditions with a decision-support tool.
            Source: {blueprint.source}. Weights are illustrative — edit when the official конспект is provided.
          </p>
        </Card>
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-6 lg:items-start">
        {/* Heatmap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
          {report.topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              active={selectedTopicId === topic.id}
              onClick={() => setSelectedTopicId(topic.id === selectedTopicId ? null : topic.id)}
            />
          ))}
        </div>

        {/* Detail / gaps */}
        <div className="space-y-4 mt-6 lg:mt-0 lg:sticky lg:top-6">
          {selectedTopic ? (
            <TopicDetail topic={selectedTopic} />
          ) : (
            <Card className="p-5 md:p-6 bg-white border-2 border-slate-100 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-medical-accent" />
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Top gaps (by weight)</h3>
              </div>
              <div className="space-y-2">
                {report.gaps.slice(0, 8).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTopicId(t.id)}
                    className="w-full flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl text-left hover:border-medical-accent/40 transition-all"
                  >
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{t.title}</span>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 shrink-0">{t.weight}% wt</span>
                  </button>
                ))}
                {report.gaps.length === 0 && (
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">No gaps — the blueprint is fully covered.</p>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
