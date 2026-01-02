import { useTranslation } from 'react-i18next';

/**
 * Hook for RTL/LTR direction support
 * Provides utilities for animations and conditional styling based on language direction
 */
export const useDirection = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';
  
  return {
    /** Whether current language is RTL (Arabic) */
    isRTL,
    /** Current direction: 'rtl' or 'ltr' */
    dir,
    /** Helper to invert translateX values for Framer Motion animations */
    translateX: (value: number) => isRTL ? -value : value,
    /** Helper to conditionally select a class based on direction */
    dirClass: (ltrClass: string, rtlClass: string) => isRTL ? rtlClass : ltrClass,
    /** Logical margin-start (ml in LTR, mr in RTL) */
    marginStart: isRTL ? 'mr' : 'ml',
    /** Logical margin-end (mr in LTR, ml in RTL) */
    marginEnd: isRTL ? 'ml' : 'mr',
  };
};
