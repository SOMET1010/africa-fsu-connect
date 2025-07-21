
import { supabase } from "@/integrations/supabase/client";
import { FirecrawlService } from "./firecrawlService";

export interface EnrichmentConfig {
  autoSync: boolean;
  syncInterval: number; // en heures
  enrichmentRules: {
    extractLogos: boolean;
    extractContacts: boolean;
    extractProjects: boolean;
    extractNews: boolean;
    extractResources: boolean;
  };
}

export class EnrichmentService {
  static async enrichAgencyData(agencyId: string): Promise<{
    success: boolean;
    enrichedData?: any;
    error?: string;
  }> {
    try {
      // Récupérer les données de l'agence
      const { data: agency, error: agencyError } = await supabase
        .from('agencies')
        .select('*')
        .eq('id', agencyId)
        .single();

      if (agencyError || !agency) {
        return { success: false, error: 'Agence non trouvée' };
      }

      // Configuration d'enrichissement
      const enrichmentConfig = {
        urls: [agency.website_url],
        extractSchema: {
          projects: true,
          resources: true,
          news: true,
          contacts: true,
          logos: true
        },
        formats: ['markdown', 'html']
      };

      // Lancer la collecte
      const crawlResult = await FirecrawlService.crawlAgencyData(agencyId, enrichmentConfig);

      if (!crawlResult.success) {
        return { success: false, error: crawlResult.error };
      }

      // Enrichir les métadonnées de l'agence
      const enrichedMetadata = await this.extractEnrichedMetadata(agency, crawlResult.data);

      // Mettre à jour l'agence avec les nouvelles données
      const currentMetadata = agency.metadata || {};
      const newMetadata = Object.assign({}, currentMetadata, enrichedMetadata);
      
      const { error: updateError } = await supabase
        .from('agencies')
        .update({
          metadata: newMetadata,
          sync_status: 'synced',
          last_sync_at: new Date().toISOString()
        })
        .eq('id', agencyId);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { 
        success: true, 
        enrichedData: enrichedMetadata 
      };

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      };
    }
  }

  static async extractEnrichedMetadata(agency: any, crawlData: any): Promise<Record<string, any>> {
    const enrichedData: Record<string, any> = {};

    // Extraction du logo si pas déjà présent
    if (!agency.logo_url && crawlData) {
      const logoUrl = this.extractLogoFromCrawlData(crawlData);
      if (logoUrl) {
        enrichedData.logo_url = logoUrl;
      }
    }

    // Extraction des informations de contact
    const contactInfo = this.extractContactInfo(crawlData);
    if (contactInfo) {
      enrichedData.contact_info = contactInfo;
    }

    // Extraction des statistiques
    const stats = this.extractAgencyStats(crawlData);
    if (stats) {
      enrichedData.statistics = stats;
    }

    // Extraction des domaines d'activité
    const activities = this.extractActivities(crawlData);
    if (activities) {
      enrichedData.activities = activities;
    }

    return enrichedData;
  }

  static extractLogoFromCrawlData(crawlData: any): string | null {
    if (!crawlData || !Array.isArray(crawlData)) return null;

    for (const page of crawlData) {
      if (page.html) {
        // Rechercher les images de logo dans le HTML
        const logoRegex = /<img[^>]*(?:class|id|alt|src)[^>]*(?:logo|brand|header)[^>]*src=["']([^"']+)["'][^>]*>/gi;
        const match = logoRegex.exec(page.html);
        if (match && match[1]) {
          return match[1];
        }
      }
    }

    return null;
  }

  static extractContactInfo(crawlData: any): any {
    if (!crawlData || !Array.isArray(crawlData)) return null;

    const contactInfo: any = {};

    for (const page of crawlData) {
      if (page.markdown) {
        const text = page.markdown.toLowerCase();
        
        // Extraction email
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
        const emails = text.match(emailRegex);
        if (emails) {
          contactInfo.emails = [...new Set(emails)];
        }

        // Extraction téléphone
        const phoneRegex = /(?:\+?33|0)[1-9](?:[0-9]{8})|(?:\+?[1-9]\d{1,14})/g;
        const phones = text.match(phoneRegex);
        if (phones) {
          contactInfo.phones = [...new Set(phones)];
        }

        // Extraction adresse
        if (text.includes('adresse') || text.includes('address')) {
          const addressLines = text.split('\n').filter(line => 
            line.includes('adresse') || line.includes('address') ||
            line.includes('rue') || line.includes('avenue') || line.includes('boulevard')
          );
          if (addressLines.length > 0) {
            contactInfo.address_details = addressLines[0];
          }
        }
      }
    }

    return Object.keys(contactInfo).length > 0 ? contactInfo : null;
  }

  static extractAgencyStats(crawlData: any): any {
    if (!crawlData || !Array.isArray(crawlData)) return null;

    const stats: any = {};

    for (const page of crawlData) {
      if (page.markdown) {
        const text = page.markdown.toLowerCase();
        
        // Recherche de statistiques communes
        const patterns = [
          { key: 'budget', regex: /budget[:\s]*([0-9,.\s]+)\s*(?:€|EUR|FCFA|USD)/i },
          { key: 'beneficiaires', regex: /bénéficiaires?[:\s]*([0-9,.\s]+)/i },
          { key: 'projets', regex: /projets?[:\s]*([0-9,.\s]+)/i },
          { key: 'couverture', regex: /couverture[:\s]*([0-9,.\s]+)\s*%/i }
        ];

        patterns.forEach(pattern => {
          const match = text.match(pattern.regex);
          if (match && match[1]) {
            const value = parseFloat(match[1].replace(/[,\s]/g, ''));
            if (!isNaN(value)) {
              stats[pattern.key] = value;
            }
          }
        });
      }
    }

    return Object.keys(stats).length > 0 ? stats : null;
  }

  static extractActivities(crawlData: any): string[] | null {
    if (!crawlData || !Array.isArray(crawlData)) return null;

    const activities = new Set<string>();
    const activityKeywords = [
      'télécommunications', 'internet', 'fibre optique', 'mobile',
      'couverture réseau', 'service universel', 'inclusion numérique',
      'formation numérique', 'infrastructure', 'connectivité'
    ];

    for (const page of crawlData) {
      if (page.markdown) {
        const text = page.markdown.toLowerCase();
        
        activityKeywords.forEach(keyword => {
          if (text.includes(keyword)) {
            activities.add(keyword);
          }
        });
      }
    }

    return activities.size > 0 ? Array.from(activities) : null;
  }

  static async scheduleAutoSync(agencyId: string, intervalHours: number = 24): Promise<void> {
    // Configuration du connecteur pour la synchronisation automatique
    const { error } = await supabase
      .from('agency_connectors')
      .upsert({
        agency_id: agencyId,
        connector_type: 'firecrawl',
        is_active: true,
        sync_frequency: intervalHours * 3600, // en secondes
        auth_config: {
          auto_enrichment: true,
          extract_projects: true,
          extract_resources: true,
          extract_news: true,
          extract_contacts: true,
          extract_logos: true
        }
      }, { onConflict: 'agency_id,connector_type' });

    if (error) {
      throw new Error(`Erreur lors de la configuration: ${error.message}`);
    }
  }
}
