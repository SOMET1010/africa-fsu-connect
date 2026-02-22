import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Globe, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAgencies } from "@/hooks/useAgencies";
import { motion } from "framer-motion";
import { LeafletInteractiveMap } from "@/components/organizations/LeafletInteractiveMap";
import { useProjects } from "@/hooks/useProjects";

interface DashboardMapWidgetProps {
  compact?: boolean;
}

export const DashboardMapWidget = ({ compact = true }: DashboardMapWidgetProps) => {
  const { agencies, loading: isLoading } = useAgencies();
  const { projects } = useProjects();

  const activeCountries = agencies?.filter(a => a.sync_status === 'synced').length || 0;
  const uniqueCountries = new Set(agencies?.map(a => a.country) || []).size;
  const uniqueRegions = new Set(agencies?.map(a => a.region) || []).size;
  const totalProjects = projects?.length || 0;

  if (isLoading) {
    return (
      <div className="col-span-1 lg:col-span-2 p-5 rounded-2xl bg-card border border-border shadow-sm">
        <div className="flex items-center justify-between pb-3">
          <Skeleton className="h-6 w-48 bg-muted" />
          <Skeleton className="h-8 w-24 bg-muted" />
        </div>
        <Skeleton className="h-[300px] w-full rounded-xl bg-muted" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="col-span-1 lg:col-span-2"
    >
      <div className="p-5 rounded-2xl bg-card border border-border shadow-sm h-full">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Globe className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            Carte du Réseau UDC
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <Badge className="text-xs bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30">
                <Users className="h-3 w-3 mr-1" />
                {uniqueCountries} pays membres
              </Badge>
              <Badge className="text-xs bg-muted text-muted-foreground border-border">
                {activeCountries} actifs ce mois
              </Badge>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Link to="/map" className="gap-1">
                Plein écran
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className={compact ? "h-[350px]" : "h-[500px]"}>
          {agencies && agencies.length > 0 ? (
            <LeafletInteractiveMap agencies={agencies} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-muted/50 rounded-xl border border-dashed border-border">
              <Globe className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">Aucun pays membre affiché</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 border-border text-muted-foreground hover:bg-muted" 
                asChild
              >
                <Link to="/organizations">Voir les pays membres</Link>
              </Button>
            </div>
          )}
        </div>

        {agencies && agencies.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 text-center">
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{uniqueRegions}</p>
              <p className="text-xs text-muted-foreground">Régions</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 text-center">
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{activeCountries}</p>
              <p className="text-xs text-muted-foreground">Pays actifs</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-center">
              <p className="text-2xl font-bold text-primary">{totalProjects || 127}</p>
              <p className="text-xs text-muted-foreground">Projets partagés</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
