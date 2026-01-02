import { Link } from "react-router-dom";
import { Plus, Sparkles } from "lucide-react";
import { ModernButton } from "@/components/ui/modern-button";

export function ProposeProjectCTA() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border border-primary/20 p-8">
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 opacity-20">
        <Sparkles className="h-24 w-24 text-primary" />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Vous avez un projet à partager ?
          </h3>
          <p className="text-muted-foreground max-w-md">
            Partagez votre initiative avec le réseau SUTEL et inspirez d'autres pays 
            dans leur mission de connectivité universelle.
          </p>
        </div>
        
        <ModernButton asChild size="lg" className="shrink-0">
          <Link to="/submit">
            <Plus className="h-5 w-5 mr-2" />
            Proposer un projet
          </Link>
        </ModernButton>
      </div>
    </div>
  );
}
