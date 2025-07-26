import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  
  test('page load performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // 3 seconds max
  });

  test('core web vitals', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Measure Web Vitals
    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        let vitals = {};
        
        // FCP - First Contentful Paint
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              vitals.fcp = entry.startTime;
            }
          }
        });
        observer.observe({ entryTypes: ['paint'] });
        
        // LCP - Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            vitals.lcp = entry.startTime;
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        setTimeout(() => resolve(vitals), 2000);
      });
    });
    
    expect(webVitals.fcp).toBeLessThan(1800); // FCP < 1.8s
    expect(webVitals.lcp).toBeLessThan(2500); // LCP < 2.5s
  });

  test('bundle size analysis', async ({ page }) => {
    const response = await page.goto('/');
    
    // Check main bundle size
    const resources = await page.evaluate(() => {
      return performance.getEntriesByType('resource')
        .filter(resource => resource.name.includes('.js'))
        .reduce((total, resource) => total + (resource.transferSize || 0), 0);
    });
    
    expect(resources).toBeLessThan(1024 * 1024); // 1MB max for JS bundles
  });

  test('interaction responsiveness', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Measure button click responsiveness
    const startTime = Date.now();
    await page.getByRole('button').first().click();
    const clickResponseTime = Date.now() - startTime;
    
    expect(clickResponseTime).toBeLessThan(100); // 100ms max
  });

  test('memory usage', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Simulate heavy usage
    for (let i = 0; i < 10; i++) {
      await page.reload();
      await page.waitForLoadState('networkidle');
    }
    
    const memoryUsage = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });
    
    // Should not exceed 50MB
    expect(memoryUsage).toBeLessThan(50 * 1024 * 1024);
  });
});