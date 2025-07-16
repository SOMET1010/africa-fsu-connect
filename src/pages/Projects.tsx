import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  DollarSign,
  Users,
  Plus,
  Eye
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const projects = [
    {
      id: 1,
      title: "Villages Connectés Côte d'Ivoire",
      country: "Côte d'Ivoire",
      region: "CEDEAO",
      status: "En cours",
      budget: "$12.5M",
      beneficiaires: "250,000",
      startDate: "Jan 2024",
      completion: 65,
      description: "Connecter 500 villages ruraux à l'internet haut débit",
      tags: ["Rural", "Fibre optique", "Education"]
    },
    {
      id: 2,
      title: "Mobile Money pour Tous - Kenya",
      country: "Kenya",
      region: "EACO",
      status: "Complété",
      budget: "$8.2M",
      beneficiaires: "1.2M",
      startDate: "Mar 2023",
      completion: 100,
      description: "Extension des services de paiement mobile dans les zones reculées",
      tags: ["Fintech", "Mobile", "Inclusion"]
    },
    {
      id: 3,
      title: "Télémédecine Sahel",
      country: "Mali",
      region: "CEDEAO",
      status: "Planifié",
      budget: "$15.8M",
      beneficiaires: "500,000",
      startDate: "Juin 2024",
      completion: 0,
      description: "Plateforme de télémédecine pour les zones isolées du Sahel",
      tags: ["Santé", "Satellite", "Urgence"]
    },
    {
      id: 4,
      title: "E-Government Botswana",
      country: "Botswana",
      region: "SADC",
      status: "En cours",
      budget: "$9.3M",
      beneficiaires: "2.3M",
      startDate: "Sep 2023",
      completion: 78,
      description: "Digitalisation des services publics et identité numérique",
      tags: ["E-gov", "Digital ID", "Services"]
    },
    {
      id: 5,
      title: "École Numérique Maroc",
      country: "Maroc",
      region: "UMA",
      status: "En cours",
      budget: "$22.1M",
      beneficiaires: "800,000",
      startDate: "Jan 2024",
      completion: 45,
      description: "Équipement numérique de 1000 écoles rurales",
      tags: ["Education", "Équipement", "Formation"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complété": return "bg-[hsl(var(--primary))] text-white";
      case "En cours": return "bg-[hsl(var(--fsu-blue))] text-white";
      case "Planifié": return "bg-[hsl(var(--fsu-gold))] text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "all" || project.region === selectedRegion;
    const matchesStatus = selectedStatus === "all" || project.status === selectedStatus;
    
    return matchesSearch && matchesRegion && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Projets FSU
          </h1>
          <p className="text-muted-foreground">
            Suivi et gestion des projets de service universel en Afrique
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nouveau Projet</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou pays..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Région" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les régions</SelectItem>
            <SelectItem value="CEDEAO">CEDEAO</SelectItem>
            <SelectItem value="SADC">SADC</SelectItem>
            <SelectItem value="EACO">EACO</SelectItem>
            <SelectItem value="ECCAS">ECCAS</SelectItem>
            <SelectItem value="UMA">UMA</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="Planifié">Planifié</SelectItem>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="Complété">Complété</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="border-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
                <Badge variant="outline">{project.region}</Badge>
              </div>
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <div className="flex items-center text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                {project.country}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                {project.description}
              </p>
              
              {/* Project Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-[hsl(var(--fsu-gold))]" />
                  <span className="text-sm font-medium">{project.budget}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-[hsl(var(--primary))]" />
                  <span className="text-sm font-medium">{project.beneficiaires}</span>
                </div>
                <div className="flex items-center col-span-2">
                  <Calendar className="h-4 w-4 mr-2 text-[hsl(var(--fsu-blue))]" />
                  <span className="text-sm text-muted-foreground">{project.startDate}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Progression</span>
                  <span className="font-medium">{project.completion}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${project.completion}%` }}
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button variant="outline" className="w-full flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Voir Détails</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Aucun projet trouvé avec les critères de recherche actuels.
          </p>
        </div>
      )}
    </div>
  );
};

export default Projects;