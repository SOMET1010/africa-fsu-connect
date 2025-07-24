import { useState, useMemo } from "react";
import { Plus, Calendar as CalendarIcon, List, Grid, Search, Filter, Clock, MapPin, Users, User } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useEvents, Event, CreateEventData } from "@/hooks/useEvents";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientHeroSection } from "@/components/ui/gradient-hero-section";
import { GradientStatsCard } from "@/components/ui/gradient-stats-card";
import { GradientLayout } from "@/components/ui/gradient-layout";
import { EventFilters } from "@/components/events/EventFilters";
import { ModernEventCard } from "@/components/events/ModernEventCard";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Events = () => {
  const { t } = useTranslation();
  const { 
    events, 
    loading, 
    createEvent, 
    registerForEvent, 
    unregisterFromEvent, 
    generateCalendarFile 
  } = useEvents();
  
  const { toast } = useToast();

  // UI State
  const [selectedView, setSelectedView] = useState("grid");
  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [onlyRegistered, setOnlyRegistered] = useState(false);

  // Form State
  const [newEvent, setNewEvent] = useState<Partial<CreateEventData>>({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
    is_virtual: false,
    virtual_link: "",
    max_attendees: undefined
  });

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (searchTerm && !event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !event.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      if (selectedType !== "all") {
        const eventTitle = event.title.toLowerCase();
        if (selectedType === "webinaire" && !eventTitle.includes("webinaire")) return false;
        if (selectedType === "conference" && !eventTitle.includes("conférence") && !eventTitle.includes("assemblée")) return false;
        if (selectedType === "workshop" && !eventTitle.includes("workshop") && !eventTitle.includes("atelier")) return false;
        if (selectedType === "deadline" && !eventTitle.includes("deadline")) return false;
      }

      if (selectedDate) {
        const eventDate = new Date(event.start_date).toDateString();
        const filterDate = selectedDate.toDateString();
        if (eventDate !== filterDate) return false;
      }

      if (selectedLocation !== "all") {
        if (selectedLocation === "online" && !event.is_virtual) return false;
        if (selectedLocation !== "online" && event.is_virtual) return false;
        if (!event.is_virtual && !event.location?.toLowerCase().includes(selectedLocation)) return false;
      }

      if (onlyRegistered && !event.is_registered) return false;

      return true;
    });
  }, [events, searchTerm, selectedType, selectedDate, selectedLocation, onlyRegistered]);

  const upcomingEvents = events.filter(event => new Date(event.start_date) > new Date());
  const hasActiveFilters = searchTerm !== "" || selectedType !== "all" || 
                          selectedDate !== null || selectedLocation !== "all" || onlyRegistered;

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedDate(null);
    setSelectedLocation("all");
    setOnlyRegistered(false);
  };

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  const handleRegister = async (eventId: string) => {
    try {
      await registerForEvent(eventId);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleUnregister = async (eventId: string) => {
    try {
      await unregisterFromEvent(eventId);
    } catch (error) {
      console.error('Unregistration failed:', error);
    }
  };

  const handleCreateEvent = async () => {
    try {
      if (!newEvent.title || !newEvent.start_date || !newEvent.end_date) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs obligatoires.",
          variant: "destructive",
        });
        return;
      }

      await createEvent(newEvent as CreateEventData);
      setIsNewEventOpen(false);
      setNewEvent({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        location: "",
        is_virtual: false,
        virtual_link: "",
        max_attendees: undefined
      });
    } catch (error) {
      console.error('Event creation failed:', error);
    }
  };

  if (loading) {
    return (
      <GradientLayout variant="blue" fullHeight>
        <div className="p-6 lg:p-8 space-y-8">
          <Skeleton className="h-64 w-full rounded-3xl bg-white/10" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl bg-white/10" />
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl bg-white/10" />
            ))}
          </div>
        </div>
      </GradientLayout>
    );
  }

  return (
    <GradientLayout variant="blue" fullHeight className="text-white">
      <div className="p-6 lg:p-8 space-y-8">
        {/* Hero Section with Stats */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GradientHeroSection
              title="Événements & Formations"
              subtitle="Plateforme FSU"
              description="Découvrez les derniers événements, conférences et formations de la communauté FSU. Restez connecté avec les innovations et opportunités du secteur."
              variant="custom"
              className="bg-transparent p-0"
              actions={[
                {
                  label: "Voir le Calendrier",
                  onClick: () => setSelectedView("calendar"),
                  variant: "secondary",
                  icon: CalendarIcon
                }
              ]}
            />
          </div>

          {/* Stats Grid */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <GradientStatsCard
                title="Événements Total"
                value={events.length}
                icon={CalendarIcon}
                variant="blue"
                size="sm"
              />
              <GradientStatsCard
                title="À Venir"
                value={upcomingEvents.length}
                icon={Clock}
                variant="teal"
                size="sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <GradientStatsCard
                title="Mes Inscriptions"
                value={events.filter(e => e.is_registered).length}
                icon={User}
                variant="green"
                size="sm"
              />
              <GradientStatsCard
                title="Support"
                value="24/7"
                icon={Users}
                variant="purple"
                size="sm"
              />
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 lg:p-8">
          <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <TabsList className="grid w-full lg:w-auto grid-cols-3 bg-white/10 border border-white/20">
                <TabsTrigger 
                  value="grid" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 flex items-center gap-2"
                >
                  <Grid className="h-4 w-4" />
                  Grille
                </TabsTrigger>
                <TabsTrigger 
                  value="list"
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 flex items-center gap-2"
                >
                  <List className="h-4 w-4" />
                  Liste
                </TabsTrigger>
                <TabsTrigger 
                  value="calendar"
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 flex items-center gap-2"
                >
                  <CalendarIcon className="h-4 w-4" />
                  Calendrier
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <Input
                    placeholder="Rechercher un événement..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white/40"
                  />
                </div>
                <Dialog open={isNewEventOpen} onOpenChange={setIsNewEventOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="secondary"
                      className="bg-white text-blue-700 hover:bg-white/90"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvel événement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Créer un Nouvel Événement</DialogTitle>
                      <DialogDescription>
                        Organisez un événement pour la communauté FSU
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="event-title">Titre de l'Événement *</Label>
                          <Input 
                            id="event-title" 
                            placeholder="Ex: Webinaire Innovation" 
                            value={newEvent.title}
                            onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="max-attendees">Nombre max de participants</Label>
                          <Input 
                            id="max-attendees" 
                            type="number" 
                            placeholder="100"
                            value={newEvent.max_attendees || ""}
                            onChange={(e) => setNewEvent(prev => ({ 
                              ...prev, 
                              max_attendees: e.target.value ? parseInt(e.target.value) : undefined 
                            }))}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="event-description">Description</Label>
                        <Textarea
                          id="event-description"
                          placeholder="Décrivez l'événement..."
                          value={newEvent.description}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="start-date">Date de début *</Label>
                          <Input 
                            id="start-date" 
                            type="datetime-local"
                            value={newEvent.start_date}
                            onChange={(e) => setNewEvent(prev => ({ ...prev, start_date: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="end-date">Date de fin *</Label>
                          <Input 
                            id="end-date" 
                            type="datetime-local"
                            value={newEvent.end_date}
                            onChange={(e) => setNewEvent(prev => ({ ...prev, end_date: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="is-virtual"
                          checked={newEvent.is_virtual}
                          onCheckedChange={(checked) => setNewEvent(prev => ({ ...prev, is_virtual: checked }))}
                        />
                        <Label htmlFor="is-virtual">Événement virtuel</Label>
                      </div>

                      {newEvent.is_virtual ? (
                        <div className="space-y-2">
                          <Label htmlFor="virtual-link">Lien de connexion</Label>
                          <Input 
                            id="virtual-link"
                            placeholder="https://..."
                            value={newEvent.virtual_link}
                            onChange={(e) => setNewEvent(prev => ({ ...prev, virtual_link: e.target.value }))}
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor="location">Lieu</Label>
                          <Input 
                            id="location"
                            placeholder="Adresse de l'événement"
                            value={newEvent.location}
                            onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                          />
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsNewEventOpen(false)}>
                          Annuler
                        </Button>
                        <Button onClick={handleCreateEvent}>
                          Créer l'Événement
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <TabsContent value="grid" className="space-y-6">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="h-16 w-16 text-white/60 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Aucun événement trouvé</h3>
                  <p className="text-white/70 mb-4">
                    {hasActiveFilters 
                      ? "Essayez de modifier vos filtres de recherche" 
                      : "Il n'y a pas d'événements pour le moment"}
                  </p>
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={handleClearFilters} className="border-white/30 text-white hover:bg-white/10">
                      Effacer les filtres
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <Card key={event.id} className="bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 transition-all duration-300 group">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-white group-hover:text-white/90 transition-colors">
                              {event.title}
                            </CardTitle>
                            <div className="flex items-center text-white/70 text-sm">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              {format(new Date(event.start_date), "d MMMM yyyy", { locale: fr })}
                            </div>
                          </div>
                          <Badge 
                            variant="secondary"
                            className="bg-white/20 text-white border-white/30"
                          >
                            {event.is_virtual ? "Virtuel" : "Présentiel"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <CardDescription className="text-white/80">
                          {event.description || "Aucune description disponible"}
                        </CardDescription>
                        <div className="flex items-center justify-between text-sm text-white/70">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {event.location || "En ligne"}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {event.max_attendees || "Illimité"}
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full border-white/30 text-white hover:bg-white/10"
                          onClick={() => event.is_registered ? handleUnregister(event.id) : handleRegister(event.id)}
                        >
                          {event.is_registered ? "Se désinscrire" : "S'inscrire"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="list" className="space-y-6">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="h-16 w-16 text-white/60 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Aucun événement trouvé</h3>
                  <p className="text-white/70">
                    {hasActiveFilters 
                      ? "Essayez de modifier vos filtres de recherche" 
                      : "Il n'y a pas d'événements pour le moment"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <Card key={event.id} className="bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white">{event.title}</CardTitle>
                          <Badge className="bg-white/20 text-white border-white/30">
                            {format(new Date(event.start_date), "d MMM", { locale: fr })}
                          </Badge>
                        </div>
                        <CardDescription className="text-white/80">
                          {event.description || "Aucune description disponible"}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="calendar" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate || undefined}
                      onSelect={(date) => setSelectedDate(date || null)}
                      className="text-white"
                    />
                  </div>
                </div>
                <div className="lg:col-span-2">
                  {selectedDate ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">
                        Événements du {selectedDate.toLocaleDateString('fr-FR')}
                      </h3>
                      {filteredEvents.length === 0 ? (
                        <p className="text-white/70">Aucun événement ce jour</p>
                      ) : (
                        <div className="space-y-4">
                          {filteredEvents.map((event) => (
                            <Card key={event.id} className="bg-white/5 backdrop-blur-sm border border-white/20">
                              <CardHeader>
                                <CardTitle className="text-white">{event.title}</CardTitle>
                                <CardDescription className="text-white/80">
                                  {event.description || "Aucune description disponible"}
                                </CardDescription>
                              </CardHeader>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CalendarIcon className="h-16 w-16 text-white/60 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">Sélectionnez une date</h3>
                      <p className="text-white/70">
                        Cliquez sur une date dans le calendrier pour voir les événements
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </GradientLayout>
  );
};

export default Events;