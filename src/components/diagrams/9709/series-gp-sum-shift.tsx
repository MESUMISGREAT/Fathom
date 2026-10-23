/**
 * The multiply-and-subtract proof of the GP sum formula. Sₙ written in a row,
 * and rSₙ written underneath shifted one place right. Every term from ar to
 * arⁿ⁻¹ appears in both rows and cancels on subtraction, leaving
 * Sₙ − rSₙ = a − arⁿ.
 */
import { Label, Svg, MathLabel } from '../primitives';

export const diagramKey = 'series-gp-sum-shift';

const W = 620;
const H = 300;
const BW = 66;
const BH = 40;
const STEP = 80;
const X0 = 118;
const ROW1 = 70;
const ROW2 = 150;

const cols = ['a', 'ar', 'ar²', '⋯', 'arⁿ⁻¹', 'arⁿ'];

function Box({ col, y, kind }: { col: number; y: number; kind: 'keep1' | 'keep2' | 'cancel' | 'dots' }) {
  const x = X0 + col * STEP;
  const rect =
    kind === 'keep1' ? 'dg-accent dg-fill-accent' : kind === 'keep2' ? 'dg-accent-2 dg-fill-accent-2' : 'dg-muted dg-fill-muted';
  const text = kind === 'keep1' ? 'dg-text-accent' : kind === 'keep2' ? 'dg-text-accent-2' : 'dg-text-muted';
  return (
    <g>
      {kind !== 'dots' && <rect x={x} y={y - BH / 2} width={BW} height={BH} rx={8} className={rect} />}
      <Label x={x + BW / 2} y={y + 1} className={kind === 'dots' ? 'dg-text' : text}>
        {cols[col]}
      </Label>
    </g>
  );
}

export default function SeriesGpSumShift() {
  return (
    <Svg width={W} height={H}>
      <Label x={X0 - 14} y={ROW1} anchor="end" className="dg-text dg-bold">
        Sₙ =
      </Label>
      <Label x={X0 - 14} y={ROW2} anchor="end" className="dg-text dg-bold">
        rSₙ =
      </Label>

      {/* row 1: a + ar + ... + arⁿ⁻¹ */}
      <Box col={0} y={ROW1} kind="keep1" />
      {[1, 2, 4].map((c) => (
        <Box key={`r1${c}`} col={c} y={ROW1} kind="cancel" />
      ))}
      <Box col={3} y={ROW1} kind="dots" />

      {/* row 2: ar + ar² + ... + arⁿ, one place to the right */}
      {[1, 2, 4].map((c) => (
        <Box key={`r2${c}`} col={c} y={ROW2} kind="cancel" />
      ))}
      <Box col={3} y={ROW2} kind="dots" />
      <Box col={5} y={ROW2} kind="keep2" />

      {/* plus signs */}
      {[0, 1, 2, 3].map((c) => (
        <Label key={`p1${c}`} x={X0 + c * STEP + BW + 7} y={ROW1} className="dg-text-muted">
          +
        </Label>
      ))}
      {[1, 2, 3, 4].map((c) => (
        <Label key={`p2${c}`} x={X0 + c * STEP + BW + 7} y={ROW2} className="dg-text-muted">
          +
        </Label>
      ))}

      <Label x={W / 2} y={22} className="dg-text-small">
        Write rSₙ one place to the right, so equal terms sit in the same column
      </Label>
      {[1, 2, 4].map((c) => (
        <g key={`c${c}`}>
          <line
            x1={X0 + c * STEP + BW / 2}
            y1={ROW1 + BH / 2 + 4}
            x2={X0 + c * STEP + BW / 2}
            y2={ROW2 - BH / 2 - 4}
            className="dg-muted dg-dashed"
          />
          <Label x={X0 + c * STEP + BW / 2 + 6} y={(ROW1 + ROW2) / 2} anchor="start" className="dg-text-small">
            cancel
          </Label>
        </g>
      ))}

      <line x1={40} y1={196} x2={W - 30} y2={196} className="dg-thin" />
      <Label x={X0 - 14} y={226} anchor="end" className="dg-text dg-bold">
        Sₙ − rSₙ =
      </Label>
      <Label x={X0 + BW / 2} y={226} className="dg-text-accent">
        a
      </Label>
      <Label x={X0 + 2.5 * STEP + BW / 2} y={226} className="dg-text-muted">
        (everything in between cancels)
      </Label>
      <Label x={X0 + 5 * STEP + BW / 2} y={226} className="dg-text-accent-2">
        − arⁿ
      </Label>
      <MathLabel x={W / 2} y={268} w={610} h={46} tex={"S_n(1 - r) = a(1 - r^n),\\ \\text{so } S_n = \\dfrac{a(1 - r^n)}{1 - r}\\ \\text{for } r \\ne 1"} />
    </Svg>
  );
}
