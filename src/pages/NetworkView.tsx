import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, FolderOpen, MessageSquare, Calendar, BookOpen, Globe, TrendingUp } from "lucide-react";
import { RegionCards } from "@/components/network/RegionCards";
import { ActivityTimeline } from "@/components/network/ActivityTimeline";
import { PresenceIndicator } from "@/components/network/PresenceIndicator";
import { NexusActionCard } from "@/components/ui/nexus-card";
import { UATCoordinationSection } from "@/components/network/UATCoordinationSection";
import { LinguisticCommunitiesSection } from "@/components/network/LinguisticCommunitiesSection";
import { NetworkMembersGrid } from "@/components/network/NetworkMembersGrid";
import { useTranslation } from "@/hooks/useTranslation";
import { useAfricanCountries } from "@/hooks/useCountries";

const NetworkView = () => {
  const { t } = useTranslation();
  const { data: countries } = useAfricanCountries();
  const countryCount = countries?.length ?? 54;

  const kpis = [
    { value: countryCount, label: "Pays membres", trend: "+3 cette année", icon: Globe },
    { value: 127, label: "Projets actifs", trend: "+18 ce trimestre", icon: FolderOpen },
    { value: 5, label: "Régions couvertes", trend: null, icon: Users },
    { value: 4, label: "Communautés linguistiques", trend: null, icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-muted relative z-10">
      {/* Hero Section — fond clair, sobre, institutionnel */}
      <section className="py-14 md:py-18 bg-white dark:bg-card border-b border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center space-y-5">
            {/* Badge KPI */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary" />
              </span>
              <span className="text-sm font-medium text-secondary">
                Réseau actif — {countryCount} pays
              </span>
            </div>

            {/* Titre — bleu UAT profond, pas de gradient */}
            <h1 className="text-2xl md:text-3xl font-bold text-primary leading-tight max-w-3xl mx-auto">
              Le réseau des agences du service universel
            </h1>

            {/* Description */}
            <p className="text-base text-muted-foreground max-w-xl mx-auto">
              Coopération et partage entre {countryCount} pays africains.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button asChild className="rounded-xl px-6 py-2.5 font-medium bg-primary text-primary-foreground hover:bg-primary-dark">
                <Link to="/members" className="inline-flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Voir les pays membres
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-primary text-primary hover:bg-primary/5 rounded-xl px-6 py-2.5 font-medium"
              >
                <Link to="/projects" className="inline-flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  Explorer les projets
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Barre KPI */}
      <section className="py-8 bg-muted">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="bg-card rounded-xl border border-border shadow-sm p-5 text-center"
              >
                <div className="flex items-center justify-center mb-2">
                  <kpi.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                  {kpi.label}
                </p>
                {kpi.trend && (
                  <div className="inline-flex items-center gap-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-secondary" />
                    <span className="text-xs text-secondary font-medium">{kpi.trend}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Pays Membres + Carte */}
      <NetworkMembersGrid />

      {/* Section UAT */}
      <UATCoordinationSection />

      {/* Section Communautés linguistiques */}
      <LinguisticCommunitiesSection />

      {/* Section Régions */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-foreground">
              {t('network.regions.title') || 'Les régions du réseau'}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {t('network.regions.subtitle') || 'Cliquez sur une région pour découvrir ses membres'}
            </p>
          </div>
          <RegionCards />
        </div>
      </section>

      {/* Section Activité */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-foreground">
              {t('network.activity.title') || 'Activité récente'}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {t('network.activity.subtitle') || 'Les dernières contributions du réseau'}
            </p>
          </div>
          <ActivityTimeline maxItems={5} />
        </div>
      </section>

      {/* Actions secondaires */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-6">
            <NexusActionCard
              icon={MessageSquare}
              title={t('network.action.discuss') || 'Échanger'}
              description={t('network.action.discuss.desc') || 'Participez aux discussions entre pairs du réseau.'}
              accent="brand"
              primaryAction={{ label: t('common.discover') || 'Découvrir', href: '/forum' }}
            />
            <NexusActionCard
              icon={Calendar}
              title={t('network.action.events') || 'Participer'}
              description={t('network.action.events.desc') || 'Rejoignez les événements et ateliers du réseau.'}
              accent="coop"
              primaryAction={{ label: t('common.discover') || 'Découvrir', href: '/events' }}
            />
            <NexusActionCard
              icon={BookOpen}
              title={t('network.action.resources') || 'Apprendre'}
              description={t('network.action.resources.desc') || 'Accédez aux ressources partagées par le réseau.'}
              accent="brand"
              primaryAction={{ label: t('common.discover') || 'Découvrir', href: '/resources' }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default NetworkView;
