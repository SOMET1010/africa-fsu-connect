import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  MapPin, 
  TrendingUp, 
  FileText,
  Target,
  Calendar,
  BookOpen,
  Send
} from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { stats, loading } = useDashboardStats();
  const { profile } = useAuth();

  const displayStats = [
    {
      title: "Utilisateurs Actifs",
      value: stats.totalProfiles.toString(),
      change: "Total inscrits",
      icon: Users,
      color: "text-[hsl(var(--primary))]"
    },
    {
      title: "Documents Partagés", 
      value: stats.totalDocuments.toString(),
      change: `+${stats.documentsThisMonth} ce mois`,
      icon: FileText,
      color: "text-[hsl(var(--secondary))]"
    },
    {
      title: "Événements",
      value: stats.totalEvents.toString(),
      change: `+${stats.eventsThisMonth} ce mois`,
      icon: Calendar,
      color: "text-[hsl(var(--accent))]"
    },
    {
      title: "Soumissions",
      value: stats.totalSubmissions.toString(),
      change: "En attente de révision",
      icon: Send,
      color: "text-[hsl(var(--muted-foreground))]"
    }
  ];

  const regions = [
    { name: "CEDEAO", projects: 342, completion: 78 },
    { name: "SADC", projects: 289, completion: 82 },
    { name: "EACO", projects: 198, completion: 71 },
    { name: "ECCAS", projects: 156, completion: 65 },
    { name: "UMA", projects: 143, completion: 89 }
  ];

  const recentActivities = [
    {
      title: "Nouveau projet au Sénégal",
      description: "Lancement du projet 'Villages Connectés 2025'",
      time: "Il y a 2 heures",
      type: "project"
    },
    {
      title: "Rapport annuel CEDEAO",
      description: "Publication du rapport 2024 sur l'inclusion numérique",
      time: "Il y a 5 heures",
      type: "report"
    },
    {
      title: "Formation en ligne",
      description: "Nouvelle session 'Gestion des FSU' disponible",
      time: "Il y a 1 jour",
      type: "training"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Tableau de Bord FSU Afrique
        </h1>
        <p className="text-muted-foreground">
          Vue d'ensemble des initiatives de service universel en Afrique
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-2 animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          displayStats.map((stat, index) => (
            <Card key={index} className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Regional Progress */}
        <div className="lg:col-span-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-[hsl(var(--primary))]" />
                Progression par Région
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regions.map((region, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary">{region.name}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {region.projects} projets
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${region.completion}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{region.completion}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div>
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-[hsl(var(--fsu-blue))]" />
                Activités Récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'project' ? 'bg-[hsl(var(--primary))]' :
                        activity.type === 'report' ? 'bg-[hsl(var(--fsu-gold))]' :
                        'bg-[hsl(var(--secondary))]'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Voir toutes les activités
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="flex items-center justify-center space-x-2 h-20">
                <Target className="h-6 w-6" />
                <span>Nouveau Projet FSU</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-center space-x-2 h-20">
                <BookOpen className="h-6 w-6" />
                <span>Ajouter Ressource</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-center space-x-2 h-20">
                <Calendar className="h-6 w-6" />
                <span>Planifier Événement</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;