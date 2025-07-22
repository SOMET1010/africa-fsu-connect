import { supabase } from "@/integrations/supabase/client";

export interface APISource {
  name: string;
  baseUrl: string;
  apiKey?: string;
  rateLimitPerMinute: number;
  supportedIndicators: string[];
}

export interface IndicatorMapping {
  source: string;
  sourceCode: string;
  ourCode: string;
  transformFunction?: (value: any) => number;
}

// Configuration des sources d'APIs
export const API_SOURCES: APISource[] = [
  {
    name: "World Bank",
    baseUrl: "https://api.worldbank.org/v2",
    rateLimitPerMinute: 120,
    supportedIndicators: [
      "IT.NET.USER.ZS", // Internet users (% of population)
      "IT.CEL.SETS.P2", // Mobile cellular subscriptions (per 100 people)
      "IT.NET.BBND.P2", // Fixed broadband subscriptions (per 100 people)
      "IT.MLT.MAIN.P2", // Fixed telephone subscriptions (per 100 people)
      "SE.TER.ENRR", // Tertiary education enrollment
      "SH.DYN.MORT", // Mortality rate
      "SP.POP.TOTL", // Total population
      "NY.GDP.PCAP.CD" // GDP per capita
    ]
  },
  {
    name: "ITU",
    baseUrl: "https://api.itu.int",
    rateLimitPerMinute: 60,
    supportedIndicators: [
      "i911mw", // Mobile subscriptions
      "i99h", // Internet users
      "i9911", // Fixed broadband subscriptions
      "i9919", // 3G coverage
      "i9921" // 4G coverage
    ]
  },
  {
    name: "GSMA Intelligence", 
    baseUrl: "https://api.gsmaintelligence.com",
    rateLimitPerMinute: 100,
    supportedIndicators: [
      "mobile_penetration",
      "smartphone_adoption",
      "mobile_money_users",
      "network_coverage_4g",
      "network_coverage_5g"
    ]
  }
];

// Mapping des indicateurs entre les différentes sources
export const INDICATOR_MAPPINGS: IndicatorMapping[] = [
  // World Bank mappings
  {
    source: "World Bank",
    sourceCode: "IT.NET.USER.ZS",
    ourCode: "INTERNET_PENETRATION"
  },
  {
    source: "World Bank", 
    sourceCode: "IT.CEL.SETS.P2",
    ourCode: "MOBILE_PENETRATION"
  },
  {
    source: "World Bank",
    sourceCode: "IT.NET.BBND.P2", 
    ourCode: "BROADBAND_PENETRATION"
  },
  {
    source: "World Bank",
    sourceCode: "IT.MLT.MAIN.P2",
    ourCode: "FIXED_LINE_PENETRATION"
  },
  
  // ITU mappings
  {
    source: "ITU",
    sourceCode: "i911mw",
    ourCode: "MOBILE_SUBSCRIPTIONS"
  },
  {
    source: "ITU",
    sourceCode: "i99h", 
    ourCode: "INTERNET_USERS"
  },
  {
    source: "ITU",
    sourceCode: "i9919",
    ourCode: "NETWORK_COVERAGE_3G"
  },
  {
    source: "ITU",
    sourceCode: "i9921",
    ourCode: "NETWORK_COVERAGE_4G"
  },
  
  // GSMA mappings
  {
    source: "GSMA Intelligence",
    sourceCode: "mobile_penetration",
    ourCode: "MOBILE_PENETRATION"
  },
  {
    source: "GSMA Intelligence",
    sourceCode: "smartphone_adoption", 
    ourCode: "SMARTPHONE_ADOPTION"
  },
  {
    source: "GSMA Intelligence",
    sourceCode: "mobile_money_users",
    ourCode: "MOBILE_MONEY_USERS"
  },
  {
    source: "GSMA Intelligence",
    sourceCode: "network_coverage_5g",
    ourCode: "NETWORK_COVERAGE_5G"
  }
];

// Codes pays ISO pour l'Afrique
export const AFRICAN_COUNTRIES = [
  "CI", "GH", "SN", "NG", "KE", "UG", "RW", "ZA", "TZ", "ZM", 
  "ZW", "BF", "ML", "NE", "TD", "CM", "GA", "CG", "CD", "CF",
  "GN", "SL", "LR", "GM", "GW", "CV", "ST", "GQ", "DJ", "ET",
  "ER", "SO", "SS", "SD", "EG", "LY", "TN", "DZ", "MA", "MR",
  "MW", "MZ", "MG", "MU", "SC", "KM", "LS", "SZ", "BW", "NA",
  "AO", "BI", "CF"
];

