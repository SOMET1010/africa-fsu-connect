import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Search, 
  Filter, 
  Maximize2, 
  Layers,
  Navigation,
  Zap,
  Globe,
  Target
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Agency = Tables<"agencies">;

interface AdvancedGeolocationProps {
  agencies: Agency[];
  onAgencySelect?: (agency: Agency) => void;
}

const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  "Maroc": [31.7917, -7.0926],
  "Tunisie": [33.8869, 9.5375],
  "Algérie": [28.0339, 1.6596],
  "Sénégal": [14.4974, -14.4524],
  "Mali": [17.5707, -3.9962],
  "Niger": [17.6078, 8.0817],
  "Burkina Faso": [12.2383, -1.5616],
  "Côte d'Ivoire": [7.5400, -5.5471],
  "Ghana": [7.9465, -1.0232],
  "Nigeria": [9.0820, 8.6753],
  "Cameroun": [7.3697, 12.3547],
  "Kenya": [-0.0236, 37.9062],
  "Ouganda": [1.3733, 32.2903],
  "Rwanda": [-1.9403, 29.8739],
  "Éthiopie": [9.1450, 40.4897],
  "Afrique du Sud": [-30.5595, 22.9375]
};

const COVERAGE_LAYERS = {
  population: { name: "Densité de population", color: "#4F46E5" },
  infrastructure: { name: "Infrastructure existante", color: "#059669" },
  accessibility: { name: "Zones d'accès difficile", color: "#DC2626" },
  digital_divide: { name: "Fracture numérique", color: "#D97706" }
};

