
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Rocket,
  BookOpen,
  MessageSquare,
  FileText,
  Calendar
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
import Breadcrumb from "@/components/shared/Breadcrumb";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/useTranslation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, isAdmin } = useAuth();
  const { preferences, updatePreferences } = useUserPreferences();
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  // Listen for scroll events to add shadow when scrolled
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
      case 'super_admin': return 'bg-destructive text-destructive-foreground';
      case 'admin_pays': return 'bg-primary text-primary-foreground';
      case 'editeur': return 'bg-secondary text-secondary-foreground';
      case 'contributeur': return 'bg-accent text-accent-foreground';
      case 'lecteur': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
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
        "sticky top-0 z-50 w-full transition-all duration-200",
        "bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60",
        scrolled ? "shadow-sm border-b border-border" : "border-b border-border/50"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2 group transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-[hsl(var(--fsu-blue))] rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <span className="text-primary-foreground font-bold text-lg">FSU</span>
              </div>
              <div className="hidden md:block">
                <h1 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                  {t('landing.title')}
                </h1>
                <p className="text-xs text-muted-foreground">UAT • ANSUT</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors relative",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {active && (
                    <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-primary rounded-full animate-fade-in" />
                  )}
                  <Icon className={cn("h-4 w-4 mr-2", active && "animate-scale-in")} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {user && (
              <>
                {/* Language Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Globe className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="animate-scale-in">
                    <DropdownMenuItem 
                      onClick={() => updatePreferences({ language: 'fr' })}
                      className={preferences.language === 'fr' ? 'bg-accent' : ''}
                    >
                      🇫🇷 Français
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => updatePreferences({ language: 'en' })}
                      className={preferences.language === 'en' ? 'bg-accent' : ''}
                    >
                      🇺🇸 English
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Notification Center */}
                <NotificationCenter />
              </>
            )}

            {/* User Menu or Login Button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 transition-transform hover:scale-105">
                      <AvatarImage src={profile?.avatar_url || ""} alt={profile?.first_name || "User"} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 animate-scale-in">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
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
                            `${getRoleColor(profile.role)} text-xs w-fit mt-1`,
                            "transition-all hover:scale-105"
                          )}
                        >
                          {getRoleLabel(profile.role)}
                        </Badge>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>{t('nav.profile')}</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin() && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center cursor-pointer">
                        <div className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>{t('nav.admin')}</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('nav.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
                  <Link to="/auth">
                    {t('auth.login')}
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/auth" className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4 mr-1" />
                    <span>{t('nav.start')}</span>
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? 
                <X className="h-4 w-4 transition-transform rotate-0 animate-in" /> : 
                <Menu className="h-4 w-4 transition-transform rotate-0 animate-in" />
              }
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Animated slide in/out */}
        <div 
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border animate-fade-in">
            {navigation.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all",
                    active
                      ? "bg-primary/10 text-primary transform translate-x-1"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent hover:translate-x-1"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className={cn("h-4 w-4 mr-2", active && "text-primary")} />
                  <span>{item.name}</span>
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-scale-in" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Breadcrumb */}
      <div className={cn(
        "container mx-auto px-4 py-2 border-t border-border/50",
        "transition-all duration-300",
        scrolled ? "opacity-0 h-0 py-0 overflow-hidden" : "opacity-100"
      )}>
        <Breadcrumb />
      </div>
    </header>
  );
};

export default Header;
