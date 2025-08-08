import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface DashboardStats {
  totalProfiles: number;
  totalDocuments: number;
  totalEvents: number;
  totalSubmissions: number;
  documentsThisMonth: number;
  eventsThisMonth: number;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProfiles: 0,
    totalDocuments: 0,
    totalEvents: 0,
    totalSubmissions: 0,
    documentsThisMonth: 0,
    eventsThisMonth: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch total counts
      const [
        { count: profilesCount },
        { count: documentsCount },
        { count: eventsCount },
        { count: submissionsCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('documents').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('submissions').select('*', { count: 'exact', head: true })
      ]);

      // Fetch this month's counts
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const [
        { count: documentsThisMonth },
        { count: eventsThisMonth }
      ] = await Promise.all([
        supabase
          .from('documents')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfMonth.toISOString()),
        supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfMonth.toISOString())
      ]);

      setStats({
        totalProfiles: profilesCount || 0,
        totalDocuments: documentsCount || 0,
        totalEvents: eventsCount || 0,
        totalSubmissions: submissionsCount || 0,
        documentsThisMonth: documentsThisMonth || 0,
        eventsThisMonth: eventsThisMonth || 0
      });
    } catch (error) {
      logger.error('Error fetching dashboard stats:', error as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, refetch: fetchStats };
};