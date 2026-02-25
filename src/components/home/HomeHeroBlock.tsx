import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, MapPin, Users, FolderOpen, Calendar, ChevronRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";
import { useHomepageContent } from "@/hooks/useHomepageContent";
import { useHomeStats } from "@/hooks/useHomeStats";
import { useAfricanCountries } from "@/hooks/useCountries";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { HomeMemberMap } from "@/components/home/HomeMemberMap";
import { Country } from "@/services/countriesService";
import { getCountryActivity, ACTIVITY_LEVELS, type ActivityLevel } from "@/components/map/activityData";
import { t } from "i18next";

const LEGEND_ITEMS: { level: ActivityLevel; label: string }[] = [
  { level: 'high', label: 'label.legend.activity.high' },
  { level: 'medium', label: 'label.legend.activity.medium' },
  { level: 'onboarding', label: 'label.legend.activity.onboarding' },
];

export function HomeHeroBlock() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const { getBlock } = useHomepageContent();
  const { data: countries = [] } = useAfricanCountries();

  /*const hero = getBlock('hero');
  const title = (hero?.title as string) ?? "Connecter l'Afrique";
  const highlight = (hero?.subtitle_highlight as string) ?? "Ensemble";
  const description = (hero?.description as string) ?? "Plateforme panafricaine pour la coordination, l'innovation et la mutualisation des ressources du Service Universel des Télécommunications.";
  */

  const countByLevel = (level: ActivityLevel): number =>
    countries.filter((c) => getCountryActivity(c.code).level === level).length;

  const { data: homeStats, isLoading: statsLoading } = useHomeStats();
  const countriesCount = homeStats?.countries ?? countries.length;
  const heroKpis = [
    {
      icon: Users,
      label: "Pays membres",
      value: countriesCount || 0,
      delta: statsLoading ? "Actualisation..." : "Réseau panafricain",
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/network",
    },
    {
      icon: FolderOpen,
      label: "Projets actifs",
      value: homeStats?.projects ?? 127,
      delta: homeStats ? `+${homeStats.newProjectsThisQuarter} ce trimestre` : "+18 ce trimestre",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      href: "/projects",
    },
    {
      icon: Globe,
      label: "Partenariats",
      value: homeStats?.partners ?? 892,
      delta: homeStats ? `+${homeStats.newPartnersThisMonth} ce mois` : "+24 ce mois",
      color: "text-violet-600",
      bg: "bg-violet-50",
      href: "/network",
    },
    {
      icon: Calendar,
      label: "Événements",
      value: homeStats?.events ?? 45,
      delta: homeStats ? `${homeStats.eventsThisYear} cette année` : "cette année",
      color: "text-amber-600",
      bg: "bg-amber-50",
      href: "/events",
    },
  ];

  return (
    <section className="bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-4 pb-2">
        <nav className="flex items-center gap-1.5 text-xs text-gray-400">
          <Link to="/" className="hover:text-gray-600">{t('nav.home')}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-600 font-medium">{t('nav.network')}</span>
        </nav>
      </div>

      {/* Hero grid */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left column */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className={cn("pt-4", isRTL && "text-right")}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium mb-5">
              <MapPin className="h-3.5 w-3.5" />
              {t('label.network.active')} — {countries.length || 54} {t('label.countries')}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-900 leading-tight mb-4">
              {t('label.platform.slogan.title')}
              <span className="text-primary"> {t('label.platform.slogan.highlight')}</span>
            </h1>

            <p className="text-base text-gray-500 leading-relaxed mb-8 max-w-lg">
              {t('label.platform.slogan.description')}
            </p>

            <div className={cn("flex gap-3", isRTL && "flex-row-reverse")}>
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                <Link to="/network" className="flex items-center gap-2">
                  {t('label.hero.explore')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                <Link to="/projects">{t('label.hero.view')}</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right column — Map */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="relative rounded-xl border border-gray-200 overflow-hidden bg-gray-900" style={{ height: 'clamp(280px, 40vw, 380px)' }}>
              {countries.length > 0 && (
                <HomeMemberMap countries={countries} mode="members" />
              )}
            </div>
            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-3">
              {LEGEND_ITEMS.map(({ level, label }) => (
                <div key={level} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ACTIVITY_LEVELS[level].color }} />
                  <span className="text-[11px] text-gray-500">{t(label)} ({countByLevel(level)})</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* KPI Bar */}
      <div className="border-t border-b border-gray-100 bg-gray-50/50">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {heroKpis.map((kpi, i) => (
              <Link key={i} to={kpi.href} className="group">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * i }}
                  className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3.5 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", kpi.bg)}>
                    <kpi.icon className={cn("h-4.5 w-4.5", kpi.color)} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1.5">
                      <AnimatedCounter value={kpi.value} className="text-xl font-bold text-gray-900" />
                    </div>
                    <p className="text-xs text-gray-500 truncate">{kpi.label}</p>
                    <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                      <TrendingUp className="h-2.5 w-2.5" />
                      {kpi.delta}
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-500 ml-auto shrink-0 transition-colors" />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
