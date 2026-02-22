import { useNavigate } from "react-router-dom";
import { DashboardHero } from "./components/DashboardHero";
import { NetworkSummary } from "./components/NetworkSummary";
import { InspiringProjects } from "./components/InspiringProjects";
import { RecentResources } from "./components/RecentResources";
import { UpcomingEvents } from "./components/UpcomingEvents";
import { DashboardMapWidget } from "./widgets/DashboardMapWidget";
import { UserKPICards } from "./widgets/UserKPICards";
import { UserRecentActivity } from "./widgets/UserRecentActivity";
import { NexusLayout } from "@/components/layout/NexusLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserDashboardKPIs } from "@/hooks/useUserDashboardKPIs";
import { useUserOnboardingTour } from "@/hooks/useUserOnboardingTour";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NetworkDashboard() {
  const navigate = useNavigate();
  const { kpis, kpisLoading, recentActivity, activityLoading } = useUserDashboardKPIs();
  const { resetTour } = useUserOnboardingTour();

  // Fetch network stats
  const { data: stats } = useQuery({
    queryKey: ['network-stats'],
    queryFn: async () => {
      const [countriesResult, projectsResult] = await Promise.all([
        supabase.from('countries').select('id', { count: 'exact', head: true }),
        supabase.from('agency_projects').select('id', { count: 'exact', head: true })
      ]);
      return {
        countriesCount: countriesResult.count || 30,
        projectsCount: projectsResult.count || 45
      };
    }
  });

  const handleViewProject = (projectId: string) => {
    navigate(`/projects?id=${projectId}`);
  };

  const handleContactCountry = (country: string) => {
    console.log('Contact country:', country);
  };

  const handleViewResource = (resourceId: string) => {
    navigate(`/resources?id=${resourceId}`);
  };

  const handleViewEvent = (eventId: string) => {
    navigate(`/events?id=${eventId}`);
  };

  return (
    <NexusLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Hero de bienvenue réseau + replay button */}
        <div className="relative" data-tour="user-hero">
          <DashboardHero />
          <Button
            variant="ghost"
            size="icon"
            onClick={resetTour}
            className="absolute top-4 right-4 z-10 text-white/50 hover:text-white hover:bg-white/10"
            title="Replay tour"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>

        {/* KPI Cards utilisateur */}
        <div data-tour="user-kpis">
          <UserKPICards kpis={kpis} loading={kpisLoading} />
        </div>
        
        {/* Synthèse narrative du réseau */}
        <NetworkSummary 
          countriesCount={stats?.countriesCount}
          projectsCount={stats?.projectsCount}
          collaborationOpportunities={3}
        />
        
        {/* Carte + Activité récente utilisateur */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div data-tour="user-map">
            <DashboardMapWidget />
          </div>
          <UserRecentActivity
            activities={recentActivity}
            loading={activityLoading}
            onViewAll={() => navigate('/activity')}
          />
        </div>
        
        {/* Projets inspirants */}
        <div data-tour="user-projects">
          <InspiringProjects 
            onViewProject={handleViewProject}
            onContactCountry={handleContactCountry}
          />
        </div>
        
        {/* Ressources + Événements */}
        <div className="grid gap-6 md:grid-cols-2" data-tour="user-resources">
          <RecentResources 
            onViewResource={handleViewResource}
            onViewAll={() => navigate('/resources')}
          />
          <UpcomingEvents 
            onViewEvent={handleViewEvent}
            onViewAll={() => navigate('/events')}
          />
        </div>
      </div>
    </NexusLayout>
  );
}

export default NetworkDashboard;
