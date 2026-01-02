import React from 'react';
import { Sparkles } from 'lucide-react';

export const ShareInitiativeHero = () => {
  return (
    <div className="text-center space-y-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
        <Sparkles className="h-8 w-8 text-primary" />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
        Partager une initiative
      </h1>
      
      <p className="text-lg text-muted-foreground max-w-xl mx-auto">
        Contribuez au réseau SUTEL en partageant vos projets, bonnes pratiques 
        ou ressources avec les autres pays membres.
      </p>
    </div>
  );
};

export default ShareInitiativeHero;
