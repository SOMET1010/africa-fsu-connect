import { useLocation, NavLink } from "react-router-dom";
import { 
  Home, 
  Users,
  FileText, 
  MessageSquare, 
  BarChart3,
  Shield,
  Building2,
  Calendar,
  MapPin,
  Settings,
  BookOpen,
  TrendingUp,
  Zap,
  ChevronDown,
  User
} from "lucide-react";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { ModernButton } from "@/components/ui/modern-button";

// Navigation adaptative selon le niveau utilisateur
const navigationConfig = {
  beginner: [
    { path: "/", icon: Home, label: "Accueil", description: "Tableau de bord principal" },
    { path: "/profile", icon: User, label: "Mon Profil", description: "Gérer mes informations" },
    { path: "/organizations", icon: Building2, label: "Organisations", description: "Découvrir les organismes" },
    { path: "/resources", icon: FileText, label: "Documents", description: "Consulter les ressources" },
    { path: "/forum", icon: MessageSquare, label: "Forum", description: "Échanger avec la communauté" }
  ],
  standard: [
    { path: "/", icon: Home, label: "Accueil", description: "Tableau de bord" },
    { path: "/profile", icon: User, label: "Profil", description: "Mon profil" },
    { path: "/organizations", icon: Building2, label: "Organisations", description: "Gérer les organismes" },
    { path: "/projects", icon: Zap, label: "Projets", description: "Suivre les projets" },
    { path: "/resources", icon: FileText, label: "Ressources", description: "Bibliothèque documentaire" },
    { path: "/indicators", icon: TrendingUp, label: "Indicateurs", description: "Données et métriques" },
    { path: "/forum", icon: MessageSquare, label: "Forum", description: "Discussions" },
    { path: "/events", icon: Calendar, label: "Événements", description: "Agenda" }
  ],
  expert: [
    { path: "/", icon: Home, label: "Accueil", description: "Tableau de bord" },
    { path: "/profile", icon: User, label: "Profil", description: "Mon profil" },
    { path: "/organizations", icon: Building2, label: "Organisations", description: "Gérer les organismes" },
    { path: "/projects", icon: Zap, label: "Projets", description: "Gestion de projets" },
    { path: "/resources", icon: FileText, label: "Ressources", description: "Bibliothèque" },
    { path: "/indicators", icon: TrendingUp, label: "Indicateurs", description: "Analytics" },
    { path: "/forum", icon: MessageSquare, label: "Forum", description: "Communauté" },
    { path: "/events", icon: Calendar, label: "Événements", description: "Agenda" },
    { path: "/analytics", icon: BarChart3, label: "Analytics", description: "Analyses avancées" },
    { path: "/map", icon: MapPin, label: "Cartographie", description: "Vue géographique" },
    { path: "/security", icon: Shield, label: "Sécurité", description: "Paramètres sécurité" },
    { path: "/submit", icon: BookOpen, label: "Soumissions", description: "Gestion contenu" }
  ]
};

export interface SimplifiedNavigationProps {
  collapsed?: boolean;
}

export function SimplifiedNavigation({ collapsed = false }: SimplifiedNavigationProps) {
  const location = useLocation();
  const { preferences, updatePreferences } = useUserPreferences();
  const { profile } = useAuth();
  
  // Détecter automatiquement le niveau selon l'usage
  const getAutoLevel = () => {
    if (!profile) return 'beginner';
    
    // Logique intelligente basée sur le rôle et l'usage
    if (profile.role === 'super_admin' || profile.role === 'admin_pays') return 'expert';
    if (profile.role === 'editeur' || profile.role === 'contributeur') return 'standard';
    return 'beginner';
  };

  const currentLevel = preferences?.navigation_level || getAutoLevel();
  const navigationItems = navigationConfig[currentLevel as keyof typeof navigationConfig] || navigationConfig.beginner;

  const toggleNavigationLevel = () => {
    const levels: ('beginner' | 'standard' | 'expert')[] = ['beginner', 'standard', 'expert'];
    const currentIndex = levels.indexOf(currentLevel as 'beginner' | 'standard' | 'expert');
    const nextLevel = levels[(currentIndex + 1) % levels.length];
    
    updatePreferences({
      navigation_level: nextLevel
    });
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'standard': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expert': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Débutant';
      case 'standard': return 'Standard';
      case 'expert': return 'Expert';
      default: return 'Standard';
    }
  };

  return (
    <div className="space-y-4">
      {/* Navigation Level Toggle */}
      {!collapsed && (
        <div className="px-3 py-2">
          <ModernButton
            variant="outline"
            size="sm"
            onClick={toggleNavigationLevel}
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <Badge className={`${getLevelColor(currentLevel)} text-xs`}>
                {getLevelLabel(currentLevel)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {navigationItems.length} sections
              </span>
            </div>
            <ChevronDown className="h-3 w-3" />
          </ModernButton>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="space-y-1 px-3">
        {navigationItems.map((item) => {
          const isCurrentlyActive = isActive(item.path);
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground ${
                  isActive || isCurrentlyActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground'
                }`
              }
              title={collapsed ? `${item.label} - ${item.description}` : undefined}
            >
              <item.icon className={`h-4 w-4 ${collapsed ? 'mx-auto' : ''}`} />
              
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.label}</div>
                  {currentLevel !== 'beginner' && (
                    <div className="text-xs opacity-70 truncate">
                      {item.description}
                    </div>
                  )}
                </div>
              )}
              
              {!collapsed && isCurrentlyActive && (
                <div className="h-2 w-2 rounded-full bg-current opacity-60" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Navigation Helper */}
      {!collapsed && currentLevel === 'beginner' && (
        <div className="mx-3 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Astuce :</strong> Cliquez sur le badge ci-dessus pour découvrir plus de fonctionnalités !
          </p>
        </div>
      )}
    </div>
  );
}