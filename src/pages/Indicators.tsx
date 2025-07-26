
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { HeroSection } from "@/components/ui/hero-section";
import { ModernCard } from "@/components/ui/modern-card";
import { ModernStatsCard } from "@/components/ui/modern-stats-card";
import { Badge } from "@/components/ui/badge";
import { AdaptiveInterface } from "@/components/layout/AdaptiveInterface";
import { SimplifiedIndicators } from "@/components/indicators/SimplifiedIndicators";
import { AdvancedIndicatorsControls } from "@/components/indicators/AdvancedIndicatorsControls";
import { TrendingUp, Download, Filter, Calendar, Globe, Database, BarChart3, Activity } from "lucide-react";

const Indicators = () => {
  // Mock stats for demonstration
  const indicatorStats = [
    {
      title: "Pays Couverts",
      value: 12,
      icon: Globe,
      trend: { value: 8, label: "Expansion récente", positive: true },
      description: "Données collectées"
    },
    {
      title: "Indicateurs Actifs",
      value: 48,
      icon: Activity,
      trend: { value: 12, label: "Nouveaux ce mois", positive: true },
      description: "Métriques suivies"
    },
    {
      title: "Points de Données",
      value: 2856,
      icon: Database,
      trend: { value: 15, label: "Croissance continue", positive: true },
      description: "Données historiques"
    },
    {
      title: "Rapports Générés",
      value: 24,
      icon: BarChart3,
      trend: { value: 6, label: "Ce trimestre", positive: true },
      description: "Analyses produites"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Hero Section */}
        <ScrollReveal direction="fade">
          <HeroSection
            title="Indicateurs FSU"
            subtitle="Dashboard Analytics"
            description="Suivez les indicateurs clés du Service Universel des télécommunications en temps réel. Analysez les tendances, comparez les performances et générez des rapports détaillés pour orienter vos décisions stratégiques."
            actions={[
              {
                label: "Filtrer Données",
                onClick: () => {},
                icon: <Filter className="h-5 w-5" />,
                variant: "outline"
              },
              {
                label: "Exporter Rapport",
                onClick: () => {},
                icon: <Download className="h-5 w-5" />,
                variant: "default"
              }
            ]}
          >
            <div className="flex gap-2 mt-6">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                12 Pays
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Données 2024
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Temps Réel
              </Badge>
            </div>
          </HeroSection>
        </ScrollReveal>

        {/* Statistics Cards */}
        <ScrollReveal delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {indicatorStats.map((stat, index) => (
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

        {/* Description Section */}
        <ScrollReveal delay={400}>
          <ModernCard variant="glass" className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/20 flex-shrink-0">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  À propos des Indicateurs FSU
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Les indicateurs du Service Universel des télécommunications (FSU) fournissent une vue d'ensemble 
                  des progrès réalisés en matière de connectivité et d'accès aux services de télécommunications 
                  dans les pays membres. Ces données sont collectées auprès d'organisations internationales 
                  reconnues comme l'UIT, la GSMA, et la Banque Mondiale.
                </p>
              </div>
            </div>
          </ModernCard>
        </ScrollReveal>

        {/* Adaptive Interface */}
        <ScrollReveal delay={600}>
          <AdaptiveInterface
            title="Tableau de Bord des Indicateurs"
            description="Interface adaptée à votre niveau d'expertise"
            advancedContent={<AdvancedIndicatorsControls />}
          >
            <SimplifiedIndicators />
          </AdaptiveInterface>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Indicators;
