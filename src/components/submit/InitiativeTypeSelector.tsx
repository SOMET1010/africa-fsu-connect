import React from 'react';
import { Rocket, Lightbulb, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type InitiativeType = 'project' | 'practice' | 'resource';

interface InitiativeOption {
  id: InitiativeType;
  label: string;
  description: string;
  icon: React.ElementType;
  example: string;
}

const initiativeOptions: InitiativeOption[] = [
  {
    id: 'project',
    label: 'Un projet',
    description: 'Une initiative concrète menée par votre pays',
    icon: Rocket,
    example: 'Ex: Déploiement de connectivité rurale',
  },
  {
    id: 'practice',
    label: 'Une bonne pratique',
    description: 'Une approche qui a fonctionné et peut inspirer',
    icon: Lightbulb,
    example: 'Ex: Méthode de suivi des bénéficiaires',
  },
  {
    id: 'resource',
    label: 'Une ressource',
    description: 'Un document, guide ou outil à partager',
    icon: FileText,
    example: 'Ex: Manuel de procédures, étude',
  },
];

interface InitiativeTypeSelectorProps {
  selected: InitiativeType | null;
  onSelect: (type: InitiativeType) => void;
}

export const InitiativeTypeSelector = ({ selected, onSelect }: InitiativeTypeSelectorProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-foreground text-center">
        Que souhaitez-vous partager ?
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {initiativeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selected === option.id;
          
          return (
            <Card
              key={option.id}
              className={cn(
                'cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50',
                isSelected && 'ring-2 ring-primary border-primary bg-primary/5'
              )}
              onClick={() => onSelect(option.id)}
            >
              <CardContent className="p-6 text-center space-y-3">
                <div className={cn(
                  'inline-flex items-center justify-center w-12 h-12 rounded-full transition-colors',
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground">{option.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {option.description}
                  </p>
                </div>
                
                <p className="text-xs text-muted-foreground/70 italic">
                  {option.example}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default InitiativeTypeSelector;
