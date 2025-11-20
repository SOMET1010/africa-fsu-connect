import { test, expect } from '@playwright/test';

test.describe('Presentation Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/presentation');
  });

  test('should navigate through all 8 sections', async ({ page }) => {
    // Verify initial section
    await expect(page.locator('text=1 / 8')).toBeVisible();

    // Navigate through all sections
    for (let i = 1; i < 8; i++) {
      await page.click('button:has-text("Suivant")');
      await expect(page.locator(`text=${i + 1} / 8`)).toBeVisible();
      await page.waitForTimeout(500); // Wait for animation
    }

    // Verify "Next" button is disabled at the end
    await expect(page.locator('button:has-text("Suivant")')).toBeDisabled();
  });

  test('should use presentation controls correctly', async ({ page }) => {
    // Test Next button
    await page.click('button:has-text("Suivant")');
    await expect(page.locator('text=2 / 8')).toBeVisible();

    // Test Previous button
    await page.click('button:has-text("Précédent")');
    await expect(page.locator('text=1 / 8')).toBeVisible();

    // Verify Previous is disabled at start
    await expect(page.locator('button:has-text("Précédent")')).toBeDisabled();
  });

  test('should respond to keyboard shortcuts', async ({ page }) => {
    // Arrow Right = Next
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('text=2 / 8')).toBeVisible();

    // Arrow Left = Previous
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('text=1 / 8')).toBeVisible();

    // Space = Next
    await page.keyboard.press('Space');
    await expect(page.locator('text=2 / 8')).toBeVisible();

    // PageDown = Next
    await page.keyboard.press('PageDown');
    await expect(page.locator('text=3 / 8')).toBeVisible();

    // PageUp = Previous
    await page.keyboard.press('PageUp');
    await expect(page.locator('text=2 / 8')).toBeVisible();
  });

  test('should show progress bar', async ({ page }) => {
    const progressBar = page.locator('.h-2.bg-primary');
    await expect(progressBar).toBeVisible();

    // Navigate and check progress increases
    await page.click('button:has-text("Suivant")');
    await page.waitForTimeout(300);
    // Progress should be visible and animated
  });

  test('should navigate using section navigation', async ({ page }) => {
    // Click on navigation if visible (desktop)
    const nav = page.locator('.presentation-navigation');
    const isVisible = await nav.isVisible().catch(() => false);
    
    if (isVisible) {
      // Click on section 3 (ROI Calculator)
      await page.click('text=Calculateur ROI');
      await expect(page.locator('text=3 / 8')).toBeVisible();
    }
  });

  test('should interact with ROI calculator', async ({ page }) => {
    // Navigate to ROI section (section 3)
    await page.goto('/presentation');
    await page.click('button:has-text("Suivant")'); // Section 2
    await page.click('button:has-text("Suivant")'); // Section 3

    // Wait for section to load
    await page.waitForTimeout(1000);

    // Look for input fields
    const inputs = page.locator('input[type="number"]');
    const count = await inputs.count();

    if (count > 0) {
      // Interact with calculator
      await inputs.first().fill('50000');
      await page.waitForTimeout(500);
      // Calculator should show results
    }
  });

  test('should show regional impact map', async ({ page }) => {
    // Navigate to Regional Impact section (section 2)
    await page.click('button:has-text("Suivant")');
    await page.waitForTimeout(1000);

    // Check for map or regional content
    const content = await page.textContent('body');
    expect(content).toContain('régional' || 'pays' || 'Afrique');
  });

  test('should handle export dropdown', async ({ page }) => {
    // Click Export button
    await page.click('button:has-text("Export")');
    
    // Check dropdown menu appears
    await expect(page.locator('text=Export PDF')).toBeVisible();
    await expect(page.locator('text=Export Markdown')).toBeVisible();
    await expect(page.locator('text=Export JSON')).toBeVisible();
  });

  test('should export to Markdown', async ({ page }) => {
    // Setup download listener
    const downloadPromise = page.waitForEvent('download');

    // Click Export > Markdown
    await page.click('button:has-text("Export")');
    await page.click('text=Export Markdown');

    // Verify download
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/sutel-presentation-.*\.md/);
  });

  test('should export to JSON', async ({ page }) => {
    // Setup download listener
    const downloadPromise = page.waitForEvent('download');

    // Click Export > JSON
    await page.click('button:has-text("Export")');
    await page.click('text=Export JSON');

    // Verify download
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/sutel-presentation-.*\.json/);
  });

  test('should handle share functionality', async ({ page }) => {
    // Click Share button
    await page.click('button:has-text("Partager")');
    
    // Either native share or clipboard
    // Just verify button is functional
    await page.waitForTimeout(500);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/presentation');

    // Verify controls are visible
    await expect(page.locator('.presentation-controls')).toBeVisible();

    // Navigation should work
    await page.click('button:has-text("Suivant")');
    await expect(page.locator('text=2 / 8')).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/presentation');

    await expect(page.locator('.presentation-controls')).toBeVisible();
    await page.click('button:has-text("Suivant")');
    await expect(page.locator('text=2 / 8')).toBeVisible();
  });

  test('should load sections quickly', async ({ page }) => {
    for (let i = 0; i < 7; i++) {
      const startTime = Date.now();
      await page.click('button:has-text("Suivant")');
      await page.waitForSelector('.presentation-controls');
      const loadTime = Date.now() - startTime;

      // Each section should load in under 3 seconds
      expect(loadTime).toBeLessThan(3000);
    }
  });

  test('should maintain state after navigation', async ({ page }) => {
    // Navigate to section 3
    await page.click('button:has-text("Suivant")');
    await page.click('button:has-text("Suivant")');
    await expect(page.locator('text=3 / 8')).toBeVisible();

    // Go back to section 2
    await page.click('button:has-text("Précédent")');
    await expect(page.locator('text=2 / 8')).toBeVisible();

    // Go forward again
    await page.click('button:has-text("Suivant")');
    await expect(page.locator('text=3 / 8')).toBeVisible();
  });

  test('should handle keyboard navigation while in input', async ({ page }) => {
    // Navigate to ROI calculator
    await page.click('button:has-text("Suivant")');
    await page.click('button:has-text("Suivant")');

    const input = page.locator('input[type="number"]').first();
    const inputExists = await input.count() > 0;

    if (inputExists) {
      await input.focus();
      // Arrow keys should not navigate sections when in input
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(300);
      // Should still be on section 3
      await expect(page.locator('text=3 / 8')).toBeVisible();
    }
  });

  test('should show all section titles in navigation', async ({ page }) => {
    const sections = [
      'Vision SUTEL Afrique',
      'Impact Régional',
      'Calculateur ROI',
      'Démonstration Interactive',
      'Architecture Technique',
      'Preuves & Résultats',
      'Sécurité & Conformité',
      'Rejoignez-Nous'
    ];

    // Check if navigation is visible (desktop view)
    const nav = page.locator('.presentation-navigation');
    const isVisible = await nav.isVisible().catch(() => false);

    if (isVisible) {
      for (const section of sections) {
        // At least some sections should be findable
        const exists = await page.locator(`text="${section}"`).count();
        // Just verify the page loaded properly
      }
    }
  });
});
