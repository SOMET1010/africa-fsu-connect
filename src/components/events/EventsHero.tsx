import { CalendarIcon, Clock, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

interface EventsHeroProps {
  totalEvents: number;
  upcomingEvents: number;
  registeredEvents: number;
  onViewChange: (view: string) => void;
  announceToScreenReader: (message: string) => void;
}

export function EventsHero({
  totalEvents,
  upcomingEvents,
  registeredEvents,
  onViewChange,
  announceToScreenReader
}: EventsHeroProps) {
  const { t } = useTranslation();

  return (
    <section 
      aria-labelledby="hero-title"
      className="bg-gradient-to-br from-primary/90 via-primary to-primary/80 rounded-3xl p-8 lg:p-12 text-primary-foreground relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl translate-y-16 -translate-x-16" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10" />
      
      <div className="relative z-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium text-white/90">Plateforme FSU Events</span>
            </div>
            
            <h1 id="hero-title" className="text-4xl lg:text-6xl font-bold leading-tight tracking-tight">
              {t('events.title') || 'Événements'}
            </h1>
            
            <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl">
              {t('events.description') || 'Découvrez et participez aux événements organisés par la communauté FSU. Webinaires, conférences, ateliers et plus encore.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => {
                  onViewChange("calendar");
                  announceToScreenReader("Vue calendrier activée");
                }}
                variant="secondary"
                size="lg"
                className="font-semibold bg-white text-primary hover:bg-white/90 enhanced-focus shadow-lg"
                aria-describedby="calendar-button-desc"
              >
                <CalendarIcon className="w-5 h-5 mr-2" />
                {t('events.viewCalendar') || 'Voir le calendrier'}
              </Button>
              <Button
                onClick={() => {
                  onViewChange("grid");
                  announceToScreenReader("Vue grille activée");
                }}
                variant="outline"
                size="lg"
                className="font-semibold border-white/30 text-white hover:bg-white/10 enhanced-focus"
              >
                <Users className="w-5 h-5 mr-2" />
                Explorer les événements
              </Button>
              <span id="calendar-button-desc" className="sr-only">
                Basculer vers la vue calendrier pour naviguer par dates
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid - Redesigned */}
        <div className="space-y-4" role="region" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="text-lg font-semibold text-white/90 mb-4">
            Statistiques en temps réel
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{totalEvents}</p>
                  <p className="text-xs text-white/70 font-medium">Total événements</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/30 rounded-lg">
                  <Clock className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{upcomingEvents}</p>
                  <p className="text-xs text-white/70 font-medium">À venir</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/30 rounded-lg">
                  <User className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{registeredEvents}</p>
                  <p className="text-xs text-white/70 font-medium">Mes inscriptions</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/30 rounded-lg">
                  <Users className="w-5 h-5 text-purple-200" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">24/7</p>
                  <p className="text-xs text-white/70 font-medium">Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}