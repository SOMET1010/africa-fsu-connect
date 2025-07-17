import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Globe,
  Shield,
  Ban,
  Activity,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NetworkRule {
  id: string;
  type: 'ip_block' | 'geo_block' | 'rate_limit' | 'user_agent_block';
  value: string;
  action: 'block' | 'allow' | 'monitor';
  description: string;
  created_at: string;
  is_active: boolean;
}

interface SecurityEvent {
  id: string;
  event_type: string;
  ip_address: string;
  country?: string;
  blocked: boolean;
  details: any;
  created_at: string;
}

interface RateLimitConfig {
  requests_per_minute: number;
  requests_per_hour: number;
  requests_per_day: number;
  burst_size: number;
}

const NetworkSecurity = () => {
  const { user } = useAuth();
  const [rules, setRules] = useState<NetworkRule[]>([]);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [rateLimitConfig, setRateLimitConfig] = useState<RateLimitConfig>({
    requests_per_minute: 60,
    requests_per_hour: 1000,
    requests_per_day: 10000,
    burst_size: 10
  });
  const [ddosProtection, setDdosProtection] = useState(false);
  const [geoFiltering, setGeoFiltering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newRule, setNewRule] = useState({
    type: 'ip_block',
    value: '',
    action: 'block',
    description: ''
  });

  useEffect(() => {
    fetchNetworkSecurityData();
  }, [user]);

  const fetchNetworkSecurityData = async () => {
    if (!user?.id) return;

    try {
      // Fetch network rules
      const { data: rulesData, error: rulesError } = await supabase
        .from('network_security_rules')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (rulesError) throw rulesError;

      // Fetch security events
      const { data: eventsData, error: eventsError } = await supabase
        .from('network_security_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (eventsError) throw eventsError;

      // Fetch network settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('network_security_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Error fetching settings:', settingsError);
      }

      setRules(rulesData || []);
      setEvents(eventsData || []);
      
      if (settingsData) {
        setRateLimitConfig(settingsData.rate_limit_config || rateLimitConfig);
        setDdosProtection(settingsData.ddos_protection_enabled || false);
        setGeoFiltering(settingsData.geo_filtering_enabled || false);
      }
    } catch (error) {
      console.error('Error fetching network security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRule = async () => {
    if (!newRule.value.trim() || !user?.id) return;

    try {
      const { data, error } = await supabase
        .from('network_security_rules')
        .insert({
          user_id: user.id,
          type: newRule.type,
          value: newRule.value,
          action: newRule.action,
          description: newRule.description,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setRules([data, ...rules]);
      setNewRule({ type: 'ip_block', value: '', action: 'block', description: '' });
      toast.success('Règle ajoutée');
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    }
  };

  const toggleRule = async (ruleId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('network_security_rules')
        .update({ is_active: isActive })
        .eq('id', ruleId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setRules(rules.map(rule => 
        rule.id === ruleId ? { ...rule, is_active: isActive } : rule
      ));
      toast.success(isActive ? 'Règle activée' : 'Règle désactivée');
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    }
  };

  const updateNetworkSettings = async (settings: any) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('network_security_settings')
        .upsert({
          user_id: user.id,
          rate_limit_config: rateLimitConfig,
          ddos_protection_enabled: ddosProtection,
          geo_filtering_enabled: geoFiltering,
          ...settings
        });

      if (error) throw error;
      
      toast.success('Paramètres mis à jour');
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'blocked_ip':
        return <Ban className="h-4 w-4 text-red-500" />;
      case 'rate_limit':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'geo_block':
        return <MapPin className="h-4 w-4 text-orange-500" />;
      case 'ddos_detected':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getRuleTypeLabel = (type: string) => {
    switch (type) {
      case 'ip_block':
        return 'Blocage IP';
      case 'geo_block':
        return 'Blocage géographique';
      case 'rate_limit':
        return 'Limitation de débit';
      case 'user_agent_block':
        return 'Blocage User-Agent';
      default:
        return 'Autre';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* DDoS Protection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Protection réseau avancée
          </CardTitle>
          <CardDescription>
            Configuration des protections contre les attaques réseau
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Protection DDoS</Label>
                  <p className="text-sm text-muted-foreground">
                    Détection et mitigation automatique des attaques DDoS
                  </p>
                </div>
                <Switch
                  checked={ddosProtection}
                  onCheckedChange={(checked) => {
                    setDdosProtection(checked);
                    updateNetworkSettings({ ddos_protection_enabled: checked });
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Filtrage géographique</Label>
                  <p className="text-sm text-muted-foreground">
                    Bloquer le trafic de certains pays
                  </p>
                </div>
                <Switch
                  checked={geoFiltering}
                  onCheckedChange={(checked) => {
                    setGeoFiltering(checked);
                    updateNetworkSettings({ geo_filtering_enabled: checked });
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Limitation de débit</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Req/minute</Label>
                  <Input
                    type="number"
                    value={rateLimitConfig.requests_per_minute}
                    onChange={(e) => setRateLimitConfig({
                      ...rateLimitConfig,
                      requests_per_minute: parseInt(e.target.value)
                    })}
                    onBlur={() => updateNetworkSettings({ rate_limit_config: rateLimitConfig })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Req/heure</Label>
                  <Input
                    type="number"
                    value={rateLimitConfig.requests_per_hour}
                    onChange={(e) => setRateLimitConfig({
                      ...rateLimitConfig,
                      requests_per_hour: parseInt(e.target.value)
                    })}
                    onBlur={() => updateNetworkSettings({ rate_limit_config: rateLimitConfig })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Req/jour</Label>
                  <Input
                    type="number"
                    value={rateLimitConfig.requests_per_day}
                    onChange={(e) => setRateLimitConfig({
                      ...rateLimitConfig,
                      requests_per_day: parseInt(e.target.value)
                    })}
                    onBlur={() => updateNetworkSettings({ rate_limit_config: rateLimitConfig })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Burst size</Label>
                  <Input
                    type="number"
                    value={rateLimitConfig.burst_size}
                    onChange={(e) => setRateLimitConfig({
                      ...rateLimitConfig,
                      burst_size: parseInt(e.target.value)
                    })}
                    onBlur={() => updateNetworkSettings({ rate_limit_config: rateLimitConfig })}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ban className="h-5 w-5" />
            Règles de sécurité réseau
          </CardTitle>
          <CardDescription>
            Configuration des règles de blocage et de filtrage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Rule */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 border rounded-lg">
            <Select
              value={newRule.type}
              onValueChange={(value) => setNewRule({ ...newRule, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ip_block">Blocage IP</SelectItem>
                <SelectItem value="geo_block">Pays</SelectItem>
                <SelectItem value="user_agent_block">User-Agent</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Valeur (IP, pays, etc.)"
              value={newRule.value}
              onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
            />

            <Select
              value={newRule.action}
              onValueChange={(value) => setNewRule({ ...newRule, action: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="block">Bloquer</SelectItem>
                <SelectItem value="allow">Autoriser</SelectItem>
                <SelectItem value="monitor">Surveiller</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Description"
              value={newRule.description}
              onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
            />

            <Button onClick={addRule} disabled={!newRule.value.trim()}>
              Ajouter
            </Button>
          </div>

          {/* Rules List */}
          {rules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Ban className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune règle configurée</p>
              <p className="text-sm">Ajoutez des règles de sécurité réseau</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Ban className="h-4 w-4" />
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {getRuleTypeLabel(rule.type)}
                        </Badge>
                        <Badge 
                          className={
                            rule.action === 'block' ? 'bg-red-100 text-red-600 dark:bg-red-900/20' :
                            rule.action === 'allow' ? 'bg-green-100 text-green-600 dark:bg-green-900/20' :
                            'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20'
                          }
                        >
                          {rule.action.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="font-medium">{rule.value}</p>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={rule.is_active}
                    onCheckedChange={(checked) => toggleRule(rule.id, checked)}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Événements de sécurité réseau
          </CardTitle>
          <CardDescription>
            Surveillance en temps réel des tentatives d'attaque
          </CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p className="font-medium">Aucune menace détectée</p>
              <p className="text-sm">Votre réseau est sécurisé</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getEventIcon(event.event_type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium capitalize">
                        {event.event_type.replace('_', ' ')}
                      </p>
                      <Badge variant={event.blocked ? 'destructive' : 'default'}>
                        {event.blocked ? 'Bloqué' : 'Autorisé'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      IP: {event.ip_address} {event.country && `• ${event.country}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Alert */}
      {(ddosProtection || geoFiltering) && (
        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription>
            Protections réseau activées: DDoS {ddosProtection && '✓'} • Filtrage géographique {geoFiltering && '✓'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default NetworkSecurity;