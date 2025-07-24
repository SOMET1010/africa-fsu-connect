import { useCallback, useRef } from 'react';
import { useAccessibilityPreferences } from './useAccessibilityPreferences';

interface MicroInteractionOptions {
  haptic?: boolean;
  scale?: number;
  duration?: number;
  delay?: number;
}

export const useMicroInteractions = () => {
  const { animationsEnabled } = useAccessibilityPreferences();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [50],
        heavy: [100]
      };
      navigator.vibrate(patterns[type]);
    }
  }, []);

  const createRippleEffect = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (!animationsEnabled) return;

    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
      z-index: 1000;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }, [animationsEnabled]);

  const animateElement = useCallback((
    element: HTMLElement,
    options: MicroInteractionOptions = {}
  ) => {
    if (!animationsEnabled) return;

    const {
      haptic = false,
      scale = 1.05,
      duration = 150,
      delay = 0
    } = options;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (haptic) triggerHaptic('light');

      element.style.transition = `transform ${duration}ms ease-out`;
      element.style.transform = `scale(${scale})`;

      setTimeout(() => {
        element.style.transform = 'scale(1)';
        setTimeout(() => {
          element.style.transition = '';
        }, duration);
      }, duration);
    }, delay);
  }, [animationsEnabled, triggerHaptic]);

  const getInteractionProps = useCallback((options: MicroInteractionOptions = {}) => ({
    onMouseDown: (e: React.MouseEvent<HTMLElement>) => {
      createRippleEffect(e);
      animateElement(e.currentTarget, options);
    },
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      if (animationsEnabled) {
        e.currentTarget.style.transition = 'transform 200ms ease-out';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      if (animationsEnabled) {
        e.currentTarget.style.transform = 'translateY(0)';
      }
    }
  }), [createRippleEffect, animateElement, animationsEnabled]);

  return {
    triggerHaptic,
    createRippleEffect,
    animateElement,
    getInteractionProps
  };
};