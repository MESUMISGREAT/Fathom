/**
 * The 9618 registers and operand notation (4.2.3).
 * ACC is the only general purpose register; IX is loaded by copying ACC (MOV IX) or directly
 * (LDR #n). Below, the three number prefixes #, B and & with a worked value each.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-assembly-language-instruction-set';

const W = 620;
const H = 320;

const legend = [
  { p: '#25', kind: 'denary', value: '25' },
  { p: 'B1011', kind: 'binary', value: '11' },
  { p: '&4A', kind: 'hexadecimal', value: '74' },
];

export function InstructionSetDiagram() {
  return (
    <Svg width={W} height={H}>
      <Label x={160} y={28} className="dg-text-small dg-text-muted">
        accumulator
      </Label>
      <rect x={70} y={40} width={180} height={54} className="dg-fill-accent dg-thin" />
      <Label x={160} y={68} className="dg-text dg-bold">
        ACC
      </Label>

      <Label x={450} y={28} className="dg-text-small dg-text-muted">
        index register
      </Label>
      <rect x={360} y={40} width={180} height={54} className="dg-fill-muted dg-thin" />
      <Label x={450} y={68} className="dg-text dg-bold">
        IX
      </Label>

      <Label x={160} y={132} className="dg-text-small dg-mono">
        LDM #5
      </Label>
      <Arrow x1={160} y1={142} x2={160} y2={168} head={8} />
      <Label x={160} y={190} className="dg-text-small dg-text-muted">
        puts the number in ACC
      </Label>

      <Arrow x1={252} y1={67} x2={356} y2={67} head={8} />
      <Label x={304} y={50} className="dg-text-small dg-mono">
        MOV IX
      </Label>
      <Label x={304} y={114} className="dg-text-small dg-text-muted">
        copies ACC into IX
      </Label>

      <Label x={450} y={132} className="dg-text-small dg-mono">
        LDR #7
      </Label>
      <Arrow x1={450} y1={142} x2={450} y2={168} head={8} />
      <Label x={450} y={190} className="dg-text-small dg-text-muted">
        loads IX directly
      </Label>

      <line x1={20} y1={210} x2={W - 20} y2={210} className="dg-grid" />
      <Label x={20} y={232} anchor="start" className="dg-text-small dg-text-muted">
        operand prefixes
      </Label>

      {legend.map((l, i) => {
        const x = 20 + i * 200;
        return (
          <g key={l.p}>
            <rect x={x} y={244} width={180} height={56} className="dg-fill-surface dg-thin" />
            <Label x={x + 90} y={264} className="dg-text dg-mono dg-bold">
              {l.p}
            </Label>
            <Label x={x + 90} y={286} className="dg-text-small dg-text-muted">
              {l.kind} = {l.value}
            </Label>
          </g>
        );
      })}
    </Svg>
  );
}

export default InstructionSetDiagram;
