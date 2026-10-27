/**
 * Deriving P = Fv from P = W/t with W = Fs and s = vt, next to a car at
 * constant speed: the 400 N driving force balances the 400 N drag, so
 * P = Fv = 400 × 30 = 12 kW.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-energy-conservation-power-fv';

const W = 640;
const H = 320;

export function EnergyConservationPowerFv() {
  return (
    <Svg width={W} height={H}>
      <Label x={165} y={36} className="dg-text dg-bold">
        Deriving P = Fv
      </Label>
      <rect x={30} y={58} width={270} height={40} className="dg-fill-accent-2 dg-line" />
      <MathLabel x={165} y={78} w={250} h={38} tex={String.raw`P = \dfrac{W}{t}`} />
      <Arrow x1={165} y1={100} x2={165} y2={112} className="dg-line" head={8} />
      <rect x={30} y={114} width={270} height={40} className="dg-fill-accent-2 dg-line" />
      <MathLabel
        x={165}
        y={134}
        w={250}
        h={38}
        tex={String.raw`W = Fs \quad \text{so} \quad P = \dfrac{Fs}{t}`}
      />
      <Arrow x1={165} y1={156} x2={165} y2={168} className="dg-line" head={8} />
      <rect x={30} y={170} width={270} height={40} className="dg-fill-accent-2 dg-line" />
      <MathLabel
        x={165}
        y={190}
        w={250}
        h={38}
        tex={String.raw`\text{steady speed: } \dfrac{s}{t} = v`}
      />
      <Arrow x1={165} y1={212} x2={165} y2={232} className="dg-accent" headClassName="dg-dot-accent" head={9} />
      <MathLabel x={165} y={262} w={220} h={50} size="large" tex={String.raw`P = Fv`} />
      {/* right panel */}
      <line x1={330} y1={40} x2={330} y2={306} className="dg-grid" />
      <Label x={490} y={36} className="dg-text dg-bold">
        A car at constant speed
      </Label>
      <line x1={346} y1={240} x2={630} y2={240} className="dg-line" />
      <rect x={430} y={192} width={110} height={36} className="dg-fill-accent dg-accent" />
      <circle cx={455} cy={232} r={8} className="dg-dot" />
      <circle cx={515} cy={232} r={8} className="dg-dot" />
      <Arrow x1={428} y1={210} x2={362} y2={210} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Arrow x1={544} y1={210} x2={610} y2={210} className="dg-muted" headClassName="dg-dot" />
      <Label x={398} y={184} className="dg-text-small dg-text-accent-2">
        driving force
      </Label>
      <Label x={580} y={184} className="dg-text-small dg-text-muted">
        drag
      </Label>
      <Label x={490} y={266} className="dg-text-small">
        constant speed 30 m s⁻¹, so the forces balance
      </Label>
      <MathLabel
        x={490}
        y={296}
        w={280}
        h={36}
        tex={String.raw`P = Fv = 400\ \text{N} \times 30\ \text{m s}^{-1} = 12\ \text{kW}`}
      />
    </Svg>
  );
}

export default EnergyConservationPowerFv;
