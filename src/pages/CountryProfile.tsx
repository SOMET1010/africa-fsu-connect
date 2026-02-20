import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Mail, 
  Rocket, 
  FileText, 
  Users,
  Globe,
  ExternalLink
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useCountryProfile } from "@/hooks/useCountryProfile";
import { PresenceIndicator } from "@/components/network/PresenceIndicator";
import { CountryIdentityCard } from "@/components/country/CountryIdentityCard";

const CountryProfile = () => {
  const { code } = useParams<{ code: string }>();
  const { t } = useTranslation();
  const { country, isLoading, projects, practices } = useCountryProfile(code || '');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {t('country.not.found') || "Pays non trouvé"}
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/members">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.back') || "Retour"}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Bouton retour */}
      <div className="container mx-auto px-4 py-4">
        <Button asChild variant="ghost" size="sm">
          <Link to="/members">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('members.back') || "Retour à l'annuaire"}
          </Link>
        </Button>
      </div>

      {/* Page 1 - Identité Réseau (Ultra Light) */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <CountryIdentityCard country={country} />

          {/* Message narratif unique */}
          <div className="mt-8 text-center">
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t('country.narrative', { country: country.name }) || 
                `${country.name} contribue activement au réseau UDC en partageant des projets et des expériences avec les autres pays membres.`}
            </p>
          </div>

          {/* 2 CTAs maximum */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" className="px-8">
              <Mail className="mr-2 h-5 w-5" />
              {t('country.cta.contact') || "Entrer en contact"}
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              <FileText className="mr-2 h-5 w-5" />
              {t('country.cta.contributions') || "Voir les contributions"}
            </Button>
          </div>

          {/* Indicateur de présence discret */}
          <div className="mt-10">
            <PresenceIndicator 
              level={country.presenceLevel || 4}
              maxLevel={7}
              label={t('country.presence.label') || "Présence réseau"}
              description={t('country.presence.description') || "Participation récente au réseau"}
            />
          </div>
        </div>
      </section>

      {/* Page 2+ - Contenu progressif (sur demande) */}
      <section className="py-8 px-4 border-t border-border/50">
        <div className="container mx-auto max-w-4xl">
          <Tabs defaultValue="contributions" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="contributions">
                {t('country.tab.contributions') || "Contributions"}
              </TabsTrigger>
              <TabsTrigger value="projects">
                {t('country.tab.projects') || "Projets"}
              </TabsTrigger>
              <TabsTrigger value="practices">
                {t('country.tab.practices') || "Bonnes pratiques"}
              </TabsTrigger>
              <TabsTrigger value="contact">
                {t('country.tab.contact') || "Contact"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contributions" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {projects?.length || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t('country.stat.projects') || "Projets partagés"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-accent mb-1">
                      {practices?.length || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t('country.stat.practices') || "Bonnes pratiques"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-foreground mb-1">
                      {country.collaborationsCount || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t('country.stat.collaborations') || "Collaborations"}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-center text-muted-foreground">
                {t('country.contributions.summary') || 
                  "Ce pays participe activement au partage d'expériences dans le réseau UDC."}
              </p>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              {projects && projects.length > 0 ? (
                projects.map((project, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Rocket className="h-5 w-5 text-primary" />
                        {project.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        {project.description}
                      </p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        {t('country.project.inspire') || "S'inspirer"}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Rocket className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    {t('country.projects.consolidation') || "Données en consolidation"}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="practices" className="space-y-4">
              {practices && practices.length > 0 ? (
                practices.map((practice, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">{practice.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {practice.description}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    {t('country.practices.consolidation') || "Données en consolidation"}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {t('country.focal.title') || "Point focal"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {country.focalPoint ? (
                    <div className="space-y-2">
                      <p className="font-medium">{country.focalPoint.name}</p>
                      <p className="text-sm text-muted-foreground">{country.focalPoint.role}</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Mail className="mr-2 h-4 w-4" />
                        {t('country.focal.contact') || "Contacter"}
                      </Button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      {t('country.focal.pending') || "Information à venir"}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default CountryProfile;
