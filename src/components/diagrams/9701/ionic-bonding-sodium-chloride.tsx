/**
 * Dot-and-cross diagram for the formation of sodium chloride (outer shells only).
 * Top row: a sodium atom (2,8,1) with one outer electron (a cross) and a chlorine atom
 * (2,8,7) with seven outer electrons (dots); an arrow shows the sodium electron moving to
 * chlorine. Bottom row: the ions in square brackets, [Na]+ with its full second shell of
 * eight crosses (2,8, like neon) and [Cl]− with eight outer electrons, seven dots and one
 * cross (2,8,8, like argon), joined by a double arrow for the electrostatic attraction.
 * Circles show shells, not sizes.
 */
import { Arrow, Label, Svg } from '../primitives';
import { Electron, Ion, Shell, full } from './ionic-bonding-dot-cross-kit';

export const diagramKey = 'chem-ionic-bonding-sodium-chloride';

const W = 640;
const H = 390;
const R = 44;
const NA = 150;
const CL = 430;
const ATOMS = 104;
const IONS = 290;

export function IonicBondingSodiumChloride() {
  return (
    <Svg width={W} height={H}>
      {/* row names */}
      <Label x={16} y={ATOMS} anchor="start" className="dg-text-muted">
        atoms
      </Label>
      <Label x={16} y={IONS} anchor="start" className="dg-text-muted">
        ions
      </Label>

      {/* atoms */}
      <Shell cx={NA} cy={ATOMS} r={R} symbol="Na" sides={{ right: ['cross'] }} />
      <Shell
        cx={CL}
        cy={ATOMS}
        r={R}
        symbol="Cl"
        sides={{ top: ['dot', 'dot'], right: ['dot', 'dot'], bottom: ['dot', 'dot'], left: ['dot'] }}
      />
      <Arrow x1={NA + R + 12} y1={ATOMS} x2={CL - R - 12} y2={ATOMS} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={(NA + CL) / 2} y={ATOMS - 16} className="dg-text-small dg-bold">
        1 electron moves
      </Label>
      <Label x={NA} y={ATOMS + R + 22} className="dg-text">
        Na: 2,8,1
      </Label>
      <Label x={CL} y={ATOMS + R + 22} className="dg-text">
        Cl: 2,8,7
      </Label>

      {/* the change */}
      <Arrow x1={(NA + CL) / 2} y1={ATOMS + R + 36} x2={(NA + CL) / 2} y2={IONS - R - 26} className="dg-muted" headClassName="dg-dot" />

      {/* ions */}
      <Ion cx={NA} cy={IONS} r={R} symbol="Na" sides={full('cross')} charge="+" />
      <Ion
        cx={CL}
        cy={IONS}
        r={R}
        symbol="Cl"
        sides={{ top: ['dot', 'dot'], right: ['dot', 'dot'], bottom: ['dot', 'dot'], left: ['dot', 'cross'] }}
        charge="−"
      />
      <Arrow x1={NA + R + 30} y1={IONS} x2={CL - R - 22} y2={IONS} double className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={(NA + CL) / 2 + 4} y={IONS - 16} className="dg-text-small dg-bold">
        electrostatic
      </Label>
      <Label x={(NA + CL) / 2 + 4} y={IONS + 17} className="dg-text-small dg-bold">
        attraction
      </Label>
      <Label x={NA} y={IONS + R + 30} className="dg-text">
        Na⁺: 2,8 (like Ne)
      </Label>
      <Label x={CL} y={IONS + R + 30} className="dg-text">
        Cl⁻: 2,8,8 (like Ar)
      </Label>

      {/* key */}
      <Electron x={540} y={40} mark="cross" />
      <Label x={552} y={40} anchor="start" className="dg-text-small">
        Na electron
      </Label>
      <Electron x={540} y={62} mark="dot" />
      <Label x={552} y={62} anchor="start" className="dg-text-small">
        Cl electron
      </Label>
      <Label x={534} y={84} anchor="start" className="dg-text-muted">
        outer shells only
      </Label>
    </Svg>
  );
}

export default IonicBondingSodiumChloride;
