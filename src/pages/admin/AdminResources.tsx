import React, { useState, useCallback } from "react";
import { useOptimizedDocuments } from "@/hooks/useOptimizedDocuments";
import { useEnhancedSearch } from "@/hooks/useEnhancedSearch";
import { SearchProvider, useSearch } from "@/contexts/SearchContext";
import { AdvancedResourcesControls } from "@/components/resources/AdvancedResourcesControls";
import ResourceStats from "@/components/resources/ResourceStats";
import DocumentCard from "@/components/resources/DocumentCard";
import DocumentUploadDialog from "@/pages/resources/components/DocumentUploadDialog";
import DocumentPreviewDialog from "@/pages/resources/components/DocumentPreviewDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { Shield, BarChart3, FileText, Settings, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Admin Resources Page - NEXUS Layer 3 (Administration)
 * 
 * Contains all the admin tools moved from /resources:
 * - ResourceStats (KPIs)
 * - AdvancedResourcesControls
 * - Document management
 * - Analytics
 */
const AdminResourcesContent = () => {
  const { state, performSearch, fetchInitialDocuments } = useSearch();
  const { uploadDocument, downloadDocument } = useOptimizedDocuments();
  const { results, loading: searchLoading, performAdvancedSearch, availableFilters } = useEnhancedSearch();
  const { toast } = useToast();
  const { currentLanguage } = useTranslation();
  
  const [activeTab, setActiveTab] = useState<'simple' | 'advanced'>('simple');
  const [previewDoc, setPreviewDoc] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

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
      performSearch('', {});
    } catch {
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

  const handleOpenUploadDialog = useCallback(() => {
    setIsUploadDialogOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/resources">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {currentLanguage === 'en' ? 'Back to Library' : 'Retour à la Bibliothèque'}
              </Button>
            </Link>
          </div>
        </div>

        {/* Page title */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {currentLanguage === 'en' ? 'Resources Administration' : 'Administration des Ressources'}
            </h1>
            <p className="text-muted-foreground">
              {currentLanguage === 'en' 
                ? 'Analytics, management and advanced tools' 
                : 'Statistiques, gestion et outils avancés'}
            </p>
          </div>
        </div>

        {/* Resource Stats (moved from public page) */}
        <ResourceStats documents={state.documents} loading={state.loading} />

        {/* Admin Tabs */}
        <Tabs defaultValue="management" className="space-y-4">
          <TabsList className="bg-background border">
            <TabsTrigger value="management" className="gap-2">
              <FileText className="h-4 w-4" />
              {currentLanguage === 'en' ? 'Management' : 'Gestion'}
            </TabsTrigger>
            <TabsTrigger value="advanced" className="gap-2">
              <Settings className="h-4 w-4" />
              {currentLanguage === 'en' ? 'Advanced Tools' : 'Outils Avancés'}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              {currentLanguage === 'en' ? 'Analytics' : 'Analytics'}
            </TabsTrigger>
          </TabsList>

          {/* Management Tab */}
          <TabsContent value="management" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentLanguage === 'en' ? 'Document Management' : 'Gestion des Documents'}
                </CardTitle>
                <CardDescription>
                  {currentLanguage === 'en' 
                    ? 'View, edit and manage all resources in the library' 
                    : 'Consulter, modifier et gérer toutes les ressources de la bibliothèque'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {state.documents.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      onPreview={() => handlePreview(doc)}
                      onDownload={() => handleDownload(doc)}
                    />
                  ))}
                </div>
                {state.documents.length === 0 && !state.loading && (
                  <p className="text-center text-muted-foreground py-8">
                    {currentLanguage === 'en' ? 'No documents found' : 'Aucun document trouvé'}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tools Tab */}
          <TabsContent value="advanced">
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
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentLanguage === 'en' ? 'Resource Analytics' : 'Statistiques des Ressources'}
                </CardTitle>
                <CardDescription>
                  {currentLanguage === 'en' 
                    ? 'Download trends, popular resources and usage patterns' 
                    : 'Tendances de téléchargement, ressources populaires et statistiques d\'utilisation'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    {currentLanguage === 'en' 
                      ? 'Detailed analytics coming soon' 
                      : 'Statistiques détaillées bientôt disponibles'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <DocumentPreviewDialog
          document={previewDoc}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onDownload={handleDownload}
        />

        <DocumentUploadDialog 
          onUpload={handleFileUpload} 
          isOpen={isUploadDialogOpen}
          onClose={() => setIsUploadDialogOpen(false)}
        />
      </div>
    </div>
  );
};

const AdminResources = () => {
  return (
    <SearchProvider>
      <AdminResourcesContent />
    </SearchProvider>
  );
};

export default AdminResources;
