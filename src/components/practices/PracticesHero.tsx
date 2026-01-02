import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Search } from "lucide-react";

interface PracticesHeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PracticesHero({ searchQuery, onSearchChange }: PracticesHeroProps) {
  return (
    <div className="py-10">
      {/* Titre éditorial - aligné à gauche */}
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        Bonnes Pratiques du Réseau
      </h1>
      
      {/* Description incarnée - voix humaine */}
      <p className="text-lg text-muted-foreground max-w-2xl mb-8">
        Ce sont des projets réels, portés par des pays africains, 
        qui ont déjà fait leurs preuves sur le terrain.
      </p>

      {/* Recherche + CTA sur la même ligne */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une pratique..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="group">
          <Share2 className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
          Partager une pratique
        </Button>
      </div>
    </div>
  );
}
