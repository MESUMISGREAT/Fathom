import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { diagrams } from '@/components/diagrams';
import { diagrams as maths } from '@/components/diagrams/9709';

/** The plain-SVG <text> a diagram shows (MathLabel output is HTML inside <foreignObject>, so it isn't included). */
function plainText(key: string): string[] {
  const html = renderToStaticMarkup(createElement(diagrams[key]!));
  return [...html.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)].map((m) =>
    m[1]!.replace(/<[^>]+>/g, '').replace(/&#x27;/g, "'").replace(/&amp;/g, '&'),
  );
}

describe('diagram notation', () => {
  it('every diagram renders (including its MathLabel LaTeX)', () => {
    for (const key of Object.keys(diagrams)) expect(() => plainText(key), key).not.toThrow();
  });

  // Plain SVG text can't draw a root sign over a whole expression, so roots go in a MathLabel.
  it('has no root signs in plain text', () => {
    const bad = Object.keys(diagrams).flatMap((k) => plainText(k).filter((t) => /[√∛∜]/.test(t)).map((t) => `${k}: ${t}`));
    expect(bad.join("\n")).toBe("");
  });

  // Maths fractions get a real fraction bar (MathLabel with \dfrac), never a slash or a ½-style glyph.
  it('has no slash fractions in maths diagrams', () => {
    const slash = /⁄|[½⅓¼¾⅔⅛]|[0-9A-Za-z)²³πθ]\s*\/\s*[0-9(A-Za-zπθ]/;
    const bad = Object.keys(maths).flatMap((k) => plainText(k).filter((t) => slash.test(t)).map((t) => `${k}: ${t}`));
    expect(bad.join("\n")).toBe("");
  });
});
