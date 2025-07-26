import { useQuery } from "@tanstack/react-query";
import { IndicatorTranslationService } from "@/services/indicatorTranslationService";

export const useIndicatorTranslation = (
  indicatorCode: string, 
  languageCode: 'fr' | 'en' = 'fr'
) => {
  return useQuery({
    queryKey: ["indicator-translation", indicatorCode, languageCode],
    queryFn: () => IndicatorTranslationService.getIndicatorTranslation(indicatorCode, languageCode),
    enabled: !!indicatorCode,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useLoadIndicatorTranslations = (languageCode: 'fr' | 'en' = 'fr') => {
  return useQuery({
    queryKey: ["load-indicator-translations", languageCode],
    queryFn: () => IndicatorTranslationService.loadAllTranslations(languageCode),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};