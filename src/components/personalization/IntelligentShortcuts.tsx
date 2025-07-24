import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Keyboard, 
  Zap, 
  Plus, 
  Trash2, 
  Edit3, 
  Brain, 
  Clock,
  TrendingUp,
  Command
} from 'lucide-react';
import { useAdvancedPersonalization } from '@/hooks/useAdvancedPersonalization';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface SmartShortcut {
  id: string;
  name: string;
  keys: string;
  action: string;
  description: string;
  frequency: number;
  lastUsed: Date | null;
  isLearned: boolean;
  context?: string[];
}

interface ShortcutSuggestion {
  action: string;
  frequency: number;
  suggestedKeys: string;
  confidence: number;
  reason: string;
}

export const IntelligentShortcuts = () => {
  const { learningData, trackUserAction } = useAdvancedPersonalization();
  const { enabledShortcuts } = useKeyboardShortcuts([]);
  
  const [shortcuts, setShortcuts] = useState<SmartShortcut[]>([
    {
      id: '1',
      name: 'Recherche rapide',
      keys: 'Ctrl+K',
      action: 'search',
      description: 'Ouvrir la barre de recherche',
      frequency: 45,
      lastUsed: new Date(),
      isLearned: false
    },
    {
      id: '2',
      name: 'Nouveau document',
      keys: 'Ctrl+N',
      action: 'new_document',
      description: 'Créer un nouveau document',
      frequency: 23,
      lastUsed: new Date(Date.now() - 86400000),
      isLearned: true
    }
  ]);
  
  const [suggestions, setSuggestions] = useState<ShortcutSuggestion[]>([]);
  const [newShortcut, setNewShortcut] = useState({
    name: '',
    keys: '',
    action: '',
    description: ''
  });
  const [learningEnabled, setLearningEnabled] = useState(true);

  // Génération automatique de suggestions basées sur l'usage
  useEffect(() => {
    if (!learningData.frequency) return;

    const newSuggestions: ShortcutSuggestion[] = [];
    const actions = Object.entries(learningData.frequency)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5);

    actions.forEach(([action, frequency]) => {
      // Ne suggérer que si pas déjà un raccourci
      const existingShortcut = shortcuts.find(s => s.action === action);
      if (!existingShortcut && frequency > 5) {
        const suggestedKeys = generateSmartShortcut(action);
        newSuggestions.push({
          action,
          frequency: frequency as number,
          suggestedKeys,
          confidence: Math.min((frequency as number) / 10 * 100, 100),
          reason: `Action utilisée ${frequency} fois`
        });
      }
    });

    setSuggestions(newSuggestions);
  }, [learningData, shortcuts]);

  // Génération intelligente de raccourcis
  const generateSmartShortcut = (action: string): string => {
    const commonPrefixes = ['Ctrl+', 'Alt+', 'Ctrl+Shift+'];
    const actionMappings: Record<string, string[]> = {
      'search': ['K', 'F', 'S'],
      'new': ['N', 'T'],
      'save': ['S'],
      'copy': ['C'],
      'paste': ['V'],
      'delete': ['Delete', 'D'],
      'edit': ['E'],
      'view': ['V'],
      'open': ['O'],
      'close': ['W'],
      'refresh': ['R', 'F5'],
      'help': ['F1', 'H'],
      'settings': ['Comma', 'P']
    };

    // Trouver la meilleure correspondance
    const actionKey = Object.keys(actionMappings).find(key => 
      action.toLowerCase().includes(key)
    );
    
    if (actionKey) {
      const availableKeys = actionMappings[actionKey];
      const usedKeys = shortcuts.map(s => s.keys.split('+').pop()?.toLowerCase());
      
      for (const key of availableKeys) {
        if (!usedKeys.includes(key.toLowerCase())) {
          return `Ctrl+${key}`;
        }
      }
    }

    // Fallback: utiliser la première lettre
    const firstLetter = action.charAt(0).toUpperCase();
    return `Ctrl+Shift+${firstLetter}`;
  };

  const createShortcutFromSuggestion = (suggestion: ShortcutSuggestion) => {
    const newShortcut: SmartShortcut = {
      id: Date.now().toString(),
      name: suggestion.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      keys: suggestion.suggestedKeys,
      action: suggestion.action,
      description: `Raccourci généré automatiquement`,
      frequency: suggestion.frequency,
      lastUsed: null,
      isLearned: true
    };

    setShortcuts(prev => [...prev, newShortcut]);
    setSuggestions(prev => prev.filter(s => s.action !== suggestion.action));
    
    trackUserAction('create_shortcut_from_suggestion', {
      action: suggestion.action,
      keys: suggestion.suggestedKeys
    });
  };

  const addCustomShortcut = () => {
    if (!newShortcut.name || !newShortcut.keys || !newShortcut.action) return;

    const shortcut: SmartShortcut = {
      id: Date.now().toString(),
      ...newShortcut,
      frequency: 0,
      lastUsed: null,
      isLearned: false
    };

    setShortcuts(prev => [...prev, shortcut]);
    setNewShortcut({ name: '', keys: '', action: '', description: '' });
    
    trackUserAction('create_custom_shortcut', shortcut);
  };

  const deleteShortcut = (id: string) => {
    setShortcuts(prev => prev.filter(s => s.id !== id));
    trackUserAction('delete_shortcut', { shortcutId: id });
  };

  const getShortcutStats = () => {
    const total = shortcuts.length;
    const learned = shortcuts.filter(s => s.isLearned).length;
    const recent = shortcuts.filter(s => 
      s.lastUsed && s.lastUsed > new Date(Date.now() - 7 * 86400000)
    ).length;
    
    return { total, learned, recent };
  };

  const stats = getShortcutStats();

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Raccourcis intelligents
            </CardTitle>
            <CardDescription>
              Raccourcis adaptatifs basés sur vos habitudes d'utilisation
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium">{stats.total} raccourcis</div>
              <div className="text-xs text-muted-foreground">
                {stats.learned} appris automatiquement
              </div>
            </div>
            <Switch
              checked={learningEnabled}
              onCheckedChange={setLearningEnabled}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="active">Actifs</TabsTrigger>
            <TabsTrigger value="suggestions">
              Suggestions
              {suggestions.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {suggestions.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="create">Créer</TabsTrigger>
            <TabsTrigger value="analytics">Analyses</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="space-y-3">
              {shortcuts.map((shortcut) => (
                <Card key={shortcut.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {shortcut.isLearned && (
                          <Brain className="h-4 w-4 text-purple-500" />
                        )}
                        <div>
                          <div className="font-medium">{shortcut.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {shortcut.description}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge variant="outline" className="font-mono">
                          {shortcut.keys}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          Utilisé {shortcut.frequency} fois
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteShortcut(shortcut.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            <div className="space-y-3">
              {suggestions.length === 0 ? (
                <Card className="p-8 text-center">
                  <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">Aucune suggestion pour le moment</h3>
                  <p className="text-sm text-muted-foreground">
                    Continuez à utiliser l'application pour que l'IA apprenne vos habitudes
                  </p>
                </Card>
              ) : (
                suggestions.map((suggestion, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        <div>
                          <div className="font-medium">
                            {suggestion.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {suggestion.reason}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <Badge variant="outline" className="font-mono">
                            {suggestion.suggestedKeys}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            Confiance: {Math.round(suggestion.confidence)}%
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => createShortcutFromSuggestion(suggestion)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-medium mb-4">Créer un raccourci personnalisé</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shortcut-name">Nom</Label>
                  <Input
                    id="shortcut-name"
                    value={newShortcut.name}
                    onChange={(e) => setNewShortcut(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nom du raccourci"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shortcut-keys">Combinaison de touches</Label>
                  <Input
                    id="shortcut-keys"
                    value={newShortcut.keys}
                    onChange={(e) => setNewShortcut(prev => ({ ...prev, keys: e.target.value }))}
                    placeholder="Ctrl+Alt+K"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shortcut-action">Action</Label>
                  <Input
                    id="shortcut-action"
                    value={newShortcut.action}
                    onChange={(e) => setNewShortcut(prev => ({ ...prev, action: e.target.value }))}
                    placeholder="open_settings"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shortcut-description">Description</Label>
                  <Input
                    id="shortcut-description"
                    value={newShortcut.description}
                    onChange={(e) => setNewShortcut(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description de l'action"
                  />
                </div>
              </div>
              
              <Button 
                onClick={addCustomShortcut} 
                className="mt-4"
                disabled={!newShortcut.name || !newShortcut.keys || !newShortcut.action}
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer le raccourci
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Utilisation récente</span>
                </div>
                <div className="text-2xl font-bold">{stats.recent}</div>
                <div className="text-sm text-muted-foreground">Cette semaine</div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">Appris automatiquement</span>
                </div>
                <div className="text-2xl font-bold">{stats.learned}</div>
                <div className="text-sm text-muted-foreground">Par l'IA</div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Temps économisé</span>
                </div>
                <div className="text-2xl font-bold">~{Math.round(stats.total * 2.5)}s</div>
                <div className="text-sm text-muted-foreground">Par jour</div>
              </Card>
            </div>

            <Card className="p-4">
              <h3 className="font-medium mb-4">Raccourcis les plus utilisés</h3>
              <div className="space-y-2">
                {shortcuts
                  .sort((a, b) => b.frequency - a.frequency)
                  .slice(0, 5)
                  .map((shortcut, index) => (
                    <div key={shortcut.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span>{shortcut.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {shortcut.frequency} utilisations
                        </span>
                        <Badge variant="outline" className="font-mono">
                          {shortcut.keys}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};