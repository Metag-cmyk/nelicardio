import {
  Stethoscope,
  Beaker,
  Scan,
  Pill,
  Zap,
  BookOpen,
  Target,
  GraduationCap,
  ScrollText,
  type LucideIcon,
} from 'lucide-react';
import type { RouteName } from '../router/router';

export type NavGroup = 'exam' | 'reference' | 'study' | 'tools';

export interface NavItem {
  id: RouteName;
  label: string;
  /** Longer label used in the mobile sheets. */
  description: string;
  icon: LucideIcon;
  group: NavGroup;
  /** Feature not built yet — shown but labelled "Planned". */
  planned?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'exam', label: 'Bulgarian Exam', description: 'Syllabus study notes (конспект)', icon: ScrollText, group: 'exam' },
  { id: 'diagnose', label: 'Diagnose', description: 'Conditions & algorithms', icon: Stethoscope, group: 'reference' },
  { id: 'guidelines', label: 'Guidelines', description: 'ESC + AHA/ACC recommendations', icon: BookOpen, group: 'reference' },
  { id: 'pharma', label: 'Drugs', description: 'Pharmacology & dosing', icon: Pill, group: 'reference' },
  { id: 'scores', label: 'Scores', description: 'Risk calculators', icon: Zap, group: 'reference' },
  { id: 'imaging', label: 'Imaging', description: 'Multimodality assessment', icon: Scan, group: 'reference' },
  { id: 'labs', label: 'Labs', description: 'Biochemistry & acid-base', icon: Beaker, group: 'reference' },
  { id: 'study', label: 'Study', description: 'Quiz, flashcards & mock exams', icon: GraduationCap, group: 'study' },
  { id: 'coverage', label: 'Coverage', description: 'Exam blueprint heatmap', icon: Target, group: 'tools' },
];

export const NAV_GROUPS: { id: NavGroup; label: string }[] = [
  { id: 'exam', label: 'Bulgarian Exam' },
  { id: 'reference', label: 'Reference' },
  { id: 'study', label: 'Study' },
  { id: 'tools', label: 'Tools' },
];

/** Four primary destinations in the mobile bottom bar; the rest go in "More". */
export const MOBILE_PRIMARY: RouteName[] = ['diagnose', 'labs', 'pharma', 'scores'];

export const getNavItem = (id: RouteName): NavItem | undefined =>
  NAV_ITEMS.find((item) => item.id === id);

/** Map a route name to the nav item that should appear active. */
export const activeNavId = (name: RouteName): RouteName => (name === 'notfound' ? 'diagnose' : name);
