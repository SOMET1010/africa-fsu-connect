import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  FolderOpen, 
  Building2, 
  BookOpen, 
  User,
  Globe,
  TrendingUp,
  BarChart3,
  Palette
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  roles: string[];
}

export function ImprovedMobileBottomNav() {
  const { user, profile } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems: NavItem[] = [
    {
      to: "/dashboard",
      icon: Home,
      label: "Pilotage",
      roles: ["reader", "contributor", "editor", "country_admin", "super_admin"]
    },
    {
      to: "/projects",
      icon: FolderOpen,
      label: "Projets",
      roles: ["reader", "contributor", "editor", "country_admin", "super_admin"]
    },
    {
      to: "/resources",
      icon: BookOpen,
      label: "Biblio",
      roles: ["reader", "contributor", "editor", "country_admin", "super_admin"]
    },
    {
      to: "/forum",
      icon: Building2,
      label: "Communauté",
      roles: ["reader", "contributor", "editor", "country_admin", "super_admin"]
    },
    {
      to: "/profile",
      icon: User,
      label: "Profil",
      roles: ["reader", "contributor", "editor", "country_admin", "super_admin"]
    }
  ];

  const visibleItems = navItems.filter(item => 
    item.roles.includes(profile?.role || "reader")
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border md:hidden">
      <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 min-w-[64px] relative",
                "hover:bg-muted/50 active:scale-95",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-scale-in" />
              )}
              
              {/* Icon container */}
              <div className={cn(
                "p-2 rounded-lg transition-all duration-300",
                isActive && "bg-primary/10 scale-110"
              )}>
                <Icon className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isActive && "scale-110"
                )} />
              </div>
              
              {/* Label */}
              <span className={cn(
                "text-xs font-medium transition-all duration-300 mt-1",
                isActive ? "font-semibold" : "font-normal"
              )}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default ImprovedMobileBottomNav;
