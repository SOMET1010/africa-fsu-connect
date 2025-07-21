
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAgencies } from "@/hooks/useAgencies";
import { Link } from "react-router-dom";
import { 
  Globe, 
  MapPin, 
  ExternalLink,
  Zap
} from "lucide-react";

export const MapWidget = () => {
  const { agencies, loading } = useAgencies();

  const sutelAgencies = agencies.filter(agency => 
    agency.metadata && 
    typeof agency.metadata === 'object' && 
    'sutel_type' in agency.metadata && 
    agency.metadata.sutel_type
  );

  const syncedCount = sutelAgencies.filter(a => a.sync_status === 'synced').length;
  const countriesCount = [...new Set(sutelAgencies.map(a => a.country))].length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Carte SUTEL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Carte Interactive SUTEL
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-primary/5 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold">{sutelAgencies.length}</div>
            <div className="text-xs text-muted-foreground">Agences SUTEL</div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MapPin className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold">{countriesCount}</div>
            <div className="text-xs text-muted-foreground">Pays couverts</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">
              {syncedCount} données synchronisées
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            Temps réel
          </Badge>
        </div>

        <div className="space-y-2">
          <Link to="/map">
            <Button className="w-full" size="sm">
              <Globe className="h-4 w-4 mr-2" />
              Voir la carte complète
              <ExternalLink className="h-3 w-3 ml-2" />
            </Button>
          </Link>
          <Link to="/organizations">
            <Button variant="outline" className="w-full" size="sm">
              <MapPin className="h-4 w-4 mr-2" />
              Gérer les agences
            </Button>
          </Link>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Visualisez la répartition géographique des agences SUTEL à travers l'Afrique
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
