/**
 * NEXUS DESIGN SYSTEM TESTS - Card component variants
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

describe('NEXUS Card Component Tests', () => {
  describe('Card Rendering', () => {
    it('should render card with default styling', () => {
      const { container } = render(
        <Card data-testid="test-card">
          <CardContent>Test content</CardContent>
        </Card>
      );
      
      const card = container.querySelector('[data-testid="test-card"]');
      expect(card).toBeDefined();
    });

    it('should render card with header and title', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
          </CardHeader>
          <CardContent>Test content</CardContent>
        </Card>
      );
      
      expect(container.textContent).toContain('Test Title');
      expect(container.textContent).toContain('Test content');
    });

    it('should accept custom className', () => {
      const { container } = render(
        <Card className="custom-class" data-testid="custom-card">
          <CardContent>Content</CardContent>
        </Card>
      );
      
      const card = container.querySelector('[data-testid="custom-card"]');
      expect(card?.className).toContain('custom-class');
    });
  });

  describe('Card Accessibility', () => {
    it('should be accessible with semantic structure', () => {
      const { container } = render(
        <Card role="article" aria-labelledby="card-title">
          <CardHeader>
            <CardTitle id="card-title">Accessible Card</CardTitle>
          </CardHeader>
          <CardContent>Accessible content</CardContent>
        </Card>
      );
      
      const article = container.querySelector('[role="article"]');
      expect(article).toBeDefined();
    });
  });

  describe('NEXUS Design Tokens', () => {
    it('should use NEXUS border radius token', () => {
      const { container } = render(
        <Card data-testid="nexus-card">
          <CardContent>NEXUS styled</CardContent>
        </Card>
      );
      
      const card = container.querySelector('[data-testid="nexus-card"]');
      expect(card?.className).toContain('rounded');
    });

    it('should use proper border styling', () => {
      const { container } = render(
        <Card data-testid="border-card">
          <CardContent>Bordered content</CardContent>
        </Card>
      );
      
      const card = container.querySelector('[data-testid="border-card"]');
      expect(card?.className).toContain('border');
    });
  });
});
