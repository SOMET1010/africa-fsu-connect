import { motion } from "framer-motion";
import { ArrowRight, Map, Signal, Users, ShieldCheck, Zap, Globe, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useRealRegionalStats } from "@/hooks/useRealRegionalStats";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";

const regionsConfig = [
  {
    id: "west",
    nameKey: "regions.west.name",
    slug: "Afrique de l'Ouest",
    dataKey: "CEDEAO",
    color: "text-amber-400",
    bgColor: "bg-amber-400",
    gradient: "from-amber-400/20 via-amber-400/5 to-transparent",
    borderGlow: "group-hover:border-amber-400/30",
    shadowGlow: "group-hover:shadow-amber-400/10",
    icon: Signal,
    descKey: "regions.west.desc"
  },
  {
    id: "central",
    nameKey: "regions.central.name",
    slug: "Afrique Centrale",
    dataKey: "CEMAC",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400",
    gradient: "from-emerald-400/20 via-emerald-400/5 to-transparent",
    borderGlow: "group-hover:border-emerald-400/30",
    shadowGlow: "group-hover:shadow-emerald-400/10",
    icon: ShieldCheck,
    descKey: "regions.central.desc"
  },
  {
    id: "east",
    nameKey: "regions.east.name",
    slug: "Afrique de l'Est",
    dataKey: "EAC",
    color: "text-cyan-400",
    bgColor: "bg-cyan-400",
    gradient: "from-cyan-400/20 via-cyan-400/5 to-transparent",
    borderGlow: "group-hover:border-cyan-400/30",
    shadowGlow: "group-hover:shadow-cyan-400/10",
    icon: Zap,
    descKey: "regions.east.desc"
  },
  {
    id: "north",
    nameKey: "regions.north.name",
    slug: "Afrique du Nord",
    dataKey: "COMESA",
    color: "text-primary-light",
    bgColor: "bg-primary-light",
    gradient: "from-primary-light/20 via-primary-light/5 to-transparent",
    borderGlow: "group-hover:border-primary-light/30",
    shadowGlow: "group-hover:shadow-primary-light/10",
    icon: Map,
    descKey: "regions.north.desc"
  },
  {
    id: "south",
    nameKey: "regions.south.name",
    slug: "Afrique Australe",
    dataKey: "SADC",
    color: "text-purple-400",
    bgColor: "bg-purple-400",
    gradient: "from-purple-400/20 via-purple-400/5 to-transparent",
    borderGlow: "group-hover:border-purple-400/30",
    shadowGlow: "group-hover:shadow-purple-400/10",
    icon: Users,
    descKey: "regions.south.desc"
  }
];

// Fallback data
const fallbackData = {
  CEDEAO: { countries: 15, projects: 124 },
  CEMAC: { countries: 6, projects: 45 },
  EAC: { countries: 7, projects: 89 },
  COMESA: { countries: 12, projects: 52 },
  SADC: { countries: 16, projects: 76 }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" as const } 
  }
};

