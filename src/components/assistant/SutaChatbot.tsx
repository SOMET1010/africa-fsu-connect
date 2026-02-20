import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bot, 
  Send, 
  X, 
  MessageCircle, 
  Sparkles,
  Globe,
  FileText,
  BarChart3,
  HelpCircle,
  Minimize2,
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface QuickAction {
  icon: React.ElementType;
  label: string;
  labelEn: string;
  prompt: string;
}

const quickActions: QuickAction[] = [
  {
    icon: BarChart3,
    label: "Statistiques FSU",
    labelEn: "FSU Statistics",
    prompt: "Quelles sont les dernières statistiques des projets FSU en Afrique ?"
  },
  {
    icon: FileText,
    label: "Réglementations",
    labelEn: "Regulations",
    prompt: "Quelles sont les principales réglementations du service universel ?"
  },
  {
    icon: Globe,
    label: "Projets régionaux",
    labelEn: "Regional Projects",
    prompt: "Quels projets FSU sont actifs dans la région CEDEAO ?"
  },
  {
    icon: HelpCircle,
    label: "Aide UDC",
    labelEn: "UDC Help",
    prompt: "Comment fonctionne la plateforme UDC ?"
  }
];

const languages = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "ar", label: "العربية", flag: "🇸🇦" }
];

export function SutaChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Bonjour ! Je suis SUTA, votre assistant IA pour la plateforme UDC. Comment puis-je vous aider aujourd'hui ?\n\nJe peux vous renseigner sur :\n• Les projets FSU en Afrique\n• Les statistiques et indicateurs\n• Les réglementations du service universel\n• L'utilisation de la plateforme",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState("fr");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (in production, this would call the Lovable AI gateway)
    setTimeout(() => {
      const responses: Record<string, string> = {
        "statistiques": "📊 **Statistiques SUTEL actuelles:**\n\n• **54 pays** participants\n• **127 projets** actifs\n• **89 documents** partagés\n• **12 événements** à venir\n\nLa couverture population moyenne atteint 73% avec une croissance de 5% ce trimestre.",
        "réglementations": "📜 **Principales réglementations FSU:**\n\n1. **Contribution FSU** - Taxe sur les opérateurs (1-5% du CA)\n2. **Zones blanches** - Obligation de couverture rurale\n3. **Accès universel** - Tarifs plafonnés pour populations vulnérables\n4. **Transparence** - Reporting annuel obligatoire\n\nConsultez la bibliothèque pour les textes complets.",
        "projets": "🌍 **Projets FSU actifs par région:**\n\n• **CEDEAO** - 45 projets (Connectivité rurale)\n• **SADC** - 32 projets (Infrastructure backbone)\n• **EACO** - 28 projets (E-éducation)\n• **ECCAS** - 15 projets (Santé digitale)\n• **UMA** - 7 projets (Administration électronique)\n\nCliquez sur 'Carte' dans le menu pour visualiser.",
        "plateforme": "🖥️ **La plateforme SUTEL offre:**\n\n1. **Base de données FSU** - Tous les projets africains\n2. **Carte interactive** - Visualisation géographique\n3. **Bibliothèque** - Documents et bonnes pratiques\n4. **Forum** - Échanges entre agences\n5. **E-Learning** - Formations certifiantes\n6. **Veille stratégique** - Actualités du secteur\n\nN'hésitez pas à explorer les menus !"
      };

      let response = "Je suis là pour vous aider ! Pourriez-vous préciser votre question sur les projets FSU, les statistiques, les réglementations ou l'utilisation de la plateforme ?";
      
      const lowerText = text.toLowerCase();
      if (lowerText.includes("statistique") || lowerText.includes("stats") || lowerText.includes("chiffre")) {
        response = responses["statistiques"];
      } else if (lowerText.includes("réglement") || lowerText.includes("loi") || lowerText.includes("texte")) {
        response = responses["réglementations"];
      } else if (lowerText.includes("projet") || lowerText.includes("région") || lowerText.includes("cedeao") || lowerText.includes("sadc")) {
        response = responses["projets"];
      } else if (lowerText.includes("plateforme") || lowerText.includes("udc") || lowerText.includes("comment") || lowerText.includes("aide")) {
        response = responses["plateforme"];
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickAction = (action: QuickAction) => {
    handleSend(action.prompt);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label="Ouvrir l'assistant SUTA"
            >
              <Bot className="h-6 w-6" />
            </Button>
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              "fixed z-50 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col",
              isExpanded 
                ? "inset-4 md:inset-8" 
                : "bottom-20 right-4 md:bottom-6 md:right-6 w-[calc(100%-2rem)] md:w-96 h-[500px] max-h-[80vh]"
            )}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent p-4 flex items-center justify-between text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bot className="h-8 w-8" />
                  <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">SUTA Assistant</h3>
                  <p className="text-xs opacity-90">IA Multilingue FSU</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Language Selector */}
                <div className="flex gap-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLang(lang.code)}
                      className={cn(
                        "text-lg hover:scale-110 transition-transform",
                        selectedLang === lang.code ? "opacity-100" : "opacity-50"
                      )}
                      title={lang.label}
                    >
                      {lang.flag}
                    </button>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-primary-foreground hover:bg-white/20"
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-3",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-muted rounded-tl-sm"
                      )}
                    >
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2 mb-2">
                          <Bot className="h-4 w-4 text-primary" />
                          <span className="text-xs font-medium text-primary">SUTA</span>
                        </div>
                      )}
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </div>
                      <div className="text-[10px] opacity-60 mt-1 text-right">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-primary animate-pulse" />
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-muted-foreground mb-2">Actions rapides :</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action)}
                      className="text-xs gap-1"
                    >
                      <action.icon className="h-3 w-3" />
                      {selectedLang === "en" ? action.labelEn : action.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border bg-card">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={selectedLang === "en" ? "Type your message..." : "Tapez votre message..."}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                SUTA utilise l'IA pour vous assister. Vérifiez les informations importantes.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
