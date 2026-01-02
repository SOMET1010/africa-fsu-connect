import { X, ExternalLink, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Country } from "@/services/countriesService";
import { getCountryActivity, getActivityColor, getActivityLabel, ACTIVITY_LEVELS } from "./activityData";

interface CountryDetailPanelProps {
  country: Country | null;
  onClose: () => void;
}

const getCountryFlag = (code: string): string => {
  if (!code || code.length !== 2) return "🌍";
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const CountryDetailPanel = ({ country, onClose }: CountryDetailPanelProps) => {
  const navigate = useNavigate();
  
  if (!country) return null;
  
  const activity = getCountryActivity(country.code);
  const activityColor = getActivityColor(activity.level);
  const activityLabel = getActivityLabel(activity.level);
  
  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border shadow-2xl z-50 animate-slide-in-right overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-6 z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{getCountryFlag(country.code)}</span>
              <div>
                <h2 className="text-2xl font-bold">{country.name_fr}</h2>
                <p className="text-muted-foreground">{country.region || "Afrique"}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Activity Status */}
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: `${activityColor}15` }}>
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full animate-pulse" 
                style={{ backgroundColor: activityColor }}
              />
              <span className="font-medium" style={{ color: activityColor }}>
                {activityLabel}
              </span>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-1">
              {activity.contributions} contributions
            </Badge>
          </div>
          
          {/* Recent Actions */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Actions récentes
            </h3>
            <div className="space-y-3">
              {activity.recentActions.map((action, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm">{action}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/30 text-center">
              <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{activity.contributions}</p>
              <p className="text-xs text-muted-foreground">Contributions</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 text-center">
              <div 
                className="w-6 h-6 rounded-full mx-auto mb-2" 
                style={{ backgroundColor: activityColor }}
              />
              <p className="text-2xl font-bold">{activityLabel}</p>
              <p className="text-xs text-muted-foreground">Niveau d'activité</p>
            </div>
          </div>
          
          {/* CTA */}
          <Button 
            className="w-full group"
            size="lg"
            onClick={() => navigate(`/country/${country.code.toLowerCase()}`)}
          >
            Voir la fiche pays complète
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        
        {/* Activity Level Legend */}
        <div className="border-t border-border p-6 bg-muted/20">
          <h4 className="text-sm font-medium mb-3 text-muted-foreground">Niveaux d'activité</h4>
          <div className="space-y-2">
            {Object.entries(ACTIVITY_LEVELS).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-muted-foreground">
                  {config.label} ({`>${config.threshold} contributions`})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
