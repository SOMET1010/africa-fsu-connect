import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, XCircle, Activity, Database, Shield, Users, FileText, Zap } from 'lucide-react';
import { useDiagnostic } from '@/hooks/useDiagnostic';

export const DiagnosticDashboard = () => {
  const { 
    runDiagnostic, 
    diagnosticResults, 
    isRunning, 
    progress 
  } = useDiagnostic();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'database':
        return <Database className="h-5 w-5" />;
      case 'security':
        return <Shield className="h-5 w-5" />;
      case 'performance':
        return <Zap className="h-5 w-5" />;
      case 'users':
        return <Users className="h-5 w-5" />;
      case 'content':
        return <FileText className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Autodiagnostic de l'Application</h1>
          <p className="text-muted-foreground mt-2">
            Analysez l'état de votre application et identifiez les améliorations possibles
          </p>
        </div>
        <Button 
          onClick={runDiagnostic} 
          disabled={isRunning}
          size="lg"
        >
          {isRunning ? 'Diagnostic en cours...' : 'Lancer le diagnostic'}
        </Button>
      </div>

      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Activity className="h-5 w-5 animate-spin" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span>Diagnostic en cours...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {diagnosticResults && (
        <div className="grid gap-6">
          {/* Score global */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Score Global de Santé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-primary">
                  {diagnosticResults.overallScore}/100
                </div>
                <div className="flex-1">
                  <Progress value={diagnosticResults.overallScore} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {diagnosticResults.overallScore >= 80 ? 'Excellent' :
                     diagnosticResults.overallScore >= 60 ? 'Bon' :
                     diagnosticResults.overallScore >= 40 ? 'Moyen' : 'Nécessite des améliorations'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Résumé par catégorie */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(diagnosticResults.categories).map(([category, data]) => (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    {getCategoryIcon(category)}
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{data.score}/100</div>
                    <Badge className={getStatusColor(data.status)}>
                      {data.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {data.issues} problème(s) détecté(s)
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Détails des vérifications */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Résultats Détaillés</h2>
            {diagnosticResults.checks.map((check, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(check.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{check.name}</h3>
                        <Badge className={getStatusColor(check.status)}>
                          {check.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {check.description}
                      </p>
                      {check.details && (
                        <div className="mt-2 text-sm">
                          <strong>Détails:</strong> {check.details}
                        </div>
                      )}
                      {check.recommendation && (
                        <Alert className="mt-3">
                          <AlertDescription>
                            <strong>Recommandation:</strong> {check.recommendation}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Actions recommandées */}
          {diagnosticResults.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Actions Recommandées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {diagnosticResults.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">{rec.title}</h4>
                        <p className="text-sm text-blue-700">{rec.description}</p>
                        <Badge variant="outline" className="mt-1">
                          Priorité: {rec.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};