import { useAuth } from '@/contexts/AuthContext';
import { UserPreferences } from '../hooks/useDailyMissions';

interface DashboardHeaderProps {
  preferences: UserPreferences | null;
  totalPoints: number;
  completedMissions: number;
  totalMissions: number;
}

export function DashboardHeader({ 
  preferences, 
  totalPoints, 
  completedMissions, 
  totalMissions 
}: DashboardHeaderProps) {
  const { profile } = useAuth();

  const getGreetingMessage = () => {
    if (preferences?.experience === 'beginner') {
      return "Découvrons ensemble les possibilités de la plateforme";
    }
    if (preferences?.experience === 'expert') {
      return "Votre tableau de bord avancé vous attend";
    }
    return "Prêt pour une journée productive ?";
  };

  return (
    <div className="bg-gradient-hero rounded-lg p-6 text-white shadow-dramatic">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            Bonjour, {profile?.first_name || 'Collaborateur'} ! 👋
          </h1>
          <p className="text-white/90 text-lg">
            {getGreetingMessage()}
          </p>
        </div>
        
        {/* Progression du jour */}
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{totalPoints}</div>
          <div className="text-sm text-white/80">Points aujourd'hui</div>
          <div className="text-xs text-white/70 mt-1">
            {completedMissions}/{totalMissions} missions
          </div>
        </div>
      </div>
    </div>
  );
}