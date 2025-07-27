import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Clock, 
  Download
} from 'lucide-react';

interface DemoHeaderProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  progress: number;
  currentStep: number;
  totalSteps: number;
  totalDuration: number;
  onExportPDF: () => void;
}

export function DemoHeader({
  isPlaying,
  onTogglePlay,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  progress,
  currentStep,
  totalSteps,
  totalDuration,
  onExportPDF
}: DemoHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Guide de Démonstration Interactive</h1>
        <p className="text-muted-foreground">Plateforme SUTEL - Scénario Marie Diallo</p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onExportPDF} size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {totalDuration} min
        </Badge>
      </div>
    </div>
  );
}