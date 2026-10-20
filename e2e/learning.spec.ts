import { expect, test } from '@playwright/test';
import { a11yViolations, addMaths, collectConsoleErrors, signUp } from './helpers';

const LESSON = '/subjects/mathematics/1-1/fixture-squares';

test('a guest can open a lesson and get feedback without an account', async ({ page }) => {
  const errors = collectConsoleErrors(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'A Level, one small idea at a time.' })).toBeVisible();
  await page.getByRole('link', { name: /Try a lesson/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Fixture lesson on squares' })).toBeVisible();
  const q1 = page.locator('.question').first();
  await q1.locator('.option').first().click();
  await q1.getByRole('button', { name: 'Check answer' }).click();
  await expect(q1.getByText('Correct', { exact: true })).toBeVisible();
  // Guests earn no XP (the server awards none); they're told how to keep it.
  await expect(q1.getByRole('link', { name: 'Sign up to keep your XP' })).toBeVisible();
  await expect(q1.locator('.xp-pop')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('a student signs up, studies a lesson step by step and sees progress', async ({ page }) => {
  const errors = collectConsoleErrors(page);
  await signUp(page);
  await addMaths(page);
  await page.getByRole('link', { name: 'Done, take me to my dashboard' }).click();
  // Nothing studied yet, so not "welcome back".
  await expect(page.getByRole('heading', { name: 'Welcome, Ayesha' })).toBeVisible();
  await page.getByRole('link', { name: 'Start lesson' }).click();
  await expect(page).toHaveURL(new RegExp(`${LESSON}$`));

  // Step 1: only the first check is visible; Continue waits for answers.
  await expect(page.locator('.question')).toHaveCount(2);
  await expect(page.getByText('Answer the 2 questions above to continue.')).toBeVisible();

  // Wrong MCQ answer: explained, then retried.
  const mcq = page.locator('.question').nth(0);
  await mcq.locator('.option').nth(1).click();
  await mcq.getByRole('button', { name: 'Check answer' }).click();
  await expect(mcq.getByText('Not quite')).toBeVisible();
  await expect(mcq.getByText('That uses 6, not half of 6.')).toBeVisible();
  await mcq.getByRole('button', { name: 'Try again' }).click();
  await mcq.locator('.option').nth(0).click();
  await mcq.getByRole('button', { name: 'Check answer' }).click();
  await expect(mcq.getByText('Correct', { exact: true })).toBeVisible();

  // Unreadable numeric input is rejected without recording anything.
  const num = page.locator('.question').nth(1);
  await num.getByLabel('a =').fill('three');
  await num.getByLabel('b =').fill('-4');
  await num.getByRole('button', { name: 'Check answer' }).click();
  await expect(num.getByText(/couldn.t read "three"/)).toBeVisible();
  await num.getByLabel('a =').fill('3');
  await num.getByRole('button', { name: 'Check answer' }).click();
  await expect(num.getByText('Correct', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('.question')).toHaveCount(5);

  // Step 2: expression (any equivalent form), self-checked text, cloze.
  const expr = page.locator('.question').nth(2);
  await expr.getByLabel('Your expression').fill('x(x+4)');
  await expr.getByRole('button', { name: 'Check answer' }).click();
  await expect(expr.getByText('Correct', { exact: true })).toBeVisible();
  const text = page.locator('.question').nth(3);
  await text.getByLabel('Your answer').fill('discrimnant');
  await text.getByRole('button', { name: 'Check answer' }).click();
  await expect(text.getByText('Check it yourself')).toBeVisible();
  await text.getByRole('button', { name: 'Yes, I had it' }).click();
  await expect(text.getByText('self-marked')).toBeVisible();
  const cloze = page.locator('.question').nth(4);
  await cloze.getByLabel('Blank 1').fill('no');
  await cloze.getByRole('button', { name: 'Check answer' }).click();
  await expect(cloze.getByText('Correct', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Continue' }).click();

  // Step 3: skip the last check and finish.
  await page.getByRole('button', { name: 'Finish without answering' }).click();
  await expect(page.getByRole('heading', { name: 'Lesson complete' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Next: Fixture lesson on functions/ })).toBeVisible();

  // Dashboard and progress reflect it.
  await page.goto('/');
  await expect(page.getByText('lessons finished')).toBeVisible();
  await expect(page.locator('.stat-value').nth(2)).toHaveText('1');
  await expect(page.getByRole('heading', { name: 'Fixture lesson on functions' })).toBeVisible();
  await page.goto('/progress');
  await expect(page.getByText('Topics you’ve started')).toBeVisible();
  await expect(page.locator('.topic-row', { hasText: 'Quadratics' })).toBeVisible();
  await page.goto('/history');
  await expect(page.getByText(/Finished/).first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('lessons can be shown in full and the choice is remembered', async ({ page }) => {
  await signUp(page);
  await page.goto(LESSON);
  await expect(page.locator('.question')).toHaveCount(2);
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('.question')).toHaveCount(7);
  await page.reload();
  await expect(page.locator('.question')).toHaveCount(7);
});

test('questions can be answered with the keyboard alone', async ({ page }) => {
  await page.goto(LESSON);
  const mcq = page.locator('.question').first();
  await expect(mcq.locator('form[data-hydrated]')).toBeAttached();
  await mcq.locator('input[type=radio]').first().focus();
  await page.keyboard.press('Space');
  await expect(mcq.locator('input[type=radio]').first()).toBeChecked();
  await page.keyboard.press('Enter');
  await expect(mcq.getByText('Correct', { exact: true })).toBeVisible();
});

test('worked example steps are revealed one at a time', async ({ page }) => {
  await page.goto(LESSON);
  await page.getByRole('button', { name: 'All', exact: true }).click();
  const ex = page.getByRole('region', { name: 'Worked example' });
  await expect(ex.locator('.example-steps li')).toHaveCount(0);
  await ex.getByRole('button', { name: 'Show step 1' }).click();
  await expect(ex.locator('.example-steps li')).toHaveCount(1);
  await ex.getByRole('button', { name: 'Show all steps' }).click();
  await expect(ex.locator('.example-steps li')).toHaveCount(2);
});

test('search ranks exact syllabus codes first and filters questions', async ({ page }) => {
  await page.goto('/search?q=1.1.2');
  await expect(page.locator('.list-row').first()).toContainText('1.1.2');
  await page.goto('/search?q=discriminant&kind=question&format=cloze');
  await expect(page.locator('.list-row')).toHaveCount(1);
  await expect(page.locator('.list-row').first()).toContainText('Fill in the blanks');
});
