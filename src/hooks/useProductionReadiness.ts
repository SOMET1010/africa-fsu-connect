import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import Environment from '@/utils/environment';

interface ProductionCheck {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  critical: boolean;
  fix?: string;
}

interface ProductionReadiness {
  score: number;
  ready: boolean;
  checks: ProductionCheck[];
  criticalIssues: number;
  warnings: number;
}

export const useProductionReadiness = () => {
  const [readiness, setReadiness] = useState<ProductionReadiness | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const runProductionChecks = async (): Promise<ProductionReadiness> => {
    const checks: ProductionCheck[] = [];
    
    // 1. Vérification base de données
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      checks.push({
        name: 'Connectivité base de données',
        status: error ? 'fail' : 'pass',
        message: error ? `Erreur DB: ${error.message}` : 'Base de données accessible',
        critical: true,
        fix: error ? 'Vérifier la configuration Supabase' : undefined
      });
    } catch (error) {
      checks.push({
        name: 'Connectivité base de données',
        status: 'fail',
        message: 'Erreur de connexion critique',
        critical: true,
        fix: 'Vérifier les credentials Supabase'
      });
    }

    // 2. Vérification authentification
    try {
      const { data: { session } } = await supabase.auth.getSession();
      checks.push({
        name: 'Système d\'authentification',
        status: 'pass',
        message: 'Auth fonctionnel',
        critical: true
      });
    } catch (error) {
      checks.push({
        name: 'Système d\'authentification',
        status: 'fail',
        message: 'Problème d\'authentification',
        critical: true,
        fix: 'Vérifier la configuration auth Supabase'
      });
    }

    // 3. Vérification environnement
    checks.push({
      name: 'Configuration environnement',
      status: Environment.isProduction ? 'pass' : 'warn',
      message: Environment.isProduction ? 'Mode production' : 'Mode développement',
      critical: false,
      fix: !Environment.isProduction ? 'Déployer en production' : undefined
    });

    // 4. Vérification sécurité
    const securityScore = localStorage.getItem('security-preferences');
    checks.push({
      name: 'Configuration sécurité',
      status: securityScore ? 'pass' : 'warn',
      message: securityScore ? 'Préférences sécurité configurées' : 'Sécurité non configurée',
      critical: false,
      fix: !securityScore ? 'Configurer les préférences de sécurité' : undefined
    });

    // 5. Vérification performances
    const perfData = localStorage.getItem('performance-metrics');
    checks.push({
      name: 'Monitoring performances',
      status: perfData ? 'pass' : 'warn',
      message: perfData ? 'Métriques disponibles' : 'Pas de données de performance',
      critical: false,
      fix: !perfData ? 'Activer le monitoring des performances' : undefined
    });

    // 6. Vérification données critiques
    try {
      const { data: orgData } = await supabase.from('agencies').select('count').limit(1);
      const { data: docData } = await supabase.from('documents').select('count').limit(1);
      
      const hasData = (orgData && orgData.length > 0) || (docData && docData.length > 0);
      checks.push({
        name: 'Données de base',
        status: hasData ? 'pass' : 'warn',
        message: hasData ? 'Données disponibles' : 'Base de données vide',
        critical: false,
        fix: !hasData ? 'Importer les données initiales' : undefined
      });
    } catch (error) {
      checks.push({
        name: 'Données de base',
        status: 'fail',
        message: 'Erreur de vérification des données',
        critical: true,
        fix: 'Vérifier l\'accès aux tables principales'
      });
    }

    // Calcul du score
    const totalChecks = checks.length;
    const passedChecks = checks.filter(c => c.status === 'pass').length;
    const criticalIssues = checks.filter(c => c.status === 'fail' && c.critical).length;
    const warnings = checks.filter(c => c.status === 'warn').length;
    
    const score = Math.round((passedChecks / totalChecks) * 100);
    const ready = criticalIssues === 0 && score >= 80;

    return {
      score,
      ready,
      checks,
      criticalIssues,
      warnings
    };
  };

  const checkProductionReadiness = async () => {
    setIsChecking(true);
    try {
      const result = await runProductionChecks();
      setReadiness(result);
      
      logger.monitoring('production-readiness-score', result.score, {
        metadata: {
          ready: result.ready,
          criticalIssues: result.criticalIssues,
          warnings: result.warnings
        }
      });
      
      return result;
    } catch (error) {
      logger.error('Erreur lors de la vérification de production', error);
      throw error;
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Auto-check au montage du composant
    checkProductionReadiness();
  }, []);

  return {
    readiness,
    isChecking,
    checkProductionReadiness,
    isReady: readiness?.ready || false,
    score: readiness?.score || 0
  };
};