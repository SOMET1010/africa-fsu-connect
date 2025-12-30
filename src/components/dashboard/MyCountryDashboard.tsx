import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Rocket, 
  FileText, 
  Users, 
  Handshake,
  TrendingUp,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useMyCountryStats } from '@/hooks/useMyCountryStats';
import { CompareWidget } from './widgets/CompareWidget';
import { useTranslation } from '@/hooks/useTranslation';

export function MyCountryDashboard() {
  const { stats, isLoading } = useMyCountryStats();
  const { t } = useTranslation();

  if (isLoading || !stats) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const kpis = [
    { 
      label: 'Projets actifs', 
      value: stats.projectsActive, 
      icon: Rocket,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    { 
      label: 'En cours', 
      value: stats.projectsInProgress, 
      icon: TrendingUp,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    { 
      label: 'Bénéficiaires', 
      value: `${(stats.beneficiaries / 1000000).toFixed(1)}M`, 
      icon: Users,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    { 
      label: 'Collaborations', 
      value: stats.collaborationsActive, 
      icon: Handshake,
      color: 'text-info',
      bgColor: 'bg-info/10'
    },
  ];

  const statusColors: Record<string, string> = {
    active: 'bg-success/20 text-success',
    in_progress: 'bg-warning/20 text-warning',
    planned: 'bg-muted text-muted-foreground',
    pending: 'bg-warning/20 text-warning',
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header avec drapeau pays */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{stats.countryFlag}</span>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Mon espace {stats.countryName}
            </h1>
            <p className="text-muted-foreground">
              {t('my.country.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mes Projets FSU */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Rocket className="h-5 w-5 text-primary" />
              Mes projets FSU
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.myProjects.map((project) => (
              <div 
                key={project.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{project.title}</p>
                  {project.beneficiaries && (
                    <p className="text-xs text-muted-foreground">
                      {(project.beneficiaries / 1000).toFixed(0)}k bénéficiaires
                    </p>
                  )}
                </div>
                <Badge className={statusColors[project.status] || 'bg-muted'}>
                  {project.status === 'active' ? 'Actif' : 
                   project.status === 'in_progress' ? 'En cours' : 'Planifié'}
                </Badge>
              </div>
            ))}
            <Button variant="ghost" className="w-full mt-2" size="sm">
              Voir tous mes projets
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Mes Contributions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Mes contributions au réseau
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.myContributions.map((contribution) => (
              <div 
                key={contribution.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{contribution.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(contribution.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {contribution.type === 'document' ? 'Document' :
                   contribution.type === 'report' ? 'Rapport' : 'Template'}
                </Badge>
              </div>
            ))}
            <Button variant="ghost" className="w-full mt-2" size="sm">
              Partager une ressource
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Collaborations actives */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Handshake className="h-5 w-5 text-primary" />
            Mes collaborations actives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.myCollaborations.map((collab) => (
              <div 
                key={collab.id}
                className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{collab.countryFlag}</span>
                  <div>
                    <p className="font-medium">{collab.countryName}</p>
                    <Badge 
                      variant="outline" 
                      className={collab.status === 'active' ? 'bg-success/10 text-success border-success/30' : ''}
                    >
                      {collab.status === 'active' ? 'Active' : 'En attente'}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{collab.topic}</p>
                <Button variant="ghost" size="sm" className="mt-3 w-full">
                  <ExternalLink className="h-3 w-3 mr-2" />
                  Voir les échanges
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Widget de comparaison opt-in */}
      <CompareWidget countryCode={stats.countryCode} />
    </div>
  );
}
