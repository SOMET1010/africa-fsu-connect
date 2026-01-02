import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHero } from "@/components/shared/PageHero";
import { GlassCard } from "@/components/ui/glass-card";
import { ModernButton } from "@/components/ui/modern-button";
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
      case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'in-progress': return 'bg-[hsl(var(--nx-cyan)/0.1)] text-[hsl(var(--nx-cyan))] border-[hsl(var(--nx-cyan)/0.2)]';
      case 'upcoming': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'planned': return 'bg-white/5 text-white/60 border-white/10';
      default: return 'bg-white/5';
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
    <div className="min-h-screen bg-[hsl(var(--nx-bg))]">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero */}
        <PageHero
          badge="Feuille de Route 2025-2026"
          badgeIcon={Calendar}
          title="Notre Vision pour la Transformation Numérique"
          subtitle="Un plan stratégique pour connecter l'Afrique et réduire la fracture numérique à travers une plateforme collaborative innovante."
        />

        {/* Milestones Timeline */}
        <GlassCard className="p-6 animate-fade-in">
          <h3 className="text-lg font-semibold text-white mb-2">Jalons Clés 2025</h3>
          <p className="text-sm text-white/60 mb-6">Les étapes majeures de notre développement</p>
          <div className="flex flex-wrap justify-between items-center gap-4">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[hsl(var(--nx-gold)/0.2)] flex items-center justify-center">
                  <milestone.icon className="h-5 w-5 text-[hsl(var(--nx-gold))]" />
                </div>
                <div>
                  <p className="text-xs text-white/50">{milestone.date}</p>
                  <p className="text-sm font-medium text-white">{milestone.event}</p>
                </div>
                {idx < milestones.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-white/30 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Phases */}
        <div className="space-y-6 animate-fade-in">
          {phases.map((phase, idx) => (
            <GlassCard 
              key={idx} 
              className={`p-6 transition-all duration-300 ${
                phase.status === 'in-progress' ? 'ring-2 ring-[hsl(var(--nx-cyan)/0.3)]' : ''
              }`}
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Phase Info */}
                <div className="lg:w-1/3 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      phase.status === 'completed' ? 'bg-green-500/10' :
                      phase.status === 'in-progress' ? 'bg-[hsl(var(--nx-cyan)/0.1)]' :
                      'bg-white/5'
                    }`}>
                      {phase.status === 'completed' ? (
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      ) : phase.status === 'in-progress' ? (
                        <Clock className="h-6 w-6 text-[hsl(var(--nx-cyan))] animate-pulse" />
                      ) : (
                        <Target className="h-6 w-6 text-white/40" />
                      )}
                    </div>
                    <div>
                      <Badge className={getStatusColor(phase.status)}>
                        {getStatusLabel(phase.status)}
                      </Badge>
                      <h3 className="text-lg font-bold mt-1 text-white">{phase.quarter}</h3>
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold text-white">{phase.title}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Progression</span>
                      <span className="font-medium text-white">{phase.progress}%</span>
                    </div>
                    <Progress value={phase.progress} className="h-2" />
                  </div>
                  <Badge variant="outline" className="text-xs border-white/20 text-white/70">
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
                          item.done ? 'bg-green-500/5' : 'bg-white/5'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          item.done ? 'bg-green-500 text-white' : 'bg-white/20'
                        }`}>
                          {item.done && <CheckCircle className="h-3 w-3" />}
                        </div>
                        <span className={`text-sm ${item.done ? 'text-white' : 'text-white/50'}`}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* CTA */}
        <GlassCard className="p-8 text-center bg-gradient-to-r from-[hsl(var(--nx-gold)/0.2)] to-[hsl(var(--nx-cyan)/0.2)] animate-fade-in">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Rejoignez l'aventure SUTEL
          </h2>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Participez à la transformation numérique de l'Afrique. Que vous soyez une agence FSU, 
            un partenaire technique ou une organisation internationale, votre contribution est précieuse.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ModernButton asChild>
              <Link to="/auth">
                Créer un compte
              </Link>
            </ModernButton>
            <ModernButton variant="outline" asChild>
              <Link to="/about">
                En savoir plus
              </Link>
            </ModernButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Roadmap;
