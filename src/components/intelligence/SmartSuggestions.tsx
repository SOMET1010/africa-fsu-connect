import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, X, ChevronRight, Brain, Zap, Target, Users } from 'lucide-react';
import { useContextualIntelligence, ContextualSuggestion } from '@/hooks/useContextualIntelligence';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SmartSuggestionsProps {
  className?: string;
  maxSuggestions?: number;
  compact?: boolean;
}

export const SmartSuggestions = ({ 
  className, 
  maxSuggestions = 3, 
  compact = false 
}: SmartSuggestionsProps) => {
  const { suggestions } = useContextualIntelligence();
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);
  const navigate = useNavigate();

  const visibleSuggestions = suggestions
    .filter(s => !dismissedSuggestions.includes(s.id))
    .slice(0, maxSuggestions);

  const handleSuggestionClick = (suggestion: ContextualSuggestion) => {
    if (suggestion.actionUrl) {
      navigate(suggestion.actionUrl);
    }
  };

  const handleDismiss = (suggestionId: string) => {
    setDismissedSuggestions(prev => [...prev, suggestionId]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'administration': return Brain;
      case 'engagement': return Users;
      case 'events': return Target;
      case 'workflow': return Zap;
      default: return Lightbulb;
    }
  };

  if (visibleSuggestions.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className={cn("space-y-2", className)}>
        {visibleSuggestions.map((suggestion) => {
          const Icon = getCategoryIcon(suggestion.category);
          return (
            <div
              key={suggestion.id}
              className="flex items-center justify-between p-3 bg-accent/20 rounded-lg border border-accent/30 hover:bg-accent/30 transition-colors cursor-pointer group"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("h-4 w-4", getPriorityColor(suggestion.priority))} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{suggestion.title}</p>
                  <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">
                  {suggestion.priority}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDismiss(suggestion.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Suggestions intelligentes
        </CardTitle>
        <CardDescription>
          Recommandations personnalisées basées sur votre activité
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {visibleSuggestions.map((suggestion) => {
          const Icon = getCategoryIcon(suggestion.category);
          return (
            <div
              key={suggestion.id}
              className="group relative flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-all cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className={cn("mt-0.5", getPriorityColor(suggestion.priority))}>
                <Icon className="h-4 w-4" />
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{suggestion.title}</h4>
                  <div className="flex items-center gap-1">
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getPriorityColor(suggestion.priority))}
                    >
                      {suggestion.priority}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss(suggestion.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {suggestion.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {suggestion.category}
                  </Badge>
                  <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
        
        {suggestions.length > maxSuggestions && (
          <div className="text-center pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              {suggestions.length - maxSuggestions} suggestion(s) supplémentaire(s)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};