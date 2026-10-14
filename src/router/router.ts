/**
 * Minimal hash router.
 *
 * Hash routing is used (rather than the History API) so deep links keep working
 * inside the Capacitor WebView and when the PWA is served from any sub-path.
 * Every reference entity is URL-addressable, e.g. `#/diagnose/stemi`.
 */

export type RouteName =
  | 'diagnose'
  | 'labs'
  | 'imaging'
  | 'pharma'
  | 'scores'
  | 'guidelines'
  | 'coverage'
  | 'study'
  | 'exam'
  | 'notfound';

export interface Route {
  name: RouteName;
  /** Optional entity id (condition, drug, guideline, ...). */
  id?: string;
}

export const DEFAULT_ROUTE: Route = { name: 'diagnose' };

const KNOWN: readonly RouteName[] = [
  'diagnose', 'labs', 'imaging', 'pharma', 'scores',
  'guidelines', 'coverage', 'study', 'exam',
];

export function parseHash(hash: string): Route {
  const raw = (hash || '').replace(/^#/, '').replace(/^\/+/, '').trim();
  if (!raw) return DEFAULT_ROUTE;

  const [first, ...rest] = raw.split('/');
  const name = first as RouteName;
  if (!KNOWN.includes(name)) return { name: 'notfound', id: first };

  const idPart = rest.join('/');
  return idPart ? { name, id: decodeURIComponent(idPart) } : { name };
}

export function buildHash(route: Route): string {
  if (route.name === 'notfound') return '#/';
  return route.id ? `#/${route.name}/${encodeURIComponent(route.id)}` : `#/${route.name}`;
}

export function navigate(route: Route): void {
  const next = buildHash(route);
  if (window.location.hash === next) return;
  window.location.hash = next;
}
