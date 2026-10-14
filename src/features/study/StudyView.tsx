import { useMemo, useState } from 'react';
import { GraduationCap, Play, CheckCircle2, XCircle, Flame, Target, RotateCcw, Layers, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { PageHeader } from '../../components/layout/PageHeader';
import { SocietyToggle } from '../../components/ui/SocietyToggle';
import { FigureCard } from '../../components/clinical/Figure';
import { getFigure } from '../../data/figures';
import { TOPICS } from '../../data/blueprint';
import { useSociety } from '../../context/useSociety';
import { cn } from '../../lib/utils';
import { buildQuestionBank, QUESTION_TYPE_LABEL } from '../../lib/study/questions';
import {
  newCard, schedule, isDue, isMastered, masteryByTopic, intervalLabel,
  type CardState, type Grade,
} from '../../lib/study/scheduler';
import { loadStore, saveStore, dayKey, currentStreak, type StudyStore } from '../../lib/study/storage';

const GRADES: { id: Grade; label: string; className: string }[] = [
  { id: 'again', label: 'Again', className: 'bg-rose-500' },
  { id: 'hard', label: 'Hard', className: 'bg-amber-500' },
  { id: 'good', label: 'Good', className: 'bg-emerald-500' },
  { id: 'easy', label: 'Easy', className: 'bg-sky-500' },
];

/** Clock access kept out of the component body (react-hooks/purity). */
const nowMs = (): number => Date.now();

export default function StudyView() {
  const { society } = useSociety();
  const bank = useMemo(() => buildQuestionBank(society), [society]);
  const bankMap = useMemo(() => new Map(bank.map((q) => [q.id, q])), [bank]);

  const [store, setStore] = useState<StudyStore>(loadStore);
  const [now, setNow] = useState(() => nowMs());
  const [queue, setQueue] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const persist = (next: StudyStore) => {
    setStore(next);
    saveStore(next);
  };

  const cards = store.cards;
  const dueCount = useMemo(
    () => bank.filter((q) => { const c = cards[q.id]; return c && isDue(c, now); }).length,
    [bank, cards, now],
  );
  const newCount = useMemo(() => bank.filter((q) => !cards[q.id]).length, [bank, cards]);
  const masteredCount = useMemo(() => Object.values(cards).filter(isMastered).length, [cards]);
  const seenCount = Object.keys(cards).length;
  const streak = currentStreak(store.history, now);
  const reviewedToday = store.history[dayKey(now)] ?? 0;

  const mastery = useMemo(() => {
    const byTopic = new Map<string, CardState[]>();
    for (const [id, card] of Object.entries(cards)) {
      const q = bankMap.get(id);
      if (!q) continue;
      const arr = byTopic.get(q.topicId) ?? [];
      arr.push(card);
      byTopic.set(q.topicId, arr);
    }
    return masteryByTopic(TOPICS.map((t) => ({ id: t.id, title: t.title })), byTopic)
      .filter((m) => m.total > 0)
      .sort((a, b) => a.rate - b.rate);
  }, [cards, bankMap]);

  const start = (ids: string[]) => {
    if (ids.length === 0) return;
    setNow(nowMs());
    setQueue(ids);
    setIndex(0);
    setRevealed(false);
    setSelected(null);
  };

  const current = index < queue.length ? bankMap.get(queue[index]) : undefined;
  const inSession = queue.length > 0;

  const preview = (grade: Grade): string => {
    if (!current) return '';
    const card = cards[current.id] ?? newCard(current.id, now);
    return intervalLabel(schedule(card, grade, now));
  };

  const grade = (g: Grade) => {
    if (!current) return;
    const t = nowMs();
    const card = cards[current.id] ?? newCard(current.id, t);
    const updated = schedule(card, g, t);
    const today = dayKey(t);
    persist({
      cards: { ...cards, [current.id]: updated },
      history: { ...store.history, [today]: (store.history[today] ?? 0) + 1 },
    });
    setNow(t);
    setRevealed(false);
    setSelected(null);
    setIndex((i) => i + 1);
  };

  return (
    <div className="space-y-6 md:space-y-10 pb-20 max-w-6xl 2xl:max-w-7xl mx-auto">
      <PageHeader title="Study" subtitle="Active recall with spaced repetition" badge="Exam prep">
        <SocietyToggle />
      </PageHeader>

      {!inSession && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { label: 'Due now', value: dueCount, icon: Play, tone: 'text-rose-500' },
              { label: 'New', value: newCount, icon: Sparkles, tone: 'text-sky-500' },
              { label: 'Mastered', value: masteredCount, icon: Target, tone: 'text-emerald-500' },
              { label: 'Streak', value: `${streak}d`, icon: Flame, tone: 'text-amber-500' },
            ].map((s) => (
              <Card key={s.label} className="p-4 md:p-5 bg-white border-2 border-slate-100 rounded-2xl">
                <s.icon className={cn('w-4 h-4 mb-2', s.tone)} />
                <div className="text-3xl font-black italic tracking-tighter text-slate-900 tabular-num">{s.value}</div>
                <div className="text-[9px] font-black uppercase tracking-wider text-slate-400 mt-1">{s.label}</div>
              </Card>
            ))}
          </div>

          {/* Actions */}
          <Card className="p-5 md:p-6 bg-slate-900 text-white rounded-[2rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-52 h-52 bg-medical-accent/10 rounded-full -mr-24 -mt-24 blur-3xl" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-medical-accent flex items-center justify-center"><GraduationCap className="w-5 h-5 text-white" /></div>
                <div>
                  <h3 className="text-lg font-black uppercase italic tracking-tighter leading-none">Review session</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{bank.length} questions · {seenCount} seen · {reviewedToday} today</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => start(bank.filter((q) => { const c = cards[q.id]; return c && isDue(c, now); }).map((q) => q.id))}
                  disabled={dueCount === 0}
                  className={cn('inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95', dueCount === 0 ? 'bg-white/5 text-slate-500' : 'bg-medical-accent text-white shadow-lg shadow-medical-accent/30')}
                >
                  <Play className="w-4 h-4" /> Review due ({dueCount})
                </button>
                <button
                  onClick={() => start(bank.filter((q) => !cards[q.id]).slice(0, 10).map((q) => q.id))}
                  disabled={newCount === 0}
                  className={cn('inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95', newCount === 0 ? 'bg-white/5 text-slate-500' : 'bg-white text-slate-900')}
                >
                  <Sparkles className="w-4 h-4" /> New questions (10)
                </button>
              </div>
            </div>
          </Card>

          {/* Mastery */}
          <Card className="p-5 md:p-6 bg-white border-2 border-slate-100 rounded-[2rem]">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-medical-accent" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Weakest topics</h3>
            </div>
            {mastery.length === 0 ? (
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">No progress yet — start a review session.</p>
            ) : (
              <div className="space-y-3">
                {mastery.slice(0, 8).map((m) => {
                  const topic = TOPICS.find((t) => t.id === m.topicId);
                  return (
                    <div key={m.topicId} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-black uppercase tracking-tight text-slate-700">{topic?.title ?? m.topicId}</span>
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 shrink-0">{m.mastered}/{m.total} mastered</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-medical-accent rounded-full transition-all duration-700" style={{ width: `${Math.round(m.rate * 100)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Cram by topic */}
          <Card className="p-5 md:p-6 bg-white border-2 border-slate-100 rounded-[2rem]">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-medical-accent" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Cram a topic</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {TOPICS.filter((t) => bank.some((q) => q.topicId === t.id)).map((t) => (
                <button
                  key={t.id}
                  onClick={() => start(bank.filter((q) => q.topicId === t.id).slice(0, 15).map((q) => q.id))}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-600 hover:border-medical-accent/40 transition-all active:scale-95"
                >
                  {t.title}
                </button>
              ))}
            </div>
          </Card>
        </>
      )}

      {inSession && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => { setQueue([]); setIndex(0); }}
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-medical-accent transition-all"
            >
              <RotateCcw className="w-4 h-4" /> End session
            </button>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 tabular-num">
              {Math.min(index + 1, queue.length)} / {queue.length}
            </span>
          </div>

          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-medical-accent rounded-full transition-all duration-500" style={{ width: `${(index / queue.length) * 100}%` }} />
          </div>

          {!current ? (
            <Card className="p-10 bg-white border-2 border-slate-100 rounded-[2rem] text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900">Session complete</h3>
              <p className="prose-clinical mx-auto">Nice work — {queue.length} cards reviewed and rescheduled.</p>
              <button onClick={() => { setQueue([]); setIndex(0); }} className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-medical-accent text-white text-[10px] font-black uppercase tracking-widest active:scale-95">
                <Play className="w-4 h-4" /> Back to dashboard
              </button>
            </Card>
          ) : (
            <Card className="p-5 md:p-8 bg-white border-2 border-slate-100 rounded-[2rem] space-y-6">
              <div className="flex items-center gap-2">
                <Badge variant="primary" className="text-[8px] font-black">{QUESTION_TYPE_LABEL[current.type]}</Badge>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">{TOPICS.find((t) => t.id === current.topicId)?.title ?? current.topicId}</span>
              </div>

              <p className="text-base md:text-lg font-black text-slate-900 leading-relaxed whitespace-pre-line">{current.prompt}</p>

              {current.figureId && getFigure(current.figureId) && (
                <div className="max-w-md"><FigureCard figure={getFigure(current.figureId)!} /></div>
              )}

              <div className="grid grid-cols-1 gap-2">
                {current.options.map((o) => {
                  const isAnswer = o.id === current.answerId;
                  const isPicked = selected === o.id;
                  return (
                    <button
                      key={o.id}
                      onClick={() => { if (!revealed) { setSelected(o.id); setRevealed(true); } }}
                      disabled={revealed}
                      className={cn(
                        'p-4 rounded-2xl border-2 text-left text-[12px] font-black uppercase tracking-tight transition-all min-h-[52px]',
                        !revealed && 'border-slate-100 bg-white hover:border-medical-accent/40 active:scale-[0.99]',
                        revealed && isAnswer && 'border-emerald-500 bg-emerald-50 text-emerald-700',
                        revealed && isPicked && !isAnswer && 'border-rose-500 bg-rose-50 text-rose-700',
                        revealed && !isAnswer && !isPicked && 'border-slate-100 bg-slate-50 text-slate-400',
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {revealed && isAnswer && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                        {revealed && isPicked && !isAnswer && <XCircle className="w-4 h-4 shrink-0" />}
                        {o.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {revealed && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Rationale</p>
                    <p className="prose-clinical">{current.rationale}</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {GRADES.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => grade(g.id)}
                        className={cn('px-3 py-3 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest transition-all active:scale-95', g.className)}
                      >
                        {g.label}
                        <span className="block text-[8px] opacity-70 mt-0.5">next: {preview(g.id)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
