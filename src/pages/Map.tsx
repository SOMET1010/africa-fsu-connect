import { useState } from "react";
import { ModernCard } from "@/components/ui/modern-card";
import { ModernButton } from "@/components/ui/modern-button";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { HeroSection } from "@/components/ui/hero-section";
import { 
  MapPin, 
  Globe, 
  Building2, 
  Zap, 
  Users,
  Satellite,
  Network,
  Target,
  TrendingUp,
  Filter,
  Layers,
  Navigation
} from "lucide-react";

const INTERACTIVE_REGIONS = {
  "Afrique de l'Ouest": {
    position: { top: "45%", left: "20%" },
    color: "from-emerald-500 via-teal-500 to-green-600",
    flag: "🌿",
    countries: ["Sénégal", "Mali", "Burkina Faso", "Niger", "Côte d'Ivoire", "Ghana", "Togo", "Bénin"],
    organizations: 28,
    projects: 15,
    coverage: 85
  },
  "Afrique Centrale": {
    position: { top: "50%", left: "35%" },
    color: "from-purple-500 via-violet-500 to-indigo-600",
    flag: "🌺",
    countries: ["Cameroun", "Tchad", "RCA", "Congo", "RDC", "Gabon"],
    organizations: 18,
    projects: 9,
    coverage: 72
  },
  "Afrique de l'Est": {
    position: { top: "40%", left: "58%" },
    color: "from-cyan-500 via-blue-500 to-indigo-600",
    flag: "🌊",
    countries: ["Kenya", "Tanzanie", "Ouganda", "Rwanda", "Burundi", "Éthiopie"],
    organizations: 22,
    projects: 12,
    coverage: 78
  },
  "Afrique Australe": {
    position: { top: "70%", left: "40%" },
    color: "from-amber-500 via-orange-500 to-red-600",
    flag: "🦁",
    countries: ["Afrique du Sud", "Botswana", "Namibie", "Zimbabwe", "Zambie"],
    organizations: 16,
    projects: 8,
    coverage: 90
  },
  "Afrique du Nord": {
    position: { top: "25%", left: "35%" },
    color: "from-red-500 via-pink-500 to-rose-600",
    flag: "🏺",
    countries: ["Maroc", "Algérie", "Tunisie", "Libye", "Égypte"],
    organizations: 14,
    projects: 6,
    coverage: 95
  }
};

