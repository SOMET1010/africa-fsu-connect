import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PenTool, 
  FileText, 
  Users, 
  Clock, 
  MessageSquare,
  Plus,
  History,
  Eye,
  Edit3,
  CheckCircle,
  AlertCircle,
  GitBranch
} from "lucide-react";

const Coauthoring = () => {
  const documents = [
    {
      id: 1,
      title: "Position Commune sur la Connectivité Rurale",
      type: "Position",
      status: "En cours",
      lastModified: "2026-01-28T14:30:00",
      contributors: [
        { name: "Amara D.", avatar: null, initials: "AD" },
        { name: "Fatou S.", avatar: null, initials: "FS" },
        { name: "Kofi M.", avatar: null, initials: "KM" }
      ],
      comments: 12,
      version: "v2.3"
    },
    {
      id: 2,
      title: "Cadre Réglementaire FSU Harmonisé",
      type: "Réglementation",
      status: "En révision",
      lastModified: "2026-01-27T09:15:00",
      contributors: [
        { name: "Jean P.", avatar: null, initials: "JP" },
        { name: "Marie L.", avatar: null, initials: "ML" }
      ],
      comments: 8,
      version: "v1.5"
    },
    {
      id: 3,
      title: "Rapport Annuel SUTEL 2025",
      type: "Rapport",
      status: "Finalisé",
      lastModified: "2026-01-25T16:45:00",
      contributors: [
        { name: "Ibrahim K.", avatar: null, initials: "IK" },
        { name: "Aisha B.", avatar: null, initials: "AB" },
        { name: "Omar T.", avatar: null, initials: "OT" },
        { name: "Nadia R.", avatar: null, initials: "NR" }
      ],
      comments: 24,
      version: "v3.0"
    }
  ];

  const recentActivity = [
    { user: "Amara D.", action: "a modifié la section 2.3", document: "Position Commune", time: "Il y a 15 min" },
    { user: "Fatou S.", action: "a ajouté un commentaire", document: "Position Commune", time: "Il y a 1h" },
    { user: "Jean P.", action: "a soumis pour révision", document: "Cadre Réglementaire", time: "Il y a 3h" },
    { user: "Marie L.", action: "a approuvé les modifications", document: "Cadre Réglementaire", time: "Il y a 5h" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En cours": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "En révision": return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "Finalisé": return "bg-green-500/10 text-green-600 border-green-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "En cours": return <Edit3 className="h-3 w-3" />;
      case "En révision": return <AlertCircle className="h-3 w-3" />;
      case "Finalisé": return <CheckCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <PenTool className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Co-rédaction</h1>
          </div>
          <p className="text-muted-foreground">
            Édition collaborative de documents avec gestion des versions et commentaires
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Documents actifs", value: "8", icon: FileText, color: "text-blue-500" },
          { label: "Collaborateurs", value: "24", icon: Users, color: "text-green-500" },
          { label: "Commentaires", value: "156", icon: MessageSquare, color: "text-purple-500" },
          { label: "Versions", value: "42", icon: GitBranch, color: "text-orange-500" }
        ].map((stat) => (
          <Card key={stat.label} className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="documents">Mes documents</TabsTrigger>
          <TabsTrigger value="activity">Activité récente</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{doc.type}</Badge>
                      <Badge className={getStatusColor(doc.status)}>
                        {getStatusIcon(doc.status)}
                        <span className="ml-1">{doc.status}</span>
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {doc.version}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-semibold hover:text-primary cursor-pointer transition-colors">
                      {doc.title}
                    </h3>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {doc.contributors.slice(0, 4).map((contributor, idx) => (
                          <Avatar key={idx} className="h-8 w-8 border-2 border-background">
                            <AvatarImage src={contributor.avatar || ""} />
                            <AvatarFallback className="text-xs bg-primary/10">
                              {contributor.initials}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {doc.contributors.length > 4 && (
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                            +{doc.contributors.length - 4}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {doc.contributors.length} contributeurs
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Modifié {new Date(doc.lastModified).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {doc.comments} commentaires
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex md:flex-col gap-2">
                    <Button variant="default" size="sm">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Éditer
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Aperçu
                    </Button>
                    <Button variant="ghost" size="sm">
                      <History className="h-4 w-4 mr-2" />
                      Historique
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activité récente</CardTitle>
              <CardDescription>
                Dernières modifications et interactions sur vos documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        <span className="text-muted-foreground"> {activity.action}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.document} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Coauthoring;
