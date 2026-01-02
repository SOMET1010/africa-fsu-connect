import { Sparkles, Handshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nx-electric))]/20 border border-[hsl(var(--nx-electric))]/30">
          <Sparkles className="h-5 w-5 text-[hsl(var(--nx-electric))]" />
        </div>
        
        <div className="flex-1 space-y-3">
          <h2 className="text-lg font-semibold text-white">
            Synthèse du Réseau
          </h2>
          
          <p className="text-white/60 leading-relaxed">
            Le réseau SUTEL progresse ensemble : <span className="font-medium text-white">{countriesCount} pays membres</span> partagent{" "}
            <span className="font-medium text-white">{projectsCount} projets</span> pour 
            améliorer l'accès aux télécommunications sur le continent africain.
          </p>
          
          {collaborationOpportunities > 0 && (
            <div className="flex items-center gap-2 pt-2">
              <Badge className="gap-1.5 px-3 py-1.5 bg-[hsl(var(--nx-gold))]/20 text-[hsl(var(--nx-gold))] border border-[hsl(var(--nx-gold))]/30 hover:bg-[hsl(var(--nx-gold))]/30">
                <Handshake className="h-3.5 w-3.5" />
                {collaborationOpportunities} opportunité{collaborationOpportunities > 1 ? 's' : ''} de collaboration
              </Badge>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
