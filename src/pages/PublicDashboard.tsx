import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  Globe, 
  Users, 
  Wifi, 
  DollarSign,
  Download,
  TrendingUp,
  MapPin,
  Building2,
  Target
} from "lucide-react";

const PublicDashboard = () => {
  const kpis = [
    {
      title: "Couverture Population",
      value: "68%",
      change: "+5.2%",
      trend: "up",
      icon: Users,
      color: "text-blue-500",
      description: "Population couverte par les services télécoms"
    },
    {
      title: "Sites Connectés",
      value: "12,847",
      change: "+1,234",
      trend: "up",
      icon: Wifi,
      color: "text-green-500",
      description: "Écoles, centres de santé et sites publics"
    },
    {
      title: "Budget FSU Total",
      value: "$2.4B",
      change: "+15%",
      trend: "up",
      icon: DollarSign,
      color: "text-purple-500",
      description: "Fonds mobilisés pour le service universel"
    },
    {
      title: "Projets Actifs",
      value: "127",
      change: "+18",
      trend: "up",
      icon: Target,
      color: "text-orange-500",
      description: "Projets en cours d'exécution"
    }
  ];

  const regionalProgress = [
    { region: "CEDEAO", coverage: 72, projects: 45, budget: 850 },
    { region: "SADC", coverage: 65, projects: 38, budget: 720 },
    { region: "EACO", coverage: 58, projects: 24, budget: 450 },
    { region: "ECCAS", coverage: 52, projects: 15, budget: 280 },
    { region: "UMA", coverage: 78, projects: 5, budget: 100 }
  ];

  const topCountries = [
    { name: "Côte d'Ivoire", coverage: 85, projects: 18, flag: "🇨🇮" },
    { name: "Kenya", coverage: 82, projects: 15, flag: "🇰🇪" },
    { name: "Nigeria", coverage: 79, projects: 22, flag: "🇳🇬" },
    { name: "Afrique du Sud", coverage: 88, projects: 12, flag: "🇿🇦" },
    { name: "Maroc", coverage: 91, projects: 8, flag: "🇲🇦" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Tableau de Bord Public</h1>
          </div>
          <p className="text-muted-foreground">
            Indicateurs clés agrégés et progrès régional du Service Universel en Afrique
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter les données
          </Button>
          <Button>
            <Globe className="h-4 w-4 mr-2" />
            Voir la carte
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-primary/10`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
                <Badge 
                  variant="outline" 
                  className={kpi.trend === 'up' ? 'text-green-600 border-green-500/30' : 'text-red-600 border-red-500/30'}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {kpi.change}
                </Badge>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold">{kpi.value}</h3>
                <p className="text-sm font-medium text-foreground">{kpi.title}</p>
                <p className="text-xs text-muted-foreground">{kpi.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Regional Progress & Top Countries */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Regional Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Progrès par Région
            </CardTitle>
            <CardDescription>
              Couverture et nombre de projets par communauté économique
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {regionalProgress.map((region) => (
              <div key={region.region} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-medium">
                      {region.region}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {region.projects} projets
                    </span>
                  </div>
                  <span className="text-sm font-medium">{region.coverage}%</span>
                </div>
                <Progress value={region.coverage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Budget: ${region.budget}M USD
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Pays Leaders
            </CardTitle>
            <CardDescription>
              Meilleurs taux de couverture du service universel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCountries.map((country, idx) => (
              <div 
                key={country.name} 
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-lg">
                  {country.flag}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{country.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {country.projects} projets
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={country.coverage} className="h-1.5 flex-1" />
                    <span className="text-sm font-medium text-primary">
                      {country.coverage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Africa Map Placeholder */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Carte Interactive - Projets FSU en Afrique
          </CardTitle>
          <CardDescription>
            Visualisation géographique de la couverture et des projets
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[400px] bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
            <div className="text-center space-y-4">
              <Globe className="h-16 w-16 mx-auto text-muted-foreground/50" />
              <div>
                <p className="text-lg font-medium">Carte Interactive</p>
                <p className="text-sm text-muted-foreground">
                  Cliquez pour explorer la carte complète
                </p>
              </div>
              <Button variant="outline" asChild>
                <a href="/map">
                  <MapPin className="h-4 w-4 mr-2" />
                  Ouvrir la carte
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              Données agrégées depuis les 54 pays africains membres • Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
            </p>
            <div className="flex items-center gap-4">
              <span>Sources: UAT, UIT, Banque Mondiale, GSMA</span>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4 mr-2" />
                API Données
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicDashboard;
