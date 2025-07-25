import { supabase } from "@/integrations/supabase/client";

export interface ApiConnector {
  id: string;
  name: string;
  type: 'rest' | 'graphql' | 'soap' | 'webhook';
  endpoint: string;
  authMethod: 'none' | 'api_key' | 'bearer' | 'oauth' | 'basic';
  authConfig: {
    apiKey?: string;
    bearerToken?: string;
    username?: string;
    password?: string;
    oauthConfig?: {
      clientId: string;
      clientSecret: string;
      authUrl: string;
      tokenUrl: string;
      scopes: string[];
    };
  };
  headers?: Record<string, string>;
  requestConfig?: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH';
    timeout: number;
    retries: number;
    rateLimit?: {
      requests: number;
      period: number; // en secondes
    };
  };
  dataMapping: {
    projectsEndpoint?: string;
    resourcesEndpoint?: string;
    newsEndpoint?: string;
    fieldMappings: Record<string, string>;
  };
  validation: {
    schema?: object;
    rules: ValidationRule[];
  };
  schedule: {
    enabled: boolean;
    frequency: number; // en heures
    nextRun?: Date;
  };
  isActive: boolean;
  lastSync?: Date;
  lastError?: string;
}

export interface ValidationRule {
  field: string;
  type: 'required' | 'format' | 'length' | 'range' | 'custom';
  value?: any;
  message: string;
}

export interface ConnectorTestResult {
  success: boolean;
  data?: any;
  error?: string;
  responseTime: number;
  statusCode?: number;
}

export interface DataPreview {
  projects: any[];
  resources: any[];
  news: any[];
  totalRecords: number;
  sampleData: any[];
}

export class ApiConnectorService {
  static async testConnection(connector: Partial<ApiConnector>): Promise<ConnectorTestResult> {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('test-api-connector', {
        body: { connector }
      });

      if (error) {
        return {
          success: false,
          error: error.message,
          responseTime: Date.now() - startTime
        };
      }

      return {
        success: true,
        data: data?.response,
        responseTime: Date.now() - startTime,
        statusCode: data?.statusCode
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Test de connexion échoué',
        responseTime: Date.now() - startTime
      };
    }
  }

  static async validateConnectorConfig(connector: Partial<ApiConnector>): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validation basique
    if (!connector.name?.trim()) {
      errors.push('Le nom du connecteur est requis');
    }

    if (!connector.endpoint?.trim()) {
      errors.push('L\'endpoint est requis');
    }

    if (!connector.type) {
      errors.push('Le type de connecteur est requis');
    }

    // Validation de l'authentification
    if (connector.authMethod === 'api_key' && !connector.authConfig?.apiKey) {
      errors.push('La clé API est requise pour ce type d\'authentification');
    }

    if (connector.authMethod === 'bearer' && !connector.authConfig?.bearerToken) {
      errors.push('Le token Bearer est requis pour ce type d\'authentification');
    }

    if (connector.authMethod === 'basic' && (!connector.authConfig?.username || !connector.authConfig?.password)) {
      errors.push('Le nom d\'utilisateur et le mot de passe sont requis pour l\'authentification basique');
    }

    if (connector.authMethod === 'oauth' && !connector.authConfig?.oauthConfig) {
      errors.push('La configuration OAuth est requise');
    }

    // Validation de l'endpoint
    try {
      if (connector.endpoint) {
        new URL(connector.endpoint);
      }
    } catch {
      errors.push('L\'endpoint doit être une URL valide');
    }

    // Validation du mapping de données
    if (!connector.dataMapping?.fieldMappings || Object.keys(connector.dataMapping.fieldMappings).length === 0) {
      warnings.push('Aucun mapping de champs configuré - les données par défaut seront utilisées');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static async saveConnector(agencyId: string, connector: Partial<ApiConnector>): Promise<ApiConnector> {
    const validation = await this.validateConnectorConfig(connector);
    
    if (!validation.isValid) {
      throw new Error(`Configuration invalide: ${validation.errors.join(', ')}`);
    }

    const { data, error } = await supabase
      .from('agency_connectors')
      .upsert({
        agency_id: agencyId,
        connector_type: connector.type,
        endpoint_url: connector.endpoint,
        auth_method: connector.authMethod,
        auth_config: JSON.parse(JSON.stringify({
          ...connector.authConfig,
          headers: connector.headers,
          requestConfig: connector.requestConfig,
          dataMapping: connector.dataMapping,
          validation: connector.validation,
          schedule: connector.schedule
        })),
        is_active: connector.isActive ?? true,
        sync_frequency: connector.schedule?.frequency ? connector.schedule.frequency * 3600 : 24 * 3600
      })
      .select()
      .single();

    if (error) throw error;

    return this.mapConnectorFromDb(data);
  }

  static async getConnectors(agencyId: string): Promise<ApiConnector[]> {
    const { data, error } = await supabase
      .from('agency_connectors')
      .select('*')
      .eq('agency_id', agencyId)
      .eq('is_active', true);

    if (error) throw error;

    return (data || []).map(this.mapConnectorFromDb);
  }

  static async previewData(connector: Partial<ApiConnector>): Promise<DataPreview> {
    try {
      const { data, error } = await supabase.functions.invoke('preview-connector-data', {
        body: { connector }
      });

      if (error) throw error;

      return {
        projects: data?.projects || [],
        resources: data?.resources || [],
        news: data?.news || [],
        totalRecords: data?.totalRecords || 0,
        sampleData: data?.sampleData || []
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Échec de la prévisualisation des données');
    }
  }

  static async syncConnector(agencyId: string, connectorId: string): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('sync-api-connector', {
        body: { agencyId, connectorId }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Échec de la synchronisation');
    }
  }

  private static mapConnectorFromDb(dbConnector: any): ApiConnector {
    const authConfig = dbConnector.auth_config || {};
    
    return {
      id: dbConnector.id,
      name: dbConnector.name || `Connecteur ${dbConnector.connector_type}`,
      type: dbConnector.connector_type,
      endpoint: dbConnector.endpoint_url,
      authMethod: dbConnector.auth_method || 'none',
      authConfig: {
        apiKey: authConfig.apiKey,
        bearerToken: authConfig.bearerToken,
        username: authConfig.username,
        password: authConfig.password,
        oauthConfig: authConfig.oauthConfig
      },
      headers: authConfig.headers || {},
      requestConfig: authConfig.requestConfig || {
        method: 'GET',
        timeout: 30000,
        retries: 3
      },
      dataMapping: authConfig.dataMapping || {
        fieldMappings: {}
      },
      validation: authConfig.validation || {
        rules: []
      },
      schedule: authConfig.schedule || {
        enabled: false,
        frequency: 24
      },
      isActive: dbConnector.is_active,
      lastSync: dbConnector.last_sync_at ? new Date(dbConnector.last_sync_at) : undefined,
      lastError: dbConnector.error_message
    };
  }
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}