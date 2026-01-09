import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle } from 'lucide-react';

interface ConfigSectionProps {
  title: string;
  description: string;
  icon: ReactNode;
  isComplete?: boolean;
  children: ReactNode;
}

export const ConfigSection = ({ 
  title, 
  description, 
  icon, 
  isComplete = false,
  children 
}: ConfigSectionProps) => {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
            </div>
          </div>
          <Badge 
            variant={isComplete ? "default" : "secondary"}
            className={isComplete ? "bg-green-500/10 text-green-600 border-green-500/20" : ""}
          >
            {isComplete ? (
              <><CheckCircle2 className="h-3 w-3 mr-1" /> Complet</>
            ) : (
              <><Circle className="h-3 w-3 mr-1" /> À compléter</>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};
