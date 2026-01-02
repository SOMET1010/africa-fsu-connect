import { useNavigate } from "react-router-dom";
import { Country } from "@/services/countriesService";
import { 
  getCountryActivity, 
  getActivityColor, 
  getStatusLabel,
  MapMode 
} from "./activityData";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  FolderOpen, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  ChevronRight 
} from "lucide-react";

interface CountrySheetProps {
  country: Country | null;
  onClose: () => void;
  mode: MapMode;
}

const getCountryFlag = (code: string): string => {
  if (!code || code.length !== 2) return "🌍";
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const CountrySheet = ({ country, onClose, mode }: CountrySheetProps) => {
  const navigate = useNavigate();
  
  if (!country) return null;
  
  const activity = getCountryActivity(country.code);
  const flag = getCountryFlag(country.code);
  const statusColor = getActivityColor(activity.level);

  const stats = [
    { 
      label: 'Contributions', 
      value: activity.contributions, 
      icon: FileText,
      highlight: mode === 'members' 
    },
    { 
      label: 'Projets', 
      value: activity.projects, 
      icon: FolderOpen,
      highlight: mode === 'projects' 
    },
    { 
      label: 'Ressources', 
      value: activity.resources, 
      icon: FileText,
      highlight: false 
    },
  ];

  return (
    <Sheet open={!!country} onOpenChange={() => onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-start gap-4">
            <span className="text-5xl">{flag}</span>
            <div className="flex-1">
              <SheetTitle className="text-xl">{country.name_fr}</SheetTitle>
              <SheetDescription className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="outline" 
                  className="font-medium"
                  style={{ 
                    borderColor: statusColor, 
                    color: statusColor,
                    backgroundColor: `${statusColor}10` 
                  }}
                >
                  {getStatusLabel(activity.status)}
                </Badge>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground text-sm flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activity.lastActivity}
                </span>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 my-6">
          {stats.map((stat) => (
            <div 
              key={stat.label}
              className={`text-center p-3 rounded-xl border transition-colors ${
                stat.highlight 
                  ? 'bg-primary/5 border-primary/20' 
                  : 'bg-muted/50 border-transparent'
              }`}
            >
              <stat.icon className={`h-4 w-4 mx-auto mb-1 ${
                stat.highlight ? 'text-primary' : 'text-muted-foreground'
              }`} />
              <p className={`text-2xl font-bold ${
                stat.highlight ? 'text-primary' : 'text-foreground'
              }`}>
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Trend Score (for trends mode) */}
        {mode === 'trends' && (
          <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Score de dynamique
              </span>
              <span className="text-2xl font-bold text-primary">{activity.trendScore}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${activity.trendScore}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {activity.trendScore >= 70 
                ? 'En forte progression' 
                : activity.trendScore >= 40 
                  ? 'Progression stable' 
                  : 'En développement'}
            </p>
          </div>
        )}

        {/* Recent Actions */}
        <div className="mb-6">
          <h4 className="font-semibold text-sm mb-3 text-foreground">Dernières actions</h4>
          <ul className="space-y-2">
            {activity.recentActions.map((action, index) => (
              <li 
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div 
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: statusColor }}
                />
                <span className="text-sm text-foreground">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Country Info */}
        {(country.capital_city || country.region) && (
          <div className="mb-6 p-4 rounded-xl bg-muted/30">
            <h4 className="font-semibold text-sm mb-2 text-foreground">Informations</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              {country.capital_city && (
                <p>Capitale : <span className="text-foreground">{country.capital_city}</span></p>
              )}
              {country.region && (
                <p>Région : <span className="text-foreground">{country.region}</span></p>
              )}
            </div>
          </div>
        )}

        <SheetFooter className="flex-col sm:flex-row gap-2 mt-6">
          <Button 
            onClick={() => navigate(`/country/${country.code}`)}
            className="w-full sm:w-auto gap-2"
          >
            Voir fiche pays
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline"
            className="w-full sm:w-auto gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Contacter
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
