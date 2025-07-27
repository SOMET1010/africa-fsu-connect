import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DemoStep } from '../types/demo-types';

interface DemoStepCardProps {
  step: DemoStep;
  stepNumber: number;
}

export function DemoStepCard({ step, stepNumber }: DemoStepCardProps) {
  const IconComponent = step.icon;

  return (
    <Card className="lg:col-span-2 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <IconComponent className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{step.title}</h2>
          <p className="text-sm text-muted-foreground">
            Étape {stepNumber} • {step.duration} minutes • Route: {step.route}
          </p>
        </div>
      </div>

      <p className="text-foreground mb-6">{step.description}</p>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-foreground mb-2">Actions à réaliser :</h3>
          <ul className="space-y-2">
            {step.actions.map((action, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium mt-0.5">
                  {index + 1}
                </span>
                {action}
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium text-foreground mb-2">Points clés à souligner :</h3>
          <ul className="space-y-1">
            {step.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}