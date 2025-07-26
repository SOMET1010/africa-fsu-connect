import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface Translation {
  id: string;
  key: string;
  value: string;
  language_code: string;
  namespace_name: string;
}

interface Language {
  id: string;
  code: string;
  name: string;
  native_name: string;
  is_active: boolean;
  is_default: boolean;
}

const translationCache = new Map<string, Record<string, string>>();

export const useTranslationDb = () => {
  const { preferences } = useUserPreferences();
  const currentLanguage = preferences.language;
  const queryClient = useQueryClient();

  // Fetch available languages
  const { data: languages } = useQuery({
    queryKey: ['languages'],
    queryFn: async (): Promise<Language[]> => {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .eq('is_active', true)
        .order('is_default', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch translations for current language
  const { data: translations, isLoading } = useQuery({
    queryKey: ['translations', currentLanguage],
    queryFn: async (): Promise<Record<string, string>> => {
      // Check cache first
      const cacheKey = currentLanguage;
      if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey)!;
      }

      const { data, error } = await supabase
        .from('translations')
        .select(`
          key,
          value,
          languages!inner(code),
          translation_namespaces!inner(name)
        `)
        .eq('languages.code', currentLanguage)
        .eq('is_approved', true);
      
      if (error) throw error;
      
      // Transform to key-value pairs
      const translationMap: Record<string, string> = {};
      data?.forEach((item: any) => {
        translationMap[item.key] = item.value;
      });
      
      // Cache the result
      translationCache.set(cacheKey, translationMap);
      
      return translationMap;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!currentLanguage,
  });

  // Fallback translations (French as default)
  const { data: fallbackTranslations } = useQuery({
    queryKey: ['translations', 'fr'],
    queryFn: async (): Promise<Record<string, string>> => {
      if (currentLanguage === 'fr') return {};
      
      const cacheKey = 'fr';
      if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey)!;
      }

      const { data, error } = await supabase
        .from('translations')
        .select(`
          key,
          value,
          languages!inner(code),
          translation_namespaces!inner(name)
        `)
        .eq('languages.code', 'fr')
        .eq('is_approved', true);
      
      if (error) throw error;
      
      const translationMap: Record<string, string> = {};
      data?.forEach((item: any) => {
        translationMap[item.key] = item.value;
      });
      
      translationCache.set(cacheKey, translationMap);
      return translationMap;
    },
    staleTime: 10 * 60 * 1000,
    enabled: currentLanguage !== 'fr',
  });

  const t = (key: string): string => {
    if (!translations && !isLoading) {
      return key;
    }
    
    // Try current language first
    if (translations?.[key]) {
      return translations[key];
    }
    
    // Fall back to French
    if (fallbackTranslations?.[key]) {
      return fallbackTranslations[key];
    }
    
    // Fall back to key itself
    return key;
  };

  // Enhanced cache clearing function
  const clearCache = () => {
    translationCache.clear();
    queryClient.invalidateQueries({ queryKey: ['translations'] });
    queryClient.invalidateQueries({ queryKey: ['languages'] });
  };

  // Force refresh translations immediately
  const refreshTranslations = () => {
    clearCache();
    queryClient.refetchQueries({ queryKey: ['translations', currentLanguage] });
    if (currentLanguage !== 'fr') {
      queryClient.refetchQueries({ queryKey: ['translations', 'fr'] });
    }
  };

  return {
    t,
    currentLanguage,
    languages: languages || [],
    isLoading,
    clearCache,
    refreshTranslations,
  };
};

// Admin hooks for translation management
export const useTranslationAdmin = () => {
  const queryClient = useQueryClient();
  // Add translation
  const addTranslation = async (
    languageCode: string,
    namespace: string,
    key: string,
    value: string,
    context?: string
  ) => {
    // Get language and namespace IDs
    const { data: language } = await supabase
      .from('languages')
      .select('id')
      .eq('code', languageCode)
      .single();
    
    const { data: namespaceData } = await supabase
      .from('translation_namespaces')
      .select('id')
      .eq('name', namespace)
      .single();
    
    if (!language || !namespaceData) {
      throw new Error('Language or namespace not found');
    }
    
    const { error } = await supabase
      .from('translations')
      .insert({
        language_id: language.id,
        namespace_id: namespaceData.id,
        key,
        value,
        context,
        is_approved: true
      });
    
    if (error) throw error;
    
    // Clear cache and invalidate queries to force refresh
    translationCache.clear();
    queryClient.invalidateQueries({ queryKey: ['translations'] });
  };

  // Update translation
  const updateTranslation = async (key: string, languageCode: string, value: string) => {
    const { error } = await supabase
      .from('translations')
      .update({ value })
      .eq('key', key)
      .eq('languages.code', languageCode);
    
    if (error) throw error;
    
    // Clear cache and invalidate queries to force refresh
    translationCache.clear();
    queryClient.invalidateQueries({ queryKey: ['translations'] });
  };

  // Get missing translations
  const getMissingTranslations = async (baseLanguage = 'fr') => {
    const { data } = await supabase
      .from('translations')
      .select('key, languages(code)')
      .eq('is_approved', true);
    
    if (!data) return [];
    
    const keysByLanguage: Record<string, Set<string>> = {};
    data.forEach((item: any) => {
      const langCode = item.languages.code;
      if (!keysByLanguage[langCode]) {
        keysByLanguage[langCode] = new Set();
      }
      keysByLanguage[langCode].add(item.key);
    });
    
    const baseKeys = keysByLanguage[baseLanguage] || new Set();
    const missing: Array<{ language: string; missingKeys: string[] }> = [];
    
    Object.entries(keysByLanguage).forEach(([langCode, keys]) => {
      if (langCode !== baseLanguage) {
        const missingKeys = Array.from(baseKeys).filter(key => !keys.has(key));
        if (missingKeys.length > 0) {
          missing.push({ language: langCode, missingKeys });
        }
      }
    });
    
    return missing;
  };

  return {
    addTranslation,
    updateTranslation,
    getMissingTranslations,
  };
};