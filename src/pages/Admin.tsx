import { useState } from "react";
import { Users, FileText, MessageSquare, Calendar, Settings, Shield, BarChart3, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Admin = () => {
  const stats = [
    {
      title: "Utilisateurs Actifs",
      value: "1,247",
      description: "+12% ce mois",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Documents Publiés",
      value: "856",
      description: "+5% cette semaine",
      icon: FileText,
      color: "text-green-600"
    },
    {
      title: "Discussions Forum",
      value: "234",
      description: "+18% cette semaine",
      icon: MessageSquare,
      color: "text-purple-600"
    },
    {
      title: "Événements Planifiés",
      value: "45",
      description: "3 ce mois",
      icon: Calendar,
      color: "text-orange-600"
    }
  ];

  const recentUsers = [
    {
      id: 1,
      name: "Dr. Paul Mbeng",
      email: "paul.mbeng@camtel.cm",
      country: "Cameroun",
      role: "Admin Pays",
      status: "En attente",
      joinDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Sarah Diallo",
      email: "sarah.diallo@artp.sn",
      country: "Sénégal",
      role: "Éditeur",
      status: "Actif",
      joinDate: "2024-01-14"
    },
    {
      id: 3,
      name: "Mohamed Al-Rashid",
      email: "m.rashid@ntra.gov.eg",
      country: "Égypte",
      role: "Contributeur",
      status: "Actif",
      joinDate: "2024-01-13"
    }
  ];

  const pendingContent = [
    {
      id: 1,
      type: "Document",
      title: "Cadre Réglementaire FSU - Maroc 2024",
      author: "Ahmed Benali",
      country: "Maroc",
      submittedDate: "2024-01-15",
      status: "En révision"
    },
    {
      id: 2,
      type: "Forum Post",
      title: "Proposition d'harmonisation CEDEAO",
      author: "Dr. Fatima Touré",
      country: "Mali",
      submittedDate: "2024-01-14",
      status: "En attente"
    },
    {
      id: 3,
      type: "Projet",
      title: "Extension 4G Zones Rurales",
      author: "Jean-Claude Ndong",
      country: "Gabon",
      submittedDate: "2024-01-13",
      status: "En révision"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif":
        return "bg-green-100 text-green-800 border-green-200";
      case "En attente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "En révision":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Administration de la Plateforme
          </h1>
          <p className="text-lg text-muted-foreground">
            Tableau de bord administrateur pour la gestion de la plateforme FSU africaine.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="content">
              <FileText className="h-4 w-4 mr-2" />
              Contenu
            </TabsTrigger>
            <TabsTrigger value="moderation">
              <Shield className="h-4 w-4 mr-2" />
              Modération
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytiques
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Utilisateurs Récents</CardTitle>
                <CardDescription>
                  Gestion des nouveaux utilisateurs et demandes d'accès
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-sm text-muted-foreground">{user.country} • {user.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                        {user.status === "En attente" ? (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Refuser
                            </Button>
                            <Button size="sm">
                              Approuver
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline">
                            Modifier
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contenu en Attente de Modération</CardTitle>
                <CardDescription>
                  Documents, posts forum et projets nécessitant une révision
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingContent.map((content) => (
                    <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{content.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {content.type} par {content.author} • {content.country}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Soumis le {new Date(content.submittedDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(content.status)}>
                          {content.status}
                        </Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Rejeter
                          </Button>
                          <Button size="sm">
                            Approuver
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Outils de Modération</h3>
                  <p className="text-muted-foreground mb-4">
                    Interface de modération avancée en cours de développement
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Analytiques Avancées</h3>
                  <p className="text-muted-foreground mb-4">
                    Tableaux de bord détaillés et métriques en cours de développement
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres de la Plateforme</CardTitle>
                  <CardDescription>
                    Configuration générale de la plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuration Générale
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Sécurité et Permissions
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Maintenance
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions Rapides</CardTitle>
                  <CardDescription>
                    Raccourcis vers les tâches administratives courantes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Exporter Liste Utilisateurs
                  </Button>
                  <Button className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Rapport d'Activité
                  </Button>
                  <Button className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Statistiques Mensuel
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;