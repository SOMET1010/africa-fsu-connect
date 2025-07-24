import React, { useState, useCallback, useMemo, useRef } from "react";
import { useOptimizedDocuments } from "@/hooks/useOptimizedDocuments";
import { SearchProvider, useSearch } from "@/contexts/SearchContext";
import OptimizedSearchBar, { type SearchBarRef } from "@/components/shared/OptimizedSearchBar";
import ResourceStats from "@/components/resources/ResourceStats";
import DocumentCard from "@/components/resources/DocumentCard";
import DocumentUploadDialog from "@/pages/resources/components/DocumentUploadDialog";
import DocumentPreviewDialog from "@/pages/resources/components/DocumentPreviewDialog";
import EmptyDocumentsState from "@/pages/resources/components/EmptyDocumentsState";
import SampleDataButton from "@/components/resources/SampleDataButton";
import { HeroSection } from "@/components/ui/hero-section";
import { ModernCard } from "@/components/ui/modern-card";
import { ModernButton } from "@/components/ui/modern-button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Upload, 
  Download, 
  Search, 
  Filter,
  Database,
  Plus,
  BarChart3
} from "lucide-react";

const ResourcesContent = () => {
  const { state, performSearch, fetchInitialDocuments } = useSearch();
  const { uploadDocument, downloadDocument } = useOptimizedDocuments();
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const searchBarRef = useRef<SearchBarRef>(null);
  const [previewDoc, setPreviewDoc] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const searchFilters = useMemo(() => [
    {
      id: "document_type",
      label: "Type de Document",
      options: [
        { value: "guide", label: "Guide" },
        { value: "rapport", label: "Rapport" },
        { value: "presentation", label: "Présentation" },
        { value: "formulaire", label: "Formulaire" },
        { value: "autre", label: "Autre" }
      ]
    },
    {
      id: "country",
      label: "Pays",
      options: [
        { value: "ci", label: "Côte d'Ivoire" },
        { value: "sn", label: "Sénégal" },
        { value: "za", label: "Afrique du Sud" },
        { value: "ng", label: "Nigéria" },
        { value: "gh", label: "Ghana" },
        { value: "ke", label: "Kenya" },
        { value: "tz", label: "Tanzanie" },
        { value: "ug", label: "Ouganda" }
      ]
    }
  ], []);

  React.useEffect(() => {
    fetchInitialDocuments();
  }, [fetchInitialDocuments]);

  const handleFileUpload = useCallback(async (files: File[], metadata: any) => {
    if (!metadata.title.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez renseigner le titre du document",
        variant: "destructive"
      });
      return;
    }

    try {
      for (const file of files) {
        await uploadDocument(file, metadata);
      }
      const params = searchBarRef.current?.getSearchParams();
      if (params) {
        performSearch(params.query, params.filters);
      }
    } catch (error) {
      // Error handled in hook
    }
  }, [uploadDocument, performSearch, toast]);

  const handlePreview = useCallback((doc: any) => {
    setPreviewDoc(doc);
    setIsPreviewOpen(true);
  }, []);

  const handleDownload = useCallback((doc: any) => {
    downloadDocument(doc);
  }, [downloadDocument]);

  const handleShowAllDocuments = useCallback(() => {
    searchBarRef.current?.reset();
    performSearch('', {});
  }, [performSearch]);

  const handleOpenUploadDialog = useCallback(() => {
    setIsUploadDialogOpen(true);
  }, []);

  const handleAnalytics = useCallback(() => {
    // Scroll to the ResourceStats section
    setTimeout(() => {
      const element = document.querySelector('[data-analytics-section]');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Hero Section */}
        <ScrollReveal direction="fade">
          <HeroSection
            title="Centre de Ressources FSU"
            subtitle="Documentation Collaborative"
            description="Accédez à une bibliothèque complète de documents, guides, rapports et ressources pour le service universel des télécommunications. Partagez vos connaissances et explorez les meilleures pratiques."
            actions={[
              {
                label: "Ajouter Document",
                onClick: handleOpenUploadDialog,
                icon: <Upload className="h-5 w-5" />,
                variant: "default"
              },
              {
                label: "Analytics",
                onClick: handleAnalytics,
                icon: <BarChart3 className="h-5 w-5" />,
                variant: "outline"
              }
            ]}
          >
            {state.documents.length === 0 && !state.loading && (
              <div className="mt-6">
                <SampleDataButton onDataAdded={fetchInitialDocuments} />
              </div>
            )}
          </HeroSection>
        </ScrollReveal>

        {/* Resource Stats */}
        <ScrollReveal delay={200}>
          <div data-analytics-section>
            <ResourceStats documents={state.documents} loading={state.loading} />
          </div>
        </ScrollReveal>

        {/* Search and Upload Section */}
        <ScrollReveal delay={400}>
          <ModernCard variant="glass" className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Search className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Recherche et Filtres</h3>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
              <div className="flex-1">
                <OptimizedSearchBar
                  ref={searchBarRef}
                  placeholder="Rechercher des documents par titre ou description..."
                  onSearch={performSearch}
                  filters={searchFilters}
                  showFilters={true}
                  initialQuery={state.query}
                  initialFilters={state.filters}
                />
              </div>
              <DocumentUploadDialog 
                onUpload={handleFileUpload} 
                isOpen={isUploadDialogOpen}
                onClose={() => setIsUploadDialogOpen(false)}
              />
            </div>
          </ModernCard>
        </ScrollReveal>

        {/* Documents Section */}
        <ScrollReveal delay={600}>
          <div className="space-y-6">
            {state.loading ? (
              <div className="grid gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <ModernCard className="h-64 bg-muted/30" />
                  </div>
                ))}
              </div>
            ) : state.documents.length === 0 ? (
              <EmptyDocumentsState onShowAll={handleShowAllDocuments} />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Documents Disponibles</h2>
                    <p className="text-muted-foreground">
                      {state.documents.length} document{state.documents.length > 1 ? 's' : ''} trouvé{state.documents.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <ModernButton variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger tout
                  </ModernButton>
                </div>
                
                <div className="grid gap-6">
                  {state.documents.map((doc, index) => (
                    <ScrollReveal key={doc.id} delay={100 * (index % 6)} direction="up">
                      <DocumentCard
                        document={doc}
                        onPreview={handlePreview}
                        onDownload={handleDownload}
                      />
                    </ScrollReveal>
                  ))}
                </div>
              </>
            )}
          </div>
        </ScrollReveal>

        {/* Document Preview Dialog */}
        <DocumentPreviewDialog
          document={previewDoc}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
};

const Resources = () => {
  return (
    <SearchProvider>
      <ResourcesContent />
    </SearchProvider>
  );
};

export default Resources;
