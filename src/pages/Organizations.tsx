import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAgencies } from "@/hooks/useAgencies";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SyncConfigDialog } from "@/components/organizations/SyncConfigDialog";
import { SyncButton } from "@/components/organizations/SyncButton";
import { SyncHistoryDialog } from "@/components/organizations/SyncHistoryDialog";
import { OrganizationsOverview } from "@/components/organizations/OrganizationsOverview";
import { AgencyCard } from "@/components/organizations/AgencyCard";
import { AgencyProfile } from "@/components/organizations/AgencyProfile";
import { FirecrawlService } from "@/services/firecrawlService";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  RotateCcw,
  RefreshCw,
  Info,
  Network,
  Globe
} from "lucide-react";

const REGIONS = ["Europe", "Afrique", "Asie", "Amérique", "CEDEAO", "EACO", "SADC", "UMA"];

export default function Organizations() {
  const { agencies, loading, error, refetch } = useAgencies();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedAgency, setSelectedAgency] = useState<any>(null);
  const [profileAgency, setProfileAgency] = useState<any>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [batchSyncing, setBatchSyncing] = useState(false);

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.acronym?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "all" || agency.region === selectedRegion;
    const matchesStatus = selectedStatus === "all" || agency.sync_status === selectedStatus;
    
    return matchesSearch && matchesRegion && matchesStatus;
  });

  const handleBatchSync = async () => {
    setBatchSyncing(true);
    try {
      const result = await FirecrawlService.batchSyncAllAgencies();
      if (result.success) {
        toast({
          title: "Synchronisation en lot terminée",
          description: `${result.totalSuccessful || 0}/${result.totalProcessed || 0} agences synchronisées`
        });
        refetch();
      } else {
        toast({
          title: "Erreur de synchronisation",
          description: result.error || "Une erreur est survenue",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de lancer la synchronisation en lot",
        variant: "destructive"
      });
    } finally {
      setBatchSyncing(false);
    }
  };

  const handleSaveConfig = async (config: any) => {
    if (!selectedAgency) return;

    try {
      const { error } = await supabase
        .from('agency_connectors')
        .upsert({
          agency_id: selectedAgency.id,
          connector_type: 'firecrawl',
          auth_config: {
            urls: config.urls,
            extract_projects: config.extractSchema.projects,
            extract_resources: config.extractSchema.resources,
            extract_news: config.extractSchema.news,
            sync_frequency: config.frequency,
            include_paths: config.includePaths,
            exclude_paths: config.excludePaths
          },
          sync_frequency: config.frequency * 3600,
          is_active: true
        }, { onConflict: 'agency_id,connector_type' });

      if (error) throw error;
      refetch();
    } catch (error) {
      throw new Error("Impossible de sauvegarder la configuration");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Network className="h-8 w-8 text-primary" />
            Réseau Institutionnel des Partenaires
          </h1>
          <p className="text-muted-foreground mt-2">
            Organisations officielles de régulation des télécommunications et partenaires institutionnels
          </p>
        </div>
        <Button 
          onClick={handleBatchSync} 
          disabled={batchSyncing}
          className="flex items-center gap-2"
        >
          {batchSyncing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
          {batchSyncing ? "Collecte en cours..." : "Actualiser les données"}
        </Button>
      </div>

      {/* Enhanced Info Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Globe className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Réseau de Partenaires Institutionnels Authentiques
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              Ce réseau comprend {agencies.length} organisations officielles de régulation des télécommunications 
              à travers {[...new Set(agencies.map(a => a.country))].length} pays. Chaque institution est 
              reconnue officiellement avec un mandat légal dans son territoire de compétence.
            </p>
            <div className="flex items-center gap-4 text-xs text-blue-600 dark:text-blue-400">
              <span>• Institutions gouvernementales officielles</span>
              <span>• Autorités de régulation reconnues</span>
              <span>• Partenaires institutionnels confirmés</span>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Vue d'ensemble institutionnelle</TabsTrigger>
          <TabsTrigger value="directory">Annuaire des institutions</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <OrganizationsOverview 
            agencies={agencies}
            onAgencyClick={(agency) => setProfileAgency(agency)}
          />
        </TabsContent>

        <TabsContent value="directory" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher une institution par nom, acronyme ou pays..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
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
                <SelectItem value="synced">Données collectées</SelectItem>
                <SelectItem value="pending">Collecte en cours</SelectItem>
                <SelectItem value="failed">Erreur collecte</SelectItem>
                <SelectItem value="partial">Données partielles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {filteredAgencies.length} institution{filteredAgencies.length > 1 ? 's' : ''} 
              {agencies.length !== filteredAgencies.length && ` sur ${agencies.length} au total`}
            </div>
            <div className="text-xs text-muted-foreground">
              Institutions partenaires officielles et reconnues
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgencies.map((agency) => (
              <AgencyCard 
                key={agency.id} 
                agency={agency}
                onViewProfile={setProfileAgency}
              />
            ))}
          </div>

          {filteredAgencies.length === 0 && !loading && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune institution trouvée</h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos critères de recherche ou filtres
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Agency Profile Modal */}
      {profileAgency && (
        <AgencyProfile
          agency={profileAgency}
          onClose={() => setProfileAgency(null)}
        />
      )}

      {/* Existing dialogs */}
      {selectedAgency && (
        <SyncConfigDialog
          open={configDialogOpen}
          onOpenChange={setConfigDialogOpen}
          agency={selectedAgency}
          onSave={handleSaveConfig}
        />
      )}

      {selectedAgency && (
        <SyncHistoryDialog
          open={historyDialogOpen}
          onOpenChange={setHistoryDialogOpen}
          agencyId={selectedAgency.id}
          agencyName={selectedAgency.name}
        />
      )}
    </div>
  );
}
