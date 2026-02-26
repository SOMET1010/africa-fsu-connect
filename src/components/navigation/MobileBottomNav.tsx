import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  FolderOpen, 
  MessageSquare, 
  Calendar, 
  Settings,
  User,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const MobileBottomNav = () => {
  const { user, profile } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = [
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
      icon: TrendingUp,
      label: "Biblio",
      roles: ["reader", "contributor", "editor", "country_admin", "super_admin"]
    },
    {
      to: "/forum",
      icon: MessageSquare,
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-[60px]",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 mb-1 transition-transform duration-200",
                isActive && "scale-110"
              )} />
              <span className="text-xs font-medium truncate">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
