import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Target,
  Wifi,
  GraduationCap,
  Heart,
  Building
} from "lucide-react";
import type { Project } from "@/types/projects";

interface ProjectAnalyticsProps {
  projects: Project[];
}

export const ProjectAnalytics = ({ projects }: ProjectAnalyticsProps) => {
  // Calculate USF-specific metrics
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const totalBeneficiaries = projects.reduce((sum, p) => sum + (p.beneficiaries || 0), 0);
  const avgCompletion = projects.length > 0 
    ? projects.reduce((sum, p) => sum + (p.completion_percentage || 0), 0) / projects.length 
    : 0;

  // Project categories specific to USF
  const projectCategories = {
    'connectivite': {
      name: 'Connectivité rurale',
      icon: Wifi,
      color: 'bg-blue-500',
      projects: projects.filter(p => 
        p.title.toLowerCase().includes('fibre') || 
        p.title.toLowerCase().includes('réseau') ||
        p.title.toLowerCase().includes('internet') ||
        p.title.toLowerCase().includes('connectivité')
      )
    },
    'education': {
      name: 'Éducation numérique', 
      icon: GraduationCap,
      color: 'bg-green-500',
      projects: projects.filter(p => 
        p.title.toLowerCase().includes('école') ||
        p.title.toLowerCase().includes('éducation') ||
        p.title.toLowerCase().includes('formation')
      )
    },
    'sante': {
      name: 'Télémédecine',
      icon: Heart,
      color: 'bg-red-500', 
      projects: projects.filter(p => 
        p.title.toLowerCase().includes('santé') ||
        p.title.toLowerCase().includes('médical') ||
        p.title.toLowerCase().includes('hôpital')
      )
    },
    'gouvernement': {
      name: 'E-gouvernement',
      icon: Building,
      color: 'bg-purple-500',
      projects: projects.filter(p => 
        p.title.toLowerCase().includes('gouvernement') ||
        p.title.toLowerCase().includes('administration') ||
        p.title.toLowerCase().includes('public')
      )
    }
  };

  const activeProjects = projects.filter(p => p.status === 'ongoing');
  const completedProjects = projects.filter(p => p.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Total USF</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR', { 
                style: 'currency', 
                currency: 'USD',
                notation: 'compact'
              }).format(totalBudget)}
            </div>
            <p className="text-xs text-muted-foreground">
              Répartis sur {projects.length} projets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bénéficiaires</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(totalBeneficiaries)}
            </div>
            <p className="text-xs text-muted-foreground">
              Personnes impactées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de réalisation</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCompletion.toFixed(1)}%</div>
            <Progress value={avgCompletion} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets actifs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Sur {projects.length} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* USF Categories Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition par domaine d'intervention USF</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(projectCategories).map(([key, category]) => {
              const Icon = category.icon;
              const categoryBudget = category.projects.reduce((sum, p) => sum + (p.budget || 0), 0);
              const categoryBeneficiaries = category.projects.reduce((sum, p) => sum + (p.beneficiaries || 0), 0);
              
              return (
                <div key={key} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">{category.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {category.projects.length} projets
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Budget:</span>
                      <p className="font-medium">
                        {new Intl.NumberFormat('fr-FR', { 
                          style: 'currency', 
                          currency: 'USD',
                          notation: 'compact'
                        }).format(categoryBudget)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Bénéficiaires:</span>
                      <p className="font-medium">
                        {new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(categoryBeneficiaries)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {category.projects.slice(0, 3).map((project, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {project.agencies?.acronym}
                      </Badge>
                    ))}
                    {category.projects.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{category.projects.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Timeline & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Échéancier des projets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['2024', '2025', '2026'].map(year => {
                const yearProjects = projects.filter(p => 
                  p.end_date && new Date(p.end_date).getFullYear().toString() === year
                );
                
                return (
                  <div key={year} className="flex items-center justify-between">
                    <span className="font-medium">{year}</span>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(yearProjects.length / projects.length) * 100} 
                        className="w-24" 
                      />
                      <Badge variant="secondary">
                        {yearProjects.length} projets
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Impact inclusion numérique</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Zones rurales couvertes</span>
                <Badge className="bg-green-500">
                  {Math.round((completedProjects.length / projects.length) * 100)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Population connectée</span>
                <Badge className="bg-blue-500">
                  {new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(totalBeneficiaries)}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Services publics numérisés</span>
                <Badge className="bg-purple-500">
                  {projectCategories.gouvernement.projects.length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Centres de santé équipés</span>
                <Badge className="bg-red-500">
                  {projectCategories.sante.projects.length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};