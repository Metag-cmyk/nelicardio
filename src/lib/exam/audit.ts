import { conditions, type Condition } from '../../data/conditions';
import { guidelinesMap } from '../../data/guidelines';
import { medicationsMap } from '../../data/medications';
import { instrumentsMap } from '../../lib/instruments';
import { figures } from '../../data/figures';
import { complications } from '../../data/complications';
import { examSections, examTopics, type ExamRequirement, type ExamTopic, type RequirementKey } from '../../data/exam';

const conditionById = new Map(conditions.map((c) => [c.id, c]));

export type RequirementStatus = 'covered' | 'partial' | 'missing';
export type TopicVerdict = 'ok' | 'partial' | 'needs-authoring' | 'needs-slicing';

export interface RequirementResult {
  key: RequirementKey;
  labelBg: string;
  satisfiedBy: ExamRequirement['satisfiedBy'];
  status: RequirementStatus;
  evidence: string[];
}

export interface TopicAudit {
  id: string;
  code: string;
  title: string;
  section: string;
  kind: string;
  coverage: string;
  verdict: TopicVerdict;
  readiness: number;
  requirements: RequirementResult[];
  flags: string[];
}

/** Which condition field satisfies each requirement key (approximate for some). */
const FIELD_BY_KEY: Partial<Record<RequirementKey, keyof Condition>> = {
  definition: 'summary',
  etiology: 'etiology',
  pathogenesis: 'pathophysiology',
  clinic: 'symptoms',
  diagnosis: 'diagnosticCriteria',
  ddx: 'differentialDiagnosis',
  treatment: 'management',
  classification: 'classifications',
  complications: 'redFlags',
  hemodynamics: 'pathophysiology',
  forms: 'classifications',
};

/** Requirements whose condition field only approximates the exam answer. */
const APPROXIMATE: ReadonlySet<RequirementKey> = new Set();

function hasField(c: Condition, field: keyof Condition): boolean {
  if (field === 'management') return Boolean(c.management.primary.length || c.management.secondary.length);
  const value = c[field];
  return Array.isArray(value) ? value.length > 0 : Boolean(value);
}

function evaluate(topic: ExamTopic, req: ExamRequirement): RequirementResult {
  const evidence: string[] = [];
  let status: RequirementStatus = 'missing';

  // Authored content satisfies its requirement regardless of the expected source.
  if (topic.authoredSections?.some((s) => s.key === req.key)) {
    return { key: req.key, labelBg: req.labelBg, satisfiedBy: req.satisfiedBy, status: 'covered', evidence: ['authored note'] };
  }

  // Complications come from the dedicated map (a real field now exists).
  if (req.key === 'complications') {
    const items = topic.links.conditionIds.flatMap((id) => complications[id] ?? []);
    if (items.length > 0) {
      return { key: req.key, labelBg: req.labelBg, satisfiedBy: req.satisfiedBy, status: 'covered', evidence: [`${items.length} item(s)`] };
    }
  }

  if (req.satisfiedBy === 'authored') {
    if (topic.authoredSections?.some((s) => s.key === req.key)) {
      status = 'covered';
      evidence.push('authored note');
    }
  } else if (req.satisfiedBy === 'condition-field') {
    const field = FIELD_BY_KEY[req.key];
    const hits = topic.links.conditionIds
      .map((id) => conditionById.get(id))
      .filter((c): c is Condition => Boolean(c))
      .filter((c) => (field ? hasField(c, field) : false));
    if (hits.length > 0) {
      status = APPROXIMATE.has(req.key) ? 'partial' : 'covered';
      evidence.push(...hits.map((c) => c.name));
    }
  } else if (req.satisfiedBy === 'guideline-rec') {
    const recs = topic.links.guidelineIds
      .flatMap((id) => guidelinesMap.get(id)?.recommendations ?? [])
      .filter((r) => (r.escClass || r.accClass) && req.keywords.some((k) => r.text.toLowerCase().includes(k.toLowerCase())));
    if (recs.length > 0) {
      status = 'covered';
      evidence.push(`${recs.length} rec(s)`);
    }
  } else if (req.satisfiedBy === 'drug') {
    const drugs = topic.links.medicationIds.map((id) => medicationsMap.get(id)).filter(Boolean);
    if (drugs.length > 0) {
      status = 'covered';
      evidence.push(`${drugs.length} drug(s)`);
    }
  } else if (req.satisfiedBy === 'instrument') {
    const tools = topic.links.instrumentIds.map((id) => instrumentsMap.get(id)).filter(Boolean);
    if (tools.length > 0) {
      status = 'covered';
      evidence.push(`${tools.length} tool(s)`);
    }
  } else if (req.satisfiedBy === 'figure') {
    const figs = topic.links.figureIds.map((id) => figures.find((f) => f.id === id)).filter(Boolean);
    if (figs.length > 0) {
      status = 'covered';
      evidence.push(`${figs.length} figure(s)`);
    }
  }

  return { key: req.key, labelBg: req.labelBg, satisfiedBy: req.satisfiedBy, status, evidence };
}

