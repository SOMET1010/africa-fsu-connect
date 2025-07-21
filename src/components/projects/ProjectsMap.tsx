import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Zap, Building2 } from "lucide-react";
import type { Project } from "@/types/projects";

interface ProjectsMapProps {
  projects: Project[];
}

export const ProjectsMap = ({ projects }: ProjectsMapProps) => {
  // Group projects by region for the map visualization
  const projectsByRegion = projects.reduce((acc, project) => {
    const region = project.agencies?.region || 'Autre';
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(project);
    return acc;
  }, {} as Record<string, Project[]>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'suspended': return 'bg-yellow-500';
      case 'planned': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getRegionPosition = (region: string) => {
    const positions: Record<string, { top: string; left: string }> = {
      'Afrique de l\'Ouest': { top: '45%', left: '20%' },
      'Afrique Centrale': { top: '50%', left: '35%' },
      'Afrique de l\'Est': { top: '40%', left: '55%' },
      'Afrique Australe': { top: '70%', left: '40%' },
      'Afrique du Nord': { top: '25%', left: '35%' },
      'Océan Indien': { top: '65%', left: '65%' },
    };
    return positions[region] || { top: '50%', left: '50%' };
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Répartition géographique des projets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-96 bg-gradient-to-b from-blue-50 to-green-50 rounded-lg overflow-hidden">
          {/* Simplified Africa outline */}
          <div className="absolute inset-4 bg-amber-100 rounded-lg opacity-30"></div>
          
          {/* Regional project markers */}
          {Object.entries(projectsByRegion).map(([region, regionProjects]) => {
            const position = getRegionPosition(region);
            const activeProjects = regionProjects.filter(p => p.status === 'ongoing').length;
            const completedProjects = regionProjects.filter(p => p.status === 'completed').length;
            
            return (
              <div
                key={region}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ top: position.top, left: position.left }}
              >
                <div className="relative">
                  <div className={`w-6 h-6 rounded-full bg-primary border-2 border-white shadow-lg animate-pulse`}>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {regionProjects.length}
                    </div>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="bg-white p-3 rounded-lg shadow-xl border min-w-48">
                      <h4 className="font-semibold text-sm mb-2">{region}</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-blue-500" />
                            En cours
                          </span>
                          <Badge variant="secondary" className="text-xs">{activeProjects}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3 text-green-500" />
                            Terminés
                          </span>
                          <Badge variant="secondary" className="text-xs">{completedProjects}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
            <h5 className="font-semibold text-xs mb-2">Légende</h5>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span>Projets par région</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Nombre total</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Regional summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {Object.entries(projectsByRegion).map(([region, regionProjects]) => (
            <div key={region} className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">{region}</h4>
              <div className="flex items-center justify-between text-xs">
                <span>{regionProjects.length} projets</span>
                <div className="flex gap-1">
                  {regionProjects.slice(0, 3).map((project, idx) => (
                    <div 
                      key={idx}
                      className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`}
                      title={project.title}
                    ></div>
                  ))}
                  {regionProjects.length > 3 && (
                    <span className="text-muted-foreground">+{regionProjects.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};