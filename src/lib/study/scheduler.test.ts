import { describe, it, expect } from 'vitest';
import { newCard, schedule, isDue, isMastered, masteryByTopic, DAY_MS } from './scheduler';

const NOW = 1_700_000_000_000;

describe('SM-2 scheduler', () => {
  it('starts at ease 2.5 and due now', () => {
    const c = newCard('a', NOW);
    expect(c.ease).toBe(2.5);
    expect(c.intervalDays).toBe(0);
    expect(isDue(c, NOW)).toBe(true);
  });

  it('good → 1 day, then 6 days, then interval × ease', () => {
    let c = newCard('a', NOW);
    c = schedule(c, 'good', NOW);
    expect(c.intervalDays).toBe(1);
    c = schedule(c, 'good', NOW);
    expect(c.intervalDays).toBe(6);
    c = schedule(c, 'good', NOW);
    expect(c.intervalDays).toBe(Math.round(6 * c.ease));
  });

  it('again resets reps, increments lapses, and shortens the delay', () => {
    let c = newCard('a', NOW);
    c = schedule(c, 'good', NOW);
    c = schedule(c, 'good', NOW);
    const before = c.ease;
    c = schedule(c, 'again', NOW);
    expect(c.reps).toBe(0);
    expect(c.lapses).toBe(1);
    expect(c.ease).toBeLessThan(before);
    expect(c.due).toBe(NOW + 60_000);
  });

  it('hard lowers ease and still schedules ahead', () => {
    let c = newCard('a', NOW);
    c = schedule(c, 'hard', NOW);
    expect(c.ease).toBeLessThan(2.5);
    expect(c.intervalDays).toBeGreaterThanOrEqual(1);
    expect(c.due).toBeGreaterThan(NOW);
  });

  it('easy raises ease and lengthens the interval', () => {
    let c = newCard('a', NOW);
    const before = c.ease;
    c = schedule(c, 'easy', NOW);
    expect(c.ease).toBeGreaterThan(before);
    expect(c.intervalDays).toBeGreaterThanOrEqual(1);
  });

  it('never drops ease below 1.3', () => {
    let c = newCard('a', NOW);
    for (let i = 0; i < 20; i++) c = schedule(c, 'again', NOW);
    expect(c.ease).toBeGreaterThanOrEqual(1.3);
  });

  it('marks a card mastered once the interval reaches 21 days', () => {
    let c = newCard('a', NOW);
    for (let i = 0; i < 6; i++) c = schedule(c, 'good', NOW);
    expect(c.intervalDays).toBeGreaterThanOrEqual(21);
    expect(isMastered(c)).toBe(true);
    expect(isDue(c, NOW + DAY_MS)).toBe(false);
  });
});

describe('masteryByTopic', () => {
  it('computes per-topic mastery', () => {
    let mastered = newCard('m', NOW);
    for (let i = 0; i < 6; i++) mastered = schedule(mastered, 'good', NOW);
    const fresh = newCard('f', NOW);
    const map = new Map([['acs', [mastered, fresh]]]);
    const result = masteryByTopic([{ id: 'acs', title: 'ACS' }, { id: 'hf', title: 'HF' }], map);
    expect(result.find((t) => t.topicId === 'acs')?.rate).toBeCloseTo(0.5);
    expect(result.find((t) => t.topicId === 'hf')?.rate).toBe(0);
  });
});
