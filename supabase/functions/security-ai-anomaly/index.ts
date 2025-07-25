import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { action, data } = await req.json();
    console.log('AI Anomaly Detection Action:', action, 'Data:', data);

    switch (action) {
      case 'analyze_login_pattern':
        return await analyzeLoginPattern(supabase, user.id, data);
      
      case 'check_device_anomaly':
        return await checkDeviceAnomaly(supabase, user.id, data);
      
      case 'analyze_location_pattern':
        return await analyzeLocationPattern(supabase, user.id, data);
      
      case 'generate_anomaly_alert':
        return await generateAnomalyAlert(supabase, user.id, data);
      
      default:
        throw new Error('Unknown action');
    }

  } catch (error) {
    console.error('Error in security-ai-anomaly:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function analyzeLoginPattern(supabase: any, userId: string, data: any) {
  console.log('Analyzing login pattern for user:', userId);
  
  // Get recent audit logs for login analysis
  const { data: recentLogins, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('action_type', 'login')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
    .order('created_at', { ascending: false });

  if (error) throw error;

  // AI Analysis Logic
  const currentLogin = {
    timestamp: new Date(),
    ip_address: data.ip_address,
    user_agent: data.user_agent,
    location: data.location
  };

  const anomalies = [];

  // Time pattern analysis
  const loginHours = recentLogins?.map(log => new Date(log.created_at).getHours()) || [];
  const currentHour = currentLogin.timestamp.getHours();
  const isUnusualTime = loginHours.length > 5 && !loginHours.includes(currentHour);
  
  if (isUnusualTime) {
    anomalies.push({
      type: 'time_anomaly',
      severity: 'medium',
      message: 'Connexion à une heure inhabituelle détectée',
      details: { hour: currentHour, usual_hours: [...new Set(loginHours)] }
    });
  }

  // Location analysis
  const recentLocations = recentLogins?.map(log => log.details?.location).filter(Boolean) || [];
  const isNewLocation = data.location && !recentLocations.includes(data.location);
  
  if (isNewLocation && recentLocations.length > 0) {
    anomalies.push({
      type: 'unusual_location',
      severity: 'high',
      message: 'Connexion depuis une nouvelle localisation détectée',
      details: { new_location: data.location, previous_locations: recentLocations }
    });
  }

  // Device analysis
  const recentDevices = recentLogins?.map(log => log.user_agent).filter(Boolean) || [];
  const isNewDevice = data.user_agent && !recentDevices.includes(data.user_agent);
  
  if (isNewDevice && recentDevices.length > 0) {
    anomalies.push({
      type: 'device_change',
      severity: 'medium',
      message: 'Connexion depuis un nouvel appareil détectée',
      details: { new_device: data.user_agent }
    });
  }

  // Generate alerts for detected anomalies
  for (const anomaly of anomalies) {
    await supabase.rpc('generate_anomaly_alert', {
      p_user_id: userId,
      p_type: anomaly.type,
      p_severity: anomaly.severity,
      p_message: anomaly.message,
      p_details: anomaly.details,
      p_auto_block: anomaly.severity === 'critical'
    });
  }

  return new Response(
    JSON.stringify({
      anomalies_detected: anomalies.length,
      anomalies,
      risk_score: calculateRiskScore(anomalies)
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

async function checkDeviceAnomaly(supabase: any, userId: string, data: any) {
  console.log('Checking device anomaly for user:', userId);
  
  // Get user's device patterns
  const { data: recentSessions, error } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
    .order('created_at', { ascending: false });

  if (error) throw error;

  const knownUserAgents = recentSessions?.map(session => session.user_agent).filter(Boolean) || [];
  const isUnknownDevice = data.user_agent && !knownUserAgents.includes(data.user_agent);

  if (isUnknownDevice) {
    await supabase.rpc('generate_anomaly_alert', {
      p_user_id: userId,
      p_type: 'device_change',
      p_severity: 'medium',
      p_message: 'Nouvel appareil détecté pour la connexion',
      p_details: { device: data.user_agent, known_devices: knownUserAgents.length },
      p_auto_block: false
    });

    return new Response(
      JSON.stringify({ anomaly_detected: true, type: 'new_device' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ anomaly_detected: false }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function analyzeLocationPattern(supabase: any, userId: string, data: any) {
  console.log('Analyzing location pattern for user:', userId);
  
  // Get user's location history
  const { data: recentLogins, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('action_type', 'login')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false });

  if (error) throw error;

  const knownLocations = recentLogins?.map(log => log.details?.location).filter(Boolean) || [];
  const isNewLocation = data.location && !knownLocations.includes(data.location);

  // Impossible travel detection (basic implementation)
  if (recentLogins && recentLogins.length > 0) {
    const lastLogin = recentLogins[0];
    const timeDiff = Date.now() - new Date(lastLogin.created_at).getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    // If location change within 1 hour, flag as suspicious
    if (isNewLocation && hoursDiff < 1 && lastLogin.details?.location) {
      await supabase.rpc('generate_anomaly_alert', {
        p_user_id: userId,
        p_type: 'unusual_location',
        p_severity: 'high',
        p_message: 'Déplacement géographique impossible détecté',
        p_details: { 
          previous_location: lastLogin.details.location,
          new_location: data.location,
          time_diff_hours: hoursDiff
        },
        p_auto_block: true
      });

      return new Response(
        JSON.stringify({ 
          anomaly_detected: true, 
          type: 'impossible_travel',
          severity: 'high'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response(
    JSON.stringify({ anomaly_detected: false }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function generateAnomalyAlert(supabase: any, userId: string, data: any) {
  console.log('Generating anomaly alert for user:', userId);
  
  const alertId = await supabase.rpc('generate_anomaly_alert', {
    p_user_id: userId,
    p_type: data.type,
    p_severity: data.severity,
    p_message: data.message,
    p_details: data.details || {},
    p_auto_block: data.auto_block || false
  });

  return new Response(
    JSON.stringify({ alert_id: alertId, created: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

function calculateRiskScore(anomalies: any[]): number {
  const severityWeights = {
    low: 1,
    medium: 3,
    high: 5,
    critical: 10
  };

  return anomalies.reduce((score, anomaly) => {
    return score + (severityWeights[anomaly.severity as keyof typeof severityWeights] || 0);
  }, 0);
}