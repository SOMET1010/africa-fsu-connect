
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock,
  Activity,
  Database,
  AlertTriangle
} from "lucide-react";

interface SyncHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agencyId: string;
  agencyName: string;
}

interface SyncLog {
  id: string;
  sync_type: string;
  status: string;
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
  records_processed?: number;
  records_created?: number;
  records_updated?: number;
  records_failed?: number;
  error_details?: any;
}

export function SyncHistoryDialog({ open, onOpenChange, agencyId, agencyName }: SyncHistoryDialogProps) {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && agencyId) {
      fetchSyncLogs();
    }
  }, [open, agencyId]);

  const fetchSyncLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sync_logs')
        .select('*')
        .eq('agency_id', agencyId)
        .order('started_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching sync logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Réussi</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Échec</Badge>;
      case 'partial':
        return <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />Partiel</Badge>;
      case 'running':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />En cours</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return 'N/A';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy à HH:mm', { locale: fr });
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Historique de synchronisation - {agencyName}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Activity className="h-8 w-8 animate-pulse mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Historique de synchronisation - {agencyName}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh]">
          {logs.length === 0 ? (
            <div className="text-center py-8">
              <Database className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Aucune synchronisation trouvée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusBadge(log.status)}
                      <span className="text-sm text-muted-foreground">
                        {log.sync_type === 'firecrawl' ? 'Firecrawl' : log.sync_type}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(log.started_at)}
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center p-2 bg-muted rounded">
                      <div className="font-medium">{log.records_processed || 0}</div>
                      <div className="text-muted-foreground">Traités</div>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <div className="font-medium text-success">{log.records_created || 0}</div>
                      <div className="text-muted-foreground">Créés</div>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <div className="font-medium text-warning">{log.records_updated || 0}</div>
                      <div className="text-muted-foreground">Mis à jour</div>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <div className="font-medium text-destructive">{log.records_failed || 0}</div>
                      <div className="text-muted-foreground">Échecs</div>
                    </div>
                  </div>

                  {/* Duration and completion */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      Durée: {formatDuration(log.duration_ms)}
                    </span>
                    {log.completed_at && (
                      <span>
                        Terminé: {formatDate(log.completed_at)}
                      </span>
                    )}
                  </div>

                  {/* Error details */}
                  {log.error_details && (
                    <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <span className="font-medium text-destructive">Erreurs détectées</span>
                      </div>
                      <div className="text-sm">
                        {log.error_details.error && (
                          <p className="mb-2">{log.error_details.error}</p>
                        )}
                        {log.error_details.errors && Array.isArray(log.error_details.errors) && (
                          <div className="space-y-1">
                            {log.error_details.errors.slice(0, 3).map((error: any, index: number) => (
                              <div key={index} className="text-xs">
                                <span className="font-mono">{error.url}</span>: {error.error}
                              </div>
                            ))}
                            {log.error_details.errors.length > 3 && (
                              <div className="text-xs italic">
                                ... et {log.error_details.errors.length - 3} autres erreurs
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
