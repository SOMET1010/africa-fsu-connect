import { Globe, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function NetworkHero() {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Membre';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-border/50">
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <div className="relative px-6 py-8 md:px-8 md:py-10">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Globe className="h-7 w-7" />
          </div>
          
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Bienvenue sur USF Universal Digital Connect
            </h1>
            <p className="text-muted-foreground text-lg">
              Le réseau panafricain du Service Universel des Télécommunications
            </p>
            <p className="text-foreground/80 mt-4">
              Bonjour <span className="font-medium text-primary">{firstName}</span>, 
              voici ce qui se passe dans le réseau aujourd'hui.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Connecté avec les pays membres de la communauté UDC</span>
        </div>
      </div>
    </div>
  );
}
