import { Sun, Moon } from "lucide-react";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function HomeLayoutToggle() {
  const { preferences, updatePreferences } = useUserPreferences();
  const isImmersive = preferences.homeLayout === 'immersive';

  const toggle = () => {
    updatePreferences({ homeLayout: isImmersive ? 'light' : 'immersive' });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={toggle}
            className={cn(
              "fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300",
              "border backdrop-blur-sm",
              isImmersive
                ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                : "bg-[hsl(var(--nx-surface))] border-[hsl(var(--nx-border))] text-[hsl(var(--nx-text-700))] hover:bg-[hsl(var(--nx-border))]"
            )}
            aria-label={isImmersive ? "Passer en mode clair" : "Passer en mode immersif"}
          >
            {isImmersive ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{isImmersive ? "Mode clair" : "Mode immersif"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
