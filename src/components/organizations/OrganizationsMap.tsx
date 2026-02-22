import { useState } from "react";
import { ModernCard } from "@/components/ui/modern-card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, Users, Building2, Zap, ArrowUp } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";

interface Agency {
  id: string;
  name: string;
  country: string;
  region: string;
  sync_status: string;
}

interface OrganizationsMapProps {
  agencies: Agency[];
}

const REGION_CONFIG = {
  "CEDEAO": { 
    color: "from-emerald-500 to-teal-600", 
    position: { top: "42%", left: "22%" },
    flag: "🌿",
    description: "Afrique de l'Ouest"
  },
  "EACO": { 
    color: "from-cyan-500 to-blue-600", 
    position: { top: "38%", left: "58%" },
    flag: "🌊",
    description: "Afrique de l'Est"
  },
  "SADC": { 
    color: "from-amber-500 to-orange-600", 
    position: { top: "68%", left: "45%" },
    flag: "🦁",
    description: "Afrique Australe"
  },
  "UMA": { 
    color: "from-red-500 to-pink-600", 
    position: { top: "22%", left: "35%" },
    flag: "🏺",
    description: "Afrique du Nord"
  },
  "CEEAC": { 
    color: "from-purple-500 to-indigo-600", 
    position: { top: "48%", left: "38%" },
    flag: "🌺",
    description: "Afrique Centrale"
  },
  "Autre": { 
    color: "from-gray-500 to-slate-600", 
    position: { top: "60%", left: "25%" },
    flag: "🌍",
    description: "Autres régions"
  }
};

