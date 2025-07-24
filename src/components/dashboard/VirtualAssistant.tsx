
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Send, 
  Minimize2, 
  Maximize2, 
  X,
  Bot,
  User,
  Lightbulb,
  ArrowRight,
  Clock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: AssistantSuggestion[];
}

interface AssistantSuggestion {
  id: string;
  text: string;
  action: {
    type: 'navigate' | 'search' | 'help';
    target: string;
  };
}

export function VirtualAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile } = useAuth();
  const { t } = useTranslation();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Initialiser l'assistant avec un message de bienvenue
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        type: 'assistant',
        content: profile?.first_name 
          ? t('assistant.greeting.user').replace('{{userName}}', profile.first_name)
          : t('assistant.welcome'),
        timestamp: new Date(),
        suggestions: [
          {
            id: 'help-navigation',
            text: t('assistant.suggestions.explore.forum'),
            action: { type: 'help', target: 'navigation' }
          },
          {
            id: 'create-project',
            text: t('assistant.suggestions.new.project'),
            action: { type: 'navigate', target: '/projects?action=create' }
          },
          {
            id: 'find-colleagues',
            text: t('assistant.suggestions.check.events'),
            action: { type: 'navigate', target: '/organizations' }
          }
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, profile?.first_name]);
  
  const getAssistantResponse = (userMessage: string): { content: string; suggestions?: AssistantSuggestion[] } => {
    const message = userMessage.toLowerCase();
    
    // Réponses contextuelles basées sur les mots-clés
    if (message.includes('projet') || message.includes('project')) {
      return {
        content: t('assistant.response.project.help'),
        suggestions: [
          {
            id: 'create-project',
            text: t('assistant.suggestions.new.project'),
            action: { type: 'navigate', target: '/projects?action=create' }
          },
          {
            id: 'view-projects',
            text: t('nav.projects'),
            action: { type: 'navigate', target: '/projects' }
          }
        ]
      };
    }
    
    if (message.includes('équipe') || message.includes('collabor')) {
      return {
        content: "Vous pouvez trouver et contacter vos collègues dans la section Organisations. Vous y verrez les différentes agences FSU et pourrez rejoindre des discussions.",
        suggestions: [
          {
            id: 'view-orgs',
            text: 'Voir les organisations',
            action: { type: 'navigate', target: '/organizations' }
          },
          {
            id: 'join-forum',
            text: 'Rejoindre le forum',
            action: { type: 'navigate', target: '/forum' }
          }
        ]
      };
    }
    
    if (message.includes('aide') || message.includes('help')) {
      return {
        content: "Je suis là pour vous aider ! Voici ce que vous pouvez faire sur la plateforme FSU :",
        suggestions: [
          {
            id: 'dashboard-help',
            text: 'Navigation du dashboard',
            action: { type: 'help', target: 'dashboard' }
          },
          {
            id: 'profile-help',
            text: 'Compléter mon profil',
            action: { type: 'navigate', target: '/profile' }
          },
          {
            id: 'resources-help',
            text: 'Accéder aux ressources',
            action: { type: 'navigate', target: '/resources' }
          }
        ]
      };
    }
    
    if (message.includes('événement') || message.includes('formation')) {
      return {
        content: "Vous pouvez consulter tous les événements et formations disponibles dans la section Événements. Il y a régulièrement de nouvelles opportunités !",
        suggestions: [
          {
            id: 'view-events',
            text: 'Voir les événements',
            action: { type: 'navigate', target: '/events' }
          },
          {
            id: 'upcoming-events',
            text: 'Événements à venir',
            action: { type: 'navigate', target: '/events?filter=upcoming' }
          }
        ]
      };
    }
    
    // Réponse par défaut
    return {
      content: "Je comprends votre question. Voici quelques actions que vous pourriez vouloir faire :",
      suggestions: [
        {
          id: 'dashboard',
          text: 'Retour au dashboard',
          action: { type: 'navigate', target: '/dashboard' }
        },
        {
          id: 'search',
          text: 'Rechercher sur la plateforme',
          action: { type: 'search', target: userMessage }
        },
        {
          id: 'help-general',
          text: 'Aide générale',
          action: { type: 'help', target: 'general' }
        }
      ]
    };
  };
  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simuler le temps de réponse de l'assistant
    setTimeout(() => {
      const response = getAssistantResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };
  
  const handleSuggestionClick = (suggestion: AssistantSuggestion) => {
    if (suggestion.action.type === 'navigate') {
      // La navigation sera gérée par le Link
      setIsOpen(false);
    } else if (suggestion.action.type === 'search') {
      // Implémenter la recherche
      console.log('Search:', suggestion.action.target);
    } else if (suggestion.action.type === 'help') {
      // Ajouter une réponse d'aide contextuelle
      const helpMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `Voici de l'aide sur ${suggestion.action.target}. Cette fonctionnalité sera développée prochainement !`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, helpMessage]);
    }
  };
  
  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        size="lg"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }
  
  return (
    <Card className={`fixed bottom-6 right-6 z-50 shadow-2xl transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
    }`}>
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-primary" />
          <CardTitle className="text-sm">Assistant FSU</CardTitle>
          <Badge variant="secondary" className="text-xs">En ligne</Badge>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 p-0"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(500px-80px)]">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}>
                    <div className="flex items-start space-x-2">
                      {message.type === 'assistant' && (
                        <Bot className="h-4 w-4 mt-0.5 text-primary" />
                      )}
                      {message.type === 'user' && (
                        <User className="h-4 w-4 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center mt-1 space-x-1">
                          <Clock className="h-3 w-3 opacity-50" />
                          <span className="text-xs opacity-50">
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion) => (
                          <div key={suggestion.id}>
                            {suggestion.action.type === 'navigate' ? (
                              <Link to={suggestion.action.target} onClick={() => setIsOpen(false)}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full justify-start text-xs h-8"
                                >
                                  <Lightbulb className="h-3 w-3 mr-2" />
                                  {suggestion.text}
                                  <ArrowRight className="h-3 w-3 ml-auto" />
                                </Button>
                              </Link>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full justify-start text-xs h-8"
                              >
                                <Lightbulb className="h-3 w-3 mr-2" />
                                {suggestion.text}
                                <ArrowRight className="h-3 w-3 ml-auto" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-primary" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t('assistant.placeholder')}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="sm" disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">{t('assistant.send')}</span>
            </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
