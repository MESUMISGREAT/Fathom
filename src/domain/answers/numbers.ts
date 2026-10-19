/**
 * Parsing student-typed numbers: plain decimals, scientific notation in the
 * forms students actually write (3.0e8, 3.0 × 10^8, 3.0x10⁸), fractions and
 * exact forms (7/2, 2√5, 3π), plus significant-figure counting.
 */
import { evaluateConstant, normaliseMath, ParseError } from './expression';

export interface ParsedNumber {
  value: number;
  /** Significant figures as written, as a range when trailing zeros are ambiguous ("3400" is 2-4). */
  sigFigs: { min: number; max: number } | null;
  /** True when written as a plain decimal or scientific notation (not 7/2, √5, ...). */
  isDecimal: boolean;
}

const SCI = /^([+-]?(?:\d+\.?\d*|\.\d+))\s*(?:e([+-]?\d+)|[x*]\s*10\s*\^\s*\(?([+-]?\d+)\)?)$/;
const PLAIN = /^[+-]?(?:\d+\.?\d*|\.\d+)$/;
const THOUSANDS = /^[+-]?\d{1,3}(?:,\d{3})+(?:\.\d+)?$/;

export function countSigFigs(mantissa: string): { min: number; max: number } {
  const digits = mantissa.replace(/^[+-]/, '');
  const hasPoint = digits.includes('.');
  const all = digits.replace('.', '');
  const stripped = all.replace(/^0+/, '');
  if (stripped === '') return { min: 1, max: 1 }; // "0" or "0.0"
  if (hasPoint) {
    // Leading zeros never count; trailing zeros after a point always count.
    return { min: stripped.length, max: stripped.length };
  }
  const trailing = /0+$/.exec(stripped)?.[0].length ?? 0;
  return { min: stripped.length - trailing, max: stripped.length };
}

export function parseNumber(input: string): ParsedNumber | null {
  const raw = normaliseMath(input).replace(/\s+/g, ' ').trim();
  if (raw === '') return null;
  if (THOUSANDS.test(raw)) {
    const plain = raw.replace(/,/g, '');
    return { value: Number(plain), sigFigs: countSigFigs(plain), isDecimal: true };
  }
  if (PLAIN.test(raw)) {
    return { value: Number(raw), sigFigs: countSigFigs(raw), isDecimal: true };
  }
  const sci = SCI.exec(raw.replace(/\s+/g, ''));
  if (sci) {
    const mantissa = sci[1]!;
    const exponent = Number(sci[2] ?? sci[3]);
    return { value: Number(mantissa) * 10 ** exponent, sigFigs: countSigFigs(mantissa), isDecimal: true };
  }
  try {
    const value = evaluateConstant(raw);
    if (!Number.isFinite(value)) return null;
    return { value, sigFigs: null, isDecimal: false };
  } catch (e) {
    if (e instanceof ParseError) return null;
    throw e;
  }
}

export interface Tolerance {
  abs?: number;
  rel?: number;
}

export function withinTolerance(actual: number, expected: number, tol: Tolerance = {}): boolean {
  const diff = Math.abs(actual - expected);
  if (tol.abs === undefined && tol.rel === undefined) {
    return diff <= 1e-9 * Math.max(1, Math.abs(expected));
  }
  if (tol.abs !== undefined && diff <= tol.abs + 1e-12) return true;
  if (tol.rel !== undefined && diff <= tol.rel * Math.abs(expected) + 1e-12) return true;
  return false;
}

/** Round to n significant figures (for showing expected answers). */
export function toSigFigs(value: number, n: number): string {
  if (value === 0) return (0).toFixed(Math.max(0, n - 1));
  return Number(value.toPrecision(n)).toPrecision(n).replace(/e\+?/, ' × 10^');
}
