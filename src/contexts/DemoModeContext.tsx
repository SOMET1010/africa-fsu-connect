import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DemoStep {
  element: string;
  title: string;
  description: string;
  action?: () => void;
}

interface DemoModeContextType {
  isDemoMode: boolean;
  currentModule: string | null;
  demoSteps: DemoStep[];
  currentStepIndex: number;
  enableDemoMode: (module: string, steps: DemoStep[]) => void;
  disableDemoMode: () => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (index: number) => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const [demoSteps, setDemoSteps] = useState<DemoStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Restore demo mode from localStorage
    const savedDemo = localStorage.getItem('sutel_demo_mode');
    if (savedDemo) {
      try {
        const { module, steps, stepIndex } = JSON.parse(savedDemo);
        setIsDemoMode(true);
        setCurrentModule(module);
        setDemoSteps(steps);
        setCurrentStepIndex(stepIndex);
      } catch (e) {
        localStorage.removeItem('sutel_demo_mode');
      }
    }
  }, []);

  const enableDemoMode = (module: string, steps: DemoStep[]) => {
    setIsDemoMode(true);
    setCurrentModule(module);
    setDemoSteps(steps);
    setCurrentStepIndex(0);
    
    localStorage.setItem('sutel_demo_mode', JSON.stringify({
      module,
      steps,
      stepIndex: 0
    }));
  };

  const disableDemoMode = () => {
    setIsDemoMode(false);
    setCurrentModule(null);
    setDemoSteps([]);
    setCurrentStepIndex(0);
    localStorage.removeItem('sutel_demo_mode');
  };

  const nextStep = () => {
    if (currentStepIndex < demoSteps.length - 1) {
      const newIndex = currentStepIndex + 1;
      setCurrentStepIndex(newIndex);
      
      localStorage.setItem('sutel_demo_mode', JSON.stringify({
        module: currentModule,
        steps: demoSteps,
        stepIndex: newIndex
      }));
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      const newIndex = currentStepIndex - 1;
      setCurrentStepIndex(newIndex);
      
      localStorage.setItem('sutel_demo_mode', JSON.stringify({
        module: currentModule,
        steps: demoSteps,
        stepIndex: newIndex
      }));
    }
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < demoSteps.length) {
      setCurrentStepIndex(index);
      
      localStorage.setItem('sutel_demo_mode', JSON.stringify({
        module: currentModule,
        steps: demoSteps,
        stepIndex: index
      }));
    }
  };

  return (
    <DemoModeContext.Provider
      value={{
        isDemoMode,
        currentModule,
        demoSteps,
        currentStepIndex,
        enableDemoMode,
        disableDemoMode,
        nextStep,
        previousStep,
        goToStep,
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
}
