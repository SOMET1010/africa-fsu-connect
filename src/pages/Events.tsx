
import { useState, useMemo } from "react";
import { Plus, Calendar as CalendarIcon, List, Grid } from "lucide-react";
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
import { PageContainer } from "@/components/layout/PageContainer";
import { EventsHero } from "@/components/events/EventsHero";
import { ModernEventCard } from "@/components/events/ModernEventCard";
import { EventFilters } from "@/components/events/EventFilters";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

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
      // Search filter
      if (searchTerm && !event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !event.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Type filter (simplified matching)
      if (selectedType !== "all") {
        const eventTitle = event.title.toLowerCase();
        if (selectedType === "webinaire" && !eventTitle.includes("webinaire")) return false;
        if (selectedType === "conference" && !eventTitle.includes("conférence") && !eventTitle.includes("assemblée")) return false;
        if (selectedType === "workshop" && !eventTitle.includes("workshop") && !eventTitle.includes("atelier")) return false;
        if (selectedType === "deadline" && !eventTitle.includes("deadline")) return false;
      }

      // Date filter
      if (selectedDate) {
        const eventDate = new Date(event.start_date).toDateString();
        const filterDate = selectedDate.toDateString();
        if (eventDate !== filterDate) return false;
      }

      // Location filter
      if (selectedLocation !== "all") {
        if (selectedLocation === "online" && !event.is_virtual) return false;
        if (selectedLocation !== "online" && event.is_virtual) return false;
        if (!event.is_virtual && !event.location?.toLowerCase().includes(selectedLocation)) return false;
      }

      // Registration filter
      if (onlyRegistered && !event.is_registered) return false;

      return true;
    });
  }, [events, searchTerm, selectedType, selectedDate, selectedLocation, onlyRegistered]);

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
      <PageContainer>
        <div className="space-y-8">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-48" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* Hero Section */}
        <EventsHero />

        {/* Actions & Filters */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <Tabs value={selectedView} onValueChange={setSelectedView}>
              <TabsList className="w-auto">
                <TabsTrigger value="grid" className="flex items-center gap-2">
                  <Grid className="h-4 w-4" />
                  Grille
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  Liste
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Calendrier
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Dialog open={isNewEventOpen} onOpenChange={setIsNewEventOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel Événement
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

          <EventFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
            onlyRegistered={onlyRegistered}
            onRegisteredChange={setOnlyRegistered}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Content */}
        <Tabs value={selectedView} className="space-y-6">
          <TabsContent value="grid" className="space-y-6">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun événement trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  {hasActiveFilters 
                    ? "Essayez de modifier vos filtres de recherche" 
                    : "Il n'y a pas d'événements pour le moment"}
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={handleClearFilters}>
                    Effacer les filtres
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <ModernEventCard
                    key={event.id}
                    event={event}
                    onViewDetails={handleViewDetails}
                    onRegister={handleRegister}
                    onUnregister={handleUnregister}
                    onGenerateCalendar={generateCalendarFile}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun événement trouvé</h3>
                <p className="text-muted-foreground">
                  {hasActiveFilters 
                    ? "Essayez de modifier vos filtres de recherche" 
                    : "Il n'y a pas d'événements pour le moment"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <ModernEventCard
                    key={event.id}
                    event={event}
                    onViewDetails={handleViewDetails}
                    onRegister={handleRegister}
                    onUnregister={handleUnregister}
                    onGenerateCalendar={generateCalendarFile}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Calendar
                  mode="single"
                  selected={selectedDate || undefined}
                  onSelect={(date) => setSelectedDate(date || null)}
                  className="rounded-md border"
                />
              </div>
              <div className="lg:col-span-2">
                {selectedDate ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Événements du {selectedDate.toLocaleDateString('fr-FR')}
                    </h3>
                    {filteredEvents.length === 0 ? (
                      <p className="text-muted-foreground">Aucun événement ce jour</p>
                    ) : (
                      <div className="space-y-4">
                        {filteredEvents.map((event) => (
                          <ModernEventCard
                            key={event.id}
                            event={event}
                            onViewDetails={handleViewDetails}
                            onRegister={handleRegister}
                            onUnregister={handleUnregister}
                            onGenerateCalendar={generateCalendarFile}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Sélectionnez une date</h3>
                    <p className="text-muted-foreground">
                      Cliquez sur une date dans le calendrier pour voir les événements
                    </p>
                  </div>
                )}
              </div>
            </div>
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
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(selectedEvent.start_date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Début:</span>
                        <span>{new Date(selectedEvent.start_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Fin:</span>
                        <span>{new Date(selectedEvent.end_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Lieu:</span>
                        <span>{selectedEvent.location || "En ligne"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Participants:</span>
                        <span>
                          {selectedEvent.current_attendees}
                          {selectedEvent.max_attendees && `/${selectedEvent.max_attendees}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Organisateur</h4>
                    <div className="space-y-2 text-sm">
                      {selectedEvent.organizer ? (
                        <>
                          <div>
                            <span className="font-medium">Nom:</span> {selectedEvent.organizer.first_name} {selectedEvent.organizer.last_name}
                          </div>
                          <div>
                            <span className="font-medium">Rôle:</span> {selectedEvent.organizer.role}
                          </div>
                          {selectedEvent.organizer.organization && (
                            <div>
                              <span className="font-medium">Organisation:</span> {selectedEvent.organizer.organization}
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-muted-foreground">Informations non disponibles</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  {!selectedEvent.is_registered ? (
                    <Button onClick={() => {
                      handleRegister(selectedEvent.id);
                      setIsDetailsOpen(false);
                    }}>
                      S'inscrire à l'Événement
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      onClick={() => {
                        handleUnregister(selectedEvent.id);
                        setIsDetailsOpen(false);
                      }}
                    >
                      Se désinscrire
                    </Button>
                  )}
                  {selectedEvent.virtual_link && (
                    <Button variant="outline" asChild>
                      <a href={selectedEvent.virtual_link} target="_blank" rel="noopener noreferrer">
                        <span>Rejoindre en ligne</span>
                      </a>
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
    </PageContainer>
  );
};

export default Events;
