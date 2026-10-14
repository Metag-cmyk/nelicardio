import { cn } from '../../lib/utils';

/**
 * Hand-authored, license-clean ECG schematics.
 * These are illustrative teaching diagrams (NOT real patient tracings) drawn
 * from primitives, so no copyrighted image is embedded.
 */
export type EcgPattern = 'normal' | 'af' | 'flutter' | 'stemi' | 'brugada' | 'long-qt';

const W = 420;
const H = 140;
const BASE = 84;

interface BeatCfg {
  p?: boolean;
  qrs: number;
  st: number;
  tAmp: number;
  tCenter: number;
}

function beatPoints(x0: number, bw: number, cfg: BeatCfg): [number, number][] {
  const at = (fx: number, amp: number): [number, number] => [x0 + fx * bw, BASE - amp];
  const q = cfg.qrs;
  const pts: [number, number][] = [at(0, 0)];
  if (cfg.p) pts.push(at(0.06, 0), at(0.10, 11), at(0.14, 0));
  pts.push(at(0.20, 0));
  pts.push(at(0.20 + 0.02 * q, -5));
  pts.push(at(0.20 + 0.05 * q, 44));
  pts.push(at(0.20 + 0.09 * q, -20));
  pts.push(at(0.20 + 0.13 * q, cfg.st));
  pts.push(at(cfg.tCenter - 0.10, cfg.st + cfg.tAmp));
  pts.push(at(cfg.tCenter, 0));
  pts.push(at(1, 0));
  return pts;
}

const toPoints = (pts: [number, number][]): string =>
  pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

/** Lay beats end-to-end and return the full polyline. */
function buildWave(pattern: EcgPattern): { points: string; beats: number } {
  const margin = 10;
  const layouts: Record<EcgPattern, { widths: number[]; cfg: BeatCfg }> = {
    normal: { widths: [72, 72, 72, 72, 72], cfg: { p: true, qrs: 1, st: 0, tAmp: 22, tCenter: 0.62 } },
    af: { widths: [70, 54, 84, 58, 80, 62], cfg: { p: false, qrs: 1, st: 0, tAmp: 20, tCenter: 0.6 } },
    flutter: { widths: [56, 56, 56, 56, 56, 56], cfg: { p: false, qrs: 1, st: 0, tAmp: 8, tCenter: 0.55 } },
    stemi: { widths: [78, 78, 78, 78], cfg: { p: true, qrs: 1, st: 18, tAmp: 24, tCenter: 0.66 } },
    brugada: { widths: [86, 86, 86, 86], cfg: { p: false, qrs: 0.9, st: 22, tAmp: -28, tCenter: 0.6 } },
    'long-qt': { widths: [86, 86, 86, 86], cfg: { p: true, qrs: 1, st: 0, tAmp: 26, tCenter: 0.84 } },
  };

  const { widths, cfg } = layouts[pattern];
  const all: [number, number][] = [];
  let x = margin;
  for (const bw of widths) {
    all.push(...beatPoints(x, bw, cfg));
    x += bw;
  }
  return { points: toPoints(all), beats: widths.length };
}

/** Extra decoration (fibrillatory waves, flutter sawtooth, tachy pacing pulses). */
function decoration(pattern: EcgPattern): string | null {
  const pts: [number, number][] = [];
  if (pattern === 'af') {
    for (let x = 8; x <= W - 8; x += 4) pts.push([x, BASE - 5 + Math.sin(x / 5) * 4 + Math.sin(x / 2.1) * 2]);
  }
  if (pattern === 'flutter') {
    for (let x = 8; x <= W - 8; x += 2) {
      const phase = (x - 8) % 28;
      pts.push([x, BASE + 2 - (phase < 14 ? phase : 28 - phase) * 0.9]);
    }
  }
  return pts.length ? toPoints(pts) : null;
}

export function EcgStrip({ pattern, className }: { pattern: EcgPattern; className?: string }) {
  const { points } = buildWave(pattern);
  const extra = decoration(pattern);

  const minor: number[] = [];
  const major: number[] = [];
  for (let x = 0; x <= W; x += 10) (x % 50 === 0 ? major : minor).push(x);
  const minorY: number[] = [];
  const majorY: number[] = [];
  for (let y = 0; y <= H; y += 10) (y % 50 === 0 ? majorY : minorY).push(y);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn('w-full h-auto rounded-xl bg-white', className)} role="img">
      <rect x="0" y="0" width={W} height={H} fill="#ffffff" />
      {minor.map((x) => (
        <line key={`mx${x}`} x1={x} y1={0} x2={x} y2={H} stroke="#fecdd3" strokeWidth="0.5" />
      ))}
      {minorY.map((y) => (
        <line key={`my${y}`} x1={0} y1={y} x2={W} y2={y} stroke="#fecdd3" strokeWidth="0.5" />
      ))}
      {major.map((x) => (
        <line key={`Mx${x}`} x1={x} y1={0} x2={x} y2={H} stroke="#fda4af" strokeWidth="0.8" />
      ))}
      {majorY.map((y) => (
        <line key={`My${y}`} x1={0} y1={y} x2={W} y2={y} stroke="#fda4af" strokeWidth="0.8" />
      ))}

      {extra && <polyline points={extra} fill="none" stroke="#94a3b8" strokeWidth="1" />}
      <polyline points={points} fill="none" stroke="#0f172a" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
