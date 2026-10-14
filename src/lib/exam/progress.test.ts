import { describe, it, expect } from 'vitest';
import { withStudied, withConfidence, withOpened } from './progress';

describe('exam progress helpers', () => {
  it('updates a point immutably', () => {
    const a = withStudied({}, 'bg-1', true);
    expect(a['bg-1'].studied).toBe(true);

    const b = withConfidence(a, 'bg-1', 2);
    expect(b['bg-1'].studied).toBe(true);
    expect(b['bg-1'].confidence).toBe(2);
    expect(a['bg-1'].confidence).toBeUndefined();

    const c = withOpened(b, 'bg-1', 123);
    expect(c['bg-1'].lastOpened).toBe(123);
    expect(b['bg-1'].lastOpened).toBeUndefined();
  });
});
