import { Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface NetworkActivity {
  id: string;
  title: string;
  description: string;
  time: string;
  country: string;
  countryFlag: string;
  type: "project" | "resource" | "event" | "collaboration";
}

interface NetworkActivityWidgetProps {
  activities?: NetworkActivity[];
  onViewAll?: () => void;
}

const defaultActivities: NetworkActivity[] = [
  {
    id: "1",
    title: "Nouveau projet publié",
    description: "Connectivité Rurale - Phase 2",
    time: "Il y a 2h",
    country: "Sénégal",
    countryFlag: "🇸🇳",
    type: "project"
  },
  {
    id: "2",
    title: "Ressource partagée",
    description: "Guide de bonnes pratiques FSU",
    time: "Il y a 5h",
    country: "Côte d'Ivoire",
    countryFlag: "🇨🇮",
    type: "resource"
  },
  {
    id: "3",
    title: "Événement à venir",
    description: "Webinaire régional sur la régulation",
    time: "Demain",
    country: "Mali",
    countryFlag: "🇲🇱",
    type: "event"
  },
  {
    id: "4",
    title: "Collaboration initiée",
    description: "Échange entre Burkina et Niger",
    time: "Il y a 1j",
    country: "Burkina Faso",
    countryFlag: "🇧🇫",
    type: "collaboration"
  }
];

const activityTypeColors: Record<NetworkActivity["type"], string> = {
  project: "bg-[hsl(var(--nx-electric))]",
  resource: "bg-[hsl(var(--nx-gold))]",
  event: "bg-emerald-500",
  collaboration: "bg-purple-500"
};

export function NetworkActivityWidget({ 
  activities = defaultActivities,
  onViewAll
}: NetworkActivityWidgetProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-[hsl(var(--nx-electric))]" />
          <h2 className="text-lg font-semibold text-white">
            Activité du réseau
          </h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onViewAll} 
          className="gap-1 text-white/50 hover:text-white hover:bg-white/10"
        >
          Voir tout
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {activities.slice(0, 4).map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 group">
            <div className="relative mt-1">
              <div className={`w-2.5 h-2.5 rounded-full ${activityTypeColors[activity.type]}`} />
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-8 bg-white/10 last:hidden" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white text-sm group-hover:text-[hsl(var(--nx-gold))] transition-colors cursor-pointer">
                {activity.title}
              </p>
              <p className="text-sm text-white/50 truncate">{activity.description}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-white/40">
                <span>{activity.countryFlag} {activity.country}</span>
                <span>•</span>
                <span>{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
