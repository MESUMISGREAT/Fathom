/**
 * Finds diagram components on disk without importing them, so the content
 * validator keeps working even if one diagram file has a compile error.
 * A diagram file is any src/components/diagrams/<code>/*.tsx that declares
 *   export const diagramKey = '<key>';
 * and has a default export. Other .tsx files there are helpers (e.g. kit.tsx).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

export const DIAGRAM_ROOT = path.join(process.cwd(), 'src', 'components', 'diagrams');

export interface DiagramFile {
  code: string;
  key: string;
  /** File name without extension, e.g. "quadratic-vertex". */
  name: string;
  file: string;
}

export function scanDiagrams(root = DIAGRAM_ROOT): { files: DiagramFile[]; problems: string[] } {
  const files: DiagramFile[] = [];
  const problems: string[] = [];
  const seen = new Map<string, string>();
  for (const code of readdirSync(root).sort()) {
    const dir = path.join(root, code);
    if (!statSync(dir).isDirectory()) continue;
    for (const f of readdirSync(dir).sort()) {
      if (!f.endsWith('.tsx')) continue;
      const file = path.join(dir, f);
      const src = readFileSync(file, 'utf8');
      const m = /export const diagramKey\s*=\s*['"]([^'"]+)['"]/.exec(src);
      if (!m) continue;
      const key = m[1]!;
      const rel = path.relative(process.cwd(), file);
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(key)) problems.push(`${rel}: diagramKey "${key}" must be kebab-case`);
      if (!/export default /.test(src)) problems.push(`${rel}: diagram file needs a default export (the component)`);
      if (seen.has(key)) problems.push(`${rel}: diagramKey "${key}" is also used by ${seen.get(key)}`);
      seen.set(key, rel);
      files.push({ code, key, name: f.slice(0, -4), file });
    }
  }
  return { files, problems };
}
