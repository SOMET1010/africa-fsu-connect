import { Button } from "@/components/ui/button";
import { Lightbulb, Share2 } from "lucide-react";

export function PracticesHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border mb-8">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="relative px-8 py-12 md:py-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Lightbulb className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Bonnes Pratiques du Réseau
          </h1>
        </div>
        
        <p className="text-lg text-muted-foreground max-w-2xl mb-6">
          Découvrez les expériences qui fonctionnent dans les pays du réseau NEXUS. 
          Inspirez-vous des succès de vos pairs et partagez vos propres réalisations.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button size="lg">
            Explorer les pratiques
          </Button>
          <Button variant="outline" size="lg">
            <Share2 className="h-4 w-4 mr-2" />
            Partager une pratique
          </Button>
        </div>
      </div>
    </div>
  );
}
