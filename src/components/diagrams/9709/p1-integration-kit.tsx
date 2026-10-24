/**
 * Shared furniture for the P1 integration diagrams: numbered method steps (one step can be
 * highlighted as "the step people forget"), and paths for shaded regions between two graphs.
 * Not a diagram itself, so it has no diagramKey and is not registered in index.ts.
 */
import { Label, MathLabel } from '../primitives';
import type { Plot } from './kit';

export interface Step {
  text: string;
  tex: string;
}

/** Numbered rows: circle with the number, the words, then the maths on the right. */
export function StepRows({
  steps,
  top,
  gap,
  keyIndex,
  mathX,
  mathW = 300,
  mathH = 48,
}: {
  steps: Step[];
  top: number;
  gap: number;
  keyIndex?: number;
  mathX: number;
  mathW?: number;
  mathH?: number;
}) {
  return (
    <g>
      {steps.map((s, i) => {
        const y = top + i * gap;
        const key = i === keyIndex;
        return (
          <g key={s.text}>
            <circle cx={34} cy={y} r={12} className={key ? 'dg-accent-2 dg-fill-accent-2' : 'dg-thin dg-fill-muted'} />
            <Label x={34} y={y + 1} className="dg-text dg-bold">
              {String(i + 1)}
            </Label>
            <Label x={56} y={y} anchor="start" className={key ? 'dg-text-accent-2 dg-bold' : 'dg-text'}>
              {s.text}
            </Label>
            <MathLabel x={mathX} y={y} w={mathW} h={mathH} size="large" tex={s.tex} />
          </g>
        );
      })}
    </g>
  );
}

/**
 * Closed path for the region between y = top(x) and y = bottom(x) for a ≤ x ≤ b,
 * in screen coordinates of plot p.
 */
export function regionPath(
  p: Plot,
  top: (x: number) => number,
  bottom: (x: number) => number,
  a: number,
  b: number,
  steps = 120,
): string {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = a + ((b - a) * i) / steps;
    pts.push(`${p.sx(x).toFixed(2)},${p.sy(top(x)).toFixed(2)}`);
  }
  for (let i = steps; i >= 0; i--) {
    const x = a + ((b - a) * i) / steps;
    pts.push(`${p.sx(x).toFixed(2)},${p.sy(bottom(x)).toFixed(2)}`);
  }
  return `M${pts.join(' L')} Z`;
}

/** SVG path for an ellipse centred on (cx, cy) with radii rx, ry (screen units). */
export function ellipsePath(cx: number, cy: number, rx: number, ry: number): string {
  return `M${cx - rx},${cy} a${rx},${ry} 0 1,0 ${2 * rx},0 a${rx},${ry} 0 1,0 ${-2 * rx},0 Z`;
}
