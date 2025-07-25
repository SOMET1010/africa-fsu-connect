import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SyncMessage {
  type: 'sync_start' | 'sync_data' | 'sync_conflict' | 'sync_complete' | 'heartbeat';
  agencyId: string;
  connectorId?: string;
  data?: any;
  sessionId?: string;
}

interface WebSocketConnection {
  id: string;
  socket: WebSocket;
  agencyId: string;
  connectorId?: string;
  lastHeartbeat: number;
}

const connections = new Map<string, WebSocketConnection>();
const syncQueues = new Map<string, any[]>();

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { 
      status: 400,
      headers: corsHeaders 
    });
  }

  try {
    const { socket, response } = Deno.upgradeWebSocket(req);
    const connectionId = crypto.randomUUID();
    
    console.log(`New WebSocket connection: ${connectionId}`);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    socket.onopen = () => {
      console.log(`WebSocket opened: ${connectionId}`);
      
      // Send welcome message
      socket.send(JSON.stringify({
        type: 'connection_established',
        connectionId,
        timestamp: new Date().toISOString()
      }));
    };

    socket.onmessage = async (event) => {
      try {
        const message: SyncMessage = JSON.parse(event.data);
        console.log(`Received message: ${message.type} from ${connectionId}`);

        await handleSyncMessage(message, connectionId, socket, supabase);
      } catch (error) {
        console.error('Error processing message:', error);
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Failed to process message',
          error: error.message
        }));
      }
    };

    socket.onclose = () => {
      console.log(`WebSocket closed: ${connectionId}`);
      connections.delete(connectionId);
      
      // Clean up sync queue for this connection
      syncQueues.delete(connectionId);
    };

    socket.onerror = (error) => {
      console.error(`WebSocket error for ${connectionId}:`, error);
    };

    return response;
  } catch (error) {
    console.error('Error upgrading WebSocket:', error);
    return new Response('Failed to upgrade WebSocket', { 
      status: 500,
      headers: corsHeaders 
    });
  }
});

async function handleSyncMessage(
  message: SyncMessage, 
  connectionId: string, 
  socket: WebSocket,
  supabase: any
) {
  switch (message.type) {
    case 'sync_start':
      await handleSyncStart(message, connectionId, socket, supabase);
      break;
    
    case 'sync_data':
      await handleSyncData(message, connectionId, socket, supabase);
      break;
    
    case 'sync_conflict':
      await handleSyncConflict(message, connectionId, socket, supabase);
      break;
    
    case 'heartbeat':
      await handleHeartbeat(message, connectionId, socket);
      break;
    
    default:
      console.warn(`Unknown message type: ${message.type}`);
  }
}

