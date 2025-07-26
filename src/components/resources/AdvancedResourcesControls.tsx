import { ModernButton } from "@/components/ui/modern-button";
import { ModernCard } from "@/components/ui/modern-card";
import { AdvancedSearch } from "@/components/resources/AdvancedSearch";
import ResourceStats from "@/components/resources/ResourceStats";
import DocumentCard from "@/components/resources/DocumentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Download, 
  Grid,
  Settings,
  Zap,
  BarChart3,
  Upload
} from "lucide-react";

interface AdvancedResourcesControlsProps {
  documents: any[];
  results: any;
  loading: boolean;
  searchLoading: boolean;
  activeTab: 'simple' | 'advanced';
  setActiveTab: (tab: 'simple' | 'advanced') => void;
  performSearch: (query: string, filters: any) => void;
  performAdvancedSearch: (query: string, filters: any, page?: number, pageSize?: number) => Promise<void>;
  availableFilters: any;
  onPreview: (doc: any) => void;
  onDownload: (doc: any) => void;
  onOpenUploadDialog: () => void;
}

export const AdvancedResourcesControls = ({
  documents,
  results,
  loading,
  searchLoading,
  activeTab,
  setActiveTab,
  performSearch,
  performAdvancedSearch,
  availableFilters,
  onPreview,
  onDownload,
  onOpenUploadDialog
}: AdvancedResourcesControlsProps) => {
  return (
    <div className="space-y-6">
      {/* Advanced Tools */}
      <ModernCard variant="glass" className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Outils Avancés</h3>
            <p className="text-sm text-muted-foreground">
              Recherche puissante, analytics et gestion de documents
            </p>
          </div>
          <div className="flex gap-2">
            <ModernButton variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Tout
            </ModernButton>
            <ModernButton variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configuration
            </ModernButton>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <ModernButton variant="outline" size="sm" className="justify-start">
            <Zap className="h-4 w-4 mr-2" />
            Recherche IA
          </ModernButton>
          <ModernButton variant="outline" size="sm" className="justify-start">
            <Filter className="h-4 w-4 mr-2" />
            Filtres Avancés
          </ModernButton>
          <ModernButton variant="outline" size="sm" className="justify-start">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </ModernButton>
          <ModernButton 
            variant="outline" 
            size="sm" 
            className="justify-start"
            onClick={onOpenUploadDialog}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Batch
          </ModernButton>
        </div>
      </ModernCard>

      {/* Advanced Search Interface */}
      <ModernCard variant="glass" className="overflow-hidden">
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
          <div className="border-b border-border/30 px-6 pt-6">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/30">
              <TabsTrigger value="simple" className="flex items-center gap-2 data-[state=active]:bg-background">
                <Search className="h-4 w-4" />
                Recherche Simple
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2 data-[state=active]:bg-background">
                <Zap className="h-4 w-4" />
                Recherche Avancée
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="simple" className="p-6 mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Recherche Simple</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Recherche rapide par mots-clés
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Rechercher des documents par titre ou description..."
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    onChange={(e) => performSearch(e.target.value, {})}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="p-6 mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Recherche Avancée</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Filtres complexes et recherche par métadonnées
                </p>
              </div>
              <AdvancedSearch
                onSearch={(params) => performAdvancedSearch('', params || {}, 1, 20)}
                availableTags={availableFilters.tags}
                availableCountries={availableFilters.countries}
                availableDocumentTypes={availableFilters.documentTypes}
              />
            </div>
          </TabsContent>
        </Tabs>
      </ModernCard>

      {/* Statistics Dashboard */}
      <ModernCard variant="glass" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Analytics Avancées</h3>
          <ModernButton variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Rapport Détaillé
          </ModernButton>
        </div>
        <ResourceStats documents={documents} loading={loading} />
      </ModernCard>

      {/* Advanced Documents View */}
      <ModernCard variant="glass" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Documents Détaillés</h3>
            <p className="text-sm text-muted-foreground">
              {activeTab === 'advanced' 
                ? `${results.totalCount} document${results.totalCount > 1 ? 's' : ''} trouvé${results.totalCount > 1 ? 's' : ''}`
                : `${documents.length} document${documents.length > 1 ? 's' : ''} total`
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ModernButton variant="outline" size="sm">
              <Grid className="h-4 w-4 mr-2" />
              Vue grille
            </ModernButton>
            <ModernButton variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export sélection
            </ModernButton>
          </div>
        </div>
        
        {(loading || searchLoading) ? (
          <div className="grid gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <ModernCard className="h-32 bg-muted/30" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {(activeTab === 'advanced' ? results.documents : documents).map((doc: any) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onPreview={onPreview}
                onDownload={onDownload}
              />
            ))}
          </div>
        )}
      </ModernCard>
    </div>
  );
};