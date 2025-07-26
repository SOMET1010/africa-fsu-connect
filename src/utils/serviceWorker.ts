/**
 * ÉTAPE 4: SERVICE WORKER INTELLIGENT
 * Cache stratégique pour performance optimale
 */

import { logger } from './logger';

const CACHE_NAME = 'sutel-app-v1';
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

class IntelligentCache {
  private cacheFirst = ['images', 'fonts', 'static'];
  private networkFirst = ['api', 'auth'];
  private staleWhileRevalidate = ['documents', 'data'];

  async install() {
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(STATIC_ASSETS);
      logger.info('Service Worker installé avec succès', { 
        component: 'ServiceWorker',
        action: 'install'
      });
    } catch (error) {
      logger.error('Erreur installation Service Worker', error);
    }
  }

  async handleRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    // Strategy: Cache First (assets statiques)
    if (this.cacheFirst.some(type => url.pathname.includes(type))) {
      return this.cacheFirstStrategy(request);
    }
    
    // Strategy: Network First (API calls)
    if (this.networkFirst.some(type => url.pathname.includes(type))) {
      return this.networkFirstStrategy(request);
    }
    
    // Strategy: Stale While Revalidate (données)
    return this.staleWhileRevalidateStrategy(request);
  }

  private async cacheFirstStrategy(request: Request): Promise<Response> {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    
    return response;
  }

  private async networkFirstStrategy(request: Request): Promise<Response> {
    try {
      const response = await fetch(request);
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
      return response;
    } catch (error) {
      const cached = await caches.match(request);
      if (cached) {
        logger.warn('Fallback vers cache pour', { url: request.url });
        return cached;
      }
      throw error;
    }
  }

  private async staleWhileRevalidateStrategy(request: Request): Promise<Response> {
    const cached = await caches.match(request);
    
    // Fetch en arrière-plan pour mise à jour
    const fetchPromise = fetch(request).then(response => {
      const cache = caches.open(CACHE_NAME);
      cache.then(c => c.put(request, response.clone()));
      return response;
    });
    
    // Retourner le cache immédiatement si disponible
    return cached || fetchPromise;
  }

  async cleanup() {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => name !== CACHE_NAME);
    
    await Promise.all(
      oldCaches.map(name => caches.delete(name))
    );
    
    logger.info('Cache nettoyé', { 
      component: 'ServiceWorker',
      deletedCaches: oldCaches.length
    });
  }
}

// Initialisation
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  const intelligentCache = new IntelligentCache();
  
  self.addEventListener('install', (event: any) => {
    event.waitUntil(intelligentCache.install());
  });
  
  self.addEventListener('fetch', (event: any) => {
    event.respondWith(intelligentCache.handleRequest(event.request));
  });
  
  self.addEventListener('activate', (event: any) => {
    event.waitUntil(intelligentCache.cleanup());
  });
}

export { IntelligentCache };