/**
 * The cost of translation: compiling pays it once and then runs fast, while
 * interpreting repeats translate-then-execute on every run. Grey cells are
 * translation work, orange cells are execution.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-language-translators-compile-vs-interpret';

const W = 590;
const H = 320;
const X0 = 132;
const CELL_W = 58;
const CELL_H = 32;
const GAP = 8;

export function LanguageTranslatorsCompileVsInterpret() {
  const cell = (x: number, y: number, kind: 't' | 'r', w = CELL_W) => (
    <rect
      key={`${x}-${y}`}
      x={x}
      y={y}
      width={w}
      height={CELL_H}
      rx={4}
      className={kind === 't' ? 'dg-fill-accent dg-thin' : 'dg-fill-accent-2 dg-thin'}
    />
  );

  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        Pay for translation once, or every time
      </Label>

      <rect x={X0} y={46} width={CELL_W - 20} height={16} rx={3} className="dg-fill-accent dg-thin" />
      <Label x={X0 + CELL_W - 8} y={55} anchor="start" className="dg-text-small dg-text-muted">
        translate
      </Label>
      <rect x={X0 + 152} y={46} width={CELL_W - 20} height={16} rx={3} className="dg-fill-accent-2 dg-thin" />
      <Label x={X0 + 152 + CELL_W - 10} y={55} anchor="start" className="dg-text-small dg-text-muted">
        execute
      </Label>

      <Label x={X0 - 18} y={110} anchor="end" className="dg-text dg-bold">
        compiled
      </Label>
      {cell(X0, 92, 't', 142)}
      <Label x={X0 + 71} y={110} className="dg-text-small dg-text">
        once
      </Label>
      {[0, 1, 2].map((i) => cell(X0 + 152 + i * (CELL_W + GAP), 92, 'r'))}

      <line x1={30} y1={140} x2={W - 30} y2={140} className="dg-grid" />

      <Label x={X0 - 18} y={172} anchor="end" className="dg-text dg-bold">
        run 1
      </Label>
      <Label x={X0 - 18} y={240} anchor="end" className="dg-text dg-bold">
        run 2
      </Label>

      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={`r1-${i}`}>
          {cell(X0 + i * (CELL_W + GAP), 154, i % 2 === 0 ? 't' : 'r')}
          {cell(X0 + i * (CELL_W + GAP), 222, i % 2 === 0 ? 't' : 'r')}
        </g>
      ))}

      <Label x={W / 2} y={H - 34} className="dg-text-small dg-text">
        compiled: translate once, then run as often as you like
      </Label>
      <Label x={W / 2} y={H - 14} className="dg-text-small dg-text-muted">
        interpreted: every run translates each statement again
      </Label>
    </Svg>
  );
}

export default LanguageTranslatorsCompileVsInterpret;
