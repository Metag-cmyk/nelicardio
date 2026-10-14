/**
 * i18n dictionaries (English + Bulgarian).
 * Translation currently covers shell/navigation strings; clinical content stays
 * English-first (SPEC §12). Add new UI strings to both dictionaries.
 */
export type Lang = 'en' | 'bg';

export const dictionaries = {
  en: {
    'nav.exam': 'Bulgarian Exam',
    'nav.diagnose': 'Diagnose',
    'nav.guidelines': 'Guidelines',
    'nav.pharma': 'Drugs',
    'nav.scores': 'Scores',
    'nav.imaging': 'Imaging',
    'nav.labs': 'Labs',
    'nav.study': 'Study',
    'nav.coverage': 'Coverage',
    'group.exam': 'Bulgarian Exam',
    'group.reference': 'Reference',
    'group.study': 'Study',
    'group.tools': 'Tools',
    'ui.theme': 'Theme',
    'ui.society': 'Guidelines',
    'ui.language': 'Language',
    'ui.soon': 'Soon',
    'ui.more': 'More',
    'ui.skip': 'Skip to content',
    'ui.disclaimer': 'Educational reference for exam preparation. Not a substitute for clinical judgement.',
  },
  bg: {
    'nav.exam': 'Български изпит',
    'nav.diagnose': 'Диагностика',
    'nav.guidelines': 'Насоки',
    'nav.pharma': 'Лекарства',
    'nav.scores': 'Скали',
    'nav.imaging': 'Изобразяване',
    'nav.labs': 'Лаборатория',
    'nav.study': 'Учене',
    'nav.coverage': 'Покритие',
    'group.exam': 'Български изпит',
    'group.reference': 'Справочник',
    'group.study': 'Учене',
    'group.tools': 'Инструменти',
    'ui.theme': 'Тема',
    'ui.society': 'Насоки',
    'ui.language': 'Език',
    'ui.soon': 'Скоро',
    'ui.more': 'Още',
    'ui.skip': 'Към съдържанието',
    'ui.disclaimer': 'Образователен справочник за подготовка за изпит. Не заменя клиничната преценка.',
  },
} as const;

export type StringKey = keyof typeof dictionaries.en;
