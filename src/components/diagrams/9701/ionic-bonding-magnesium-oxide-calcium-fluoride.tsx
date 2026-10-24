/**
 * Dot-and-cross diagrams (outer shells only) for the ions in magnesium oxide and calcium
 * fluoride. Crosses are the metal's electrons, dots are the non-metal's.
 * MgO: [Mg]2+ (2,8) and [O]2− with six dots and the two crosses from magnesium (2,8):
 * two electrons move, ratio 1 : 1. CaF2: [F]− [Ca]2+ [F]−; calcium (2,8,8,2) gives one
 * electron to each of two fluorine atoms, so each F− has seven dots and one cross (2,8)
 * and Ca2+ is 2,8,8: ratio 1 : 2.
 */
import { Label, Svg } from '../primitives';
import { Electron, Ion, full } from './ionic-bonding-dot-cross-kit';

export const diagramKey = 'chem-ionic-bonding-magnesium-oxide-calcium-fluoride';

const W = 640;
const H = 430;
const R = 40;
const ROW1 = 104;
const ROW2 = 296;
const NOTE_X = 512;

export function IonicBondingMagnesiumOxideCalciumFluoride() {
  return (
    <Svg width={W} height={H}>
      {/* magnesium oxide */}
      <Label x={16} y={24} anchor="start" className="dg-text dg-bold">
        magnesium oxide, MgO
      </Label>
      <Ion cx={180} cy={ROW1} r={R} symbol="Mg" sides={full('cross')} charge="2+" />
      <Ion
        cx={350}
        cy={ROW1}
        r={R}
        symbol="O"
        sides={{ top: ['dot', 'dot'], right: ['dot', 'dot'], bottom: ['cross', 'dot'], left: ['dot', 'cross'] }}
        charge="2−"
      />
      <Label x={180} y={ROW1 + R + 32} className="dg-text">
        Mg²⁺: 2,8
      </Label>
      <Label x={350} y={ROW1 + R + 32} className="dg-text">
        O²⁻: 2,8
      </Label>
      <Label x={NOTE_X} y={ROW1 - 12} anchor="start" className="dg-text-small">
        2 electrons move
      </Label>
      <Label x={NOTE_X} y={ROW1 + 10} anchor="start" className="dg-text-small dg-bold">
        Mg²⁺ : O²⁻ = 1 : 1
      </Label>

      <line x1={16} y1={200} x2={W - 16} y2={200} className="dg-grid" />

      {/* calcium fluoride */}
      <Label x={16} y={222} anchor="start" className="dg-text dg-bold">
        calcium fluoride, CaF₂
      </Label>
      <Ion
        cx={90}
        cy={ROW2}
        r={R}
        symbol="F"
        sides={{ top: ['dot', 'dot'], right: ['dot', 'cross'], bottom: ['dot', 'dot'], left: ['dot', 'dot'] }}
        charge="−"
      />
      <Ion cx={250} cy={ROW2} r={R} symbol="Ca" sides={full('cross')} charge="2+" />
      <Ion
        cx={410}
        cy={ROW2}
        r={R}
        symbol="F"
        sides={{ top: ['dot', 'dot'], right: ['dot', 'dot'], bottom: ['dot', 'dot'], left: ['dot', 'cross'] }}
        charge="−"
      />
      <Label x={90} y={ROW2 + R + 32} className="dg-text">
        F⁻: 2,8
      </Label>
      <Label x={250} y={ROW2 + R + 32} className="dg-text">
        Ca²⁺: 2,8,8
      </Label>
      <Label x={410} y={ROW2 + R + 32} className="dg-text">
        F⁻: 2,8
      </Label>
      <Label x={NOTE_X} y={ROW2 - 22} anchor="start" className="dg-text-small">
        2 electrons move,
      </Label>
      <Label x={NOTE_X} y={ROW2 - 4} anchor="start" className="dg-text-small">
        one to each F
      </Label>
      <Label x={NOTE_X} y={ROW2 + 18} anchor="start" className="dg-text-small dg-bold">
        Ca²⁺ : F⁻ = 1 : 2
      </Label>

      {/* key */}
      <Electron x={24} y={H - 18} mark="cross" />
      <Label x={36} y={H - 18} anchor="start" className="dg-text-small">
        the metal&apos;s electron
      </Label>
      <Electron x={200} y={H - 18} mark="dot" />
      <Label x={212} y={H - 18} anchor="start" className="dg-text-small">
        the non-metal&apos;s electron
      </Label>
      <Label x={W - 16} y={H - 18} anchor="end" className="dg-text-muted">
        outer shells only
      </Label>
    </Svg>
  );
}

export default IonicBondingMagnesiumOxideCalciumFluoride;
