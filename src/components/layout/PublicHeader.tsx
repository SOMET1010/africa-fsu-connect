import React, { Fragment, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu, X, User, LogOut, ChevronDown,
  Home, Map, BookOpen, MessageSquare, GraduationCap, Calendar, Rss, FileText, Video, Users
} from "lucide-react";
import atuLogo from "@/assets/atu-logo.png";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LanguageSelector } from "@/components/shared/LanguageSelector";
import { ThemeSwitch } from "@/components/shared/ThemeSwitch";
import { useTranslation } from "@/hooks/useTranslation";
import { useDirection } from "@/hooks/useDirection";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { mainNavigation, type NavItem } from "@/config/navigation";

export const PublicHeader = () => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { getNavItems, getNavLabel } = useSiteConfig();
  const { user, profile, signOut } = useAuth();
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const headerItems = getNavItems("header", null);

  const isActivePath = (path?: string) => path ? location.pathname === path : false;
  /*const isNavActive = (item: NavItem) => {
    if (item.href) return isActivePath(item.href);
    return item.submenu?.some((sub) => isActivePath(sub.href)) ?? false;
  };*/

  const resolveNavLabel = (item: NavItem) => item.labelKey ? t(item.labelKey) : item.label;

  // Submenu definitions based on header items
  const submenuConfig: Record<string, Array<{ label: string; labelKey?: string; href: string; description: string; icon: any }>> = {
    '/': [
      { label: 'Vue d\'ensemble', href: '/', description: 'Vue d\'ensemble dynamique', icon: Home },
      { label: 'Mot des autorités', href: '/about', description: 'Mot de la DG ANSUT et du SG UAT', icon: Users },
    ],
    '/projects': [
      { label: 'Carte Interactive', href: '/map', description: 'Par région/pays/statut', icon: Map },
      { label: 'Liste des Projets', href: '/projects', description: 'Fiches normalisées', icon: FileText },
      { label: 'Soumettre un Projet', href: '/submit', description: 'Formulaire', icon: FileText },
      { label: 'Mes Projets', href: '/my-contributions', description: 'Suivi personnel', icon: FileText },
    ],
    '/resources': [
      { label: 'Bibliothèque', href: '/resources', description: 'Guides, Rapports, Bulletins', icon: BookOpen },
      { label: 'Politiques & Cadres', href: '/strategies', description: 'Documents réglementaires', icon: FileText },
      { label: 'Modèles & Formulaires', href: '/agency-documents', description: 'Téléchargement', icon: FileText },
    ],
    '/forum': [
      { label: 'Forum de Discussion', href: '/forum', description: 'Thématiques', icon: MessageSquare },
      { label: 'Annuaire', href: '/members', description: 'Agences & Points Focaux', icon: Users },
      { label: 'Co-rédaction', href: '/coauthoring', description: 'Espace collaboratif', icon: FileText },
    ],
    '/elearning': [
      { label: 'Catalogue', href: '/catalog', description: 'Webinaires & Sessions', icon: GraduationCap },
      { label: 'E-Learning', href: '/elearning', description: 'Modules en différé', icon: Video },
      { label: 'Mes Inscriptions', href: '/registrations-elearning', description: 'Suivi', icon: Calendar },
    ],
    '/events': [
      { label: 'Calendrier', href: '/events', description: 'Événements & Deadlines', icon: Calendar },
      { label: 'CMDT-25', href: '/events?cmdt25=true', description: 'Section dédiée & échéances', icon: Calendar },
    ],
    '/watch': [
      { label: 'Actualités', href: '/watch', description: 'News FSU/TIC', icon: Rss },
      { label: 'Flux RSS', href: '/watch', description: 'UIT, Smart Africa, UA', icon: Rss },
    ],
  };

  const hasSubmenu = (href: string) => submenuConfig[href]?.length > 0;

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-card border-b border-border shadow-sm" role="banner" aria-label={t('accessibility.publicHeader') || 'En-tête du site public'}>
      <div className="container mx-auto px-4">
        <div className={cn("flex items-center justify-between h-16", isRTL && "flex-row-reverse")}>
          {/* Logo */}
          <Link to="/" className={cn("flex items-center gap-3 shrink-0", isRTL && "flex-row-reverse")}>
            <img src={atuLogo} alt="ATU - African Telecommunications Union" className="h-9 w-auto" />
            <div className="border-l border-border h-7" />
            <div className={cn("flex flex-col", isRTL && "items-end")}>
              <span className="text-base font-bold tracking-tight text-[hsl(222_47%_11%)] dark:text-foreground leading-tight">USF Digital Connect</span>
              <span className="text-[10px] font-medium text-[hsl(215_20%_40%)] dark:text-muted-foreground uppercase tracking-widest leading-tight">Africa</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label={t('accessibility.mainNav') || 'Navigation principale'} className={cn("hidden xl:flex items-center gap-0.5 relative", isRTL && "flex-row-reverse")}>
            {headerItems.map((item) => {
              const isActive = location.pathname === item.href;
                const itemHasSubmenu = headerItems.filter(person => { person.parent === null });//hasSubmenu(item.href);

                /*const itemHasSubmenu = headerItems.filter(itemMenu => {
                    return itemMenu.parent === null;
                });*/

              console.log("item--->" + item);
              return (
                <div key={item.href} className="relative group">
                  {itemHasSubmenu ? (
                    <button
                      className={cn(
                        "flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                        isActive
                          ? "sarus text-primary bg-primary/10 font-semibold"
                          : "sarus2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800"
                      )}
                    >
                      {getNavLabel(item)}
                      <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      target={item.is_external ? "_blank" : undefined}
                      rel={item.is_external ? "noopener noreferrer" : undefined}
                      className={cn(
                        "sarus3 block px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                        isActive
                          ? "text-primary bg-primary/10 font-semibold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800"
                      )}
                    >
                      {getNavLabel(item)}
                    </Link>
                  )}



                  {/* Submenu Dropdown */}
                  {itemHasSubmenu && (
                    <div className="absolute left-0 top-full mt-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999] min-w-[320px]">
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl py-1 overflow-hidden">
                        {submenuConfig[item.href]?.map((subItem, index) => {
                          const SubIcon = subItem.icon;
                          const subActive = isActivePath(subItem.href);
                          return (
                            <Link
                              key={subItem.href}
                              to={subItem.href}
                              className={cn(
                                "flex items-center gap-4 px-4 py-3.5 text-sm transition-all duration-150",
                                subActive
                                  ? "bg-primary text-white"
                                  : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800",
                                index > 0 && "border-t border-slate-100 dark:border-slate-800"
                              )}
                            >
                              <div className="flex-shrink-0 bg-slate-100 dark:bg-slate-700 rounded-xl p-2.5">
                                <SubIcon className="h-5 w-5 text-primary dark:text-primary" />
                              </div>
                              <div className="flex flex-col leading-tight flex-1 min-w-0">
                                <span className="font-semibold text-slate-900 dark:text-slate-100 text-base">{subItem.label}</span>
                                <span className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">{subItem.description}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right side */}
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <ThemeSwitch />
            <LanguageSelector variant="ghost" size="sm" showLabel={true} />
            {!user ? (
              <>
                <Button asChild variant="ghost" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground hover:bg-muted text-sm">
                  <Link to="/auth">{t("common.login") || t("home.hero.cta.login")}</Link>
                </Button>
                <Button asChild className="hidden sm:inline-flex bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
                  <Link to="/auth?tab=signup">{t("common.register") || t("home.hero.cta.signup")}</Link>
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative h-10 w-10 rounded-full border border-border bg-white shadow-sm flex items-center justify-center transition hover:border-primary/50">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile?.avatar_url || ""} alt={profile?.first_name || "User avatar"} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                        {profile?.first_name && profile?.last_name
                          ? `${profile.first_name[0]}${profile.last_name[0]}`
                          : user.email?.[0]?.toUpperCase() || "U"
                        }
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 bg-white border border-border shadow-lg p-0 overflow-hidden">
                  <div className="px-5 py-4">
                    <p className="text-sm font-semibold text-foreground">
                      {profile?.first_name && profile?.last_name
                        ? `${profile.first_name} ${profile.last_name}`
                        : user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator className="mx-4" />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-slate-50">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{t('nav.profile')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="mx-4" />
                  <div className="px-5 pb-4 pt-2">
                    <p className="text-[0.65rem] font-semibold tracking-[0.4em] uppercase text-slate-400 mb-2">
                      Explorer
                    </p>
                    <Accordion
                      type="single"
                      collapsible
                      className="space-y-2"
                      value={expandedGroup ?? undefined}
                      onValueChange={(value) => setExpandedGroup(value ?? null)}
                    >
                      {mainNavigation.map((item) => {
                        const Icon = item.icon;
                        const hasSubmenu = Boolean(item.submenu?.length);
                          const active = true; //isNavActive(item);
                        return (
                          <Fragment key={item.id ?? item.label}>
                            {hasSubmenu ? (
                              <AccordionItem value={item.id} className="rounded-2xl border border-slate-200 bg-slate-50">
                                <AccordionTrigger
                                  className={cn(
                                    "flex items-center justify-between gap-3 px-4 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.4em]",
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
                                      const subActive = isActivePath(subItem.href);
                                      const SubIcon = subItem.icon;
                                      return (
                                        <Link
                                          key={subItem.href}
                                          to={subItem.href}
                                          className={cn(
                                            "flex items-center gap-3 rounded-xl px-3 py-2 transition text-sm",
                                            subActive
                                              ? "bg-primary text-white"
                                              : "text-slate-600 hover:bg-white hover:text-foreground",
                                            isRTL && "flex-row-reverse"
                                          )}
                                        >
                                          <SubIcon className="h-4 w-4 text-slate-500" />
                                          <div className="flex flex-col leading-tight">
                                            <span className="font-medium text-slate-900">
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
                                to={item.href ?? "/"}
                                className={cn(
                                  "flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em]",
                                  active ? "border-primary/60 bg-white text-primary" : "text-slate-600 hover:border-slate-300 hover:bg-white hover:text-foreground"
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
                  <DropdownMenuSeparator className="mx-4" />
                  <DropdownMenuItem onClick={async () => { await signOut(); navigate('/'); }} className="flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-slate-50">
                    <LogOut className="h-4 w-4" />
                    <span>{t('nav.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? (t('accessibility.closeMenu') || 'Fermer le menu') : (t('accessibility.openMenu') || 'Ouvrir le menu')}
              aria-expanded={mobileOpen}
              aria-controls="public-mobile-nav"
            >
              {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden border-t border-border overflow-hidden bg-white dark:bg-card"
          >
            <nav id="public-mobile-nav" aria-label={t('accessibility.mobileNav') || 'Navigation mobile'} className="container mx-auto px-4 py-4 space-y-1">
              {headerItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    target={item.is_external ? "_blank" : undefined}
                    rel={item.is_external ? "noopener noreferrer" : undefined}
                    className={cn(
                      "flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary bg-primary/10 font-semibold border-l-4 border-primary"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800",
                      isRTL && "border-l-0 border-r-4"
                    )}
                  >
                    {getNavLabel(item)}
                  </Link>
                );
              })}
              {!user && (
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button asChild variant="ghost" className="flex-1 text-muted-foreground hover:text-foreground">
                    <Link to="/auth" onClick={() => setMobileOpen(false)}>{t("common.login") || "Connexion"}</Link>
                  </Button>
                  <Button asChild className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link to="/auth?tab=signup" onClick={() => setMobileOpen(false)}>{t("common.register") || "S'inscrire"}</Link>
                  </Button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
