import { expect, test } from '@playwright/test';
import { signUp } from './helpers';

test('theme choice is applied immediately and persists', async ({ page }) => {
  await signUp(page);
  await page.goto('/settings');
  await page.getByRole('button', { name: 'Dark' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Match device' }).click();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', /./);
});

test('students can export and then delete all their data', async ({ page }) => {
  await signUp(page);
  await page.goto('/subjects/mathematics/1-1/fixture-squares');
  const q = page.locator('.question').first();
  await q.locator('.option').first().click();
  await q.getByRole('button', { name: 'Check answer' }).click();
  await expect(q.getByText('Correct', { exact: true })).toBeVisible();

  const res = await page.request.get('/api/export');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-disposition']).toContain('attachment');
  const data = await res.json();
  expect(data.attempts).toHaveLength(1);
  expect(JSON.stringify(data)).not.toContain('scrypt');

  await page.goto('/settings');
  await page.getByRole('button', { name: 'Delete my account…' }).click();
  await page.locator('#del-password').fill('a long enough password');
  await page.locator('#del-confirm').fill('delete');
  await page.getByRole('button', { name: 'Delete everything' }).click();
  await expect(page.getByText('Your account and all of its data have been deleted.')).toBeVisible();
  expect((await page.request.get('/api/export')).status()).toBe(401);
});

test('pages that need an account send guests to log in and back', async ({ page }) => {
  await page.goto('/review');
  await page.waitForURL('**/login?next=%2Freview');
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
});

test('wrong passwords get a neutral message', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('nobody@example.org');
  await page.getByLabel('Password').fill('not the password');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.locator('.form-error')).toHaveText('That email and password don’t match.');
});
