import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface WelcomeMessageProps {
  show: boolean;
  onDismiss: () => void;
}

export function WelcomeMessage({ show, onDismiss }: WelcomeMessageProps) {
  if (!show) return null;

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-green-800">Configuration terminée !</h3>
            <p className="text-green-700 text-sm">
              Votre espace de travail a été personnalisé selon vos préférences. 
              Explorez vos nouvelles fonctionnalités ci-dessous.
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDismiss}
            className="text-green-700 hover:bg-green-100"
          >
            ×
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}