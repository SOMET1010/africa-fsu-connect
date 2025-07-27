import { useState, useMemo } from 'react';
import { DemoStep } from '../types/demo-types';
import { demoStepsData } from '../data/demo-steps-data';

export function useDemoSteps() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const totalDuration = useMemo(() => 
    demoStepsData.reduce((acc, step) => acc + step.duration, 0), 
    []
  );

  const progress = useMemo(() => 
    ((currentStep + 1) / demoStepsData.length) * 100, 
    [currentStep]
  );

  const currentStepData = useMemo(() => 
    demoStepsData[currentStep], 
    [currentStep]
  );

  const handleNext = () => {
    if (currentStep < demoStepsData.length - 1) {
      if (!completedSteps.includes(demoStepsData[currentStep].id)) {
        setCompletedSteps(prev => [...prev, demoStepsData[currentStep].id]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };

  return {
    currentStep,
    completedSteps,
    demoSteps: demoStepsData,
    totalDuration,
    progress,
    currentStepData,
    handleNext,
    handlePrevious,
    handleStepClick,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === demoStepsData.length - 1,
  };
}