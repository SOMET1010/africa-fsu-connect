import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Filter, ChevronDown, X, LayoutGrid, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeIcon, ThemeType } from "@/components/shared/ThemeIllustration";
import { cn } from "@/lib/utils";

interface PracticeFiltersProps {
  filters: {
    theme: string;
    country: string;
    type: string;
  };
  onFiltersChange: (filters: { theme: string; country: string; type: string }) => void;
}

const themeOptions: { value: string; label: string; theme: ThemeType }[] = [
  { value: "all", label: "Tous les thèmes", theme: "Connectivité" },
  { value: "connectivity", label: "Connectivité", theme: "Connectivité" },
  { value: "ehealth", label: "E-Santé", theme: "E-Santé" },
  { value: "education", label: "Éducation", theme: "Éducation" },
  { value: "agriculture", label: "Agriculture", theme: "Agriculture" },
  { value: "governance", label: "Gouvernance", theme: "Gouvernance" },
];

const countryOptions = [
  { value: "all", label: "Tous les pays", flag: "🌍" },
  { value: "ci", label: "Côte d'Ivoire", flag: "🇨🇮" },
  { value: "sn", label: "Sénégal", flag: "🇸🇳" },
  { value: "cm", label: "Cameroun", flag: "🇨🇲" },
  { value: "bf", label: "Burkina Faso", flag: "🇧🇫" },
  { value: "ml", label: "Mali", flag: "🇲🇱" },
];

export function PracticeFilters({ filters, onFiltersChange }: PracticeFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const activeFiltersCount = [filters.theme, filters.country, filters.type].filter(
    (f) => f && f !== "all"
  ).length;

  const handleReset = () => {
    onFiltersChange({ theme: "all", country: "all", type: "all" });
  };

  const handleThemeClick = (value: string) => {
    onFiltersChange({ ...filters, theme: value === filters.theme ? "all" : value });
  };

  return (
    <div className="mb-8">
      {/* Quick theme filters as visual chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {themeOptions.slice(1).map((option) => (
          <motion.button
            key={option.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleThemeClick(option.value)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
              "hover:border-primary/30 hover:bg-primary/5",
              filters.theme === option.value 
                ? "border-primary bg-primary/10 text-primary" 
                : "border-border bg-card"
            )}
          >
            <ThemeIcon theme={option.theme} size={18} />
            <span className="text-sm font-medium">{option.label}</span>
          </motion.button>
        ))}
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtres avancés
                {activeFiltersCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </Button>
            </CollapsibleTrigger>

            <AnimatePresence>
              {activeFiltersCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-muted-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Réinitialiser
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CollapsibleContent className="mt-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 p-4 bg-muted/50 rounded-lg border"
          >
            <Select
              value={filters.theme}
              onValueChange={(value) => onFiltersChange({ ...filters, theme: value })}
            >
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Thème" />
              </SelectTrigger>
              <SelectContent>
                {themeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className="flex items-center gap-2">
                      {option.value !== "all" && <ThemeIcon theme={option.theme} size={16} />}
                      {option.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.country}
              onValueChange={(value) => onFiltersChange({ ...filters, country: value })}
            >
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Pays" />
              </SelectTrigger>
              <SelectContent>
                {countryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className="flex items-center gap-2">
                      <span>{option.flag}</span>
                      {option.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.type}
              onValueChange={(value) => onFiltersChange({ ...filters, type: value })}
            >
              <SelectTrigger className="w-[160px] bg-background">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="project">Projet</SelectItem>
                <SelectItem value="policy">Politique</SelectItem>
                <SelectItem value="partnership">Partenariat</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
