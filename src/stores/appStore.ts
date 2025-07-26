import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { logger } from '@/utils/logger';

// ===== USER PREFERENCES STORE =====
interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  layout: 'compact' | 'comfortable' | 'spacious';
  accessibility: {
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
    reduceMotion: boolean;
  };
  dashboard: {
    layout: string[];
    autoRefresh: boolean;
    refreshInterval: number;
  };
}

interface UserPreferencesStore {
  preferences: UserPreferences;
  loading: boolean;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => Promise<void>;
  loadPreferences: (userId?: string) => Promise<void>;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'fr',
  notifications: true,
  layout: 'comfortable',
  accessibility: {
    highContrast: false,
    fontSize: 'medium',
    reduceMotion: false,
  },
  dashboard: {
    layout: ['stats', 'charts', 'activity'],
    autoRefresh: true,
    refreshInterval: 30000,
  },
};

export const useUserPreferencesStore = create<UserPreferencesStore>()(
  devtools(
    persist(
      subscribeWithSelector((set, get) => ({
        preferences: defaultPreferences,
        loading: false,

        updatePreferences: async (updates) => {
          set({ loading: true });
          try {
            const newPreferences = { ...get().preferences, ...updates };
            set({ preferences: newPreferences, loading: false });
            logger.info('Preferences updated successfully', { 
              component: 'UserPreferencesStore',
              updates: Object.keys(updates)
            });
          } catch (error) {
            logger.error('Failed to update preferences', error, { component: 'UserPreferencesStore' });
            set({ loading: false });
            throw error;
          }
        },

        resetPreferences: async () => {
          set({ loading: true });
          try {
            set({ preferences: defaultPreferences, loading: false });
            logger.info('Preferences reset to defaults', { component: 'UserPreferencesStore' });
          } catch (error) {
            logger.error('Failed to reset preferences', error, { component: 'UserPreferencesStore' });
            set({ loading: false });
            throw error;
          }
        },

        loadPreferences: async (userId) => {
          set({ loading: true });
          try {
            // TODO: Load from Supabase if userId provided
            if (userId) {
              // Implementation for authenticated users
              logger.info('Loading preferences for user', { userId, component: 'UserPreferencesStore' });
            } else {
              // Use localStorage for guest users
              logger.info('Loading preferences from localStorage', { component: 'UserPreferencesStore' });
            }
            set({ loading: false });
          } catch (error) {
            logger.error('Failed to load preferences', error, { component: 'UserPreferencesStore' });
            set({ loading: false });
          }
        },
      })),
      {
        name: 'user-preferences',
        partialize: (state) => ({ preferences: state.preferences }),
      }
    ),
    { name: 'UserPreferencesStore' }
  )
);

// ===== GLOBAL UI STORE =====
interface GlobalUIStore {
  isLoading: Record<string, boolean>;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
  }>;
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  
  setLoading: (key: string, loading: boolean) => void;
  addNotification: (notification: Omit<GlobalUIStore['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  clearAllLoading: () => void;
}

export const useGlobalUIStore = create<GlobalUIStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      isLoading: {},
      notifications: [],
      sidebarOpen: true,
      mobileMenuOpen: false,

      setLoading: (key, loading) => {
        set((state) => ({
          isLoading: { ...state.isLoading, [key]: loading }
        }));
      },

      addNotification: (notification) => {
        const id = Date.now().toString();
        const newNotification = { ...notification, id, timestamp: Date.now() };
        set((state) => ({
          notifications: [...state.notifications, newNotification]
        }));
        
        // Auto remove after 5 seconds
        setTimeout(() => {
          get().removeNotification(id);
        }, 5000);
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      toggleMobileMenu: () => {
        set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen }));
      },

      clearAllLoading: () => {
        set({ isLoading: {} });
      },
    })),
    { name: 'GlobalUIStore' }
  )
);

// Performance monitoring for store changes
useUserPreferencesStore.subscribe(
  (state) => state.preferences,
  (preferences, previousPreferences) => {
    if (previousPreferences) {
      logger.performance('Preferences changed', performance.now(), {
        component: 'UserPreferencesStore',
        changes: Object.keys(preferences).filter(
          key => JSON.stringify(preferences[key as keyof UserPreferences]) !== 
                JSON.stringify(previousPreferences[key as keyof UserPreferences])
        )
      });
    }
  }
);