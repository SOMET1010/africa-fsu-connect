import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModernStatsCard } from '@/components/ui/modern-stats-card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { useEnhancedDashboardStats } from '@/hooks/useEnhancedDashboardStats';
import { 
  Radio, 
  Users, 
  MapPin, 
  Signal, 
  TrendingUp 
} from 'lucide-react';

export const TelecomIndicatorsWidget = () => {
  const { stats, loading } = useEnhancedDashboardStats();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  const telecomStats = [
    {
      title: "Sites BTS",
      value: stats.totalBtsSites,
      icon: Radio,
      trend: { value: 12, label: "Nouveaux ce mois", positive: true },
      description: "Stations de base déployées",
      color: "text-primary"
    },
    {
      title: "Localités Couvertes", 
      value: stats.localitiesCovered,
      icon: MapPin,
      trend: { value: 8, label: "Nouvelles zones", positive: true },
      description: "Zones géographiques desservies",
      color: "text-secondary"
    },
    {
      title: "Population Couverte",
      value: stats.populationCovered,
      icon: Users,
      trend: { value: 15, label: "Croissance", positive: true },
      description: "Habitants ayant accès",
      color: "text-accent"
    },
    {
      title: "Taux de Couverture",
      value: stats.coveragePercentage,
      icon: Signal,
      trend: { value: 5, label: "Amélioration", positive: true },
      description: "Pourcentage population totale",
      color: "text-emerald-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Titre de section */}
      <ScrollReveal>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/20">
            <Radio className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Indicateurs Télécommunications</h2>
            <p className="text-sm text-muted-foreground">Métriques clés de l'infrastructure réseau</p>
          </div>
        </div>
      </ScrollReveal>

      {/* Cartes statistiques */}
      <ScrollReveal delay={200}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {telecomStats.map((stat, index) => (
            <ModernStatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              description={stat.description}
              variant="gradient"
              size="md"
            />
          ))}
        </div>
      </ScrollReveal>

      {/* Détails de couverture */}
      <ScrollReveal delay={400}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Analyse de la Couverture Territoriale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Population Totale</div>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('fr-FR').format(stats.totalPopulation)}
                </div>
                <div className="text-xs text-muted-foreground">Habitants dans la région SUTEL</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Moyenne par Site</div>
                <div className="text-2xl font-bold">
                  {Math.round(stats.populationCovered / stats.totalBtsSites || 0)}
                </div>
                <div className="text-xs text-muted-foreground">Habitants couverts par BTS</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Densité de Couverture</div>
                <div className="text-2xl font-bold">
                  {(stats.totalBtsSites / stats.localitiesCovered || 0).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Sites BTS par localité</div>
              </div>
            </div>
            
            {/* Barre de progression de couverture */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Objectif de Couverture SUTEL</span>
                <span className="text-sm text-muted-foreground">{stats.coveragePercentage}% / 95%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(stats.coveragePercentage, 100)}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Reste {Math.max(0, 95 - stats.coveragePercentage)}% pour atteindre l'objectif
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  );
};