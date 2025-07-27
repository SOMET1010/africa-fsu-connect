import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
} from 'lucide-react';

interface DemoNavigationProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  progress: number;
  currentStep: number;
  totalSteps: number;
}

export function DemoNavigation({
  isPlaying,
  onTogglePlay,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  progress,
  currentStep,
  totalSteps
}: DemoNavigationProps) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={!canGoPrevious}
      >
        <SkipBack className="w-4 h-4" />
      </Button>
      
      <Button
        variant={isPlaying ? "destructive" : "default"}
        size="sm"
        onClick={onTogglePlay}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={!canGoNext}
      >
        <SkipForward className="w-4 h-4" />
      </Button>
      
      <div className="flex-1">
        <Progress value={progress} className="h-2" />
      </div>
      
      <span className="text-sm text-muted-foreground">
        {currentStep + 1}/{totalSteps}
      </span>
    </div>
  );
}