/**
 * Two's complement place values for one byte: the MSB is worth −128 and the
 * other columns keep their usual positive weights. 1101 0110 reads as
 * −128 + 64 + 16 + 4 + 2 = −42.
 */
import { Label, Svg } from '../primitives';
import { BitColumns, bitCentre } from './bit-columns';

const W = 600;
const H = 266;
const X0 = 40;
const Y = 72;

export function TwosComplementWeights() {
  return (
    <Svg width={W} height={H}>
      <Label x={bitCentre(X0, 0)} y={26} className="dg-text-accent-2">
        sign bit
      </Label>
      <Label x={(bitCentre(X0, 1) + bitCentre(X0, 7)) / 2} y={26} className="dg-text-muted">
        ordinary positive place values
      </Label>
      <line x1={bitCentre(X0, 1) - 24} y1={38} x2={bitCentre(X0, 7) + 24} y2={38} className="dg-grid" />
      <BitColumns
        x={X0}
        y={Y}
        bits="11010110"
        weights={['−128', '64', '32', '16', '8', '4', '2', '1']}
        special={[0]}
      />
      <Label x={W / 2} y={204} className="dg-text dg-bold">
        −128 + 64 + 16 + 4 + 2 = −42
      </Label>
      <Label x={W / 2} y={240} className="dg-text-muted">
        8-bit range: 1000 0000 = −128 up to 0111 1111 = +127
      </Label>
    </Svg>
  );
}
