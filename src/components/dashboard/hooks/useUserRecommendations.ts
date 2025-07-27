import { Calendar, Users } from 'lucide-react';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  action: {
    text: string;
    href: string;
  };
}

export function useUserRecommendations() {
  const getRecommendations = (): Recommendation[] => {
    return [
      {
        id: 'training',
        title: 'Formation "Gestion de projet"',
        description: 'Basé sur vos objectifs, cette formation pourrait vous intéresser',
        icon: Calendar,
        iconColor: 'text-blue-500',
        action: {
          text: 'En savoir plus',
          href: '/events?recommended=project-management'
        }
      },
      {
        id: 'team',
        title: 'Équipe "Innovation Numérique"',
        description: '3 collègues avec des intérêts similaires',
        icon: Users,
        iconColor: 'text-green-500',
        action: {
          text: 'Rejoindre',
          href: '/organizations?recommended=digital-innovation'
        }
      }
    ];
  };

  return {
    recommendations: getRecommendations()
  };
}