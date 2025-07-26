import { supabase } from "@/integrations/supabase/client";

export interface IndicatorTranslation {
  id: string;
  indicator_code: string;
  language_code: string;
  display_name: string;
  description: string | null;
  category_name: string | null;
  unit_display: string | null;
}

export class IndicatorTranslationService {
  private static cache: Map<string, IndicatorTranslation> = new Map();
  
  static async getIndicatorTranslation(
    indicatorCode: string, 
    languageCode: 'fr' | 'en' = 'fr'
  ): Promise<IndicatorTranslation | null> {
    const cacheKey = `${indicatorCode}_${languageCode}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) || null;
    }
    
    const { data, error } = await supabase
      .from('indicator_translations')
      .select('*')
      .eq('indicator_code', indicatorCode)
      .eq('language_code', languageCode)
      .maybeSingle();
    
    if (error) throw error;
    
    if (data) {
      this.cache.set(cacheKey, data);
    }
    
    return data;
  }
  
  static async loadAllTranslations(languageCode: 'fr' | 'en' = 'fr'): Promise<void> {
    const { data, error } = await supabase
      .from('indicator_translations')
      .select('*')
      .eq('language_code', languageCode);
    
    if (error) throw error;
    
    data?.forEach(translation => {
      const cacheKey = `${translation.indicator_code}_${languageCode}`;
      this.cache.set(cacheKey, translation);
    });
  }
  
  static getDisplayName(indicatorCode: string, languageCode: 'fr' | 'en' = 'fr'): string {
    const cacheKey = `${indicatorCode}_${languageCode}`;
    const translation = this.cache.get(cacheKey);
    
    return translation?.display_name || indicatorCode;
  }
  
  static getCategory(indicatorCode: string, languageCode: 'fr' | 'en' = 'fr'): string {
    const cacheKey = `${indicatorCode}_${languageCode}`;
    const translation = this.cache.get(cacheKey);
    
    return translation?.category_name || 'Autre';
  }
  
  static getUnit(indicatorCode: string, languageCode: 'fr' | 'en' = 'fr'): string {
    const cacheKey = `${indicatorCode}_${languageCode}`;
    const translation = this.cache.get(cacheKey);
    
    return translation?.unit_display || '';
  }
  
  static clearCache(): void {
    this.cache.clear();
  }
}