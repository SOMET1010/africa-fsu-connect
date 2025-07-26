import React, { useEffect, useRef } from 'react';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Download } from 'lucide-react';

export const HeatmapOverlay = () => {
  const { 
    isRecording, 
    setIsRecording, 
    renderHeatmap, 
    exportAnalytics,
    canvasRef,
    stats
  } = useAdvancedAnalytics();

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(renderHeatmap, 1000);
      return () => clearInterval(interval);
    }
  }, [isRecording, renderHeatmap]);

  return (
    <>
      {/* Heatmap Canvas */}
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 pointer-events-none z-50 ${
          isRecording ? 'opacity-30' : 'opacity-0'
        } transition-opacity duration-300`}
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* Controls */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <div className="text-xs text-muted-foreground mb-2">
            Analytics: {stats.totalInteractions} interactions
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={isRecording ? "default" : "outline"}
              onClick={() => setIsRecording(!isRecording)}
            >
              {isRecording ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {isRecording ? 'Hide' : 'Show'} Heatmap
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={exportAnalytics}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};