export class IndicatorsEnrichmentService {
  private async fetchWorldBankData(countryCode: string, indicatorCode: string, year: number = 2024) {
    try {
      const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicatorCode}?format=json&date=${year}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`World Bank API error: ${response.status}`);
      
      const data = await response.json();
      
      if (data && data[1] && data[1].length > 0) {
        const latestData = data[1][0];
        return {
          value: latestData.value,
          year: parseInt(latestData.date),
          country: latestData.country?.value || countryCode,
          indicator: latestData.indicator?.value || indicatorCode
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching World Bank data for ${countryCode}/${indicatorCode}:`, error);
      return null;
    }
  }

  private async fetchITUData(countryCode: string, indicatorCode: string, year: number = 2024) {
    // Note: L'API ITU nécessite une clé API et a une structure différente
    // Cette implémentation est un exemple - vous devrez ajuster selon la vraie API ITU
    try {
      console.log(`ITU API call would be made for ${countryCode}/${indicatorCode}/${year}`);
      // return await this.makeITUAPICall(countryCode, indicatorCode, year);
      return null;
    } catch (error) {
      console.error(`Error fetching ITU data:`, error);
      return null;
    }
  }

  private async fetchGSMAData(countryCode: string, indicatorCode: string, year: number = 2024) {
    // Note: L'API GSMA nécessite une clé API et authentification
    try {
      console.log(`GSMA API call would be made for ${countryCode}/${indicatorCode}/${year}`);
      // return await this.makeGSMAAPICall(countryCode, indicatorCode, year);
      return null;
    } catch (error) {
      console.error(`Error fetching GSMA data:`, error);
      return null;
    }
  }

  async enrichIndicatorsForCountry(countryCode: string, year: number = 2024) {
    console.log(`🔄 Enriching indicators for ${countryCode}...`);
    
    const enrichedData = [];
    
    // Parcourir tous les mappings et récupérer les données
    for (const mapping of INDICATOR_MAPPINGS) {
      try {
        let apiData = null;
        
        switch (mapping.source) {
          case "World Bank":
            apiData = await this.fetchWorldBankData(countryCode, mapping.sourceCode, year);
            break;
          case "ITU":
            apiData = await this.fetchITUData(countryCode, mapping.sourceCode, year);
            break;
          case "GSMA Intelligence":
            apiData = await this.fetchGSMAData(countryCode, mapping.sourceCode, year);
            break;
        }
        
        if (apiData && apiData.value !== null && apiData.value !== undefined) {
          const transformedValue = mapping.transformFunction ? 
            mapping.transformFunction(apiData.value) : 
            apiData.value;
            
          enrichedData.push({
            country_code: countryCode,
            indicator_code: mapping.ourCode,
            indicator_name: this.getIndicatorName(mapping.ourCode),
            value: transformedValue,
            unit: this.getIndicatorUnit(mapping.ourCode),
            year: apiData.year,
            data_source: mapping.source,
            source_url: null,
            metadata: {
              source_indicator: mapping.sourceCode,
              api_source: mapping.source,
              fetched_at: new Date().toISOString(),
              verified: true
            },
            region: this.getRegionForCountry(countryCode)
          });
        }
        
        // Rate limiting - attendre entre les appels API
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Error processing ${mapping.source}/${mapping.sourceCode}:`, error);
      }
    }
    
    return enrichedData;
  }

  async enrichAllAfricanCountries() {
    console.log("🌍 Starting enrichment for all African countries...");
    
    let totalEnriched = 0;
    
    for (const countryCode of AFRICAN_COUNTRIES) {
      try {
        const enrichedData = await this.enrichIndicatorsForCountry(countryCode);
        
        if (enrichedData.length > 0) {
          // Insérer les données enrichies dans la base
          const { error } = await supabase
            .from('universal_service_indicators')
            .upsert(enrichedData, {
              onConflict: 'country_code,indicator_code,year',
              ignoreDuplicates: false
            });
            
          if (error) {
            console.error(`Error inserting data for ${countryCode}:`, error);
          } else {
            totalEnriched += enrichedData.length;
            console.log(`✅ ${enrichedData.length} indicators enriched for ${countryCode}`);
          }
        }
        
        // Attendre entre les pays pour éviter le rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`Error enriching ${countryCode}:`, error);
      }
    }
    
    console.log(`🎉 Enrichment completed! ${totalEnriched} total indicators added/updated`);
    return totalEnriched;
  }

  private getIndicatorName(code: string): string {
    const names: Record<string, string> = {
      'INTERNET_PENETRATION': 'Internet Penetration Rate',
      'MOBILE_PENETRATION': 'Mobile Penetration Rate', 
      'BROADBAND_PENETRATION': 'Broadband Penetration Rate',
      'FIXED_LINE_PENETRATION': 'Fixed Line Penetration Rate',
      'MOBILE_SUBSCRIPTIONS': 'Mobile Subscriptions',
      'INTERNET_USERS': 'Internet Users',
      'NETWORK_COVERAGE_3G': '3G Network Coverage',
      'NETWORK_COVERAGE_4G': '4G Network Coverage',
      'NETWORK_COVERAGE_5G': '5G Network Coverage',
      'SMARTPHONE_ADOPTION': 'Smartphone Adoption Rate',
      'MOBILE_MONEY_USERS': 'Mobile Money Users'
    };
    return names[code] || code;
  }

  private getIndicatorUnit(code: string): string {
    const units: Record<string, string> = {
      'INTERNET_PENETRATION': 'percentage',
      'MOBILE_PENETRATION': 'percentage',
      'BROADBAND_PENETRATION': 'percentage', 
      'FIXED_LINE_PENETRATION': 'percentage',
      'MOBILE_SUBSCRIPTIONS': 'per 100 people',
      'INTERNET_USERS': 'percentage',
      'NETWORK_COVERAGE_3G': 'percentage',
      'NETWORK_COVERAGE_4G': 'percentage',
      'NETWORK_COVERAGE_5G': 'percentage',
      'SMARTPHONE_ADOPTION': 'percentage',
      'MOBILE_MONEY_USERS': 'percentage'
    };
    return units[code] || 'number';
  }

  private getRegionForCountry(countryCode: string): string {
    const regions: Record<string, string> = {
      // CEDEAO
      'CI': 'CEDEAO', 'GH': 'CEDEAO', 'SN': 'CEDEAO', 'NG': 'CEDEAO',
      'BF': 'CEDEAO', 'ML': 'CEDEAO', 'NE': 'CEDEAO', 'GN': 'CEDEAO',
      'SL': 'CEDEAO', 'LR': 'CEDEAO', 'GM': 'CEDEAO', 'GW': 'CEDEAO',
      'CV': 'CEDEAO',
      
      // EACO
      'KE': 'EACO', 'UG': 'EACO', 'RW': 'EACO', 'TZ': 'EACO',
      'ET': 'EACO', 'DJ': 'EACO', 'ER': 'EACO', 'SO': 'EACO',
      'SS': 'EACO', 'SD': 'EACO',
      
      // SADC
      'ZA': 'SADC', 'ZM': 'SADC', 'ZW': 'SADC', 'MW': 'SADC',
      'MZ': 'SADC', 'MG': 'SADC', 'MU': 'SADC', 'SC': 'SADC',
      'KM': 'SADC', 'LS': 'SADC', 'SZ': 'SADC', 'BW': 'SADC',
      'NA': 'SADC', 'AO': 'SADC',
      
      // Afrique Centrale
      'CM': 'Afrique Centrale', 'GA': 'Afrique Centrale', 
      'CG': 'Afrique Centrale', 'CD': 'Afrique Centrale',
      'CF': 'Afrique Centrale', 'TD': 'Afrique Centrale',
      'GQ': 'Afrique Centrale', 'ST': 'Afrique Centrale',
      'BI': 'Afrique Centrale',
      
      // Afrique du Nord
      'EG': 'Afrique du Nord', 'LY': 'Afrique du Nord',
      'TN': 'Afrique du Nord', 'DZ': 'Afrique du Nord',
      'MA': 'Afrique du Nord', 'MR': 'Afrique du Nord'
    };
    
    return regions[countryCode] || 'Autre';
  }
}

export const indicatorsEnrichmentService = new IndicatorsEnrichmentService();