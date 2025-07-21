
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, Table } from "lucide-react";
import { useState } from "react";
import type { Project } from "@/types/projects";

interface ProjectExportProps {
  projects: Project[];
}

export const ProjectExport = ({ projects }: ProjectExportProps) => {
  const { toast } = useToast();
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf' | 'csv'>('excel');
  const [exportType, setExportType] = useState<'all' | 'summary' | 'detailed'>('summary');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      // Simuler l'export (en production, cela appellerait une API ou une fonction edge)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Créer les données d'export
      const exportData = projects.map(project => ({
        'Titre': project.title,
        'Agence': project.agencies?.acronym || 'N/A',
        'Pays': project.agencies?.country || 'N/A',
        'Région': project.agencies?.region || 'N/A',
        'Statut': project.status,
        'Budget (USD)': project.budget ? `$${project.budget.toLocaleString()}` : 'N/A',
        'Bénéficiaires': project.beneficiaries?.toLocaleString() || 'N/A',
        'Progression (%)': project.completion_percentage || 0,
        'Date de début': project.start_date || 'N/A',
        'Date de fin': project.end_date || 'N/A',
        'Localisation': project.location || 'N/A'
      }));

      // Simuler le téléchargement
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `projets_fsu_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      toast({
        title: "Export réussi",
        description: `Les données ont été exportées au format ${exportFormat.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'export des données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export des données
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Format d'export</label>
            <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">
                  <div className="flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    Excel (.xlsx)
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    PDF
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    CSV
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Type de rapport</label>
            <Select value={exportType} onValueChange={(value: any) => setExportType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Résumé</SelectItem>
                <SelectItem value="detailed">Détaillé</SelectItem>
                <SelectItem value="all">Complet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {projects.length} projets sélectionnés
          </div>
          <Button 
            onClick={handleExport}
            disabled={loading || projects.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {loading ? 'Export en cours...' : 'Exporter'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
