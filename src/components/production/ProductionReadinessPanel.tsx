import React from 'react';
import { useProductionReadiness } from '@/hooks/useProductionReadiness';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Rocket } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const ProductionReadinessPanel = () => {
  const { readiness, isChecking, checkProductionReadiness, isReady, score } = useProductionReadiness();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warn':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-500';
      case 'warn':
        return 'bg-yellow-500';
      case 'fail':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!readiness && !isChecking) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Préparation Production
          </CardTitle>
          <CardDescription>
            Vérifiez si votre application est prête pour la production
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={checkProductionReadiness} disabled={isChecking}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Lancer la vérification
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Préparation Production
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkProductionReadiness}
            disabled={isChecking}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </CardTitle>
        <CardDescription>
          Score de préparation: {score}% {isReady ? '✅' : '❌'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Score global */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Score global</span>
            <span className="font-medium">{score}%</span>
          </div>
          <Progress value={score} className="h-2" />
        </div>

        {/* Statut global */}
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            {isReady ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
            <div>
              <div className="font-medium">
                {isReady ? 'Prêt pour la production' : 'Non prêt pour la production'}
              </div>
              <div className="text-sm text-muted-foreground">
                {readiness?.criticalIssues || 0} problème(s) critique(s), {readiness?.warnings || 0} avertissement(s)
              </div>
            </div>
          </div>
          <Badge variant={isReady ? 'default' : 'destructive'}>
            {isReady ? 'READY' : 'NOT READY'}
          </Badge>
        </div>

        <Separator />

        {/* Détail des vérifications */}
        <div className="space-y-3">
          <h4 className="font-medium">Détail des vérifications</h4>
          {readiness?.checks.map((check, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
              {getStatusIcon(check.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{check.name}</span>
                  {check.critical && (
                    <Badge variant="outline" className="text-xs">
                      CRITIQUE
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {check.message}
                </p>
                {check.fix && (
                  <p className="text-xs text-blue-600 mt-1">
                    💡 {check.fix}
                  </p>
                )}
              </div>
              <div className={`w-2 h-2 rounded-full ${getStatusColor(check.status)}`} />
            </div>
          ))}
        </div>

        {/* Actions recommandées */}
        {!isReady && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Actions recommandées</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              {readiness?.checks
                .filter(check => check.status !== 'pass' && check.fix)
                .map((check, index) => (
                  <li key={index}>• {check.fix}</li>
                ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};