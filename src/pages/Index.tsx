
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroSection } from "@/components/landing/HeroSection";
import { 
  Target, 
  Users, 
  BookOpen,
  MessageSquare,
  Calendar,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Globe,
  Building2
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Target,
      title: "Projets FSU",
      description: "Suivi et gestion collaborative des initiatives de service universel",
      link: "/projects",
      highlights: ["Gestion de projet", "Suivi en temps réel", "Rapports automatisés"]
    },
    {
      icon: BookOpen,
      title: "Ressources Partagées",
      description: "Bibliothèque de guides, rapports et meilleures pratiques",
      link: "/docs",
      highlights: ["Guides pratiques", "Études de cas", "Documentation technique"]
    },
    {
      icon: Building2,
      title: "Répertoire d'Organisations",
      description: "Cartographie interactive des agences FSU et partenaires",
      link: "/organizations",
      highlights: ["Carte interactive", "Profils détaillés", "Coordination facilitée"]
    },
    {
      icon: MessageSquare,
      title: "Forum Collaboratif",
      description: "Espace d'échange d'expériences et de coordination",
      link: "/forum",
      highlights: ["Discussions thématiques", "Expertise partagée", "Réseau professionnel"]
    },
    {
      icon: Calendar,
      title: "Événements & Formation",
      description: "Agenda collaboratif et modules d'apprentissage",
      link: "/events",
      highlights: ["Formations en ligne", "Webinaires", "Rencontres régionales"]
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Tableaux de bord et analyses de performance",
      link: "/dashboard",
      highlights: ["Métriques clés", "Analyses régionales", "Rapports personnalisés"]
    }
  ];

  const regions = [
    { name: "CEDEAO", countries: 15, projects: 342, color: "bg-blue-500" },
    { name: "SADC", countries: 16, projects: 289, color: "bg-green-500" },
    { name: "EACO", countries: 8, projects: 198, color: "bg-purple-500" },
    { name: "ECCAS", countries: 11, projects: 156, color: "bg-orange-500" },
    { name: "UMA", countries: 5, projects: 143, color: "bg-red-500" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <Globe className="w-4 h-4 mr-2" />
              Écosystème Intégré
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Une Plateforme Complète pour la Collaboration
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tous les outils nécessaires pour coordonner, partager et accélérer les initiatives FSU
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 mb-4">
                    {feature.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {highlight}
                      </div>
                    ))}
                  </div>
                  <Link to={feature.link}>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      Découvrir
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regions Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              Collaboration Régionale
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Communautés Économiques Africaines
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Coordination active à travers les cinq principales régions du continent
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {regions.map((region, index) => (
              <Card key={index} className="text-center border-border bg-card hover:shadow-md transition-all">
                <CardContent className="pt-6 pb-4">
                  <div className={`w-12 h-12 ${region.color} rounded-xl mx-auto mb-4 flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">{region.name[0]}</span>
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2">{region.name}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center">
                      <Globe className="h-4 w-4 mr-2" />
                      {region.countries} pays
                    </div>
                    <div className="flex items-center justify-center">
                      <Target className="h-4 w-4 mr-2" />
                      {region.projects} projets
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Rejoignez la Transformation Numérique de l'Afrique
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Ensemble, construisons un écosystème numérique inclusif et durable
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8 py-3">
              <Link to="/auth" className="flex items-center">
                Créer un Compte
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-3">
              <Link to="/organizations">En Savoir Plus</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
