import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Users, 
  ArrowRight, 
  Rocket,
  MessageSquare,
  Calendar,
  FileText,
  Sparkles
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { PresenceIndicator } from "@/components/network/PresenceIndicator";
import { ActivityTimeline } from "@/components/network/ActivityTimeline";
import { RegionCards } from "@/components/network/RegionCards";

const NetworkView = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Hero Section - Ultra Light */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl text-center space-y-6">
          {/* Badge */}
          <Badge 
            variant="outline" 
            className="px-4 py-2 bg-primary/5 border-primary/20"
          >
            <Globe className="w-4 h-4 mr-2" />
            {t('network.badge') || 'Réseau SUTEL'}
          </Badge>

          {/* Message narratif unique */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            {t('network.hero.title') || '54 pays construisent ensemble'}
            <br />
            <span className="text-primary">
              {t('network.hero.subtitle') || "l'avenir du Service Universel"}
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('network.hero.narrative') || 
              "Une communauté panafricaine de partage et de coopération. Chaque pays apporte ses expériences, ses projets et ses apprentissages."}
          </p>

          {/* Présence réseau - barre visuelle, pas de chiffres */}
          <div className="py-6">
            <PresenceIndicator 
              level={6} 
              maxLevel={7}
              label={t('network.presence.label') || 'Présence réseau'}
              description={t('network.presence.description') || 'Forte activité ce mois'}
            />
          </div>

          {/* 2 CTAs maximum */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="px-8">
              <Link to="/members">
                <Users className="mr-2 h-5 w-5" />
                {t('network.cta.members') || 'Voir les pays membres'}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link to="/projects">
                <Rocket className="mr-2 h-5 w-5" />
                {t('network.cta.projects') || 'Explorer les projets'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Régions du réseau - carte égalitaire */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {t('network.regions.title') || 'Régions du réseau'}
            </h2>
            <p className="text-muted-foreground">
              {t('network.regions.subtitle') || 'Tous les pays membres, par région'}
            </p>
          </div>
          <RegionCards />
        </div>
      </section>

      {/* Activité récente - timeline, pas d'alertes punitives */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {t('network.activity.title') || 'Activité récente du réseau'}
            </h2>
            <p className="text-muted-foreground">
              {t('network.activity.subtitle') || 'Ce qui se passe dans la communauté'}
            </p>
          </div>
          <ActivityTimeline />
        </div>
      </section>

      {/* Actions secondaires */}
      <section className="py-12 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">
                  {t('network.action.discuss') || 'Échanger'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('network.action.discuss.desc') || 'Rejoindre les discussions'}
                </p>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/forum">
                    {t('common.discover') || 'Découvrir'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">
                  {t('network.action.events') || 'Participer'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('network.action.events.desc') || 'Événements à venir'}
                </p>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/events">
                    {t('common.discover') || 'Découvrir'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">
                  {t('network.action.resources') || 'Apprendre'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('network.action.resources.desc') || 'Guides et ressources'}
                </p>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/resources">
                    {t('common.discover') || 'Découvrir'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NetworkView;
