/**
 * A five-step method for predicting a shape, worked for two ions side by side.
 * H₃O⁺: O has 6 outer electrons, −1 for the positive charge = 5, −3 for three O–H bonds =
 * 2, so 1 lone pair; 3 bonding pairs + 1 lone pair → pyramidal, 107°.
 * NH₂⁻: N has 5, +1 for the negative charge = 6, −2 for two N–H bonds = 4, so 2 lone pairs;
 * 2 bonding pairs + 2 lone pairs → non-linear, 104.5°.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-shapes-molecules-pair-counting';

const W = 640;
const H = 400;
const X1 = 450;
const X2 = 570;

const ROWS: Array<{ step: [string, string?]; a: [string, string?]; b: [string, string?] }> = [
  { step: ['outer-shell electrons', 'on the central atom'], a: ['O: 6'], b: ['N: 5'] },
  { step: ['add 1 for each negative charge,', 'take 1 for each positive charge'], a: ['6 − 1 = 5'], b: ['5 + 1 = 6'] },
  { step: ['take 1 for each single bond', '(to H or a halogen)'], a: ['5 − 3 = 2'], b: ['6 − 2 = 4'] },
  { step: ['lone pairs = electrons left ÷ 2'], a: ['1 lone pair'], b: ['2 lone pairs'] },
  { step: ['bonding pairs + lone pairs', '→ shape and angle'], a: ['3 + 1: pyramidal', '107°'], b: ['2 + 2: non-linear', '104.5°'] },
];

function Cell({ x, y, lines, cls, anchor = 'middle' }: { x: number; y: number; lines: [string, string?]; cls: string; anchor?: 'start' | 'middle' }) {
  const two = lines[1] !== undefined;
  return (
    <g>
      <Label x={x} y={two ? y - 9 : y} anchor={anchor} className={cls}>
        {lines[0]}
      </Label>
      {two && (
        <Label x={x} y={y + 9} anchor={anchor} className={cls}>
          {lines[1]!}
        </Label>
      )}
    </g>
  );
}

export function ShapesMoleculesPairCounting() {
  const top = 74;
  const step = 62;
  return (
    <Svg width={W} height={H}>
      <Label x={70} y={30} anchor="start" className="dg-text-muted">
        step
      </Label>
      <Label x={X1} y={30} className="dg-text dg-bold">
        H₃O⁺
      </Label>
      <Label x={X2} y={30} className="dg-text dg-bold">
        NH₂⁻
      </Label>
      <line x1={24} y1={46} x2={W - 24} y2={46} className="dg-grid" />
      <rect x={X1 - 56} y={50} width={112} height={step * ROWS.length - 6} rx={8} className="dg-fill-muted" />
      <rect x={X2 - 56} y={50} width={112} height={step * ROWS.length - 6} rx={8} className="dg-fill-muted" />
      {ROWS.map((r, i) => {
        const y = top + i * step;
        const last = i === ROWS.length - 1;
        return (
          <g key={i}>
            <circle cx={42} cy={y} r={13} className="dg-accent dg-fill-accent" />
            <Label x={42} y={y} className="dg-text dg-bold">
              {String(i + 1)}
            </Label>
            <Cell x={70} y={y} lines={r.step} cls="dg-text-small" anchor="start" />
            <Cell x={X1} y={y} lines={r.a} cls={last ? 'dg-text-small dg-bold' : 'dg-text-small'} />
            <Cell x={X2} y={y} lines={r.b} cls={last ? 'dg-text-small dg-bold' : 'dg-text-small'} />
            {i < ROWS.length - 1 && <line x1={24} y1={y + step / 2} x2={W - 24} y2={y + step / 2} className="dg-grid" />}
          </g>
        );
      })}
    </Svg>
  );
}

export default ShapesMoleculesPairCounting;
