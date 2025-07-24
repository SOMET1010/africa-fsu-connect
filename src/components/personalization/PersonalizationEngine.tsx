import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Target, 
  Zap,
  Users,
  Eye,
  Settings,
  BookOpen,
  Heart
} from 'lucide-react';
import { useAdvancedPersonalization } from '@/hooks/useAdvancedPersonalization';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useAuth } from '@/contexts/AuthContext';

interface LearningInsight {
  id: string;
  type: 'usage' | 'preference' | 'efficiency' | 'collaboration';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  suggestion?: string;
  data?: any;
}

interface PersonalizationMetrics {
  engagementScore: number;
  efficiencyGain: number;
  learningProgress: number;
  adaptationRate: number;
  satisfactionIndex: number;
}

export const PersonalizationEngine = () => {
  const { learningData, generateSuggestions, trackUserAction } = useAdvancedPersonalization();
  const { preferences } = useUserPreferences();
  const { user } = useAuth();
  
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [metrics, setMetrics] = useState<PersonalizationMetrics>({
    engagementScore: 0,
    efficiencyGain: 0,
    learningProgress: 0,
    adaptationRate: 0,
    satisfactionIndex: 0
  });
  const [isLearning, setIsLearning] = useState(true);
  const [autoOptimize, setAutoOptimize] = useState(true);

  // Génération d'insights basés sur les données d'apprentissage
  useEffect(() => {
    if (!learningData.actions) return;

    const generateInsights = () => {
      const newInsights: LearningInsight[] = [];
      const actions = learningData.actions || [];
      const frequency = learningData.frequency || {};

      // Analyse des patterns d'usage
      const hourlyUsage = actions.reduce((acc, action) => {
        const hour = new Date(action.timestamp).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      const peakHour = Object.entries(hourlyUsage)
        .reduce((a, b) => hourlyUsage[a[0]] > hourlyUsage[b[0]] ? a : b)[0];

      if (parseInt(peakHour) < 10) {
        newInsights.push({
          id: 'early-bird',
          type: 'usage',
          title: 'Utilisateur matinal détecté',
          description: `Votre pic d'activité est à ${peakHour}h. Considérez un thème clair optimisé.`,
          confidence: 85,
          impact: 'medium',
          actionable: true,
          suggestion: 'Activer le mode jour automatique le matin'
        });
      }

      // Analyse de l'efficacité
      const frequentActions = Object.entries(frequency)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 3);

      if (frequentActions.length > 0) {
        newInsights.push({
          id: 'efficiency-opportunity',
          type: 'efficiency',
          title: 'Opportunité d\'efficacité détectée',
          description: `Actions fréquentes: ${frequentActions.map(([action]) => action).join(', ')}`,
          confidence: 92,
          impact: 'high',
          actionable: true,
          suggestion: 'Créer des raccourcis pour ces actions',
          data: { actions: frequentActions }
        });
      }

      // Analyse des préférences
      if (preferences.accessibility.reduceMotion && preferences.layout.animationsEnabled) {
        newInsights.push({
          id: 'accessibility-conflict',
          type: 'preference',
          title: 'Conflit de préférences détecté',
          description: 'Les animations sont activées mais vous avez choisi de réduire les mouvements',
          confidence: 100,
          impact: 'medium',
          actionable: true,
          suggestion: 'Désactiver les animations pour une meilleure expérience'
        });
      }

      // Analyse collaborative
      const collaborativeActions = actions.filter(action => 
        ['forum', 'events', 'collaboration'].some(keyword => 
          action.action.includes(keyword)
        )
      );

      if (collaborativeActions.length > actions.length * 0.3) {
        newInsights.push({
          id: 'collaborative-user',
          type: 'collaboration',
          title: 'Profil collaboratif identifié',
          description: 'Vous utilisez fréquemment les fonctionnalités collaboratives',
          confidence: 88,
          impact: 'medium',
          actionable: true,
          suggestion: 'Activer les notifications en temps réel pour les discussions'
        });
      }

      setInsights(newInsights);
    };

    generateInsights();
  }, [learningData, preferences]);

  // Calcul des métriques de personnalisation
  useEffect(() => {
    const calculateMetrics = () => {
      const actions = learningData.actions || [];
      const totalActions = actions.length;
      
      // Score d'engagement (basé sur la fréquence d'utilisation)
      const today = new Date();
      const recentActions = actions.filter(action => 
        new Date(action.timestamp) > new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      ).length;
      const engagementScore = Math.min((recentActions / 50) * 100, 100);

      // Gain d'efficacité (basé sur les raccourcis et personnalisations)
      const customPrefs = Object.keys(preferences.dashboard.favoriteWidgets || []).length;
      const efficiencyGain = Math.min((customPrefs / 5) * 100, 100);

      // Progrès d'apprentissage (basé sur les insights générés)
      const learningProgress = Math.min((insights.length / 10) * 100, 100);

      // Taux d'adaptation (basé sur l'acceptation des suggestions)
      const adaptationRate = Math.random() * 100; // Placeholder - would track actual suggestion acceptance

      // Index de satisfaction (calculé à partir des métriques)
      const satisfactionIndex = (engagementScore + efficiencyGain + learningProgress + adaptationRate) / 4;

      setMetrics({
        engagementScore: Math.round(engagementScore),
        efficiencyGain: Math.round(efficiencyGain),
        learningProgress: Math.round(learningProgress),
        adaptationRate: Math.round(adaptationRate),
        satisfactionIndex: Math.round(satisfactionIndex)
      });
    };

    calculateMetrics();
  }, [learningData, preferences, insights]);

  const applyInsightSuggestion = (insight: LearningInsight) => {
    // Logique d'application des suggestions basée sur le type
    switch (insight.id) {
      case 'early-bird':
        // Activer le thème automatique
        break;
      case 'efficiency-opportunity':
        // Créer des raccourcis
        break;
      case 'accessibility-conflict':
        // Résoudre le conflit de préférences
        break;
      case 'collaborative-user':
        // Activer les notifications
        break;
    }
    
    trackUserAction('apply_insight_suggestion', { insightId: insight.id });
  };

  const getInsightIcon = (type: LearningInsight['type']) => {
    switch (type) {
      case 'usage': return Clock;
      case 'preference': return Settings;
      case 'efficiency': return Zap;
      case 'collaboration': return Users;
      default: return Brain;
    }
  };

  const getImpactColor = (impact: LearningInsight['impact']) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Moteur de personnalisation IA
            </CardTitle>
            <CardDescription>
              Apprentissage automatique de vos préférences et habitudes
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium">Score global</div>
              <div className="text-2xl font-bold text-primary">
                {metrics.satisfactionIndex}%
              </div>
            </div>
            <Switch
              checked={isLearning}
              onCheckedChange={setIsLearning}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="insights">
              Insights
              {insights.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {insights.filter(i => i.actionable).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="metrics">Métriques</TabsTrigger>
            <TabsTrigger value="learning">Apprentissage</TabsTrigger>
            <TabsTrigger value="settings">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-4">
            <div className="space-y-3">
              {insights.length === 0 ? (
                <Card className="p-8 text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">L'IA apprend vos habitudes</h3>
                  <p className="text-sm text-muted-foreground">
                    Continuez à utiliser l'application pour recevoir des insights personnalisés
                  </p>
                </Card>
              ) : (
                insights.map((insight) => {
                  const IconComponent = getInsightIcon(insight.type);
                  return (
                    <Card key={insight.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <IconComponent className="h-5 w-5 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{insight.title}</h3>
                              <Badge variant="outline" className={getImpactColor(insight.impact)}>
                                {insight.impact}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {insight.description}
                            </p>
                            {insight.suggestion && (
                              <p className="text-sm font-medium text-primary">
                                💡 {insight.suggestion}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {insight.confidence}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              confiance
                            </div>
                          </div>
                          
                          {insight.actionable && (
                            <Button
                              size="sm"
                              onClick={() => applyInsightSuggestion(insight)}
                            >
                              Appliquer
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="font-medium">Engagement</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Score</span>
                    <span className="font-medium">{metrics.engagementScore}%</span>
                  </div>
                  <Progress value={metrics.engagementScore} className="h-2" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Efficacité</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Gain</span>
                    <span className="font-medium">{metrics.efficiencyGain}%</span>
                  </div>
                  <Progress value={metrics.efficiencyGain} className="h-2" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">Apprentissage</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Progrès</span>
                    <span className="font-medium">{metrics.learningProgress}%</span>
                  </div>
                  <Progress value={metrics.learningProgress} className="h-2" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Adaptation</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Taux</span>
                    <span className="font-medium">{metrics.adaptationRate}%</span>
                  </div>
                  <Progress value={metrics.adaptationRate} className="h-2" />
                </div>
              </Card>
            </div>

            <Card className="p-4">
              <h3 className="font-medium mb-4">Évolution dans le temps</h3>
              <div className="space-y-3">
                {/* Placeholder pour un graphique d'évolution */}
                <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Graphique d'évolution des métriques
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="learning" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-medium mb-4">Données d'apprentissage</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {learningData.actions?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Actions trackées</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Object.keys(learningData.frequency || {}).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Actions uniques</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {insights.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Insights générés</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-medium mb-4">Actions les plus fréquentes</h3>
              <div className="space-y-2">
                {Object.entries(learningData.frequency || {})
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .slice(0, 5)
                  .map(([action, frequency], index) => (
                    <div key={action} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span className="capitalize">{action.replace('_', ' ')}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {frequency} fois
                      </span>
                    </div>
                  ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-medium mb-4">Configuration de l'IA</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Apprentissage automatique</span>
                    <p className="text-sm text-muted-foreground">
                      Permettre à l'IA d'apprendre de vos actions
                    </p>
                  </div>
                  <Switch checked={isLearning} onCheckedChange={setIsLearning} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Optimisation automatique</span>
                    <p className="text-sm text-muted-foreground">
                      Appliquer automatiquement certaines suggestions
                    </p>
                  </div>
                  <Switch checked={autoOptimize} onCheckedChange={setAutoOptimize} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Suggestions proactives</span>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des suggestions avant même de les demander
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Partage d'insights équipe</span>
                    <p className="text-sm text-muted-foreground">
                      Partager les insights anonymisés avec votre équipe
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-medium mb-4">Gestion des données</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Voir toutes mes données
                </Button>
                <Button variant="outline" className="w-full">
                  Exporter mes données
                </Button>
                <Button variant="destructive" className="w-full">
                  Effacer l'historique d'apprentissage
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};