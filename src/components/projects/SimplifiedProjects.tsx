import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ModernButton } from '@/components/ui/modern-button';
import { ProjectCard } from './ProjectCard';
import { 
  Search, 
  Plus,
  FolderOpen,
  Clock,
  CheckCircle
} from 'lucide-react';

interface SimplifiedProjectsProps {
  projects: any[];
  filteredProjects: any[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateProject: () => void;
  onEditProject: (project: any) => void;
  onDeleteProject: (projectId: string) => void;
  onViewProject: (project: any) => void;
}

export const SimplifiedProjects = ({
  projects,
  filteredProjects,
  searchTerm,
  onSearchChange,
  onCreateProject,
  onEditProject,
  onDeleteProject,
  onViewProject
}: SimplifiedProjectsProps) => {
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'En cours').length;
  const completedProjects = projects.filter(p => p.status === 'Terminé').length;

  return (
    <div className="space-y-6">
      {/* Statistiques simplifiées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projets</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Cours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{activeProjects}</div>
            <Badge variant="outline" className="mt-1">Actifs</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminés</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{completedProjects}</div>
            <Badge variant="outline" className="mt-1">Complétés</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Mes Projets</CardTitle>
          <CardDescription>
            Gérez vos projets en toute simplicité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un projet..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <ModernButton onClick={onCreateProject} className="sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Projet
            </ModernButton>
          </div>
        </CardContent>
      </Card>

      {/* Liste des projets */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={onEditProject}
              onDelete={onDeleteProject}
              onView={onViewProject}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {projects.length === 0 ? 'Aucun projet' : 'Aucun résultat'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {projects.length === 0 
                ? 'Créez votre premier projet pour commencer' 
                : 'Essayez de modifier votre recherche'
              }
            </p>
            {projects.length === 0 && (
              <ModernButton onClick={onCreateProject}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un projet
              </ModernButton>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};