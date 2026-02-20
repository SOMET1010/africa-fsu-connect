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
      className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10"
    >
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--nx-gold))]/10 via-transparent to-[hsl(var(--nx-electric))]/5" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--nx-gold))]/5 rounded-full blur-3xl -translate-y-32 translate-x-32" />
      
      <div className="relative px-6 py-8 md:px-8 md:py-10">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[hsl(var(--nx-gold))]/20 border border-[hsl(var(--nx-gold))]/30">
            <Globe className="h-7 w-7 text-[hsl(var(--nx-gold))]" />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[hsl(var(--nx-gold))]" />
              <span className="text-xs font-medium uppercase tracking-wider text-[hsl(var(--nx-gold))]">
                USF Universal Digital Connect
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Bienvenue sur USF Universal Digital Connect
            </h1>
            <p className="text-white/60 text-lg">
              Le réseau panafricain du Service Universel des Télécommunications
            </p>
            <p className="text-white/80 mt-4">
              Bonjour <span className="font-medium text-[hsl(var(--nx-gold))]">{firstName}</span>, 
              voici ce qui se passe dans le réseau aujourd'hui.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm text-white/50">
          <Users className="h-4 w-4" />
          <span>Connecté avec les pays membres de la communauté UDC</span>
        </div>
      </div>
    </motion.div>
  );
}
