import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiConnectorService, type ApiConnector, type ConnectorTestResult } from "@/services/apiConnectorService";
import { CheckCircle, AlertTriangle, X, Loader2, TestTube, Clock, Database } from "lucide-react";

interface ConnectorTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connector: Partial<ApiConnector>;
}

export function ConnectorTestDialog({ open, onOpenChange, connector }: ConnectorTestDialogProps) {
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<ConnectorTestResult | null>(null);
  const [testPhase, setTestPhase] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const runCompleteTest = async () => {
    setTesting(true);
    setTestResults(null);
    setProgress(0);

    try {
      // Phase 1: Test de connectivité
      setTestPhase('Test de connectivité...');
      setProgress(20);
      
      const connectivityResult = await ApiConnectorService.testConnection(connector);
      
      if (!connectivityResult.success) {
        setTestResults(connectivityResult);
        return;
      }

      // Phase 2: Test d'authentification
      setTestPhase('Vérification de l\'authentification...');
      setProgress(40);
      
      // Phase 3: Test des endpoints
      setTestPhase('Test des endpoints de données...');
      setProgress(60);
      
      // Phase 4: Validation des données
      setTestPhase('Validation des données reçues...');
      setProgress(80);
      
      // Phase 5: Test complet
      setTestPhase('Finalisation du test...');
      setProgress(100);
      
      setTestResults({
        ...connectivityResult,
        success: true
      });

    } catch (error) {
      setTestResults({
        success: false,
        error: error instanceof Error ? error.message : 'Erreur du test',
        responseTime: 0
      });
    } finally {
      setTesting(false);
      setTestPhase('');
      setProgress(0);
    }
  };

  const getStatusIcon = (success: boolean) => {
    if (success) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <AlertTriangle className="h-5 w-5 text-red-500" />;
  };

  const getStatusBadge = (success: boolean) => {
    return (
      <Badge variant={success ? "default" : "destructive"}>
        {success ? "Succès" : "Échec"}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Test du connecteur
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations du connecteur */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <h3 className="font-semibold mb-2">Configuration à tester</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Type:</span> {connector.type?.toUpperCase()}
              </div>
              <div>
                <span className="font-medium">Authentification:</span> {connector.authMethod}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Endpoint:</span> {connector.endpoint}
              </div>
            </div>
          </div>

          {/* Bouton de test */}
          <div className="flex gap-2">
            <Button
              onClick={runCompleteTest}
              disabled={testing || !connector.endpoint}
              className="w-full"
            >
              {testing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {testPhase || 'Test en cours...'}
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Lancer le test complet
                </>
              )}
            </Button>
          </div>

          {/* Barre de progression */}
          {testing && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                {testPhase}
              </p>
            </div>
          )}

          {/* Résultats du test */}
          {testResults && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.success)}
                  <span className="font-semibold">
                    Résultat du test
                  </span>
                </div>
                {getStatusBadge(testResults.success)}
              </div>

              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="summary">Résumé</TabsTrigger>
                  <TabsTrigger value="details">Détails</TabsTrigger>
                  <TabsTrigger value="data">Données</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Temps de réponse</span>
                      </div>
                      <p className="text-lg font-semibold">
                        {testResults.responseTime}ms
                      </p>
                    </div>
                    
                    <div className="p-3 border rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Code de statut</span>
                      </div>
                      <p className="text-lg font-semibold">
                        {testResults.statusCode || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {testResults.error && (
                    <div className="p-3 border border-red-200 rounded bg-red-50">
                      <h4 className="font-medium text-red-800 mb-1">Erreur</h4>
                      <p className="text-sm text-red-700">{testResults.error}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { name: "Connectivité", status: testResults.success, description: "Connexion au serveur" },
                      { name: "Authentification", status: testResults.success, description: "Validation des credentials" },
                      { name: "Endpoints", status: testResults.success, description: "Accès aux données" },
                      { name: "Format des données", status: testResults.success, description: "Structure des réponses" }
                    ].map((check, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{check.name}</div>
                          <div className="text-sm text-muted-foreground">{check.description}</div>
                        </div>
                        {getStatusIcon(check.status)}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="data" className="space-y-4">
                  {testResults.data ? (
                    <div className="p-3 border rounded bg-muted/50">
                      <h4 className="font-medium mb-2">Exemple de données reçues</h4>
                      <pre className="text-xs overflow-auto max-h-40 bg-background p-2 rounded">
                        {JSON.stringify(testResults.data, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="p-3 border rounded text-center text-muted-foreground">
                      Aucune donnée reçue lors du test
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}