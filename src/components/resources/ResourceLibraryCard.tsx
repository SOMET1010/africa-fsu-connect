import React from 'react';
import { Download, Eye, Mail } from 'lucide-react';
import { Card } from '@/components/ui/card';
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
  onContactCountry?: (doc: Document) => void;
}

const COUNTRY_INFO: Record<string, { flag: string; name: string; nameFr: string }> = {
  ci: { flag: '🇨🇮', name: 'Ivory Coast', nameFr: 'Côte d\'Ivoire' },
  sn: { flag: '🇸🇳', name: 'Senegal', nameFr: 'Sénégal' },
  za: { flag: '🇿🇦', name: 'South Africa', nameFr: 'Afrique du Sud' },
  ng: { flag: '🇳🇬', name: 'Nigeria', nameFr: 'Nigeria' },
  gh: { flag: '🇬🇭', name: 'Ghana', nameFr: 'Ghana' },
  ke: { flag: '🇰🇪', name: 'Kenya', nameFr: 'Kenya' },
  tz: { flag: '🇹🇿', name: 'Tanzania', nameFr: 'Tanzanie' },
  ug: { flag: '🇺🇬', name: 'Uganda', nameFr: 'Ouganda' },
  ml: { flag: '🇲🇱', name: 'Mali', nameFr: 'Mali' },
  bf: { flag: '🇧🇫', name: 'Burkina Faso', nameFr: 'Burkina Faso' },
  bj: { flag: '🇧🇯', name: 'Benin', nameFr: 'Bénin' },
  tg: { flag: '🇹🇬', name: 'Togo', nameFr: 'Togo' },
  cm: { flag: '🇨🇲', name: 'Cameroon', nameFr: 'Cameroun' },
  cd: { flag: '🇨🇩', name: 'DRC', nameFr: 'RDC' },
  rw: { flag: '🇷🇼', name: 'Rwanda', nameFr: 'Rwanda' },
};

const TYPE_LABELS: Record<string, { en: string; fr: string; icon: string }> = {
  guide: { en: 'Guide', fr: 'Guide', icon: '📘' },
  rapport: { en: 'Report', fr: 'Rapport', icon: '📊' },
  'note-conceptuelle': { en: 'Concept Note', fr: 'Note conceptuelle', icon: '💡' },
  'bonne-pratique': { en: 'Best Practice', fr: 'Bonne pratique', icon: '✨' },
  modele: { en: 'Template', fr: 'Modèle', icon: '📝' },
  presentation: { en: 'Presentation', fr: 'Présentation', icon: '📽️' },
  formulaire: { en: 'Form', fr: 'Formulaire', icon: '📋' },
  autre: { en: 'Other', fr: 'Autre', icon: '📄' },
};

export const ResourceLibraryCard: React.FC<ResourceLibraryCardProps> = ({
  document: doc,
  onPreview,
  onDownload,
  onContactCountry,
}) => {
  const { currentLanguage } = useTranslation();
  
  const countryCode = doc.country?.toLowerCase() || '';
  const countryInfo = COUNTRY_INFO[countryCode];
  const typeInfo = TYPE_LABELS[doc.document_type] || TYPE_LABELS.autre;
  const year = new Date(doc.created_at).getFullYear();

  // Build metadata line: 🇰🇪 Kenya · Guide · Français · 2024
  const metadataItems = [
    countryInfo ? `${countryInfo.flag} ${currentLanguage === 'en' ? countryInfo.name : countryInfo.nameFr}` : null,
    currentLanguage === 'en' ? typeInfo.en : typeInfo.fr,
    currentLanguage === 'en' ? 'French' : 'Français',
    year.toString(),
  ].filter(Boolean);

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card hover:border-primary/20 hover:shadow-sm transition-all duration-200">
      <div className="p-4">
        {/* Title with type icon */}
        <h3 
          className="font-medium text-foreground mb-2 line-clamp-2 cursor-pointer hover:text-primary transition-colors flex items-start gap-2"
          onClick={() => onPreview(doc)}
        >
          <span className="text-lg flex-shrink-0">{typeInfo.icon}</span>
          <span>{doc.title}</span>
        </h3>

        {/* Metadata line */}
        <p className="text-sm text-muted-foreground mb-3">
          {metadataItems.join(' · ')}
        </p>

        {/* Description (if exists) */}
        {doc.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {doc.description}
          </p>
        )}

        {/* Actions - collaborative CTAs */}
        <div className="flex items-center gap-2 pt-3 border-t border-border/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPreview(doc)}
            className="h-8 px-3 text-sm text-muted-foreground hover:text-foreground"
          >
            <Eye className="h-4 w-4 mr-2" />
            {currentLanguage === 'en' ? 'Read' : 'Lire'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDownload(doc)}
            className="h-8 px-3 text-sm text-muted-foreground hover:text-primary"
          >
            <Download className="h-4 w-4 mr-2" />
            {currentLanguage === 'en' ? 'Download' : 'Télécharger'}
          </Button>
          {countryInfo && onContactCountry && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onContactCountry(doc)}
              className="h-8 px-3 text-sm text-muted-foreground hover:text-primary ml-auto"
            >
              <Mail className="h-4 w-4 mr-2" />
              {currentLanguage === 'en' ? 'Contact country' : 'Contacter le pays'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ResourceLibraryCard;
