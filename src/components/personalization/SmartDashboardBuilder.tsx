import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Layout,
  BarChart3,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Map,
  Settings,
  Plus,
  GripVertical,
  Eye,
  EyeOff
} from 'lucide-react';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { useAdvancedPersonalization } from '@/hooks/useAdvancedPersonalization';

interface Widget {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType;
  category: 'analytics' | 'social' | 'productivity' | 'system';
  size: 'small' | 'medium' | 'large';
  enabled: boolean;
  contextual?: boolean;
  requiredRole?: string[];
}

const availableWidgets: Widget[] = [
  {
    id: 'stats',
    name: 'Statistiques',
    description: 'Vue d\'ensemble des métriques principales',
    icon: BarChart3,
    category: 'analytics',
    size: 'large',
    enabled: true
  },
  {
    id: 'recent-activity',
    name: 'Activité récente',
    description: 'Dernières actions et mises à jour',
    icon: FileText,
    category: 'productivity',
    size: 'medium',
    enabled: true
  },
  {
    id: 'quick-actions',
    name: 'Actions rapides',
    description: 'Raccourcis vers les actions fréquentes',
    icon: Plus,
    category: 'productivity',
    size: 'small',
    enabled: true
  },
  {
    id: 'organizations',
    name: 'Organisations',
    description: 'Carte interactive des organisations',
    icon: Users,
    category: 'analytics',
    size: 'large',
    enabled: false
  },
  {
    id: 'events',
    name: 'Événements',
    description: 'Prochains événements et formations',
    icon: Calendar,
    category: 'social',
    size: 'medium',
    enabled: false
  },
  {
    id: 'forum',
    name: 'Forum',
    description: 'Discussions récentes et notifications',
    icon: MessageSquare,
    category: 'social',
    size: 'medium',
    enabled: false
  },
  {
    id: 'map-overview',
    name: 'Vue cartographique',
    description: 'Aperçu géographique des données',
    icon: Map,
    category: 'analytics',
    size: 'large',
    enabled: false,
    contextual: true
  },
  {
    id: 'admin-panel',
    name: 'Panneau d\'administration',
    description: 'Outils d\'administration système',
    icon: Settings,
    category: 'system',
    size: 'medium',
    enabled: false,
    requiredRole: ['country_admin', 'super_admin']
  }
];

