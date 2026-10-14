import { useId } from 'react';

/**
 * Hand-authored, license-clean teaching diagrams for the figure atlas.
 * These are conceptual schematics (not anatomical tracings) and are always
 * labelled "illustrative" by the figure card.
 */
export type SchematicId = 'shunt' | 'tof' | 'valves';

const LEFT = { fill: '#fee2e2', stroke: '#f87171' };
const RIGHT = { fill: '#dbeafe', stroke: '#60a5fa' };
const ACCENT = '#e11d48';

function Chamber({ x, y, w, h, palette, label }: { x: number; y: number; w: number; h: number; palette: { fill: string; stroke: string }; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={palette.fill} stroke={palette.stroke} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + h / 2 + 3} textAnchor="middle" fontSize={10} fontWeight={700} fill="#334155">{label}</text>
    </g>
  );
}

function Shunt() {
  const uid = useId().replace(/:/g, '');
  const arrow = `url(#${uid}-a)`;
  const panel = (ox: number, title: string, reversed: boolean) => (
    <g>
      <rect x={ox + 2} y={20} width={196} height={132} rx={12} fill="#ffffff" stroke="#e2e8f0" strokeDasharray="4 3" />
      <text x={ox + 100} y={14} textAnchor="middle" fontSize={10} fontWeight={800} fill={reversed ? ACCENT : '#0f172a'}>{title}</text>
      <Chamber x={ox + 14} y={38} w={66} h={42} palette={RIGHT} label="RA" />
      <Chamber x={ox + 14} y={92} w={66} h={42} palette={RIGHT} label="RV" />
      <Chamber x={ox + 118} y={38} w={66} h={42} palette={LEFT} label="LA" />
      <Chamber x={ox + 118} y={92} w={66} h={42} palette={LEFT} label="LV" />
      {/* shunt arrow across the septum */}
      {reversed ? (
        <line x1={ox + 82} y1={59} x2={ox + 116} y2={59} stroke={ACCENT} strokeWidth={2.5} markerEnd={arrow} />
      ) : (
        <line x1={ox + 116} y1={59} x2={ox + 82} y2={59} stroke={ACCENT} strokeWidth={2.5} markerEnd={arrow} />
      )}
      <text x={ox + 99} y={52} textAnchor="middle" fontSize={8} fontWeight={800} fill={ACCENT}>{reversed ? 'R→L' : 'L→R'}</text>
      {/* pulmonary flow arrow */}
      <line x1={ox + 47} y1={36} x2={ox + 47} y2={22} stroke="#0f172a" strokeWidth={2} markerEnd={arrow} />
      <text x={ox + 47} y={72} textAnchor="middle" fontSize={7.5} fontWeight={700} fill="#0f172a">{reversed ? '↓ pulm. flow' : '↑ pulm. flow'}</text>
      <text x={ox + 100} y={145} textAnchor="middle" fontSize={8} fontWeight={700} fill={reversed ? ACCENT : '#64748b'}>
        {reversed ? 'cyanosis (Eisenmenger)' : 'pulmonary overcirculation'}
      </text>
    </g>
  );
  return (
    <svg viewBox="0 0 420 165" className="w-full" role="img" aria-label="Left-to-right shunt and its reversal">
      <defs>
        <marker id={`${uid}-a`} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L6,3.5 L0,7 Z" fill={ACCENT} />
        </marker>
      </defs>
      {panel(4, 'Normal — left-to-right shunt', false)}
      {panel(214, 'Eisenmenger — reversed', true)}
    </svg>
  );
}

