import React, { useState, useCallback, useMemo, useRef } from "react";
import { useOptimizedDocuments } from "@/hooks/useOptimizedDocuments";
import { useEnhancedSearch } from "@/hooks/useEnhancedSearch";
import { SearchProvider, useSearch } from "@/contexts/SearchContext";
import { AdaptiveInterface } from "@/components/layout/AdaptiveInterface";
import { SimplifiedResources } from "@/components/resources/SimplifiedResources";
import { AdvancedResourcesControls } from "@/components/resources/AdvancedResourcesControls";
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
      // Refresh search results after upload
      performSearch('', {});
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

        {/* Adaptive Interface */}
        <AdaptiveInterface
          title="Gestion des Ressources"
          description="Interface adaptée à votre niveau d'expertise"
          advancedContent={
            <AdvancedResourcesControls
              documents={state.documents}
              results={results}
              loading={state.loading}
              searchLoading={searchLoading}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              performSearch={performSearch}
              performAdvancedSearch={performAdvancedSearch}
              availableFilters={availableFilters}
              onPreview={handlePreview}
              onDownload={handleDownload}
              onOpenUploadDialog={handleOpenUploadDialog}
            />
          }
        >
          <SimplifiedResources
            documents={state.documents}
            loading={state.loading}
            onOpenUploadDialog={handleOpenUploadDialog}
            onAnalytics={handleAnalytics}
            onPreview={handlePreview}
            onDownload={handleDownload}
            fetchInitialDocuments={fetchInitialDocuments}
          />
        </AdaptiveInterface>

        {/* Document Preview Dialog */}
        <DocumentPreviewDialog
          document={previewDoc}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onDownload={handleDownload}
        />

        {/* Document Upload Dialog */}
        <DocumentUploadDialog 
          onUpload={handleFileUpload} 
          isOpen={isUploadDialogOpen}
          onClose={() => setIsUploadDialogOpen(false)}
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
