
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
import { NexusLogo } from "@/components/shared/NexusLogo";

const essentialItems = [
  { 
    title: "Vue d'impact", 
    url: "/dashboard", 
    icon: Home,
    description: "Tableau de pilotage"
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
    title: "Projets FSU", 
    url: "/projects", 
    icon: FileText,
    description: "Initiatives FSU"
  },
  { 
    title: "Bibliothèque", 
    url: "/resources",
    icon: BookOpen,
    description: "Guides & documents"
  },
  { 
    title: "Communauté", 
    url: "/forum", 
    icon: MessageSquare,
    description: "Discussions"
  },
  { 
    title: "Soumettre un projet", 
    url: "/submit", 
    icon: FileText,
    description: "Nouvelle initiative"
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

export function SimplifiedSidebar() {
  const location = useLocation();
  const { user, profile } = useAuth();
  const { state, collapsed } = useSidebar();
  
  const currentPath = location.pathname;
  const isCollapsed = collapsed;
  
  const isActive = (path: string) => currentPath === path;
  const isAdminUser = profile?.role && ['super_admin', 'admin_pays', 'editeur'].includes(profile.role);

  const getNavClassName = (path: string) => {
    const baseClasses = "w-full justify-start transition-all duration-200 h-12";
    if (isActive(path)) {
      return `${baseClasses} bg-primary/10 text-primary border-r-2 border-primary font-medium`;
    }
    return `${baseClasses} text-muted-foreground hover:bg-muted/50 hover:text-foreground`;
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
        return 'bg-red-100 text-red-700 border-red-200';
      case 'admin_pays':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'editeur':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'contributeur':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
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

  return (
    <Sidebar 
      className="border-r border-border bg-card"
      collapsible={true}
    >
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center space-x-3">
          {isCollapsed ? (
            <NexusLogo size="sm" variant="icon" animated={false} />
          ) : (
            <NexusLogo size="sm" variant="full" />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {/* Section Essentiel */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wider font-medium px-2 mb-2">
              Essentiel
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {essentialItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && (
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-medium text-sm truncate">{item.title}</span>
                          <span className="text-xs text-muted-foreground truncate">{item.description}</span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Section Collaboration */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wider font-medium px-2 mb-2 mt-6">
              Collaboration
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {collaborationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && (
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-medium text-sm truncate">{item.title}</span>
                          <span className="text-xs text-muted-foreground truncate">{item.description}</span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Section Administration */}
        {isAdminUser && (
          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wider font-medium px-2 mb-2 mt-6">
                Administration
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavClassName(item.url)}>
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!isCollapsed && (
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="font-medium text-sm truncate">{item.title}</span>
                            <span className="text-xs text-muted-foreground truncate">{item.description}</span>
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 shrink-0 ring-2 ring-primary/20">
            <AvatarImage src={profile?.avatar_url || ""} alt="Photo de profil" />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {getUserDisplayName()}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                {profile?.role && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-2 py-0.5 ${getRoleColor(profile.role)}`}
                  >
                    {getRoleLabel(profile.role)}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate mt-1">
                {profile?.organization || "UDC"}
              </p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
