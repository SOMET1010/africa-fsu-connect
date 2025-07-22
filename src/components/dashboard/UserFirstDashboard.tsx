
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Lightbulb, 
  Calendar, 
  Users, 
  FileText, 
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Zap,
  TrendingUp,
  Clock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useSearchParams } from "react-router-dom";

interface UserPreferences {
  experience: 'beginner' | 'intermediate' | 'expert';
  primaryGoals: string[];
  workStyle: 'individual' | 'collaborative' | 'management';
  challenges: string;
}

interface DailyMission {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  category: string;
  action: {
    type: 'navigate' | 'external';
    target: string;
  };
}

interface WorkspaceCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  href: string;
  badge?: string;
  items: Array<{
    title: string;
    count: number;
    href: string;
  }>;
}

export function UserFirstDashboard() {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  
  useEffect(() => {
    const saved = localStorage.getItem('userOnboardingPreferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
    
    if (searchParams.get('onboarding') === 'completed') {
      setShowWelcome(true);
      // Remove the parameter from URL
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [searchParams]);
  
  // Missions quotidiennes basées sur les préférences utilisateur
  const getDailyMissions = (): DailyMission[] => {
    const baseMissions: DailyMission[] = [
      {
        id: 'profile',
        title: 'Complétez votre profil',
        description: 'Ajoutez une photo et vos informations',
        points: 50,
        completed: !!(profile?.first_name && profile?.last_name),
        category: 'Setup',
        action: { type: 'navigate', target: '/profile' }
      },
      {
        id: 'first-project',
        title: 'Créez votre premier projet',
        description: 'Partagez une initiative avec la communauté',
        points: 100,
        completed: false,
        category: 'Action',
        action: { type: 'navigate', target: '/projects?action=create' }
      },
      {
        id: 'join-discussion',
        title: 'Participez à une discussion',
        description: 'Rejoignez une conversation sur le forum',
        points: 30,
        completed: false,
        category: 'Social',
        action: { type: 'navigate', target: '/forum' }
      }
    ];
    
    // Ajouter des missions basées sur les objectifs utilisateur
    if (preferences?.primaryGoals.includes('collaboration')) {
      baseMissions.push({
        id: 'team-contact',
        title: 'Contactez un collègue',
        description: 'Établissez une nouvelle connexion',
        points: 40,
        completed: false,
        category: 'Network',
        action: { type: 'navigate', target: '/organizations' }
      });
    }
    
    return baseMissions;
  };
  
  // Espaces de travail personnalisés
  const getWorkspaces = (): WorkspaceCard[] => {
    const baseWorkspaces: WorkspaceCard[] = [
      {
        id: 'my-work',
        title: 'Mon Travail',
        description: 'Mes projets et tâches en cours',
        icon: Target,
        color: 'bg-blue-50 border-blue-200',
        href: '/projects',
        badge: '3 en cours',
        items: [
          { title: 'Projets actifs', count: 3, href: '/projects?filter=active' },
          { title: 'Tâches du jour', count: 5, href: '/projects?view=tasks' },
          { title: 'Échéances proches', count: 2, href: '/projects?view=deadlines' }
        ]
      },
      {
        id: 'collaboration',
        title: 'Collaboration',
        description: 'Équipe et communications',
        icon: Users,
        color: 'bg-green-50 border-green-200',
        href: '/forum',
        badge: '2 nouveaux',
        items: [
          { title: 'Messages non lus', count: 8, href: '/forum?filter=unread' },
          { title: 'Équipes actives', count: 4, href: '/organizations' },
          { title: 'Invitations', count: 1, href: '/organizations?view=invites' }
        ]
      },
      {
        id: 'discovery',
        title: 'Découverte',
        description: 'Ressources et opportunités',
        icon: Lightbulb,
        color: 'bg-purple-50 border-purple-200',
        href: '/resources',
        badge: 'Nouveau',
        items: [
          { title: 'Nouvelles ressources', count: 12, href: '/resources?filter=new' },
          { title: 'Événements', count: 5, href: '/events' },
          { title: 'Formations', count: 3, href: '/events?type=training' }
        ]
      }
    ];
    
    return baseWorkspaces;
  };
  
  const dailyMissions = getDailyMissions();
  const workspaces = getWorkspaces();
  const completedMissions = dailyMissions.filter(m => m.completed).length;
  const totalPoints = dailyMissions.filter(m => m.completed).reduce((sum, m) => sum + m.points, 0);
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Message de bienvenue après onboarding */}
      {showWelcome && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-green-800">Configuration terminée !</h3>
                <p className="text-green-700 text-sm">
                  Votre espace de travail a été personnalisé selon vos préférences. 
                  Explorez vos nouvelles fonctionnalités ci-dessous.
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowWelcome(false)}
                className="text-green-700 hover:bg-green-100"
              >
                ×
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* En-tête personnalisé */}
      <div className="bg-gradient-hero rounded-lg p-6 text-white shadow-dramatic">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              Bonjour, {profile?.first_name || 'Collaborateur'} ! 👋
            </h1>
            <p className="text-white/90 text-lg">
              {preferences?.experience === 'beginner' 
                ? "Découvrons ensemble les possibilités de la plateforme"
                : preferences?.experience === 'expert'
                  ? "Votre tableau de bord avancé vous attend"
                  : "Prêt pour une journée productive ?"
              }
            </p>
          </div>
          
          {/* Progression du jour */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{totalPoints}</div>
            <div className="text-sm text-white/80">Points aujourd'hui</div>
            <div className="text-xs text-white/70 mt-1">
              {completedMissions}/{dailyMissions.length} missions
            </div>
          </div>
        </div>
      </div>
      
      {/* Missions quotidiennes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Vos missions du jour
            <Badge variant="secondary">{dailyMissions.length - completedMissions} restantes</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {dailyMissions.slice(0, 3).map((mission) => (
              <div
                key={mission.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  mission.completed 
                    ? 'bg-green-50 border-green-200 opacity-75' 
                    : 'bg-card hover:shadow-sm cursor-pointer'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    mission.completed ? 'bg-green-100' : 'bg-primary/10'
                  }`}>
                    {mission.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Target className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${mission.completed ? 'text-green-700' : 'text-foreground'}`}>
                      {mission.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {mission.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="text-xs">
                    +{mission.points} pts
                  </Badge>
                  {!mission.completed && (
                    <Link to={mission.action.target}>
                      <Button size="sm" variant="outline">
                        Faire
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Espaces de travail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {workspaces.map((workspace) => {
          const Icon = workspace.icon;
          return (
            <Card key={workspace.id} className={`${workspace.color} hover:shadow-lg transition-all duration-200 cursor-pointer group`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg">{workspace.title}</CardTitle>
                  </div>
                  {workspace.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {workspace.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{workspace.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {workspace.items.map((item, index) => (
                  <Link 
                    key={index} 
                    to={item.href}
                    className="flex items-center justify-between p-2 rounded hover:bg-white/50 transition-colors"
                  >
                    <span className="text-sm font-medium">{item.title}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {item.count}
                      </Badge>
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
                
                <Link to={workspace.href} className="block">
                  <Button variant="ghost" className="w-full mt-2 group-hover:bg-white/30">
                    Voir tout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Recommandations intelligentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Recommandations pour vous
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-blue-500 mt-1" />
                <div>
                  <h4 className="font-medium">Formation "Gestion de projet"</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Basé sur vos objectifs, cette formation pourrait vous intéresser
                  </p>
                  <Link to="/events?recommended=project-management">
                    <Button size="sm" variant="outline">
                      En savoir plus
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-medium">Équipe "Innovation Numérique"</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    3 collègues avec des intérêts similaires
                  </p>
                  <Link to="/organizations?recommended=digital-innovation">
                    <Button size="sm" variant="outline">
                      Rejoindre
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
