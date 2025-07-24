
import React, { memo, useMemo, useCallback } from "react";
import { Calendar, Clock, MapPin, Users, Video, UserCheck, Eye, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

const ModernEventCard = memo(({
  event,
  onViewDetails,
  onRegister,
  onUnregister,
  onGenerateCalendar
}: ModernEventCardProps) => {
  // Mémorisation des valeurs calculées
  const now = useMemo(() => new Date(), []);
  const startDate = useMemo(() => new Date(event.start_date), [event.start_date]);
  const isUpcoming = useMemo(() => startDate > now, [startDate, now]);

  const statusColor = useMemo(() => {
    if (event.is_registered) {
      return "bg-success/10 text-success border-success/20";
    }
    if (isUpcoming) {
      return "bg-primary/10 text-primary border-primary/20";
    }
    return "bg-muted text-muted-foreground border-border";
  }, [event.is_registered, isUpcoming]);

  const statusText = useMemo(() => {
    if (event.is_registered) return "Inscrit";
    if (isUpcoming) return "Inscription ouverte";
    return "Terminé";
  }, [event.is_registered, isUpcoming]);

  const typeIcon = useMemo(() => {
    return event.is_virtual ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />;
  }, [event.is_virtual]);

  const timeToEvent = useMemo(() => 
    formatDistanceToNow(startDate, { addSuffix: true, locale: fr }), 
    [startDate]
  );

  const capacity = useMemo(() => 
    event.max_attendees ? 
      `${event.current_attendees}/${event.max_attendees}` : 
      `${event.current_attendees}`,
    [event.current_attendees, event.max_attendees]
  );

  const capacityPercentage = useMemo(() => 
    event.max_attendees ? (event.current_attendees / event.max_attendees) * 100 : 0,
    [event.current_attendees, event.max_attendees]
  );

  const isCapacityFull = useMemo(() => 
    event.max_attendees ? event.current_attendees >= event.max_attendees : false,
    [event.current_attendees, event.max_attendees]
  );

  // Handlers optimisés
  const handleViewDetails = useCallback(() => onViewDetails(event), [onViewDetails, event]);
  const handleRegister = useCallback(() => onRegister(event.id), [onRegister, event.id]);
  const handleUnregister = useCallback(() => onUnregister(event.id), [onUnregister, event.id]);
  const handleGenerateCalendar = useCallback(() => onGenerateCalendar(event.id), [onGenerateCalendar, event.id]);

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
              {typeIcon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {event.title}
              </h3>
              <p className="text-sm text-muted-foreground">{timeToEvent}</p>
            </div>
          </div>
          <Badge className={statusColor}>
            {statusText}
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
            onClick={handleViewDetails}
            className="text-primary hover:text-primary hover:bg-primary/10"
          >
            <Eye className="h-4 w-4 mr-2" />
            Détails
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGenerateCalendar}
            >
              <Download className="h-4 w-4" />
            </Button>
            
            {event.is_registered ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleUnregister}
                className="border-success text-success hover:bg-success/10"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Inscrit
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleRegister}
                disabled={isCapacityFull}
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
});

ModernEventCard.displayName = "ModernEventCard";

export { ModernEventCard };
