import { describe, it, expect } from 'vitest';
import { nextTheme } from './ThemeContext';

describe('nextTheme', () => {
  it('cycles light -> dark -> system -> light', () => {
    expect(nextTheme('light')).toBe('dark');
    expect(nextTheme('dark')).toBe('system');
    expect(nextTheme('system')).toBe('light');
  });

  it('returns to the starting theme after three steps', () => {
    expect(nextTheme(nextTheme(nextTheme('light')))).toBe('light');
    expect(nextTheme(nextTheme(nextTheme('dark')))).toBe('dark');
  });
});
