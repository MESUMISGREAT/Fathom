import { describe, expect, it } from 'vitest';
import { areEquivalent, evaluateConstant, parseExpression } from '@/domain/answers/expression';
import { countSigFigs, parseNumber } from '@/domain/answers/numbers';
import { matchUnit, splitValueAndUnit } from '@/domain/answers/units';
import { normaliseText, textMatches } from '@/domain/answers/text';
import { checkAnswer, modelResponse } from '@/domain/answers/check';
import type { Question } from '@/content/schema';

const base = { id: 'q', prompt: 'p', explanation: 'e', difficulty: 1, objectives: ['1.1.1'] };

describe('expression parser', () => {
  it('evaluates exact numeric forms', () => {
    expect(evaluateConstant('7/2')).toBe(3.5);
    expect(evaluateConstant('2√5')).toBeCloseTo(2 * Math.sqrt(5));
    expect(evaluateConstant('3π')).toBeCloseTo(3 * Math.PI);
    expect(evaluateConstant('2^3^2')).toBe(512);
    expect(evaluateConstant('-2^2')).toBe(-4);
    expect(evaluateConstant('(1+2)(3+4)')).toBe(21);
  });

  it('handles implicit multiplication and function application', () => {
    const f = parseExpression('2x(x+1)', { variables: ['x'] });
    expect(f({ x: 3 })).toBe(24);
    const g = parseExpression('sin 2x', { variables: ['x'] });
    expect(g({ x: 0.3 })).toBeCloseTo(Math.sin(0.6));
    const h = parseExpression('sin^2 x + cos^2 x', { variables: ['x'] });
    expect(h({ x: 1.234 })).toBeCloseTo(1);
    const k = parseExpression('x²−4x', { variables: ['x'] });
    expect(k({ x: 5 })).toBe(5);
  });

  it('rejects unknown symbols instead of guessing', () => {
    expect(() => parseExpression('2y', { variables: ['x'] })).toThrow();
    expect(() => parseExpression('2x +', { variables: ['x'] })).toThrow();
  });

  it('decides algebraic equivalence numerically', () => {
    const opts = { variables: ['x'] };
    expect(areEquivalent('(x+3)^2 - 4', 'x^2 + 6x + 5', opts)).toBe(true);
    expect(areEquivalent('(x+3)^2 - 4', 'x^2 + 6x + 4', opts)).toBe(false);
    expect(areEquivalent('ln(x^2)', '2ln(x)', { variables: ['x'], domain: { min: 0.1, max: 5 } })).toBe(true);
    expect(areEquivalent('1/(x-1)', '1/(x-1)', opts)).toBe(true);
  });
});

describe('numbers', () => {
  it('parses student notations', () => {
    expect(parseNumber('3.0 × 10^8')?.value).toBe(3e8);
    expect(parseNumber('3.0x10⁸')?.value).toBe(3e8);
    expect(parseNumber('1.6e-19')?.value).toBeCloseTo(1.6e-19);
    expect(parseNumber('1,000')?.value).toBe(1000);
    expect(parseNumber('-7/2')?.value).toBe(-3.5);
    expect(parseNumber('banana')).toBeNull();
  });

  it('counts significant figures', () => {
    expect(countSigFigs('0.00340')).toEqual({ min: 3, max: 3 });
    expect(countSigFigs('3400')).toEqual({ min: 2, max: 4 });
    expect(countSigFigs('3400.')).toEqual({ min: 4, max: 4 });
    expect(countSigFigs('2.50')).toEqual({ min: 3, max: 3 });
    expect(parseNumber('3.00 × 10^8')?.sigFigs).toEqual({ min: 3, max: 3 });
  });
});

describe('units', () => {
  it('treats equivalent notations as the same unit', () => {
    for (const u of ['m s^-1', 'm/s', 'ms⁻¹', 'm s–1', 'm s-1']) {
      expect(matchUnit(u, ['m s^-1'])).toEqual({ factor: 1, exact: true });
    }
    expect(matchUnit('kg m s^-2', ['N'])?.exact).toBe(true);
    expect(matchUnit('J/(kg K)', ['J kg^-1 K^-1'])?.exact).toBe(true);
  });

  it('converts scaled units and rejects wrong dimensions', () => {
    expect(matchUnit('cm', ['m'])?.factor).toBeCloseTo(0.01);
    expect(matchUnit('kN', ['N'])?.factor).toBeCloseTo(1000);
    expect(matchUnit('m s^-2', ['m s^-1'])).toBeNull();
    expect(matchUnit('kg', ['N'])).toBeNull();
  });

  it('splits values from units', () => {
    expect(splitValueAndUnit('9.81 m s^-2')).toEqual({ number: '9.81', unit: 'm s^-2' });
    expect(splitValueAndUnit('3.0 × 10^8 m/s')).toEqual({ number: '3.0 × 10^8', unit: 'm/s' });
    expect(splitValueAndUnit('12')).toEqual({ number: '12', unit: '' });
  });
});

