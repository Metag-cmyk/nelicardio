import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen, Activity, Stethoscope, Calculator, AlertTriangle, Info, ArrowRightCircle,
  ScrollText, Image as ImageIcon, Pill, Search, ChevronRight, ChevronLeft, ChevronDown,
  CheckCircle2, Circle, Star, FlaskConical, ExternalLink, ListChecks,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { PageHeader } from '../../components/layout/PageHeader';
import { SocietyToggle } from '../../components/ui/SocietyToggle';
import { PrintButton } from '../../components/ui/PrintButton';
import { RecommendationCard } from '../../components/clinical/Evidence';
import { InstrumentPanel } from '../../components/clinical/InstrumentPanel';
import { FigureCard } from '../../components/clinical/Figure';
import { conditions, type Condition } from '../../data/conditions';
import { getGuideline } from '../../data/guidelines';
import { getInstrument } from '../../lib/instruments';
import { getFigure } from '../../data/figures';
import { medicationsMap } from '../../data/medications';
import { treatmentRationale } from '../../data/treatmentRationale';
import { complications } from '../../data/complications';
import { epiPrognosis } from '../../data/prognosis';
import { keyNumbers } from '../../data/keyNumbers';
import { pitfalls } from '../../data/pitfalls';
import { requirementStatuses } from '../../lib/exam/audit';
import { relatedTopics } from '../../lib/exam/related';
import { vivaQuestions } from '../../lib/exam/viva';
import { labDirection } from '../../lib/labs';
import { examSections, examTopics, getExamTopic, requirementLabelBg, type ExamTopic } from '../../data/exam';
import { questionsForTopic } from '../../lib/exam/study';
import {
  loadExamProgress, saveExamProgress, withStudied, withConfidence, withOpened,
  type ExamProgressMap,
} from '../../lib/exam/progress';
import { navigate } from '../../router/router';
import { useSociety } from '../../context/useSociety';
import { cn } from '../../lib/utils';

