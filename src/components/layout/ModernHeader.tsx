
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { ModernButton } from "@/components/ui/modern-button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GlassCard } from "@/components/ui/glass-card";
import { NexusLogo } from "@/components/shared/NexusLogo";
import { 
  Menu, 
  X, 
  User, 
  LogOut,
  Settings,
  LogIn,
  ChevronDown,
  ArrowRight
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
import { mainNavigation } from "@/config/navigation";
import { shouldShowAdminLinks } from "@/config/blueprintGuards";

const ModernHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, isAdmin } = useAuth();
  const { preferences, updatePreferences } = useUserPreferences();
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;
  const isInSubmenu = (submenu?: { href: string }[]) => 
    submenu?.some(item => location.pathname === item.href);

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
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 w-full transition-all duration-500 ease-out z-header",
          scrolled 
            ? "bg-[hsl(var(--nx-night))]/85 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/30" 
            : "bg-transparent backdrop-blur-none border-b border-transparent"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Premium Logo avec animation hover */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <NexusLogo size="md" variant="full" showSubtext={false} animated />
              </motion.div>
              <motion.span 
                className="text-[hsl(var(--nx-gold))] font-bold text-xl hidden sm:inline-block"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                .
              </motion.span>
            </Link>

            {/* Navigation Desktop avec micro-interactions */}
            <nav className="hidden lg:flex items-center space-x-1">
              {mainNavigation.map((item) => {
                const Icon = item.icon;
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                const active = item.href ? isActive(item.href) : isInSubmenu(item.submenu);
                
                // Item avec sous-menu
                if (hasSubmenu) {
                  return (
                    <DropdownMenu key={item.id}>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={cn(
                            "relative flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group",
                            active
                              ? "text-[hsl(var(--nx-gold))]"
                              : "text-white/60 hover:text-white"
                          )}
                          onMouseEnter={() => setHoveredLink(item.id)}
                          onMouseLeave={() => setHoveredLink(null)}
                        >
                          {/* Glow background animé */}
                          <AnimatePresence>
                            {(hoveredLink === item.id || active) && (
                              <motion.div
                                layoutId="nav-glow"
                                className="absolute inset-0 bg-[hsl(var(--nx-gold))]/15 rounded-xl -z-10"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                style={{ filter: 'blur(4px)' }}
                              />
                            )}
                          </AnimatePresence>
                          
                          <Icon className={cn(
                            "h-4 w-4 mr-2 transition-all duration-300",
                            active ? "text-[hsl(var(--nx-gold))]" : "group-hover:text-[hsl(var(--nx-gold))]"
                          )} />
                          <span className="relative z-10">{item.label}</span>
                          <ChevronDown className="h-3 w-3 ml-1 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="start" 
                        className="w-64 animate-scale-in bg-[hsl(var(--nx-night))]/95 backdrop-blur-2xl border-white/10 p-2"
                      >
                        {item.submenu?.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const subActive = isActive(subItem.href);
                          return (
                            <DropdownMenuItem key={subItem.href} asChild className="p-0">
                              <Link 
                                to={subItem.href}
                                className={cn(
                                  "flex items-start gap-3 p-3 rounded-lg transition-all duration-200 w-full cursor-pointer",
                                  subActive 
                                    ? "bg-[hsl(var(--nx-gold))]/20 text-[hsl(var(--nx-gold))]" 
                                    : "text-white/70 hover:bg-white/5 hover:text-white"
                                )}
                              >
                                <div className={cn(
                                  "p-2 rounded-lg shrink-0",
                                  subActive ? "bg-[hsl(var(--nx-gold))]/30" : "bg-white/5"
                                )}>
                                  <SubIcon className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="font-medium text-sm">
                                    {subItem.label}
                                  </span>
                                  <span className="text-xs text-white/50">
                                    {subItem.description}
                                  </span>
                                </div>
                              </Link>
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }
                
                // Item simple (lien direct)
                return (
                  <Link
                    key={item.id}
                    to={item.href || '/'}
                    className={cn(
                      "relative flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group",
                      active
                        ? "text-[hsl(var(--nx-gold))]"
                        : "text-white/60 hover:text-white"
                    )}
                    onMouseEnter={() => setHoveredLink(item.id)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {/* Glow background animé */}
                    <AnimatePresence>
                      {(hoveredLink === item.id || active) && (
                        <motion.div
                          layoutId="nav-glow"
                          className="absolute inset-0 bg-[hsl(var(--nx-gold))]/15 rounded-xl -z-10"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          style={{ filter: 'blur(4px)' }}
                        />
                      )}
                    </AnimatePresence>
                    
                    <Icon className={cn(
                      "h-4 w-4 mr-2 transition-all duration-300",
                      active ? "text-[hsl(var(--nx-gold))]" : "group-hover:text-[hsl(var(--nx-gold))]"
                    )} />
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Actions de droite avec effets premium */}
            <div className="flex items-center space-x-2">
              {user && (
                <>
                  {/* Sélecteur de langue */}
                  <LanguageSelector variant="ghost" size="sm" showLabel={false} />
                  
                  {/* Centre de notifications */}
                  <div className="relative">
                    <NotificationCenter />
                  </div>
                </>
              )}

              {/* Menu utilisateur */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <ModernButton variant="ghost" className="relative h-9 w-9 rounded-full p-0 ring-2 ring-transparent hover:ring-[hsl(var(--nx-gold))]/30 transition-all duration-300">
                      <Avatar className="h-9 w-9 transition-transform hover:scale-105">
                        <AvatarImage src={profile?.avatar_url || ""} alt={profile?.first_name || "User"} />
                        <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--nx-gold))] to-amber-600 text-[hsl(var(--nx-night))] text-xs font-medium">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[hsl(var(--nx-night))] animate-pulse" />
                    </ModernButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 animate-scale-in bg-[hsl(var(--nx-night))]/95 backdrop-blur-2xl border-white/10">
                    <DropdownMenuLabel className="font-normal p-4">
                      <GlassCard variant="subtle" className="p-3">
                        <div className="flex flex-col space-y-2">
                          <p className="text-sm font-medium leading-none text-white">
                            {profile?.first_name && profile?.last_name 
                              ? `${profile.first_name} ${profile.last_name}`
                              : user.email?.split('@')[0]
                            }
                          </p>
                          <p className="text-xs leading-none text-white/50">
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
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem className="cursor-pointer text-white/70 hover:text-white hover:bg-white/5">
                      <Link to="/profile" className="flex items-center w-full">
                        <User className="mr-2 h-4 w-4" />
                        <span>{t('nav.profile')}</span>
                      </Link>
                    </DropdownMenuItem>
                    {/* NEXUS BLUEPRINT GARDE-FOU */}
                    {isAdmin() && shouldShowAdminLinks(location.pathname) && (
                      <DropdownMenuItem className="cursor-pointer text-white/70 hover:text-white hover:bg-white/5">
                        <Link to="/admin" className="flex items-center w-full">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>{t('nav.admin')}</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('nav.logout')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-3">
                  {/* Bouton Connexion - Ghost Premium */}
                  <ModernButton 
                    variant="ghost" 
                    size="sm" 
                    className="hidden sm:flex text-white/70 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300" 
                    asChild
                  >
                    <Link to="/auth" className="flex items-center">
                      <LogIn className="h-4 w-4 mr-2" />
                      {t('auth.login')}
                    </Link>
                  </ModernButton>
                  
                  {/* Bouton CTA Premium avec Shine Effect */}
                  <Link 
                    to="/auth" 
                    className="relative overflow-hidden group inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-[hsl(var(--nx-gold))] to-amber-500 text-[hsl(var(--nx-night))] font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[hsl(var(--nx-gold))]/30 hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center">
                      {t('nav.start')}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  </Link>
                </div>
              )}

              {/* Bouton menu mobile */}
              <ModernButton
                variant="ghost"
                size="sm"
                className="lg:hidden text-white/70 hover:text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? 
                  <X className="h-5 w-5" /> : 
                  <Menu className="h-5 w-5" />
                }
              </ModernButton>
            </div>
          </div>
        </div>
        
        {/* Breadcrumb avec fade au scroll */}
        <div className={cn(
          "container mx-auto px-4 transition-all duration-500",
          scrolled ? "opacity-0 h-0 py-0 overflow-hidden" : "opacity-100 py-2"
        )}>
          <GlassCard variant="subtle" className="p-2">
            <Breadcrumb />
          </GlassCard>
        </div>
      </header>

      {/* Menu mobile Premium avec glassmorphism */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-0 top-16 bottom-0 bg-[hsl(var(--nx-night))]/95 backdrop-blur-2xl z-40 lg:hidden overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="space-y-2">
                {mainNavigation.map((item, idx) => {
                  const Icon = item.icon;
                  const hasSubmenu = item.submenu && item.submenu.length > 0;
                  const active = item.href ? isActive(item.href) : isInSubmenu(item.submenu);
                  
                  if (hasSubmenu) {
                    return (
                      <motion.div 
                        key={item.id} 
                        className="space-y-1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <div className={cn(
                          "flex items-center px-4 py-3 rounded-xl text-sm font-medium",
                          active ? "text-[hsl(var(--nx-gold))]" : "text-white/60"
                        )}>
                          <Icon className="h-5 w-5 mr-3" />
                          <span className="font-semibold">{item.label}</span>
                        </div>
                        <div className="pl-8 space-y-1">
                          {item.submenu?.map((subItem) => {
                            const SubIcon = subItem.icon;
                            const subActive = isActive(subItem.href);
                            return (
                              <Link
                                key={subItem.href}
                                to={subItem.href}
                                className={cn(
                                  "flex items-center px-4 py-3 rounded-xl text-sm transition-all",
                                  subActive
                                    ? "bg-[hsl(var(--nx-gold))]/20 text-[hsl(var(--nx-gold))]"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                                )}
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <SubIcon className="h-4 w-4 mr-3" />
                                <span>{subItem.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  }
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link
                        to={item.href || '/'}
                        className={cn(
                          "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all",
                          active
                            ? "bg-[hsl(var(--nx-gold))]/20 text-[hsl(var(--nx-gold))]"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        <span>{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Sélecteur de langue mobile */}
              <motion.div 
                className="mt-6 pt-6 border-t border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between px-4">
                  <span className="text-sm font-medium text-white/50">Langue / Language</span>
                  <LanguageSelector variant="outline" size="sm" showLabel={true} />
                </div>
              </motion.div>

              {/* Boutons CTA mobile */}
              {!user && (
                <motion.div 
                  className="mt-6 space-y-3 px-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    to="/auth"
                    className="flex items-center justify-center w-full px-4 py-3 rounded-xl border border-white/20 text-white/80 hover:text-white hover:bg-white/5 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    {t('auth.login')}
                  </Link>
                  <Link
                    to="/auth"
                    className="relative overflow-hidden group flex items-center justify-center w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[hsl(var(--nx-gold))] to-amber-500 text-[hsl(var(--nx-night))] font-semibold transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="relative z-10 flex items-center">
                      {t('nav.start')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Spacer pour compenser le header fixed */}
      <div className="h-16" />
    </>
  );
};

export default ModernHeader;
