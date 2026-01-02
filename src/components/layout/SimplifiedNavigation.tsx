import { useLocation, NavLink } from "react-router-dom";
import { 
  Home, 
  Users,
  FileText, 
  MessageSquare, 
  Building2,
  Calendar,
  MapPin,
  BookOpen,
  Zap,
  Globe,
  Handshake,
  GraduationCap,
  Rocket,
  Lightbulb,
  Plus,
  Video,
  Wrench
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

// ============================================================
// NAVIGATION SIMPLIFIÉE - ALIGNÉE SUR BLUEPRINT NEXUS
// ============================================================
// 3 couches : Réseau | Collaborer | Apprendre
// Mode Avancé isolé (admin uniquement)
// ============================================================

const navigationLayers = {
  // COUCHE 1 : RÉSEAU (visible par défaut)
  network: {
    label: "Réseau",
    icon: Globe,
    items: [
      { path: "/", icon: Home, label: "Accueil", description: "Vue d'ensemble du réseau" },
      { path: "/network", icon: Globe, label: "Vue Réseau", description: "Coordination SUTEL" },
      { path: "/members", icon: Users, label: "Pays membres", description: "Annuaire du réseau" },
      { path: "/map", icon: MapPin, label: "Carte", description: "Visualisation géographique" },
    ]
  },
  // COUCHE 2 : COLLABORATION (sur intention)
  collaboration: {
    label: "Collaborer",
    icon: Handshake,
    items: [
      { path: "/projects", icon: Rocket, label: "Projets", description: "Initiatives inspirantes" },
      { path: "/practices", icon: Lightbulb, label: "Bonnes pratiques", description: "Partage d'expériences" },
      { path: "/resources", icon: BookOpen, label: "Bibliothèque", description: "Documents & ressources" },
      { path: "/forum", icon: MessageSquare, label: "Discussions", description: "Échanger avec le réseau" },
      { path: "/submit", icon: Plus, label: "Proposer", description: "Partager une initiative" },
    ]
  },
  // COUCHE 2 : APPRENDRE
  learning: {
    label: "Apprendre",
    icon: GraduationCap,
    items: [
      { path: "/elearning", icon: BookOpen, label: "E-Learning", description: "Formations en ligne" },
      { path: "/events", icon: Calendar, label: "Événements", description: "Agenda collaboratif" },
      { path: "/webinars", icon: Video, label: "Webinaires", description: "Sessions en direct" },
    ]
  }
};

// Mode avancé (isolé, admin uniquement)
const advancedModeItems = [
  { path: "/advanced", icon: Wrench, label: "Mode avancé", description: "Outils experts" },
];

export interface SimplifiedNavigationProps {
  collapsed?: boolean;
}

export function SimplifiedNavigation({ collapsed = false }: SimplifiedNavigationProps) {
  const location = useLocation();
  const { profile, isAdmin } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const renderNavSection = (layer: { label: string; icon: any; items: any[] }) => (
    <div className="space-y-1">
      {!collapsed && (
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <layer.icon className="h-3.5 w-3.5" />
            <span>{layer.label}</span>
          </div>
        </div>
      )}
      
      <nav className="space-y-0.5 px-2">
        {layer.items.map((item) => {
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
              <item.icon className={`h-4 w-4 shrink-0 ${collapsed ? 'mx-auto' : ''}`} />
              
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.label}</div>
                </div>
              )}
              
              {!collapsed && isCurrentlyActive && (
                <div className="h-2 w-2 rounded-full bg-current opacity-60" />
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Couche 1 : Réseau */}
      {renderNavSection(navigationLayers.network)}
      
      {/* Séparateur */}
      <div className="mx-3 border-t border-border/50" />
      
      {/* Couche 2 : Collaborer */}
      {renderNavSection(navigationLayers.collaboration)}
      
      {/* Séparateur */}
      <div className="mx-3 border-t border-border/50" />
      
      {/* Couche 2 : Apprendre */}
      {renderNavSection(navigationLayers.learning)}

      {/* Mode avancé (admin uniquement) */}
      {isAdmin() && (
        <>
          <div className="mx-3 border-t border-border/50" />
          <div className="space-y-1">
            {!collapsed && (
              <div className="px-3 py-2">
                <Badge variant="outline" className="text-xs font-medium text-muted-foreground">
                  Expert
                </Badge>
              </div>
            )}
            <nav className="space-y-0.5 px-2">
              {advancedModeItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground ${
                      isActive
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground'
                    }`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={`h-4 w-4 shrink-0 ${collapsed ? 'mx-auto' : ''}`} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
