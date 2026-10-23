/**
 * The unit circle definition of sine and cosine, for θ = 150°. P is the point on
 * the circle x² + y² = 1 reached by turning θ anticlockwise from the positive
 * x-axis, so P = (cos θ, sin θ) = (−0.866, 0.5). The acute angle between OP and
 * the x-axis is 30°.
 */
import { Label, Svg } from "../primitives";
import { makePlot } from "./kit";
import { TrigAxes, arcPath, cosd, rad, sind } from "./p1-trigonometry-kit";

export const diagramKey = "p1-trigonometry-unit-circle";

const W = 640;
const H = 380;
const TH = 150;

export default function P1TrigonometryUnitCircle() {
  const p = makePlot({
    width: 380,
    height: 380,
    pad: 34,
    x: [-1.4, 1.4],
    y: [-1.4, 1.4],
  });
  const O = { x: p.sx(0), y: p.sy(0) };
  const r = p.sx(1) - p.sx(0);
  const P = { x: p.sx(cosd(TH)), y: p.sy(sind(TH)) };
  const N = { x: P.x, y: O.y };
  const thLbl = {
    x: O.x + 30 * Math.cos(rad(70)),
    y: O.y - 30 * Math.sin(rad(70)),
  };
  const refLbl = {
    x: O.x + 62 * Math.cos(rad(166)),
    y: O.y - 62 * Math.sin(rad(166)),
  };
  return (
    <Svg width={W} height={H}>
      <g transform="translate(40, 0)">
        <TrigAxes
          p={p}
          xTicks={[
            { v: 1, label: "1", dx: 8 },
            { v: -1, label: "−1", dx: -10 },
          ]}
          yTicks={[
            { v: 1, label: "1", dx: 18, dy: -10, anchor: "start" },
            { v: -1, label: "−1", dx: 18, dy: 10, anchor: "start" },
          ]}
        />
        <circle cx={O.x} cy={O.y} r={r} className="dg-thin" />
        <line x1={O.x} y1={O.y} x2={N.x} y2={N.y} className="dg-accent-2" />
        <line x1={N.x} y1={N.y} x2={P.x} y2={P.y} className="dg-accent-2" />
        <line x1={O.x} y1={O.y} x2={P.x} y2={P.y} className="dg-line" />
        <path d={arcPath(O, 20, 0, rad(TH))} className="dg-accent" />
        <path d={arcPath(O, 44, rad(TH), Math.PI)} className="dg-muted" />
        <circle cx={P.x} cy={P.y} r={4.5} className="dg-dot-accent" />
        <Label
          x={P.x - 8}
          y={P.y - 16}
          anchor="end"
          className="dg-text dg-italic"
        >
          P(cos θ, sin θ)
        </Label>
        <Label
          x={(O.x + P.x) / 2 + 8}
          y={(O.y + P.y) / 2 - 12}
          className="dg-text-small"
        >
          1
        </Label>
        <Label
          x={thLbl.x + 4}
          y={thLbl.y - 6}
          anchor="start"
          className="dg-text-accent"
        >
          θ
        </Label>
        <Label
          x={refLbl.x - 2}
          y={refLbl.y - 4}
          anchor="end"
          className="dg-text-small"
        >
          30°
        </Label>
        <Label
          x={(O.x + N.x) / 2 + 8}
          y={O.y + 16}
          className="dg-text-accent-2"
        >
          cos θ
        </Label>
        <Label
          x={p.sx(-Math.sqrt(1 - (sind(TH) / 2) ** 2)) - 5}
          y={(N.y + P.y) / 2 + 2}
          anchor="end"
          className="dg-text-accent-2"
        >
          sin θ
        </Label>
      </g>

      <g>
        <Label x={520} y={70} className="dg-text-accent">
          θ = 150°
        </Label>
        <Label x={520} y={100} className="dg-text-small">
          P = (cos 150°, sin 150°)
        </Label>
        <Label x={520} y={120} className="dg-text-small">
          = (−0.866, 0.5)
        </Label>
        <Label x={520} y={160} className="dg-text-small">
          {"x < 0, so cos 150° < 0"}
        </Label>
        <Label x={520} y={180} className="dg-text-small">
          {"y > 0, so sin 150° > 0"}
        </Label>
        <Label x={520} y={220} className="dg-text-small">
          tan θ = y ÷ x = sin θ ÷ cos θ
        </Label>
        <Label x={520} y={260} className="dg-text-small">
          acute angle to the x-axis: 30°
        </Label>
      </g>
    </Svg>
  );
}
