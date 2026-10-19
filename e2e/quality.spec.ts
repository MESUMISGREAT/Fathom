import { expect, test } from '@playwright/test';
import { a11yViolations, addMaths, signUp } from './helpers';

const PUBLIC = ['/', '/subjects', '/subjects/mathematics', '/subjects/mathematics/1-1', '/subjects/mathematics/1-1/fixture-squares', '/subjects/mathematics/coverage', '/search?q=square', '/about', '/privacy', '/login', '/signup'];
const PRIVATE = ['/', '/progress', '/review', '/saved', '/history', '/settings'];

test('public pages have no serious accessibility violations, in light and dark', async ({ page }) => {
  const found: string[] = [];
  for (const scheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    for (const url of PUBLIC) {
      await page.goto(url);
      for (const v of await a11yViolations(page)) found.push(`${scheme} ${url} ${v}`);
    }
  }
  expect(found).toEqual([]);
});

test('signed-in pages have no serious accessibility violations', async ({ page }) => {
  await signUp(page);
  await addMaths(page);
  const found: string[] = [];
  for (const url of PRIVATE) {
    await page.goto(url);
    for (const v of await a11yViolations(page)) found.push(`${url} ${v}`);
  }
  expect(found).toEqual([]);
  // Feedback states too.
  await page.goto('/subjects/mathematics/1-1/fixture-squares');
  const q = page.locator('.question').first();
  await q.locator('.option').nth(1).click();
  await q.getByRole('button', { name: 'Check answer' }).click();
  await expect(q.getByText('Not quite')).toBeVisible();
  expect(await a11yViolations(page), 'lesson with feedback').toEqual([]);
});

test('security headers and a nonce-based CSP are sent', async ({ page }) => {
  const res = await page.goto('/');
  const h = res!.headers();
  expect(h['content-security-policy']).toMatch(/script-src 'self' 'nonce-[^']+' 'strict-dynamic'/);
  expect(h['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(h['content-security-policy']).not.toContain('unsafe-eval');
  expect(h['x-content-type-options']).toBe('nosniff');
  expect(h['x-frame-options']).toBe('DENY');
  expect(h['x-powered-by']).toBeUndefined();
  const second = await page.goto('/');
  expect(second!.headers()['content-security-policy']).not.toBe(h['content-security-policy']);
});

test('the session cookie is HttpOnly and SameSite=Lax', async ({ page, context }) => {
  await signUp(page);
  const c = (await context.cookies()).find((x) => x.name === 'fathom_session')!;
  expect(c.httpOnly).toBe(true);
  expect(c.sameSite).toBe('Lax');
});

test('@phone no page scrolls sideways on a phone', async ({ page }) => {
  for (const url of PUBLIC) {
    await page.goto(url);
    const { sw, vw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth }));
    expect(sw, url).toBeLessThanOrEqual(vw);
  }
});

test('@phone the tab bar navigates on a phone', async ({ page }) => {
  await page.goto('/');
  const tabs = page.getByRole('navigation', { name: 'Main navigation' }).last();
  await tabs.getByRole('link', { name: 'Subjects' }).click();
  await expect(page).toHaveURL(/\/subjects$/);
  await expect(tabs.getByRole('link', { name: 'Subjects' })).toHaveAttribute('aria-current', 'page');
});
