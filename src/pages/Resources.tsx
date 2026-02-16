import React, { useState, useCallback, useMemo } from "react";
import { useOptimizedDocuments } from "@/hooks/useOptimizedDocuments";
import { SearchProvider, useSearch } from "@/contexts/SearchContext";
import { LibraryHero } from "@/components/resources/LibraryHero";
import { ResourceFilters, ResourceFilterValues } from "@/components/resources/ResourceFilters";
import { FeaturedResources } from "@/components/resources/FeaturedResources";
import { ResourceGrid } from "@/components/resources/ResourceGrid";
import { ShareResourceCTA } from "@/components/resources/ShareResourceCTA";
import DocumentUploadDialog from "@/pages/resources/components/DocumentUploadDialog";
import DocumentPreviewDialog from "@/pages/resources/components/DocumentPreviewDialog";
import SampleDataButton from "@/components/resources/SampleDataButton";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Building2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Resources Page - NEXUS Layer 2 (Learning/Collaboration)
 * 
 * Single intention: "Explore, share and learn from SUTEL network resources"
 * 
 * Design principles:
 * - Clean, calm library aesthetic
 * - No KPIs or analytics (moved to /admin/resources)
 * - No admin tools visible
 * - Focus on discovery and learning
 */
const ResourcesContent = () => {
  const { state, performSearch, fetchInitialDocuments } = useSearch();
  const { uploadDocument, downloadDocument, deleteDocument } = useOptimizedDocuments();
  const { toast } = useToast();
  
  const [previewDoc, setPreviewDoc] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ResourceFilterValues>({});

  // Fetch documents on mount
  React.useEffect(() => {
    fetchInitialDocuments();
  }, [fetchInitialDocuments]);

  // Filter documents based on search and filters
  const filteredDocuments = useMemo(() => {
    let docs = state.documents;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      docs = docs.filter(doc => 
        doc.title?.toLowerCase().includes(query) ||
        doc.description?.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (filters.type) {
      docs = docs.filter(doc => doc.document_type === filters.type);
    }

    // Country filter
    if (filters.country) {
      docs = docs.filter(doc => doc.country?.toLowerCase() === filters.country);
    }

    return docs;
  }, [state.documents, searchQuery, filters]);

  // Featured documents (marked as featured or first 3)
  const featuredDocuments = useMemo(() => {
    return state.documents.filter(doc => doc.featured).slice(0, 3);
  }, [state.documents]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((newFilters: ResourceFilterValues) => {
    setFilters(newFilters);
  }, []);

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
      fetchInitialDocuments();
      setIsUploadDialogOpen(false);
    } catch {
      // Error handled in hook
    }
  }, [uploadDocument, fetchInitialDocuments, toast]);

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

  const handleDelete = useCallback(async (doc: any) => {
    await deleteDocument(doc);
    setIsPreviewOpen(false);
    fetchInitialDocuments();
  }, [deleteDocument, fetchInitialDocuments]);

  return (
    <div className="min-h-screen bg-transparent relative z-10">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Hero - Clean and focused */}
        <LibraryHero onShareResource={handleOpenUploadDialog} />

        {/* Sample data button (only when empty) */}
        {state.documents.length === 0 && !state.loading && (
          <div className="flex justify-center">
            <SampleDataButton onDataAdded={fetchInitialDocuments} />
          </div>
        )}

        {/* Filters - Simple and accessible */}
        <ResourceFilters
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          initialFilters={filters}
        />

        {/* Featured resources section */}
        {featuredDocuments.length > 0 && (
          <FeaturedResources
            documents={featuredDocuments}
            onPreview={handlePreview}
          />
        )}

        {/* All resources grid */}
        <ResourceGrid
          documents={filteredDocuments}
          loading={state.loading}
          onPreview={handlePreview}
          onDownload={handleDownload}
        />

        {/* Agency Documents CTA */}
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Documents des Agences</p>
                <p className="text-sm text-muted-foreground">Accédez aux bibliothèques documentaires partagées entre agences</p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link to="/agency-documents">
                Explorer <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* CTA to share resources */}
        <ShareResourceCTA onClick={handleOpenUploadDialog} />
        <DocumentPreviewDialog
          document={previewDoc}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onDownload={handleDownload}
          onDelete={handleDelete}
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

/**
 * Resources page wrapper with SearchProvider
 */
const Resources = () => {
  return (
    <SearchProvider>
      <ResourcesContent />
    </SearchProvider>
  );
};

export default Resources;
