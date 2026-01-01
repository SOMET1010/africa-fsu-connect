import React from 'react';
import { FileText, FolderOpen } from 'lucide-react';
import { ResourceLibraryCard } from './ResourceLibraryCard';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { useTranslation } from '@/hooks/useTranslation';

interface Document {
  id: string;
  title: string;
  description?: string;
  document_type: string;
  country?: string;
  created_at: string;
  file_url?: string;
}

interface ResourceGridProps {
  documents: Document[];
  loading?: boolean;
  onPreview: (doc: Document) => void;
  onDownload: (doc: Document) => void;
}

export const ResourceGrid: React.FC<ResourceGridProps> = ({
  documents,
  loading = false,
  onPreview,
  onDownload,
}) => {
  const { currentLanguage } = useTranslation();

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground">
            {currentLanguage === 'en' ? 'All Resources' : 'Toutes les ressources'}
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 rounded-lg bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (documents.length === 0) {
    return (
      <ScrollReveal delay={200}>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">
              {currentLanguage === 'en' ? 'All Resources' : 'Toutes les ressources'}
            </h2>
          </div>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {currentLanguage === 'en' ? 'No resources found' : 'Aucune ressource trouvée'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {currentLanguage === 'en'
                ? 'Try adjusting your filters or be the first to share a resource with the network.'
                : 'Essayez d\'ajuster vos filtres ou soyez le premier à partager une ressource avec le réseau.'}
            </p>
          </div>
        </div>
      </ScrollReveal>
    );
  }

  return (
    <ScrollReveal delay={200}>
      <div className="space-y-4">
        {/* Section header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">
              {currentLanguage === 'en' ? 'All Resources' : 'Toutes les ressources'}
            </h2>
          </div>
          <span className="text-sm text-muted-foreground">
            {documents.length} {currentLanguage === 'en' ? 'document' : 'document'}{documents.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <ResourceLibraryCard
              key={doc.id}
              document={doc}
              onPreview={onPreview}
              onDownload={onDownload}
            />
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
};

export default ResourceGrid;
