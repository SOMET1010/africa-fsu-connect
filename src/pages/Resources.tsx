
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
import { useToast } from "@/hooks/use-toast";

const ResourcesContent = () => {
  const { state, performSearch, fetchInitialDocuments } = useSearch();
  const { uploadDocument, downloadDocument } = useOptimizedDocuments();
  const { toast } = useToast();
  
  const searchBarRef = useRef<SearchBarRef>(null);
  const [previewDoc, setPreviewDoc] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-4">
                Bibliothèque de Ressources FSU
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                Accédez à l'ensemble des documents, rapports, guides et ressources 
                partagés par les agences FSU africaines. Une collection collaborative 
                de connaissances pour soutenir le développement en Afrique.
              </p>
            </div>
            {state.documents.length === 0 && !state.loading && (
              <SampleDataButton onDataAdded={fetchInitialDocuments} />
            )}
          </div>
        </div>

        <ResourceStats documents={state.documents} loading={state.loading} />

        <div className="mb-8 space-y-4">
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
            <DocumentUploadDialog onUpload={handleFileUpload} />
          </div>
        </div>

        <div className="space-y-6">
          {state.loading ? (
            <div className="grid gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse bg-muted rounded-lg h-64"></div>
              ))}
            </div>
          ) : state.documents.length === 0 ? (
            <EmptyDocumentsState onShowAll={handleShowAllDocuments} />
          ) : (
            <div className="grid gap-6">
              {state.documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onPreview={handlePreview}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          )}
        </div>

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
