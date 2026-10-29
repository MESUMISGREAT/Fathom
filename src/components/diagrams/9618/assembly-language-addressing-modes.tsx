/**
 * Addressing modes (9618 4.2.5). Memory holds 40→44, 41→8, 42→99, 43→60, 44→17, 45→3 and
 * IX = 2. Each panel shows the hops the processor makes for the operand 40.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-assembly-language-addressing-modes';

const W = 620;
const H = 430;

type Panel = {
  title: string;
  hops: string[];
  acc: string;
  note: string;
  x: number;
  y: number;
};

const panels: Panel[] = [
  { title: 'immediate  LDM #40', hops: ['40 (the data)'], acc: 'ACC = 40', note: 'no memory read', x: 14, y: 26 },
  { title: 'direct  LDD 40', hops: ['addr 40', 'holds 44'], acc: 'ACC = 44', note: '1 read', x: 316, y: 26 },
  { title: 'indirect  LDI 40', hops: ['addr 40', 'holds 44', 'gives 17'], acc: 'ACC = 17', note: '2 reads', x: 14, y: 220 },
  { title: 'indexed  LDX 40', hops: ['40 + IX', 'addr 42', 'holds 99'], acc: 'ACC = 99', note: '1 read, after adding IX', x: 316, y: 220 },
];

function ModePanel({ p }: { p: Panel }) {
  return (
    <g>
      <rect x={p.x} y={p.y} width={290} height={182} className="dg-fill-surface dg-thin" />
      <Label x={p.x + 14} y={p.y + 22} anchor="start" className="dg-text-small dg-mono dg-bold">
        {p.title}
      </Label>
      {p.hops.map((h, i) => {
        const bw = p.hops.length === 1 ? 158 : 76;
        const bx = p.x + 14 + i * 90;
        return (
          <g key={h}>
            <rect x={bx} y={p.y + 46} width={bw} height={32} className="dg-fill-muted dg-thin" />
            <Label x={bx + bw / 2} y={p.y + 62} className="dg-text-small dg-mono">
              {h}
            </Label>
            {i < p.hops.length - 1 && (
              <Arrow x1={bx + bw + 1} y1={p.y + 62} x2={bx + bw + 13} y2={p.y + 62} head={7} className="dg-muted" />
            )}
          </g>
        );
      })}
      <Label x={p.x + 145} y={p.y + 110} className="dg-text dg-text-accent dg-bold">
        {p.acc}
      </Label>
      <Label x={p.x + 145} y={p.y + 134} className="dg-text-small dg-text-muted">
        {p.note}
      </Label>
      <Label x={p.x + 145} y={p.y + 162} className="dg-text-small">
        memory 40–45: 44 · 8 · 99 · 60 · 17 · 3
      </Label>
    </g>
  );
}

export function AddressingModesDiagram() {
  return (
    <Svg width={W} height={H}>
      {panels.map((p) => (
        <ModePanel key={p.title} p={p} />
      ))}
    </Svg>
  );
}

export default AddressingModesDiagram;
