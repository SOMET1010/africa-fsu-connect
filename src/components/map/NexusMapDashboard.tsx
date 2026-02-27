import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Minus, Maximize2, Activity, ArrowRight, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAfricanCountries } from "@/hooks/useCountries";
import { Country } from "@/services/countriesService";
import { MapMode, getCountryActivity } from "./activityData";
import { StatsHUD } from "./StatsHUD";
import { ActivityPanel } from "./ActivityPanel";
import { MapFiltersHUD } from "./MapFiltersHUD";
import { CommandCenterMap } from "./CommandCenterMap";
import { CountrySheet } from "./CountrySheet";
import { MapLegend } from "./MapLegend";

export const NexusMapDashboard = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [activeLayer, setActiveLayer] = useState("infrastructure");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [mode, setMode] = useState<MapMode>("members");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: countries = [], isLoading } = useAfricanCountries();
  
  // Filter countries with coordinates
  const countriesWithCoords = useMemo(() => 
    countries.filter(c => c.latitude && c.longitude),
    [countries]
  );
  
  // Filter by search query
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countriesWithCoords;
    const query = searchQuery.toLowerCase();
    return countriesWithCoords.filter(country => 
      country.name_fr.toLowerCase().includes(query) ||
      country.name_en.toLowerCase().includes(query) ||
      country.code.toLowerCase().includes(query)
    );
  }, [countriesWithCoords, searchQuery]);

  const handleFilterToggle = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="fixed inset-0 bg-[hsl(var(--nx-night))] z-10 overflow-hidden">
      
      {/* 1. TOP BAR - Floating HUD */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 z-30 p-4 space-y-3"
      >
        {/* Top Row: Search + Stats */}
        <div className="flex items-center gap-4">
          {/* Search Bar - Glassmorphism */}
          <div className="relative flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un pays..."
              className="w-64 pl-10 bg-slate-900/80 backdrop-blur-xl border-white/10 text-white placeholder:text-white/40 focus:border-emerald-500/50"
            />
          </div>

          {/* Stats HUD */}
          <StatsHUD className="flex-1 justify-end" />
        </div>

        {/* Bottom Row: Filters */}
        <MapFiltersHUD
          activeFilters={activeFilters}
          onFilterToggle={handleFilterToggle}
          activeLayer={activeLayer}
          onLayerChange={setActiveLayer}
          mode={mode}
          onModeChange={setMode}
        />
      </motion.div>

      {/* 2. MAP AREA - Full Screen */}
      <div className="absolute inset-0">
        <CommandCenterMap
          countries={filteredCountries}
          onCountryClick={setSelectedCountry}
          mode={mode}
          isLoading={isLoading}
        />
      </div>

      {/* 3. BOTTOM SHEET - Activity */}
      <ActivityPanel />

      {/* 4. BOTTOM BAR - Map Controls + Legend */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between"
      >
        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="bg-slate-900/80 backdrop-blur-xl border-white/10 text-white hover:bg-slate-800 hover:text-white"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-slate-900/80 backdrop-blur-xl border-white/10 text-white hover:bg-slate-800 hover:text-white"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-slate-900/80 backdrop-blur-xl border-white/10 text-white hover:bg-slate-800 hover:text-white"
          >
            <Compass className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-slate-900/80 backdrop-blur-xl border-white/10 text-white hover:bg-slate-800 hover:text-white"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Center: Visual Legend */}
        <MapLegend />

        {/* Spacer pour équilibrer le layout */}
        <div className="w-24" />
      </motion.div>

      {/* 5. COUNTRY SHEET */}
      <CountrySheet 
        country={selectedCountry}
        onClose={() => setSelectedCountry(null)}
        mode={mode}
      />
    </div>
  );
};

export default NexusMapDashboard;
