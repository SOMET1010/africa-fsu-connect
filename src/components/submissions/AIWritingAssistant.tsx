import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wand2, CheckCircle, XCircle, Lightbulb, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface AIWritingAssistantProps {
  content: string;
  onContentUpdate: (content: string) => void;
  type: 'project' | 'position' | 'regulation' | 'funding';
  context?: {
    title?: string;
    description?: string;
    [key: string]: any;
  };
}

interface AIResponse {
  suggestion: string;
}

export const AIWritingAssistant: React.FC<AIWritingAssistantProps> = ({
  content,
  onContentUpdate,
  type,
  context = {},
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>('');
  const { toast } = useToast();

  const callAIAssistant = async (action: string, targetContent?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-writing-assistant', {
        body: {
          action,
          content: targetContent || content,
          type,
          context,
        },
      });

      if (error) throw error;

      const response = data as AIResponse;
      return response.suggestion;
    } catch (error) {
      logger.error('AI Assistant error:', error);
      toast({
        title: "Erreur IA",
        description: "Impossible de contacter l'assistant IA",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleImprove = async () => {
    if (!content.trim()) {
      toast({
        title: "Contenu requis",
        description: "Ajoutez du contenu à améliorer",
        variant: "destructive",
      });
      return;
    }

    const improved = await callAIAssistant('improve');
    if (improved) {
      setSelectedSuggestion(improved);
      setSuggestions(prev => [improved, ...prev.slice(0, 2)]);
    }
  };

  const handleComplete = async () => {
    const completed = await callAIAssistant('complete');
    if (completed) {
      setSelectedSuggestion(completed);
      setSuggestions(prev => [completed, ...prev.slice(0, 2)]);
    }
  };

  const handleSuggest = async () => {
    const suggestion = await callAIAssistant('suggest');
    if (suggestion) {
      setSelectedSuggestion(suggestion);
      setSuggestions(prev => [suggestion, ...prev.slice(0, 2)]);
    }
  };

  const handleValidate = async () => {
    if (!content.trim()) {
      toast({
        title: "Contenu requis",
        description: "Ajoutez du contenu à valider",
        variant: "destructive",
      });
      return;
    }

    const validation = await callAIAssistant('validate');
    if (validation) {
      setSelectedSuggestion(validation);
      setSuggestions(prev => [validation, ...prev.slice(0, 2)]);
    }
  };

  const applySuggestion = (suggestion: string) => {
    onContentUpdate(suggestion);
    setSelectedSuggestion('');
    toast({
      title: "Suggestion appliquée",
      description: "Le contenu a été mis à jour",
    });
  };

  const dismissSuggestion = () => {
    setSelectedSuggestion('');
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-muted/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          Assistant IA d'Écriture
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleImprove}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Wand2 className="h-3 w-3 mr-1" />}
            Améliorer
          </Button>
          
          <Button
            onClick={handleComplete}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Lightbulb className="h-3 w-3 mr-1" />}
            Compléter
          </Button>
          
          <Button
            onClick={handleSuggest}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Sparkles className="h-3 w-3 mr-1" />}
            Suggérer
          </Button>
          
          <Button
            onClick={handleValidate}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <CheckCircle className="h-3 w-3 mr-1" />}
            Valider
          </Button>
        </div>

        {/* Current Suggestion */}
        {selectedSuggestion && (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                Suggestion IA
              </Badge>
              <div className="flex gap-1">
                <Button
                  onClick={() => applySuggestion(selectedSuggestion)}
                  size="sm"
                  variant="default"
                  className="h-7 px-2 text-xs"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Appliquer
                </Button>
                <Button
                  onClick={dismissSuggestion}
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs"
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  Ignorer
                </Button>
              </div>
            </div>
            <Textarea
              value={selectedSuggestion}
              onChange={(e) => setSelectedSuggestion(e.target.value)}
              className="min-h-[100px] text-sm"
              placeholder="Suggestion de l'IA..."
            />
          </div>
        )}

        {/* Previous Suggestions */}
        {suggestions.length > 0 && !selectedSuggestion && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Suggestions récentes</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <div
                  key={index}
                  className="p-2 bg-muted/30 rounded text-xs cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedSuggestion(suggestion)}
                >
                  {suggestion.substring(0, 120)}
                  {suggestion.length > 120 && '...'}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Conseils :</strong></p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><strong>Améliorer</strong> : Rend le texte plus professionnel</li>
            <li><strong>Compléter</strong> : Aide à terminer vos phrases</li>
            <li><strong>Suggérer</strong> : Propose du contenu selon le contexte</li>
            <li><strong>Valider</strong> : Vérifie la cohérence du document</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};