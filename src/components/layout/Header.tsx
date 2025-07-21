import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  X, 
  Globe, 
  User, 
  LogOut,
  Settings,
  LogIn
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationCenter from "@/components/shared/NotificationCenter";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, isAdmin } = useAuth();
  const { preferences, updatePreferences } = useUserPreferences();

  const navigation = [
    { name: "Accueil", href: "/", icon: "🏠" },
    { name: "Tableau de Bord", href: "/dashboard", icon: "📊" },
    { name: "Projets", href: "/projects", icon: "🚀" },
    { name: "Ressources", href: "/docs", icon: "📚" },
    { name: "Forum", href: "/forum", icon: "💬" },
    { name: "Soumissions", href: "/submit", icon: "📝" },
    { name: "Événements", href: "/events", icon: "📅" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-500';
      case 'admin_pays': return 'bg-orange-500';
      case 'editeur': return 'bg-blue-500';
      case 'contributeur': return 'bg-green-500';
      case 'lecteur': return 'bg-gray-500';
      default: return 'bg-gray-500';
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

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--fsu-blue))] rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">FSU</span>
              </div>
              <div className="hidden md:block">
                <h1 className="font-bold text-lg text-foreground">Plateforme FSU Afrique</h1>
                <p className="text-xs text-muted-foreground">UAT • ANSUT</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {user && (
              <>
                {/* Notification Center */}
                <NotificationCenter />
                
                {/* Language Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hidden md:flex">
                      <Globe className="h-4 w-4 mr-2" />
                      {preferences.language === 'fr' ? 'FR' : 'EN'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
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
              </>
            )}

            {/* User Menu or Login Button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    {profile && (
                      <Badge className={`${getRoleColor(profile.role)} text-white text-xs hidden sm:inline-flex`}>
                        {getRoleLabel(profile.role)}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {profile && (
                    <>
                      <div className="px-2 py-1.5 text-sm">
                        <div className="font-medium">
                          {profile.first_name} {profile.last_name}
                        </div>
                        <div className="text-muted-foreground">{profile.email}</div>
                        <Badge className={`${getRoleColor(profile.role)} text-white text-xs mt-1`}>
                          {getRoleLabel(profile.role)}
                        </Badge>
                      </div>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="h-4 w-4 mr-2" />
                      Mon Profil
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin() && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <Settings className="h-4 w-4 mr-2" />
                        Administration
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm">
                <Link to="/auth">
                  <LogIn className="h-4 w-4 mr-2" />
                  Se connecter
                </Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-2 border-t border-border">
        <Breadcrumb />
      </div>
    </header>
  );
};

export default Header;