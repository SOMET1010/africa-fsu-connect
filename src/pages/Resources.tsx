import { useState } from "react";
import { Search, Upload, FileText, Download, Filter, Eye, Calendar, User, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchBar from "@/components/shared/SearchBar";
import FileUpload from "@/components/shared/FileUpload";
import { useToast } from "@/hooks/use-toast";

const Resources = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  const documents = [
    {
      id: 1,
      title: "Cadre Réglementaire FSU - Côte d'Ivoire 2024",
      description: "Document de référence sur la réglementation du Fonds de Service Universel en Côte d'Ivoire",
      type: "Réglementation",
      country: "Côte d'Ivoire",
      region: "CEDEAO",
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      downloads: 156,
      language: "Français",
      rating: 4.5,
      author: "ANSUT CI",
      keywords: ["réglementation", "fsu", "côte d'ivoire"]
    },
    {
      id: 2,
      title: "USF Best Practices Guide - SADC Region",
      description: "Comprehensive guide on Universal Service Fund implementation across Southern Africa",
      type: "Guide",
      country: "Afrique du Sud",
      region: "SADC",
      size: "5.1 MB",
      uploadDate: "2024-01-10",
      downloads: 203,
      language: "English",
      rating: 4.8,
      author: "ICASA SA",
      keywords: ["best practices", "sadc", "implementation"]
    },
    {
      id: 3,
      title: "Rapport Annuel FSU 2023 - Sénégal",
      description: "Bilan des activités et projets du FSU sénégalais pour l'année 2023",
      type: "Rapport",
      country: "Sénégal",
      region: "CEDEAO",
      size: "8.7 MB",
      uploadDate: "2024-01-08",
      downloads: 89,
      language: "Français",
      rating: 4.2,
      author: "ARTP Sénégal",
      keywords: ["rapport annuel", "sénégal", "bilan"]
    }
  ];

  const searchFilters = [
    {
      id: "type",
      label: "Type de Document",
      options: [
        { value: "Réglementation", label: "Réglementation" },
        { value: "Guide", label: "Guide" },
        { value: "Rapport", label: "Rapport" }
      ]
    },
    {
      id: "country",
      label: "Pays",
      options: [
        { value: "Côte d'Ivoire", label: "Côte d'Ivoire" },
        { value: "Sénégal", label: "Sénégal" },
        { value: "Afrique du Sud", label: "Afrique du Sud" }
      ]
    }
  ];

  const handleSearch = (query: string, filters: Record<string, string>) => {
    // Filtering logic will be implemented by SearchBar component
  };

  const handleFileUpload = (files: File[]) => {
    toast({
      title: "Documents uploadés",
      description: `${files.length} document(s) ont été uploadés avec succès.`,
    });
    setIsUploadOpen(false);
  };

  const handlePreview = (doc: any) => {
    setPreviewDoc(doc);
    setIsPreviewOpen(true);
  };

  const handleDownload = (doc: any) => {
    toast({
      title: "Téléchargement",
      description: `Le téléchargement de "${doc.title}" a commencé.`,
    });
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
                <FileUpload
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  maxSize={50 * 1024 * 1024} // 50MB
                  multiple={true}
                  onFilesSelected={handleFileUpload}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid gap-6">
          {documents.map((doc) => (
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
                    <Badge variant="secondary">{doc.type}</Badge>
                    <Badge variant="outline">{doc.region}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Pays:</span> {doc.country}
                    </div>
                    <div>
                      <span className="font-medium">Taille:</span> {doc.size}
                    </div>
                    <div>
                      <span className="font-medium">Téléchargements:</span> {doc.downloads}
                    </div>
                    <div>
                      <span className="font-medium">Langue:</span> {doc.language}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{doc.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Auteur:</span> {doc.author} • 
                      <span className="font-medium"> Publié:</span> {new Date(doc.uploadDate).toLocaleDateString('fr-FR')}
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
          ))}
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