
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Calendar, FileText, Globe, HardDrive } from "lucide-react";

interface DocumentCardProps {
  document: any;
  onPreview: (doc: any) => void;
  onDownload: (doc: any) => void;
}

const DocumentCard = ({ document, onPreview, onDownload }: DocumentCardProps) => {
  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getDocumentTypeColor = (type: string) => {
    const colors = {
      'guide': 'bg-uat-primary-100 text-primary',
      'report': 'bg-green-100 text-green-800',
      'presentation': 'bg-purple-100 text-purple-800',
      'form': 'bg-orange-100 text-orange-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2 line-clamp-2">{document.title}</CardTitle>
            <CardDescription className="text-base line-clamp-3">
              {document.description || "Aucune description disponible"}
            </CardDescription>
          </div>
          <div className="flex gap-2 ml-4 flex-shrink-0">
            <Badge className={`capitalize ${getDocumentTypeColor(document.document_type)}`}>
              {document.document_type}
            </Badge>
            {document.country && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {document.country}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <HardDrive className="h-4 w-4" />
              <span>{formatFileSize(document.file_size || 0)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Download className="h-4 w-4" />
              <span>{document.download_count || 0} téléchargements</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{document.mime_type?.split('/')[1]?.toUpperCase() || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(document.created_at).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="text-sm text-muted-foreground">
              Publié le {new Date(document.created_at).toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onPreview(document)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Aperçu
              </Button>
              <Button 
                size="sm" 
                onClick={() => onDownload(document)}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Télécharger
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
