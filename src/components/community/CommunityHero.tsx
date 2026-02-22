import { motion } from "framer-motion";
import { Globe, Users, Languages } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CommunityHeroProps {
  totalCountries: number;
  totalCommunities: number;
}

export const CommunityHero = ({ totalCountries, totalCommunities }: CommunityHeroProps) => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Orbes lumineux d'ambiance */}
      <div className="absolute top-1/4 -right-20 w-72 h-72 bg-[hsl(var(--nx-gold)/0.15)] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-64 h-64 bg-[hsl(var(--nx-cyan)/0.1)] rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
          {/* Contenu textuel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <Badge className="bg-[hsl(var(--nx-gold)/0.15)] text-[hsl(var(--nx-gold))] border-[hsl(var(--nx-gold)/0.3)] hover:bg-[hsl(var(--nx-gold)/0.2)] mb-4">
                <Languages className="w-3 h-3 mr-1.5" />
                Diversité & Inclusion
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Communautés{" "}
              <span className="bg-gradient-to-r from-white via-[hsl(var(--nx-gold))] to-white bg-clip-text text-transparent">
                Linguistiques
              </span>{" "}
              UDC
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="border-l-2 border-[hsl(var(--nx-gold)/0.5)] pl-4 text-lg text-white/70 max-w-xl"
            >
              Nous brisons les barrières de la langue. 4 espaces linguistiques (Français, Anglais, Portugais, Arabe) unis par une mission commune : connecter l'Afrique à travers le partage d'expertise.
            </motion.p>
          </motion.div>

          {/* Glass Cards pour les stats */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.08] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[hsl(var(--nx-gold)/0.15)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Globe className="w-5 h-5 text-[hsl(var(--nx-gold))]" />
              </div>
              <p className="text-3xl font-bold text-white">{totalCountries}</p>
              <p className="text-xs text-white/50">Pays Membres</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="sm:mt-8 bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.08] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[hsl(var(--nx-cyan)/0.15)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-[hsl(var(--nx-cyan))]" />
              </div>
              <p className="text-3xl font-bold text-white">{totalCommunities}</p>
              <p className="text-xs text-white/50">Espaces d'échange</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
