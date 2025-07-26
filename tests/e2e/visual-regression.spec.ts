import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  
  test('homepage visual snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('dashboard visual snapshot', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('dashboard.png');
  });

  test('organizations page visual snapshot', async ({ page }) => {
    await page.goto('/organizations');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('organizations.png');
  });

  test('projects page visual snapshot', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('projects.png');
  });

  test('components visual regression', async ({ page }) => {
    await page.goto('/');
    
    // Test button variations
    const button = page.getByRole('button').first();
    await expect(button).toHaveScreenshot('button-default.png');
    
    await button.hover();
    await expect(button).toHaveScreenshot('button-hover.png');
  });

  test('dark mode visual snapshot', async ({ page }) => {
    await page.goto('/');
    
    // Switch to dark mode
    await page.getByRole('button', { name: /theme/i }).click();
    await page.getByRole('menuitem', { name: /dark/i }).click();
    
    await page.waitForTimeout(500); // Wait for theme transition
    await expect(page).toHaveScreenshot('homepage-dark.png');
  });

  test('responsive design snapshots', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('dashboard-mobile.png');
    
    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('dashboard-tablet.png');
    
    // Desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('dashboard-desktop.png');
  });
});