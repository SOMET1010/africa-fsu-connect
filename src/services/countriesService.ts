import { supabase } from "@/integrations/supabase/client";

export interface Country {
  id: string;
  code: string;
  name_fr: string;
  name_en: string;
  region: string;
  continent: string;
}

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
  
  static clearCache(): void {
    this.cache = null;
  }
}