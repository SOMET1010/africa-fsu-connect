import { format, formatDistanceToNow, differenceInMinutes, differenceInHours, differenceInDays, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatCollaborationTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const minutesAgo = differenceInMinutes(now, date);
  const hoursAgo = differenceInHours(now, date);
  const daysAgo = differenceInDays(now, date);

  if (minutesAgo < 1) {
    return 'À l\'instant';
  } else if (minutesAgo < 60) {
    return `Il y a ${minutesAgo} minute${minutesAgo > 1 ? 's' : ''}`;
  } else if (hoursAgo < 24) {
    return `Il y a ${hoursAgo} heure${hoursAgo > 1 ? 's' : ''}`;
  } else if (daysAgo < 7) {
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  } else {
    return format(date, 'dd/MM/yyyy à HH:mm', { locale: fr });
  }
};

export const formatDetailedTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return `Aujourd'hui à ${format(date, 'HH:mm', { locale: fr })}`;
  } else if (isYesterday(date)) {
    return `Hier à ${format(date, 'HH:mm', { locale: fr })}`;
  } else {
    return format(date, 'dd/MM/yyyy à HH:mm', { locale: fr });
  }
};

export const formatDuration = (startTime: string, endTime?: string): string => {
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();
  const minutes = differenceInMinutes(end, start);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''}`;
  }
  return `${minutes}m`;
};

export const getCurrentUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const formatTimeWithTimezone = (timestamp: string): string => {
  const date = new Date(timestamp);
  const timezone = getCurrentUserTimezone();
  const timeString = format(date, 'HH:mm', { locale: fr });
  const timezoneShort = timezone.split('/').pop()?.replace('_', ' ') || 'UTC';
  
  return `${timeString} (${timezoneShort})`;
};

export const getCollaborationStats = (events: Array<{ timestamp: string; user_id: string }>) => {
  const now = new Date();
  const today = events.filter(event => isToday(new Date(event.timestamp)));
  const thisWeek = events.filter(event => {
    const eventDate = new Date(event.timestamp);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return eventDate > weekAgo;
  });

  const uniqueUsersToday = new Set(today.map(e => e.user_id)).size;
  const uniqueUsersThisWeek = new Set(thisWeek.map(e => e.user_id)).size;

  return {
    eventsToday: today.length,
    eventsThisWeek: thisWeek.length,
    uniqueUsersToday,
    uniqueUsersThisWeek,
  };
};

export const getPeakCollaborationHours = (events: Array<{ timestamp: string }>) => {
  const hourCounts = new Array(24).fill(0);
  
  events.forEach(event => {
    const hour = new Date(event.timestamp).getHours();
    hourCounts[hour]++;
  });

  const maxCount = Math.max(...hourCounts);
  const peakHours = hourCounts
    .map((count, hour) => ({ hour, count }))
    .filter(({ count }) => count === maxCount)
    .map(({ hour }) => hour);

  return peakHours;
};

export const getActivityPattern = (userEvents: Array<{ timestamp: string }>) => {
  const patterns = {
    morning: 0, // 6-12
    afternoon: 0, // 12-18
    evening: 0, // 18-22
    night: 0, // 22-6
  };

  userEvents.forEach(event => {
    const hour = new Date(event.timestamp).getHours();
    
    if (hour >= 6 && hour < 12) patterns.morning++;
    else if (hour >= 12 && hour < 18) patterns.afternoon++;
    else if (hour >= 18 && hour < 22) patterns.evening++;
    else patterns.night++;
  });

  const total = Object.values(patterns).reduce((sum, count) => sum + count, 0);
  const percentages = Object.fromEntries(
    Object.entries(patterns).map(([key, count]) => [key, total > 0 ? (count / total) * 100 : 0])
  );

  return percentages;
};