import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import NotificationCenter from "@/components/shared/NotificationCenter";
import { 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  Globe,
  Menu
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useTranslation } from "@/hooks/useTranslation";

interface AppHeaderProps {
  showSidebar: boolean;
}

export function AppHeader({ showSidebar }: AppHeaderProps) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { preferences, updatePreferences } = useUserPreferences();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
      toast({
        title: t('auth.logout.success'),
        description: t('auth.logout.goodbye'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('auth.logout.error'),
        variant: "destructive",
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-destructive text-destructive-foreground';
      case 'admin_pays':
        return 'bg-primary text-primary-foreground';
      case 'editeur':
        return 'bg-secondary text-secondary-foreground';
      case 'contributeur':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin_pays':
        return 'Admin Pays';
      case 'editeur':
        return 'Éditeur';
      case 'contributeur':
        return 'Contributeur';
      case 'lecteur':
        return 'Lecteur';
      default:
        return role;
    }
  };

  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {showSidebar && <SidebarTrigger />}
          
          {/* Logo pour les pages publiques */}
          {!showSidebar && (
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-[hsl(var(--fsu-blue))] rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">FSU</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-foreground">{t('landing.title')}</span>
                <span className="ml-2 text-xs bg-primary/10 px-2 py-1 rounded">
                  {preferences.language?.toUpperCase()}
                </span>
              </div>
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Sélecteur de langue */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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

          {user ? (
            <>
              {/* Notifications */}
              <NotificationCenter />
              
              {/* Menu utilisateur */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
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
                          variant="secondary" 
                          className={`${getRoleColor(profile.role)} text-xs w-fit mt-1`}
                        >
                          {getRoleLabel(profile.role)}
                        </Badge>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t('nav.profile')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t('nav.settings')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('nav.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            /* Boutons pour les utilisateurs non connectés */
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/auth">{t('auth.login')}</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">{t('nav.start')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}