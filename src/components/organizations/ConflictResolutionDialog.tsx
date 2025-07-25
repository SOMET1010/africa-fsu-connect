import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useConflictResolution } from '@/hooks/useConflictResolution';
import type { ConflictData, ConflictResolutionStrategy } from '@/services/conflictResolutionService';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Merge, 
  RefreshCw,
  ArrowRight,
  ThumbsUp,
  Settings
} from 'lucide-react';

interface ConflictResolutionDialogProps {
  agencyId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ConflictResolutionDialog: React.FC<ConflictResolutionDialogProps> = ({
  agencyId,
  isOpen,
  onClose
}) => {
  const [selectedConflict, setSelectedConflict] = useState<ConflictData | null>(null);
  const [resolutionStrategy, setResolutionStrategy] = useState<ConflictResolutionStrategy>({
    type: 'last_write_wins'
  });
  const [resolvedData, setResolvedData] = useState<any>({});

  const {
    conflicts,
    isLoading,
    resolutionStats,
    resolveConflict,
    autoResolveConflicts,
    refreshConflicts
  } = useConflictResolution(agencyId);

  useEffect(() => {
    if (isOpen) {
      refreshConflicts();
    }
  }, [isOpen, refreshConflicts]);

  useEffect(() => {
    if (selectedConflict) {
      // Initialize resolved data with recommended values
      const initialData = { ...selectedConflict.targetData };
      selectedConflict.suggestions.forEach(suggestion => {
        if (suggestion.confidence > 0.7) {
          initialData[suggestion.field] = suggestion.recommendedValue;
        }
      });
      setResolvedData(initialData);
    }
  }, [selectedConflict]);

  const handleResolveConflict = async () => {
    if (!selectedConflict) return;

    const success = await resolveConflict(selectedConflict.id, resolvedData, resolutionStrategy);
    if (success) {
      setSelectedConflict(null);
      setResolvedData({});
    }
  };

  const handleAutoResolve = async () => {
    await autoResolveConflicts(resolutionStrategy);
  };

  const handleFieldValueChange = (field: string, value: any, source: 'source' | 'target' | 'custom') => {
    setResolvedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getSeverityColor = (conflictType: string) => {
    switch (conflictType) {
      case 'timestamp_conflict':
        return 'text-amber-600';
      case 'data_mismatch':
        return 'text-red-600';
      case 'schema_conflict':
        return 'text-purple-600';
      default:
        return 'text-blue-600';
    }
  };

  const getSeverityIcon = (conflictType: string) => {
    switch (conflictType) {
      case 'timestamp_conflict':
        return <Clock className="h-4 w-4" />;
      case 'data_mismatch':
        return <AlertTriangle className="h-4 w-4" />;
      case 'schema_conflict':
        return <Settings className="h-4 w-4" />;
      default:
        return <Merge className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Résolution de Conflits de Synchronisation
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-12 gap-4 h-[70vh]">
          {/* Sidebar with conflict list */}
          <div className="col-span-4 border-r pr-4">
            <div className="space-y-4">
              {/* Stats overview */}
              <Card>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-red-600">{resolutionStats.pending}</div>
                      <div className="text-xs text-muted-foreground">En attente</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{resolutionStats.resolved}</div>
                      <div className="text-xs text-muted-foreground">Résolus</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Auto-resolve section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Résolution Automatique</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Select
                    value={resolutionStrategy.type}
                    onValueChange={(value: any) => setResolutionStrategy({ type: value })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last_write_wins">Dernière écriture</SelectItem>
                      <SelectItem value="merge">Fusion intelligente</SelectItem>
                      <SelectItem value="manual">Manuel uniquement</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    onClick={handleAutoResolve}
                    disabled={isLoading || conflicts.length === 0}
                    size="sm"
                    className="w-full gap-2"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Résolution Auto
                  </Button>
                </CardContent>
              </Card>

              {/* Conflicts list */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Conflits Détectés</Label>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {conflicts.map((conflict) => (
                      <Card 
                        key={conflict.id}
                        className={`cursor-pointer transition-colors ${
                          selectedConflict?.id === conflict.id 
                            ? 'ring-2 ring-primary bg-primary/5' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedConflict(conflict)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={getSeverityColor(conflict.conflictType)}>
                                  {getSeverityIcon(conflict.conflictType)}
                                </span>
                                <span className="text-xs font-medium">
                                  {conflict.tableName}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                ID: {conflict.recordId.slice(0, 8)}...
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {conflict.suggestions.length} champs
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {conflicts.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Aucun conflit détecté</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="col-span-8">
            {selectedConflict ? (
              <div className="space-y-4 h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Conflit: {selectedConflict.tableName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Record ID: {selectedConflict.recordId}
                    </p>
                  </div>
                  <Badge variant="outline" className={getSeverityColor(selectedConflict.conflictType)}>
                    {selectedConflict.conflictType}
                  </Badge>
                </div>

                <Tabs defaultValue="fields" className="flex-1">
                  <TabsList>
                    <TabsTrigger value="fields">Champs en Conflit</TabsTrigger>
                    <TabsTrigger value="preview">Aperçu de la Résolution</TabsTrigger>
                    <TabsTrigger value="raw">Données Brutes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="fields" className="space-y-4">
                    <ScrollArea className="h-96">
                      <div className="space-y-4">
                        {selectedConflict.suggestions.map((suggestion, index) => (
                          <Card key={index}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-sm">{suggestion.field}</CardTitle>
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant={suggestion.confidence > 0.7 ? "default" : "secondary"}
                                    className="text-xs"
                                  >
                                    {Math.round(suggestion.confidence * 100)}% confiance
                                  </Badge>
                                  {suggestion.confidence > 0.7 && (
                                    <ThumbsUp className="h-3 w-3 text-green-600" />
                                  )}
                                </div>
                              </div>
                              <CardDescription className="text-xs">
                                {suggestion.reason}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <Button
                                  variant={resolvedData[suggestion.field] === suggestion.sourceValue ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleFieldValueChange(suggestion.field, suggestion.sourceValue, 'source')}
                                  className="h-auto p-2 flex flex-col"
                                >
                                  <span className="font-medium mb-1">Source</span>
                                  <span className="truncate w-full">
                                    {JSON.stringify(suggestion.sourceValue)}
                                  </span>
                                </Button>
                                
                                <Button
                                  variant={resolvedData[suggestion.field] === suggestion.targetValue ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleFieldValueChange(suggestion.field, suggestion.targetValue, 'target')}
                                  className="h-auto p-2 flex flex-col"
                                >
                                  <span className="font-medium mb-1">Cible</span>
                                  <span className="truncate w-full">
                                    {JSON.stringify(suggestion.targetValue)}
                                  </span>
                                </Button>
                                
                                <Button
                                  variant={resolvedData[suggestion.field] === suggestion.recommendedValue ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleFieldValueChange(suggestion.field, suggestion.recommendedValue, 'custom')}
                                  className="h-auto p-2 flex flex-col"
                                >
                                  <span className="font-medium mb-1">Recommandé</span>
                                  <span className="truncate w-full">
                                    {JSON.stringify(suggestion.recommendedValue)}
                                  </span>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="preview" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Données Résolues (Aperçu)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-80">
                          <pre className="text-xs bg-muted p-3 rounded">
                            {JSON.stringify(resolvedData, null, 2)}
                          </pre>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="raw" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Données Source</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-72">
                            <pre className="text-xs bg-muted p-3 rounded">
                              {JSON.stringify(selectedConflict.sourceData, null, 2)}
                            </pre>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Données Cible</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-72">
                            <pre className="text-xs bg-muted p-3 rounded">
                              {JSON.stringify(selectedConflict.targetData, null, 2)}
                            </pre>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setSelectedConflict(null)}>
                    Retour
                  </Button>
                  <Button onClick={handleResolveConflict} className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Résoudre le Conflit
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez un conflit à résoudre</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};