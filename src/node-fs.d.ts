/**
 * Minimal ambient declarations for the Node builtins used by tests.
 * The app tsconfig does not pull in the full `@types/node` surface, so we
 * declare only the two functions the audit report writer needs.
 */
declare module 'node:fs' {
  export function writeFileSync(path: string, data: string, encoding?: string): void;
  export function mkdirSync(path: string, options?: { recursive?: boolean }): void;
}
