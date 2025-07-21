
import React from "react";
import { FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyDocumentsStateProps {
  onShowAll: () => void;
}

const EmptyDocumentsState = ({ onShowAll }: EmptyDocumentsStateProps) => {
  return (
    <div className="text-center py-16">
      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-xl font-medium mb-2">Aucun document trouvé</h3>
      <p className="text-muted-foreground mb-6">
        Aucun document ne correspond à vos critères de recherche.
      </p>
      <Button onClick={onShowAll} variant="outline">
        <Search className="h-4 w-4 mr-2" />
        Voir tous les documents
      </Button>
    </div>
  );
};

export default EmptyDocumentsState;
