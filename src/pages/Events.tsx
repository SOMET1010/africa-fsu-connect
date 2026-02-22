import { Calendar as CalendarIcon } from "lucide-react";
import { useAccessibility } from "@/hooks/useAccessibility";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AccessibleAlert } from "@/components/ui/accessible-alert";
import { ModernEventCard } from "@/components/events/ModernEventCard";
import { EventsHero } from "@/components/events/EventsHero";
import { Calendar } from "@/components/ui/calendar";

import { useEventsPage } from "./events/hooks/useEventsPage";
import { EventsLoadingSkeleton } from "./events/components/EventsLoadingSkeleton";
import { EventsToolbar } from "./events/components/EventsToolbar";

const Events = () => {
  const { announceToScreenReader } = useAccessibility({
    enableSkipLinks: true,
    enableScreenReaderAnnouncements: true,
    enableKeyboardNavigation: true,
    enableFocusManagement: true
  });

  const {
    events,
    filteredEvents,
    upcomingEvents,
    loading,
    selectedView,
    setSelectedView,
    isNewEventOpen,
    setIsNewEventOpen,
    searchTerm,
    setSearchTerm,
    hasActiveFilters,
    newEvent,
    setNewEvent,
    handleViewDetails,
    handleRegister,
    handleUnregister,
    handleCreateEvent,
    generateCalendarFile,
  } = useEventsPage();

  if (loading) {
    return <EventsLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-transparent relative z-10">
      <div className="p-6 lg:p-8 space-y-8">
        <EventsHero 
          totalEvents={events.length}
          upcomingEvents={upcomingEvents.length}
          registeredEvents={events.filter(e => e.is_registered).length}
          onViewChange={setSelectedView}
          announceToScreenReader={announceToScreenReader}
        />
        
        {/* Content Section */}
        <div className="bg-white dark:bg-card rounded-2xl border border-border p-6 lg:p-8 shadow-sm">
          <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-6">
            <EventsToolbar
              selectedView={selectedView}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filteredCount={filteredEvents.length}
              isNewEventOpen={isNewEventOpen}
              onNewEventOpenChange={setIsNewEventOpen}
              newEvent={newEvent}
              onEventChange={setNewEvent}
              onCreateEvent={handleCreateEvent}
              announceToScreenReader={announceToScreenReader}
            />

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
                  </div>
                </AccessibleAlert>
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

            <TabsContent value="list" className="space-y-4" id="events-list" role="tabpanel" aria-labelledby="list-tab">
              {filteredEvents.length === 0 ? (
                <AccessibleAlert variant="info" title="Aucun événement" className="text-center">
                  <p>Aucun événement ne correspond à vos critères.</p>
                </AccessibleAlert>
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

            <TabsContent value="calendar" className="space-y-6" id="events-calendar" role="tabpanel" aria-labelledby="calendar-tab">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  className="rounded-md border"
                  modifiers={{
                    hasEvent: events.map(e => new Date(e.start_date))
                  }}
                  modifiersStyles={{
                    hasEvent: { backgroundColor: 'hsl(var(--primary))', color: 'white', borderRadius: '50%' }
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Events;
