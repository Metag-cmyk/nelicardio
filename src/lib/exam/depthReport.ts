import { auditDepth, type DepthLevel } from './depth';

const LEVEL_LABEL: Record<DepthLevel, string> = {
  deep: '🟢 дълбока',
  adequate: '🟡 достатъчна',
  shallow: '🟠 плитка',
  missing: '🔴 липсва',
};

/** Renders the pathogenesis-depth audit as Markdown. */
export function depthMarkdown(): string {
  const { rows, summary, topicDepth } = auditDepth();
  const lines: string[] = [];

  lines.push('# Патогенеза / патофизиология — одит за дълбочина');
  lines.push('');
  lines.push(`Условия: **${summary.total}** · без стъпки: **${summary.noSteps}** · без признаци: **${summary.noSigns}** · без лаборатория: **${summary.noLabs}** · без механистична обосновка: **${summary.noRationale}**`);
  lines.push('');
  lines.push('**Легенда:** 🟢 дълбока (≥3 стъпки) · 🟡 достатъчна (1–2 стъпки или подробно обобщение) · 🟠 плитка (само кратко обобщение) · 🔴 липсва');
  lines.push('');
  lines.push('| Ниво | Брой |');
  lines.push('|---|---|');
  for (const lvl of ['deep', 'adequate', 'shallow', 'missing'] as DepthLevel[]) lines.push(`| ${LEVEL_LABEL[lvl]} | ${summary.byLevel[lvl]} |`);
  lines.push('');

  const categories = [...new Set(rows.map((r) => r.category))];
  for (const cat of categories) {
    lines.push(`## ${cat}`);
    lines.push('');
    lines.push('| Заболяване | Стъпки | Обобщение (зн.) | Признаци | Лаб. (с посока) | Обосновка | Ниво |');
    lines.push('|---|---:|---:|---:|---:|:---:|---|');
    for (const r of rows.filter((x) => x.category === cat)) {
      lines.push(`| ${r.name} | ${r.steps} | ${r.overviewChars} | ${r.signs} | ${r.labs} (${r.labsWithDirection}) | ${r.rationale ? '✅' : '—'} | ${LEVEL_LABEL[r.level]} |`);
    }
    lines.push('');
  }

  lines.push('## Теми от конспекта с най-слаба патогенеза');
  lines.push('');
  lines.push('| № | Тема | Ниво | Най-слаб източник |');
  lines.push('|---|---|---|---|');
  const weak = topicDepth
    .filter((t) => t.level === 'shallow' || t.level === 'missing' || t.level === 'adequate')
    .sort((a, b) => ['deep', 'adequate', 'shallow', 'missing'].indexOf(b.level) - ['deep', 'adequate', 'shallow', 'missing'].indexOf(a.level));
  for (const t of weak) {
    lines.push(`| ${t.code} | ${t.title} | ${LEVEL_LABEL[t.level]} | ${t.weakest} |`);
  }
  lines.push('');

  return lines.join('\n');
}
