/**
 * ÉTAPE 5: MONITORING AVANCÉ - HEALTH CHECKS
 * Surveillance temps réel de la santé applicative
 */

import { logger } from './logger';
import { supabase } from '@/integrations/supabase/client';

interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  details?: any;
  timestamp: number;
}

interface HealthReport {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  score: number;
  checks: HealthCheckResult[];
  alerts: string[];
}

class HealthMonitor {
  private checkInterval: NodeJS.Timeout | null = null;
  private alertThresholds = {
    responseTime: 1000, // ms
    errorRate: 0.05, // 5%
    availability: 0.95 // 95%
  };

  async runHealthChecks(): Promise<HealthReport> {
    const checks: HealthCheckResult[] = [];
    const alerts: string[] = [];

    // 1. Check Database Connectivity
    const dbCheck = await this.checkDatabase();
    checks.push(dbCheck);
    if (dbCheck.status !== 'healthy') {
      alerts.push(`Base de données ${dbCheck.status}: ${dbCheck.details}`);
    }

    // 2. Check Authentication Service
    const authCheck = await this.checkAuthentication();
    checks.push(authCheck);
    if (authCheck.status !== 'healthy') {
      alerts.push(`Authentification ${authCheck.status}`);
    }

    // 3. Check API Endpoints
    const apiCheck = await this.checkApiEndpoints();
    checks.push(apiCheck);
    if (apiCheck.responseTime > this.alertThresholds.responseTime) {
      alerts.push(`API lente: ${apiCheck.responseTime}ms`);
    }

    // 4. Check Local Storage
    const storageCheck = await this.checkLocalStorage();
    checks.push(storageCheck);

    // 5. Check Network Connectivity
    const networkCheck = await this.checkNetworkConnectivity();
    checks.push(networkCheck);

    // Calculate overall health
    const healthyCount = checks.filter(c => c.status === 'healthy').length;
    const score = Math.round((healthyCount / checks.length) * 100);
    
    let overall: 'healthy' | 'degraded' | 'unhealthy';
    if (score >= 90) overall = 'healthy';
    else if (score >= 70) overall = 'degraded';
    else overall = 'unhealthy';

    const report: HealthReport = {
      overall,
      score,
      checks,
      alerts
    };

    // Log health status
    logger.monitoring('health-check-score', score, {
      metadata: {
        overall,
        alertCount: alerts.length,
        checks: checks.length
      }
    });

    return report;
  }

  private async checkDatabase(): Promise<HealthCheckResult> {
    const start = performance.now();
    
    try {
      const { error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      const responseTime = performance.now() - start;
      
      return {
        service: 'database',
        status: error ? 'unhealthy' : 'healthy',
        responseTime,
        details: error?.message || 'Connexion OK',
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        service: 'database',
        status: 'unhealthy',
        responseTime: performance.now() - start,
        details: `Erreur critique: ${error}`,
        timestamp: Date.now()
      };
    }
  }

  private async checkAuthentication(): Promise<HealthCheckResult> {
    const start = performance.now();
    
    try {
      const { data, error } = await supabase.auth.getSession();
      const responseTime = performance.now() - start;
      
      return {
        service: 'authentication',
        status: error ? 'degraded' : 'healthy',
        responseTime,
        details: error?.message || 'Service auth opérationnel',
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        service: 'authentication',
        status: 'unhealthy',
        responseTime: performance.now() - start,
        details: `Auth indisponible: ${error}`,
        timestamp: Date.now()
      };
    }
  }

  private async checkApiEndpoints(): Promise<HealthCheckResult> {
    const start = performance.now();
    
    try {
      // Test d'endpoint principal
      const { error } = await supabase
        .from('agencies')
        .select('count')
        .limit(1);
      
      const responseTime = performance.now() - start;
      
      return {
        service: 'api',
        status: error ? 'degraded' : (responseTime > 500 ? 'degraded' : 'healthy'),
        responseTime,
        details: `Temps de réponse: ${Math.round(responseTime)}ms`,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        service: 'api',
        status: 'unhealthy',
        responseTime: performance.now() - start,
        details: `API inaccessible: ${error}`,
        timestamp: Date.now()
      };
    }
  }

  private async checkLocalStorage(): Promise<HealthCheckResult> {
    const start = performance.now();
    
    try {
      const testKey = 'health-check-test';
      const testValue = Date.now().toString();
      
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      const responseTime = performance.now() - start;
      const isWorking = retrieved === testValue;
      
      return {
        service: 'localStorage',
        status: isWorking ? 'healthy' : 'degraded',
        responseTime,
        details: isWorking ? 'Stockage fonctionnel' : 'Problème stockage local',
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        service: 'localStorage',
        status: 'unhealthy',
        responseTime: performance.now() - start,
        details: `Stockage indisponible: ${error}`,
        timestamp: Date.now()
      };
    }
  }

  private async checkNetworkConnectivity(): Promise<HealthCheckResult> {
    const start = performance.now();
    
    try {
      const online = navigator.onLine;
      const responseTime = performance.now() - start;
      
      return {
        service: 'network',
        status: online ? 'healthy' : 'unhealthy',
        responseTime,
        details: online ? 'Connexion active' : 'Hors ligne',
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        service: 'network',
        status: 'unhealthy',
        responseTime: performance.now() - start,
        details: `Erreur réseau: ${error}`,
        timestamp: Date.now()
      };
    }
  }

  startMonitoring(intervalMs: number = 30000) {
    this.checkInterval = setInterval(async () => {
      const report = await this.runHealthChecks();
      
      if (report.overall !== 'healthy') {
        logger.warn('Problème de santé détecté', {
          component: 'HealthMonitor',
          metadata: {
            overall: report.overall,
            score: report.score,
            alertCount: report.alerts.length
          }
        });
        
        // En production, envoyer alertes
        if (import.meta.env.PROD && report.alerts.length > 0) {
          this.sendAlerts(report.alerts);
        }
      }
    }, intervalMs);
    
    logger.info('Health monitoring démarré', {
      component: 'HealthMonitor',
      interval: `${intervalMs}ms`
    });
  }

  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      logger.info('Health monitoring arrêté');
    }
  }

  private sendAlerts(alerts: string[]) {
    // Envoyer alertes vers service de monitoring externe
    alerts.forEach(alert => {
      logger.error('ALERTE PRODUCTION', new Error(alert), {
        component: 'HealthMonitor',
        critical: true
      });
    });
  }
}

export const healthMonitor = new HealthMonitor();

// Auto-start en production
if (import.meta.env.PROD) {
  healthMonitor.startMonitoring();
}