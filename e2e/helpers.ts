import { expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export async function signUp(page: Page, name = 'Ayesha') {
  const email = `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.org`;
  await page.goto('/signup');
  await page.getByLabel('First name').fill(name);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password', { exact: true }).fill('a long enough password');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.waitForURL('**/subjects?welcome=1');
  return email;
}

export async function addMaths(page: Page) {
  await page.getByRole('button', { name: 'Add Maths' }).click();
  await expect(page.getByText('Added')).toBeVisible();
}

/** Serious or critical WCAG A/AA violations. */
export async function a11yViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  return results.violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(', ')})`);
}

export function collectConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}
