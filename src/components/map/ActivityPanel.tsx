import { motion, AnimatePresence } from "framer-motion";
import { Activity, X, Zap, FileText, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
  { id: '3', type: 'member', title: 'Nouveau membre', description: 'ARCEP Congo a rejoint le réseau SUTEL.', time: 'Il y a 1j', status: 'new' },
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

interface ActivityPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const ActivityPanel = ({ isOpen, onToggle }: ActivityPanelProps) => (
  <>
    {/* Bouton d'ouverture latéral (visible seulement quand fermé) */}
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute top-1/2 -translate-y-1/2 right-0 z-30"
        >
          <Button
            onClick={onToggle}
            className="flex items-center gap-2 px-3 py-6 rounded-l-xl rounded-r-none bg-slate-950/90 backdrop-blur-xl border border-r-0 border-white/10 hover:bg-slate-900/90 text-white shadow-2xl"
          >
            <Activity className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-medium writing-mode-vertical">Activité</span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Panneau Latéral Ancré */}
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none z-30"
        >
          <motion.div
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-24 bottom-20 right-4 w-72 pointer-events-auto bg-slate-950/90 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-sm font-medium text-white">Flux Réseau</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="h-7 w-7 text-white/40 hover:text-white hover:bg-white/5"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Activity List avec Timeline */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-0">
                {recentActivities.map((activity, idx) => {
                  const Icon = getActivityIcon(activity.type);
                  const styles = getActivityStyles(activity.type);
                  
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="relative flex gap-3 pb-4 group cursor-pointer"
                    >
                      {/* Ligne de connexion verticale */}
                      {idx !== recentActivities.length - 1 && (
                        <div className="absolute left-[15px] top-8 bottom-0 w-px bg-white/10" />
                      )}

                      {/* Icone */}
                      <div className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 border transition-colors",
                        styles.bg,
                        styles.border,
                        "group-hover:border-opacity-50"
                      )}>
                        <Icon className={cn("h-4 w-4", styles.icon)} />
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white truncate group-hover:text-emerald-400 transition-colors">
                            {activity.title}
                          </p>
                          {activity.status === 'new' && (
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 bg-emerald-400/10 text-emerald-400 border-emerald-400/30">
                              NEW
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-xs text-white/50 line-clamp-2 mt-0.5">
                          {activity.description}
                        </p>
                        
                        <div className="flex items-center gap-1.5 mt-1.5 text-white/30">
                          <Clock className="h-3 w-3" />
                          <span className="text-[10px]">{activity.time}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>
            
            {/* Footer / Status */}
            <div className="p-3 border-t border-white/5 flex items-center justify-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] text-white/40">Système synchronisé</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
);
