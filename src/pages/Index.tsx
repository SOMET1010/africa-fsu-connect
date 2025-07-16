import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Target, 
  Users, 
  TrendingUp, 
  MapPin,
  BookOpen,
  Calendar,
  MessageSquare,
  ArrowRight
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Target,
      title: "Projets FSU",
      description: "Suivi et gestion des initiatives de service universel à travers l'Afrique",
      link: "/projects"
    },
    {
      icon: BookOpen,
      title: "Bibliothèque de Ressources",
      description: "Guides, rapports et meilleures pratiques partagées par la communauté",
      link: "/resources"
    },
    {
      icon: Globe,
      title: "Répertoire des Organisations",
      description: "Cartographie interactive des agences FSU et partenaires continentaux",
      link: "/organizations"
    },
    {
      icon: MessageSquare,
      title: "Forum de Discussion",
      description: "Espace d'échange d'expériences et de coordination technique",
      link: "/forum"
    },
    {
      icon: Calendar,
      title: "Événements & Formation",
      description: "Agenda collaboratif et modules d'e-learning spécialisés",
      link: "/events"
    },
    {
      icon: TrendingUp,
      title: "Tableaux de Bord",
      description: "Analytics et reporting pour le suivi des performances régionales",
      link: "/dashboard"
    }
  ];

  const stats = [
    { label: "Pays Participants", value: "54", color: "text-[hsl(var(--primary))]" },
    { label: "Projets Actifs", value: "1,247", color: "text-[hsl(var(--fsu-blue))]" },
    { label: "Organisations", value: "186", color: "text-[hsl(var(--fsu-gold))]" },
    { label: "Bénéficiaires", value: "45M+", color: "text-[hsl(var(--secondary))]" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--fsu-blue))] text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4">
                <span className="text-2xl font-bold">FSU</span>
              </div>
              <div className="text-left">
                <h2 className="text-lg font-semibold">Plateforme Africaine</h2>
                <p className="text-white/80">Union Africaine des Télécommunications</p>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Collaboration et Innovation
              <span className="block text-3xl md:text-5xl text-[hsl(var(--fsu-gold))]">
                Fonds du Service Universel
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Unir les forces africaines pour une connectivité universelle et inclusive à travers le continent
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-[hsl(var(--primary))] hover:bg-white/90">
                <Link to="/auth" className="flex items-center">
                  Accéder au Tableau de Bord
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/projects">Explorer les Projets</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Écosystème Intégré de Collaboration
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Une plateforme complète pour coordonner, partager et accélérer les initiatives de service universel en Afrique
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-all hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--fsu-blue))] rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <Link to={feature.link}>
                    <Button variant="outline" className="w-full">
                      Découvrir
                      <ArrowRight className="ml-2 h-4 w-4" />
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
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Régions Africaines Connectées
            </h2>
            <p className="text-muted-foreground">
              Collaboration active à travers les communautés économiques régionales
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {["CEDEAO", "SADC", "EACO", "ECCAS", "UMA"].map((region, index) => (
              <Card key={index} className="text-center border-border">
                <CardContent className="pt-6">
                  <Badge className="mb-4 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--fsu-blue))] text-white">
                    {region}
                  </Badge>
                  <div className="flex items-center justify-center mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-[hsl(var(--primary))]" />
                    <span className="text-sm font-medium">
                      {Math.floor(Math.random() * 15) + 8} pays
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Users className="h-4 w-4 mr-2 text-[hsl(var(--fsu-blue))]" />
                    <span className="text-sm text-muted-foreground">
                      {Math.floor(Math.random() * 300) + 50} projets
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--fsu-blue))] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Rejoignez la Transformation Numérique de l'Afrique
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Ensemble, construisons un écosystème numérique inclusif qui ne laisse personne de côté
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[hsl(var(--primary))] hover:bg-white/90">
              <Link to="/auth">Créer un Compte</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              En Savoir Plus
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
