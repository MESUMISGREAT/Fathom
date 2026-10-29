/**
 * Polynomial long division set out as a grid: 2x³ − 5x² + 3x − 4 divided by
 * x − 2, giving quotient 2x² − x + 1 and remainder −2.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'math-p3-algebra-long-division';

const W = 560;
const H = 356;
const DIV_X = 128;
const X0 = 148;

const rows = [
  { y: 62, x: 0, text: '2x³ − 5x² + 3x − 4', tone: '' },
  { y: 92, x: 0, text: '2x³ − 4x²', tone: 'muted' },
  { y: 114, x: 0, line: true },
  { y: 138, x: 46, text: '−x² + 3x', tone: '' },
  { y: 168, x: 46, text: '−x² + 2x', tone: 'muted' },
  { y: 190, x: 46, line: true },
  { y: 214, x: 92, text: 'x − 4', tone: '' },
  { y: 244, x: 92, text: 'x − 2', tone: 'muted' },
  { y: 266, x: 92, line: true },
  { y: 290, x: 138, text: '−2', tone: 'accent' },
];

export function P3AlgebraLongDivision() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text dg-bold">
        Dividing 2x³ − 5x² + 3x − 4 by x − 2
      </Label>

      <Label x={X0 + 4} y={40} anchor="start" className="dg-text dg-mono dg-bold">
        2x² − x + 1
      </Label>
      <line x1={X0} y1={52} x2={500} y2={52} className="dg-line" />

      <Label x={DIV_X - 10} y={62} anchor="end" className="dg-text dg-mono">
        x − 2
      </Label>
      <line x1={DIV_X} y1={44} x2={DIV_X} y2={302} className="dg-line" />
      <line x1={DIV_X} y1={44} x2={X0} y2={44} className="dg-thin" />

      {rows.map((r, i) =>
        r.line ? (
          <line key={i} x1={X0 + 8 + r.x} y1={r.y} x2={X0 + 8 + r.x + 250} y2={r.y} className="dg-muted" />
        ) : (
          <Label
            key={i}
            x={X0 + 8 + r.x}
            y={r.y}
            anchor="start"
            className={`dg-text dg-mono ${r.tone === 'muted' ? 'dg-text-muted' : r.tone === 'accent' ? 'dg-text-accent' : ''}`}
          >
            {r.text}
          </Label>
        ),
      )}

      <Label x={20} y={330} anchor="start" className="dg-text-small dg-text-muted">
        each line is subtracted from the one above it
      </Label>
      <Label x={20} y={348} anchor="start" className="dg-text-small dg-text-accent">
        remainder −2
      </Label>
    </Svg>
  );
}

export default P3AlgebraLongDivision;
