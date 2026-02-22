import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import atuLogo from "@/assets/atu-logo.png";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/shared/LanguageSelector";
import { ThemeSwitch } from "@/components/shared/ThemeSwitch";
import { useTranslation } from "@/hooks/useTranslation";
import { useDirection } from "@/hooks/useDirection";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export const PublicHeader = () => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { getNavItems, getNavLabel } = useSiteConfig();

  const headerItems = getNavItems("header");

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
          <nav aria-label={t('accessibility.mainNav') || 'Navigation principale'} className={cn("hidden lg:flex items-center gap-0.5", isRTL && "flex-row-reverse")}>
            {headerItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  target={item.is_external ? "_blank" : undefined}
                  rel={item.is_external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {getNavLabel(item)}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <ThemeSwitch />
            <LanguageSelector variant="ghost" size="sm" showLabel={true} />
            <Button asChild variant="ghost" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground hover:bg-muted text-sm">
              <Link to="/auth">{t("common.login") || "Connexion"}</Link>
            </Button>
            <Button asChild className="hidden sm:inline-flex bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
              <Link to="/auth?tab=signup">{t("common.register") || "S'inscrire"}</Link>
            </Button>

            {/* Mobile toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground hover:text-foreground"
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
            className="lg:hidden border-t border-border overflow-hidden"
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
                      "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {getNavLabel(item)}
                  </Link>
                );
              })}
              <div className="flex gap-2 pt-3 border-t border-border">
                <Button asChild variant="ghost" className="flex-1 text-muted-foreground hover:text-foreground">
                  <Link to="/auth" onClick={() => setMobileOpen(false)}>{t("common.login") || "Connexion"}</Link>
                </Button>
                <Button asChild className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link to="/auth?tab=signup" onClick={() => setMobileOpen(false)}>{t("common.register") || "S'inscrire"}</Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
