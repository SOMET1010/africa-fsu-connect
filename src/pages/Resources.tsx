
import { useState } from "react";
import { Upload, FileText, Plus, Search } from "lucide-react";
import { useDocuments } from "@/hooks/useDocuments";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import SearchBar from "@/components/shared/SearchBar";
import FileUpload from "@/components/shared/FileUpload";
import ResourceStats from "@/components/resources/ResourceStats";
import DocumentCard from "@/components/resources/DocumentCard";
import SampleDataButton from "@/components/resources/SampleDataButton";
import { useToast } from "@/hooks/use-toast";

const Resources = () => {
  const { documents, loading, uploading, uploadDocument, downloadDocument, searchDocuments, refetch } = useDocuments();
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
        { value: "gh", label: "Ghana" },
        { value: "ke", label: "Kenya" },
        { value: "tz", label: "Tanzanie" },
        { value: "ug", label: "Ouganda" }
      ]
    }
  ];

  const handleSearch = (query: string, filters: Record<string, string>) => {
    searchDocuments(query, filters);
  };

  const handleFileUpload = async (files: File[]) => {
    if (!uploadMetadata.title.trim()) {
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-4">
                Bibliothèque de Ressources FSU
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                Accédez à l'ensemble des documents, rapports, guides et ressources 
                partagés par les agences FSU africaines. Une collection collaborative 
                de connaissances pour soutenir le développement en Afrique.
              </p>
            </div>
            {documents.length === 0 && !loading && (
              <SampleDataButton onDataAdded={refetch} />
            )}
          </div>
        </div>

        {/* Statistics */}
        <ResourceStats documents={documents} loading={loading} />

        {/* Search and Upload Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="flex-1">
              <SearchBar
                placeholder="Rechercher des documents par titre ou description..."
                onSearch={handleSearch}
                filters={searchFilters}
                showFilters={true}
              />
            </div>
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter un Document
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Ajouter un Nouveau Document
                  </DialogTitle>
                  <DialogDescription>
                    Partagez vos ressources avec la communauté FSU africaine
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre du document *</Label>
                      <Input
                        id="title"
                        value={uploadMetadata.title}
                        onChange={(e) => setUploadMetadata(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Ex: Guide de bonnes pratiques pour..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={uploadMetadata.description}
                        onChange={(e) => setUploadMetadata(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Décrivez le contenu et l'utilité de ce document..."
                        rows={3}
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
                        <Label htmlFor="country">Pays d'origine</Label>
                        <Input
                          id="country"
                          value={uploadMetadata.country}
                          onChange={(e) => setUploadMetadata(prev => ({ ...prev, country: e.target.value }))}
                          placeholder="Ex: Côte d'Ivoire"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <FileUpload
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      maxSize={50}
                      multiple={false}
                      onFilesSelected={handleFileUpload}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="space-y-6">
          {loading ? (
            <div className="grid gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse bg-muted rounded-lg h-64"></div>
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Aucun document trouvé</h3>
              <p className="text-muted-foreground mb-6">
                Aucun document ne correspond à vos critères de recherche.
              </p>
              <Button onClick={() => searchDocuments('', {})} variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Voir tous les documents
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onPreview={handlePreview}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          )}
        </div>

        {/* Document Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {previewDoc?.title}
              </DialogTitle>
              <DialogDescription>
                {previewDoc?.description}
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
                  <div>Type: {previewDoc?.document_type}</div>
                  <div>Pays: {previewDoc?.country || 'N/A'}</div>
                  <div>Taille: {previewDoc?.file_size ? `${Math.round(previewDoc.file_size / 1024)} KB` : 'N/A'}</div>
                  <div>Téléchargements: {previewDoc?.download_count || 0}</div>
                </div>
              </div>
              <div className="flex justify-center gap-3 pt-4">
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
