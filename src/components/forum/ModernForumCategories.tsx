
import { useState } from "react";
import { Plus, Settings, Users, MessageSquare, TrendingUp } from "lucide-react";
import { ModernCard } from "@/components/ui/modern-card";
import { ModernButton } from "@/components/ui/modern-button";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  postCount: number;
  memberCount: number;
  lastActivity: string;
  trending?: boolean;
}

interface ModernForumCategoriesProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onCreateCategory?: () => void;
  onManageCategories?: () => void;
  isAdmin?: boolean;
}

export function ModernForumCategories({
  categories,
  selectedCategory,
  onSelectCategory,
  onCreateCategory,
  onManageCategories,
  isAdmin = false
}: ModernForumCategoriesProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const getCategoryGradient = (color: string) => {
    const gradients = {
      blue: "from-blue-500/20 to-blue-600/20 border-blue-200/50",
      green: "from-green-500/20 to-green-600/20 border-green-200/50",
      purple: "from-purple-500/20 to-purple-600/20 border-purple-200/50",
      orange: "from-orange-500/20 to-orange-600/20 border-orange-200/50",
      pink: "from-pink-500/20 to-pink-600/20 border-pink-200/50",
    };
    return gradients[color as keyof typeof gradients] || "from-gray-500/20 to-gray-600/20 border-gray-200/50";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Catégories du Forum
          </h2>
          <p className="text-muted-foreground">
            Découvrez les discussions par thématique
          </p>
        </div>
        
        {isAdmin && (
          <div className="flex gap-2">
            <ModernButton variant="outline" onClick={onManageCategories}>
              <Settings className="h-4 w-4 mr-2" />
              Gérer
            </ModernButton>
            <ModernButton onClick={onCreateCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Catégorie
            </ModernButton>
          </div>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* All Categories */}
        <ModernCard
          variant="glass"
          hover="lift"
          className={cn(
            "group cursor-pointer transition-all duration-300",
            selectedCategory === "all" && "ring-2 ring-primary/50 bg-primary/5"
          )}
          onClick={() => onSelectCategory("all")}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Toutes les Catégories</h3>
                  <p className="text-sm text-muted-foreground">Voir toutes les discussions</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Tous les membres</span>
              </div>
            </div>
          </div>
        </ModernCard>

        {/* Category Cards */}
        {categories.map((category) => (
          <ModernCard
            key={category.id}
            variant="glass"
            hover="lift"
            className={cn(
              "group cursor-pointer transition-all duration-300 relative overflow-hidden",
              selectedCategory === category.id && "ring-2 ring-primary/50 bg-primary/5",
              hoveredCategory === category.id && "scale-[1.02]"
            )}
            onClick={() => onSelectCategory(category.id)}
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
                    getCategoryGradient(category.color)
                  )}>
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{category.name}</h3>
                      {category.trending && (
                        <Badge variant="secondary" className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-700 border-orange-200/50">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Tendance
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <GlassCard variant="subtle" className="px-3 py-1 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <AnimatedCounter value={category.postCount} className="text-sm font-medium" />
                    <span className="text-xs text-muted-foreground">posts</span>
                  </GlassCard>
                  
                  <GlassCard variant="subtle" className="px-3 py-1 flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <AnimatedCounter value={category.memberCount} className="text-sm font-medium" />
                    <span className="text-xs text-muted-foreground">membres</span>
                  </GlassCard>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Dernière activité: {category.lastActivity}
                </div>
              </div>
            </div>
          </ModernCard>
        ))}
      </div>
    </div>
  );
}
