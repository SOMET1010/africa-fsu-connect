import { Search, Grid, List, Calendar as CalendarIcon } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Input } from "@/components/ui/input";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateEventDialog } from "./CreateEventDialog";
import { CreateEventData } from "@/hooks/useEvents";

interface EventsToolbarProps {
  selectedView: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filteredCount: number;
  isNewEventOpen: boolean;
  onNewEventOpenChange: (open: boolean) => void;
  newEvent: Partial<CreateEventData>;
  onEventChange: (event: Partial<CreateEventData>) => void;
  onCreateEvent: () => void;
  announceToScreenReader: (message: string) => void;
}

export const EventsToolbar = ({
  selectedView,
  searchTerm,
  onSearchChange,
  filteredCount,
  isNewEventOpen,
  onNewEventOpenChange,
  newEvent,
  onEventChange,
  onCreateEvent,
  announceToScreenReader,
}: EventsToolbarProps) => {
  const { t } = useTranslation();

  return (
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
              onSearchChange(e.target.value);
              if (e.target.value) {
                announceToScreenReader(`Recherche mise à jour: ${filteredCount} événements trouvés`);
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
        <CreateEventDialog
          isOpen={isNewEventOpen}
          onOpenChange={onNewEventOpenChange}
          newEvent={newEvent}
          onEventChange={onEventChange}
          onSubmit={onCreateEvent}
        />
      </div>
    </div>
  );
};
