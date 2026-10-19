/**
 * A small, safe maths expression parser and evaluator (no eval). Used to
 * check algebraic answers by numerical equivalence and to accept exact forms
 * such as 7/2, 2√5 or 3π in numeric fields.
 *
 * Grammar (loosest to tightest):
 *   sum     := product (('+' | '-') product)*
 *   product := unary (('*' | '/' | implicit) unary)*
 *   unary   := ('+' | '-') unary | power
 *   power   := call ('^' unary)?
 *   call    := FUNC (call | '(' sum ')') | atom
 *   atom    := NUMBER | VAR | CONST | '(' sum ')'
 */

export type Expr = (vars: Record<string, number>) => number;

export class ParseError extends Error {}

const FUNCS: Record<string, (x: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  sec: (x) => 1 / Math.cos(x),
  cosec: (x) => 1 / Math.sin(x),
  csc: (x) => 1 / Math.sin(x),
  cot: (x) => 1 / Math.tan(x),
  arcsin: Math.asin,
  arccos: Math.acos,
  arctan: Math.atan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  ln: Math.log,
  log: Math.log10,
  exp: Math.exp,
  sqrt: Math.sqrt,
  abs: Math.abs,
};
const CONSTS: Record<string, number> = { pi: Math.PI, e: Math.E };
const FUNC_NAMES = Object.keys(FUNCS).sort((a, b) => b.length - a.length);

type Token =
  | { t: 'num'; v: number }
  | { t: 'id'; v: string }
  | { t: 'fn'; v: string }
  | { t: 'op'; v: '+' | '-' | '*' | '/' | '^' }
  | { t: '(' }
  | { t: ')' };

const SUPERSCRIPTS: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-',
};

/** Normalise typographic maths into the ASCII grammar. */
export function normaliseMath(input: string): string {
  // NFKC turns superscripts into plain digits, so map them first.
  const s = input
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, (m) => '^(' + [...m].map((c) => SUPERSCRIPTS[c]).join('') + ')')
    .normalize('NFKC');
  return s
    .replace(/[−–—]/g, '-')
    .replace(/[×·⋅]/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'pi')
    .replace(/√/g, 'sqrt')
    .replace(/\*\*/g, '^')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function tokenize(src: string): Token[] {
  const s = normaliseMath(src);
  const out: Token[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i]!;
    if (c === ' ') {
      i++;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      const m = /^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/.exec(s.slice(i));
      if (!m) throw new ParseError(`Unexpected "${c}"`);
      // "2e5" is scientific notation; a bare "2e" leaves "e" for Euler's number.
      const text = m[0];
      const v = Number(text);
      if (!Number.isFinite(v)) throw new ParseError(`Bad number "${text}"`);
      out.push({ t: 'num', v });
      i += text.length;
      continue;
    }
    if (/[a-z]/.test(c)) {
      const rest = s.slice(i);
      const fn = FUNC_NAMES.find((f) => rest.startsWith(f));
      if (fn) {
        out.push({ t: 'fn', v: fn });
        i += fn.length;
      } else if (rest.startsWith('pi')) {
        out.push({ t: 'id', v: 'pi' });
        i += 2;
      } else {
        out.push({ t: 'id', v: c }); // single-letter identifiers: "xy" is x*y
        i++;
      }
      continue;
    }
    if ('+-*/^'.includes(c)) {
      out.push({ t: 'op', v: c as '+' });
      i++;
      continue;
    }
    if (c === '(' || c === '[' || c === '{') {
      out.push({ t: '(' });
      i++;
      continue;
    }
    if (c === ')' || c === ']' || c === '}') {
      out.push({ t: ')' });
      i++;
      continue;
    }
    throw new ParseError(`Unexpected "${c}"`);
  }
  return out;
}

export interface ParseOptions {
  /** Allowed variable names. Any other single letter is an error. */
  variables?: string[];
}

