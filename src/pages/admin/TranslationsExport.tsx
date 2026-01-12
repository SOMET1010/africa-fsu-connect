import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileSpreadsheet, 
  FileJson, 
  FileText, 
  Languages,
  CheckCircle,
  AlertCircle,
  Globe
} from 'lucide-react';
import { TranslationsTable } from '@/components/admin/TranslationsTable';
import { 
  buildTranslationData, 
  getTranslationStats, 
  exportToExcel, 
  exportToCSV, 
  exportToJSON,
  type TranslationRow,
  type TranslationStats 
} from '@/utils/export-translations';
import { toast } from 'sonner';

const TranslationsExport = () => {
  const [data, setData] = useState<TranslationRow[]>([]);
  const [stats, setStats] = useState<TranslationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load translation data
    const translationData = buildTranslationData();
    const translationStats = getTranslationStats();
    setData(translationData);
    setStats(translationStats);
    setIsLoading(false);
  }, []);

  const handleExportExcel = () => {
    try {
      exportToExcel();
      toast.success('Export Excel réussi', {
        description: 'Le fichier Excel a été téléchargé avec succès.',
      });
    } catch (error) {
      toast.error('Erreur lors de l\'export Excel');
    }
  };

  const handleExportCSV = () => {
    try {
      exportToCSV();
      toast.success('Export CSV réussi', {
        description: 'Le fichier CSV a été téléchargé avec succès.',
      });
    } catch (error) {
      toast.error('Erreur lors de l\'export CSV');
    }
  };

  const handleExportJSON = () => {
    try {
      exportToJSON();
      toast.success('Export JSON réussi', {
        description: 'Le fichier JSON a été téléchargé avec succès.',
      });
    } catch (error) {
      toast.error('Erreur lors de l\'export JSON');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Languages className="h-8 w-8 text-primary" />
            Export des Traductions
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez et exportez toutes les traductions de la plateforme SUTEL
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleExportExcel} className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Export Excel
          </Button>
          <Button onClick={handleExportCSV} variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={handleExportJSON} variant="outline" className="gap-2">
            <FileJson className="h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total des clés</CardDescription>
              <CardTitle className="text-3xl">{stats.totalKeys}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Clés de traduction uniques</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <span>🇫🇷</span> Français
              </CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {stats.frPercentage}%
                {stats.frPercentage === 100 && <CheckCircle className="h-5 w-5 text-green-500" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={stats.frPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{stats.frCount} / {stats.totalKeys}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <span>🇬🇧</span> Anglais
              </CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {stats.enPercentage}%
                {stats.enPercentage === 100 && <CheckCircle className="h-5 w-5 text-green-500" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={stats.enPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{stats.enCount} / {stats.totalKeys}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <span>🇵🇹</span> Portugais
              </CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {stats.ptPercentage}%
                {stats.ptPercentage < 100 && <AlertCircle className="h-5 w-5 text-orange-500" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={stats.ptPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{stats.ptCount} / {stats.totalKeys}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <span>🇸🇦</span> Arabe
              </CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {stats.arPercentage}%
                {stats.arPercentage < 100 && <AlertCircle className="h-5 w-5 text-orange-500" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={stats.arPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{stats.arCount} / {stats.totalKeys}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            <Globe className="h-4 w-4" />
            Toutes ({data.length})
          </TabsTrigger>
          <TabsTrigger value="incomplete" className="gap-2">
            <AlertCircle className="h-4 w-4" />
            Incomplètes ({data.filter(d => d.completeness < 100).length})
          </TabsTrigger>
          <TabsTrigger value="complete" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Complètes ({data.filter(d => d.completeness === 100).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les traductions</CardTitle>
              <CardDescription>
                Vue complète de toutes les clés de traduction avec les 4 langues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TranslationsTable data={data} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incomplete">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Traductions incomplètes
              </CardTitle>
              <CardDescription>
                Clés qui nécessitent une traduction dans au moins une langue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TranslationsTable data={data.filter(d => d.completeness < 100)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complete">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Traductions complètes
              </CardTitle>
              <CardDescription>
                Clés traduites dans les 4 langues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TranslationsTable data={data.filter(d => d.completeness === 100)} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="h-5 w-5" />
            Instructions pour l'équipe communication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Badge variant="outline">Excel (.xlsx)</Badge>
              <p className="text-sm text-muted-foreground">
                Format recommandé pour la révision et l'édition. Inclut 3 feuilles : Traductions, Statistiques, Clés manquantes.
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="outline">CSV</Badge>
              <p className="text-sm text-muted-foreground">
                Format simple pour import dans d'autres outils. Compatible avec Google Sheets et Excel.
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="outline">JSON</Badge>
              <p className="text-sm text-muted-foreground">
                Format technique pour les développeurs. Inclut les statistiques et métadonnées.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranslationsExport;
