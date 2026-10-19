/**
 * f(x) = 2x + 3 as a two-step machine, and its inverse as the same steps undone
 * in reverse order. Top row (left to right): 4 → ×2 → 8 → +3 → 11.
 * Bottom row (right to left): 11 → −3 → 8 → ÷2 → 4, so f⁻¹(x) = (x − 3)/2.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'functions-inverse-undo';

const W = 600;
const H = 310;
const BW = 100;
const BH = 50;

function Box({ x, y, text, accent }: { x: number; y: number; text: string; accent: boolean }) {
  return (
    <g>
      <rect
        x={x - BW / 2}
        y={y - BH / 2}
        width={BW}
        height={BH}
        rx={12}
        className={accent ? 'dg-accent dg-fill-accent' : 'dg-accent-2 dg-fill-accent-2'}
      />
      <Label x={x} y={y} className={accent ? 'dg-text-accent' : 'dg-text-accent-2'}>
        {text}
      </Label>
    </g>
  );
}

function Value({ x, y, v }: { x: number; y: number; v: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={19} className="dg-thin dg-fill-muted" />
      <Label x={x} y={y} className="dg-text dg-bold">
        {v}
      </Label>
    </g>
  );
}

export default function FunctionsInverseUndo() {
  const cols = [50, 175, 300, 425, 550];
  const top = 95;
  const bot = 225;
  return (
    <Svg width={W} height={H}>
      <Label x={20} y={top - 50} anchor="start" className="dg-text dg-bold">
        {'f(x) = 2x + 3: multiply by 2, then add 3'}
      </Label>
      <Value x={cols[0]!} y={top} v="4" />
      <Arrow x1={cols[0]! + 21} y1={top} x2={cols[1]! - BW / 2 - 3} y2={top} head={8} className="dg-thin" />
      <Box x={cols[1]!} y={top} text="× 2" accent />
      <Arrow x1={cols[1]! + BW / 2 + 3} y1={top} x2={cols[2]! - 22} y2={top} head={8} className="dg-thin" />
      <Value x={cols[2]!} y={top} v="8" />
      <Arrow x1={cols[2]! + 21} y1={top} x2={cols[3]! - BW / 2 - 3} y2={top} head={8} className="dg-thin" />
      <Box x={cols[3]!} y={top} text="+ 3" accent />
      <Arrow x1={cols[3]! + BW / 2 + 3} y1={top} x2={cols[4]! - 22} y2={top} head={8} className="dg-thin" />
      <Value x={cols[4]!} y={top} v="11" />

      <line x1={20} y1={157} x2={W - 20} y2={157} className="dg-grid" />

      <Label x={20} y={bot - 50} anchor="start" className="dg-text dg-bold">
        {'f⁻¹(x) = (x − 3)/2: undo each step, last one first'}
      </Label>
      <Value x={cols[4]!} y={bot} v="11" />
      <Arrow x1={cols[4]! - 21} y1={bot} x2={cols[3]! + BW / 2 + 3} y2={bot} head={8} className="dg-thin" />
      <Box x={cols[3]!} y={bot} text="− 3" accent={false} />
      <Arrow x1={cols[3]! - BW / 2 - 3} y1={bot} x2={cols[2]! + 22} y2={bot} head={8} className="dg-thin" />
      <Value x={cols[2]!} y={bot} v="8" />
      <Arrow x1={cols[2]! - 21} y1={bot} x2={cols[1]! + BW / 2 + 3} y2={bot} head={8} className="dg-thin" />
      <Box x={cols[1]!} y={bot} text="÷ 2" accent={false} />
      <Arrow x1={cols[1]! - BW / 2 - 3} y1={bot} x2={cols[0]! + 22} y2={bot} head={8} className="dg-thin" />
      <Value x={cols[0]!} y={bot} v="4" />

      <Label x={W / 2} y={H - 16} className="dg-text-muted">
        {'f(4) = 11 and f⁻¹(11) = 4: the inverse sends every output back home.'}
      </Label>
    </Svg>
  );
}
