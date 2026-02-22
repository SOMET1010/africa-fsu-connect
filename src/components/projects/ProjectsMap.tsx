import { useState } from "react";
import { ModernCard } from "@/components/ui/modern-card";
import { Badge } from "@/components/ui/badge";
import { ModernButton } from "@/components/ui/modern-button";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { 
  MapPin, 
  Zap, 
  Building2, 
  Calendar, 
  Target, 
  TrendingUp,
  Users,
  Globe,
  ArrowUpRight,
  Filter
} from "lucide-react";
import type { Project } from "@/types/projects";

interface ProjectsMapProps {
  projects: Project[];
}

const REGION_CONFIG = {
  "Afrique de l'Ouest": { 
    position: { top: "45%", left: "20%" },
    color: "from-emerald-500 to-teal-600",
    flag: "🌿",
    gradient: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/5"
  },
  "Afrique Centrale": { 
    position: { top: "50%", left: "35%" },
    color: "from-purple-500 to-indigo-600",
    flag: "🌺",
    gradient: "bg-gradient-to-br from-purple-500/10 to-purple-600/5"
  },
  "Afrique de l'Est": { 
    position: { top: "40%", left: "55%" },
    color: "from-cyan-500 to-blue-600",
    flag: "🌊",
    gradient: "bg-gradient-to-br from-cyan-500/10 to-cyan-600/5"
  },
  "Afrique Australe": { 
    position: { top: "70%", left: "40%" },
    color: "from-amber-500 to-orange-600",
    flag: "🦁",
    gradient: "bg-gradient-to-br from-amber-500/10 to-amber-600/5"
  },
  "Afrique du Nord": { 
    position: { top: "25%", left: "35%" },
    color: "from-red-500 to-pink-600",
    flag: "🏺",
    gradient: "bg-gradient-to-br from-red-500/10 to-red-600/5"
  },
  "Océan Indien": { 
    position: { top: "65%", left: "65%" },
    color: "from-blue-500 to-indigo-600",
    flag: "🏝️",
    gradient: "bg-gradient-to-br from-blue-500/10 to-blue-600/5"
  }
};

const STATUS_CONFIG = {
  'ongoing': { color: 'bg-blue-500', label: 'En cours', icon: Zap },
  'completed': { color: 'bg-green-500', label: 'Terminé', icon: Target },
  'suspended': { color: 'bg-yellow-500', label: 'Suspendu', icon: Calendar },
  'planned': { color: 'bg-purple-500', label: 'Planifié', icon: Building2 }
};

