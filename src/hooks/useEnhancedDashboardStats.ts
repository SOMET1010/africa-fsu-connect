import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
export type TimeRange = '24h' | '7d' | '30d' | '90d' | '1y';

interface EnhancedDashboardStats {
  // Core metrics
  totalProfiles: number;
  totalDocuments: number;
  totalEvents: number;
  totalSubmissions: number;
  totalAgencies: number;
  totalProjects: number;
  
  // Télécommunications metrics
  totalBtsSites: number;
  localitiesCovered: number;
  totalPopulation: number;
  populationCovered: number;
  coveragePercentage: number;
  
  // Time-based metrics
  documentsThisPeriod: number;
  eventsThisPeriod: number;
  submissionsThisPeriod: number;
  projectsThisPeriod: number;
  
  // Growth metrics
  profilesGrowth: number;
  documentsGrowth: number;
  eventsGrowth: number;
  submissionsGrowth: number;
  
  // Activity metrics
  activeUsers: number;
  engagementRate: number;
  avgSessionDuration: number;
  
  // Regional data
  regionalData: Array<{
    name: string;
    projects: number;
    completion: number;
    agencies: number;
  }>;
  
  // Recent activities
  recentActivities: Array<{
    title: string;
    description: string;
    time: string;
    type: 'project' | 'report' | 'training';
    user?: string;
  }>;
  
  // Performance indicators
  systemHealth: {
    status: 'excellent' | 'good' | 'warning' | 'critical';
    uptime: number;
    responseTime: number;
    errorRate: number;
  };
}

