import { Activity, Zap, FileText, Users, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface ActivityItem {
  id: string;
  type: 'project' | 'document' | 'member';
  title: string;
  description: string;
  time: string;
  status?: 'new' | 'update';
}

const recentActivities: ActivityItem[] = [
  { id: '1', type: 'project', title: 'Nouveau Backbone', description: 'Déploiement fibre initié au Sénégal (Zone Nord).', time: 'Il y a 2h', status: 'new' },
  { id: '2', type: 'document', title: 'Rapport publié', description: 'Guide des bonnes pratiques 5G et régulation.', time: 'Il y a 5h' },
  { id: '3', type: 'member', title: 'Nouveau membre', description: 'ARCEP Congo a rejoint le réseau UDC.', time: 'Il y a 1j', status: 'new' },
  { id: '4', type: 'project', title: 'Projet complété', description: 'Couverture 4G Mali - Phase 1 terminée.', time: 'Il y a 2j' },
  { id: '5', type: 'document', title: 'Best practice', description: 'Télémédecine rurale - Côte d\'Ivoire.', time: 'Il y a 3j' },
  { id: '6', type: 'project', title: 'Maintenance', description: 'Mise à jour des nœuds de connexion (Lagos).', time: 'Il y a 4j' },
];

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'project': return Zap;
    case 'document': return FileText;
    case 'member': return Users;
  }
};

const getActivityStyles = (type: ActivityItem['type']) => {
  switch (type) {
    case 'project': return { icon: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' };
    case 'document': return { icon: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' };
    case 'member': return { icon: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' };
  }
};

const newActivitiesCount = recentActivities.filter(a => a.status === 'new').length;

export const ActivityPanel = () => (
  <Drawer>
    {/* Trigger - Poignée fixe en bas */}
    <DrawerTrigger asChild>
      <button className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 max-w-md w-[calc(100%-2rem)] bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-t-2xl px-4 py-3 flex items-center justify-between hover:bg-slate-800/90 transition-colors group">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-sm font-medium text-white/90">Activité du réseau</span>
        </div>
        <div className="flex items-center gap-2">
          {newActivitiesCount > 0 && (
            <Badge className="bg-emerald-400 text-slate-900 text-xs px-2 py-0.5">
              {newActivitiesCount} nouvelles
            </Badge>
          )}
          <div className="w-5 h-1 bg-white/20 rounded-full group-hover:bg-white/40 transition-colors" />
        </div>
      </button>
    </DrawerTrigger>

    {/* Content - Bottom Sheet */}
    <DrawerContent className="bg-slate-950 border-white/10 max-h-[70vh]">
      <DrawerHeader className="border-b border-white/5 pb-4">
        <DrawerTitle className="flex items-center gap-3 text-white/90">
          <div className="w-8 h-8 rounded-lg bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          Flux Réseau
        </DrawerTitle>
      </DrawerHeader>

      {/* Activity List */}
      <ScrollArea className="flex-1 max-h-[50vh]">
        <div className="p-4 space-y-1">
          {recentActivities.map((activity, idx) => {
            const Icon = getActivityIcon(activity.type);
            const styles = getActivityStyles(activity.type);
            
            return (
              <div key={activity.id} className="relative flex gap-3 py-3 group">
                {/* Ligne de connexion verticale */}
                {idx !== recentActivities.length - 1 && (
                  <div className="absolute left-[15px] top-[42px] w-px h-[calc(100%-18px)] bg-white/5" />
                )}

                {/* Icone */}
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border transition-colors",
                  styles.bg,
                  styles.border,
                  "group-hover:border-opacity-60"
                )}>
                  <Icon className={cn("w-4 h-4", styles.icon)} />
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-white/90 truncate">
                      {activity.title}
                    </h4>
                    {activity.status === 'new' && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-400/30 text-emerald-400 bg-emerald-400/10">
                        NEW
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-xs text-white/50 mt-0.5 line-clamp-1">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center gap-1 mt-1 text-white/30">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px]">{activity.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer Status */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-white/40 text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Système synchronisé
        </div>
      </div>
    </DrawerContent>
  </Drawer>
);
