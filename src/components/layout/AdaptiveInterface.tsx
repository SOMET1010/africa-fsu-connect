import { useState } from "react";
import { ChevronDown, Settings, Eye, EyeOff } from "lucide-react";
import { ModernButton } from "@/components/ui/modern-button";
import { Badge } from "@/components/ui/badge";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

interface AdaptiveInterfaceProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  advancedContent?: React.ReactNode;
  expertContent?: React.ReactNode;
}

export function AdaptiveInterface({ 
  children, 
  title, 
  description, 
  advancedContent, 
  expertContent 
}: AdaptiveInterfaceProps) {
  const { preferences, updatePreferences } = useUserPreferences();
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const currentLevel = preferences?.navigation_level || 'beginner';
  
  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  const isAdvancedUser = currentLevel === 'standard' || currentLevel === 'expert';
  const isExpertUser = currentLevel === 'expert';

  return (
    <div className="space-y-6">
      {/* Header with adaptive controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        
        {(advancedContent || expertContent) && (
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className="text-xs"
            >
              Mode {currentLevel === 'beginner' ? 'Simplifié' : currentLevel === 'standard' ? 'Standard' : 'Expert'}
            </Badge>
            
            {isAdvancedUser && (advancedContent || expertContent) && (
              <ModernButton
                variant="outline"
                size="sm"
                onClick={toggleAdvanced}
              >
                {showAdvanced ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Masquer
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Plus d'options
                  </>
                )}
              </ModernButton>
            )}
          </div>
        )}
      </div>

      {/* Main content - always visible */}
      <div className="space-y-6">
        {children}
      </div>

      {/* Advanced content - shown based on user level and toggle */}
      {showAdvanced && isAdvancedUser && advancedContent && (
        <div className="space-y-6 border-t border-border/50 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Options avancées</h3>
          </div>
          {advancedContent}
        </div>
      )}

      {/* Expert content - only for expert users */}
      {showAdvanced && isExpertUser && expertContent && (
        <div className="space-y-6 border-t border-border/50 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Fonctionnalités expert</h3>
          </div>
          {expertContent}
        </div>
      )}
    </div>
  );
}