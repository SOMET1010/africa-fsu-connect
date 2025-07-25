import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, ArrowLeft, ArrowRight, Save, Send, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormStep {
  id: string;
  title: string;
  description: string;
  required: boolean;
  completed: boolean;
  fields: string[];
}

interface ProgressiveFormProps {
  steps: FormStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onSave: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
  formData: Record<string, any>;
  validationErrors: Record<string, string[]>;
  canSubmit: boolean;
  autoSaveStatus?: {
    status: 'idle' | 'saving' | 'saved' | 'error';
    lastSaved?: Date;
  };
}

export const ProgressiveForm: React.FC<ProgressiveFormProps> = ({
  steps,
  currentStep,
  onStepChange,
  onSave,
  onSubmit,
  children,
  formData,
  validationErrors,
  canSubmit,
  autoSaveStatus,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Calculate progress
  const progress = (completedSteps.size / steps.length) * 100;

  // Check if current step is valid
  const currentStepErrors = steps[currentStep]?.fields
    .flatMap(field => validationErrors[field] || [])
    .filter(Boolean);

  const isCurrentStepValid = currentStepErrors.length === 0;

  // Update completed steps based on form data
  useEffect(() => {
    const newCompletedSteps = new Set<number>();
    
    steps.forEach((step, index) => {
      const hasRequiredFields = step.fields.some(field => {
        const value = formData[field];
        return value && value !== '' && (!Array.isArray(value) || value.length > 0);
      });
      
      if (hasRequiredFields) {
        newCompletedSteps.add(index);
      }
    });
    
    setCompletedSteps(newCompletedSteps);
  }, [formData, steps]);

  const canGoToStep = (stepIndex: number) => {
    if (stepIndex <= currentStep) return true;
    if (stepIndex === currentStep + 1 && isCurrentStepValid) return true;
    return false;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1 && isCurrentStepValid) {
      onStepChange(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const getStepStatus = (stepIndex: number) => {
    if (completedSteps.has(stepIndex)) return 'completed';
    if (stepIndex === currentStep) return 'current';
    if (canGoToStep(stepIndex)) return 'available';
    return 'locked';
  };

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {steps[currentStep]?.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {steps[currentStep]?.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                Étape {currentStep + 1} sur {steps.length}
              </div>
              <div className="text-xs text-muted-foreground">
                {Math.round(progress)}% complété
              </div>
            </div>
          </div>
          
          <Progress value={progress} className="mt-4" />
          
          {/* Auto-save Status */}
          {autoSaveStatus && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
              {autoSaveStatus.status === 'saving' && (
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                  Sauvegarde en cours...
                </div>
              )}
              {autoSaveStatus.status === 'saved' && autoSaveStatus.lastSaved && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  Sauvegardé {formatLastSaved(autoSaveStatus.lastSaved)}
                </div>
              )}
              {autoSaveStatus.status === 'error' && (
                <div className="flex items-center gap-1 text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  Erreur de sauvegarde
                </div>
              )}
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Steps Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <button
                  key={step.id}
                  onClick={() => canGoToStep(index) && onStepChange(index)}
                  disabled={!canGoToStep(index)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                    status === 'current' && "bg-primary text-primary-foreground",
                    status === 'completed' && "bg-green-100 text-green-800 hover:bg-green-200",
                    status === 'available' && "bg-muted hover:bg-muted/80",
                    status === 'locked' && "bg-muted/50 text-muted-foreground cursor-not-allowed opacity-50"
                  )}
                >
                  {status === 'completed' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                  <span>{step.title}</span>
                  {step.required && (
                    <Badge variant="secondary" className="text-xs">
                      Requis
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardContent className="pt-6">
          {children}
          
          {/* Validation Errors */}
          {currentStepErrors.length > 0 && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive text-sm font-medium mb-2">
                <AlertCircle className="h-4 w-4" />
                Erreurs à corriger :
              </div>
              <ul className="text-sm text-destructive space-y-1">
                {currentStepErrors.map((error, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="inline-block w-1 h-1 bg-destructive rounded-full mt-2 flex-shrink-0" />
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Footer */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={onSave}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Sauvegarder
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!isCurrentStepValid}
                >
                  Suivant
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={onSubmit}
                  disabled={!canSubmit || !isCurrentStepValid}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Soumettre
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};