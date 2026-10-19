/**
 * Binary place value: the eight column weights of a byte (2⁷ ... 2⁰) above the
 * bits of 1011 0101, with each 1 bit pointing down to the value it adds.
 * 128 + 32 + 16 + 4 + 1 = 181.
 */
import { Label, Svg } from '../primitives';
import { BitColumns, bitCentre } from './bit-columns';

const W = 600;
const H = 252;
const X0 = 40; // (600 - (8 * 58 + 7 * 8)) / 2
const Y = 72;

export function BinaryPlaceValue() {
  return (
    <Svg width={W} height={H}>
      <BitColumns
        x={X0}
        y={Y}
        bits="10110101"
        weights={['128', '64', '32', '16', '8', '4', '2', '1']}
        powers={['2⁷', '2⁶', '2⁵', '2⁴', '2³', '2²', '2¹', '2⁰']}
      />
      <Label x={W / 2} y={204} className="dg-text dg-bold">
        128 + 32 + 16 + 4 + 1 = 181
      </Label>
      <Label x={bitCentre(X0, 0) - 29} y={236} anchor="start" className="dg-text-muted">
        ← most significant bit (MSB)
      </Label>
      <Label x={bitCentre(X0, 7) + 29} y={236} anchor="end" className="dg-text-muted">
        least significant bit (LSB) →
      </Label>
    </Svg>
  );
}
