import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Palette, Save, RotateCcw, Eye, Moon, Sun } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useAdvancedPersonalization } from '@/hooks/useAdvancedPersonalization';
import { toast } from 'sonner';

interface ColorPalette {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
}

export const ThemeCustomizer = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { createPersonalizationProfile } = useAdvancedPersonalization();
  
  const [customColors, setCustomColors] = useState({
    primary: '#3b82f6',
    secondary: '#f8fafc',
    accent: '#3b82f6',
    background: '#ffffff',
    foreground: '#0f172a'
  });
  
  const [previewMode, setPreviewMode] = useState(false);
  const [themeName, setThemeName] = useState('');

  const predefinedPalettes: ColorPalette[] = [
    {
      name: 'Océan',
      colors: {
        primary: '#0ea5e9',
        secondary: '#f0f9ff',
        accent: '#06b6d4',
        background: '#ffffff',
        foreground: '#0c4a6e'
      }
    },
    {
      name: 'Forêt',
      colors: {
        primary: '#059669',
        secondary: '#f0fdf4',
        accent: '#10b981',
        background: '#ffffff',
        foreground: '#064e3b'
      }
    },
    {
      name: 'Coucher de soleil',
      colors: {
        primary: '#ea580c',
        secondary: '#fff7ed',
        accent: '#f97316',
        background: '#ffffff',
        foreground: '#9a3412'
      }
    },
    {
      name: 'Nuit profonde',
      colors: {
        primary: '#6366f1',
        secondary: '#1e1b4b',
        accent: '#8b5cf6',
        background: '#0f0f23',
        foreground: '#e2e8f0'
      }
    }
  ];

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
  };

  const applyPreviewTheme = (colors: typeof customColors) => {
    if (!previewMode) return;
    
    const root = document.documentElement;
    root.style.setProperty('--primary', hexToHsl(colors.primary));
    root.style.setProperty('--secondary', hexToHsl(colors.secondary));
    root.style.setProperty('--accent', hexToHsl(colors.accent));
    root.style.setProperty('--background', hexToHsl(colors.background));
    root.style.setProperty('--foreground', hexToHsl(colors.foreground));
  };

  const handleColorChange = (colorKey: keyof typeof customColors, value: string) => {
    const newColors = { ...customColors, [colorKey]: value };
    setCustomColors(newColors);
    applyPreviewTheme(newColors);
  };

  const applyPalette = (palette: ColorPalette) => {
    setCustomColors(palette.colors);
    setThemeName(palette.name);
    applyPreviewTheme(palette.colors);
    toast.success(`Palette "${palette.name}" appliquée avec succès !`);
  };

  const saveCustomTheme = async () => {
    if (!themeName) return;

    // Appliquer immédiatement les variables CSS
    const root = document.documentElement;
    root.style.setProperty('--primary', hexToHsl(customColors.primary));
    root.style.setProperty('--secondary', hexToHsl(customColors.secondary));
    root.style.setProperty('--accent', hexToHsl(customColors.accent));
    root.style.setProperty('--background', hexToHsl(customColors.background));
    root.style.setProperty('--foreground', hexToHsl(customColors.foreground));

    const profile = createPersonalizationProfile(themeName, {
      theme: {
        primary: `hsl(${hexToHsl(customColors.primary)})`,
        secondary: `hsl(${hexToHsl(customColors.secondary)})`,
        accent: `hsl(${hexToHsl(customColors.accent)})`,
        background: `hsl(${hexToHsl(customColors.background)})`
      }
    });

    // Sauvegarder dans les préférences
    await updatePreferences({
      ...preferences,
      theme: customColors.background === '#0f0f23' ? 'dark' : 'light'
    });

    setPreviewMode(false);
    toast.success(`Thème "${themeName}" sauvegardé et appliqué !`);
  };

  const resetTheme = () => {
    setCustomColors({
      primary: '#3b82f6',
      secondary: '#f8fafc',
      accent: '#3b82f6',
      background: '#ffffff',
      foreground: '#0f172a'
    });
    setThemeName('');
    
    if (previewMode) {
      const root = document.documentElement;
      root.style.removeProperty('--primary');
      root.style.removeProperty('--secondary');
      root.style.removeProperty('--accent');
      root.style.removeProperty('--background');
      root.style.removeProperty('--foreground');
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Personnalisation des thèmes
            </CardTitle>
            <CardDescription>
              Créez et personnalisez vos thèmes visuels
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? 'Arrêter' : 'Prévisualiser'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetTheme}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="presets">Thèmes prédéfinis</TabsTrigger>
            <TabsTrigger value="custom">Personnalisation</TabsTrigger>
            <TabsTrigger value="advanced">Avancé</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {predefinedPalettes.map((palette) => (
                <Card
                  key={palette.name}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => applyPalette(palette)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{palette.name}</h3>
                      <div className="flex gap-1">
                        {Object.values(palette.colors).slice(0, 3).map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Cliquez pour appliquer
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="theme-name">Nom du thème</Label>
                <Input
                  id="theme-name"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  placeholder="Mon thème personnalisé"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(customColors).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="capitalize">{key}</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={value}
                        onChange={(e) => handleColorChange(key as keyof typeof customColors, e.target.value)}
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        value={value}
                        onChange={(e) => handleColorChange(key as keyof typeof customColors, e.target.value)}
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={saveCustomTheme} disabled={!themeName}>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder le thème
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Adaptation automatique</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Changer automatiquement selon l'heure</span>
                  <Switch />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Contraste</Label>
                <Slider
                  defaultValue={[100]}
                  max={150}
                  min={80}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Saturation</Label>
                <Slider
                  defaultValue={[100]}
                  max={150}
                  min={50}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="h-4 w-4" />
                    <span className="font-medium">Mode jour</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Thème utilisé de 6h à 18h
                  </div>
                  <Badge variant="outline" className="mt-2">Océan</Badge>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Moon className="h-4 w-4" />
                    <span className="font-medium">Mode nuit</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Thème utilisé de 18h à 6h
                  </div>
                  <Badge variant="outline" className="mt-2">Nuit profonde</Badge>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};