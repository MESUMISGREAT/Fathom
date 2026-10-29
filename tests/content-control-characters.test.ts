import { describe, expect, it } from 'vitest';
import { Md } from '@/content/schema';

/**
 * A LaTeX command written with a single backslash inside a double-quoted YAML
 * scalar turns into a control character: "\rightarrow" arrives as CR + "ightarrow".
 * Students then see "ightarrow" and "extNaCl" instead of an arrow and \text{NaCl}.
 * The guard lives on Md so it covers every markdown field in every block and question.
 */
describe('markdown fields reject raw control characters', () => {
  // Each value holds a REAL control character, exactly what YAML produces from \t, \r, ...
  const corrupted: Array<[string, string]> = [
    ['TAB from \\t', 'the arrow $\trightarrow$ is broken'],
    ['carriage return from \\r', 'the arrow $\rightarrow$ is broken'],
    ['form feed from \\f', 'text $\frac{1}{2}$'],
    ['vertical tab from \\v', 'value $\vec{v}$'],
    ['BEL from \\a', 'angle $\x07alpha$'],
    ['backspace from \\b', 'bold $\beta$'],
    ['NUL from \\0', 'root $\x00sqrt{2}$'],
  ];

  it.each(corrupted)('rejects %s', (_label, value) => {
    const result = Md.safeParse(value);
    expect(result.success).toBe(false);
  });

  it('names the character and tells the writer how to fix it', () => {
    const result = Md.safeParse('the arrow $\rightarrow$ is broken');
    expect(result.success).toBe(false);
    const message = result.success ? '' : result.error.issues[0]!.message;
    expect(message).toContain('carriage return');
    expect(message).toContain('U+000D');
    expect(message).toContain('block scalar');
    expect(message).toContain('single-quoted');
  });

  it('accepts correct LaTeX written in a block scalar or single quotes', () => {
    expect(Md.safeParse(String.raw`the arrow $\rightarrow$ is fine`).success).toBe(true);
    expect(Md.safeParse(String.raw`$\text{NaCl}$ and $\rho = 1.7 \times 10^{-8}$`).success).toBe(true);
    expect(Md.safeParse("single-quoted '\\rightarrow' stays literal").success).toBe(true);
  });

  it('still accepts ordinary multi-line text and tabs-free whitespace', () => {
    expect(Md.safeParse('first paragraph\n\nsecond paragraph').success).toBe(true);
    expect(Md.safeParse('x² → 2x, a rule table, ½ is allowed as a glyph').success).toBe(true);
  });

  it('does not reject an ordinary space or a real tab-free table row', () => {
    expect(Md.safeParse('| x | y |\n|---|---|\n| 1 | 2 |').success).toBe(true);
  });
});
