import { DailyMission, UserPreferences } from '../hooks/useDailyMissions';

export class MissionService {
  static generateBaseMissions(profileCompleted: boolean): DailyMission[] {
    return [
      {
        id: 'profile',
        title: 'Complétez votre profil',
        description: 'Ajoutez une photo et vos informations',
        points: 50,
        completed: profileCompleted,
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
  }

  static generatePersonalizedMissions(preferences: UserPreferences | null): DailyMission[] {
    const missions: DailyMission[] = [];

    if (preferences?.primaryGoals.includes('collaboration')) {
      missions.push({
        id: 'team-contact',
        title: 'Contactez un collègue',
        description: 'Établissez une nouvelle connexion',
        points: 40,
        completed: false,
        category: 'Network',
        action: { type: 'navigate', target: '/organizations' }
      });
    }

    if (preferences?.experience === 'beginner') {
      missions.push({
        id: 'explore-platform',
        title: 'Explorez la plateforme',
        description: 'Visitez au moins 3 sections différentes',
        points: 25,
        completed: false,
        category: 'Discovery',
        action: { type: 'navigate', target: '/resources' }
      });
    }

    return missions;
  }

  static calculateProgress(missions: DailyMission[]): {
    completedCount: number;
    totalPoints: number;
    completionRate: number;
  } {
    const completed = missions.filter(m => m.completed);
    const completedCount = completed.length;
    const totalPoints = completed.reduce((sum, m) => sum + m.points, 0);
    const completionRate = missions.length > 0 ? (completedCount / missions.length) * 100 : 0;

    return { completedCount, totalPoints, completionRate };
  }

  static markMissionCompleted(missions: DailyMission[], missionId: string): DailyMission[] {
    return missions.map(mission =>
      mission.id === missionId ? { ...mission, completed: true } : mission
    );
  }
}