/**
 * The two-pass assembler (9618 4.2.2).
 * The source listing is read twice: pass 1 builds the symbol table (loop = 102) and strips
 * comments; pass 2 uses that table to replace labels with addresses and emit object code.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-assembly-language-two-pass';

const W = 620;
const H = 350;

const source = [
  '100  LDM #3',
  '101  STO 200',
  '102  loop  LDD 200',
  '103        SUB 201',
  '104        STO 200',
  '105        CMP #0',
  '106        JPN loop',
  '107        END',
];

export function TwoPassDiagram() {
  return (
    <Svg width={W} height={H}>
      <Label x={130} y={26} className="dg-text-small dg-text-muted">
        source code
      </Label>
      <rect x={20} y={36} width={220} height={246} className="dg-fill-muted dg-thin" />
      {source.map((line, i) => (
        <Label key={line} x={32} y={57 + i * 27} anchor="start" className="dg-text-small dg-mono">
          {line}
        </Label>
      ))}

      <Arrow x1={240} y1={70} x2={314} y2={70} head={8} className="dg-muted" />
      <Arrow x1={240} y1={230} x2={314} y2={230} head={8} className="dg-muted" />

      <rect x={318} y={30} width={284} height={96} className="dg-thin dg-accent" />
      <Label x={332} y={50} anchor="start" className="dg-text dg-bold">
        Pass 1: find everything
      </Label>
      <Label x={332} y={72} anchor="start" className="dg-text-small">
        read each line, remove comments
      </Label>
      <Label x={332} y={90} anchor="start" className="dg-text-small">
        count addresses, add labels
      </Label>
      <Label x={332} y={112} anchor="start" className="dg-text-small dg-text-accent dg-mono">
        symbol table: loop → 102
      </Label>

      <rect x={318} y={178} width={284} height={96} className="dg-thin dg-accent" />
      <Label x={332} y={198} anchor="start" className="dg-text dg-bold">
        Pass 2: build the code
      </Label>
      <Label x={332} y={220} anchor="start" className="dg-text-small">
        read each line again, look up labels
      </Label>
      <Label x={332} y={238} anchor="start" className="dg-text-small">
        emit one machine code word per line
      </Label>
      <Label x={332} y={260} anchor="start" className="dg-text-small dg-text-accent dg-mono">
        JPN loop → JPN 102
      </Label>

      <Arrow x1={460} y1={126} x2={460} y2={174} head={8} />
      <Label x={470} y={152} anchor="start" className="dg-text-small dg-text-muted">
        symbol table
      </Label>

      <Label x={310} y={310} className="dg-text-small">
        both passes read the source one line at a time
      </Label>
    </Svg>
  );
}

export default TwoPassDiagram;
