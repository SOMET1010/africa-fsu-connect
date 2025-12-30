import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, ExternalLink, Globe, Users, Briefcase } from "lucide-react";
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
      <Card className="premium-card col-span-1 lg:col-span-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-8 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="col-span-1 lg:col-span-2"
    >
      <Card className="premium-card h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Carte du Réseau SUTEL
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <Badge variant="outline" className="text-xs bg-primary/5">
                  <Users className="h-3 w-3 mr-1" />
                  {uniqueCountries} pays membres
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {activeCountries} actifs ce mois
                </Badge>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/map" className="gap-1">
                  Plein écran
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className={compact ? "h-[350px]" : "h-[500px]"}>
            {agencies && agencies.length > 0 ? (
              <LeafletInteractiveMap agencies={agencies} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-muted/20 rounded-xl border border-dashed border-border">
                <Globe className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">Aucun pays membre affiché</p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link to="/organizations">Voir les pays membres</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Network-centric Quick stats overlay */}
          {agencies && agencies.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-center">
                <p className="text-2xl font-bold text-primary">{uniqueRegions}</p>
                <p className="text-xs text-muted-foreground">Régions</p>
              </div>
              <div className="p-3 rounded-xl bg-success/5 border border-success/10 text-center">
                <p className="text-2xl font-bold text-success">{activeCountries}</p>
                <p className="text-xs text-muted-foreground">Pays actifs</p>
              </div>
              <div className="p-3 rounded-xl bg-accent/5 border border-accent/10 text-center">
                <p className="text-2xl font-bold text-accent">{totalProjects || 127}</p>
                <p className="text-xs text-muted-foreground">Projets partagés</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
