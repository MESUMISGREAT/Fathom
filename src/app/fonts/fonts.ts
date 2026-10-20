/**
 * Self-hosted type, so it looks the same on Windows, Android, Mac and iPhone.
 * Both families are under the SIL Open Font License 1.1 (OFL-*.txt here).
 *
 * - Bricolage Grotesque (display): headings, numbers, the wordmark. Variable
 *   weight and optical size, so big headings get its characterful cuts and
 *   small labels stay sturdy.
 * - Figtree (text): body copy, questions, forms. Open, friendly and very
 *   readable at small sizes, with a double-storey a (never confused with α)
 *   and a plain zero (never confused with ∅), which matters in maths.
 */
import localFont from 'next/font/local';

export const displayFont = localFont({
  src: [{ path: './BricolageGrotesque-latin-opsz-wght.woff2', weight: '200 800', style: 'normal' }],
  variable: '--font-display-face',
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

export const textFont = localFont({
  src: [
    { path: './Figtree-latin-wght.woff2', weight: '300 900', style: 'normal' },
    { path: './Figtree-latin-wght-italic.woff2', weight: '300 900', style: 'italic' },
  ],
  variable: '--font-text-face',
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
  adjustFontFallback: 'Arial',
});
