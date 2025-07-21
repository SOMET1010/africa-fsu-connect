
import React from "react";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DocumentPreviewDialogProps {
  document: any;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (doc: any) => void;
}

const DocumentPreviewDialog = ({ document, isOpen, onClose, onDownload }: DocumentPreviewDialogProps) => {
  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {document.title}
          </DialogTitle>
          <DialogDescription>
            {document.description}
          </DialogDescription>
        </DialogHeader>
        <div className="bg-muted/50 rounded-lg p-8 text-center space-y-4">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
          <div>
            <p className="text-lg font-medium mb-2">Aperçu du document</p>
            <p className="text-muted-foreground mb-4">
              L'aperçu intégré sera bientôt disponible. En attendant, vous pouvez télécharger le document.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground max-w-md mx-auto">
              <div>Type: {document.document_type}</div>
              <div>Pays: {document.country || 'N/A'}</div>
              <div>Taille: {document.file_size ? `${Math.round(document.file_size / 1024)} KB` : 'N/A'}</div>
              <div>Téléchargements: {document.download_count || 0}</div>
            </div>
          </div>
          <div className="flex justify-center gap-3 pt-4">
            <Button onClick={() => onDownload(document)}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;
