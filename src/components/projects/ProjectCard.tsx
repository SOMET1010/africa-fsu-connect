
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MapPin, 
  Calendar, 
  DollarSign,
  Users,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import type { Project } from "@/types/projects";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onView?: (project: Project) => void;
}

export const ProjectCard = ({ project, onEdit, onDelete, onView }: ProjectCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "complété":
      case "completed": 
        return "bg-[hsl(var(--primary))] text-white";
      case "en cours":
      case "active":
      case "ongoing": 
        return "bg-[hsl(var(--fsu-blue))] text-white";
      case "planifié":
      case "planned": 
        return "bg-[hsl(var(--fsu-gold))] text-white";
      case "suspendu":
      case "suspended": 
        return "bg-destructive text-white";
      default: 
        return "bg-muted text-muted-foreground";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <Card className="border-border hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
          {project.agencies && (
            <Badge variant="outline">{project.agencies.region}</Badge>
          )}
        </div>
        <CardTitle className="text-lg">{project.title}</CardTitle>
        <div className="flex items-center text-muted-foreground text-sm">
          <MapPin className="h-4 w-4 mr-1" />
          {project.location || project.agencies?.country}
        </div>
        {project.agencies && (
          <div className="text-sm text-muted-foreground">
            Géré par: {project.agencies.acronym}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {project.description && (
          <p className="text-muted-foreground text-sm mb-4">
            {project.description}
          </p>
        )}
        
        {/* Project Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {project.budget && (
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-[hsl(var(--fsu-gold))]" />
              <span className="text-sm font-medium">
                {formatCurrency(Number(project.budget))}
              </span>
            </div>
          )}
          {project.beneficiaries && (
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-[hsl(var(--primary))]" />
              <span className="text-sm font-medium">
                {project.beneficiaries.toLocaleString()} bénéficiaires
              </span>
            </div>
          )}
          <div className="flex items-center col-span-2">
            <Calendar className="h-4 w-4 mr-2 text-[hsl(var(--fsu-blue))]" />
            <span className="text-sm text-muted-foreground">
              Début: {formatDate(project.start_date)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        {project.completion_percentage !== null && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-medium">{project.completion_percentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${project.completion_percentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 flex items-center space-x-2"
            onClick={() => onView?.(project)}
          >
            <Eye className="h-4 w-4" />
            <span>Voir</span>
          </Button>
          {onEdit && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onEdit(project)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onDelete(project.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
