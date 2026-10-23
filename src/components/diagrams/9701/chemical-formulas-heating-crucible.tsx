/**
 * Removing water of crystallisation. A hydrated salt in a crucible with a
 * loosely fitting lid sits in a pipe-clay triangle on a tripod over a Bunsen
 * burner. The right-hand panel shows heating to constant mass: weigh, heat,
 * cool, reweigh, and repeat until two readings agree. Illustrative readings
 * for 2.50 g of hydrated magnesium sulfate: 2.50 g before heating, then
 * 1.40, 1.25, 1.22 and 1.22 g, so all the water has gone once the mass
 * stops changing.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-chemical-formulas-heating-crucible';

const W = 640;
const H = 370;

const READINGS: Array<[string, string]> = [
  ['before heating', '2.50'],
  ['after heating 1', '1.40'],
  ['after heating 2', '1.25'],
  ['after heating 3', '1.22'],
  ['after heating 4', '1.22'],
];

export function ChemicalFormulasHeatingCrucible() {
  return (
    <Svg width={W} height={H}>
      {/* crucible and lid */}
      <path d="M98,104 L162,104 L152,150 L108,150 Z" className="dg-fill-surface dg-line" />
      <path d="M104,128 L156,128 L152,150 L108,150 Z" className="dg-fill-muted" />
      <path d="M93,98 L166,93 L167,98 L94,103 Z" className="dg-fill-surface dg-line" />
      {/* pipe-clay triangle (side view) and tripod */}
      <line x1={86} y1={152} x2={174} y2={152} className="dg-line" />
      <circle cx={104} cy={152} r={3} className="dg-dot" />
      <circle cx={156} cy={152} r={3} className="dg-dot" />
      <line x1={56} y1={158} x2={204} y2={158} className="dg-line" />
      <line x1={64} y1={158} x2={44} y2={330} className="dg-line" />
      <line x1={196} y1={158} x2={216} y2={330} className="dg-line" />
      {/* Bunsen burner and flame */}
      <path d="M130,178 Q112,206 122,230 L138,230 Q148,206 130,178 Z" className="dg-fill-accent-2 dg-accent-2" />
      <rect x={120} y={230} width={20} height={86} className="dg-fill-surface dg-line" />
      <rect x={116} y={276} width={28} height={10} className="dg-fill-muted dg-thin" />
      <rect x={92} y={316} width={76} height={14} rx={3} className="dg-fill-surface dg-line" />
      <line x1={24} y1={330} x2={236} y2={330} className="dg-thin" />

      {/* labels with leader lines */}
      {[
        { y: 92, from: [166, 95], text: 'lid (loose fit)' },
        { y: 122, from: [158, 122], text: 'crucible + hydrated salt' },
        { y: 152, from: [174, 152], text: 'pipe-clay triangle' },
        { y: 190, from: [204, 190], text: 'tripod' },
        { y: 214, from: [142, 214], text: 'heat' },
        { y: 262, from: [140, 262], text: 'Bunsen burner' },
      ].map((l) => (
        <g key={l.text}>
          <line x1={l.from[0]} y1={l.from[1]} x2={226} y2={l.y} className="dg-muted" />
          <Label x={232} y={l.y} anchor="start" className="dg-text-small">
            {l.text}
          </Label>
        </g>
      ))}

      {/* heating to constant mass */}
      <line x1={384} y1={20} x2={384} y2={H - 20} className="dg-grid" />
      <Label x={402} y={30} anchor="start" className="dg-text dg-bold">
        heat to constant mass
      </Label>
      {['1  weigh', '2  heat', '3  cool, then reweigh', '4  repeat 2–3 until two', '    readings agree'].map((s, i) => (
        <Label key={i} x={402} y={56 + i * 20} anchor="start" className="dg-text-small">
          {s}
        </Label>
      ))}
      <Label x={402} y={172} anchor="start" className="dg-text-muted">
        mass of solid / g
      </Label>
      {READINGS.map(([what, m], i) => {
        const y = 198 + i * 26;
        const last = i >= 3;
        return (
          <g key={what}>
            {i === 3 && <rect x={396} y={y - 12} width={228} height={50} rx={6} className="dg-fill-accent" />}
            <Label x={406} y={y} anchor="start" className="dg-text-small">
              {what}
            </Label>
            <Label x={612} y={y} anchor="end" className={last ? 'dg-text dg-bold' : 'dg-text'}>
              {m}
            </Label>
          </g>
        );
      })}
      <Label x={510} y={338} className="dg-text-accent">
        constant: all water removed
      </Label>
      <Label x={510} y={356} className="dg-text-small">
        (illustrative readings)
      </Label>
    </Svg>
  );
}

export default ChemicalFormulasHeatingCrucible;
