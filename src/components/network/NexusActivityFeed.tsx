// NEXUS_COMPONENT
// Live Data Feed - Dark mode continuity with glassmorphism cards
// Connected timeline with staggered animations

import { motion } from "framer-motion";
import { FileText, FolderGit2, Calendar, Users, ArrowRight, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface ActivityItem {
  id: number;
  country: string;
  code: string;
  type: 'project' | 'doc' | 'event' | 'collab';
  title: string;
  desc: string;
  time: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
}

// Données simulées avec couleurs par type
const activities: ActivityItem[] = [
  {
    id: 1,
    country: "Mali",
    code: "ML",
    type: "project",
    title: "Connectivité rurale dans la région de Mopti",
    desc: "Le Mali a partagé un nouveau projet d'infrastructure.",
    time: "il y a 2h",
    icon: FolderGit2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20"
  },
  {
    id: 2,
    country: "Kenya",
    code: "KE",
    type: "doc",
    title: "Méthodologie de suivi des bénéficiaires",
    desc: "Documentation d'une bonne pratique pour les FSU.",
    time: "il y a 5h",
    icon: FileText,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20"
  },
  {
    id: 3,
    country: "Réseau SUTEL",
    code: "NET",
    type: "event",
    title: "Financement innovant des FSU",
    desc: "Webinaire organisé pour les membres du réseau.",
    time: "Demain à 14h",
    icon: Calendar,
    color: "text-[hsl(var(--nx-gold))]",
    bg: "bg-[hsl(var(--nx-gold))]/10",
    border: "border-[hsl(var(--nx-gold))]/20"
  },
  {
    id: 4,
    country: "Sénégal & CI",
    code: "SN/CI",
    type: "collab",
    title: "Partage d'infrastructures backbone",
    desc: "Collaboration bilatérale initiée sur la gestion transfrontalière.",
    time: "il y a 1 jour",
    icon: Users,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.5 } 
  }
};

export function NexusActivityFeed() {
  return (
    <section className="py-24 relative overflow-hidden bg-[hsl(var(--nx-night))]">
      
      {/* Background Elements - Continuité visuelle */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--nx-night))] to-[hsl(var(--nx-night))]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[hsl(var(--nx-gold))]/5 rounded-full blur-3xl" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-white/10 text-white/80 border border-white/20">
            <Activity className="w-3 h-3 mr-2" />
            Flux en temps réel
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            L'intelligence collective{' '}
            <span className="text-[hsl(var(--nx-gold))]">en action</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Suivez les dernières contributions, projets et collaborations entre les 54 pays membres du réseau NEXUS.
          </p>
        </div>

        {/* Timeline Feed */}
        <div className="relative">
          
          {/* Ligne verticale de connexion (The Spine) - Desktop only */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent hidden md:block" />

          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {activities.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <div
                  className={cn(
                    "group relative rounded-2xl p-5 md:pl-20",
                    "bg-white/[0.03] backdrop-blur-sm",
                    "border border-white/[0.05]",
                    "hover:bg-white/[0.06] hover:border-white/10",
                    "transition-all duration-300 cursor-pointer"
                  )}
                >
                  {/* Glowing connector dot (Desktop only) */}
                  <div className="absolute left-8 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
                    <div className="w-3 h-3 rounded-full bg-white/30">
                      <div className="absolute inset-0 rounded-full bg-[hsl(var(--nx-gold))]/50 animate-ping" />
                    </div>
                  </div>

                  {/* Icon Box */}
                  <div
                    className={cn(
                      "absolute left-5 top-5 md:left-12 w-10 h-10 rounded-xl flex items-center justify-center border",
                      item.bg,
                      item.border
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", item.color)} />
                  </div>

                  {/* Content */}
                  <div className="ml-14 md:ml-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge 
                        variant="outline" 
                        className="bg-white/10 text-white/70 border-white/20 text-xs font-mono"
                      >
                        {item.code}
                      </Badge>
                      <span className="text-white/80 text-sm font-medium">
                        {item.country}
                      </span>
                      <span className="text-white/40 text-xs ml-auto">
                        {item.time}
                      </span>
                    </div>

                    <h4 className="text-white font-medium group-hover:text-[hsl(var(--nx-gold))] transition-colors duration-300 mb-1">
                      {item.title}
                    </h4>

                    <p className="text-white/50 text-sm">
                      {item.desc}
                    </p>
                  </div>

                  {/* Action Arrow */}
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-5 h-5 text-white/50 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* View All Button */}
          <div className="text-center mt-10">
            <Button 
              asChild
              variant="outline" 
              className="border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all duration-300"
            >
              <Link to="/activity" className="flex items-center gap-2">
                Voir tout le flux
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