export function NexusRegions() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const { data: stats, isLoading } = useRealRegionalStats();

  const getRegionStats = (dataKey: string) => {
    const regionData = stats?.regions?.find(r => r.name === dataKey);
    const fallback = fallbackData[dataKey as keyof typeof fallbackData];
    
    return {
      countries: regionData?.countries ?? fallback?.countries ?? 0,
      projects: regionData?.projects ?? fallback?.projects ?? 0
    };
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={cn(
            "flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12",
            isRTL && "md:flex-row-reverse"
          )}
        >
          <div className={cn("space-y-3", isRTL && "text-right")}>
            <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                {t('regions.badge')}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              {t('regions.title')}
            </h2>
            <p className="text-white/60 max-w-xl text-base md:text-lg">
              {t('regions.subtitle')}
            </p>
          </div>

          <Link 
            to="/map"
            className={cn(
              "group inline-flex items-center gap-2 px-5 py-2.5 rounded-full",
              "bg-white/5 border border-white/10 hover:border-primary/30",
              "hover:bg-primary/5 transition-all duration-300",
              isRTL && "flex-row-reverse"
            )}
          >
            <Map className="w-4 h-4 text-white/70 group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
              {t('regions.cta.map')}
            </span>
            <ArrowRight className={cn(
              "w-4 h-4 text-white/50 group-hover:text-primary transition-all",
              isRTL 
                ? "rotate-180 group-hover:-translate-x-0.5" 
                : "group-hover:translate-x-0.5"
            )} />
          </Link>
        </motion.div>

        {/* The Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5"
        >
          {regionsConfig.map((region) => {
            const regionStats = getRegionStats(region.dataKey);
            const Icon = region.icon;

            return (
              <motion.div
                key={region.id}
                variants={cardVariants}
                className="group relative"
              >
                <Link
                  to={`/members?region=${encodeURIComponent(region.slug)}`}
                  className="block h-full"
                >
                  {/* Glow effect on hover */}
                  <div 
                    className={cn(
                      "absolute -inset-px rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm",
                      region.gradient
                    )}
                  />

                  {/* Card */}
                  <div 
                    className={cn(
                      "relative h-full rounded-2xl border border-white/10 bg-white/5",
                      "p-5 flex flex-col transition-all duration-300",
                      "group-hover:shadow-sm"
                    )}
                  >
                    {/* Header with icon and count - RTL-aware */}
                    <div className={cn("flex items-start justify-between mb-4", isRTL && "flex-row-reverse")}>
                      <div className={cn(
                        "p-2.5 rounded-xl bg-white/5 border border-white/10 transition-colors duration-300",
                        "group-hover:bg-white/10 group-hover:border-transparent"
                      )}>
                        <Icon className={cn("w-5 h-5", region.color)} />
                      </div>

                      <div className={isRTL ? "text-left" : "text-right"}>
                        <div className={cn(
                          "text-3xl font-bold transition-colors duration-300",
                          "text-white group-hover:" + region.color.replace("text-", "text-")
                        )}>
                          {isLoading ? (
                            <div className="w-8 h-8 rounded bg-white/10 animate-pulse" />
                          ) : (
                            regionStats.countries
                          )}
                        </div>
                        <div className="text-xs text-white/40 uppercase tracking-wide">
                          {t('regions.label.countries')}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className={cn("flex-1", isRTL && "text-right")}>
                      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-white/90 transition-colors">
                        {t(region.nameKey)}
                      </h3>
                      <p className="text-sm text-white/50">
                        {t(region.descKey)}
                      </p>
                    </div>

                    {/* Footer - RTL-aware */}
                    <div className={cn(
                      "flex items-center justify-between mt-4 pt-4 border-t border-white/5",
                      isRTL && "flex-row-reverse"
                    )}>
                      <div className={cn("flex items-center gap-1.5", isRTL && "flex-row-reverse")}>
                        <Activity className={cn("w-3.5 h-3.5", region.color, "opacity-70")} />
                        <span className="text-sm text-white/60">
                          {isLoading ? (
                            <span className="inline-block w-12 h-4 rounded bg-white/10 animate-pulse" />
                          ) : (
                            <>{regionStats.projects} {t('regions.label.projects')}</>
                          )}
                        </span>
                      </div>

                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center",
                        "bg-white/5 group-hover:bg-white/10 transition-colors duration-300"
                      )}>
                        <ArrowRight className={cn(
                          "w-3.5 h-3.5 text-white/40 group-hover:text-white/80 transition-all duration-300",
                          isRTL 
                            ? "rotate-180 group-hover:-translate-x-0.5" 
                            : "group-hover:translate-x-0.5"
                        )} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center lg:hidden">
          <Link 
            to="/members"
            className={cn(
              "inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors",
              isRTL && "flex-row-reverse"
            )}
          >
            {t('regions.explore.all')}
            <ArrowRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
          </Link>
        </div>
      </div>
    </section>
  );
}
