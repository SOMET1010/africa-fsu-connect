
import React from "react";
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
import { NavLink, NavLinkProps } from "react-router-dom";
import { 
  Home, 
  FolderOpen, 
  FileText, 
  MessageSquare, 
  Send, 
  Calendar,
  User,
  Settings,
  Users,
  Shield,
  BarChart3,
  BookOpen,
  ShieldCheck,
  Building2,
  TrendingUp,
  Palette,
  PlayCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslationDb } from "@/hooks/useTranslationDb";

// Wrapper component to handle forwardRef for NavLink
const ForwardedNavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  (props, ref) => (
    <NavLink ref={ref} {...props} />
  )
);
ForwardedNavLink.displayName = "ForwardedNavLink";

export function AppSidebar() {
  const location = useLocation();
  const { user, profile } = useAuth();
  const { state, collapsed } = useSidebar();
  const { t } = useTranslationDb();
  
  const currentPath = location.pathname;
  const isCollapsed = collapsed;
  
  const menuSections = [
    {
      label: "Personnel",
      items: [
        { title: t('nav.dashboard'), url: "/dashboard", icon: Home },
        { title: t('nav.profile'), url: "/profile", icon: User },
        { title: "Préférences", url: "/preferences", icon: Settings },
        { title: "Personnalisation IA", url: "/preferences/advanced", icon: Palette },
        { title: t('nav.security'), url: "/security", icon: Shield },
      ]
    },
    {
      label: "Collaboration",
      items: [
        { title: "Indicateurs", url: "/indicators", icon: TrendingUp },
        { title: t('nav.organizations'), url: "/organizations", icon: Building2 },
        { title: t('nav.projects'), url: "/projects", icon: FolderOpen },
        { title: t('nav.resources'), url: "/docs", icon: BookOpen },
        { title: t('nav.forum'), url: "/forum", icon: MessageSquare },
        { title: "Soumettre", url: "/submit", icon: Send },
        { title: t('nav.events'), url: "/events", icon: Calendar },
      ]
    }
  ];

  const adminSection = {
    label: t('nav.admin'),
    items: [
      { title: "Vue d'ensemble", url: "/admin", icon: BarChart3 },
      { title: "Utilisateurs", url: "/admin/users", icon: Users },
      { title: "Modération Forum", url: "/admin/forum", icon: ShieldCheck },
      { title: "Guide Demo", url: "/demo-guide", icon: PlayCircle },
    ]
  };
  
  const isActive = (path: string) => currentPath === path;
  const isAdminUser = profile?.role && ['super_admin', 'admin_pays', 'editeur'].includes(profile.role);

  const getNavClassName = (path: string) => {
    const baseClasses = "w-full justify-start transition-colors duration-200";
    if (isActive(path)) {
      return `${baseClasses} bg-sidebar-accent text-sidebar-accent-foreground font-medium`;
    }
    return `${baseClasses} text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`;
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

  return (
    <Sidebar 
      className="border-r border-sidebar-border bg-sidebar"
      collapsible={true}
    >
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-[hsl(var(--fsu-blue))] rounded-lg flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-sm">FSU</span>
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h2 className="font-bold text-sidebar-foreground text-sm leading-tight">
                {t('landing.title')}
              </h2>
              <p className="text-xs text-sidebar-foreground/70">Afrique</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {menuSections.map((section) => (
          <SidebarGroup key={section.label}>
            {!isCollapsed && (
              <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs uppercase tracking-wider font-medium px-2">
                {section.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                       <ForwardedNavLink to={item.url} className={getNavClassName(item.url)}>
                         <item.icon className="h-4 w-4 shrink-0" />
                         {!isCollapsed && item.title}
                       </ForwardedNavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {isAdminUser && (
          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs uppercase tracking-wider font-medium px-2">
                {adminSection.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {adminSection.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                       <ForwardedNavLink to={item.url} className={getNavClassName(item.url)}>
                         <item.icon className="h-4 w-4 shrink-0" />
                         {!isCollapsed && item.title}
                       </ForwardedNavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={profile?.avatar_url || ""} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-sidebar-foreground/70 truncate">
                {profile?.organization || "FSU Afrique"}
              </p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
