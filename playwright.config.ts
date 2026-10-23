import { existsSync } from 'node:fs';
import { chromium, defineConfig, devices } from '@playwright/test';

const PORT = 3210;

// Cloud sessions ship a newer Chromium than this Playwright pins; fall back to it only when the pinned one is missing.
const SYSTEM_CHROMIUM = '/opt/pw-browsers/chromium';
const executablePath =
  process.env.CHROMIUM_PATH ||
  (!existsSync(chromium.executablePath()) && existsSync(SYSTEM_CHROMIUM) ? SYSTEM_CHROMIUM : undefined);

/**
 * End-to-end tests run against a production build with the fixture content
 * and a throwaway embedded database.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: { baseURL: `http://localhost:${PORT}`, trace: 'retain-on-failure', launchOptions: { executablePath } },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 860 } }, grepInvert: /@phone/ },
    { name: 'phone', use: { ...devices['Pixel 7'] }, grep: /@phone/ },
  ],
  webServer: {
    command: `rm -rf data/e2e-pglite && npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/login`,
    timeout: 300_000,
    reuseExistingServer: false,
    env: {
      CONTENT_DIR: 'tests/fixtures/content',
      PGLITE_DIR: 'data/e2e-pglite',
      INSECURE_COOKIES: '1',
      // Enables src/app/api/e2e (test-only hooks, a 404 otherwise).
      E2E_HOOKS: '1',
      NEXT_TELEMETRY_DISABLED: '1',
    },
  },
});
