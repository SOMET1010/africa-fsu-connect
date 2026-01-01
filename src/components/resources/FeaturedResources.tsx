import React from 'react';
import { Star, ArrowRight, FileText, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { useTranslation } from '@/hooks/useTranslation';

interface Document {
  id: string;
  title: string;
  description?: string;
  document_type: string;
  country?: string;
  created_at: string;
  featured?: boolean;
}

interface FeaturedResourcesProps {
  documents: Document[];
  onPreview: (doc: Document) => void;
  onDownload: (doc: Document) => void;
}

const COUNTRY_FLAGS: Record<string, string> = {
  ci: '🇨🇮',
  sn: '🇸🇳',
  za: '🇿🇦',
  ng: '🇳🇬',
  gh: '🇬🇭',
  ke: '🇰🇪',
  tz: '🇹🇿',
  ug: '🇺🇬',
  ml: '🇲🇱',
  bf: '🇧🇫',
  bj: '🇧🇯',
  tg: '🇹🇬',
  cm: '🇨🇲',
  cd: '🇨🇩',
  rw: '🇷🇼',
};

const TYPE_COLORS: Record<string, string> = {
  guide: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  rapport: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  presentation: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  formulaire: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  autre: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
};

export const FeaturedResources: React.FC<FeaturedResourcesProps> = ({
  documents,
  onPreview,
  onDownload,
}) => {
  const { currentLanguage } = useTranslation();
  
  // Get featured documents (first 3 featured or most recent)
  const featuredDocs = documents
    .filter(doc => doc.featured)
    .slice(0, 3);
  
  // If no featured docs, show most recent
  const displayDocs = featuredDocs.length > 0 
    ? featuredDocs 
    : documents.slice(0, 3);

  if (displayDocs.length === 0) {
    return null;
  }

  return (
    <ScrollReveal delay={100}>
      <div className="space-y-4">
        {/* Section header */}
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-500" />
          <h2 className="text-xl font-semibold text-foreground">
            {currentLanguage === 'en' ? 'Featured Resources' : 'Ressources mises en avant'}
          </h2>
        </div>

        {/* Featured cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {displayDocs.map((doc) => (
            <Card
              key={doc.id}
              className="group relative overflow-hidden border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer"
              onClick={() => onPreview(doc)}
            >
              <div className="p-5">
                {/* Type badge */}
                <div className="flex items-center justify-between mb-3">
                  <Badge 
                    variant="secondary" 
                    className={`${TYPE_COLORS[doc.document_type] || TYPE_COLORS.autre} border-0`}
                  >
                    {doc.document_type}
                  </Badge>
                  {doc.country && (
                    <span className="text-lg" title={doc.country}>
                      {COUNTRY_FLAGS[doc.country.toLowerCase()] || '🌍'}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {doc.title}
                </h3>

                {/* Description */}
                {doc.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {doc.description}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">
                    {new Date(doc.created_at).toLocaleDateString(
                      currentLanguage === 'en' ? 'en-US' : 'fr-FR',
                      { year: 'numeric', month: 'short' }
                    )}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownload(doc);
                    }}
                    className="h-8 px-2 text-muted-foreground hover:text-primary"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
};

export default FeaturedResources;