interface ExamViewProps {
  selectedId?: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

/** Bulgarian heading with an icon (clinical terms stay English). */
function Heading({ bg, en, icon, color = 'text-medical-accent' }: { bg: string; en?: string; icon: React.ReactNode; color?: string }) {
  return (
    <div className="flex items-center gap-3 px-1 mb-4">
      <div className={cn('shrink-0', color)}>{icon}</div>
      <h4 className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 italic">
        {bg}{en ? <span className="text-slate-400 not-italic"> · {en}</span> : null}
      </h4>
    </div>
  );
}

const conditionById = new Map(conditions.map((c) => [c.id, c]));

function Bullets({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">—</p>;
  return (
    <ul className="space-y-2">
      {items.map((text, i) => (
        <li key={i} className="flex gap-3 items-start">
          <span className="w-1.5 h-1.5 rounded-full bg-medical-accent/60 mt-1.5 shrink-0" />
          <span className="text-[13px] font-semibold text-slate-700 leading-snug">{text}</span>
        </li>
      ))}
    </ul>
  );
}

function ConditionBlock({ condition }: { condition: Condition }) {
  const imaging = [
    ...(condition.imaging?.echo ?? []).map((t) => `Echo: ${t}`),
    ...(condition.imaging?.ct_mri ?? []).map((t) => `CT/MRI: ${t}`),
    ...(condition.imaging?.cxr ?? []).map((t) => `CXR: ${t}`),
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{condition.name}</span>
        <Badge variant="primary" className="text-[8px] font-black">{condition.category}</Badge>
        <button
          onClick={() => navigate({ name: 'diagnose', id: condition.id })}
          className="ml-auto inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-medical-accent hover:underline"
        >
          Отвори в Diagnose <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <Card className="p-5 bg-white border-2 border-slate-100 rounded-2xl space-y-4">
        <p className="prose-clinical">{condition.summary}</p>
        {condition.pathophysiology && <p className="prose-clinical text-slate-500">{condition.pathophysiology}</p>}
      </Card>

      {condition.pathogenesis && condition.pathogenesis.length > 0 && (
        <Card className="p-5 bg-indigo-50/40 border-2 border-indigo-100 rounded-2xl space-y-3">
          <h5 className="text-[10px] font-black uppercase tracking-wider text-indigo-600">Патогенеза · Pathogenesis (стъпки)</h5>
          <ol className="space-y-2">
            {condition.pathogenesis.map((s, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-[13px] font-semibold text-slate-700 leading-snug">
                  {s.stage ? <span className="font-black text-indigo-600 uppercase text-[10px] tracking-wider mr-1.5">{s.stage}</span> : null}
                  {s.text}
                </span>
              </li>
            ))}
          </ol>
        </Card>
      )}

      <Card className="p-5 bg-white border-2 border-slate-100 rounded-2xl space-y-3">
        <h5 className="text-[10px] font-black uppercase tracking-wider text-medical-accent">Клиника · Clinic</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-2">Симптоми · Symptoms</p>
            <Bullets items={condition.symptoms} />
          </div>
          {condition.signs && condition.signs.length > 0 && (
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-2">Признаци · Signs</p>
              <Bullets items={condition.signs} />
            </div>
          )}
        </div>
      </Card>

      {condition.labDeviations && condition.labDeviations.length > 0 && (
        <Card className="p-5 bg-white border-2 border-slate-100 rounded-2xl space-y-2">
          <h5 className="text-[10px] font-black uppercase tracking-wider text-amber-600">Лаборатория · Laboratory</h5>
          <ul className="space-y-1.5">
            {condition.labDeviations.map((l, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={cn('w-4 text-center text-[13px] font-black shrink-0', l.isCritical ? 'text-rose-600' : 'text-amber-500')}>{labDirection(l)}</span>
                <span className="text-[13px] font-semibold text-slate-700 leading-snug"><span className="font-black text-slate-900">{l.label}:</span> {l.value}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5 bg-white border-2 border-slate-100 rounded-2xl space-y-3">
          <h5 className="text-[10px] font-black uppercase tracking-wider text-indigo-500">Етиология · Etiology</h5>
          <Bullets items={condition.etiology} />
        </Card>
        <Card className="p-5 bg-white border-2 border-slate-100 rounded-2xl space-y-3">
          <h5 className="text-[10px] font-black uppercase tracking-wider text-medical-accent">Диагностични критерии · Diagnostic criteria</h5>
          <Bullets items={condition.diagnosticCriteria} />
        </Card>
        <Card className="p-5 bg-white border-2 border-slate-100 rounded-2xl space-y-3">
          <h5 className="text-[10px] font-black uppercase tracking-wider text-rose-500">ЕКГ · ECG</h5>
          <Bullets items={condition.ekgFindings} />
        </Card>
        <Card className="p-5 bg-white border-2 border-slate-100 rounded-2xl space-y-3">
          <h5 className="text-[10px] font-black uppercase tracking-wider text-sky-500">Образна диагностика · Imaging</h5>
          <Bullets items={imaging} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5 bg-indigo-50/50 border-2 border-indigo-100/60 rounded-2xl space-y-3">
          <h5 className="text-[10px] font-black uppercase tracking-wider text-indigo-600">Лечение — първа линия · First-line</h5>
          <Bullets items={condition.management.primary} />
        </Card>
        <Card className="p-5 bg-white border-2 border-slate-100 rounded-2xl space-y-3">
          <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-500">Лечение — допълнително · Additional</h5>
          <Bullets items={condition.management.secondary} />
        </Card>
      </div>

      {treatmentRationale[condition.id] && treatmentRationale[condition.id].length > 0 && (
        <Card className="p-5 bg-indigo-50/40 border-2 border-indigo-100 rounded-2xl space-y-3">
          <h5 className="text-[10px] font-black uppercase tracking-wider text-indigo-600">Механистична обосновка на лечението · Treatment rationale</h5>
          <Bullets items={treatmentRationale[condition.id]} />
        </Card>
      )}
    </div>
  );
}

/** Per-point active-recall quiz, scoped to the point's linked content. */
function SelfTest({ topic }: { topic: ExamTopic }) {
  const { society } = useSociety();
  const questions = useMemo(() => questionsForTopic(topic, society), [topic, society]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  if (questions.length === 0) return null;

  const answered = Object.keys(answers).length;
  const correct = questions.filter((q) => answers[q.id] === q.answerId).length;
  const allAnswered = answered === questions.length;

  return (
    <section data-toc="selftest">
      <Heading bg="Провери се" en="Self-test" icon={<FlaskConical className="w-5 h-5" />} color="text-fuchsia-500" />
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap px-1">
          <span className="text-[11px] font-black text-slate-600">
            Резултат: <span className={cn('px-2 py-0.5 rounded-lg', allAnswered ? (correct === questions.length ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700') : 'bg-slate-100 text-slate-600')}>{correct}/{questions.length}</span>
          </span>
          <button onClick={() => setAnswers({})} className="text-[9px] font-black uppercase tracking-wider text-slate-400 hover:text-medical-accent">Нулирай</button>
          <button onClick={() => navigate({ name: 'study' })} className="ml-auto text-[9px] font-black uppercase tracking-wider text-medical-accent hover:underline">Към Study →</button>
        </div>
        {questions.map((q, i) => {
          const chosen = answers[q.id];
          return (
            <Card key={q.id} className="p-4 bg-white border-2 border-slate-100 rounded-2xl space-y-3">
              <p className="text-[12px] font-bold text-slate-800 leading-snug whitespace-pre-line">{i + 1}. {q.prompt}</p>
              <div className="space-y-1.5">
                {q.options.map((o) => {
                  const isCorrect = o.id === q.answerId;
                  const isChosen = chosen === o.id;
                  const tone = !chosen
                    ? 'border-slate-100 hover:border-medical-accent/40 text-slate-700'
                    : isCorrect
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                      : isChosen
                        ? 'border-rose-300 bg-rose-50 text-rose-800'
                        : 'border-slate-100 text-slate-400';
                  return (
                    <button
                      key={o.id}
                      disabled={Boolean(chosen)}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}
                      className={cn('w-full text-left px-3 py-2 rounded-xl border-2 text-[11px] font-bold transition-colors', tone)}
                    >
                      {o.text}
                    </button>
                  );
                })}
              </div>
              {chosen && (
                <p className="text-[11px] font-semibold text-slate-500 leading-snug border-t border-slate-100 pt-2">{q.rationale}</p>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}

interface NoteProps {
  topic: ExamTopic;
  progress: ExamProgressMap;
  onToggleStudied: (id: string) => void;
  onConfidence: (id: string, value: number) => void;
  onSelect: (id: string) => void;
  onPrev?: () => void;
  onNext?: () => void;
}

function ExamNote({ topic, progress, onToggleStudied, onConfidence, onSelect, onPrev, onNext }: NoteProps) {
  const { society } = useSociety();
  const rootRef = useRef<HTMLDivElement>(null);
  const linkedConditions = topic.links.conditionIds.map((id) => conditionById.get(id)).filter((c): c is Condition => Boolean(c));
  const guidelines = topic.links.guidelineIds.map((id) => getGuideline(id)).filter((g): g is NonNullable<typeof g> => Boolean(g));
  const instruments = topic.links.instrumentIds.map((id) => getInstrument(id)).filter((i): i is NonNullable<typeof i> => Boolean(i));
  const figures = topic.links.figureIds.map((id) => getFigure(id)).filter((f): f is NonNullable<typeof f> => Boolean(f));
  const medications = topic.links.medicationIds.map((id) => medicationsMap.get(id)).filter((m): m is NonNullable<typeof m> => Boolean(m));

  const pick = (r: { escClass?: string; accClass?: string }) => (society === 'AHA/ACC' ? r.accClass : r.escClass ?? r.accClass);
  const allRecommendations = guidelines.flatMap((g) =>
    g.recommendations.filter(pick).map((r) => ({ guideline: g, recommendation: r })),
  );
  const focus = topic.focus ?? [];
  const isKey = (text: string) => focus.some((k) => text.toLowerCase().includes(k.toLowerCase()));
  const keyRecommendations = focus.length > 0 ? allRecommendations.filter((x) => isKey(x.recommendation.text)) : allRecommendations;
  const otherRecommendations = focus.length > 0 ? allRecommendations.filter((x) => !isKey(x.recommendation.text)) : [];

  const redFlags = [...new Set(linkedConditions.flatMap((c) => c.redFlags))];
  const differentials = [...new Set(linkedConditions.flatMap((c) => c.differentialDiagnosis ?? []))];
  const pearls = linkedConditions.flatMap((c) => c.pearls);
  const sources = [...new Set(linkedConditions.map((c) => c.source).filter(Boolean))] as string[];
  const authored = topic.authoredSections ?? [];
  const reqStatuses = requirementStatuses(topic);
  const comp = [...new Set(linkedConditions.flatMap((c) => complications[c.id] ?? []))];
  const epi = [...new Set(linkedConditions.map((c) => epiPrognosis[c.id]?.epidemiology).filter(Boolean))] as string[];
  const progn = [...new Set(linkedConditions.map((c) => epiPrognosis[c.id]?.prognosis).filter(Boolean))] as string[];
  const numbers = linkedConditions.flatMap((c) => keyNumbers[c.id] ?? []);
  const traps = linkedConditions.flatMap((c) => pitfalls[c.id] ?? []);
  const related = relatedTopics(topic);
  const viva = vivaQuestions(topic);

  const hasAnything = linkedConditions.length > 0 || guidelines.length > 0 || instruments.length > 0 || figures.length > 0 || medications.length > 0 || authored.length > 0;

  const studied = progress[topic.id]?.studied;
  const confidence = progress[topic.id]?.confidence ?? 0;

  const jump = (key: string) =>
    rootRef.current?.querySelector(`[data-toc="${key}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const TOC_BY_REQ: Record<string, string> = {
    definition: 'core', etiology: 'core', pathogenesis: 'core', clinic: 'core', diagnosis: 'core',
    ddx: 'core', classification: 'core', hemodynamics: 'core', complications: 'complications',
    treatment: 'meds', pharmacology: 'meds', prevention: 'recs', outcomes: 'recs', indications: 'recs',
    risks: 'recs', technique: 'calc', forms: 'answer', epidemiology: 'epi', principles: 'answer', scope: 'answer',
  };
  const tocKeyFor = (k: string) => TOC_BY_REQ[k] ?? 'core';

  const toc = [
    { key: 'orientation', label: 'Ориентация' },
    reqStatuses.length > 0 && { key: 'plan', label: 'План' },
    authored.length > 0 && { key: 'answer', label: 'Изпитен отговор' },
    linkedConditions.length > 0 && { key: 'core', label: 'Основи' },
    (epi.length > 0 || progn.length > 0) && { key: 'epi', label: 'Епидемиология' },
    numbers.length > 0 && { key: 'numbers', label: 'Числа' },
    keyRecommendations.length > 0 && { key: 'recs', label: 'Препоръки' },
    medications.length > 0 && { key: 'meds', label: 'Лекарства' },
    instruments.length > 0 && { key: 'calc', label: 'Калкулатори' },
    figures.length > 0 && { key: 'figs', label: 'Фигури' },
    comp.length > 0 && { key: 'complications', label: 'Усложнения' },
    redFlags.length > 0 && { key: 'red', label: 'Червени флагове' },
    traps.length > 0 && { key: 'traps', label: 'Капани' },
    { key: 'selftest', label: 'Провери се' },
    related.length > 0 && { key: 'related', label: 'Свързани' },
    sources.length > 0 && { key: 'sources', label: 'Източници' },
  ].filter((x): x is { key: string; label: string } => Boolean(x));

  return (
    <div ref={rootRef} className="flex flex-col h-full w-full bg-medical-surface">
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 px-5 md:px-8 pt-4 pb-5 space-y-3 shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="primary" className="text-[8px] font-black">{topic.code}</Badge>
              {topic.highYield && (
                <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-100 rounded px-1.5 py-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" /> Висока доходност
                </span>
              )}
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Български специализиран изпит</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 italic uppercase tracking-tighter leading-tight">{topic.title}</h2>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {onPrev && <button onClick={onPrev} aria-label="Предишен" className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 active:scale-95"><ChevronLeft className="w-4 h-4" /></button>}
            {onNext && <button onClick={onNext} aria-label="Следващ" className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 active:scale-95"><ChevronRight className="w-4 h-4" /></button>}
            <PrintButton className="hidden sm:inline-flex" />
          </div>
        </div>

        {/* progress controls */}
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() => onToggleStudied(topic.id)}
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 text-[10px] font-black uppercase tracking-wider transition-colors',
              studied ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-medical-accent/40',
            )}
          >
            {studied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
            {studied ? 'Изучено' : 'Маркирай изучено'}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Увереност</span>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => onConfidence(topic.id, n)}
                aria-label={`Увереност ${n}`}
                className={cn('w-6 h-6 rounded-lg border-2 text-[10px] font-black transition-colors', confidence >= n ? 'border-medical-accent bg-medical-accent/10 text-medical-accent' : 'border-slate-200 text-slate-300')}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* in-note table of contents */}
        <div className="hidden md:flex flex-wrap gap-1.5">
          {toc.map((t) => (
            <button key={t.key} onClick={() => jump(t.key)} className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[9px] font-black uppercase tracking-wider text-slate-500 hover:border-medical-accent/40 hover:text-medical-accent">
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8 no-scrollbar">
        <section data-toc="orientation">
          <Heading bg="Ориентация" en="Orientation" icon={<Info className="w-5 h-5" />} />
          <Card className="p-5 bg-white border-2 border-slate-100 rounded-2xl">
            <p className="prose-clinical">{topic.orientation}</p>
          </Card>
        </section>

        {reqStatuses.length > 0 && (
          <section data-toc="plan">
            <Heading bg="План на изпитния отговор" en="Answer outline" icon={<ListChecks className="w-5 h-5" />} color="text-slate-500" />
            <Card className="p-5 bg-white border-2 border-slate-100 rounded-2xl">
              <ol className="space-y-2">
                {reqStatuses.map((r, i) => (
                  <li key={r.key} className="flex items-center gap-3">
                    <span className={cn('w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0', r.status === 'covered' ? 'bg-emerald-100 text-emerald-700' : r.status === 'partial' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700')}>{i + 1}</span>
                    <button onClick={() => jump(tocKeyFor(r.key))} className="text-[13px] font-bold text-slate-700 hover:text-medical-accent text-left flex-1">{r.labelBg}</button>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">{r.status}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </section>
        )}

        {authored.length > 0 && (
          <section data-toc="answer">
            <Heading bg="Структура на изпитния отговор" en="Exam answer" icon={<BookOpen className="w-5 h-5" />} color="text-indigo-500" />
            <div className="space-y-4">
              {authored.map((s) => (
                <Card key={s.key} className="p-5 bg-white border-2 border-slate-100 rounded-2xl space-y-2">
                  <h5 className="text-[10px] font-black uppercase tracking-wider text-indigo-500">{requirementLabelBg(s.key)}</h5>
                  <p className="prose-clinical whitespace-pre-line">{s.body}</p>
                </Card>
              ))}
            </div>
          </section>
        )}

        {!hasAnything && (
          <Card className="p-8 bg-white border-2 border-dashed border-slate-200 rounded-2xl text-center">
            <p className="prose-clinical mx-auto">Няма свързано съдържание за този топик.</p>
          </Card>
        )}

        {linkedConditions.length > 0 && (
          <section data-toc="core">
            <Heading bg={topic.coverage === 'authored' ? 'Свързано клинично съдържание' : 'Основни познания, диагностика и лечение'} en="Core knowledge" icon={<Stethoscope className="w-5 h-5" />} />
            <div className="space-y-8">
              {linkedConditions.map((c) => <ConditionBlock key={c.id} condition={c} />)}
            </div>
          </section>
        )}

        {(epi.length > 0 || progn.length > 0) && (
          <section data-toc="epi">
            <Heading bg="Епидемиология и прогноза" en="Epidemiology & prognosis" icon={<Activity className="w-5 h-5" />} color="text-sky-500" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {epi.length > 0 && (
                <Card className="p-5 bg-white border-2 border-slate-100 rounded-2xl space-y-3">
                  <h5 className="text-[10px] font-black uppercase tracking-wider text-sky-500">Епидемиология</h5>
                  <Bullets items={epi} />
                </Card>
              )}
              {progn.length > 0 && (
                <Card className="p-5 bg-white border-2 border-slate-100 rounded-2xl space-y-3">
                  <h5 className="text-[10px] font-black uppercase tracking-wider text-sky-500">Прогноза</h5>
                  <Bullets items={progn} />
                </Card>
              )}
            </div>
          </section>
        )}

        {numbers.length > 0 && (
          <section data-toc="numbers">
            <Heading bg="Ключови числа" en="Key numbers" icon={<Calculator className="w-5 h-5" />} color="text-amber-500" />
            <Card className="p-5 bg-white border-2 border-slate-100 rounded-2xl">
              <ul className="space-y-2">
                {numbers.map((n, i) => (
                  <li key={i} className="flex flex-wrap items-baseline gap-x-2 text-[13px]">
                    <span className="font-black text-slate-900">{n.label}:</span>
                    <span className="font-bold text-slate-700">{n.value}</span>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">{n.source}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        )}

        {(keyRecommendations.length > 0 || otherRecommendations.length > 0) && (
          <section data-toc="recs">
            <Heading bg="Препоръки с клас на препоръка" en="Graded recommendations" icon={<BookOpen className="w-5 h-5" />} color="text-indigo-500" />
            {keyRecommendations.length > 0 && (
              <div className="space-y-3">
                {keyRecommendations.map(({ guideline, recommendation }) => (
                  <RecommendationCard key={`${guideline.id}-${recommendation.id}`} recommendation={recommendation} guideline={guideline} society={society} />
                ))}
              </div>
            )}
            {otherRecommendations.length > 0 && (
              <details className="mt-4">
                <summary className="cursor-pointer text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-medical-accent">
                  Още {otherRecommendations.length} препоръки от насоката · show all
                </summary>
                <div className="space-y-3 mt-3">
                  {otherRecommendations.map(({ guideline, recommendation }) => (
                    <RecommendationCard key={`${guideline.id}-${recommendation.id}`} recommendation={recommendation} guideline={guideline} society={society} />
                  ))}
                </div>
              </details>
            )}
          </section>
        )}

        {guidelines.length > 0 && (
          <section data-toc="compare">
            <Heading bg="Сравнение ESC ↔ AHA/ACC" en="Society comparison" icon={<BookOpen className="w-5 h-5" />} color="text-indigo-500" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {['ESC', 'AHA/ACC'].map((soc) => {
                const gs = guidelines.filter((g) => g.society.join('/').includes(soc));
                if (gs.length === 0) return null;
                const rows = gs.flatMap((g) => g.recommendations.slice(0, 5).map((r) => ({ g, r })));
                return (
                  <Card key={soc} className="p-5 bg-white border-2 border-slate-100 rounded-2xl space-y-3">
                    <h5 className="text-[10px] font-black uppercase tracking-wider text-indigo-600">{soc}</h5>
                    <ul className="space-y-2">
                      {rows.map(({ g, r }, i) => {
                        const cls = soc === 'ESC' ? r.escClass : r.accClass;
                        return (
                          <li key={i} className="text-[11px] font-semibold text-slate-600 leading-snug">
                            <span className="font-black text-medical-accent mr-1">Class {cls ?? '—'}</span>
                            {r.text}
                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 ml-1">({g.edition})</span>
                          </li>
                        );
                      })}
                    </ul>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {medications.length > 0 && (
          <section data-toc="meds">
            <Heading bg="Лекарства" en="Medications" icon={<Pill className="w-5 h-5" />} color="text-emerald-500" />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              {medications.map((med) => (
                <Card key={med.id} className="p-4 bg-white border-2 border-slate-100 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-black text-slate-900 italic tracking-tight">{med.name}</span>
                    <Badge variant="primary" className="text-[8px] font-black shrink-0">{med.category}</Badge>
                  </div>
                  <p className="text-[11px] font-bold text-slate-500 leading-snug">{med.adultDose}</p>
                  {med.classOfRec && <p className="text-[9px] font-black uppercase tracking-wider text-emerald-600">{med.classOfRec}</p>}
                  <button onClick={() => navigate({ name: 'pharma', id: med.id })} className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-medical-accent hover:underline">Отвори в Drugs <ExternalLink className="w-3 h-3" /></button>
                </Card>
              ))}
            </div>
          </section>
        )}

        {instruments.length > 0 && (
          <section data-toc="calc">
            <Heading bg="Калкулатори" en="Calculators" icon={<Calculator className="w-5 h-5" />} color="text-sky-500" />
            <div className="space-y-6">
              {instruments.map((instrument) => (
                <Card key={instrument.id} className="p-5 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
                  <InstrumentPanel instrument={instrument} />
                </Card>
              ))}
            </div>
          </section>
        )}

        {figures.length > 0 && (
          <section data-toc="figs">
            <Heading bg="Фигури" en="Figures" icon={<ImageIcon className="w-5 h-5" />} color="text-sky-500" />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {figures.map((figure) => <FigureCard key={figure.id} figure={figure} />)}
            </div>
          </section>
        )}

        {comp.length > 0 && (
          <section data-toc="complications">
            <Heading bg="Усложнения" en="Complications" icon={<AlertTriangle className="w-5 h-5" />} color="text-rose-500" />
            <Card className="p-5 bg-white border-2 border-slate-100 rounded-2xl"><Bullets items={comp} /></Card>
          </section>
        )}

        {redFlags.length > 0 && (
          <section data-toc="red">
            <Heading bg="Червени флагове" en="Red flags" icon={<AlertTriangle className="w-5 h-5" />} color="text-rose-500" />
            <Card className="p-5 bg-rose-50 border-2 border-rose-100 rounded-2xl"><Bullets items={redFlags} /></Card>
          </section>
        )}

        {differentials.length > 0 && (
          <section data-toc="ddx">
            <Heading bg="Диференциална диагноза" en="Differentials" icon={<ArrowRightCircle className="w-5 h-5" />} color="text-amber-500" />
            <div className="flex flex-wrap gap-2">
              {differentials.map((d) => (
                <span key={d} className="px-3 py-1.5 bg-white border border-slate-100 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-wider">{d}</span>
              ))}
            </div>
          </section>
        )}

        {traps.length > 0 && (
          <section data-toc="traps">
            <Heading bg="Капани на изпита" en="Exam traps" icon={<AlertTriangle className="w-5 h-5" />} color="text-amber-600" />
            <Card className="p-5 bg-amber-50 border-2 border-amber-100 rounded-2xl"><Bullets items={traps} /></Card>
          </section>
        )}

        {related.length > 0 && (
          <section data-toc="related">
            <Heading bg="Свързани теми" en="Related points" icon={<ArrowRightCircle className="w-5 h-5" />} color="text-slate-500" />
            <div className="flex flex-wrap gap-2">
              {related.map((t) => (
                <button key={t.id} onClick={() => onSelect(t.id)} className="px-3 py-1.5 bg-white border border-slate-100 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-wider hover:border-medical-accent/40 hover:text-medical-accent">
                  {t.code}. {t.title}
                </button>
              ))}
            </div>
          </section>
        )}

        {pearls.length > 0 && (
          <section data-toc="pearls">
            <Heading bg="Клинични съвети" en="Clinical pearls" icon={<Activity className="w-5 h-5" />} color="text-teal-500" />
            <Card className="p-5 bg-teal-50 border-2 border-teal-100 rounded-2xl space-y-3">
              {pearls.map((p, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="w-1.5 h-5 bg-teal-400 rounded-full shrink-0" />
                  <p className="prose-clinical text-teal-900">{p}</p>
                </div>
              ))}
            </Card>
          </section>
        )}

        <SelfTest topic={topic} />

        {viva.length > 0 && (
          <section data-toc="viva">
            <Heading bg="Отворени въпроси (viva)" en="Viva practice" icon={<FlaskConical className="w-5 h-5" />} color="text-fuchsia-500" />
            <div className="space-y-3">
              {viva.map((v, i) => (
                <Card key={i} className="p-4 bg-white border-2 border-slate-100 rounded-2xl">
                  <p className="text-[12px] font-black text-slate-800 leading-snug">{i + 1}. {v.question}</p>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-[10px] font-black uppercase tracking-wider text-medical-accent hover:underline">Покажи отговора</summary>
                    <p className="prose-clinical mt-2">{v.answer}</p>
                  </details>
                </Card>
              ))}
            </div>
          </section>
        )}

        {(sources.length > 0 || guidelines.some((g) => g.url)) && (
          <section data-toc="sources">
            <Heading bg="Източници" en="Sources" icon={<Info className="w-5 h-5" />} color="text-slate-400" />
            <div className="flex flex-wrap gap-2">
              {sources.map((s) => (
                <span key={s} className="px-2.5 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-wider">{s}</span>
              ))}
              {guidelines.filter((g) => g.url).map((g) => (
                <a key={g.id} href={g.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-black text-medical-accent uppercase tracking-wider hover:underline">
                  {g.edition} {g.society.join('/')} <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default function ExamView({ selectedId, onSelect, onClose }: ExamViewProps) {
  const selected = useMemo(() => getExamTopic(selectedId ?? ''), [selectedId]);
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState<ExamProgressMap>(() => loadExamProgress());

  const update = useCallback((fn: (prev: ExamProgressMap) => ExamProgressMap) => {
    setProgress((prev) => {
      const next = fn(prev);
      saveExamProgress(next);
      return next;
    });
  }, []);

  const toggleStudied = useCallback((id: string) => update((p) => withStudied(p, id, !p[id]?.studied)), [update]);
  const setConfidence = useCallback((id: string, value: number) => update((p) => withConfidence(p, id, p[id]?.confidence === value ? 0 : value)), [update]);

  useEffect(() => {
    if (selectedId) update((p) => withOpened(p, selectedId, Date.now()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const index = examTopics.findIndex((t) => t.id === selectedId);
  const prev = index > 0 ? examTopics[index - 1] : undefined;
  const next = index >= 0 && index < examTopics.length - 1 ? examTopics[index + 1] : undefined;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowRight' && next) onSelect(next.id);
      if (e.key === 'ArrowLeft' && prev) onSelect(prev.id);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev, onSelect]);

  const studiedCount = examTopics.filter((t) => progress[t.id]?.studied).length;
  const pct = Math.round((studiedCount / examTopics.length) * 100);

  const q = query.trim().toLowerCase();
  const filteredSections = examSections
    .map((s) => ({
      ...s,
      topics: q ? s.topics.filter((t) => `${t.code} ${t.title}`.toLowerCase().includes(q)) : s.topics,
    }))
    .filter((s) => s.topics.length > 0);

  const lastOpened = examTopics
    .map((t) => ({ id: t.id, at: progress[t.id]?.lastOpened ?? 0 }))
    .sort((a, b) => b.at - a.at)[0];

  const noteProps = {
    progress,
    onToggleStudied: toggleStudied,
    onConfidence: setConfidence,
    onSelect,
    onPrev: prev ? () => onSelect(prev.id) : undefined,
    onNext: next ? () => onSelect(next.id) : undefined,
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      <PageHeader
        title="Български специализиран изпит"
        subtitle="Bulgarian specialist exam — study notes by syllabus point"
        badge="Exam"
      >
        <SocietyToggle />
      </PageHeader>

      {/* progress overview */}
      <Card className="p-4 bg-white border-2 border-slate-100 rounded-2xl flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Прогрес</span>
          <span className="text-sm font-black text-medical-accent">{studiedCount}/{examTopics.length}</span>
          <div className="w-40 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-medical-accent transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[10px] font-black text-slate-400">{pct}%</span>
        </div>
        {lastOpened && lastOpened.at > 0 && (
          <button onClick={() => onSelect(lastOpened.id)} className="ml-auto text-[10px] font-black uppercase tracking-wider text-medical-accent hover:underline">
            Продължи: {getExamTopic(lastOpened.id)?.code} →
          </button>
        )}
      </Card>

      <div className="lg:grid lg:grid-cols-[minmax(300px,380px)_minmax(0,1fr)] lg:gap-8 lg:items-start">
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Търси топик…"
              className="w-full pl-10 pr-3 py-2.5 rounded-2xl border-2 border-slate-100 bg-white text-[12px] font-bold text-slate-700 placeholder:text-slate-400 focus:border-medical-accent/40 outline-none"
            />
          </div>

          {filteredSections.map((section) => {
            const total = section.topics.length;
            const done = section.topics.filter((t) => progress[t.id]?.studied).length;
            const isCollapsed = collapsed[section.id];
            return (
              <div key={section.id} className="space-y-2">
                <button
                  onClick={() => setCollapsed((c) => ({ ...c, [section.id]: !c[section.id] }))}
                  className="w-full flex items-center gap-2 px-1 text-left group"
                >
                  <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 transition-transform', isCollapsed && '-rotate-90')} />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 group-hover:text-slate-600 flex-1">{section.title}</h3>
                  <span className={cn('text-[9px] font-black', done === total ? 'text-emerald-500' : 'text-slate-300')}>{done}/{total}</span>
                </button>
                {!isCollapsed &&
                  section.topics.map((topic) => (
                    <Card
                      key={topic.id}
                      onClick={() => onSelect(topic.id)}
                      className={cn(
                        'p-4 bg-white border-2 rounded-2xl cursor-pointer transition-all active:scale-[0.99] flex items-start gap-3',
                        selectedId === topic.id ? 'border-medical-accent bg-slate-50 shadow-sm' : 'border-slate-100 hover:border-medical-accent/40',
                      )}
                    >
                      <span className="text-[10px] font-black text-medical-accent uppercase tracking-wider shrink-0 mt-0.5">{topic.code}</span>
                      <span className="text-[12px] font-black text-slate-800 uppercase tracking-tight leading-tight flex-1">{topic.title}</span>
                      {topic.highYield && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-300 shrink-0 mt-0.5" />}
                      {progress[topic.id]?.studied && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                    </Card>
                  ))}
              </div>
            );
          })}
          {filteredSections.length === 0 && (
            <p className="px-1 text-[11px] font-bold text-slate-400">Няма намерен топик.</p>
          )}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-6">
            <Card className="flex flex-col h-[calc(100vh-9rem)] overflow-hidden border-2 border-slate-100 rounded-2xl bg-medical-surface shadow-sm">
              {selected ? (
                <ExamNote key={selected.id} topic={selected} {...noteProps} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 gap-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                    <ScrollText className="w-8 h-8 text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900 uppercase tracking-tight italic">Изберете топик</h3>
                    <p className="prose-clinical mx-auto text-center">Select a syllabus point to view its study note. Use ← / → to move between points.</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {selected && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-medical-surface w-full h-[92dvh] rounded-t-[2rem] shadow-sm overflow-hidden flex flex-col pb-[env(safe-area-inset-bottom,0px)]">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 mb-1 shrink-0" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 active:scale-95 z-10"
              aria-label="Close"
            >
              <span className="text-xl leading-none">×</span>
            </button>
            <ExamNote key={selected.id} topic={selected} {...noteProps} />
          </div>
        </div>
      )}
    </div>
  );
}
