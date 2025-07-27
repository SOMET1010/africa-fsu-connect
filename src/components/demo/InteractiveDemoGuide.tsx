import { Card } from '@/components/ui/card';
import { useDemoSteps } from './hooks/useDemoSteps';
import { useDemoNavigation } from './hooks/useDemoNavigation';
import { DemoHeader } from './components/DemoHeader';
import { DemoNavigation } from './components/DemoNavigation';
import { DemoTimeline } from './components/DemoTimeline';
import { DemoStepCard } from './components/DemoStepCard';
import { DemoSidebar } from './components/DemoSidebar';
import { DemoExportService } from './services/demoExportService';

export function InteractiveDemoGuide() {
  const {
    currentStep,
    completedSteps,
    demoSteps,
    totalDuration,
    progress,
    currentStepData,
    handleNext,
    handlePrevious,
    handleStepClick,
    isFirstStep,
    isLastStep,
  } = useDemoSteps();

  const { isPlaying, togglePlaying } = useDemoNavigation();

  const remainingTime = demoSteps
    .slice(currentStep)
    .reduce((acc, step) => acc + step.duration, 0);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* En-tête de contrôle */}
      <Card className="p-6">
        <DemoHeader
          isPlaying={isPlaying}
          onTogglePlay={togglePlaying}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoNext={!isLastStep}
          canGoPrevious={!isFirstStep}
          progress={progress}
          currentStep={currentStep}
          totalSteps={demoSteps.length}
          totalDuration={totalDuration}
          onExportPDF={() => DemoExportService.exportToPDF()}
        />
        
        <DemoNavigation
          isPlaying={isPlaying}
          onTogglePlay={togglePlaying}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoNext={!isLastStep}
          canGoPrevious={!isFirstStep}
          progress={progress}
          currentStep={currentStep}
          totalSteps={demoSteps.length}
        />

        <DemoTimeline
          steps={demoSteps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />
      </Card>

      {/* Contenu de l'étape actuelle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DemoStepCard 
          step={currentStepData} 
          stepNumber={currentStep + 1} 
        />

        <DemoSidebar
          currentStep={currentStepData}
          completedSteps={completedSteps}
          totalSteps={demoSteps.length}
          remainingTime={remainingTime}
        />
      </div>
    </div>
  );
}