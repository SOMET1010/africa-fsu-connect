
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EnhancedDocumentPreview } from "@/components/resources/EnhancedDocumentPreview";
import { useDocumentVersions } from "@/hooks/useDocumentVersions";

interface DocumentPreviewDialogProps {
  document: any;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (doc: any) => void;
}

const DocumentPreviewDialog = ({ document, isOpen, onClose, onDownload }: DocumentPreviewDialogProps) => {
  const { versions, comments, fetchVersions, fetchComments, addComment, downloadVersion } = useDocumentVersions();

  useEffect(() => {
    if (document?.id && isOpen) {
      fetchVersions(document.id);
      fetchComments(document.id);
    }
  }, [document?.id, isOpen, fetchVersions, fetchComments]);

  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <div className="h-full overflow-y-auto">
          <EnhancedDocumentPreview
            document={document}
            versions={versions}
            comments={comments}
            onAddComment={addComment}
            onDownloadVersion={downloadVersion}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;
