import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

interface ThemeSwitchProps {
  showLabel?: boolean;
  className?: string;
}

export function ThemeSwitch({ showLabel = false, className }: ThemeSwitchProps) {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const isDark = theme === "dark";
  const label = isDark ? (t("common.lightMode") || "Mode clair") : (t("common.darkMode") || "Mode sombre");

  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <button
      onClick={toggle}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-border bg-muted px-2.5 py-1.5",
        "text-muted-foreground hover:text-foreground hover:bg-accent/10",
        "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      aria-label={label}
      title={label}
      role="switch"
      aria-checked={isDark}
    >
      <div className="relative h-4 w-4">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <Moon className="h-4 w-4" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <Sun className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {showLabel && (
        <span className="text-xs font-medium hidden sm:inline">{label}</span>
      )}
    </button>
  );
}
