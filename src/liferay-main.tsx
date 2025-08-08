
import { createRoot } from 'react-dom/client';
import LiferayApp from './LiferayApp';
import { logger } from '@/utils/logger';
import './index.css';

// Point d'entrée pour Liferay
declare global {
  interface Window {
    LIFERAY_PORTLET_NAMESPACE?: string;
    LIFERAY_CURRENT_URL?: string;
    LIFERAY_USER_ID?: string;
    Liferay: any;
  }
}

// Fonction d'initialisation du portlet
const initPortlet = () => {
  const namespace = window.LIFERAY_PORTLET_NAMESPACE || 'default';
  const currentUrl = window.LIFERAY_CURRENT_URL || '/';
  const userId = window.LIFERAY_USER_ID || '';
  
  const rootElement = document.getElementById(`${namespace}-react-sutel-root`);
  
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <LiferayApp 
        namespace={namespace}
        currentUrl={currentUrl}
        userId={userId}
      />
    );
    
    logger.info(`React SUTEL Portlet initialized`, { component: 'LiferayMain', namespace });
  } else {
    logger.error(`Root element not found: ${namespace}-react-sutel-root`);
  }
};

// Attendre que Liferay soit prêt ou initialiser directement
if (window.Liferay && window.Liferay.ready) {
  window.Liferay.ready(initPortlet);
} else {
  // Fallback pour le développement
  document.addEventListener('DOMContentLoaded', initPortlet);
}
