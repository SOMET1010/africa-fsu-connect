import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Play, Video } from "lucide-react";

interface WebinarCardProps {
  title: string;
  description: string;
  presenter: string;
  presenterCountry: string;
  presenterFlag: string;
  date: string;
  time?: string;
  duration: string;
  attendees?: number;
  isUpcoming?: boolean;
  isLive?: boolean;
}

export function WebinarCard({
  title,
  description,
  presenter,
  presenterCountry,
  presenterFlag,
  date,
  time,
  duration,
  attendees,
  isUpcoming = false,
  isLive = false,
}: WebinarCardProps) {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg ${isLive ? 'ring-2 ring-red-500' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          {isLive ? (
            <Badge className="bg-red-500 text-white animate-pulse">
              🔴 En direct
            </Badge>
          ) : isUpcoming ? (
            <Badge variant="secondary">
              <Calendar className="h-3 w-3 mr-1" />
              À venir
            </Badge>
          ) : (
            <Badge variant="outline">
              <Play className="h-3 w-3 mr-1" />
              Replay
            </Badge>
          )}
          <span className="text-sm text-muted-foreground">{duration}</span>
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-2 text-sm mb-4">
          <span className="text-lg">{presenterFlag}</span>
          <div>
            <span className="font-medium">{presenter}</span>
            <span className="text-muted-foreground"> • {presenterCountry}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{date}</span>
          </div>
          {time && (
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{time}</span>
            </div>
          )}
          {attendees && (
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{attendees} inscrits</span>
            </div>
          )}
        </div>

        <Button className="w-full" variant={isUpcoming ? "default" : "outline"}>
          {isLive ? (
            <>
              <Video className="h-4 w-4 mr-2" />
              Rejoindre
            </>
          ) : isUpcoming ? (
            <>
              <Calendar className="h-4 w-4 mr-2" />
              S'inscrire
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Voir le replay
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
