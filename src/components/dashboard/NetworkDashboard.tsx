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

export function NetworkDashboard() {
  const navigate = useNavigate();
  const { kpis, kpisLoading, recentActivity, activityLoading } = useUserDashboardKPIs();

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
        {/* Hero de bienvenue réseau */}
        <DashboardHero />

        {/* KPI Cards utilisateur */}
        <UserKPICards kpis={kpis} loading={kpisLoading} />
        
        {/* Synthèse narrative du réseau */}
        <NetworkSummary 
          countriesCount={stats?.countriesCount}
          projectsCount={stats?.projectsCount}
          collaborationOpportunities={3}
        />
        
        {/* Carte + Activité récente utilisateur */}
        <div className="grid gap-6 lg:grid-cols-2">
          <DashboardMapWidget />
          <UserRecentActivity
            activities={recentActivity}
            loading={activityLoading}
            onViewAll={() => navigate('/community')}
          />
        </div>
        
        {/* Projets inspirants */}
        <InspiringProjects 
          onViewProject={handleViewProject}
          onContactCountry={handleContactCountry}
        />
        
        {/* Ressources + Événements */}
        <div className="grid gap-6 md:grid-cols-2">
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
