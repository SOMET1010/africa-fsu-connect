import { ModernStatsCard } from "@/components/ui/modern-stats-card";
import { ModernCard } from "@/components/ui/modern-card";
import { ModernButton } from "@/components/ui/modern-button";
import { Badge } from "@/components/ui/badge";
import DocumentCard from "@/components/resources/DocumentCard";
import SampleDataButton from "@/components/resources/SampleDataButton";
import { 
  FileText, 
  Upload, 
  Search, 
  Download,
  Plus,
  BarChart3
} from "lucide-react";

interface SimplifiedResourcesProps {
  documents: any[];
  loading: boolean;
  onOpenUploadDialog: () => void;
  onAnalytics: () => void;
  onPreview: (doc: any) => void;
  onDownload: (doc: any) => void;
  fetchInitialDocuments: () => void;
}

export const SimplifiedResources = ({
  documents,
  loading,
  onOpenUploadDialog,
  onAnalytics,
  onPreview,
  onDownload,
  fetchInitialDocuments
}: SimplifiedResourcesProps) => {
  const basicStats = [
    {
      title: "Documents",
      value: documents.length,
      icon: FileText,
      trend: { value: 5, label: "Nouveaux", positive: true },
      description: "Total disponible"
    },
    {
      title: "Types",
      value: new Set(documents.map(d => d.document_type)).size,
      icon: Upload,
      trend: { value: 3, label: "Variété", positive: true },
      description: "Catégories actives"
    }
  ];

  if (loading) {
    return (
      <div className="grid gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <ModernCard className="h-64 bg-muted/30" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {basicStats.map((stat, index) => (
          <ModernStatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            description={stat.description}
            variant="gradient"
            size="md"
          />
        ))}
      </div>

      {/* Quick Actions */}
      <ModernCard variant="glass" className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Actions Rapides</h3>
            <p className="text-sm text-muted-foreground">
              Ajouter, rechercher et analyser vos documents
            </p>
          </div>
          <div className="flex gap-2">
            <ModernButton variant="default" size="sm" onClick={onOpenUploadDialog}>
              <Upload className="h-4 w-4 mr-2" />
              Ajouter
            </ModernButton>
            <ModernButton variant="outline" size="sm" onClick={onAnalytics}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </ModernButton>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs">
            <FileText className="h-3 w-3 mr-1" />
            {documents.length} Documents
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <Download className="h-3 w-3 mr-1" />
            Téléchargement direct
          </Badge>
        </div>
      </ModernCard>

      {/* Simple Search */}
      <ModernCard variant="glass" className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Search className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Recherche Simple</h3>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher des documents..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background/50"
          />
        </div>
      </ModernCard>

      {/* Documents List - Simplified */}
      <ModernCard variant="glass" className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Documents Récents</h3>
          <Badge variant="secondary" className="text-xs">
            Vue simplifiée
          </Badge>
        </div>
        
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun document</h3>
            <p className="text-muted-foreground mb-4">
              Commencez par ajouter des documents ou chargez des exemples
            </p>
            <div className="flex gap-2 justify-center">
              <ModernButton onClick={onOpenUploadDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Document
              </ModernButton>
              <SampleDataButton onDataAdded={fetchInitialDocuments} />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.slice(0, 5).map((doc) => (
              <div key={doc.id} className="scale-95">
                <DocumentCard
                  document={doc}
                  onPreview={onPreview}
                  onDownload={onDownload}
                />
              </div>
            ))}
            
            {documents.length > 5 && (
              <div className="text-center pt-4 border-t border-border/30">
                <p className="text-sm text-muted-foreground">
                  {documents.length - 5} autres documents disponibles en mode avancé
                </p>
              </div>
            )}
          </div>
        )}
      </ModernCard>
    </div>
  );
};