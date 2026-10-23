/**
 * A semicircular "protractor" from 0° to 180°: each key angle is marked with its
 * size in degrees (inside) and in radians (outside). π rad = 180°.
 */
import { Label, Svg } from '../primitives';
import { arcPath, polar } from './p1-trigonometry-kit';

export const diagramKey = 'circular-measure-key-angles';

const W = 620;
const H = 300;
const C = { x: 310, y: 252 };
const R = 188;

const marks: { deg: number; rad: string }[] = [
  { deg: 0, rad: '0' },
  { deg: 30, rad: 'π/6' },
  { deg: 45, rad: 'π/4' },
  { deg: 60, rad: 'π/3' },
  { deg: 90, rad: 'π/2' },
  { deg: 120, rad: '2π/3' },
  { deg: 135, rad: '3π/4' },
  { deg: 150, rad: '5π/6' },
  { deg: 180, rad: 'π' },
];

export default function CircularMeasureKeyAngles() {
  return (
    <Svg width={W} height={H}>
      <path d={arcPath(C, R, 0, Math.PI)} className="dg-line" />
      <line x1={C.x - R - 6} y1={C.y} x2={C.x + R + 6} y2={C.y} className="dg-line" />
      {marks.map((m) => {
        const a = (m.deg * Math.PI) / 180;
        const end = polar(C, R, a);
        const tickIn = polar(C, R - 10, a);
        const inner = polar(C, R - 30, a);
        const outer = polar(C, R + 24, a);
        const edge = m.deg === 0 || m.deg === 180;
        return (
          <g key={m.deg}>
            {!edge && <line x1={C.x} y1={C.y} x2={end.x} y2={end.y} className="dg-grid" />}
            <line x1={tickIn.x} y1={tickIn.y} x2={end.x} y2={end.y} className="dg-line" />
            {edge ? (
              <>
                <Label x={end.x} y={C.y + 18} className="dg-text-small">
                  {`${m.deg}°`}
                </Label>
                <Label x={end.x + (m.deg === 0 ? 22 : -22)} y={C.y - 2} className="dg-text-accent">
                  {m.rad}
                </Label>
              </>
            ) : (
              <>
                <Label x={inner.x} y={inner.y} className="dg-text-small">
                  {`${m.deg}°`}
                </Label>
                <Label x={outer.x} y={outer.y} className="dg-text-accent">
                  {m.rad}
                </Label>
              </>
            )}
          </g>
        );
      })}
      <circle cx={C.x} cy={C.y} r={3.5} className="dg-dot" />
      <Label x={C.x} y={C.y - 52} className="dg-text dg-bold">
        π rad = 180°
      </Label>
      <Label x={C.x} y={C.y - 30} className="dg-text-small">
        degrees inside, radians outside
      </Label>
      <Label x={C.x} y={C.y + 20} className="dg-text-small dg-italic">
        O
      </Label>
    </Svg>
  );
}