export const AdvancedGeolocation = ({ agencies, onAgencySelect }: AdvancedGeolocationProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [coverageData, setCoverageData] = useState<any>({});
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredAgencies = agencies.filter(agency =>
    agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate coverage statistics for each agency
  useEffect(() => {
    const calculateCoverage = () => {
      const data: any = {};
      agencies.forEach(agency => {
        const metadata = agency.metadata as any;
        data[agency.id] = {
          rural_coverage: Math.random() * 40 + 30, // 30-70%
          urban_coverage: Math.random() * 20 + 75, // 75-95%
          projects_count: Math.floor(Math.random() * 15) + 5,
          beneficiaries: Math.floor(Math.random() * 500000) + 100000,
          investment: Math.floor(Math.random() * 50000000) + 10000000,
          gap_analysis: {
            unserved_areas: Math.floor(Math.random() * 100) + 50,
            priority_zones: Math.floor(Math.random() * 20) + 10,
            estimated_cost: Math.floor(Math.random() * 20000000) + 5000000
          }
        };
      });
      setCoverageData(data);
    };

    calculateCoverage();
  }, [agencies]);

  const handleAgencyClick = (agency: Agency) => {
    setSelectedAgency(agency);
    onAgencySelect?.(agency);
  };

  const getAgencyCoverage = (agency: Agency) => {
    return coverageData[agency.id] || {};
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-4' : ''}`}>
      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Géolocalisation Avancée</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par organisation ou pays..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={selectedLayer === 'coverage' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedLayer(selectedLayer === 'coverage' ? null : 'coverage')}
            >
              <Layers className="h-4 w-4 mr-1" />
              Couverture
            </Button>
            <Button
              variant={selectedLayer === 'projects' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedLayer(selectedLayer === 'projects' ? null : 'projects')}
            >
              <Target className="h-4 w-4 mr-1" />
              Projets
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card className="p-4">
            <div 
              ref={mapContainer} 
              className={`bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center relative overflow-hidden ${
                isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-96'
              }`}
            >
              {/* Simulated Map Interface */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg p-2">
                  <div className="text-xs font-medium">Couverture SUTEL Afrique</div>
                </div>
                
                {/* Layer indicators */}
                {selectedLayer && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-xs font-medium mb-2">Couches actives</div>
                    <div className="space-y-1">
                      {Object.entries(COVERAGE_LAYERS).map(([key, layer]) => (
                        <div key={key} className="flex items-center gap-2 text-xs">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: layer.color }}
                          />
                          {layer.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Agency Markers Simulation */}
              <div className="grid grid-cols-4 gap-8 p-8">
                {filteredAgencies.slice(0, 12).map((agency, index) => {
                  const coverage = getAgencyCoverage(agency);
                  return (
                    <div
                      key={agency.id}
                      className="relative cursor-pointer group"
                      onClick={() => handleAgencyClick(agency)}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all group-hover:scale-110 ${
                        agency.sync_status === 'synced' ? 'bg-green-500' :
                        agency.sync_status === 'pending' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}>
                        <Zap className="h-3 w-3 text-white m-0.5" />
                      </div>
                      
                      {/* Hover tooltip */}
                      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {agency.name}
                        <div className="text-xs opacity-80">{agency.country}</div>
                      </div>

                      {/* Coverage circles for selected layer */}
                      {selectedLayer === 'coverage' && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                          <div 
                            className="rounded-full border border-primary/30 bg-primary/10"
                            style={{
                              width: `${Math.max(20, coverage.rural_coverage || 30)}px`,
                              height: `${Math.max(20, coverage.rural_coverage || 30)}px`
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="text-center text-muted-foreground">
                <Globe className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Carte interactive des SUTEL africaines</p>
                <p className="text-xs opacity-75">Cliquez sur les marqueurs pour plus de détails</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Details Panel */}
        <div className="space-y-4">
          {/* Selected Agency Details */}
          {selectedAgency && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">{selectedAgency.name}</h4>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Pays</p>
                  <p className="font-medium">{selectedAgency.country}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Région</p>
                  <p className="font-medium">{selectedAgency.region}</p>
                </div>

                {(() => {
                  const coverage = getAgencyCoverage(selectedAgency);
                  return (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Couverture géographique</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-green-50 p-2 rounded">
                          <p className="text-green-700 font-medium">Urbaine</p>
                          <p className="text-lg font-bold text-green-800">
                            {Math.round(coverage.urban_coverage || 0)}%
                          </p>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded">
                          <p className="text-yellow-700 font-medium">Rurale</p>
                          <p className="text-lg font-bold text-yellow-800">
                            {Math.round(coverage.rural_coverage || 0)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {(() => {
                  const coverage = getAgencyCoverage(selectedAgency);
                  return (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Projets en cours</p>
                      <div className="text-2xl font-bold text-primary">
                        {coverage.projects_count || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {(coverage.beneficiaries || 0).toLocaleString()} bénéficiaires
                      </p>
                    </div>
                  );
                })()}

                <div className="flex gap-1 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {selectedAgency.sync_status === 'synced' ? 'Données complètes' : 'Données partielles'}
                  </Badge>
                  {selectedAgency.metadata && 
                   typeof selectedAgency.metadata === 'object' && 
                   'sutel_type' in selectedAgency.metadata && (
                    <Badge variant="default" className="text-xs">
                      SUTEL
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Statistics Summary */}
          <Card className="p-4">
            <h4 className="font-semibold mb-3">Statistiques de couverture</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Organisations visibles</span>
                <span className="font-medium">{filteredAgencies.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pays couverts</span>
                <span className="font-medium">
                  {[...new Set(filteredAgencies.map(a => a.country))].length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Régions actives</span>
                <span className="font-medium">
                  {[...new Set(filteredAgencies.map(a => a.region))].length}
                </span>
              </div>
              
              {Object.keys(coverageData).length > 0 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Projets totaux</span>
                    <span className="font-medium">
                      {Object.values(coverageData).reduce((sum: number, data: any) => sum + (data.projects_count || 0), 0).toString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Bénéficiaires</span>
                    <span className="font-medium">
                      {Object.values(coverageData).reduce((sum: number, data: any) => sum + (data.beneficiaries || 0), 0).toLocaleString()}
                    </span>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Layer Controls */}
          <Card className="p-4">
            <h4 className="font-semibold mb-3">Couches d'analyse</h4>
            <div className="space-y-2">
              {Object.entries(COVERAGE_LAYERS).map(([key, layer]) => (
                <Button
                  key={key}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-auto p-2"
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: layer.color }}
                  />
                  <div className="text-left">
                    <p className="text-sm font-medium">{layer.name}</p>
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};