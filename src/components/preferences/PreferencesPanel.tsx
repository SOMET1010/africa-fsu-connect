import { useState } from 'react';
import { Settings, Palette, Bell, Layout, Accessibility, Monitor, Smartphone, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export const PreferencesPanel = () => {
  const { preferences, updatePreferences, resetPreferences } = useUserPreferences();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handlePreferenceChange = async (updates: any) => {
    setSaving(true);
    try {
      await updatePreferences(updates);
      toast({
        title: "Préférences mises à jour",
        description: "Vos paramètres ont été sauvegardés avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les préférences.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      await resetPreferences();
      toast({
        title: "Préférences réinitialisées",
        description: "Tous les paramètres ont été restaurés par défaut.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de réinitialiser les préférences.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Préférences</h1>
          <p className="text-muted-foreground">Personnalisez votre expérience utilisateur</p>
        </div>
        <Button variant="outline" onClick={handleReset}>
          Réinitialiser
        </Button>
      </div>

      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Apparence
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Interface
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="flex items-center gap-2">
            <Accessibility className="h-4 w-4" />
            Accessibilité
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Tableau de bord
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thème et Apparence</CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'interface selon vos préférences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Thème</Label>
                <Select
                  value={preferences.theme}
                  onValueChange={(value) =>
                    handlePreferenceChange({ theme: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Clair
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Sombre
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        Système
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Mise en page accueil</Label>
                <Select
                  value={preferences.homeLayout}
                  onValueChange={(value) =>
                    handlePreferenceChange({ homeLayout: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">☀️ Clair</SelectItem>
                    <SelectItem value="immersive">🌙 Immersif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Langue</Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value) =>
                    handlePreferenceChange({ language: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">🇫🇷 Français</SelectItem>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Gérez vos préférences de notification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(preferences.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="capitalize">
                      {key === 'email' && 'Email'}
                      {key === 'push' && 'Notifications push'}
                      {key === 'forum' && 'Forum'}
                      {key === 'events' && 'Événements'}
                      {key === 'submissions' && 'Soumissions'}
                    </Label>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange({
                        notifications: { ...preferences.notifications, [key]: checked }
                      })
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interface et Navigation</CardTitle>
              <CardDescription>
                Personnalisez la disposition et le comportement de l'interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Barre latérale réduite</Label>
                  <p className="text-sm text-muted-foreground">
                    Afficher une barre latérale compacte par défaut
                  </p>
                </div>
                <Switch
                  checked={preferences.layout.sidebarCollapsed}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange({
                      layout: { ...preferences.layout, sidebarCollapsed: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mode compact</Label>
                  <p className="text-sm text-muted-foreground">
                    Affichage plus dense pour maximiser l'espace
                  </p>
                </div>
                <Switch
                  checked={preferences.layout.compactMode}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange({
                      layout: { ...preferences.layout, compactMode: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Animations activées</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer les transitions et animations
                  </p>
                </div>
                <Switch
                  checked={preferences.layout.animationsEnabled}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange({
                      layout: { ...preferences.layout, animationsEnabled: checked }
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accessibilité</CardTitle>
              <CardDescription>
                Options pour améliorer l'accessibilité de l'interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Contraste élevé</Label>
                  <p className="text-sm text-muted-foreground">
                    Augmenter le contraste pour une meilleure lisibilité
                  </p>
                </div>
                <Switch
                  checked={preferences.accessibility.highContrast}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange({
                      accessibility: { ...preferences.accessibility, highContrast: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Réduire les mouvements</Label>
                  <p className="text-sm text-muted-foreground">
                    Minimiser les animations et transitions
                  </p>
                </div>
                <Switch
                  checked={preferences.accessibility.reduceMotion}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange({
                      accessibility: { ...preferences.accessibility, reduceMotion: checked }
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Taille de police</Label>
                <Select
                  value={preferences.accessibility.fontSize}
                  onValueChange={(value) =>
                    handlePreferenceChange({
                      accessibility: { ...preferences.accessibility, fontSize: value as any }
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Petite</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Optimisé lecteur d'écran</Label>
                  <p className="text-sm text-muted-foreground">
                    Améliorations pour les technologies d'assistance
                  </p>
                </div>
                <Switch
                  checked={preferences.accessibility.screenReader}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange({
                      accessibility: { ...preferences.accessibility, screenReader: checked }
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tableau de bord</CardTitle>
              <CardDescription>
                Personnalisez l'affichage de votre tableau de bord
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Intervalle de rafraîchissement (secondes)</Label>
                <div className="space-y-2">
                  <Slider
                    value={[preferences.dashboard.refreshInterval / 1000]}
                    onValueChange={([value]) =>
                      handlePreferenceChange({
                        dashboard: { ...preferences.dashboard, refreshInterval: value * 1000 }
                      })
                    }
                    max={300}
                    min={10}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>10s</span>
                    <span>{preferences.dashboard.refreshInterval / 1000}s</span>
                    <span>5min</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Widgets favoris</Label>
                <div className="flex flex-wrap gap-2">
                  {['stats', 'recent-activity', 'quick-actions', 'regional-progress'].map((widget) => (
                    <Badge
                      key={widget}
                      variant={preferences.dashboard.favoriteWidgets.includes(widget) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        const favorites = preferences.dashboard.favoriteWidgets.includes(widget)
                          ? preferences.dashboard.favoriteWidgets.filter(w => w !== widget)
                          : [...preferences.dashboard.favoriteWidgets, widget];
                        handlePreferenceChange({
                          dashboard: { ...preferences.dashboard, favoriteWidgets: favorites }
                        });
                      }}
                    >
                      {widget.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {saving && (
        <div className="text-center text-muted-foreground">
          Sauvegarde en cours...
        </div>
      )}
    </div>
  );
};