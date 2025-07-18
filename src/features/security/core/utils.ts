
import { SECURITY_CONSTANTS } from './constants';

export const formatSessionTimeout = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
  }
  return `${minutes}m`;
};

export const validateSessionTimeout = (timeout: number): boolean => {
  return timeout >= SECURITY_CONSTANTS.MIN_SESSION_TIMEOUT && 
         timeout <= SECURITY_CONSTANTS.MAX_SESSION_TIMEOUT;
};

export const validateConcurrentSessions = (sessions: number): boolean => {
  return sessions >= SECURITY_CONSTANTS.MIN_CONCURRENT_SESSIONS && 
         sessions <= SECURITY_CONSTANTS.MAX_CONCURRENT_SESSIONS;
};

export const getDeviceInfo = (userAgent?: string) => {
  if (!userAgent) return { type: 'unknown', name: 'Appareil inconnu' };
  
  if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
    return { type: 'mobile', name: 'Appareil mobile' };
  }
  
  if (userAgent.includes('Chrome')) return { type: 'desktop', name: 'Chrome' };
  if (userAgent.includes('Firefox')) return { type: 'desktop', name: 'Firefox' };
  if (userAgent.includes('Safari')) return { type: 'desktop', name: 'Safari' };
  
  return { type: 'desktop', name: 'Navigateur de bureau' };
};

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'low':
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    case 'high':
      return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
    case 'critical':
      return 'text-red-600 bg-red-100 dark:bg-red-900/20';
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
  }
};
