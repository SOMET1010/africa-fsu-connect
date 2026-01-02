import { Activity, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

interface NetworkActivity {
  id: string;
  title: string;
  description: string;
  time: string;
  country: string;
  countryFlag: string;
  type: 'project' | 'resource' | 'event' | 'member';
}

interface NetworkActivityWidgetProps {
  activities?: NetworkActivity[];
  onViewAll?: () => void;
}

const defaultActivities: NetworkActivity[] = [
  {
    id: "1",
    title: "Nouveau projet partagé",
    description: "Villages Connectés - Extension Phase 2",
    time: "Il y a 2 heures",
    country: "Côte d'Ivoire",
    countryFlag: "🇨🇮",
    type: "project"
  },
  {
    id: "2",
    title: "Ressource disponible",
    description: "Guide de bonnes pratiques FSU 2024",
    time: "Il y a 5 heures",
    country: "Sénégal",
    countryFlag: "🇸🇳",
    type: "resource"
  },
  {
    id: "3",
    title: "Événement à venir",
    description: "Webinaire sur les mécanismes de financement",
    time: "Il y a 1 jour",
    country: "SUTEL",
    countryFlag: "🌍",
    type: "event"
  },
  {
    id: "4",
    title: "Nouveau membre",
    description: "L'agence ARTP du Mali rejoint le réseau",
    time: "Il y a 2 jours",
    country: "Mali",
    countryFlag: "🇲🇱",
    type: "member"
  }
];

const activityTypeColors: Record<NetworkActivity['type'], string> = {
  project: 'bg-primary',
  resource: 'bg-accent',
  event: 'bg-secondary',
  member: 'bg-green-500'
};

export function NetworkActivityWidget({ 
  activities = defaultActivities,
  onViewAll
}: NetworkActivityWidgetProps) {
  return (
    <GlassCard className="p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Activité du réseau
          </h2>
        </div>
        {onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll} className="gap-1 text-muted-foreground">
            Voir tout
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        {activities.slice(0, 4).map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className="flex-shrink-0 mt-1.5">
              <div className={`w-2 h-2 rounded-full ${activityTypeColors[activity.type]}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{activity.title}</p>
              <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {activity.countryFlag} {activity.country} · {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
