import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { DIAGRAM_ROOT, scanDiagrams } from '../scripts/diagram-scan';
import { registrySource } from '../scripts/gen-diagrams';
import { diagrams } from '@/components/diagrams';

describe('diagram registry', () => {
  const { files, problems } = scanDiagrams();

  it('has no problems in diagram files', () => {
    expect(problems).toEqual([]);
  });

  it('is up to date with the files on disk (run npm run diagrams:gen)', () => {
    for (const code of ['9709', '9618', '9702', '9701']) {
      const onDisk = readFileSync(path.join(DIAGRAM_ROOT, code, 'index.ts'), 'utf8');
      expect(onDisk).toBe(registrySource(code, files.filter((f) => f.code === code)));
    }
    expect(Object.keys(diagrams).sort()).toEqual(files.map((f) => f.key).sort());
  });
});
