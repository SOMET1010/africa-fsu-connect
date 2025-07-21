
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAgencies } from "@/hooks/useAgencies";
import { MapboxInteractiveMap } from "@/components/organizations/MapboxInteractiveMap";
import { 
  Globe, 
  MapPin, 
  Search,
  Filter,
  Zap,
  Building2
} from "lucide-react";

const REGIONS = ["Europe", "Afrique", "Asie", "Amérique", "CEDEAO", "EACO", "SADC", "UMA"];

export default function Map() {
  const { agencies, loading } = useAgencies();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Filtrer spécifiquement les SUTEL (agences avec metadata.sutel_type)
  const sutelAgencies = agencies.filter(agency => 
    agency.metadata && 
    typeof agency.metadata === 'object' && 
    'sutel_type' in agency.metadata && 
    agency.metadata.sutel_type
  );

  const filteredAgencies = sutelAgencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.acronym?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "all" || agency.region === selectedRegion;
    const matchesStatus = selectedStatus === "all" || agency.sync_status === selectedStatus;
    
    return matchesSearch && matchesRegion && matchesStatus;
  });

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Globe className="h-8 w-8 text-primary" />
            Carte Interactive SUTEL
          </h1>
          <p className="text-muted-foreground mt-2">
            Visualisation géographique du réseau des agences SUTEL africaines
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {filteredAgencies.length} agences
        </Badge>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total SUTEL</p>
              <p className="text-2xl font-bold">{sutelAgencies.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <MapPin className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pays couverts</p>
              <p className="text-2xl font-bold">
                {[...new Set(sutelAgencies.map(a => a.country))].length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Régions</p>
              <p className="text-2xl font-bold">
                {[...new Set(sutelAgencies.map(a => a.region))].length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Globe className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Synchronisées</p>
              <p className="text-2xl font-bold text-green-600">
                {sutelAgencies.filter(a => a.sync_status === 'synced').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4" />
          <h3 className="font-medium">Filtres de recherche</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une SUTEL par nom, acronyme ou pays..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Toutes les régions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les régions</SelectItem>
              {REGIONS.map((region) => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="État des données" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les états</SelectItem>
              <SelectItem value="synced">Données enrichies</SelectItem>
              <SelectItem value="pending">Collecte en cours</SelectItem>
              <SelectItem value="failed">Erreur collecte</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Carte interactive */}
      <div className="min-h-[600px]">
        <MapboxInteractiveMap agencies={filteredAgencies} />
      </div>

      {/* Note informative */}
      <Card className="p-4 bg-muted/30">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-sm mb-1">À propos de cette carte</h4>
            <p className="text-xs text-muted-foreground">
              Cette carte interactive présente la localisation des agences SUTEL (Service Universel des Télécommunications) 
              à travers l'Afrique. Chaque marqueur représente une agence officiellement reconnue avec pour mission 
              de réduire la fracture numérique dans son territoire de compétence. Cliquez sur un marqueur pour 
              obtenir plus d'informations sur l'agence.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
