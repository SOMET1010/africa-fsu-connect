import { FocalMessage } from '@/hooks/useFocalChat';
import { cn } from '@/lib/utils';
import { format, Locale } from 'date-fns';
import { fr, enUS, pt, ar } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Paperclip, AlertCircle } from 'lucide-react';

interface MessageBubbleProps {
  message: FocalMessage;
  isOwn: boolean;
}

const localeMap: Record<string, Locale> = {
  fr: fr,
  en: enUS,
  pt: pt,
  ar: ar,
};

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const { i18n } = useTranslation();
  const locale = localeMap[i18n.language] || fr;

  if (message.is_system_message) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col max-w-[75%] gap-1',
        isOwn ? 'ml-auto items-end' : 'mr-auto items-start'
      )}
    >
      {!isOwn && message.sender && (
        <span className="text-xs text-muted-foreground font-medium px-1">
          {message.sender.first_name} {message.sender.last_name}
        </span>
      )}
      
      <div
        className={cn(
          'rounded-2xl px-4 py-2 shadow-sm',
          isOwn
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-muted rounded-bl-md'
        )}
      >
        {message.indicator_reference && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs mb-1 pb-1 border-b',
              isOwn ? 'border-primary-foreground/20' : 'border-border'
            )}
          >
            <AlertCircle className="h-3 w-3" />
            <span>Indicateur: {message.indicator_reference}</span>
          </div>
        )}
        
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>
        
        {message.attachment_url && (
          <a
            href={message.attachment_url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center gap-1 text-xs mt-1 hover:underline',
              isOwn ? 'text-primary-foreground/80' : 'text-primary'
            )}
          >
            <Paperclip className="h-3 w-3" />
            Pièce jointe
          </a>
        )}
      </div>
      
      <span
        className={cn(
          'text-[10px] text-muted-foreground px-1',
          isOwn ? 'text-right' : 'text-left'
        )}
      >
        {format(new Date(message.created_at), 'HH:mm', { locale })}
        {message.edited_at && ' (modifié)'}
      </span>
    </div>
  );
}
