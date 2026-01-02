import { motion } from "framer-motion";
import { Globe, Users } from "lucide-react";

interface CommunityHeroProps {
  totalCountries: number;
  totalCommunities: number;
}

export const CommunityHero = ({ totalCountries, totalCommunities }: CommunityHeroProps) => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Communautés linguistiques{" "}
            <span className="text-primary">SUTEL</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl">
            4 langues, 1 mission commune : connecter l'Afrique à travers le partage 
            d'expertise et l'innovation technologique.
          </p>

          <div className="flex flex-wrap gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{totalCountries}</p>
                <p className="text-sm text-muted-foreground">pays membres</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center">
                <Users className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{totalCommunities}</p>
                <p className="text-sm text-muted-foreground">communautés linguistiques</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
