import React from 'react';
import { BookOpen, Upload } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { useTranslation } from '@/hooks/useTranslation';

interface LibraryHeroProps {
  onShareResource: () => void;
}

export const LibraryHero: React.FC<LibraryHeroProps> = ({ onShareResource }) => {
  const { t } = useTranslation();
  
  return (
    <PageHero
      badge={t('library.page.badge')}
      badgeIcon={BookOpen}
      title={t('library.page.title')}
      subtitle={t('library.page.subtitle')}
      ctaLabel={t('library.cta.share')}
      ctaIcon={Upload}
      onCtaClick={onShareResource}
    />
  );
};

export default LibraryHero;
