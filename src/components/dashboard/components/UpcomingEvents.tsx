import { Calendar, ArrowRight, Video, MapPin } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface UpcomingEvent {
  id: string;
  title: string;
  date: Date;
  type: "webinar" | "workshop" | "conference" | "meeting";
  isVirtual: boolean;
}

interface UpcomingEventsProps {
  events?: UpcomingEvent[];
  onViewEvent?: (eventId: string) => void;
  onViewAll?: () => void;
}

const defaultEvents: UpcomingEvent[] = [
  {
    id: "1",
    title: "Webinaire Régulation FSU",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    type: "webinar",
    isVirtual: true
  },
  {
    id: "2",
    title: "Atelier Financement FSU",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    type: "workshop",
    isVirtual: true
  },
  {
    id: "3",
    title: "Conférence Annuelle SUTEL",
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    type: "conference",
    isVirtual: false
  }
];

const eventTypeLabels: Record<UpcomingEvent["type"], string> = {
  webinar: "Webinaire",
  workshop: "Atelier",
  conference: "Conférence",
  meeting: "Réunion"
};

export function UpcomingEvents({ 
  events = defaultEvents,
  onViewEvent,
  onViewAll
}: UpcomingEventsProps) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Prochains événements
          </h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onViewAll} className="gap-1 text-muted-foreground">
          Voir tout
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      <div className="space-y-3">
        {events.slice(0, 3).map((event) => (
          <button
            key={event.id}
            onClick={() => onViewEvent?.(event.id)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
          >
            <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
              <span className="text-xs font-medium uppercase">
                {format(event.date, "MMM", { locale: fr })}
              </span>
              <span className="text-lg font-bold leading-none">
                {format(event.date, "d")}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{event.title}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  {eventTypeLabels[event.type]}
                </Badge>
                {event.isVirtual ? (
                  <span className="flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    En ligne
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Présentiel
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
