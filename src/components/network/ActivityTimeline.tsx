import { useTranslation } from "@/hooks/useTranslation";
import { 
  Rocket, 
  FileText, 
  Calendar, 
  MessageSquare,
  Users
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'project' | 'document' | 'event' | 'discussion' | 'collaboration';
  country: string;
  flag: string;
  action: string;
  title: string;
  timeAgo: string;
}

// Mock data - en production, viendrait de l'API
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

const getIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'project': return Rocket;
    case 'document': return FileText;
    case 'event': return Calendar;
    case 'discussion': return MessageSquare;
    case 'collaboration': return Users;
    default: return Rocket;
  }
};

const getIconColor = (type: ActivityItem['type']) => {
  switch (type) {
    case 'project': return 'text-primary bg-primary/10';
    case 'document': return 'text-blue-500 bg-blue-500/10';
    case 'event': return 'text-amber-500 bg-amber-500/10';
    case 'discussion': return 'text-purple-500 bg-purple-500/10';
    case 'collaboration': return 'text-green-500 bg-green-500/10';
    default: return 'text-primary bg-primary/10';
  }
};

interface ActivityTimelineProps {
  maxItems?: number;
}

/**
 * ActivityTimeline - Couche 1 compliant
 * 
 * UX RULES (Blueprint):
 * - NO punitive alerts
 * - Timeline-style activity feed
 * - Proof of network life
 * - Narrative focus (country did action)
 */
export const ActivityTimeline = ({ maxItems = 5 }: ActivityTimelineProps) => {
  const { t } = useTranslation();
  const activities = mockActivities.slice(0, maxItems);

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = getIcon(activity.type);
        const iconColorClass = getIconColor(activity.type);
        
        return (
          <div 
            key={activity.id}
            className="flex items-start gap-4 p-4 rounded-lg bg-card/50 border border-border/50 hover:bg-card/80 transition-colors animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Icône */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconColorClass}`}>
              <Icon className="h-5 w-5" />
            </div>

            {/* Contenu */}
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">{activity.flag} {activity.country}</span>
                <span className="text-muted-foreground"> {activity.action}</span>
              </p>
              <p className="text-foreground font-medium mt-1 truncate">
                {activity.title}
              </p>
            </div>

            {/* Temps */}
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {activity.timeAgo}
            </span>
          </div>
        );
      })}
    </div>
  );
};