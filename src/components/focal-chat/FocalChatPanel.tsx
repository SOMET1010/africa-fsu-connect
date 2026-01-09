import { useState, useEffect } from 'react';
import {
  useConversations,
  useMessages,
  useSendMessage,
  useMarkAsRead,
  useRealtimeMessages,
  FocalConversation,
} from '@/hooks/useFocalChat';
import { useAuth } from '@/contexts/AuthContext';
import { ConversationList } from './ConversationList';
import { MessageThread } from './MessageThread';
import { MessageInput } from './MessageInput';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface FocalChatPanelProps {
  className?: string;
  onClose?: () => void;
  defaultConversationId?: string;
}

export function FocalChatPanel({ className, onClose, defaultConversationId }: FocalChatPanelProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<FocalConversation | null>(null);

  const { data: conversations = [], isLoading: conversationsLoading } = useConversations();
  const { data: messages = [], isLoading: messagesLoading } = useMessages(
    selectedConversation?.id || null
  );
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();

  // Temps réel pour les messages
  useRealtimeMessages(selectedConversation?.id || null);

  // Sélectionner automatiquement une conversation si spécifiée
  useEffect(() => {
    if (defaultConversationId && conversations.length > 0) {
      const conv = conversations.find((c) => c.id === defaultConversationId);
      if (conv) setSelectedConversation(conv);
    }
  }, [defaultConversationId, conversations]);

  // Marquer comme lu quand on sélectionne une conversation
  useEffect(() => {
    if (selectedConversation?.id && selectedConversation.unread_count && selectedConversation.unread_count > 0) {
      markAsRead.mutate(selectedConversation.id);
    }
  }, [selectedConversation?.id]);

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;
    sendMessage.mutate({
      conversationId: selectedConversation.id,
      content,
    });
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  const getConversationTitle = () => {
    if (!selectedConversation) return '';
    if (selectedConversation.type === 'country_team') {
      return t('focal.chat.country_team', 'Équipe {{country}}', {
        country: selectedConversation.country_code,
      });
    }
    if (selectedConversation.name) return selectedConversation.name;
    
    const otherParticipant = selectedConversation.participants?.find(
      (p) => p.user_id !== user?.id
    );
    if (otherParticipant?.focal_point) {
      return `${otherParticipant.focal_point.first_name} ${otherParticipant.focal_point.last_name}`;
    }
    return t('focal.chat.conversation', 'Conversation');
  };

  return (
    <Card className={cn('flex flex-col h-full overflow-hidden', className)}>
      {/* Header */}
      <CardHeader className="flex-row items-center justify-between space-y-0 py-3 px-4 border-b">
        <div className="flex items-center gap-2">
          {selectedConversation && (
            <Button variant="ghost" size="icon" onClick={handleBack} className="md:hidden">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <MessageCircle className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">
            {selectedConversation ? getConversationTitle() : t('focal.chat.title', 'Messages')}
          </CardTitle>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Liste des conversations (cachée sur mobile quand une conversation est sélectionnée) */}
        <div
          className={cn(
            'w-full md:w-80 md:border-r flex-shrink-0',
            selectedConversation ? 'hidden md:block' : 'block'
          )}
        >
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversation?.id || null}
            onSelect={setSelectedConversation}
            isLoading={conversationsLoading}
            currentUserId={user?.id}
          />
        </div>

        {/* Zone de messages */}
        <div
          className={cn(
            'flex-1 flex flex-col',
            !selectedConversation ? 'hidden md:flex' : 'flex'
          )}
        >
          {selectedConversation ? (
            <>
              <MessageThread
                messages={messages}
                currentUserId={user?.id || ''}
                isLoading={messagesLoading}
              />
              <MessageInput
                onSend={handleSendMessage}
                isLoading={sendMessage.isPending}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
              <MessageCircle className="h-16 w-16 mb-4 opacity-30" />
              <p className="text-sm">
                {t('focal.chat.select_conversation', 'Sélectionnez une conversation')}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
