import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  BarChart2, 
  Rocket, 
  BookOpen, 
  MessageSquare, 
  FileText, 
  Calendar,
  MapPin,
  Building2,
  Settings,
  Shield,
  Users,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useNexusLayer } from "@/hooks/useNexusLayer";

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  roles?: string[];
}

export const AppNavigation = () => {
  const location = useLocation();
  const { profile } = useAuth();
  const { t } = useTranslation();
  const { isOperationalLayer } = useNexusLayer();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mainNavItems: NavItem[] = [
    { name: t('nav.dashboard'), path: '/dashboard', icon: BarChart2 },
    { name: 'Indicateurs', path: '/indicators', icon: TrendingUp },
    { name: t('nav.map'), path: '/map', icon: MapPin },
    { name: t('nav.projects'), path: '/projects', icon: Rocket },
    { name: t('nav.organizations'), path: '/organizations', icon: Building2 },
    { name: t('nav.resources'), path: '/resources', icon: BookOpen },
    { name: t('nav.forum'), path: '/forum', icon: MessageSquare },
    { name: t('nav.submit'), path: '/submit', icon: FileText },
    { name: t('nav.events'), path: '/events', icon: Calendar },
  ];

  const adminNavItems: NavItem[] = [
    { name: t('nav.admin'), path: '/admin', icon: Settings, roles: ['super_admin', 'country_admin', 'editor'] },
    { name: t('nav.admin_users'), path: '/admin/users', icon: Users, roles: ['super_admin', 'country_admin'] },
    { name: t('nav.security'), path: '/security', icon: Shield, roles: ['super_admin', 'country_admin'] }
  ];

  const userRole = profile?.role || 'reader';

  const filteredAdminItems = adminNavItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  const hasAdminAccess = filteredAdminItems.length > 0;

  if (!mounted) return null;

  return (
    <nav className="w-full space-y-1 py-2">
      <div className="space-y-1">
        {mainNavItems.map((item) => (
          <NavItemLink key={item.path} item={item} pathname={location.pathname} />
        ))}
      </div>

      {/* 
        ╔══════════════════════════════════════════════════════════════════╗
        ║  NEXUS BLUEPRINT GARDE-FOU                                       ║
        ║                                                                  ║
        ║  Les liens admin ne s'affichent QUE sur Layer 3 (Opérationnel)   ║
        ║  Même si l'utilisateur a les droits admin, on ne montre pas      ║
        ║  ces liens sur Layer 1 (Réseau) ou Layer 2 (Collaboration)       ║
        ╚══════════════════════════════════════════════════════════════════╝
      */}
      {hasAdminAccess && isOperationalLayer && (
        <>
          <div className="my-3 px-3">
            <div className="h-px bg-border" />
          </div>
          
          <div className="space-y-1">
            {filteredAdminItems.map((item) => (
              <NavItemLink key={item.path} item={item} pathname={location.pathname} />
            ))}
          </div>
        </>
      )}
    </nav>
  );
};

interface NavItemLinkProps {
  item: NavItem;
  pathname: string;
}

const NavItemLink = ({ item, pathname }: NavItemLinkProps) => {
  const Icon = item.icon;
  const isActive = pathname === item.path;

  return (
    <NavLink
      to={item.path}
      className={({ isActive: active }) => cn(
        "flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200",
        "hover:bg-accent/50 hover:text-foreground group relative",
        active 
          ? "bg-primary/10 text-primary font-medium" 
          : "text-muted-foreground"
      )}
    >
      {({ isActive }) => (
        <>
          <Icon className={cn(
            "h-4 w-4 mr-2 transition-transform",
            isActive && "text-primary animate-scale-in"
          )} />
          
          <span>{item.name}</span>
          
          {isActive && (
            <span className="absolute right-2 h-1.5 w-1.5 rounded-full bg-primary animate-scale-in" />
          )}
        </>
      )}
    </NavLink>
  );
};

export default AppNavigation;