async function handleSyncStart(
  message: SyncMessage, 
  connectionId: string, 
  socket: WebSocket,
  supabase: any
) {
  try {
    // Register connection
    connections.set(connectionId, {
      id: connectionId,
      socket,
      agencyId: message.agencyId,
      connectorId: message.connectorId,
      lastHeartbeat: Date.now()
    });

    // Initialize sync queue
    syncQueues.set(connectionId, []);

    // Create sync session in database
    const { data: session, error } = await supabase
      .from('sync_sessions')
      .insert({
        agency_id: message.agencyId,
        connector_id: message.connectorId,
        session_type: 'realtime',
        status: 'active',
        websocket_id: connectionId
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Notify all connections for this agency about new sync session
    await broadcastToAgency(message.agencyId, {
      type: 'sync_session_started',
      sessionId: session.id,
      connectionId,
      timestamp: new Date().toISOString()
    });

    socket.send(JSON.stringify({
      type: 'sync_started',
      sessionId: session.id,
      timestamp: new Date().toISOString()
    }));

    console.log(`Sync started for agency ${message.agencyId}, session ${session.id}`);
  } catch (error) {
    console.error('Error starting sync:', error);
    socket.send(JSON.stringify({
      type: 'sync_error',
      message: 'Failed to start sync',
      error: error.message
    }));
  }
}

async function handleSyncData(
  message: SyncMessage, 
  connectionId: string, 
  socket: WebSocket,
  supabase: any
) {
  try {
    const connection = connections.get(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    // Add data to sync queue
    const queue = syncQueues.get(connectionId) || [];
    queue.push({
      data: message.data,
      timestamp: new Date().toISOString(),
      processed: false
    });
    syncQueues.set(connectionId, queue);

    // Process sync data immediately
    await processSyncData(message.data, connection, supabase);

    // Broadcast real-time update to other connections
    await broadcastToAgency(connection.agencyId, {
      type: 'data_synced',
      data: message.data,
      sourceConnection: connectionId,
      timestamp: new Date().toISOString()
    }, connectionId);

    socket.send(JSON.stringify({
      type: 'data_processed',
      timestamp: new Date().toISOString()
    }));

  } catch (error) {
    console.error('Error processing sync data:', error);
    socket.send(JSON.stringify({
      type: 'sync_error',
      message: 'Failed to process sync data',
      error: error.message
    }));
  }
}

async function handleSyncConflict(
  message: SyncMessage, 
  connectionId: string, 
  socket: WebSocket,
  supabase: any
) {
  try {
    const connection = connections.get(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    // Store conflict in database
    const { data: conflict, error } = await supabase
      .from('sync_conflicts')
      .insert({
        agency_id: connection.agencyId,
        table_name: message.data.tableName,
        record_id: message.data.recordId,
        source_data: message.data.sourceData,
        target_data: message.data.targetData,
        conflict_type: message.data.conflictType
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Broadcast conflict to all agency connections
    await broadcastToAgency(connection.agencyId, {
      type: 'conflict_detected',
      conflict,
      timestamp: new Date().toISOString()
    });

    socket.send(JSON.stringify({
      type: 'conflict_stored',
      conflictId: conflict.id,
      timestamp: new Date().toISOString()
    }));

  } catch (error) {
    console.error('Error handling sync conflict:', error);
    socket.send(JSON.stringify({
      type: 'sync_error',
      message: 'Failed to handle conflict',
      error: error.message
    }));
  }
}

async function handleHeartbeat(
  message: SyncMessage, 
  connectionId: string, 
  socket: WebSocket
) {
  const connection = connections.get(connectionId);
  if (connection) {
    connection.lastHeartbeat = Date.now();
    connections.set(connectionId, connection);
  }

  socket.send(JSON.stringify({
    type: 'heartbeat_ack',
    timestamp: new Date().toISOString()
  }));
}

async function processSyncData(data: any, connection: WebSocketConnection, supabase: any) {
  try {
    // Apply data transformations based on connector type
    const processedData = await transformSyncData(data, connection);

    // Update database with processed data
    if (processedData.tableName && processedData.recordData) {
      await supabase
        .from(processedData.tableName)
        .upsert(processedData.recordData);
    }

    // Update sync session statistics
    await supabase
      .from('sync_sessions')
      .update({
        records_processed: supabase.raw('records_processed + 1')
      })
      .eq('websocket_id', connection.id);

    console.log('Sync data processed successfully');
  } catch (error) {
    console.error('Error processing sync data:', error);
    throw error;
  }
}

async function transformSyncData(data: any, connection: WebSocketConnection): Promise<any> {
  // Apply data transformations based on connector configuration
  // This is a simplified version - in reality, you'd fetch the connector
  // configuration and apply the appropriate mappings
  
  return {
    tableName: data.tableName || 'agency_projects',
    recordData: {
      ...data,
      agency_id: connection.agencyId,
      updated_at: new Date().toISOString(),
      sync_status: 'synced'
    }
  };
}

async function broadcastToAgency(
  agencyId: string, 
  message: any, 
  excludeConnectionId?: string
) {
  const agencyConnections = Array.from(connections.values())
    .filter(conn => 
      conn.agencyId === agencyId && 
      conn.id !== excludeConnectionId &&
      conn.socket.readyState === WebSocket.OPEN
    );

  for (const connection of agencyConnections) {
    try {
      connection.socket.send(JSON.stringify(message));
    } catch (error) {
      console.error(`Error broadcasting to connection ${connection.id}:`, error);
      // Remove failed connection
      connections.delete(connection.id);
    }
  }
}

// Cleanup inactive connections every 5 minutes
setInterval(() => {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  
  for (const [connectionId, connection] of connections.entries()) {
    if (now - connection.lastHeartbeat > fiveMinutes) {
      console.log(`Cleaning up inactive connection: ${connectionId}`);
      try {
        connection.socket.close();
      } catch (error) {
        console.error('Error closing inactive connection:', error);
      }
      connections.delete(connectionId);
      syncQueues.delete(connectionId);
    }
  }
}, 5 * 60 * 1000);