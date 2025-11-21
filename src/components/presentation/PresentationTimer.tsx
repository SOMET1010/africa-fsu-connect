import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Pause, Play, RotateCcw } from 'lucide-react';

interface PresentationTimerProps {
  duration: number; // minutes
  onComplete?: () => void;
}

export const PresentationTimer = ({ duration, onComplete }: PresentationTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused, timeLeft, onComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getColorClass = (): string => {
    const percentage = (timeLeft / (duration * 60)) * 100;
    if (percentage > 50) return 'text-green-500';
    if (percentage > 20) return 'text-orange-500';
    return 'text-red-500';
  };

  const handleReset = () => {
    setTimeLeft(duration * 60);
    setIsRunning(false);
    setIsPaused(false);
  };

  const handleToggle = () => {
    if (isRunning) {
      setIsPaused(!isPaused);
    } else {
      setIsRunning(true);
    }
  };

  return (
    <Card className="p-4 inline-flex items-center gap-4">
      <Clock className="h-5 w-5 text-muted-foreground" />
      <div className={`text-2xl font-bold font-mono ${getColorClass()}`}>
        {formatTime(timeLeft)}
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={handleToggle}>
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </Button>
        <Button size="sm" variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
