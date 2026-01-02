import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, ArrowRight } from "lucide-react";

export function SharePracticeCTA() {
  return (
    <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="p-8 text-center">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
          <Share2 className="h-6 w-6 text-primary" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">
          Vous avez une bonne pratique à partager ?
        </h3>
        
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Contribuez au réseau en partageant vos expériences réussies. 
          Vos pairs peuvent bénéficier de vos apprentissages.
        </p>

        <Button size="lg">
          Proposer une pratique
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
