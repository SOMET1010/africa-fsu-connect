
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ModernButton } from "@/components/ui/modern-button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GlassCard } from "@/components/ui/glass-card";
import { 
  Menu, 
  X, 
  Globe, 
  User, 
  LogOut,
  Settings,
  LogIn,
  Home,
  BarChart2,
  BarChart3,
  Rocket,
  BookOpen,
  MessageSquare,
  FileText,
  Calendar,
  Bell
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import NotificationCenter from "@/components/shared/NotificationCenter";
import { LanguageSelector } from "@/components/shared/LanguageSelector";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/useTranslation";
import { SidebarTrigger } from "@/components/ui/sidebar";

const ModernHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, isAdmin } = useAuth();
  const { preferences, updatePreferences } = useUserPreferences();
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: t('nav.home'), href: "/", icon: Home },
    { name: t('nav.dashboard'), href: "/dashboard", icon: BarChart2 },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: t('nav.projects'), href: "/projects", icon: Rocket },
    { name: t('nav.resources'), href: "/docs", icon: BookOpen },
    { name: t('nav.forum'), href: "/forum", icon: MessageSquare },
    { name: t('nav.submit'), href: "/submit", icon: FileText },
    { name: t('nav.events'), href: "/events", icon: Calendar },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-700 border-red-200/50';
      case 'admin_pays': return 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-700 border-blue-200/50';
      case 'editeur': return 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-700 border-green-200/50';
      case 'contributeur': return 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-700 border-orange-200/50';
      case 'lecteur': return 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-700 border-gray-200/50';
      default: return 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-700 border-gray-200/50';
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

  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <header 
      className={cn(
        "sticky top-0 w-full transition-all duration-300 z-header",
        scrolled 
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/5" 
          : "bg-background/60 backdrop-blur-md border-b border-border/30"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Premium Logo with sophisticated design */}
          <div className="flex items-center space-x-4">
            {/* Sidebar trigger for authenticated users on desktop */}
            {user && !isMobile && (
              <SidebarTrigger className="h-8 w-8" />
            )}
            <Link to="/" className="flex items-center space-x-3 group transition-all duration-500">
              <div className="relative">
                <div className="premium-card p-3 group-hover:scale-110 transition-all duration-500 shadow-glow">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary via-primary-light to-accent rounded-xl flex items-center justify-center shadow-elegant">
                    <span className="text-white font-bold text-lg">FSU</span>
                  </div>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="hidden md:block">
                <h1 className="font-bold text-xl bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto] group-hover:from-accent group-hover:to-primary transition-all duration-500">
                  {t('landing.title')}
                </h1>
                <p className="text-xs text-muted-foreground font-medium tracking-wide">UAT • ANSUT • Premium</p>
              </div>
            </Link>
          </div>

          {/* Navigation Desktop avec effets modernes */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative group overflow-hidden",
                    active
                      ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary shadow-lg shadow-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Icon className={cn(
                    "h-4 w-4 mr-2 transition-all duration-300",
                    active ? "text-primary scale-110" : "group-hover:scale-105"
                  )} />
                  <span className="relative z-10">{item.name}</span>
                  {active && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full animate-scale-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions de droite avec effets modernes */}
          <div className="flex items-center space-x-2">
            {user && (
              <>
                {/* Sélecteur de langue moderne */}
                <LanguageSelector variant="ghost" size="sm" showLabel={false} />
                
                {/* Centre de notifications moderne */}
                <div className="relative">
                  <NotificationCenter />
                </div>
              </>
            )}

            {/* Menu utilisateur moderne */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ModernButton variant="ghost" className="relative h-9 w-9 rounded-full p-0 ring-2 ring-transparent hover:ring-primary/30 transition-all duration-300">
                    <Avatar className="h-9 w-9 transition-transform hover:scale-105">
                      <AvatarImage src={profile?.avatar_url || ""} alt={profile?.first_name || "User"} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs font-medium">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                  </ModernButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 animate-scale-in bg-card/90 backdrop-blur-xl border-border/50">
                  <DropdownMenuLabel className="font-normal p-4">
                    <GlassCard variant="subtle" className="p-3">
                      <div className="flex flex-col space-y-2">
                        <p className="text-sm font-medium leading-none">
                          {profile?.first_name && profile?.last_name 
                            ? `${profile.first_name} ${profile.last_name}`
                            : user.email?.split('@')[0]
                          }
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                        {profile?.role && (
                          <Badge 
                            className={cn(
                              "text-xs w-fit transition-all hover:scale-105",
                              getRoleColor(profile.role)
                            )}
                          >
                            {getRoleLabel(profile.role)}
                          </Badge>
                        )}
                      </div>
                    </GlassCard>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem className="cursor-pointer">
                    <Link to="/profile" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t('nav.profile')}</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin() && (
                    <DropdownMenuItem className="cursor-pointer">
                      <Link to="/admin" className="flex items-center w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>{t('nav.admin')}</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('nav.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <ModernButton variant="ghost" size="sm" className="hidden sm:flex" asChild>
                  <Link to="/auth">
                    {t('auth.login')}
                  </Link>
                </ModernButton>
                <ModernButton size="sm" variant="default" asChild>
                  <Link to="/auth">
                    <LogIn className="h-4 w-4 mr-1" />
                    <span>{t('nav.start')}</span>
                  </Link>
                </ModernButton>
              </div>
            )}

            {/* Bouton menu mobile moderne */}
            <ModernButton
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? 
                <X className="h-4 w-4 transition-transform rotate-0 animate-in" /> : 
                <Menu className="h-4 w-4 transition-transform rotate-0 animate-in" />
              }
            </ModernButton>
          </div>
        </div>

        {/* Navigation mobile moderne */}
        <div 
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMenuOpen ? "max-h-screen opacity-100 pb-4" : "max-h-0 opacity-0"
          )}
        >
          <GlassCard variant="subtle" className="mt-4 p-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all group",
                      active
                        ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className={cn(
                      "h-4 w-4 mr-2 transition-all duration-300",
                      active ? "text-primary scale-110" : "group-hover:scale-105"
                    )} />
                    <span>{item.name}</span>
                    {active && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-primary animate-scale-in" />
                    )}
                  </Link>
                );
              })}
            </div>
            
            {/* Sélecteur de langue pour mobile */}
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Langue / Language</span>
                <LanguageSelector variant="outline" size="sm" showLabel={true} />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
      
      {/* Breadcrumb moderne */}
      <div className={cn(
        "container mx-auto px-4 transition-all duration-300",
        scrolled ? "opacity-0 py-0" : "opacity-100 py-2"
      )}>
        <GlassCard variant="subtle" className="p-2">
          <Breadcrumb />
        </GlassCard>
      </div>
    </header>
  );
};

export default ModernHeader;
