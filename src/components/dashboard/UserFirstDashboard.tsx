
// Dashboard hooks
import { useDailyMissions } from './hooks/useDailyMissions';
import { useWorkspaceData } from './hooks/useWorkspaceData';
import { useUserRecommendations } from './hooks/useUserRecommendations';
import { useUserOnboarding } from './hooks/useUserOnboarding';

// Dashboard components
import { DashboardHeader } from './components/DashboardHeader';
import { DailyMissionsList } from './components/DailyMissionsList';
import { WorkspaceGrid } from './components/WorkspaceGrid';
import { RecommendationCard } from './components/RecommendationCard';
import { WelcomeMessage } from './components/WelcomeMessage';

export function UserFirstDashboard() {
  // Hooks
  const { missions, completedMissions, totalPoints, preferences } = useDailyMissions();
  const { workspaces } = useWorkspaceData();
  const { recommendations } = useUserRecommendations();
  const { showWelcome, dismissWelcome } = useUserOnboarding();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Message de bienvenue après onboarding */}
      <WelcomeMessage show={showWelcome} onDismiss={dismissWelcome} />
      
      {/* En-tête personnalisé */}
      <DashboardHeader 
        preferences={preferences}
        totalPoints={totalPoints}
        completedMissions={completedMissions}
        totalMissions={missions.length}
      />
      
      {/* Missions quotidiennes */}
      <DailyMissionsList 
        missions={missions}
        completedCount={completedMissions}
      />
      
      {/* Espaces de travail */}
      <WorkspaceGrid workspaces={workspaces} />
      
      {/* Recommandations intelligentes */}
      <RecommendationCard recommendations={recommendations} />
    </div>
  );
}
