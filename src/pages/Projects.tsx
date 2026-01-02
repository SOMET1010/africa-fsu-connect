import { useState, useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useProjects } from "@/hooks/useProjects";
import { useToast } from "@/hooks/use-toast";

// Nouveaux composants narratifs (Phase B - Blueprint NEXUS)
import { ProjectsHero } from "@/components/projects/ProjectsHero";
import { InspiringProjectsGrid } from "@/components/projects/InspiringProjectsGrid";
import { ProposeProjectCTA } from "@/components/projects/ProposeProjectCTA";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { ProjectDialog } from "@/components/projects/ProjectDialog";
import { SampleProjectData } from "@/components/projects/SampleProjectData";

const Projects = () => {
  const { t } = useTranslation();
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Filtrage optimisé
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.agencies?.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRegion = selectedRegion === "all" || project.agencies?.region === selectedRegion;
      const matchesStatus = selectedStatus === "all" || project.status === selectedStatus;
      
      return matchesSearch && matchesRegion && matchesStatus;
    });
  }, [projects, searchTerm, selectedRegion, selectedStatus]);

  // Régions et statuts uniques pour les filtres
  const regions = [...new Set(projects.map(p => p.agencies?.region).filter(Boolean))];
  const statuses = [...new Set(projects.map(p => p.status))];

  const handleViewProject = (project) => {
    toast({
      title: project.title,
      description: `${project.agencies?.country || 'Pays'} - ${project.status}`,
    });
  };

  const handleSaveProject = async (projectData) => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, projectData);
      } else {
        await createProject(projectData);
      }
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Hero narratif - COUCHE 2 : Collaboration */}
        <ProjectsHero />

        {/* Bouton données démo si vide */}
        {projects.length === 0 && <SampleProjectData />}

        {/* Filtres simples */}
        <ProjectFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          regions={regions}
          statuses={statuses}
        />

        {/* Grille de projets inspirants */}
        <InspiringProjectsGrid
          projects={filteredProjects}
          onViewProject={handleViewProject}
          loading={loading}
        />

        {/* CTA pour proposer un projet */}
        <ProposeProjectCTA />

        {/* Dialog pour édition (gardé pour admin) */}
        <ProjectDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          project={editingProject}
          onSave={handleSaveProject}
        />
      </div>
    </div>
  );
};

export default Projects;
