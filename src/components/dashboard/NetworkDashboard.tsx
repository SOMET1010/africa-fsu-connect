import { useNavigate } from "react-router-dom";
import { NetworkHero } from "./components/NetworkHero";
import { NetworkSummary } from "./components/NetworkSummary";
import { InspiringProjects } from "./components/InspiringProjects";
import { RecentResources } from "./components/RecentResources";
import { UpcomingEvents } from "./components/UpcomingEvents";
import { NetworkActivityWidget } from "./widgets/NetworkActivityWidget";
import { DashboardMapWidget } from "./widgets/DashboardMapWidget";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function NetworkDashboard() {
  const navigate = useNavigate();

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
    // TODO: Implement contact modal
    console.log('Contact country:', country);
  };

  const handleViewResource = (resourceId: string) => {
    navigate(`/resources?id=${resourceId}`);
  };

  const handleViewEvent = (eventId: string) => {
    navigate(`/community?tab=events&id=${eventId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Hero de bienvenue réseau */}
        <NetworkHero />
        
        {/* Synthèse narrative du réseau */}
        <NetworkSummary 
          countriesCount={stats?.countriesCount}
          projectsCount={stats?.projectsCount}
          collaborationOpportunities={3}
        />
        
        {/* Carte + Activités récentes */}
        <div className="grid gap-6 lg:grid-cols-2">
          <DashboardMapWidget />
          <NetworkActivityWidget onViewAll={() => navigate('/community')} />
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
            onViewAll={() => navigate('/community?tab=events')}
          />
        </div>
      </div>
    </div>
  );
}

export default NetworkDashboard;
