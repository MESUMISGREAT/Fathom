/**
 * Standardising a normal variable: the area P(X < 38) for X ~ N(30, 5²) is the
 * same as P(Z < 1.6) for the standard normal Z ~ N(0, 1), because z = (x − μ)/σ.
 */
import { Arrow, Label, MathLabel, Svg, graph } from '../primitives';
import { makePlot } from './kit';

export const diagramKey = 'normal-distribution-standardising';

const PW = 270;
const PH = 200;
const pdfZ = (z: number) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
const pdfX = (x: number) => Math.exp(-0.5 * ((x - 30) / 5) ** 2) / (5 * Math.sqrt(2 * Math.PI));

const LX: [number, number] = [12, 48];
const LY: [number, number] = [0, 0.09];
const ZX: [number, number] = [-3, 3];
const ZY: [number, number] = [0, 0.46];

export default function NormalDistributionStandardising() {
  const pl = makePlot({ width: PW, height: PH, pad: 16, x: LX, y: LY });
  const pr = makePlot({ width: PW, height: PH, pad: 16, x: ZX, y: ZY });
  const shadeL = `${graph(pdfX, [LX[0], 38], pl, LY)} L${pl.sx(38)},${pl.sy(0)} L${pl.sx(LX[0])},${pl.sy(0)} Z`;
  const shadeR = `${graph(pdfZ, [ZX[0], 1.6], pr, ZY)} L${pr.sx(1.6)},${pr.sy(0)} L${pr.sx(ZX[0])},${pr.sy(0)} Z`;
  return (
    <Svg width={650} height={320}>
      <g transform="translate(12, 40)">
        <path d={shadeL} className="dg-fill-accent" />
        <path d={graph(pdfX, LX, pl, LY)} className="dg-accent" />
        <line x1={pl.sx(LX[0])} y1={pl.sy(0)} x2={pl.sx(LX[1])} y2={pl.sy(0)} className="dg-thin" />
        <line x1={pl.sx(38)} y1={pl.sy(0)} x2={pl.sx(38)} y2={pl.sy(pdfX(38))} className="dg-grid dg-dashed" />
        {[30, 38].map((t) => (
          <g key={t}>
            <line x1={pl.sx(t)} y1={pl.sy(0) - 3} x2={pl.sx(t)} y2={pl.sy(0) + 3} className="dg-thin" />
            <Label x={pl.sx(t)} y={pl.sy(0) + 16} className="dg-text-small">
              {t}
            </Label>
          </g>
        ))}
        <MathLabel x={pl.sx(13)} y={pl.sy(0.084)} tex="\text{P}(X < 38)" w={130} h={24} anchor="start" tone="accent" />
        <Label x={PW / 2} y={PH + 26} className="dg-text">
          X ~ N(30, 5²)
        </Label>
      </g>

      <Arrow x1={300} y1={140} x2={352} y2={140} className="dg-muted" head={8} />
      <Label x={326} y={122} className="dg-text-small">
        standardise
      </Label>

      <g transform="translate(368, 40)">
        <path d={shadeR} className="dg-fill-accent-2" />
        <path d={graph(pdfZ, ZX, pr, ZY)} className="dg-accent-2" />
        <line x1={pr.sx(ZX[0])} y1={pr.sy(0)} x2={pr.sx(ZX[1])} y2={pr.sy(0)} className="dg-thin" />
        <line x1={pr.sx(1.6)} y1={pr.sy(0)} x2={pr.sx(1.6)} y2={pr.sy(pdfZ(1.6))} className="dg-grid dg-dashed" />
        {[0, 1.6].map((t) => (
          <g key={t}>
            <line x1={pr.sx(t)} y1={pr.sy(0) - 3} x2={pr.sx(t)} y2={pr.sy(0) + 3} className="dg-thin" />
            <Label x={pr.sx(t)} y={pr.sy(0) + 16} className="dg-text-small">
              {t}
            </Label>
          </g>
        ))}
        <MathLabel x={pr.sx(-2.9)} y={pr.sy(0.442)} tex="\text{P}(Z < 1.6)" w={120} h={24} anchor="start" tone="accent-2" />
        <Label x={PW / 2} y={PH + 26} className="dg-text">
          Z ~ N(0, 1)
        </Label>
      </g>

      <MathLabel
        x={325}
        y={300}
        tex="z = \dfrac{x - \mu}{\sigma} = \dfrac{38 - 30}{5} = 1.6"
        w={320}
        h={44}
      />
    </Svg>
  );
}
