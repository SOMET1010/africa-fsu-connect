import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize, 
  Minimize, 
  Download,
  Share2,
  FileText,
  FileJson
} from "lucide-react";
import { exportToPDF, exportToMarkdown, exportToJSON, copyPresentationLink } from "@/lib/presentation-export";
import { exportToPDFAdvanced } from "@/lib/advanced-presentation-export";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PresentationControlsProps {
  isFullscreen: boolean;
  onFullscreenToggle: () => void;
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  sections?: any[];
}

export function PresentationControls({
  isFullscreen,
  onFullscreenToggle,
  currentSection,
  totalSections,
  onPrevious,
  onNext,
  sections = []
}: PresentationControlsProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState('');

  const handleExport = async (format: 'pdf' | 'pdf-advanced' | 'markdown' | 'json') => {
    try {
      switch (format) {
        case 'pdf':
          exportToPDF();
          toast({
            title: "Export PDF",
            description: "Utilisez la fenêtre d'impression pour sauvegarder en PDF",
          });
          break;
        case 'pdf-advanced':
          setIsExporting(true);
          setExportProgress(0);
          setExportStatus('Démarrage...');
          
          await exportToPDFAdvanced((progress) => {
            setExportProgress((progress.current / progress.total) * 100);
            setExportStatus(progress.status);
          });
          
          setIsExporting(false);
          toast({
            title: "Export PDF réussi",
            description: "Votre présentation a été téléchargée avec succès",
          });
          break;
        case 'markdown':
          exportToMarkdown(sections);
          toast({
            title: "Export Markdown",
            description: "Fichier téléchargé avec succès",
          });
          break;
        case 'json':
          exportToJSON(sections, currentSection);
          toast({
            title: "Export JSON",
            description: "Données exportées avec succès",
          });
          break;
      }
    } catch (error) {
      setIsExporting(false);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter la présentation",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'SUTEL Platform Presentation',
          text: 'Découvrez la plateforme qui transforme les télécommunications africaines',
          url: window.location.href,
        });
        toast({
          title: "Partagé",
          description: "Lien partagé avec succès",
        });
      } else {
        await copyPresentationLink(currentSection);
        toast({
          title: "Lien copié",
          description: "Le lien de la présentation a été copié dans le presse-papier",
        });
      }
    } catch (error) {
      // User cancelled or error occurred
    }
  };

  return (
    <>
      {/* Export Progress Dialog */}
      <Dialog open={isExporting} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export PDF en cours</DialogTitle>
            <DialogDescription>
              Génération de votre présentation PDF professionnelle...
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Progress value={exportProgress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              {exportStatus}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <div className={`${isFullscreen ? 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50' : 'sticky top-20 z-30'} bg-card/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg`}>
      <div className="flex items-center justify-between gap-4">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={currentSection === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Précédent</span>
          </Button>

          <Badge variant="secondary" className="px-3 py-1">
            {currentSection + 1} / {totalSections}
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={onNext}
            disabled={currentSection === totalSections - 1}
          >
            <span className="hidden sm:inline mr-1">Suivant</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="hidden md:flex flex-1 mx-4">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSection + 1) / totalSections) * 100}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Partager</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('pdf-advanced')}>
                <FileText className="h-4 w-4 mr-2" />
                Export PDF (Haute Qualité)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <FileText className="h-4 w-4 mr-2" />
                Export PDF (Navigateur)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('markdown')}>
                <FileText className="h-4 w-4 mr-2" />
                Export Markdown
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('json')}>
                <FileJson className="h-4 w-4 mr-2" />
                Export JSON (Data)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={onFullscreenToggle}
          >
            {isFullscreen ? (
              <>
                <Minimize className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Réduire</span>
              </>
            ) : (
              <>
                <Maximize className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Plein écran</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Raccourcis clavier (affiché seulement en mode plein écran) */}
      {isFullscreen && (
        <div className="text-xs text-muted-foreground text-center mt-2 opacity-70">
          <span className="hidden md:inline">
            ← → pour naviguer • Échap pour quitter • F pour plein écran • Espace pour avancer
          </span>
        </div>
      )}
      </div>
    </>
  );
}