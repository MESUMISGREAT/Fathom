/**
 * Assembly vs machine code (9618 4.2.1).
 * Top: one assembly instruction beside the 16-bit machine code word it becomes, split into a
 * 4-bit opcode field and a 12-bit operand field.
 * Bottom: a high-level statement fanning out into three assembly instructions (one-to-many),
 * next to a single assembly instruction dropping straight to one machine code word (one-to-one).
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-assembly-language-machine-code';

const W = 640;
const H = 400;

const CELL = 19;
const WORD = '0011000001100100';
const X0 = 210;

export function MachineCodeDiagram() {
  return (
    <Svg width={W} height={H}>
      <Label x={X0 + (4 * CELL) / 2} y={26} className="dg-text-small dg-text-muted">
        opcode (4 bits)
      </Label>
      <Label x={X0 + 4 * CELL + (12 * CELL) / 2} y={26} className="dg-text-small dg-text-muted">
        operand (12 bits)
      </Label>

      {[...WORD].map((b, i) => (
        <g key={i}>
          <rect
            x={X0 + i * CELL}
            y={40}
            width={CELL}
            height={30}
            className={i < 4 ? 'dg-fill-accent dg-thin' : 'dg-fill-muted dg-thin'}
          />
          <Label x={X0 + i * CELL + CELL / 2} y={56} className="dg-text-small dg-mono">
            {b}
          </Label>
        </g>
      ))}
      <Label x={X0 + 4 * CELL + 6} y={88} anchor="start" className="dg-text-small dg-text-muted">
        address 100
      </Label>

      <Label x={60} y={56} className="dg-text dg-mono">
        LDD 100
      </Label>
      <Label x={60} y={30} className="dg-text-small dg-text-muted">
        assembly
      </Label>
      <Arrow x1={120} y1={55} x2={X0 - 8} y2={55} head={8} />

      <Label x={X0 + (4 * CELL) / 2} y={110} className="dg-text-small dg-text-accent">
        what to do
      </Label>
      <Label x={X0 + 4 * CELL + (12 * CELL) / 2} y={110} className="dg-text-small dg-text-accent">
        what to do it to
      </Label>

      <line x1={20} y1={126} x2={W - 20} y2={126} className="dg-grid" />

      <Label x={165} y={150} className="dg-text-small dg-text-muted">
        one high-level statement
      </Label>
      <rect x={20} y={160} width={290} height={34} className="dg-fill-muted dg-thin" />
      <Label x={165} y={178} className="dg-text dg-mono">
        total = total + price
      </Label>

      <path d="M165,194 L165,202 L200,202 L200,312" className="dg-thin dg-muted" fill="none" />
      {['LDD 200', 'ADD 201', 'STO 200'].map((t, i) => (
        <g key={t}>
          <Arrow x1={200} y1={232 + i * 40} x2={174} y2={232 + i * 40} head={8} className="dg-muted" />
          <rect x={20} y={218 + i * 40} width={150} height={28} className="dg-fill-muted dg-thin" />
          <Label x={95} y={233 + i * 40} className="dg-text dg-mono">
            {t}
          </Label>
        </g>
      ))}
      <Label x={165} y={352} className="dg-text-small dg-text-accent">
        one-to-many
      </Label>

      <Label x={470} y={150} className="dg-text-small dg-text-muted">
        one assembly instruction
      </Label>
      <rect x={390} y={218} width={160} height={28} className="dg-fill-muted dg-thin" />
      <Label x={470} y={233} className="dg-text dg-mono">
        STO 200
      </Label>
      <Arrow x1={470} y1={246} x2={470} y2={276} head={8} />
      <rect x={390} y={280} width={160} height={28} className="dg-fill-accent dg-thin" />
      <Label x={470} y={295} className="dg-text-small dg-mono">
        0011 0000 1100 1000
      </Label>
      <Label x={470} y={330} className="dg-text-small dg-text-muted">
        one machine code word
      </Label>
      <Label x={470} y={352} className="dg-text-small dg-text-accent">
        1 → 1 (one-to-one)
      </Label>
    </Svg>
  );
}

export default MachineCodeDiagram;