const getTimeRangeDate = (range: TimeRange): Date => {
  const now = new Date();
  switch (range) {
    case '24h':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case '1y':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
};

export const useEnhancedDashboardStats = (timeRange: TimeRange = '30d') => {
  const [stats, setStats] = useState<EnhancedDashboardStats>({
    totalProfiles: 0,
    totalDocuments: 0,
    totalEvents: 0,
    totalSubmissions: 0,
    totalAgencies: 0,
    totalProjects: 0,
    // Télécommunications metrics
    totalBtsSites: 0,
    localitiesCovered: 0,
    totalPopulation: 0,
    populationCovered: 0,
    coveragePercentage: 0,
    documentsThisPeriod: 0,
    eventsThisPeriod: 0,
    submissionsThisPeriod: 0,
    projectsThisPeriod: 0,
    profilesGrowth: 0,
    documentsGrowth: 0,
    eventsGrowth: 0,
    submissionsGrowth: 0,
    activeUsers: 0,
    engagementRate: 85,
    avgSessionDuration: 24,
    regionalData: [],
    recentActivities: [],
    systemHealth: {
      status: 'excellent',
      uptime: 99.9,
      responseTime: 245,
      errorRate: 0.1
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const rangeStart = getTimeRangeDate(timeRange);
      const prevRangeStart = new Date(rangeStart.getTime() - (new Date().getTime() - rangeStart.getTime()));
      
      // Fetch total counts
      const [
        { count: profilesCount },
        { count: documentsCount },
        { count: eventsCount },
        { count: submissionsCount },
        { count: agenciesCount },
        { count: projectsCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('documents').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('submissions').select('*', { count: 'exact', head: true }),
        supabase.from('agencies').select('*', { count: 'exact', head: true }),
        supabase.from('agency_projects').select('*', { count: 'exact', head: true })
      ]);

      // Fetch period-specific counts
      const [
        { count: documentsThisPeriod },
        { count: eventsThisPeriod },
        { count: submissionsThisPeriod },
        { count: projectsThisPeriod }
      ] = await Promise.all([
        supabase
          .from('documents')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', rangeStart.toISOString()),
        supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', rangeStart.toISOString()),
        supabase
          .from('submissions')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', rangeStart.toISOString()),
        supabase
          .from('agency_projects')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', rangeStart.toISOString())
      ]);

      // Fetch previous period for growth calculation
      const [
        { count: documentsLastPeriod },
        { count: eventsLastPeriod },
        { count: submissionsLastPeriod }
      ] = await Promise.all([
        supabase
          .from('documents')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', prevRangeStart.toISOString())
          .lt('created_at', rangeStart.toISOString()),
        supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', prevRangeStart.toISOString())
          .lt('created_at', rangeStart.toISOString()),
        supabase
          .from('submissions')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', prevRangeStart.toISOString())
          .lt('created_at', rangeStart.toISOString())
      ]);

      // Calculate growth percentages
      const calculateGrowth = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
      };

      // Fetch regional data
      const { data: agenciesData } = await supabase
        .from('agencies')
        .select('region, country')
        .limit(100);

      const { data: projectsData } = await supabase
        .from('agency_projects')
        .select('agency_id, completion_percentage')
        .limit(1000);

      // Process regional data
      const regionalMap = new Map();
      agenciesData?.forEach(agency => {
        const key = agency.region || agency.country || 'Autres';
        if (!regionalMap.has(key)) {
          regionalMap.set(key, { name: key, agencies: 0, projects: 0, totalCompletion: 0 });
        }
        regionalMap.get(key).agencies++;
      });

      projectsData?.forEach(project => {
        // This is simplified - you'd need to join with agencies to get proper regional mapping
        const completion = project.completion_percentage || 0;
        const region = 'Afrique'; // Simplified for demo
        if (regionalMap.has(region)) {
          regionalMap.get(region).projects++;
          regionalMap.get(region).totalCompletion += completion;
        }
      });

      const regionalData = Array.from(regionalMap.values()).map(region => ({
        ...region,
        completion: region.projects > 0 ? Math.round(region.totalCompletion / region.projects) : 0
      }));

      // Fetch recent activities
      const { data: recentSubmissions } = await supabase
        .from('submissions')
        .select('title, created_at, submitted_by, profiles(first_name, last_name)')
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: recentDocuments } = await supabase
        .from('documents')
        .select('title, created_at, uploaded_by, profiles(first_name, last_name)')
        .order('created_at', { ascending: false })
        .limit(3);

      const recentActivities = [
        ...(recentSubmissions?.map(submission => ({
          title: submission.title,
          description: 'Nouvelle soumission',
          time: new Date(submission.created_at).toLocaleDateString('fr-FR'),
          type: 'report' as const,
          user: `${(submission as any).profiles?.first_name || ''} ${(submission as any).profiles?.last_name || ''}`.trim() || 'Utilisateur'
        })) || []),
        ...(recentDocuments?.map(doc => ({
          title: doc.title,
          description: 'Document ajouté',
          time: new Date(doc.created_at).toLocaleDateString('fr-FR'),
          type: 'training' as const,
          user: `${(doc as any).profiles?.first_name || ''} ${(doc as any).profiles?.last_name || ''}`.trim() || 'Utilisateur'
        })) || [])
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

      // Calculate telecommunications metrics
      const totalBtsSites = Math.floor((projectsCount || 0) * 2.5); // Estimate based on projects
      const totalPopulation = 45000000; // Total SUTEL region population estimate
      const populationCovered = Math.floor(totalBtsSites * 1200); // Avg 1200 people per BTS
      const localitiesCovered = Math.floor(totalBtsSites * 0.8); // Most BTS cover multiple localities
      const coveragePercentage = Math.min(Math.round((populationCovered / totalPopulation) * 100), 95);

      setStats({
        totalProfiles: profilesCount || 0,
        totalDocuments: documentsCount || 0,
        totalEvents: eventsCount || 0,
        totalSubmissions: submissionsCount || 0,
        totalAgencies: agenciesCount || 0,
        totalProjects: projectsCount || 0,
        // Télécommunications metrics
        totalBtsSites,
        localitiesCovered,
        totalPopulation,
        populationCovered,
        coveragePercentage,
        documentsThisPeriod: documentsThisPeriod || 0,
        eventsThisPeriod: eventsThisPeriod || 0,
        submissionsThisPeriod: submissionsThisPeriod || 0,
        projectsThisPeriod: projectsThisPeriod || 0,
        profilesGrowth: 8, // Simulated for demo
        documentsGrowth: calculateGrowth(documentsThisPeriod || 0, documentsLastPeriod || 0),
        eventsGrowth: calculateGrowth(eventsThisPeriod || 0, eventsLastPeriod || 0),
        submissionsGrowth: calculateGrowth(submissionsThisPeriod || 0, submissionsLastPeriod || 0),
        activeUsers: Math.floor((profilesCount || 0) * 0.6), // Simulated active ratio
        engagementRate: 85,
        avgSessionDuration: 24,
        regionalData,
        recentActivities,
        systemHealth: {
          status: 'excellent',
          uptime: 99.9,
          responseTime: 245,
          errorRate: 0.1
        }
      });
    } catch (error) {
      logger.error('Error fetching enhanced dashboard stats:', error as any);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { 
    stats, 
    loading, 
    error, 
    refreshStats: fetchStats 
  };
};