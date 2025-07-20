
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe } from "lucide-react";

interface Agency {
  id: string;
  name: string;
  country: string;
  region: string;
  sync_status: string;
}

interface OrganizationsMapProps {
  agencies: Agency[];
}

const REGION_COLORS = {
  "Europe": "bg-blue-500",
  "Afrique": "bg-green-500", 
  "Asie": "bg-purple-500",
  "Amérique": "bg-orange-500",
  "CEDEAO": "bg-emerald-500",
  "EACO": "bg-cyan-500",
  "SADC": "bg-amber-500",
  "UMA": "bg-red-500"
};

export const OrganizationsMap = ({ agencies }: OrganizationsMapProps) => {
  const regionStats = agencies.reduce((acc, agency) => {
    if (!acc[agency.region]) {
      acc[agency.region] = {
        count: 0,
        countries: new Set(),
        agencies: []
      };
    }
    acc[agency.region].count++;
    acc[agency.region].countries.add(agency.country);
    acc[agency.region].agencies.push(agency);
    return acc;
  }, {} as any);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Globe className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Couverture géographique du réseau</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(regionStats).map(([region, stats]: [string, any]) => (
          <Card key={region} className="p-4 border-l-4" style={{borderLeftColor: 'hsl(var(--primary))'}}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">{region}</h4>
              <div 
                className={`w-3 h-3 rounded-full ${REGION_COLORS[region as keyof typeof REGION_COLORS] || 'bg-gray-500'}`}
              />
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Organisations:</span>
                <span className="font-medium">{stats.count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pays couverts:</span>
                <span className="font-medium">{stats.countries.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Synchronisées:</span>
                <span className="font-medium text-green-600">
                  {stats.agencies.filter((a: Agency) => a.sync_status === 'synced').length}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t">
              <div className="flex flex-wrap gap-1">
                {Array.from(stats.countries).slice(0, 3).map((country: string) => (
                  <Badge key={country} variant="outline" className="text-xs">
                    {country}
                  </Badge>
                ))}
                {stats.countries.size > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{stats.countries.size - 3}
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-sm mb-1">Réseau de partenaires institutionnels</h4>
            <p className="text-xs text-muted-foreground">
              Ce réseau représente {agencies.length} organisations officielles de régulation 
              et de supervision des télécommunications à travers {[...new Set(agencies.map(a => a.country))].length} pays. 
              Chaque organisation est une institution reconnue avec un mandat officiel 
              dans son territoire de compétence.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
