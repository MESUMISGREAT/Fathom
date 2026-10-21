import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadContent } from '@/content/load';
import { withoutInvalidLessons } from '@/server/db/content-sync';
import { diagrams } from '@/components/diagrams';

const FIXTURES = path.join(process.cwd(), 'tests', 'fixtures', 'content');
const keys = new Set(Object.keys(diagrams));

describe('start-up import with a broken lesson', () => {
  it('keeps valid lessons and skips only the broken file and lessons that depend on it', async () => {
    const bundle = await loadContent(FIXTURES);
    const total = bundle.lessons.length;
    expect(withoutInvalidLessons(bundle, keys)).toMatchObject({ ok: true, skipped: [] });

    const [first] = bundle.lessons;
    const brokenFile = first!.file.replace(/\.yaml$/, '-broken.yaml');
    const broken = {
      file: brokenFile,
      data: { ...first!.data, id: `${first!.data.id}-broken`, order: 999, blocks: [{ type: 'diagram', diagram: 'no-such-diagram', alt: 'x' }, ...first!.data.blocks] },
    } as (typeof bundle.lessons)[number];
    const dependent = {
      file: first!.file.replace(/\.yaml$/, '-dependent.yaml'),
      data: { ...first!.data, id: `${first!.data.id}-dependent`, order: 998, prerequisites: [broken.data.id] },
    } as (typeof bundle.lessons)[number];
    const result = withoutInvalidLessons({ ...bundle, lessons: [...bundle.lessons, broken, dependent] }, keys);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.bundle.lessons).toHaveLength(total);
    expect(new Set(result.skipped.map((i) => i.file))).toEqual(new Set([brokenFile, dependent.file]));
  });

  it('refuses to import when a syllabus file is invalid', async () => {
    const bundle = await loadContent(FIXTURES);
    const syllabus = bundle.syllabi[0]!;
    const result = withoutInvalidLessons({ ...bundle, issues: [{ level: 'error', file: syllabus.file, message: 'bad' }] }, keys);
    expect(result.ok).toBe(false);
  });
});
