import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ChevronLeft, ChevronRight, SkipForward } from 'lucide-react';

export function DemoOverlay() {
  const { 
    isDemoMode, 
    demoSteps, 
    currentStepIndex, 
    nextStep, 
    previousStep, 
    disableDemoMode 
  } = useDemoMode();

  const [highlightedElement, setHighlightedElement] = useState<DOMRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const currentStep = demoSteps[currentStepIndex];

  useEffect(() => {
    if (!isDemoMode || !currentStep) return;

    // Find and highlight the target element
    const element = document.querySelector(currentStep.element);
    if (element) {
      const rect = element.getBoundingClientRect();
      setHighlightedElement(rect);

      // Calculate tooltip position
      const windowHeight = window.innerHeight;
      const tooltipHeight = 200; // Approximate
      
      let top = rect.bottom + 20;
      let left = rect.left;

      // If tooltip would go off bottom, position above element
      if (top + tooltipHeight > windowHeight) {
        top = rect.top - tooltipHeight - 20;
      }

      // Keep tooltip within viewport horizontally
      const tooltipWidth = 400;
      if (left + tooltipWidth > window.innerWidth) {
        left = window.innerWidth - tooltipWidth - 20;
      }

      setTooltipPosition({ top, left });

      // Scroll element into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Execute step action if defined
      if (currentStep.action) {
        setTimeout(() => currentStep.action?.(), 500);
      }
    }
  }, [isDemoMode, currentStep, currentStepIndex]);

  if (!isDemoMode || !currentStep) return null;

  const progress = ((currentStepIndex + 1) / demoSteps.length) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 demo-overlay"
        style={{ pointerEvents: 'none' }}
      >
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Spotlight on highlighted element */}
        {highlightedElement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute"
            style={{
              top: highlightedElement.top - 8,
              left: highlightedElement.left - 8,
              width: highlightedElement.width + 16,
              height: highlightedElement.height + 16,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              border: '3px solid hsl(var(--primary))',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            pointerEvents: 'auto',
          }}
          className="absolute w-[400px] max-w-[90vw]"
        >
          <Card className="p-6 shadow-2xl demo-tooltip">
            <div className="flex items-start justify-between mb-4">
              <Badge variant="secondary" className="text-sm">
                Étape {currentStepIndex + 1} / {demoSteps.length}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={disableDemoMode}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <h3 className="text-xl font-bold mb-3">{currentStep.title}</h3>
            <p className="text-muted-foreground mb-6">{currentStep.description}</p>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={previousStep}
                disabled={currentStepIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Précédent
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={disableDemoMode}
                >
                  <SkipForward className="h-4 w-4 mr-1" />
                  Passer
                </Button>

                {currentStepIndex === demoSteps.length - 1 ? (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={disableDemoMode}
                  >
                    Terminer
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={nextStep}
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
