import { BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  societyLabel,
  type Guideline,
  type Recommendation,
  type RecommendationClass,
  type Society,
} from '../../data/guidelines';
import type { SocietyView } from '../../context/SocietyContext';

/**
 * Class of Recommendation palette (fixed, so the eye learns it while studying).
 * Class I green · IIa lime · IIb amber · III red.
 */
const CLASS_STYLE: Record<RecommendationClass, string> = {
  'I': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
  'IIa': 'bg-lime-500/10 text-lime-600 border-lime-500/30',
  'IIb': 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  'III': 'bg-rose-500/10 text-rose-600 border-rose-500/30',
};

const PILL = 'inline-flex items-center rounded-md border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider';

export function ClassBadge({ cls, className }: { cls: RecommendationClass; className?: string }) {
  return <span className={cn(PILL, CLASS_STYLE[cls], className)}>Class {cls}</span>;
}

export function LoeBadge({ loe, className }: { loe: string; className?: string }) {
  return (
    <span className={cn(PILL, 'bg-slate-100 text-slate-600 border-slate-200', className)}>LOE {loe}</span>
  );
}

export function SocietyTag({ society, className }: { society: Society; className?: string }) {
  return (
    <span className={cn(PILL, 'bg-transparent text-slate-400 border-slate-200', className)}>
      {societyLabel[society]}
    </span>
  );
}

export function CitationChip({ guideline, section }: { guideline: Guideline; section?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-slate-400">
      <BookOpen className="w-3 h-3 shrink-0" />
      {guideline.society.map((s) => societyLabel[s]).join(' / ')} {guideline.edition}
      {section ? ` · §${section}` : ''}
    </span>
  );
}

/**
 * Renders the graded evidence for a single recommendation.
 *
 * The society toggle chooses between ESC and AHA/ACC when both are present; if
 * the selected society has no grade for this recommendation we fall back to the
 * available grade so a grade is never silently hidden (grades are never
 * fabricated, so an empty result means "not yet graded").
 */
export function RecommendationEvidence({
  recommendation,
  society,
}: {
  recommendation: Recommendation;
  society: SocietyView;
}) {
  const grades: { society: Society; cls: RecommendationClass; loe?: string }[] = [];
  if (recommendation.escClass) {
    grades.push({ society: 'ESC', cls: recommendation.escClass, loe: recommendation.escLoe });
  }
  if (recommendation.accClass) {
    grades.push({ society: 'AHA/ACC', cls: recommendation.accClass, loe: recommendation.accLoe });
  }

  let shown = grades;
  if (society !== 'both') {
    const preferred = grades.filter((g) => g.society === society);
    shown = preferred.length > 0 ? preferred : grades;
  }

  if (shown.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {shown.map((grade, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          <ClassBadge cls={grade.cls} />
          {grade.loe && <LoeBadge loe={grade.loe} />}
          <SocietyTag society={grade.society} />
        </span>
      ))}
    </div>
  );
}

export function RecommendationCard({
  recommendation,
  guideline,
  society,
}: {
  recommendation: Recommendation;
  guideline: Guideline;
  society: SocietyView;
}) {
  return (
    <div className="p-4 bg-white border border-slate-100 rounded-2xl space-y-2">
      <p className="prose-clinical">{recommendation.text}</p>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <RecommendationEvidence recommendation={recommendation} society={society} />
        <CitationChip guideline={guideline} section={recommendation.section} />
      </div>
    </div>
  );
}

export function PendingGradesNotice({ className }: { className?: string }) {
  return (
    <p className={cn('text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-relaxed', className)}>
      Class/LOE grades for this edition are pending verification against the primary source.
    </p>
  );
}
