import { Badge } from "@/components/ui/badge";
import { ADMIN_MENU_SECTIONS, ADMIN_ROLE_LABELS } from "@/data/adminMenuConfig";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/components/ui/sidebar";
import { Shield } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AdminSidebar() {
  const { t } = useTranslation();
  const { collapsed } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { profile } = useAuth();
  const userRole = profile?.role;

  const filteredSections = ADMIN_MENU_SECTIONS
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        userRole ? item.roles.includes(userRole) : false
      ),
    }))
    .filter((section) => section.items.length > 0);

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
    <Sidebar>
      <SidebarContent className="bg-background border-r">
        {/* Admin Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-semibold text-sm">{t('nav.admin')}</h2>
                <p className="text-xs text-muted-foreground">Plateforme FSU</p>
              </div>
            )}
          </div>
        </div>

        {filteredSections.map((section) => (
          <SidebarGroup key={section.id} className="px-2">
            <SidebarGroupLabel className="px-2 py-2 text-xs font-medium text-muted-foreground">
              {!collapsed ? section.title : ""}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild className="h-10">
                      <NavLink
                        to={item.path}
                        className={`${getNavClassName(item.path)} flex items-start gap-3 px-3 py-2 rounded-lg transition-all duration-200`}
                        title={collapsed ? item.title : ""}
                      >
                        <item.icon className="mt-1 h-4 w-4 flex-shrink-0" />
                        {!collapsed && (
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-sm font-medium">{item.title}</div>
                              <Badge variant="outline" size="sm">
                                CDC {item.cdcRef}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {item.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {item.roles.map((role) => (
                                <Badge key={role} variant="secondary" className="text-[10px]">
                                  {ADMIN_ROLE_LABELS[role]}
                                </Badge>
                              ))}
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
        ))}

        {/* Quick Actions */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t">
            <div className="bg-muted/50 rounded-lg p-3">
              <h3 className="font-medium text-sm mb-2">{t('admin.quick.actions')}</h3>
              <div className="space-y-2">
                <button className="w-full text-left text-xs text-muted-foreground hover:text-foreground">
                  {t('admin.send.notification')}
                </button>
                <button className="w-full text-left text-xs text-muted-foreground hover:text-foreground">
                  {t('admin.export.data')}
                </button>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
