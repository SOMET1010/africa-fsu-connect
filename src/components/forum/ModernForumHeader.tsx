
import { useState } from "react";
import { Plus, Filter, TrendingUp, Settings } from "lucide-react";
import { ModernButton } from "@/components/ui/modern-button";
import { GlassCard } from "@/components/ui/glass-card";
import { OptimizedSearchBar } from "@/components/shared/OptimizedSearchBar";

interface ModernForumHeaderProps {
  onNewPost: () => void;
  onSearch: (query: string, filters: Record<string, string>) => void;
  isAdmin?: boolean;
}

export function ModernForumHeader({
  onNewPost,
  onSearch,
  isAdmin = false
}: ModernForumHeaderProps) {
  const [searchFilters, setSearchFilters] = useState({
    category: "",
    author: "",
    dateRange: ""
  });

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <GlassCard variant="default" className="p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--nx-gold)/0.1)] via-[hsl(var(--nx-cyan)/0.05)] to-[hsl(var(--nx-gold)/0.1)] opacity-50" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[hsl(var(--nx-gold))] via-[hsl(var(--nx-cyan))] to-[hsl(var(--nx-gold))] bg-clip-text text-transparent">
                  Forum Communautaire
                </h1>
                <p className="text-lg text-white/60">
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
                  <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--nx-gold))] to-[hsl(var(--nx-cyan))] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Plus className="h-4 w-4 mr-2 relative z-10" />
                  <span className="relative z-10">Nouvelle Discussion</span>
                </ModernButton>
              </div>
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
              onSearch={(query) => onSearch(query, searchFilters)}
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
