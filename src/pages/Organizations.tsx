
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgencies } from "@/hooks/useAgencies";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SyncConfigDialog } from "@/components/organizations/SyncConfigDialog";
import { SyncButton } from "@/components/organizations/SyncButton";
import { SyncHistoryDialog } from "@/components/organizations/SyncHistoryDialog";
import { FirecrawlService } from "@/services/firecrawlService";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  RotateCcw,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw
} from "lucide-react";

const REGIONS = ["Europe", "Afrique", "Asie", "Amérique"];

const SYNC_STATUS_COLORS = {
  synced: "text-success",
  pending: "text-warning", 
  failed: "text-destructive",
  partial: "text-warning"
};

const SYNC_STATUS_ICONS = {
  synced: <CheckCircle className="h-3 w-3" />,
  pending: <Clock className="h-3 w-3" />,
  failed: <AlertTriangle className="h-3 w-3" />,
  partial: <AlertTriangle className="h-3 w-3" />
};

export default function Organizations() {
  const { agencies, loading, error, refetch } = useAgencies();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedAgency, setSelectedAgency] = useState<any>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [batchSyncing, setBatchSyncing] = useState(false);

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
          <h1 className="text-3xl font-bold tracking-tight">Organisations Partenaires</h1>
          <p className="text-muted-foreground">
            Découvrez nos agences partenaires et leurs initiatives
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
          {batchSyncing ? "Synchronisation..." : "Synchroniser tout"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgencies.map((agency) => (
          <div key={agency.id} className="border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">{agency.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  {SYNC_STATUS_ICONS[agency.sync_status]}
                  {agency.sync_status}
                </Badge>
                <SyncButton 
                  agency={agency}
                  onConfigClick={() => {
                    setSelectedAgency(agency);
                    setConfigDialogOpen(true);
                  }}
                  onHistoryClick={() => {
                    setSelectedAgency(agency);
                    setHistoryDialogOpen(true);
                  }}
                />
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a href={agency.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                {agency.website_url}
              </a>
            </div>
            {agency.contact_email && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{agency.contact_email}</span>
              </div>
            )}
            {agency.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{agency.phone}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {[agency.address, agency.country].filter(Boolean).join(', ')}
              </span>
            </div>
          </div>
        ))}
      </div>

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
