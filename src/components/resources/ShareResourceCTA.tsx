import React from 'react';
import { Upload, Users, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ModernButton } from '@/components/ui/modern-button';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { useTranslation } from '@/hooks/useTranslation';

interface ShareResourceCTAProps {
  onClick: () => void;
}

export const ShareResourceCTA: React.FC<ShareResourceCTAProps> = ({ onClick }) => {
  const { currentLanguage } = useTranslation();

  return (
    <ScrollReveal delay={300}>
      <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-primary/5 via-background to-muted/10">
        <div className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-primary" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {currentLanguage === 'en'
                  ? 'Share your expertise with the network'
                  : 'Partagez votre expertise avec le réseau'}
              </h3>
              <p className="text-muted-foreground max-w-lg">
                {currentLanguage === 'en'
                  ? 'Your guides, reports and best practices can help other Universal Service Funds across Africa.'
                  : 'Vos guides, rapports et bonnes pratiques peuvent aider d\'autres Fonds de Service Universel à travers l\'Afrique.'}
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex-shrink-0">
              <ModernButton
                onClick={onClick}
                size="lg"
                className="gap-2"
              >
                <Upload className="w-5 h-5" />
                {currentLanguage === 'en' ? 'Share a Resource' : 'Partager une ressource'}
              </ModernButton>
            </div>
          </div>

          {/* Stats teaser */}
          <div className="flex items-center justify-center md:justify-start gap-6 mt-6 pt-6 border-t border-border/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>
                {currentLanguage === 'en' ? '30+ countries' : '30+ pays'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Upload className="w-4 h-4" />
              <span>
                {currentLanguage === 'en' ? '4 languages' : '4 langues'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </ScrollReveal>
  );
};

export default ShareResourceCTA;
