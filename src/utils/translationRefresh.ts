import { useTranslationDb } from '@/hooks/useTranslationDb';

// Global translation refresh utility
export const useTranslationRefresh = () => {
  const { refreshTranslations } = useTranslationDb();
  
  // Force immediate refresh for when new translations are added
  const forceRefresh = () => {
    refreshTranslations();
    // Also clear any localStorage cache if present
    if (typeof window !== 'undefined') {
      localStorage.removeItem('translation-cache');
    }
  };
  
  return { forceRefresh };
};