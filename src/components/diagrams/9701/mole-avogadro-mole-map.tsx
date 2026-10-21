/**
 * The mole map. Three boxes: mass m / g, amount of substance n / mol, and
 * number of particles N. Mass to moles is ÷ M (molar mass, g mol⁻¹) and back
 * is × M; moles to particles is × L (Avogadro constant, 6.022 × 10²³ mol⁻¹)
 * and back is ÷ L. Every conversion passes through moles.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-mole-avogadro-mole-map';

const W = 640;
const H = 270;
const BW = 160;
const BH = 74;
const Y = 76;
const BOXES = [
  { x: 20, title: 'mass', sub: 'm / g', hub: false },
  { x: 240, title: 'amount', sub: 'n / mol', hub: true },
  { x: 460, title: 'particles', sub: 'number, N', hub: false },
];

export function MoleAvogadroMoleMap() {
  const top = Y + 22;
  const bot = Y + BH - 22;
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        every route goes through moles
      </Label>
      {BOXES.map((b) => (
        <g key={b.title}>
          <rect x={b.x} y={Y} width={BW} height={BH} rx={12} className={b.hub ? 'dg-fill-accent dg-accent' : 'dg-fill-surface dg-line'} />
          <Label x={b.x + BW / 2} y={Y + 28} className="dg-text dg-bold">
            {b.title}
          </Label>
          <Label x={b.x + BW / 2} y={Y + 50} className="dg-text dg-italic">
            {b.sub}
          </Label>
        </g>
      ))}

      {/* mass <-> moles */}
      <Arrow x1={182} y1={top} x2={238} y2={top} />
      <Label x={210} y={top - 14} className="dg-text dg-bold">
        ÷ M
      </Label>
      <Arrow x1={238} y1={bot} x2={182} y2={bot} />
      <Label x={210} y={bot + 15} className="dg-text dg-bold">
        × M
      </Label>

      {/* moles <-> particles */}
      <Arrow x1={402} y1={top} x2={458} y2={top} />
      <Label x={430} y={top - 14} className="dg-text dg-bold">
        × L
      </Label>
      <Arrow x1={458} y1={bot} x2={402} y2={bot} />
      <Label x={430} y={bot + 15} className="dg-text dg-bold">
        ÷ L
      </Label>

      <Label x={210} y={196} className="dg-text-accent">
        n = m ÷ M
      </Label>
      <Label x={430} y={196} className="dg-text-accent">
        N = n × L
      </Label>
      <Label x={W / 2} y={232} className="dg-text-small">
        M = molar mass / g mol⁻¹ (numerically equal to Aᵣ or Mᵣ)
      </Label>
      <Label x={W / 2} y={252} className="dg-text-small">
        L = Avogadro constant = 6.022 × 10²³ mol⁻¹ (Data Booklet)
      </Label>
    </Svg>
  );
}

export default MoleAvogadroMoleMap;
