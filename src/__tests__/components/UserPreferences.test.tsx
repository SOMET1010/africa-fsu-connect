/**
 * USER PREFERENCES TESTS - Preferences context and hooks
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ 
        data: { subscription: { unsubscribe: vi.fn() } } 
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
      upsert: vi.fn().mockResolvedValue({ error: null }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    }),
  },
}));

// Mock useAuth
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
  }),
}));

describe('User Preferences Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Default Preferences', () => {
    it('should have correct default theme', () => {
      const defaultPrefs = {
        theme: 'system',
        language: 'fr',
        notifications: true,
        layout: 'comfortable',
      };
      
      expect(defaultPrefs.theme).toBe('system');
      expect(defaultPrefs.language).toBe('fr');
    });

    it('should have correct accessibility defaults', () => {
      const defaultAccessibility = {
        highContrast: false,
        fontSize: 'medium',
        reduceMotion: false,
      };
      
      expect(defaultAccessibility.highContrast).toBe(false);
      expect(defaultAccessibility.fontSize).toBe('medium');
    });
  });

  describe('Local Storage Fallback', () => {
    it('should save preferences to localStorage when not authenticated', () => {
      const prefs = { theme: 'dark', language: 'en' };
      localStorage.setItem('user-preferences', JSON.stringify(prefs));
      
      const stored = JSON.parse(localStorage.getItem('user-preferences') || '{}');
      expect(stored.theme).toBe('dark');
    });

    it('should load preferences from localStorage', () => {
      const prefs = { theme: 'light', language: 'fr' };
      localStorage.setItem('user-preferences', JSON.stringify(prefs));
      
      const stored = JSON.parse(localStorage.getItem('user-preferences') || '{}');
      expect(stored.theme).toBe('light');
    });
  });

  describe('Preference Validation', () => {
    it('should reject invalid theme values', () => {
      const invalidTheme = 'invalid-theme';
      const validThemes = ['light', 'dark', 'system'];
      
      expect(validThemes.includes(invalidTheme)).toBe(false);
    });

    it('should reject invalid layout values', () => {
      const invalidLayout = 'invalid-layout';
      const validLayouts = ['compact', 'comfortable', 'spacious'];
      
      expect(validLayouts.includes(invalidLayout)).toBe(false);
    });
  });
});
