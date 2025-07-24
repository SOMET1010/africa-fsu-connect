import { useState, useMemo } from "react";
import { Plus, Calendar as CalendarIcon, List, Grid, Search, Filter, Clock, MapPin, Users, User } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useEvents, Event, CreateEventData } from "@/hooks/useEvents";
import { useAccessibility } from "@/hooks/useAccessibility";
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
import { AccessibleCard } from "@/components/ui/accessible-card";
import { SkipLinks } from "@/components/ui/skip-links";
import { AccessibleAlert } from "@/components/ui/accessible-alert";
import { GradientStatsCard } from "@/components/ui/gradient-stats-card";
import { EventFilters } from "@/components/events/EventFilters";
import { ModernEventCard } from "@/components/events/ModernEventCard";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Events = () => {
  const { announceToScreenReader, manageFocus } = useAccessibility({
    enableSkipLinks: true,
    enableScreenReaderAnnouncements: true,
    enableKeyboardNavigation: true,
    enableFocusManagement: true
  });
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="p-6 lg:p-8 space-y-8">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Skip Links for Accessibility */}
      <SkipLinks 
        links={[
          { href: "#main-content", label: "Aller au contenu principal" },
          { href: "#search-events", label: "Aller à la recherche" },
          { href: "#events-grid", label: "Aller à la liste des événements" }
        ]}
      />
      
      <div className="p-6 lg:p-8 space-y-8">
        {/* Hero Section with Stats */}
        <section 
          aria-labelledby="hero-title"
          className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl translate-y-16 -translate-x-16" />
          
          <div className="relative z-10 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
                  <span className="text-sm font-medium text-white/90">Plateforme FSU</span>
                </div>
                
                <h1 id="hero-title" className="text-4xl lg:text-5xl font-bold leading-tight">
                  {t('events.title')}
                </h1>
                
                <p className="text-lg lg:text-xl text-white/90 leading-relaxed">
                  {t('events.description')}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => {
                      setSelectedView("calendar");
                      announceToScreenReader("Vue calendrier activée");
                    }}
                    variant="secondary"
                    size="lg"
                    className="font-semibold bg-white text-gray-900 hover:bg-white/90 enhanced-focus"
                    aria-describedby="calendar-button-desc"
                  >
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    {t('events.viewCalendar')}
                  </Button>
                  <span id="calendar-button-desc" className="sr-only">
                    Basculer vers la vue calendrier pour naviguer par dates
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="space-y-4" role="region" aria-labelledby="stats-heading">
              <h2 id="stats-heading" className="sr-only">Statistiques des événements</h2>
              <div className="grid grid-cols-2 gap-4">
                <GradientStatsCard
                  title={t('events.stats.total')}
                  value={events.length}
                  icon={CalendarIcon}
                  variant="blue"
                  size="sm"
                />
                <GradientStatsCard
                  title={t('events.stats.upcoming')}
                  value={upcomingEvents.length}
                  icon={Clock}
                  variant="teal"
                  size="sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <GradientStatsCard
                  title={t('events.stats.registered')}
                  value={events.filter(e => e.is_registered).length}
                  icon={User}
                  variant="green"
                  size="sm"
                />
                <GradientStatsCard
                  title={t('events.stats.support')}
                  value="24/7"
                  icon={Users}
                  variant="purple"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Content Section */}
        <main id="main-content" className="bg-card rounded-3xl border border-border p-6 lg:p-8 shadow-lg">
          <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <TabsList className="grid w-full lg:w-auto grid-cols-3" role="tablist" aria-label="Vues des événements">
                <TabsTrigger 
                  value="grid" 
                  className="flex items-center gap-2 enhanced-focus"
                  aria-controls="events-grid"
                  aria-selected={selectedView === "grid"}
                >
                  <Grid className="h-4 w-4" />
                  {t('events.views.grid')}
                </TabsTrigger>
                <TabsTrigger 
                  value="list" 
                  className="flex items-center gap-2 enhanced-focus"
                  aria-controls="events-list"
                  aria-selected={selectedView === "list"}
                >
                  <List className="h-4 w-4" />
                  {t('events.views.list')}
                </TabsTrigger>
                <TabsTrigger 
                  value="calendar" 
                  className="flex items-center gap-2 enhanced-focus"
                  aria-controls="events-calendar"
                  aria-selected={selectedView === "calendar"}
                >
                  <CalendarIcon className="h-4 w-4" />
                  {t('events.views.calendar')}
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" aria-hidden="true" />
                  <Input
                    id="search-events"
                    placeholder="Rechercher un événement..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      if (e.target.value) {
                        announceToScreenReader(`Recherche mise à jour: ${filteredEvents.length} événements trouvés`);
                      }
                    }}
                    className="pl-10 enhanced-focus"
                    aria-label="Rechercher dans les événements"
                    aria-describedby="search-help"
                  />
                  <span id="search-help" className="sr-only">
                    Tapez pour rechercher dans les titres et descriptions des événements
                  </span>
                </div>
                <Dialog open={isNewEventOpen} onOpenChange={setIsNewEventOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-primary hover:bg-primary/90 enhanced-focus"
                      aria-describedby="new-event-desc"
                    >
                      <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                      Nouvel événement
                    </Button>
                  </DialogTrigger>
                  <span id="new-event-desc" className="sr-only">
                    Ouvre un formulaire pour créer un nouvel événement
                  </span>
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

            <TabsContent value="grid" className="space-y-6" id="events-grid" role="tabpanel" aria-labelledby="grid-tab">
              {filteredEvents.length === 0 ? (
                <AccessibleAlert
                  variant="info"
                  title="Aucun événement trouvé"
                  className="text-center"
                  autoFocus={hasActiveFilters}
                >
                  <div className="space-y-4">
                    <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto" aria-hidden="true" />
                    <p>
                      {hasActiveFilters 
                        ? "Essayez de modifier vos filtres de recherche" 
                        : "Il n'y a pas d'événements pour le moment"}
                    </p>
                    {hasActiveFilters && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          handleClearFilters();
                          announceToScreenReader("Filtres effacés, tous les événements sont maintenant affichés");
                        }}
                        className="enhanced-focus"
                      >
                        Effacer les filtres
                      </Button>
                    )}
                  </div>
                </AccessibleAlert>
              ) : (
                <div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  role="region"
                  aria-label={`${filteredEvents.length} événements affichés en grille`}
                >
                  {filteredEvents.map((event, index) => (
                    <AccessibleCard
                      key={event.id}
                      title={event.title}
                      description={event.description || "Aucune description disponible"}
                      interactive={true}
                      focusable={true}
                      className="hover:shadow-lg transition-all duration-300 group"
                      onClick={() => {
                        handleViewDetails(event);
                        announceToScreenReader(`Détails de l'événement ${event.title} ouverts`);
                      }}
                      aria-label={`Événement ${index + 1} sur ${filteredEvents.length}: ${event.title}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="group-hover:text-primary transition-colors">
                            {event.title}
                          </CardTitle>
                          <div className="flex items-center text-muted-foreground text-sm">
                            <CalendarIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                            <time dateTime={event.start_date}>
                              {format(new Date(event.start_date), "d MMMM yyyy", { locale: fr })}
                            </time>
                          </div>
                        </div>
                        <Badge 
                          variant="secondary"
                          aria-label={`Type d'événement: ${event.is_virtual ? "Virtuel" : "Présentiel"}`}
                        >
                          {event.is_virtual ? "Virtuel" : "Présentiel"}
                        </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <CardDescription>
                          {event.description || "Aucune description disponible"}
                        </CardDescription>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" aria-hidden="true" />
                            <span aria-label="Lieu">{event.location || "En ligne"}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" aria-hidden="true" />
                            <span aria-label="Participants maximum">{event.max_attendees || "Illimité"}</span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full enhanced-focus"
                          onClick={(e) => {
                            e.stopPropagation();
                            const action = event.is_registered ? handleUnregister : handleRegister;
                            action(event.id);
                            const message = event.is_registered 
                              ? `Désinscription de ${event.title}` 
                              : `Inscription à ${event.title}`;
                            announceToScreenReader(message);
                          }}
                          aria-label={event.is_registered ? `Se désinscrire de ${event.title}` : `S'inscrire à ${event.title}`}
                        >
                          {event.is_registered ? "Se désinscrire" : "S'inscrire"}
                        </Button>
                      </CardContent>
                    </AccessibleCard>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="list" className="space-y-6">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucun événement trouvé</h3>
                  <p className="text-muted-foreground">
                    {hasActiveFilters 
                      ? "Essayez de modifier vos filtres de recherche" 
                      : "Il n'y a pas d'événements pour le moment"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <Card key={event.id} className="hover:shadow-md transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{event.title}</CardTitle>
                          <Badge variant="secondary">
                            {format(new Date(event.start_date), "d MMM", { locale: fr })}
                          </Badge>
                        </div>
                        <CardDescription>
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
                  <Card className="p-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate || undefined}
                      onSelect={(date) => setSelectedDate(date || null)}
                    />
                  </Card>
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
                            <Card key={event.id}>
                              <CardHeader>
                                <CardTitle>{event.title}</CardTitle>
                                <CardDescription>
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
        </main>
      </div>
    </div>
  );
};

export default Events;