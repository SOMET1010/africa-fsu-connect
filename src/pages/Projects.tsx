
import { useState, useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { ModernButton } from "@/components/ui/modern-button";
import { Input } from "@/components/ui/input";
import { HeroSection } from "@/components/ui/hero-section";
import { ModernStatsCard } from "@/components/ui/modern-stats-card";
import { VirtualizedList } from "@/components/optimized/VirtualizedList";
import { usePreloader } from "@/hooks/usePreloader";
import { 
  Search, 
  Plus,
  Filter,
  Download,
  BarChart3,
  Bell,
  Database,
  FolderOpen,
  Users,
  Clock,
  CheckCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from "@/hooks/useProjects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectDialog } from "@/components/projects/ProjectDialog";
import { ProjectsMap } from "@/components/projects/ProjectsMap";
import { ProjectAnalytics } from "@/components/projects/ProjectAnalytics";
import { ProjectExport } from "@/components/projects/ProjectExport";
import { ProjectReports } from "@/components/projects/ProjectReports";
import { ProjectNotifications } from "@/components/projects/ProjectNotifications";
import { SampleProjectData } from "@/components/projects/SampleProjectData";
import { useToast } from "@/hooks/use-toast";
import { ModernCard } from "@/components/ui/modern-card";

const Projects = () => {
  const { t } = useTranslation();
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const { toast } = useToast();
  const { handleLinkHover } = usePreloader();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'analytics' | 'reports' | 'notifications'>('grid');

  // Optimized filtering with useMemo
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

  const handleCreateProject = () => {
    setEditingProject(null);
    setDialogOpen(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      await deleteProject(projectId);
    }
  };

  const handleSaveProject = async (projectData) => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, projectData);
      } else {
        await createProject(projectData);
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleViewProject = (project) => {
    toast({
      title: project.title,
      description: `Projet géré par ${project.agencies?.acronym} - ${project.status}`,
    });
  };

  // Get unique regions and statuses for filters
  const regions = [...new Set(projects.map(p => p.agencies?.region).filter(Boolean))];
  const statuses = [...new Set(projects.map(p => p.status))];

  // Calculate stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'En cours').length;
  const completedProjects = projects.filter(p => p.status === 'Terminé').length;
  const pendingProjects = projects.filter(p => p.status === 'En attente').length;

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <HeroSection
          title="Gestion des Projets FSU"
          subtitle="Plateforme collaborative"
          description="Découvrez, gérez et suivez tous les projets de fonds de service universel des télécommunications à travers l'Afrique."
          actions={[
            {
              label: "Nouveau Projet",
              onClick: handleCreateProject,
              icon: <Plus className="h-5 w-5" />,
              variant: "default"
            },
            {
              label: "Voir Analytics",
              onClick: () => setViewMode('analytics'),
              icon: <BarChart3 className="h-5 w-5" />,
              variant: "outline"
            }
          ]}
        />

        {/* Demo Data Button - only show if no projects */}
        {projects.length === 0 && <SampleProjectData />}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ModernStatsCard
            title="Projets Totaux"
            value={totalProjects}
            icon={FolderOpen}
            variant="gradient"
            trend={{ value: 12, label: "Ce mois", positive: true }}
          />
          <ModernStatsCard
            title="Projets Actifs"
            value={activeProjects}
            icon={Clock}
            variant="gradient"
            trend={{ value: 8, label: "Cette semaine", positive: true }}
          />
          <ModernStatsCard
            title="Projets Terminés"
            value={completedProjects}
            icon={CheckCircle}
            variant="gradient"
            trend={{ value: 5, label: "Ce mois", positive: true }}
          />
          <ModernStatsCard
            title="En Attente"
            value={pendingProjects}
            icon={Users}
            variant="gradient"
            trend={{ value: -2, label: "Cette semaine", positive: false }}
          />
        </div>

        {/* View Mode Toggle */}
        <ModernCard variant="glass" className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Vue des Projets</h2>
            <div className="flex border border-border/50 rounded-xl p-1 bg-muted/30">
              <ModernButton 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grille
              </ModernButton>
              <ModernButton 
                variant={viewMode === 'map' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('map')}
              >
                Carte
              </ModernButton>
              <ModernButton 
                variant={viewMode === 'analytics' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('analytics')}
              >
                Analytics
              </ModernButton>
              <ModernButton 
                variant={viewMode === 'reports' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('reports')}
              >
                Rapports
              </ModernButton>
              <ModernButton 
                variant={viewMode === 'notifications' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('notifications')}
              >
                <Bell className="h-4 w-4" />
              </ModernButton>
            </div>
          </div>
        </ModernCard>

        {/* Export Tools - show for all views except notifications */}
        {viewMode !== 'notifications' && (
          <ProjectExport projects={filteredProjects} />
        )}

        {/* View-specific content */}
        {viewMode === 'map' && <ProjectsMap projects={filteredProjects} />}
        {viewMode === 'analytics' && <ProjectAnalytics projects={filteredProjects} />}
        {viewMode === 'reports' && <ProjectReports projects={filteredProjects} />}
        {viewMode === 'notifications' && <ProjectNotifications projects={filteredProjects} />}

        {/* Filters and Grid - only show for grid view */}
        {viewMode === 'grid' && (
          <>
            <ModernCard variant="glass" className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Filtres et Recherche</h3>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, pays ou localisation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-border/50 bg-background/50"
                  />
                </div>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-full md:w-48 h-12 rounded-xl border-border/50 bg-background/50">
                    <SelectValue placeholder="Région" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les régions</SelectItem>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full md:w-48 h-12 rounded-xl border-border/50 bg-background/50">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </ModernCard>

            {/* Projects Grid - Virtualized for large lists */}
            {filteredProjects.length > 12 ? (
              <VirtualizedList
                items={filteredProjects}
                itemHeight={280}
                containerHeight={600}
                className="rounded-xl border border-border/20"
                renderItem={(project) => (
                  <div className="p-3">
                    <ProjectCard
                      project={project}
                      onEdit={handleEditProject}
                      onDelete={handleDeleteProject}
                      onView={handleViewProject}
                    />
                  </div>
                )}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={handleEditProject}
                    onDelete={handleDeleteProject}
                    onView={handleViewProject}
                  />
                ))}
              </div>
            )}

            {filteredProjects.length === 0 && (
              <ModernCard variant="glass" className="p-12 text-center">
                <Database className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {projects.length === 0 
                    ? "Aucun projet trouvé" 
                    : "Aucun projet correspond aux critères"
                  }
                </h3>
                <p className="text-muted-foreground mb-6">
                  {projects.length === 0 
                    ? "Créez votre premier projet pour commencer !" 
                    : "Essayez de modifier vos critères de recherche."
                  }
                </p>
                {projects.length === 0 && (
                  <ModernButton onClick={handleCreateProject} size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un projet
                  </ModernButton>
                )}
              </ModernCard>
            )}
          </>
        )}

        {/* Project Dialog */}
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
