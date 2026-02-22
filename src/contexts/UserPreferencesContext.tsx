import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { logger } from '@/utils/logger';
import { type SupportedLanguage } from '@/i18n/languages';
import { changeLanguage as i18nChangeLanguage } from '@/i18n/config';

export interface UserPreferences {
  // Interface et navigation
  theme: 'light' | 'dark' | 'system';
  language: SupportedLanguage; // 'fr' | 'en' | 'pt' | 'ar'
  navigation_level: 'beginner' | 'standard' | 'expert';
  homeLayout: 'light' | 'immersive';
  notifications: {
    email: boolean;
    push: boolean;
    forum: boolean;
    events: boolean;
    submissions: boolean;
  };
  layout: {
    sidebarCollapsed: boolean;
    compactMode: boolean;
    animationsEnabled: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reduceMotion: boolean;
    fontSize: 'small' | 'medium' | 'large';
    screenReader: boolean;
  };
  dashboard: {
    favoriteWidgets: string[];
    widgetOrder: string[];
    refreshInterval: number;
  };
}

const defaultPreferences: UserPreferences = {
  theme: 'light',
  language: 'fr',
  navigation_level: 'beginner',
  homeLayout: 'light',
  notifications: {
    email: true,
    push: true,
    forum: true,
    events: true,
    submissions: true,
  },
  layout: {
    sidebarCollapsed: false,
    compactMode: false,
    animationsEnabled: true,
  },
  accessibility: {
    highContrast: false,
    reduceMotion: false,
    fontSize: 'medium',
    screenReader: false,
  },
  dashboard: {
    favoriteWidgets: [],
    widgetOrder: ['stats', 'recent-activity', 'quick-actions', 'regional-progress'],
    refreshInterval: 30000,
  },
};

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => Promise<void>;
  loading: boolean;
}

export const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  
  // Safe auth hook usage with error boundary
  const auth = (() => {
    try {
      return useAuth();
    } catch (error) {
      logger.warn('Auth context not available, using fallback', { component: 'UserPreferencesProvider' });
      return { user: null };
    }
  })();
  
  const { user } = auth;

  useEffect(() => {
    if (user) {
      loadPreferences();
    } else {
      // Load from localStorage for non-authenticated users
      const stored = localStorage.getItem('userPreferences');
      if (stored) {
        try {
          setPreferences({ ...defaultPreferences, ...JSON.parse(stored) });
        } catch (error) {
          logger.error('Error parsing stored preferences', error, { component: 'UserPreferencesProvider' });
        }
      }
      setLoading(false);
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences' as any)
        .select('preferences')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data && (data as any).preferences) {
        setPreferences({ ...defaultPreferences, ...(data as any).preferences });
      }
    } catch (error) {
      logger.error('Error loading preferences', error, { component: 'UserPreferencesProvider' });
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);

    // Synchronize language with i18next if language is updated
    if (updates.language) {
      console.log('[UserPreferences] Syncing language to i18next:', updates.language);
      await i18nChangeLanguage(updates.language);
    }

    if (user) {
      try {
        const { error } = await supabase
          .from('user_preferences' as any)
          .upsert({
            user_id: user.id,
            preferences: newPreferences,
          }, {
            onConflict: 'user_id'
          });

        if (error) throw error;
      } catch (error) {
        logger.error('Error saving preferences', error, { component: 'UserPreferencesProvider' });
        // Revert on error
        setPreferences(preferences);
        throw error;
      }
    } else {
      // Save to localStorage for non-authenticated users
      localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
    }
  };

  const resetPreferences = async () => {
    setPreferences(defaultPreferences);

    if (user) {
      try {
        const { error } = await supabase
          .from('user_preferences' as any)
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
      } catch (error) {
        logger.error('Error resetting preferences', error, { component: 'UserPreferencesProvider' });
        throw error;
      }
    } else {
      localStorage.removeItem('userPreferences');
    }
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
        resetPreferences,
        loading,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};