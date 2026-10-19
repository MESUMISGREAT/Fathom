/**
 * Unit parsing by dimensional analysis. "m s^-1", "m/s", "ms⁻¹" and "m s–1"
 * (the Cambridge style) all mean the same thing; "cm" is the same dimension
 * as "m" with a different scale, so a correct value in other units can be
 * converted rather than marked wrong.
 */

/** Exponents of [kg, m, s, A, K, mol, cd] plus pseudo-dimensions that must match by name. */
type Dims = Record<string, number>;
export interface Unit {
  scale: number;
  dims: Dims;
}

const d = (o: Dims): Dims => o;
const BASE: Record<string, Unit> = {
  m: { scale: 1, dims: d({ m: 1 }) },
  g: { scale: 1e-3, dims: d({ kg: 1 }) },
  s: { scale: 1, dims: d({ s: 1 }) },
  A: { scale: 1, dims: d({ A: 1 }) },
  K: { scale: 1, dims: d({ K: 1 }) },
  mol: { scale: 1, dims: d({ mol: 1 }) },
  cd: { scale: 1, dims: d({ cd: 1 }) },
  N: { scale: 1, dims: d({ kg: 1, m: 1, s: -2 }) },
  J: { scale: 1, dims: d({ kg: 1, m: 2, s: -2 }) },
  W: { scale: 1, dims: d({ kg: 1, m: 2, s: -3 }) },
  Pa: { scale: 1, dims: d({ kg: 1, m: -1, s: -2 }) },
  C: { scale: 1, dims: d({ A: 1, s: 1 }) },
  V: { scale: 1, dims: d({ kg: 1, m: 2, s: -3, A: -1 }) },
  Ω: { scale: 1, dims: d({ kg: 1, m: 2, s: -3, A: -2 }) },
  ohm: { scale: 1, dims: d({ kg: 1, m: 2, s: -3, A: -2 }) },
  Hz: { scale: 1, dims: d({ s: -1 }) },
  T: { scale: 1, dims: d({ kg: 1, s: -2, A: -1 }) },
  Wb: { scale: 1, dims: d({ kg: 1, m: 2, s: -2, A: -1 }) },
  F: { scale: 1, dims: d({ kg: -1, m: -2, s: 4, A: 2 }) },
  H: { scale: 1, dims: d({ kg: 1, m: 2, s: -2, A: -2 }) },
  eV: { scale: 1.602176634e-19, dims: d({ kg: 1, m: 2, s: -2 }) },
  Bq: { scale: 1, dims: d({ s: -1 }) },
  L: { scale: 1e-3, dims: d({ m: 3 }) },
  l: { scale: 1e-3, dims: d({ m: 3 }) },
  min: { scale: 60, dims: d({ s: 1 }) },
  h: { scale: 3600, dims: d({ s: 1 }) },
  B: { scale: 8, dims: d({ bit: 1 }) }, // byte
  bit: { scale: 1, dims: d({ bit: 1 }) },
  rad: { scale: 1, dims: d({ rad: 1 }) },
  sr: { scale: 1, dims: d({ sr: 1 }) },
  '°': { scale: 1, dims: d({ deg: 1 }) },
  '°C': { scale: 1, dims: d({ degC: 1 }) },
  '%': { scale: 0.01, dims: d({}) },
};
const PREFIX: Record<string, number> = {
  T: 1e12, G: 1e9, M: 1e6, k: 1e3, c: 1e-2, m: 1e-3, μ: 1e-6, µ: 1e-6, u: 1e-6, n: 1e-9, p: 1e-12, f: 1e-15,
};
/** Units that take no metric prefix in A Level usage (avoids "min" = milli-inch etc.). */
const NO_PREFIX = new Set(['min', 'h', '%', '°', '°C', 'rad', 'sr', 'kg']);

function lookup(sym: string): Unit[] {
  const out: Unit[] = [];
  if (sym === 'kg') return [{ scale: 1, dims: { kg: 1 } }];
  if (BASE[sym]) out.push(BASE[sym]!);
  for (const [p, f] of Object.entries(PREFIX)) {
    if (sym.length > p.length && sym.startsWith(p)) {
      const base = sym.slice(p.length);
      if (BASE[base] && !NO_PREFIX.has(base)) out.push({ scale: f * BASE[base]!.scale, dims: BASE[base]!.dims });
    }
  }
  return out;
}