export const ProjectsMap = ({ projects }: ProjectsMapProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Group projects by region
  const projectsByRegion = projects.reduce((acc, project) => {
    const region = project.agencies?.region || 'Autre';
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(project);
    return acc;
  }, {} as Record<string, Project[]>);

  // Calculate global stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'ongoing').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);

  // Filter projects
  const filteredProjects = projects.filter(project => {
    if (selectedStatus && project.status !== selectedStatus) return false;
    if (selectedRegion && project.agencies?.region !== selectedRegion) return false;
    return true;
  });

  const filteredProjectsByRegion = filteredProjects.reduce((acc, project) => {
    const region = project.agencies?.region || 'Autre';
    if (!acc[region]) acc[region] = [];
    acc[region].push(project);
    return acc;
  }, {} as Record<string, Project[]>);

  return (
    <div className="space-y-6">
      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ModernCard variant="glass" className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Projets</p>
              <AnimatedCounter value={totalProjects} className="text-2xl font-bold text-blue-600" />
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </ModernCard>

        <ModernCard variant="glass" className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">En Cours</p>
              <AnimatedCounter value={activeProjects} className="text-2xl font-bold text-green-600" />
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </ModernCard>

        <ModernCard variant="glass" className="p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Terminés</p>
              <AnimatedCounter value={completedProjects} className="text-2xl font-bold text-emerald-600" />
            </div>
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Target className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </ModernCard>

        <ModernCard variant="glass" className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Budget Total</p>
              <div className="text-2xl font-bold text-purple-600">
                ${(totalBudget / 1000000).toFixed(1)}M
              </div>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </ModernCard>
      </div>

      {/* Filters */}
      <ModernCard variant="glass" className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Filtres Interactifs</h3>
          </div>
          <ModernButton 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSelectedStatus(null);
              setSelectedRegion(null);
            }}
          >
            Réinitialiser
          </ModernButton>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {Object.entries(STATUS_CONFIG).map(([status, config]) => (
            <ModernButton
              key={status}
              variant={selectedStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
              className="flex items-center gap-2"
            >
              <config.icon className="h-4 w-4" />
              {config.label}
              <Badge variant="secondary" className="text-xs">
                {projects.filter(p => p.status === status).length}
              </Badge>
            </ModernButton>
          ))}
        </div>
      </ModernCard>

      {/* Interactive Map */}
      <ModernCard variant="glass" className="overflow-hidden">
        <div className="p-6 pb-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Carte des Projets</h3>
              <p className="text-sm text-muted-foreground">
                Répartition géographique et statuts des projets
              </p>
            </div>
          </div>
        </div>

        <div className="relative h-[500px] mx-6 mb-6 bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-slate-900 dark:via-blue-950 dark:to-emerald-950 rounded-2xl overflow-hidden border border-border/50">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/20 rounded-full animate-pulse" />
            <div className="absolute top-32 right-20 w-24 h-24 bg-emerald-400/20 rounded-full animate-pulse delay-300" />
            <div className="absolute bottom-20 left-1/3 w-28 h-28 bg-purple-400/20 rounded-full animate-pulse delay-700" />
          </div>

          {/* Africa Continent Shape */}
          <div className="absolute inset-8">
            <svg viewBox="0 0 100 120" className="w-full h-full opacity-20">
              <path
                d="M45 10 C50 8, 55 12, 60 15 L65 20 C70 25, 72 30, 70 35 L68 45 C65 50, 70 55, 75 60 L80 70 C78 75, 75 80, 70 85 L65 95 C60 100, 55 98, 50 95 L45 90 C40 85, 35 80, 30 75 L25 65 C20 60, 18 55, 20 50 L22 40 C25 35, 30 30, 35 25 L40 15 C42 12, 44 10, 45 10 Z"
                fill="url(#africaProjectsGradient)"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary/30"
              />
              <defs>
                <linearGradient id="africaProjectsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="currentColor" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Regional Project Markers */}
          {Object.entries(filteredProjectsByRegion).map(([region, regionProjects]) => {
            const config = REGION_CONFIG[region as keyof typeof REGION_CONFIG];
            if (!config) return null;

            const isHovered = hoveredRegion === region;
            const isSelected = selectedRegion === region;
            const activeCount = regionProjects.filter(p => p.status === 'ongoing').length;
            const completedCount = regionProjects.filter(p => p.status === 'completed').length;
            
            return (
              <div
                key={region}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 cursor-pointer group"
                style={{ 
                  top: config.position.top, 
                  left: config.position.left,
                  zIndex: isHovered || isSelected ? 30 : 10
                }}
                onMouseEnter={() => setHoveredRegion(region)}
                onMouseLeave={() => setHoveredRegion(null)}
                onClick={() => setSelectedRegion(selectedRegion === region ? null : region)}
              >
                {/* Pulse Rings */}
                <div className="absolute inset-0 animate-ping">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${config.color} opacity-20`} />
                </div>
                <div className="absolute inset-1 animate-ping animation-delay-200">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${config.color} opacity-30`} />
                </div>
                
                {/* Main Marker */}
                <div className={`relative w-12 h-12 rounded-full bg-gradient-to-r ${config.color} shadow-sm transition-all duration-500 ${
                  isHovered || isSelected ? 'scale-150 shadow-md' : 'hover:scale-125'
                } border-3 border-white dark:border-gray-800 flex items-center justify-center`}>
                  <span className="text-xl">{config.flag}</span>
                  
                  {/* Project Count Badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 font-bold animate-bounce">
                    {regionProjects.length}
                  </div>
                </div>

                {/* Enhanced Tooltip */}
                <div className={`absolute bottom-16 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
                  isHovered || isSelected ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}>
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md border border-border min-w-80 max-w-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{config.flag}</span>
                      <div>
                        <h4 className="font-bold text-lg text-foreground">{region}</h4>
                        <p className="text-sm text-muted-foreground">{regionProjects.length} projets actifs</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-bold text-lg">{activeCount}</p>
                          <p className="text-xs text-muted-foreground">En cours</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-bold text-lg">{completedCount}</p>
                          <p className="text-xs text-muted-foreground">Terminés</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="font-bold text-lg">
                            ${(regionProjects.reduce((sum, p) => sum + (p.budget || 0), 0) / 1000000).toFixed(1)}M
                          </p>
                          <p className="text-xs text-muted-foreground">Budget</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="font-bold text-lg">
                            {Math.round((completedCount / regionProjects.length) * 100)}%
                          </p>
                          <p className="text-xs text-muted-foreground">Réussite</p>
                        </div>
                      </div>
                    </div>

                    {/* Recent Projects */}
                    <div className="border-t border-border pt-3">
                      <p className="text-sm font-medium mb-2">Projets récents :</p>
                      <div className="space-y-1">
                        {regionProjects.slice(0, 2).map((project, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <div className={`w-2 h-2 rounded-full ${STATUS_CONFIG[project.status as keyof typeof STATUS_CONFIG]?.color}`} />
                            <span className="truncate">{project.title}</span>
                          </div>
                        ))}
                        {regionProjects.length > 2 && (
                          <p className="text-xs text-muted-foreground">+{regionProjects.length - 2} autres...</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Arrow */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-r border-b border-border rotate-45" />
                </div>
              </div>
            );
          })}

          {/* Enhanced Legend */}
          <div className="absolute bottom-6 left-6 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-border">
            <h5 className="font-bold text-sm mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Légende des Projets
            </h5>
            <div className="space-y-2 text-xs">
              {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                <div key={status} className="flex items-center gap-2">
                  <div className={`w-3 h-3 ${config.color} rounded-full shadow-sm`} />
                  <span>{config.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border">
                <div className="w-3 h-3 bg-primary/20 rounded-full animate-pulse" />
                <span>Activité temps réel</span>
              </div>
            </div>
          </div>

          {/* Performance Indicator */}
          <div className="absolute top-6 right-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Performance Globale</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {Math.round((completedProjects / totalProjects) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Taux de réussite</p>
          </div>
        </div>

        {/* Regional Summary Grid */}
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(projectsByRegion).map(([region, regionProjects]) => {
              const config = REGION_CONFIG[region as keyof typeof REGION_CONFIG];
              if (!config) return null;
              
              const isSelected = selectedRegion === region;
              const activeCount = regionProjects.filter(p => p.status === 'ongoing').length;
              const completedCount = regionProjects.filter(p => p.status === 'completed').length;
              
              return (
                <ModernCard
                  key={region}
                  className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${config.gradient} ${
                    isSelected ? 'ring-2 ring-primary shadow-sm' : ''
                  }`}
                  onClick={() => setSelectedRegion(selectedRegion === region ? null : region)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{config.flag}</span>
                      <div>
                        <h4 className="font-bold text-foreground">{region}</h4>
                        <p className="text-xs text-muted-foreground">{regionProjects.length} projets</p>
                      </div>
                    </div>
                    <ArrowUpRight className={`h-4 w-4 text-muted-foreground transition-transform ${
                      isSelected ? 'rotate-45' : ''
                    }`} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <span className="font-bold">{activeCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-500" />
                      <span className="font-bold">{completedCount}</span>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {regionProjects.slice(0, 6).map((project, idx) => {
                      const statusConfig = STATUS_CONFIG[project.status as keyof typeof STATUS_CONFIG];
                      return (
                        <div 
                          key={idx}
                          className={`w-2 h-2 rounded-full ${statusConfig?.color} animate-pulse`}
                          style={{ animationDelay: `${idx * 200}ms` }}
                          title={project.title}
                        />
                      );
                    })}
                    {regionProjects.length > 6 && (
                      <span className="text-xs text-muted-foreground ml-2">+{regionProjects.length - 6}</span>
                    )}
                  </div>
                </ModernCard>
              );
            })}
          </div>
        </div>
      </ModernCard>
    </div>
  );
};