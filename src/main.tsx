import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// PERFECTION - Production optimizations
import { preloadCriticalRoutes } from '@/utils/codeSpitting'
import { initializeProductionMonitoring } from '@/utils/productionMonitoring'
import { startCacheCleaner } from './utils/performanceOptimizer'
import { healthMonitor } from './utils/healthChecks'
import './utils/serviceWorker'

// Initialize production monitoring
initializeProductionMonitoring()

// Preload critical routes
preloadCriticalRoutes()

// Start cache cleaner
startCacheCleaner()

// Start health monitoring
if (import.meta.env.PROD) {
  healthMonitor.startMonitoring(30000) // Check every 30s
}

createRoot(document.getElementById("root")!).render(<App />);
