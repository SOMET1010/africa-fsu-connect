import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { usePerformanceAnalytics } from '@/hooks/usePerformanceAnalytics';
import { Activity, Clock, AlertTriangle, Users, Eye, Zap } from 'lucide-react';

export const PerformanceDashboard = () => {
  const { analyticsData, isLoading, getPerformanceInsights } = usePerformanceAnalytics();
  const insights = getPerformanceInsights();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const performanceScore = Math.max(0, 100 - (insights.errorRate * 10) - (insights.avgLoadTime > 2000 ? 20 : 0));
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge variant="default" className="bg-green-500">Excellent</Badge>;
    if (score >= 60) return <Badge variant="secondary">Bon</Badge>;
    return <Badge variant="destructive">À améliorer</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Performance Score */}
        <Card className="col-span-full lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score de Performance</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className={`text-2xl font-bold ${getScoreColor(performanceScore)}`}>
                {Math.round(performanceScore)}
              </div>
              {getScoreBadge(performanceScore)}
            </div>
            <Progress value={performanceScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Basé sur le temps de chargement et le taux d'erreur
            </p>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {analyticsData?.active_users || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Dernières 24h
            </p>
          </CardContent>
        </Card>

        {/* Page Views */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vues de Pages</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {analyticsData?.page_views || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Dernières 24h
            </p>
          </CardContent>
        </Card>

        {/* Average Load Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps de Chargement Moyen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(insights.avgLoadTime || 0)}ms
            </div>
            <p className="text-xs text-muted-foreground">
              {insights.slowPages > 0 ? `${insights.slowPages} pages lentes` : 'Toutes les pages rapides'}
            </p>
          </CardContent>
        </Card>

        {/* Error Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Erreur</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {insights.errorRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Dernières 24h
            </p>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activité Totale</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {insights.totalInteractions}
            </div>
            <p className="text-xs text-muted-foreground">
              Interactions utilisateur
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights de Performance</CardTitle>
          <CardDescription>
            Analyse automatique des performances de l'application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.avgLoadTime > 3000 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                  Temps de chargement élevé détecté
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Le temps de chargement moyen est de {Math.round(insights.avgLoadTime)}ms. 
                  Considérez optimiser les assets et images.
                </p>
              </div>
            )}

            {insights.errorRate > 5 && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-medium text-red-800 dark:text-red-200">
                  Taux d'erreur élevé
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Le taux d'erreur est de {insights.errorRate.toFixed(1)}%. 
                  Vérifiez les logs pour identifier les problèmes.
                </p>
              </div>
            )}

            {insights.totalInteractions > 500 && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-800 dark:text-green-200">
                  Forte activité utilisateur
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  {insights.totalInteractions} interactions enregistrées. L'engagement est excellent !
                </p>
              </div>
            )}

            {performanceScore >= 80 && insights.errorRate < 2 && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-800 dark:text-blue-200">
                  Performance optimale
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Votre application fonctionne parfaitement ! Continuez le bon travail.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};