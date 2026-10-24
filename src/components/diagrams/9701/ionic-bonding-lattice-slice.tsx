/**
 * One layer of the sodium chloride lattice: a 5 × 4 grid of alternating Na+ (small) and
 * Cl− (large) ions. Radii are in proportion (Pauling crystal radii, Na+ 95 pm and Cl− 181 pm),
 * but the spacing is stretched so the attractions can be drawn. One Na+ is highlighted, with
 * arrows towards its four Cl− neighbours in this layer; a note says the other two are directly
 * above and below, making six in all. Every ion is attracted to all of its oppositely charged
 * neighbours: the bonding acts in all directions, with no NaCl molecules.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-ionic-bonding-lattice-slice';

const W = 640;
const H = 380;
const COLS = 5;
const ROWS = 4;
const STEP = 80;
const X0 = 50;
const Y0 = 60;
/** px per pm: Cl− 181 pm → 27 px, Na+ 95 pm → 14 px. */
const SCALE = 27 / 181;
const R_NA = 95 * SCALE;
const R_CL = 181 * SCALE;
const FOCUS = { r: 1, c: 3 };

const isNa = (r: number, c: number) => (r + c) % 2 === 0;

export function IonicBondingLatticeSlice() {
  const cx = (c: number) => X0 + c * STEP;
  const cy = (r: number) => Y0 + r * STEP;
  const fx = cx(FOCUS.c);
  const fy = cy(FOCUS.r);
  const neighbours = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];
  return (
    <Svg width={W} height={H}>
      {Array.from({ length: ROWS }, (_, r) =>
        Array.from({ length: COLS }, (_, c) => {
          const na = isNa(r, c);
          const focus = r === FOCUS.r && c === FOCUS.c;
          return (
            <g key={`${r}-${c}`}>
              {focus && <circle cx={cx(c)} cy={cy(r)} r={R_NA + 7} className="dg-accent" />}
              <circle cx={cx(c)} cy={cy(r)} r={na ? R_NA : R_CL} className={na ? 'dg-thin dg-fill-accent' : 'dg-thin dg-fill-accent-2'} />
              <Label x={cx(c)} y={cy(r) + 1} className={na ? 'dg-text-small dg-bold' : 'dg-text dg-bold'}>
                {na ? '+' : '−'}
              </Label>
            </g>
          );
        }),
      )}

      {/* the highlighted Na+ is pulled towards each neighbouring Cl− */}
      {neighbours.map(([dx, dy]) => {
        const start = R_NA + 9;
        const end = STEP - R_CL - 4;
        return (
          <Arrow
            key={`${dx},${dy}`}
            x1={fx + dx! * start}
            y1={fy + dy! * start}
            x2={fx + dx! * end}
            y2={fy + dy! * end}
            head={7}
            className="dg-accent"
            headClassName="dg-dot-accent"
          />
        );
      })}

      {/* notes on the right */}
      <circle cx={440} cy={66} r={R_NA} className="dg-thin dg-fill-accent" />
      <Label x={440} y={67} className="dg-text-small dg-bold">
        +
      </Label>
      <Label x={464} y={66} anchor="start" className="dg-text">
        Na⁺ (95 pm)
      </Label>
      <circle cx={440} cy={118} r={R_CL} className="dg-thin dg-fill-accent-2" />
      <Label x={440} y={119} className="dg-text dg-bold">
        −
      </Label>
      <Label x={474} y={118} anchor="start" className="dg-text">
        Cl⁻ (181 pm)
      </Label>
      <Label x={424} y={176} anchor="start" className="dg-text-small">
        Highlighted Na⁺: pulled towards
      </Label>
      <Label x={424} y={194} anchor="start" className="dg-text-small">
        4 Cl⁻ in this layer, plus 1 above
      </Label>
      <Label x={424} y={212} anchor="start" className="dg-text-small">
        and 1 below: 6 in all.
      </Label>
      <Label x={424} y={244} anchor="start" className="dg-text-small dg-bold">
        Attraction in all directions;
      </Label>
      <Label x={424} y={262} anchor="start" className="dg-text-small dg-bold">
        no NaCl molecules.
      </Label>

      <Label x={W / 2} y={H - 24} className="dg-text-muted">
        one layer of the giant lattice (sizes in proportion, gaps stretched)
      </Label>
    </Svg>
  );
}

export default IonicBondingLatticeSlice;
