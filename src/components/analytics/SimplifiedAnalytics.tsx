import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePerformanceAnalytics } from '@/hooks/usePerformanceAnalytics';
import { 
  Activity, 
  TrendingUp, 
  Users,
  Zap
} from 'lucide-react';

export const SimplifiedAnalytics = () => {
  const { isTracking, getPerformanceInsights } = usePerformanceAnalytics();
  const insights = getPerformanceInsights();

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            État du Système
          </CardTitle>
          <CardDescription>
            Surveillance en temps réel de votre application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <Badge variant={isTracking ? "default" : "destructive"}>
              {isTracking ? 'Système Actif' : 'Système Inactif'}
            </Badge>
            {isTracking && <Zap className="h-4 w-4 text-green-500" />}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {insights.avgLoadTime > 0 ? `${insights.avgLoadTime.toFixed(1)}s` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Temps de chargement moyen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activité</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {insights.totalInteractions}
            </div>
            <p className="text-xs text-muted-foreground">
              Interactions enregistrées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fiabilité</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {insights.errorRate > 0 ? `${(insights.errorRate * 100).toFixed(1)}%` : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              Taux d'erreur
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Simple Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé</CardTitle>
          <CardDescription>
            État général de votre application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isTracking ? (
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm">L'application fonctionne normalement</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-yellow-600">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-sm">Le monitoring n'est pas actif</span>
              </div>
            )}
            
            {insights.avgLoadTime > 3 && (
              <div className="flex items-center gap-2 text-orange-600">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span className="text-sm">Temps de chargement élevé détecté</span>
              </div>
            )}
            
            {insights.errorRate > 0.05 && (
              <div className="flex items-center gap-2 text-red-600">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-sm">Taux d'erreur élevé - vérification recommandée</span>
              </div>
            )}
            
            {insights.totalInteractions > 100 && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm">Application activement utilisée</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};