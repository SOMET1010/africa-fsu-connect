import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  
  test('homepage accessibility', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('dashboard accessibility', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation and skip links', async ({ page }) => {
    await page.goto('/');
    
    // Test skip links functionality
    await page.keyboard.press('Tab');
    const skipLink = page.getByText('Aller au contenu principal');
    expect(await skipLink.isVisible()).toBe(true);
    
    // Test skip link navigation
    await skipLink.click();
    const mainContent = page.locator('#main-content');
    expect(await mainContent.isVisible()).toBe(true);
    
    // Test that main content receives focus
    const focusedElement = await page.locator(':focus');
    expect(await focusedElement.getAttribute('id')).toBe('main-content');
    
    // Test additional skip links for authenticated users
    await page.goto('/dashboard');
    await page.keyboard.press('Tab');
    const navigationSkipLink = page.getByText('Aller à la navigation');
    if (await navigationSkipLink.count() > 0) {
      expect(await navigationSkipLink.isVisible()).toBe(true);
    }
  });

  test('screen reader compatibility', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check for ARIA labels
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const hasAriaLabel = await button.getAttribute('aria-label');
      const hasAccessibleName = await button.textContent();
      
      expect(hasAriaLabel || hasAccessibleName).toBeTruthy();
    }
  });

  test('color contrast compliance', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('[role="main"]')
      .analyze();
    
    const colorContrastViolations = accessibilityScanResults.violations
      .filter(violation => violation.id === 'color-contrast');
    
    expect(colorContrastViolations).toHaveLength(0);
  });

  test('form accessibility', async ({ page }) => {
    await page.goto('/submit');
    
    // Check form labels
    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const labelFor = await page.locator(`label[for="${await input.getAttribute('id')}"]`).count();
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      expect(labelFor > 0 || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
  });
});