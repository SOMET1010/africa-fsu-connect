import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuickActionsWidget } from "./widgets/QuickActionsWidget";
import { RecentActivityWidget } from "./widgets/RecentActivityWidget";
import { StatsWidget } from "./widgets/StatsWidget";
import { RegionalProgressWidget } from "./widgets/RegionalProgressWidget";
import { WelcomeWidget } from "../onboarding/WelcomeWidget";
import { useProfile } from "@/hooks/useProfile";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { 
  BarChart3, 
  Users, 
  FileText, 
  Calendar,
  TrendingUp,
  Globe,
  Settings,
  Bell
} from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardSection {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  roles?: string[];
  priority: number;
}

const dashboardSections: DashboardSection[] = [
  {
    id: 'welcome',
    title: 'Bienvenue',
    component: WelcomeWidget,
    priority: 1
  },
  {
    id: 'quick-actions',
    title: 'Actions Rapides',
    component: QuickActionsWidget,
    priority: 2
  },
  {
    id: 'stats',
    title: 'Statistiques',
    component: StatsWidget,
    priority: 3
  },
  {
    id: 'recent-activity',
    title: 'Activité Récente',
    component: RecentActivityWidget,
    priority: 4
  },
  {
    id: 'regional-progress',
    title: 'Progrès Régional',
    component: RegionalProgressWidget,
    priority: 5,
    roles: ['admin_pays', 'super_admin']
  }
];

const roleBasedGreetings = {
  'super_admin': 'Tableau de bord Administrateur',
  'admin_pays': 'Vue d\'ensemble Pays',
  'editeur': 'Espace Éditeur',
  'lecteur': 'Tableau de bord Personnel'
};

const roleBasedInsights = {
  'super_admin': [
    { icon: Globe, label: 'Couverture globale', value: '54 pays' },
    { icon: Users, label: 'Utilisateurs actifs', value: '2.3k' },
    { icon: BarChart3, label: 'Projets en cours', value: '187' }
  ],
  'admin_pays': [
    { icon: FileText, label: 'Projets nationaux', value: '23' },
    { icon: Users, label: 'Équipe locale', value: '45' },
    { icon: TrendingUp, label: 'Progression', value: '+12%' }
  ],
  'editeur': [
    { icon: FileText, label: 'Documents publiés', value: '34' },
    { icon: Calendar, label: 'Événements créés', value: '8' },
    { icon: Users, label: 'Collaborations', value: '15' }
  ],
  'lecteur': [
    { icon: FileText, label: 'Ressources consultées', value: '12' },
    { icon: Calendar, label: 'Événements suivis', value: '5' },
    { icon: Bell, label: 'Notifications', value: '3' }
  ]
};

export function AdaptiveDashboard() {
  const { profile } = useProfile();
  const { stats, loading } = useDashboardStats();
  
  const userRole = profile?.role || 'lecteur';
  const greeting = roleBasedGreetings[userRole as keyof typeof roleBasedGreetings];
  const insights = roleBasedInsights[userRole as keyof typeof roleBasedInsights];

  // Prepare stats data for StatsWidget
  const statsData = [
    {
      title: "Profils",
      value: stats.totalProfiles.toString(),
      icon: Users,
      color: "text-primary",
      change: "Total dans la base"
    },
    {
      title: "Documents",
      value: stats.totalDocuments.toString(),
      icon: FileText,
      color: "text-[hsl(var(--fsu-gold))]",
      change: `+${stats.documentsThisMonth} ce mois`
    },
    {
      title: "Événements",
      value: stats.totalEvents.toString(),
      icon: Calendar,
      color: "text-[hsl(var(--fsu-blue))]",
      change: `+${stats.eventsThisMonth} ce mois`
    },
    {
      title: "Soumissions",
      value: stats.totalSubmissions.toString(),
      icon: TrendingUp,
      color: "text-secondary",
      change: "Total traité"
    }
  ];

  // Sample recent activities data
  const recentActivities = [
    {
      title: "Nouveau projet ajouté",
      description: "Projet d'infrastructure dans la région Nord",
      time: "Il y a 2 heures",
      type: "project" as const
    },
    {
      title: "Rapport mensuel publié",
      description: "Rapport de suivi des activités de janvier",
      time: "Il y a 4 heures", 
      type: "report" as const
    },
    {
      title: "Formation planifiée",
      description: "Session de formation sur les nouveaux outils",
      time: "Hier",
      type: "training" as const
    }
  ];
  
  const availableSections = dashboardSections
    .filter(section => !section.roles || section.roles.includes(userRole))
    .sort((a, b) => a.priority - b.priority);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with personalized greeting */}
      <div className="bg-gradient-hero rounded-lg p-6 text-white shadow-dramatic">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              Bonjour, {profile?.first_name || 'Utilisateur'} 👋
            </h1>
            <p className="text-white/90 text-lg">
              {greeting}
            </p>
            <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-white/30">
              {userRole.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          
          {/* Role-based quick insights */}
          <div className="grid grid-cols-3 gap-4 lg:gap-6">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="h-6 w-6 mx-auto mb-2 text-white/80" />
                  <div className="text-2xl font-bold">{insight.value}</div>
                  <div className="text-xs text-white/70">{insight.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dashboard sections grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {availableSections.map((section) => {
          const Component = section.component;
          
          // Layout configuration based on section
          const getGridClasses = (sectionId: string) => {
            switch (sectionId) {
              case 'welcome':
                return 'lg:col-span-12';
              case 'quick-actions':
                return 'lg:col-span-8';
              case 'stats':
                return 'lg:col-span-4';
              case 'recent-activity':
                return 'lg:col-span-7';
              case 'regional-progress':
                return 'lg:col-span-5';
              default:
                return 'lg:col-span-6';
            }
          };

          // Pass appropriate props based on section type
          const getComponentProps = (sectionId: string) => {
            switch (sectionId) {
              case 'stats':
                return {
                  id: 'dashboard-stats',
                  stats: statsData,
                  loading: loading
                };
              case 'recent-activity':
                return {
                  id: 'dashboard-activity',
                  activities: recentActivities,
                  onViewAll: () => console.log('View all activities'),
                  onActivityClick: (activity: any) => console.log('Activity clicked:', activity)
                };
              default:
                return {};
            }
          };

          return (
            <div key={section.id} className={`${getGridClasses(section.id)} animate-slide-up`}>
              <Component {...getComponentProps(section.id)} />
            </div>
          );
        })}
      </div>

      {/* Quick access toolbar for mobile */}
      <div className="lg:hidden fixed bottom-20 left-4 right-4 z-40">
        <Card className="bg-card/95 backdrop-blur-md border shadow-dramatic">
          <CardContent className="p-3">
            <div className="flex justify-around">
              <Link to="/projects">
                <Button size="sm" variant="ghost" className="flex-col h-auto py-2">
                  <BarChart3 className="h-4 w-4 mb-1" />
                  <span className="text-xs">Projets</span>
                </Button>
              </Link>
              <Link to="/resources">
                <Button size="sm" variant="ghost" className="flex-col h-auto py-2">
                  <FileText className="h-4 w-4 mb-1" />
                  <span className="text-xs">Docs</span>
                </Button>
              </Link>
              <Link to="/events">
                <Button size="sm" variant="ghost" className="flex-col h-auto py-2">
                  <Calendar className="h-4 w-4 mb-1" />
                  <span className="text-xs">Événements</span>
                </Button>
              </Link>
              <Link to="/preferences">
                <Button size="sm" variant="ghost" className="flex-col h-auto py-2">
                  <Settings className="h-4 w-4 mb-1" />
                  <span className="text-xs">Préfs</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}