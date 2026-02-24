/**
 * Utilitaires pour la gestion d'environnement
 */

const BASE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'http://127.0.0.1:54311';
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL ?? `${BASE_SUPABASE_URL}/storage/v1`;
const FUNCTIONS_URL = import.meta.env.VITE_EDGE_FUNCTIONS_URL ?? `${BASE_SUPABASE_URL}/functions/v1`;

export const Environment = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
  
  // Configuration selon l'environnement
  config: {
    logging: {
      level: import.meta.env.DEV ? 'debug' : 'error',
      enableConsole: import.meta.env.DEV,
      enableRemoteLogging: import.meta.env.PROD
    },
    performance: {
      enableMetrics: true,
      enableTracing: import.meta.env.PROD,
      sampleRate: import.meta.env.DEV ? 1.0 : 0.1
    },
    security: {
      enableStrictMode: import.meta.env.PROD,
      enableAuditLogging: true,
      sessionTimeout: import.meta.env.DEV ? 24 * 60 * 60 : 8 * 60 * 60 // 24h dev, 8h prod
    },
    features: {
      enableBetaFeatures: import.meta.env.DEV,
      enableAnalytics: true,
      enableDiagnostics: true
    }
  },

  // URLs selon l'environnement
  urls: {
    api: BASE_SUPABASE_URL,
    storage: STORAGE_URL,
    functions: FUNCTIONS_URL
  },

  // Méthodes utilitaires
  getFeatureFlag: (feature: string): boolean => {
    const flags = Environment.config.features;
    return flags[feature as keyof typeof flags] || false;
  },

  getConfigValue: (path: string): any => {
    const pathArray = path.split('.');
    let current: any = Environment.config;
    
    for (const key of pathArray) {
      current = current?.[key];
      if (current === undefined) return null;
    }
    
    return current;
  }
};

export default Environment;
