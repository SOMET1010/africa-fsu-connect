
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  FileText, 
  MessageSquare, 
  Calendar, 
  User,
  Building2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function ImprovedMobileBottomNav() {
  const { user, profile } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    {
      to: "/dashboard",
      icon: Home,
      label: "Accueil",
      roles: ["lecteur", "contributeur", "editeur", "admin_pays", "super_admin"]
    },
    {
      to: "/organizations",
      icon: Building2,
      label: "Organisations",
      roles: ["lecteur", "contributeur", "editeur", "admin_pays", "super_admin"]
    },
    {
      to: "/docs",
      icon: FileText,
      label: "Ressources",
      roles: ["lecteur", "contributeur", "editeur", "admin_pays", "super_admin"]
    },
    {
      to: "/forum",
      icon: MessageSquare,
      label: "Forum",
      roles: ["lecteur", "contributeur", "editeur", "admin_pays", "super_admin"]
    },
    {
      to: "/profile",
      icon: User,
      label: "Profil",
      roles: ["lecteur", "contributeur", "editeur", "admin_pays", "super_admin"]
    }
  ];

  const visibleItems = navItems.filter(item => 
    item.roles.includes(profile?.role || "lecteur")
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border lg:hidden">
      <div className="flex items-center justify-around px-2 py-3 max-w-md mx-auto">
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[64px] relative group",
                isActive 
                  ? "text-primary scale-105" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-1 w-6 h-1 bg-primary rounded-full" />
              )}
              
              {/* Icon container */}
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center mb-1 transition-all duration-300",
                isActive 
                  ? "bg-primary/20 shadow-sm" 
                  : "group-hover:bg-muted/50"
              )}>
                <Icon className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isActive && "scale-110"
                )} />
              </div>
              
              {/* Label */}
              <span className={cn(
                "text-xs font-medium transition-all duration-300",
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
