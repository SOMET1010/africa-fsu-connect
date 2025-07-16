import { useState } from "react";
import { Search, Upload, FileText, Download, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

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
      language: "Français"
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
      language: "English"
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
      language: "Français"
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || doc.type === selectedType;
    const matchesCountry = !selectedCountry || doc.country === selectedCountry;
    return matchesSearch && matchesType && matchesCountry;
  });

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

        {/* Actions Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 p-6 bg-card rounded-lg border">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous types</SelectItem>
                <SelectItem value="Réglementation">Réglementation</SelectItem>
                <SelectItem value="Guide">Guide</SelectItem>
                <SelectItem value="Rapport">Rapport</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Pays" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous pays</SelectItem>
                <SelectItem value="Côte d'Ivoire">Côte d'Ivoire</SelectItem>
                <SelectItem value="Sénégal">Sénégal</SelectItem>
                <SelectItem value="Afrique du Sud">Afrique du Sud</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>

            <Button className="bg-primary hover:bg-primary/90">
              <Upload className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid gap-6">
          {filteredDocuments.map((doc) => (
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
                <div className="flex justify-between items-center">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
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
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Aperçu
                    </Button>
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun document trouvé</h3>
            <p className="text-muted-foreground">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;