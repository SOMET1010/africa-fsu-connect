
import { Fragment, useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { ModernButton } from "@/components/ui/modern-button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GlassCard } from "@/components/ui/glass-card";
import atuLogo from "@/assets/atu-logo.png";
import { ThemeSwitch } from "@/components/shared/ThemeSwitch";
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import NotificationCenter from "@/components/shared/NotificationCenter";
import { LanguageSelector } from "@/components/shared/LanguageSelector";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/useTranslation";
import { useDirection } from "@/hooks/useDirection";
import { mainNavigation, type NavItem } from "@/config/navigation";
import { shouldShowAdminLinks } from "@/config/blueprintGuards";




const ModernHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const submenuCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [expandedNavGroup, setExpandedNavGroup] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, isAdmin } = useAuth();
  const { preferences, updatePreferences } = useUserPreferences();
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    return () => clearSubmenuCloseTimeout();
  }, []);

  const isActive = (path: string) => location.pathname === path;
  const isInSubmenu = (submenu?: { href: string }[]) => 
    submenu?.some(item => location.pathname === item.href);

  const resolveNavHref = (item: NavItem) => item.href ?? item.submenu?.[0]?.href ?? "/";
  const resolveNavLabel = (item: NavItem) => item.labelKey ? t(item.labelKey) : item.label;
  const isNavActive = (item: NavItem) => {
    if (item.href) return isActive(item.href);
    if (item.submenu) return isInSubmenu(item.submenu);
    return false;
  };

  const clearSubmenuCloseTimeout = () => {
    if (submenuCloseTimeout.current) {
      clearTimeout(submenuCloseTimeout.current);
      submenuCloseTimeout.current = null;
    }
  };

  const scheduleSubmenuClose = (delay = 150) => {
    clearSubmenuCloseTimeout();
    submenuCloseTimeout.current = setTimeout(() => {
      setOpenDropdownId(null);
      submenuCloseTimeout.current = null;
    }, delay);
  };

  const handleSubmenuOpen = (itemId: string) => {
    clearSubmenuCloseTimeout();
    setOpenDropdownId(itemId);
  };

  const handleSubmenuClose = () => {
    clearSubmenuCloseTimeout();
    setOpenDropdownId(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-700 border-red-200/50';
      case 'country_admin': return 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-700 border-blue-200/50';
      case 'editor': return 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-700 border-green-200/50';
      case 'contributor': return 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-700 border-orange-200/50';
      case 'reader': return 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-700 border-gray-200/50';
      default: return 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-700 border-gray-200/50';
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

  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <>
      <header 
        role="banner"
        aria-label={t('accessibility.appHeader') || 'En-tête de l\'application'}
        className={cn(
          "fixed top-0 left-0 right-0 w-full transition-all duration-300 ease-out z-header",
          scrolled 
            ? "bg-background border-b border-border shadow-sm" 
            : "bg-background border-b border-border"
        )}
      >
        <div className="container mx-auto px-4">
          <div className={cn("flex items-center justify-between h-[4.5rem]", isRTL && "flex-row-reverse")}>
            {/* Premium Logo avec animation hover */}
            <Link to="/" className={cn("flex items-center gap-3 group", isRTL && "flex-row-reverse")}> 
              <motion.img
                src={atuLogo}
                alt="UDC logo"
                className="h-10 w-auto"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              />
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-primary font-bold text-xl">UDC</span>
                <span className="text-xs text-muted-foreground tracking-widest uppercase">USF • Universal Digital Connect</span>
              </div>
            </Link>

            {/* Navigation Desktop avec micro-interactions */}
            <nav aria-label={t('accessibility.mainNav') || 'Navigation principale'} className={cn("hidden lg:flex items-center", isRTL ? "space-x-reverse space-x-0.5" : "space-x-0.5")}>
              {mainNavigation.map((item) => {
                const Icon = item.icon;
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                const active = item.href ? isActive(item.href) : isInSubmenu(item.submenu);
                
                // Item avec sous-menu
                if (hasSubmenu) {
                  return (
                    <DropdownMenu
                      key={item.id}
                      open={openDropdownId === item.id}
                      onOpenChange={(isOpen) => {
                        if (isOpen) {
                          handleSubmenuOpen(item.id);
                        } else {
                          handleSubmenuClose();
                        }
                      }}
                    >
                      <DropdownMenuTrigger asChild>
                        <button
                          className={cn(
                          "relative flex items-center px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 group",
                            active
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground",
                            isRTL && "flex-row-reverse"
                          )}
                          onMouseEnter={() => {
                            setHoveredLink(item.id);
                            handleSubmenuOpen(item.id);
                          }}
                          onMouseLeave={() => {
                            setHoveredLink(null);
                            scheduleSubmenuClose();
                          }}
                          aria-label={`${item.labelKey ? t(item.labelKey) : item.label} menu`}
                          aria-haspopup="menu"
                        >
                          {/* Active indicator - simple background */}
                          {(hoveredLink === item.id || active) && (
                            <div className="absolute inset-0 bg-primary/8 rounded-xl -z-10" />
                          )}
                          
                          <Icon className={cn(
                            "h-4 w-4 transition-colors duration-200",
                            isRTL ? "ml-2" : "mr-2",
                            active ? "text-primary" : "group-hover:text-primary"
                          )} />
                          <span className="relative z-10">{item.labelKey ? t(item.labelKey) : item.label}</span>
                          <ChevronDown className={cn(
                            "h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180",
                            isRTL ? "mr-1" : "ml-1"
                          )} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align={isRTL ? "end" : "start"} 
                        className="w-64 animate-scale-in bg-popover border-border p-2"
                        onMouseEnter={() => handleSubmenuOpen(item.id)}
                        onMouseLeave={() => scheduleSubmenuClose()}
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
                                    ? "bg-primary/10 text-primary" 
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                  isRTL && "flex-row-reverse"
                                )}
                              >
                                <div className={cn(
                                  "p-2 rounded-lg shrink-0",
                                  subActive ? "bg-primary/15" : "bg-muted"
                                )}>
                                  <SubIcon className="h-4 w-4" />
                                </div>
                                <div className={cn("flex flex-col min-w-0", isRTL && "text-right")}>
                                  <span className="font-medium text-sm">
                                    {subItem.labelKey ? t(subItem.labelKey) : subItem.label}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {subItem.descriptionKey ? t(subItem.descriptionKey) : subItem.description}
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
                      "relative flex items-center px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 group",
                      active
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground",
                      isRTL && "flex-row-reverse"
                    )}
                    onMouseEnter={() => setHoveredLink(item.id)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {(hoveredLink === item.id || active) && (
                      <div className="absolute inset-0 bg-primary/8 rounded-xl -z-10" />
                    )}
                    
                    <Icon className={cn(
                      "h-4 w-4 transition-colors duration-200",
                      isRTL ? "ml-2" : "mr-2",
                      active ? "text-primary" : "group-hover:text-primary"
                    )} />
                    <span className="relative z-10">{item.labelKey ? t(item.labelKey) : item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Actions de droite avec effets premium */}
            <div className={cn("flex items-center", isRTL ? "space-x-reverse space-x-3" : "space-x-3")}>
              {/* Theme Toggle */}
              <ThemeSwitch />

              {/* Sélecteur de langue - visible pour TOUS les utilisateurs */}
              <div data-tour="user-lang-selector">
                <LanguageSelector variant="ghost" size="sm" showLabel={false} />
              </div>
              
              {user && (
                <>
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
                    <ModernButton 
                      variant="ghost" 
                      className="relative h-9 w-9 rounded-full p-0 ring-2 ring-transparent hover:ring-primary/30 transition-all duration-200"
                      aria-label="User menu"
                      aria-haspopup="menu"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={profile?.avatar_url || ""} alt={profile?.first_name || "User avatar"} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "absolute -bottom-1 w-3 h-3 bg-success rounded-full border-2 border-background",
                        isRTL ? "-left-1" : "-right-1"
                      )} aria-hidden="true" />
                    </ModernButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-[23rem] max-h-[76vh] animate-scale-in bg-white border border-slate-200 shadow-[0_10px_40px_rgba(15,23,42,0.25)] rounded-[32px] p-0 overflow-hidden">
                    <div className="px-5 py-4">
                      <div className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-2">
                        <p className="text-sm font-semibold text-slate-900">
                          {profile?.first_name && profile?.last_name 
                            ? `${profile.first_name} ${profile.last_name}`
                            : user.email?.split('@')[0]
                          }
                        </p>
                        <p className="text-xs text-slate-500">
                          {user.email}
                        </p>
                        {profile?.role && (
                          <span className={cn(
                            "inline-flex mt-2 items-center rounded-full px-2 py-0.5 text-[0.65rem] font-semibold tracking-widest uppercase",
                            getRoleColor(profile.role)
                          )}>
                            {getRoleLabel(profile.role)}
                          </span>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator className="mx-5" />
                    <div className="space-y-2 px-5 pb-3">
                      <DropdownMenuItem className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50">
                        <User className="h-4 w-4 text-slate-500" />
                        <span>{t('nav.profile')}</span>
                      </DropdownMenuItem>
                      {isAdmin() && shouldShowAdminLinks(location.pathname) && (
                        <DropdownMenuItem className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50">
                          <Settings className="h-4 w-4 text-slate-500" />
                          <span>{t('nav.admin')}</span>
                        </DropdownMenuItem>
                      )}
                    </div>
                    <DropdownMenuSeparator className="mx-5" />
                    <div className="px-5 pb-4">
                      <p className="text-[0.6rem] font-semibold tracking-[0.4em] text-slate-400 uppercase mb-2">Explorer</p>
                    <Accordion
                      type="single"
                      collapsible
                      className="space-y-2"
                      value={expandedNavGroup ?? undefined}
                      onValueChange={(value) => setExpandedNavGroup(value ?? null)}
                    >
                        {mainNavigation.map((item) => {
                          const Icon = item.icon;
                          const hasSubmenu = Boolean(item.submenu?.length);
                          const active = isNavActive(item);
                          return (
                            <Fragment key={item.id ?? item.label}>
                              {hasSubmenu ? (
                                <AccordionItem value={item.id} className="rounded-2xl border border-slate-200 bg-slate-100">
                                  <AccordionTrigger
                                    className={cn(
                                      "flex items-center justify-between gap-3 px-4 py-3 text-[0.7rem] font-semibold tracking-[0.4em] uppercase",
                                      active ? "text-primary" : "text-slate-600"
                                    )}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Icon className="h-4 w-4" />
                                      <span>{resolveNavLabel(item)}</span>
                                    </div>
                                </AccordionTrigger>
                                  <AccordionContent className="px-2 pb-3 pt-0">
                                    <div className="space-y-2">
                                      {item.submenu?.map((subItem) => {
                                        const subActive = isActive(subItem.href);
                                        const SubIcon = subItem.icon;
                                        return (
                                          <Link
                                            key={subItem.href}
                                            to={subItem.href}
                                            className={cn(
                                              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition duration-150",
                                              subActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-slate-600 hover:bg-slate-100 hover:text-foreground",
                                              isRTL && "flex-row-reverse"
                                            )}
                                          >
                                            <SubIcon className="h-4 w-4 text-slate-500 shrink-0" />
                                            <div className="flex flex-col leading-tight">
                                              <span className="text-sm font-semibold text-slate-900">
                                                {subItem.labelKey ? t(subItem.labelKey) : subItem.label}
                                              </span>
                                              <span className="text-[0.65rem] text-slate-500">
                                                {subItem.descriptionKey ? t(subItem.descriptionKey) : subItem.description}
                                              </span>
                                            </div>
                                          </Link>
                                        );
                                      })}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              ) : (
                                <Link
                                  key={item.id ?? item.label}
                                  to={resolveNavHref(item)}
                                  className={cn(
                                    "flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 uppercase tracking-[0.3em] transition hover:border-slate-300 hover:bg-white hover:text-foreground",
                                    active ? "border-primary/70 bg-white text-primary" : "",
                                    isRTL && "flex-row-reverse"
                                  )}
                                >
                                  <Icon className="h-4 w-4 text-slate-500" />
                                  <span>{resolveNavLabel(item)}</span>
                                </Link>
                              )}
                            </Fragment>
                          );
                        })}
                      </Accordion>
                    </div>
                    <DropdownMenuSeparator className="mx-5" />
                    <div className="px-5 pb-4">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 text-destructive font-semibold text-sm text-left w-full rounded-xl px-4 py-3 hover:bg-slate-50"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{t('nav.logout')}</span>
                      </button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className={cn("flex items-center", isRTL ? "space-x-reverse space-x-3" : "space-x-3")}>
                  {/* Bouton Connexion - Ghost Premium */}
                  <ModernButton 
                    variant="ghost" 
                    size="sm" 
                    className={cn(
                      "hidden sm:flex text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border transition-all duration-200",
                      isRTL && "flex-row-reverse"
                    )} 
                    asChild
                  >
                    <Link to="/auth" className={cn("flex items-center", isRTL && "flex-row-reverse")}>
                      <LogIn className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                      {t('auth.login')}
                    </Link>
                  </ModernButton>
                  
                  {/* Bouton CTA Premium avec Shine Effect */}
                  <Link 
                    to="/auth" 
                    className={cn(
                      "relative overflow-hidden group inline-flex items-center px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all duration-200 hover:bg-primary-dark",
                      isRTL && "flex-row-reverse"
                    )}
                  >
                    <span className={cn("relative z-10 flex items-center", isRTL && "flex-row-reverse")}>
                      {t('nav.start')}
                      <ArrowRight className={cn(
                        "h-4 w-4 transition-transform",
                        isRTL 
                          ? "mr-2 rotate-180 group-hover:-translate-x-1" 
                          : "ml-2 group-hover:translate-x-1"
                      )} />
                    </span>
                    
                    {/* Removed shine effect */}
                  </Link>
                </div>
              )}

              {/* Bouton menu mobile */}
              <ModernButton
                variant="ghost"
                size="sm"
                className="lg:hidden text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? (t('accessibility.closeMenu') || 'Fermer le menu') : (t('accessibility.openMenu') || 'Ouvrir le menu')}
                aria-expanded={isMenuOpen}
                aria-controls="modern-mobile-nav"
              >
                {isMenuOpen ? 
                  <X className="h-5 w-5" aria-hidden="true" /> : 
                  <Menu className="h-5 w-5" aria-hidden="true" />
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
          <GlassCard variant="subtle" className="p-2 bg-muted/50 border-border">
            <Breadcrumb />
          </GlassCard>
        </div>
      </header>

      {/* Menu mobile Premium avec glassmorphism - RTL-aware animations */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-0 top-16 bottom-0 bg-background z-40 lg:hidden overflow-y-auto border-t border-border"
            id="modern-mobile-nav"
            role="navigation"
            aria-label={t('accessibility.mobileNav') || 'Navigation mobile'}
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
                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <div className={cn(
                          "flex items-center px-4 py-3 rounded-xl text-sm font-medium",
                          active ? "text-primary" : "text-muted-foreground",
                          isRTL && "flex-row-reverse"
                        )}>
                          <Icon className={cn("h-5 w-5", isRTL ? "ml-3" : "mr-3")} />
                          <span className="font-semibold">{item.label}</span>
                        </div>
                        <div className={isRTL ? "pr-8 space-y-1" : "pl-8 space-y-1"}>
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
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                                  isRTL && "flex-row-reverse"
                                )}
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <SubIcon className={cn("h-4 w-4", isRTL ? "ml-3" : "mr-3")} />
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
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link
                        to={item.href || '/'}
                        className={cn(
                          "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted",
                          isRTL && "flex-row-reverse"
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon className={cn("h-5 w-5", isRTL ? "ml-3" : "mr-3")} />
                        <span>{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Sélecteur de langue mobile */}
              <motion.div 
                className="mt-6 pt-6 border-t border-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className={cn("flex items-center justify-between px-4", isRTL && "flex-row-reverse")}>
                  <span className="text-sm font-medium text-muted-foreground">Langue / Language</span>
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
                    className={cn(
                      "flex items-center justify-center w-full px-4 py-3 rounded-xl border border-border text-foreground hover:bg-muted transition-all",
                      isRTL && "flex-row-reverse"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                    {t('auth.login')}
                  </Link>
                  <Link
                    to="/auth"
                    className={cn(
                      "relative overflow-hidden group flex items-center justify-center w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold transition-all",
                      isRTL && "flex-row-reverse"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className={cn("relative z-10 flex items-center", isRTL && "flex-row-reverse")}>
                      {t('nav.start')}
                      <ArrowRight className={cn(
                        "h-4 w-4",
                        isRTL ? "mr-2 rotate-180" : "ml-2"
                      )} />
                    </span>
                    {/* Removed shine effect */}
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
