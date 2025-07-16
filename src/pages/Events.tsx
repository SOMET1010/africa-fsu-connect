import { useState } from "react";
import { Calendar, Clock, MapPin, Users, Video, Plus, Download, Bell, ExternalLink, UserCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Events = () => {
  const [selectedView, setSelectedView] = useState("list");
  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const { toast } = useToast();

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
      tags: ["UAT", "Assemblée", "FSU"],
      agenda: "Ordre du jour détaillé disponible",
      requirements: "Inscription obligatoire avant le 10 mars"
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
      tags: ["Innovation", "CEDEAO", "Technologie"],
      agenda: "Présentations et démonstrations interactives",
      requirements: "Aucun prérequis technique"
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
      tags: ["Réglementation", "Harmonisation", "Workshop"],
      agenda: "Sessions de travail collaboratives",
      requirements: "Expérience en réglementation souhaitée"
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
      tags: ["Deadline", "Financement", "Projets"],
      agenda: "Date limite stricte",
      requirements: "Dossier complet requis"
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

  const handleRegister = (eventId: number) => {
    setRegisteredEvents(prev => [...prev, eventId]);
    toast({
      title: "Inscription confirmée",
      description: "Vous êtes maintenant inscrit à cet événement.",
    });
  };

  const handleViewDetails = (event: any) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  const handleExportCalendar = () => {
    toast({
      title: "Export calendrier",
      description: "Le fichier .ics a été généré et téléchargé.",
    });
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
            <Button variant="outline" onClick={handleExportCalendar}>
              <Download className="h-4 w-4 mr-2" />
              Exporter .ics
            </Button>
            <Dialog open={isNewEventOpen} onOpenChange={setIsNewEventOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel Événement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Créer un Nouvel Événement</DialogTitle>
                  <DialogDescription>
                    Organisez un événement pour la communauté FSU
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-title">Titre de l'Événement</Label>
                      <Input id="event-title" placeholder="Ex: Webinaire Innovation" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-type">Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conference">Conférence</SelectItem>
                          <SelectItem value="webinaire">Webinaire</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="deadline">Deadline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="event-description">Description</Label>
                    <Textarea
                      id="event-description"
                      placeholder="Décrivez l'événement..."
                      className="min-h-24"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-date">Date</Label>
                      <Input id="event-date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-time">Heure</Label>
                      <Input id="event-time" type="time" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-duration">Durée (heures)</Label>
                      <Input id="event-duration" type="number" placeholder="2" />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsNewEventOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={() => {
                      toast({
                        title: "Événement créé",
                        description: "Votre événement a été créé avec succès.",
                      });
                      setIsNewEventOpen(false);
                    }}>
                      Créer l'Événement
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(event)}>
                          Détails
                        </Button>
                      )}
                      {event.status === "Inscription ouverte" && !registeredEvents.includes(event.id) && (
                        <Button size="sm" onClick={() => handleRegister(event.id)}>
                          S'inscrire
                        </Button>
                      )}
                      {registeredEvents.includes(event.id) && (
                        <Button size="sm" variant="outline" disabled>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Inscrit
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

        {/* Event Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedEvent?.title}</DialogTitle>
              <DialogDescription>
                {selectedEvent?.description}
              </DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Informations Générales</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(selectedEvent.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedEvent.time} - {selectedEvent.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedEvent.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedEvent.participants}/{selectedEvent.maxParticipants} participants</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Détails</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Organisateur:</span> {selectedEvent.organizer}
                      </div>
                      <div>
                        <span className="font-medium">Agenda:</span> {selectedEvent.agenda}
                      </div>
                      <div>
                        <span className="font-medium">Prérequis:</span> {selectedEvent.requirements}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  {selectedEvent.status === "Inscription ouverte" && !registeredEvents.includes(selectedEvent.id) && (
                    <Button onClick={() => {
                      handleRegister(selectedEvent.id);
                      setIsDetailsOpen(false);
                    }}>
                      S'inscrire à l'Événement
                    </Button>
                  )}
                  {selectedEvent.isVirtual && (
                    <Button variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Lien de Connexion
                    </Button>
                  )}
                  <Button variant="ghost" onClick={() => setIsDetailsOpen(false)}>
                    Fermer
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Events;