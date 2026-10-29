import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-logic-gates-truth-table';

const W = 620;
const H = 270;
const columns = ['A', 'B', 'NOT A', 'AND', 'OR', 'NAND', 'NOR', 'XOR'];
const rows = [
  ['0', '0', '1', '0', '0', '1', '1', '0'],
  ['0', '1', '1', '0', '1', '1', '0', '1'],
  ['1', '0', '0', '0', '1', '1', '0', '1'],
  ['1', '1', '0', '1', '1', '0', '0', '0'],
];
const X0 = 28;
const Y0 = 48;
const CW = 70;
const RH = 34;

export function LogicGatesTruthTable() {
  return (
    <Svg width={W} height={H}>
      {columns.map((column, c) => (
        <g key={column}>
          <rect x={X0 + c * CW} y={Y0} width={CW} height={RH} className="dg-fill-muted dg-thin" />
          <Label x={X0 + c * CW + CW / 2} y={Y0 + RH / 2} className="dg-text-small dg-bold">{column}</Label>
        </g>
      ))}
      {rows.map((row, r) => row.map((value, c) => (
        <g key={`${r}-${c}`}>
          <rect x={X0 + c * CW} y={Y0 + (r + 1) * RH} width={CW} height={RH} className="dg-thin" />
          <Label x={X0 + c * CW + CW / 2} y={Y0 + (r + 1) * RH + RH / 2} className={c === 7 ? 'dg-text-accent dg-bold' : 'dg-text'}>{value}</Label>
        </g>
      )))}
      <Label x={W / 2} y={H - 16} className="dg-text-small dg-text-muted">Rows follow 00, 01, 10, 11; 1 means true and 0 means false.</Label>
    </Svg>
  );
}

export default LogicGatesTruthTable;

