/**
 * Top: y = x² with short tangents at x = −2, −1, 0, 1, 2 (gradients −4, −2, 0,
 * 2, 4). Bottom, same x-scale: the gradient function dy/dx = 2x, with those
 * five gradients plotted as points on it. Dashed guides link each tangent to
 * its point.
 */
import { Label, Svg, graph } from '../primitives';
import { makePlot } from './kit';

export const diagramKey = 'p1-differentiation-gradient-function';

const W = 560;
const H = 520;
const X: [number, number] = [-2.6, 2.6];
const YT: [number, number] = [-0.6, 6.4];
const YB: [number, number] = [-5.4, 5.4];
const xs = [-2, -1, 0, 1, 2];
const fmt = (n: number) => (n < 0 ? `−${Math.abs(n)}` : `${n}`);

export default function P1DifferentiationGradientFunction() {
  const top = makePlot({ width: W, height: 240, pad: 30, x: X, y: YT });
  const bot = makePlot({ width: W, height: 240, pad: 30, x: X, y: YB });
  const BOT = 268; // y-offset of the lower panel
  return (
    <Svg width={W} height={H}>
      {/* guides */}
      {xs.map((x) => (
        <line key={`g${x}`} x1={top.sx(x)} y1={top.sy(x * x)} x2={top.sx(x)} y2={BOT + bot.sy(2 * x)} className="dg-grid dg-dashed" />
      ))}

      {/* top panel: y = x² */}
      <line x1={top.sx(X[0])} y1={top.sy(0)} x2={top.sx(X[1])} y2={top.sy(0)} className="dg-thin" />
      <line x1={top.sx(0)} y1={top.sy(YT[0])} x2={top.sx(0)} y2={top.sy(YT[1])} className="dg-thin" />
      <path d={graph((x) => x * x, X, top, YT)} className="dg-accent" />
      {xs.map((x) => {
        const m = 2 * x;
        const dx = 0.42 / Math.sqrt(1 + (m * 0.38) ** 2);
        return (
          <g key={`t${x}`}>
            <line
              x1={top.sx(x - dx)}
              y1={top.sy(x * x - m * dx)}
              x2={top.sx(x + dx)}
              y2={top.sy(x * x + m * dx)}
              className="dg-accent-2"
            />
            <circle cx={top.sx(x)} cy={top.sy(x * x)} r={4} className="dg-dot-accent-2" />
            <Label x={top.sx(x) + (x < 0 ? -10 : 10)} y={top.sy(x * x) - (x === 0 ? 16 : 4)} anchor={x < 0 ? 'end' : x === 0 ? 'middle' : 'start'} className="dg-text-small">
              {`gradient ${fmt(m)}`}
            </Label>
          </g>
        );
      })}
      <Label x={top.sx(-2.45)} y={top.sy(6.1)} anchor="start" className="dg-text-accent">
        y = x²
      </Label>
      <Label x={top.sx(X[1]) + 2} y={top.sy(0) + 14} anchor="end" className="dg-text-small dg-italic">
        x
      </Label>

      {/* bottom panel: dy/dx = 2x */}
      <g transform={`translate(0, ${BOT})`}>
        <line x1={bot.sx(X[0])} y1={bot.sy(0)} x2={bot.sx(X[1])} y2={bot.sy(0)} className="dg-thin" />
        <line x1={bot.sx(0)} y1={bot.sy(YB[0])} x2={bot.sx(0)} y2={bot.sy(YB[1])} className="dg-thin" />
        <path d={graph((x) => 2 * x, X, bot, YB)} className="dg-accent-2" />
        {xs.map((x) => (
          <g key={`b${x}`}>
            <circle cx={bot.sx(x)} cy={bot.sy(2 * x)} r={5} className="dg-dot-accent-2" />
            <Label x={bot.sx(x) + 9} y={bot.sy(2 * x) + 12} anchor="start" className="dg-text-small">
              {`(${fmt(x)}, ${fmt(2 * x)})`}
            </Label>
          </g>
        ))}
        <Label x={bot.sx(-2.45)} y={bot.sy(4.6)} anchor="start" className="dg-text-accent-2">
          dy/dx = 2x
        </Label>
        <Label x={bot.sx(-2.45)} y={bot.sy(4.6) + 20} anchor="start" className="dg-text-muted">
          the gradient function
        </Label>
        <Label x={bot.sx(X[1]) + 2} y={bot.sy(0) + 14} anchor="end" className="dg-text-small dg-italic">
          x
        </Label>
      </g>
    </Svg>
  );
}
