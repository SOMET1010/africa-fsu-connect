import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import atuLogo from "@/assets/atu-logo.png";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/shared/LanguageSelector";
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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[hsl(var(--nx-night))]/80 border-b border-[hsl(var(--nx-gold))]/10">
      <div className="container mx-auto px-4">
        <div className={cn("flex items-center justify-between h-16", isRTL && "flex-row-reverse")}>
          {/* Logo */}
          <Link to="/" className={cn("flex items-center gap-3 shrink-0", isRTL && "flex-row-reverse")}>
            <img src={atuLogo} alt="ATU - African Telecommunications Union" className="h-12 w-auto" />
            <span className="text-lg font-bold text-white">UDC</span>
            <span className="hidden xl:inline text-xs text-white/80 font-medium">| Digital Connect Africa</span>
          </Link>

          {/* Desktop Nav */}
          <nav className={cn("hidden lg:flex items-center gap-1", isRTL && "flex-row-reverse")}>
            {headerItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  target={item.is_external ? "_blank" : undefined}
                  rel={item.is_external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "text-[hsl(var(--nx-gold))] bg-[hsl(var(--nx-gold))]/10"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  )}
                >
                  {getNavLabel(item)}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <LanguageSelector variant="ghost" size="sm" showLabel={true} />
            <Button asChild variant="ghost" className="hidden sm:inline-flex text-white/70 hover:text-white hover:bg-white/10 text-sm">
              <Link to="/auth">{t("common.login") || "Connexion"}</Link>
            </Button>
            <Button asChild className="hidden sm:inline-flex bg-[hsl(var(--nx-gold))]/10 text-[hsl(var(--nx-gold))] hover:bg-[hsl(var(--nx-gold))]/20 border border-[hsl(var(--nx-gold))]/30 text-sm">
              <Link to="/auth?tab=signup">{t("common.register") || "S'inscrire"}</Link>
            </Button>

            {/* Mobile toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white/70 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
            className="lg:hidden border-t border-white/10 overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-4 space-y-1">
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
                        ? "text-[hsl(var(--nx-gold))] bg-[hsl(var(--nx-gold))]/10"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {getNavLabel(item)}
                  </Link>
                );
              })}
              <div className="flex gap-2 pt-3 border-t border-white/10">
                <Button asChild variant="ghost" className="flex-1 text-white/70 hover:text-white">
                  <Link to="/auth" onClick={() => setMobileOpen(false)}>{t("common.login") || "Connexion"}</Link>
                </Button>
                <Button asChild className="flex-1 bg-[hsl(var(--nx-gold))]/10 text-[hsl(var(--nx-gold))] border border-[hsl(var(--nx-gold))]/30">
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
