import { useState } from "react";
import { Search, Upload, FileText, Download, Filter, Eye, Calendar, User, Star } from "lucide-react";
import { useDocuments } from "@/hooks/useDocuments";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchBar from "@/components/shared/SearchBar";
import FileUpload from "@/components/shared/FileUpload";
import { useToast } from "@/hooks/use-toast";

const Resources = () => {
  const { documents, loading, uploading, uploadDocument, downloadDocument, searchDocuments } = useDocuments();
  const { toast } = useToast();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [uploadMetadata, setUploadMetadata] = useState({
    title: '',
    description: '',
    document_type: 'autre' as const,
    country: '',
    tags: [] as string[]
  });

  // Documents are now fetched from useDocuments hook

  const searchFilters = [
    {
      id: "document_type",
      label: "Type de Document",
      options: [
        { value: "guide", label: "Guide" },
        { value: "rapport", label: "Rapport" },
        { value: "presentation", label: "Présentation" },
        { value: "formulaire", label: "Formulaire" },
        { value: "autre", label: "Autre" }
      ]
    },
    {
      id: "country",
      label: "Pays",
      options: [
        { value: "ci", label: "Côte d'Ivoire" },
        { value: "sn", label: "Sénégal" },
        { value: "za", label: "Afrique du Sud" },
        { value: "ng", label: "Nigéria" },
        { value: "gh", label: "Ghana" }
      ]
    }
  ];

  const handleSearch = (query: string, filters: Record<string, string>) => {
    searchDocuments(query, filters);
  };

  const handleFileUpload = async (files: File[]) => {
    if (!uploadMetadata.title) {
      toast({
        title: "Erreur",
        description: "Veuillez renseigner le titre du document",
        variant: "destructive"
      });
      return;
    }

    try {
      for (const file of files) {
        await uploadDocument(file, uploadMetadata);
      }
      setIsUploadOpen(false);
      setUploadMetadata({
        title: '',
        description: '',
        document_type: 'autre',
        country: '',
        tags: []
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  const handlePreview = (doc: any) => {
    setPreviewDoc(doc);
    setIsPreviewOpen(true);
  };

  const handleDownload = (doc: any) => {
    downloadDocument(doc);
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Bibliothèque de Ressources FSU
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Accédez à l'ensemble des documents, rapports, guides et ressources 
            partagés par les agences FSU africaines.
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="mb-8">
          <SearchBar
            placeholder="Rechercher dans les documents..."
            onSearch={handleSearch}
            filters={searchFilters}
            showFilters={true}
            className="mb-4"
          />
          <div className="flex justify-end">
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Upload className="h-4 w-4 mr-2" />
                  Ajouter un Document
                </Button>
              </DialogTrigger>
                <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ajouter un Nouveau Document</DialogTitle>
                  <DialogDescription>
                    Uploadez un nouveau document dans la bibliothèque FSU
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Metadata form */}
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre du document *</Label>
                      <Input
                        id="title"
                        value={uploadMetadata.title}
                        onChange={(e) => setUploadMetadata(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Titre du document"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={uploadMetadata.description}
                        onChange={(e) => setUploadMetadata(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description du document"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Type de document</Label>
                        <Select 
                          value={uploadMetadata.document_type}
                          onValueChange={(value: any) => setUploadMetadata(prev => ({ ...prev, document_type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="guide">Guide</SelectItem>
                            <SelectItem value="rapport">Rapport</SelectItem>
                            <SelectItem value="presentation">Présentation</SelectItem>
                            <SelectItem value="formulaire">Formulaire</SelectItem>
                            <SelectItem value="autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Pays</Label>
                        <Input
                          id="country"
                          value={uploadMetadata.country}
                          onChange={(e) => setUploadMetadata(prev => ({ ...prev, country: e.target.value }))}
                          placeholder="Pays d'origine"
                        />
                      </div>
                    </div>
                  </div>
                  <FileUpload
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    maxSize={50}
                    multiple={false}
                    onFilesSelected={handleFileUpload}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-4 bg-muted rounded"></div>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                      <div className="flex gap-2">
                        <div className="h-8 bg-muted rounded w-20"></div>
                        <div className="h-8 bg-muted rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : documents.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun document trouvé</h3>
                <p className="text-muted-foreground">
                  Aucun document ne correspond à vos critères de recherche.
                </p>
              </CardContent>
            </Card>
          ) : (
            documents.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{doc.title}</CardTitle>
                      <CardDescription className="text-base">
                        {doc.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Badge variant="secondary" className="capitalize">{doc.document_type}</Badge>
                      {doc.country && <Badge variant="outline">{doc.country}</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Pays:</span> {doc.country || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Taille:</span> {formatFileSize(doc.file_size || 0)}
                      </div>
                      <div>
                        <span className="font-medium">Téléchargements:</span> {doc.download_count || 0}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {doc.mime_type?.split('/')[1]?.toUpperCase() || 'N/A'}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Publié:</span> {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handlePreview(doc)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Aperçu
                        </Button>
                        <Button size="sm" onClick={() => handleDownload(doc)}>
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Document Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>{previewDoc?.title}</DialogTitle>
              <DialogDescription>
                {previewDoc?.description}
              </DialogDescription>
            </DialogHeader>
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Aperçu du document en cours de développement
              </p>
              <p className="text-sm text-muted-foreground">
                Document: {previewDoc?.title}
              </p>
              <div className="flex justify-center gap-2 mt-4">
                <Button onClick={() => handleDownload(previewDoc)}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
                <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                  Fermer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Resources;