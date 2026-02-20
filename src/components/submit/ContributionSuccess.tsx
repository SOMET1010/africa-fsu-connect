import React from 'react';
import { CheckCircle, ArrowRight, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface ContributionSuccessProps {
  type: 'project' | 'practice' | 'resource';
  title: string;
  onNewContribution: () => void;
}

export const ContributionSuccess = ({ type, title, onNewContribution }: ContributionSuccessProps) => {
  const navigate = useNavigate();

  const getTypeLabel = () => {
    switch (type) {
      case 'project': return 'Votre projet';
      case 'practice': return 'Votre bonne pratique';
      case 'resource': return 'Votre ressource';
      default: return 'Votre contribution';
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="py-12 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Merci pour votre contribution !
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {getTypeLabel()} <span className="font-medium text-foreground">"{title}"</span> a été 
            soumis avec succès. L'équipe UDC examinera votre contribution prochainement.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => navigate('/my-contributions')}
            className="gap-2"
          >
            <List className="h-4 w-4" />
            Voir mes contributions
          </Button>
          <Button
            onClick={onNewContribution}
            className="gap-2"
          >
            Partager une autre initiative
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground pt-4">
          Vous recevrez une notification lorsque votre contribution sera publiée.
        </p>
      </CardContent>
    </Card>
  );
};

export default ContributionSuccess;
