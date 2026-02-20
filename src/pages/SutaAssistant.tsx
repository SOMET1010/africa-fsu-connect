import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageHero } from "@/components/shared/PageHero";
import { GlassCard } from "@/components/ui/glass-card";
import { ModernButton } from "@/components/ui/modern-button";
import { 
  Bot, 
  Send, 
  Sparkles, 
  FileText, 
  BarChart3, 
  HelpCircle,
  Globe,
  Mic,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
  Copy
} from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SutaAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Bonjour ! Je suis SUTA, votre assistant IA dédié à la plateforme UDC. Je peux vous aider avec :\n\n• **Recherche de projets** - Trouvez des projets FSU par pays ou thématique\n• **Statistiques** - Obtenez des données sur le service universel\n• **Réglementation** - Consultez les cadres réglementaires\n• **Support** - Répondre à vos questions sur la plateforme\n\nComment puis-je vous aider aujourd'hui ?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: "Projets actifs", icon: FileText, query: "Quels sont les projets FSU actifs en Afrique de l'Ouest ?" },
    { label: "Statistiques", icon: BarChart3, query: "Montre-moi les statistiques de couverture par région" },
    { label: "Réglementation", icon: Globe, query: "Quelles sont les principales réglementations FSU ?" },
    { label: "Aide", icon: HelpCircle, query: "Comment utiliser la plateforme UDC ?" }
  ];

  const languages = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'pt', label: 'Português' },
    { code: 'ar', label: 'العربية' }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        'projets': "Actuellement, nous avons **127 projets actifs** à travers l'Afrique. Les principales catégories sont :\n\n• Connectivité rurale (45 projets)\n• Infrastructures backbone (32 projets)\n• E-éducation (28 projets)\n• E-santé (22 projets)\n\nVoulez-vous plus de détails sur une catégorie spécifique ?",
        'statistiques': "Voici les statistiques clés du Service Universel en Afrique :\n\n📊 **Couverture**: 68% de la population\n🌍 **Pays actifs**: 54\n💰 **Budget total**: $2.4 milliards USD\n📡 **Sites connectés**: 12,847\n\nQuelle métrique souhaitez-vous approfondir ?",
        'default': "Je comprends votre question. Laissez-moi rechercher les informations pertinentes dans notre base de données UDC...\n\nPour le moment, je suis en mode démonstration. Une fois connecté à l'API Lovable AI, je pourrai vous fournir des réponses précises basées sur les données réelles de la plateforme."
      };

      const responseKey = inputValue.toLowerCase().includes('projet') ? 'projets' 
        : inputValue.toLowerCase().includes('statist') ? 'statistiques' 
        : 'default';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[responseKey],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (query: string) => {
    setInputValue(query);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--nx-bg))]">
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Hero */}
        <PageHero
          badge="Assistant IA"
          badgeIcon={Bot}
          title="SUTA - Votre Assistant Intelligent"
          subtitle="Posez vos questions sur le Service Universel, les projets FSU et la plateforme UDC"
        />

        {/* Language selector */}
        <div className="flex justify-end gap-2 animate-fade-in">
          {languages.map((lang) => (
            <ModernButton
              key={lang.code}
              variant={lang.code === 'fr' ? 'default' : 'ghost'}
              size="sm"
              className="text-xs"
            >
              {lang.label}
            </ModernButton>
          ))}
        </div>

        {/* Chat Container */}
        <GlassCard className="h-[600px] flex flex-col animate-fade-in">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--nx-gold))] to-[hsl(var(--nx-cyan))] text-[hsl(var(--nx-night))] text-xs">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-[hsl(var(--nx-gold))] text-[hsl(var(--nx-night))]'
                        : 'bg-white/10'
                    }`}
                  >
                    <div className={`text-sm whitespace-pre-wrap ${message.role === 'assistant' ? 'text-white' : ''}`} dangerouslySetInnerHTML={{
                      __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }} />
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                        <ModernButton variant="ghost" size="icon" className="h-6 w-6" aria-label="J'aime">
                          <ThumbsUp className="h-3 w-3" />
                        </ModernButton>
                        <ModernButton variant="ghost" size="icon" className="h-6 w-6" aria-label="Je n'aime pas">
                          <ThumbsDown className="h-3 w-3" />
                        </ModernButton>
                        <ModernButton variant="ghost" size="icon" className="h-6 w-6" aria-label="Copier">
                          <Copy className="h-3 w-3" />
                        </ModernButton>
                      </div>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-white/10 text-white text-xs">U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--nx-gold))] to-[hsl(var(--nx-cyan))] text-[hsl(var(--nx-night))] text-xs">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white/10 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-100" />
                      <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="px-4 py-3 border-t border-white/10">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <ModernButton
                  key={action.label}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleQuickAction(action.query)}
                >
                  <action.icon className="h-3 w-3 mr-1" />
                  {action.label}
                </ModernButton>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <ModernButton variant="ghost" size="icon" className="shrink-0" aria-label="Joindre un fichier">
                <Paperclip className="h-4 w-4" />
              </ModernButton>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <ModernButton variant="ghost" size="icon" className="shrink-0" aria-label="Enregistrement vocal">
                <Mic className="h-4 w-4" />
              </ModernButton>
              <ModernButton onClick={handleSend} disabled={!inputValue.trim() || isTyping} aria-label="Envoyer">
                <Send className="h-4 w-4" />
              </ModernButton>
            </div>
          </div>
        </GlassCard>

        {/* Footer */}
        <div className="text-center text-xs text-white/50 animate-fade-in">
          <p>
            SUTA utilise l'IA pour vous aider. Les réponses peuvent parfois être imprécises.
            <ModernButton variant="link" size="sm" className="text-xs px-1 text-white/50 hover:text-white/70">
              En savoir plus
            </ModernButton>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SutaAssistant;
