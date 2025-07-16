import { useState } from "react";
import { Users, FileText, Calendar, MessageSquare, Settings, BarChart3, Shield, Bell } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const adminMenuItems = [
  {
    title: "Tableau de Bord",
    url: "/admin",
    icon: BarChart3,
    description: "Vue d'ensemble et statistiques"
  },
  {
    title: "Utilisateurs",
    url: "/admin/users",
    icon: Users,
    description: "Gestion des utilisateurs et rôles"
  },
  {
    title: "Modération Forum",
    url: "/admin/forum",
    icon: MessageSquare,
    description: "Modération des discussions"
  },
  {
    title: "Documents",
    url: "/admin/documents",
    icon: FileText,
    description: "Validation et gestion des documents"
  },
  {
    title: "Événements",
    url: "/admin/events",
    icon: Calendar,
    description: "Gestion des événements"
  },
  {
    title: "Soumissions",
    url: "/admin/submissions",
    icon: Shield,
    description: "Révision des soumissions"
  },
  {
    title: "Notifications",
    url: "/admin/notifications",
    icon: Bell,
    description: "Gestion des notifications"
  },
  {
    title: "Paramètres",
    url: "/admin/settings",
    icon: Settings,
    description: "Configuration système"
  }
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/admin") {
      return currentPath === "/admin";
    }
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    return isActive(path) 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"}>
      <SidebarContent className="bg-background border-r">
        {/* Admin Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-semibold text-sm">Administration</h2>
                <p className="text-xs text-muted-foreground">Plateforme FSU</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="px-2">
          <SidebarGroupLabel className="px-2 py-2 text-xs font-medium text-muted-foreground">
            {!collapsed ? "Menu Principal" : ""}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink 
                      to={item.url} 
                      className={`${getNavClassName(item.url)} flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200`}
                      title={collapsed ? item.title : ""}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium">{item.title}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t">
            <div className="bg-muted/50 rounded-lg p-3">
              <h3 className="font-medium text-sm mb-2">Actions Rapides</h3>
              <div className="space-y-2">
                <button className="w-full text-left text-xs text-muted-foreground hover:text-foreground">
                  Envoyer notification globale
                </button>
                <button className="w-full text-left text-xs text-muted-foreground hover:text-foreground">
                  Exporter données
                </button>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}