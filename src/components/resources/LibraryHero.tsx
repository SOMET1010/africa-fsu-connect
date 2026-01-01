import React from 'react';
import { BookOpen, Upload } from 'lucide-react';
import { ModernButton } from '@/components/ui/modern-button';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { useTranslation } from '@/hooks/useTranslation';

interface LibraryHeroProps {
  onShareResource: () => void;
}

export const LibraryHero: React.FC<LibraryHeroProps> = ({ onShareResource }) => {
  const { currentLanguage } = useTranslation();
  
  return (
    <ScrollReveal direction="fade">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-background to-muted/20 border border-border/50">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-2xl" />
        </div>
        
        <div className="relative px-8 py-12 md:px-12 md:py-16">
          <div className="max-w-3xl">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-6">
              <BookOpen className="w-7 h-7" />
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {currentLanguage === 'en' 
                ? 'SUTEL Network Library' 
                : 'Bibliothèque du Réseau SUTEL'}
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
              {currentLanguage === 'en'
                ? 'Guides, reports and best practices shared by Universal Service Fund agencies across Africa.'
                : 'Guides, rapports et bonnes pratiques partagées par les agences de Fonds de Service Universel à travers l\'Afrique.'}
            </p>
            
            {/* Single CTA */}
            <ModernButton
              onClick={onShareResource}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              {currentLanguage === 'en' ? 'Share a Resource' : 'Partager une ressource'}
            </ModernButton>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default LibraryHero;
