import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize, 
  Minimize, 
  Download,
  Share2,
  Play,
  Pause
} from "lucide-react";

interface PresentationControlsProps {
  isFullscreen: boolean;
  onFullscreenToggle: () => void;
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function PresentationControls({
  isFullscreen,
  onFullscreenToggle,
  currentSection,
  totalSections,
  onPrevious,
  onNext
}: PresentationControlsProps) {
  const handleExport = () => {
    // Logique d'export PDF/PowerPoint
    console.log("Export presentation");
  };

  const handleShare = () => {
    // Logique de partage
    if (navigator.share) {
      navigator.share({
        title: 'SUTEL Platform Presentation',
        text: 'Découvrez la plateforme qui transforme les télécommunications africaines',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
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

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Export</span>
          </Button>

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
            Utilisez ← → pour naviguer • Échap pour quitter • F pour plein écran
          </span>
        </div>
      )}
    </div>
  );
}