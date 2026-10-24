/**
 * The principle of moments on a balanced see-saw (outcome 4.2.1), drawn to scale (100 px per metre;
 * force arrows 0.12 px per newton). A 400 N child sits 1.5 m to the left of the pivot and a 600 N
 * parent sits 1.0 m to the right. Anticlockwise moment 400 × 1.5 = 600 N m; clockwise moment
 * 600 × 1.0 = 600 N m, so the plank balances. The pivot pushes up with R = 1000 N, which has no
 * moment about the pivot because its line of action passes through it.
 */
import { Label, MathLabel, Svg } from '../primitives';
import { Dimension, Force, Pivot } from './turning-effects-kit';

export const diagramKey = 'phys-equilibrium-forces-seesaw';

const W = 640;
const H = 290;
const PX = 100; // px per metre
const K = 0.12; // px per newton
const CX = 320;
const TOP = 150;

export function EquilibriumForcesSeesaw() {
  const child = CX - 1.5 * PX;
  const parent = CX + 1.0 * PX;
  return (
    <Svg width={W} height={H}>
      <rect x={CX - 2.1 * PX} y={TOP} width={4.2 * PX} height={12} rx={3} className="dg-fill-muted dg-line" />
      <Pivot p={{ x: CX, y: TOP + 12 }} />
      <line x1={CX - 24} y1={TOP + 36} x2={CX + 24} y2={TOP + 36} className="dg-line" />

      <Force p={{ x: child, y: TOP - 400 * K }} u={{ x: 0, y: 1 }} l={400 * K - 1} />
      <Label x={child} y={TOP - 400 * K - 14} className="dg-text dg-bold">
        400 N
      </Label>
      <Force p={{ x: parent, y: TOP - 600 * K }} u={{ x: 0, y: 1 }} l={600 * K - 1} />
      <Label x={parent} y={TOP - 600 * K - 14} className="dg-text dg-bold">
        600 N
      </Label>
      <Force p={{ x: CX, y: TOP }} u={{ x: 0, y: -1 }} l={1000 * K} tone="accent-2" />
      <Label x={CX - 10} y={TOP - 1000 * K + 4} anchor="end" className="dg-text-accent-2">
        R = 1000 N
      </Label>
      <Label x={CX - 10} y={TOP - 1000 * K + 22} anchor="end" className="dg-text-small dg-text-muted">
        acts through the pivot: no moment
      </Label>

      <line x1={child} y1={TOP + 14} x2={child} y2={TOP + 64} className="dg-grid" />
      <line x1={parent} y1={TOP + 14} x2={parent} y2={TOP + 64} className="dg-grid" />
      <line x1={CX} y1={TOP + 38} x2={CX} y2={TOP + 64} className="dg-grid" />
      <Dimension a={{ x: child, y: TOP + 58 }} b={{ x: CX, y: TOP + 58 }} />
      <Label x={(child + CX) / 2} y={TOP + 44} className="dg-text">
        1.5 m
      </Label>
      <Dimension a={{ x: CX, y: TOP + 58 }} b={{ x: parent, y: TOP + 58 }} />
      <Label x={(parent + CX) / 2} y={TOP + 44} className="dg-text">
        1.0 m
      </Label>

      <Label x={160} y={236} className="dg-text-small dg-text-muted">
        anticlockwise moment
      </Label>
      <MathLabel x={160} y={262} w={240} h={30} tex="400 \times 1.5 = 600\ \text{N m}" />
      <Label x={480} y={236} className="dg-text-small dg-text-muted">
        clockwise moment
      </Label>
      <MathLabel x={480} y={262} w={240} h={30} tex="600 \times 1.0 = 600\ \text{N m}" />
    </Svg>
  );
}

export default EquilibriumForcesSeesaw;
