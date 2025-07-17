import { Routes, Route } from 'react-router-dom';
import { PreferencesPanel } from '@/components/preferences/PreferencesPanel';
import { IntelligentLayout } from '@/components/layout/IntelligentLayout';

const PreferencesPage = () => (
  <IntelligentLayout>
    <PreferencesPanel />
  </IntelligentLayout>
);

export default PreferencesPage;