import { useUserPreferencesStore, useGlobalUIStore } from '@/stores/appStore';
import { logger } from '@/utils/logger';
import { validateData, userPreferencesSchema, type UserPreferences } from '@/schemas/validation';

/**
 * Unified hook for accessing app stores with validation and error handling
 */
export const useAppStore = () => {
  const preferencesStore = useUserPreferencesStore();
  const uiStore = useGlobalUIStore();

  // Safe preference updates with validation
  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    try {
      // Validate updates before applying
      const currentPrefs = preferencesStore.preferences;
      const newPrefs = { ...currentPrefs, ...updates };
      
      // Validate the complete preferences object
      validateData(userPreferencesSchema, newPrefs);
      
      await preferencesStore.updatePreferences(updates);
      
      uiStore.addNotification({
        type: 'success',
        message: 'Preferences updated successfully'
      });
      
      logger.info('Preferences updated via useAppStore', { 
        component: 'useAppStore',
        updates: Object.keys(updates)
      });
    } catch (error) {
      uiStore.addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update preferences'
      });
      
      logger.error('Failed to update preferences in useAppStore', error, { 
        component: 'useAppStore' 
      });
      
      throw error;
    }
  };

  // Loading state helpers
  const setLoading = (key: string, loading: boolean) => {
    uiStore.setLoading(key, loading);
    
    if (loading) {
      logger.debug(`Loading started: ${key}`, { component: 'useAppStore', action: 'setLoading' });
    } else {
      logger.debug(`Loading completed: ${key}`, { component: 'useAppStore', action: 'setLoading' });
    }
  };

  // Global loading state
  const isAnyLoading = Object.values(uiStore.isLoading).some(Boolean);

  // Notification helpers
  const showSuccess = (message: string) => {
    uiStore.addNotification({ type: 'success', message });
  };

  const showError = (message: string) => {
    uiStore.addNotification({ type: 'error', message });
  };

  const showWarning = (message: string) => {
    uiStore.addNotification({ type: 'warning', message });
  };

  const showInfo = (message: string) => {
    uiStore.addNotification({ type: 'info', message });
  };

  return {
    // Preferences
    preferences: preferencesStore.preferences,
    preferencesLoading: preferencesStore.loading,
    updatePreferences,
    resetPreferences: preferencesStore.resetPreferences,
    loadPreferences: preferencesStore.loadPreferences,

    // UI State
    isLoading: uiStore.isLoading,
    isAnyLoading,
    notifications: uiStore.notifications,
    sidebarOpen: uiStore.sidebarOpen,
    mobileMenuOpen: uiStore.mobileMenuOpen,

    // Actions
    setLoading,
    clearAllLoading: uiStore.clearAllLoading,
    removeNotification: uiStore.removeNotification,
    toggleSidebar: uiStore.toggleSidebar,
    toggleMobileMenu: uiStore.toggleMobileMenu,

    // Notification helpers
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};