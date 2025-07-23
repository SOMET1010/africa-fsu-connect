
import { Calendar, Clock, MapPin, Users, Video, UserCheck, Eye, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Event } from "@/hooks/useEvents";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface ModernEventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
  onRegister: (eventId: string) => void;
  onUnregister: (eventId: string) => void;
  onGenerateCalendar: (eventId: string) => void;
}

export const ModernEventCard = ({
  event,
  onViewDetails,
  onRegister,
  onUnregister,
  onGenerateCalendar
}: ModernEventCardProps) => {
  const getStatusColor = (event: Event) => {
    const now = new Date();
    const startDate = new Date(event.start_date);
    const isUpcoming = startDate > now;
    
    if (event.is_registered) {
      return "bg-success/10 text-success border-success/20";
    }
    if (isUpcoming) {
      return "bg-primary/10 text-primary border-primary/20";
    }
    return "bg-muted text-muted-foreground border-border";
  };

  const getStatusText = (event: Event) => {
    const now = new Date();
    const startDate = new Date(event.start_date);
    
    if (event.is_registered) return "Inscrit";
    if (startDate > now) return "Inscription ouverte";
    return "Terminé";
  };

  const getTypeIcon = (isVirtual: boolean) => {
    return isVirtual ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />;
  };

  const timeToEvent = formatDistanceToNow(new Date(event.start_date), { 
    addSuffix: true, 
    locale: fr 
  });

  const capacity = event.max_attendees ? 
    `${event.current_attendees}/${event.max_attendees}` : 
    `${event.current_attendees}`;

  const capacityPercentage = event.max_attendees ? 
    (event.current_attendees / event.max_attendees) * 100 : 0;

  return (
    <EnhancedCard 
      variant="glassmorphism" 
      hover="lift" 
      interactive 
      className="group overflow-hidden"
    >
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              {getTypeIcon(event.is_virtual)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {event.title}
              </h3>
              <p className="text-sm text-muted-foreground">{timeToEvent}</p>
            </div>
          </div>
          <Badge className={getStatusColor(event)}>
            {getStatusText(event)}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(event.start_date).toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {new Date(event.start_date).toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">
              {event.location || "En ligne"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{capacity} participants</span>
          </div>
        </div>

        {/* Progress Bar for Capacity */}
        {event.max_attendees && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Participation</span>
              <span>{Math.round(capacityPercentage)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${capacityPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Organizer */}
        {event.organizer && (
          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {event.organizer.first_name?.[0]}{event.organizer.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {event.organizer.first_name} {event.organizer.last_name}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(event)}
            className="text-primary hover:text-primary hover:bg-primary/10"
          >
            <Eye className="h-4 w-4 mr-2" />
            Détails
          </Button>
          
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onGenerateCalendar(event.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ajouter au calendrier</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {event.is_registered ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUnregister(event.id)}
                className="border-success text-success hover:bg-success/10"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Inscrit
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => onRegister(event.id)}
                disabled={event.max_attendees ? event.current_attendees >= event.max_attendees : false}
                className="bg-primary hover:bg-primary/90"
              >
                S'inscrire
              </Button>
            )}
          </div>
        </div>
      </div>
    </EnhancedCard>
  );
};
