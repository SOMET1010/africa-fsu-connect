
import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FilterOption {
  id: string;
  label: string;
  options: Array<{ value: string; label: string }>;
}

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string, filters: Record<string, string>) => void;
  filters?: FilterOption[];
  className?: string;
  showFilters?: boolean;
}

const SearchBar = ({
  placeholder = "Rechercher...",
  onSearch,
  filters = [],
  className = "",
  showFilters = true
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Optimisation : éviter les appels répétés avec les mêmes paramètres
  const memoizedOnSearch = useCallback((query: string, filtersObj: Record<string, string>) => {
    onSearch?.(query, filtersObj);
  }, [onSearch]);

  // Debounced search avec protection contre les doubles appels
  useEffect(() => {
    const timer = setTimeout(() => {
      memoizedOnSearch(searchQuery, activeFilters);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, activeFilters, memoizedOnSearch]);

  const handleFilterChange = useCallback((filterId: string, value: string) => {
    setActiveFilters(prev => {
      if (value === "") {
        const newFilters = { ...prev };
        delete newFilters[filterId];
        return newFilters;
      } else {
        return {
          ...prev,
          [filterId]: value
        };
      }
    });
  }, []);

  const clearFilter = useCallback((filterId: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterId];
      return newFilters;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters({});
  }, []);

  const activeFilterCount = useMemo(() => {
    return Object.keys(activeFilters).length;
  }, [activeFilters]);

  const getFilterLabel = useCallback((filterId: string, value: string) => {
    const filter = filters.find(f => f.id === filterId);
    const option = filter?.options.find(o => o.value === value);
    return option?.label || value;
  }, [filters]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {showFilters && filters.length > 0 && (
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
                {activeFilterCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <Card className="border-0 shadow-none">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Filtres de recherche</CardTitle>
                      <CardDescription className="text-sm">
                        Affinez vos résultats de recherche
                      </CardDescription>
                    </div>
                    {activeFilterCount > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearAllFilters}
                        className="text-xs"
                      >
                        Tout effacer
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filters.map((filter) => (
                    <div key={filter.id} className="space-y-2">
                      <label className="text-sm font-medium">
                        {filter.label}
                      </label>
                      <Select
                        value={activeFilters[filter.id] || ""}
                        onValueChange={(value) => handleFilterChange(filter.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Tous ${filter.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Tous {filter.label.toLowerCase()}</SelectItem>
                          {filter.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filtres actifs:</span>
          {Object.entries(activeFilters).map(([filterId, value]) => {
            const filter = filters.find(f => f.id === filterId);
            return (
              <Badge key={filterId} variant="secondary" className="flex items-center gap-1">
                <span className="text-xs">
                  {filter?.label}: {getFilterLabel(filterId, value)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => clearFilter(filterId)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
