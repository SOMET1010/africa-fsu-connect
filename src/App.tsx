import { AppProviders } from '@/components/app/AppProviders';
import { AppRoutes } from '@/components/app/AppRoutes';
import { CookieConsentBanner } from '@/components/privacy/CookieConsentBanner';
import { AdminHeatmapOverlay } from '@/components/analytics/AdminHeatmapOverlay';

const App = () => (
  <AppProviders>
    <AppRoutes />
    <CookieConsentBanner />
    <AdminHeatmapOverlay />
  </AppProviders>
);

export default App;