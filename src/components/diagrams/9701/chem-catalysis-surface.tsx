/**
 * Heterogeneous catalysis: the reactants adsorb onto the surface of a solid catalyst, react
 * there with their bonds weakened, and the products desorb, leaving the surface unchanged.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-catalysis-surface';

const W = 640;
const H = 340;

const SURFACE_TOP = 230;

export function ChemCatalysisSurface() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={26} className="dg-text dg-bold">
        Heterogeneous catalysis: the reaction happens on the surface
      </Label>

      {/* solid surface */}
      <rect x={60} y={SURFACE_TOP} width={520} height={54} className="dg-fill-muted" />
      <line x1={60} y1={SURFACE_TOP} x2={580} y2={SURFACE_TOP} className="dg-line" />
      <Label x={W / 2} y={SURFACE_TOP + 32} className="dg-text-small dg-text-muted">
        solid catalyst surface (not used up)
      </Label>

      {/* 1: reactants approaching */}
      <circle cx={132} cy={140} r={17} fill="none" className="dg-accent" strokeWidth={2} />
      <Label x={132} y={140} className="dg-text dg-bold dg-text-accent">
        A
      </Label>
      <circle cx={180} cy={140} r={17} fill="none" className="dg-accent-2" strokeWidth={2} />
      <Label x={180} y={140} className="dg-text dg-bold dg-text-accent-2">
        B
      </Label>
      <Arrow x1={156} y1={168} x2={156} y2={SURFACE_TOP - 8} className="dg-muted" headClassName="dg-dot" />

      {/* 2: adsorbed and reacting */}
      <circle cx={304} cy={196} r={17} fill="none" className="dg-accent" strokeWidth={2} />
      <Label x={304} y={196} className="dg-text dg-bold dg-text-accent">
        A
      </Label>
      <circle cx={342} cy={196} r={17} fill="none" className="dg-accent-2" strokeWidth={2} />
      <Label x={342} y={196} className="dg-text dg-bold dg-text-accent-2">
        B
      </Label>
      <line x1={321} y1={196} x2={325} y2={196} className="dg-thin" />
      <line x1={304} y1={215} x2={304} y2={SURFACE_TOP} className="dg-dashed dg-muted" />
      <line x1={342} y1={215} x2={342} y2={SURFACE_TOP} className="dg-dashed dg-muted" />

      {/* 3: product leaving */}
      <circle cx={466} cy={196} r={19} fill="none" className="dg-accent" strokeWidth={2} />
      <circle cx={502} cy={196} r={19} fill="none" className="dg-accent-2" strokeWidth={2} />
      <Label x={484} y={160} className="dg-text-small dg-bold">
        AB
      </Label>
      <Arrow x1={546} y1={196} x2={546} y2={104} className="dg-muted" headClassName="dg-dot" />

      {/* stage captions */}
      <Label x={156} y={SURFACE_TOP + 84} className="dg-text-small dg-text-muted">
        1 adsorption
      </Label>
      <Label x={323} y={SURFACE_TOP + 84} className="dg-text-small dg-text-muted">
        2 reaction
      </Label>
      <Label x={490} y={SURFACE_TOP + 84} className="dg-text-small dg-text-muted">
        3 desorption
      </Label>

      <Label x={W / 2} y={58} className="dg-text-small dg-text-muted">
        bonds weakened on the surface, so less energy is needed
      </Label>
    </Svg>
  );
}

export default ChemCatalysisSurface;