const Map = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<'organizations' | 'projects' | 'coverage'>('organizations');

  const globalStats = {
    totalOrganizations: Object.values(INTERACTIVE_REGIONS).reduce((sum, region) => sum + region.organizations, 0),
    totalProjects: Object.values(INTERACTIVE_REGIONS).reduce((sum, region) => sum + region.projects, 0),
    averageCoverage: Math.round(Object.values(INTERACTIVE_REGIONS).reduce((sum, region) => sum + region.coverage, 0) / Object.keys(INTERACTIVE_REGIONS).length),
    totalCountries: Object.values(INTERACTIVE_REGIONS).reduce((sum, region) => sum + region.countries.length, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Hero Section */}
        <ScrollReveal direction="fade">
          <HeroSection
            title="Carte Interactive SUTEL"
            subtitle="Réseau Panafricain"
            description="Explorez la couverture géographique du service universel des télécommunications à travers l'Afrique. Visualisez les organisations, projets et indicateurs de connectivité en temps réel."
            actions={[
              {
                label: "Mode Organisations",
                onClick: () => setMapMode('organizations'),
                icon: <Building2 className="h-5 w-5" />,
                variant: mapMode === 'organizations' ? "default" : "outline"
              },
              {
                label: "Mode Projets",
                onClick: () => setMapMode('projects'),
                icon: <Target className="h-5 w-5" />,
                variant: mapMode === 'projects' ? "default" : "outline"
              },
              {
                label: "Mode Couverture",
                onClick: () => setMapMode('coverage'),
                icon: <Network className="h-5 w-5" />,
                variant: mapMode === 'coverage' ? "default" : "outline"
              }
            ]}
          >
            <div className="flex gap-2 mt-6">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {globalStats.totalCountries} Pays
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {globalStats.totalOrganizations} Organisations
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Satellite className="h-3 w-3" />
                Temps Réel
              </Badge>
            </div>
          </HeroSection>
        </ScrollReveal>

        {/* Interactive Map Card */}
        <ScrollReveal delay={400}>
          <ModernCard variant="glass" className="overflow-hidden">
            <div className="relative h-[600px] mx-6 my-6 bg-gradient-to-br from-slate-50 via-blue-50 via-indigo-50 to-emerald-50 dark:from-slate-900 dark:via-blue-950 dark:via-indigo-950 dark:to-emerald-950 rounded-3xl overflow-hidden border border-border/50 shadow-inner">
              
              {/* Enhanced Africa Continent Shape */}
              <div className="absolute inset-12">
                <svg viewBox="0 0 100 120" className="w-full h-full opacity-25">
                  <path
                    d="M45 10 C50 8, 55 12, 60 15 L65 20 C70 25, 72 30, 70 35 L68 45 C65 50, 70 55, 75 60 L80 70 C78 75, 75 80, 70 85 L65 95 C60 100, 55 98, 50 95 L45 90 C40 85, 35 80, 30 75 L25 65 C20 60, 18 55, 20 50 L22 40 C25 35, 30 30, 35 25 L40 15 C42 12, 44 10, 45 10 Z"
                    fill="url(#continentGradient)"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-primary/40"
                  />
                  <defs>
                    <linearGradient id="continentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Regional Interactive Markers */}
              {Object.entries(INTERACTIVE_REGIONS).map(([region, data]) => {
                const isHovered = hoveredRegion === region;
                
                return (
                  <div
                    key={region}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 cursor-pointer group"
                    style={{ 
                      top: data.position.top, 
                      left: data.position.left,
                      zIndex: isHovered ? 50 : 20
                    }}
                    onMouseEnter={() => setHoveredRegion(region)}
                    onMouseLeave={() => setHoveredRegion(null)}
                  >
                    {/* Pulse Rings */}
                    <div className="absolute inset-0 animate-ping">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${data.color} opacity-20`} />
                    </div>
                    
                    {/* Main Marker */}
                    <div className={`relative w-16 h-16 rounded-full bg-gradient-to-r ${data.color} shadow-2xl transition-all duration-700 ${
                      isHovered ? 'scale-150' : 'hover:scale-125'
                    } border-4 border-white dark:border-gray-800 flex items-center justify-center`}>
                      <span className="text-2xl animate-bounce">{data.flag}</span>
                      
                      {/* Data Badge */}
                      <div className="absolute -top-4 -right-4 w-10 h-10 bg-white dark:bg-gray-800 text-foreground text-sm rounded-full flex items-center justify-center border-3 border-white dark:border-gray-800 font-bold shadow-lg">
                        {data.organizations}
                      </div>
                    </div>

                    {/* Tooltip */}
                    <div className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 transition-all duration-700 ${
                      isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}>
                      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-border min-w-80">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-4xl">{data.flag}</span>
                          <div>
                            <h4 className="font-bold text-xl">{region}</h4>
                            <p className="text-sm text-muted-foreground">{data.countries.length} pays</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-3 bg-emerald-500/10 rounded-xl">
                            <Building2 className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                            <p className="font-bold text-lg">{data.organizations}</p>
                            <p className="text-xs text-muted-foreground">Organisations</p>
                          </div>
                          <div className="text-center p-3 bg-blue-500/10 rounded-xl">
                            <Target className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                            <p className="font-bold text-lg">{data.projects}</p>
                            <p className="text-xs text-muted-foreground">Projets</p>
                          </div>
                          <div className="text-center p-3 bg-purple-500/10 rounded-xl">
                            <Network className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                            <p className="font-bold text-lg">{data.coverage}%</p>
                            <p className="text-xs text-muted-foreground">Couverture</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Enhanced Legend */}
              <div className="absolute bottom-8 left-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-border">
                <h5 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-primary" />
                  Légende Interactive
                </h5>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-lg" />
                    <span>Organisations actives</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-primary/20 rounded-full animate-pulse" />
                    <span>Données temps réel</span>
                  </div>
                </div>
              </div>
            </div>
          </ModernCard>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Map;