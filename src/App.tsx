import { AppProviders } from '@/components/app/AppProviders';
import { AppRoutes } from '@/components/app/AppRoutes';
import { CookieConsentBanner } from '@/components/privacy/CookieConsentBanner';

const App = () => (
  <AppProviders>
    <AppRoutes />
    <CookieConsentBanner />
  </AppProviders>
);

export default App;
