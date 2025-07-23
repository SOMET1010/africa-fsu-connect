
import { useState } from "react";
import { Search, Plus, Filter, TrendingUp, Users, MessageSquare, Settings } from "lucide-react";
import { ModernButton } from "@/components/ui/modern-button";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Badge } from "@/components/ui/badge";
import OptimizedSearchBar from "@/components/shared/OptimizedSearchBar";
import { cn } from "@/lib/utils";

interface ModernForumHeaderProps {
  onNewPost: () => void;
  onSearch: (query: string, filters: Record<string, string>) => void;
  totalPosts: number;
  totalMembers: number;
  activeUsers: number;
  isAdmin?: boolean;
}

export function ModernForumHeader({
  onNewPost,
  onSearch,
  totalPosts,
  totalMembers,
  activeUsers,
  isAdmin = false
}: ModernForumHeaderProps) {
  const [searchFilters, setSearchFilters] = useState({
    category: "",
    author: "",
    dateRange: ""
  });

  const filterOptions = [
    {
      id: "category",
      label: "Catégorie",
      options: [
        { value: "cmdt25", label: "CMDT-25" },
        { value: "financement", label: "Financement" },
        { value: "regulation", label: "Régulation" },
        { value: "innovation", label: "Innovation" },
        { value: "cooperation", label: "Coopération" }
      ]
    },
    {
      id: "dateRange",
      label: "Période",
      options: [
        { value: "today", label: "Aujourd'hui" },
        { value: "week", label: "Cette semaine" },
        { value: "month", label: "Ce mois" },
        { value: "all", label: "Toute période" }
      ]
    }
  ];

  const stats = [
    {
      label: "Discussions",
      value: totalPosts,
      icon: MessageSquare,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      label: "Membres",
      value: totalMembers,
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      label: "En ligne",
      value: activeUsers,
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <GlassCard variant="default" className="p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 opacity-50" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Forum Communautaire
                </h1>
                <p className="text-lg text-muted-foreground">
                  Échangez avec la communauté FSU sur les enjeux des télécommunications
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <ModernButton variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Administration
                  </ModernButton>
                )}
                
                <ModernButton onClick={onNewPost} className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Plus className="h-4 w-4 mr-2 relative z-10" />
                  <span className="relative z-10">Nouvelle Discussion</span>
                </ModernButton>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <GlassCard key={stat.label} variant="subtle" className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      stat.bgColor
                    )}>
                      <stat.icon className={cn("h-6 w-6", stat.color)} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <AnimatedCounter 
                          value={stat.value} 
                          className="text-2xl font-bold"
                          duration={1000 + index * 200}
                        />
                        {stat.label === "En ligne" && (
                          <Badge variant="secondary" className="bg-green-500/20 text-green-700 border-green-200/50 animate-pulse">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                            Live
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Search and Filters */}
      <GlassCard variant="subtle" className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <OptimizedSearchBar
              placeholder="Rechercher dans les discussions..."
              onSearch={onSearch}
              filters={filterOptions}
              showFilters={true}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <ModernButton variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtres Avancés
            </ModernButton>
            
            <ModernButton variant="outline" size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              Tendances
            </ModernButton>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
