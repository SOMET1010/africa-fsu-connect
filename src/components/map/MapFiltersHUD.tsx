import { useState } from "react";
import { motion } from "framer-motion";
import { Layers, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MapMode } from "./activityData";

const filters = ["4G LTE", "5G", "Fibre Optique", "Satellite", "Backbone"];

const layers = [
  { id: 'infrastructure', label: 'Infrastructure', icon: '🔌' },
  { id: 'coverage', label: 'Couverture', icon: '📶' },
  { id: 'projects', label: 'Projets', icon: '🚀' },
  { id: 'members', label: 'Membres', icon: '👥' },
];

interface MapFiltersHUDProps {
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
  activeLayer: string;
  onLayerChange: (layer: string) => void;
  mode: MapMode;
  onModeChange: (mode: MapMode) => void;
}

export const MapFiltersHUD = ({
  activeFilters,
  onFilterToggle,
  activeLayer,
  onLayerChange,
  mode,
  onModeChange,
}: MapFiltersHUDProps) => {
  const currentLayer = layers.find(l => l.id === activeLayer) || layers[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex items-center gap-2 flex-wrap"
    >
      {/* Layer Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-slate-900/80 backdrop-blur-xl border-white/10 text-white hover:bg-slate-800 hover:text-white gap-2"
          >
            <Layers className="h-4 w-4" />
            <span>{currentLayer.icon} {currentLayer.label}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-slate-900/95 backdrop-blur-xl border-white/10">
          {layers.map((layer) => (
            <DropdownMenuItem
              key={layer.id}
              onClick={() => onLayerChange(layer.id)}
              className={cn(
                "text-white/80 hover:text-white focus:text-white focus:bg-white/10",
                activeLayer === layer.id && "bg-white/10"
              )}
            >
              <span className="mr-2">{layer.icon}</span>
              {layer.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Divider */}
      <div className="h-6 w-px bg-white/10" />

      {/* Mode Pills */}
      <div className="flex items-center gap-1">
        {(['members', 'projects', 'trends'] as MapMode[]).map((m) => (
          <Badge
            key={m}
            variant={mode === m ? "default" : "outline"}
            className={cn(
              "cursor-pointer transition-all",
              mode === m
                ? "bg-primary text-primary-foreground"
                : "bg-transparent border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
            )}
            onClick={() => onModeChange(m)}
          >
            {m === 'members' && 'Membres'}
            {m === 'projects' && 'Projets'}
            {m === 'trends' && 'Tendances'}
          </Badge>
        ))}
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-white/10" />

      {/* Filter Pills */}
      <div className="flex items-center gap-1 flex-wrap">
        {filters.map((filter) => (
          <Badge
            key={filter}
            variant="outline"
            className={cn(
              "cursor-pointer transition-all text-xs",
              activeFilters.includes(filter)
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                : "bg-transparent border-white/20 text-white/60 hover:bg-white/10 hover:text-white"
            )}
            onClick={() => onFilterToggle(filter)}
          >
            {filter}
          </Badge>
        ))}
      </div>

      {/* More Filters */}
      <Button
        variant="ghost"
        size="sm"
        className="text-white/60 hover:text-white hover:bg-white/10"
      >
        <Filter className="h-4 w-4" />
      </Button>
    </motion.div>
  );
};
