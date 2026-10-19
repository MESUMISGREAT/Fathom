/**
 * Deterministic answer checking for recall questions. Pure: takes the full
 * question (server-side only, it contains the answer) and the student's
 * response, returns an outcome and feedback. AI marking of free-form work is
 * a separate, later component; this checker never guesses.
 */
import type { Question } from '@/content/schema';
import { areEquivalent, ParseError, parseExpression } from './expression';
import { parseNumber, toSigFigs, withinTolerance } from './numbers';
import { textMatches } from './text';
import { matchUnit, splitValueAndUnit } from './units';

export type StudentResponse =
  | { format: 'mcq'; choice: number }
  | { format: 'numeric'; values: string[] }
  | { format: 'expression'; value: string }
  | { format: 'text'; value: string }
  | { format: 'cloze'; values: string[] }
  | { format: 'spot-error'; line: number }
  | { format: 'explain'; value: string };

/** The student's own judgement, for formats that cannot be auto-marked. */
export interface SelfAssessment {
  /** text: "I had this right" after comparing with the model answer. */
  correct?: boolean;
  /** explain: indices of key points the student says they covered. */
  points?: number[];
}

export type Outcome =
  /** Fully correct. */
  | 'correct'
  /** Some fields/marks right. */
  | 'partial'
  | 'incorrect'
  /** Cannot be auto-marked: show the model answer and ask the student. */
  | 'self-check'
  /** Input could not be read; nothing is recorded, the student can fix it. */
  | 'invalid';

export interface CheckResult {
  outcome: Outcome;
  /** 0..1 */
  score: number;
  /** True when the score comes from the student's own judgement. */
  selfAssessed: boolean;
  /** Per-field or per-blank results, in order. */
  parts: Array<{ correct: boolean; note?: string; expected?: string }>;
  note?: string;
}

const result = (outcome: Outcome, score: number, extra: Partial<CheckResult> = {}): CheckResult => ({
  outcome,
  score,
  selfAssessed: false,
  parts: [],
  ...extra,
});

function fromParts(parts: CheckResult['parts'], scores: number[]): CheckResult {
  const total = scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length);
  const outcome: Outcome = total >= 1 - 1e-9 ? 'correct' : total > 0 ? 'partial' : 'incorrect';
  return result(outcome, total, { parts });
}

function checkNumericField(
  field: Extract<Question, { format: 'numeric' }>['fields'][number],
  raw: string,
): { score: number; note?: string; invalid?: string } {
  const expected = field.sigFigs ? toSigFigs(field.answer, field.sigFigs) : String(field.answer);
  let numberText = raw.trim();
  let factor = 1;
  if (numberText === '') return { score: 0, invalid: 'Enter an answer in every box.' };

  if (field.acceptUnits) {
    const { number, unit } = splitValueAndUnit(numberText);
    if (unit === '') return { score: 0, note: `Include the unit (expected ${expected} ${field.acceptUnits[0]}).` };
    const match = matchUnit(unit, field.acceptUnits);
    if (!match) return { score: 0, note: `Check the unit: "${unit}" doesn't match. Expected ${field.acceptUnits[0]}.` };
    numberText = number;
    factor = match.factor;
  } else if (parseNumber(numberText) === null) {
    // Be forgiving of a unit typed out of habit, but convert it if it changes the value.
    const { number, unit } = splitValueAndUnit(numberText);
    if (unit && field.unit) {
      const match = matchUnit(unit, [field.unit]);
      if (match) {
        numberText = number;
        factor = match.factor;
      }
    }
  }

  const parsed = parseNumber(numberText);
  if (!parsed) return { score: 0, invalid: `We couldn't read "${raw.trim()}" as a number. Try a form like 3.5, 7/2 or 2.1e-3.` };
  const value = parsed.value * factor;

  let correct: boolean;
  if (field.tolerance) correct = withinTolerance(value, field.answer, field.tolerance);
  else if (field.sigFigs) correct = Number(value.toPrecision(field.sigFigs)) === Number(field.answer.toPrecision(field.sigFigs));
  else correct = withinTolerance(value, field.answer);

  if (!correct) return { score: 0 };
  if (field.sigFigs) {
    if (!parsed.isDecimal) return { score: 0.5, note: `Right value. Now give it as a decimal to ${field.sigFigs} significant figures.` };
    const sf = parsed.sigFigs;
    if (factor === 1 && sf && (field.sigFigs < sf.min || field.sigFigs > sf.max)) {
      return { score: 0.5, note: `Right value, but the question asks for ${field.sigFigs} significant figures (${expected}).` };
    }
  }
  if (factor !== 1) return { score: 1, note: 'Correct, after converting your units.' };
  return { score: 1 };
}

