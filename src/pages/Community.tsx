import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAfricanCountries } from "@/hooks/useCountries";
import { CommunityHero } from "@/components/community/CommunityHero";
import { CommunityCard } from "@/components/community/CommunityCard";
import { CommunityLanguageMap } from "@/components/community/CommunityLanguageMap";
import { Country } from "@/services/countriesService";

const COMMUNITY_CONFIG: Record<string, {
  name: string;
  flag: string;
  color: string;
  description: string;
}> = {
  fr: {
    name: "Francophone",
    flag: "🇫🇷",
    color: "#3B82F6",
    description: "L'Afrique francophone, de Dakar à Kinshasa, partage une histoire et des défis communs.",
  },
  en: {
    name: "Anglophone",
    flag: "🇬🇧",
    color: "#10B981",
    description: "De l'Afrique de l'Est à l'Afrique Australe, une voix anglophone unie.",
  },
  pt: {
    name: "Lusophone",
    flag: "🇵🇹",
    color: "#F59E0B",
    description: "Les pays lusophones, du Cap-Vert au Mozambique, tissent des liens transatlantiques.",
  },
  ar: {
    name: "Arabophone",
    flag: "🇸🇦",
    color: "#8B5CF6",
    description: "Le Maghreb et au-delà, une tradition d'échange et d'innovation.",
  },
};

const Community = () => {
  const { data: countries = [], isLoading } = useAfricanCountries();

  // Group countries by language
  const countriesByLanguage = countries.reduce((acc, country) => {
    const lang = country.official_language || "fr";
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(country);
    return acc;
  }, {} as Record<string, Country[]>);

  const totalCountries = countries.length;
  const totalCommunities = Object.keys(COMMUNITY_CONFIG).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <MapPin className="w-12 h-12 text-primary animate-bounce" />
          <p className="text-muted-foreground">Chargement des communautés...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10">
      {/* Hero Section - Neutral */}
      <CommunityHero
        totalCountries={totalCountries}
        totalCommunities={totalCommunities}
      />

      {/* Map Section - Dark glassmorphism */}
      <section className="py-16 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Répartition géographique
            </h2>
            <p className="text-white/60">
              Explorez la diversité linguistique du réseau SUTEL à travers l'Afrique
            </p>
          </motion.div>

          <CommunityLanguageMap countries={countries} />
        </div>
      </section>

      {/* Community Cards Section - Dark */}
      <section className="py-16 bg-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Découvrir les communautés
            </h2>
            <p className="text-white/60">
              Chaque communauté linguistique contribue à la richesse du réseau
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(COMMUNITY_CONFIG).map(([code, config], index) => (
              <CommunityCard
                key={code}
                code={code}
                name={config.name}
                flag={config.flag}
                color={config.color}
                count={countriesByLanguage[code]?.length || 0}
                description={config.description}
                countries={countriesByLanguage[code] || []}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Premium Dark */}
      <section className="py-16 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Rejoindre le réseau
            </h2>
            <p className="text-white/60 mb-8">
              Découvrez les agences membres et leurs contributions à l'écosystème numérique africain.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-[hsl(var(--nx-gold))] hover:bg-[hsl(var(--nx-gold)/0.9)] text-[hsl(var(--nx-night))]">
                <Link to="/members">
                  Explorer les pays membres
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/contact">
                  Contacter le secrétariat
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Community;
