import { auditAll } from './audit';

const VERDICT_LABEL: Record<string, string> = {
  ok: '✅ готова',
  partial: '🟡 частична',
  'needs-authoring': '🔴 нужна бележка',
  'needs-slicing': '🟠 нужно разграничаване',
};

const STATUS_ICON: Record<string, string> = {
  covered: '✅',
  partial: '🟡',
  missing: '🔴',
};

/** Renders the full exam-readiness audit as Markdown. */
export function auditMarkdown(): string {
  const { topics, summary } = auditAll();
  const lines: string[] = [];

  lines.push('# Bulgarian Exam — одитен доклад (ориентация по заглавие)');
  lines.push('');
  lines.push(`Точки: **${summary.total}** · средна готовност: **${summary.averageReadiness}%** · за работа: **${summary.needsWork}**`);
  lines.push('');
  lines.push('**Легенда:** ' + Object.entries(VERDICT_LABEL).map(([k, v]) => `${v} (\`${k}\`)`).join(' · '));
  lines.push('');
  lines.push('| Присъда | Брой |');
  lines.push('|---|---|');
  for (const [k, v] of Object.entries(summary.byVerdict)) lines.push(`| ${VERDICT_LABEL[k] ?? k} | ${v} |`);
  lines.push('');

  const sections = [...new Set(topics.map((t) => t.section))];
  for (const section of sections) {
    lines.push(`## ${section}`);
    lines.push('');
    lines.push('| № | Тема | Тип | Източник | Готовност | Присъда | Бележки |');
    lines.push('|---|---|---|---|:---:|---|---|');
    for (const t of topics.filter((x) => x.section === section)) {
      lines.push(`| ${t.code} | ${t.title} | ${t.kind} | ${t.coverage} | ${t.readiness}% | ${VERDICT_LABEL[t.verdict]} | ${t.flags.join('; ') || '—'} |`);
    }
    lines.push('');
  }

  lines.push('## Детайл по изисквания (теми, които не са „готова“)');
  lines.push('');
  for (const t of topics.filter((x) => x.verdict !== 'ok')) {
    lines.push(`### ${t.code}. ${t.title}`);
    lines.push(`_${t.kind} · източник: ${t.coverage} · готовност ${t.readiness}% · ${VERDICT_LABEL[t.verdict]}_`);
    lines.push('');
    lines.push('| Изискване | Очакван източник | Статус | Доказателство |');
    lines.push('|---|---|---|---|');
    for (const r of t.requirements) {
      lines.push(`| ${r.labelBg} | ${r.satisfiedBy} | ${STATUS_ICON[r.status] ?? ''} ${r.status} | ${r.evidence.join(', ') || '—'} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
