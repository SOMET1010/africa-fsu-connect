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
}