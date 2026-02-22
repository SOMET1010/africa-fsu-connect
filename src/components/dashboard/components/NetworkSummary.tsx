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
      className="p-6 rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-border shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        
        <div className="flex-1 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-foreground">
            Synthèse du Réseau
          </h2>
          
          <p className="text-muted-foreground leading-relaxed">
            Le réseau SUTEL progresse ensemble : <span className="font-medium text-foreground">{countriesCount} pays membres</span> partagent{" "}
            <span className="font-medium text-foreground">{projectsCount} projets</span> pour 
            améliorer l'accès aux télécommunications sur le continent africain.
          </p>
          
          {collaborationOpportunities > 0 && (
            <div className="flex items-center gap-2 pt-2">
              <Badge className="gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 hover:bg-amber-200 dark:hover:bg-amber-500/20">
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
