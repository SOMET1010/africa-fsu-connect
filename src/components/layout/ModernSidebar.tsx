
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
  TrendingUp,
  Settings,
  MapPin
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { ModernTooltip, TooltipTrigger, TooltipContent } from "@/components/ui/modern-tooltip";
import { cn } from "@/lib/utils";
import { SimplifiedNavigation } from "./SimplifiedNavigation";


export function ModernSidebar() {
  const { user, profile } = useAuth();
  const { collapsed } = useSidebar();

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
      case 'country_admin':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'editor':
        return 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-700 border-green-200/50';
      case 'contributor':
        return 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-700 border-orange-200/50';
      default:
        return 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-700 border-gray-200/50';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'country_admin': return 'Admin Pays';
      case 'editor': return 'Éditeur';
      case 'contributor': return 'Contributeur';
      case 'reader': return 'Lecteur';
      default: return role;
    }
  };

  return (
    <Sidebar 
      className="border-r border-border bg-background"
      collapsible={true}
    >
      <SidebarHeader className="border-b border-border p-4">
        <div className="p-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-sm">FSU</span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h2 className="font-bold text-foreground text-base leading-tight">
                  FSU Afrique
                </h2>
                <p className="text-xs text-muted-foreground">Plateforme collaborative</p>
              </div>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SimplifiedNavigation />
      </SidebarContent>

      <SidebarFooter className="border-t border-border/30 p-4">
        <GlassCard variant="subtle" className="p-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={profile?.avatar_url || ""} alt="Photo de profil" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-background" />
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {getUserDisplayName()}
                </p>
                {profile?.role && (
                  <Badge 
                    variant="outline" 
                    className="text-xs mt-1"
                  >
                    {getRoleLabel(profile.role)}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </GlassCard>
      </SidebarFooter>
    </Sidebar>
  );
}
