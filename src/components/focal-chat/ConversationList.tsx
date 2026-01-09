import { FocalConversation } from '@/hooks/useFocalChat';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Users, User, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';

interface ConversationListProps {
  conversations: FocalConversation[];
  selectedId: string | null;
  onSelect: (conversation: FocalConversation) => void;
  isLoading?: boolean;
  currentUserId?: string;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  isLoading,
  currentUserId,
}: ConversationListProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="p-2 space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-3 rounded-lg">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
        <MessageSquare className="h-12 w-12 mb-2 opacity-50" />
        <p className="text-sm">{t('focal.chat.no_conversations', 'Aucune conversation')}</p>
      </div>
    );
  }

  const getConversationName = (conv: FocalConversation) => {
    if (conv.type === 'country_team') {
      return t('focal.chat.country_team', 'Équipe {{country}}', { country: conv.country_code });
    }
    if (conv.name) return conv.name;
    
    // Pour les conversations directes, afficher le nom de l'autre participant
    const otherParticipant = conv.participants?.find(
      (p) => p.user_id !== currentUserId
    );
    if (otherParticipant?.focal_point) {
      return `${otherParticipant.focal_point.first_name} ${otherParticipant.focal_point.last_name}`;
    }
    return t('focal.chat.conversation', 'Conversation');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'country_team':
        return <Users className="h-4 w-4" />;
      case 'direct':
        return <User className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-2 space-y-1">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv)}
            className={cn(
              'w-full text-left p-3 rounded-lg transition-colors',
              'hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring',
              selectedId === conv.id && 'bg-accent'
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'p-2 rounded-full shrink-0',
                  conv.type === 'country_team' ? 'bg-primary/10 text-primary' : 'bg-muted'
                )}
              >
                {getIcon(conv.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm truncate">
                    {getConversationName(conv)}
                  </span>
                  {(conv.unread_count ?? 0) > 0 && (
                    <Badge variant="default" className="shrink-0 h-5 min-w-[20px] px-1.5">
                      {conv.unread_count}
                    </Badge>
                  )}
                </div>
                
                {conv.last_message && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {conv.last_message.is_system_message
                      ? conv.last_message.content
                      : `${conv.last_message.sender?.first_name || ''}: ${conv.last_message.content}`}
                  </p>
                )}
                
                {conv.last_message && (
                  <span className="text-[10px] text-muted-foreground">
                    {format(new Date(conv.last_message.created_at), 'dd MMM HH:mm', { locale: fr })}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
