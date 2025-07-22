
import { Calendar, Users, MapPin, Clock } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { Skeleton } from "@/components/ui/skeleton";

export const EventsHero = () => {
  const { events, loading, getUpcomingEvents } = useEvents();
  
  const upcomingEvents = getUpcomingEvents();
  const totalEvents = events.length;
  const registeredEvents = events.filter(e => e.is_registered).length;

  if (loading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-accent rounded-2xl p-8 text-white">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4 bg-white/20" />
            <Skeleton className="h-6 w-full bg-white/20" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32 bg-white/20" />
              <Skeleton className="h-10 w-32 bg-white/20" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 bg-white/20 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-accent rounded-2xl p-8 text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div>
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              Plateforme FSU
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 gradient-text bg-gradient-to-r from-white to-white/80">
              Événements & Formations
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Découvrez les derniers événements, conférences et formations de la communauté FSU. 
              Restez connecté avec les innovations et opportunités du secteur.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-primary hover:bg-white/90 shadow-lg">
              <Calendar className="mr-2 h-5 w-5" />
              Voir le Calendrier
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Users className="mr-2 h-5 w-5" />
              Créer un Événement
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <EnhancedCard variant="glassmorphism" className="bg-white/10 border-white/20 text-center p-6">
            <div className="text-3xl font-bold text-white">{totalEvents}</div>
            <div className="text-white/80 text-sm mt-1">Événements Total</div>
            <Calendar className="h-8 w-8 text-white/60 mx-auto mt-2" />
          </EnhancedCard>
          
          <EnhancedCard variant="glassmorphism" className="bg-white/10 border-white/20 text-center p-6">
            <div className="text-3xl font-bold text-white">{upcomingEvents.length}</div>
            <div className="text-white/80 text-sm mt-1">À Venir</div>
            <Clock className="h-8 w-8 text-white/60 mx-auto mt-2" />
          </EnhancedCard>
          
          <EnhancedCard variant="glassmorphism" className="bg-white/10 border-white/20 text-center p-6">
            <div className="text-3xl font-bold text-white">{registeredEvents}</div>
            <div className="text-white/80 text-sm mt-1">Mes Inscriptions</div>
            <Users className="h-8 w-8 text-white/60 mx-auto mt-2" />
          </EnhancedCard>
          
          <EnhancedCard variant="glassmorphism" className="bg-white/10 border-white/20 text-center p-6">
            <div className="text-3xl font-bold text-white">24/7</div>
            <div className="text-white/80 text-sm mt-1">Support</div>
            <MapPin className="h-8 w-8 text-white/60 mx-auto mt-2" />
          </EnhancedCard>
        </div>
      </div>
    </div>
  );
};
