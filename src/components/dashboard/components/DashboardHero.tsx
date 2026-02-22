import { Globe, Users, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

export function DashboardHero() {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Membre';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-dark border border-border"
    >
      <div className="relative px-6 py-8 md:px-8 md:py-10">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">
            <Globe className="h-7 w-7 text-white" />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-white/80" />
              <span className="text-xs font-medium uppercase tracking-wider text-white/80">
                USF Digital Connect Africa
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Bienvenue sur USF Digital Connect
            </h1>
            <p className="text-white/80 text-lg">
              Le réseau panafricain du Service Universel des Télécommunications
            </p>
            <p className="text-white/90 mt-4">
              Bonjour <span className="font-semibold">{firstName}</span>, 
              voici ce qui se passe dans le réseau aujourd'hui.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm text-white/70">
          <Users className="h-4 w-4" />
          <span>Connecté avec les pays membres de la communauté UDC</span>
        </div>
      </div>
    </motion.div>
  );
}
