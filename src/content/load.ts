/** Reads content YAML from disk. Used by the validator, importer and tests. */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'yaml';
import { LessonFileSchema, SyllabusFileSchema, type LessonFile, type SyllabusFile } from './schema';

/** Override with CONTENT_DIR (used by tests to load fixtures). */
export const CONTENT_DIR = process.env.CONTENT_DIR ? path.resolve(process.env.CONTENT_DIR) : path.join(process.cwd(), 'content', 'subjects');

export interface Issue {
  level: 'error' | 'warning';
  file: string;
  message: string;
}

export interface ContentBundle {
  syllabi: Array<{ file: string; data: SyllabusFile }>;
  lessons: Array<{ file: string; data: LessonFile }>;
  issues: Issue[];
}

function formatZod(error: { issues: Array<{ path: PropertyKey[]; message: string }> }): string[] {
  return error.issues.map((i) => `${i.path.map(String).join('.') || '(root)'}: ${i.message}`);
}

async function readYaml(file: string, issues: Issue[]): Promise<unknown> {
  try {
    return parse(await readFile(file, 'utf8'), { prettyErrors: true, uniqueKeys: true });
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
      issues.push({ level: 'error', file, message: 'file is missing' });
      return undefined;
    }
    issues.push({ level: 'error', file, message: `YAML: ${(e as Error).message}` });
    return undefined;
  }
}

export async function loadContent(dir = CONTENT_DIR): Promise<ContentBundle> {
  const bundle: ContentBundle = { syllabi: [], lessons: [], issues: [] };
  const subjects = (await readdir(dir, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name).sort();

  for (const code of subjects) {
    const syllabusFile = path.join(dir, code, 'syllabus.yaml');
    const raw = await readYaml(syllabusFile, bundle.issues);
    if (raw !== undefined) {
      const parsed = SyllabusFileSchema.safeParse(raw);
      if (parsed.success) bundle.syllabi.push({ file: syllabusFile, data: parsed.data });
      else for (const m of formatZod(parsed.error)) bundle.issues.push({ level: 'error', file: syllabusFile, message: m });
    }

    const lessonDir = path.join(dir, code, 'lessons');
    const files = (await readdir(lessonDir).catch(() => [] as string[])).filter((f) => f.endsWith('.yaml')).sort();
    for (const f of files) {
      const file = path.join(lessonDir, f);
      const data = await readYaml(file, bundle.issues);
      if (data === undefined) continue;
      const parsed = LessonFileSchema.safeParse(data);
      if (parsed.success) bundle.lessons.push({ file, data: parsed.data });
      else for (const m of formatZod(parsed.error)) bundle.issues.push({ level: 'error', file, message: m });
    }
  }
  return bundle;
}
