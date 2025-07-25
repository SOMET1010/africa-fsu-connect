import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useBidirectionalSync } from '@/hooks/useBidirectionalSync';
import type { BidirectionalSyncConfig as SyncConfig } from '@/services/bidirectionalSyncService';
import { RefreshCw, Settings, ArrowLeftRight, AlertTriangle, CheckCircle } from 'lucide-react';

interface SyncConfigProps {
  agencyId: string;
  connectorId: string;
  onConfigSaved?: () => void;
}

export const BidirectionalSyncConfig: React.FC<SyncConfigProps> = ({
  agencyId,
  connectorId,
  onConfigSaved
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<SyncConfig>({
    agencyId,
    connectorId,
    sourceEndpoint: '',
    targetEndpoint: '',
    bidirectionalMappings: {
      sourceToTarget: {},
      targetToSource: {}
    },
    conflictResolution: 'last_write_wins',
    syncDirection: 'bidirectional'
  });
  const [fieldMappings, setFieldMappings] = useState<{source: string, target: string}[]>([
    { source: '', target: '' }
  ]);

  const { startSync, syncInProgress, activeSessions } = useBidirectionalSync(agencyId);

  const handleSaveConfig = async () => {
    try {
      // Build field mappings
      const sourceToTarget: Record<string, string> = {};
      const targetToSource: Record<string, string> = {};
      
      fieldMappings.forEach(mapping => {
        if (mapping.source && mapping.target) {
          sourceToTarget[mapping.source] = mapping.target;
          targetToSource[mapping.target] = mapping.source;
        }
      });

      const finalConfig: SyncConfig = {
        ...config,
        bidirectionalMappings: {
          sourceToTarget,
          targetToSource
        }
      };

      const result = await startSync(finalConfig);
      
      if (result.success) {
        setIsOpen(false);
        onConfigSaved?.();
      }
    } catch (error) {
      console.error('Error saving bidirectional sync config:', error);
    }
  };

  const addFieldMapping = () => {
    setFieldMappings([...fieldMappings, { source: '', target: '' }]);
  };

  const removeFieldMapping = (index: number) => {
    setFieldMappings(fieldMappings.filter((_, i) => i !== index));
  };

  const updateFieldMapping = (index: number, field: 'source' | 'target', value: string) => {
    const updated = [...fieldMappings];
    updated[index][field] = value;
    setFieldMappings(updated);
  };

  const activeSyncSession = activeSessions.find(session => 
    session.connector_id === connectorId && session.status === 'active'
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowLeftRight className="h-4 w-4" />
          Sync Bidirectionnel
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Configuration Synchronisation Bidirectionnelle
        </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Statut de Synchronisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {activeSyncSession ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Session active</span>
                      <Badge variant="secondary">
                        {activeSyncSession.records_processed} enregistrements traités
                      </Badge>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">Aucune session active</span>
                    </>
                  )}
                </div>
                {syncInProgress && (
                  <Badge variant="default" className="animate-pulse">
                    Synchronisation en cours...
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="endpoints" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="endpoints">Points de terminaison</TabsTrigger>
              <TabsTrigger value="mappings">Mappings</TabsTrigger>
              <TabsTrigger value="conflicts">Conflits</TabsTrigger>
              <TabsTrigger value="advanced">Avancé</TabsTrigger>
            </TabsList>

            <TabsContent value="endpoints" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configuration des Endpoints</CardTitle>
                  <CardDescription>
                    Configurez les endpoints source et destination pour la synchronisation bidirectionnelle
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sourceEndpoint">Endpoint Source</Label>
                      <Input
                        id="sourceEndpoint"
                        placeholder="https://api.source.com/data"
                        value={config.sourceEndpoint}
                        onChange={(e) => setConfig({
                          ...config,
                          sourceEndpoint: e.target.value
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="targetEndpoint">Endpoint Destination</Label>
                      <Input
                        id="targetEndpoint"
                        placeholder="https://api.target.com/data"
                        value={config.targetEndpoint}
                        onChange={(e) => setConfig({
                          ...config,
                          targetEndpoint: e.target.value
                        })}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Direction de Synchronisation</Label>
                    <Select
                      value={config.syncDirection}
                      onValueChange={(value: any) => setConfig({
                        ...config,
                        syncDirection: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bidirectional">Bidirectionnel</SelectItem>
                        <SelectItem value="source_to_target">Source vers Destination</SelectItem>
                        <SelectItem value="target_to_source">Destination vers Source</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mappings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mapping des Champs</CardTitle>
                  <CardDescription>
                    Définissez comment les champs sont mappés entre la source et la destination
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fieldMappings.map((mapping, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="Champ source"
                        value={mapping.source}
                        onChange={(e) => updateFieldMapping(index, 'source', e.target.value)}
                        className="flex-1"
                      />
                      <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Champ destination"
                        value={mapping.target}
                        onChange={(e) => updateFieldMapping(index, 'target', e.target.value)}
                        className="flex-1"
                      />
                      {fieldMappings.length > 1 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeFieldMapping(index)}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    onClick={addFieldMapping}
                    className="w-full"
                  >
                    Ajouter un Mapping
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="conflicts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Résolution de Conflits</CardTitle>
                  <CardDescription>
                    Configurez comment les conflits de données sont résolus
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Stratégie de Résolution</Label>
                    <Select
                      value={config.conflictResolution}
                      onValueChange={(value: any) => setConfig({
                        ...config,
                        conflictResolution: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last_write_wins">Dernière écriture gagne</SelectItem>
                        <SelectItem value="merge">Fusion intelligente</SelectItem>
                        <SelectItem value="manual">Résolution manuelle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Stratégies expliquées :</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li><strong>Dernière écriture gagne :</strong> Utilise les données les plus récentes</li>
                      <li><strong>Fusion intelligente :</strong> Combine les données non-conflictuelles</li>
                      <li><strong>Résolution manuelle :</strong> Nécessite une intervention utilisateur</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Options Avancées</CardTitle>
                  <CardDescription>
                    Configuration avancée pour la synchronisation bidirectionnelle
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableRealtime">Synchronisation temps réel</Label>
                    <Switch id="enableRealtime" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableConflictDetection">Détection automatique des conflits</Label>
                    <Switch id="enableConflictDetection" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableVersioning">Versioning des données</Label>
                    <Switch id="enableVersioning" defaultChecked />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Fréquence de synchronisation (secondes)</Label>
                    <Input 
                      type="number" 
                      placeholder="60" 
                      min="10" 
                      max="3600"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleSaveConfig}
              disabled={syncInProgress || !config.sourceEndpoint || !config.targetEndpoint}
              className="gap-2"
            >
              {syncInProgress ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Synchronisation...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Démarrer la Synchronisation
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};