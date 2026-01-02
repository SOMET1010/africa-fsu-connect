import { motion, AnimatePresence } from "framer-motion";
import { Activity, X, Zap, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: 'project' | 'document' | 'member';
  title: string;
  description: string;
  time: string;
}

const recentActivities: ActivityItem[] = [
  { id: '1', type: 'project', title: 'Nouveau Backbone', description: 'Déploiement fibre initié au Sénégal (Zone Nord).', time: 'Il y a 2h' },
  { id: '2', type: 'document', title: 'Rapport publié', description: 'Guide des bonnes pratiques 5G.', time: 'Il y a 5h' },
  { id: '3', type: 'member', title: 'Nouveau membre', description: 'ARCEP Congo a rejoint le réseau.', time: 'Il y a 1j' },
  { id: '4', type: 'project', title: 'Projet complété', description: 'Couverture 4G Mali - Phase 1 terminée.', time: 'Il y a 2j' },
  { id: '5', type: 'document', title: 'Best practice', description: 'Télémédecine rurale - Côte d\'Ivoire.', time: 'Il y a 3j' },
];

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'project': return Zap;
    case 'document': return FileText;
    case 'member': return Users;
  }
};

const getActivityColor = (type: ActivityItem['type']) => {
  switch (type) {
    case 'project': return 'bg-emerald-500';
    case 'document': return 'bg-blue-500';
    case 'member': return 'bg-purple-500';
  }
};

interface ActivityPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const ActivityPanel = ({ isOpen, onToggle }: ActivityPanelProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute top-24 right-4 bottom-20 w-72 bg-slate-900/90 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden z-20"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium text-white">Activité Réseau</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-6 w-6 text-white/60 hover:text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Activity List */}
        <ScrollArea className="h-[calc(100%-56px)]">
          <div className="p-3 space-y-2">
            {recentActivities.map((activity, idx) => {
              const Icon = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type);
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0", colorClass)}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                    <p className="text-xs text-white/60 line-clamp-2">{activity.description}</p>
                    <p className="text-[10px] text-white/40 mt-1">{activity.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </motion.div>
    )}
  </AnimatePresence>
);
