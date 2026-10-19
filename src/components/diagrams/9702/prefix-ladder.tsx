/**
 * The ten syllabus prefixes on a vertical powers-of-ten scale (20 px per
 * factor of 10, from 10⁻¹² to 10¹²), with some real lengths placed at
 * log10(length / m) on the same scale:
 *   atom ≈ 1 × 10⁻¹⁰ m, green light ≈ 5 × 10⁻⁷ m, human hair ≈ 8 × 10⁻⁵ m,
 *   fingernail ≈ 1 × 10⁻² m, person ≈ 1.7 m, Everest ≈ 8.8 × 10³ m,
 *   Earth radius ≈ 6.4 × 10⁶ m, Earth–Moon ≈ 3.8 × 10⁸ m, Earth–Sun ≈ 1.5 × 10¹¹ m.
 */
import { Label, Svg } from '../primitives';

const W = 620;
const H = 560;
const AX = 330;
const TOP = 46;
const PER = 20; // px per power of ten
const y = (n: number) => TOP + (12 - n) * PER;

const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const sup = (n: number) => [...String(n)].map((c) => SUP[c]).join('');

const prefixes: Array<{ name: string; sym: string; n: number }> = [
  { name: 'tera', sym: 'T', n: 12 },
  { name: 'giga', sym: 'G', n: 9 },
  { name: 'mega', sym: 'M', n: 6 },
  { name: 'kilo', sym: 'k', n: 3 },
  { name: '(none)', sym: '', n: 0 },
  { name: 'deci', sym: 'd', n: -1 },
  { name: 'centi', sym: 'c', n: -2 },
  { name: 'milli', sym: 'm', n: -3 },
  { name: 'micro', sym: 'μ', n: -6 },
  { name: 'nano', sym: 'n', n: -9 },
  { name: 'pico', sym: 'p', n: -12 },
];

const things: Array<{ label: string; value: string; metres: number }> = [
  { label: 'Earth to Sun', value: '1.5 × 10¹¹ m', metres: 1.5e11 },
  { label: 'Earth to Moon', value: '3.8 × 10⁸ m', metres: 3.8e8 },
  { label: 'radius of the Earth', value: '6.4 × 10⁶ m', metres: 6.4e6 },
  { label: 'height of Everest', value: '8.8 × 10³ m', metres: 8.8e3 },
  { label: 'height of a person', value: '1.7 m', metres: 1.7 },
  { label: 'width of a fingernail', value: '1 × 10⁻² m', metres: 1e-2 },
  { label: 'width of a human hair', value: '8 × 10⁻⁵ m', metres: 8e-5 },
  { label: 'wavelength of green light', value: '5 × 10⁻⁷ m', metres: 5e-7 },
  { label: 'diameter of an atom', value: '1 × 10⁻¹⁰ m', metres: 1e-10 },
];

export function PrefixLadder() {
  const decades = Array.from({ length: 25 }, (_, i) => i - 12);
  return (
    <Svg width={W} height={H}>
      <Label x={AX - 150} y={20} className="dg-text dg-bold">
        Some real lengths
      </Label>
      <Label x={AX + 110} y={20} className="dg-text dg-bold">
        Prefix and factor
      </Label>
      <line x1={AX} y1={y(12)} x2={AX} y2={y(-12)} className="dg-line" />
      {decades.map((n) => (
        <line key={n} x1={AX - 4} y1={y(n)} x2={AX + 4} y2={y(n)} className="dg-thin" />
      ))}
      {prefixes.map((p) => (
        <g key={p.name}>
          <line x1={AX - 9} y1={y(p.n)} x2={AX + 9} y2={y(p.n)} className="dg-accent" />
          <Label x={AX + 22} y={y(p.n)} anchor="start" className={p.sym ? 'dg-text-small' : 'dg-text-small dg-text-muted'}>
            {p.name}
          </Label>
          <Label x={AX + 96} y={y(p.n)} className="dg-text-accent dg-mono">
            {p.sym || '–'}
          </Label>
          <Label x={AX + 128} y={y(p.n)} anchor="start" className="dg-text-small">
            {`× 10${sup(p.n)}`}
          </Label>
        </g>
      ))}
      {things.map((t) => {
        const yy = y(Math.log10(t.metres));
        return (
          <g key={t.label}>
            <circle cx={AX} cy={yy} r={4} className="dg-dot-accent-2" />
            <line x1={AX - 8} y1={yy} x2={AX - 22} y2={yy} className="dg-muted" />
            <Label x={AX - 28} y={yy - 7} anchor="end" className="dg-text-small">
              {t.label}
            </Label>
            <Label x={AX - 28} y={yy + 8} anchor="end" className="dg-text-small dg-text-accent-2">
              {t.value}
            </Label>
          </g>
        );
      })}
      <Label x={AX + 110} y={y(-12) + 26} className="dg-text-small dg-text-muted">
        each tick is a factor of 10
      </Label>
    </Svg>
  );
}
