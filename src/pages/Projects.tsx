
import { useState, useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { AdaptiveInterface } from '@/components/layout/AdaptiveInterface';
import { SimplifiedProjects } from '@/components/projects/SimplifiedProjects';
import { AdvancedProjectsControls } from '@/components/projects/AdvancedProjectsControls';
import { HeroSection } from "@/components/ui/hero-section";
import { ModernStatsCard } from "@/components/ui/modern-stats-card";
import { VirtualizedList } from "@/components/optimized/VirtualizedList";
import { usePreloader } from "@/hooks/usePreloader";
import { 
  Plus,
  BarChart3,
  Database,
  FolderOpen,
  Users,
  Clock,
  CheckCircle
} from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectDialog } from "@/components/projects/ProjectDialog";
import { SampleProjectData } from "@/components/projects/SampleProjectData";
import { useToast } from "@/hooks/use-toast";
import { ModernCard } from "@/components/ui/modern-card";
import { logger } from "@/utils/logger";

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
    if (window.confirm(t('projects.delete.confirm'))) {
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
      logger.error('Error saving project:', error);
    }
  };

  const handleViewProject = (project) => {
    toast({
      title: project.title,
      description: `${t('projects.managed.by')} ${project.agencies?.acronym} - ${project.status}`,
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
    <AdaptiveInterface
      title={t('projects.title')}
      description={t('projects.subtitle')}
      advancedContent={
        <AdvancedProjectsControls
          projects={projects}
          filteredProjects={filteredProjects}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedRegion={selectedRegion}
          selectedStatus={selectedStatus}
          onRegionChange={setSelectedRegion}
          onStatusChange={setSelectedStatus}
          regions={regions}
          statuses={statuses}
        />
      }
    >
      <div className="space-y-6">
        {/* Demo Data Button - only show if no projects */}
        {projects.length === 0 && <SampleProjectData />}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ModernStatsCard
            title={t('projects.stats.total')}
            value={totalProjects}
            icon={FolderOpen}
            variant="gradient"
            trend={{ value: 12, label: t('dashboard.stats.this.month'), positive: true }}
          />
          <ModernStatsCard
            title={t('projects.stats.active')}
            value={activeProjects}
            icon={Clock}
            variant="gradient"
            trend={{ value: 8, label: t('dashboard.stats.this.week'), positive: true }}
          />
          <ModernStatsCard
            title={t('projects.stats.completed')}
            value={completedProjects}
            icon={CheckCircle}
            variant="gradient"
            trend={{ value: 5, label: t('dashboard.stats.this.month'), positive: true }}
          />
          <ModernStatsCard
            title={t('projects.stats.pending')}
            value={pendingProjects}
            icon={Users}
            variant="gradient"
            trend={{ value: -2, label: t('dashboard.stats.this.week'), positive: false }}
          />
        </div>

        {/* Simplified Projects View */}
        <SimplifiedProjects
          projects={projects}
          filteredProjects={filteredProjects}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onCreateProject={handleCreateProject}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
          onViewProject={handleViewProject}
        />

        {/* Project Dialog */}
        <ProjectDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          project={editingProject}
          onSave={handleSaveProject}
        />
      </div>
    </AdaptiveInterface>
  );
};

export default Projects;
