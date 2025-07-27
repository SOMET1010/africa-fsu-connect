import { Target, Users, Lightbulb } from 'lucide-react';

export interface WorkspaceCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  href: string;
  badge?: string;
  items: Array<{
    title: string;
    count: number;
    href: string;
  }>;
}

export function useWorkspaceData() {
  const getWorkspaces = (): WorkspaceCard[] => {
    return [
      {
        id: 'my-work',
        title: 'Mon Travail',
        description: 'Mes projets et tâches en cours',
        icon: Target,
        color: 'bg-blue-50 border-blue-200',
        href: '/projects',
        badge: '3 en cours',
        items: [
          { title: 'Projets actifs', count: 3, href: '/projects?filter=active' },
          { title: 'Tâches du jour', count: 5, href: '/projects?view=tasks' },
          { title: 'Échéances proches', count: 2, href: '/projects?view=deadlines' }
        ]
      },
      {
        id: 'collaboration',
        title: 'Collaboration',
        description: 'Équipe et communications',
        icon: Users,
        color: 'bg-green-50 border-green-200',
        href: '/forum',
        badge: '2 nouveaux',
        items: [
          { title: 'Messages non lus', count: 8, href: '/forum?filter=unread' },
          { title: 'Équipes actives', count: 4, href: '/organizations' },
          { title: 'Invitations', count: 1, href: '/organizations?view=invites' }
        ]
      },
      {
        id: 'discovery',
        title: 'Découverte',
        description: 'Ressources et opportunités',
        icon: Lightbulb,
        color: 'bg-purple-50 border-purple-200',
        href: '/resources',
        badge: 'Nouveau',
        items: [
          { title: 'Nouvelles ressources', count: 12, href: '/resources?filter=new' },
          { title: 'Événements', count: 5, href: '/events' },
          { title: 'Formations', count: 3, href: '/events?type=training' }
        ]
      }
    ];
  };

  return {
    workspaces: getWorkspaces()
  };
}