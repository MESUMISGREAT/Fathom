/**
 * Standard conditions: 298 K and 101 kPa, with each element in its standard
 * state (graphite, liquid water, oxygen gas, liquid bromine).
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'chem-enthalpy-change-standard-state';

const W = 620;
const H = 330;

const states = [
  { x: 96, name: 'carbon', form: 'graphite' },
  { x: 236, name: 'water', form: 'liquid' },
  { x: 376, name: 'oxygen', form: 'O\₂ gas' },
  { x: 516, name: 'bromine', form: 'Br\₂ liquid' },
];

export function EnthalpyChangeStandardState() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        Standard conditions
      </Label>

      <rect x={70} y={48} width={200} height={54} className="dg-fill-accent-2 dg-line" />
      <rect x={350} y={48} width={200} height={54} className="dg-fill-accent-2 dg-line" />
      <Label x={170} y={76} className="dg-text dg-bold">
        298 K
      </Label>
      <Label x={450} y={76} className="dg-text dg-bold">
        101 kPa
      </Label>
      <Label x={170} y={136} className="dg-text-small dg-text-muted">
        temperature
      </Label>
      <Label x={450} y={136} className="dg-text-small dg-text-muted">
        pressure
      </Label>

      <Label x={W / 2} y={176} className="dg-text-small dg-bold">
        and every substance in its standard state
      </Label>

      {states.map((s) => (
        <g key={s.name}>
          <rect x={s.x - 58} y={196} width={116} height={62} className="dg-fill-muted dg-thin" />
          <Label x={s.x} y={218} className="dg-text-small dg-bold">
            {s.name}
          </Label>
          <Label x={s.x} y={240} className="dg-text-small dg-text-muted">
            {s.form}
          </Label>
        </g>
      ))}

      <MathLabel x={W / 2} y={286} tex="\Delta H^{\ominus}\ \text{means measured here}" w={280} h={26} />
      <Label x={W / 2} y={306} className="dg-text-small dg-text-muted">
        the plimsoll symbol marks a standard value
      </Label>
    </Svg>
  );
}

export default EnthalpyChangeStandardState;
