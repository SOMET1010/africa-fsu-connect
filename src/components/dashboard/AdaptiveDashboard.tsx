import { useCallback } from "react";
import { 
  Users, 
  FileText,
  Calendar,
  Send,
  Target,
  BookOpen
} from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useDashboardLayout } from "@/hooks/useDashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { StatsWidget } from "./widgets/StatsWidget";
import { RegionalProgressWidget } from "./widgets/RegionalProgressWidget";
import { RecentActivityWidget } from "./widgets/RecentActivityWidget";
import { QuickActionsWidget } from "./widgets/QuickActionsWidget";
import { Button } from "@/components/ui/button";
import { Settings, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AdaptiveDashboard = () => {
  const { stats, loading } = useDashboardStats();
  const { profile } = useAuth();
  const isMobile = useIsMobile();
  const { enabledWidgets, removeWidget, resetLayout, isLoading } = useDashboardLayout();
  const { toast } = useToast();

  // Stats data with clickable interaction
  const displayStats = [
    {
      title: "Utilisateurs Actifs",
      value: stats.totalProfiles.toString(),
      change: "Total inscrits",
      icon: Users,
      color: "text-primary",
      clickable: true,
      onStatClick: () => toast({ title: "Détails des utilisateurs", description: "Redirection vers la gestion des utilisateurs" })
    },
    {
      title: "Documents Partagés", 
      value: stats.totalDocuments.toString(),
      change: `+${stats.documentsThisMonth} ce mois`,
      icon: FileText,
      color: "text-secondary",
      clickable: true,
      onStatClick: () => toast({ title: "Détails des documents", description: "Redirection vers la bibliothèque" })
    },
    {
      title: "Événements",
      value: stats.totalEvents.toString(),
      change: `+${stats.eventsThisMonth} ce mois`,
      icon: Calendar,
      color: "text-accent-foreground",
      clickable: true,
      onStatClick: () => toast({ title: "Détails des événements", description: "Redirection vers le calendrier" })
    },
    {
      title: "Soumissions",
      value: stats.totalSubmissions.toString(),
      change: "En attente de révision",
      icon: Send,
      color: "text-muted-foreground",
      clickable: true,
      onStatClick: () => toast({ title: "Détails des soumissions", description: "Redirection vers les soumissions" })
    }
  ];

  // Regional data (mock for demo)
  const regions = [
    { name: "CEDEAO", projects: 342, completion: 78 },
    { name: "SADC", projects: 289, completion: 82 },
    { name: "EACO", projects: 198, completion: 71 },
    { name: "ECCAS", projects: 156, completion: 65 },
    { name: "UMA", projects: 143, completion: 89 }
  ];

  // Recent activities
  const recentActivities = [
    {
      title: "Nouveau projet au Sénégal",
      description: "Lancement du projet 'Villages Connectés 2025'",
      time: "Il y a 2 heures",
      type: "project" as const
    },
    {
      title: "Rapport annuel CEDEAO",
      description: "Publication du rapport 2024 sur l'inclusion numérique",
      time: "Il y a 5 heures",
      type: "report" as const
    },
    {
      title: "Formation en ligne",
      description: "Nouvelle session 'Gestion des FSU' disponible",
      time: "Il y a 1 jour",
      type: "training" as const
    }
  ];

  // Quick actions based on user role
  const getQuickActions = useCallback(() => {
    const baseActions = [
      {
        id: 'view-docs',
        label: 'Consulter les Ressources',
        icon: BookOpen,
        variant: 'outline' as const,
        onClick: () => toast({ title: "Navigation", description: "Redirection vers les ressources" })
      }
    ];

    if (profile?.role === 'contributeur' || profile?.role === 'editeur' || profile?.role === 'admin_pays' || profile?.role === 'super_admin') {
      baseActions.unshift({
        id: 'new-project',
        label: 'Nouveau Projet FSU',
        icon: Target,
        variant: undefined,
        onClick: () => toast({ title: "Nouveau projet", description: "Redirection vers la création de projet" })
      });
    }

    if (profile?.role === 'editeur' || profile?.role === 'admin_pays' || profile?.role === 'super_admin') {
      baseActions.push({
        id: 'schedule-event',
        label: 'Planifier Événement',
        icon: Calendar,
        variant: 'outline' as const,
        onClick: () => toast({ title: "Nouvel événement", description: "Redirection vers la planification" })
      });
    }

    return baseActions;
  }, [profile?.role, toast]);

  const handleRegionClick = (region: any) => {
    toast({ 
      title: `Région ${region.name}`, 
      description: `${region.projects} projets - ${region.completion}% complétés` 
    });
  };

  const handleActivityClick = (activity: any) => {
    toast({ 
      title: activity.title, 
      description: "Redirection vers le détail de l'activité" 
    });
  };

  const handleResetLayout = () => {
    resetLayout();
    toast({ 
      title: "Disposition réinitialisée", 
      description: "La disposition par défaut a été restaurée" 
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 bg-muted rounded w-64 mb-8 animate-pulse"></div>
        <div className="grid gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with controls */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Tableau de Bord FSU Afrique
          </h1>
          <p className="text-muted-foreground">
            Vue d'ensemble des initiatives de service universel en Afrique
          </p>
        </div>
        
        {!isMobile && (
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleResetLayout}
              className="transition-all duration-200 hover:bg-muted"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="transition-all duration-200 hover:bg-muted"
            >
              <Settings className="h-4 w-4 mr-2" />
              Personnaliser
            </Button>
          </div>
        )}
      </div>

      {/* Adaptive Widget Grid */}
      <div className="space-y-6">
        {enabledWidgets.map((widget) => {
          switch (widget.type) {
            case 'stats':
              return (
                <StatsWidget
                  key={widget.id}
                  id={widget.id}
                  stats={displayStats}
                  loading={loading}
                  onRemove={removeWidget}
                />
              );
              
            case 'regional-progress':
              return (
                <RegionalProgressWidget
                  key={widget.id}
                  id={widget.id}
                  regions={regions}
                  onRemove={removeWidget}
                  onRegionClick={handleRegionClick}
                />
              );
              
            case 'recent-activity':
              return (
                <RecentActivityWidget
                  key={widget.id}
                  id={widget.id}
                  activities={recentActivities}
                  onRemove={removeWidget}
                  onViewAll={() => toast({ title: "Toutes les activités", description: "Redirection vers l'historique complet" })}
                  onActivityClick={handleActivityClick}
                />
              );
              
            case 'quick-actions':
              return (
                <QuickActionsWidget
                  key={widget.id}
                  id={widget.id}
                  actions={getQuickActions()}
                  onRemove={removeWidget}
                />
              );
              
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};