import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Shield, 
  AlertTriangle, 
  Activity,
  BarChart3,
  Clock,
  MapPin,
  Smartphone,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SecurityMetrics {
  total_logins: number;
  failed_attempts: number;
  unique_devices: number;
  unique_locations: number;
  risk_score: number;
  threat_level: 'low' | 'medium' | 'high' | 'critical';
}

interface ThreatActivity {
  type: string;
  count: number;
  last_occurrence: string;
  severity: string;
}

const SecurityAnalytics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [threatActivity, setThreatActivity] = useState<ThreatActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadSecurityAnalytics();
    }
  }, [user]);

  const loadSecurityAnalytics = async () => {
    try {
      setLoading(true);
      
      // Get audit logs for analysis
      const { data: auditLogs, error: auditError } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', user!.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (auditError) throw auditError;

      // Get anomaly alerts
      const { data: anomalies, error: anomalyError } = await supabase
        .from('anomaly_alerts')
        .select('*')
        .eq('user_id', user!.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (anomalyError) throw anomalyError;

      // Calculate metrics
      const loginLogs = auditLogs?.filter(log => log.action_type === 'login') || [];
      const failedLogins = auditLogs?.filter(log => log.action_type === 'login' && !log.success) || [];
      const devices = new Set(auditLogs?.map(log => log.user_agent).filter(Boolean));
      const locations = new Set(auditLogs?.map(log => {
        const details = log.details as any;
        return details?.location;
      }).filter(Boolean));

      const calculatedMetrics: SecurityMetrics = {
        total_logins: loginLogs.length,
        failed_attempts: failedLogins.length,
        unique_devices: devices.size,
        unique_locations: locations.size,
        risk_score: calculateRiskScore(anomalies || []),
        threat_level: calculateThreatLevel(anomalies || [])
      };

      // Calculate threat activity
      const threatMap = new Map<string, ThreatActivity>();
      anomalies?.forEach(anomaly => {
        const key = anomaly.type;
        if (threatMap.has(key)) {
          const existing = threatMap.get(key)!;
          existing.count++;
          if (new Date(anomaly.created_at) > new Date(existing.last_occurrence)) {
            existing.last_occurrence = anomaly.created_at;
            existing.severity = anomaly.severity;
          }
        } else {
          threatMap.set(key, {
            type: anomaly.type,
            count: 1,
            last_occurrence: anomaly.created_at,
            severity: anomaly.severity
          });
        }
      });

      setMetrics(calculatedMetrics);
      setThreatActivity(Array.from(threatMap.values()));
      
    } catch (error) {
      console.error('Error loading security analytics:', error);
      toast.error('Erreur lors du chargement des analyses de sécurité');
    } finally {
      setLoading(false);
    }
  };

  const runSecurityAnalysis = async () => {
    try {
      setAnalyzing(true);
      
      const { data, error } = await supabase.functions.invoke('security-ai-anomaly', {
        body: { 
          action: 'analyze_login_pattern',
          data: {
            ip_address: '192.168.1.1', // Would get real IP in production
            user_agent: navigator.userAgent,
            location: 'Current Location' // Would get real location in production
          }
        }
      });

      if (error) throw error;
      
      toast.success(`Analyse terminée: ${data.anomalies_detected} anomalie(s) détectée(s)`);
      
      // Reload analytics after analysis
      await loadSecurityAnalytics();
      
    } catch (error) {
      console.error('Error running security analysis:', error);
      toast.error('Erreur lors de l\'analyse de sécurité');
    } finally {
      setAnalyzing(false);
    }
  };

  const calculateRiskScore = (anomalies: any[]): number => {
    const severityWeights = { low: 1, medium: 3, high: 5, critical: 10 };
    return anomalies.reduce((score, anomaly) => {
      return score + (severityWeights[anomaly.severity as keyof typeof severityWeights] || 0);
    }, 0);
  };

  const calculateThreatLevel = (anomalies: any[]): 'low' | 'medium' | 'high' | 'critical' => {
    const riskScore = calculateRiskScore(anomalies);
    if (riskScore >= 20) return 'critical';
    if (riskScore >= 10) return 'high';
    if (riskScore >= 5) return 'medium';
    return 'low';
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'suspicious_login': return <AlertTriangle className="h-4 w-4" />;
      case 'unusual_location': return <MapPin className="h-4 w-4" />;
      case 'device_change': return <Smartphone className="h-4 w-4" />;
      case 'time_anomaly': return <Clock className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="h-20 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analyses de sécurité avancées
              </CardTitle>
              <CardDescription>
                Intelligence artificielle pour la détection des menaces en temps réel
              </CardDescription>
            </div>
            <Button 
              onClick={runSecurityAnalysis}
              disabled={analyzing}
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${analyzing ? 'animate-spin' : ''}`} />
              {analyzing ? 'Analyse...' : 'Analyser'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Connexions</span>
                </div>
                <p className="text-2xl font-bold">{metrics.total_logins}</p>
                <p className="text-sm text-muted-foreground">30 derniers jours</p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Tentatives échouées</span>
                </div>
                <p className="text-2xl font-bold">{metrics.failed_attempts}</p>
                <p className="text-sm text-muted-foreground">Échecs de connexion</p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Appareils</span>
                </div>
                <p className="text-2xl font-bold">{metrics.unique_devices}</p>
                <p className="text-sm text-muted-foreground">Appareils uniques</p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Localisations</span>
                </div>
                <p className="text-2xl font-bold">{metrics.unique_locations}</p>
                <p className="text-sm text-muted-foreground">Lieux de connexion</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Threat Level & Risk Score */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Niveau de menace
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metrics && (
              <div className="text-center">
                <Badge className={`text-lg px-4 py-2 ${getThreatLevelColor(metrics.threat_level)}`}>
                  {metrics.threat_level.toUpperCase()}
                </Badge>
                <p className="text-3xl font-bold mt-4">{metrics.risk_score}</p>
                <p className="text-sm text-muted-foreground">Score de risque</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Activité des menaces
            </CardTitle>
          </CardHeader>
          <CardContent>
            {threatActivity.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p>Aucune menace détectée</p>
              </div>
            ) : (
              <div className="space-y-3">
                {threatActivity.slice(0, 3).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getActivityIcon(activity.type)}
                      <span className="text-sm">{activity.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {activity.count}
                      </Badge>
                      <Badge className={`text-xs ${getThreatLevelColor(activity.severity)}`}>
                        {activity.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityAnalytics;