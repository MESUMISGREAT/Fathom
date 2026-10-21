/**
 * Build command on Vercel (npm runs "vercel-build" there instead of "build").
 * Vercel's file system doesn't persist, so the embedded database can't be
 * used: a hosted PostgreSQL (e.g. Neon from Vercel's Storage tab) must be
 * connected. Migrations and the content import run here, once per deploy,
 * so requests never race to migrate and broken content fails the deploy.
 */
import { execSync } from 'node:child_process';

const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
if (!url) {
  console.error(
    '\nFathom needs a PostgreSQL database on Vercel.\n' +
      'In your Vercel project: Storage → Create Database → Neon (free) → Connect to this project,\n' +
      'then Deployments → ⋯ → Redeploy.\n',
  );
  process.exit(1);
}
const env = { ...process.env, DATABASE_URL: url };
const run = (cmd: string) => execSync(cmd, { stdio: 'inherit', env });
// Preview deployments share the production database, so only production
// builds may migrate it or replace its lessons.
if (process.env.VERCEL_ENV === 'production') {
  run('npx tsx scripts/db-migrate.ts');
  run('npx tsx scripts/content-import.ts');
} else {
  console.log(`Skipping migrations and content import (VERCEL_ENV=${process.env.VERCEL_ENV ?? 'unset'}).`);
}
run('npx next build');
