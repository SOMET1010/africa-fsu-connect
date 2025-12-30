import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Sparkles, ArrowRight, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Link } from 'react-router-dom';

interface WelcomeMessageProps {
  show?: boolean;
  onDismiss?: () => void;
  variant?: 'onboarding' | 'network';
}

const WELCOME_STORAGE_KEY = 'nexus_welcome_shown';

export function WelcomeMessage({ show, onDismiss, variant = 'network' }: WelcomeMessageProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if it's first login
    const wasShown = localStorage.getItem(WELCOME_STORAGE_KEY);
    if (!wasShown && variant === 'network') {
      setIsVisible(true);
    } else if (show !== undefined) {
      setIsVisible(show);
    }
  }, [show, variant]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(WELCOME_STORAGE_KEY, 'true');
    onDismiss?.();
  };

  if (!isVisible) return null;

  // Variant Onboarding (legacy)
  if (variant === 'onboarding') {
    return (
      <Card className="bg-gradient-to-r from-success/10 to-primary/10 border-success/30">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-success" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-success">Configuration terminée !</h3>
              <p className="text-success/80 text-sm">
                Votre espace de travail a été personnalisé selon vos préférences.
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleDismiss}
              className="text-success/70 hover:bg-success/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Variant Network (nouvelle promesse UX NEXUS)
  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-[#0B3C5D] to-[#328E6E] text-white">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Icon */}
          <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center flex-shrink-0">
            <Globe className="h-8 w-8 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2">
            <h2 className="text-xl md:text-2xl font-bold">
              {t('welcome.title')}
            </h2>
            <p className="text-white/90 text-base leading-relaxed">
              {t('welcome.message')}
            </p>
            <p className="text-white/70 text-sm">
              {t('welcome.subtitle')}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/dashboard">
              <Button 
                variant="secondary" 
                className="bg-white text-[#0B3C5D] hover:bg-white/90"
              >
                {t('welcome.cta')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleDismiss}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}