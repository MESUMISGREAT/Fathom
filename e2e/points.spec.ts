import { expect, test } from '@playwright/test';
import { signUp } from './helpers';

const LESSON = '/subjects/mathematics/1-1/fixture-squares';

/** The first question in the fixture lesson is an MCQ (difficulty 1); option A is right, B is wrong. */
async function answerFirst(page: import('@playwright/test').Page, option: number) {
  const q = page.locator('.question').first();
  await expect(q.locator('form[data-hydrated]')).toBeAttached();
  await q.locator('.option').nth(option).click();
  await q.getByRole('button', { name: 'Check answer' }).click();
  return q;
}

test('a correct first answer pops XP and updates the total in the header', async ({ page }) => {
  await signUp(page);
  await page.goto(LESSON);
  const total = page.locator('.xp-card .xp-card-total');
  await expect(total).toHaveText('0 XP');
  const q = await answerFirst(page, 0);
  await expect(q.getByText('Correct', { exact: true })).toBeVisible();
  await expect(q.locator('.xp-pop')).toHaveText('+10 XP');
  await expect(q.getByText('Correct first time')).toBeVisible();
  // The total in the sidebar updates straight away, from the server's result.
  await expect(total).toHaveText('10 XP');
});

test('answering the same question right again earns nothing', async ({ page }) => {
  await signUp(page);
  await page.goto(LESSON);
  const q = await answerFirst(page, 0);
  await expect(q.locator('.xp-pop')).toHaveText('+10 XP');
  await q.getByRole('button', { name: 'Try again' }).click();
  await q.locator('.option').nth(0).click();
  await q.getByRole('button', { name: 'Check answer' }).click();
  await expect(q.getByText('Correct', { exact: true })).toBeVisible();
  await expect(q.locator('.xp-pop')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('.xp-card .xp-card-total')).toHaveText('10 XP');
});

test('finishing a lesson shows the celebration with XP, accuracy and the next lesson', async ({ page }) => {
  await signUp(page);
  await page.goto(LESSON);
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await answerFirst(page, 0);
  await page.getByRole('button', { name: 'Finish without answering' }).click();
  const done = page.locator('.celebrate');
  await expect(done.getByRole('heading', { name: 'Lesson complete' })).toBeVisible();
  // The answer, the lesson and (the fixture topic has one lesson) the topic and daily goal, all from the server.
  const xp = done.locator('.celebrate-stat[data-kind="xp"] .celebrate-num');
  await expect(xp).toHaveText(/^\+\d+$/);
  const earned = Number((await xp.textContent())!.slice(1));
  expect(earned).toBeGreaterThanOrEqual(30);
  // A new student earned everything here, so the header total matches.
  await expect(page.locator('.xp-card .xp-card-total')).toHaveText(`${earned} XP`);
  await expect(done.getByText('XP earned')).toBeVisible();
  await expect(done.getByText(/right first time \(1\/7\)/)).toBeVisible();
  await expect(done.getByRole('link', { name: /Next: Fixture lesson on functions/ })).toBeVisible();
  // The first-lesson badge arrives as a small, dismissible toast; rewards that arrive together queue up, none is dropped.
  const toast = page.locator('.toaster .toast', { hasText: 'First Steps' });
  await expect(toast).toBeVisible();
  await expect(toast).toContainText('You finished your first lesson.');
  await toast.getByRole('button', { name: /Dismiss/ }).click();
  await expect(toast).toHaveCount(0);
  await expect(page.locator('.toaster .toast', { hasText: 'Topic Finisher' })).toBeVisible();
});

test('the achievements page lists locked badges with how to earn them', async ({ page }) => {
  await signUp(page);
  await page.goto('/progress');
  await page.getByRole('link', { name: 'All achievements' }).click();
  await expect(page).toHaveURL(/\/achievements$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Achievements' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Still to earn' })).toBeVisible();
  const locked = page.locator('.badge-tile[data-locked]');
  expect(await locked.count()).toBeGreaterThan(10);
  await expect(locked.filter({ hasText: 'Ten Down' })).toContainText('Finish 10 lessons.');
  await expect(locked.filter({ hasText: 'Ten Down' }).getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
});

test('turning Show points off hides every XP and badge surface', async ({ page }) => {
  await signUp(page);
  await page.goto('/settings');
  const toggle = page.getByRole('switch', { name: 'Show points and badges' });
  await expect(toggle).toHaveAttribute('aria-checked', 'true');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-checked', 'false');
  await expect(page.getByText('Points and badges are hidden.')).toBeVisible();

  await page.goto(LESSON);
  await expect(page.locator('.xp-card')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Achievements' })).toHaveCount(0);
  const q = await answerFirst(page, 0);
  await expect(q.getByText('Correct', { exact: true })).toBeVisible();
  await expect(q.locator('.xp-pop')).toHaveCount(0);
  await page.goto('/');
  await expect(page.getByText(/XP/)).toHaveCount(0);
  await page.goto('/progress');
  await expect(page.getByText('Badges')).toHaveCount(0);

  // XP was still recorded: turning it back on shows the real total.
  await page.goto('/settings');
  await page.getByRole('switch', { name: 'Show points and badges' }).click();
  await expect(page.getByText('Points and badges are back.')).toBeVisible();
  await page.goto('/');
  await expect(page.locator('.xp-card .xp-card-total')).toHaveText('10 XP');
});

test('@phone the XP chip sits in the top bar and toasts stay above the tab bar', async ({ page }) => {
  await signUp(page);
  await page.goto(LESSON);
  const chip = page.locator('.topbar .xp-chip');
  await expect(chip).toBeVisible();
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await answerFirst(page, 0);
  await expect(chip.locator('.xp-chip-total')).toHaveText('10');
  await page.getByRole('button', { name: 'Finish without answering' }).click();
  const toast = page.locator('.toaster .toast', { hasText: 'First Steps' });
  await expect(toast).toBeVisible();
  // One at a time on a phone.
  await expect(page.locator('.toaster .toast')).toHaveCount(1);
  await page.waitForTimeout(800); // let the celebration finish scrolling into place
  const t = await toast.boundingBox();
  const bar = await page.locator('.tabbar').boundingBox();
  const end = await page.locator('.celebrate').boundingBox();
  expect(t && bar && t.y + t.height <= bar.y).toBe(true);
  // Never on top of the card the student just finished.
  expect(t && end && (t.y + t.height <= end.y || t.y >= end.y + end.height)).toBe(true);
});
