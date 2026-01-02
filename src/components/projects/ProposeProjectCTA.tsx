import { Link } from "react-router-dom";
import { Plus, Sparkles } from "lucide-react";
import { ModernButton } from "@/components/ui/modern-button";

interface ProposeProjectCTAProps {
  variant?: 'light' | 'dark';
}

export function ProposeProjectCTA({ variant = 'light' }: ProposeProjectCTAProps) {
  const isDark = variant === 'dark';
  
  return (
    <div className={`
      relative overflow-hidden rounded-2xl border p-8
      ${isDark 
        ? 'bg-gradient-to-r from-[hsl(var(--nx-gold)/0.15)] via-[hsl(var(--nx-network)/0.1)] to-[hsl(var(--nx-cyan)/0.1)] border-[hsl(var(--nx-gold)/0.3)]' 
        : 'bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/20'
      }
    `}>
      {/* Decorative elements */}
      <div className={`absolute top-4 right-4 opacity-20 ${isDark ? 'text-[hsl(var(--nx-gold))]' : 'text-primary'}`}>
        <Sparkles className="h-24 w-24" />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-foreground'}`}>
            Vous avez un projet à partager ?
          </h3>
          <p className={`max-w-md ${isDark ? 'text-white/70' : 'text-muted-foreground'}`}>
            Partagez votre initiative avec le réseau SUTEL et inspirez d'autres pays 
            dans leur mission de connectivité universelle.
          </p>
        </div>
        
        <ModernButton 
          asChild 
          size="lg" 
          className={`shrink-0 ${isDark ? 'bg-[hsl(var(--nx-gold))] hover:bg-[hsl(var(--nx-gold)/0.9)] text-[hsl(var(--nx-night))]' : ''}`}
        >
          <Link to="/submit">
            <Plus className="h-5 w-5 mr-2" />
            Proposer un projet
          </Link>
        </ModernButton>
      </div>
    </div>
  );
}