/** All ways of reading a run of letters as a product of units ("ms" = m·s or millisecond). */
function segment(sym: string): Unit[] {
  if (sym === '') return [{ scale: 1, dims: {} }];
  const out: Unit[] = [];
  for (let i = 1; i <= sym.length; i++) {
    for (const head of lookup(sym.slice(0, i))) {
      for (const tail of segment(sym.slice(i))) out.push(multiply(head, tail, 1));
      if (out.length > 16) return out;
    }
  }
  return out;
}

function multiply(a: Unit, b: Unit, power: number): Unit {
  const dims: Dims = { ...a.dims };
  for (const [k, v] of Object.entries(b.dims)) dims[k] = (dims[k] ?? 0) + v * power;
  return { scale: a.scale * b.scale ** power, dims };
}

const SUP: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' };

/** Every plausible reading of a unit string. Empty array means unparseable. */
export function parseUnit(input: string): Unit[] {
  let s = input.trim().replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, (m) => '^' + [...m].map((c) => SUP[c]).join(''));
  s = s.replace(/[−–—]/g, '-').replace(/\*\*/g, '^').replace(/[·⋅*.]/g, ' ').replace(/\bohms?\b/g, 'Ω');
  if (s === '') return [{ scale: 1, dims: {} }];
  // Split numerator / denominator on the first "/" ("J/(kg K)" or "m/s^2").
  const [num, ...dens] = s.split('/');
  const parts: Array<{ text: string; sign: number }> = [{ text: num ?? '', sign: 1 }];
  for (const den of dens) parts.push({ text: den.replace(/[()]/g, ' '), sign: -1 });
  let results: Unit[] = [{ scale: 1, dims: {} }];
  for (const { text, sign } of parts) {
    const tokens = text.replace(/[()]/g, ' ').trim().split(/\s+/).filter(Boolean);
    for (const token of tokens) {
      const m = /^([^\d^+-]+)\^?([+-]?\d+)?$/.exec(token);
      if (!m) return [];
      const readings = segment(m[1]!);
      if (readings.length === 0) return [];
      const power = (m[2] ? Number(m[2]) : 1) * sign;
      // The exponent applies to the last unit only, as in "kgm^2": handled by
      // re-segmenting with the power on the final symbol.
      const powered = m[2] && m[1]!.length > 1 ? segmentPowered(m[1]!, power) : readings.map((u) => pow(u, power));
      const next: Unit[] = [];
      for (const r of results) for (const p of powered) next.push(multiply(r, p, 1));
      results = next.slice(0, 32);
    }
  }
  return results;
}

function pow(u: Unit, power: number): Unit {
  return multiply({ scale: 1, dims: {} }, u, power);
}

function segmentPowered(sym: string, power: number): Unit[] {
  const out: Unit[] = [];
  for (let i = 0; i < sym.length; i++) {
    const heads = segment(sym.slice(0, i));
    const lasts = lookup(sym.slice(i));
    for (const h of heads) for (const l of lasts) out.push(multiply(h, l, power));
  }
  return out;
}

export function sameDimensions(a: Unit, b: Unit): boolean {
  const keys = new Set([...Object.keys(a.dims), ...Object.keys(b.dims)]);
  for (const k of keys) if ((a.dims[k] ?? 0) !== (b.dims[k] ?? 0)) return false;
  return true;
}

/**
 * Find a reading of the student's unit that matches one of the accepted
 * units. Returns the factor that converts the student's value into the
 * accepted unit, or null if no reading is dimensionally consistent.
 */
export function matchUnit(student: string, accepted: string[]): { factor: number; exact: boolean } | null {
  const readings = parseUnit(student);
  let best: { factor: number; exact: boolean } | null = null;
  for (const acc of accepted) {
    for (const target of parseUnit(acc)) {
      for (const r of readings) {
        if (!sameDimensions(r, target)) continue;
        const factor = r.scale / target.scale;
        const exact = Math.abs(factor - 1) < 1e-9;
        if (exact) return { factor: 1, exact: true };
        best ??= { factor, exact: false };
      }
    }
  }
  return best;
}

/** Split "9.81 m s^-2" into number text and unit text. */
export function splitValueAndUnit(input: string): { number: string; unit: string } {
  const s = input.trim();
  const m = /^([+-]?[\d.,]+(?:\s*(?:[eE][+-]?\d+|[x×*]\s*10\s*(?:\^\s*\(?[+-−–]?\d+\)?|[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)))?)\s*(.*)$/.exec(s);
  if (!m) return { number: s, unit: '' };
  return { number: m[1]!, unit: m[2]!.trim() };
}
