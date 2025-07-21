
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { EnrichmentService } from "@/services/enrichmentService";
import { FirecrawlService } from "@/services/firecrawlService";
import { 
  Sparkles, 
  RefreshCw, 
  Settings, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Database
} from "lucide-react";

interface AutoEnrichmentPanelProps {
  agencies: any[];
  onRefresh: () => void;
}

export function AutoEnrichmentPanel({ agencies, onRefresh }: AutoEnrichmentPanelProps) {
  const { toast } = useToast();
  const [enriching, setEnriching] = useState(false);
  const [autoEnrichment, setAutoEnrichment] = useState(true);
  const [syncInterval, setSyncInterval] = useState(24);
  const [enrichmentProgress, setEnrichmentProgress] = useState(0);
  const [currentAgency, setCurrentAgency] = useState<string>('');

  const handleEnrichAll = async () => {
    if (agencies.length === 0) return;

    setEnriching(true);
    setEnrichmentProgress(0);

    try {
      const totalAgencies = agencies.length;
      let processed = 0;

      for (const agency of agencies) {
        setCurrentAgency(agency.name);
        
        // Activer la synchronisation automatique
        await EnrichmentService.scheduleAutoSync(agency.id, syncInterval);
        
        // Lancer l'enrichissement
        const result = await EnrichmentService.enrichAgencyData(agency.id);
        
        if (result.success) {
          console.log(`✅ Enrichissement réussi pour ${agency.name}`);
        } else {
          console.warn(`⚠️ Erreur pour ${agency.name}: ${result.error}`);
        }

        processed++;
        setEnrichmentProgress((processed / totalAgencies) * 100);
        
        // Petite pause entre les agences
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      toast({
        title: "Enrichissement terminé",
        description: `${processed} agences ont été traitées avec succès`,
      });

      onRefresh();
    } catch (error) {
      toast({
        title: "Erreur d'enrichissement",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setEnriching(false);
      setCurrentAgency('');
      setEnrichmentProgress(0);
    }
  };

  const handleSingleEnrich = async (agency: any) => {
    try {
      const result = await EnrichmentService.enrichAgencyData(agency.id);
      
      if (result.success) {
        toast({
          title: "Enrichissement réussi",
          description: `Les données de ${agency.name} ont été enrichies`,
        });
        onRefresh();
      } else {
        toast({
          title: "Erreur d'enrichissement",
          description: result.error || "Une erreur est survenue",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enrichir les données",
        variant: "destructive",
      });
    }
  };

  const getPendingCount = () => {
    return agencies.filter(agency => agency.sync_status === 'pending').length;
  };

  const getSyncedCount = () => {
    return agencies.filter(agency => agency.sync_status === 'synced').length;
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Configuration d'Enrichissement Automatique
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="auto-enrichment" 
                checked={autoEnrichment}
                onCheckedChange={setAutoEnrichment}
              />
              <Label htmlFor="auto-enrichment">Enrichissement automatique</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Label htmlFor="sync-interval">Intervalle (heures)</Label>
              <Input
                id="sync-interval"
                type="number"
                min="1"
                max="168"
                value={syncInterval}
                onChange={(e) => setSyncInterval(parseInt(e.target.value) || 24)}
                className="w-20"
              />
            </div>

            <Button 
              onClick={handleEnrichAll}
              disabled={enriching || agencies.length === 0}
              className="flex items-center gap-2"
            >
              {enriching ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              {enriching ? 'Enrichissement...' : 'Enrichir Tout'}
            </Button>
          </div>

          {enriching && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Traitement: {currentAgency}</span>
                <span>{Math.round(enrichmentProgress)}%</span>
              </div>
              <Progress value={enrichmentProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            État des Données
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{getSyncedCount()}</div>
              <div className="text-sm text-muted-foreground">Données collectées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{getPendingCount()}</div>
              <div className="text-sm text-muted-foreground">En attente</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{agencies.length}</div>
              <div className="text-sm text-muted-foreground">Total SUTEL</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Agency Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Individuelles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {agencies.map((agency) => (
              <div key={agency.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {agency.sync_status === 'synced' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : agency.sync_status === 'pending' ? (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="font-medium">{agency.name}</span>
                  </div>
                  <Badge variant={agency.sync_status === 'synced' ? 'default' : 'secondary'}>
                    {agency.sync_status === 'synced' ? 'Synchronisé' : 
                     agency.sync_status === 'pending' ? 'En attente' : 'Erreur'}
                  </Badge>
                </div>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleSingleEnrich(agency)}
                  disabled={enriching}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Enrichir
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
