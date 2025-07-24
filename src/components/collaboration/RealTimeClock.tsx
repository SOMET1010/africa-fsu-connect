import { useState, useEffect } from 'react';
import { Clock, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { getCurrentUserTimezone, formatTimeWithTimezone } from '@/utils/timeUtils';

interface RealTimeClockProps {
  showTimezone?: boolean;
  className?: string;
}

export const RealTimeClock = ({ showTimezone = true, className }: RealTimeClockProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timezone] = useState(getCurrentUserTimezone());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeString = format(currentTime, 'HH:mm:ss', { locale: fr });
  const dateString = format(currentTime, 'EEEE dd MMMM yyyy', { locale: fr });
  const timezoneShort = timezone.split('/').pop()?.replace('_', ' ') || 'UTC';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <div className="text-sm">
          <div className="font-mono font-semibold">{timeString}</div>
          <div className="text-xs text-muted-foreground capitalize">{dateString}</div>
        </div>
      </div>
      
      {showTimezone && (
        <Badge variant="outline" className="text-xs">
          <Globe className="h-3 w-3 mr-1" />
          {timezoneShort}
        </Badge>
      )}
    </div>
  );
};