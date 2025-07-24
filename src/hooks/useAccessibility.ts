import { useCallback, useEffect } from 'react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { useAccessibilityPreferences } from './useAccessibilityPreferences';

interface AccessibilityConfig {
  enableSkipLinks?: boolean;
  enableScreenReaderAnnouncements?: boolean;
  enableKeyboardNavigation?: boolean;
  enableFocusManagement?: boolean;
}

export const useAccessibility = (config: AccessibilityConfig = {}) => {
  const {
    enableSkipLinks = true,
    enableScreenReaderAnnouncements = true,
    enableKeyboardNavigation = true,
    enableFocusManagement = true
  } = config;

  const { 
    isHighContrast, 
    isReducedMotion, 
    fontSize, 
    isScreenReaderOptimized,
    animationsEnabled 
  } = useAccessibilityPreferences();

  // Screen reader announcements
  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!enableScreenReaderAnnouncements) return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, [enableScreenReaderAnnouncements]);

  // Focus management
  const manageFocus = useCallback((elementId: string) => {
    if (!enableFocusManagement) return;

    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: animationsEnabled ? 'smooth' : 'auto', block: 'center' });
      }
    }, 100);
  }, [enableFocusManagement, animationsEnabled]);

  // Skip link functionality
  const createSkipLink = useCallback((targetId: string, label: string) => {
    if (!enableSkipLinks) return null;

    return {
      href: `#${targetId}`,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        manageFocus(targetId);
        announceToScreenReader(`Navigué vers ${label}`);
      },
      className: "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:font-medium",
      children: `Aller à ${label}`
    };
  }, [enableSkipLinks, manageFocus, announceToScreenReader]);

  // Keyboard shortcuts for accessibility
  const accessibilityShortcuts = enableKeyboardNavigation ? [
    {
      key: 'h',
      alt: true,
      action: () => {
        const heading = document.querySelector('h1, h2, h3') as HTMLElement;
        if (heading) {
          heading.focus();
          announceToScreenReader('Navigué vers le titre principal');
        }
      },
      description: 'Aller au titre principal'
    },
    {
      key: 'm',
      alt: true,
      action: () => {
        const main = document.querySelector('main, [role="main"]') as HTMLElement;
        if (main) {
          main.focus();
          announceToScreenReader('Navigué vers le contenu principal');
        }
      },
      description: 'Aller au contenu principal'
    },
    {
      key: 'n',
      alt: true,
      action: () => {
        const nav = document.querySelector('nav, [role="navigation"]') as HTMLElement;
        if (nav) {
          const firstLink = nav.querySelector('a, button') as HTMLElement;
          firstLink?.focus();
          announceToScreenReader('Navigué vers la navigation');
        }
      },
      description: 'Aller à la navigation'
    },
    {
      key: 's',
      alt: true,
      action: () => {
        const search = document.querySelector('input[type="search"], input[placeholder*="recherch" i]') as HTMLElement;
        if (search) {
          search.focus();
          announceToScreenReader('Champ de recherche activé');
        }
      },
      description: 'Aller à la recherche'
    }
  ] : [];

  useKeyboardShortcuts(accessibilityShortcuts);

  // ARIA live region for dynamic content
  useEffect(() => {
    if (!enableScreenReaderAnnouncements) return;

    const liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'false');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);

    return () => {
      const existing = document.getElementById('aria-live-region');
      if (existing) {
        document.body.removeChild(existing);
      }
    };
  }, [enableScreenReaderAnnouncements]);

  // Enhanced focus indicators
  useEffect(() => {
    if (!enableFocusManagement) return;

    const style = document.createElement('style');
    style.textContent = `
      .enhanced-focus:focus-visible {
        outline: 3px solid hsl(var(--primary));
        outline-offset: 2px;
        box-shadow: 0 0 0 6px hsl(var(--primary) / 0.2);
        transition: ${animationsEnabled ? 'all 0.2s ease-out' : 'none'};
      }
      
      .focus-trap:focus {
        outline: 2px solid hsl(var(--destructive));
        outline-offset: 1px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [enableFocusManagement, animationsEnabled]);

  return {
    announceToScreenReader,
    manageFocus,
    createSkipLink,
    accessibility: {
      isHighContrast,
      isReducedMotion,
      fontSize,
      isScreenReaderOptimized,
      animationsEnabled
    }
  };
};