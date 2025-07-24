
import { useState, useEffect } from "react";
import { BarChart3, Users, Target, Zap, Calendar, MessageSquare, FileText, TrendingUp, Settings, Bell } from "lucide-react";
import { ModernStatsCard } from "@/components/ui/modern-stats-card";
import { HeroSection } from "@/components/ui/hero-section";
import { ModernCard, ModernIconCard } from "@/components/ui/modern-card";
import { ModernButton } from "@/components/ui/modern-button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { CommandPalette } from "@/components/ui/command-palette";
import { useTranslation } from "@/hooks/useTranslation";

export const EnhancedDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [dashboardStats, setDashboardStats] = useState([
    {
      title: t('dashboard.stats.active.projects'),
      value: 12,
      icon: Target,
      trend: { value: 8, label: t('dashboard.stats.this.week'), positive: true },
      prefix: "",
      suffix: "",
      description: t('dashboard.stats.active.projects.desc')
    },
    {
      title: t('dashboard.stats.collaborators'),
      value: 248,
      icon: Users,
      trend: { value: 12, label: t('dashboard.stats.this.month'), positive: true },
      prefix: "",
      suffix: "",
      description: t('dashboard.stats.collaborators.desc')
    },
    {
      title: t('dashboard.stats.documents'),
      value: 89,
      icon: FileText,
      trend: { value: 15, label: t('dashboard.stats.documents.added'), positive: true },
      prefix: "",
      suffix: "",
      description: t('dashboard.stats.documents.desc')
    },
    {
      title: t('dashboard.stats.events'),
      value: 5,
      icon: Calendar,
      trend: { value: -2, label: t('dashboard.stats.this.week'), positive: false },
      prefix: "",
      suffix: "",
      description: t('dashboard.stats.events.desc')
    }
  ]);

  const quickActions = [
    {
      title: t('actions.new.project'),
      description: t('actions.new.project.description'),
      icon: Target,
      href: "/projects?action=create",
      stats: [
        { label: "En cours", value: "12" },
        { label: "Terminés", value: "45" }
      ]
    },
    {
      title: t('actions.community.forum'),
      description: t('actions.community.forum.description'),
      icon: MessageSquare,
      href: "/forum",
      stats: [
        { label: "Messages", value: "234" },
        { label: "Actifs", value: "89" }
      ]
    },
    {
      title: t('actions.resource.center'),
      description: t('actions.resource.center.description'),
      icon: FileText,
      href: "/resources",
      stats: [
        { label: "Documents", value: "89" },
        { label: "Téléchargés", value: "456" }
      ]
    },
    {
      title: t('actions.events.calendar'),
      description: t('actions.events.calendar.description'),
      icon: Calendar,
      href: "/events",
      stats: [
        { label: "À venir", value: "5" },
        { label: "Ce mois", value: "12" }
      ]
    }
  ];

  const recentActivity = [
    { 
      action: t('dashboard.activity.project.created'), 
      title: "Initiative Connectivité Rurale 2024", 
      time: t('dashboard.activity.ago.2h'), 
      type: "project",
      user: "Marie Kouassi"
    },
    { 
      action: t('dashboard.activity.document.added'), 
      title: "Guide Implementation FSU", 
      time: t('dashboard.activity.ago.4h'), 
      type: "document",
      user: "Ahmed Diallo"
    },
    { 
      action: t('dashboard.activity.discussion.created'), 
      title: "Stratégies Développement Digital", 
      time: t('dashboard.activity.ago.yesterday'), 
      type: "forum",
      user: "Grace Okonkwo"
    },
    { 
      action: t('dashboard.activity.event.planned'), 
      title: "Webinaire Innovation Télécom", 
      time: t('dashboard.activity.ago.1day'), 
      type: "event",
      user: "Jean Mukendi"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Hero Section */}
        <ScrollReveal direction="fade">
          <HeroSection
            title={profile?.first_name ? 
              t('dashboard.welcome').replace('{name}', profile.first_name) : 
              t('dashboard.welcome.default')
            }
            subtitle={t('dashboard.title')}
            description={t('dashboard.description')}
            actions={[
              {
                label: t('actions.quick.actions'),
                onClick: () => navigate("/profile"),
                icon: <Zap className="h-5 w-5" />,
                variant: "default"
              },
              {
                label: t('actions.preferences'),
                onClick: () => navigate("/preferences"),
                icon: <Settings className="h-4 w-4" />,
                variant: "outline"
              }
            ]}
            className="mb-8"
          />
        </ScrollReveal>

        {/* Stats Cards */}
        <ScrollReveal delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardStats.map((stat, index) => (
              <ModernStatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                trend={stat.trend}
                prefix={stat.prefix}
                suffix={stat.suffix}
                description={stat.description}
                variant="gradient"
                size="md"
              />
            ))}
          </div>
        </ScrollReveal>

        {/* Quick Actions Grid */}
        <ScrollReveal delay={400}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold font-poppins text-foreground">{t('dashboard.quick.actions')}</h2>
                <p className="text-muted-foreground font-inter">{t('dashboard.quick.actions.desc')}</p>
              </div>
              <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
                <Target className="h-3 w-3" />
                {t('dashboard.shortcuts.available').replace('{count}', '4')}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <ScrollReveal key={index} delay={100 * (index + 1)} direction="up">
                  <Link to={action.href}>
                    <ModernIconCard
                      icon={action.icon}
                      title={action.title}
                      description={action.description}
                      variant="gradient"
                      hover="lift"
                      interactive
                      stats={action.stats}
                      className="h-full group border-border/30"
                    />
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Recent Activity */}
        <ScrollReveal delay={600}>
          <ModernCard variant="glass" hover="glow" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold font-poppins flex items-center gap-2 text-foreground">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {t('dashboard.activity.recent')}
                </h3>
                <p className="text-sm text-muted-foreground font-inter mt-1">
                  {t('dashboard.activity.desc')}
                </p>
              </div>
              <ModernButton variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                {t('dashboard.activity.view.all')}
              </ModernButton>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-muted/30 transition-all duration-200 group">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === "project" ? "bg-blue-500" : 
                    activity.type === "document" ? "bg-purple-500" : 
                    activity.type === "forum" ? "bg-green-500" : "bg-orange-500"
                  } group-hover:scale-110 transition-transform duration-200`} />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      <span className="text-primary">{activity.action}</span>: {activity.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                      <span className="text-muted-foreground">•</span>
                      <p className="text-sm font-medium text-muted-foreground">{t('dashboard.activity.by')} {activity.user}</p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ModernButton variant="ghost" size="sm">
                      {t('dashboard.activity.view')}
                    </ModernButton>
                  </div>
                </div>
              ))}
            </div>
          </ModernCard>
        </ScrollReveal>

        {/* Command Palette Integration */}
        <div className="fixed bottom-6 right-6 z-50">
          <CommandPalette />
        </div>
      </div>
    </div>
  );
};
