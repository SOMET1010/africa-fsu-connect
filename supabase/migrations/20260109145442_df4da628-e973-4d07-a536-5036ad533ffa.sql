-- Table des conversations entre points focaux
CREATE TABLE public.focal_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN ('country_team', 'direct', 'group')) NOT NULL,
  country_code TEXT,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des participants aux conversations
CREATE TABLE public.focal_conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.focal_conversations(id) ON DELETE CASCADE,
  focal_point_id UUID REFERENCES public.focal_points(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ,
  is_muted BOOLEAN DEFAULT FALSE,
  UNIQUE(conversation_id, focal_point_id)
);

-- Table des messages
CREATE TABLE public.focal_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.focal_conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.focal_points(id),
  sender_user_id UUID REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  attachment_url TEXT,
  attachment_type TEXT,
  indicator_reference TEXT,
  is_system_message BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  edited_at TIMESTAMPTZ
);

-- Index pour les performances
CREATE INDEX idx_focal_messages_conversation ON public.focal_messages(conversation_id, created_at DESC);
CREATE INDEX idx_focal_participants_focal ON public.focal_conversation_participants(focal_point_id);
CREATE INDEX idx_focal_participants_user ON public.focal_conversation_participants(user_id);
CREATE INDEX idx_focal_conversations_country ON public.focal_conversations(country_code) WHERE country_code IS NOT NULL;

-- Enable RLS
ALTER TABLE public.focal_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focal_conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focal_messages ENABLE ROW LEVEL SECURITY;

-- Policies pour focal_conversations
CREATE POLICY "Focal points can view their conversations"
ON public.focal_conversations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.focal_conversation_participants fcp
    WHERE fcp.conversation_id = focal_conversations.id
    AND fcp.user_id = auth.uid()
  )
);

CREATE POLICY "Focal points can create conversations"
ON public.focal_conversations
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.focal_points fp
    WHERE fp.user_id = auth.uid()
    AND fp.status = 'active'
  )
);

-- Policies pour focal_conversation_participants
CREATE POLICY "Participants can view their conversation participants"
ON public.focal_conversation_participants
FOR SELECT
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.focal_conversation_participants fcp2
    WHERE fcp2.conversation_id = focal_conversation_participants.conversation_id
    AND fcp2.user_id = auth.uid()
  )
);

CREATE POLICY "Focal points can join conversations"
ON public.focal_conversation_participants
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.focal_points fp
    WHERE fp.user_id = auth.uid()
    AND fp.status = 'active'
  )
);

CREATE POLICY "Participants can update their own participation"
ON public.focal_conversation_participants
FOR UPDATE
USING (user_id = auth.uid());

-- Policies pour focal_messages
CREATE POLICY "Participants can view messages"
ON public.focal_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.focal_conversation_participants fcp
    WHERE fcp.conversation_id = focal_messages.conversation_id
    AND fcp.user_id = auth.uid()
  )
);

CREATE POLICY "Participants can send messages"
ON public.focal_messages
FOR INSERT
WITH CHECK (
  sender_user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.focal_conversation_participants fcp
    WHERE fcp.conversation_id = focal_messages.conversation_id
    AND fcp.user_id = auth.uid()
  )
);

CREATE POLICY "Senders can edit their messages"
ON public.focal_messages
FOR UPDATE
USING (sender_user_id = auth.uid());

-- Trigger pour mettre à jour updated_at sur les conversations
CREATE TRIGGER update_focal_conversations_updated_at
BEFORE UPDATE ON public.focal_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Fonction pour créer automatiquement une conversation d'équipe pays quand un second point focal est activé
CREATE OR REPLACE FUNCTION public.create_country_team_conversation()
RETURNS TRIGGER AS $$
DECLARE
  existing_conversation_id UUID;
  other_focal_point RECORD;
BEGIN
  -- Only trigger when a focal point becomes active
  IF NEW.status = 'active' AND (OLD.status IS NULL OR OLD.status != 'active') THEN
    -- Check if a country team conversation already exists
    SELECT id INTO existing_conversation_id
    FROM public.focal_conversations
    WHERE type = 'country_team' AND country_code = NEW.country_code;
    
    -- If no conversation exists, create one
    IF existing_conversation_id IS NULL THEN
      INSERT INTO public.focal_conversations (type, country_code, name, created_by)
      VALUES ('country_team', NEW.country_code, 'Équipe ' || NEW.country_code, NEW.user_id)
      RETURNING id INTO existing_conversation_id;
    END IF;
    
    -- Add the new focal point to the conversation if not already a participant
    INSERT INTO public.focal_conversation_participants (conversation_id, focal_point_id, user_id)
    VALUES (existing_conversation_id, NEW.id, NEW.user_id)
    ON CONFLICT (conversation_id, focal_point_id) DO NOTHING;
    
    -- Add other active focal points from the same country to the conversation
    FOR other_focal_point IN
      SELECT id, user_id FROM public.focal_points
      WHERE country_code = NEW.country_code
      AND status = 'active'
      AND id != NEW.id
    LOOP
      INSERT INTO public.focal_conversation_participants (conversation_id, focal_point_id, user_id)
      VALUES (existing_conversation_id, other_focal_point.id, other_focal_point.user_id)
      ON CONFLICT (conversation_id, focal_point_id) DO NOTHING;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger sur focal_points pour créer automatiquement les conversations d'équipe
CREATE TRIGGER trigger_create_country_team_conversation
AFTER INSERT OR UPDATE ON public.focal_points
FOR EACH ROW
EXECUTE FUNCTION public.create_country_team_conversation();