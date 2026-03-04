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
import { HomeMemberMap } from "../home/HomeMemberMap";
import { motion } from "framer-motion";
import { useAfricanCountries } from "@/hooks/useCountries";
import { getCountryActivity, ACTIVITY_LEVELS, type ActivityLevel } from "@/components/map/activityData";
import { t } from "i18next";


const LEGEND_ITEMS: { level: ActivityLevel; label: string }[] = [
    { level: 'high', label: 'label.legend.activity.high' },
    { level: 'medium', label: 'label.legend.activity.medium' },
    { level: 'onboarding', label: 'label.legend.activity.onboarding' },
];

export function NetworkDashboard() {
    const navigate = useNavigate();
    const { kpis, kpisLoading, recentActivity, activityLoading } = useUserDashboardKPIs();
    const { resetTour } = useUserOnboardingTour();

    const { data: countries = [] } = useAfricanCountries();

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



    const countByLevel = (level: ActivityLevel): number =>
        countries.filter((c) => getCountryActivity(c.code).level === level).length;

    return (
        <NexusLayout>
            <div className="container mx-auto px-4 py-6 space-y-6 pb-20">
                {/* Hero de bienvenue réseau + replay button */}
                <div className="relative" data-tour="user-hero">
                    <DashboardHero />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={resetTour}
                        className="absolute top-4 right-4 z-10 text-white/60 hover:text-white hover:bg-white/20"
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





                {/* Affichage de la carte*/}
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
                    <div className="relative rounded-xl border border-gray-200 overflow-hidden bg-gray-900" style={{ height: 'clamp(280px, 40vw, 480px)', zIndex: 10 }}>
                        {countries.length > 0 && (
                            <HomeMemberMap countries={countries} mode="members" />
                        )}
                    </div>
                    {/* Legend */}
                    <div className="flex items-center justify-center gap-4 mt-3">
                        {LEGEND_ITEMS.map(({ level, label }) => (
                            <div key={level} className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ACTIVITY_LEVELS[level].color }} />
                                <span className="text-[11px] text-gray-500">{t(label)} ({countByLevel(level)})</span>
                            </div>
                        ))}
                    </div>
                </motion.div>








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
                {/*<div data-tour="user-projects">
          <InspiringProjects 
            onViewProject={handleViewProject}
            onContactCountry={handleContactCountry}
          />
        </div>*}
        
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
