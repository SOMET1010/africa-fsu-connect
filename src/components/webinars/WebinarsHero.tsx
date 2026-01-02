import { Video } from "lucide-react";

export function WebinarsHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border mb-8">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="relative px-8 py-12 md:py-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Video className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Webinaires du Réseau
          </h1>
        </div>
        
        <p className="text-lg text-muted-foreground max-w-2xl">
          Sessions en direct et replays pour apprendre ensemble. 
          Participez aux échanges avec les experts du réseau NEXUS.
        </p>
      </div>
    </div>
  );
}
