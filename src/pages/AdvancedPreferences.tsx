import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeCustomizer } from '@/components/personalization/ThemeCustomizer';
import { SmartDashboardBuilder } from '@/components/personalization/SmartDashboardBuilder';
import { IntelligentShortcuts } from '@/components/personalization/IntelligentShortcuts';
import { PersonalizationEngine } from '@/components/personalization/PersonalizationEngine';
import { PreferencesPanel } from '@/components/preferences/PreferencesPanel';
import { 
  Settings, 
  Palette, 
  Layout, 
  Keyboard, 
  Brain,
  User
} from 'lucide-react';

export default function AdvancedPreferences() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Préférences avancées</h1>
        <p className="text-muted-foreground">
          Personnalisez votre expérience avec l'intelligence artificielle
        </p>
      </div>

      <Tabs defaultValue="personalization" className="w-full">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="personalization" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            IA
          </TabsTrigger>
          <TabsTrigger value="themes" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Thèmes
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="shortcuts" className="flex items-center gap-2">
            <Keyboard className="h-4 w-4" />
            Raccourcis
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Système
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personalization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Intelligence artificielle personnalisée
              </CardTitle>
              <CardDescription>
                Laissez l'IA apprendre vos habitudes et personnaliser automatiquement votre expérience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonalizationEngine />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="themes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Personnalisation des thèmes
              </CardTitle>
              <CardDescription>
                Créez et personnalisez vos thèmes visuels avec des couleurs et styles uniques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeCustomizer />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Configuration du tableau de bord
              </CardTitle>
              <CardDescription>
                Organisez votre tableau de bord avec des widgets intelligents et adaptatifs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SmartDashboardBuilder />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shortcuts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Raccourcis intelligents
              </CardTitle>
              <CardDescription>
                Gérez vos raccourcis clavier avec des suggestions automatiques basées sur vos habitudes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IntelligentShortcuts />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Préférences système
              </CardTitle>
              <CardDescription>
                Configuration générale de l'application et préférences d'accessibilité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PreferencesPanel />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profil et données personnelles
              </CardTitle>
              <CardDescription>
                Gérez vos informations personnelles et l'historique d'apprentissage de l'IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Données d'apprentissage</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Actions trackées:</span>
                      <span className="font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insights générés:</span>
                      <span className="font-medium">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Raccourcis créés:</span>
                      <span className="font-medium">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thèmes personnalisés:</span>
                      <span className="font-medium">3</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-medium mb-3">Score de personnalisation</h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">87%</div>
                    <p className="text-sm text-muted-foreground">
                      Votre expérience est hautement personnalisée
                    </p>
                  </div>
                </Card>
              </div>

              <Card className="p-4">
                <h3 className="font-medium mb-3">Actions disponibles</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-3 text-left border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="font-medium">Exporter mes données</div>
                    <div className="text-sm text-muted-foreground">Télécharger toutes vos données personnelles</div>
                  </button>
                  <button className="p-3 text-left border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="font-medium">Réinitialiser l'IA</div>
                    <div className="text-sm text-muted-foreground">Effacer l'historique d'apprentissage</div>
                  </button>
                  <button className="p-3 text-left border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="font-medium">Partager un profil</div>
                    <div className="text-sm text-muted-foreground">Créer un profil d'équipe</div>
                  </button>
                  <button className="p-3 text-left border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="font-medium">Importer des préférences</div>
                    <div className="text-sm text-muted-foreground">Importer depuis un autre compte</div>
                  </button>
                </div>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}