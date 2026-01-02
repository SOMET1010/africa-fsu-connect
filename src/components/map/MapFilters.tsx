import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, RotateCcw } from "lucide-react";
import { ActivityLevel } from "./activityData";

export interface MapFiltersState {
  region: string | null;
  activityLevel: ActivityLevel | null;
  period: 'month' | 'quarter' | 'year';
}

interface MapFiltersProps {
  filters: MapFiltersState;
  onFilterChange: (filters: MapFiltersState) => void;
}

const REGIONS = [
  { value: null, label: 'Toutes les régions' },
  { value: 'west', label: 'Afrique de l\'Ouest' },
  { value: 'central', label: 'Afrique Centrale' },
  { value: 'east', label: 'Afrique de l\'Est' },
  { value: 'south', label: 'Afrique Australe' },
  { value: 'north', label: 'Afrique du Nord' },
];

const ACTIVITY_FILTERS = [
  { value: null, label: 'Tous les niveaux' },
  { value: 'high', label: 'Très actif' },
  { value: 'medium', label: 'Actif' },
  { value: 'emerging', label: 'Émergent' },
  { value: 'joining', label: 'En adhésion' },
];

const PERIODS = [
  { value: 'month', label: 'Ce mois' },
  { value: 'quarter', label: '3 derniers mois' },
  { value: 'year', label: 'Cette année' },
];

export const MapFilters = ({ filters, onFilterChange }: MapFiltersProps) => {
  const hasActiveFilters = filters.region !== null || filters.activityLevel !== null || filters.period !== 'month';

  const resetFilters = () => {
    onFilterChange({ region: null, activityLevel: null, period: 'month' });
  };

  const getRegionLabel = () => {
    const found = REGIONS.find(r => r.value === filters.region);
    return found?.label || 'Région';
  };

  const getActivityLabel = () => {
    const found = ACTIVITY_FILTERS.find(a => a.value === filters.activityLevel);
    return found?.label || 'Activité';
  };

  const getPeriodLabel = () => {
    const found = PERIODS.find(p => p.value === filters.period);
    return found?.label || 'Période';
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Region Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant={filters.region ? "default" : "outline"} 
            size="sm" 
            className="gap-1"
          >
            {getRegionLabel()}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup 
            value={filters.region || ''} 
            onValueChange={(value) => onFilterChange({ ...filters, region: value || null })}
          >
            {REGIONS.map((region) => (
              <DropdownMenuRadioItem key={region.label} value={region.value || ''}>
                {region.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Activity Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant={filters.activityLevel ? "default" : "outline"} 
            size="sm" 
            className="gap-1"
          >
            {getActivityLabel()}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup 
            value={filters.activityLevel || ''} 
            onValueChange={(value) => onFilterChange({ 
              ...filters, 
              activityLevel: (value as ActivityLevel) || null 
            })}
          >
            {ACTIVITY_FILTERS.map((activity) => (
              <DropdownMenuRadioItem key={activity.label} value={activity.value || ''}>
                {activity.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Period Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant={filters.period !== 'month' ? "default" : "outline"} 
            size="sm" 
            className="gap-1"
          >
            {getPeriodLabel()}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup 
            value={filters.period} 
            onValueChange={(value) => onFilterChange({ 
              ...filters, 
              period: value as MapFiltersState['period'] 
            })}
          >
            {PERIODS.map((period) => (
              <DropdownMenuRadioItem key={period.value} value={period.value}>
                {period.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetFilters}
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3 w-3" />
          Réinitialiser
        </Button>
      )}
    </div>
  );
};
