import { Canvas, XAxis, YAxis, Line, MathLabel, TickMark, TickLabel, PlotArea } from "../primitives";

export const diagramKey = "chem-bronsted-lowry-titration-curves";

const colors = {
  strongStrong: "var(--dg-primary)",
  weakStrong: "var(--dg-secondary)",
  strongWeak: "var(--dg-accent)",
  weakWeak: "var(--dg-muted)",
};

const width = 700;
const height = 450;
const margin = { top: 40, right: 40, bottom: 60, left: 70 };
const plotWidth = width - margin.left - margin.right;
const plotHeight = height - margin.top - margin.bottom;

function xVol(v: number) {
  return margin.left + (v / 50) * plotWidth;
}
function yPH(pH: number) {
  return margin.top + plotHeight - (pH / 14) * plotHeight;
}

function strongStrongCurve() {
  const pts = [];
  for (let v = 0; v <= 50; v += 0.5) {
    let pH: number;
    if (v < 24.5) pH = 1 + 0.1 * v;
    else if (v < 25.5) pH = 3.45 + (10.5 - 3.45) * ((v - 24.5) / 1);
    else pH = 11 + 0.04 * (v - 25.5);
    pts.push({ x: xVol(v), y: yPH(Math.min(14, Math.max(0, pH))) });
  }
  return pts;
}

function weakStrongCurve() {
  const pts = [];
  for (let v = 0; v <= 50; v += 0.5) {
    let pH: number;
    if (v < 10) pH = 2.9 + 0.15 * v;
    else if (v < 20) pH = 4.4 + 0.03 * (v - 10);
    else if (v < 24.5) pH = 4.7 + 0.3 * (v - 20);
    else if (v < 25.5) pH = 6.05 + (10.2 - 6.05) * ((v - 24.5) / 1);
    else pH = 10.2 + 0.04 * (v - 25.5);
    pts.push({ x: xVol(v), y: yPH(Math.min(14, Math.max(0, pH))) });
  }
  return pts;
}

function strongWeakCurve() {
  const pts = [];
  for (let v = 0; v <= 50; v += 0.5) {
    let pH: number;
    if (v < 10) pH = 1 + 0.2 * v;
    else if (v < 20) pH = 3 + 0.15 * (v - 10);
    else if (v < 24.5) pH = 4.5 + 0.3 * (v - 20);
    else if (v < 25.5) pH = 5.85 + (7.2 - 5.85) * ((v - 24.5) / 1);
    else pH = 7.2 + 0.03 * (v - 25.5);
    pts.push({ x: xVol(v), y: yPH(Math.min(14, Math.max(0, pH))) });
  }
  return pts;
}

function weakWeakCurve() {
  const pts = [];
  for (let v = 0; v <= 50; v += 0.5) {
    let pH: number;
    if (v < 10) pH = 3.5 + 0.1 * v;
    else if (v < 20) pH = 4.5 + 0.05 * (v - 10);
    else if (v < 24.5) pH = 5.0 + 0.15 * (v - 20);
    else if (v < 25.5) pH = 5.675 + (6.3 - 5.675) * ((v - 24.5) / 1);
    else pH = 6.3 + 0.02 * (v - 25.5);
    pts.push({ x: xVol(v), y: yPH(Math.min(14, Math.max(0, pH))) });
  }
  return pts;
}

export default function BronstedLowryTitrationCurves() {
  const ss = strongStrongCurve();
  const ws = weakStrongCurve();
  const sw = strongWeakCurve();
  const ww = weakWeakCurve();

  return (
    <Canvas width={width} height={height}>
      <PlotArea x={margin.left} y={margin.top} width={plotWidth} height={plotHeight} />

      <YAxis
        x={margin.left}
        y={margin.top}
        length={plotHeight}
        min={0}
        max={14}
        label="pH"
        tickCount={8}
        tickFormatter={(v) => v.toFixed(0)}
      >
        <TickMark y={yPH(7)} length={plotWidth} className="dg-grid" />
        <TickLabel y={yPH(7)} x={margin.left - 12} text="7" className="dg-grid-label" />
      </YAxis>

      <XAxis
        x={margin.left}
        y={margin.top + plotHeight}
        length={plotWidth}
        min={0}
        max={50}
        label={<MathLabel tex="V / cm^3" />}
        tickCount={6}
        tickFormatter={(v) => v.toFixed(0)}
      >
        <TickMark x={xVol(25)} length={-plotHeight} className="dg-grid" />
        <TickLabel x={xVol(25)} y={margin.top + plotHeight + 20} text="25" className="dg-grid-label" />
      </XAxis>

      <Line points={ss} stroke={colors.strongStrong} strokeWidth={2.5} />
      <Line points={ws} stroke={colors.weakStrong} strokeWidth={2.5} />
      <Line points={sw} stroke={colors.strongWeak} strokeWidth={2.5} />
      <Line points={ww} stroke={colors.weakWeak} strokeWidth={2.5} strokeDasharray="6,4" />

      <MathLabel x={width - 180} y={50} tex="\text{Strong acid + Strong base}" size={12} color={colors.strongStrong} />
      <MathLabel x={width - 180} y={70} tex="\text{Weak acid + Strong base}" size={12} color={colors.weakStrong} />
      <MathLabel x={width - 180} y={90} tex="\text{Strong acid + Weak base}" size={12} color={colors.strongWeak} />
      <MathLabel x={width - 180} y={110} tex="\text{Weak acid + Weak base}" size={12} color={colors.weakWeak} />

      <MathLabel x={xVol(25)} y={yPH(7) - 15} tex="\text{Eq. pt. pH = 7}" size={11} color={colors.strongStrong} />
      <MathLabel x={xVol(25)} y={yPH(8.7) - 15} tex="\text{Eq. pt. pH > 7}" size={11} color={colors.weakStrong} />
      <MathLabel x={xVol(25)} y={yPH(5.3) + 15} tex="\text{Eq. pt. pH < 7}" size={11} color={colors.strongWeak} />
      <MathLabel x={xVol(25)} y={yPH(6) + 15} tex="\text{No sharp jump}" size={11} color={colors.weakWeak} />
    </Canvas>
  );
}