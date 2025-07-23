
import React, { useState, useCallback, useMemo, forwardRef, useImperativeHandle, useRef } from "react";
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
  initialQuery?: string;
  initialFilters?: Record<string, string>;
}

export interface SearchBarRef {
  reset: () => void;
  getSearchParams: () => { query: string; filters: Record<string, string> };
}

const OptimizedSearchBar = forwardRef<SearchBarRef, SearchBarProps>(({
  placeholder = "Rechercher...",
  onSearch,
  filters = [],
  className = "",
  showFilters = true,
  initialQuery = "",
  initialFilters = {}
}, ref) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(initialFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Refs for tracking last search to prevent duplicates
  const lastSearchRef = useRef<string>("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized filter-related functions
  const activeFilterCount = useMemo(() => {
    return Object.keys(activeFilters).length;
  }, [activeFilters]);

  const getFilterLabel = useCallback((filterId: string, value: string) => {
    const filter = filters.find(f => f.id === filterId);
    const option = filter?.options.find(o => o.value === value);
    return option?.label || value;
  }, [filters]);

  // Debounced search with duplicate prevention
  const triggerSearch = useCallback((query: string, filtersObj: Record<string, string>) => {
    const searchParams = JSON.stringify({ query, filters: filtersObj });
    
    // Prevent duplicate searches
    if (searchParams === lastSearchRef.current) {
      return;
    }
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout
    searchTimeoutRef.current = setTimeout(() => {
      lastSearchRef.current = searchParams;
      onSearch?.(query, filtersObj);
    }, 300);
  }, [onSearch]);

  // Handle query changes
  const handleQueryChange = useCallback((newQuery: string) => {
    setSearchQuery(newQuery);
    triggerSearch(newQuery, activeFilters);
  }, [activeFilters, triggerSearch]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterId: string, value: string) => {
    setActiveFilters(prev => {
      const newFilters = value === "" 
        ? { ...prev, [filterId]: undefined } 
        : { ...prev, [filterId]: value };
      
      // Clean undefined values
      Object.keys(newFilters).forEach(key => {
        if (newFilters[key] === undefined) {
          delete newFilters[key];
        }
      });
      
      triggerSearch(searchQuery, newFilters);
      return newFilters;
    });
  }, [searchQuery, triggerSearch]);

  const clearFilter = useCallback((filterId: string) => {
    handleFilterChange(filterId, "");
  }, [handleFilterChange]);

  const clearAllFilters = useCallback(() => {
    setActiveFilters({});
    triggerSearch(searchQuery, {});
  }, [searchQuery, triggerSearch]);

  // Imperative handle for external control
  useImperativeHandle(ref, () => ({
    reset: () => {
      setSearchQuery("");
      setActiveFilters({});
      lastSearchRef.current = "";
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      onSearch?.("", {});
    },
    getSearchParams: () => ({
      query: searchQuery,
      filters: activeFilters
    })
  }), [searchQuery, activeFilters, onSearch]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {showFilters && filters.length > 0 && (
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <>
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
                </>
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
});

OptimizedSearchBar.displayName = "OptimizedSearchBar";

export default OptimizedSearchBar;
