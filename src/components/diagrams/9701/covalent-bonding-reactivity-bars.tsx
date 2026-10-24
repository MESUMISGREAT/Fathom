/**
 * Bond energies used to compare reactivity (Cambridge 9701 Data Booklet values, kJ mol⁻¹),
 * drawn to one scale. Left: C–C (350) and C=C (610). A C=C bond is less than twice a C–C
 * bond (700), so the π part is worth only about 610 − 350 = 260: the π bond is the weak
 * link that breaks when alkenes react. Right: carbon–halogen bonds C–F 485, C–Cl 340,
 * C–Br 280, C–I 240; the weaker the bond, the faster the halogenoalkane is hydrolysed.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-covalent-bonding-reactivity-bars';

const W = 640;
const H = 410;
const BASE = 330;
const TOP = 60;
const MAX = 700;
const y = (v: number) => BASE - (v / MAX) * (BASE - TOP);

function Axis({ x, x2 }: { x: number; x2: number }) {
  return (
    <g>
      {[0, 100, 200, 300, 400, 500, 600, 700].map((t) => (
        <g key={t}>
          {t > 0 && <line x1={x} y1={y(t)} x2={x2} y2={y(t)} className="dg-grid" />}
          <Label x={x - 7} y={y(t)} anchor="end" className="dg-text-small">
            {String(t)}
          </Label>
        </g>
      ))}
      <line x1={x} y1={BASE} x2={x2} y2={BASE} className="dg-line" />
      <line x1={x} y1={BASE} x2={x} y2={TOP - 8} className="dg-line" />
    </g>
  );
}

function Bar({ x, w, v, label, className = 'dg-thin dg-fill-accent' }: { x: number; w: number; v: number; label: string; className?: string }) {
  return (
    <g>
      <rect x={x} y={y(v)} width={w} height={BASE - y(v)} className={className} />
      <Label x={x + w / 2} y={y(v) - 11} className="dg-text-small dg-bold">
        {String(v)}
      </Label>
      <Label x={x + w / 2} y={BASE + 16} className="dg-text dg-bold">
        {label}
      </Label>
    </g>
  );
}

export function CovalentBondingReactivityBars() {
  const lx = 66;
  const rx = 376;
  return (
    <Svg width={W} height={H}>
      <text x={16} y={(TOP + BASE) / 2} transform={`rotate(-90 16 ${(TOP + BASE) / 2})`} textAnchor="middle" dominantBaseline="middle" className="dg-text">
        bond energy / kJ mol⁻¹
      </text>

      {/* left: C–C vs C=C */}
      <Label x={170} y={22} className="dg-text dg-bold">
        why alkenes react
      </Label>
      <Axis x={lx} x2={282} />
      <line x1={lx} y1={y(700)} x2={282} y2={y(700)} className="dg-muted dg-dashed" />
      <Label x={180} y={y(700) - 10} className="dg-text-small">
        2 × C–C would be 700
      </Label>
      <Bar x={92} w={56} v={350} label="C–C" />
      {/* C=C split into σ and π parts */}
      <rect x={184} y={y(350)} width={56} height={BASE - y(350)} className="dg-thin dg-fill-accent" />
      <rect x={184} y={y(610)} width={56} height={y(350) - y(610)} className="dg-accent-2 dg-fill-accent-2" />
      <Label x={212} y={y(610) - 11} className="dg-text-small dg-bold">
        610
      </Label>
      <Label x={212} y={BASE + 16} className="dg-text dg-bold">
        C=C
      </Label>
      <Label x={212} y={(y(350) + BASE) / 2} className="dg-text-small">
        σ ≈ 350
      </Label>
      <Label x={212} y={(y(350) + y(610)) / 2} className="dg-text-small dg-bold">
        π ≈ 260
      </Label>
      <Label x={170} y={BASE + 44} className="dg-text-small">
        the π bond is weaker than the σ bond,
      </Label>
      <Label x={170} y={BASE + 61} className="dg-text-small">
        so it breaks first in addition reactions
      </Label>

      {/* right: C–X */}
      <Label x={490} y={22} className="dg-text dg-bold">
        halogenoalkane hydrolysis
      </Label>
      <Axis x={rx} x2={618} />
      <Bar x={394} w={44} v={485} label="C–F" className="dg-thin dg-fill-muted" />
      <Bar x={450} w={44} v={340} label="C–Cl" className="dg-thin dg-fill-muted" />
      <Bar x={506} w={44} v={280} label="C–Br" className="dg-thin dg-fill-muted" />
      <Bar x={562} w={44} v={240} label="C–I" className="dg-thin dg-fill-muted" />
      <Arrow x1={400} y1={BASE + 40} x2={604} y2={BASE + 40} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={500} y={BASE + 58} className="dg-text-small">
        weaker bond → faster hydrolysis
      </Label>
    </Svg>
  );
}

export default CovalentBondingReactivityBars;
