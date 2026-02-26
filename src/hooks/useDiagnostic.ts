import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

interface DiagnosticCheck {
  name: string;
  status: 'success' | 'warning' | 'error';
  description: string;
  details?: string;
  recommendation?: string;
  category: string;
}

interface DiagnosticResult {
  overallScore: number;
  categories: Record<string, {
    score: number;
    status: 'success' | 'warning' | 'error';
    issues: number;
  }>;
  checks: DiagnosticCheck[];
  recommendations: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export const useDiagnostic = () => {
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const checkDatabase = async (): Promise<DiagnosticCheck[]> => {
    const checks: DiagnosticCheck[] = [];
    
    try {
      // Vérifier les documents
      const { data: documents, error: docsError } = await supabase
        .from('documents')
        .select('count')
        .limit(1);

      if (docsError) {
        checks.push({
          name: 'Accès aux documents',
          status: 'error',
          description: 'Impossible d\'accéder à la table documents',
          details: docsError.message,
          recommendation: 'Vérifiez les permissions RLS et la configuration de base de données',
          category: 'database'
        });
      } else {
        checks.push({
          name: 'Accès aux documents',
          status: 'success',
          description: 'La table documents est accessible',
          category: 'database'
        });
      }

      // Vérifier les utilisateurs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      if (profilesError) {
        checks.push({
          name: 'Accès aux profils utilisateurs',
          status: 'error',
          description: 'Impossible d\'accéder à la table profiles',
          details: profilesError.message,
          category: 'database'
        });
      } else {
        checks.push({
          name: 'Accès aux profils utilisateurs',
          status: 'success',
          description: 'La table profiles est accessible',
          category: 'database'
        });
      }

      // Vérifier le nombre de documents
      const { count: docCount } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true });

