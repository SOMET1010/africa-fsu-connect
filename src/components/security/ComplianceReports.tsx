import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SecurityApiService } from '@/features/security/services/securityApi';
import { ComplianceReport } from '@/features/security/core/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ComplianceReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [selectedReportType, setSelectedReportType] = useState<string>('gdpr');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    
    const loadReports = async () => {
      try {
        const complianceReports = await SecurityApiService.getComplianceReports(user.id);
        setReports(complianceReports);
      } catch (error) {
        logger.error('Error loading compliance reports:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [user]);

  const handleGenerateReport = async (type: string) => {
    try {
      const newReport = await SecurityApiService.generateComplianceReport(user!.id, type as any, `${type.toUpperCase()} Report ${new Date().toLocaleDateString()}`);
      setReports([newReport, ...reports]);
    } catch (error) {
      logger.error('Error generating report:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'failed':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'pending':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'gdpr':
        return 'GDPR (UE)';
      case 'hipaa':
        return 'HIPAA (Santé)';
      case 'iso27001':
        return 'ISO 27001';
      case 'sox':
        return 'SOX (Sarbanes-Oxley)';
      default:
        return 'Personnalisé';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Génération de rapports de conformité
          </CardTitle>
          <CardDescription>
            Générez des rapports automatisés pour GDPR, HIPAA, ISO27001 et autres normes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gdpr">GDPR (UE)</SelectItem>
                  <SelectItem value="hipaa">HIPAA (Santé)</SelectItem>
                  <SelectItem value="iso27001">ISO 27001</SelectItem>
                  <SelectItem value="sox">SOX</SelectItem>
                  <SelectItem value="custom">Personnalisé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => handleGenerateReport(selectedReportType)}
              disabled={generating}
            >
              <FileText className="h-4 w-4 mr-2" />
              {generating ? 'Génération...' : 'Générer le rapport'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Rapports de conformité générés</CardTitle>
          <CardDescription>
            Historique de vos rapports de conformité
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun rapport généré</p>
              <p className="text-sm">Générez votre premier rapport de conformité</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(report.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{report.title}</p>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getReportTypeLabel(report.report_type)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(report.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                      </p>
                    </div>
                  </div>
                  {report.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceReports;