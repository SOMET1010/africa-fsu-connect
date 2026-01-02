import { Sparkles, Handshake } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

interface NetworkSummaryProps {
  countriesCount?: number;
  projectsCount?: number;
  collaborationOpportunities?: number;
}

export function NetworkSummary({ 
  countriesCount = 30, 
  projectsCount = 45,
  collaborationOpportunities = 3 
}: NetworkSummaryProps) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Sparkles className="h-5 w-5" />
        </div>
        
        <div className="flex-1 space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Synthèse du Réseau
          </h2>
          
          <p className="text-muted-foreground leading-relaxed">
            Le réseau SUTEL progresse ensemble : <span className="font-medium text-foreground">{countriesCount} pays membres</span> partagent{" "}
            <span className="font-medium text-foreground">{projectsCount} projets</span> pour 
            améliorer l'accès aux télécommunications sur le continent africain.
          </p>
          
          {collaborationOpportunities > 0 && (
            <div className="flex items-center gap-2 pt-2">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                <Handshake className="h-3.5 w-3.5" />
                {collaborationOpportunities} opportunité{collaborationOpportunities > 1 ? 's' : ''} de collaboration
              </Badge>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