export function checkAnswer(q: Question, r: StudentResponse, self?: SelfAssessment): CheckResult {
  if (q.format !== r.format) return result('invalid', 0, { note: 'Response does not match the question type.' });

  switch (q.format) {
    case 'mcq': {
      const choice = (r as Extract<StudentResponse, { format: 'mcq' }>).choice;
      const opt = q.options[choice];
      if (!opt) return result('invalid', 0, { note: 'Pick one of the options.' });
      return opt.correct ? result('correct', 1) : result('incorrect', 0);
    }

    case 'spot-error': {
      const line = (r as Extract<StudentResponse, { format: 'spot-error' }>).line;
      if (!Number.isInteger(line) || line < 1 || line > q.lines.length) {
        return result('invalid', 0, { note: 'Pick the line that contains the error.' });
      }
      return line === q.errorLine ? result('correct', 1) : result('incorrect', 0);
    }

    case 'numeric': {
      const values = (r as Extract<StudentResponse, { format: 'numeric' }>).values;
      const parts: CheckResult['parts'] = [];
      const scores: number[] = [];
      for (const [i, field] of q.fields.entries()) {
        const f = checkNumericField(field, values[i] ?? '');
        if (f.invalid) return result('invalid', 0, { note: f.invalid });
        parts.push({ correct: f.score >= 1, note: f.note });
        scores.push(f.score);
      }
      return fromParts(parts, scores);
    }

    case 'expression': {
      const value = (r as Extract<StudentResponse, { format: 'expression' }>).value.trim();
      if (value === '') return result('invalid', 0, { note: 'Type your expression first.' });
      try {
        parseExpression(value, { variables: q.variables });
      } catch (e) {
        if (e instanceof ParseError) {
          return result('invalid', 0, { note: `We couldn't read that expression (${e.message}). Use * for times and ^ for powers if in doubt.` });
        }
        throw e;
      }
      const ok = areEquivalent(value, q.answer, { variables: q.variables, domain: q.domain });
      return ok ? result('correct', 1) : result('incorrect', 0);
    }

    case 'cloze': {
      const values = (r as Extract<StudentResponse, { format: 'cloze' }>).values;
      if (q.blanks.some((_, i) => !(values[i] ?? '').trim())) {
        return result('invalid', 0, { note: 'Fill in every blank.' });
      }
      const parts = q.blanks.map((b, i) => {
        const ok = textMatches(values[i] ?? '', b.accept);
        return { correct: ok, expected: ok ? undefined : b.accept[0] };
      });
      return fromParts(parts, parts.map((p) => (p.correct ? 1 : 0)));
    }

    case 'text': {
      const value = (r as Extract<StudentResponse, { format: 'text' }>).value;
      if (!value.trim()) return result('invalid', 0, { note: 'Type an answer first.' });
      if (textMatches(value, q.accept)) return result('correct', 1);
      if (self?.correct !== undefined) {
        return { ...result(self.correct ? 'correct' : 'incorrect', self.correct ? 1 : 0), selfAssessed: true };
      }
      return result('self-check', 0, { note: "That isn't an exact match. Compare with the model answer: were you right?" });
    }

    case 'explain': {
      const value = (r as Extract<StudentResponse, { format: 'explain' }>).value;
      if (!value.trim()) return result('invalid', 0, { note: 'Write your explanation first.' });
      if (!self?.points) {
        return result('self-check', 0, { note: 'Tick the key points your explanation covered.' });
      }
      const covered = new Set(self.points.filter((p) => Number.isInteger(p) && p >= 0 && p < q.keyPoints.length));
      const score = covered.size / q.keyPoints.length;
      const outcome: Outcome = score >= 1 ? 'correct' : score > 0 ? 'partial' : 'incorrect';
      return { ...result(outcome, score), selfAssessed: true };
    }
  }
}

/** A response that the checker should mark fully correct, used to validate content. */
export function modelResponse(q: Question): { response: StudentResponse; self?: SelfAssessment } {
  switch (q.format) {
    case 'mcq':
      return { response: { format: 'mcq', choice: q.options.findIndex((o) => o.correct) } };
    case 'spot-error':
      return { response: { format: 'spot-error', line: q.errorLine } };
    case 'numeric':
      return {
        response: {
          format: 'numeric',
          values: q.fields.map((f) => {
            const v = f.sigFigs ? toSigFigs(f.answer, f.sigFigs).replace(' × 10^', 'e') : String(f.answer);
            return f.acceptUnits ? `${v} ${f.acceptUnits[0]}` : v;
          }),
        },
      };
    case 'expression':
      return { response: { format: 'expression', value: q.answer } };
    case 'cloze':
      return { response: { format: 'cloze', values: q.blanks.map((b) => b.accept[0]!) } };
    case 'text':
      return { response: { format: 'text', value: q.accept[0]! } };
    case 'explain':
      return { response: { format: 'explain', value: q.model }, self: { points: q.keyPoints.map((_, i) => i) } };
  }
}
