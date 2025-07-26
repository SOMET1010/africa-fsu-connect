import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// PHASE 7 & 8 - Production optimizations
import { preloadCriticalRoutes } from '@/utils/codeSpitting'
import { initializeProductionMonitoring } from '@/utils/productionMonitoring'

// Initialize production monitoring
initializeProductionMonitoring()

// Preload critical routes
preloadCriticalRoutes()

createRoot(document.getElementById("root")!).render(<App />);
