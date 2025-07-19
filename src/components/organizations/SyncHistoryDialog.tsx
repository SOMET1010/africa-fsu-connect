
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Clock, AlertTriangle, FileText, Calendar } from "lucide-react";

interface SyncLog {
  id: string;
  started_at: string;
  completed_at?: string;
  status: string;
  sync_type: string;
  records_processed?: number;
  records_created?: number;
  records_updated?: number;
  records_failed?: number;
  duration_ms?: number;
  error_details?: any;
}

interface SyncHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agencyId: string;
  agencyName: string;
}

export function SyncHistoryDialog({ open, onOpenChange, agencyId, agencyName }: SyncHistoryDialogProps) {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(false);

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

      if (error) {
        console.error('Error fetching sync logs:', error);
        return;
      }

      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching sync logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'running':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'running':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDuration = (durationMs?: number) => {
    if (!durationMs) return 'N/A';
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Historique de synchronisation - {agencyName}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh]">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                </div>
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun historique trouvé</h3>
              <p className="text-muted-foreground">
                Aucune synchronisation n'a encore été effectuée pour cette agence.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <span className="font-medium">
                        {log.sync_type === 'manual' ? 'Synchronisation manuelle' : 'Synchronisation automatique'}
                      </span>
                    </div>
                    <Badge variant={getStatusBadgeVariant(log.status)}>
                      {log.status === 'completed' ? 'Terminé' : 
                       log.status === 'running' ? 'En cours' : 
                       log.status === 'failed' ? 'Échec' : log.status}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-4 mb-2">
                      <span>Démarré: {formatDate(log.started_at)}</span>
                      {log.completed_at && (
                        <span>Terminé: {formatDate(log.completed_at)}</span>
                      )}
                      {log.duration_ms && (
                        <span>Durée: {formatDuration(log.duration_ms)}</span>
                      )}
                    </div>
                  </div>

                  {(log.records_processed || log.records_created || log.records_updated || log.records_failed) && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-muted rounded">
                      {log.records_processed !== undefined && (
                        <div className="text-center">
                          <div className="text-lg font-semibold">{log.records_processed}</div>
                          <div className="text-xs text-muted-foreground">Traités</div>
                        </div>
                      )}
                      {log.records_created !== undefined && (
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">{log.records_created}</div>
                          <div className="text-xs text-muted-foreground">Créés</div>
                        </div>
                      )}
                      {log.records_updated !== undefined && (
                        <div className="text-center">
                          <div className="text-lg font-semibold text-blue-600">{log.records_updated}</div>
                          <div className="text-xs text-muted-foreground">Mis à jour</div>
                        </div>
                      )}
                      {log.records_failed !== undefined && log.records_failed > 0 && (
                        <div className="text-center">
                          <div className="text-lg font-semibold text-red-600">{log.records_failed}</div>
                          <div className="text-xs text-muted-foreground">Échecs</div>
                        </div>
                      )}
                    </div>
                  )}

                  {log.error_details && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded">
                      <div className="text-sm font-medium text-red-800 mb-1">Détails de l'erreur:</div>
                      <div className="text-sm text-red-700">
                        {typeof log.error_details === 'string' 
                          ? log.error_details 
                          : JSON.stringify(log.error_details, null, 2)}
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
