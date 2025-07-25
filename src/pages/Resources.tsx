import React, { useState, useCallback, useMemo, useRef } from "react";
import { useOptimizedDocuments } from "@/hooks/useOptimizedDocuments";
import { useEnhancedSearch } from "@/hooks/useEnhancedSearch";
import { SearchProvider, useSearch } from "@/contexts/SearchContext";
import { AdvancedSearch } from "@/components/resources/AdvancedSearch";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  BarChart3,
  Zap,
  Grid
} from "lucide-react";

const ResourcesContent = () => {
  const { state, performSearch, fetchInitialDocuments } = useSearch();
  const { uploadDocument, downloadDocument } = useOptimizedDocuments();
  const { results, loading: searchLoading, performAdvancedSearch, availableFilters } = useEnhancedSearch();
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'simple' | 'advanced'>('simple');
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
            title={t('resources.title')}
            subtitle={t('resources.subtitle')}
            description={t('resources.description')}
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

        {/* Enhanced Search Section */}
        <ScrollReveal delay={400}>
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="simple" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Recherche Simple
                </TabsTrigger>
                <TabsTrigger value="advanced" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Recherche Avancée
                </TabsTrigger>
              </TabsList>
              <DocumentUploadDialog 
                onUpload={handleFileUpload} 
                isOpen={isUploadDialogOpen}
                onClose={() => setIsUploadDialogOpen(false)}
              />
            </div>

            <TabsContent value="simple">
              <ModernCard variant="glass" className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Search className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Recherche Simple</h3>
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
                </div>
              </ModernCard>
            </TabsContent>

            <TabsContent value="advanced">
              <AdvancedSearch
                onSearch={performAdvancedSearch}
                availableTags={availableFilters.tags}
                availableCountries={availableFilters.countries}
                availableDocumentTypes={availableFilters.documentTypes}
              />
            </TabsContent>
          </Tabs>
        </ScrollReveal>

        {/* Documents Section */}
        <ScrollReveal delay={600}>
          <div className="space-y-6">
            {(state.loading || searchLoading) ? (
              <div className="grid gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <ModernCard className="h-64 bg-muted/30" />
                  </div>
                ))}
              </div>
            ) : (activeTab === 'advanced' ? results.documents.length === 0 : state.documents.length === 0) ? (
              <EmptyDocumentsState onShowAll={handleShowAllDocuments} />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Documents Disponibles</h2>
                    <p className="text-muted-foreground">
                      {activeTab === 'advanced' 
                        ? `${results.totalCount} document${results.totalCount > 1 ? 's' : ''} trouvé${results.totalCount > 1 ? 's' : ''}`
                        : `${state.documents.length} document${state.documents.length > 1 ? 's' : ''} trouvé${state.documents.length > 1 ? 's' : ''}`
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
                      Télécharger tout
                    </ModernButton>
                  </div>
                </div>
                
                <div className="grid gap-6">
                  {(activeTab === 'advanced' ? results.documents : state.documents).map((doc, index) => (
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
