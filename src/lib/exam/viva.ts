import { conditions } from '../../data/conditions';
import { complications } from '../../data/complications';
import { requirementLabelBg, type ExamTopic, type RequirementKey } from '../../data/exam';

const conditionById = new Map(conditions.map((c) => [c.id, c]));

const VIVA_KEYS: RequirementKey[] = [
  'definition', 'epidemiology', 'etiology', 'pathogenesis', 'clinic',
  'diagnosis', 'ddx', 'classification', 'complications', 'treatment',
];

export interface VivaQuestion {
  question: string;
  answer: string;
}

function answerFor(topic: ExamTopic, key: RequirementKey): string | undefined {
  const authored = topic.authoredSections?.find((s) => s.key === key);
  if (authored) return authored.body;

  for (const id of topic.links.conditionIds) {
    const c = conditionById.get(id);
    if (!c) continue;
    switch (key) {
      case 'definition':
        if (c.summary) return c.summary;
        break;
      case 'etiology':
        if (c.etiology?.length) return c.etiology.join('; ');
        break;
      case 'pathogenesis':
        if (c.pathogenesis?.length) return c.pathogenesis.map((s) => s.text).join(' ');
        if (c.pathophysiology) return c.pathophysiology;
        break;
      case 'clinic': {
        const items = [...c.symptoms, ...(c.signs ?? [])];
        if (items.length) return items.join('; ');
        break;
      }
      case 'diagnosis':
        if (c.diagnosticCriteria?.length) return c.diagnosticCriteria.join('; ');
        break;
      case 'ddx':
        if (c.differentialDiagnosis?.length) return c.differentialDiagnosis.join(', ');
        break;
      case 'treatment':
        return [...c.management.primary, ...c.management.secondary].join('; ');
      case 'classification':
        if (c.classifications?.length) return c.classifications.map((x) => `${x.name}: ${x.interpretation ?? ''}`.trim()).join('; ');
        break;
      case 'complications': {
        const comp = complications[c.id];
        if (comp?.length) return comp.join('; ');
        break;
      }
    }
  }
  return undefined;
}

/** Title-oriented open (viva) questions with model answers, from real data. */
export function vivaQuestions(topic: ExamTopic, limit = 6): VivaQuestion[] {
  const wanted = (topic.requirements ?? []).map((r) => r.key).filter((k) => VIVA_KEYS.includes(k));
  const out: VivaQuestion[] = [];
  const seen = new Set<RequirementKey>();
  for (const key of wanted) {
    if (seen.has(key)) continue;
    seen.add(key);
    const answer = answerFor(topic, key);
    if (!answer) continue;
    out.push({ question: `${requireLabel(key)} — ${topic.title}`, answer });
    if (out.length >= limit) break;
  }
  return out;
}

function requireLabel(key: RequirementKey): string {
  const label = requirementLabelBg(key);
  if (key === 'pathogenesis') return 'Опишете патогенезата';
  if (key === 'clinic') return 'Опишете клиничната картина';
  if (key === 'definition') return 'Дайте дефиниция';
  return `Разкажете за ${label.toLowerCase()}`;
}
