import { CheckCircle } from 'lucide-react';
import { DemoStep } from '../types/demo-types';

interface DemoTimelineProps {
  steps: DemoStep[];
  currentStep: number;
  completedSteps: string[];
  onStepClick: (index: number) => void;
}

export function DemoTimeline({ 
  steps, 
  currentStep, 
  completedSteps, 
  onStepClick 
}: DemoTimelineProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {steps.map((step, index) => (
        <button
          key={step.id}
          onClick={() => onStepClick(index)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm whitespace-nowrap transition-colors ${
            index === currentStep
              ? 'bg-primary text-primary-foreground'
              : completedSteps.includes(step.id)
              ? 'bg-success/10 text-success'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {completedSteps.includes(step.id) ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <step.icon className="w-4 h-4" />
          )}
          {step.title}
        </button>
      ))}
    </div>
  );
}