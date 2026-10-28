/**
 * Check digit calculation (9618 6.2.2), modulus 11 with weights 10 down to 2 for the digits
 * 978030640. Products total 271; 271 mod 11 = 7; check digit = 11 - 7 = 4; the completed code
 * 9780306404 has a total of 275, a multiple of 11.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-data-integrity-check-digit';

const W = 640;
const H = 350;
const CELL = 44;
const X0 = 74;
const digits = ['9', '7', '8', '0', '3', '0', '6', '4', '0'];
const weights = ['10', '9', '8', '7', '6', '5', '4', '3', '2'];
const products = ['90', '63', '64', '0', '18', '0', '24', '12', '0'];

function Row({
  label,
  values,
  y,
  className = 'dg-fill-surface dg-thin',
  textClass = 'dg-text-small dg-mono',
}: {
  label: string;
  values: string[];
  y: number;
  className?: string;
  textClass?: string;
}) {
  return (
    <g>
      <Label x={X0 - 10} y={y + 15} anchor="end" className="dg-text-small dg-text-muted">
        {label}
      </Label>
      {values.map((v, i) => (
        <g key={`${label}-${i}`}>
          <rect x={X0 + i * CELL} y={y} width={CELL - 4} height={30} rx={3} className={className} />
          <Label x={X0 + i * CELL + (CELL - 4) / 2} y={y + 15} className={textClass}>
            {v}
          </Label>
        </g>
      ))}
    </g>
  );
}

export function CheckDigitDiagram() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={20} className="dg-text dg-bold">
        modulus 11 check digit for 978030640
      </Label>
      <Row label="digit" values={digits} y={40} className="dg-fill-muted dg-thin" textClass="dg-text-small dg-mono dg-bold" />
      <Row label="weight" values={weights} y={74} />
      <Row label="product" values={products} y={108} className="dg-fill-accent dg-thin" />

      <rect x={20} y={158} width={190} height={54} rx={6} className="dg-fill-surface dg-thin" />
      <Label x={115} y={176} className="dg-text-small dg-text-muted">
        add the products
      </Label>
      <Label x={115} y={198} className="dg-text dg-bold">
        271
      </Label>

      <rect x={225} y={158} width={190} height={54} rx={6} className="dg-fill-surface dg-thin" />
      <Label x={320} y={176} className="dg-text-small dg-text-muted">
        271 mod 11
      </Label>
      <Label x={320} y={198} className="dg-text dg-bold">
        remainder 7
      </Label>

      <rect x={430} y={158} width={190} height={54} rx={6} className="dg-fill-accent dg-thin" />
      <Label x={525} y={176} className="dg-text-small dg-text-muted">
        11 − 7
      </Label>
      <Label x={525} y={198} className="dg-text dg-bold">
        check digit 4
      </Label>

      <Label x={W / 2} y={232} className="dg-text-small">
        remainder 0 → check digit 0 · remainder 1 → check digit 10, written X
      </Label>

      <rect x={148} y={252} width={344} height={54} rx={6} className="dg-fill-muted dg-thin" />
      <Label x={320} y={270} className="dg-text-small dg-text-muted">
        completed code
      </Label>
      <Label x={320} y={290} className="dg-text dg-mono dg-bold">
        9780306404
      </Label>
      <Label x={320} y={330} className="dg-text-small dg-text-muted">
        271 + 4 = 275, which is 25 × 11: the completed code passes the test
      </Label>
    </Svg>
  );
}

export default CheckDigitDiagram;
