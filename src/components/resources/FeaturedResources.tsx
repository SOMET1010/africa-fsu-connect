import React from 'react';
import { Star, Sparkles, BookOpen } from 'lucide-react';
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
  impact_theme?: string;
}

interface FeaturedResourcesProps {
  documents: Document[];
  onPreview: (doc: Document) => void;
  onInspire?: (doc: Document) => void;
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
  guide: { en: 'Practical guide', fr: 'Guide pratique', icon: '📘' },
  rapport: { en: 'Strategic report', fr: 'Rapport stratégique', icon: '📊' },
  'note-conceptuelle': { en: 'Concept note', fr: 'Note conceptuelle', icon: '💡' },
  'bonne-pratique': { en: 'Best practice', fr: 'Bonne pratique', icon: '✨' },
  modele: { en: 'Template', fr: 'Modèle', icon: '📝' },
  presentation: { en: 'Presentation', fr: 'Présentation', icon: '📽️' },
  autre: { en: 'Resource', fr: 'Ressource', icon: '📄' },
};

export const FeaturedResources: React.FC<FeaturedResourcesProps> = ({
  documents,
  onPreview,
  onInspire,
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
            {currentLanguage === 'en' 
              ? 'Featured resources from the network' 
              : 'Ressources mises en avant du réseau'}
          </h2>
        </div>

        {/* Featured cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayDocs.map((doc) => {
            const countryCode = doc.country?.toLowerCase() || '';
            const countryInfo = COUNTRY_INFO[countryCode];
            const typeInfo = TYPE_LABELS[doc.document_type] || TYPE_LABELS.autre;
            
            return (
              <Card
                key={doc.id}
                className="group relative overflow-hidden border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <div className="p-5 space-y-3">
                  {/* Icon + Title */}
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{typeInfo.icon}</span>
                    <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {doc.title}
                    </h3>
                  </div>

                  {/* Country */}
                  {countryInfo && (
                    <p className="text-sm text-muted-foreground">
                      {countryInfo.flag} {currentLanguage === 'en' ? countryInfo.name : countryInfo.nameFr}
                    </p>
                  )}

                  {/* Type label */}
                  <p className="text-sm text-muted-foreground">
                    {currentLanguage === 'en' ? typeInfo.en : typeInfo.fr}
                  </p>

                  {/* Impact theme (if available) */}
                  {doc.impact_theme && (
                    <Badge variant="outline" className="text-xs">
                      Impact : {doc.impact_theme}
                    </Badge>
                  )}

                  {/* Collaborative CTAs */}
                  <div className="flex items-center gap-2 pt-3 border-t border-border/30">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPreview(doc)}
                      className="h-8 px-3 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      {currentLanguage === 'en' ? 'Read' : 'Lire'}
                    </Button>
                    {onInspire && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onInspire(doc)}
                        className="h-8 px-3 text-sm text-muted-foreground hover:text-primary"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {currentLanguage === 'en' ? 'Get inspired' : 'S\'inspirer'}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </ScrollReveal>
  );
};

export default FeaturedResources;
