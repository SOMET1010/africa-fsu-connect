import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ApiConnectorService, type ApiConnector } from "@/services/apiConnectorService";
import { Loader2, TestTube, Eye, AlertTriangle, CheckCircle } from "lucide-react";

interface ApiConnectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agencyId: string;
  connector?: ApiConnector;
  onSave: (connector: ApiConnector) => void;
}

export function ApiConnectorDialog({ 
  open, 
  onOpenChange, 
  agencyId, 
  connector, 
  onSave 
}: ApiConnectorDialogProps) {
  const { toast } = useToast();
  const [config, setConfig] = useState<Partial<ApiConnector>>({
    name: '',
    type: 'rest',
    endpoint: '',
    authMethod: 'none',
    authConfig: {},
    headers: {},
    requestConfig: {
      method: 'GET',
      timeout: 30000,
      retries: 3
    },
    dataMapping: {
      fieldMappings: {}
    },
    validation: {
      rules: []
    },
    schedule: {
      enabled: false,
      frequency: 24
    },
    isActive: true
  });

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    if (connector) {
      setConfig(connector);
    }
  }, [connector]);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const result = await ApiConnectorService.testConnection(config);
      setTestResult(result);
      
      if (result.success) {
        toast({
          title: "Test réussi",
          description: `Connexion établie en ${result.responseTime}ms`,
        });
      } else {
        toast({
          title: "Test échoué",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur de test",
        description: error instanceof Error ? error.message : "Erreur inconnue",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  const handlePreviewData = async () => {
    setLoadingPreview(true);
    
    try {
      const preview = await ApiConnectorService.previewData(config);
      setPreviewData(preview);
      
      toast({
        title: "Aperçu généré",
        description: `${preview.totalRecords} enregistrements trouvés`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'aperçu",
        description: error instanceof Error ? error.message : "Erreur inconnue",
        variant: "destructive"
      });
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const validation = await ApiConnectorService.validateConnectorConfig(config);
      
      if (!validation.isValid) {
        toast({
          title: "Configuration invalide",
          description: validation.errors.join(', '),
          variant: "destructive"
        });
        return;
      }

      const savedConnector = await ApiConnectorService.saveConnector(agencyId, config);
      onSave(savedConnector);
      onOpenChange(false);
      
      toast({
        title: "Connecteur sauvegardé",
        description: "La configuration a été enregistrée avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur de sauvegarde",
        description: error instanceof Error ? error.message : "Erreur inconnue",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const addHeader = (key: string, value: string) => {
    if (key && value) {
      setConfig(prev => ({
        ...prev,
        headers: { ...prev.headers, [key]: value }
      }));
    }
  };

  const removeHeader = (key: string) => {
    const { [key]: _, ...rest } = config.headers || {};
    setConfig(prev => ({ ...prev, headers: rest }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {connector ? 'Modifier le connecteur' : 'Nouveau connecteur API'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="auth">Authentification</TabsTrigger>
            <TabsTrigger value="mapping">Mapping</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="schedule">Planification</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du connecteur</Label>
                <Input
                  id="name"
                  value={config.name}
                  onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Mon API REST"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={config.type} 
                  onValueChange={(value: any) => setConfig(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rest">REST API</SelectItem>
                    <SelectItem value="graphql">GraphQL</SelectItem>
                    <SelectItem value="soap">SOAP</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endpoint">Endpoint</Label>
              <Input
                id="endpoint"
                value={config.endpoint}
                onChange={(e) => setConfig(prev => ({ ...prev, endpoint: e.target.value }))}
                placeholder="https://api.exemple.com/v1"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="method">Méthode</Label>
                <Select 
                  value={config.requestConfig?.method} 
                  onValueChange={(value: any) => setConfig(prev => ({ 
                    ...prev, 
                    requestConfig: { ...prev.requestConfig!, method: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeout">Timeout (ms)</Label>
                <Input
                  id="timeout"
                  type="number"
                  value={config.requestConfig?.timeout}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    requestConfig: { ...prev.requestConfig!, timeout: parseInt(e.target.value) }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retries">Tentatives</Label>
                <Input
                  id="retries"
                  type="number"
                  value={config.requestConfig?.retries}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    requestConfig: { ...prev.requestConfig!, retries: parseInt(e.target.value) }
                  }))}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestConnection}
                disabled={testing || !config.endpoint}
              >
                {testing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <TestTube className="h-4 w-4 mr-2" />}
                Tester la connexion
              </Button>

              {testResult && (
                <Badge variant={testResult.success ? "default" : "destructive"}>
                  {testResult.success ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 mr-1" />
                  )}
                  {testResult.success ? `${testResult.responseTime}ms` : 'Échec'}
                </Badge>
              )}
            </div>
          </TabsContent>

          <TabsContent value="auth" className="space-y-4">
            <div className="space-y-2">
              <Label>Méthode d'authentification</Label>
              <Select 
                value={config.authMethod} 
                onValueChange={(value: any) => setConfig(prev => ({ ...prev, authMethod: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune</SelectItem>
                  <SelectItem value="api_key">Clé API</SelectItem>
                  <SelectItem value="bearer">Bearer Token</SelectItem>
                  <SelectItem value="basic">Authentification basique</SelectItem>
                  <SelectItem value="oauth">OAuth 2.0</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {config.authMethod === 'api_key' && (
              <div className="space-y-2">
                <Label htmlFor="apiKey">Clé API</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={config.authConfig?.apiKey || ''}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    authConfig: { ...prev.authConfig, apiKey: e.target.value }
                  }))}
                  placeholder="Votre clé API"
                />
              </div>
            )}

            {config.authMethod === 'bearer' && (
              <div className="space-y-2">
                <Label htmlFor="bearerToken">Bearer Token</Label>
                <Input
                  id="bearerToken"
                  type="password"
                  value={config.authConfig?.bearerToken || ''}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    authConfig: { ...prev.authConfig, bearerToken: e.target.value }
                  }))}
                  placeholder="Votre token Bearer"
                />
              </div>
            )}

            {config.authMethod === 'basic' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input
                    id="username"
                    value={config.authConfig?.username || ''}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      authConfig: { ...prev.authConfig, username: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={config.authConfig?.password || ''}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      authConfig: { ...prev.authConfig, password: e.target.value }
                    }))}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="mapping" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectsEndpoint">Endpoint Projets</Label>
                  <Input
                    id="projectsEndpoint"
                    value={config.dataMapping?.projectsEndpoint || ''}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      dataMapping: { 
                        ...prev.dataMapping!, 
                        projectsEndpoint: e.target.value 
                      }
                    }))}
                    placeholder="/projects"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="resourcesEndpoint">Endpoint Ressources</Label>
                  <Input
                    id="resourcesEndpoint"
                    value={config.dataMapping?.resourcesEndpoint || ''}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      dataMapping: { 
                        ...prev.dataMapping!, 
                        resourcesEndpoint: e.target.value 
                      }
                    }))}
                    placeholder="/resources"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newsEndpoint">Endpoint Actualités</Label>
                  <Input
                    id="newsEndpoint"
                    value={config.dataMapping?.newsEndpoint || ''}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      dataMapping: { 
                        ...prev.dataMapping!, 
                        newsEndpoint: e.target.value 
                      }
                    }))}
                    placeholder="/news"
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handlePreviewData}
                disabled={loadingPreview || !config.endpoint}
              >
                {loadingPreview ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                Aperçu des données
              </Button>

              {previewData && (
                <div className="mt-4 p-4 border rounded">
                  <h4 className="font-medium mb-2">Aperçu des données</h4>
                  <div className="text-sm text-muted-foreground">
                    Total: {previewData.totalRecords} enregistrements
                  </div>
                  <div className="text-sm">
                    Projets: {previewData.projects.length} | 
                    Ressources: {previewData.resources.length} | 
                    Actualités: {previewData.news.length}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="validation" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.validation?.rules?.length > 0}
                  onCheckedChange={(checked) => {
                    if (!checked) {
                      setConfig(prev => ({ 
                        ...prev, 
                        validation: { ...prev.validation!, rules: [] }
                      }));
                    }
                  }}
                />
                <Label>Activer la validation des données</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schema">Schéma JSON (optionnel)</Label>
                <Textarea
                  id="schema"
                  value={JSON.stringify(config.validation?.schema || {}, null, 2)}
                  onChange={(e) => {
                    try {
                      const schema = JSON.parse(e.target.value);
                      setConfig(prev => ({ 
                        ...prev, 
                        validation: { ...prev.validation!, schema }
                      }));
                    } catch {
                      // Ignore invalid JSON
                    }
                  }}
                  placeholder='{"type": "object", "properties": {...}}'
                  rows={6}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.schedule?.enabled}
                  onCheckedChange={(enabled) => setConfig(prev => ({ 
                    ...prev, 
                    schedule: { ...prev.schedule!, enabled }
                  }))}
                />
                <Label>Activer la synchronisation automatique</Label>
              </div>

              {config.schedule?.enabled && (
                <div className="space-y-2">
                  <Label htmlFor="frequency">Fréquence (heures)</Label>
                  <Input
                    id="frequency"
                    type="number"
                    min="1"
                    max="168"
                    value={config.schedule?.frequency}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      schedule: { 
                        ...prev.schedule!, 
                        frequency: parseInt(e.target.value) || 24 
                      }
                    }))}
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.isActive}
                  onCheckedChange={(isActive) => setConfig(prev => ({ ...prev, isActive }))}
                />
                <Label>Connecteur actif</Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}