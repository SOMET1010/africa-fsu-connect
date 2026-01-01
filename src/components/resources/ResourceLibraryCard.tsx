import React from 'react';
import { FileText, Download, Eye, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

interface ResourceLibraryCardProps {
  document: Document;
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

const TYPE_STYLES: Record<string, { bg: string; icon: string }> = {
  guide: { bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', icon: '📘' },
  rapport: { bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', icon: '📊' },
  presentation: { bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400', icon: '📽️' },
  formulaire: { bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', icon: '📝' },
  autre: { bg: 'bg-gray-500/10 text-gray-600 dark:text-gray-400', icon: '📄' },
};

export const ResourceLibraryCard: React.FC<ResourceLibraryCardProps> = ({
  document: doc,
  onPreview,
  onDownload,
}) => {
  const { currentLanguage } = useTranslation();
  const typeStyle = TYPE_STYLES[doc.document_type] || TYPE_STYLES.autre;
  const countryFlag = doc.country ? COUNTRY_FLAGS[doc.country.toLowerCase()] : null;

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card hover:border-primary/20 hover:shadow-sm transition-all duration-200">
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Type badge */}
            <Badge 
              variant="secondary" 
              className={`${typeStyle.bg} border-0 text-xs font-medium`}
            >
              <span className="mr-1">{typeStyle.icon}</span>
              {doc.document_type}
            </Badge>
            
            {/* Country badge */}
            {countryFlag && (
              <Badge variant="outline" className="text-xs border-border/50">
                {countryFlag}
              </Badge>
            )}
          </div>
          
          {/* Date */}
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {new Date(doc.created_at).toLocaleDateString(
              currentLanguage === 'en' ? 'en-US' : 'fr-FR',
              { year: 'numeric', month: 'short', day: 'numeric' }
            )}
          </span>
        </div>

        {/* Title */}
        <h3 
          className="font-medium text-foreground mb-2 line-clamp-2 cursor-pointer hover:text-primary transition-colors"
          onClick={() => onPreview(doc)}
        >
          {doc.title}
        </h3>

        {/* Description (if exists) */}
        {doc.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {doc.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-border/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPreview(doc)}
            className="h-8 px-3 text-sm text-muted-foreground hover:text-foreground flex-1 justify-start"
          >
            <Eye className="h-4 w-4 mr-2" />
            {currentLanguage === 'en' ? 'View' : 'Consulter'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDownload(doc)}
            className="h-8 px-3 text-sm text-muted-foreground hover:text-primary"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ResourceLibraryCard;
