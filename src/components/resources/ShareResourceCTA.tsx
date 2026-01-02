import React from 'react';
import { Plus } from 'lucide-react';
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
    <ScrollReveal>
      <Card className="border-dashed border-2 border-border/50 bg-muted/20 hover:border-primary/30 transition-colors">
        <div className="p-8 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {currentLanguage === 'en' 
              ? 'Would you like to share a resource?' 
              : 'Vous souhaitez partager une ressource ?'}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {currentLanguage === 'en'
              ? 'Your experience can inspire other countries in the network.'
              : 'Votre expérience peut inspirer d\'autres pays du réseau.'}
          </p>
          <ModernButton onClick={onClick} className="gap-2">
            <Plus className="w-4 h-4" />
            {currentLanguage === 'en' ? 'Share a resource' : 'Proposer une ressource'}
          </ModernButton>
        </div>
      </Card>
    </ScrollReveal>
  );
};

export default ShareResourceCTA;