function conditionKey(topic: ExamTopic): string {
  return [...topic.links.conditionIds].sort().join(',');
}

export function auditTopic(topic: ExamTopic, sectionTitle: string, duplicateKeys: ReadonlySet<string>): TopicAudit {  const requirements = topic.requirements ?? [];
  const results = requirements.map((r) => evaluate(topic, r));
  const covered = results.filter((r) => r.status === 'covered').length;
  const partial = results.filter((r) => r.status === 'partial').length;
  const readiness = requirements.length > 0 ? Math.round(((covered + partial * 0.5) / requirements.length) * 100) : 0;

  const key = conditionKey(topic);
  const differentiated = (topic.authoredSections?.length ?? 0) > 0;
  const duplicate = key.length > 0 && duplicateKeys.has(key) && !differentiated;

  const flags: string[] = [];
  if (topic.coverage === 'authored' && !differentiated) flags.push('изисква авторска изпитна бележка');
  if (duplicate) flags.push('споделя източник със sibling тема (нужно е разграничаване)');
  const missingReqs = results.filter((r) => r.status === 'missing').map((r) => r.labelBg);
  if (missingReqs.length > 0) flags.push(`липсват: ${missingReqs.join(', ')}`);

  let verdict: TopicVerdict;
  if (requirements.length > 0 && covered + partial === requirements.length) {
    verdict = topic.coverage === 'authored' && covered < requirements.length ? 'needs-authoring' : duplicate ? 'needs-slicing' : 'ok';
  } else if (covered + partial === 0) {
    verdict = 'needs-authoring';
  } else {
    verdict = 'partial';
  }
  // An authored-coverage point with no authored content is never "ok".
  if (topic.coverage === 'authored' && !(topic.authoredSections?.length)) verdict = 'needs-authoring';

  return {
    id: topic.id,
    code: topic.code,
    title: topic.title,
    section: sectionTitle,
    kind: topic.kind ?? 'disease',
    coverage: topic.coverage ?? 'condition',
    verdict,
    readiness,
    requirements: results,
    flags,
  };
}

export interface AuditSummary {
  total: number;
  byVerdict: Record<TopicVerdict, number>;
  averageReadiness: number;
  needsWork: number;
}

export function auditAll(): { topics: TopicAudit[]; summary: AuditSummary } {
  const counts = new Map<string, number>();
  for (const t of examTopics) {
    const k = conditionKey(t);
    if (k) counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const duplicateKeys = new Set([...counts.entries()].filter(([, n]) => n > 1).map(([k]) => k));

  const topics: TopicAudit[] = [];
  for (const section of examSections) {
    for (const t of section.topics) topics.push(auditTopic(t, section.title, duplicateKeys));
  }

  const byVerdict: Record<TopicVerdict, number> = { ok: 0, partial: 0, 'needs-authoring': 0, 'needs-slicing': 0 };
  for (const t of topics) byVerdict[t.verdict] += 1;
  const averageReadiness = Math.round(topics.reduce((s, t) => s + t.readiness, 0) / topics.length);

  return {
    topics,
    summary: {
      total: topics.length,
      byVerdict,
      averageReadiness,
      needsWork: topics.length - byVerdict.ok,
    },
  };
}

/** Per-requirement statuses for a single point (used by the note checklist). */
export function requirementStatuses(topic: ExamTopic): RequirementResult[] {
  return (topic.requirements ?? []).map((r) => evaluate(topic, r));
}
