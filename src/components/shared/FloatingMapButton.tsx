
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LeafletInteractiveMap } from "@/components/organizations/LeafletInteractiveMap";
import { useAgencies } from "@/hooks/useAgencies";
import { Globe, X } from "lucide-react";
import { Link } from "react-router-dom";

export const FloatingMapButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { agencies } = useAgencies();

  const sutelAgencies = agencies.filter(agency => 
    agency.metadata && 
    typeof agency.metadata === 'object' && 
    'sutel_type' in agency.metadata && 
    agency.metadata.sutel_type
  );

  return (
    <>
      {/* Bouton flottant */}
      <div className="fixed bottom-24 right-6 z-40 md:bottom-6">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
        >
          <Globe className="h-6 w-6" />
        </Button>
      </div>

      {/* Modal avec carte */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Carte Interactive SUTEL - Aperçu rapide
              </div>
              <div className="flex items-center gap-2">
                <Link 
                  to="/map" 
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-primary hover:underline"
                >
                  Voir en plein écran →
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="h-[70vh] -mx-6 -mb-6">
            <LeafletInteractiveMap agencies={sutelAgencies} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
