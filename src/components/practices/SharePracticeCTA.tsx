import { Button } from "@/components/ui/button";
import { Share2, ArrowRight } from "lucide-react";

export function SharePracticeCTA() {
  return (
    <div className="py-8 border-t mt-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-muted">
            <Share2 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">Vous avez une expérience à partager ?</p>
            <p className="text-sm text-muted-foreground">
              Contribuez au réseau en partageant vos réussites.
            </p>
          </div>
        </div>

        <Button variant="outline">
          Proposer une pratique
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