      if (docCount === 0) {
        checks.push({
          name: 'Contenu de la bibliothèque',
          status: 'warning',
          description: 'Aucun document dans la bibliothèque',
          recommendation: 'Ajoutez des documents d\'exemple ou encouragez les utilisateurs à uploader du contenu',
          category: 'content'
        });
      } else if (docCount && docCount < 10) {
        checks.push({
          name: 'Contenu de la bibliothèque',
          status: 'warning',
          description: `Seulement ${docCount} document(s) dans la bibliothèque`,
          recommendation: 'Enrichissez la bibliothèque avec plus de contenu',
          category: 'content'
        });
      } else {
        checks.push({
          name: 'Contenu de la bibliothèque',
          status: 'success',
          description: `${docCount} documents disponibles`,
          category: 'content'
        });
      }

    } catch (error) {
      checks.push({
        name: 'Connectivité base de données',
        status: 'error',
        description: 'Erreur de connexion à la base de données',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        category: 'database'
      });
    }

    return checks;
  };

  const checkSecurity = async (): Promise<DiagnosticCheck[]> => {
    const checks: DiagnosticCheck[] = [];

    try {
      // Vérifier l'authentification
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        checks.push({
          name: 'Authentification utilisateur',
          status: 'success',
          description: 'Utilisateur authentifié correctement',
          category: 'security'
        });

        // Vérifier les préférences de sécurité
        const { data: securityPrefs } = await supabase
          .from('security_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!securityPrefs) {
          checks.push({
            name: 'Préférences de sécurité',
            status: 'warning',
            description: 'Aucune préférence de sécurité configurée',
            recommendation: 'Configurez vos préférences de sécurité dans la section Sécurité',
            category: 'security'
          });
        } else {
          if (!securityPrefs.two_factor_enabled) {
            checks.push({
              name: 'Authentification à deux facteurs',
              status: 'warning',
              description: '2FA non activée',
              recommendation: 'Activez l\'authentification à deux facteurs pour plus de sécurité',
              category: 'security'
            });
          } else {
            checks.push({
              name: 'Authentification à deux facteurs',
              status: 'success',
              description: '2FA activée',
              category: 'security'
            });
          }
        }
      } else {
        checks.push({
          name: 'Authentification utilisateur',
          status: 'error',
          description: 'Utilisateur non authentifié',
          recommendation: 'Connectez-vous pour accéder aux fonctionnalités',
          category: 'security'
        });
      }
    } catch (error) {
      checks.push({
        name: 'Vérification sécurité',
        status: 'error',
        description: 'Erreur lors de la vérification de sécurité',
        category: 'security'
      });
    }

    return checks;
  };

  const checkPerformance = async (): Promise<DiagnosticCheck[]> => {
    const checks: DiagnosticCheck[] = [];

    // Vérifier le temps de réponse de la base de données
    const startTime = Date.now();
    try {
      await supabase.from('profiles').select('count').limit(1);
      const responseTime = Date.now() - startTime;

      if (responseTime > 1000) {
        checks.push({
          name: 'Temps de réponse base de données',
          status: 'warning',
          description: `Temps de réponse: ${responseTime}ms`,
          recommendation: 'Optimisez les requêtes ou vérifiez la connectivité réseau',
          category: 'performance'
        });
      } else if (responseTime > 500) {
        checks.push({
          name: 'Temps de réponse base de données',
          status: 'warning',
          description: `Temps de réponse: ${responseTime}ms`,
          category: 'performance'
        });
      } else {
        checks.push({
          name: 'Temps de réponse base de données',
          status: 'success',
          description: `Temps de réponse: ${responseTime}ms`,
          category: 'performance'
        });
      }
    } catch (error) {
      checks.push({
        name: 'Temps de réponse base de données',
        status: 'error',
        description: 'Impossible de mesurer le temps de réponse',
        category: 'performance'
      });
    }

    // Vérifier l'utilisation du localStorage
    const storageUsed = new Blob(Object.values(localStorage)).size;
    if (storageUsed > 5 * 1024 * 1024) { // 5MB
      checks.push({
        name: 'Utilisation du stockage local',
        status: 'warning',
        description: `${(storageUsed / 1024 / 1024).toFixed(2)}MB utilisés`,
        recommendation: 'Nettoyez le cache local si nécessaire',
        category: 'performance'
      });
    } else {
      checks.push({
        name: 'Utilisation du stockage local',
        status: 'success',
        description: `${(storageUsed / 1024 / 1024).toFixed(2)}MB utilisés`,
        category: 'performance'
      });
    }

    return checks;
  };

  const checkUsers = async (): Promise<DiagnosticCheck[]> => {
    const checks: DiagnosticCheck[] = [];

    try {
      // Vérifier le nombre d'utilisateurs
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (userCount === 0) {
        checks.push({
          name: 'Base d\'utilisateurs',
          status: 'warning',
          description: 'Aucun utilisateur enregistré',
          recommendation: 'Invitez des utilisateurs à rejoindre la plateforme',
          category: 'users'
        });
      } else if (userCount && userCount < 5) {
        checks.push({
          name: 'Base d\'utilisateurs',
          status: 'warning',
          description: `${userCount} utilisateur(s) enregistré(s)`,
          recommendation: 'Développez votre base d\'utilisateurs',
          category: 'users'
        });
      } else {
        checks.push({
          name: 'Base d\'utilisateurs',
          status: 'success',
          description: `${userCount} utilisateurs enregistrés`,
          category: 'users'
        });
      }

      // Vérifier les rôles d'utilisateurs
      const { data: adminUsers } = await supabase
        .from('profiles')
        .select('role')
        .in('role', ['super_admin', 'country_admin']);

      if (!adminUsers || adminUsers.length === 0) {
        checks.push({
          name: 'Administrateurs',
          status: 'warning',
          description: 'Aucun administrateur configuré',
          recommendation: 'Assignez des rôles d\'administrateur à certains utilisateurs',
          category: 'users'
        });
      } else {
        checks.push({
          name: 'Administrateurs',
          status: 'success',
          description: `${adminUsers.length} administrateur(s) configuré(s)`,
          category: 'users'
        });
      }

    } catch (error) {
      checks.push({
        name: 'Vérification utilisateurs',
        status: 'error',
        description: 'Erreur lors de la vérification des utilisateurs',
        category: 'users'
      });
    }

    return checks;
  };

  const calculateCategoryScores = (checks: DiagnosticCheck[]) => {
    const categories: Record<string, { score: number; status: 'success' | 'warning' | 'error'; issues: number }> = {};
    
    
    const categoryGroups = checks.reduce((acc, check) => {
      if (!acc[check.category]) acc[check.category] = [];
      acc[check.category].push(check);
      return acc;
    }, {} as Record<string, DiagnosticCheck[]>);

    Object.entries(categoryGroups).forEach(([category, categoryChecks]) => {
      const successCount = categoryChecks.filter(c => c.status === 'success').length;
      const warningCount = categoryChecks.filter(c => c.status === 'warning').length;
      const errorCount = categoryChecks.filter(c => c.status === 'error').length;
      
      const score = Math.round((successCount / categoryChecks.length) * 100);
      const status: 'success' | 'warning' | 'error' = errorCount > 0 ? 'error' : warningCount > 0 ? 'warning' : 'success';
      
      
      categories[category] = {
        score,
        status,
        issues: warningCount + errorCount
      };
    });

    return categories;
  };

  const generateRecommendations = (checks: DiagnosticCheck[]) => {
    const recommendations: Array<{
      title: string;
      description: string;
      priority: 'high' | 'medium' | 'low';
    }> = [];

    const errorChecks = checks.filter(c => c.status === 'error');
    const warningChecks = checks.filter(c => c.status === 'warning');

    if (errorChecks.length > 0) {
      recommendations.push({
        title: 'Corriger les erreurs critiques',
        description: `${errorChecks.length} erreur(s) critique(s) détectée(s) nécessitent une attention immédiate`,
        priority: 'high'
      });
    }

    if (warningChecks.length > 2) {
      recommendations.push({
        title: 'Optimiser la configuration',
        description: `${warningChecks.length} avertissement(s) peuvent être améliorés pour une meilleure performance`,
        priority: 'medium'
      });
    }

    // Recommandations spécifiques
    const hasNoDocuments = checks.some(c => c.name === 'Contenu de la bibliothèque' && c.status === 'warning');
    if (hasNoDocuments) {
      recommendations.push({
        title: 'Enrichir le contenu',
        description: 'Ajoutez des documents à la bibliothèque pour améliorer l\'expérience utilisateur',
        priority: 'medium'
      });
    }

    const hasNo2FA = checks.some(c => c.name === 'Authentification à deux facteurs' && c.status === 'warning');
    if (hasNo2FA) {
      recommendations.push({
        title: 'Renforcer la sécurité',
        description: 'Activez l\'authentification à deux facteurs pour une sécurité renforcée',
        priority: 'medium'
      });
    }

    return recommendations;
  };

  const runDiagnostic = async () => {
    setIsRunning(true);
    setProgress(0);
    
    try {
      setProgress(20);
      const databaseChecks = await checkDatabase();
      
      setProgress(40);
      const securityChecks = await checkSecurity();
      
      setProgress(60);
      const performanceChecks = await checkPerformance();
      
      setProgress(80);
      const userChecks = await checkUsers();
      
      setProgress(90);
      
      const allChecks = [...databaseChecks, ...securityChecks, ...performanceChecks, ...userChecks];
      const categories = calculateCategoryScores(allChecks);
      const recommendations = generateRecommendations(allChecks);
      
      const overallScore = Math.round(
        allChecks.filter(c => c.status === 'success').length / allChecks.length * 100
      );

      setDiagnosticResults({
        overallScore,
        categories,
        checks: allChecks,
        recommendations
      });

      setProgress(100);
      
      toast({
        title: "Diagnostic terminé",
        description: `Score global: ${overallScore}/100`,
      });

    } catch (error) {
      logger.error('Erreur lors du diagnostic:', error as any);
      toast({
        title: "Erreur",
        description: "Impossible de terminer le diagnostic",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return {
    runDiagnostic,
    diagnosticResults,
    isRunning,
    progress
  };
};
