/**
 * Counting gas molecules on each side of three equilibria, which is the only step needed to
 * predict a pressure shift.
 *
 * Row 1: N2 + 3H2 ⇌ 2NH3 — 4 gas molecules become 2, so higher pressure shifts right.
 * Row 2: H2 + I2 ⇌ 2HI — 2 become 2, so pressure has no effect.
 * Row 3: 2NO2 ⇌ N2O4 — 2 become 1, so higher pressure shifts right.
 *
 * Subscripts are drawn as shifted tspans rather than Unicode subscript characters, because many
 * SVG text stacks have no glyphs for U+2080-2089 and silently fall back to full-size digits.
 * Solids and liquids never appear in these counts; a note says so.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-equilibria-count-gas-moles';

const W = 660;
const H = 400;

type Row = { eq: string; left: number; right: number; verdict: string; shifts: boolean };

const ROWS: Row[] = [
  {
    eq: 'N~2~(g) + 3H~2~(g) ⇌ 2NH~3~(g)',
    left: 4,
    right: 2,
    verdict: '4 gas molecules become 2, so more pressure shifts it right',
    shifts: true,
  },
  {
    eq: 'H~2~(g) + I~2~(g) ⇌ 2HI(g)',
    left: 2,
    right: 2,
    verdict: '2 become 2, so changing the pressure does nothing',
    shifts: false,
  },
  {
    eq: '2NO~2~(g) ⇌ N~2~O~4~(g)',
    left: 2,
    right: 1,
    verdict: '2 gas molecules become 1, so more pressure shifts it right',
    shifts: true,
  },
];

const ROW_TOP = 74;
const ROW_H = 98;
const LEFT_BADGE_X = 74;
const RIGHT_BADGE_X = 452;
const BADGE_R = 20;

/** Renders a formula string, turning ~x~ into a real subscript. */
function Chem({ x, y, text }: { x: number; y: number; text: string }) {
  const parts = text.split(/~([^~]*)~/);
  return (
    <text x={x} y={y} textAnchor="start" dominantBaseline="middle" className="dg-text">
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <tspan key={i} dy={4} fontSize="11">
            {part}
          </tspan>
        ) : (
          <tspan key={i} dy={i === 0 ? 0 : -4}>
            {part}
          </tspan>
        ),
      )}
    </text>
  );
}

export function ChemEquilibriaCountGasMoles() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={26} className="dg-text dg-bold">
        Count the gas molecules, then shift towards the fewer
      </Label>

      <Label x={LEFT_BADGE_X} y={ROW_TOP - 20} className="dg-text-small dg-text-muted">
        left
      </Label>
      <Label x={RIGHT_BADGE_X} y={ROW_TOP - 20} className="dg-text-small dg-text-muted">
        right
      </Label>

      {ROWS.map((r, i) => {
        const top = ROW_TOP + i * ROW_H;
        const cy = top + 18;
        return (
          <g key={r.eq}>
            <Chem x={114} y={cy} text={r.eq} />

            {/* left count badge */}
            <circle cx={LEFT_BADGE_X} cy={cy} r={BADGE_R} className="dg-fill-accent" />
            <Label x={LEFT_BADGE_X} y={cy} className="dg-text dg-bold dg-text-accent">
              {r.left}
            </Label>

            {/* right count badge */}
            <circle cx={RIGHT_BADGE_X} cy={cy} r={BADGE_R} className="dg-fill-accent-2" />
            <Label x={RIGHT_BADGE_X} y={cy} className="dg-text dg-bold dg-text-accent-2">
              {r.right}
            </Label>

            {/* verdict, on its own line so it never runs off the canvas */}
            <Label
              x={114}
              y={cy + 30}
              anchor="start"
              className={r.shifts ? 'dg-text-small dg-text-accent' : 'dg-text-small dg-text-muted'}
            >
              {r.verdict}
            </Label>
          </g>
        );
      })}

      <line x1={40} y1={H - 46} x2={W - 40} y2={H - 46} className="dg-grid" />
      <Label x={W / 2} y={H - 24} className="dg-text-small dg-text-muted">
        Count with the coefficients. Solids and liquids are never counted.
      </Label>
    </Svg>
  );
}

export default ChemEquilibriaCountGasMoles;
