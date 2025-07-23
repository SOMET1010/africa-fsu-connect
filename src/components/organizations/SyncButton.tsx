
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { FirecrawlService } from "@/services/firecrawlService";
import { 
  RefreshCw, 
  Settings, 
  ChevronDown, 
  Play, 
  History, 
  AlertTriangle 
} from "lucide-react";

interface SyncButtonProps {
  agency: any;
  onConfigClick: () => void;
  onHistoryClick: () => void;
}

export function SyncButton({ agency, onConfigClick, onHistoryClick }: SyncButtonProps) {
  const { toast } = useToast();
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      // Build sync config from connector settings
      const connector = agency.agency_connectors?.[0];
      const config = {
        urls: connector?.auth_config?.urls || [agency.website_url],
        extractSchema: {
          projects: connector?.auth_config?.extract_projects !== false,
          resources: connector?.auth_config?.extract_resources !== false,
          news: connector?.auth_config?.extract_news === true
        },
        formats: ['markdown', 'html']
      };

      const result = await FirecrawlService.crawlAgencyData(agency.id, config);
      
      if (result.success) {
        toast({
          title: "Synchronisation réussie",
          description: `${result.totalProcessed || 0} pages traitées, ${result.created || 0} éléments créés`
        });
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
        description: "Impossible de lancer la synchronisation",
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      case 'partial': return 'text-yellow-600';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced': return <RefreshCw className="h-3 w-3 text-green-600" />;
      case 'pending': return <RefreshCw className="h-3 w-3 text-yellow-600 animate-spin" />;
      case 'failed': return <AlertTriangle className="h-3 w-3 text-red-600" />;
      case 'partial': return <AlertTriangle className="h-3 w-3 text-yellow-600" />;
      default: return <RefreshCw className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const hasConnector = agency.agency_connectors && agency.agency_connectors.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8"
          disabled={syncing}
        >
          <>
            {syncing ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-1" />
            ) : (
              getStatusIcon(agency.sync_status)
            )}
            <span className={`ml-1 ${getStatusColor(agency.sync_status)}`}>
              Sync
            </span>
            <ChevronDown className="h-3 w-3 ml-1" />
          </>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSync} disabled={syncing || !hasConnector}>
          <Play className="h-4 w-4 mr-2" />
          {syncing ? "Synchronisation..." : "Synchroniser maintenant"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onConfigClick}>
          <Settings className="h-4 w-4 mr-2" />
          Configuration
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onHistoryClick}>
          <History className="h-4 w-4 mr-2" />
          Historique
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
