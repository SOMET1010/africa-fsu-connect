import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const THEMES = [
  { value: "connectivity", label: "Connectivité" },
  { value: "education", label: "Éducation" },
  { value: "health", label: "Santé" },
  { value: "agriculture", label: "Agriculture" },
  { value: "governance", label: "Gouvernance" },
] as const;

export const STATUSES = [
  { value: "active", label: "En cours" },
  { value: "completed", label: "Terminé" },
  { value: "planned", label: "Planifié" },
] as const;

export const COUNTRIES = [
  "Côte d'Ivoire", "Ghana", "Sénégal", "Mali", "Burkina Faso",
  "Kenya", "Tanzanie", "Ouganda", "Cameroun", "Niger",
  "Togo", "Bénin", "Rwanda", "RDC", "Madagascar",
] as const;

interface CrossBorderFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  country: string;
  onCountryChange: (v: string) => void;
  theme: string;
  onThemeChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  onClear: () => void;
}

export function CrossBorderFilters({
  search, onSearchChange,
  country, onCountryChange,
  theme, onThemeChange,
  status, onStatusChange,
  onClear,
}: CrossBorderFiltersProps) {
  const hasFilters = search || country || theme || status;

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un projet..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-[hsl(var(--nx-night)/0.6)] border-[hsl(var(--nx-border))] text-white placeholder:text-[hsl(var(--nx-text-500))]"
        />
      </div>

      <Select value={country} onValueChange={onCountryChange}>
        <SelectTrigger className="w-[180px] bg-[hsl(var(--nx-night)/0.6)] border-[hsl(var(--nx-border))] text-white">
          <SelectValue placeholder="Pays" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les pays</SelectItem>
          {COUNTRIES.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={theme} onValueChange={onThemeChange}>
        <SelectTrigger className="w-[180px] bg-[hsl(var(--nx-night)/0.6)] border-[hsl(var(--nx-border))] text-white">
          <SelectValue placeholder="Thème" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les thèmes</SelectItem>
          {THEMES.map((t) => (
            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[160px] bg-[hsl(var(--nx-night)/0.6)] border-[hsl(var(--nx-border))] text-white">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear} className="text-[hsl(var(--nx-text-500))] hover:text-white">
          <X className="h-4 w-4 mr-1" /> Effacer
        </Button>
      )}
    </div>
  );
}
