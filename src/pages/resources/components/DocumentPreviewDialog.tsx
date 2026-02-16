
import React, { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EnhancedDocumentPreview } from "@/components/resources/EnhancedDocumentPreview";
import { useDocumentVersions } from "@/hooks/useDocumentVersions";
import { useAuth } from "@/contexts/AuthContext";

interface DocumentPreviewDialogProps {
  document: any;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (doc: any) => void;
  onDelete?: (doc: any) => void;
}

const DocumentPreviewDialog = ({ document, isOpen, onClose, onDownload, onDelete }: DocumentPreviewDialogProps) => {
  const { versions, comments, fetchVersions, fetchComments, addComment, uploadNewVersion, downloadVersion } = useDocumentVersions();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (document?.id && isOpen) {
      fetchVersions(document.id);
      fetchComments(document.id);
    }
  }, [document?.id, isOpen, fetchVersions, fetchComments]);

  if (!document) return null;

  const isOwner = user?.id === document.uploaded_by;
  const canEdit = isOwner || isAdmin();
  const canDelete = isOwner || isAdmin();

  const handleDelete = () => {
    if (onDelete) {
      onDelete(document);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <div className="h-full overflow-y-auto">
          <EnhancedDocumentPreview
            document={document}
            versions={versions}
            comments={comments}
            onAddComment={(comment, section) => addComment(document.id, comment, section)}
            onDownloadVersion={downloadVersion}
            onUploadVersion={uploadNewVersion}
            onDelete={handleDelete}
            canEdit={canEdit}
            canDelete={canDelete}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;
