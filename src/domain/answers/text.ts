/**
 * Normalisation for short typed answers. Deliberately conservative: no fuzzy
 * spelling tolerance, because near-miss words are often different answers in
 * these subjects (alkane/alkene, propanal/propanol). Anything that does not
 * match falls back to the student comparing with the model answer.
 */
const SUP: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' };

export function normaliseText(input: string, hyphens: 'keep' | 'space' = 'keep'): string {
  let s = input
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, (m) => '^' + [...m].map((c) => SUP[c]).join(''))
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[−–—]/g, '-')
    .replace(/'/g, '');
  if (hyphens === 'space') s = s.replace(/-/g, ' ');
  return s
    .replace(/[^\p{L}\p{N}\s^+\-*/=<>.,()]/gu, ' ')
    .replace(/\s*([+\-*/=<>^(),])\s*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(the|a|an) /, '')
    .replace(/[.,]+$/, '')
    .trim();
}

export function textMatches(answer: string, accept: string[]): boolean {
  for (const mode of ['keep', 'space'] as const) {
    const a = normaliseText(answer, mode);
    if (a === '') continue;
    if (accept.some((x) => normaliseText(x, mode) === a)) return true;
  }
  return false;
}
