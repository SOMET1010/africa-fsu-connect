import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { DemoStep } from '../types/demo-types';

interface DemoSidebarProps {
  currentStep: DemoStep;
  completedSteps: string[];
  totalSteps: number;
  remainingTime: number;
}

export function DemoSidebar({ 
  currentStep, 
  completedSteps, 
  totalSteps, 
  remainingTime 
}: DemoSidebarProps) {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Message de l'assistant
        </h3>
        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
          {currentStep.assistantMessage}
        </p>
      </Card>

      <Card className="p-4">
        <h3 className="font-medium text-foreground mb-3">Contexte Marie Diallo</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pays :</span>
            <span className="font-medium">Cameroun</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Organisation :</span>
            <span className="font-medium">ART Cameroun</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rôle :</span>
            <span className="font-medium">Analyste Senior</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Expérience :</span>
            <span className="font-medium">Intermédiaire</span>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-medium text-foreground mb-3">Progression</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Étapes complétées :</span>
            <span className="font-medium">{completedSteps.length}/{totalSteps}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Temps estimé restant :</span>
            <span className="font-medium">{remainingTime} min</span>
          </div>
        </div>
      </Card>
    </div>
  );
}