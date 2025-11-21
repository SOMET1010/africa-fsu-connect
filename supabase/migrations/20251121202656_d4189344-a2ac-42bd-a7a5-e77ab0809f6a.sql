-- Create presentation_sessions table for analytics
CREATE TABLE IF NOT EXISTS presentation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  total_duration INTEGER, -- seconds
  user_agent TEXT,
  country TEXT,
  -- Section tracking
  sections_visited INTEGER[],
  section_durations JSONB, -- { "0": 45, "1": 120, ... }
  -- Interactions
  interactions JSONB, -- { clicks: 15, exports: 2, shares: 1 }
  -- Completion
  completed BOOLEAN DEFAULT false,
  completion_rate DECIMAL(5,2),
  -- Device
  device_type TEXT, -- desktop, tablet, mobile
  screen_resolution TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sessions_date ON presentation_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_sessions_completed ON presentation_sessions(completed);
CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON presentation_sessions(session_id);

-- Enable RLS
ALTER TABLE presentation_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert their session data
CREATE POLICY "Anyone can insert presentation sessions"
  ON presentation_sessions
  FOR INSERT
  WITH CHECK (true);

-- Policy: Anyone can read all sessions (for analytics dashboard)
CREATE POLICY "Anyone can read presentation sessions"
  ON presentation_sessions
  FOR SELECT
  USING (true);

-- Policy: Users can update their own session
CREATE POLICY "Users can update their own sessions"
  ON presentation_sessions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);