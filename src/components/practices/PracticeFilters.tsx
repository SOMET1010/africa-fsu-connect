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
import { Filter, ChevronDown, X } from "lucide-react";

interface PracticeFiltersProps {
  filters: {
    theme: string;
    country: string;
    type: string;
  };
  onFiltersChange: (filters: { theme: string; country: string; type: string }) => void;
}

export function PracticeFilters({ filters, onFiltersChange }: PracticeFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount = [filters.theme, filters.country, filters.type].filter(
    (f) => f && f !== "all"
  ).length;

  const handleReset = () => {
    onFiltersChange({ theme: "all", country: "all", type: "all" });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-6">
      <div className="flex items-center gap-2">
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtrer
            {activeFiltersCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </Button>
        </CollapsibleTrigger>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Réinitialiser
          </Button>
        )}
      </div>

      <CollapsibleContent className="mt-4">
        <div className="flex flex-wrap gap-3 p-4 bg-muted/50 rounded-lg">
          <Select
            value={filters.theme}
            onValueChange={(value) => onFiltersChange({ ...filters, theme: value })}
          >
            <SelectTrigger className="w-[160px] bg-background">
              <SelectValue placeholder="Thème" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les thèmes</SelectItem>
              <SelectItem value="connectivity">Connectivité</SelectItem>
              <SelectItem value="ehealth">E-Santé</SelectItem>
              <SelectItem value="education">Éducation</SelectItem>
              <SelectItem value="agriculture">Agriculture</SelectItem>
              <SelectItem value="governance">Gouvernance</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.country}
            onValueChange={(value) => onFiltersChange({ ...filters, country: value })}
          >
            <SelectTrigger className="w-[160px] bg-background">
              <SelectValue placeholder="Pays" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les pays</SelectItem>
              <SelectItem value="ci">Côte d'Ivoire</SelectItem>
              <SelectItem value="sn">Sénégal</SelectItem>
              <SelectItem value="cm">Cameroun</SelectItem>
              <SelectItem value="bf">Burkina Faso</SelectItem>
              <SelectItem value="ml">Mali</SelectItem>
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
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
