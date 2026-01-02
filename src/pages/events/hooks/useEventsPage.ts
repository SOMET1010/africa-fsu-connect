import { useState, useMemo } from "react";
import { useEvents, Event, CreateEventData } from "@/hooks/useEvents";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/utils/logger";

export const useEventsPage = () => {
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
      toast({
        title: "Inscription réussie",
        description: "Vous êtes maintenant inscrit à cet événement.",
      });
    } catch (error) {
      logger.error('Registration failed', error);
      toast({
        title: "Erreur d'inscription",
        description: "Impossible de s'inscrire à l'événement.",
        variant: "destructive",
      });
    }
  };

  const handleUnregister = async (eventId: string) => {
    try {
      await unregisterFromEvent(eventId);
      toast({
        title: "Désinscription réussie",
        description: "Vous n'êtes plus inscrit à cet événement.",
      });
    } catch (error) {
      logger.error('Unregistration failed', error);
      toast({
        title: "Erreur de désinscription",
        description: "Impossible de se désinscrire de l'événement.",
        variant: "destructive",
      });
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
      toast({
        title: "Événement créé",
        description: "L'événement a été créé avec succès.",
      });
    } catch (error) {
      logger.error('Event creation failed', error);
      toast({
        title: "Erreur de création",
        description: "Impossible de créer l'événement.",
        variant: "destructive",
      });
    }
  };

  return {
    // Data
    events,
    filteredEvents,
    upcomingEvents,
    loading,
    
    // UI State
    selectedView,
    setSelectedView,
    isNewEventOpen,
    setIsNewEventOpen,
    selectedEvent,
    isDetailsOpen,
    setIsDetailsOpen,
    
    // Filters
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    selectedDate,
    setSelectedDate,
    selectedLocation,
    setSelectedLocation,
    onlyRegistered,
    setOnlyRegistered,
    hasActiveFilters,
    handleClearFilters,
    
    // Form
    newEvent,
    setNewEvent,
    
    // Actions
    handleViewDetails,
    handleRegister,
    handleUnregister,
    handleCreateEvent,
    generateCalendarFile,
  };
};
