import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
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
        "text-foreground hover:bg-accent/10",
        "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      aria-label={label}
      title={label}
      role="switch"
      aria-checked={isDark}
    >
      <div className="relative h-4 w-4">
        {isDark ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </div>
      {showLabel && (
        <span className="text-xs font-medium hidden sm:inline">{label}</span>
      )}
    </button>
  );
}
