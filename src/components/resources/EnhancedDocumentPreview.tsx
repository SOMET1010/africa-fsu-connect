import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Clock, 
  User,
  MessageSquare,
  History,
  Share2,
  Bookmark,
  Eye
} from "lucide-react";

interface DocumentVersion {
  id: string;
  version: string;
  uploaded_at: string;
  changes_summary: string;
  file_url: string;
}

interface DocumentComment {
  id: string;
  user_name: string;
  comment: string;
  created_at: string;
  section?: string;
}

interface EnhancedDocumentPreviewProps {
  document: any;
  versions?: DocumentVersion[];
  comments?: DocumentComment[];
  onAddComment?: (comment: string, section?: string) => void;
  onDownloadVersion?: (versionId: string) => void;
}

export const EnhancedDocumentPreview = ({
  document,
  versions = [],
  comments = [],
  onAddComment,
  onDownloadVersion
}: EnhancedDocumentPreviewProps) => {
  const [newComment, setNewComment] = useState("");
  const [viewCount, setViewCount] = useState(document?.view_count || 0);

  useEffect(() => {
    // Increment view count when document is opened
    setViewCount(prev => prev + 1);
  }, [document?.id]);

  const handleAddComment = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment.trim());
      setNewComment("");
    }
  };

  const getPreviewUrl = (document: any) => {
    // Check if document can be previewed inline
    const previewableTypes = ['pdf', 'image', 'text'];
    const fileType = document.mime_type?.split('/')[0];
    
    if (previewableTypes.includes(fileType) || document.mime_type === 'application/pdf') {
      return document.file_url;
    }
    return null;
  };

  const previewUrl = getPreviewUrl(document);

  return (
    <div className="space-y-6">
      {/* Document Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{document.title}</h1>
            <p className="text-muted-foreground">{document.description}</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {viewCount} vues
            </Badge>
            <Badge>{document.document_type}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Taille:</span>
            <p className="font-medium">{document.file_size ? `${Math.round(document.file_size / 1024)} KB` : 'N/A'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Type:</span>
            <p className="font-medium">{document.mime_type?.split('/')[1]?.toUpperCase() || 'N/A'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Publié:</span>
            <p className="font-medium">{new Date(document.created_at).toLocaleDateString('fr-FR')}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Téléchargements:</span>
            <p className="font-medium">{document.download_count || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <Button onClick={() => window.open(document.file_url, '_blank')}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
          <Button variant="outline">
            <Bookmark className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </Card>

      {/* Document Content */}
      <Tabs defaultValue="preview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
          <TabsTrigger value="comments">Commentaires ({comments.length})</TabsTrigger>
          <TabsTrigger value="versions">Versions ({versions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            {previewUrl ? (
              <div className="relative">
                {document.mime_type === 'application/pdf' ? (
                  <iframe
                    src={`${previewUrl}#view=FitH`}
                    className="w-full h-[600px] border-0 rounded-lg"
                    title={document.title}
                  />
                ) : document.mime_type?.startsWith('image/') ? (
                  <img
                    src={previewUrl}
                    alt={document.title}
                    className="w-full max-h-[600px] object-contain rounded-lg"
                  />
                ) : (
                  <div className="p-8 text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Aperçu non disponible</p>
                    <p className="text-muted-foreground">
                      Ce type de fichier ne peut pas être prévisualisé dans le navigateur.
                    </p>
                    <Button className="mt-4" onClick={() => window.open(document.file_url, '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ouvrir dans un nouvel onglet
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Aperçu non disponible</p>
                <p className="text-muted-foreground">
                  Ce type de fichier ne peut pas être prévisualisé.
                </p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Commentaires collaboratifs
              </h3>
              
              {/* Add Comment */}
              <div className="border rounded-lg p-4 bg-muted/30">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ajouter un commentaire sur ce document..."
                  className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex justify-end mt-3">
                  <Button 
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    size="sm"
                  >
                    Publier commentaire
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Comments List */}
              <ScrollArea className="max-h-[400px]">
                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Aucun commentaire pour l'instant</p>
                      <p className="text-sm">Soyez le premier à commenter ce document!</p>
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{comment.user_name}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString('fr-FR')}
                          </span>
                          {comment.section && (
                            <Badge variant="outline" className="text-xs">
                              Section: {comment.section}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm">{comment.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique des versions
              </h3>
              
              {versions.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Aucune version antérieure</p>
                  <p className="text-sm">C'est la première version de ce document</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {versions.map((version, index) => (
                    <div key={version.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={index === 0 ? "default" : "secondary"}>
                              Version {version.version}
                            </Badge>
                            {index === 0 && (
                              <Badge variant="outline" className="text-xs">
                                Actuelle
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium">{version.changes_summary}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(version.uploaded_at).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDownloadVersion?.(version.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};