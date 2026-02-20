import { useAuth } from '@/contexts/AuthContext';
import { HeatmapOverlay } from './HeatmapOverlay';

export const AdminHeatmapOverlay = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin()) return null;

  return <HeatmapOverlay />;
};
