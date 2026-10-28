/**
 * The area under a force-extension graph, cut into thin strips. Each strip is one small step of
 * the stretch: the force at that step times the extra extension. Adding the strips gives the work
 * done by the stretching force.
 */
import { Label, MathLabel, Svg, axes, graph } from '../primitives';

export const diagramKey = 'phys-elastic-plastic-work-area';

const W = 560;
const H = 400;
const PAD = 60;

const { sx, sy } = axes({ width: W, height: H, pad: PAD, x: [0, 6], y: [0, 12] });

const k = 2;
const force = (x: number) => k * x;
const stripWidth = 0.5;
const stripCount = 10;

export function ElasticPlasticWorkArea() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text dg-bold">
        Work done = area under the graph
      </Label>

      {/* axes */}
      <line x1={sx(0)} y1={sy(0)} x2={sx(6)} y2={sy(0)} className="dg-line" />
      <line x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(12)} className="dg-line" />

      <Label x={sx(5.95)} y={sy(0) + 36} anchor="end" className="dg-text-small dg-text-muted">
        extension x
      </Label>
      <Label x={sx(0) - 12} y={sy(11.3)} anchor="end" className="dg-text-small dg-text-muted">
        force F
      </Label>

      {/* strips */}
      {Array.from({ length: stripCount }, (_, i) => {
        const x0 = i * stripWidth;
        const mid = x0 + stripWidth / 2;
        const top = force(mid);
        return (
          <rect
            key={i}
            x={sx(x0)}
            y={sy(top)}
            width={sx(x0 + stripWidth) - sx(x0)}
            height={sy(0) - sy(top)}
            className="dg-fill-accent"
            opacity={1}
            stroke="none"
          />
        );
      })}
      {Array.from({ length: stripCount + 1 }, (_, i) => {
        const x = i * stripWidth;
        return (
          <line
            key={i}
            x1={sx(x)}
            y1={sy(0)}
            x2={sx(x)}
            y2={sy(force(x))}
            className="dg-muted"
            strokeWidth={0.8}
          />
        );
      })}

      {/* the line */}
      <path d={graph(force, [0, 5], { sx, sy }, [0, 12])} className="dg-accent" strokeWidth={2.5} />

      {/* ticks */}
      {[1, 2, 3, 4, 5].map((t) => (
        <g key={t}>
          <line x1={sx(t)} y1={sy(0)} x2={sx(t)} y2={sy(0) + 5} className="dg-muted" />
          <Label x={sx(t)} y={sy(0) + 17} className="dg-text-small dg-text-muted">
            {t}
          </Label>
        </g>
      ))}
      {[2, 4, 6, 8, 10].map((t) => (
        <g key={t}>
          <line x1={sx(0)} y1={sy(t)} x2={sx(0) - 5} y2={sy(t)} className="dg-muted" />
          <Label x={sx(0) - 9} y={sy(t)} anchor="end" className="dg-text-small dg-text-muted">
            {t}
          </Label>
        </g>
      ))}

      {/* one highlighted strip */}
      <rect
        x={sx(3.0)}
        y={sy(force(3.25))}
        width={sx(3.5) - sx(3.0)}
        height={sy(0) - sy(force(3.25))}
        className="dg-fill-accent-2"
        opacity={1}
        stroke="none"
      />
      <MathLabel
        x={sx(3.2)}
        y={sy(9.4)}
        tex="\text{one strip} = F\,\Delta x"
        w={230}
        h={30}
        size="small"
      />
      <line
        x1={sx(3.12)}
        y1={sy(force(3.12)) + 6}
        x2={sx(3.12)}
        y2={sy(9.0)}
        className="dg-thin"
      />
      <MathLabel
        x={sx(3.25)}
        y={sy(10.6)}
        tex="W = \text{total area}"
        w={190}
        h={30}
        size="small"
        tone="accent"
      />
    </Svg>
  );
}

export default ElasticPlasticWorkArea;
