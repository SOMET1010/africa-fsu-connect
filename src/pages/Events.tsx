import { useState } from "react";
import { Calendar, Clock, MapPin, Users, Video, Plus, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Events = () => {
  const [selectedView, setSelectedView] = useState("list");

  const events = [
    {
      id: 1,
      title: "Assemblée Générale UAT 2024",
      description: "Assemblée générale annuelle de l'Union Africaine des Télécommunications avec focus sur les FSU",
      date: "2024-03-15",
      time: "09:00",
      endTime: "17:00",
      type: "Conférence",
      location: "Abidjan, Côte d'Ivoire",
      isVirtual: false,
      participants: 156,
      maxParticipants: 200,
      organizer: "Union Africaine des Télécommunications",
      status: "À venir",
      tags: ["UAT", "Assemblée", "FSU"]
    },
    {
      id: 2,
      title: "Webinaire: Innovations FSU en Afrique de l'Ouest",
      description: "Présentation des innovations technologiques dans les projets FSU de la région CEDEAO",
      date: "2024-02-28",
      time: "14:00",
      endTime: "16:00",
      type: "Webinaire",
      location: "En ligne",
      isVirtual: true,
      participants: 89,
      maxParticipants: 150,
      organizer: "ANSUT Côte d'Ivoire",
      status: "Inscription ouverte",
      tags: ["Innovation", "CEDEAO", "Technologie"]
    },
    {
      id: 3,
      title: "Workshop: Cadres Réglementaires FSU",
      description: "Atelier de travail sur l'harmonisation des cadres réglementaires FSU en Afrique",
      date: "2024-04-10",
      time: "10:00",
      endTime: "16:00",
      type: "Workshop",
      location: "Dakar, Sénégal",
      isVirtual: false,
      participants: 45,
      maxParticipants: 60,
      organizer: "ARTP Sénégal",
      status: "À venir",
      tags: ["Réglementation", "Harmonisation", "Workshop"]
    },
    {
      id: 4,
      title: "Deadline: Soumission Projets FSU 2024",
      description: "Date limite pour la soumission des projets FSU pour financement 2024",
      date: "2024-03-01",
      time: "23:59",
      endTime: "23:59",
      type: "Deadline",
      location: "N/A",
      isVirtual: true,
      participants: 0,
      maxParticipants: 0,
      organizer: "Secrétariat FSU",
      status: "Urgent",
      tags: ["Deadline", "Financement", "Projets"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "À venir":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Inscription ouverte":
        return "bg-green-100 text-green-800 border-green-200";
      case "Urgent":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Webinaire":
        return <Video className="h-4 w-4" />;
      case "Deadline":
        return <Clock className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Agenda des Événements FSU
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Suivez les événements, conférences, webinaires et deadlines importantes 
            de la communauté FSU africaine.
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-8">
          <Tabs value={selectedView} onValueChange={setSelectedView}>
            <TabsList>
              <TabsTrigger value="list">Liste</TabsTrigger>
              <TabsTrigger value="calendar">Calendrier</TabsTrigger>
              <TabsTrigger value="upcoming">À venir</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter .ics
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel Événement
            </Button>
          </div>
        </div>

        <Tabs value={selectedView} className="space-y-6">
          <TabsContent value="list" className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4 flex-1">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        {getTypeIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{event.title}</CardTitle>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </div>
                        <CardDescription className="text-base mb-3">
                          {event.description}
                        </CardDescription>
                        <div className="flex flex-wrap gap-2">
                          {event.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{event.time} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    {event.type !== "Deadline" && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{event.participants}/{event.maxParticipants} participants</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Organisé par:</span> {event.organizer}
                    </div>
                    <div className="flex gap-2">
                      {event.type !== "Deadline" && (
                        <Button variant="outline" size="sm">
                          Détails
                        </Button>
                      )}
                      {event.status === "Inscription ouverte" && (
                        <Button size="sm">
                          S'inscrire
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Vue Calendrier</h3>
                  <p className="text-muted-foreground mb-4">
                    La vue calendrier sera implémentée dans la prochaine version
                  </p>
                  <Button variant="outline">
                    Voir en Liste
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {events
              .filter(event => new Date(event.date) > new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 3)
              .map((event) => (
                <Card key={event.id} className="border-primary/20">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className={getStatusColor(event.status)} variant="outline">
                          {event.status}
                        </Badge>
                        <CardTitle className="text-xl mt-2">{event.title}</CardTitle>
                        <CardDescription>{event.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-sm font-medium">
                          {event.time}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Events;