export function parseExpression(src: string, opts: ParseOptions = {}): Expr {
  const tokens = tokenize(src);
  if (tokens.length === 0) throw new ParseError('Empty expression');
  const allowed = new Set(opts.variables ?? []);
  let pos = 0;
  const peek = () => tokens[pos];
  const next = () => tokens[pos++];

  const startsAtom = (tk: Token | undefined) =>
    !!tk && (tk.t === 'num' || tk.t === 'id' || tk.t === 'fn' || tk.t === '(');

  function sum(): Expr {
    let left = product();
    for (;;) {
      const tk = peek();
      if (tk?.t === 'op' && (tk.v === '+' || tk.v === '-')) {
        next();
        const right = product();
        const l = left;
        left = tk.v === '+' ? (v) => l(v) + right(v) : (v) => l(v) - right(v);
      } else return left;
    }
  }

  function product(): Expr {
    let left = unary();
    for (;;) {
      const tk = peek();
      if (tk?.t === 'op' && (tk.v === '*' || tk.v === '/')) {
        next();
        const right = unary();
        const l = left;
        left = tk.v === '*' ? (v) => l(v) * right(v) : (v) => l(v) / right(v);
      } else if (startsAtom(tk)) {
        const right = power(); // implicit multiplication binds like '*'
        const l = left;
        left = (v) => l(v) * right(v);
      } else return left;
    }
  }

  function unary(): Expr {
    const tk = peek();
    if (tk?.t === 'op' && (tk.v === '-' || tk.v === '+')) {
      next();
      const inner = unary();
      return tk.v === '-' ? (v) => -inner(v) : inner;
    }
    return power();
  }

  function power(): Expr {
    const base = call();
    const tk = peek();
    if (tk?.t === 'op' && tk.v === '^') {
      next();
      const exp = unary(); // right-associative: 2^3^2 = 2^(3^2)
      return (v) => Math.pow(base(v), exp(v));
    }
    return base;
  }

  function call(): Expr {
    const tk = peek();
    if (tk?.t === 'fn') {
      next();
      const f = FUNCS[tk.v]!;
      // sin^2 x  ==  (sin x)^2
      let pow: Expr | null = null;
      const after = peek();
      if (after?.t === 'op' && after.v === '^') {
        next();
        pow = atom();
      }
      // sin(x), or sin x / sin 2x where the argument is a tight product of atoms.
      let arg: Expr;
      if (peek()?.t === '(') arg = atom();
      else {
        arg = call();
        while (peek()?.t === 'id') {
          const r = atom();
          const a = arg;
          arg = (v) => a(v) * r(v);
        }
      }
      const p = pow;
      return p ? (v) => Math.pow(f(arg(v)), p(v)) : (v) => f(arg(v));
    }
    return atom();
  }

  function atom(): Expr {
    const tk = next();
    if (!tk) throw new ParseError('Expression ends too early');
    if (tk.t === 'num') {
      const n = tk.v;
      return () => n;
    }
    if (tk.t === 'id') {
      if (tk.v in CONSTS && !allowed.has(tk.v)) {
        const c = CONSTS[tk.v]!;
        return () => c;
      }
      if (!allowed.has(tk.v)) throw new ParseError(`Unknown symbol "${tk.v}"`);
      const name = tk.v;
      return (v) => v[name] ?? NaN;
    }
    if (tk.t === '(') {
      const inner = sum();
      if (next()?.t !== ')') throw new ParseError('Missing closing bracket');
      return inner;
    }
    if (tk.t === 'fn') {
      pos--;
      return call();
    }
    throw new ParseError('Unexpected operator');
  }

  const expr = sum();
  if (pos !== tokens.length) throw new ParseError('Unexpected input after expression');
  return expr;
}

/** Evaluate an expression with no variables, e.g. "2sqrt(5)" or "7/2". */
export function evaluateConstant(src: string): number {
  return parseExpression(src)({});
}

/** Deterministic pseudo-random sequence so checks are reproducible. */
function* samples(seed: number): Generator<number> {
  let x = seed >>> 0 || 1;
  for (;;) {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    yield (x >>> 0) / 0xffffffff;
  }
}

export interface EquivalenceOptions {
  variables: string[];
  domain?: { min: number; max: number };
}

/**
 * Two expressions are treated as equivalent if they agree (to a relative
 * tolerance) at enough sample points where both are defined. Not a proof,
 * but with 24 random points it is reliable for school-level algebra.
 */
export function areEquivalent(a: string, b: string, opts: EquivalenceOptions): boolean {
  const fa = parseExpression(a, { variables: opts.variables });
  const fb = parseExpression(b, { variables: opts.variables });
  const { min, max } = opts.domain ?? { min: -3.7, max: 4.3 };
  const rand = samples(0x9e3779b9);
  let agreed = 0;
  for (let i = 0; i < 60 && agreed < 24; i++) {
    const vars: Record<string, number> = {};
    for (const name of opts.variables) vars[name] = min + (max - min) * rand.next().value!;
    const va = fa(vars);
    const vb = fb(vars);
    const defA = Number.isFinite(va);
    const defB = Number.isFinite(vb);
    if (!defA && !defB) continue;
    if (defA !== defB) return false;
    const scale = Math.max(1, Math.abs(va), Math.abs(vb));
    if (Math.abs(va - vb) > 1e-7 * scale) return false;
    agreed++;
  }
  return agreed >= 8;
}
