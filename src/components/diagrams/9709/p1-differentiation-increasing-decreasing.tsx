/**
 * Top: y = f(x) = x³ − 3x, coloured by direction: increasing for x < −1 and
 * x > 1, decreasing for −1 < x < 1. Bottom, same x-scale: f′(x) = 3x² − 3,
 * positive outside (−1, 1) and negative inside. Dashed guides at x = ±1.
 */
import { Label, Svg, graph } from '../primitives';
import { makePlot } from './kit';

export const diagramKey = 'p1-differentiation-increasing-decreasing';

const W = 560;
const H = 500;
const X: [number, number] = [-2.4, 2.4];
const YT: [number, number] = [-3.6, 3.6];
const YB: [number, number] = [-5, 7];
const f = (x: number) => x ** 3 - 3 * x;
const fd = (x: number) => 3 * x * x - 3;
const BOT = 262;

export default function P1DifferentiationIncreasingDecreasing() {
  const top = makePlot({ width: W, height: 240, pad: 26, x: X, y: YT });
  const bot = makePlot({ width: W, height: 220, pad: 26, x: X, y: YB });
  return (
    <Svg width={W} height={H}>
      {[-1, 1].map((x) => (
        <line key={x} x1={top.sx(x)} y1={top.sy(YT[1])} x2={top.sx(x)} y2={BOT + bot.sy(YB[0])} className="dg-grid dg-dashed" />
      ))}

      {/* top: f */}
      <line x1={top.sx(X[0])} y1={top.sy(0)} x2={top.sx(X[1])} y2={top.sy(0)} className="dg-thin" />
      <line x1={top.sx(0)} y1={top.sy(YT[0])} x2={top.sx(0)} y2={top.sy(YT[1])} className="dg-thin" />
      <path d={graph(f, [X[0], -1], top, YT)} className="dg-accent" />
      <path d={graph(f, [-1, 1], top, YT)} className="dg-accent-2" />
      <path d={graph(f, [1, X[1]], top, YT)} className="dg-accent" />
      <circle cx={top.sx(-1)} cy={top.sy(2)} r={4} className="dg-dot" />
      <circle cx={top.sx(1)} cy={top.sy(-2)} r={4} className="dg-dot" />
      <Label x={top.sx(-1)} y={top.sy(2) - 14} className="dg-text-small">
        (−1, 2)
      </Label>
      <Label x={top.sx(1)} y={top.sy(-2) + 15} className="dg-text-small">
        (1, −2)
      </Label>
      <Label x={top.sx(-1.72)} y={top.sy(-1.6)} anchor="start" className="dg-text-accent">
        increasing
      </Label>
      <Label x={top.sx(0.22)} y={top.sy(1.1)} anchor="start" className="dg-text-accent-2">
        decreasing
      </Label>
      <Label x={top.sx(1.8)} y={top.sy(1.5)} anchor="end" className="dg-text-accent">
        increasing
      </Label>
      <Label x={top.sx(-2.3)} y={top.sy(3.2)} anchor="start" className="dg-text">
        y = x³ − 3x
      </Label>
      <Label x={top.sx(X[1])} y={top.sy(0) + 14} anchor="end" className="dg-text-small dg-italic">
        x
      </Label>

      {/* bottom: f′ */}
      <g transform={`translate(0, ${BOT})`}>
        <line x1={bot.sx(X[0])} y1={bot.sy(0)} x2={bot.sx(X[1])} y2={bot.sy(0)} className="dg-thin" />
        <line x1={bot.sx(0)} y1={bot.sy(YB[0])} x2={bot.sx(0)} y2={bot.sy(YB[1])} className="dg-thin" />
        <path d={graph(fd, X, bot, YB)} className="dg-line" />
        <circle cx={bot.sx(-1)} cy={bot.sy(0)} r={4} className="dg-dot" />
        <circle cx={bot.sx(1)} cy={bot.sy(0)} r={4} className="dg-dot" />
        <Label x={bot.sx(-1) - 6} y={bot.sy(0) + 14} anchor="end" className="dg-text-small">
          −1
        </Label>
        <Label x={bot.sx(1) + 6} y={bot.sy(0) + 14} anchor="start" className="dg-text-small">
          1
        </Label>
        <Label x={bot.sx(-1.75)} y={bot.sy(1.6)} className="dg-text-accent">
          f′(x) &gt; 0
        </Label>
        <Label x={bot.sx(0.15)} y={bot.sy(-4.1)} anchor="start" className="dg-text-accent-2">
          f′(x) &lt; 0
        </Label>
        <Label x={bot.sx(1.75)} y={bot.sy(1.6)} className="dg-text-accent">
          f′(x) &gt; 0
        </Label>
        <Label x={bot.sx(0.15)} y={bot.sy(6.3)} anchor="start" className="dg-text">
          f′(x) = 3x² − 3
        </Label>
        <Label x={bot.sx(X[1])} y={bot.sy(0) + 14} anchor="end" className="dg-text-small dg-italic">
          x
        </Label>
      </g>
    </Svg>
  );
}
