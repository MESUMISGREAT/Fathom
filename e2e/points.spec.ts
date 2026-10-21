import { expect, test, type Locator, type Page } from '@playwright/test';
import { addMaths, signUp } from './helpers';

const LESSON = '/subjects/mathematics/1-1/fixture-squares';
/** Topic 1.2's only lesson, with one MCQ check (option A is right). */
const FUNCTIONS = '/subjects/mathematics/1-2/fixture-functions';

/** Answers whatever check this is (right where the fixture makes that easy), and waits for the feedback. */
async function answerAny(q: Locator) {
  await expect(q.locator('form[data-hydrated]')).toBeAttached();
  if (await q.getByLabel('Your expression').count()) await q.getByLabel('Your expression').fill('x(x+4)');
  else if (await q.getByLabel('Blank 1').count()) await q.getByLabel('Blank 1').fill('no');
  else if (await q.getByLabel('a =').count()) {
    await q.getByLabel('a =').fill('3');
    await q.getByLabel('b =').fill('-4');
  } else await q.locator('.option').first().click();
  await q.getByRole('button', { name: 'Check answer' }).click();
  await expect(q.locator('.feedback')).toBeVisible();
}

/** Signs up and finishes the one-check functions lesson (right first time): First Steps, Flawless and Topic Finisher together. */
async function finishFunctions(page: Page) {
  await page.goto(FUNCTIONS);
  const q = page.locator('.question').first();
  await expect(q.locator('form[data-hydrated]')).toBeAttached();
  await q.locator('.option').first().click();
  await q.getByRole('button', { name: 'Check answer' }).click();
  await expect(q.getByText('Correct', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Finish lesson' }).click();
  return page.locator('.celebrate');
}

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
  // The pop is scrolled into view with the result, not left below the fold.
  await expect(q.locator('.xp-pop')).toBeInViewport({ ratio: 1 });
});

test('answering the same question right again earns nothing', async ({ page }) => {
  await signUp(page);
  await page.goto(LESSON);
  const q = await answerFirst(page, 0);
  await expect(q.locator('.xp-pop')).toHaveText('+10 XP');
  // After a right answer, answering again is a quiet option, not the main action.
  await q.getByRole('button', { name: 'Answer again' }).click();
  await q.locator('.option').nth(0).click();
  await q.getByRole('button', { name: 'Check answer' }).click();
  await expect(q.getByText('Correct', { exact: true })).toBeVisible();
  await expect(q.locator('.xp-pop')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('.xp-card .xp-card-total')).toHaveText('10 XP');
});

test('finishing past skipped checks holds the lesson XP back, and says so', async ({ page }) => {
  await signUp(page);
  await page.goto(LESSON);
  await page.getByRole('button', { name: 'All', exact: true }).click();
  // The answer is recorded before finishing (the counts below depend on it).
  await expect((await answerFirst(page, 0)).locator('.feedback')).toBeVisible();
  await page.getByRole('button', { name: 'Finish without answering' }).click();
  const done = page.locator('.celebrate');
  await expect(done.getByRole('heading', { name: 'Lesson complete' })).toBeFocused();
  // Only the answer earned XP: the lesson's 20 waits for the six skipped checks.
  await expect(done.locator('.celebrate-stat[data-kind="xp"] .celebrate-num')).toHaveText('+10');
  await expect(done.getByText('Finished, with 6 checks skipped.')).toBeVisible();
  await expect(done.getByText(/right first time \(1\/7\)/)).toBeVisible();
  await expect(done.getByRole('link', { name: /Next: Fixture lesson on functions/ })).toBeVisible();
  await expect(page.locator('.toaster .toast')).toHaveCount(0); // no First Steps for clicking through
  await expect(page.locator('.xp-card .xp-card-total')).toHaveText('10 XP');
});

test('finishing a lesson celebrates the XP, the topic and the badges, queued', async ({ page }) => {
  await signUp(page);
  const done = await finishFunctions(page);
  await expect(done.getByRole('heading', { name: 'Lesson complete' })).toBeVisible();
  await expect(done.getByText('1.2 Functions finished')).toBeVisible();
  // Answer 10, lesson 20, perfect 10, topic 50 and the daily goal 10, all from the server, with a breakdown.
  const xp = done.locator('.celebrate-stat[data-kind="xp"] .celebrate-num');
  await expect(xp).toHaveText('+100');
  await expect(done.getByRole('list', { name: 'What the XP was for' })).toContainText('Topic finished +50');
  await expect(page.locator('.xp-card .xp-card-total')).toHaveText('100 XP');
  await expect(done.getByText(/right first time \(1\/1\)/)).toBeVisible();
  // Rewards that arrive together queue up, badges first, one at a time; none is dropped.
  const toast = page.locator('.toaster .toast', { hasText: 'First Steps' });
  await expect(toast).toBeVisible();
  await expect(toast).toContainText('You finished your first lesson.');
  await expect(page.locator('.toaster .toast')).toHaveCount(1);
  await toast.getByRole('button', { name: /Dismiss/ }).click();
  await expect(toast).toHaveCount(0);
  const flawless = page.locator('.toaster .toast', { hasText: 'Flawless' });
  await expect(flawless).toBeVisible();
  await flawless.getByRole('button', { name: /Dismiss/ }).click();
  await expect(page.locator('.toaster .toast', { hasText: 'Topic Finisher' })).toBeVisible();
  // On a wide screen they live in the sidebar, never over the lesson, and above its account links.
  const box = await page.locator('.toaster').boundingBox();
  const main = await page.locator('main').boundingBox();
  expect(box && main && box.x + box.width <= main.x).toBe(true);
  const account = await page.locator('.sidebar [aria-label="Account"]').boundingBox();
  expect(box && account && box.y + box.height <= account.y).toBe(true);
});

