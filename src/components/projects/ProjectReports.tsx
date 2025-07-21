
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  FileText,
  Calendar,
  Globe
} from "lucide-react";
import type { Project } from "@/types/projects";

interface ProjectReportsProps {
  projects: Project[];
}

export const ProjectReports = ({ projects }: ProjectReportsProps) => {
  // Calculer les métriques exécutives
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const totalBeneficiaries = projects.reduce((sum, p) => sum + (p.beneficiaries || 0), 0);
  const avgCompletion = projects.length > 0 
    ? projects.reduce((sum, p) => sum + (p.completion_percentage || 0), 0) / projects.length 
    : 0;

  const activeProjects = projects.filter(p => p.status === 'ongoing').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const plannedProjects = projects.filter(p => p.status === 'planned').length;

  // Analyse par région
  const regionalAnalysis = projects.reduce((acc, project) => {
    const region = project.agencies?.region || 'Autre';
    if (!acc[region]) {
      acc[region] = {
        count: 0,
        budget: 0,
        beneficiaries: 0,
        completed: 0
      };
    }
    acc[region].count += 1;
    acc[region].budget += project.budget || 0;
    acc[region].beneficiaries += project.beneficiaries || 0;
    if (project.status === 'completed') acc[region].completed += 1;
    return acc;
  }, {} as Record<string, any>);

  // Analyse par secteur
  const sectorAnalysis = {
    'connectivite': projects.filter(p => 
      p.title.toLowerCase().includes('fibre') || 
      p.title.toLowerCase().includes('internet') ||
      p.title.toLowerCase().includes('connect')
    ).length,
    'education': projects.filter(p => 
      p.title.toLowerCase().includes('école') ||
      p.title.toLowerCase().includes('education') ||
      p.title.toLowerCase().includes('numérique')
    ).length,
    'sante': projects.filter(p => 
      p.title.toLowerCase().includes('santé') ||
      p.title.toLowerCase().includes('médecine') ||
      p.title.toLowerCase().includes('télé')
    ).length,
    'gouvernement': projects.filter(p => 
      p.title.toLowerCase().includes('gouvernement') ||
      p.title.toLowerCase().includes('admin') ||
      p.title.toLowerCase().includes('public')
    ).length
  };

  return (
    <div className="space-y-6">
      {/* Tableau de bord exécutif */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Tableau de bord exécutif FSU/SUTEL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-[hsl(var(--fsu-gold))]" />
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('fr-FR', { 
                  style: 'currency', 
                  currency: 'USD',
                  notation: 'compact'
                }).format(totalBudget)}
              </div>
              <p className="text-sm text-muted-foreground">Budget total</p>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-[hsl(var(--fsu-blue))]" />
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(totalBeneficiaries)}
              </div>
              <p className="text-sm text-muted-foreground">Bénéficiaires</p>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-[hsl(var(--primary))]" />
              <div className="text-2xl font-bold">{avgCompletion.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">Progression moyenne</p>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">{activeProjects}</div>
              <p className="text-sm text-muted-foreground">Projets actifs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analyse régionale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Performance par région
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(regionalAnalysis).map(([region, data]) => (
              <div key={region} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold">{region}</h4>
                  <Badge variant="outline">{data.count} projets</Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Budget:</span>
                    <p className="font-medium">
                      {new Intl.NumberFormat('fr-FR', { 
                        style: 'currency', 
                        currency: 'USD',
                        notation: 'compact'
                      }).format(data.budget)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Bénéficiaires:</span>
                    <p className="font-medium">
                      {new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(data.beneficiaries)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Terminés:</span>
                    <p className="font-medium">{data.completed}/{data.count}</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Taux de réalisation</span>
                    <span>{Math.round((data.completed / data.count) * 100)}%</span>
                  </div>
                  <Progress value={(data.completed / data.count) * 100} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analyse sectorielle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Répartition par secteur d'intervention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-500">{sectorAnalysis.connectivite}</div>
              <p className="text-sm text-muted-foreground">Connectivité</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-500">{sectorAnalysis.education}</div>
              <p className="text-sm text-muted-foreground">Éducation</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-500">{sectorAnalysis.sante}</div>
              <p className="text-sm text-muted-foreground">Santé</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-500">{sectorAnalysis.gouvernement}</div>
              <p className="text-sm text-muted-foreground">E-gouvernement</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résumé des statuts */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé des statuts de projets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Projets actifs</p>
                <p className="text-2xl font-bold text-blue-600">{activeProjects}</p>
              </div>
              <div className="text-blue-600">
                <TrendingUp className="h-8 w-8" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Projets terminés</p>
                <p className="text-2xl font-bold text-green-600">{completedProjects}</p>
              </div>
              <div className="text-green-600">
                <BarChart3 className="h-8 w-8" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Projets planifiés</p>
                <p className="text-2xl font-bold text-purple-600">{plannedProjects}</p>
              </div>
              <div className="text-purple-600">
                <Calendar className="h-8 w-8" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
