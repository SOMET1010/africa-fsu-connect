// NEXUS_LAYER1_GUARD
// - max 2 CTA visibles
// - pas de KPI cards
// - pas d'alertes rouges
// - pas de ranking
// - 1 message principal par écran
// - animations lentes uniquement (fade/slide)
// - couleurs : nx-brand + nx-coop uniquement

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, FolderOpen, MessageSquare, Calendar, BookOpen } from "lucide-react";
import { RegionCards } from "@/components/network/RegionCards";
import { ActivityTimeline } from "@/components/network/ActivityTimeline";
import { PresenceIndicator } from "@/components/network/PresenceIndicator";
import { NexusActionCard } from "@/components/ui/nexus-card";
import { useTranslation } from "@/hooks/useTranslation";

const NetworkView = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[hsl(var(--nx-bg))]">
      {/* Hero Section - Calme et institutionnel */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center space-y-6">
            {/* Badge discret */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nx-surface))] border border-[hsl(var(--nx-border))] shadow-[var(--nx-shadow-sm)]">
              <PresenceIndicator />
            </div>
            
            {/* Titre principal - max 32px selon Blueprint */}
            <h1 className="text-[28px] md:text-[32px] font-semibold text-[hsl(var(--nx-text-900))] leading-tight max-w-3xl mx-auto">
              {t('network.hero.title') || 'Le réseau des agences africaines du service universel'}
            </h1>
            
            {/* Description narrative - une seule idée */}
            <p className="text-base md:text-lg text-[hsl(var(--nx-text-500))] max-w-2xl mx-auto leading-relaxed">
              {t('network.hero.narrative') || 'Un espace de coopération et de partage entre les agences nationales pour réduire la fracture numérique en Afrique.'}
            </p>
            
            {/* 2 CTAs maximum - Règle Layer 1 */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button 
                asChild 
                className="bg-[hsl(var(--nx-brand-900))] hover:bg-[hsl(var(--nx-brand-700))] text-white rounded-[var(--nx-radius-md)] px-6 py-2.5 transition-all duration-[var(--nx-dur-2)] ease-[var(--nx-ease)]"
              >
                <Link to="/members" className="inline-flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {t('network.cta.members') || 'Voir les pays membres'}
                </Link>
              </Button>
              <Button 
                variant="outline" 
                asChild
                className="border-[hsl(var(--nx-border))] text-[hsl(var(--nx-text-700))] hover:bg-[hsl(var(--nx-surface))] hover:border-[hsl(var(--nx-brand-500))] rounded-[var(--nx-radius-md)] px-6 py-2.5 transition-all duration-[var(--nx-dur-2)] ease-[var(--nx-ease)]"
              >
                <Link to="/projects" className="inline-flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  {t('network.cta.projects') || 'Explorer les projets'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section Régions - Fond légèrement différent */}
      <section className="py-12 bg-[hsl(var(--nx-surface))]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-xl font-medium text-[hsl(var(--nx-text-900))]">
              {t('network.regions.title') || 'Les régions du réseau'}
            </h2>
            <p className="text-sm text-[hsl(var(--nx-text-500))] mt-2">
              {t('network.regions.subtitle') || 'Cliquez sur une région pour découvrir ses membres'}
            </p>
          </div>
          <RegionCards />
        </div>
      </section>

      {/* Section Activité - Timeline narrative */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-xl font-medium text-[hsl(var(--nx-text-900))]">
              {t('network.activity.title') || 'Activité récente'}
            </h2>
            <p className="text-sm text-[hsl(var(--nx-text-500))] mt-2">
              {t('network.activity.subtitle') || 'Les dernières contributions du réseau'}
            </p>
          </div>
          <ActivityTimeline maxItems={5} />
        </div>
      </section>

      {/* Section Actions secondaires - NexusActionCard */}
      <section className="py-12 bg-[hsl(var(--nx-surface))]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-6">
            <NexusActionCard
              icon={MessageSquare}
              title={t('network.action.discuss') || 'Échanger'}
              description={t('network.action.discuss.desc') || 'Participez aux discussions entre pairs du réseau.'}
              accent="brand"
              primaryAction={{
                label: t('common.discover') || 'Découvrir',
                href: '/forum'
              }}
            />
            
            <NexusActionCard
              icon={Calendar}
              title={t('network.action.events') || 'Participer'}
              description={t('network.action.events.desc') || 'Rejoignez les événements et ateliers du réseau.'}
              accent="coop"
              primaryAction={{
                label: t('common.discover') || 'Découvrir',
                href: '/events'
              }}
            />
            
            <NexusActionCard
              icon={BookOpen}
              title={t('network.action.resources') || 'Apprendre'}
              description={t('network.action.resources.desc') || 'Accédez aux ressources partagées par le réseau.'}
              accent="brand"
              primaryAction={{
                label: t('common.discover') || 'Découvrir',
                href: '/resources'
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default NetworkView;
