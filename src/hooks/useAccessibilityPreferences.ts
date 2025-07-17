import { useEffect } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

export const useAccessibilityPreferences = () => {
  const { preferences } = useUserPreferences();

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply font size
    switch (preferences.accessibility.fontSize) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
      default:
        root.style.fontSize = '16px';
    }

    // Apply high contrast
    if (preferences.accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply reduced motion
    if (preferences.accessibility.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Apply screen reader optimizations
    if (preferences.accessibility.screenReader) {
      root.classList.add('screen-reader-optimized');
    } else {
      root.classList.remove('screen-reader-optimized');
    }

    // Apply animations preference
    if (!preferences.layout.animationsEnabled || preferences.accessibility.reduceMotion) {
      root.classList.add('no-animations');
    } else {
      root.classList.remove('no-animations');
    }

  }, [preferences]);

  return {
    isHighContrast: preferences.accessibility.highContrast,
    isReducedMotion: preferences.accessibility.reduceMotion,
    fontSize: preferences.accessibility.fontSize,
    isScreenReaderOptimized: preferences.accessibility.screenReader,
    animationsEnabled: preferences.layout.animationsEnabled && !preferences.accessibility.reduceMotion,
  };
};