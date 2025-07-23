
import { useState } from "react";
import { Search, Filter, Calendar, MapPin, Users, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface EventFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  onlyRegistered: boolean;
  onRegisteredChange: (registered: boolean) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const EventFilters = ({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedDate,
  onDateChange,
  selectedLocation,
  onLocationChange,
  onlyRegistered,
  onRegisteredChange,
  onClearFilters,
  hasActiveFilters
}: EventFiltersProps) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const eventTypes = [
    { value: "all", label: "Tous les types" },
    { value: "conference", label: "Conférence" },
    { value: "webinaire", label: "Webinaire" },
    { value: "workshop", label: "Workshop" },
    { value: "formation", label: "Formation" },
    { value: "deadline", label: "Deadline" }
  ];

  const locations = [
    { value: "all", label: "Toutes les locations" },
    { value: "online", label: "En ligne" },
    { value: "abidjan", label: "Abidjan" },
    { value: "dakar", label: "Dakar" },
    { value: "bamako", label: "Bamako" },
    { value: "ouagadougou", label: "Ouagadougou" }
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher des événements..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 h-12 text-base"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-3">
        {/* Type Filter */}
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-auto min-w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {eventTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Filter */}
        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : "Sélectionner une date"}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate || undefined}
              onSelect={(date) => {
                onDateChange(date || null);
                setIsDatePickerOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Location Filter */}
        <Select value={selectedLocation} onValueChange={onLocationChange}>
          <SelectTrigger className="w-auto min-w-48">
            <MapPin className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.value} value={location.value}>
                {location.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Registered Events Toggle */}
        <Button
          variant={onlyRegistered ? "default" : "outline"}
          onClick={() => onRegisteredChange(!onlyRegistered)}
          className="flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          Mes événements
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="flex items-center gap-2 text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4" />
            Effacer les filtres
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Recherche: {searchTerm}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onSearchChange("")}
              />
            </Badge>
          )}
          {selectedType !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Type: {eventTypes.find(t => t.value === selectedType)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onTypeChange("all")}
              />
            </Badge>
          )}
          {selectedDate && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Date: {format(selectedDate, "dd/MM/yyyy")}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onDateChange(null)}
              />
            </Badge>
          )}
          {selectedLocation !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Lieu: {locations.find(l => l.value === selectedLocation)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onLocationChange("all")}
              />
            </Badge>
          )}
          {onlyRegistered && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Mes événements
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onRegisteredChange(false)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