test('a review session ends on its summary, with the session bonus', async ({ page }) => {
  await signUp(page);
  // Review covers the subjects a student takes.
  await addMaths(page);
  await page.goto(LESSON);
  await page.getByRole('button', { name: 'All', exact: true }).click();
  // Five different checks answered in the lesson (the self-marked ones are left out)…
  for (const i of [0, 1, 2, 4]) await answerAny(page.locator('.question').nth(i));
  const spot = page.locator('.question').nth(5);
  await spot.locator('.option').nth(1).click();
  await spot.getByRole('button', { name: 'Check answer' }).click();
  await expect(spot.locator('.feedback')).toBeVisible();
  // …then made due (a test-only hook; real reviews come back days later).
  const res = await page.request.post('/api/e2e/age-reviews');
  expect(await res.json()).toEqual({ due: 5 });

  await page.goto('/review');
  for (let n = 1; n <= 5; n++) {
    await expect(page.locator('.review-count')).toHaveText(`Question ${n} of 5`);
    await answerAny(page.locator('.question').first());
    const next = page.getByRole('button', { name: n < 5 ? 'Next question' : 'See summary' });
    await next.focus();
    await page.keyboard.press('Enter');
    // Focus moves to the new question's counter, so a second Enter can't skip it.
    if (n < 5) await expect(page.locator('.review-count')).toBeFocused();
  }
  const done = page.locator('.celebrate');
  await expect(done.getByRole('heading', { name: 'Review done' })).toBeFocused();
  await expect(done.locator('.celebrate-stat[data-kind="xp"] .celebrate-label')).toHaveText('XP earned');
  await expect(done.getByRole('list', { name: 'What the XP was for' })).toContainText('Session bonus +15');
  await expect(page.locator('.toaster .toast', { hasText: 'Recall Rookie' })).toBeVisible();
  // The server refreshes the page after paying the bonus; the summary stays.
  await page.waitForLoadState('networkidle');
  await expect(done.getByRole('heading', { name: 'Review done' })).toBeVisible();
  await expect(page.getByText('Nothing to review right now')).toHaveCount(0);
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
  // From the keyboard: the switch keeps focus while (and after) it saves.
  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-checked', 'false');
  await expect(toggle).toBeFocused();
  await expect(page.getByText('Points and badges are hidden.')).toBeVisible();
  await expect(toggle).toBeFocused();
  // The same for the daily goal choices.
  const goal = page.getByRole('button', { name: /Chill/ });
  await goal.focus();
  await page.keyboard.press('Enter');
  await expect(goal).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('Daily goal set to 20 XP.')).toBeVisible();
  await expect(goal).toBeFocused();

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

test('@phone lessons have one bar with the XP chip, and toasts sit over the tab bar', async ({ page }) => {
  await signUp(page);
  await page.goto(FUNCTIONS);
  // In a lesson the lesson bar replaces the top bar, and carries the XP chip.
  await expect(page.locator('.topbar')).toBeHidden();
  const chip = page.locator('.lesson-top .xp-chip');
  await expect(chip).toBeVisible();
  const done = await finishFunctions(page);
  await expect(chip.locator('.xp-chip-total')).toHaveText('100');
  const toast = page.locator('.toaster .toast', { hasText: 'First Steps' });
  await expect(toast).toBeVisible();
  // One at a time on a phone.
  await expect(page.locator('.toaster .toast')).toHaveCount(1);
  await page.waitForTimeout(800); // let the celebration finish scrolling into place and the toast slide up
  const overlaps = (a: { x: number; y: number; width: number; height: number } | null, b: typeof a) =>
    !!a && !!b && a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
  const onTabBar = async () => {
    const t = await page.locator('.toaster .toast').first().boundingBox();
    const tabs = await page.locator('.tabbar').boundingBox();
    const vh = page.viewportSize()!.height;
    // Within the tab bar's own footprint: no lesson content, question or celebration underneath.
    expect(t && tabs && t.y >= tabs.y - 1 && t.y + t.height <= vh + 1).toBe(true);
    // The XP total at the top stays in view while it updates.
    expect(overlaps(t, await chip.boundingBox())).toBe(false);
  };
  await onTabBar();
  await expect(done).toBeVisible();
  // Still docked there after scrolling back up to the question.
  await page.locator('.question').first().scrollIntoViewIfNeeded();
  await onTabBar();
  // Dismissible, without moving focus there first.
  await toast.getByRole('button', { name: /^Dismiss/ }).click();
  await expect(page.locator('.toaster .toast', { hasText: 'First Steps' })).toHaveCount(0);
});

test.describe('@phone at 390 × 844', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('@phone the result and its "+N XP" scroll into view above the tab bar', async ({ page }) => {
    await signUp(page);
    await page.goto(LESSON);
    const q = await answerFirst(page, 0);
    const pop = q.locator('.xp-pop');
    await expect(pop).toHaveText('+10 XP');
    await page.waitForTimeout(800); // the smooth scroll
    const box = (await pop.boundingBox())!;
    const bar = (await page.locator('.lesson-top').boundingBox())!;
    const tabs = (await page.locator('.tabbar').isVisible()) ? await page.locator('.tabbar').boundingBox() : null;
    const floor = tabs ? tabs.y : page.viewportSize()!.height;
    const title = (await q.locator('.feedback-title').boundingBox())!;
    // Below the sticky lesson bar and above the tab bar.
    expect(title.y, 'title top vs lesson bar bottom').toBeGreaterThanOrEqual(bar.y + bar.height);
    expect(box.y + box.height, '"+N XP" bottom vs tab bar top').toBeLessThanOrEqual(floor);
  });
});
