import React, { useState, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  X, 
  SlidersHorizontal,
  FileText,
  Download,
  Clock,
  User,
  Tag
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface SearchFilters {
  documentTypes: string[];
  countries: string[];
  sizeRange: { min: number; max: number };
  dateRange: { from: Date | null; to: Date | null };
  downloadRange: { min: number; max: number };
  tags: string[];
  uploadedBy?: string;
  sortBy: 'relevance' | 'date' | 'downloads' | 'size' | 'title';
  sortOrder: 'asc' | 'desc';
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  availableTags?: string[];
  availableCountries?: string[];
  availableDocumentTypes?: string[];
}

export const AdvancedSearch = ({
  onSearch,
  availableTags = [],
  availableCountries = [],
  availableDocumentTypes = []
}: AdvancedSearchProps) => {
  const [query, setQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    documentTypes: [],
    countries: [],
    sizeRange: { min: 0, max: 100 },
    dateRange: { from: null, to: null },
    downloadRange: { min: 0, max: 1000 },
    tags: [],
    uploadedBy: undefined,
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.documentTypes.length > 0) count++;
    if (filters.countries.length > 0) count++;
    if (filters.sizeRange.min > 0 || filters.sizeRange.max < 100) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.downloadRange.min > 0 || filters.downloadRange.max < 1000) count++;
    if (filters.tags.length > 0) count++;
    if (filters.uploadedBy) count++;
    return count;
  }, [filters]);

  const handleFilterChange = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleArrayFilterToggle = useCallback((key: 'documentTypes' | 'countries' | 'tags', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  }, []);

  const handleSearch = useCallback(() => {
    onSearch(query, filters);
  }, [query, filters, onSearch]);

  const clearFilters = useCallback(() => {
    setFilters({
      documentTypes: [],
      countries: [],
      sizeRange: { min: 0, max: 100 },
      dateRange: { from: null, to: null },
      downloadRange: { min: 0, max: 1000 },
      tags: [],
      uploadedBy: undefined,
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <Card className="p-6 space-y-6">
      {/* Search Bar */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Recherche avancée</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">
              {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Recherche full-text dans les titres, descriptions et contenu..."
              className="text-base"
            />
          </div>
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filtres {showAdvanced ? 'simples' : 'avancés'}
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <>
          <Separator />
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-medium">Filtres avancés</h4>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Effacer tout
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Document Types */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Types de documents
                </Label>
                <div className="space-y-2">
                  {availableDocumentTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={filters.documentTypes.includes(type)}
                        onCheckedChange={() => handleArrayFilterToggle('documentTypes', type)}
                      />
                      <Label htmlFor={`type-${type}`} className="text-sm font-normal capitalize">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Countries */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Pays
                </Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availableCountries.map((country) => (
                    <div key={country} className="flex items-center space-x-2">
                      <Checkbox
                        id={`country-${country}`}
                        checked={filters.countries.includes(country)}
                        onCheckedChange={() => handleArrayFilterToggle('countries', country)}
                      />
                      <Label htmlFor={`country-${country}`} className="text-sm font-normal">
                        {country}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="space-y-3">
                <Label>Tri</Label>
                <div className="space-y-3">
                  <Select value={filters.sortBy} onValueChange={(value: any) => handleFilterChange('sortBy', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Trier par..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Pertinence</SelectItem>
                      <SelectItem value="date">Date de publication</SelectItem>
                      <SelectItem value="downloads">Nombre de téléchargements</SelectItem>
                      <SelectItem value="size">Taille du fichier</SelectItem>
                      <SelectItem value="title">Titre (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <RadioGroup 
                    value={filters.sortOrder} 
                    onValueChange={(value: 'asc' | 'desc') => handleFilterChange('sortOrder', value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="desc" id="desc" />
                      <Label htmlFor="desc" className="text-sm">Décroissant</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="asc" id="asc" />
                      <Label htmlFor="asc" className="text-sm">Croissant</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Période de publication
              </Label>
              <div className="flex items-center gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.from ? (
                        format(filters.dateRange.from, "dd MMM yyyy", { locale: fr })
                      ) : (
                        "Date de début"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.from || undefined}
                      onSelect={(date) => 
                        handleFilterChange('dateRange', { ...filters.dateRange, from: date || null })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <span className="text-muted-foreground">à</span>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.to ? (
                        format(filters.dateRange.to, "dd MMM yyyy", { locale: fr })
                      ) : (
                        "Date de fin"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.to || undefined}
                      onSelect={(date) => 
                        handleFilterChange('dateRange', { ...filters.dateRange, to: date || null })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Size Range */}
            <div className="space-y-3">
              <Label>Taille du fichier (MB)</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min="0"
                  value={filters.sizeRange.min}
                  onChange={(e) => 
                    handleFilterChange('sizeRange', { 
                      ...filters.sizeRange, 
                      min: parseInt(e.target.value) || 0 
                    })
                  }
                  className="w-24"
                  placeholder="Min"
                />
                <span className="text-muted-foreground">à</span>
                <Input
                  type="number"
                  min="0"
                  value={filters.sizeRange.max}
                  onChange={(e) => 
                    handleFilterChange('sizeRange', { 
                      ...filters.sizeRange, 
                      max: parseInt(e.target.value) || 100 
                    })
                  }
                  className="w-24"
                  placeholder="Max"
                />
                <span className="text-sm text-muted-foreground">MB</span>
              </div>
            </div>

            {/* Download Range */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Nombre de téléchargements
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min="0"
                  value={filters.downloadRange.min}
                  onChange={(e) => 
                    handleFilterChange('downloadRange', { 
                      ...filters.downloadRange, 
                      min: parseInt(e.target.value) || 0 
                    })
                  }
                  className="w-24"
                  placeholder="Min"
                />
                <span className="text-muted-foreground">à</span>
                <Input
                  type="number"
                  min="0"
                  value={filters.downloadRange.max}
                  onChange={(e) => 
                    handleFilterChange('downloadRange', { 
                      ...filters.downloadRange, 
                      max: parseInt(e.target.value) || 1000 
                    })
                  }
                  className="w-24"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Uploaded By */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Uploadé par (email)
              </Label>
              <Input
                value={filters.uploadedBy || ''}
                onChange={(e) => handleFilterChange('uploadedBy', e.target.value || undefined)}
                placeholder="Rechercher par email de l'utilisateur..."
              />
            </div>
          </div>
        </>
      )}
    </Card>
  );
};