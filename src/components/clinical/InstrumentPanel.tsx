import { useMemo, useState, type ReactNode } from 'react';
import { Card } from '../ui/Card';
import { ScoreDisplay, ToggleItem } from './ClinicalUI';
import { cn } from '../../lib/utils';
import { usePatient } from '../../context/usePatient';
import {
  evaluateScore,
  autoSelectCriteria,
  exclusiveGroupOf,
  type Instrument,
} from '../../lib/instruments';

const riskColor = (risk?: string) => (risk === 'high' ? 'rose' : risk === 'moderate' ? 'amber' : 'medical-accent');

function GridContainer({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function ScorePanel({ instrument }: { instrument: Instrument }) {
  const patient = usePatient();
  const [manual, setManual] = useState<Set<string>>(new Set());
  const [suppressed, setSuppressed] = useState<Set<string>>(new Set());

  const auto = useMemo(
    () => new Set(autoSelectCriteria(instrument, { age: patient.age, gender: patient.gender, labs: patient.labs })),
    [instrument, patient],
  );

  const activeAuto = useMemo(() => new Set([...auto].filter((id) => !suppressed.has(id))), [auto, suppressed]);
  const selected = useMemo(() => new Set([...activeAuto, ...manual]), [activeAuto, manual]);
  const result = evaluateScore(instrument, selected);

  const toggle = (id: string) => {
    if (activeAuto.has(id)) return; // locked: auto-linked from the patient profile
    const group = exclusiveGroupOf(instrument, id);
    setManual((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        return next;
      }
      if (group) {
        for (const c of instrument.criteria ?? []) if (c.exclusiveGroup === group) next.delete(c.id);
      }
      next.add(id);
      return next;
    });
    if (group) {
      setSuppressed((prev) => {
        const next = new Set(prev);
        for (const c of instrument.criteria ?? []) {
          if (c.exclusiveGroup === group && c.id !== id && auto.has(c.id)) next.add(c.id);
        }
        return next;
      });
    }
  };

  return (
    <div className="space-y-6 text-left">
      <ScoreDisplay
        score={result.total}
        label={instrument.name}
        interpretation={result.band?.label ?? '—'}
        recommendation={result.band?.recommendation}
        color={riskColor(result.band?.risk)}
      />
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider -mt-2 px-1">{instrument.description}</p>
      <GridContainer>
        {(instrument.criteria ?? []).map((criterion) => (
          <ToggleItem
            key={criterion.id}
            label={criterion.label}
            sub={criterion.group}
            points={criterion.points}
            value={selected.has(criterion.id)}
            onClick={() => toggle(criterion.id)}
            locked={activeAuto.has(criterion.id)}
          />
        ))}
      </GridContainer>
      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{instrument.sourceNote}</p>
    </div>
  );
}

function ClassificationPanel({ instrument }: { instrument: Instrument }) {
  const [optionId, setOptionId] = useState<string | null>(null);
  const option = (instrument.options ?? []).find((o) => o.id === optionId) ?? null;

  return (
    <div className="space-y-6 text-left">
      <div className="rounded-2xl md:rounded-2xl p-6 sm:p-8 bg-slate-900 text-white shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-3 relative z-10">{instrument.name}</p>
        <h3 className="text-xl md:text-3xl font-black italic tracking-tighter uppercase leading-tight relative z-10">
          {option?.label ?? 'Select a class'}
        </h3>
        {option?.recommendation && (
          <p className="text-[11px] font-black uppercase tracking-wider text-medical-accent mt-4 relative z-10">{option.recommendation}</p>
        )}
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider -mt-2 px-1">{instrument.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(instrument.options ?? []).map((o) => (
          <button
            key={o.id}
            onClick={() => setOptionId(o.id)}
            aria-pressed={optionId === o.id}
            className={cn(
              'p-5 rounded-2xl border-2 text-left transition-all min-h-[56px] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-accent/50',
              optionId === o.id ? 'border-medical-accent bg-medical-accent/5' : 'border-slate-100 bg-white hover:border-medical-accent/30',
            )}
          >
            <span className="text-[11px] font-black uppercase tracking-tight text-slate-800">{o.label}</span>
          </button>
        ))}
      </div>
      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{instrument.sourceNote}</p>
    </div>
  );
}

/** Renders a single clinical instrument (score or classification). */
export function InstrumentPanel({ instrument }: { instrument: Instrument }) {
  if (instrument.kind === 'classification') return <ClassificationPanel instrument={instrument} />;
  return <ScorePanel instrument={instrument} />;
}

/** Card wrapper used in the calculator page. */
export function InstrumentCard({ instrument }: { instrument: Instrument }) {
  return (
    <Card className="p-5 sm:p-6 md:p-8 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
      <InstrumentPanel instrument={instrument} />
    </Card>
  );
}
