
import { useState, useEffect } from "react";
import { BarChart3, Users, Target, Zap, Calendar, MessageSquare, FileText, TrendingUp } from "lucide-react";
import { ModernStatsWidget } from "./widgets/ModernStatsWidget";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { EnhancedCard, IconCard } from "@/components/ui/enhanced-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { CommandPalette } from "@/components/ui/command-palette";

export const EnhancedDashboard = () => {
  const { profile } = useAuth();
  const [dashboardStats, setDashboardStats] = useState([
    {
      title: "Projets Actifs",
      value: "12",
      change: { value: "+2", trend: "up" as const },
      icon: Target,
      color: "bg-blue-500",
      clickable: true,
      onStatClick: () => console.log("Navigate to projects")
    },
    {
      title: "Collaborateurs",
      value: "248",
      change: { value: "+15", trend: "up" as const },
      icon: Users,
      color: "bg-green-500",
      clickable: true,
    },
    {
      title: "Documents",
      value: "89",
      change: { value: "+7", trend: "up" as const },
      icon: FileText,
      color: "bg-purple-500",
      clickable: true,
    },
    {
      title: "Événements",
      value: "5",
      change: { value: "-1", trend: "down" as const },
      icon: Calendar,
      color: "bg-orange-500",
      clickable: true,
    }
  ]);

  const quickActions = [
    {
      title: "Nouveau Projet",
      description: "Lancez une nouvelle initiative",
      icon: Target,
      href: "/projects?action=create",
      color: "bg-blue-500"
    },
    {
      title: "Rejoindre Discussion",
      description: "Participez au forum",
      icon: MessageSquare,
      href: "/forum",
      color: "bg-green-500"
    },
    {
      title: "Consulter Ressources",
      description: "Explorez les documents",
      icon: FileText,
      href: "/resources",
      color: "bg-purple-500"
    },
    {
      title: "Voir Événements",
      description: "Prochaines activités",
      icon: Calendar,
      href: "/events",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Hero Section */}
        <ScrollReveal direction="fade">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 text-white">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold font-poppins mb-3">
                    Bonjour, {profile?.first_name || 'Collaborateur'} ! 👋
                  </h1>
                  <p className="text-xl text-white/90 font-inter">
                    Votre espace de travail collaboratif vous attend
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <CommandPalette />
                  <Button variant="secondary" size="lg" className="bg-white/20 backdrop-blur border-white/30 hover:bg-white/30">
                    <Zap className="mr-2 h-5 w-5" />
                    Actions Rapides
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats Widget */}
        <ModernStatsWidget 
          stats={dashboardStats}
          title="Aperçu de votre activité"
        />

        {/* Quick Actions Grid */}
        <ScrollReveal delay={400}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold font-poppins">Actions Rapides</h2>
                <p className="text-muted-foreground font-inter">Accédez rapidement à vos outils essentiels</p>
              </div>
              <Badge variant="secondary" className="hidden sm:flex">
                4 raccourcis disponibles
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <ScrollReveal key={index} delay={100 * (index + 1)} direction="up">
                  <Link to={action.href}>
                    <IconCard
                      icon={action.icon}
                      title={action.title}
                      description={action.description}
                      variant="glassmorphism"
                      hover="lift"
                      interactive
                      iconColor="text-white"
                      className="h-full group"
                    >
                      <div className={`w-full h-1 rounded-full ${action.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    </IconCard>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Recent Activity */}
        <ScrollReveal delay={600}>
          <EnhancedCard variant="glassmorphism" hover="glow" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold font-poppins flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Activité Récente
                </h3>
                <p className="text-sm text-muted-foreground font-inter mt-1">
                  Vos dernières interactions sur la plateforme
                </p>
              </div>
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </div>
            
            <div className="space-y-4">
              {[
                { action: "Projet créé", title: "Initiative Numérique 2024", time: "Il y a 2h", type: "project" },
                { action: "Document ajouté", title: "Guide des bonnes pratiques", time: "Il y a 4h", type: "document" },
                { action: "Discussion rejointe", title: "Forum Développement Durable", time: "Hier", type: "forum" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === "project" ? "bg-blue-500" : 
                    activity.type === "document" ? "bg-purple-500" : "bg-green-500"
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}: {activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </EnhancedCard>
        </ScrollReveal>
      </div>
    </div>
  );
};
