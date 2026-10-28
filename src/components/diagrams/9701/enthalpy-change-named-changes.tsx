/**
 * The four named enthalpy changes and what "per mole" refers to in each.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'chem-enthalpy-change-named-changes';

const W = 640;
const H = 344;

const panels = [
  {
    x: 20,
    y: 44,
    title: 'formation, ΔHf',
    per: 'per 1 mol of compound formed',
    eq: 'C(s) + 2H₂(g) → CH₄(g)',
  },
  {
    x: 330,
    y: 44,
    title: 'combustion, ΔHc',
    per: 'per 1 mol of fuel burned',
    eq: 'CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(l)',
  },
  {
    x: 20,
    y: 200,
    title: 'neutralisation, ΔHneut',
    per: 'per 1 mol of water formed',
    eq: 'H⁺(aq) + OH⁻(aq) → H₂O(l)',
  },
  {
    x: 330,
    y: 200,
    title: 'reaction, ΔHr',
    per: 'per mole of reaction as written',
    eq: '2H₂(g) + O₂(g) → 2H₂O(l)',
  },
];

export function EnthalpyChangeNamedChanges() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text dg-bold">
        Four names, four answers to "per mole of what?"
      </Label>
      {panels.map((p) => (
        <g key={p.title}>
          <rect x={p.x} y={p.y} width={290} height={126} className="dg-fill-muted dg-thin" />
          <Label x={p.x + 145} y={p.y + 22} className="dg-text dg-bold">
            {p.title}
          </Label>
          <Label x={p.x + 145} y={p.y + 56} className="dg-text-small dg-mono">
            {p.eq}
          </Label>
          <Label x={p.x + 145} y={p.y + 92} className="dg-text-small dg-text-accent">
            {p.per}
          </Label>
          <Label x={p.x + 145} y={p.y + 112} className="dg-text-small dg-text-muted">
            standard conditions, standard states
          </Label>
        </g>
      ))}
    </Svg>
  );
}

export default EnthalpyChangeNamedChanges;
