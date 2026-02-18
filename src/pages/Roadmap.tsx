import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GlassCard } from "@/components/ui/glass-card";
import { ModernButton } from "@/components/ui/modern-button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Target,
  Rocket,
  Users,
  Globe,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import RoadmapTimeline from "@/components/roadmap/RoadmapTimeline";
import RoadmapPhaseCard from "@/components/roadmap/RoadmapPhaseCard";

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

const Roadmap = () => {
  return (
    <div className="min-h-screen bg-[hsl(var(--nx-bg))]">
      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Enhanced Hero */}
        <ScrollReveal direction="fade">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--nx-night))] via-[hsl(var(--nx-deep))] to-[hsl(var(--nx-night))] border border-white/10">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[hsl(var(--nx-gold)/0.3)] rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[hsl(var(--nx-cyan)/0.2)] rounded-full blur-2xl" />
            </div>
            <div className="relative px-8 py-14 md:px-12 md:py-20">
              <div className="max-w-3xl">
                <Badge variant="outline" className="mb-5 px-4 py-2 border-white/20 bg-white/5 text-white/80">
                  <Calendar className="w-4 h-4 mr-2" />
                  Feuille de Route 2025-2026
                </Badge>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
                  Notre Vision pour la{' '}
                  <span className="text-[hsl(var(--nx-gold))]">Transformation Numérique</span>
                </h1>
                <p className="text-lg text-white/85 max-w-2xl leading-relaxed">
                  Un plan stratégique pour connecter l'Afrique et réduire la fracture numérique 
                  à travers une plateforme collaborative innovante.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Milestones Timeline */}
        <RoadmapTimeline milestones={milestones} />

        {/* Phases */}
        <div className="space-y-6 animate-fade-in">
          {phases.map((phase, idx) => (
            <RoadmapPhaseCard key={idx} phase={phase} />
          ))}
        </div>

        {/* CTA */}
        <GlassCard className="p-8 text-center bg-gradient-to-r from-[hsl(var(--nx-gold)/0.2)] to-[hsl(var(--nx-cyan)/0.2)] animate-fade-in">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Rejoignez l'aventure SUTEL
          </h2>
          <p className="text-white/85 mb-6 max-w-2xl mx-auto">
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
