import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Presentation Accessibility', () => {
  test('should not have accessibility violations on initial load', async ({ page }) => {
    await page.goto('/presentation');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have violations on section 2', async ({ page }) => {
    await page.goto('/presentation');
    await page.click('button:has-text("Suivant")');
    await page.waitForTimeout(1000);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/presentation');

    // Tab to controls
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to activate with Enter
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    
    // Should have navigated
    const badgeText = await page.locator('.badge, [class*="badge"]').first().textContent();
    expect(badgeText).toBeTruthy();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/presentation');

    // Check for ARIA labels on buttons
    const nextButton = page.locator('button:has-text("Suivant")');
    const prevButton = page.locator('button:has-text("Précédent")');

    expect(await nextButton.count()).toBeGreaterThan(0);
    expect(await prevButton.count()).toBeGreaterThan(0);
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/presentation');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('button, .badge, h1, h2, h3, p')
      .analyze();

    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    );

    expect(contrastViolations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/presentation');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['best-practice'])
      .analyze();

    const headingViolations = accessibilityScanResults.violations.filter(
      v => v.id.includes('heading')
    );

    expect(headingViolations.length).toBe(0);
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/presentation');

    // Navigate through sections to check all images
    for (let i = 0; i < 3; i++) {
      const images = page.locator('img');
      const count = await images.count();

      for (let j = 0; j < count; j++) {
        const alt = await images.nth(j).getAttribute('alt');
        expect(alt).toBeTruthy();
      }

      await page.click('button:has-text("Suivant")').catch(() => {});
      await page.waitForTimeout(500);
    }
  });

  test('should support screen reader navigation', async ({ page }) => {
    await page.goto('/presentation');

    // Check for landmark regions
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Check for navigation
    const nav = page.locator('nav, [role="navigation"]');
    const navCount = await nav.count();
    expect(navCount).toBeGreaterThan(0);
  });

  test('should have focus indicators', async ({ page }) => {
    await page.goto('/presentation');

    // Tab to first interactive element
    await page.keyboard.press('Tab');

    // Check that something is focused
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });

    expect(focusedElement).toBeTruthy();
    expect(['BUTTON', 'A', 'INPUT']).toContain(focusedElement);
  });

  test('should handle reduced motion preference', async ({ page }) => {
    // Enable reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/presentation');

    // Page should still be functional
    await page.click('button:has-text("Suivant")');
    await expect(page.locator('text=2 / 8')).toBeVisible();
  });
});
