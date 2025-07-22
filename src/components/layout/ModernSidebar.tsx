
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  User,
  Users,
  FileText, 
  MessageSquare, 
  Calendar,
  BarChart3,
  Shield,
  Building2,
  BookOpen,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { ModernTooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/modern-tooltip";
import { cn } from "@/lib/utils";

const essentialItems = [
  { 
    title: "Tableau de Bord", 
    url: "/dashboard", 
    icon: Home,
    description: "Vue d'ensemble"
  },
  { 
    title: "Mon Profil", 
    url: "/profile", 
    icon: User,
    description: "Mes informations"
  }
];

const collaborationItems = [
  { 
    title: "Indicateurs", 
    url: "/indicators", 
    icon: TrendingUp,
    description: "Données FSU"
  },
  { 
    title: "Organisations", 
    url: "/organizations", 
    icon: Building2,
    description: "Répertoire FSU"
  },
  { 
    title: "Projets", 
    url: "/projects", 
    icon: FileText,
    description: "Initiatives FSU"
  },
  { 
    title: "Ressources", 
    url: "/docs", 
    icon: BookOpen,
    description: "Guides & documents"
  },
  { 
    title: "Forum", 
    url: "/forum", 
    icon: MessageSquare,
    description: "Discussions"
  },
  { 
    title: "Soumettre", 
    url: "/submit", 
    icon: FileText,
    description: "Envoi de données"
  },
  { 
    title: "Événements", 
    url: "/events", 
    icon: Calendar,
    description: "Agenda collaboratif"
  }
];

const adminItems = [
  { 
    title: "Administration", 
    url: "/admin", 
    icon: BarChart3,
    description: "Gestion système"
  },
  { 
    title: "Utilisateurs", 
    url: "/admin/users", 
    icon: Users,
    description: "Gestion comptes"
  },
  { 
    title: "Sécurité", 
    url: "/security", 
    icon: Shield,
    description: "Paramètres sécurité"
  }
];

export function ModernSidebar() {
  const location = useLocation();
  const { user, profile } = useAuth();
  const { state, collapsed } = useSidebar();
  
  const currentPath = location.pathname;
  const isCollapsed = collapsed;
  
  const isActive = (path: string) => currentPath === path;
  const isAdminUser = profile?.role && ['super_admin', 'admin_pays', 'editeur'].includes(profile.role);

  const getNavClassName = (path: string) => {
    const baseClasses = "w-full justify-start transition-all duration-300 h-12 group relative overflow-hidden";
    if (isActive(path)) {
      return `${baseClasses} bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-r-2 border-primary font-medium shadow-lg shadow-primary/10`;
    }
    return `${baseClasses} text-muted-foreground hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30 hover:text-foreground hover:shadow-md`;
  };

  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  const getUserDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return user?.email?.split('@')[0] || "Utilisateur";
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-700 border-red-200/50';
      case 'admin_pays':
        return 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-700 border-blue-200/50';
      case 'editeur':
        return 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-700 border-green-200/50';
      case 'contributeur':
        return 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-700 border-orange-200/50';
      default:
        return 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-700 border-gray-200/50';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'admin_pays': return 'Admin Pays';
      case 'editeur': return 'Éditeur';
      case 'contributeur': return 'Contributeur';
      case 'lecteur': return 'Lecteur';
      default: return role;
    }
  };

  const renderNavItem = (item: typeof essentialItems[0]) => {
    const active = isActive(item.url);
    
    return (
      <SidebarMenuItem key={item.title}>
        <TooltipProvider>
          <ModernTooltip>
            <TooltipTrigger asChild>
              <SidebarMenuButton asChild>
                <NavLink to={item.url} className={getNavClassName(item.url)}>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <item.icon className={cn(
                    "h-5 w-5 shrink-0 transition-all duration-300",
                    active ? "text-primary scale-110" : "group-hover:scale-105"
                  )} />
                  {!isCollapsed && (
                    <div className="flex flex-col min-w-0 flex-1 ml-3">
                      <span className={cn(
                        "font-medium text-sm truncate transition-all duration-300",
                        active && "text-primary"
                      )}>
                        {item.title}
                      </span>
                      <span className="text-xs text-muted-foreground/70 truncate">
                        {item.description}
                      </span>
                    </div>
                  )}
                  {active && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full animate-scale-in" />
                  )}
                </NavLink>
              </SidebarMenuButton>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" variant="glass">
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </TooltipContent>
            )}
          </ModernTooltip>
        </TooltipProvider>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar 
      className="border-r border-border/30 bg-gradient-to-b from-background/95 to-background backdrop-blur-xl"
      collapsible={true}
    >
      <SidebarHeader className="border-b border-border/30 p-4">
        <GlassCard variant="subtle" className="p-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-primary-light to-accent rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 animate-pulse-glow">
              <span className="text-white font-bold text-sm">FSU</span>
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <h2 className="font-bold text-foreground text-base leading-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  FSU Afrique
                </h2>
                <p className="text-xs text-muted-foreground">Plateforme collaborative</p>
              </div>
            )}
          </div>
        </GlassCard>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 space-y-6">
        {/* Section Essentiel */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wider font-medium px-2 mb-3">
              <span className="bg-gradient-to-r from-primary/60 to-accent/60 bg-clip-text text-transparent">
                Essentiel
              </span>
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {essentialItems.map(renderNavItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Section Collaboration */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wider font-medium px-2 mb-3 mt-6">
              <span className="bg-gradient-to-r from-primary/60 to-accent/60 bg-clip-text text-transparent">
                Collaboration
              </span>
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {collaborationItems.map(renderNavItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Section Administration */}
        {isAdminUser && (
          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wider font-medium px-2 mb-3 mt-6">
                <span className="bg-gradient-to-r from-red-500/60 to-orange-500/60 bg-clip-text text-transparent">
                  Administration
                </span>
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {adminItems.map(renderNavItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/30 p-4">
        <GlassCard variant="subtle" className="p-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10 shrink-0 ring-2 ring-primary/30 ring-offset-2 ring-offset-background transition-all duration-300 hover:ring-primary/50 hover:scale-105">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-sm font-medium">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {getUserDisplayName()}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  {profile?.role && (
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs px-2 py-0.5 transition-all duration-300 hover:scale-105",
                        getRoleColor(profile.role)
                      )}
                    >
                      {getRoleLabel(profile.role)}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {profile?.organization || "FSU Afrique"}
                </p>
              </div>
            )}
          </div>
        </GlassCard>
      </SidebarFooter>
    </Sidebar>
  );
}
