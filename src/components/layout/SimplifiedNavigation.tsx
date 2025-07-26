import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  BarChart2, 
  Rocket, 
  BookOpen, 
  MessageSquare, 
  Calendar,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

export function SimplifiedNavigation() {
  const location = useLocation();
  const { profile } = useAuth();
  
  // Get user experience level from localStorage
  const preferences = JSON.parse(localStorage.getItem('userOnboardingPreferences') || '{}');
  const isExpert = preferences.experience === 'expert';
  const isBeginnerMode = preferences.experience === 'beginner';

  // Core navigation items - always visible
  const coreItems = [
    { name: 'Accueil', href: "/", icon: Home },
    { name: 'Tableau de bord', href: "/dashboard", icon: BarChart2 },
    { name: 'Projets', href: "/projects", icon: Rocket },
    { name: 'Ressources', href: "/docs", icon: BookOpen }
  ];

  // Additional items for intermediate/expert users
  const advancedItems = [
    { name: 'Forum', href: "/forum", icon: MessageSquare },
    { name: 'Événements', href: "/events", icon: Calendar },
    { name: 'Profil', href: "/profile", icon: User }
  ];

  const navigationItems = isBeginnerMode 
    ? coreItems 
    : [...coreItems, ...advancedItems];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="space-y-1">
      {navigationItems.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;
        
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
            <span className="flex-1">{item.name}</span>
            {active && (
              <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-scale-in" />
            )}
          </Link>
        );
      })}

      {/* User mode indicator */}
      <div className="pt-4 mt-4 border-t border-border">
        <div className="px-3 py-2">
          <div className="text-xs text-muted-foreground mb-1">Mode d'affichage</div>
          <Badge variant="outline" className="text-xs">
            {isBeginnerMode ? 'Simplifié' : isExpert ? 'Expert' : 'Standard'}
          </Badge>
        </div>
      </div>
    </nav>
  );
}