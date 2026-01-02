import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRegion: string;
  onRegionChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  regions: string[];
  statuses: string[];
  variant?: 'light' | 'dark';
}

export function ProjectFilters({
  searchTerm,
  onSearchChange,
  selectedRegion,
  onRegionChange,
  selectedStatus,
  onStatusChange,
  regions,
  statuses,
  variant = 'light',
}: ProjectFiltersProps) {
  const isDark = variant === 'dark';
  
  const inputClass = isDark 
    ? "pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[hsl(var(--nx-gold))] focus:ring-[hsl(var(--nx-gold)/0.3)]"
    : "pl-10";
  
  const selectTriggerClass = isDark
    ? "bg-white/10 border-white/20 text-white"
    : "";
    
  const selectContentClass = isDark
    ? "bg-[hsl(var(--nx-deep))] border-white/20 text-white"
    : "";
    
  const selectItemClass = isDark
    ? "focus:bg-white/10"
    : "";

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-white/50' : 'text-muted-foreground'}`} />
        <Input
          placeholder="Rechercher un projet, un pays..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Region filter */}
      <Select value={selectedRegion} onValueChange={onRegionChange}>
        <SelectTrigger className={`w-full sm:w-48 ${selectTriggerClass}`}>
          <SelectValue placeholder="Toutes les régions" />
        </SelectTrigger>
        <SelectContent className={selectContentClass}>
          <SelectItem value="all" className={selectItemClass}>Toutes les régions</SelectItem>
          {regions.map((region) => (
            <SelectItem key={region} value={region} className={selectItemClass}>
              {region}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status filter */}
      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className={`w-full sm:w-40 ${selectTriggerClass}`}>
          <SelectValue placeholder="Tous les statuts" />
        </SelectTrigger>
        <SelectContent className={selectContentClass}>
          <SelectItem value="all" className={selectItemClass}>Tous les statuts</SelectItem>
          {statuses.map((status) => (
            <SelectItem key={status} value={status} className={selectItemClass}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
