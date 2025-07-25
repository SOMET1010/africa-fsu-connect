/**
 * Utilitaires pour la gestion d'environnement
 */

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
    api: import.meta.env.DEV 
      ? 'https://wsbawdvqfbmtjtdtyddy.supabase.co' 
      : 'https://wsbawdvqfbmtjtdtyddy.supabase.co',
    storage: 'https://wsbawdvqfbmtjtdtyddy.supabase.co/storage/v1',
    functions: 'https://wsbawdvqfbmtjtdtyddy.supabase.co/functions/v1'
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