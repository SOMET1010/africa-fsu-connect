import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface DailyMission {
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

export interface UserPreferences {
  experience: 'beginner' | 'intermediate' | 'expert';
  primaryGoals: string[];
  workStyle: 'individual' | 'collaborative' | 'management';
  challenges: string;
}

export function useDailyMissions() {
  const { profile } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('userOnboardingPreferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  const generateMissions = (): DailyMission[] => {
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

  const missions = generateMissions();
  const completedMissions = missions.filter(m => m.completed).length;
  const totalPoints = missions.filter(m => m.completed).reduce((sum, m) => sum + m.points, 0);

  return {
    missions,
    completedMissions,
    totalPoints,
    preferences
  };
}