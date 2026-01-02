import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lightbulb, Share2, Search } from "lucide-react";

interface PracticesHeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PracticesHero({ searchQuery, onSearchChange }: PracticesHeroProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <Lightbulb className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Bonnes Pratiques du Réseau
          </h1>
          <p className="text-muted-foreground">
            Découvrez ce qui fonctionne concrètement dans les pays NEXUS.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une pratique..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>
          <Share2 className="h-4 w-4 mr-2" />
          Partager une pratique
        </Button>
      </div>
    </div>
  );
}
