
import { useState, useEffect } from "react";
import { BarChart3, Users, Target, Zap, Calendar, MessageSquare, FileText, TrendingUp, Settings, Bell, Shield, Activity, CheckCircle, AlertTriangle } from "lucide-react";
import { ModernCard } from "@/components/ui/modern-card";
import { ModernButton } from "@/components/ui/modern-button";
import { ModernStatsCard } from "@/components/ui/modern-stats-card";
import { GlassCard } from "@/components/ui/glass-card";
import { HeroSection } from "@/components/ui/hero-section";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/layout/PageContainer";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Link } from "react-router-dom";

export const ModernDashboard = () => {
  const { profile } = useAuth();
  const { stats, loading } = useDashboardStats();
  
  console.log("ModernDashboard rendering, profile:", profile);
  
  const [dashboardStats, setDashboardStats] = useState([
    {
      title: "Projets Actifs",
      value: stats.totalSubmissions || 12,
      icon: Target,
      trend: { value: 8, label: "Cette semaine", positive: true },
      description: "Projets en cours de développement"
    },
    {
      title: "Collaborateurs",
      value: stats.totalProfiles || 248,
      icon: Users,
      trend: { value: 12, label: "Ce mois", positive: true },
      description: "Membres actifs de la communauté"
    },
    {
      title: "Documents",
      value: stats.totalDocuments || 89,
      icon: FileText,
      trend: { value: 15, label: "Documents ajoutés", positive: true },
      description: "Ressources disponibles"
    },
    {
      title: "Événements",
      value: stats.totalEvents || 5,
      icon: Calendar,
      trend: { value: -2, label: "Cette semaine", positive: false },
      description: "Prochaines activités"
    }
  ]);

  useEffect(() => {
    if (!loading) {
      setDashboardStats(prev => prev.map((stat, index) => ({
        ...stat,
        value: [stats.totalSubmissions, stats.totalProfiles, stats.totalDocuments, stats.totalEvents][index] || stat.value
      })));
    }
  }, [stats, loading]);

  const quickActions = [
    {
      title: "Nouveau Projet",
      description: "Lancez une nouvelle initiative FSU",
      icon: Target,
      href: "/projects?action=create",
      color: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-600"
    },
    {
      title: "Forum Communauté",
      description: "Participez aux discussions",
      icon: MessageSquare,
      href: "/forum",
      color: "from-green-500/20 to-green-600/20",
      iconColor: "text-green-600"
    },
    {
      title: "Centre de Ressources",
      description: "Explorez la documentation",
      icon: FileText,
      href: "/resources",
      color: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-600"
    },
    {
      title: "Calendrier Événements",
      description: "Prochaines activités",
      icon: Calendar,
      href: "/events",
      color: "from-orange-500/20 to-orange-600/20",
      iconColor: "text-orange-600"
    }
  ];

  const recentActivity = [
    { 
      action: "Projet créé", 
      title: "Initiative Connectivité Rurale 2024", 
      time: "Il y a 2h", 
      type: "success",
      user: "Marie Kouassi",
      icon: CheckCircle
    },
    { 
      action: "Document ajouté", 
      title: "Guide Implementation FSU", 
      time: "Il y a 4h", 
      type: "info",
      user: "Ahmed Diallo",
      icon: FileText
    },
    { 
      action: "Discussion créée", 
      title: "Stratégies Développement Digital", 
      time: "Hier", 
      type: "info",
      user: "Grace Okonkwo",
      icon: MessageSquare
    },
    { 
      action: "Événement planifié", 
      title: "Webinaire Innovation Télécom", 
      time: "Il y a 1 jour", 
      type: "warning",
      user: "Jean Mukendi",
      icon: Calendar
    }
  ];

  const securityStatus = {
    level: "Élevé",
    alerts: 0,
    lastUpdate: "Il y a 2 minutes"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <PageContainer size="xl" padding="md">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-muted/50 rounded-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-40 bg-muted/50 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Subtle Background Effect */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <PageContainer size="xl" padding="md" className="space-y-6 relative z-10">
        
        {/* Hero Section */}
        <ScrollReveal direction="fade" delay={0}>
          <HeroSection
            title={`Bonjour, ${profile?.first_name || 'Collaborateur'} ! 👋`}
            subtitle="Dashboard FSU"
            description="Votre espace de travail collaboratif FSU vous attend"
            className="py-6"
            actions={[
              {
                label: "Actions Rapides",
                onClick: () => {},
                variant: "default",
                icon: <Zap className="h-5 w-5" />
              },
              {
                label: "Préférences",
                onClick: () => {},
                variant: "outline",
                icon: <Settings className="h-4 w-4" />
              }
            ]}
          />
        </ScrollReveal>

        {/* Stats Cards */}
        <ScrollReveal direction="up" delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardStats.map((stat, index) => (
              <ScrollReveal key={index} direction="up" delay={300 + index * 100}>
                <ModernStatsCard
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  trend={stat.trend}
                  description={stat.description}
                  variant="gradient"
                  size="md"
                />
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        {/* Security Status */}
        <ScrollReveal direction="up" delay={600}>
          <GlassCard variant="subtle" className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/20">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Sécurité du Système</h3>
                  <p className="text-sm text-muted-foreground">Niveau: {securityStatus.level}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                  {securityStatus.alerts} alertes
                </Badge>
                <Link to="/security">
                  <ModernButton variant="ghost" size="sm">
                    <Activity className="h-4 w-4 mr-2" />
                    Détails
                  </ModernButton>
                </Link>
              </div>
            </div>
          </GlassCard>
        </ScrollReveal>

        {/* Quick Actions Grid */}
        <ScrollReveal direction="up" delay={800}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold font-poppins text-foreground">Actions Rapides</h2>
                <p className="text-muted-foreground font-inter">Accédez rapidement à vos outils essentiels</p>
              </div>
              <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
                <Target className="h-3 w-3" />
                {quickActions.length} raccourcis
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <ScrollReveal key={index} direction="up" delay={900 + index * 100}>
                  <Link to={action.href}>
                    <ModernCard 
                      variant="gradient" 
                      hover="lift" 
                      interactive
                      className="p-6 group h-full"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} border border-border/20 group-hover:scale-110 transition-transform duration-300`}>
                          <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </ModernCard>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Recent Activity */}
        <ScrollReveal direction="up" delay={1200}>
          <GlassCard variant="subtle" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold font-poppins flex items-center gap-2 text-foreground">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Activité Récente
                </h3>
                <p className="text-sm text-muted-foreground font-inter mt-1">
                  Les dernières interactions de votre communauté FSU
                </p>
              </div>
              <ModernButton variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Voir tout
              </ModernButton>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-muted/30 transition-all duration-200 group">
                  <div className={`p-2 rounded-lg ${
                    activity.type === "success" ? "bg-green-500/20 text-green-600" : 
                    activity.type === "info" ? "bg-blue-500/20 text-blue-600" : 
                    activity.type === "warning" ? "bg-orange-500/20 text-orange-600" : 
                    "bg-gray-500/20 text-gray-600"
                  } group-hover:scale-110 transition-transform duration-200`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      <span className="text-primary">{activity.action}</span>: {activity.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                      <span className="text-muted-foreground">•</span>
                      <p className="text-sm font-medium text-muted-foreground">par {activity.user}</p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ModernButton variant="ghost" size="sm">
                      Voir
                    </ModernButton>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </ScrollReveal>
      </PageContainer>
    </div>
  );
};
