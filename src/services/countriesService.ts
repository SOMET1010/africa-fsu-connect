import { supabase } from "@/integrations/supabase/client";

export interface Country {
  id: string;
  code: string;
  name_fr: string;
  name_en: string;
  region: string;
  continent: string;
  latitude?: number;
  longitude?: number;
  capital_city?: string;
  official_language?: string;
  working_languages?: string[];
  sutel_community?: string;
}

// Mapping des langues pour l'affichage
export const LANGUAGE_LABELS: Record<string, { fr: string; en: string; flag: string }> = {
  fr: { fr: 'Français', en: 'French', flag: '🇫🇷' },
  en: { fr: 'Anglais', en: 'English', flag: '🇬🇧' },
  pt: { fr: 'Portugais', en: 'Portuguese', flag: '🇵🇹' },
  ar: { fr: 'Arabe', en: 'Arabic', flag: '🇸🇦' },
  am: { fr: 'Amharique', en: 'Amharic', flag: '🇪🇹' },
  so: { fr: 'Somali', en: 'Somali', flag: '🇸🇴' },
  ti: { fr: 'Tigrinya', en: 'Tigrinya', flag: '🇪🇷' },
  mg: { fr: 'Malgache', en: 'Malagasy', flag: '🇲🇬' },
  af: { fr: 'Afrikaans', en: 'Afrikaans', flag: '🇿🇦' },
  zu: { fr: 'Zoulou', en: 'Zulu', flag: '🇿🇦' },
};

// Mapping des communautés SUTEL
export const SUTEL_COMMUNITIES: Record<string, { name: string; description_fr: string; description_en: string }> = {
  CRTEL: { name: 'CRTEL', description_fr: 'Communauté Francophone', description_en: 'Francophone Community' },
  EACO: { name: 'EACO', description_fr: 'Communauté Anglophone Est-Africaine', description_en: 'East African Anglophone Community' },
  ECOWAS: { name: 'CEDEAO', description_fr: 'Communauté Ouest-Africaine', description_en: 'West African Community' },
  SADC: { name: 'SADC', description_fr: 'Communauté Australe', description_en: 'Southern African Community' },
  UMA: { name: 'UMA', description_fr: 'Union du Maghreb Arabe', description_en: 'Arab Maghreb Union' },
  CPLP: { name: 'CPLP', description_fr: 'Communauté Lusophone', description_en: 'Lusophone Community' },
  COMESA: { name: 'COMESA', description_fr: 'Marché Commun Afrique Orientale/Australe', description_en: 'Common Market Eastern/Southern Africa' },
  CEMAC: { name: 'CEMAC', description_fr: 'Communauté Afrique Centrale', description_en: 'Central African Community' },
};

export class CountriesService {
  private static cache: Country[] | null = null;
  
  static async getCountries(): Promise<Country[]> {
    if (this.cache) {
      return this.cache;
    }
    
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('name_fr');
    
    if (error) throw error;
    
    this.cache = data || [];
    return this.cache;
  }
  
  static async getCountryName(countryCode: string, language: 'fr' | 'en' = 'fr'): Promise<string> {
    const countries = await this.getCountries();
    const country = countries.find(c => c.code === countryCode);
    
    if (!country) return countryCode;
    
    return language === 'fr' ? country.name_fr : country.name_en;
  }
  
  static async getCountriesByRegion(region: string): Promise<Country[]> {
    const countries = await this.getCountries();
    return countries.filter(c => c.region === region);
  }
  
  static async getAfricanCountries(): Promise<Country[]> {
    const countries = await this.getCountries();
    return countries.filter(c => c.continent === 'Afrique');
  }

  static async getCountryCoordinates(countryName: string): Promise<[number, number] | null> {
    const countries = await this.getCountries();
    const country = countries.find(c => 
      c.name_fr === countryName || 
      c.name_en === countryName
    );
    
    if (!country || !country.latitude || !country.longitude) return null;
    
    return [country.latitude, country.longitude];
  }

  static async getCountryCoordinatesMap(): Promise<Record<string, [number, number]>> {
    const countries = await this.getCountries();
    const coordsMap: Record<string, [number, number]> = {};
    
    countries.forEach(country => {
      if (country.latitude && country.longitude) {
        coordsMap[country.name_fr] = [country.latitude, country.longitude];
        if (country.name_en !== country.name_fr) {
          coordsMap[country.name_en] = [country.latitude, country.longitude];
        }
      }
    });
    
    return coordsMap;
  }
  
  static clearCache(): void {
    this.cache = null;
  }

  static async getCountriesByLanguage(language: string): Promise<Country[]> {
    const countries = await this.getCountries();
    return countries.filter(c => 
      c.official_language === language || 
      c.working_languages?.includes(language)
    );
  }

  static async getCountriesByCommunity(community: string): Promise<Country[]> {
    const countries = await this.getCountries();
    return countries.filter(c => c.sutel_community === community);
  }

  static async getLanguageStats(): Promise<Record<string, number>> {
    const countries = await this.getAfricanCountries();
    const stats: Record<string, number> = {};
    
    countries.forEach(c => {
      const lang = c.official_language || 'fr';
      stats[lang] = (stats[lang] || 0) + 1;
    });
    
    return stats;
  }

  static async getCommunityStats(): Promise<Record<string, number>> {
    const countries = await this.getAfricanCountries();
    const stats: Record<string, number> = {};
    
    countries.forEach(c => {
      const community = c.sutel_community || 'Autre';
      stats[community] = (stats[community] || 0) + 1;
    });
    
    return stats;
  }
}