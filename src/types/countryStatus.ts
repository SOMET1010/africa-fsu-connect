/**
 * Centralized Country Status Types for SUTEL Network
 * 
 * 4 coherent status levels:
 * - active: Pays très actif avec contributions régulières
 * - member: Membre du réseau avec participation modérée
 * - onboarding: En cours d'intégration au réseau
 * - observer: Observateur ou en phase d'adhésion
 */

export type CountryStatus = 'active' | 'member' | 'onboarding' | 'observer';

export interface StatusConfig {
  color: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  darkBgClass: string;
  darkTextClass: string;
  darkBorderClass: string;
  translationKey: string;
}

export const STATUS_CONFIG: Record<CountryStatus, StatusConfig> = {
  active: {
    color: '#10B981',
    bgClass: 'bg-green-500/10',
    textClass: 'text-green-600',
    borderClass: 'border-green-500/20',
    darkBgClass: 'bg-green-500/20',
    darkTextClass: 'text-green-400',
    darkBorderClass: 'border-green-500/30',
    translationKey: 'country.status.active',
  },
  member: {
    color: '#3B82F6',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-600',
    borderClass: 'border-blue-500/20',
    darkBgClass: 'bg-blue-500/20',
    darkTextClass: 'text-blue-400',
    darkBorderClass: 'border-blue-500/30',
    translationKey: 'country.status.member',
  },
  onboarding: {
    color: '#F59E0B',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-600',
    borderClass: 'border-amber-500/20',
    darkBgClass: 'bg-amber-500/20',
    darkTextClass: 'text-amber-400',
    darkBorderClass: 'border-amber-500/30',
    translationKey: 'country.status.onboarding',
  },
  observer: {
    color: '#9CA3AF',
    bgClass: 'bg-gray-500/10',
    textClass: 'text-gray-600',
    borderClass: 'border-gray-500/20',
    darkBgClass: 'bg-gray-500/20',
    darkTextClass: 'text-gray-400',
    darkBorderClass: 'border-gray-500/30',
    translationKey: 'country.status.observer',
  },
};

export const getStatusConfig = (status: CountryStatus): StatusConfig => {
  return STATUS_CONFIG[status] || STATUS_CONFIG.member;
};

export const getStatusClasses = (status: CountryStatus, isDark: boolean = false): string => {
  const config = getStatusConfig(status);
  if (isDark) {
    return `${config.darkBgClass} ${config.darkTextClass} ${config.darkBorderClass}`;
  }
  return `${config.bgClass} ${config.textClass} ${config.borderClass}`;
};

/**
 * Maps legacy status values to the new harmonized status system
 */
export const migrateStatus = (legacyStatus: string): CountryStatus => {
  switch (legacyStatus) {
    case 'active':
      return 'active';
    case 'member':
      return 'member';
    case 'emerging':
    case 'joining':
      return 'onboarding';
    default:
      return 'observer';
  }
};
