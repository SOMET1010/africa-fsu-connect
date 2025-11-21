import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, Users, Clock, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface AnalyticsData {
  totalSessions: number;
  completionRate: number;
  avgDuration: number;
  mostViewedSection: number;
  exportRate: number;
  shareRate: number;
}

export const PresentationAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [sectionData, setSectionData] = useState<any[]>([]);
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      const { data: sessions, error } = await supabase
        .from('presentation_sessions')
        .select('*')
        .gte('started_at', startDate.toISOString());

      if (error) throw error;

      if (sessions && sessions.length > 0) {
        // Calculate metrics
        const totalSessions = sessions.length;
        const completedSessions = sessions.filter(s => s.completed).length;
        const completionRate = (completedSessions / totalSessions) * 100;
        
        const avgDuration = sessions.reduce((sum, s) => sum + (s.total_duration || 0), 0) / totalSessions;
        
        // Section analysis
        const sectionCounts: Record<number, number> = {};
        sessions.forEach(session => {
          (session.sections_visited || []).forEach((section: number) => {
            sectionCounts[section] = (sectionCounts[section] || 0) + 1;
          });
        });
        
        const mostViewed = Object.entries(sectionCounts).sort((a, b) => b[1] - a[1])[0];
        
        // Interaction analysis
        const exportsCount = sessions.filter(s => {
          const interactions = s.interactions as any;
          return interactions?.exports || interactions?.export;
        }).length;
        const sharesCount = sessions.filter(s => {
          const interactions = s.interactions as any;
          return interactions?.shares || interactions?.share;
        }).length;
        
        setAnalytics({
          totalSessions,
          completionRate,
          avgDuration: Math.round(avgDuration),
          mostViewedSection: mostViewed ? parseInt(mostViewed[0]) : 0,
          exportRate: (exportsCount / totalSessions) * 100,
          shareRate: (sharesCount / totalSessions) * 100,
        });

        // Section data for chart
        const sectionNames = [
          'Hero', 'Regional', 'ROI', 'Demo', 
          'Architecture', 'Social Proof', 'Security', 'CTA'
        ];
        
        const sectionChartData = Object.entries(sectionCounts).map(([section, count]) => ({
          name: sectionNames[parseInt(section)] || `Section ${section}`,
          views: count,
        }));
        setSectionData(sectionChartData);

        // Device data
        const deviceCounts = sessions.reduce((acc, s) => {
          const type = s.device_type || 'unknown';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const deviceChartData = Object.entries(deviceCounts).map(([device, count]) => ({
          name: device,
          value: count,
        }));
        setDeviceData(deviceChartData);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Erreur lors du chargement des analytics');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    // Simple CSV export
    const csv = `Metric,Value\nTotal Sessions,${analytics?.totalSessions}\nCompletion Rate,${analytics?.completionRate}%\nAvg Duration,${analytics?.avgDuration}s`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `presentation-analytics-${Date.now()}.csv`;
    a.click();
    toast.success('Analytics exportées');
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Chargement des analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics de Présentation</h1>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range === '7d' ? '7 jours' : range === '30d' ? '30 jours' : '90 jours'}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Sessions Totales</p>
              <p className="text-2xl font-bold">{analytics?.totalSessions || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Taux de Complétion</p>
              <p className="text-2xl font-bold">{analytics?.completionRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Durée Moyenne</p>
              <p className="text-2xl font-bold">{Math.floor((analytics?.avgDuration || 0) / 60)}m</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Taux d'Export</p>
              <p className="text-2xl font-bold">{analytics?.exportRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Vues par Section</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Répartition des Appareils</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
