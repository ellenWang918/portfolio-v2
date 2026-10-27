import { expect, test, type Locator } from '@playwright/test';
import projects from '../../src/data/projects.json' with { type: 'json' };

async function expectCoverLoaded(cover: Locator) {
  await expect(cover).toBeVisible();
  await expect.poll(() => cover.evaluate(element => {
    const images = element instanceof HTMLImageElement
      ? [element]
      : Array.from(element.querySelectorAll('img'));
    return images.length > 0 && images.every(image => image.complete && image.naturalWidth > 0);
  }), { message: 'Every image in the case-study cover must load' }).toBe(true);
}

test('every published case study supports fresh visits and reloads', async ({ page, request }) => {
  for (const project of projects) {
    const response = await page.goto(`./work/${project.id}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1, name: project.title, exact: true })).toBeVisible();
    const hero = page.locator('.case-editorial');
    await expectCoverLoaded(hero);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1, name: project.title, exact: true })).toBeVisible();
    await expectCoverLoaded(hero);
  }
  expect((await request.get('./work/customer-data-analysis-commercial')).status()).toBe(404);
});

test('Work, next project, Home and browser history remain connected', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('.work-grid .project-card')).toHaveCount(4);
  await expect(page.locator('a[href*="customer-data-analysis-commercial"]')).toHaveCount(0);
  await page.locator('.work-grid .project-card').first().click();
  await expect(page.getByRole('heading', { level: 1, name: projects[0].title, exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Next case study' }).click();
  await expect(page.getByRole('heading', { level: 1, name: projects[1].title, exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1, name: projects[0].title, exact: true })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('heading', { level: 1, name: projects[1].title, exact: true })).toBeVisible();
  await page.locator('.case-back').click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('ambiguity');
});

test('About tabs support keyboard selection', async ({ page }) => {
  await page.goto('./#about');
  const professional = page.getByRole('tab', { name: 'Professional', exact: true });
  const leisure = page.getByRole('tab', { name: 'Leisure', exact: true });
  await expect(page.getByRole('tab')).toHaveCount(2);
  await expect(professional).toHaveAttribute('aria-selected', 'true');
  await professional.focus();
  await professional.press('ArrowRight');
  await expect(leisure).toBeFocused();
  await expect(leisure).toHaveAttribute('aria-selected', 'true');
  await expect(professional).toHaveAttribute('aria-selected', 'false');
  await expect(page.getByRole('tabpanel')).toContainText('Love nature.');
  await leisure.press('ArrowRight');
  await expect(professional).toBeFocused();
  await expect(professional).toHaveAttribute('aria-selected', 'true');
  await professional.press('End');
  await expect(leisure).toBeFocused();
  await expect(leisure).toHaveAttribute('aria-selected', 'true');
  await leisure.press('Home');
  await expect(professional).toBeFocused();
  await expect(professional).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText('Curious by nature.');
});

test('all PALMS flip cards expose the active description and preserve keyboard focus', async ({ page }) => {
  await page.goto('./work/design-system-palms');
  const cards = page.locator('.result-card');
  await expect(cards).toHaveCount(7);
  for (let i = 0; i < 7; i++) {
    const card = cards.nth(i);
    const approach = await card.locator('.result-card-front > span[id]').innerText();
    await expect(card).toHaveAccessibleDescription(approach);
    await card.focus();
    await card.press('Enter');
    await expect(card).toHaveAttribute('aria-pressed', 'true');
    await expect(card).toHaveAccessibleDescription(projects[0].approachResults![i]);
    await expect(card).toBeFocused();
    await card.press('Space');
    await expect(card).toHaveAttribute('aria-pressed', 'false');
    await expect(card).toHaveAccessibleDescription(approach);
  }
});

test('contact copies the email address', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async (text: string) => { document.documentElement.dataset.copiedEmail = text; },
    } });
  });
  await page.goto('./#contact');
  await page.getByRole('button', { name: 'Copy email address', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Email address copied' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-copied-email', 'ellenwang918@gmail.com');
});

test('contact remains usable when clipboard access is denied', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async () => { throw new DOMException('Clipboard denied', 'NotAllowedError'); },
    } });
  });
  await page.goto('./#contact');
  await page.getByRole('button', { name: 'Copy email address', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Copy email address', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Let’s talk' })).toHaveAttribute('href', 'mailto:ellenwang918@gmail.com');
  await expect(page.getByText('Copied', { exact: true })).toHaveCount(0);
  expect(errors).toEqual([]);
});
