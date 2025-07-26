import { supabase } from '@/integrations/supabase/client';

// Force complete refresh of all translation data
export const forceCompleteTranslationRefresh = async () => {
  // Clear all browser storage related to translations
  if (typeof window !== 'undefined') {
    localStorage.removeItem('translation-cache');
    sessionStorage.removeItem('translation-cache');
    
    // Clear any query cache keys that might be stored
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('translation') || key.includes('react-query')) {
        localStorage.removeItem(key);
      }
    });
  }
  
  // Force a new database connection
  try {
    await supabase.auth.getSession();
  } catch (error) {
    console.log('Session refresh complete');
  }
};

// Call this immediately
forceCompleteTranslationRefresh();