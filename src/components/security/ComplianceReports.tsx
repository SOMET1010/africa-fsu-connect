import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  FileText,
  Download,
  Shield,
  Eye,
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Users,
  Database
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ComplianceReport {
  id: string;
  type: 'gdpr' | 'ccpa' | 'iso27001' | 'sox' | 'custom';
  title: string;
  status: 'compliant' | 'non_compliant' | 'warning' | 'pending';
  score: number;
  generated_at: string;
  period_start: string;
  period_end: string;
  details: any;
}

interface DataProcessingRecord {
  id: string;
  purpose: string;
  data_types: string[];
  retention_period: number;
  legal_basis: string;
  third_parties: string[];
  created_at: string;
}

const ComplianceReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [dataRecords, setDataRecords] = useState<DataProcessingRecord[]>([]);
  const [selectedReportType, setSelectedReportType] = useState<string>('gdpr');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [loading, setLoading] = useState(false); // Désactivé temporairement
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    // Temporairement désactivé - en attente des tables de base de données
    setLoading(false);
  }, [user]);

  const fetchComplianceData = async () => {
    // Temporairement désactivé - en attente des tables de base de données
    console.log('Compliance data fetching temporarily disabled - waiting for database migration');
  };

  const generateReport = async () => {
    if (!user?.id) return;

    setGenerating(true);
    try {
      const response = await supabase.functions.invoke('generate-compliance-report', {
        body: {
          userId: user.id,
          reportType: selectedReportType,
          periodStart: dateRange.from.toISOString(),
          periodEnd: dateRange.to.toISOString()
        }
      });

      if (response.error) throw response.error;

      fetchComplianceData();
    } catch (error: any) {
      console.error('Error generating report:', error);
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = async (reportId: string) => {
    try {
      const response = await supabase.functions.invoke('export-compliance-report', {
        body: { reportId, userId: user?.id }
      });

      if (response.error) throw response.error;

      const blob = new Blob([response.data.pdf], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compliance-report-${reportId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading report:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'non_compliant':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'non_compliant':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'warning':
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
      case 'ccpa':
        return 'CCPA (Californie)';
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
            Générez des rapports automatisés pour GDPR, CCPA, ISO27001 et autres normes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de rapport</label>
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gdpr">GDPR (UE)</SelectItem>
                  <SelectItem value="ccpa">CCPA (Californie)</SelectItem>
                  <SelectItem value="iso27001">ISO 27001</SelectItem>
                  <SelectItem value="sox">SOX</SelectItem>
                  <SelectItem value="custom">Personnalisé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Période (début)</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {format(dateRange.from, 'dd/MM/yyyy', { locale: fr })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => date && setDateRange({ ...dateRange, from: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Période (fin)</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {format(dateRange.to, 'dd/MM/yyyy', { locale: fr })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => date && setDateRange({ ...dateRange, to: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button
            onClick={generateReport}
            disabled={generating}
            className="w-full"
          >
            <FileText className="h-4 w-4 mr-2" />
            {generating ? 'Génération en cours...' : 'Générer le rapport'}
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
          <TabsTrigger value="data-processing">Traitement des données</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>

        {/* Reports Tab */}
        <TabsContent value="reports">
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
                            {getReportTypeLabel(report.type)} • Score: {report.score}/100
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(report.generated_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReport(report.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Processing Tab */}
        <TabsContent value="data-processing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Registre des traitements
              </CardTitle>
              <CardDescription>
                Registre des activités de traitement des données personnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dataRecords.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun traitement enregistré</p>
                  <p className="text-sm">Ajoutez vos activités de traitement des données</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dataRecords.map((record) => (
                    <div key={record.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{record.purpose}</h4>
                        <Badge variant="outline">
                          {record.legal_basis}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <p><strong>Types de données:</strong> {record.data_types.join(', ')}</p>
                          <p><strong>Rétention:</strong> {record.retention_period} jours</p>
                        </div>
                        <div>
                          <p><strong>Tiers:</strong> {record.third_parties.join(', ') || 'Aucun'}</p>
                          <p><strong>Créé:</strong> {format(new Date(record.created_at), 'dd/MM/yyyy', { locale: fr })}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Conformité moyenne</p>
                    <p className="text-2xl font-bold">
                      {reports.length > 0 
                        ? Math.round(reports.reduce((acc, r) => acc + r.score, 0) / reports.length)
                        : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rapports générés</p>
                    <p className="text-2xl font-bold">{reports.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Traitements actifs</p>
                    <p className="text-2xl font-bold">{dataRecords.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert className="mt-4">
            <BarChart3 className="h-4 w-4" />
            <AlertDescription>
              Les statistiques sont mises à jour automatiquement lors de la génération de nouveaux rapports.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceReports;