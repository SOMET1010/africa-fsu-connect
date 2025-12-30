import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Target,
  Rocket,
  Users,
  Globe,
  ArrowRight,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

const Roadmap = () => {
  const phases = [
    {
      quarter: "Q1 2025",
      title: "Phase Pilote & Setup",
      status: "completed",
      progress: 100,
      items: [
        { text: "Conception de l'architecture technique", done: true },
        { text: "Développement du MVP", done: true },
        { text: "Tests avec 5 pays pilotes", done: true },
        { text: "Formation des équipes techniques", done: true }
      ],
      highlight: "Lancement de la version bêta"
    },
    {
      quarter: "Q2 2025",
      title: "Lancement & Déploiement Initial",
      status: "in-progress",
      progress: 65,
      items: [
        { text: "Déploiement de la plateforme de production", done: true },
        { text: "Intégration des 11 modules principaux", done: true },
        { text: "Onboarding des agences FSU", done: false },
        { text: "Atelier continental (Mai 2025)", done: false }
      ],
      highlight: "Atelier de lancement UAT"
    },
    {
      quarter: "Q3 2025",
      title: "Expansion Régionale",
      status: "upcoming",
      progress: 0,
      items: [
        { text: "Extension à 30 pays africains", done: false },
        { text: "Lancement du module E-Learning", done: false },
        { text: "Activation du Chatbot SUTA (IA)", done: false },
        { text: "Intégration des APIs partenaires (UIT, GSMA)", done: false }
      ],
      highlight: "Couverture panafricaine"
    },
    {
      quarter: "Q4 2025",
      title: "Consolidation & Optimisation",
      status: "upcoming",
      progress: 0,
      items: [
        { text: "Déploiement complet des 54 pays", done: false },
        { text: "Tableau de bord public opérationnel", done: false },
        { text: "Synchronisation temps réel des données", done: false },
        { text: "Rapports automatisés pour les partenaires", done: false }
      ],
      highlight: "Plateforme complète"
    },
    {
      quarter: "2026",
      title: "Version 2.0 & Innovation",
      status: "planned",
      progress: 0,
      items: [
        { text: "Intelligence Artificielle avancée", done: false },
        { text: "Prédictions et analyses prédictives", done: false },
        { text: "Application mobile native", done: false },
        { text: "API ouverte pour intégrations tierces", done: false }
      ],
      highlight: "IA & Mobile"
    }
  ];

  const milestones = [
    { date: "Janvier 2025", event: "Lancement version bêta", icon: Rocket },
    { date: "Mars 2025", event: "Premier atelier technique", icon: Users },
    { date: "Mai 2025", event: "Atelier continental UAT", icon: Globe },
    { date: "Septembre 2025", event: "30 pays connectés", icon: Target },
    { date: "Décembre 2025", event: "Plateforme complète", icon: Star }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'in-progress': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'upcoming': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'planned': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in-progress': return 'En cours';
      case 'upcoming': return 'À venir';
      case 'planned': return 'Planifié';
      default: return status;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        <Badge variant="outline" className="px-4 py-2">
          <Calendar className="h-4 w-4 mr-2" />
          Feuille de Route 2025-2026
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold">
          Notre Vision pour la
          <span className="text-primary"> Transformation Numérique</span>
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Un plan stratégique pour connecter l'Afrique et réduire la fracture numérique
          à travers une plateforme collaborative innovante.
        </p>
      </div>

      {/* Milestones Timeline */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle>Jalons Clés 2025</CardTitle>
          <CardDescription>Les étapes majeures de notre développement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-between items-center gap-4">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <milestone.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{milestone.date}</p>
                  <p className="text-sm font-medium">{milestone.event}</p>
                </div>
                {idx < milestones.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Phases */}
      <div className="space-y-6">
        {phases.map((phase, idx) => (
          <Card 
            key={idx} 
            className={`transition-all duration-300 ${
              phase.status === 'in-progress' ? 'ring-2 ring-primary/20' : ''
            }`}
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Phase Info */}
                <div className="lg:w-1/3 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      phase.status === 'completed' ? 'bg-green-500/10' :
                      phase.status === 'in-progress' ? 'bg-blue-500/10' :
                      'bg-muted'
                    }`}>
                      {phase.status === 'completed' ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : phase.status === 'in-progress' ? (
                        <Clock className="h-6 w-6 text-blue-500 animate-pulse" />
                      ) : (
                        <Target className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <Badge className={getStatusColor(phase.status)}>
                        {getStatusLabel(phase.status)}
                      </Badge>
                      <h3 className="text-lg font-bold mt-1">{phase.quarter}</h3>
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold">{phase.title}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span className="font-medium">{phase.progress}%</span>
                    </div>
                    <Progress value={phase.progress} className="h-2" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    {phase.highlight}
                  </Badge>
                </div>

                {/* Right: Items */}
                <div className="lg:w-2/3">
                  <div className="grid md:grid-cols-2 gap-3">
                    {phase.items.map((item, itemIdx) => (
                      <div 
                        key={itemIdx}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          item.done ? 'bg-green-500/5' : 'bg-muted/50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          item.done ? 'bg-green-500 text-white' : 'bg-muted-foreground/20'
                        }`}>
                          {item.done && <CheckCircle className="h-3 w-3" />}
                        </div>
                        <span className={`text-sm ${item.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-primary to-accent text-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Rejoignez l'aventure SUTEL
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Participez à la transformation numérique de l'Afrique. Que vous soyez une agence FSU, 
            un partenaire technique ou une organisation internationale, votre contribution est précieuse.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link to="/auth">
                Créer un compte
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white/30 hover:bg-white/20" asChild>
              <Link to="/about">
                En savoir plus
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Roadmap;
