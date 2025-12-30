// NEXUS_COMPONENT
// Timeline narrative avec palette 2 couleurs (brand + coop)
// Pas de ranking, pas de chiffres

import { FileText, Users, MessageCircle, Calendar, FolderOpen } from "lucide-react";
import { NexusCard } from "@/components/ui/nexus-card";
import { useTranslation } from "@/hooks/useTranslation";
import type { LucideIcon } from "lucide-react";

type ActivityType = 'project' | 'collaboration' | 'document' | 'event' | 'discussion';

interface ActivityItem {
  id: string;
  type: ActivityType;
  country: string;
  flag: string;
  action: string;
  title: string;
  timeAgo: string;
}

// Données de démonstration
const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'project',
    country: 'Mali',
    flag: '🇲🇱',
    action: 'a partagé un projet',
    title: 'Connectivité rurale dans la région de Mopti',
    timeAgo: 'il y a 2 heures'
  },
  {
    id: '2',
    type: 'document',
    country: 'Kenya',
    flag: '🇰🇪',
    action: 'a documenté une bonne pratique',
    title: 'Méthodologie de suivi des bénéficiaires',
    timeAgo: 'il y a 5 heures'
  },
  {
    id: '3',
    type: 'event',
    country: 'Réseau SUTEL',
    flag: '🌍',
    action: 'organise un webinaire',
    title: 'Financement innovant des FSU',
    timeAgo: 'demain à 14h'
  },
  {
    id: '4',
    type: 'collaboration',
    country: 'Sénégal',
    flag: '🇸🇳',
    action: 'et Côte d\'Ivoire collaborent sur',
    title: 'Partage d\'infrastructures backbone',
    timeAgo: 'il y a 1 jour'
  },
  {
    id: '5',
    type: 'discussion',
    country: 'Ghana',
    flag: '🇬🇭',
    action: 'a lancé une discussion',
    title: 'Harmonisation des indicateurs régionaux',
    timeAgo: 'il y a 2 jours'
  },
  {
    id: '6',
    type: 'project',
    country: 'Côte d\'Ivoire',
    flag: '🇨🇮',
    action: 'a mis à jour un projet',
    title: 'Extension réseau 4G rural',
    timeAgo: 'il y a 3 jours'
  },
  {
    id: '7',
    type: 'document',
    country: 'Nigeria',
    flag: '🇳🇬',
    action: 'a partagé un document',
    title: 'Rapport annuel FSU 2024',
    timeAgo: 'il y a 4 jours'
  },
  {
    id: '8',
    type: 'event',
    country: 'Cameroun',
    flag: '🇨🇲',
    action: 'a participé à un événement',
    title: 'Conférence régionale CEDEAO',
    timeAgo: 'il y a 5 jours'
  },
];

// Palette NEXUS : 2 couleurs uniquement
const getIcon = (type: ActivityType): LucideIcon => {
  const icons: Record<ActivityType, LucideIcon> = {
    project: FolderOpen,
    collaboration: Users,
    document: FileText,
    event: Calendar,
    discussion: MessageCircle
  };
  return icons[type];
};

// Couleurs NEXUS : brand (bleu) pour info, coop (vert) pour action
const getIconStyle = (type: ActivityType): string => {
  // Actions collaboratives → vert coopération
  if (type === 'project' || type === 'collaboration') {
    return 'bg-[hsl(var(--nx-coop-600)/0.1)] text-[hsl(var(--nx-coop-600))]';
  }
  // Info/ressources → bleu institutionnel
  return 'bg-[hsl(var(--nx-brand-900)/0.1)] text-[hsl(var(--nx-brand-900))]';
};

interface ActivityTimelineProps {
  maxItems?: number;
}

export const ActivityTimeline = ({ maxItems = 5 }: ActivityTimelineProps) => {
  const { t } = useTranslation();
  const displayActivities = mockActivities.slice(0, maxItems);

  return (
    <div className="space-y-3">
      {displayActivities.map((activity, index) => {
        const Icon = getIcon(activity.type);
        const iconStyle = getIconStyle(activity.type);
        
        return (
          <NexusCard 
            key={activity.id}
            variant="flat"
            padding="sm"
            hover="subtle"
            className="animate-fade-in"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-start gap-4">
              {/* Icône avec style NEXUS */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconStyle}`}>
                <Icon className="w-5 h-5" />
              </div>
              
              {/* Contenu narratif */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[hsl(var(--nx-text-900))]">
                  <span className="font-medium">{activity.flag} {activity.country}</span>
                  <span className="text-[hsl(var(--nx-text-500))]"> {activity.action} </span>
                </p>
                <p className="text-[hsl(var(--nx-text-900))] font-medium mt-0.5 truncate">
                  {activity.title}
                </p>
              </div>

              {/* Temps */}
              <span className="text-xs text-[hsl(var(--nx-text-500))] flex-shrink-0">
                {activity.timeAgo}
              </span>
            </div>
          </NexusCard>
        );
      })}
    </div>
  );
};
