import { ModernButton } from "@/components/ui/modern-button";
import { ModernCard } from "@/components/ui/modern-card";
import { IndicatorsEnrichmentPanel } from "@/components/indicators/IndicatorsEnrichmentPanel";
import { InternationalStandardsPanel } from "@/components/indicators/InternationalStandardsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  Download, 
  Filter, 
  Settings, 
  Globe, 
  BarChart3,
  Calendar,
  RefreshCw
} from "lucide-react";

export const AdvancedIndicatorsControls = () => {
  return (
    <div className="space-y-6">
      {/* Advanced Actions */}
      <ModernCard variant="glass" className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Outils Avancés</h3>
            <p className="text-sm text-muted-foreground">
              Enrichissement, export et analyse approfondie
            </p>
          </div>
          <div className="flex gap-2">
            <ModernButton variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </ModernButton>
            <ModernButton variant="default" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Complet
            </ModernButton>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <ModernButton variant="outline" size="sm" className="justify-start">
            <Filter className="h-4 w-4 mr-2" />
            Filtres Avancés
          </ModernButton>
          <ModernButton variant="outline" size="sm" className="justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Historique
          </ModernButton>
          <ModernButton variant="outline" size="sm" className="justify-start">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </ModernButton>
          <ModernButton variant="outline" size="sm" className="justify-start">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </ModernButton>
        </div>
      </ModernCard>

      {/* Advanced Tools Tabs */}
      <ModernCard variant="glass" className="overflow-hidden">
        <Tabs defaultValue="enrichment" className="w-full">
          <div className="border-b border-border/30 px-6 pt-6">
            <TabsList className="grid w-full max-w-lg grid-cols-3 bg-muted/30">
              <TabsTrigger value="enrichment" className="flex items-center gap-2 data-[state=active]:bg-background">
                <Database className="h-4 w-4" />
                Enrichissement
              </TabsTrigger>
              <TabsTrigger value="standards" className="flex items-center gap-2 data-[state=active]:bg-background">
                <Globe className="h-4 w-4" />
                Standards
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2 data-[state=active]:bg-background">
                <BarChart3 className="h-4 w-4" />
                Analyse
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="enrichment" className="p-6 mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Enrichissement des Données</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complétez automatiquement les indicateurs avec des sources externes
                </p>
              </div>
              <IndicatorsEnrichmentPanel />
            </div>
          </TabsContent>
          
          <TabsContent value="standards" className="p-6 mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Standards Internationaux</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Alignement avec les standards UIT, GSMA et Banque Mondiale
                </p>
              </div>
              <InternationalStandardsPanel />
            </div>
          </TabsContent>
          
          <TabsContent value="analysis" className="p-6 mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Analyse Avancée</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tendances, comparaisons et projections
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ModernCard className="p-4">
                  <h4 className="font-medium text-foreground mb-2">Analyse Temporelle</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Évolution des indicateurs dans le temps
                  </p>
                  <ModernButton variant="outline" size="sm" className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Générer Rapport
                  </ModernButton>
                </ModernCard>
                
                <ModernCard className="p-4">
                  <h4 className="font-medium text-foreground mb-2">Comparaison Régionale</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Benchmarking entre pays et régions
                  </p>
                  <ModernButton variant="outline" size="sm" className="w-full">
                    <Globe className="h-4 w-4 mr-2" />
                    Comparer
                  </ModernButton>
                </ModernCard>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </ModernCard>
    </div>
  );
};