function Tof() {
  const uid = useId().replace(/:/g, '');
  const arrow = `url(#${uid}-a)`;
  const badge = (x: number, y: number, n: number, color: string) => (
    <g>
      <circle cx={x} cy={y} r={8} fill={color} />
      <text x={x} y={y + 3} textAnchor="middle" fontSize={9} fontWeight={800} fill="#fff">{n}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 420 190" className="w-full" role="img" aria-label="Tetralogy of Fallot components">
      <defs>
        <marker id={`${uid}-a`} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L6,3.5 L0,7 Z" fill={ACCENT} />
        </marker>
      </defs>
      {/* pulmonary artery with a pinch (RVOTO) */}
      <line x1={70} y1={30} x2={70} y2={74} stroke="#60a5fa" strokeWidth={5} />
      <path d="M62,52 L78,52" stroke="#ffffff" strokeWidth={7} />
      {badge(70, 30, 1, '#0ea5e9')}
      <Chamber x={40} y={74} w={72} h={64} palette={RIGHT} label="RV" />
      <Chamber x={124} y={74} w={72} h={64} palette={LEFT} label="LV" />
      {/* thickened RV wall (hypertrophy) */}
      <rect x={40} y={74} width={72} height={64} rx={8} fill="none" stroke="#1d4ed8" strokeWidth={4} strokeDasharray="1 5" />
      {badge(40, 138, 4, '#1d4ed8')}
      {/* VSD gap across the septum */}
      <rect x={108} y={96} width={20} height={16} fill="#ffffff" stroke="#0f172a" strokeWidth={1.5} />
      {badge(118, 128, 2, '#0f172a')}
      {/* overriding aorta */}
      <line x1={150} y1={74} x2={150} y2={30} stroke="#f87171" strokeWidth={5} />
      <line x1={150} y1={30} x2={128} y2={30} stroke="#f87171" strokeWidth={5} />
      {badge(150, 30, 3, ACCENT)}
      {/* right-to-left shunt arrow */}
      <line x1={132} y1={104} x2={104} y2={104} stroke={ACCENT} strokeWidth={2.5} markerEnd={arrow} />

      {/* legend */}
      <g fontSize={9} fontWeight={700} fill="#334155">
        <text x={228} y={40}>1 · RV outflow obstruction (pulmonary stenosis)</text>
        <text x={228} y={70}>2 · Ventricular septal defect</text>
        <text x={228} y={100}>3 · Overriding aorta</text>
        <text x={228} y={130}>4 · Right ventricular hypertrophy</text>
        <text x={228} y={162} fontSize={8.5} fill={ACCENT}>→ right-to-left shunt, cyanosis</text>
      </g>
    </svg>
  );
}

function Valves() {
  const uid = useId().replace(/:/g, '');
  const arrow = `url(#${uid}-a)`;
  const fwd = (far: string) => (
    <>
      <line x1={40} y1={58} x2={40} y2={150} stroke="#0f172a" strokeWidth={2} markerStart={arrow} markerEnd={arrow} />
      <text x={78} y={108} fontSize={8.5} fontWeight={700} fill="#334155">{far}</text>
    </>
  );
  const back = (far: string) => (
    <>
      <line x1={40} y1={58} x2={40} y2={150} stroke="#0f172a" strokeWidth={2} markerEnd={arrow} />
      <line x1={58} y1={150} x2={58} y2={66} stroke={ACCENT} strokeWidth={2} markerEnd={arrow} />
      <text x={78} y={108} fontSize={8.5} fontWeight={700} fill={ACCENT}>{far}</text>
    </>
  );
  const panel = (x: number, y: number, title: string, body: React.ReactNode) => (
    <g>
      <rect x={x} y={y} width={196} height={92} rx={10} fill="#ffffff" stroke="#e2e8f0" />
      <text x={x + 10} y={y + 16} fontSize={9.5} fontWeight={800} fill="#0f172a">{title}</text>
      <g transform={`translate(${x + 2}, ${y + 4})`}>{body}</g>
    </g>
  );
  const valveIcon = (narrow: boolean) => (
    <g>
      <path d="M20,54 Q40,44 60,54" fill="none" stroke="#60a5fa" strokeWidth={3} />
      <path d="M20,58 Q40,68 60,58" fill="none" stroke="#f87171" strokeWidth={3} />
      {narrow && <rect x={34} y={50} width={12} height={12} fill="#ffffff" stroke="#0f172a" strokeWidth={1} />}
    </g>
  );
  return (
    <svg viewBox="0 0 420 210" className="w-full" role="img" aria-label="Valve lesions at a glance">
      <defs>
        <marker id={`${uid}-a`} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L6,3.5 L0,7 Z" fill={ACCENT} />
        </marker>
      </defs>
      {panel(4, 6, 'Aortic stenosis', <>{valveIcon(true)}{fwd('↑ afterload → concentric LVH')}</>)}
      {panel(214, 6, 'Aortic regurgitation', <>{valveIcon(false)}{back('volume overload → eccentric LVH')}</>)}
      {panel(4, 108, 'Mitral stenosis', <>{valveIcon(true)}{fwd('↑ LA pressure → pulmonary congestion')}</>)}
      {panel(214, 108, 'Mitral regurgitation', <>{valveIcon(false)}{back('LA / LV volume overload')}</>)}
    </svg>
  );
}

export function Schematic({ id }: { id: SchematicId }) {
  if (id === 'shunt') return <Shunt />;
  if (id === 'tof') return <Tof />;
  return <Valves />;
}
