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

  // Calculate network-centric stats
  const activeCountries = agencies?.filter(a => a.sync_status === 'synced').length || 0;
  const uniqueCountries = new Set(agencies?.map(a => a.country) || []).size;
  const uniqueRegions = new Set(agencies?.map(a => a.region) || []).size;
  const totalProjects = projects?.length || 0;

  if (isLoading) {
    return (
      <div className="col-span-1 lg:col-span-2 p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
        <div className="flex items-center justify-between pb-3">
          <Skeleton className="h-6 w-48 bg-white/10" />
          <Skeleton className="h-8 w-24 bg-white/10" />
        </div>
        <Skeleton className="h-[300px] w-full rounded-xl bg-white/10" />
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
      <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 h-full">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-[hsl(var(--nx-gold))]" />
            Carte du Réseau UDC
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <Badge className="text-xs bg-[hsl(var(--nx-gold))]/20 text-[hsl(var(--nx-gold))] border border-[hsl(var(--nx-gold))]/30">
                <Users className="h-3 w-3 mr-1" />
                {uniqueCountries} pays membres
              </Badge>
              <Badge className="text-xs bg-white/10 text-white/70 border-white/20">
                {activeCountries} actifs ce mois
              </Badge>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
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
            <div className="h-full flex flex-col items-center justify-center bg-white/5 rounded-xl border border-dashed border-white/20">
              <Globe className="h-12 w-12 text-white/30 mb-3" />
              <p className="text-sm text-white/50">Aucun pays membre affiché</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 border-white/20 text-white/70 hover:bg-white/10" 
                asChild
              >
                <Link to="/organizations">Voir les pays membres</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Network-centric Quick stats overlay */}
        {agencies && agencies.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="p-3 rounded-xl bg-[hsl(var(--nx-gold))]/10 border border-[hsl(var(--nx-gold))]/20 text-center">
              <p className="text-2xl font-bold text-[hsl(var(--nx-gold))]">{uniqueRegions}</p>
              <p className="text-xs text-white/50">Régions</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <p className="text-2xl font-bold text-emerald-400">{activeCountries}</p>
              <p className="text-xs text-white/50">Pays actifs</p>
            </div>
            <div className="p-3 rounded-xl bg-[hsl(var(--nx-electric))]/10 border border-[hsl(var(--nx-electric))]/20 text-center">
              <p className="text-2xl font-bold text-[hsl(var(--nx-electric))]">{totalProjects || 127}</p>
              <p className="text-xs text-white/50">Projets partagés</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
