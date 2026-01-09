import { useEffect, useRef } from 'react';
import { FocalMessage } from '@/hooks/useFocalChat';
import { MessageBubble } from './MessageBubble';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format, isToday, isYesterday, isSameDay, Locale } from 'date-fns';
import { fr, enUS, pt, ar } from 'date-fns/locale';

interface MessageThreadProps {
  messages: FocalMessage[];
  currentUserId: string;
  isLoading?: boolean;
}

const localeMap: Record<string, Locale> = {
  fr: fr,
  en: enUS,
  pt: pt,
  ar: ar,
};

export function MessageThread({ messages, currentUserId, isLoading }: MessageThreadProps) {
  const { t, i18n } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const locale = localeMap[i18n.language] || fr;

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
        <MessageSquare className="h-16 w-16 mb-4 opacity-30" />
        <p className="text-sm">
          {t('focal.chat.no_messages', 'Aucun message dans cette conversation')}
        </p>
        <p className="text-xs mt-1">
          {t('focal.chat.start_conversation', 'Envoyez le premier message !')}
        </p>
      </div>
    );
  }

  const formatDateSeparator = (date: Date) => {
    if (isToday(date)) {
      return t('focal.chat.today', "Aujourd'hui");
    }
    if (isYesterday(date)) {
      return t('focal.chat.yesterday', 'Hier');
    }
    return format(date, 'EEEE d MMMM', { locale });
  };

  // Grouper les messages par jour
  const groupedMessages: { date: Date; messages: FocalMessage[] }[] = [];
  let currentGroup: { date: Date; messages: FocalMessage[] } | null = null;

  messages.forEach((msg) => {
    const msgDate = new Date(msg.created_at);
    if (!currentGroup || !isSameDay(currentGroup.date, msgDate)) {
      currentGroup = { date: msgDate, messages: [msg] };
      groupedMessages.push(currentGroup);
    } else {
      currentGroup.messages.push(msg);
    }
  });

  return (
    <ScrollArea ref={scrollRef} className="flex-1 p-4">
      <div className="space-y-4">
        {groupedMessages.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* Séparateur de date */}
            <div className="flex items-center justify-center my-4">
              <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground capitalize">
                {formatDateSeparator(group.date)}
              </div>
            </div>

            {/* Messages du jour */}
            <div className="space-y-3">
              {group.messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.sender_user_id === currentUserId}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