export const SmartDashboardBuilder = () => {
  const { layout, enabledWidgets, toggleWidget, reorderWidgets, saveLayout } = useDashboardLayout();
  const { trackUserAction } = useAdvancedPersonalization();
  
  const [widgets, setWidgets] = useState(availableWidgets);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'masonry' | 'list'>('grid');
  const [previewMode, setPreviewMode] = useState(false);
  const [layoutName, setLayoutName] = useState('');

  const predefinedLayouts = [
    {
      id: 'analyst',
      name: 'Analyste',
      description: 'Dashboard centré sur les données et analytiques',
      widgets: ['stats', 'organizations', 'map-overview', 'recent-activity'],
      layout: 'grid'
    },
    {
      id: 'manager',
      name: 'Gestionnaire',
      description: 'Vue d\'ensemble pour la prise de décision',
      widgets: ['stats', 'recent-activity', 'events', 'quick-actions'],
      layout: 'masonry'
    },
    {
      id: 'collaborator',
      name: 'Collaborateur',
      description: 'Interface axée sur la collaboration',
      widgets: ['forum', 'events', 'quick-actions', 'recent-activity'],
      layout: 'list'
    },
    {
      id: 'minimal',
      name: 'Minimaliste',
      description: 'Interface épurée pour la concentration',
      widgets: ['stats', 'quick-actions'],
      layout: 'grid'
    }
  ];

  const handleWidgetToggle = useCallback((widgetId: string) => {
    // Mettre à jour l'état local des widgets
    setWidgets(prev => prev.map(w => 
      w.id === widgetId ? { ...w, enabled: !w.enabled } : w
    ));
    
    // Appeler la fonction du hook
    toggleWidget(widgetId);
    trackUserAction('toggle_widget', { widgetId, enabled: !widgets.find(w => w.id === widgetId)?.enabled });
  }, [toggleWidget, trackUserAction, widgets]);

  const applyPredefinedLayout = useCallback((layoutConfig: typeof predefinedLayouts[0]) => {
    // Mettre à jour l'état des widgets selon le layout
    setWidgets(prev => prev.map(widget => ({
      ...widget,
      enabled: layoutConfig.widgets.includes(widget.id)
    })));

    // Appliquer les changements au dashboard layout
    layoutConfig.widgets.forEach(widgetId => {
      const widget = widgets.find(w => w.id === widgetId);
      if (widget && !enabledWidgets.some(w => w.id === widgetId)) {
        toggleWidget(widgetId);
      }
    });

    setLayoutMode(layoutConfig.layout as 'grid' | 'masonry' | 'list');
    setLayoutName(layoutConfig.name);
    
    trackUserAction('apply_predefined_layout', { layoutId: layoutConfig.id });
    toast.success(`Layout "${layoutConfig.name}" appliqué avec succès !`);
  }, [widgets, enabledWidgets, toggleWidget, trackUserAction]);

  const saveCustomLayout = useCallback(() => {
    if (!layoutName) return;

    const customLayout = {
      name: layoutName,
      widgets: enabledWidgets.map(w => w.id),
      mode: layoutMode,
      timestamp: new Date().toISOString()
    };

    saveLayout(layout);
    
    // Sauvegarder dans localStorage pour la réutilisation
    const savedLayouts = JSON.parse(localStorage.getItem('customLayouts') || '[]');
    savedLayouts.push(customLayout);
    localStorage.setItem('customLayouts', JSON.stringify(savedLayouts));

    trackUserAction('save_custom_layout', { layoutName, widgetCount: enabledWidgets.length });
    toast.success(`Layout "${layoutName}" sauvegardé avec succès !`);
    setLayoutName('');
  }, [layoutName, enabledWidgets, layoutMode, saveLayout, trackUserAction]);

  const categoryColors = {
    analytics: 'bg-blue-100 text-blue-800',
    social: 'bg-green-100 text-green-800',
    productivity: 'bg-purple-100 text-purple-800',
    system: 'bg-orange-100 text-orange-800'
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5" />
              Constructeur de dashboard intelligent
            </CardTitle>
            <CardDescription>
              Personnalisez votre tableau de bord selon vos besoins
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {previewMode ? 'Quitter' : 'Aperçu'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="templates">Modèles</TabsTrigger>
            <TabsTrigger value="widgets">Widgets</TabsTrigger>
            <TabsTrigger value="layout">Disposition</TabsTrigger>
            <TabsTrigger value="smart">Intelligence</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {predefinedLayouts.map((layout) => (
                <Card
                  key={layout.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => applyPredefinedLayout(layout)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">{layout.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {layout.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {layout.widgets.slice(0, 3).map(widgetId => {
                        const widget = availableWidgets.find(w => w.id === widgetId);
                        return widget ? (
                          <Badge key={widgetId} variant="secondary" className="text-xs">
                            {widget.name}
                          </Badge>
                        ) : null;
                      })}
                      {layout.widgets.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{layout.widgets.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="widgets" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Widgets disponibles</h3>
                <div className="text-sm text-muted-foreground">
                  {enabledWidgets.length} widgets actifs
                </div>
              </div>

              <div className="grid gap-3">
                {widgets.map((widget) => {
                  const IconComponent = widget.icon;
                  const isEnabled = enabledWidgets.some(w => w.id === widget.id);
                  
                  return (
                    <Card key={widget.id} className={isEnabled ? 'border-primary' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <IconComponent />
                            <div>
                              <div className="font-medium">{widget.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {widget.description}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={categoryColors[widget.category]}
                            >
                              {widget.category}
                            </Badge>
                            <Switch
                              checked={isEnabled}
                              onCheckedChange={() => handleWidgetToggle(widget.id)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="layout-name">Nom du layout</Label>
                <Input
                  id="layout-name"
                  value={layoutName}
                  onChange={(e) => setLayoutName(e.target.value)}
                  placeholder="Mon dashboard personnalisé"
                />
              </div>

              <div className="space-y-3">
                <Label>Ordre des widgets</Label>
                <div className="space-y-2">
                  {enabledWidgets.map((widget, index) => {
                    const matchingWidget = availableWidgets.find(w => w.id === widget.id);
                    const IconComponent = matchingWidget?.icon || FileText;
                    return (
                      <Card key={widget.id} className="p-3">
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                          <IconComponent className="h-4 w-4" />
                          <span className="font-medium">{matchingWidget?.name || widget.id}</span>
                          <Badge variant="outline" className="ml-auto">
                            {index + 1}
                          </Badge>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <Button onClick={saveCustomLayout} disabled={!layoutName}>
                Sauvegarder le layout
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="smart" className="space-y-4">
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="font-medium mb-2">Suggestions intelligentes</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Widgets contextuels automatiques</span>
                    <Switch defaultChecked />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Affiche automatiquement des widgets selon votre activité
                  </p>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-medium mb-2">Apprentissage des habitudes</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Réorganisation automatique</span>
                    <Switch />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Réorganise les widgets selon vos interactions fréquentes
                  </p>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-medium mb-2">Modes adaptatifs</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mode focus (9h-12h)</span>
                    <Badge variant="outline">Actif</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mode collaboration (14h-17h)</span>
                    <Badge variant="secondary">Planifié</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mode analyse (8h-10h)</span>
                    <Badge variant="secondary">Planifié</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