export const OrganizationsMap = ({ agencies }: OrganizationsMapProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const regionStats = agencies.reduce((acc, agency) => {
    if (!acc[agency.region]) {
      acc[agency.region] = {
        count: 0,
        countries: new Set(),
        agencies: [],
        syncedCount: 0
      };
    }
    acc[agency.region].count++;
    acc[agency.region].countries.add(agency.country);
    acc[agency.region].agencies.push(agency);
    if (agency.sync_status === 'synced') {
      acc[agency.region].syncedCount++;
    }
    return acc;
  }, {} as any);

  const totalOrganizations = agencies.length;
  const totalCountries = new Set(agencies.map(a => a.country)).size;
  const totalSynced = agencies.filter(a => a.sync_status === 'synced').length;

  return (
    <div className="space-y-6">
      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ModernCard variant="glass" className="p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Organisations</p>
              <div className="flex items-center gap-2">
                <AnimatedCounter 
                  value={totalOrganizations} 
                  className="text-2xl font-bold text-emerald-600"
                />
                <ArrowUp className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Building2 className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </ModernCard>

        <ModernCard variant="glass" className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pays Couverts</p>
              <div className="flex items-center gap-2">
                <AnimatedCounter 
                  value={totalCountries} 
                  className="text-2xl font-bold text-primary"
                />
                <ArrowUp className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="p-3 bg-primary/20 rounded-xl">
              <Globe className="h-6 w-6 text-primary" />
            </div>
          </div>
        </ModernCard>

        <ModernCard variant="glass" className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Synchronisées</p>
              <div className="flex items-center gap-2">
                <AnimatedCounter 
                  value={totalSynced} 
                  className="text-2xl font-bold text-purple-600"
                />
                <ArrowUp className="h-4 w-4 text-purple-500" />
              </div>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </ModernCard>
      </div>

      {/* Interactive Map */}
      <ModernCard variant="glass" className="overflow-hidden">
        <div className="p-6 pb-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Carte Interactive du Réseau</h3>
              <p className="text-sm text-muted-foreground">
                Répartition géographique des organisations partenaires
              </p>
            </div>
          </div>
        </div>

        <div className="relative h-96 mx-6 mb-6 bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-slate-900 dark:via-blue-950 dark:to-emerald-950 rounded-2xl overflow-hidden border border-border/50">
          {/* Africa Continent Shape */}
          <div className="absolute inset-8">
            <svg viewBox="0 0 100 120" className="w-full h-full opacity-20">
              <path
                d="M45 10 C50 8, 55 12, 60 15 L65 20 C70 25, 72 30, 70 35 L68 45 C65 50, 70 55, 75 60 L80 70 C78 75, 75 80, 70 85 L65 95 C60 100, 55 98, 50 95 L45 90 C40 85, 35 80, 30 75 L25 65 C20 60, 18 55, 20 50 L22 40 C25 35, 30 30, 35 25 L40 15 C42 12, 44 10, 45 10 Z"
                fill="url(#africaGradient)"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary/30"
              />
              <defs>
                <linearGradient id="africaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Regional Markers */}
          {Object.entries(regionStats).map(([region, stats]: [string, any]) => {
            const config = REGION_CONFIG[region as keyof typeof REGION_CONFIG] || REGION_CONFIG["Autre"];
            const isHovered = hoveredRegion === region;
            const isSelected = selectedRegion === region;
            
            return (
              <div
                key={region}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer group"
                style={{ 
                  top: config.position.top, 
                  left: config.position.left,
                  zIndex: isHovered || isSelected ? 20 : 10
                }}
                onMouseEnter={() => setHoveredRegion(region)}
                onMouseLeave={() => setHoveredRegion(null)}
                onClick={() => setSelectedRegion(selectedRegion === region ? null : region)}
              >
                {/* Pulse Animation */}
                <div className="absolute inset-0 animate-ping">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${config.color} opacity-30`} />
                </div>
                
                {/* Main Marker */}
                <div className={`relative w-8 h-8 rounded-full bg-gradient-to-r ${config.color} shadow-lg transition-all duration-300 ${
                  isHovered || isSelected ? 'scale-125 shadow-2xl' : 'hover:scale-110'
                } border-2 border-white dark:border-gray-800`}>
                  <div className="absolute inset-0 rounded-full bg-white/30 flex items-center justify-center text-lg">
                    {config.flag}
                  </div>
                  
                  {/* Counter Badge */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 font-bold animate-bounce">
                    {stats.count}
                  </div>
                </div>

                {/* Enhanced Tooltip */}
                <div className={`absolute bottom-12 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
                  isHovered || isSelected ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
                }`}>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl border border-border min-w-64 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{config.flag}</span>
                      <div>
                        <h4 className="font-bold text-foreground">{region}</h4>
                        <p className="text-xs text-muted-foreground">{config.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="font-medium">{stats.count}</p>
                          <p className="text-xs text-muted-foreground">Organisations</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="font-medium">{stats.countries.size}</p>
                          <p className="text-xs text-muted-foreground">Pays</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-purple-500" />
                        <div>
                          <p className="font-medium">{stats.syncedCount}</p>
                          <p className="text-xs text-muted-foreground">Synchronisées</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="font-medium">{Math.round((stats.syncedCount / stats.count) * 100)}%</p>
                          <p className="text-xs text-muted-foreground">Taux sync.</p>
                        </div>
                      </div>
                    </div>

                    {/* Countries Preview */}
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex flex-wrap gap-1">
                        {Array.from(stats.countries).slice(0, 3).map((country: string) => (
                          <Badge key={country} variant="secondary" className="text-xs">
                            {country}
                          </Badge>
                        ))}
                        {stats.countries.size > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{stats.countries.size - 3} autres
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Tooltip Arrow */}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white dark:bg-gray-800 border-r border-b border-border rotate-45" />
                </div>
              </div>
            );
          })}

          {/* Elegant Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-border">
            <h5 className="font-bold text-sm mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Légende Interactive
            </h5>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-sm" />
                <span>Organisations régionales</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-sm" />
                <span>Nombre d'organisations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary/20 rounded-full animate-pulse" />
                <span>Animation temps réel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Details Grid */}
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(regionStats).map(([region, stats]: [string, any]) => {
              const config = REGION_CONFIG[region as keyof typeof REGION_CONFIG] || REGION_CONFIG["Autre"];
              const isSelected = selectedRegion === region;
              
              return (
                <ModernCard
                  key={region}
                  className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 border-l-4 ${
                    isSelected ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                  style={{ borderLeftColor: `hsl(var(--primary))` }}
                  onClick={() => setSelectedRegion(selectedRegion === region ? null : region)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{config.flag}</span>
                      <h4 className="font-semibold text-foreground">{region}</h4>
                    </div>
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${config.color} shadow-sm animate-pulse`} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Organisations:</span>
                        <span className="font-bold">{stats.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pays:</span>
                        <span className="font-bold">{stats.countries.size}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sync:</span>
                        <span className="font-bold text-green-600">{stats.syncedCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taux:</span>
                        <span className="font-bold text-blue-600">
                          {Math.round((stats.syncedCount / stats.count) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex flex-wrap gap-1">
                      {Array.from(stats.countries).slice(0, 4).map((country: string) => (
                        <Badge key={country} variant="outline" className="text-xs animate-fade-in">
                          {country}
                        </Badge>
                      ))}
                      {stats.countries.size > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{stats.countries.size - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                </ModernCard>
              );
            })}
          </div>
        </div>
      </ModernCard>

      {/* Network Information */}
      <ModernCard variant="glass" className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/20 rounded-xl">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-2">Réseau de Partenaires Institutionnels</h4>
            <p className="text-muted-foreground leading-relaxed">
              Ce réseau représente <span className="font-semibold text-primary">{agencies.length} organisations officielles</span> de 
              régulation et de supervision des télécommunications à travers{' '}
              <span className="font-semibold text-primary">{[...new Set(agencies.map(a => a.country))].length} pays</span>. 
              Chaque organisation est une institution reconnue avec un mandat officiel dans son territoire de compétence, 
              contribuant à l'harmonisation des politiques de télécommunications en Afrique.
            </p>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};