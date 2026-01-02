import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Users, 
  Globe, 
  Target, 
  Award,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const pillars = [
    {
      title: "Mise en Réseau & Collaboration",
      description: "Créer un écosystème connecté entre les agences FSU africaines",
      icon: Users
    },
    {
      title: "Centralisation des Données",
      description: "Agrégation et standardisation des indicateurs FSU",
      icon: Target
    },
    {
      title: "Modernisation & Qualité",
      description: "Outils innovants pour améliorer l'efficacité opérationnelle",
      icon: Award
    },
    {
      title: "Visibilité & Partenariats",
      description: "Renforcer la visibilité internationale et attirer les partenaires",
      icon: Globe
    },
    {
      title: "Innovation & Alignement",
      description: "Alignement avec les objectifs de développement durable",
      icon: CheckCircle
    }
  ];

  const steeringCommittee = [
    { role: "Président", organization: "UAT - Union Africaine des Télécommunications" },
    { role: "Vice-Président", organization: "ANSUT - Côte d'Ivoire" },
    { role: "Membre", organization: "Représentant CEDEAO" },
    { role: "Membre", organization: "Représentant SADC" },
    { role: "Membre", organization: "Représentant EACO" },
    { role: "Membre", organization: "Représentant ECCAS" },
    { role: "Membre", organization: "Représentant UMA" },
    { role: "Observateur", organization: "UIT - Union Internationale des Télécommunications" }
  ];

  const regions = [
    { name: "CEDEAO", countries: 15, color: "bg-blue-500" },
    { name: "SADC", countries: 16, color: "bg-green-500" },
    { name: "EACO", countries: 8, color: "bg-purple-500" },
    { name: "ECCAS", countries: 11, color: "bg-orange-500" },
    { name: "UMA", countries: 5, color: "bg-red-500" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-12 relative z-10">
      {/* Hero */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        <Badge variant="outline" className="px-4 py-2 bg-white/5 border-white/20 text-white">
          <Building2 className="h-4 w-4 mr-2" />
          À Propos de NEXUS
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          La Première Plateforme Africaine pour le
          <span className="text-[hsl(var(--nx-gold))]"> Service Universel</span>
        </h1>
        <p className="text-xl text-white/70 leading-relaxed">
          Une initiative conjointe de l'Union Africaine des Télécommunications (UAT) 
          et de l'ANSUT Côte d'Ivoire pour réduire la fracture numérique sur le continent africain.
        </p>
      </div>

      {/* Mission */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Notre Mission</h2>
              <p className="text-white/70 leading-relaxed">
                La Plateforme NEXUS vise à créer un guichet unique panafricain pour la collaboration,
                l'innovation et la mutualisation des ressources dans le domaine du Service Universel 
                des Télécommunications.
              </p>
              <p className="text-white/70 leading-relaxed">
                En connectant les 54 pays africains, nous facilitons le partage des meilleures pratiques, 
                l'harmonisation des politiques et l'optimisation des investissements pour garantir 
                l'accès aux services de télécommunications pour tous les citoyens africains.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "54", label: "Pays membres" },
                { value: "127", label: "Projets actifs" },
                { value: "$2.4B", label: "Budget total" },
                { value: "68%", label: "Couverture" }
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <p className="text-3xl font-bold text-[hsl(var(--nx-gold))]">{stat.value}</p>
                  <p className="text-sm text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5 Pillars */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-white">Les 5 Piliers Fondateurs</h2>
          <p className="text-white/60">
            Notre vision stratégique repose sur cinq piliers essentiels
          </p>
        </div>
        <div className="grid md:grid-cols-5 gap-4">
          {pillars.map((pillar, idx) => (
            <Card key={idx} className="text-center bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-6 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-xl bg-[hsl(var(--nx-gold)/0.2)] flex items-center justify-center group-hover:bg-[hsl(var(--nx-gold)/0.3)] transition-colors">
                  <pillar.icon className="h-7 w-7 text-[hsl(var(--nx-gold))]" />
                </div>
                <h3 className="font-semibold text-sm text-white">{pillar.title}</h3>
                <p className="text-xs text-white/60">{pillar.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Governance */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="bg-white/5 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5 text-[hsl(var(--nx-cyan))]" />
              Comité de Pilotage NEXUS
            </CardTitle>
            <CardDescription className="text-white/60">
              Structure de gouvernance et prise de décision
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {steeringCommittee.map((member, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge variant={member.role === "Président" ? "default" : "outline"} className={member.role === "Président" ? "bg-[hsl(var(--nx-gold))] text-[hsl(var(--nx-night))]" : "border-white/20 text-white/80"}>
                    {member.role}
                  </Badge>
                  <span className="text-sm text-white/80">{member.organization}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Globe className="h-5 w-5 text-[hsl(var(--nx-cyan))]" />
              Régions Couvertes
            </CardTitle>
            <CardDescription className="text-white/60">
              5 communautés économiques régionales africaines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {regions.map((region) => (
              <div 
                key={region.name}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className={`w-10 h-10 ${region.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                  {region.name[0]}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{region.name}</p>
                  <p className="text-sm text-white/60">{region.countries} pays membres</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Partners */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardHeader className="text-center">
          <CardTitle className="text-white">Nos Partenaires Institutionnels</CardTitle>
          <CardDescription className="text-white/60">
            Une coalition d'organisations engagées pour le service universel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "UAT", full: "Union Africaine des Télécommunications" },
              { name: "ANSUT", full: "Agence Nationale du Service Universel" },
              { name: "UA", full: "Union Africaine" },
              { name: "UIT", full: "Union Internationale des Télécommunications" }
            ].map((partner) => (
              <div key={partner.name} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-3 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-[hsl(var(--nx-gold)/0.2)] transition-colors border border-white/10">
                  <span className="font-bold text-lg text-[hsl(var(--nx-gold))]">{partner.name}</span>
                </div>
                <p className="text-xs text-white/60">{partner.full}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="bg-white/[0.03] backdrop-blur-md border-white/10">
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Contactez-nous</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[hsl(var(--nx-cyan))]" />
                  <a href="mailto:secretariat@atu-uat.org" className="text-white/80 hover:text-[hsl(var(--nx-gold))] transition-colors">
                    secretariat@atu-uat.org
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-[hsl(var(--nx-cyan))]" />
                  <a href="https://platform.atu-uat.org" className="text-white/80 hover:text-[hsl(var(--nx-gold))] transition-colors">
                    platform.atu-uat.org
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[hsl(var(--nx-cyan))]" />
                  <span className="text-white/80">Abidjan, Côte d'Ivoire</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Button asChild size="lg" className="bg-[hsl(var(--nx-gold))] hover:bg-[hsl(var(--nx-gold)/0.9)] text-[hsl(var(--nx-night))]">
                <Link to="/auth">
                  Rejoindre la plateforme
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/roadmap">
                  Voir la feuille de route
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