describe('text matching', () => {
  it('normalises case, articles, apostrophes and punctuation', () => {
    expect(textMatches("The Two's complement.", ['twos complement'])).toBe(true);
    expect(textMatches('repeated  root', ['repeated root'])).toBe(true);
    expect(textMatches('b² − 4ac', ['b^2-4ac'])).toBe(true);
    expect(normaliseText('x - 1')).toBe('x-1');
  });

  it('does not accept near-miss words', () => {
    expect(textMatches('alkene', ['alkane'])).toBe(false);
    expect(textMatches('x+1', ['x-1'])).toBe(false);
  });
});

describe('checkAnswer', () => {
  it('marks numeric fields with tolerance and significant figures', () => {
    const q: Question = {
      ...base,
      format: 'numeric',
      fields: [{ answer: 9.80665, sigFigs: 3 }],
    };
    expect(checkAnswer(q, { format: 'numeric', values: ['9.81'] }).outcome).toBe('correct');
    const sf = checkAnswer(q, { format: 'numeric', values: ['9.8'] });
    expect(sf.outcome).toBe('incorrect'); // 9.8 is not 9.81 at 3 s.f.
    const sf2 = checkAnswer({ ...q, fields: [{ answer: 9.80665, sigFigs: 3, tolerance: { abs: 0.01 } }] }, { format: 'numeric', values: ['9.807'] });
    expect(sf2.outcome).toBe('partial');
  });

  it('checks units dimensionally and converts', () => {
    const q: Question = { ...base, format: 'numeric', fields: [{ answer: 0.5, acceptUnits: ['m'], tolerance: { rel: 0.01 } }] };
    expect(checkAnswer(q, { format: 'numeric', values: ['0.5 m'] }).outcome).toBe('correct');
    expect(checkAnswer(q, { format: 'numeric', values: ['50 cm'] }).outcome).toBe('correct');
    expect(checkAnswer(q, { format: 'numeric', values: ['0.5'] }).outcome).toBe('incorrect');
    expect(checkAnswer(q, { format: 'numeric', values: ['0.5 kg'] }).outcome).toBe('incorrect');
  });

  it('reports unreadable input as invalid rather than wrong', () => {
    const q: Question = { ...base, format: 'numeric', fields: [{ answer: 2 }] };
    expect(checkAnswer(q, { format: 'numeric', values: ['two-ish'] }).outcome).toBe('invalid');
  });

  it('marks multi-field numeric questions part by part', () => {
    const q: Question = { ...base, format: 'numeric', fields: [{ label: 'a', answer: 3 }, { label: 'b', answer: -4 }] };
    const r = checkAnswer(q, { format: 'numeric', values: ['3', '4'] });
    expect(r.outcome).toBe('partial');
    expect(r.score).toBe(0.5);
  });

  it('falls back to self-check for unmatched text and records it as self-assessed', () => {
    const q: Question = { ...base, format: 'text', style: 'definition', accept: ['discriminant'], model: 'The discriminant' };
    expect(checkAnswer(q, { format: 'text', value: 'discriminant' }).outcome).toBe('correct');
    expect(checkAnswer(q, { format: 'text', value: 'discrimnant' }).outcome).toBe('self-check');
    const self = checkAnswer(q, { format: 'text', value: 'discrimnant' }, { correct: true });
    expect(self).toMatchObject({ outcome: 'correct', selfAssessed: true });
  });

  it('scores explain questions from ticked key points', () => {
    const q: Question = { ...base, format: 'explain', model: 'm', keyPoints: ['a', 'b', 'c', 'd'] };
    expect(checkAnswer(q, { format: 'explain', value: 'my words' }).outcome).toBe('self-check');
    const r = checkAnswer(q, { format: 'explain', value: 'my words' }, { points: [0, 2, 2, 9] });
    expect(r).toMatchObject({ outcome: 'partial', score: 0.5, selfAssessed: true });
  });

  it('accepts the model response for every format', () => {
    const qs: Question[] = [
      { ...base, format: 'mcq', options: [{ text: 'a', correct: false }, { text: 'b', correct: true }] },
      { ...base, format: 'numeric', fields: [{ answer: 299792458, sigFigs: 3, acceptUnits: ['m s^-1'] }] },
      { ...base, format: 'expression', answer: '6x+6', variables: ['x'], display: '$6x+6$' },
      { ...base, format: 'cloze', prompt: '{{1}}', blanks: [{ accept: ['root'] }] },
      { ...base, format: 'spot-error', lines: ['a', 'b', 'c'], errorLine: 2, fix: 'f' },
    ];
    for (const q of qs) {
      const { response, self } = modelResponse(q);
      expect(checkAnswer(q, response, self).outcome, q.format).toBe('correct');
    }
  });
});
