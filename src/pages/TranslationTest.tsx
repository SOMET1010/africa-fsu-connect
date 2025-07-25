import { useTranslationDb } from '@/hooks/useTranslationDb';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TranslationTest() {
  const { t, currentLanguage, languages, isLoading } = useTranslationDb();
  const { preferences, updatePreferences } = useUserPreferences();

  const switchLanguage = (langCode: 'fr' | 'en') => {
    updatePreferences({ 
      ...preferences, 
      language: langCode 
    });
  };

  if (isLoading) {
    return <div>Chargement des traductions...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test du Système de Traductions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p><strong>Langue actuelle:</strong> {currentLanguage}</p>
            <p><strong>Langues disponibles:</strong> {languages.map(l => l.name).join(', ')}</p>
          </div>
          
          <div className="space-x-2">
            <Button 
              onClick={() => switchLanguage('fr')}
              variant={currentLanguage === 'fr' ? 'default' : 'outline'}
            >
              Français
            </Button>
            <Button 
              onClick={() => switchLanguage('en')}
              variant={currentLanguage === 'en' ? 'default' : 'outline'}
            >
              English
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <h3 className="font-semibold mb-2">Navigation</h3>
              <ul className="space-y-1 text-sm">
                <li>{t('nav.dashboard')}</li>
                <li>{t('nav.projects')}</li>
                <li>{t('nav.resources')}</li>
                <li>{t('nav.forum')}</li>
                <li>{t('nav.submit')}</li>
                <li>{t('nav.events')}</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Dashboard</h3>
              <ul className="space-y-1 text-sm">
                <li>{t('dashboard.title')}</li>
                <li>{t('dashboard.subtitle')}</li>
                <li>{t('dashboard.welcome')}</li>
                <li>{t('dashboard.stats.projects')}</li>
                <li>{t('dashboard.quickActions')}</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Common</h3>
              <ul className="space-y-1 text-sm">
                <li>{t('common.loading')}</li>
                <li>{t('common.search')}</li>
                <li>{t('common.save')}</li>
                <li>{t('common.cancel')}</li>
                <li>{t('common.delete')}</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Test clés manquantes</h3>
              <ul className="space-y-1 text-sm">
                <li>{t('test.missing.key')}</li>
                <li>{t('autre.cle.inexistante')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}