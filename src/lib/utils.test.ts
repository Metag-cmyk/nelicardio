import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
  it('merges basic classes', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('merges tailwind classes and resolves conflicts', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    expect(cn('px-2 py-1', 'p-4')).toBe('p-4');
  });

  it('handles conditional classes', () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn('class1', isActive && 'class2', isDisabled && 'class3')).toBe('class1 class2');
    expect(cn({ 'class1': true, 'class2': false })).toBe('class1');
  });

  it('handles arrays', () => {
    expect(cn(['class1', 'class2'])).toBe('class1 class2');
    expect(cn(['class1'], ['class2', 'class3'])).toBe('class1 class2 class3');
  });

  it('ignores falsy values', () => {
    expect(cn('class1', undefined, null, false, '', 'class2')).toBe('class1 class2');
  });
});
