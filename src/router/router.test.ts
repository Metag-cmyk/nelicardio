import { describe, it, expect } from 'vitest';
import { parseHash, buildHash, DEFAULT_ROUTE } from './router';

describe('parseHash', () => {
  it('returns the default route for an empty hash', () => {
    expect(parseHash('')).toEqual(DEFAULT_ROUTE);
    expect(parseHash('#')).toEqual(DEFAULT_ROUTE);
    expect(parseHash('#/')).toEqual(DEFAULT_ROUTE);
  });

  it('parses a simple tab route', () => {
    expect(parseHash('#/labs')).toEqual({ name: 'labs' });
    expect(parseHash('#/scores')).toEqual({ name: 'scores' });
  });

  it('parses an entity route', () => {
    expect(parseHash('#/diagnose/stemi')).toEqual({ name: 'diagnose', id: 'stemi' });
    expect(parseHash('#/pharma/apixaban')).toEqual({ name: 'pharma', id: 'apixaban' });
  });

  it('decodes entity ids', () => {
    expect(parseHash('#/diagnose/atrial%20fibrillation')).toEqual({ name: 'diagnose', id: 'atrial fibrillation' });
  });

  it('returns notfound for unknown routes', () => {
    expect(parseHash('#/nope')).toEqual({ name: 'notfound', id: 'nope' });
  });

  it('tolerates a missing leading slash', () => {
    expect(parseHash('#labs')).toEqual({ name: 'labs' });
  });
});

describe('buildHash', () => {
  it('builds tab and entity routes', () => {
    expect(buildHash({ name: 'labs' })).toBe('#/labs');
    expect(buildHash({ name: 'diagnose', id: 'stemi' })).toBe('#/diagnose/stemi');
  });

  it('encodes entity ids', () => {
    expect(buildHash({ name: 'diagnose', id: 'atrial fibrillation' })).toBe('#/diagnose/atrial%20fibrillation');
  });

  it('round-trips with parseHash', () => {
    for (const route of [
      { name: 'diagnose' as const },
      { name: 'diagnose' as const, id: 'hfref' },
      { name: 'pharma' as const, id: 'aspirin' },
      { name: 'guidelines' as const, id: 'esc-2026-hf' },
    ]) {
      expect(parseHash(buildHash(route))).toEqual(route);
    }
  });
});
